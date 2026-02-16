import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./category.css";
import axios from "axios";
import cakeImage from "../../images/cake1.jpg"; // Default image if no image is provided
import { useNavigate } from "react-router-dom"

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // State to store fetched categories
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch active subcategories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://api.ssdipl.com/api/get-subcategory-by-status`
        );
        console.log(response.data.data);
        if (response.data.success) {
          setCategories(response.data.data); // Set fetched data to state
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        setError("Error fetching categories");
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false); // Set loading to false
      }
    };

    fetchCategories();
  }, []);

  // Updated slider settings with better mobile handling
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 10 } },
      { breakpoint: 992, settings: { slidesToShow: 5 } },
      { breakpoint: 768, settings: { slidesToShow: 4 } },
      { breakpoint: 576, settings: { slidesToShow: 4 } }, // Added for smaller tablets
      { breakpoint: 480, settings: { slidesToShow: 4, slidesToScroll: 1 } },
      { breakpoint: 360, settings: { slidesToShow: 1.5, slidesToScroll: 1, centerMode: true } }, // Better for very small screens
    ],
  };

  // Display loading message while fetching data
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Display error message if there's an error
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <>
      <section className="category-main">
        <div className="category-container">
          <Slider {...settings}>
            {categories?.filter((item) => item?.ActiveonHome === true).map((item) => (
              <div key={item?._id} className="category-slide">
                <div 
                  className="category-link" 
                  onClick={() => navigate(`/product-related/${item?.subcategoryName?.replace(/\s+/g, "-").toLowerCase()}`, { state: { id: item?._id } })}
                >
                  <div className="category-image-wrapper">
                    <img
                      src={`https://api.ssdipl.com/${item?.image}`}
                      alt={item?.subcategoryName}
                      className="category-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = cakeImage;
                      }}
                    />
                  </div>
                  <p className="category-name">{item?.subcategoryName}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </>
  );
};

export default Category;