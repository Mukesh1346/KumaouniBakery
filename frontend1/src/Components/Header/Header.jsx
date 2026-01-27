import React, { useEffect, useState } from "react";
import "./header.css";
import { Link } from "react-router-dom";
import axios from "axios";
import LocationPopup from "../LocationPopup/LocationPopup";
import { IoIosArrowDown } from "react-icons/io";
import Banner from "../../images/pic/topBanner.png";
import logo from "../../images/pic/logo.png"






const megaCategories = [
  {
    name: "Cake",
    subcategories: [
      {
        name: "CAKES",
        children: [" Pineapple", "Butterscotch", "Fruit ", " Vannilla fruit","Blueberry ","red velvet","heart","truffle ","choco vannila","Black forest ","Chocolate german"]
      },
      {
        name: "Tub cakes",
        children: ["fruit", 
"blueberry", 
 "pineapple", 
 "Red velvet", 
 "Black forest"

]
      },
      {
        name: "Premium Cakes",
       children: [
        "Hawai Pineapple",
        "Rasmalai",
        "Gulab Jamun",
        "Pistachio",
        "Strawberry Rose",
      ]
      },
      {
         name: "Pastry",
      children: [
        "Black Forest",
        "Pineapple",
        "Truffle",
        "Red Velvet",
        "Butterscotch",
      ], },
      {
         name: "Jar Cakes",
      children: [
        "Chocolate",
        "Red Velvet",
        "Blueberry",
        "Crunchy Chocolate",
      ],
      },
       {
      name: "Cheese Cakes",
      children: [
        "Blueberry",
        "Biscoff",
        "Mango",
        "Strawberry",
      ],
    },
     {
      name: "Cheese Cake Slice",
      children: [
        "Biscoff",
        "Nutella",
        "Blueberry",
      ],
    },
     {
      name: "Cup Cakes",
      children: [
        "Blueberry",
        "Red Velvet",
        "Vanilla",
        "Biscoff",
        "Coffee",
        "Chocolate",
      ],
    }
    ]
  },
  {
    name: "Flowers",
    subcategories: [
      {
      name: "Flower Combos",
      children: [
        "Truffle with Red Roses Box",
        "Truffle with Red Roses Box + Teddy + Chocolate",
      ],
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
    name: "Anniversary",
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
  },
   {
    name: "Wedding",
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
  },
  {
   name: "Festivals",
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
  },

   {
   name: "Friendships",
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
  },


];




const Header = () => {
  const loginvalue = sessionStorage.getItem("login");
  const [categories, setCategories] = useState([]);
  const [ showLocationModal, setShowLocationModal] = useState(false);
   const [openIndex, setOpenIndex] = useState(null);
const [countries, setCountries] = useState([]);
const [selectedCountry, setSelectedCountry] = useState(null);


const toggleDropdown = (key) => {
  setOpenIndex(openIndex === key ? null : key);
};



 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/get-category-with-subcategory`
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



  useEffect(() => {
  const fetchCountries = async () => {
    try {
      const res = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,flags,cca2"
      );

      const formatted = res.data.map((item) => ({
        name: item.name.common,
        flag: item.flags.png,
        code: item.cca2,
      }));

      setCountries(formatted);

      // ✅ SET DEFAULT COUNTRY (INDIA)
      const india = formatted.find((c) => c.code === "IN");
      if (india) {
        setSelectedCountry(india);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  fetchCountries();
}, []);


  return (
    <>
      {/* ===== TOP HEADER ===== */}
    <div className="">
        <img src={Banner} alt="" className="header-topBanner" />
    </div>
 <div className="HeaderContainer">
    <header className="custom-navbar">
        <div className="container-fluid">
          <div className="top-header-wrapper">
            {/* LOGO */}

             <Link to="/" className="brand-title">
                         <img src={logo} alt="" className="logoImage" />
             </Link>
            {/* <Link to="/" className="brand-title">
              Cake Crazzy
            </Link> */}

            {/* DELIVERY LOCATION */}
         <div
  className="delivery-box"
  onClick={() => setShowLocationModal(true)}
>
  {selectedCountry && (
    <img
      src={selectedCountry.flag}
      alt={selectedCountry.name}
      className="delivery-flag"
    />
  )}

  <div className="DeliverSection">
    <small className="text-light">Deliver to</small>
    <span className="delivery-country">
      {selectedCountry?.name || "Select Country"}
    </span>
  </div>

  <IoIosArrowDown className="delivery-arrow" />
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

       
               

               {/* MENU DROPDOWN */}
{/* MENU DROPDOWN */}
<div
  className="hdr-menu-trigger"
  onClick={() => toggleDropdown("menu")}
>
  <i className="bi bi-grid"></i>
  <span>Menu</span>

  {openIndex === "menu" && (
    <div className="hdr-menu-dropdown">
      <Link to="/corporate-gifts" className="hdr-menu-link">
        Corporate Gifts
      </Link>

      <Link to="/wishlist" className="hdr-menu-link">
        My Favourites
      </Link>

     
      <Link to="/refer" className="hdr-menu-link">
        Refer and Earn <span className="hdr-badge-new">New</span>
      </Link>

      <Link to="/franchise" className="hdr-menu-link">
        Franchise
      </Link>

      <Link to="/faq" className="hdr-menu-link">
        FAQ
      </Link>

      <Link to="/about-us" className="hdr-menu-link">
        About Us
      </Link>

    

      <Link to="/contact-us" className="hdr-menu-link">
        Contact Us
      </Link>

      <a
        href="https://wa.me/91XXXXXXXXXX"
        target="_blank"
        rel="noreferrer"
        className="hdr-menu-link hdr-whatsapp"
      >
        WhatsApp
      </a>
    </div>
  )}
</div>



      
    

                 <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

              
            </div>
          </div>
        </div>
      </header>

    {showLocationModal && (
  <LocationPopup
    onClose={() => setShowLocationModal(false)}
    countries={countries}
    selectedCountry={selectedCountry}
    setSelectedCountry={setSelectedCountry}
  />
)}



 </div>
      {/* ===== BOTTOM NAVBAR ===== */}
      <nav className="navbar navbar-expand-lg bottom-navbar">
        <div className="container navbarContainer">
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
        {cat.name} <IoIosArrowDown style={{ marginLeft: "4px" }} />
      </span>

      {/* MEGA MENU */}
    <div className="mega-menu">
  <div className="mega-menu-inner">
    {cat.subcategories.map((sub, i) => (
      
      /* ONE COLUMN */
      <div key={i}  >
        
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
            className="mega-item mega-child"
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
