import React, { useState, useEffect, useRef } from "react";
import "./location.css";
import axios from "axios";
import Swal from "sweetalert2";

const LocationOption = ({ onServiceChange }) => {
  const [input, setInput] = useState("");
  const debounceRef = useRef(null);
  const [show, setShow] = useState(true);
  const [loading, setLoading] = useState(true);
  const [availableService, setAvailableService] = useState([]);
  const [serviceAvailable, setServiceAvailable] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");
  const [location, setLocation] = useState({});

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
  // const checkServiceAvailability = (searchText) => {
  //   if (!searchText || searchText.length < 2) {
  //     setServiceAvailable(false);
  //     setSearchMessage("");
  //     // Send false to parent
  //     if (onServiceChange) {
  //       onServiceChange(false);
  //     }
  //     return;
  //   }

  //   const searchLower = searchText.toLowerCase();

  //   // Check if any location matches ALL conditions:
  //   const isAvailable = availableService.some(item =>
  //     item.deleveryStatus === true &&
  //     item.isActive === true &&
  //     (
  //       item.pinCode?.toString().toLowerCase() === searchLower ||
  //       item.area?.toLowerCase().includes(searchLower)
  //       // || item.stateName?.toLowerCase().includes(searchLower)
  //     )
  //   );

  //   setServiceAvailable(isAvailable);

  //   if (isAvailable) {
  //     setSearchMessage("Services Available in Your Area");
  //   } else if (searchText.length > 2) {
  //     setSearchMessage("Services Not Available in Your Area");
  //   } else {
  //     setSearchMessage("");
  //   }

  //   // Send the availability status to parent component
  //   if (onServiceChange) {
  //     onServiceChange(isAvailable);
  //   }
  // };

  const checkServiceAvailability = (searchText) => {
    const text = searchText.trim().toLowerCase();

    if (!text || text.length < 2 || !availableService.length) {
      setServiceAvailable(false);
      setSearchMessage("");
      onServiceChange?.(false);
      return;
    }

    const isAvailable = availableService.some((item) => {
      if (!(item.deleveryStatus && item.isActive)) return false;

      const pin = item.pinCode?.toString().toLowerCase() || "";
      const area = item.area?.toLowerCase() || "";
      const areaWithPin = `${area} ${pin}`.trim();

      return (pin === text || area.includes(text) || areaWithPin === text);
    });

    setServiceAvailable(isAvailable);
    onServiceChange?.(isAvailable);

    if (text.length > 2) {
      setSearchMessage(isAvailable ? "Services Available in Your Area" : "Services Not Available in Your Area");
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

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get(`https://api.ssdipl.com/api/google-api/reverse-geocode?lat=${latitude}&lon=${longitude}`);
          console.log("Detected location response:==>", response.data);

          if (response?.data?.status === true) {
            const detectedLocation = {
              area: response?.data?.area || "",
              city: response?.data?.city || "",
              state: response?.data?.state || "",
              pinCode: response?.data?.pincode || "",
            };
            setInput(`${detectedLocation?.area} ${detectedLocation?.pinCode}`);
            setLocation(detectedLocation);
            localStorage.setItem("CakeLocation", JSON.stringify(detectedLocation));
            // setLocalLocation(detectedLocation);
          } else {
            alert("Failed to fetch location data.");
          }
        } catch (error) {
          console.error("Error getting location:", error);
          alert("Something went wrong while detecting your location.");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Permission denied or unable to access your location.");
      }
    );
  };


  if (loading) {
    return <div className="location-wrapper">Loading locations...</div>;
  }

  return (
    <div className="location-wrapper">
      <div className="location-header">
        <span>Select Area / Location</span>
        <span className="use-location"
          onClick={() => handleLocationClick()}
        >
          Use My Location
        </span>
      </div>

      {searchMessage && <div className="note-box">
        {searchMessage ? `Note: ${searchMessage}` : ''}
      </div>}

      {show && (
        <div>
          {/* <div className="note-box">
            Note: You have blocked tracking location.
          </div> */}

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
          {/* {searchMessage && (
            <div className={`service-message ${serviceAvailable ? 'available' : 'unavailable'}`}>
              {searchMessage}
            </div>
          )} */}

          {/* <button
            disabled={!serviceAvailable || !input.trim()}
            onClick={() => {
              if (!input.trim()) return;

              sessionStorage.setItem("Address", input.trim());

              Swal.fire({
                toast: true,
                position: "top-end",
                icon: "success",
                title: "Address saved",
                showConfirmButton: false,
                timer: 1200,
              });
            }}
            style={{
              width: "100%",
              padding: "10px 14px",
              marginTop: "12px",
              borderRadius: "8px",
              border: "none",
              fontWeight: 600,
              transition: "all 0.25s ease",
              background:
                serviceAvailable && input.trim() ? "#ff4d6d" : "#ddd",
              color:
                serviceAvailable && input.trim() ? "#fff" : "#888",
              cursor:
                serviceAvailable && input.trim()
                  ? "pointer"
                  : "not-allowed",
              opacity: serviceAvailable && input.trim() ? 1 : 0.7,
            }}
          >
            💾 Save Address
          </button> */}
        </div>
      )}

    </div>
  );
};

export default LocationOption;