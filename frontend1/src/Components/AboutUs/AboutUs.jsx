import React from "react";
import "./AboutSection.css";
import { Link } from "react-router-dom";

import aboutImg from "../../images/cake1.jpg";

import team1 from "../../images/1.png";
import team2 from "../../images/2.png";
import team3 from "../../images/5.png";
import team4 from "../../images/4.png";

const AboutUs = () => {
  const teamMembers = [
    {
      imgSrc: team1,
      name: "Aadil Khan",
      position: "Founder & Head Baker",
    },
    {
      imgSrc: team2,
      name: "Dev Sisodiya",
      position: "Creative Cake Designer",
    },
    {
      imgSrc: team3,
      name: "Mukesh",
      position: "Full Stack Developer",
    },
    {
      imgSrc: team4,
      name: "Gourav Panchal",
      position: "Customer Experience Lead",
    },
  ];

  return (
    <>
      {/* ---------- Breadcrumb ---------- */}
      <section className="breadCrumb">
        <div className="breadCrumbContent">
          <h1>About Us</h1>
          <Link to="/">Home /</Link> <Link to="/about">About Us</Link>
        </div>
      </section>

      {/* ---------- About Section ---------- */}
      <section className="about-container container">
        <div className="about-image-container">
          <img
            src={aboutImg}
            alt="cakenpetals bakery"
            className="about-image w-100"
          />
        </div>

        <div className="about-content">
          <p className="ourTeam_miniHeading">// About Us</p>
          <h3 className="about-title">
          Artful Cakes for Life's Sweetest Celebrations. Add More Products.
          </h3>

          <p className="about-text">
            At <strong>cakenpetals</strong>, we believe every celebration deserves
            a touch of sweetness and a sprinkle of beauty. Inspired by the
            delicacy of petals and the joy of freshly baked cakes, we create
            desserts that are as delightful to look at as they are to taste.
          </p>

          <p className="about-text">
            Each cake is crafted with love, premium ingredients, and thoughtful
            design—bringing together flavor, artistry, and emotion. From
            intimate moments to grand celebrations, cakenpetals is here to turn
            your special occasions into unforgettable memories, one slice at a
            time.
          </p>
        </div>
      </section>

      {/* ---------- Vision & Mission ---------- */}
      <section className="about-vision-mission container">
        <div className="row">
          <div className="col-md-6">
            <h4 className="about-subtitle">Our Vision</h4>
            <p className="about-text">
              To become a beloved cake brand known for blending artistry, flavor,
              and heartfelt celebrations—where every cake feels personal,
              beautiful, and memorable.
            </p>
          </div>

          <div className="col-md-6">
            <h4 className="about-subtitle">Our Mission</h4>
            <ul className="about-features-list">
              <li className="about-feature-item">
                ✔ To create high-quality, delicious cakes using fresh and
                premium ingredients
              </li>
              <li className="about-feature-item">
                ✔ To design cakes that reflect elegance, creativity, and emotion
              </li>
              <li className="about-feature-item">
                ✔ To make every celebration sweeter through thoughtful
                craftsmanship and care
              </li>
              <li className="about-feature-item">
                ✔ To continuously innovate while staying true to our passion for
                baking and beauty
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Our Team ---------- */}
      {/* <section className="OurTeam">
        <div className="team-section container">
          <p className="ourTeam_miniHeading">// Our Team</p>
          <h2>The Hearts Behind cakenpetals</h2>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <div className="team-member-photo">
                  <img src={member.imgSrc}  className="teamPic" alt={member.name} />
                </div>
                <h3 className="mt-3">{member.name}</h3>
                <p className="mb-0">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </>
  );
};

export default AboutUs;
