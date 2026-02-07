import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSubSubCategory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  /* ================= STATE ================= */
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [formData, setFormData] = useState({
    mainCategoryId: "",
    subCategoryId: "",
    subSubcategoryName: "",
    activeOnHome: false,
    image: null,
  });

  /* ================= FETCH MAIN CATEGORIES ================= */
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const res = await axios.get(
          "https://api.ssdipl.com/api/get-main-category"
        );
        setMainCategories(res.data?.data || []);
      } catch {
        toast.error("Failed to fetch main categories");
      }
    };

    fetchMainCategories();
  }, []);

  /* ================= FETCH SUBCATEGORIES ================= */
  useEffect(() => {
    if (!formData.mainCategoryId) return;

    const fetchSubCategories = async () => {
      try {
        const res = await axios.get(
          `https://api.ssdipl.com/api/get-subcategory-by-category/${formData.mainCategoryId}`
        );
        setSubCategories(res.data?.data || []);
      } catch {
        toast.error("Failed to fetch subcategories");
      }
    };

    fetchSubCategories();
  }, [formData.mainCategoryId]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, type, checked, files, value } = e.target;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
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
      !formData.mainCategoryId ||
      !formData.subCategoryId ||
      !formData.subSubcategoryName ||
      !formData.image
    ) {
      toast.error("All fields are required");
      return;
    }

    setIsLoading(true);

    try {
      const fd = new FormData();
      fd.append("mainCategoryId", formData.mainCategoryId);
      fd.append("subCategoryId", formData.subCategoryId);
      fd.append("subSubcategoryName", formData.subSubcategoryName);
      fd.append("activeOnHome", formData.activeOnHome);
      fd.append("image", formData.image);

      const res = await axios.post(
        "https://api.ssdipl.com/api/create-subsubcategory",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data?.message || "Sub-Subcategory added");
      navigate("/all-sub-subcategory");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create sub-subcategory"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="bread">
        <div className="head">
          <h4>Add Sub-Subcategory</h4>
        </div>
        <div className="links">
          <Link to="/all-sub-subcategory" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* MAIN CATEGORY */}
          <div className="col-md-6">
            <label className="form-label">Main Category</label>
            <select
              name="mainCategoryId"
              className="form-control"
              value={formData.mainCategoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select main category</option>
              {mainCategories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.mainCategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* SUB CATEGORY */}
          <div className="col-md-6">
            <label className="form-label">Sub Category</label>
            <select
              name="subCategoryId"
              className="form-control"
              value={formData.subCategoryId}
              onChange={handleChange}
              disabled={!formData.mainCategoryId}
              required
            >
              <option value="">Select sub category</option>
              {subCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.subCategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* SUB-SUBCATEGORY NAME */}
          <div className="col-md-6">
            <label className="form-label">Sub-Subcategory Name</label>
            <input
              type="text"
              name="subSubcategoryName"
              className="form-control"
              value={formData.subSubcategoryName}
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

          {/* IMAGE */}
          <div className="col-md-6">
            <label className="form-label">Sub-Subcategory Image</label>
            <input
              type="file"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>

          {/* BUTTON */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Sub-Subcategory"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSubSubCategory;
