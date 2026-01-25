import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./orderTracking.css";

const OrderTracking = () => {
  return (
    <>
      {/* ================= TOP BLACK BAR ================= */}
      <div className="top-bar">
        <div className="container d-flex justify-content-between">
          <div className="top-links">
            <span>Start Selling</span>
            <span>Help Center</span>
            <span>Download App</span>
          </div>
          <div className="lang">English</div>
        </div>
      </div>

      {/* ================= HEADER ================= */}
      <div className="main-header">
        <div className="container header-inner">
          <div className="logo">∞</div>

          <div className="search-box">
            <input type="text" placeholder='Try "Nike Air Jordan"' />
          </div>

          <div className="header-right">
            <span>🔔</span>
            <span>🛒 2 Items</span>
            <span className="user">Emir Abiyyu</span>
          </div>
        </div>
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div className="container order-container">

        {/* TITLE */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Order Detail</h3>
          <span className="status-badge">On Deliver</span>
        </div>

        <p className="text-muted">
          Order ID <b>#8981786</b>
        </p>

        {/* ================= TRACKING SUMMARY ================= */}
        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card-box">
              <h6>Be patient, package on deliver!</h6>

              <div className="route">
                <span>Malang, Indonesia</span>
                <span className="dots">··············</span>
                <span>Emir’s House, Indonesia</span>
              </div>

              <div className="progress mt-3">
                <div className="progress-bar"></div>
              </div>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="card-box center">
              <p>Estimated Arrival</p>
              <h5>9 July 2024</h5>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="card-box center">
              <p>Delivered In</p>
              <h5>5 Days</h5>
            </div>
          </div>
        </div>

        {/* ================= TIMELINE & SHIPMENT ================= */}
        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card-box">
              <h6>Timeline</h6>

              <div className="timeline active">
                <p className="date">4 Jul (Now) · 06:00</p>
                <p>Your package is packed by the courier</p>
                <span>Malang, East Java, Indonesia</span>
              </div>

              <div className="timeline">
                <p className="date">2 Jul · 06:00</p>
                <p>Shipment has been created</p>
                <span>Malang, Indonesia</span>
              </div>

              <div className="timeline">
                <p className="date">1 Jul · 06:00</p>
                <p>Order placed</p>
                <span>Nike Official Store</span>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card-box">
              <h6>Shipment</h6>

              <div className="ship-row">
                <span>Courier</span>
                <b>Doordash Indonesia</b>
              </div>

              <div className="ship-row">
                <span>Recipient</span>
                <b>Emir</b>
              </div>

              <div className="ship-row">
                <span>Delivery Address</span>
                <b>Malang, East Java, Indonesia</b>
              </div>

              <div className="ship-row">
                <span>Tracking No.</span>
                <b>871291892812</b>
              </div>
            </div>
          </div>
        </div>

        {/* ================= ITEMS ================= */}
        <div className="card-box mb-4">
          <h6>Items (4)</h6>

          <div className="row g-3">
            {[
              "Nike Air Max SYSTM",
              "Nike Air Rift",
              "Nike Air Max Pulse",
              "Nike Air Max Air"
            ].map((name, index) => (
              <div className="col-md-6" key={index}>
                <div className="item-card">
                  <div className="item-img"></div>
                  <div>
                    <p className="fw-semibold mb-1">{name}</p>
                    <p className="price">Rp 2,379,000</p>
                    <small>Size: 24</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ORDER SUMMARY ================= */}
        <div className="card-box">
          <div className="d-flex justify-content-between mb-3">
            <h6>Order Summary</h6>
            <span className="payment-success">Payment Success</span>
          </div>

          <div className="summary-row">
            <span>Total</span>
            <b>Rp 7,890,000</b>
          </div>

          <div className="text-end mt-4">
            <button className="btn btn-outline-secondary me-2">
              Contact Seller
            </button>
            <button className="btn btn-dark">Invoice</button>
          </div>
        </div>

      </div>
    </>
  );
};

export default OrderTracking;
