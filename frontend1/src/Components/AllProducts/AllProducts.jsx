import React, { useEffect, useState } from "react";
import "./allproducts.css";
import axios from "axios";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState({});
  const [currentPage, setCurrentPage] = useState({});
  const productsPerPage = 20;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getApiData();
    getApiProductData();
  }, []);

  const getApiData = async () => {
    const res = await axios.get("http://localhost:7000/api/get-main-category");
    if (res.status === 200) {
      setCategoryData(res.data.data);
      const pageState = {};
      res.data.data.forEach((c) => (pageState[c._id] = 1));
      setCurrentPage(pageState);
    }
  };

  const getApiProductData = async () => {
    const res = await axios.get("http://localhost:7000/api/all-product");
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

  return (
    <div className="container my-5">
      {categoryData.map((category) => {
        const products = productData[category._id] || [];
        const start = (currentPage[category._id] - 1) * productsPerPage;
        const visible = products.slice(start, start + productsPerPage);

        return (
          <div key={category._id} className="mb-5">

            {/* CATEGORY HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 className="fw-bold mb-1 text-uppercase">
                  {category.mainCategoryName}
                </h4>
                <p className="text-muted mb-0">Best Gifts For Your Loved Ones</p>
              </div>
            </div>

            {/* PRODUCTS GRID (SAME AS BEST SELLING) */}
            <div className="row g-4">
              {visible.map((product) => (
                <div
                  key={product._id}
                  className="col-xl-3 col-lg-4 col-md-4 col-sm-6"
                >
                  <div className="product-card">

                    {/* IMAGE */}
                    <div className="product-img">
                      <img
                        src={`http://localhost:7000/${product.productImage[0]}`}
                        alt={product.productName}
                      />
                      <span className="wishlist">♡</span>
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
