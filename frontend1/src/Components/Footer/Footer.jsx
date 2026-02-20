
import React, { useEffect, useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaCcAmazonPay } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `https://api.ssdipl.com/api/get-category-with-subcategory`
        );

        if (
          res.data.message ===
          "Categories with subcategories retrieved successfully"
        ) {
          setCategories(res.data.data);
        }
      } catch (error) {
        console.error("Footer API Error:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="fnp-footer">
      {/* ================= TOP FOOTER ================= */}
      <div className="container">
        <div className="row footer-top">

          {/* Policy Info */}
          <div className="col-lg-2 col-md-4 footer-column col-sm-6 col-6">
            <h6 className="text-dark">Policy Info</h6>
            <ul className="text-light">
              <li className="text-light"><Link to="/terms-&-conditions">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="#">Terms of Use</Link></li>
              <li><Link to="#">Disclaimer</Link></li>
            </ul>
          </div>

          {/* About Company */}
          <div className="col-lg-2 col-md-4 footer-column col-sm-6 col-6">
            <h6 className="text-dark">About Company</h6>
            <ul>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/refer">Refer and Earn</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* API CATEGORY SECTION */}
          <div className="col-lg-2 col-md-4 footer-column col-sm-6 col-6">
            <h6 className="text-dark">Our Bakery</h6>
            <ul className="footer-scroll">
              {categories.map((cat) =>
                cat.subcategories.map((sub, index) => (
                  <li key={index}>
                    {/* <Link to={`/product-related/${sub.subcategoryName}`}> */}
                    <div onClick={() => {
                      navigate(`/product-related/${sub.subcategoryName}`,
                        { state: { id: sub?._id, status: 'subCategory' } });
                    }}
                      style={{ cursor: 'pointer' }}
                    >
                      {sub?.subcategoryName}
                    </div>

                    {/* </Link> */}
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Need Help */}
          <div className="col-lg-2 col-md-4 footer-column col-sm-6 col-6">
            <h6 className="text-dark">Need Help ?</h6>
            <ul>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/wishlist">Whislist</Link></li>
            </ul>
          </div>

          {/* International */}
          <div className="col-lg-2 col-md-4 footer-column col-sm-6 col-6">
            <h6 className="text-dark pt-4">International Presence</h6>
            <ul>
              <li>Dubai</li>
              <li>Qatar</li>
              <li>Saudi Arabia</li>
              <li>Singapore</li>
            </ul>
          </div>

          {/* Subscribe */}
          <div className="col-lg-2 footer-column col-md-8 col-6">
            <h6 className="text-dark">Subscribe Now</h6>
            <p className="subscribe-text">
              Get updates on promotions and offers coupons.
            </p>

            <div className="subscribe-box">
              <input type="email" placeholder="Enter email" />
              <button>
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ================= MIDDLE INFO ================= */}
      <div className="footer-middle">
        <div className="container text-center">
          <p>
            Company Name: Cake Bakery Pvt Ltd | CIN: U52100HR2021PTC118882 |
            Regd. Office: Gurugram, Haryana - 122003
          </p>
          <p>
            Telephone No.: +91-99535 53051 | Grievance Officer: Support Team
          </p>
          <Link to="#" className="csr-link">
            Corporate Social Responsibility (CSR) Policy
          </Link>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="footer-bottom">
        <div className="container d-flex justify-content-between align-items-center flex-wrap">

          <div className="social-icons">
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-twitter-x"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-linkedin"></i></a>
          </div>

          <p className="mb-0">
            © 2024 Cake Bakery. All rights reserved.
          </p>

          <div className="payment-icons">
            <FaCcAmazonPay className="fs-3 " />
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
