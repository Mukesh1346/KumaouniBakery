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
const [addonCart, setAddonCart] = useState({});



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


const addAddon = (addon) => {
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

  setAddonCart(prev => ({
    ...prev,
    [addon._id]: (prev[addon._id] || 0) + 1
  }));
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
          slidesToShow: 1,
        },
      },
    ],
  };


const incrementAddon = (id) => {
  const { cart, index } = getOrCreateMainCartItem();

  const addons = cart[index].addonProducts;

  const addonIndex = addons.findIndex(a => a.productId === id);

  if (addonIndex > -1) {
    addons[addonIndex].quantity += 1;

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Quantity increased",
      showConfirmButton: false,
      timer: 1000
    });
  }

  sessionStorage.setItem("cart", JSON.stringify(cart));

  setAddonCart(prev => ({
    ...prev,
    [id]: prev[id] + 1
  }));
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

  setAddonCart(prev => {
    const updated = prev[id] - 1;

    if (updated <= 0) {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    }

    return { ...prev, [id]: updated };
  });
};


  // Fetch product data by name
  const getApiData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:7000/api/get-product-by-name/${name}`
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

  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  const productIndex = cart.findIndex(
    item => item.productId === data._id && item.weight === activeWeight
  );

  // 🔴 REMOVE
  if (productIndex > -1) {
    cart.splice(productIndex, 1);

    sessionStorage.setItem("cart", JSON.stringify(cart));

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "info",
      title: "Product removed from cart ❌",
      showConfirmButton: false,
      timer: 1500
    });

    return;
  }

  // 🟢 ADD
  const { cart: updatedCart, index } = getOrCreateMainCartItem();

  updatedCart[index].quantity += 1;

  sessionStorage.setItem("cart", JSON.stringify(updatedCart));

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Product added to cart 🛒",
    showConfirmButton: false,
    timer: 1500
  });
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


useEffect(() => {
  if (!activeWeight) return;

  const mainCart = JSON.parse(sessionStorage.getItem("cart")) || [];

  const mainProduct = mainCart.find(
    item => item.productId === data._id && item.weight === activeWeight
  );

  if (mainProduct?.addonProducts?.length) {
    const existingAddons = {};

    mainProduct.addonProducts.forEach(addon => {
      existingAddons[addon.productId] = addon.quantity;
    });

    setAddonCart(existingAddons);
  } else {
    setAddonCart({});
  }

}, [data, activeWeight]);




  const settings = {
    customPaging: function (i) {
      return (
        <button
          type="button"
          className="p-0 border-0 bg-transparent"
        >
          <img
            src={`http://localhost:7000/${data.productImage?.[i]}`}
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
                          src={`http://localhost:7000/${imagePath}`}
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
                        src={`http://localhost:7000/${data?.productImage[imageIndex]?.replace(/\\/g, "/")}`}
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
                  {data.eggless ? <span className="pdx-badge"> 100% EGGLESS </span> : ''}
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
                    {/* <small>Serving Info ⓘ</small> */}
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
                {/* RECOMMENDED ADDONS */}
                <div className="pdx-block">
                  <h6 className="pdx-addon-title">Recommended Addon Products</h6>

                  <div className="pdx-addon-slider">
                   <Slider {...addonSliderSettings}>
  {data?.recommendedProductId?.map((item, index) => (
    <div key={index}>
      <div className="rp-card">
        <img
          src={`http://localhost:7000/${item?.productImage?.[0]?.replace(/\\/g, "/")}`}
          alt={item?.productName}
        />
        <h6>{item?.productName}</h6>
        <p>₹ {item?.price}</p>

        {!addonCart[item._id] ? (
          <button
            className="rp-add-btn"
            onClick={() => addAddon(item)}
          >
            Add
          </button>
        ) : (
          <div className="rp-qty">
            <button onClick={() => decrementAddon(item._id)}>−</button>
            <span>{addonCart[item._id]}</span>
            <button onClick={() => incrementAddon(item._id)}>+</button>
          </div>
        )}
      </div>
    </div>
  ))}
</Slider>

                  </div>
                </div>

                {/* <div>
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
                </div> */}

                <LocationOption/>
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
                
                  />
                </div>
                <div className="pdx-cta">
                 <button
  className={`pdx-cart ${isMainProductAdded() ? "remove" : ""}`}
  onClick={addToCart}
>
  {isMainProductAdded() ? "REMOVE FROM CART" : "ADD TO CART"}
</button>

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
