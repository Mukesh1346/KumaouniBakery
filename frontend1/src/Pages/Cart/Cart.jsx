import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const loginvalue = sessionStorage.getItem("login");
  const navigate = useNavigate();

  // Load cart
  useEffect(() => {
    const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const getUniqueId = (id, weight) => `${id}-${weight}`;

  const handleIncrement = (id, weight) => {
    const updated = cartItems.map((item) =>
      getUniqueId(item.id, item.weight) === getUniqueId(id, weight)
        ? { ...item, quantity: (item.quantity || 1) + 1 }
        : item
    );
    setCartItems(updated);
    sessionStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleDecrement = (id, weight) => {
    const updated = cartItems.map((item) =>
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
      (item) => getUniqueId(item.id, item.weight) !== getUniqueId(id, weight)
    );
    setCartItems(updated);
    sessionStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handleConfirmBooking = () => {
    if (!loginvalue) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="container-fluid shopping-bag-wrapper">
      <div className="row">
        {/* LEFT */}
        <div className="col-lg-8">
          <h4 className="bag-title">MY SHOPPING BAG</h4>

          {cartItems.length === 0 && (
            <p className="text-center mt-5">Your cart is empty</p>
          )}

          {cartItems.map((item) => (
            <div className="bag-item" key={getUniqueId(item.id, item.weight)}>
              <img
                src={item.image}
                alt={item.name}
                className="bag-img"
              />

              <div className="bag-info">
                <h6>{item.name}</h6>
                <p>Weight: {item.weight}</p>
                <p>Price: ₹{item.price}</p>

                <div className="qty-box">
                  <button
                    onClick={() => handleDecrement(item.id, item.weight)}
                  >
                    −
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button
                    onClick={() => handleIncrement(item.id, item.weight)}
                  >
                    +
                  </button>
                </div>

                <div className="bag-actions">
                  <span onClick={() => handleRemove(item.id, item.weight)}>
                    REMOVE
                  </span>
                </div>
              </div>

              <div className="bag-price">
                ₹{item.price * (item.quantity || 1)}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT */}
        <div className="col-lg-4">
          <div className="summary-box">
            <h6>SUMMARY</h6>

            <div className="summary-row">
              <span>SUBTOTAL</span>
              <span>₹{total}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>TBD</span>
            </div>

            <hr />

            <div className="summary-row total">
              <span>ESTIMATED TOTAL</span>
              <span>₹{total}</span>
            </div>

            <button className="checkout-btn" onClick={handleConfirmBooking}>
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;













// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Cart.css";

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const loginvalue = sessionStorage.getItem("login");
//   const navigate = useNavigate();
//   // Fetch cart data from sessionStorage
//   useEffect(() => {
//     const storedCart = JSON.parse(sessionStorage.getItem("cart")) || [];
//     setCartItems(storedCart);
//   }, []);

//   // Create a unique ID by combining the product id and weight
//   const getUniqueId = (id, weight) => `${id}-${weight}`;

//   const handleIncrement = (id, weight) => {
//     setCartItems((prevItems) => {
//       const updatedItems = prevItems.map((item) =>
//         getUniqueId(item.id, item.weight) === getUniqueId(id, weight)
//           ? { ...item, quantity: (item.quantity || 1) + 1 }
//           : item
//       );
//       sessionStorage.setItem("cart", JSON.stringify(updatedItems));
//       return updatedItems;
//     });
//   };

//   const handleDecrement = (id, weight) => {
//     setCartItems((prevItems) => {
//       const updatedItems = prevItems.map((item) =>
//         getUniqueId(item.id, item.weight) === getUniqueId(id, weight) &&
//         item.quantity > 1
//           ? { ...item, quantity: item.quantity - 1 }
//           : item
//       );
//       sessionStorage.setItem("cart", JSON.stringify(updatedItems));
//       return updatedItems;
//     });
//   };

//   const handleRemove = (id, weight) => {
//     setCartItems((prevItems) => {
//       const updatedItems = prevItems.filter(
//         (item) => getUniqueId(item.id, item.weight) !== getUniqueId(id, weight)
//       );
//       sessionStorage.setItem("cart", JSON.stringify(updatedItems));
//       return updatedItems;
//     });
//   };

//   const total = cartItems.reduce(
//     (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
//     0
//   );

//   const handleConfirmBooking = () => {
//     if (!loginvalue) {
//       navigate("/login"); // Redirect to login if not logged in
//     } else {
//       navigate("/checkout"); // Redirect to checkout if logged in
//     }
//   };

//   return (
//     <>
//       {/* ----breadCrumb----  */}
//       <section className="breadCrumb">
//         <div className="breadCrumbContent">
//           <h1>Cart</h1>
//           <Link to="/">Home /</Link> <Link to="">Cart</Link>
//         </div>
//       </section>
//       {/* ----breadCrumb---- end  */}

//       <section className="cartSection container">
//         <div className="cart-container">
//           <div className="cart-items">
//             {cartItems.length > 0 ? (
//               cartItems.map((item) => (
//                 <div
//                   key={getUniqueId(item.id, item.weight)}
//                   className="cart-item"
//                 >
//                   <img
//                     src={`${process.env.REACT_APP_API_URL}/${item.image}`}
//                     alt={item.name}
//                     className="item-image"
//                   />
//                   <div className="item-details">
//                     <h3>{item.name}</h3>
//                     <p>
//                       ₹{item.price}{" "}
//                       <span className="item-weight">{item.weight}</span>
//                     </p>
//                     {item.deliveryDate && (
//                       <p className="selected-date">
//                         Selected Date: <span>{item.deliveryDate}</span>
//                       </p>
//                     )}
//                     {item.eggOption && (
//                       <p>
//                         Egg Option: <span>{item.eggOption}</span>
//                       </p>
//                     )}
//                     {item.message && (
//                       <p className="item-message">
//                         Message: <span>{item.message}</span>
//                       </p>
//                     )}
//                     <div className="quantity-controls">
//                       <button
//                         onClick={() => handleDecrement(item.id, item.weight)}
//                       >
//                         -
//                       </button>
//                       <span>{item.quantity || 1}</span>
//                       <button
//                         onClick={() => handleIncrement(item.id, item.weight)}
//                       >
//                         +
//                       </button>
//                     </div>
//                   </div>
//                   <button
//                     className="remove-button"
//                     onClick={() => handleRemove(item.id, item.weight)}
//                   >
//                     <i className="bi bi-trash3-fill"></i>
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <>
//                 <p>Your cart is empty. Add some products to your cart!</p>
//                 <Link to="/" className="checkout-btn">
//                   GO TO Home Page
//                 </Link>
//               </>
//             )}
//           </div>
//           {cartItems.length > 0 && (
//             <div className="order-summary">
//               <h2>Order Summary</h2>
//               <p>Items: {cartItems.length}</p>
//               <p>Total: ₹{total.toFixed(2)}</p>
//               <button className="confirm-button" onClick={handleConfirmBooking}>
//                 Confirm Booking
//               </button>
//             </div>
//           )}
//         </div>
//       </section>
//     </>
//   );
// };

// export default Cart;
