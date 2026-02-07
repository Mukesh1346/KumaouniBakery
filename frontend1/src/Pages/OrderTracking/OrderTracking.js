import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./orderTracking.css";
import logo from "../../images/pic/logo.png";
import cakeImg from "../../images/pic/Product1.avif";

const OrderTracking = () => {
  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="main-header">
        <div className="container header-inner">
          <div className="logo">
            <img src={logo} className="logoImg" alt="Cake Logo" />
          </div>

          <div className="search-box">
            <input type="text" placeholder='Search "Chocolate Cake"' />
          </div>

          <div className="header-right">
            <span>🔔</span>
            <span>🛒 2 Items</span>
            <span className="user">Mukesh</span>
          </div>
        </div>
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div className="container order-container">
        {/* TITLE */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Order Details</h4>
          <span className="status-badge">Out for Delivery</span>
        </div>

        <p className="text-muted idSec">
          Order ID <b>#CK102398</b>
        </p>

        {/* ================= DELIVERY SUMMARY ================= */}
        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card-box">
              <h6>Your cake is on the way 🍰</h6>

              <div className="route">
                <span>Cake Crazzy Bakery</span>
                <span className="dots">··············</span>
                <span>Your Address</span>
              </div>

              <div className="progress mt-3">
                <div className="progress-bar"></div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card-box center">
              <p>Estimated Delivery</p>
              <b>Today, 7:30 PM</b>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card-box center">
              <p>Delivery Time</p>
              <b>Within 2 Hours</b>
            </div>
          </div>
        </div>

        {/* ================= TIMELINE & DELIVERY INFO ================= */}
        <div className="row g-4 mb-4">

           <div className="col-lg-6">
            <div className="card-box">
              <h6>Delivery Information</h6>

              <div className="ship-row">
                <span>Delivery Partner</span>
                <b>Cake Crazzy Delivery</b>
              </div>

              <div className="ship-row">
                <span>Recipient</span>
                <b>Mukesh</b>
              </div>

              <div className="ship-row">
                <span>Delivery Address</span>
                <b>Delhi, India</b>
              </div>

              <div className="ship-row">
                <span>Order Number</span>
                <b>CK102398</b>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card-box">
              <h6>Order Timeline</h6>

              <div className="timeline active">
                <p className="date">Today · 05:45 PM</p>
                <p>Your cake is out for delivery</p>
                <span>Nearest Delivery Hub</span>
              </div>

              <div className="timeline">
                <p className="date">Today · 04:30 PM</p>
                <p>Cake prepared & packed</p>
                <span>Cake Crazzy Bakery</span>
              </div>

              <div className="timeline">
                <p className="date">Today · 03:15 PM</p>
                <p>Order placed successfully</p>
                <span>Online Store</span>
              </div>
            </div>
          </div>

         
        </div>

        {/* ================= ORDERED ITEMS ================= */}
        <div className="card-box mb-4">
          <h6>Cake Items (2)</h6>

          <div className="row g-3">
            {[
              "Chocolate Truffle Cake",
              "Red Velvet Cake"
            ].map((cake, index) => (
              <div className="col-md-6" key={index}>
                <div className="item-card">
                  <div className="item-img">
                    <img src={cakeImg} alt={cake} className="productImg" />
                  </div>
                  <div>
                    <p className="fw-semibold title mb-1">{cake}</p>
                    <p className="price">₹ 899</p>
                    <small>Weight: 1 Kg</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ORDER SUMMARY ================= */}
       <div className="w-50">
         <div className="card-box  orderBox">
          <div className="d-flex justify-content-between mb-3">
            <h6>Order Summary</h6>
            <span className="payment-success">Payment Successful</span>
          </div>

          <div className="summary-row">
            <span>Total Amount</span>
            <b>₹ 1,798</b>
          </div>

          <div className="text-end mt-4">
            <button className="btn btn-outline-secondary me-2">
              Contact Support
            </button>
            <button className="btn btn-dark">
              Download Invoice
            </button>
          </div>
        </div>
       </div>
      </div>
    </>
  );
};

export default OrderTracking;
