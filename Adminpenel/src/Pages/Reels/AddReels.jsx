import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddReels = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    productId: "",
    title: "",
    price: "",
    video: null,
    productImage: null,
    activeOnHome: false,
  });

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.price ||
      !formData.video ||
      !formData.productImage ||
      !formData.productId
    ) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("productId", formData.productId);
      fd.append("title", formData.title);
      fd.append("price", formData.price);
      fd.append("video", formData.video);
      fd.append("productImage", formData.productImage);
      fd.append("activeOnHome", formData.activeOnHome);

      const res = await axios.post(
        "http://localhost:7000/api/reel/create-reel",
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      toast.success(res.data?.message || "Reel added successfully");
      navigate("/all-reels");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create reel"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        const res = await axios.get("http://localhost:7000/api/all-product");
        setProductList(res.data?.data || []);
      } catch (error) {
        toast.error("Error fetching products");
        console.error(error);
      }
    };

    fetchAllProduct();
  }, []);

  return (
    <>
      <ToastContainer />

      {/* ===== BREADCRUMB ===== */}
      <div className="bread">
        <div className="head">
          <h4>Add Reel</h4>
        </div>
        <div className="links">
          <Link to="/all-reels" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      {/* ===== FORM ===== */}
      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>

          {/* PRODUCT */}
          <div className="col-md-4">
            <label className="form-label">Product</label>
            <select name="productId" className="form-control" value={formData?.productId} onChange={handleChange} required            >
              <option value="">Select Product</option>
              {productList?.map((sub) => (
                <option key={sub?._id} value={sub?._id}>{sub?.productName} (Rs{sub?.Variant[0]?.price})</option>
              ))}
            </select>
          </div>


          {/* TITLE */}
          <div className="col-md-4">
            <label className="form-label">Reel Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* PRICE */}
          <div className="col-md-4">
            <label className="form-label">Price</label>
            <input
              type="text"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* VIDEO */}
          <div className="col-md-6">
            <label className="form-label">Reel Video</label>
            <input
              type="file"
              name="video"
              className="form-control"
              accept="video/*"
              onChange={handleChange}
              required
            />
          </div>

          {/* PRODUCT IMAGE */}
          <div className="col-md-6">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              name="productImage"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          {/* ACTIVE */}
          <div className="col-md-6">
            <label className="form-label">Display on Homepage</label>
            <div className="form-check">
              <input
                type="checkbox"
                name="activeOnHome"
                className="form-check-input"
                checked={formData.activeOnHome}
                onChange={handleChange}
              />
              <label className="form-check-label">
                Active on Homepage
              </label>
            </div>
          </div>

          {/* BUTTON */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Reel"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddReels;
