import React, { useState, useEffect } from "react";
import "./recommendedPopup.css";
import pic1 from "../../images/pic/Product1.avif"
import pic2 from "../../images/pic/Product2.avif"
import pic3 from "../../images/pic/Product3.avif"
import pic4 from "../../images/pic/Product4.avif"
import pic5 from "../../images/pic/Product1.avif"

const dummyProducts = [
  { id: 1, name: "Birthday Card", price: 129, img: pic1, category: "Cards" },
  { id: 2, name: "Teddy With Chocolates", price: 550, img: pic2, category: "Teddy" },
  { id: 3, name: "Cake Topper", price: 99, img: pic3, category: "Cakes" },
  { id: 4, name: "Number Candle", price: 79, img: pic4, category: "Cakes" },
  { id: 5, name: "Party Poppers", price: 249, img: pic5, category: "Popular" },
  { id: 6, name: "Red Roses", price: 399, img: pic1, category: "Flowers" },
  { id: 7, name: "Dark Chocolates", price: 299, img: pic2, category: "Chocolates" },
];

const categories = ["Popular", "Cakes", "Flowers", "Cards", "Teddy", "Chocolates"];

const RecommendedPopup = ({ open, onClose }) => {
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState("Popular");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  if (!open) return null;

  const addItem = (id) => setCart({ ...cart, [id]: 1 });
  const increment = (id) => setCart({ ...cart, [id]: cart[id] + 1 });

  const decrement = (id) => {
    if (cart[id] === 1) {
      const updated = { ...cart };
      delete updated[id];
      setCart(updated);
    } else {
      setCart({ ...cart, [id]: cart[id] - 1 });
    }
  };

  const filteredProducts =
    activeCategory === "Popular"
      ? dummyProducts
      : dummyProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="rp-overlay">
      <div className="rp-container">

        {/* HEADER */}
        <div className="rp-header">
          <h3>Add More Fun To Celebration</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* CATEGORY BAR */}
        <div className="rp-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`rp-category ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCTS GRID */}
        <div className="rp-grid">
          {filteredProducts.map((p) => (
            <div className="rp-card" key={p.id}>
              <img src={p.img} alt={p.name} />
              <h6>{p.name}</h6>
              <p>₹ {p.price}</p>

              {!cart[p.id] ? (
                <button className="rp-add-btn" onClick={() => addItem(p.id)}>
                  Add
                </button>
              ) : (
                <div className="rp-qty">
                  <button onClick={() => decrement(p.id)}>−</button>
                  <span>{cart[p.id]}</span>
                  <button onClick={() => increment(p.id)}>+</button>
                </div>
              )}
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <p className="rp-empty">No items available</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="rp-footer">
          <button className="rp-skip" onClick={onClose}>Skip</button>
          <button className="rp-continue">CONTINUE</button>
        </div>

      </div>
    </div>
  );
};

export default RecommendedPopup;
