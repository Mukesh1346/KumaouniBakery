import React, { useState, useEffect } from "react";
import "./reel.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom"
const BASE_URL = "http://localhost:7000/";

export default function ReelSection() {
  const navigate = useNavigate();
  const [activeReel, setActiveReel] = useState(null);
  const [reels, setReels] = useState([]);

  useEffect(() => {
    document.body.style.overflow = activeReel ? "hidden" : "auto";
  }, [activeReel]);

  const fetchReels = async () => {
    try {
      const response = await axios.get("http://localhost:7000/api/reel/get-reels");
      setReels(response?.data?.data || []);
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
        <section className="reel-section">
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
                  <p>{reel?.productId?.productName}</p>
                  <span>{reel?.productId?.Variant[0]?.finalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </section>
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
                <h5 className="reeltitle">{activeReel?.productId?.productName}</h5>
                <div className="d-flex gap-3">
                  <span>{activeReel?.productId?.Variant[0]?.finalPrice}</span>
                  {/* <Link to="/all-products"> */}
                  <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/product-details/${activeReel?.productId?.productName}`, { state: { id: activeReel?.productId?._id, status: "single-product" } })}>
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
