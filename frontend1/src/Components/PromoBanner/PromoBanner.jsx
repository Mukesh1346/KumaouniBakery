import React from "react";
import "./PromoBanners.css";
import pic1 from "../../images/1583 by 426 banner/Banner1.jpg"
import pic2 from "../../images/1583 by 426 banner/Banner2.jpg"
import pic3 from "../../images/1583 by 426 banner/Banner1.jpg"

const cakeBannerData = [
  {
    id: 1,
    image: pic1,
    title: "Freshly Baked",
    highlight: "Delicious Cakes",
    subtitle: "Made with love & premium ingredients",
  },
  {
    id: 2,
    image: pic2,
    title: "Celebrate Every Moment",
    highlight: "With Sweet Happiness",
    subtitle: "Perfect for birthdays & occasions",
  },
  {
    id: 3,
    image: pic3,
    title: "Handcrafted Desserts",
    highlight: "Taste The Perfection",
    subtitle: "Soft, creamy & irresistible flavors",
  },
];

const PromoBanner = () => {
  return (
   <>
   <div className="container">
     <div className="cake-banner-container">
      {cakeBannerData.map((item) => (
        <div className="cake-banner-card" key={item.id}>
          <img src={item.image} alt="cake banner" />
          {/* <div className="cake-overlay">
            <h4>{item.title}</h4>
            <h2>{item.highlight}</h2>
            <p>{item.subtitle}</p>
            <button className="cake-btn">Order Now 🍰</button>
          </div> */}
        </div>
      ))}
    </div>
   </div>
   </>
  );
};

export default PromoBanner;
