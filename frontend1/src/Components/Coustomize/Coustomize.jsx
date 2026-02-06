import React, { useEffect, useRef, useState } from "react";
import "./coustomize.css";

import cake1 from "../../images/pic/cake2.png";
import cake2 from "../../images/pic/product1.png";
import cake3 from "../../images/pic/product2.png";

const images = [cake1, cake2, cake3];

const Coustomize = () => {
  const [customers, setCustomers] = useState(0);
  const [venues, setVenues] = useState(0);
  const [rating, setRating] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const counterRef = useRef(false);
  const sliderRef = useRef(false);

  /* =====================
     COUNTER ANIMATION
  ===================== */
  useEffect(() => {
    if (counterRef.current) return;
    counterRef.current = true;

    const interval = setInterval(() => {
      setCustomers((p) => (p < 10000 ? p + 200 : p));
      setVenues((p) => (p < 50 ? p + 1 : p));
      setRating((p) => (p < 4.9 ? +(p + 0.1).toFixed(1) : p));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  /* =====================
     IMAGE SLIDER
  ===================== */
  useEffect(() => {
    if (sliderRef.current) return;
    sliderRef.current = true;

    const interval = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-container">

        {/* LEFT */}
        <div className="hero-content">
          <h1>
            Design Your Dream <br />
            Cake & Celebrate <br />
            in Style
          </h1>

          <p>
            Create personalized celebration cakes with our interactive designer,
            then discover the perfect venue to make your event unforgettable.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Start Customizing</button>
            <button className="btn-outline">View Gallery</button>
          </div>

          <div className="hero-stats">
            <div>
              <h3>{customers.toLocaleString()}+</h3>
              <span>Happy Customers</span>
            </div>
            <div>
              <h3>{venues}+</h3>
              <span>Venue Partners</span>
            </div>
            <div>
              <h3>{rating}★</h3>
              <span>Average Rating</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-img-slider">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="Cake"
              className={i === currentSlide ? "active" : ""}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Coustomize;
