import React, { useEffect, useState, useRef } from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { megaCategories } from "../NavCatData";
import { TbTruckDelivery } from "react-icons/tb";
import { IoMdCart } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
/* ICONS */
import { IoIosArrowDown } from "react-icons/io";
import { IoMenu, IoClose } from "react-icons/io5";

/* COMPONENTS */
import LocationPopup from "../LocationPopup/LocationPopup";

/* ASSETS */
import Banner from "../../images/pic/topBanner1.png";
import logo from "../../images/pic/logo2.png";




const Header = () => {
  const navigate = useNavigate();
  const loginvalue = sessionStorage.getItem("login");



  /* CATEGORY DATA (FROM API) */
  const [categories, setCategories] = useState([]);

  /* LOCATION */
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  /* MOBILE MENU */
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(null);

  /* DESKTOP MENU */
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(null);

  /* SEARCH */
  const [searchQuery, setSearchQuery] = useState("");

  const [openIndex, setOpenIndex] = useState(null);

const toggleDropdown = (key) => {
  setOpenIndex(openIndex === key ? null : key);
};


  /* REFS */
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/get-category-with-subcategory`
        );

        if (res.data?.data) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Category fetch error:", error);
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

        const india = formatted.find((c) => c.code === "IN");
        if (india) setSelectedCountry(india);
      } catch (err) {
        console.error("Country fetch error:", err);
      }
    };

    fetchCountries();
  }, []);



  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setMobileNavOpen(false);
        setMobileCategoryOpen(null);
      }
    };

    if (mobileNavOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [mobileNavOpen]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${searchQuery}`);
    setSearchQuery("");
  };

  const handleMobileCategoryToggle = (index) => {
    setMobileCategoryOpen((prev) => (prev === index ? null : index));
  };

  const handleDesktopMenuToggle = (index) => {
    setDesktopMenuOpen((prev) => (prev === index ? null : index));
  };

  const closeAllMobileMenus = () => {
    setMobileNavOpen(false);
    setMobileCategoryOpen(null);
  };



  return (
    <>
      {/* ================= TOP PROMO BANNER ================= */}
      <img src={Banner} alt="banner" className="header-topBanner" />

      {/* ================= HEADER ================= */}
      <div className="HeaderContainer">
        <header className="custom-navbar">
          <div className="container-fluid">
            <div className="top-header-wrapper">

              {/* ================= MOBILE MENU ICON ================= */}
              <button
                className="mobile-menu-btn d-lg-none"
                onClick={() => {
                  setMobileNavOpen((prev) => !prev);
                  setMobileCategoryOpen(null);
                }}
              >
                {mobileNavOpen ? <IoClose size={30} /> : <IoMenu size={30} />}
              </button>

              {/* ================= LOGO ================= */}
              <Link to="/" className="brand-title">
                <img src={logo} alt="logo" className="logoImage" />
              </Link>

              {/* ================= DELIVERY ================= */}
              <div className="delivery-wrapper">
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
                    <small>Deliver to</small>
                    <span className="delivery-country">
                      {selectedCountry?.name}
                    </span>
                  </div>
                  <IoIosArrowDown />
                </div>
              </div>
              {/* ================= SEARCH ================= */}
              <form className="search-container" onSubmit={handleSearchSubmit}>
                <div className="search-wrapper">
                  <input
                    type="search"
                    className="form-control searchInput"
                    placeholder="Search cakes, flowers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="search-icon">
                    <IoSearch className="iconFont  text-dark" />
                  </button>
                </div>
              </form>

              {/* ================= RIGHT ICONS ================= */}
              <div className="top-icons">
                <Link to="/track-order" className="icon-box">
                  <TbTruckDelivery className="iconFont" />
                  <span className="navPageText">Track</span>
                </Link>

                <Link to="/cart" className="icon-box">
                  <IoMdCart className="iconFont" />
                  <span className="navPageText">Cart</span>
                </Link>

                {loginvalue ? (
                  <Link to="/profile" className="icon-box">
                    <i className="bi bi-person-fill"></i>
                    <span className="navPageText">Account</span>
                  </Link>
                ) : (
                  <Link to="/login" className="icon-box">
                    <i className="bi bi-person-fill"></i>
                    <span className="navPageText">Login</span>
                  </Link>
                )}
              {/* MENU DROPDOWN */}
<div
  className="hdr-menu-trigger"
  onClick={() => toggleDropdown("menu")}
>
  <i className="bi bi-grid"></i>
  <span className="navPageText">Menu</span>

  {openIndex === "menu" && (
    <div className="hdr-menu-dropdown">

      <Link to="/wishlist" className="hdr-menu-link">
        My Favourites
      </Link>

      <Link to="/refer" className="hdr-menu-link">
        Refer and Earn <span className="hdr-badge-new">New</span>
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

              </div>


            </div>
          </div>

          {/* ================= DELIVERY ================= */}
<div className="delivery-row d-lg-none">
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
      <small>Deliver to</small>
      <span className="delivery-country">
        {selectedCountry?.name}
      </span>
    </div>
    <IoIosArrowDown />
  </div>
</div>

        </header>

        {/* ================= MOBILE MENU ================= */}
        {mobileNavOpen && (
          <div className="mobile-menu-wrapper d-lg-none" ref={mobileMenuRef}>
            {megaCategories.map((cat, index) => (
              <div key={cat._id || index} className="mobile-cat">

                {/* CATEGORY TITLE */}
                <div
                  className="mobile-cat-title"
                  onClick={() => handleMobileCategoryToggle(index)}
                >
                  {cat.name}
                  <IoIosArrowDown
                    className={`arrow ${mobileCategoryOpen === index ? "rotate" : ""
                      }`}
                  />
                </div>

                {/* SUBCATEGORIES */}
                {mobileCategoryOpen === index && (
                  <div className="mobile-subcats">
                    {cat.subcategories?.map((sub, i) => (
                      <div key={sub._id || i} className="mobile-subcat">
                        <strong>{sub.name}</strong>

                        {sub.children?.map((child, j) => (
                          <Link
                            key={j}
                            to={`/category/${child
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`}
                            onClick={closeAllMobileMenus}
                          >
                            {child}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}

        {/* ================= LOCATION MODAL ================= */}
        {showLocationModal && (
          <LocationPopup
            onClose={() => setShowLocationModal(false)}
            countries={countries}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
          />
        )}
      </div>

      {/* ================= DESKTOP MEGA NAV ================= */}
      <nav className="navbar navbar-expand-lg bottom-navbar d-none d-lg-block">
        <div className="container navbarContainer">
          <ul className="navbar-nav mx-auto">

            {megaCategories.map((cat, index) => (
              <li
                key={cat._id || index}
                className="nav-item mega-dropdown"
                onMouseEnter={() => setDesktopMenuOpen(index)}
                onMouseLeave={() => setDesktopMenuOpen(null)}
              >
                <span className="nav-link mega-toggle">
                  {cat.name}
                  <IoIosArrowDown />
                </span>

                {desktopMenuOpen === index && (
                  <div className="mega-menu">
                    <div className="mega-menu-inner">

                      {cat.subcategories?.map((sub, i) => (
                        <div key={sub._id || i} className="column-mega">
                          <div className="mega-item fw-bold">
                            {sub.name}
                          </div>

                          {sub.children?.map((child, j) => (
                            <Link
                              key={j}
                              to={`/category/${child
                                .replace(/\s+/g, "-")
                                .toLowerCase()}`}
                              className="mega-item mega-child"
                            >
                              {child}
                            </Link>
                          ))}
                        </div>
                      ))}

                    </div>
                  </div>
                )}

              </li>
            ))}
   
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
