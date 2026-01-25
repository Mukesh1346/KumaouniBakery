import React from "react";
import HomeBannerSlider from "../BannerSlider/HomeBannerSlider";
import Hero from "../Hero/Hero";
import AllProducts from "../AllProducts/AllProducts";
import Testimonial from "../Testimonial/Testimonial";
import Category from "../Category/Category";
import Occasions from "../Occasions/Occasions";
import CategorySection from "../CategoryCard/CategoryCard";
import BestSellingProduct from "../BestSelling/BestSellingProject";
import WhatsAppChat from "../WhatsApp/WhatsApp";

const Home = () => {
  return (
    <>
      <HomeBannerSlider />
      <Category />
      <WhatsAppChat />
      <Hero />
      <AllProducts />
      <Occasions/>
      <BestSellingProduct/>
      <CategorySection/>
      <Testimonial />
    </>
  );
};

export default Home;
