import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import "./productDetails.css";
import AllProducts from "../../Components/AllProducts/AllProducts";
import axios from "axios";
import Swal from "sweetalert2";
import pic1 from "../../images/pic/Product2.avif"
import { FaLocationCrosshairs } from "react-icons/fa6";
import RecommendedPopup from "../../Components/RecommendedPopup/RecommendedPopup";
import { SiPaytm } from "react-icons/si";
import { FaGooglePay } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";
   import { TbTruckDelivery } from "react-icons/tb";
                     import { TbMapPinCode } from "react-icons/tb";

const ProductDetails = () => {
  const { name } = useParams();
  const [data, setData] = useState({});
  const [activeWeight, setActiveWeight] = useState(null);
  const [price, setPrice] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [eggOption, setEggOption] = useState("");
  const [message, setMessage] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [open, setOpen] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

 const handleWishlist = () => {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.includes(data._id)) {
    wishlist = wishlist.filter(id => id !== data._id);
    setIsWishlisted(false);
    Swal.fire("Removed", "Removed from wishlist", "info");
  } else {
    wishlist.push(data._id);
    setIsWishlisted(true);
    Swal.fire("Added", "Added to wishlist ❤️", "success");
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};


  useEffect(() => {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  if (data?._id) {
    setIsWishlisted(wishlist.includes(data._id));
  }
}, [data]);


  const addonSliderSettings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };


  // Fetch product data by name
  const getApiData = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/get-product-by-name/${name}`
      );
      const productData = res.data.data;
      setData(productData);

      if (productData?.Variant?.length > 0) {
        setPrice(productData.Variant[0].finalPrice); // Default price for the first variant
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getApiData();
  }, [name]);

  const handleWeightSelection = (weight) => {
    setActiveWeight(weight);
    const selectedVariant = data.Variant?.find(
      (variant) => variant?.weight?.sizeweight === weight
    );
    if (selectedVariant) {
      setPrice(selectedVariant.finalPrice);
    }
  };

  const addToCart = () => {

    // Check if variants exist and contain weights
    const hasWeightVariants = data.Variant?.some(
      (variant) => variant?.weight?.sizeweight
    );

    // If weights exist but none are selected
    if (hasWeightVariants && !activeWeight) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a weight before adding the product to the cart.",
      });
      return;
    }

    // Check if deliveryDate is provided
    if (!deliveryDate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a delivery date before adding the product to the cart.",
      });

      setOpenPopup(true);
      return;
    }

    // Prepare the cart item
    const cartItem = {
      id: data._id,
      name: data.productName || "Unknown Product",
      weight: activeWeight || "N/A", // Default to "N/A" if no weight is required
      price: price || 0,
      deliveryDate,
      eggOption,
      description: data.productDescription || "",
      message: message || "",
      image: data.productImage?.[0] || "default-image.jpg", // Use default image if missing
      quantity: 1, // Initial quantity
    };

    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    // Check for existing item in the cart with the same product, weight, and egg option
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.weight === cartItem.weight &&
        item.eggOption === cartItem.eggOption
    );

    if (existingItemIndex !== -1) {
      // Item already in the cart with the same weight and egg option
      Swal.fire({
        icon: "error",
        title: "Product Already in Cart",
        text: "This product is already in your cart.",
      });
      return;
    }

    // Check for the same product with a different weight or egg option
    const differentWeightItemIndex = cart.findIndex(
      (item) =>
        item.id === cartItem.id &&
        item.weight !== cartItem.weight &&
        item.eggOption === cartItem.eggOption
    );

    if (differentWeightItemIndex !== -1) {
      // Different weight, allow adding to cart
      cart.push(cartItem);
      sessionStorage.setItem("cart", JSON.stringify(cart));
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product with the selected weight added to cart successfully!",
      });
    } else {
      // No such product with a different weight, add it
      cart.push(cartItem);
      sessionStorage.setItem("cart", JSON.stringify(cart));
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product added to cart successfully!",
      });
    }
  };

  const settings = {
    customPaging: function (i) {
      return (
       <button
  type="button"
  className="p-0 border-0 bg-transparent"
>
  <img
    src={`${process.env.REACT_APP_API_URL}/${data.productImage?.[i]}`}
    className="w-100"
    style={{ borderRadius: "1rem" }}
    alt={`Thumbnail ${i + 1}`}
  />
</button>

      );
    },
    dots: true,
    arrow: false,
    dotsClass: "miniImage",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      {/* Breadcrumb Section */}
      <section className="breadCrumb">
        <div className="breadCrumbContent">
          <h1>Product Details</h1>
          <Link to="/">Home /</Link>{" "}
          <Link to="">{data?.categoryName?.mainCategoryName} /</Link>{" "}
          <Link to="">{data.productName}</Link>
        </div>
      </section>

      <section className="pdx-wrapper">
        <div className="container">
          <div className="row gx-4">

            {/* LEFT IMAGE SECTION */}
            <div className="col-lg-5">
              <div className="pdx-left-sticky">
                <div className="d-flex pdxImg" >
                  <div className="pdx-thumb-column">
                    {data.productImage?.map((img, i) => (
                      <img
                        key={i}
                        src={`${process.env.REACT_APP_API_URL}/${img}`}
                        alt="thumb"
                        className="pdx-thumb"
                      />
                    ))}
                  </div>

                 <div className="pdx-main-image">
 
    {data.productImage?.map((img, i) => (
      <img
        key={i}
        src={`${process.env.REACT_APP_API_URL}/${img}`}
        alt="product"
      />
    ))}

</div>


                </div>
                <div className="pdx-features">
                  <div className="text-center"> 
                 
                    <TbTruckDelivery className="fs-2" />
                    <p>20+ Min  Delivered</p>
                  </div>
                  <div className="text-center">
                   
                    <TbMapPinCode className="fs-2"  />
                    <p>
                      Pincodes
                    </p>
                     </div>

                  <div className="text-center">
                     <TbTruckDelivery className="fs-2" />
                    <p>620+ Cities Same-day Delivery</p>
                    </div>
                </div>
              </div>
            </div>

            {/* RIGHT DETAILS SECTION */}
            <div className="col-lg-7">
              <div className="pdx-right-scroll">

                <div className="pdx-title-row">
                  <span className="pdx-badge">EGGLESS</span>
                  <h1>{data.productName}</h1>

<div
  className={`wishlist-icon ${isWishlisted ? "active" : ""}`}
  onClick={handleWishlist}
  role="button"
  aria-label="Add to wishlist"
>
  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
</div>

                
                </div>

                <div className="pdx-price">₹ {Math.round(price)}</div>

                {/* WEIGHT */}
                <div className="pdx-block">
                  <div className="pdx-block-head">
                    <span>Weight</span>
                    <small>Serving Info ⓘ</small>
                  </div>

                  <div className="pdx-weight-group">
                    {data.Variant?.map((v) => (
                      <button
                        key={v._id}
                        className={`pdx-weight-btn ${activeWeight === v.weight.sizeweight ? "active" : ""
                          }`}
                        onClick={() => handleWeightSelection(v.weight.sizeweight)}
                      >
                        {v.weight.sizeweight}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FLAVOUR */}
                <div className="pdx-block">
                  <label>Select Flavour</label>
                  <select className="form-select w-75">
                    <option>Butterscotch</option>
                    <option>Chocolate</option>
                    <option>Vanilla</option>
                  </select>
                </div>

                {/* NAME */}
                <div className="pdx-block">
                  <label>
                    Name on Cake <small>0 / 25</small>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Write Name Here"
                    maxLength={25}
                  />
                </div>

                {/* ADDONS */}
                {/* RECOMMENDED ADDONS */}
                <div className="pdx-block">
                  <h6 className="pdx-addon-title">Recommended Addon Products</h6>

                  <div className="pdx-addon-slider">
                    <Slider {...addonSliderSettings}>
                      {[1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div key={index} className="pdx-addon-slide">
                          <div className="pdx-addon-card">
                            <img src={pic1} alt="addon" />
                            <p className="pdx-addon-name">Birthday Cap</p>
                            <span className="pdx-addon-price">₹ 99</span>
                            <button className="pdx-addon-btn">ADD</button>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>


                <div>
                  <div className="locationHead">
                    <div>
                      <b>Select Area / Location</b>
                    </div>
                    <div className="locationIconSec">
                      <FaLocationCrosshairs />
                      <button
  type="button"
  className="btn btn-link p-0"
>
  Use My Location
</button>

                    </div>
                  </div>


                  <div>


                  </div>
                </div>


                <div className="offers-wrapper">
                  {/* Header */}
                  <div className="offers-header" onClick={() => setOpen(!open)}>
                    <div className="offers-title">
                      <span className="gear-icon">⚙</span>
                      <h6>Offers Available</h6>
                    </div>
                    <span className={`arrow ${open ? "open" : ""}`}>⌃</span>
                  </div>

                  {/* Dropdown Content */}
                  {open && (
                    <div className="offers-body">
                      <div className="offer-card">
                        <div className="offer-left">
                         <SiPaytm className="fs-2 text-primary" />
                          <p>Assured cashback upto ₹300 using Paytm UPI</p>
                        </div>
                        <span className="tc">T&amp;C*</span>
                      </div>

                      <div className="offer-card">
                        <div className="offer-left">
                         <FaGooglePay  className="fs-2 text-success" />
                          <p>Get upto Rs.100 Cashback on transaction via Google Pay wallet</p>
                        </div>
                        <span className="tc">T&amp;C*</span>
                      </div>

                      <div className="offer-card ">
                        <div className="offer-left">
                        <FaCcMastercard className="fs-2 text-secondary"  />
                          <p>Get upto Rs.100 Cashback on transaction via FaCcMastercard </p>
                        </div>
                        <span className="tc">T&amp;C*</span>
                      </div>

                      <div className="offer-card">
                        <div className="offer-left">
                          <span className="discount-icon">✽</span>
                          <p>
                            Flat 15% off on orders above Rs.1499, for first time users;
                            Code: <b>NEW15</b>
                          </p>
                        </div>
                        <span className="tc">T&amp;C*</span>
                      </div>
                    </div>
                  )}


                </div>

                {/* Description */}
                <div className="description-box">
                  <h6>Description</h6>
                  <p>
                    Turn your little one s special day into a joyful celebration with this
                    Bluey-themed cake. Inspired by the much-loved cartoon, it features
                    adorable edible toppers of Bluey and friends, making it a treat that s
                    as fun to look at as it is to eat. The soft sponge layers are filled
                    with rich flavour, beautifully frosted, and decorated with colourful
                    details that capture the playful spirit of the show.
                  </p>
                </div>



                <RecommendedPopup open={openPopup}
                  onClose={() => setOpenPopup(false)}
                />

                {/* CTA */}
                <div className="pdx-cta">  
                  <button className="pdx-cart" onClick={() => addToCart(true)} >ADD TO CART</button>
                  <button className="pdx-buy" onClick={() => setOpenPopup(true)}>
                    BUY NOW | ₹ {Math.round(price)}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>




      {/* Related Products Section */}
      <section className="relatedProducts">
        <hr style={{ marginTop: "5px", marginBottom: "5px" }} />
        <div className="container">
          <h2 className="mb-0">Related Products</h2>
        </div>
        <AllProducts />
      </section>
    </>
  );
};

export default ProductDetails;
