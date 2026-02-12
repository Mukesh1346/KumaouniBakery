import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick";
import "./productDetails.css";
import AllProducts from "../../Components/AllProducts/AllProducts";
import axios from "axios";
import Swal from "sweetalert2";
import Pic1 from "../../images/pic/redVelvet.jpg"
import { FaLocationCrosshairs } from "react-icons/fa6";
import RecommendedPopup from "../../Components/RecommendedPopup/RecommendedPopup";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { TbMapPinCode } from "react-icons/tb";

const ProductDetails = () => {
  const loginvalue = sessionStorage.getItem("login");

  const { name } = useParams();
  const [data, setData] = useState({});
  const [activeWeight, setActiveWeight] = useState(null);
  const [price, setPrice] = useState(0);
  const [eggOption, setEggOption] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [imageIndex, setImageIndex] = useState(0)
  const [massage, setMassage] = useState("")

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
        `https://api.ssdipl.com/api/get-product-by-name/${name}`
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getOrCreateMainCartItem = () => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    let index = cart.findIndex(
      item => item.productId === data._id && item.weight === activeWeight
    );

    // If not exist → create
    if (index === -1) {
      const newItem = {
        productId: data?._id,
        name: data.productName,
        weight: activeWeight,
        price: price,
        massage: massage,
        quantity: 1,
        image: data?.productImage?.[0],
        deliveryDate,
        eggOption,
        addonProducts: [],
      };
      cart.push(newItem);
      index = cart.length - 1;
    }

    return { cart, index };
  };

  const addToCart = () => {
    const hasWeight = data.Variant?.some(v => v?.weight?.sizeweight);

    if (hasWeight && !activeWeight) {
      Swal.fire("Select Weight", "Please select cake weight", "warning");
      return;
    }

    if (!deliveryDate) {
      Swal.fire("Select Delivery Date", "Please select delivery date", "warning");
      return;
    }

    const { cart, index } = getOrCreateMainCartItem();

    cart[index].quantity += 1;

    sessionStorage.setItem("cart", JSON.stringify(cart));
    setOpenPopup(true);
  };

  const addAddonToCart = (addon) => {
    if (!activeWeight) {
      Swal.fire("Select Weight", "Please select cake weight first", "warning");
      return;
    }

    const { cart, index } = getOrCreateMainCartItem();

    const addons = cart[index].addonProducts;

    const addonIndex = addons.findIndex(a => a.productId === addon._id);

    if (addonIndex > -1) {
      addons[addonIndex].quantity += 1;
    } else {
      addons.push({
        productId: addon._id,
        name: addon.productName,
        price: addon.price,
        image: addon.productImage?.[0],
        quantity: 1,
      });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    Swal.fire("Added!", "Addon added successfully", "success");
  };

  const isAddonAdded = (addonId) => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const main = cart.find(
      item => item.productId === data._id && item.weight === activeWeight
    );

    return main?.addonProducts?.some(a => a.productId === addonId);
  };

  const isMainProductAdded = () => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    return cart.some(
      item => item.productId === data._id && item.weight === activeWeight
    );
  };

  const handleBuyNow = () => {
    const { cart } = getOrCreateMainCartItem();
    sessionStorage.setItem("cart", JSON.stringify(cart));
    setOpenPopup(true);
  };

  const settings = {
    customPaging: function (i) {
      return (
        <button
          type="button"
          className="p-0 border-0 bg-transparent"
        >
          <img
            src={`https://api.ssdipl.com/${data.productImage?.[i]}`}
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
  console.log("SSSSSS::=>", data?.recommendedProductId)
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
                <div className="d-flex pdxImg">

                  {/* Thumbnails */}
                  <div className="pdx-thumb-column">
                    {data?.productImage?.map((img, i) => {
                      const imagePath = img.replace(/\\/g, "/");

                      return (
                        <img
                          key={i}
                          src={`https://api.ssdipl.com/${imagePath}`}
                          alt="thumb"
                          className={`pdx-thumb ${imageIndex === i ? "active-thumb" : ""}`}
                          onClick={() => setImageIndex(i)}
                        />
                      );
                    })}
                  </div>

                  {/* Main Image */}
                  <div className="pdx-main-image">
                    {data?.productImage?.length > 0 && (
                      <img
                        src={`https://api.ssdipl.com/${data?.productImage[imageIndex]?.replace(/\\/g, "/")}`}
                        alt="product"
                      />
                    )}
                  </div>

                </div>

                <div className="pdx-features">
                  <div className="text-center">

                    <TbTruckDelivery className="fs-2" />
                    <p>20+ Min  Delivered</p>
                  </div>
                  <div className="text-center">

                    <TbMapPinCode className="fs-2" />
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
                <div className="pdx-block formInput">
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
                    Name on Cake <small>{massage?.length} / 25</small>
                  </label>
                  <input
                    type="text"
                    value={massage}
                    onChange={(e) => setMassage(e.target.value)}
                    className="form-control formInput w-75"
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
                      {data?.recommendedProductId?.map((item, index) => (
                        <div key={index} className="pdx-addon-slide">
                          <div className="pdx-addon-card">
                            <img src={`https://api.ssdipl.com/${item?.productImage}`} alt="addon" />
                            <p className="pdx-addon-name ">{item?.productName || 'Birthday Cap'}</p>
                            <span className="pdx-addon-price">₹ {item?.price}</span>
                            <button
                              className={`pdx-addon-btn ${isAddonAdded(item._id) ? "added" : ""}`}
                              onClick={() => addAddonToCart(item)}
                            >
                              {isAddonAdded(item._id) ? "✔ Added" : "ADD"}
                            </button>
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



                <RecommendedPopup productId={data._id} open={openPopup}
                  onClose={() => setOpenPopup(false)}
                />

                {/* CTA */}

                {/* DELIVERY DATE */}
                <div className="pdx-block">
                  <label>
                    Delivery Date <span className="text-danger">*</span>
                  </label>

                  <input
                    type="date"
                    className="form-control w-75"
                    value={deliveryDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                </div>

                <div className="pdx-cta">
                  {/* <button className="pdx-cart" onClick={addToCart}>ADD TO CART</button> */}
                  <button
                    className={`pdx-cart ${isMainProductAdded() ? "added" : ""}`}
                    onClick={addToCart}
                  >
                    {isMainProductAdded() ? "✔ Added To Cart" : "ADD TO CART"}
                  </button>
                  {/* <button className="pdx-buy" onClick={() => setOpenPopup(true)}>
                    BUY NOW | ₹ {Math.round(price)}
                  </button> */}

                  <button className="pdx-buy" onClick={handleBuyNow}>
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
