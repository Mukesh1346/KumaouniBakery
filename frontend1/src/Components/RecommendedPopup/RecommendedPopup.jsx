import React, { useState, useEffect } from "react";
import "./recommendedPopup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecommendedPopup = ({ open, onClose, productId }) => {
  const loginvalue = sessionStorage.getItem("login");
  const [cart, setCart] = useState({});
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  /* 🔒 Lock scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  /* 📦 Load Categories */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "http://localhost:7000/api/recommended-category/get-recommended-category"
        );
        if (res.status === 200 && res.data.data.length) {
          setCategory(res.data.data);
          setActiveCategory(res.data.data[0]._id);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  /* 🛍 Load Products by Category */
  useEffect(() => {
    if (!activeCategory) return;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:7000/api/recommended-product/get-product-by-category/${activeCategory}`
        );
        if (res.status === 200) setProduct(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  useEffect(() => {
    if (!open) return;

    const mainCart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const mainProduct = mainCart.find(item => item.productId === productId);

    if (mainProduct?.addonProducts?.length) {
      const existingAddons = {};

      mainProduct.addonProducts.forEach(addon => {
        existingAddons[addon.productId] = addon.quantity;
      });

      setCart(existingAddons); // 🔥 THIS syncs quantities
    } else {
      setCart({});
    }
  }, [open, productId]);

  if (!open) return null;

  const getMainProductIndex = (cart) => {
    return cart.findIndex(item => item.productId === productId);
  };


  /* 🛒 CART LOGIC */
  const addItem = (id) => setCart((p) => ({ ...p, [id]: 1 }));

  const increment = (id) => setCart((p) => ({ ...p, [id]: p[id] + 1 }));

  const decrement = (id) => {
    setCart((p) => {
      if (p[id] === 1) {
        const copy = { ...p };
        delete copy[id];
        return copy;
      }
      return { ...p, [id]: p[id] - 1 };
    });
  };


  /* 🚀 Continue */
  const handleContinue = () => {
    let mainCart = JSON.parse(sessionStorage.getItem("cart")) || [];

    let mainIndex = getMainProductIndex(mainCart);

    // ❗ If main product not in cart, create it first
    if (mainIndex === -1) {
      mainCart.push({
        productId,
        name: "Main Product",
        quantity: 1,
        addonProducts: [],
      });
      mainIndex = mainCart.length - 1;
    }

    const addonList = mainCart[mainIndex].addonProducts || [];

    Object.entries(cart).forEach(([id, qty]) => {
      const prod = product.find(p => p._id === id);
      if (!prod) return;

      const existingAddonIndex = addonList.findIndex(a => a.productId === id);

      if (existingAddonIndex > -1) {
        addonList[existingAddonIndex].quantity += qty;
      } else {
        addonList.push({
          productId: id,
          name: prod.productName,
          price: prod.price,
          image: prod.productImage[0],
          quantity: qty,
        });
      }
    });

    mainCart[mainIndex].addonProducts = addonList;

    sessionStorage.setItem("cart", JSON.stringify(mainCart));

    onClose();
    loginvalue ? navigate("/checkout") : navigate("/login");
  };

  // const handleContinue = () => {

  //   const mainCart = JSON.parse(sessionStorage.getItem("cart")) || [];

  //   Object.entries(cart).forEach(([id, qty]) => {
  //     const prod = product.find((p) => p._id === id);
  //     if (!prod) return;

  //     mainCart.push({
  //       id: `addon-${id}`,
  //       name: prod.productName,
  //       price: prod.price,
  //       quantity: qty,
  //       image: prod.productImage[0],
  //       isAddon: true,
  //     });
  //   });

  //   sessionStorage.setItem("cart", JSON.stringify(mainCart));
  //   onClose();
  //   loginvalue ? navigate("/checkout") : navigate("/login");
  // };

  return (
    <div className="rp-overlay">
      <div className="rp-container">

        <div className="rp-header">
          <h3>Add More Fun To Celebration</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* CATEGORY BAR */}
        <div className="rp-categories">
          {category.map((cat) => (
            <button
              key={cat._id}
              className={`rp-category ${activeCategory === cat._id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat._id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        <div className="rp-grid">
          {product.map((p) => (
            <div className="rp-card" key={p._id}>
              <img src={`http://localhost:7000/${p?.productImage[0]}`} alt={p?.productName} />
              <h6>{p.productName}</h6>
              <p>₹ {p.price}</p>

              {!cart[p._id] ? (
                <button className="rp-add-btn" onClick={() => addItem(p._id)}>
                  Add
                </button>
              ) : (
                <div className="rp-qty">
                  <button onClick={() => decrement(p._id)}>−</button>
                  <span>{cart[p._id]}</span>
                  <button onClick={() => increment(p._id)}>+</button>
                </div>
              )}
            </div>
          ))}

          {product.length === 0 && <p className="rp-empty">No items available</p>}
        </div>

        <div className="rp-footer">
          <button className="rp-skip" onClick={onClose}>Skip</button>
          <button className="rp-continue" onClick={handleContinue}>
            CONTINUE
          </button>
        </div>

      </div>
    </div>
  );
};

export default RecommendedPopup;
