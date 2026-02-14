import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Cart.css";
import pic1 from '../../images/pic/vanilla.jpg'

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const loginvalue = sessionStorage.getItem("login");

  /* ================= LOAD CART ================= */
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const normalizedCart = storedCart.map(item => ({
      ...item,
      quantity: item.quantity ? item.quantity : 1,
    }));
    setCartItems(normalizedCart);
  }, []);

  const getUniqueId = (id, weight) => `${id}-${weight || "addon"}`;

  /* ================= QUANTITY ================= */
  const handleIncrement = (id, weight) => {
    const updated = cartItems.map(item =>
      getUniqueId(item.id, item.weight) === getUniqueId(id, weight)
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updated);
    sessionStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleDecrement = (id, weight) => {
    const updated = cartItems.map(item =>
      getUniqueId(item.id, item.weight) === getUniqueId(id, weight) &&
        item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updated);
    sessionStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleRemove = (id, weight) => {
    const updated = cartItems.filter(
      item => getUniqueId(item.id, item.weight) !== getUniqueId(id, weight)
    );
    setCartItems(updated);
    sessionStorage.setItem("cart", JSON.stringify(updated));
  };

  /* ================= CALCULATIONS ================= */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryCharge = subtotal > 0 ? 0 : 0; // can change later
  const grandTotal = subtotal + deliveryCharge;

  /* ================= NAVIGATION ================= */
  const handleCheckout = () => {
    if (!loginvalue) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="container-fluid shopping-bag-wrapper">
      <div className="row">

        {/* LEFT SIDE */}
        <div className="col-lg-8">
          <h4 className="bag-title">MY SHOPPING BAG</h4>

          {cartItems.length === 0 && (
            <div className="empty-cart">
              <p>Your cart is empty 🛒</p>
            </div>
          )}

          {cartItems.map(item => (
            <div
              className="bag-item"
              key={getUniqueId(item.id, item.weight)}
            >
              <img src={`http://localhost:7000/${item?.image}`} alt={item?.name} className="bag-img" />

              <div className="bag-info">
                <h6>
                  {item?.name} {item?.isAddon && <span className="addon-badge">🎁 Addon</span>}
                </h6>

                {!item?.isAddon && item.weight && (
                  <p className="text-muted">Weight: {item.weight}</p>
                )}

                {item.deliveryDate && (
                  <p className="text-muted">
                    Delivery: {item.deliveryDate}
                  </p>
                )}

                <div className="qty-box">
                  <button onClick={() => handleDecrement(item.id, item.weight)} className="cartDecBtn">−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrement(item.id, item.weight)} className="cartIncBtn">+</button>
                </div>

                <span
                  className="remove-btn"
                  onClick={() => handleRemove(item.id, item.weight)}
                >
                  REMOVE
                </span>
              </div>

              <div className="bag-price">
                ₹ {item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-4">
          <div className="summary-box">
            <h6>ORDER SUMMARY</h6>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹ {subtotal}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>{deliveryCharge === 0 ? "FREE" : `₹ ${deliveryCharge}`}</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>Grand Total</span>
              <span>₹ {grandTotal}</span>
            </div>

            <button
              className="checkout-btn"
              disabled={cartItems.length === 0}
              onClick={handleCheckout}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
