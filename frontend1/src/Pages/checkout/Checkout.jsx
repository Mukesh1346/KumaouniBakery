import React, { useState } from "react";

import "./checkout.css";

const Checkout = () => {
  // step: 2 = delivery address (as per image)
  const [step, setStep] = useState(2);

  const [checkoutData, setCheckoutData] = useState({
    user: {
      userId: "USER123",
      name: "Mukesh Mahar",
      phone: "7827433992",
      email: "mukeshmahar00@gmail.com",
      address:"C-28 New Ashok Nagar Noida"
    },
    address: {},
    delivery: {},
    payment: {},
  });

  /* ================= HANDLERS ================= */

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    setCheckoutData({
      ...checkoutData,
      address: {
        receiverName: e.target.receiverName.value,
        house: e.target.house.value,
        area: e.target.area.value,
        pincode: e.target.pincode.value,
        city: e.target.city.value,
        phone: e.target.phone.value,
        addressType: "Home",
      },
    });

    setStep(3);
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();

    setCheckoutData({
      ...checkoutData,
      delivery: {
        date: e.target.date.value,
        time: e.target.time.value,
      },
    });

    setStep(4);
  };

  const placeOrder = () => {
    const finalPayload = checkoutData;
    console.log("FINAL PAYLOAD (SEND TO BACKEND):", finalPayload);
    alert("Order placed successfully");
  };

  return (
    <>
      {/* ================= LOGIN DETAILS (TOP – NOT A TAB) ================= */}
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

      {/* ================= MAIN CHECKOUT ================= */}
      <div className="checkout-wrapper">
        <div className="container">
          <div className="row">
            {/* LEFT STEPS (DISPLAY ONLY) */}
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

            {/* RIGHT CONTENT */}
            <div className="col-lg-9">
              {/* STEP 2 — DELIVERY ADDRESS */}
              {step === 2 && (
                <form className="checkout-card" onSubmit={handleAddressSubmit}>
                  <h4>
                    Awesome Mukesh mahar!{" "}
                    <span>Let us know where to deliver</span>
                  </h4>
                  <p>
                    A detailed address will help us deliver the parcel smoothly
                  </p>

                  <input
                    name="receiverName"
                    className="form-control mb-3"
                    placeholder="Receiver Name*"
                    required
                  />

                  <input
                    name="house"
                    className="form-control mb-3"
                    placeholder="Apartment / House No. / Floor*"
                    required
                  />

                  <input
                    name="area"
                    className="form-control mb-3"
                    defaultValue="Asthal Colony, Bawana"
                  />

                  <div className="row">
                    <div className="col-md-6">
                      <input
                        name="pincode"
                        className="form-control mb-3"
                        defaultValue="110039"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        name="city"
                        className="form-control mb-3"
                        defaultValue="Delhi"
                      />
                    </div>
                  </div>

                  <input
                    name="phone"
                    className="form-control mb-3"
                    placeholder="Receiver Number*"
                    required
                  />

                  <div className="address-type">
                    <button type="button" className="type-btn active">
                      Home
                    </button>
                    <button type="button" className="type-btn">
                      Office
                    </button>
                    <button type="button" className="type-btn">
                      Others
                    </button>
                  </div>

                  <button className="continue-btn">Continue</button>
                </form>
              )}

              {/* STEP 3 — DELIVERY DATE */}
              {step === 3 && (
                <form className="checkout-card" onSubmit={handleDeliverySubmit}>
                  <h4>Delivery Date & Time</h4>

                  <input
                    type="date"
                    name="date"
                    className="form-control mb-3"
                    required
                  />

                  <select
                    name="time"
                    className="form-control mb-4"
                    required
                  >
                    <option value="">Select Time Slot</option>
                    <option>10AM - 12PM</option>
                    <option>12PM - 2PM</option>
                    <option>4PM - 6PM</option>
                  </select>

                  <button className="continue-btn">
                    Continue to Payment
                  </button>
                </form>
              )}

              {/* STEP 4 — PAYMENT */}
              {step === 4 && (
                <div className="checkout-card">
                  <h4>Payment</h4>
                  <p>Cash on Delivery / Online Payment</p>

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





// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import axios from "axios";
// import Swal from "sweetalert2";
// import "./checkout.css";

// const CheckOut = () => {
//   const navigate = useNavigate(); // Initialize useNavigate
//   const userid = sessionStorage.getItem("userId");
//   const [cartItems, setCartItems] = useState([]);
//   const [formData, setFormData] = useState({
//     userId: userid,
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     state: "",
//     city: "",
//     pin: "",
//     totalPrice: 0,
//     paymentMode: "online",
//   });

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
//     setCartItems(storedCart);
//     setFormData((prevData) => ({
//       ...prevData,
//       cartItems: storedCart,
//       totalPrice: calculateTotal(storedCart),
//     }));
//   }, []);

//   const calculateTotal = (items) => {
//     const subtotal = items.reduce(
//       (acc, item) => acc + item.price * item.quantity,
//       0
//     );
//     const shipping = subtotal < 500 ? 50 : 0;
//     return subtotal + shipping;
//   };

//   const handlePlaceOrder = async () => {
//     if (formData.paymentMode === "online") initiateOnlinePayment();
//     else submitOrder();
//   };

//   const initiateOnlinePayment = async () => {
//     try {
//       const response = await axios.post(
//         `${process.env.REACT_APP_API_URL}/api/checkout`,
//         formData
//       );
//       //console.log(response);
//       const { razorpayOrderId, amount, currency } = response.data;
//       console.log(amount);
//       console.log(razorpayOrderId);
//       console.log(currency);
//       const options = {
//         key: "rzp_test_XPcfzOlm39oYi8",
//         amount,
//         currency,
//         name: "Crazy Cake",
//         description: "Order Payment",
//         order_id: razorpayOrderId,
//         handler: async (paymentResponse) => {
//           try {
//             const verifyResponse = await axios.post(
//               "${process.env.REACT_APP_API_URL}/api/verify-payment",
//               {
//                 razorpay_payment_id: paymentResponse.razorpay_payment_id,
//                 razorpay_order_id: paymentResponse.razorpay_order_id,
//                 razorpay_signature: paymentResponse.razorpay_signature,
//               }
//             );
//             if (
//               verifyResponse.data.message ===
//               "Payment successful and order confirmed."
//             ) {
//               Swal.fire("Success", "Payment Successful!", "success");
//               sessionStorage.removeItem("cart");
//               setCartItems([]);
//               navigate("/success", {
//                 state: {
//                   paymentStatus: "online",
//                   orderId: response.data.orderId,
//                 },
//               });
//             } else {
//               Swal.fire("Error", "Payment verification failed!", "error");
//             }
//           } catch (error) {
//             console.error("Verification error:", error);
//             Swal.fire("Error", "Error verifying payment!", "error");
//           }
//         },
//         prefill: {
//           name: formData.name,
//           email: formData.email,
//           contact: formData.phone,
//         },
//         theme: {
//           color: "#F37254",
//         },
//       };

//       const razorpayInstance = new window.Razorpay(options);
//       razorpayInstance.open();
//     } catch (error) {
//       console.error("Payment initiation error:", error);
//       Swal.fire(
//         "Error",
//         "Error initiating payment. Please try again.",
//         "error"
//       );
//     }
//   };

//   const submitOrder = async () => {
//     try {
//       const response = await axios.post(
//         "${process.env.REACT_APP_API_URL}/api/checkout",
//         formData
//       );
//       if (response.status === 200) {
//         Swal.fire("Success", "Order placed successfully!", "success");
//         sessionStorage.removeItem("cart");
//         setCartItems([]);
//         navigate("/success", {
//           state: { paymentStatus: "cod", orderId: response.data.orderId },
//         });
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       Swal.fire(
//         "Error",
//         "Failed to place the order. Please try again.",
//         "error"
//       );
//     }
//   };

//   return (
//     <section className="checkoutPage">
//       <div className="checkout-container">
//         <div className="checkout-form">
//           <h2>Checkout</h2>
//           <form>
//             <div className="form-group">
//               <label>Full name</label>
//               <input
//                 type="text"
//                 placeholder="Full name"
//                 value={formData.name}
//                 onChange={(e) =>
//                   setFormData({ ...formData, name: e.target.value })
//                 }
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Email address</label>
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={(e) =>
//                   setFormData({ ...formData, email: e.target.value })
//                 }
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Phone number</label>
//               <input
//                 type="tel"
//                 placeholder="+91 123 456 7890"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//                 required
//               />
//             </div>
//             <div className="form-row">
//               <div className="form-group">
//                 <label>State</label>
//                 <input
//                   type="text"
//                   placeholder="State"
//                   value={formData.state}
//                   onChange={(e) =>
//                     setFormData({ ...formData, state: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>City</label>
//                 <input
//                   type="text"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={(e) =>
//                     setFormData({ ...formData, city: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label>Pin Code</label>
//                 <input
//                   type="text"
//                   placeholder="Pin Code"
//                   value={formData.pin}
//                   onChange={(e) =>
//                     setFormData({ ...formData, pin: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//             </div>
//             <div className="form-group">
//               <label>Address</label>
//               <textarea
//                 name="address"
//                 value={formData.address}
//                 onChange={(e) =>
//                   setFormData({ ...formData, address: e.target.value })
//                 }
//                 placeholder="Address"
//               ></textarea>
//             </div>
//             <div className="terms">
//               <label>
//                 <input type="checkbox" required /> I have read and agree to the
//                 Terms and Conditions.
//               </label>
//             </div>
//           </form>
//         </div>
//         {cartItems.length > 0 ? (
//           <div className="cart-review">
//             <h2>Review your cart</h2>
//             {cartItems.length > 0 ? (
//               <table className="cart-table">
//                 <thead>
//                   <tr>
//                     <th>Product Image</th>
//                     <th>Product Name</th>
//                     <th>Weight</th>
//                     <th>Price</th>
//                     <th>Quantity</th>
//                     <th>Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {cartItems.map((item) => (
//                     <tr key={`${item.id}-${item.weight}`}>
//                       <td>
//                         <img
//                           src={`${process.env.REACT_APP_API_URL}/${item.image}`}
//                           alt={item.name}
//                           style={{ height: 50 }}
//                         />
//                       </td>
//                       <td className="carttext">{item.name}</td>
//                       <td>{item.weight}</td>
//                       <td>₹{item.price}</td>
//                       <td>{item.quantity}</td>
//                       <td>₹{(item.price * item.quantity).toFixed(2)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             ) : (
//               <p>Your cart is empty.</p>
//             )}
//             <div className="totals">
//               {/* <p>Subtotal: ₹{formData.totalPrice.toFixed(2)}</p> */}
//               <p>Shipping: ₹{formData.totalPrice < 500 ? 50 : 0}</p>
//               <h3>Total: ₹{formData.totalPrice.toFixed(2)}</h3>
//             </div>
//             <h5>Choose Payment Method</h5>
//             <div className="form-group">
//               <select
//                 value={formData.paymentMode}
//                 onChange={(e) =>
//                   setFormData({ ...formData, paymentMode: e.target.value })
//                 }
//               >
//                 <option value="online">Online Payment</option>
//                 <option value="cod">Cash on Delivery</option>
//               </select>
//             </div>
//             <button
//               className="checkout-btn"
//               type="button"
//               onClick={handlePlaceOrder}
//             >
//               Place Order
//             </button>
//           </div>
//         ) : null}
//       </div>
//     </section>
//   );
// };

// export default CheckOut;
