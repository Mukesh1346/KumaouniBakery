// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import "./homebanner.css";
// import pic1 from "../../images/1583 by 426 banner/Banner1.jpg";
// import pic2 from "../../images/1583 by 426 banner/Banner2.jpg"; // optional
// import axios from "axios";

// const HomeBannerSlider = () => {
//   const [data, setData] = useState([]);
//   // ✅ API call
//   const fetchBannerData = async () => {
//     try {
//       const res = await axios.get("https://api.cakenpetals.com/api/get-banners");
//       console.log("SSSSS::=>", res)
//       if (res.status === 200) {
//         setData(res?.data?.data?.filter((item) => item?.bannerStatus === 'True'));
//       }
//     } catch (error) {
//       console.error("Error fetching banner data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBannerData();
//   }, [])
//   // ✅ Static banner data


//   const settings = {
//     dots: false,
//     fade: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,          // ✅ auto change ON
//     autoplaySpeed: 3000,     // ✅ change every 3 sec
//     pauseOnHover: false,
//     arrows: false,
//   };

//   // console.log("AAAAAAAAAAAAA===>", data)
//   return (
//     <div className="container-fluid p-0">
//       <div className="slider-container">
//         <Slider {...settings}>
//           {data.map((banner) => (
//             <div key={banner._id}>
//               <img
//                 className="banner-Image"
//                 src={`https://api.cakenpetals.com/${banner?.bannerImage}`}
//                 alt={banner.bannerName}
//               />
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// };

// export default HomeBannerSlider;

import React, { useEffect, useState, useCallback } from "react";
import Slider from "react-slick";
import axios from "axios";
import "./homebanner.css";

const BASE_URL = "https://api.cakenpetals.com";

// Skeleton loader shown while images are loading
const BannerSkeleton = () => (
  <div className="banner-skeleton">
    <div className="banner-skeleton-shimmer" />
  </div>
);

// Single slide with lazy/eager loading and onLoad fade-in
const BannerSlide = ({ banner, priority }) => {
  const [loaded, setLoaded] = useState(false);
  const imgSrc = `${BASE_URL}/${banner.bannerImage}`;

  return (
    <div className="banner-slide">
      {!loaded && <BannerSkeleton />}
      <img
        className={`banner-Image ${loaded ? "banner-Image--visible" : ""}`}
        src={imgSrc}
        alt={banner.bannerName}
        loading={priority ? "eager" : "lazy"}   // first slide loads eagerly
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}           // hide skeleton even on error
      />
    </div>
  );
};

const HomeBannerSlider = () => {
  const [banners, setBanners]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(false);

  // Preload first image so it's ready before slider mounts
  const preloadFirstImage = useCallback((src) => {
    const img   = new Image();
    img.src     = src;
    img.fetchPriority = "high";
  }, []);

  const fetchBannerData = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const res = await axios.get(`${BASE_URL}/api/get-banners`);
      if (res.status === 200) {
        const active = (res.data?.data || []).filter(
          (item) => item?.bannerStatus === "True"
        );
        setBanners(active);

        // Kick off preload for the first banner immediately
        if (active.length > 0) {
          preloadFirstImage(`${BASE_URL}/${active[0].bannerImage}`);
        }
      }
    } catch (err) {
      console.error("Error fetching banner data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [preloadFirstImage]);

  useEffect(() => {
    fetchBannerData();
  }, [fetchBannerData]);

  const settings = {
    dots:           false,
    fade:           true,
    infinite:       true,
    speed:          600,
    slidesToShow:   1,
    slidesToScroll: 1,
    autoplay:       true,
    autoplaySpeed:  3500,
    pauseOnHover:   false,
    arrows:         false,
    lazyLoad:       "progressive", // react-slick progressive loading
    cssEase:        "ease-in-out",
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container-fluid p-0">
        <BannerSkeleton />
      </div>
    );
  }

  // ── Error / empty state ────────────────────────────────────────────────────
  if (error || banners.length === 0) {
    return null; // silently hide banner section if no data
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="container-fluid p-0">
      <div className="slider-container">
        <Slider {...settings}>
          {banners.map((banner, index) => (
            <BannerSlide
              key={banner._id}
              banner={banner}
              priority={index === 0} // first slide gets eager + high fetchPriority
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HomeBannerSlider;