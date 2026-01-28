import { useState } from "react";
import "./locationPopup.css";

const LocationPopup = ({
  onClose,
  countries = [],
  selectedCountry,
  setSelectedCountry,
}) => {
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);

  return (
    <div className="location-overlay" onClick={onClose}>
      <div
        className="location-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="popup-header">
          <h5>Enter delivery location</h5>
          <p>30-min delivery now live in some areas</p>
          <span className="close-btn" onClick={onClose}>
            ×
          </span>
        </div>

        {/* INPUT */}
        <div className="location-input">
          <div className="country-box">
            <select
              className="country-select"
              value={selectedCountry?.code || ""}
              onChange={(e) => {
                const country = countries.find(
                  (c) => c.code === e.target.value
                );
                setSelectedCountry(country);
                setIsCurrentLocation(false); // UI only
              }}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Enter Area / location"
            onFocus={() => setIsCurrentLocation(false)}
          />
        </div>

        {/* CURRENT LOCATION */}
        <div
          className={`current-location ${
            isCurrentLocation ? "active" : ""
          }`}
          onClick={() => setIsCurrentLocation(true)}
        >
          <i className="bi bi-crosshair"></i>
          <span>Use Current Location</span>
        </div>
      </div>
    </div>
  );
};

export default LocationPopup;
