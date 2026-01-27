import React from "react";
import "./CakeBanners.css";
import pic2 from "../../images/pic/promo2.jpg"
import pic1 from "../../images/pic/promo3.webp"

const cakeBannerData = [
  {
    id: 1,
    image:pic1 ,
    title: "Freshly Baked",
    highlight: "Delicious Cakes",
    subtitle: "Made with love & premium ingredients",
  },
  {
    id: 2,
    image: pic2,
    title: "Celebrate Every Moment",
    highlight: "Sweet Happiness",
    subtitle: "Perfect for birthdays & occasions",
  },
];

const CakeBanners = () => {
  return (
   <>
    <div className="container">
        <div className="cake-banner-container two-banner">
      {cakeBannerData.map((item) => (
        <div className="cake-banner-card" key={item.id}>
          <img src={item.image} alt="cake banner" />
          <div className="cake-overlay">
            <h4>{item.title}</h4>
            <h2>{item.highlight}</h2>
            <p>{item.subtitle}</p>
            <button className="cake-btn">Order Now 🍰</button>
          </div>
        </div>
      ))}
    </div>
    </div>
   </>
  );
};

export default CakeBanners;
