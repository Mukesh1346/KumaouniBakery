import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const AddCountdown = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    endTime: "",
    subCategoryId: "",
  });

  const [subcategories, setSubcategories] = useState([]);
  const navigate = useNavigate();

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= FETCH SUBCATEGORIES ================= */

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const res = await axios.get(
          "https://api.ssdipl.com/api/get-subcategory"
        );

        setSubcategories(res?.data?.data || []);
      } catch (error) {
        toast.error("Error fetching subcategories");
        console.error(error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchSubcategories();
  }, []);

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subCategoryId) {
      toast.error("Please select subcategory");
      return;
    }

    if (!formData.endTime) {
      toast.error("Please select countdown end time");
      return;
    }

    setIsLoading(true);

    try {
      const body = {
        title: formData.title?.trim(),
        endTime: new Date(formData.endTime).toISOString(),
        subCategoryId: formData.subCategoryId,
        isActive,
      };

      const res = await axios.post(
        "https://api.ssdipl.com/api/countdown/create-countdown",
        body
      );

      if (res.data?.success) {
        toast.success("Countdown created successfully");

        setTimeout(() => {
          navigate("/all-countdown");
        }, 800);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error creating countdown"
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= LOADING ================= */

  if (pageLoading) {
    return <p style={{ padding: 20 }}>Loading...</p>;
  }

  /* ================= UI ================= */

  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>Manage Countdown</h4>
        </div>

        <div className="links">
          <Link to="/all-countdown" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* CATEGORY */}
          <div className="col-md-6">
            <label className="form-label">Subcategory</label>
            <select
              name="subCategoryId"
              className="form-control"
              value={formData.subCategoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select subcategory</option>
              {subcategories?.map((sub) => (
                <option key={sub?._id} value={sub?._id}>
                  {sub?.subcategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div className="col-md-6">
            <label className="form-label">Countdown Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Order within"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {/* END TIME */}
          <div className="col-md-6">
            <label className="form-label">Countdown End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              className="form-control"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* ACTIVE */}
          <div className="col-12">
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: 18, height: 18 }}
              />
              <span style={{ fontWeight: 600 }}>
                {isActive ? "Show Countdown" : "Hide Countdown"}
              </span>
            </label>
          </div>

          {/* SUBMIT */}
          <div className="col-md-12 mt-3">
            <button type="submit" className="bt cursor-pointer" disabled={isLoading}>
              {isLoading ? "Saving..." : "Create Countdown"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddCountdown;
