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
import LocationOption from "../../Components/LocationOption/LocationOption";
import { useNavigate } from "react-router-dom";


const ProductDetails = () => {
  const loginvalue = sessionStorage.getItem("login");
  const user = sessionStorage.getItem("userId");
  const navigate = useNavigate()
  const { name } = useParams();
  const [data, setData] = useState({});
  const [activeWeight, setActiveWeight] = useState(null);
  const [price, setPrice] = useState(0);
  const [eggOption, setEggOption] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [imageIndex, setImageIndex] = useState(0)
  const [massage, setMassage] = useState("")
  const [cartItems, setCartItems] = useState([]);
  const [isAdded, setIsAdded] = useState(false);
  const [isServiceAvailable, setIsServiceAvailable] = useState(false);

  const updateServiceStatus = (status) => {
    setIsServiceAvailable(status); // This changes parent state
    console.log("Service status updated:", status);
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



  // Fetch product data by name
  const getApiData = async () => {
    try {
      const res = await axios.get(
        `https://api.ssdipl.com/api/get-product-by-name/${name}`
      );
      const productData = res.data.data;
      setData(productData);

      // if (productData?.Variant?.length > 0) {
      //   setPrice(productData.Variant[0].finalPrice);

      //   setActiveWeight(productData?.Variant[0]?.weight);
      //   const selectedVariant = data.Variant?.find(
      //     (variant) => variant?.weight?.sizeweight === productData?.Variant[0]?.weight
      //   );

      //   if (selectedVariant) {
      //     setPrice(selectedVariant.finalPrice);
      //   }

      // }

      if (productData?.Variant?.length > 0) {
        const firstVariant = productData.Variant[0];

        setActiveWeight(firstVariant?.weight?.sizeweight);
        setPrice(firstVariant?.finalPrice);
      }

    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getApiData();
  }, [name]);

  // Load cart from session storage
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // Check if product is in cart whenever activeWeight or cartItems change
  useEffect(() => {
    if (activeWeight && data._id) {
      const productInCart = cartItems.some(
        item => item.productId === data._id && item.weight === activeWeight
      );
      setIsAdded(productInCart);
    } else {
      setIsAdded(false);
    }
  }, [activeWeight, cartItems, data._id]);

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
    // Check if service is available first
    if (!isServiceAvailable && !isAdded) {
      Swal.fire({
        icon: "warning",
        title: "Service Area Required",
        text: "Please check delivery availability for your location first.",
        timer: 2000
      });
      return;
    }

    const hasWeight = data.Variant?.some(v => v?.weight?.sizeweight);

    if (hasWeight && !activeWeight) {
      Swal.fire("Select Weight", "Please select cake weight first", "warning");
      return;
    }

    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    if (isAdded) {
      // REMOVE
      cart = cart.filter(
        item => !(item.productId === data._id && item.weight === activeWeight)
      );

      sessionStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      setIsAdded(false);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Product removed from cart",
        showConfirmButton: false,
        timer: 1200
      });

    } else {
      // ADD
      const newItem = {
        productId: data._id,
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

      sessionStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart);
      setIsAdded(true);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Product added to cart",
        showConfirmButton: false,
        timer: 1200
      });
    }
  };

  const addAddon = (addon) => {
    // Check if service is available first
    if (!isServiceAvailable && !isAdded) {
      Swal.fire({
        icon: "warning",
        title: "Service Area Required",
        text: "Please check if we deliver to your location first",
        timer: 2000
      });
      return;
    }

    if (!activeWeight) {
      Swal.fire("Select Weight", "Please select cake weight first", "warning");
      return;
    }

    const { cart, index } = getOrCreateMainCartItem();

    const addons = cart[index].addonProducts;

    const existingIndex = addons.findIndex(a => a.productId === addon._id);

    if (existingIndex > -1) {
      addons[existingIndex].quantity += 1;
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
    setCartItems(cart); // Update state

    // Show success message
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `${addon.productName} added to cart`,
      showConfirmButton: false,
      timer: 1000
    });
  };

  const incrementAddon = (id) => {
    const { cart, index } = getOrCreateMainCartItem();

    const addons = cart[index].addonProducts;

    const addonIndex = addons.findIndex(a => a.productId === id);

    if (addonIndex > -1) {
      addons[addonIndex].quantity += 1;

      sessionStorage.setItem("cart", JSON.stringify(cart));
      setCartItems(cart); // Update state to reflect changes

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Quantity increased",
        showConfirmButton: false,
        timer: 1000
      });
    }
  };

  const decrementAddon = (id) => {
    const { cart, index } = getOrCreateMainCartItem();

    let addons = cart[index].addonProducts;

    const addonIndex = addons.findIndex(a => a.productId === id);

    if (addonIndex > -1) {
      addons[addonIndex].quantity -= 1;

      if (addons[addonIndex].quantity <= 0) {
        addons.splice(addonIndex, 1);
      }
    }

    cart[index].addonProducts = addons;

    sessionStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart); // Update state to reflect changes
  };

  const getAddonQuantity = (addonId) => {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const mainProduct = cart.find(
      item =>
        item.productId === data._id &&
        item.weight === activeWeight
    );

    const addon = mainProduct?.addonProducts?.find(
      a => a.productId === addonId
    );

    return addon?.quantity || 0;
  };

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
          slidesToShow: 2,
        },
      },
    ],
  };

  const handleBuyNow = () => {
    // Check if service is available first
    if (!isServiceAvailable && !isAdded) {
      Swal.fire({
        icon: "warning",
        title: "Service Area Required",
        text: "Please check delivery availability for your location first.",
        timer: 2000
      });
      return;
    }

    const hasWeight = data.Variant?.some(v => v?.weight?.sizeweight);
    if (hasWeight && !activeWeight) {
      Swal.fire("Select Weight", "Please select cake weight first", "warning");
      return;
    }

    const { cart } = getOrCreateMainCartItem();
    sessionStorage.setItem("cart", JSON.stringify(cart));
    setCartItems(cart);
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

  return (
    <>
      {/* Breadcrumb Section */}
      <section className="breadCrumb">
        <div className="breadCrumbContent">
          {/* <h1>Product Details</h1> */}
          <Link to="/" style={{ color: "#df4444" }}>Home /</Link>{" "}
          <Link to="" style={{ color: "#df4444" }}>{data?.categoryName?.mainCategoryName} /</Link>{" "}
          <Link to="">{data?.productName}</Link>
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
                  <div className="pdx-main-images">
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
                    <p>20+ Min Delivered</p>
                  </div>
                  <div className="text-center">
                    <TbMapPinCode className="fs-2" />
                    <p>Pincodes</p>
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
                  {data.eggless ? <span className="pdx-badge"> 100% EGGLESS </span> : ''}
                  <h1>{data.productName}</h1>

                  <div
                    className={`wishlist-icon ${wishlist?.includes(data?._id) ? "active" : ""}`}
                    onClick={() => toggleWishlist(data?._id)}
                    role="button"
                    aria-label="Add to wishlist"
                  >{wishlist?.includes(data?._id) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                    {/* {isWishlisted ? <FaHeart /> : <FaRegHeart />} */}
                  </div>
                </div>

                <div className="pdx-price">₹ {Math?.round(price)}</div>

                {/* WEIGHT */}
                <div className="pdx-block">
                  <div className="pdx-block-head">
                    <span>Weight</span>
                  </div>

                  <div className="pdx-weight-group">
                    {data.Variant?.map((v) => (
                      <button
                        key={v?._id}
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
                  <select className="form-select  inputfield">
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
                    className="form-control formInput  inputfield"
                    placeholder="Write Name Here"
                    maxLength={25}
                  />
                </div>

                {/* DELIVERY DATE */}
                <div className="pdx-block">
                  <label>
                    Delivery Date <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-control  inputfield"
                    value={deliveryDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>

                {/* RECOMMENDED ADDONS */}
                {data?.recommendedProductId?.length > 0 && (
                  <div className="pdx-block">
                    <h6 className="pdx-addon-title">Recommended Addon Products</h6>

                    <div className="pdx-addon-slider">
                      <Slider {...addonSliderSettings}>
                        {data?.recommendedProductId?.map((item, index) => {
                          const addonQuantity = getAddonQuantity(item._id);

                          return (
                            <div key={index}>
                              <div className="rp-card">
                                <img
                                  src={`https://api.ssdipl.com/${item?.productImage?.[0]?.replace(/\\/g, "/")}`}
                                  alt={item?.productName}
                                />
                                <h6>{item?.productName}</h6>
                                <p>₹ {item?.price}</p>

                                {addonQuantity === 0 ? (
                                  <button
                                    className="rp-add-btn"
                                    onClick={() => addAddon(item)}
                                  // disabled={!isServiceAvailable || !activeWeight}
                                  // style={{
                                  //   opacity: (!isServiceAvailable || !activeWeight) ? 0.5 : 1,
                                  //   cursor: (!isServiceAvailable || !activeWeight) ? 'not-allowed' : 'pointer'
                                  // }}
                                  >
                                    Add
                                  </button>
                                ) : (
                                  <div className="rp-qty">
                                    <button
                                      onClick={() => decrementAddon(item._id)}
                                      disabled={!isServiceAvailable}
                                      style={{
                                        opacity: !isServiceAvailable ? 0.5 : 1,
                                        cursor: !isServiceAvailable ? 'not-allowed' : 'pointer'
                                      }}
                                    >
                                      −
                                    </button>
                                    <span>{addonQuantity}</span>
                                    <button
                                      onClick={() => incrementAddon(item._id)}
                                      disabled={!isServiceAvailable}
                                      style={{
                                        opacity: !isServiceAvailable ? 0.5 : 1,
                                        cursor: !isServiceAvailable ? 'not-allowed' : 'pointer'
                                      }}
                                    >
                                      +
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </Slider>
                    </div>

                    {/* Show message if weight not selected */}
                    {!activeWeight && isServiceAvailable && (
                      <div className="weight-warning-message">
                        ⚠️ Please select cake weight to add addons
                      </div>
                    )}
                  </div>
                )}

                <LocationOption onServiceChange={updateServiceStatus} />

                {/* Service Availability Warning */}
                {/* {!isServiceAvailable && (
                  <div className="service-warning-message">
                    ⚠️ Please check service availability before adding to cart
                  </div>
                )} */}

                {data?.productDetails &&
                  <div className="description-box" style={{ marginBottom: '12px', borderRadius: '13px 13px 0px 0px' }}>
                    <h6>Product Contains</h6>
                    <p>
                      {new DOMParser()
                        .parseFromString(data.productDetails || "", "text/html")
                        .body.textContent}
                    </p>
                  </div>
                }

                {/* Description */}
                {data?.productDescription && <div className="description-box" style={{ marginBottom: '12px', borderRadius: '13px 13px 0px 0px' }}>
                  <h6>Description</h6>
                  <p>
                    {new DOMParser()
                      .parseFromString(data.productDescription || "", "text/html")
                      .body.textContent}
                  </p>
                </div>}

                <RecommendedPopup
                  productId={data._id}
                  open={openPopup}
                  onClose={() => setOpenPopup(false)}
                />

                <div className="pdx-cta">
                  <button
                    className={`pdx-cart ${isAdded ? "remove" : ""}`}
                    onClick={addToCart}
                  // disabled={!isServiceAvailable}
                  // style={{
                  //   opacity: !isServiceAvailable ? 0.6 : 1,
                  //   cursor: !isServiceAvailable ? 'not-allowed' : 'pointer'
                  // }}
                  >
                    {isAdded ? "REMOVE FROM CART" : "ADD TO CART"}
                  </button>
                  <button
                    className="pdx-buy"
                    onClick={handleBuyNow}
                  // disabled={!isServiceAvailable}
                  // style={{
                  //   opacity: !isServiceAvailable ? 0.6 : 1,
                  //   cursor: !isServiceAvailable ? 'not-allowed' : 'pointer'
                  // }}
                  >
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
          <h2 className="mb-0 MainTitle">Related Products</h2>
        </div>
        <AllProducts />
      </section>
    </>
  );
};

export default ProductDetails;