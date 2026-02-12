import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";

const AddProduct = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    categoryName: "",
    recommendedProductId: [],
    subcategoryName: "",
    secondsubcategoryName: "",
    productName: "",
    productDescription: "",
    ActiveonHome: 0,
    FeaturedProducts: 0,
    BestSellingProduct: 0,
    Variant: [
      {
        weight: "",
        price: "",
        discountPrice: "",
        finalPrice: "",
      },
    ],
    productImage: [],
  });

  // State to store categories, subcategories, colors, flowers, weights, and tags
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [secondSubcategories, setSecondSubcategories] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(
          "https://api.ssdipl.com/api/get-main-category"
        );
        const subcategoryResponse = await axios.get(
          "https://api.ssdipl.com/api/get-subcategory"
        );
        const weightResponse = await axios.get(
          "https://api.ssdipl.com/api/get-size"
        );
        const RecommendedProductResponse = await axios.get(
          "https://api.ssdipl.com/api/recommended-product/all-product"
        );

        setCategories(categoryResponse.data.data);
        setAllSubcategories(subcategoryResponse.data.data);
        setWeights(weightResponse.data.data);
        setRecommendedProducts(RecommendedProductResponse.data.data);
      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Error loading data!");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "recommendedproduct") {
      // prevent duplicates
      if (!formData?.recommendedProductId?.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          recommendedProductId: [...prev.recommendedProductId, value],
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }


    // Dynamically filter subcategories
    if (name === "categoryName") {
      const filteredSubcategories = allSubcategories.filter(
        (subcategory) => subcategory.categoryName._id === value
      );
      setSubcategories(filteredSubcategories); // Update subcategories for the dropdown
    }

  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      productImage: e.target.files,
    });
  };

  // Update formData when editor content changes
  const handleEditorChange = (newContent) => {
    setFormData({ ...formData, productDescription: newContent });
  };

  const handleEditorChange2 = (newContent) => {
    setFormData({ ...formData, productDetails: newContent });
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...formData.Variant];
    updatedVariants[index][name] = value;

    // Automatically calculate finalPrice when price or discountPrice changes
    if (name === "price" || name === "discountPrice") {
      const price = parseFloat(updatedVariants[index].price) || 0;
      const discount = parseFloat(updatedVariants[index].discountPrice) || 0;
      updatedVariants[index].finalPrice = price - price * (discount / 100);
    }

    setFormData({
      ...formData,
      Variant: updatedVariants,
    });
  };

  const handleAddVariant = () => {
    setFormData({
      ...formData,
      Variant: [
        ...formData.Variant,
        {
          weight: "",
          price: "",
          discountPrice: "",
          finalPrice: "",
        },
      ],
    });
  };

  const handleRemoveVariant = (index) => {
    const updatedVariants = formData.Variant.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      Variant: updatedVariants,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData();
    form.append("categoryName", formData.categoryName);
    form.append("subcategoryName", formData.subcategoryName);
    form.append("secondsubcategoryName", formData.secondsubcategoryName);
    form.append("productName", formData.productName);
    form.append("productDescription", formData.productDescription);
    form.append("productDetails", formData.productDetails);
    form.append("Variant", JSON.stringify(formData.Variant));
    form.append("ActiveonHome", formData?.ActiveonHome);
    form.append("FeaturedProducts", formData?.FeaturedProducts);
    form.append("BestSellingProduct", formData?.BestSellingProduct);
    form.append("recommendedProductId", JSON.stringify(formData.recommendedProductId));
    // Append images to FormData
    for (let i = 0; i < formData.productImage.length; i++) {
      form.append("productImage", formData.productImage[i]);
    }

    try {
      await axios.post("https://api.ssdipl.com/api/create-product", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully!");
      navigate("/all-products");
    } catch (err) {
      console.log(err);
      // toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchSecondSubcategories = async () => {
      try {
        const response = await axios.get(
          `https://api.ssdipl.com/api/second-sub-category/get-second-subcategory-by-subcategory/${formData?.subcategoryName}`
        );
        setSecondSubcategories(response?.data?.data);
      } catch (error) {
        console.error("Error fetching second subcategories:", error);
      }
    }
    fetchSecondSubcategories();
  }, [formData?.subcategoryName])

  const handleRemoveProduct = (id) => {
    setFormData((prev) => ({
      ...prev,
      recommendedProductId: prev.recommendedProductId.filter(
        (item) => item !== id
      ),
    }));
  };


  console.log("SSS::=>", formData);
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Product</h4>
        </div>
        <div className="links">
          <Link to="/all-products" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="categoryName" className="form-label">
              Main Category Name<sup className="text-danger">*</sup>
            </label>
            <select name="categoryName" className="form-select" id="categoryName" value={formData?.categoryName} onChange={handleChange} required>
              <option value="">Select Main Category</option>
              {categories.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.mainCategoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="subcategoryName" className="form-label">
              Category Name<sup className="text-danger">*</sup>
            </label>
            <select name="subcategoryName" className="form-select" id="subcategoryName" value={formData.subcategoryName} onChange={handleChange} disabled={!formData.categoryName} required            >
              <option value="" disabled>
                Select Category
              </option>
              {subcategories.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.subcategoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label htmlFor="secondsubcategoryName" className="form-label">
              Sub Category Name<sup className="text-danger">*</sup>
            </label>
            <select
              name="secondsubcategoryName"
              className="form-select"
              id="secondsubcategoryName"
              value={formData?.secondsubcategoryName}
              onChange={handleChange}
              disabled={!formData?.subcategoryName}
              required
            >
              <option value="" disabled>
                Select Sub Category
              </option>
              {secondSubcategories.map((item, index) => (
                <option key={index} value={item?._id}>
                  {item?.secondsubcategoryName}
                </option>
              ))}
            </select>
          </div>


          <div className="col-md-6">
            <label htmlFor="productName" className="form-label">
              Product Name<sup className="text-danger">*</sup>
            </label>
            <input type="text" name="productName" className="form-control" id="productName" value={formData.productName} onChange={handleChange} required placeholder="Product Name" />
          </div>

          {/* <div className="col-md-6">
            <label htmlFor="recommendedproduct" className="form-label">
              Recommended Product Name<sup className="text-danger">*</sup>
            </label>
            <select name="recommendedproduct" className="form-select" id="recommendedproduct" value={formData?.recommendedproduct} onChange={handleChange} required            >
              <option value="" >Select Recommended Product</option>
              {recommendedProducts?.map((item, index) => (
                <option key={index} value={item?._id}>
                  {item?.name || item?.productName}
                </option>
              ))}
            </select>

            {formData.recommendedProductId && (
              formData.recommendedProductId.map((item, index) => (
                recommendedProducts.filter((recommendedProduct) => recommendedProduct._id === item).map((recommendedProduct) => (
                  <div key={index}>
                    {recommendedProduct?.name || recommendedProduct?.productName}
                  </div>
                ))
              ))
            )}
          </div> */}

          <div className="col-md-6">
            <label className="form-label">
              Recommended Product Name <sup className="text-danger">*</sup>
            </label>

            <select
              name="recommendedproduct"
              className="form-select"
              onChange={handleChange}
            >
              <option value="">Select Recommended Product</option>
              {recommendedProducts?.map((item) => (
                <option key={item?._id} value={item?._id}>
                  {item?.name || item?.productName}
                </option>
              ))}
            </select>

            {/* Selected Products */}
            <div className="mt-2 row g-2">
              {formData?.recommendedProductId?.map((id) => {
                const product = recommendedProducts?.find(p => p?._id === id);
                if (!product) return null;

                return (
                  <div key={id} className="col-md-4">
                    <div className="d-flex justify-content-between align-items-center bg-light px-2 py-1 rounded">
                      <span className="text-truncate">
                        {product?.name || product?.productName}
                      </span>

                      <button
                        type="button"
                        className="btn btn-sm btn-danger ms-2"
                        onClick={() => handleRemoveProduct(id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="col-md-12">
            <label htmlFor="productDescription" className="form-label">
              Product Description<sup className="text-danger">*</sup>
            </label>
            {/* <textarea name='productDescription' rows={6} className="form-control" id="productDescription" placeholder='Product Description' value={formData.productDescription} onChange={handleChange} required /> */}
            <JoditEditor ref={editor} value={formData.productDescription} onChange={handleEditorChange} placeholder="Enter Product Description here..." />
          </div>
          <div className="col-md-12">
            <label htmlFor="productDetails" className="form-label">Product Details<sup className="text-danger">*</sup></label>
            {/* <textarea name='productDescription' rows={6} className="form-control" id="productDescription" value={formData.productDescription} onChange={handleChange} required /> */}
            <JoditEditor ref={editor} value={formData.productDetails} onChange={handleEditorChange2} placeholder="Enter Product Details here..." />
          </div>
          <div className="col-md-12">
            <label htmlFor="productImage" className="form-label">
              Product Image<sup className="text-danger">*</sup>
            </label>
            <input type="file" name="productImage" className="form-control" id="productImage" multiple onChange={handleFileChange} required />
          </div>

          {/* Variant Details */}
          {formData.Variant.map((variant, index) => (
            <div key={index} className="variant-container">
              <div className="row">
                <div className="col-md-3 mb-1">
                  <label
                    htmlFor={`variantWeight-${index}`}
                    className="form-label"
                  >
                    Weight/Sizes<sup className="text-danger">*</sup>
                  </label>
                  <select
                    name="weight"
                    className="form-select"
                    id={`variantWeight-${index}`}
                    value={variant.weight}
                    onChange={(e) => handleVariantChange(index, e)}
                    required
                  >
                    <option value="" selected disabled>
                      Select Weight
                    </option>
                    {weights.map((weight, i) => (
                      <option key={i} value={weight._id}>
                        {weight.sizeweight}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label
                    htmlFor={`variantPrice-${index}`}
                    className="form-label"
                  >
                    Price<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    id={`variantPrice-${index}`}
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, e)}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label
                    htmlFor={`variantDiscountPrice-${index}`}
                    className="form-label"
                  >
                    Discount %<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    className="form-control"
                    id={`variantDiscountPrice-${index}`}
                    placeholder="Discount %"
                    value={variant.discountPrice}
                    onChange={(e) => handleVariantChange(index, e)}
                    required
                  />
                </div>

                <div className="col-md-3">
                  <label
                    htmlFor={`variantFinalPrice-${index}`}
                    className="form-label"
                  >
                    Final Price<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="number"
                    name="finalPrice"
                    className="form-control"
                    id={`variantFinalPrice-${index}`}
                    placeholder="Final Price"
                    value={variant.finalPrice}
                    readOnly
                  />
                </div>
              </div>


              {/* Remove Variant Button */}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="btn btn-danger mt-1"
                >
                  Remove Variant
                </button>
              )}
            </div>
          ))}
          <div className="col-md-12">
            <div className="row align-items-center">
              <div className="col-md-3 form-check">
                <input
                  type="checkbox"
                  name="ActiveonHome"
                  className="form-check-input me-2"
                  checked={formData.ActiveonHome === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, ActiveonHome: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="form-check-label">Active on Home</label>
              </div>

              <div className="col-md-3 form-check">
                <input
                  type="checkbox"
                  name="BestSellingProduct"
                  className="form-check-input me-2"
                  checked={formData.BestSellingProduct === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, BestSellingProduct: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="form-check-label">Best Selling Product</label>
              </div>

              <div className="col-md-3 form-check">
                <input
                  type="checkbox"
                  name="FeaturedProducts"
                  className="form-check-input me-2"
                  checked={formData.FeaturedProducts === 1}
                  onChange={(e) =>
                    setFormData({ ...formData, FeaturedProducts: e.target.checked ? 1 : 0 })
                  }
                />
                <label className="form-check-label">Featured Products</label>
              </div>

            </div>
          </div>
          <button
            type="button"
            onClick={handleAddVariant}
            className="btn btn-primary col-md-3"
          >
            Add Variant
          </button>

          <div className="col-md-12">
            <button
              type="submit"
              className="btn btn-success"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
