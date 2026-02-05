import React, { useState, useEffect } from "react";
import "./reel.css";
import img1 from '../../images/pic/redVelvet.jpg'
import { Link } from "react-router-dom";
export default function ReelSection() {

 const reels = [
  {
    id: 1,
    video: "/video1.mp4",
    productImg: img1,
    title: "EZ Masala J – 125 g",
    price: "₹145",
  },
  {
    id: 2,
   video: "/video2.mp4",
    productImg: img1,
    title: "EZ Masala J – 250 g",
    price: "₹295",
  },
  {
    id: 3,
   video: "/video3.mp4",
    productImg: img1,
    title: "EZ Masala M – 500 g",
    price: "₹495",
  },
  {
    id: 4,
   video: "/video4.mp4",
    productImg: img1,
    title: "EZ Masala M – 500 g",
    price: "₹495",
  },

];




  const [activeReel, setActiveReel] = useState(null);

  // lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = activeReel ? "hidden" : "auto";
  }, [activeReel]);

  return (
    <>
      {/* REEL LIST */}
    <div className="container">
          <section className="reel-section">
       {reels.map((reel) => (
  <div
    key={reel.id}
    className="reel-card"
    onClick={() => setActiveReel(reel)}
  >
    <video
      src={reel.video}
      muted
      loop
      preload="metadata"
      onMouseEnter={(e) => e.target.play()}
      onMouseLeave={(e) => {
        e.target.pause();
        e.target.currentTime = 0;
      }}
    />

    <div className="reel-product">
      <img src={reel.productImg} alt="" />
      <div>
        <p>{reel.title}</p>
        <span>{reel.price}</span>
      </div>
    </div>
  </div>
))}

      </section>
    </div>

      {/* MODAL */}
      {activeReel && (
        <div className="reel-overlay" onClick={() => setActiveReel(null)}>
          <div
            className="reel-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={activeReel.video}
              autoPlay
              controls
            />
           <Link to="/all-products">

           
            <div className="modal-product">
              <img src={activeReel.productImg} alt="" />
              <div>
                <h5 className="reeltitle">{activeReel.title}</h5>
                <span>{activeReel.price}</span>
              </div>
            </div></Link>
   ="/pages"       </div>
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
