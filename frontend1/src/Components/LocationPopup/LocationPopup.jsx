import "./locationPopup.css";

const LocationPopup = ({ onClose }) => {
  return (
    <div className="location-overlay" onClick={onClose}>
      <div className="location-popup" onClick={(e) => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="popup-header">
          <h5>Enter delivery location</h5>
          <p>30-min delivery now live in some areas</p>
          <span className="close-btn" onClick={onClose}>×</span>
        </div>

        {/* INPUT */}
      <div className="location-input">
  <div className="country-box">
    <select className="country-select">
      <option className="">🇮🇳 India</option>
      <option className="">🇳🇵 Nepal</option>
      <option className="">🇧🇹 Bhutan</option>
      <option className="">🇱🇰 Sri Lanka</option>
    </select>
  </div>

  <input type="text" placeholder="Enter Area / location" />
</div>


        {/* CURRENT LOCATION */}
        <div className="current-location">
          <i className="bi bi-crosshair"></i>
          <span>Use Current Location</span>
        </div>

      </div>
    </div>
  );
};

export default LocationPopup;
