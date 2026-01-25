// import React, { useEffect, useState } from "react";
// import "./Footer.css"; // Import the CSS file for styling
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Footer = () => {
//   const loginvalue = sessionStorage.getItem("login");
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           "https://bakery-46ac.onrender.com/api/get-category-with-subcategory"
//         );
//         if (
//           response.data.message ===
//           "Categories with subcategories retrieved successfully"
//         ) {
//           setCategories(response.data.data); // Store the categories data
//         }
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <footer className="footer">
//       <div className="Footeroverlay">
//         <div className="footer-content container-fluid">
//           <div className="footer-section">
//             <h3>POLICY INFO</h3>
//             <Link to="/terms-&-conditions">
//               <i className="bi bi-arrow-right-short"></i> Terms & Conditions
//             </Link>
//             <Link to="/privacy-policy">
//               <i className="bi bi-arrow-right-short"></i> Privacy Policy
//             </Link>
//           </div>
//           <div className="footer-section">
//             <h3>ABOUT US</h3>
//             <Link to="/about-us">
//               <i className="bi bi-arrow-right-short"></i> Our Story
//             </Link>
//             <Link to="/frequently-asked-questions">
//               <i className="bi bi-arrow-right-short"></i> FAQs
//             </Link>
//           </div>
//           {/* <div className="footer-section">
//             <h3>OUR BAKERY</h3>
//             <ul className='p-0'>
//               {categories.map((category) => (
//                 <li className='footer-product-api' key={category._id}>
//                   <Link className='d-none' to={`#${category.mainCategoryName}`}>{category.mainCategoryName}</Link>
//                   <ul className='p-0'>
//                     {category.subcategories.map((subcategory, index) => (
//                       <li className='footer-product-api' key={index}>
//                         <Link to={`/product-related/${subcategory.subcategoryName}`}>{subcategory.subcategoryName}</Link>
//                       </li>
//                     ))}
//                   </ul>
//                 </li>
//               ))}
//             </ul>
//           </div> */}
//           <div className="footer-section">
//             <h3>NEED HELP?</h3>
//             <Link to="/contact-us">
//               <i className="bi bi-arrow-right-short"></i> Contact Us
//             </Link>
//             <Link to="/frequently-asked-questions">
//               <i className="bi bi-arrow-right-short"></i> FAQs
//             </Link>
//           </div>
//           <div className="footer-section">
//             <h3>FOLLOW US</h3>
//             <Link
//               to="https://www.instagram.com/p/DCTnSTiPzrp/?igsh=MTA1YXpubGVlOXhjZg=="
//               target="_blank"
//             >
//               <i className="bi bi-arrow-right-short"></i> Instagram
//             </Link>
//             <Link to="https://wa.me/919508080807" target="_blank">
//               <i className="bi bi-arrow-right-short"></i> Whatsapp
//             </Link>
//           </div>
//         </div>
//         {/* Bottom Footer */}
//         <div className="footer-bottom">
//           <p className="mb-0">
//             © 2024 Cake Bakery | Crafted with by{" "}
//             <a href="https://www.digiindiasolutions.com" className="heart">
//               Digi India Solution
//             </a>
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;



import React, { useEffect, useState } from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://bakery-46ac.onrender.com/api/get-category-with-subcategory"
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
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h6>Policy Info</h6>
            <ul>
              <li><Link to="/terms-&-conditions">Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="#">Terms of Use</Link></li>
              <li><Link to="#">Disclaimer</Link></li>
            </ul>
          </div>

          {/* About Company */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h6>About Company</h6>
            <ul>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="#">Careers</Link></li>
              <li><Link to="#">Testimonials</Link></li>
              <li><Link to="#">Blog</Link></li>
            </ul>
          </div>

          {/* API CATEGORY SECTION */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h6>Our Bakery</h6>
            <ul className="footer-scroll">
              {categories.map((cat) =>
                cat.subcategories.map((sub, index) => (
                  <li key={index}>
                    <Link to={`/product-related/${sub.subcategoryName}`}>
                      {sub.subcategoryName}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Need Help */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h6>Need Help ?</h6>
            <ul>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/frequently-asked-questions">FAQs</Link></li>
            </ul>
          </div>

          {/* International */}
          <div className="col-lg-2 col-md-4 col-sm-6">
            <h6>International Presence</h6>
            <ul>
              <li>Dubai</li>
              <li>Qatar</li>
              <li>Saudi Arabia</li>
              <li>Singapore</li>
            </ul>
          </div>

          {/* Subscribe */}
          <div className="col-lg-2 col-md-8">
            <h6>Subscribe Now</h6>
            <p className="subscribe-text">
              Get updates on promotions and offers coupons.
            </p>

            <div className="subscribe-box">
              <i className="bi bi-envelope"></i>
              <input type="email" placeholder="Enter email address" />
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
            Telephone No.: +91-9508080807 | Grievance Officer: Support Team
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
            <img src="/payments.png" alt="payments" />
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
