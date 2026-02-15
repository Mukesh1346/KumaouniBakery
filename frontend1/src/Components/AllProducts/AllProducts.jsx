import React, { useEffect, useState } from "react";
import "./allproducts.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Swal from "sweetalert2";

const AllProducts = ({ status = '' }) => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("userId");
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const [wishlist, setWishlist] = useState([{ user: '', productId: '' }]); // ✅ added
  const productsPerPage = 20;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getApiData();
    getApiProductData();
  }, []);

  const getApiData = async () => {
    const res = await axios.get(
      `http://localhost:7000/api/get-main-category`
    );
    if (res.status === 200) {
      setCategoryData(status === 'Home' ? res.data.data.filter((item) => item.ActiveonHome === true) : res.data.data);
      const pageState = {};
      res.data.data.forEach((c) => (pageState[c._id] = 1));
      setCurrentPage(pageState);
    }
  };

  const getApiProductData = async () => {
    const res = await axios.get(
      `http://localhost:7000/api/all-product`
    );

    if (res.status === 200) {
      const grouped = {};
      res.data.data.forEach((p) => {
        const cid = p.categoryName._id;
        if (!grouped[cid]) grouped[cid] = [];
        grouped[cid].push(p);
      });
      setProductData(grouped);
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  // get existing wishlist from session
  const toggleWishlist = async (productId) => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to use wishlist",
      });
      navigate("/login");
      return;
    }

    setWishlist((prev) => {
      const isExist = prev.includes(productId);

      const updated = isExist
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      // ✅ update session
      sessionStorage.setItem("wishlist", JSON.stringify(updated));

      // ✅ call API (fire and forget)
      handleWishlistApi(productId, isExist);

      return updated;
    });
  };


  const handleWishlistApi = async (productId, isRemoving) => {
    console.log("isRemoving==>", isRemoving);
    try {
      if (isRemoving) {
        // ✅ REMOVE from wishlist
        await axios.delete("http://localhost:7000/api/wishlist/remove-wishlist", {
          data: {
            user: user,
            productId: productId,
          },
        });
      } else {
        // ✅ ADD to wishlist
        await axios.post("http://localhost:7000/api/wishlist/add-wishlist", {
          user: user,
          productId: productId,
        });
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
    }
  };


  console.log("DDD:=>", wishlist);

  return (
    <div className="container my-5">
      {categoryData?.map((category) => {
        const products = productData[category?._id] || [];
        const start = (currentPage[category?._id] - 1) * productsPerPage;
        const visible = products.slice(start, start + productsPerPage);

        return (
          <div key={category._id} className="mb-5">

            {/* CATEGORY HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="textArea">
                <h4 className="fw-bold mb-1  text-uppercase">
                  {category.mainCategoryName}      
                </h4>
                <p className="text-muted mb-0">Best Gifts For Your Loved Ones</p>
              </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="row g-4">
              {visible.map((product) => (
                <div
                  key={product._id}
                  className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
                >
                  <div className="product-card">

                    {/* IMAGE */}
                    <div className="product-img">
                      <img
                        src={`http://localhost:7000/${product.productImage[0]}`}
                        alt={product.productName}
                      />

                      {/* ❤️ Wishlist (added only this part) */}
                      <span
                        className="wishlist"
                        onClick={() => toggleWishlist(product?._id)}
                      >
                        {wishlist?.includes(product?._id) ? (
                          <FaHeart color="red" />
                        ) : (
                          <FaRegHeart />
                        )}
                      </span>

                      <span className="off-badge">20% OFF</span>
                    </div>

                    {/* CONTENT */}
                    <div className="product-body">
                      <p className="product-title">
                        {product.productName}
                      </p>

                      <div className="price-row">
                        <span className="price">₹ 300</span>
                        <span className="old-price">₹ 375</span>
                        <span className="off">20% OFF</span>
                      </div>

                      <div className="rating">
                        ⭐ 4.8 <span>(245 Reviews)</span>
                      </div>

                      <p className="delivery">
                        Earliest Delivery : <span>In 3 hours</span>
                      </p>

                      <Link
                        to={`/product-details/${product.productName}`}
                        className="btn btn-dark w-100 mt-2"
                      >
                        Buy Now
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default AllProducts;
