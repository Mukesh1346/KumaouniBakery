import { useState, useMemo, useEffect, useRef } from "react";
import "./locationPopup.css";
import axios from "axios";

const LocationPopup = ({
  onClose,
  countries = [],
  selectedCountry,
  setSelectedCountry,
}) => {
  const debounceRef = useRef(null);

  const [input, setInput] = useState("");
  const [location, setLocation] = useState(null);
  const [availableService, setAvailableService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMessage, setSearchMessage] = useState("");
  const [detecting, setDetecting] = useState(false);

  /* ================= SAFE STORED LOCATION ================= */

  const storedLocation = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("CakeLocation") || "null");
    } catch {
      return null;
    }
  }, []);

  /* ================= FETCH SERVICE AREAS ================= */

  const fetchServiceLocations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://api.ssdipl.com/api/pincode/get-all-pin-codes"
      );
      setAvailableService(res.data?.pinCodes || []);
    } catch (error) {
      console.log("Service fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceLocations();
  }, []);

  /* ================= PREFILL FROM STORAGE ================= */

  useEffect(() => {
    if (!storedLocation?.area || !storedLocation?.pinCode) return;

    setInput(`${storedLocation.area} ${storedLocation.pinCode}`);
    setLocation(storedLocation);
  }, [storedLocation]);

  /* ================= GEO LOCATION ================= */

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.get(
            `https://api.ssdipl.com/api/google-api/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );

          if (res?.data?.status) {
            const detectedLocation = {
              area: res.data.area || "",
              city: res.data.city || "",
              state: res.data.state || "",
              pinCode: res.data.pincode || "",
            };

            const text = `${detectedLocation.area} ${detectedLocation.pinCode}`;

            setInput(text);
            setLocation(detectedLocation);
            localStorage.setItem(
              "CakeLocation",
              JSON.stringify(detectedLocation)
            );
          } else {
            alert("Failed to fetch location data.");
          }
        } catch (error) {
          console.error("Reverse geocode error:", error);
          alert("Something went wrong while detecting your location.");
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setDetecting(false);
        alert("Permission denied or unable to access your location.");
      }
    );
  };

  /* ================= SERVICE CHECK ================= */

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
      const combined = `${area} ${pin}`.trim();

      return pin === text || area.includes(text) || combined === text;
    });

    setSearchMessage(
      text.length > 2 && isAvailable
        ? "⚡ 30-min delivery now live in some areas"
        : ""
    );
  };

  /* ================= DEBOUNCE ================= */

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      checkServiceAvailability(input);
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [input, availableService]);

  /* ================= UI ================= */

  return (
    <div className="location-overlay" onClick={onClose}>
      <div
        className="location-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="popup-header">
          <h5>Enter delivery location</h5>
          {searchMessage && <p className="service-msg">{searchMessage}</p>}
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
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* CURRENT LOCATION */}
        <div
          className={`current-location ${detecting ? "loading" : ""}`}
          onClick={handleLocationClick}
        >
          <i className="bi bi-crosshair"></i>
          <span>
            {detecting ? "Detecting location..." : "Use Current Location"}
          </span>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="location-loading">
            Checking service areas...
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPopup;