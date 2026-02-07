import React, { useState, useEffect, useMemo } from "react";
import "./checkout.css";

const Checkout = () => {
  /* ================= STEP ================= */
  const [step, setStep] = useState(2);

  /* ================= CART ================= */
  const [cartItems, setCartItems] = useState([]);

  /* ================= CHECKOUT DATA ================= */
  const [checkoutData, setCheckoutData] = useState({
    user: {
      userId: "USER123",
      name: "Mukesh Mahar",
      phone: "7827433992",
      email: "mukeshmahar00@gmail.com",
      address: "C-28 New Ashok Nagar Noida",
    },
    address: {},
    delivery: {},
    cart: [],
  });

  /* ================= LOAD & NORMALIZE CART ================= */
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const normalizedCart = storedCart.map((item) => ({
      ...item,
      quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
    }));

    setCartItems(normalizedCart);
  }, []);

  /* ================= GUARD: EMPTY CART ================= */
  useEffect(() => {
    if (cartItems.length === 0) {
      console.warn("Checkout opened with empty cart");
    }
  }, [cartItems]);

  /* ================= TOTAL (SAFE) ================= */
  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  /* ================= HANDLERS ================= */

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    setCheckoutData((prev) => ({
      ...prev,
      address: {
        receiverName: e.target.receiverName.value,
        house: e.target.house.value,
        area: e.target.area.value,
        pincode: e.target.pincode.value,
        city: e.target.city.value,
        phone: e.target.phone.value,
        addressType: "Home",
      },
    }));

    setStep(3);
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();

    setCheckoutData((prev) => ({
      ...prev,
      delivery: {
        date: e.target.date.value,
        time: e.target.time.value,
      },
      cart: cartItems,
    }));

    setStep(4);
  };

  const placeOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const finalPayload = {
      ...checkoutData,
      cart: cartItems,
      totalAmount,
      paymentMode: "COD",
    };

    console.log("FINAL PAYLOAD (SEND TO BACKEND):", finalPayload);

    alert("Order placed successfully 🎉");

    sessionStorage.removeItem("cart");
  };

  return (
    <>
      {/* ================= USER INFO ================= */}
      <div className="container mt-4">
        <div className="login-box">
          <div className="row">
            <div className="col-md-3">
              <small>Full name</small>
              <p>{checkoutData.user.name}</p>
            </div>
            <div className="col-md-3">
              <small>Phone Number</small>
              <p>{checkoutData.user.phone}</p>
            </div>
            <div className="col-md-3">
              <small>E-Mail ID</small>
              <p>{checkoutData.user.email}</p>
            </div>
            <div className="col-md-3">
              <small>Address</small>
              <p>{checkoutData.user.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CHECKOUT ================= */}
      <div className="checkout-wrapper">
        <div className="container">
          <div className="row">

            {/* STEPS */}
            <div className="col-lg-3 mb-4">
              <div className="steps-box">
                <div className={`step ${step >= 1 ? "active" : ""}`}>
                  Login Details <span>Step 1/5</span>
                </div>
                <div className={`step ${step >= 2 ? "active" : ""}`}>
                  Delivery Address <span>Step 2/5</span>
                </div>
                <div className={`step ${step >= 3 ? "active" : ""}`}>
                  Delivery Date & Time <span>Step 3/5</span>
                </div>
                <div className={`step ${step >= 4 ? "active" : ""}`}>
                  Payment & Summary <span>Step 4/5</span>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="col-lg-9">

              {/* STEP 2 */}
              {step === 2 && (
                <form className="checkout-card" onSubmit={handleAddressSubmit}>
                  <h4>
                    Awesome Mukesh!{" "}
                    <span>Let us know where to deliver</span>
                  </h4>

                  <input name="receiverName" className="form-control mb-3" placeholder="Receiver Name*" required />
                  <input name="house" className="form-control mb-3" placeholder="House / Flat*" required />
                  <input name="area" className="form-control mb-3" defaultValue="Asthal Colony, Bawana" />

                  <div className="row">
                    <div className="col-md-6">
                      <input name="pincode" className="form-control mb-3" defaultValue="110039" required />
                    </div>
                    <div className="col-md-6">
                      <input name="city" className="form-control mb-3" defaultValue="Delhi" />
                    </div>
                  </div>

                  <input name="phone" className="form-control mb-3" placeholder="Receiver Phone*" required />

                  <button className="continue-btn">Continue</button>
                </form>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <form className="checkout-card" onSubmit={handleDeliverySubmit}>
                  <h4>Delivery Date & Time</h4>

                  <input type="date" name="date" className="form-control mb-3" required />

                  <select name="time" className="form-control mb-4" required>
                    <option value="">Select Time Slot</option>
                    <option>10AM - 12PM</option>
                    <option>12PM - 2PM</option>
                    <option>4PM - 6PM</option>
                  </select>

                  <button className="continue-btn">Continue to Payment</button>
                </form>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="checkout-card">
                  <h4>Order Summary</h4>

                  {cartItems.map((item, i) => (
                    <div key={i} className="summary-row">
                      <span>
                        {item.name}
                        {item.weight && ` (${item.weight})`}
                        {item.isAddon && " 🎁"} × {item.quantity}
                      </span>
                      <span>₹ {item.price * item.quantity}</span>
                    </div>
                  ))}

                  <hr />

                  <div className="summary-row total">
                    <strong>Total</strong>
                    <strong>₹ {totalAmount}</strong>
                  </div>

                  <button className="continue-btn" onClick={placeOrder}>
                    Place Order
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
