
import "./reel.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import React, { useState, useEffect, useRef } from "react";
const BASE_URL = "https://api.ssdipl.com/";




export default function ReelSection() {
  const navigate = useNavigate();
  const [activeReel, setActiveReel] = useState(null);
  const [reels, setReels] = useState([]);
  const reelRef = useRef(null);



  const scrollLeft = () => {
    reelRef.current.scrollBy({
      left: -250,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    reelRef.current.scrollBy({
      left: 250,
      behavior: "smooth",
    });
  };





  useEffect(() => {
    document.body.style.overflow = activeReel ? "hidden" : "auto";
  }, [activeReel]);

  const fetchReels = async () => {
    try {
      const response = await axios.get("https://api.ssdipl.com/api/reel/get-reels");
      setReels(response?.data?.data.filter((reel) => reel?.activeOnHome === true) || []);
    } catch (error) {
      console.error("Error fetching reels:", error);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const getVideoUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : BASE_URL + path;
  };
  console.log("activeReel", activeReel)
  return (
    <>
      <div className="container">
        <div className="reel-wrapper">
          {/* <button className="reel-arrow left" onClick={scrollLeft}>
    ❮
  </button> */}

          <section className="reel-section" ref={reelRef}>
            {reels.map((reel) => (
              <div
                key={reel._id}
                className="reel-card"
                onClick={() => setActiveReel(reel)}
              >
                {reel.video && (
                  <video
                    src={getVideoUrl(reel.video)}
                    muted
                    loop
                    preload="metadata"
                    onMouseEnter={(e) => e.target.play().catch(() => { })}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                )}

                <div className="reel-product">
                  <img src={BASE_URL + reel?.productId?.productImage[0]} alt="" />
                  <div>
                    <p>{reel?.productId?.productName?.charAt(0).toUpperCase() + reel?.productId?.productName?.slice(1)}</p>
                    <span>{reel?.productId?.Variant[0]?.finalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* <button className="reel-arrow right" onClick={scrollRight}>
    ❯
  </button> */}
        </div>

      </div>

      {activeReel && (
        <div className="reel-overlay" onClick={() => setActiveReel(null)}>
          <div className="reel-modal" onClick={(e) => e.stopPropagation()}>
            <video
              src={getVideoUrl(activeReel?.video)}
              autoPlay
              controls
            />

            <div className="modal-product">
              <img src={BASE_URL + activeReel?.productId?.productImage[0]} alt="" />
              <div>
                <h5 className="reeltitle">{activeReel?.productId?.productName.charAt(0).toUpperCase() + activeReel?.productId?.productName?.slice(1)}</h5>
                <div className="d-flex gap-3">
                  <span>{activeReel?.productId?.Variant[0]?.finalPrice}</span>
                  {/* <Link to="/all-products"> */}
                  <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/product-details/${activeReel?.productId?.productName.replace(/\s+/g, "-")}`, { state: { id: activeReel?.productId?._id, status: "single-product" } })}>
                    <button className="BuyBtn">Buy Now</button>
                  </div>
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}










// import React, { useState } from "react";
// import ReelModal from "./ReelModal.jsx";
// import "./reel.css";
// import img1 from '../../images/pic/redVelvet.jpg'

//

// export default function ReelSection() {
//   const [activeReel, setActiveReel] = useState(null);

//   return (
//     <>
//       <section className="reel-section">
//         {reels.map((reel) => (
//           <div
//             key={reel.id}
//             className="reel-card"
//             onClick={() => setActiveReel(reel)}
//           >
//             <video
//               src={reel.video}
//               muted
//               loop
//               preload="metadata"
//               poster="/videos/poster.jpg"
//             />

//             <div className="reel-product">
//               <img src={reel.productImg} alt="" />
//               <div>
//                 <p>{reel.title}</p>
//                 <span>{reel.price}</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </section>

//       {activeReel && (
//         <ReelModal reel={activeReel} onClose={() => setActiveReel(null)} />
//       )}
//     </>
//   );
// }
