import React, { useEffect, useState } from "react";
import "./allproducts.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Swal from "sweetalert2";

const AllProducts = ({ status = '' }) => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("userId");
  const [categoryData, setCategoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState({});
  const [wishlist, setWishlist] = useState([]); // ✅ fixed initial state
  const productsPerPage = 20;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getApiData();
    getApiProductData();
  }, []);

  const getApiData = async () => {
    const res = await axios.get(
      `https://api.cakenpetals.com/api/get-main-category`
    );
    if (res.status === 200) {
      setCategoryData(status === 'Home' ? res.data?.data?.filter((item) => item?.ActiveonHome === true) : res?.data?.data);
      const pageState = {};
      res.data.data.forEach((c) => (pageState[c?._id] = 1));
      setCurrentPage(pageState);
    }
  };

  const getApiProductData = async () => {
    const res = await axios.get(
      `https://api.cakenpetals.com/api/all-product`
    );

    if (res.status === 200) {
      const grouped = {};
      res.data.data.forEach((p) => {
        const cid = p?.categoryName?._id;
        if (!grouped[cid]) grouped[cid] = [];
        grouped[cid].push(p);
      });
      console.log("grouped==>", res.data.data)
      setProductData(status === 'Home' ? res.data.data.filter((item) => item?.ActiveonHome === true) : res.data.data || grouped);
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("wishlist");
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  // Handle product card click navigation
  const handleProductClick = (productName) => {
    navigate(`/product-details/${productName}`);
  };

  // Handle wishlist toggle (prevents event bubbling)
  const handleWishlistClick = (e, productId) => {
    e.stopPropagation(); // Prevents the card click event

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
        await axios.delete("https://api.cakenpetals.com/api/wishlist/remove-wishlist", {
          data: {
            user: user,
            productId: productId,
          },
        });
      } else {
        // ✅ ADD to wishlist
        await axios.post("https://api.cakenpetals.com/api/wishlist/add-wishlist", {
          user: user,
          productId: productId,
        });
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
    }
  };

  // Handle Buy Now button click (prevents event bubbling)
  const handleBuyNowClick = (e, productName) => {
    e.stopPropagation(); // Prevents the card click event
    navigate(`/product-details/${productName?.replace(/\s+/g, "-")}`);
  };

  return (
    <div className="container my-5">
      {/* {categoryData?.map((category) => {
        const products = productData[category?._id] || [];
        const start = (currentPage[category?._id] - 1) * productsPerPage;
        const visible = products.slice(start, start + productsPerPage);
        console.log("visible==>", visible)
        return ( */}
      <div className="mb-5">

        {/* CATEGORY HEADER */}
        {/* <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="textArea">
                <h4 className="   SuperTitle mb-1 text-uppercase">
                  {category?.mainCategoryName?.charAt(0).toUpperCase() + category?.mainCategoryName?.slice(1)}
                </h4>
                <p className="  SuperSubTitle text-muted mb-0">Best Gifts For Your Loved Ones</p>
              </div>
            </div> */}

        {/* PRODUCTS GRID */}
        <div className="row g-4">
          {productData?.map((product) => (
            <div
              key={product?._id}
              className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
            >
              <div
                className="product-card"
                onClick={() => handleProductClick(product?.productName)}
                style={{ cursor: "pointer" }}
              >

                {/* IMAGE */}
                <div className="product-img">
                  <img
                    src={`https://api.cakenpetals.com/${product.productImage[0]}`}
                    alt={product.productName}
                  />

                  {/* ❤️ Wishlist (with stopPropagation) */}
                  <span
                    className="wishlist"
                    onClick={(e) => handleWishlistClick(e, product?._id)}
                  >
                    {wishlist?.includes(product?._id) ? (
                      <FaHeart color="red" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </span>
                  {product?.Variant[0]?.discountPrice && (
                    <span  style={{fontSize:"14px"}} className="badge bg-success position-absolute top-0 start-0 m-2">
                      {product?.Variant[0]?.discountPrice}% OFF
                    </span>
                  )}
                  {/* <span className="off-badge">{product?.Variant[0]?.discountPrice}% OFF</span> */}
                </div>

                {/* CONTENT */}
                <div className="product-body">
                  <p className="product-title">
                    {product?.productName?.charAt(0).toUpperCase() + product?.productName?.slice(1)}
                  </p>

                  <div className="price-row">
                    <span className="price">₹ {product?.Variant[0]?.finalPrice}</span>
                    <span className="old-price">₹ {product?.Variant[0]?.price}</span>
                    {/* <span className="off">{product?.Variant[0]?.discountPrice}% OFF</span> */}
                  </div>

                  {/* <div className="rating">
                        ⭐ 4.8 <span>(245 Reviews)</span>
                      </div> */}

                  <p className="delivery">
                    Earliest Delivery : <span>In 3 hours</span>
                  </p>

                  {/* <button
                        className="btn btn-dark w-100 mt-2"
                        onClick={(e) => handleBuyNowClick(e, product?.productName)}
                      >
                        Buy Now
                      </button> */}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
      {/* );
      })} */}
    </div>
  );
};

export default AllProducts;

// import React, { useEffect, useState } from "react";
// import "./allproducts.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import Swal from "sweetalert2";

// const AllProducts = ({ status = "" }) => {
//   const navigate = useNavigate();
//   const user = sessionStorage.getItem("userId");
//   const [categoryData, setCategoryData] = useState([]);
//   const [productData, setProductData] = useState({});
//   const [currentPage, setCurrentPage] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const productsPerPage = 20;

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     fetchAll();
//   }, []);

//   useEffect(() => {
//     const stored = sessionStorage.getItem("wishlist");
//     if (stored) setWishlist(JSON.parse(stored));
//   }, []);

//   const fetchAll = async () => {
//     try {
//       const [catRes, prodRes] = await Promise.all([
//         axios.get(`https://api.cakenpetals.com/api/get-main-category`),
//         axios.get(`https://api.cakenpetals.com/api/all-product`),
//       ]);

//       // ✅ Group products by categoryId
//       const grouped = {};
//       prodRes.data.data.forEach((p) => {
//         const cid = p?.categoryName?._id;
//         if (!cid) return;
//         if (!grouped[cid]) grouped[cid] = [];
//         grouped[cid].push(p);
//       });
//       setProductData(grouped);

//       // ✅ Filter categories: ActiveonHome (if Home) + must have products
//       const allCats = catRes.data?.data || [];
//       const filtered = allCats.filter((c) => {
//         const hasProducts = (grouped[c._id] || []).length > 0; // ✅ Hide empty categories
//         const isActive = status === "Home" ? c?.ActiveonHome === true : true;
//         return hasProducts && isActive;
//       });

//       setCategoryData(filtered);

//       // ✅ Set page state only for valid categories
//       const pageState = {};
//       filtered.forEach((c) => (pageState[c._id] = 1));
//       setCurrentPage(pageState);

//     } catch (err) {
//       console.error("Fetch error:", err);
//     }
//   };

//   const handleProductClick = (product) => {
//     navigate(`/product-details/${product?.productName?.replace(/\s+/g, "-")}`, {
//       state: { id: product?._id, status: "product" },
//     });
//   };

//   const handleWishlistClick = (e, productId) => {
//     e.stopPropagation();
//     if (!user) {
//       Swal.fire({ icon: "warning", title: "Login Required", text: "Please login to use wishlist" });
//       navigate("/login");
//       return;
//     }
//     setWishlist((prev) => {
//       const isExist = prev.includes(productId);
//       const updated = isExist ? prev.filter((id) => id !== productId) : [...prev, productId];
//       sessionStorage.setItem("wishlist", JSON.stringify(updated));
//       handleWishlistApi(productId, isExist);
//       return updated;
//     });
//   };

//   const handleWishlistApi = async (productId, isRemoving) => {
//     try {
//       if (isRemoving) {
//         await axios.delete("https://api.cakenpetals.com/api/wishlist/remove-wishlist", {
//           data: { user, productId },
//         });
//       } else {
//         await axios.post("https://api.cakenpetals.com/api/wishlist/add-wishlist", {
//           user,
//           productId,
//         });
//       }
//     } catch (error) {
//       console.error("Wishlist API error:", error);
//     }
//   };

//   return (
//     <div className="container my-5">
//       {categoryData.map((category) => {
//         const products = productData[category._id] || [];
//         const page = currentPage[category._id] || 1;
//         const start = (page - 1) * productsPerPage;
//         const visible = products.slice(start, start + productsPerPage);
//         const totalPages = Math.ceil(products.length / productsPerPage);

//         return (
//           <div key={category._id} className="mb-5">

//             {/* CATEGORY HEADER */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <div className="textArea">
//                 <h4 className="SuperTitle mb-1 text-uppercase">
//                   {category?.mainCategoryName?.charAt(0).toUpperCase() +
//                     category?.mainCategoryName?.slice(1)}
//                 </h4>
//                 <p className="SuperSubTitle text-muted mb-0">
//                   Best Gifts For Your Loved Ones
//                 </p>
//               </div>
//             </div>

//             {/* PRODUCTS GRID */}
//             <div className="row g-4">
//               {visible.map((product) => {
//                 const variant = product?.Variant?.[0] || {};
//                 const image = product?.productImage?.[0]?.replace(/\\/g, "/");
//                 const isWishlisted = wishlist.includes(product._id);

//                 return (
//                   <div
//                     key={product._id}
//                     className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
//                     onClick={() => handleProductClick(product)}
//                     style={{ cursor: "pointer" }}
//                   >
//                     <div className="product-card">

//                       {/* IMAGE */}
//                       <div className="product-img">
//                         <img
//                           src={`https://api.cakenpetals.com/${image}`}
//                           alt={product.productName}
//                           onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.jpg"; }}
//                         />

//                         {/* ❤️ Wishlist */}
//                         <span className="wishlist" onClick={(e) => handleWishlistClick(e, product._id)}>
//                           {isWishlisted ? <FaHeart color="red" /> : <FaRegHeart />}
//                         </span>

//                         {/* Eggless Badge */}
//                         {product?.eggless && (
//                           <span className="eggless-badge">🥚 Eggless</span>
//                         )}

//                         {/* Discount Badge */}
//                         {variant?.discountPrice > 0 && (
//                           <span className="off-badge">{variant.discountPrice}% OFF</span>
//                         )}
//                       </div>

//                       {/* CONTENT */}
//                       <div className="product-body">
//                         <p className="product-title">
//                           {product?.productName?.charAt(0).toUpperCase() +
//                             product?.productName?.slice(1)}
//                         </p>

//                         <div className="price-row">
//                           <span className="price">₹ {variant?.finalPrice}</span>
//                           {variant?.discountPrice > 0 && (
//                             <>
//                               <span className="old-price">₹ {variant?.price}</span>
//                               <span className="off">{variant?.discountPrice}% OFF</span>
//                             </>
//                           )}
//                         </div>

//                         <div className="rating">
//                           ⭐ 4.8 <span>(245 Reviews)</span>
//                         </div>

//                         <p className="delivery">
//                           Earliest Delivery: <span>In 3 hours</span>
//                         </p>
//                       </div>

//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* ✅ PAGINATION */}
//             {totalPages > 1 && (
//               <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
//                 <button
//                   className="btn btn-outline-dark"
//                   disabled={page === 1}
//                   onClick={() => setCurrentPage((prev) => ({ ...prev, [category._id]: page - 1 }))}
//                 >
//                   ← Prev
//                 </button>
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i}
//                     className={`btn ${page === i + 1 ? "btn-dark" : "btn-outline-dark"}`}
//                     onClick={() => setCurrentPage((prev) => ({ ...prev, [category._id]: i + 1 }))}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//                 <button
//                   className="btn btn-outline-dark"
//                   disabled={page === totalPages}
//                   onClick={() => setCurrentPage((prev) => ({ ...prev, [category._id]: page + 1 }))}
//                 >
//                   Next →
//                 </button>
//               </div>
//             )}

//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default AllProducts;