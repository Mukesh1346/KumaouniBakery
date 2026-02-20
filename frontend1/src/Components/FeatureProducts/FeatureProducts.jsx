// import React, { useState } from "react";
// import "./featureProduct.css";
// import pic1 from "../../images/pic/Product1.avif";
// import pic2 from "../../images/pic/Product2.avif";
// import pic3 from "../../images/pic/Product3.avif";
// import pic4 from "../../images/pic/Product4.avif";
// import pic5 from "../../images/pic/Product4.avif";
// import pic6 from "../../images/pic/Product4.avif";
// import pic7 from "../../images/pic/Product4.avif";
// import pic8 from "../../images/pic/Product4.avif";
// import { Link } from "react-router-dom";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import axios from "axios";
// import { useEffect } from "react";

// /* 🔒 STATIC FEATURED PRODUCTS DATA */
// const featuredProductsData = [
//   {
//     id: 1,
//     name: "10 Red Roses Bouquet",
//     image: pic1,
//     price: 695,
//     oldPrice: 845,
//     rating: 4.9,
//     reviews: 1645,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 2,
//     name: "Blush Heart Chocolate Cake",
//     image: pic2,
//     price: 775,
//     oldPrice: 995,
//     rating: 4.8,
//     reviews: 1022,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 3,
//     name: "Aromatic Choco Hamper",
//     image: pic3,
//     price: 1165,
//     oldPrice: 1445,
//     rating: 4.7,
//     reviews: 812,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 4,
//     name: "Twin Hearts Floral Balloon Bouquet",
//     image: pic4,
//     price: 1095,
//     oldPrice: 1445,
//     rating: 4.8,
//     reviews: 945,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 5,
//     name: "Money Plant In Black Mandala Pot",
//     image: pic5,
//     price: 595,
//     oldPrice: 699,
//     rating: 4.6,
//     reviews: 3,
//     delivery: "Tomorrow",
//   },
//   {
//     id: 6,
//     name: "Purple Orchids n Floral Cake Combo",
//     image: pic6,
//     price: 1545,
//     oldPrice: 1695,
//     rating: 4.9,
//     reviews: 1190,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 7,
//     name: "Blue Orchid Jute Bouquet",
//     image: pic7,
//     price: 895,
//     oldPrice: 1095,
//     rating: 4.9,
//     reviews: 482,
//     delivery: "In 3 hours",
//   },
//   {
//     id: 8,
//     name: "Bows N Blush Chocolate Cream Cake",
//     image: pic8,
//     price: 695,
//     oldPrice: null,
//     rating: 4.7,
//     reviews: 221,
//     delivery: "In 3 hours",
//   },
// ];


// const FeaturedProducts = () => {
//   // ✅ Wishlist state (store product IDs)
//   const [wishlist, setWishlist] = useState([]);
//   const [featuredProductsData, setFeaturedProductsData] = useState([]);
//   // ✅ Toggle wishlist per product
//   const toggleWishlist = (id) => {
//     setWishlist((prev) =>
//       prev.includes(id)
//         ? prev.filter((itemId) => itemId !== id) // remove
//         : [...prev, id] // add
//     );
//   };
//   const fetchFeaturedProducts = async () => {
//     try {
//       const response = await axios.get("https://api.ssdipl.com/api/get-featuredProducts");
//       setFeaturedProductsData(response?.data?.data)
//       // const data = await response.json();
//       console.log("SSSSS::=>", response.data.data);
//     } catch (error) {
//       console.error("Error fetching featured products:", error);
//     }
//   }

//   useEffect(() => {
//     fetchFeaturedProducts();
//   }, [])
//   return (
//     <div className="container my-5 featured-products">
//       {/* Header */}
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <div>
//           <h4 className="fw-bold featuretitle mb-1">Featured Products</h4>
//           <p className="text-muted mb-0">
//             Life Is Celebration - We Deliver Happiness
//           </p>
//         </div>
//         <button className="btn btn-dark px-4">View All</button>
//       </div>

//       {/* Product Grid */}
//       <div className="row g-4">
//         {featuredProductsData?.map((item) => (
//           <div
//             className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
//             key={item?._id}
//           >
//             <div className="product-card">
//               {/* Image */}
//               <div className="product-img">
//                 <img src={`https://api.ssdipl.com/${item?.productImage[0] || item?.productImage}`} alt={item?.name} />

//                 {/* ❤️ Wishlist */}
//                 <span
//                   className="wishlist-icon"
//                   onClick={() => toggleWishlist(item?._id)}
//                 >
//                   {wishlist?.includes(item?._id) ? (
//                     <FaHeart size={22} color="red" />
//                   ) : (
//                     <FaRegHeart size={22} color="#555" />
//                   )}
//                 </span>
//               </div>

//               {/* Content */}
//               <div className="product-body">
//                 <p className="product-title">{item?.productName}</p>

//                 <div className="price-row">
//                   <span className="price">₹ {item.price}</span>

//                   {item.oldPrice && (
//                     <>
//                       <span className="old-price">₹ {item.oldPrice}</span>
//                       <span className="off">
//                         {Math.round(
//                           ((item.oldPrice - item.price) / item.oldPrice) * 100
//                         )}
//                         % OFF
//                       </span>
//                     </>
//                   )}
//                 </div>

//                 <div className="rating">
//                   ⭐ {item.rating} <span>({item.reviews} Reviews)</span>
//                 </div>

//                 <p className="delivery">
//                   Earliest Delivery : <span>{item.delivery}</span>
//                 </p>

//                 <Link
//                   to={`/product-details/${item.name}`}
//                   className="btn btn-dark w-100 mt-2"
//                 >
//                   Buy Now
//                 </Link>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default FeaturedProducts;


import React, { useState, useEffect, } from "react";
import "./featureProduct.css";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BASE_URL = "https://api.ssdipl.com/";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("userId");
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

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
        await axios.delete("https://api.ssdipl.com/api/wishlist/remove-wishlist", {
          data: {
            user: user,
            productId: productId,
          },
        });
      } else {
        // ✅ ADD to wishlist
        await axios.post("https://api.ssdipl.com/api/wishlist/add-wishlist", {
          user: user,
          productId: productId,
        });
      }
    } catch (error) {
      console.error("Wishlist API error:", error);
    }
  };



  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(
        "https://api.ssdipl.com/api/get-featuredProducts"
      );
      setProducts(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching featured products:", error);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    return BASE_URL + path.replace(/\\/g, "/");
  };


  const handleProductClick = (productName) => {
    navigate(`/product-details/${productName.replace(/\s+/g, "-")}`);
  };

  return (
    <div className="container my-5 featured-products">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className=" SuperTitle SuperTitle mb-1">Featured Products</h4>
          <p className="text-muted SuperSubTitle mb-0">
            Life Is Celebration - We Deliver Happiness
          </p>
        </div>
        <Link to="/all-products" className="btn viewBg px-4">
          View All
        </Link>
      </div>

      <div className="row g-4">
        {products.map((item) => {
          const variant = item.Variant?.[0];
          const price = variant?.finalPrice || variant?.price;
          const oldPrice = variant?.price;
          const discount = variant?.discountPrice;

          return (
            <div
              className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
              key={item._id}
            >
              <div className="product-card shadow-sm rounded-3">

                {/* IMAGE */}
                <div className="product-img position-relative">
                  <img
                    src={getImageUrl(item.productImage?.[0])}
                    alt={item.productName}
                  />

                  <span
                    className="wishlist-icon"
                    onClick={() => toggleWishlist(item._id)}
                  >
                    {wishlist.includes(item._id) ? (
                      <FaHeart size={20} color="red" />
                    ) : (
                      <FaRegHeart size={20} color="#555" />
                    )}
                  </span>

                  {variant?.discountPrice && (
                    <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="product-body p-3" onClick={() => handleProductClick(item.productName)}>
                  <p className="product-title">{item.productName}</p>

                  <div className="price-row">
                    <span className="price">₹ {price}</span>

                    {oldPrice && oldPrice !== price && (
                      <>
                        <span className="old-price">₹ {oldPrice}</span>
                        <span className="off">
                          {Math.round(((oldPrice - price) / oldPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  <p className="delivery">
                    {item.subcategoryName?.subcategoryName}
                  </p>

                  {/* <Link
                    to={`/product-details/${item._id}`}
                    className="btn btn-dark w-100 mt-2"
                  >
                    Buy Now
                  </Link> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProducts;
