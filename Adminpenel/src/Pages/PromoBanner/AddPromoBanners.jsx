import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPromoBanners = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    bannerKey: "",
    image: null,
  });

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bannerKey) {
      toast.error("Please select a banner slot");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload a banner image");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("bannerKey", formData.bannerKey);
      fd.append("image", formData.image);

      await axios.post(
        "https://api.ssdipl.com/api/upload-promo-banner",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success("Promo banner uploaded successfully");
      navigate("/all-promo-banners");
    } catch (error) {
      toast.error("Failed to upload banner");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>Add Promo Banner</h4>
        </div>
        <div className="links">
          <Link to="/all-promo-banners" className="add-new">
            Back
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* BANNER SELECT */}
          <div className="col-md-6">
            <label className="form-label">Select Banner Slot</label>
            <select
              name="bannerKey"
              className="form-control"
              value={formData.bannerKey}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Banner --</option>
              <option value="banner1">Banner 1</option>
              <option value="banner2">Banner 2</option>
              <option value="banner3">Banner 3</option>
            </select>
          </div>

          {/* IMAGE */}
          <div className="col-md-6">
            <label className="form-label">Banner Image</label>
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          {/* PREVIEW */}
        {/* PREVIEW */}
{preview && (
  <div className="col-md-12">
    <label className="form-label">Preview</label>
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <img
        src={preview}
        alt="Banner Preview"
        style={{
          width: "220px",
          height: "220px",
          objectFit: "cover",
          borderRadius: "6px",
          border: "1px solid #ddd",
          background: "#f8f9fa",
        }}
      />
      <small className="text-muted">
        Preview (scaled)
      </small>
    </div>
  </div>
)}

          {/* BUTTON */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? "not-allowed" : "allowed"}`}
            >
              {loading ? "Uploading..." : "Save Banner"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddPromoBanners;
