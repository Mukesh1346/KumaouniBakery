import React, { useEffect, useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import axios from "axios";
import LocationPopup from "../LocationPopup/LocationPopup";





// const megaCategories = [
//   {
//     name: "Cakes",
//     items: [
//       "Birthday Cakes","Anniversary Cakes","Photo Cakes","Designer Cakes",
//       "Chocolate Cakes","Butterscotch Cakes","Red Velvet Cakes","Black Forest",
//       "Cup Cakes","Dry Cakes","Eggless Cakes","Kids Cakes",
//       "Theme Cakes","Wedding Cakes","Pinata Cakes","Pull Me Up Cakes",
//       "Midnight Cakes","Same Day Cakes","Premium Cakes","Heart Shape Cakes",
//       "Tall Cakes","Jar Cakes","Bento Cakes","Fusion Cakes",
//       "Classic Cakes","Luxury Cakes","Fresh Cream Cakes","Fruit Cakes",
//       "Vanilla Cakes","Coffee Cakes","Hazelnut Cakes","Truffle Cakes"
//     ]
//   },
//   {
//     name: "Flowers",
//     items: [
//       "Roses","Lilies","Orchids","Carnations",
//       "Gerberas","Tulips","Sunflowers","Mixed Flowers",
//       "Bouquets","Flower Baskets","Vase Arrangements","Luxury Flowers",
//       "Red Roses","Pink Roses","Yellow Roses","White Roses",
//       "Birthday Flowers","Anniversary Flowers","Romantic Flowers","Thank You Flowers",
//       "Congrats Flowers","Get Well Soon","Sorry Flowers","New Baby Flowers",
//       "Fresh Flowers","Exotic Flowers","Premium Flowers","Artificial Flowers",
//       "Floral Combos","Flower Hampers","Same Day Flowers","Midnight Flowers"
//     ]
//   },
//   {
//     name: "Gifts",
//     items: Array.from({ length: 32 }, (_, i) => `Gift Item ${i + 1}`)
//   },
//   {
//     name: "Combos",
//     items: Array.from({ length: 32 }, (_, i) => `Combo Item ${i + 1}`)
//   },
//   {
//     name: "Personalised",
//     items: Array.from({ length: 32 }, (_, i) => `Personalised Item ${i + 1}`)
//   },
//   {
//     name: "Plants",
//     items: Array.from({ length: 32 }, (_, i) => `Plant Item ${i + 1}`)
//   },
//   {
//     name: "Chocolates",
//     items: Array.from({ length: 32 }, (_, i) => `Chocolate Item ${i + 1}`)
//   },
//   {
//     name: "Occasions",
//     items: Array.from({ length: 32 }, (_, i) => `Occasion Item ${i + 1}`)
//   },
//   {
//     name: "International",
//     items: Array.from({ length: 32 }, (_, i) => `International Item ${i + 1}`)
//   },
//   {
//     name: "Offers",
//     items: Array.from({ length: 32 }, (_, i) => `Offer Item ${i + 1}`)
//   }
// ];


const megaCategories = [
  {
    name: "Cakes",
    subcategories: [
      {
        name: "Birthday Cakes",
        children: ["Photo Cakes", "Designer Cakes", "Kids Cakes", "Theme Cakes"]
      },
      {
        name: "Anniversary Cakes",
        children: ["Heart Shape Cakes", "Red Velvet Cakes", "Chocolate Cakes", "Black Forest Cakes"]
      },
      {
        name: "Premium Cakes",
        children: ["Tall Cakes", "Luxury Cakes", "Fusion Cakes", "Truffle Cakes"]
      },
      {
        name: "Eggless Cakes",
        children: ["Vanilla Eggless", "Chocolate Eggless", "Fruit Eggless", "Butterscotch Eggless"]
      }
    ]
  },
  {
    name: "Flowers",
    subcategories: [
      {
        name: "Roses",
        children: ["Red Roses", "Pink Roses", "White Roses", "Yellow Roses"]
      },
      {
        name: "Lilies",
        children: ["White Lilies", "Pink Lilies", "Oriental Lilies", "Mixed Lilies"]
      },
      {
        name: "Occasion Flowers",
        children: ["Birthday Flowers", "Anniversary Flowers", "Get Well Soon", "Congratulations"]
      },
      {
        name: "Flower Arrangements",
        children: ["Bouquets", "Basket Flowers", "Vase Arrangements", "Luxury Flowers"]
      }
    ]
  },
  {
    name: "Gifts",
    subcategories: [
      {
        name: "Personalised Gifts",
        children: ["Photo Frames", "Mugs", "Cushions", "Key Chains"]
      },
      {
        name: "Soft Toys",
        children: ["Teddy Bear", "Couple Toys", "Kids Toys", "Premium Toys"]
      },
      {
        name: "Gift Hampers",
        children: ["Chocolate Hampers", "Snack Hampers", "Festive Hampers", "Luxury Hampers"]
      },
      {
        name: "Greeting Gifts",
        children: ["Birthday Cards", "Anniversary Cards", "Love Notes", "Thank You Cards"]
      }
    ]
  }
];


const Header = () => {
  const loginvalue = sessionStorage.getItem("login");
  const [categories, setCategories] = useState([]);
  const [ showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/get-category-with-subcategory"
        );

        if (
          response.data.message ===
          "Categories with subcategories retrieved successfully"
        ) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/* ===== TOP HEADER ===== */}
    
 <div className="container">
    <header className="custom-navbar">
        <div className="container-fluid">
          <div className="top-header-wrapper">
            {/* LOGO */}

            <img src="/Logo.svg" alt="" className="logoImage" />
            {/* <Link to="/" className="brand-title">
              Cake Crazzy
            </Link> */}

            {/* DELIVERY LOCATION */}
            <div className="delivery-box"  onClick={() => setShowLocationModal(true) } >
              <i className="bi bi-geo-alt"></i>
              <div className="DeliverSection">
                <small>Deliver to</small>
                 <img src="/pen.svg" alt="" />
              </div>
            </div>

         
{/* SEARCH (ICON ONLY – SAME AS ORIGINAL) */}
<div className="search-container">
  <form>
    <div className="search-wrapper">
      <input
        type="search"
        className="form-control searchInput"
        placeholder="Search"
      />
      <i className="bi bi-search search-icon"></i>
    </div>
  </form>
</div>



            {/* RIGHT ICONS */}
            <div className="top-icons">
              <Link to="/track-order" className="icon-box">
                <i className="bi bi-truck"></i>
                <span>Track Order</span>
              </Link>

             

              <Link to="/cart" className="icon-box">
                <i className="bi bi-bag"></i>
                <span>Cart</span>
              </Link>

              {loginvalue ? (
                <Link to="/profile" className="icon-box">
                  <i className="bi bi-person-fill"></i>
                  <span>Account</span>
                </Link>
              ) : (
                <Link to="/login" className="icon-box">
                  <i className="bi bi-person-fill"></i>
                  <span>Sign In</span>
                </Link>
              )}

               <Link to="/menu" className="icon-box">
                <i className="bi bi-grid"></i>
                <span>Menu</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {  showLocationModal && (
        <LocationPopup  onClose={() => setShowLocationModal(false)}/>
      )

      }


 </div>
      {/* ===== BOTTOM NAVBAR ===== */}
      <nav className="navbar navbar-expand-lg bottom-navbar">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav mx-auto">
  {megaCategories.map((cat, index) => (
    <li className="nav-item mega-dropdown" key={index}>
      <span className="nav-link mega-toggle">
        {cat.name}
      </span>

      {/* MEGA MENU */}
    <div className="mega-menu">
  <div className="mega-menu-inner">
    {cat.subcategories.map((sub, i) => (
      
      /* ONE COLUMN */
      <div key={i}>
        
        {/* MAIN SUBCATEGORY – TOP OF COLUMN */}
        <div
          className="mega-item"
          style={{ fontWeight: 600 }}
        >
          {sub.name}
        </div>

        {/* CHILD SUBCATEGORIES */}
        {sub.children.map((child, j) => (
          <Link
            key={j}
            to={`/category/${child.replace(/\s+/g, "-").toLowerCase()}`}
            className="mega-item"
          >
            {child}
          </Link>
        ))}

      </div>
    ))}
  </div>
</div>


    </li>
  ))}
</ul>


            {/* <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/about-us">
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/all-products">
                  All Products
                </Link>
              </li>

              {categories.map((category) => (
                <li key={category._id} className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    to="#"
                    data-bs-toggle="dropdown"
                  >
                    {category.mainCategoryName}
                  </Link>

                  <ul className="dropdown-menu">
                    {category.subcategories.map((subcategory, index) => (
                      <li key={index}>
                        <Link
                          className="dropdown-item"
                          to={`/product-related/${subcategory.subcategoryName}`}
                        >
                          {subcategory.subcategoryName}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}

              <li className="nav-item">
                <Link className="nav-link" to="/contact-us">
                  Contact Us
                </Link>
              </li>
            </ul> */}
          </div>
        </div>
      </nav>

    </>
  );
};

export default Header;
