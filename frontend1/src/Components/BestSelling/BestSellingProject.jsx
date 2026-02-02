import React, { useState } from "react";
import "./bestSelling.css";
import pic1 from "../../images/pic/Product1.avif";
import pic2 from "../../images/pic/Product2.avif";
import pic3 from "../../images/pic/Product3.avif";
import pic4 from "../../images/pic/Product4.avif";
import pic5 from "../../images/pic/Product4.avif";
import pic6 from "../../images/pic/Product4.avif";
import pic7 from "../../images/pic/Product4.avif";
import pic8 from "../../images/pic/Product4.avif";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const BestSellingProduct = () => {
  // ✅ Wishlist state
  const [wishlist, setWishlist] = useState([]);

  // ✅ Static Data
  const products = [
    {
      id: 1,
      name: "10 Red Roses Bouquet",
      image: pic1,
      price: 695,
      oldPrice: 845,
      off: "18% OFF",
      rating: 4.9,
      reviews: 1645,
      delivery: "In 3 hours",
    },
    {
      id: 2,
      name: "Blush Heart Chocolate Cake",
      image: pic2,
      price: 775,
      oldPrice: 995,
      off: "23% OFF",
      rating: 4.8,
      reviews: 1022,
      delivery: "In 3 hours",
    },
    {
      id: 3,
      name: "Aromatic Choco Hamper",
      image: pic3,
      price: 1165,
      oldPrice: 1445,
      off: "20% OFF",
      rating: 4.7,
      reviews: 812,
      delivery: "In 3 hours",
    },
    {
      id: 4,
      name: "Twin Hearts Floral Balloon Bouquet",
      image: pic4,
      price: 1095,
      oldPrice: 1445,
      off: "25% OFF",
      rating: 4.8,
      reviews: 945,
      delivery: "In 3 hours",
    },
    {
      id: 5,
      name: "Money Plant In Black Mandala Pot",
      image: pic5,
      price: 595,
      oldPrice: 699,
      off: "15% OFF",
      rating: 4.6,
      reviews: 3,
      delivery: "Tomorrow",
    },
    {
      id: 6,
      name: "Purple Orchids n Floral Cake Combo",
      image: pic6,
      price: 1545,
      oldPrice: 1695,
      off: "9% OFF",
      rating: 4.9,
      reviews: 1190,
      delivery: "In 3 hours",
    },
    {
      id: 7,
      name: "Blue Orchid Jute Bouquet",
      image: pic7,
      price: 895,
      oldPrice: 1095,
      off: "19% OFF",
      rating: 4.9,
      reviews: 482,
      delivery: "In 3 hours",
    },
    {
      id: 8,
      name: "Bows N Blush Chocolate Cream Cake",
      image: pic8,
      price: 695,
      oldPrice: null,
      off: null,
      rating: 4.7,
      reviews: 221,
      delivery: "In 3 hours",
    },
  ];

  // ✅ Toggle wishlist
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold BestSellingtitle mb-1">
            Best Selling Flowers & Gifts
          </h4>
          <p className="text-muted mb-0">Surprise Your Loved Ones</p>
        </div>
        <button className="btn btn-dark px-4">View All</button>
      </div>

      {/* Product Grid */}
      <div className="row g-4">
        {products.map((item) => (
          <div
            className="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-6"
            key={item.id}
          >
            <div className="product-card">

              {/* Image */}
              <div className="product-img">
                <img src={item.image} alt={item.name} />

                {/* ❤️ Wishlist */}
                <span
                  className="wishlist"
                  onClick={() => toggleWishlist(item.id)}
                >
                  {wishlist.includes(item.id) ? (
                    <FaHeart color="red" />
                  ) : (
                    <FaRegHeart />
                  )}
                </span>
              </div>

              {/* Content */}
              <div className="product-body">
                <p className="product-title">{item.name}</p>

                <div className="price-row">
                  <span className="price">₹ {item.price}</span>
                  {item.oldPrice && (
                    <>
                      <span className="old-price">₹ {item.oldPrice}</span>
                      <span className="off">{item.off}</span>
                    </>
                  )}
                </div>

                <div className="rating">
                  ⭐ {item.rating} <span>({item.reviews} Reviews)</span>
                </div>

                <p className="delivery">
                  Earliest Delivery : <span>{item.delivery}</span>
                </p>

                {/* ✅ Buy Now Button */}
                <Link
                  to={`/product-details/${item.name}`}
                  className="btn btn-dark w-100 mt-2"
                >
                  Buy Now
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellingProduct;
