import React, { useState, useEffect, useMemo } from "react";
import "./checkout.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import toast from "react-hot-toast";
import Swal from 'sweetalert2';

const Checkout = () => {
  /* ================= STEP ================= */
  const [step, setStep] = useState(2);

  /* ================= CART ================= */
  const [cartItems, setCartItems] = useState([]);
  const [userData, setUserData] = useState({});

  /* ================= COUPON STATE ================= */
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= CHECKOUT DATA ================= */
  const [checkoutData, setCheckoutData] = useState({
    user: {
      userId: "",
      name: "",
      phone: "",
      email: "",
      address: "",
    },
    address: {
      receiverName: "",
      house: "",
      area: "Asthal Colony, Bawana",
      pincode: "110039",
      city: "Delhi",
      phone: "",
      addressType: "Home",
    },
    delivery: {
      date: "",
      time: "",
    },
    specialNote: {
      occasion: "",
      relation: "",
      message: "",
      toName: "",
    },
    paymentMode: "online",
  });

  // Occasions and Relations Arrays
  const famousOccasions = [
    { name: 'Birthday' },
    { name: 'Anniversary' },
    { name: 'Valentines Day' },
    { name: 'Rose Day' }
  ];

  const moreOccasions = [
    { name: 'I Am Sorry' },
    { name: 'Hug Day' },
    { name: 'Propose Day' },
    { name: 'Kiss Day' },
    { name: 'Friendship Day' },
    { name: "Mother's Day" },
    { name: "Father's Day" },
    { name: 'New Year' },
    { name: 'Diwali' },
    { name: 'Christmas' },
    { name: 'Eid' },
    { name: 'Congratulations' },
    { name: 'Get Well Soon' },
    { name: 'Thank You' }
  ];

  const famousRelations = [
    { name: 'Boyfriend' },
    { name: 'Girlfriend' },
    { name: 'Wife' },
    { name: 'Husband' },
    { name: 'Mother' },
    { name: 'Father' }
  ];

  const moreRelations = [
    { name: 'Brother' },
    { name: 'Sister' },
    { name: 'Son' },
    { name: 'Daughter' },
    { name: 'Grandmother' },
    { name: 'Grandfather' },
    { name: 'New Mom' },
    { name: 'New Dad' },
    { name: 'Fiance' },
    { name: 'Fiancee' },
    { name: 'Best Friend' },
    { name: 'Colleague' },
    { name: 'Boss' },
    { name: 'Teacher' }
  ];

  /* ================= LOAD INITIAL DATA ================= */
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const token = sessionStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData(decoded);
        setCheckoutData((prev) => ({
          ...prev,
          user: {
            userId: decoded?.userId || "USER123",
            name: decoded?.name || "Mukesh Mahar",
            phone: decoded?.phone || "7827433992",
            email: decoded?.email || "mukeshmahar00@gmail.com",
            address: decoded?.address || "C-28 New Ashok Nagar Noida",
          }
        }));
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

  /* ================= COMPUTED VALUES ================= */
  const packagingCharge = 25;
  
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const totalBeforeDiscount = useMemo(() => {
    return subtotal + packagingCharge;
  }, [subtotal]);

  const totalAmount = useMemo(() => {
    return totalBeforeDiscount - couponDiscount;
  }, [totalBeforeDiscount, couponDiscount]);

  const totalSavings = useMemo(() => {
    return couponDiscount;
  }, [couponDiscount]);

  /* ================= CART HANDLERS ================= */
  const updateQuantity = (productId, action) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === productId || item.productId === productId) {
          const newQuantity = action === 'increase' 
            ? item.quantity + 1 
            : Math.max(1, item.quantity - 1);
          
          return {
            ...item,
            quantity: newQuantity
          };
        }
        return item;
      });
      
      // Update sessionStorage
      sessionStorage.setItem("cart", JSON.stringify(updatedItems));
      return updatedItems;
    });

    // Show toast notification
    toast.success(`Quantity updated`, {
      duration: 2000,
      position: 'top-right',
    });
  };

  const removeItem = (productId) => {
    Swal.fire({
      title: 'Remove Item?',
      text: 'Are you sure you want to remove this item from cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#153964',
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const itemToRemove = cartItems.find(item => 
          item.id === productId || item.productId === productId
        );
        
        setCartItems(prevItems => {
          const updatedItems = prevItems.filter(item => 
            item.id !== productId && item.productId !== productId
          );
          sessionStorage.setItem("cart", JSON.stringify(updatedItems));
          return updatedItems;
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: `${itemToRemove?.name || 'Item'} has been removed from cart.`,
          confirmButtonColor: '#153964',
        });
      }
    });
  };

  /* ================= COUPON HANDLER ================= */
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      Swal.fire({
        icon: 'warning',
        title: 'Empty Coupon',
        text: 'Please enter a coupon code',
        confirmButtonColor: '#153964',
      });
      return;
    }

    setLoadingCoupon(true);
    setCouponError("");

    try {
      const response = await axios.post("https://api.ssdipl.com/api/validate-coupon", {
        code: couponCode,
        amount: subtotal,
        cartItems: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      });

      if (response.data.valid) {
        const discount = response.data.discountAmount || 
                        (response.data.discountPercentage ? 
                         (subtotal * response.data.discountPercentage / 100) : 0);
        
        setCouponDiscount(discount);
        setAppliedCoupon({
          code: couponCode,
          type: response.data.coupon?.type || 'percentage',
          value: response.data.coupon?.value || response.data.discountPercentage,
          description: response.data.coupon?.description || 'Coupon applied'
        });

        const newTotal = totalBeforeDiscount - discount;

        Swal.fire({
          icon: 'success',
          title: '🎉 Coupon Applied Successfully!',
          html: `
            <div style="text-align: left;">
              <h4 style="color: #153964; border-bottom: 2px solid #153964; padding-bottom: 10px;">Coupon Details</h4>
              <p><strong>Coupon Code:</strong> <span style="color: #28a745;">${couponCode}</span></p>
              <p><strong>Discount:</strong> ₹${discount}</p>
              <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <div style="display: flex; justify-content: space-between;">
                  <span>Original Total:</span>
                  <span>₹${totalBeforeDiscount}</span>
                </div>
                <div style="display: flex; justify-content: space-between; color: #28a745;">
                  <span>Discount:</span>
                  <span>-₹${discount}</span>
                </div>
                <hr>
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                  <span>New Total:</span>
                  <span style="color: #153964;">₹${newTotal}</span>
                </div>
              </div>
              <p style="color: #28a745; margin-top: 10px;">You saved ₹${discount} on this order!</p>
            </div>
          `,
          confirmButtonText: 'Great!',
          confirmButtonColor: '#153964',
        });
        
        toast.success(`Coupon applied! You saved ₹${discount}`);
      } else {
        setCouponError(response.data.message || "Invalid coupon code");
        
        Swal.fire({
          icon: 'error',
          title: '❌ Invalid Coupon',
          html: `
            <div style="text-align: center;">
              <p>The coupon code <strong style="color: #dc3545;">${couponCode}</strong> is invalid or expired.</p>
              <p style="color: #6c757d;">${response.data.message || 'Please check and try again'}</p>
            </div>
          `,
          confirmButtonColor: '#153964',
        });
      }
    } catch (error) {
      setCouponError(error.response?.data?.message || "Failed to apply coupon");
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to apply coupon. Please try again.',
        confirmButtonColor: '#153964',
      });
    } finally {
      setLoadingCoupon(false);
    }
  };

  const removeCoupon = () => {
    Swal.fire({
      title: 'Remove Coupon?',
      html: `
        <div style="text-align: left;">
          <p>Are you sure you want to remove <strong style="color: #153964;">${appliedCoupon?.code}</strong> coupon?</p>
          <p style="color: #dc3545;">You will lose the discount of ₹${couponDiscount}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#153964',
      confirmButtonText: 'Yes, remove it',
      cancelButtonText: 'Keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        const oldDiscount = couponDiscount;
        const oldTotal = totalAmount;
        const newTotal = oldTotal + oldDiscount;
        
        setCouponCode("");
        setCouponDiscount(0);
        setAppliedCoupon(null);
        setCouponError("");
        
        Swal.fire({
          icon: 'success',
          title: 'Coupon Removed',
          html: `
            <div style="text-align: left;">
              <p>Coupon <strong>${appliedCoupon?.code}</strong> has been removed.</p>
              <div style="background: #f8f9fa; padding: 10px; border-radius: 5px;">
                <div style="display: flex; justify-content: space-between; color: #dc3545;">
                  <span>Discount Removed:</span>
                  <span>-₹${oldDiscount}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                  <span>New Total:</span>
                  <span>₹${newTotal}</span>
                </div>
              </div>
            </div>
          `,
          confirmButtonColor: '#153964',
        });
      }
    });
  };

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

    setStep(5);
  };

  const handleChange = (e) => {
    setCheckoutData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= PAYMENT HANDLERS ================= */
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const prepareOrderPayload = () => {
    return {
      userId: checkoutData.user.userId,
      userDetails: {
        name: checkoutData.user.name,
        email: checkoutData.user.email,
        phone: checkoutData.user.phone,
      },
      deliveryAddress: {
        receiverName: checkoutData.address.receiverName,
        house: checkoutData.address.house,
        area: checkoutData.address.area,
        pincode: checkoutData.address.pincode,
        city: checkoutData.address.city,
        phone: checkoutData.address.phone,
        addressType: checkoutData.address.addressType,
      },
      deliverySlot: {
        date: checkoutData.delivery.date,
        time: checkoutData.delivery.time,
      },
      specialNote: {
        occasion: checkoutData.specialNote.occasion,
        relation: checkoutData.specialNote.relation,
        message: checkoutData.specialNote.message,
        fromName: checkoutData.specialNote.toName,
      },
      specialInstructions: specialInstructions,
      items: cartItems.map(item => ({
        productId: item.id || item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        weight: item.weight,
        image: item.image,
        totalPrice: item.price * item.quantity
      })),
      billing: {
        subtotal: subtotal,
        packagingCharge: packagingCharge,
        totalBeforeDiscount: totalBeforeDiscount,
        discountAmount: couponDiscount,
        couponCode: appliedCoupon?.code || null,
        couponType: appliedCoupon?.type || null,
        couponValue: appliedCoupon?.value || null,
        totalSavings: totalSavings,
        finalAmount: totalAmount,
      },
      paymentMode: checkoutData.paymentMode,
      orderDate: new Date().toISOString(),
    };
  };

  const showOrderConfirmation = (orderDetails) => {
    const savingsText = orderDetails.billing.discountAmount > 0 
      ? `<p style="color: #28a745;"><strong>You Saved:</strong> ₹${orderDetails.billing.discountAmount} with coupon ${orderDetails.billing.couponCode}</p>`
      : '<p style="color: #6c757d;">No coupon applied</p>';

    Swal.fire({
      title: '🎉 Order Placed Successfully!',
      html: `
        <div style="text-align: left; max-height: 400px; overflow-y: auto;">
          <h4 style="color: #153964; border-bottom: 2px solid #153964; padding-bottom: 10px;">Order Summary</h4>
          
          <p><strong>Order ID:</strong> ${orderDetails.orderId || 'ORD' + Date.now()}</p>
          
          <h5 style="margin-top: 15px;">Items:</h5>
          ${cartItems.map(item => `
            <div style="display: flex; align-items: center; margin-bottom: 10px; padding: 5px; background: #f8f9fa; border-radius: 5px;">
              <img src="${item.image || 'https://via.placeholder.com/50'}" style="width: 40px; height: 40px; border-radius: 5px; margin-right: 10px; object-fit: cover;">
              <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between;">
                  <span>${item.name} x${item.quantity}</span>
                  <span>₹${item.price * item.quantity}</span>
                </div>
                ${item.weight ? `<small style="color: #666;">${item.weight}</small>` : ''}
              </div>
            </div>
          `).join('')}
          
          <hr>
          
          <div style="background: #f8f9fa; padding: 10px; border-radius: 5px;">
            <div style="display: flex; justify-content: space-between;">
              <span>Subtotal:</span>
              <span>₹${orderDetails.billing.subtotal}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span>Packaging:</span>
              <span>₹${orderDetails.billing.packagingCharge}</span>
            </div>
            ${orderDetails.billing.discountAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; color: #28a745;">
                <span>Discount (${orderDetails.billing.couponCode}):</span>
                <span>-₹${orderDetails.billing.discountAmount}</span>
              </div>
            ` : ''}
            <hr>
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em;">
              <span>Total Paid:</span>
              <span>₹${orderDetails.billing.finalAmount}</span>
            </div>
          </div>
          
          ${savingsText}
          
          <h5 style="margin-top: 15px;">Delivery Address:</h5>
          <p>
            ${orderDetails.deliveryAddress.receiverName}<br>
            ${orderDetails.deliveryAddress.house}, ${orderDetails.deliveryAddress.area}<br>
            ${orderDetails.deliveryAddress.city} - ${orderDetails.deliveryAddress.pincode}<br>
            Phone: ${orderDetails.deliveryAddress.phone}
          </p>
          
          <h5>Delivery Slot:</h5>
          <p>${orderDetails.deliverySlot.date} | ${orderDetails.deliverySlot.time}</p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'View Order Details',
      confirmButtonColor: '#153964',
      showCancelButton: true,
      cancelButtonText: 'Continue Shopping',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/order-tracking";
      } else {
        window.location.href = "/";
      }
    });
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    Swal.fire({
      title: 'Processing Order',
      html: 'Please wait while we process your order...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setLoading(true);
    const orderPayload = prepareOrderPayload();

    try {
      const response = await axios.post(
        "https://api.ssdipl.com/api/orders/create",
        orderPayload
      );

      Swal.close();

      if (response.data.success) {
        if (checkoutData.paymentMode === "cod") {
          sessionStorage.removeItem("cart");
          showOrderConfirmation({
            ...orderPayload,
            orderId: response.data.order?.orderId
          });
        } else {
          Swal.fire({
            title: 'Redirecting to Payment',
            text: 'You will be redirected to the payment gateway.',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false
          });
          await processOnlinePayment(response.data.order, orderPayload);
        }
      }
    } catch (error) {
      Swal.close();
      console.error("Order failed:", error);
      
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: error.response?.data?.message || "Failed to place order. Please try again.",
        confirmButtonColor: '#153964',
      });
    } finally {
      setLoading(false);
    }
  };

  const processOnlinePayment = async (orderData, orderPayload) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Payment gateway failed to load");
      return;
    }

    const options = {
      key: "rzp_test_TmsfO3hloFEA31",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Cake N Petals",
      description: `Order #${orderData.orderId} ${appliedCoupon ? `with ${appliedCoupon.code}` : ''}`,
      image: "https://res.cloudinary.com/dfet60ou1/image/upload/v1747043182/logo_nkf8jp.webp",
      order_id: orderData.razorpayOrderId,

      handler: async function (response) {
        try {
          Swal.fire({
            title: 'Verifying Payment',
            html: 'Please wait while we verify your payment...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const verifyRes = await axios.post(
            "https://api.ssdipl.com/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData.orderId,
              couponCode: appliedCoupon?.code,
              discountAmount: couponDiscount
            }
          );

          Swal.close();

          if (verifyRes.data.success) {
            sessionStorage.removeItem("cart");
            showOrderConfirmation({
              ...orderPayload,
              orderId: orderData.orderId,
              paymentId: response.razorpay_payment_id
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Payment Failed',
              text: 'Payment verification failed. Please contact support.',
              confirmButtonColor: '#153964',
            });
          }
        } catch (error) {
          Swal.close();
          Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: 'Payment verification failed. Please contact support.',
            confirmButtonColor: '#153964',
          });
        }
      },

      prefill: {
        name: checkoutData.user.name,
        email: checkoutData.user.email,
        contact: checkoutData.user.phone,
      },

      theme: { color: "#153964" },

      modal: {
        ondismiss: function() {
          Swal.fire({
            icon: 'info',
            title: 'Payment Cancelled',
            text: 'You have cancelled the payment.',
            confirmButtonColor: '#153964',
          });
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
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
                  Login Details <span>Step 1/6</span>
                </div>
                <div className={`step ${step >= 2 ? "active" : ""}`}>
                  Delivery Address <span>Step 2/6</span>
                </div>
                <div className={`step ${step >= 3 ? "active" : ""}`}>
                  Special Note <span>Step 3/6</span>
                </div>
                <div className={`step ${step >= 4 ? "active" : ""}`}>
                  Delivery Date & Time <span>Step 4/6</span>
                </div>
                <div className={`step ${step >= 5 ? "active" : ""}`}>
                  Payment & Summary <span>Step 5/6</span>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="col-lg-9">
              {/* STEP 2 - Delivery Address */}
              {step === 2 && (
                <form className="checkout-card" onSubmit={handleAddressSubmit}>
                  <h4>
                    Awesome {checkoutData?.user?.name}!{" "}
                    <span>Let us know where to deliver</span>
                  </h4>

                  <input 
                    name="receiverName" 
                    className="form-control mb-3" 
                    placeholder="Receiver Name*" 
                    required 
                  />
                  <input 
                    name="house" 
                    className="form-control mb-3" 
                    placeholder="House / Flat*" 
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
                    placeholder="Receiver Phone*" 
                    required 
                  />

                  <button className="continue-btn">Continue</button>
                </form>
              )}

              {/* STEP 3 - Special Note */}
              {step === 3 && (
                <div className="checkout-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>Write your free card message</h4>
                    <button onClick={() => setStep(2)} className="back-btn">
                      <i className="fa fa-arrow-left"></i>
                      <span>back to Address</span>
                    </button>
                  </div>

                  <h6 className="mt-3">Select Occasion</h6>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <div className="dropdown">
                      <button
                        className={`note-btn dropdown-toggle ${!famousOccasions.map(o => o.name).includes(checkoutData.specialNote?.occasion) ? "active" : ""}`}
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        All ▼
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setCheckoutData((prev) => ({
                              ...prev,
                              specialNote: { ...prev.specialNote, occasion: "" }
                            }))}
                          >
                            All
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        {moreOccasions.map((item, index) => (
                          <li key={index}>
                            <button
                              className="dropdown-item"
                              onClick={() => setCheckoutData((prev) => ({
                                ...prev,
                                specialNote: { ...prev.specialNote, occasion: item.name }
                              }))}
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {famousOccasions.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`note-btn ${checkoutData.specialNote?.occasion === item.name ? "active" : ""}`}
                        onClick={() => setCheckoutData((prev) => ({
                          ...prev,
                          specialNote: { ...prev.specialNote, occasion: item.name }
                        }))}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>

                  <h6>Select Relation</h6>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <div className="dropdown">
                      <button
                        className={`note-btn dropdown-toggle ${!famousRelations.map(r => r.name).includes(checkoutData.specialNote?.relation) ? "active" : ""}`}
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        All ▼
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => setCheckoutData((prev) => ({
                              ...prev,
                              specialNote: { ...prev.specialNote, relation: "" }
                            }))}
                          >
                            All
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        {moreRelations.map((item, index) => (
                          <li key={index}>
                            <button
                              className="dropdown-item"
                              onClick={() => setCheckoutData((prev) => ({
                                ...prev,
                                specialNote: { ...prev.specialNote, relation: item.name }
                              }))}
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {famousRelations.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`note-btn ${checkoutData.specialNote?.relation === item.name ? "active" : ""}`}
                        onClick={() => setCheckoutData((prev) => ({
                          ...prev,
                          specialNote: { ...prev.specialNote, relation: item.name }
                        }))}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="reminder"
                    />
                    <label className="form-check-label" htmlFor="reminder">
                      Set reminder for this occasion
                    </label>
                  </div>

                  <div className="d-flex justify-content-between">
                    <label>Your Message</label>
                    <small className="text-muted">
                      {checkoutData.specialNote?.message?.length || 0} / 250
                    </small>
                  </div>
                  
                  <textarea
                    className="form-control mb-2"
                    rows="5"
                    maxLength={250}
                    value={checkoutData.specialNote?.message}
                    onChange={(e) => setCheckoutData((prev) => ({
                      ...prev,
                      specialNote: { ...prev.specialNote, message: e.target.value }
                    }))}
                  />

                  <label className="mt-3">From</label>
                  <input
                    type="text"
                    className="form-control mb-4"
                    placeholder="Your Name"
                    value={checkoutData?.specialNote?.toName}
                    onChange={(e) => setCheckoutData((prev) => ({
                      ...prev,
                      specialNote: { ...prev.specialNote, toName: e.target.value }
                    }))}
                  />

                  <button className="continue-btn" onClick={() => setStep(4)}>
                    Continue
                  </button>
                </div>
              )}

              {/* STEP 4 - Delivery Date & Time */}
              {step === 4 && (
                <form className="checkout-card" onSubmit={handleDeliverySubmit}>
                  <div className="pb-5" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4>Delivery Date & Time</h4>
                    <button onClick={() => setStep(3)} className="back-btn">
                      <i className="fa fa-arrow-left"></i>
                      <span>Back</span>
                    </button>
                  </div>

                  <input 
                    type="date" 
                    name="date" 
                    className="form-control mb-3" 
                    min={new Date().toISOString().split('T')[0]}
                    required 
                  />

                  <select name="time" className="form-control mb-4" required>
                    <option value="">Select Time Slot</option>
                    <option value="10AM - 12PM">10AM - 12PM</option>
                    <option value="12PM - 2PM">12PM - 2PM</option>
                    <option value="2PM - 4PM">2PM - 4PM</option>
                    <option value="4PM - 6PM">4PM - 6PM</option>
                    <option value="6PM - 8PM">6PM - 8PM</option>
                  </select>

                  <button className="continue-btn">Continue to Payment</button>
                </form>
              )}

              {/* STEP 5 - Payment & Summary with Product Images and Controls */}
              {step === 5 && (
                <div className="checkout-wrapper">
                  {/* LEFT SIDE - Product List with Images and Controls */}
                  <div className="checkout-left">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h4>Order Summary ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</h4>
                      <button onClick={() => setStep(4)} className="back-btn">
                        <i className="fa fa-arrow-left"></i>
                        <span>Edit Delivery</span>
                      </button>
                    </div>

                    {cartItems.map((item, index) => (
                      <div key={index} className="product-card" style={{
                        display: 'flex',
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        padding: '15px',
                        marginBottom: '15px',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}>
                        {/* Product Image */}
                        <div className="product-image" style={{
                          width: '100px',
                          height: '100px',
                          marginRight: '15px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '1px solid #f0f0f0',
                          flexShrink: 0
                        }}>
                          <img 
                            src={item.image || 'https://via.placeholder.com/100x100?text=Product'} 
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                            }}
                          />
                        </div>

                        {/* Product Details */}
                        <div className="product-details" style={{ flex: 1 }}>
                          {/* Product Name and Price Row */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '8px'
                          }}>
                            <h5 style={{ 
                              margin: 0, 
                              fontSize: '16px', 
                              fontWeight: '600',
                              color: '#333',
                              flex: 1
                            }}>
                              {item.name}
                            </h5>
                            <span style={{ 
                              fontWeight: 'bold', 
                              color: '#153964',
                              fontSize: '18px',
                              marginLeft: '10px'
                            }}>
                              ₹{item.price * item.quantity}
                            </span>
                          </div>

                          {/* Weight/Volume */}
                          {item.weight && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '8px',
                              color: '#666',
                              fontSize: '14px'
                            }}>
                              <i className="fa fa-balance-scale" style={{ marginRight: '5px', fontSize: '12px' }}></i>
                              <span>{item.weight}</span>
                            </div>
                          )}

                          {/* Price per unit */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '12px',
                            color: '#28a745',
                            fontSize: '13px'
                          }}>
                            <i className="fa fa-tag" style={{ marginRight: '5px' }}></i>
                            <span>₹{item.price} per item</span>
                          </div>

                          {/* Increment/Decrement Controls */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '5px'
                          }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              border: '1px solid #e0e0e0',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              backgroundColor: '#f8f9fa'
                            }}>
                              <button
                                onClick={() => updateQuantity(item.id || item.productId, 'decrease')}
                                disabled={item.quantity <= 1}
                                style={{
                                  border: 'none',
                                  background: item.quantity <= 1 ? '#f1f3f4' : '#f8f9fa',
                                  padding: '8px 16px',
                                  cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                                  fontSize: '16px',
                                  fontWeight: 'bold',
                                  color: item.quantity <= 1 ? '#999' : '#153964',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                −
                              </button>
                              <span style={{
                                padding: '8px 20px',
                                background: 'white',
                                borderLeft: '1px solid #e0e0e0',
                                borderRight: '1px solid #e0e0e0',
                                minWidth: '50px',
                                textAlign: 'center',
                                fontWeight: '500'
                              }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id || item.productId, 'increase')}
                                style={{
                                  border: 'none',
                                  background: '#f8f9fa',
                                  padding: '8px 16px',
                                  cursor: 'pointer',
                                  fontSize: '16px',
                                  fontWeight: 'bold',
                                  color: '#153964',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                +
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => removeItem(item.id || item.productId)}
                              style={{
                                border: 'none',
                                background: 'none',
                                color: '#dc3545',
                                cursor: 'pointer',
                                fontSize: '14px',
                                padding: '5px 10px',
                                borderRadius: '5px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#fff5f5'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                              <i className="fa fa-trash-o"></i> Remove
                            </button>
                          </div>

                          {/* Item total */}
                          <div style={{
                            marginTop: '10px',
                            textAlign: 'right',
                            fontSize: '13px',
                            color: '#666',
                            borderTop: '1px dashed #e0e0e0',
                            paddingTop: '8px'
                          }}>
                            <span>Item total: </span>
                            <span style={{ fontWeight: '600', color: '#153964' }}>
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Delivery Details Summary */}
                    {checkoutData.delivery.date && (
                      <div className="delivery-summary" style={{
                         background: "linear-gradient(90deg, #df4444 0%, #de9696 100%)",
                        borderRadius: '12px',
                        padding: '20px',
                        marginTop: '20px',
                        color: 'white'
                      }}>
                        <h5 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center' }}>
                          <i className="fa fa-truck" style={{ marginRight: '10px' }}></i>
                          Delivery Details
                        </h5>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                          <div>
                            <i className="fa fa-calendar" style={{ marginRight: '5px', opacity: 0.8 }}></i>
                            <strong>Date:</strong> {checkoutData.delivery.date}
                          </div>
                          <div>
                            <i className="fa fa-clock-o" style={{ marginRight: '5px', opacity: 0.8 }}></i>
                            <strong>Time:</strong> {checkoutData.delivery.time}
                          </div>
                          <div style={{ gridColumn: 'span 2' }}>
                            <i className="fa fa-map-marker" style={{ marginRight: '5px', opacity: 0.8 }}></i>
                            <strong>Address:</strong> {checkoutData.address.house}, {checkoutData.address.area}, {checkoutData.address.city} - {checkoutData.address.pincode}
                          </div>
                          <div style={{ gridColumn: 'span 2' }}>
                            <i className="fa fa-user" style={{ marginRight: '5px', opacity: 0.8 }}></i>
                            <strong>Receiver:</strong> {checkoutData.address.receiverName} ({checkoutData.address.phone})
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Special Note Summary */}
                    {checkoutData.specialNote.message && (
                      <div className="special-note-summary" style={{
                        background: '#fff3cd',
                        borderRadius: '12px',
                        padding: '20px',
                        marginTop: '15px',
                        border: '1px solid #ffeeba',
                        color: '#856404'
                      }}>
                        <h5 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center' }}>
                          <i className="fa fa-heart" style={{ marginRight: '10px', color: '#dc3545' }}></i>
                          Special Note
                        </h5>
                        <div style={{ display: 'grid', gap: '10px' }}>
                          <p style={{ margin: 0 }}>
                            <strong>Occasion:</strong> {checkoutData.specialNote.occasion || 'Not specified'}
                          </p>
                          <p style={{ margin: 0 }}>
                            <strong>Relation:</strong> {checkoutData.specialNote.relation || 'Not specified'}
                          </p>
                          <p style={{ margin: 0, fontStyle: 'italic' }}>
                            "{checkoutData.specialNote.message}"
                          </p>
                          <p style={{ margin: 0, textAlign: 'right' }}>
                            - {checkoutData.specialNote.toName}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT SIDE - Bill Summary */}
                  <div className="checkout-right">
                    <h5 style={{ marginBottom: '20px', color: '#153964' }}>
                      <i className="fa fa-file-text-o"></i> Bill Summary
                    </h5>

                    {/* Price Breakdown */}
                    <div style={{ marginBottom: '20px' }}>
                      {cartItems.map((item, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                          fontSize: '14px',
                          color: '#666'
                        }}>
                          <span>{item.name} x{item.quantity}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}

                      <hr style={{ margin: '15px 0' }} />

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span style={{ fontWeight: '500' }}>₹{subtotal}</span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <span>Packaging Charge</span>
                        <span style={{ fontWeight: '500' }}>+ ₹{packagingCharge}</span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                        background: '#f8f9fa',
                        padding: '8px',
                        borderRadius: '5px'
                      }}>
                        <span><strong>Total Before Discount</strong></span>
                        <span><strong>₹{totalBeforeDiscount}</strong></span>
                      </div>

                      {/* Coupon Discount Section */}
                      {couponDiscount > 0 ? (
                        <>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                            color: '#28a745',
                            background: '#e8f5e9',
                            padding: '8px',
                            borderRadius: '5px'
                          }}>
                            <span>
                              <i className="fa fa-tag"></i> Discount 
                              <span style={{
                                background: '#28a745',
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                marginLeft: '8px',
                                fontSize: '12px'
                              }}>
                                {appliedCoupon?.code}
                              </span>
                              <button 
                                onClick={removeCoupon}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#dc3545',
                                  marginLeft: '8px',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  textDecoration: 'underline'
                                }}
                              >
                                Remove
                              </button>
                            </span>
                            <span>- ₹{couponDiscount}</span>
                          </div>

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                            color: '#28a745'
                          }}>
                            <span>Total Savings</span>
                            <span>₹{totalSavings}</span>
                          </div>
                        </>
                      ) : (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                          color: '#6c757d',
                          padding: '8px',
                          background: '#f8f9fa',
                          borderRadius: '5px'
                        }}>
                          <span><i className="fa fa-tag"></i> No coupon applied</span>
                          <span>-</span>
                        </div>
                      )}

                      <hr style={{ margin: '15px 0' }} />

                      {/* Final Amount */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '1.2em',
                        fontWeight: 'bold',
                        marginBottom: '10px'
                      }}>
                        <span>Final Amount</span>
                        <span style={{ color: '#153964' }}>₹{totalAmount}</span>
                      </div>

                      {/* Savings Message */}
                      {couponDiscount > 0 && (
                        <div style={{
                          textAlign: 'center',
                          color: '#28a745',
                          fontSize: '14px',
                          padding: '8px',
                          background: '#e8f5e9',
                          borderRadius: '5px',
                          marginTop: '10px'
                        }}>
                          🎉 You saved ₹{totalSavings} with coupon {appliedCoupon?.code}!
                        </div>
                      )}
                    </div>

                    {/* Coupon Input Section */}
                    <div style={{ marginBottom: '20px' }}>
                      <h6 style={{ color: '#153964', marginBottom: '10px' }}>
                        <i className="fa fa-tag"></i> Have a coupon code?
                      </h6>
                      <div style={{
                        display: 'flex',
                        gap: '10px'
                      }}>
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          disabled={!!appliedCoupon || loadingCoupon}
                          style={{
                            flex: 1,
                            padding: '10px',
                            border: couponError ? '1px solid #dc3545' : '1px solid #ced4da',
                            borderRadius: '5px',
                            backgroundColor: appliedCoupon ? '#f5f5f5' : 'white'
                          }}
                        />
                        {!appliedCoupon ? (
                          <button 
                            onClick={applyCoupon}
                            disabled={loadingCoupon || !couponCode.trim()}
                            style={{
                              padding: '10px 20px',
                               background: "linear-gradient(90deg, #df4444 #df4444  0%, #eb9191ff 100%)",
                              color: 'black',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: loadingCoupon ? 'wait' : 'pointer',
                              opacity: loadingCoupon || !couponCode.trim() ? 0.7 : 1
                            }}
                          >
                            {loadingCoupon ? '...' : 'Apply'}
                          </button>
                        ) : (
                          <button 
                            onClick={removeCoupon}
                            style={{
                              padding: '10px 20px',
                              backgroundColor: '#dc3545',
                              color: 'black',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      {couponError && (
                        <small style={{ color: '#dc3545', display: 'block', marginTop: '5px' }}>
                          <i className="fa fa-exclamation-circle"></i> {couponError}
                        </small>
                      )}
                      
                      {/* Sample Coupons */}
                      <div style={{ marginTop: '10px', fontSize: '12px', color: '#6c757d' }}>
                        <span>Try: </span>
                        {['SAVE20', 'WELCOME10', 'FLAT50'].map(code => (
                          <span 
                            key={code}
                            onClick={() => !appliedCoupon && setCouponCode(code)}
                            style={{ 
                              background: '#e9ecef', 
                              padding: '4px 10px', 
                              borderRadius: '20px',
                              marginRight: '5px',
                              cursor: appliedCoupon ? 'not-allowed' : 'pointer',
                              display: 'inline-block',
                              fontSize: '11px',
                              opacity: appliedCoupon ? 0.5 : 1
                            }}
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <textarea
                      placeholder="Any special instructions? (e.g., gate code, call before delivery)"
                      maxLength={250}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ced4da',
                        marginBottom: '15px',
                        resize: 'vertical'
                      }}
                    />

                    {/* Payment Mode Selection */}
                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '15px',
                      padding: '10px',
                      background: '#f8f9fa',
                      borderRadius: '5px'
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="paymentMode"
                          value="online"
                          checked={checkoutData.paymentMode === "online"}
                          onChange={(e) => setCheckoutData(prev => ({
                            ...prev,
                            paymentMode: e.target.value
                          }))}
                        />
                        <i className="fa fa-credit-card" style={{ color: '#153964' }}></i>
                        Online Payment
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="paymentMode"
                          value="cod"
                          checked={checkoutData.paymentMode === "cod"}
                          onChange={(e) => setCheckoutData(prev => ({
                            ...prev,
                            paymentMode: e.target.value
                          }))}
                        />
                        <i className="fa fa-money" style={{ color: '#28a745' }}></i>
                        Cash on Delivery
                      </label>
                    </div>

                    {/* Price Summary Card */}
                    <div style={{
                      background: "linear-gradient(90deg, #df4444 0%, #de9696 100%)",
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '15px',
                      color: 'white'
                    }}>
                      <h6 style={{ margin: '0 0 15px 0', color: 'white', opacity: 0.9 }}>
                        <i className="fa fa-calculator"></i> Price Summary
                      </h6>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Subtotal:</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Packaging:</span>
                        <span>+₹{packagingCharge}</span>
                      </div>
                      {couponDiscount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span>Discount ({appliedCoupon?.code}):</span>
                          <span>-₹{couponDiscount}</span>
                        </div>
                      )}
                      <hr style={{ margin: '10px 0', borderColor: 'rgba(255,255,255,0.2)' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2em' }}>
                        <span>You Pay:</span>
                        <span>₹{totalAmount}</span>
                      </div>
                    </div>

                    {/* Place Order Button */}
                    <button 
                      onClick={placeOrder}
                      disabled={loading || cartItems.length === 0}
                      style={{
                        width: '100%',
                        padding: '15px',
                        fontSize: '1.1em',
                        fontWeight: 'bold',
                        backgroundColor: loading ? '#6c757d' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'wait' : 'pointer',
                        transition: 'all 0.3s ease',
                        marginBottom: '10px'
                      }}
                    >
                      {loading ? (
                        <span><i className="fa fa-spinner fa-spin"></i> PROCESSING...</span>
                      ) : (
                        <span><i className="fa fa-lock"></i> PAY ₹{totalAmount} SECURELY</span>
                      )}
                    </button>

                    {/* Terms and Conditions */}
                    <small style={{
                      display: 'block',
                      textAlign: 'center',
                      color: '#6c757d',
                      fontSize: '12px'
                    }}>
                      By placing this order, you agree to our 
                      <a href="/terms" style={{ color: '#153964', marginLeft: '3px' }}>Terms of Service</a> and 
                      <a href="/privacy" style={{ color: '#153964', marginLeft: '3px' }}>Privacy Policy</a>
                    </small>
                  </div>
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














// import React, { useState, useEffect, useMemo } from "react";
// import "./checkout.css";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Checkout = () => {
//   /* ================= STEP ================= */
//   const [step, setStep] = useState(2);

//   /* ================= CART ================= */
//   const [cartItems, setCartItems] = useState([]);
//   const [userData, setUserData] = useState({});

//   /* ================= CHECKOUT DATA ================= */
//   const [checkoutData, setCheckoutData] = useState({
//     user: {
//       userId: userData?.userId || "USER123",
//       name: userData?.name || "Mukesh Mahar",
//       phone: userData?.phone || "7827433992",
//       email: userData?.email || "mukeshmahar00@gmail.com",
//       address: userData?.address || "C-28 New Ashok Nagar Noida",
//     },
//     address: {},
//     delivery: {},
//     cart: [],

//     specialNote: {
//       occasion: "",
//       relation: "",
//       message: "",
//     },

//   });


//   // Add these before the return statement
//   // Add these before the return statement
//   const famousOccasions = [
//     { name: 'Birthday' },
//     { name: 'Anniversary' },
//     { name: 'Valentines Day' },
//     { name: 'Rose Day' }
//   ];

//   const moreOccasions = [
//     { name: 'I Am Sorry' },
//     { name: 'Hug Day' },
//     { name: 'Propose Day' },
//     { name: 'Kiss Day' },
//     { name: 'Friendship Day' },
//     { name: "Mother's Day" },
//     { name: "Father's Day" },
//     { name: 'New Year' },
//     { name: 'Diwali' },
//     { name: 'Christmas' },
//     { name: 'Eid' },
//     { name: 'Congratulations' },
//     { name: 'Get Well Soon' },
//     { name: 'Thank You' }
//   ];

//   const famousRelations = [
//     { name: 'Boyfriend' },
//     { name: 'Girlfriend' },
//     { name: 'Wife' },
//     { name: 'Husband' },
//     { name: 'Mother' },
//     { name: 'Father' }
//   ];

//   const moreRelations = [
//     { name: 'Brother' },
//     { name: 'Sister' },
//     { name: 'Son' },
//     { name: 'Daughter' },
//     { name: 'Grandmother' },
//     { name: 'Grandfather' },
//     { name: 'New Mom' },
//     { name: 'New Dad' },
//     { name: 'Fiance' },
//     { name: 'Fiancee' },
//     { name: 'Best Friend' },
//     { name: 'Colleague' },
//     { name: 'Boss' },
//     { name: 'Teacher' }
//   ];

//   /* ================= LOAD & NORMALIZE CART ================= */
//   useEffect(() => {
//     const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
//     const token = sessionStorage.getItem("token") || [];

//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setCheckoutData((prev) => ({ ...prev, user: decoded }));
//         setUserData(decoded);
//         console.log("Decoded Token:==>", decoded);
//       } catch (err) {
//         console.error("Invalid token");
//       }
//     }

//     const normalizedCart = storedCart.map((item) => ({
//       ...item,
//       quantity: item.quantity && item.quantity > 0 ? item.quantity : 1,
//     }));

//     setCartItems(normalizedCart);
//   }, []);

//   /* ================= GUARD: EMPTY CART ================= */
//   useEffect(() => {
//     if (cartItems.length === 0) {
//       console.warn("Checkout opened with empty cart");
//     }
//   }, [cartItems]);

//   /* ================= TOTAL (SAFE) ================= */
//   const totalAmount = useMemo(() => {
//     return cartItems.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//   }, [cartItems]);

//   /* ================= HANDLERS ================= */

//   const handleAddressSubmit = (e) => {
//     e.preventDefault();

//     setCheckoutData((prev) => ({
//       ...prev,
//       address: {
//         receiverName: e.target.receiverName.value,
//         house: e.target.house.value,
//         area: e.target.area.value,
//         pincode: e.target.pincode.value,
//         city: e.target.city.value,
//         phone: e.target.phone.value,
//         addressType: "Home",
//       },
//     }));

//     setStep(3);
//   };

//   const handleDeliverySubmit = (e) => {
//     e.preventDefault();

//     setCheckoutData((prev) => ({
//       ...prev,
//       delivery: {
//         date: e.target.date.value,
//         time: e.target.time.value,
//       },
//       cart: cartItems,
//     }));

//     setStep(5);
//   };

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };


//   // const placeOrder = async () => {
//   //   if (cartItems.length === 0) {
//   //     alert("Your cart is empty");
//   //     return;
//   //   }

//   //   const finalPayload = {
//   //     ...checkoutData,
//   //     cart: cartItems,
//   //     totalAmount,
//   //     paymentMode: "online",
//   //   };
//   //   if (finalPayload.paymentMode === "cod") {
//   //     try {
//   //       const res = await axios.post(
//   //         'https://api.ssdipl.com/api/checkout', finalPayload
//   //       )
//   //       console.log("resres==>", res.data.data);
//   //       if (res.status === 200) {
//   //         alert("Order placed successfully 🎉");
//   //       }
//   //     } catch (err) {
//   //       console.log(err);
//   //     }
//   //   } else {
//   //     const scriptLoaded = await loadRazorpayScript();
//   //     if (!scriptLoaded) {
//   //       toast.error("Failed to load Razorpay script. Please try again.");
//   //       return;
//   //     }

//   //     const res = await axios.post('https://api.ssdipl.com/api/checkout', finalPayload)
//   //     console.log("data==>", res?.data ,res?.data);
//   //     const data = res?.data;

//   //     const options = {
//   //       key: 'rzp_test_TmsfO3hloFEA31',
//   //       amount: data?.amount,
//   //       currency: "INR",
//   //       name: "Cake Npetals",
//   //       description: "Payment for your Cake Npetals order",
//   //       image: "https://res.cloudinary.com/dfet60ou1/image/upload/v1747043182/logo_nkf8jp.webp",
//   //       order_id: data?.razorpayOrderId || "E77EE&7E",

//   //       handler: async function (response) {
//   //         try {    
//   //           console.log("XXXXXX::=>" , response)
//   //           const verifyData = await axios.post(
//   //             "https://api.ssdipl.com/api/verify-payment",
//   //             {
//   //               razorpay_order_id: response?.razorpay_order_id,
//   //               razorpay_payment_id: response?.razorpay_payment_id,
//   //               razorpay_signature: response?.razorpay_signature,
//   //             }
//   //           );
//   //           console.log("DD::=>verifyData", verifyData)
//   //           if (verifyData?.data?.success) {
//   //             toast.success("Payment verified. Order confirmed!");
//   //           } else {
//   //             toast.error("Payment verification failed.");
//   //           }
//   //         } catch (verifyError) {
//   //           console.error("Verification error:", verifyError);
//   //           toast.error("Payment verification failed. Try again.");
//   //         }
//   //       },
//   //       prefill: {
//   //         name: finalPayload?.receiverName || "",
//   //         email: finalPayload?.email || "",
//   //         contact: finalPayload?.phone || "",
//   //       },
//   //       theme: {
//   //         color: "#153964",
//   //       },
//   //     };

//   //     const rzp = new window.Razorpay(options);
//   //     rzp.open();

//   //   }
//   //   console.log("FINAL PAYLOAD (SEND TO BACKEND):=>", finalPayload);

//   //   // sessionStorage.removeItem("cart");
//   // };

//   const placeOrder = async () => {
//     if (cartItems.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     const finalPayload = {
//       ...checkoutData,
//       cart: cartItems,
//       totalAmount,
//       paymentMode: "cod", // 🔥 must match backend enum
//     };

//     try {
//       /* ================= COD ================= */
//       if (finalPayload.paymentMode === "cod") {
//         const res = await axios.post(
//           "https://api.ssdipl.com/api/checkout",
//           finalPayload
//         );

//         if (res.status === 200) {
//           toast.success("Order placed successfully 🎉");
//           sessionStorage.removeItem("cart");
//           window.location.href = "/";
//         }
//         return;
//       }

//       /* ================= ONLINE ================= */
//       const scriptLoaded = await loadRazorpayScript();
//       if (!scriptLoaded) {
//         toast.error("Payment gateway failed to load");
//         return;
//       }

//       const res = await axios.post(
//         "https://api.ssdipl.com/api/checkout",
//         finalPayload
//       );
//       const { razorpayOrderId, amount, currency } = res.data;

//       if (!razorpayOrderId) {
//         toast.error("Payment order creation failed");
//         return;
//       }

//       console.log("XXXXXXX::=>", res)
//       const options = {
//         key: "rzp_test_TmsfO3hloFEA31",
//         amount: 1000, // already in paise
//         currency,
//         name: "Cake Npetals",
//         description: "Payment for your Cake Npetals order",
//         image: "https://res.cloudinary.com/dfet60ou1/image/upload/v1747043182/logo_nkf8jp.webp",
//         order_id: razorpayOrderId, // ✅ correct ID

//         handler: async function (response) {
//           console.log("XXXXXXX::=>", response)
//           try {
//             const verifyRes = await axios.post(
//               "https://api.ssdipl.com/api/verify-payment",
//               response
//             );
//             console.log("XXXXXXX::=>", verifyRes)
//             if (verifyRes.data.success) {
//               toast.success("Payment Successful 🎉");
//               sessionStorage.removeItem("cart");
//               window.location.href = "/order-success";
//             } else {
//               toast.error("Payment verification failed");
//             }
//           } catch (err) {
//             toast.error("Verification error");
//           }
//         },

//         prefill: {
//           name: finalPayload?.receiverName || "",
//           email: finalPayload?.email || "",
//           contact: finalPayload?.phone || "",
//         },

//         theme: { color: "#153964" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();

//     } catch (error) {
//       console.error(error);
//       toast.error("Order failed. Please try again.");
//     }
//   };

//  const handleChange = (e) => {
//     setCheckoutData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   console.log("SSXXXSSS==>", checkoutData);
//   return (
//     <>
//       {/* ================= USER INFO ================= */}
//       <div className="container mt-4">
//         <div className="login-box">
//           <div className="row">
//             <div className="col-md-3">
//               <small>Full name</small>
//               <p>{checkoutData.user.name}</p>
//             </div>
//             <div className="col-md-3">
//               <small>Phone Number</small>
//               <p>{checkoutData.user.phone || '-'}</p>
//             </div>
//             <div className="col-md-3">
//               <small>E-Mail ID</small>
//               <p>{checkoutData.user.email || '-'}</p>
//             </div>
//             <div className="col-md-3">
//               <small>Address</small>
//               <p>{checkoutData.user.address || '-'}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ================= CHECKOUT ================= */}
//       <div className="checkout-wrapper">
//         <div className="container">
//           <div className="row">

//             {/* STEPS */}
//             <div className="col-lg-3 mb-4">
//               <div className="steps-box">
//                 <div className={`step ${step >= 1 ? "active" : ""}`}>
//                   Login Details <span>Step 1/6</span>
//                 </div>
//                 <div className={`step ${step >= 2 ? "active" : ""}`}>
//                   Delivery Address <span>Step 2/6</span>
//                 </div>
//                 <div className={`step ${step >= 3 ? "active" : ""}`}>
//                   Special Note <span>Step 3/6</span>
//                 </div>
//                 <div className={`step ${step >= 4 ? "active" : ""}`}>
//                   Delivery Date & Time <span>Step 4/6</span>
//                 </div>
//                 <div className={`step ${step >= 5 ? "active" : ""}`}>
//                   Payment & Summary <span>Step 5/6</span>
//                 </div>
//               </div>
//             </div>

//             {/* CONTENT */}
//             <div className="col-lg-9">

//               {/* STEP 2 */}
//               {step === 2 && (
//                 <form className="checkout-card" onSubmit={handleAddressSubmit}>
//                   <h4>
//                     Awesome {checkoutData?.user?.name}!{" "}
//                     <span>Let us know where to deliver</span>
//                   </h4>

//                   <input name="receiverName" value={checkoutData.receiverName} onChange={handleChange} className="form-control mb-3" placeholder="Receiver Name*" required />
//                   <input name="house" value={checkoutData.house} onChange={handleChange} className="form-control mb-3" placeholder="House / Flat*" required />
//                   <input name="area" value={checkoutData.area} onChange={handleChange} className="form-control mb-3" defaultValue="Asthal Colony, Bawana" />

//                   <div className="row">
//                     <div className="col-md-6">
//                       <input name="pincode" value={checkoutData.pincode} onChange={handleChange} className="form-control mb-3" defaultValue="110039" required />
//                     </div>
//                     <div className="col-md-6">
//                       <input name="city" value={checkoutData.city} onChange={handleChange} className="form-control mb-3" defaultValue="Delhi" />
//                     </div>
//                   </div>

//                   <input name="phone" value={checkoutData.phone} onChange={handleChange} className="form-control mb-3" placeholder="Receiver Phone*" required />

//                   <button className="continue-btn">Continue</button>
//                 </form>
//               )}

//               {step === 3 && (
//                 <div className="checkout-card">
//                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <h4>Write your free card message</h4>
//                     <button onClick={() => setStep(2)} className="back-btn">
//                       <i className="fa fa-arrow-left"></i>
//                       <span>back to Address</span>
//                     </button>
//                   </div>
//                {/* ================= SELECT OCCASION ================= */}
//                   <h6 className="mt-3">Select Occasion</h6>

//                   {/* Occasion tabs with All dropdown */}
//                   <div className="d-flex flex-wrap gap-2 mb-3">
//                     {/* All button with dropdown */}
//                     <div className="dropdown" style={{ display: 'inline-block' }}>
//                       <button
//                         className={`note-btn dropdown-toggle ${checkoutData.specialNote?.occasion === "All" ||
//                           !famousOccasions.map(o => o.name).includes(checkoutData.specialNote?.occasion) ? "active" : ""}`}
//                         type="button"
//                         data-bs-toggle="dropdown"
//                         aria-expanded="false"
//                       >
//                         All ▼
//                       </button>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <button
//                             className="dropdown-item"
//                             onClick={() => setCheckoutData((prev) => ({
//                               ...prev,
//                               specialNote: { ...prev.specialNote, occasion: "All" }
//                             }))}
//                           >
//                             All
//                           </button>
//                         </li>
//                         <li><hr className="dropdown-divider" /></li>
//                         {moreOccasions.map((item, index) => (
//                           <li key={index}>
//                             <button
//                               className="dropdown-item"
//                               onClick={() => setCheckoutData((prev) => ({
//                                 ...prev,
//                                 specialNote: { ...prev.specialNote, occasion: item.name }
//                               }))}
//                             >
//                               {item.name}
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     {/* Famous occasion tabs */}
//                     {famousOccasions.map((item, index) => (
//                       <button
//                         key={index}
//                         type="button"
//                         className={`note-btn ${checkoutData.specialNote?.occasion === item.name ? "active" : ""}`}
//                         onClick={() =>
//                           setCheckoutData((prev) => ({
//                             ...prev,
//                             specialNote: {
//                               ...prev.specialNote,
//                               occasion: item.name,
//                             },
//                           }))
//                         }
//                       >
//                         {item.name}
//                       </button>
//                     ))}
//                   </div>
//                   {/* ================= SELECT RELATION ================= */}
//                   <h6>Select Relation</h6>
//                   {/* Relation tabs with All dropdown */}
//                   <div className="d-flex flex-wrap gap-2 mb-3">
//                     {/* All button with dropdown */}
//                     <div className="dropdown" style={{ display: 'inline-block' }}>
//                       <button
//                         className={`note-btn dropdown-toggle ${checkoutData.specialNote?.relation === "All" ||
//                           !famousRelations.map(r => r.name).includes(checkoutData.specialNote?.relation) ? "active" : ""}`}
//                         type="button"
//                         data-bs-toggle="dropdown"
//                         aria-expanded="false"
//                       >
//                         All ▼
//                       </button>
//                       <ul className="dropdown-menu">
//                         <li>
//                           <button
//                             className="dropdown-item"
//                             onClick={() => setCheckoutData((prev) => ({
//                               ...prev,
//                               specialNote: { ...prev.specialNote, relation: "All" }
//                             }))}
//                           >
//                             All
//                           </button>
//                         </li>
//                         <li><hr className="dropdown-divider" /></li>
//                         {moreRelations.map((item, index) => (
//                           <li key={index}>
//                             <button
//                               className="dropdown-item"
//                               onClick={() => setCheckoutData((prev) => ({
//                                 ...prev,
//                                 specialNote: { ...prev.specialNote, relation: item.name }
//                               }))}
//                             >
//                               {item.name}
//                             </button>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     {/* Famous relation tabs */}
//                     {famousRelations.map((item, index) => (
//                       <button
//                         key={index}
//                         type="button"
//                         className={`note-btn ${checkoutData.specialNote?.relation === item.name ? "active" : ""}`}
//                         onClick={() =>
//                           setCheckoutData((prev) => ({
//                             ...prev,
//                             specialNote: {
//                               ...prev.specialNote,
//                               relation: item.name,
//                             },
//                           }))
//                         }
//                       >
//                         {item.name}
//                       </button>
//                     ))}
//                   </div>

//                   {/* ================= REMINDER ================= */}
//                   <div className="form-check mb-3">
//                     <input
//                       className="form-check-input"
//                       type="checkbox"
//                       id="reminder"
//                     />
//                     <label className="form-check-label" htmlFor="reminder">
//                       Set reminder for this occasion
//                     </label>
//                   </div>

//                   {/* ================= MESSAGE ================= */}
//                   <div className="d-flex justify-content-between">
//                     <label>Your Message</label>
//                     <small className="text-muted">
//                       {checkoutData.specialNote?.message?.length || 0} / 250
//                     </small>
//                   </div>
//                   <textarea
//                     className="form-control mb-2"
//                     rows="5"
//                     cols="4"
//                     maxLength={250}
//                     value={checkoutData.specialNote?.message}
//                     onChange={(e) =>
//                       setCheckoutData((prev) => ({
//                         ...prev,
//                         specialNote: {
//                           ...prev.specialNote,
//                           message: e.target.value,
//                         },
//                       }))
//                     }
//                   />
//                   {/* ================= FROM ================= */}
//                   <label className="mt-3">From</label>
//                   <input
//                     type="text"
//                     className="form-control mb-4"
//                     placeholder="Your Name"
//                     value={checkoutData?.specialNote?.toName}
//                     onChange={(e) =>
//                       setCheckoutData((prev) => ({
//                         ...prev,
//                         specialNote: {
//                           ...prev.specialNote,
//                           toName: e.target.value,
//                         },
//                       }))
//                     }
//                   />

//                   <button
//                     className="continue-btn"
//                     onClick={() => setStep(4)}
//                   >
//                     Continue
//                   </button>
//                 </div>
//               )}
//               {/* STEP 3 */}
//               {step === 4 && (
//                 <form className="checkout-card" onSubmit={handleDeliverySubmit}>

//                   <div className="pb-5" style={{ display: 'flex', justifyContent: 'space-between' }}> <h4>Delivery Date & Time</h4>
//                     <button
//                       onClick={() => setStep(3)}
//                       className="back-btn"
//                     >
//                       <i className="fa fa-arrow-left"></i>
//                       <span>Back</span>
//                     </button>
//                   </div>

//                   <input type="date" name="date" value={checkoutData.date} onChange={handleChange} className="form-control mb-3" required />

//                   <select name="time" value={checkoutData.time} onChange={handleChange} className="form-control mb-4" required>
//                     <option value="">Select Time Slot</option>
//                     <option value={'10AM - 12PM'} >10AM - 12PM</option>
//                     <option value={'12PM - 2PM'}>12PM - 2PM</option>
//                     <option value={'4PM - 6PM'}>4PM - 6PM</option>
//                     <option value={'4PM - 6PM'}>6PM - 8PM</option>
//                   </select>

//                   <button className="continue-btn">Continue to Payment</button>
//                 </form>
//               )}

//               {/* STEP 4 */}
//               {step === 5 && (
//                 <div className="checkout-wrapper">

//                   {/* LEFT SIDE - Product List */}
//                   <div className="checkout-left">
//                     <h4>Order Summary</h4>

//                     {cartItems.map((item, i) => (
//                       <div key={i} className="checkout-item">
//                         <div>
//                           <p className="item-name">
//                             {item.name} {item.weight && `(${item.weight})`}
//                           </p>
//                           <p className="item-qty">Qty: {item.quantity}</p>
//                         </div>
//                         <div className="item-price">
//                           ₹ {item.price * item.quantity}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* RIGHT SIDE - BILL SUMMARY */}
//                   <div className="checkout-right">
//                     <h5>Bill Summary</h5>

//                     <div className="bill-row">
//                       <span>Order Total</span>
//                       <span>₹ {totalAmount}</span>
//                     </div>

//                     <div className="bill-row">
//                       <span>Packaging Charge</span>
//                       <span>₹ 25</span>
//                     </div>

//                     <hr />

//                     <div className="bill-row grand-total">
//                       <strong>Grand Total</strong>
//                       <strong>₹ {totalAmount + 25}</strong>
//                     </div>

//                     {/* Coupon */}
//                     <div className="coupon-box">
//                       <input
//                         type="text"
//                         placeholder="Enter your coupon code"
//                       />
//                       <button>Apply Now</button>
//                     </div>

//                     {/* Special Instructions */}
//                     <textarea
//                       className="special-note"
//                       placeholder="Any Special instructions? E.g. Call before arriving"
//                       maxLength={250}
//                     />

//                     <button className="payment-btn" onClick={placeOrder}>
//                       PROCEED TO PAYMENT
//                     </button>
//                   </div>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Checkout;
