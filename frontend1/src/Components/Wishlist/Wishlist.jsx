import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./wishlist.css";
import pic1 from '../../images/pic/redVelvet.jpg'
import pic2 from '../../images/pic/Product2.avif'
import pic3 from '../../images/pic/vanilla.jpg'

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Static / session data (replace later with API)
    const data = [
      {
        id: 1,
        name: "Beanie with Logo",
        image: pic1,
        price: 20,
        salePrice: 18,
        stock: "In Stock",
        addedOn: "December 5, 2019",
      },
      {
        id: 2,
        name: "Classy shirt",
        image:pic2,
        price: 16,
        salePrice: null,
        stock: "In Stock",
        addedOn: "December 6, 2019",
      },
      {
        id: 3,
        name: "Beanie",
        image: pic3,
        price: 20,
        salePrice: 18,
        stock: "In Stock",
        addedOn: "December 6, 2019",
      },
    ];

    setWishlist(data);
  }, []);

  const handleRemove = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <div className="wishlist-page">
      {/* TITLE */}
      <div className="wishlist-header text-center">
        <div className="heart">♡</div>
        <h1>My Wishlist</h1>
      </div>

      {/* TABLE */}
      <div className="container">
        <div className="wishlist-table">
          <div className="wishlist-row wishlist-head">
            <div></div>
            <div>Product name</div>
            <div>Unit price</div>
            <div>Stock status</div>
            <div></div>
          </div>

          {wishlist.map((item) => (
            <div className="wishlist-row" key={item.id}>
              <div className="remove-icon" onClick={() => handleRemove(item.id)}>
                🗑
              </div>

              <div className="product-info">
                <img src={item.image} alt={item.name} />
                <span>{item.name}</span>
              </div>

              <div className="price">
                {item.salePrice ? (
                  <>
                    <del>${item.price.toFixed(2)}</del>
                    <span className="sale">
                      ${item.salePrice.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span>${item.price.toFixed(2)}</span>
                )}
              </div>

              <div className="stock">{item.stock}</div>

              <div className="action">
                <small>Added on: {item.addedOn}</small>
                <button>Add to cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
