import React from "react";
import HomeBannerSlider from "../BannerSlider/HomeBannerSlider";
import Hero from "../Hero/Hero";
import AllProducts from "../AllProducts/AllProducts";
import Testimonial from "../Testimonial/Testimonial";
import Category from "../Category/Category";
import Occasions from "../Occasions/Occasions";
import CategorySection from "../CategoryCard/CategoryCard";
import BestSellingProduct from "../BestSelling/BestSellingProject";

const Home = () => {
  return (
    <>
      <HomeBannerSlider />
      <Category />
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
