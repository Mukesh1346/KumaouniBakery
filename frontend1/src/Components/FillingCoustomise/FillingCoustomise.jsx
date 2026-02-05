import { useState } from "react";
import OrbitCake from "./OrbitCake";
import "./cakeCustomizer.css";

import pic1 from "../../images/chocolate/chocolate1.jpg";
import pic2 from "../../images/chocolate/chocolate2.jpg";
import pic3 from "../../images/chocolate/chocolate3.jpg";
import pic4 from "../../images/chocolate/chocolate4.jpg";
import img1 from '../../images/pic/img1.png'
import img2 from '../../images/pic/img2.png'
import img3 from '../../images/pic/img3.png'
import img4 from '../../images/pic/img4.png'
import img5 from '../../images/pic/img5.png'
/* ===========================
   DATA FOR ALL 6 TABS
=========================== */
const cakeSets = {
  cakes: {
    name: "Cakes",
    items: [   
      { id: 1, title: "Mold Sponge", desc: "Light cocoa sponge layers.", img: img1, main: img1 },
      { id: 2, title: "Chocolate Truffle", desc: "Rich chocolate ganache.", img: img2, main: img2 },
      { id: 3, title: "Soft Caramel", desc: "Buttery caramel layer.", img: img3, main: img3 },
      { id: 4, title: "Berry Confit", desc: "Tangy berry sweetness.", img: img4, main: img4 },
      { id: 5, title: "Crunchy Base", desc: "Crunchy biscuit base.", img: img5, main: img5 },
    ],
  },

  cupcakes: {
    name: "Cupcakes",
    items: [
      { id: 1, title: "Vanilla Cupcake", desc: "Soft vanilla cream.", img: pic2, main: pic4 },
      { id: 2, title: "Choco Cupcake", desc: "Chocolate filled cupcake.", img: pic1, main: pic2 },
    ],
  },

  pastries: {
    name: "Pastries",
    items: [
      { id: 1, title: "French Pastry", desc: "Creamy layered pastry.", img: pic3, main: pic1 },
      { id: 2, title: "Almond Pastry", desc: "Crunchy almond topping.", img: pic4, main: pic2 },
    ],
  },

  brownies: {
    name: "Brownies",
    items: [
      { id: 1, title: "Fudge Brownie", desc: "Dense chocolate brownie.", img: pic1, main: pic3 },
      { id: 2, title: "Walnut Brownie", desc: "With crunchy walnuts.", img: pic2, main: pic4 },
    ],
  },

  donuts: {
    name: "Donuts",
    items: [
      { id: 1, title: "Chocolate Donut", desc: "Chocolate glazed donut.", img: pic3, main: pic1 },
      { id: 2, title: "Strawberry Donut", desc: "Berry coated donut.", img: pic4, main: pic2 },
    ],
  },

  cookies: {
    name: "Cookies",
    items: [
      { id: 1, title: "Choco Chip", desc: "Classic choco chips.", img: pic1, main: pic4 },
      { id: 2, title: "Butter Cookie", desc: "Soft butter cookie.", img: pic2, main: pic3 },
    ],
  },
};

export default function CakeCustomizer() {
  const [category, setCategory] = useState("cakes");

  return (
    <div className="container-fluid CoustomContainer py-5">
      <div className="row">
        {/* LEFT SECTION */}
        <div className="col-md-8">
          <OrbitCake data={cakeSets[category]} />
        </div>

        {/* RIGHT SECTION */}
        <div className="col-md-4">
          <h5 className="mb-3">Choose Category</h5>

          {Object.entries(cakeSets).map(([key, value]) => (
            <button
              key={key}
              className={`cat-btn ${category === key ? "active" : ""}`}
              onClick={() => setCategory(key)}
            >
              {value.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
