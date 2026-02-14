import React, { useState, useEffect, useRef } from "react";
import "./location.css";
import axios from "axios";

const LocationOption = ({ onServiceChange }) => {
  const [input, setInput] = useState("");
  const debounceRef = useRef(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableService, setAvailableService] = useState([]);
  const [serviceAvailable, setServiceAvailable] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  const ServiceLocation = async () => {
    try {
      const res = await axios.get('https://api.ssdipl.com/api/pincode/get-all-pin-codes');
      console.log("API Data:", res.data);
      setAvailableService(res.data.pinCodes || []);
      setLoading(false);
    } catch (error) {
      console.log(error, "Server Error");
      setLoading(false);
    }
  };

  useEffect(() => {
    ServiceLocation();
  }, []);

  // Function to check if service is available
  const checkServiceAvailability = (searchText) => {
    if (!searchText || searchText.length < 2) {
      setServiceAvailable(false);
      setSearchMessage("");
      // Send false to parent
      if (onServiceChange) {
        onServiceChange(false);
      }
      return;
    }

    const searchLower = searchText.toLowerCase();
    
    // Check if any location matches ALL conditions:
    const isAvailable = availableService.some(item => 
      item.deleveryStatus === true && 
      item.isActive === true && 
      (
        item.pinCode?.toString().toLowerCase() === searchLower ||
        item.area?.toLowerCase().includes(searchLower) ||
        item.stateName?.toLowerCase().includes(searchLower)
      )
    );

    setServiceAvailable(isAvailable);
    
    if (isAvailable) {
      setSearchMessage("✓ Services Available in Your Area");
    } else if (searchText.length > 2) {
      setSearchMessage("✗ Services Not Available in Your Area");
    } else {
      setSearchMessage("");
    }
    
    // Send the availability status to parent component
    if (onServiceChange) {
      onServiceChange(isAvailable);
    }
  };

  // Debounce Logic
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      checkServiceAvailability(input);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [input]);

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  if (loading) {
    return <div className="location-wrapper">Loading locations...</div>;
  }

  return (
    <div className="location-wrapper">
      <div className="location-header">
        <span>Select Area / Location</span>
        <span className="use-location" onClick={() => setShow(!show)}>
          Use My Location
        </span>
      </div>

      {show && (
        <div>
          <div className="note-box">
            Note: You have blocked tracking location.
          </div>

          <div className="search-box">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter your pincode, area, or state..."
              className="search-input"
            />
          </div>

          {/* Service Availability Message */}
          {searchMessage && (
            <div className={`service-message ${serviceAvailable ? 'available' : 'unavailable'}`}>
              {searchMessage}
            </div>
          )}

          <div className="saved-address">
            Saved Addresses ⌄
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationOption;