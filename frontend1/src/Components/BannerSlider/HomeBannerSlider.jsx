import React from "react";
import Slider from "react-slick";
import "./homebanner.css";
import pic1 from "../../images/1583 by 426 banner/Banner1.jpg";
import pic2 from "../../images/1583 by 426 banner/Banner2.jpg"; // optional

const HomeBannerSlider = () => {

  // ✅ Static banner data
  const data = [
    {
      id: 1,
      bannerName: "Main Banner 1",
      bannerImage: pic1,
    },
    {
      id: 2,
      bannerName: "Main Banner 2",
      bannerImage: pic2,
    },
  ];

  const settings = {
    dots: false,
    fade: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
      autoplay: true,          // ✅ auto change ON
    autoplaySpeed: 3000,     // ✅ change every 3 sec
    pauseOnHover: false, 
    arrows: false,
  };

  return (
    <div className="container-fluid p-0">
      <div className="slider-container">
        <Slider {...settings}>
          {data.map((banner) => (
            <div key={banner.id}>
              <img
                className="banner-Image"
                src={banner.bannerImage}
                alt={banner.bannerName}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default HomeBannerSlider;





// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import "./homebanner.css";
// import axios from "axios";

// const HomeBannerSlider = () => {
//   const [data, setData] = useState([]);

//   // Function to fetch API data
//   const getApiData = async () => {
//     try {
//       // const res = await axios.get("${process.env.REACT_APP_API_URL}/api/get-banners");
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/get-banners`);
//       if (res.status === 200) {
//         setData(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching banner data:", error);
//     }
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     getApiData();
//   }, []);

//   const settings = {
//     dots: false,
//     fade: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     waitForAnimate: false,
//     arrows: false,
//   };

//   return (
//     <div className="container-fluid p-0">
//       <div className="slider-container">
//         <Slider {...settings} style={{ zIndex: -1 }}>
//           {data.map((banner) => (
//             <div key={banner._id}>
//               <img
//                 className="banner-Image"
//                 alt={banner.bannerName}
//                 src={`${process.env.REACT_APP_API_URL}/${banner.bannerImage}`}
//               />
//               {/* <div className="overlay-content start-50 translate-middle text-center text-white">
//                 <div className="overlay">
//                   <div className="bannerContent">
//                     <h1>{banner.bannerName}</h1>
//                     <p className="lead">{banner.bannerName}</p>
//                     <a className="ordernowBtn" href="tel:+919508080807">
//                       ORDER NOW
//                     </a>
//                     <h5>
//                       Or Call <a href="tel:+919508080807">+91 9508080807</a>
//                     </h5>
//                   </div>
//                 </div>
//               </div> */}
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </div>
//   );
// };

// export default HomeBannerSlider;
