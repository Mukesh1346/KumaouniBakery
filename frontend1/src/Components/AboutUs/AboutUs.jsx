import React from "react";
import "./AboutSection.css";
import { Link } from "react-router-dom";

import aboutImg from "../../images/pic/banner.jpg";

const AboutUs = () => {
  return (
    <>
      {/* ---------- Breadcrumb ---------- */}
      {/* <section className="breadCrumb">
        <div className="breadCrumbContent">
          <h1>About Us</h1>
          <Link to="/">Home / </Link>
          <Link to="/about">About Us</Link>
        </div>
      </section> */}

      {/* ---------- Premium About Section ---------- */}
      <section className="premium-about-section">
        {/* LEFT IMAGE */}
        <div className="premium-about-image">
          <img src={aboutImg} alt="cakenpetals bakery" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="premium-about-content">
          <div className="content-block">
            <h3>About</h3>
            <p>
              At <strong>cakenpetals</strong>, we believe every celebration
              deserves a touch of sweetness and a sprinkle of beauty. We design
              artisanal cakes that combine premium ingredients, thoughtful
              craftsmanship, and elegant presentation.
            </p>
          </div>

          <div className="content-block">
            <h3>Responsibilities</h3>
            <ul>
              <li>1. Premium Cake Design & Crafting</li>
              <li>2. Ingredient Quality & Freshness</li>
              <li>3. Creative Customization</li>
              <li>4. Brand Experience & Presentation</li>
              <li>5. Customer Satisfaction & Trust</li>
            </ul>
          </div>

          <div className="content-block">
            <h3>Challenges</h3>
            <p>
              Creating luxury cakes comes with challenges—balancing visual
              elegance with taste perfection, maintaining consistent quality,
              and delivering memorable experiences for life most meaningful
              moments.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
