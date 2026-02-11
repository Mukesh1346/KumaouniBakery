import React, { useState, useEffect, useMemo } from "react";
import "./checkout.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";

const Checkout = () => {
  /* ================= STEP ================= */
  const [step, setStep] = useState(2);

  /* ================= CART ================= */
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState({});

  /* ================= CHECKOUT DATA ================= */
  const [checkoutData, setCheckoutData] = useState({
    user: {
      userId: userData?.userId || "USER123",
      name: userData?.name || "Mukesh Mahar",
      phone: userData?.phone || "7827433992",
      email: userData?.email || "mukeshmahar00@gmail.com",
      address: userData?.address || "C-28 New Ashok Nagar Noida",
    },
    address: {},
    delivery: {},
    cart: [],
  });

  /* ================= LOAD & NORMALIZE CART ================= */
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const token = sessionStorage.getItem("token") || [];

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCheckoutData((prev) => ({ ...prev, user: decoded }));
        setUserData(decoded);
        console.log("Decoded Token:==>", decoded);
      } catch (err) {
        console.error("Invalid token");
      }
    }

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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  // const placeOrder = async () => {
  //   if (cartItems.length === 0) {
  //     alert("Your cart is empty");
  //     return;
  //   }

  //   const finalPayload = {
  //     ...checkoutData,
  //     cart: cartItems,
  //     totalAmount,
  //     paymentMode: "online",
  //   };
  //   if (finalPayload.paymentMode === "cod") {
  //     try {
  //       const res = await axios.post(
  //         'https://api.ssdipl.com/api/checkout', finalPayload
  //       )
  //       console.log("resres==>", res.data.data);
  //       if (res.status === 200) {
  //         alert("Order placed successfully 🎉");
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   } else {
  //     const scriptLoaded = await loadRazorpayScript();
  //     if (!scriptLoaded) {
  //       toast.error("Failed to load Razorpay script. Please try again.");
  //       return;
  //     }

  //     const res = await axios.post('https://api.ssdipl.com/api/checkout', finalPayload)
  //     console.log("data==>", res?.data ,res?.data);
  //     const data = res?.data;

  //     const options = {
  //       key: 'rzp_test_TmsfO3hloFEA31',
  //       amount: data?.amount,
  //       currency: "INR",
  //       name: "Cake Npetals",
  //       description: "Payment for your Cake Npetals order",
  //       image: "https://res.cloudinary.com/dfet60ou1/image/upload/v1747043182/logo_nkf8jp.webp",
  //       order_id: data?.razorpayOrderId || "E77EE&7E",

  //       handler: async function (response) {
  //         try {
  //           console.log("XXXXXX::=>" , response)
  //           const verifyData = await axios.post(
  //             "https://api.ssdipl.com/api/verify-payment",
  //             {
  //               razorpay_order_id: response?.razorpay_order_id,
  //               razorpay_payment_id: response?.razorpay_payment_id,
  //               razorpay_signature: response?.razorpay_signature,
  //             }
  //           );
  //           console.log("DD::=>verifyData", verifyData)
  //           if (verifyData?.data?.success) {
  //             toast.success("Payment verified. Order confirmed!");
  //           } else {
  //             toast.error("Payment verification failed.");
  //           }
  //         } catch (verifyError) {
  //           console.error("Verification error:", verifyError);
  //           toast.error("Payment verification failed. Try again.");
  //         }
  //       },
  //       prefill: {
  //         name: finalPayload?.receiverName || "",
  //         email: finalPayload?.email || "",
  //         contact: finalPayload?.phone || "",
  //       },
  //       theme: {
  //         color: "#153964",
  //       },
  //     };

  //     const rzp = new window.Razorpay(options);
  //     rzp.open();

  //   }
  //   console.log("FINAL PAYLOAD (SEND TO BACKEND):=>", finalPayload);

  //   // sessionStorage.removeItem("cart");
  // };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const finalPayload = {
      ...checkoutData,
      cart: cartItems,
      totalAmount,
      paymentMode: "cod", // 🔥 must match backend enum
    };

    try {
      /* ================= COD ================= */
      if (finalPayload.paymentMode === "cod") {
        const res = await axios.post(
          "https://api.ssdipl.com/api/checkout",
          finalPayload
        );

        if (res.status === 200) {
          toast.success("Order placed successfully 🎉");
          sessionStorage.removeItem("cart");
          window.location.href = "/";
        }
        return;
      }

      /* ================= ONLINE ================= */
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment gateway failed to load");
        return;
      }

      const res = await axios.post(
        "https://api.ssdipl.com/api/checkout",
        finalPayload
      );
      const { razorpayOrderId, amount, currency } = res.data;

      if (!razorpayOrderId) {
        toast.error("Payment order creation failed");
        return;
      }

      console.log("XXXXXXX::=>", res)
      const options = {
        key: "rzp_test_TmsfO3hloFEA31",
        amount: 1000, // already in paise
        currency,
        name: "Cake Npetals",
        description: "Payment for your Cake Npetals order",
        image: "https://res.cloudinary.com/dfet60ou1/image/upload/v1747043182/logo_nkf8jp.webp",
        order_id: razorpayOrderId, // ✅ correct ID

        handler: async function (response) {
          console.log("XXXXXXX::=>", response)
          try {
            const verifyRes = await axios.post(
              "https://api.ssdipl.com/api/verify-payment",
              response
            );
            console.log("XXXXXXX::=>", verifyRes)
            if (verifyRes.data.success) {
              toast.success("Payment Successful 🎉");
              sessionStorage.removeItem("cart");
              window.location.href = "/order-success";
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Verification error");
          }
        },

        prefill: {
          name: finalPayload?.receiverName || "",
          email: finalPayload?.email || "",
          contact: finalPayload?.phone || "",
        },

        theme: { color: "#153964" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      toast.error("Order failed. Please try again.");
    }
  };



  const handleChange = (e) => {
    setCheckoutData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  console.log("SSXXXSSS==>", checkoutData);
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
              <p>{checkoutData.user.phone || '-'}</p>
            </div>
            <div className="col-md-3">
              <small>E-Mail ID</small>
              <p>{checkoutData.user.email || '-'}</p>
            </div>
            <div className="col-md-3">
              <small>Address</small>
              <p>{checkoutData.user.address || '-'}</p>
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
                    Awesome {checkoutData?.user?.name}!{" "}
                    <span>Let us know where to deliver</span>
                  </h4>

                  <input name="receiverName" value={checkoutData.receiverName} onChange={handleChange} className="form-control mb-3" placeholder="Receiver Name*" required />
                  <input name="house" value={checkoutData.house} onChange={handleChange} className="form-control mb-3" placeholder="House / Flat*" required />
                  <input name="area" value={checkoutData.area} onChange={handleChange} className="form-control mb-3" defaultValue="Asthal Colony, Bawana" />

                  <div className="row">
                    <div className="col-md-6">
                      <input name="pincode" value={checkoutData.pincode} onChange={handleChange} className="form-control mb-3" defaultValue="110039" required />
                    </div>
                    <div className="col-md-6">
                      <input name="city" value={checkoutData.city} onChange={handleChange} className="form-control mb-3" defaultValue="Delhi" />
                    </div>
                  </div>

                  <input name="phone" value={checkoutData.phone} onChange={handleChange} className="form-control mb-3" placeholder="Receiver Phone*" required />

                  <button className="continue-btn">Continue</button>
                </form>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <form className="checkout-card" onSubmit={handleDeliverySubmit}>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}> <h4>Delivery Date & Time</h4>
                    <button
                      onClick={() => setStep(2)}
                      className="back-btn"
                    >
                      <i className="fa fa-arrow-left"></i>
                      <span>back to Address</span>
                    </button>
                  </div>

                  <input type="date" name="date" value={checkoutData.date} onChange={handleChange} className="form-control mb-3" required />

                  <select name="time" value={checkoutData.time} onChange={handleChange} className="form-control mb-4" required>
                    <option value="">Select Time Slot</option>
                    <option value={'10AM - 12PM'} >10AM - 12PM</option>
                    <option value={'12PM - 2PM'}>12PM - 2PM</option>
                    <option value={'4PM - 6PM'}>4PM - 6PM</option>
                  </select>

                  <button className="continue-btn">Continue to Payment</button>
                </form>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="checkout-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><h4>Order Summary</h4>
                    <button
                      onClick={() => setStep(3)}
                      className="back-btn"
                    >
                      <i className="fa fa-arrow-left"></i>
                      <span>back to Delivery Date & Time</span>
                    </button>
                  </div>

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
