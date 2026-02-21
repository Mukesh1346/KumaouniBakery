import React, { useState, useEffect, useRef, useMemo } from "react";
import "./location.css";
import axios from "axios";
import Swal from "sweetalert2";

const LocationOption = ({ onServiceChange }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [availableService, setAvailableService] = useState([]);
  const [serviceAvailable, setServiceAvailable] = useState(false);
  const [searchMessage, setSearchMessage] = useState("");

  const debounceRef = useRef(null);

  /* ================= GET STORED LOCATION ================= */

  const storedLocation = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("CakeLocation"));
    } catch {
      return null;
    }
  }, []);

  /* ================= FETCH SERVICE AREAS ================= */

  const ServiceLocation = async () => {
    try {
      const res = await axios.get(
        "https://api.ssdipl.com/api/pincode/get-all-pin-codes"
      );

      setAvailableService(res.data.pinCodes || []);
    } catch (error) {
      console.error("Service fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ServiceLocation();
  }, []);

  /* ================= AUTO FILL FROM LOCAL ================= */

  useEffect(() => {
    if (!storedLocation?.area || !storedLocation?.pinCode) return;

    const text = `${storedLocation.area} ${storedLocation.pinCode}`;
    setInput(text);
  }, [storedLocation]);

  /* ================= SERVICE CHECK ================= */

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

      return pin === text || area.includes(text) || areaWithPin === text;
    });

    const isAvailable30min = availableService.some((item) => {
      if (!(item.deleveryTime && item.isActive)) return false;

      const pin = item.pinCode?.toString().toLowerCase() || "";
      const area = item.area?.toLowerCase() || "";
      const areaWithPin = `${area} ${pin}`.trim();

      return pin === text || area.includes(text) || areaWithPin === text;
    });

    setServiceAvailable(isAvailable);
    onServiceChange?.(isAvailable);

    // ✅ professional messaging
    if (text.length > 2) {
      if (isAvailable) {
        setSearchMessage(
          isAvailable30min
            ? "🎉 Delivery available! 30-minute express delivery is live in selected areas."
            : "✅ Delivery service is available in your area."
        );
      } else {
        setSearchMessage(
          "❌ Sorry, delivery is currently unavailable in your area."
        );
      }
    }
  };

  /* ================= SINGLE DEBOUNCE (FIXED) ================= */

  useEffect(() => {
    if (!input) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      checkServiceAvailability(input);
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, availableService]); // ✅ important

  /* ================= INPUT HANDLER ================= */

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  /* ================= GEO LOCATION ================= */

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      Swal.fire("Error", "Geolocation not supported.", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const response = await axios.get(
            `https://api.ssdipl.com/api/google-api/reverse-geocode?lat=${latitude}&lon=${longitude}`
          );

          if (response?.data?.status) {
            const detectedLocation = {
              area: response.data.area || "",
              city: response.data.city || "",
              state: response.data.state || "",
              pinCode: response.data.pincode || "",
            };

            const text = `${detectedLocation.area} ${detectedLocation.pinCode}`;

            setInput(text);
            localStorage.setItem(
              "CakeLocation",
              JSON.stringify(detectedLocation)
            );

            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Location detected",
              showConfirmButton: false,
              timer: 1200,
            });
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Failed to detect location.", "error");
        }
      },
      () => {
        Swal.fire("Error", "Location permission denied.", "error");
      }
    );
  };

  /* ================= LOADING ================= */

  if (loading) {
    return <div className="location-wrapper">Loading locations...</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="location-wrapper">
      <div className="location-header">
        <span>Select Area / Location</span>
        <span className="use-location" onClick={handleLocationClick}>
          Use My Location
        </span>
      </div>

      {searchMessage && (
        <div className="note-box">Note: {searchMessage}</div>
      )}

      <div className="search-box">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter your pincode or area..."
          className="search-input"
        />
      </div>
    </div>
  );
};

export default LocationOption;
