import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./orderTracking.css";
import logo from "../../images/pic/logo.png";
import axios from "axios";

const OrderTracking = () => {
  const user = sessionStorage.getItem("userId");
  const [orderData, setOrderData] = useState([]);

  /* ================= FETCH ORDERS ================= */
  useEffect(() => {
    const fetchOrderByUser = async () => {
      try {
        const res = await axios.get(
          `https://api.ssdipl.com/api/checkout/user/${user}`
        );
        setOrderData(res.data.data || []);
      } catch (e) {
        console.log(e);
      }
    };

    if (user) fetchOrderByUser();
  }, [user]);
  console.log("DD::=>", orderData)
  return (
    <>
      {/* ================= HEADER ================= */}
      <div className="main-header">
        <div className="container header-inner">
          <div className="logo">
            <img src={logo} className="logoImg" alt="Cake Logo" />
          </div>
          <div className="header-right">
            <span className="user">My Orders</span>
          </div>
        </div>
      </div>

      {/* ================= ORDERS ================= */}
      {orderData.map((order) => {
        const items = order.cartItems || [];

        const totalItems = items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        const deliveryDate = order.delivery?.date || "N/A";
        const deliveryTime = order.delivery?.time || "N/A";

        return (
          <div className="container order-container mb-5" key={order._id}>
            {/* TITLE */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>Order Details</h4>
              <span className="status-badge">
                {order.orderStatus}
              </span>
            </div>

            <p className="text-muted idSec">
              Order ID <b>#CK{order._id.slice(-6).toUpperCase()}</b>
            </p>

            {/* ================= DELIVERY SUMMARY ================= */}
            <div className="row g-4 mb-4">
              <div className="col-lg-6">
                <div className="card-box">
                  <h6>Your cake is on the way 🍰</h6>

                  <div className="route">
                    <span>Cake Npetals Bakery To</span>
                    <span className="dots">{order.address}</span>
                  </div>

                  <div className="progress mt-3">
                    <div className="progress-bar"></div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card-box center">
                  <p>Estimated Delivery</p>
                  <b>{deliveryDate}</b>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card-box center">
                  <p>Delivery Time</p>
                  <b>{deliveryTime}</b>
                </div>
              </div>
            </div>

            {/* ================= DELIVERY INFO ================= */}
            <div className="row g-4 mb-4">
              <div className="col-lg-6">
                <div className="card-box">
                  <h6>Delivery Information</h6>

                  <div className="ship-row">
                    <span>Recipient</span>
                    <b>{order.name}</b>
                  </div>

                  <div className="ship-row">
                    <span>Phone</span>
                    <b>{order.phone}</b>
                  </div>

                  <div className="ship-row">
                    <span>City</span>
                    <b>{order.city}</b>
                  </div>

                  <div className="ship-row">
                    <span>Total Items</span>
                    <b>{totalItems}</b>
                  </div>

                  <div className="ship-row">
                    <span>Payment Mode</span>
                    <b>{order.paymentMode.toUpperCase()}</b>
                  </div>

                  <div className="ship-row">
                    <span>Payment Status</span>
                    <b>{order.paymentStatus}</b>
                  </div>
                </div>
              </div>

              {/* TIMELINE (Static UI but dynamic status) */}
              <div className="col-lg-6">
                <div className="card-box">
                  <h6>Order Timeline</h6>

                  {order?.trackingOrders?.map((track) => <div className="timeline active">
                    <p className="date">
                      {track?.date
                        ? `${new Date(track.date).toLocaleDateString("en-GB").replace(/\//g, "-")} 
                            ${new Date(track.date).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}`
                        : ""}
                    </p>

                    <p>{track?.status}</p>
                    <span>{track?.massage}</span>
                  </div>)}

                </div>
              </div>
            </div>

            {/* ================= ORDERED ITEMS ================= */}
            <div className="card-box mb-4">
              <h6>Ordered Items ({totalItems})</h6>

              <div className="row g-3">
                {items.map((item, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="item-card">
                      <div className="item-img">
                        <img
                          src={`https://api.ssdipl.com/${item.image.replace(
                            /\\/g,
                            "/"
                          )}`}
                          alt={item.name}
                          className="productImg"
                        />
                      </div>

                      <div>
                        <p className="fw-semibold title mb-1">
                          {item.name}
                        </p>

                        <p className="price">
                          ₹ {item?.price * item?.quantity}
                        </p>

                        <small>Weight: {item?.weight}</small>
                        <br />
                        <small>Qty: {item?.quantity}</small>

                        {/* ADDONS */}
                        {item.addonProducts?.length > 0 && (
                          <div className="mt-2">
                            <small className="text-muted">
                              Addon Products:
                            </small>

                            {item?.addonProducts?.map((addon, i) => (
                              <div key={i}>
                                🎁 {addon?.name} × {addon?.quantity}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= ORDER SUMMARY ================= */}
            <div className="w-50">
              <div className="card-box orderBox">
                <div className="d-flex justify-content-between mb-3">
                  <h6>Order Summary</h6>
                  <span
                    className={
                      order.paymentStatus === "Paid"
                        ? "payment-success"
                        : "text-warning"
                    }
                  >
                    {order.paymentStatus}
                  </span>
                </div>

                <div className="summary-row">
                  <span>Total Amount</span>
                  <b>₹ {order.totalPrice}</b>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {orderData.length === 0 && (
        <div className="container text-center mt-5">
          <h5>No Orders Found</h5>
        </div>
      )}
    </>
  );
};

export default OrderTracking;
