import React, { useState, useEffect, useRef } from "react";
import { LoadScript } from "@react-google-maps/api";
import "./location.css";

const libraries = ["places"];

const LocationOption = () => {
  const [input, setInput] = useState("");
  const [predictions, setPredictions] = useState([]);
  const serviceRef = useRef(null);
  const debounceRef = useRef(null);
  const [show ,setShow] = useState(true)

  // Debounce Logic
  useEffect(() => {
    if (!serviceRef.current) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (input.length > 2) {
        serviceRef.current.getPlacePredictions(
          {
            input: input,
            componentRestrictions: { country: "in" },
          },
          (results) => {
            setPredictions(results || []);
          }
        );
      } else {
        setPredictions([]);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [input]);

  return (
    <LoadScript
      googleMapsApiKey="YOUR_GOOGLE_API_KEY"
      libraries={libraries}
      onLoad={() => {
        serviceRef.current =
          new window.google.maps.places.AutocompleteService();
      }}
    >
      <div className="location-wrapper">
        <div className="location-header">
          <span>Select Area / Location</span>
          <span className="use-location" onClick={()=> setShow(!show)}>Use My Location</span>
        </div>
{
    show && <div>
    
        <div className="note-box">
          Note: You have blocked tracking location.
        </div>

        <div className="search-box">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for area"
          />
        </div>

        {predictions.length > 0 && (
          <div className="suggestion-box">
            {predictions.map((item) => (
              <div
                key={item.place_id}
                className="suggestion-item"
                onClick={() => {
                  setInput(item.description);
                  setPredictions([]);
                }}
              >
                <div className="title">
                  {item.structured_formatting.main_text}
                </div>
                <div className="subtitle">
                  {item.structured_formatting.secondary_text}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="saved-address">
          Saved Addresses ⌄
        </div>
</div>
}
      </div>
    </LoadScript>
  );
};

export default LocationOption;
