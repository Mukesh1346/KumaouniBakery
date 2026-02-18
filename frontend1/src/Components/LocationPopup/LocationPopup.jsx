import { useState } from "react";
import "./locationPopup.css";
import axios from "axios";
import { useEffect } from "react";
import { useRef } from "react";

const LocationPopup = ({
  onClose, countries = [], selectedCountry, setSelectedCountry,
}) => {
  const [isCurrentLocation, setIsCurrentLocation] = useState(false);
  const [location, setLocation] = useState(null);
  const debounceRef = useRef(null);
  const [availableService, setAvailableService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [searchMessage, setSearchMessage] = useState("");




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

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      checkServiceAvailability(input);
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [input]);

  const checkServiceAvailability = (searchText) => {
    const text = searchText.trim().toLowerCase();

    if (!text || text.length < 2 || !availableService.length) {
      setSearchMessage("");
      return;
    }

    const isAvailable = availableService.some((item) => {
      if (!(item.deleveryStatus && item.isActive)) return false;

      const pin = item.pinCode?.toString().toLowerCase() || "";
      const area = item.area?.toLowerCase() || "";
      const areaWithPin = `${area} ${pin}`.trim();

      return (pin === text || area.includes(text) || areaWithPin === text);
    });

    if (text.length > 2) {
      setSearchMessage(isAvailable ? "30-min delivery now live in some areas" : "");
    }
  };


  return (
    <div className="location-overlay" onClick={onClose}>
      <div
        className="location-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="popup-header">
          <h5>Enter delivery location</h5>
          {searchMessage && <p>{searchMessage}</p>}
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
            value={input}
            onFocus={() => setIsCurrentLocation(false)}
          />
        </div>

        {/* CURRENT LOCATION */}
        <div
          className={`current-location ${isCurrentLocation ? "active" : ""
            }`}
          // onClick={() => setIsCurrentLocation(true)}
          onClick={() => handleLocationClick()}
        >
          <i className="bi bi-crosshair"></i>
          <span>Use Current Location</span>
        </div>
      </div>
    </div>
  );
};

export default LocationPopup;
