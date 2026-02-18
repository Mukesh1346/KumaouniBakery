import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./category.css";
import axios from "axios";
import cakeImage from "../../images/cake1.jpg";
import { useNavigate } from "react-router-dom"

const Category = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `https://api.ssdipl.com/api/get-subcategory-by-status`
        );
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          setError("Failed to fetch categories");
        }
      } catch (err) {
        setError("Error fetching categories");
        console.error("Error fetching categories:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // SIMPLIFIED slider settings
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
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const activeCategories = categories?.filter((item) => item?.ActiveonHome === true);

  return (
    <section className="category-main">
      <div className="category-container">
        <Slider {...settings}>
          {activeCategories.map((item) => (
            <div key={item?._id} className="category-slide">
              <div
                className="category-link"
                onClick={() => navigate(`/product-related/${item?.subcategoryName?.replace(/\s+/g, "-").toLowerCase()}`,
                  { state: { id: item?._id, status: 'category' } }
                )}
              >
                <img
                  src={`https://api.ssdipl.com/${item?.image}`}
                  alt={item?.subcategoryName}
                  className="category-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = cakeImage;
                  }}
                />
                <p className="category-name">{item?.subcategoryName}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Category;