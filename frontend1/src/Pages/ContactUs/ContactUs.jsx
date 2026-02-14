import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./contactUs.css";
import { FaInstagram } from "react-icons/fa";
import { IoLogoYoutube } from "react-icons/io";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa6";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://www.ssdipl.com/api/send-query`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Thank You!",
          text: "We’ve received your message. Our team will get back to you shortly.",
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong. Please try again later.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Please check your internet connection and try again.",
      });
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      {/* ----breadCrumb---- */}
      <section className="breadCrumb">
        <div className="breadCrumbContent">
          <h1>Contact Us</h1>
          <Link to="/">Home /</Link> <Link to="">Contact Us</Link>
        </div>
      </section>
      {/* ----breadCrumb---- end */}

      {/* ---- Contact Heading ---- */}
      <section>
        <div className="text-center contactHeading">
          <h5
            style={{
              color: "var(--color-brown)",
              fontFamily: "var(--font-family-design)",
            }}
          >
            Get In Touch
          </h5>
          <h1 className="heroPinkHeading">We’d Love To Hear From You</h1>
          <p className="hero-description">
            Have a question, a custom cake idea, or a special celebration in
            mind? Reach out to <strong>cakenpetals</strong> — we’re here to make
            your moments sweeter.
          </p>
        </div>

        {/* ---- Contact Info Boxes ---- */}
        <div className="contactSection container-fluid">
          <div className="row">
            <div className="col-md-3">
              <div className="contactSectionBox">
                <p className="text-light">Address</p>
                <address className="text-light">
                  cakenpetals Bakery  
                  <br />
                  Gurugram, Haryana, India
                </address>
              </div>
            </div>

            <div className="col-md-3">
              <div className="contactSectionBox">
                <p className="text-light">Call Us</p>
                <a href="tel:+919953553051" className="text-light">+91 99535-53051</a>
              </div>
            </div>

            <div className="col-md-3">
              <div className="contactSectionBox">
                <p className="text-light">Email Us</p> 
                <a href="mailto:hello@cakenpetals.com" className="text-light" >
                  hello@cakenpetals.com
                </a>
              </div>
            </div>

            <div className="col-md-3">
              <div className="contactSectionBox">
                <p className="text-light">Follow Us</p>
                <div className="socialMediaLinks text-light">
                  < FaWhatsapp className="fs-3"/>
                  <  IoLogoYoutube className="fs-3"/>
                  <FaSquareXTwitter className="fs-3"/>
                  < FaInstagram className="fs-3"/>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Contact Form & Map ---- */}
      <section className="contactFormSection">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <iframe
                src="https://www.google.com/maps?q=Gurugram,Haryana&output=embed"
                width="100%"
                height="100%"
                style={{ border: "0", borderRadius: "20px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="cakenpetals location"
              ></iframe>
            </div>

            <div className="col-md-6 formSec">
              <form onSubmit={handleSubmit}>
                <div className="form-input mb-3">
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-input mb-3">
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-input mb-3">
                  <input
                    className="form-control"
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-input mb-3">
                  <textarea
                    rows={9}
                    className="form-control"
                    name="message"
                    placeholder="Tell us about your cake or query..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-input mb-3">
                  <input
                    className="form-control"
                    type="submit"
                    value="Send Message"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
