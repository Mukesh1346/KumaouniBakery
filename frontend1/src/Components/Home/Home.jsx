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
import PromoBanner from "../PromoBanner/PromoBanner";
import CakeBanners from "../CakeBanner/CakeBanner";
import Banner from "../BottomBanner/Banner";
import FeaturedProducts from "../FeatureProducts/FeatureProducts";
import ReelSection from "../ReelSection/ReelSection";
import Coustomize from "../Coustomize/Coustomize";
import FillingCustomizer from "../FillingCoustomise/FillingCoustomise";
import CakeStory from "../CakeStory/CakeIngredientScroll";
import CakeIngredientScroll from "../CakeStory/CakeIngredientScroll";

const Home = () => {
  return (
    <>
      <HomeBannerSlider />
      <Category />
      <WhatsAppChat />
      <CakeBanners/>
      <ReelSection/>
      <AllProducts />
      <Coustomize/>
      <Hero />
      <FeaturedProducts/>
      <CakeIngredientScroll/>
      {/* <FillingCustomizer/> */}
      <PromoBanner/>
      <Occasions/>
      <BestSellingProduct/>
      {/* <CategorySection/> */}
      <Testimonial />
      <Banner/>
    </>
  );
};

export default Home;
