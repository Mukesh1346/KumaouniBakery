import React, { useState } from "react";
import "./EggLess.css";
import egggless from "../../images/EgglessIMG.jpeg";

const EggLess = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen(!isOpen);
    // You can later add a popup modal or chat box here
    console.log("Icon clicked – you can open a modal");
  };

  return (
    <>
      {/* FLOATING EGG‑LESS ICON */}
      <div className="eg-floating-icon" onClick={togglePopup}>
        <img src={egggless} alt="Eggless" />
      </div>

      {/* Optional popup can be added here */}
      {/* {isOpen && <div className="popup">Your content</div>} */}
    </>
  );
};

export default EggLess;