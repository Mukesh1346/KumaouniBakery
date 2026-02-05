import OrbitCake from "./OrbitCake";
import "./cakeCustomizer.css";

import img1 from "../../images/pic/img1.png";
import img2 from "../../images/pic/img2.png";
import img3 from "../../images/pic/img3.png";
import img4 from "../../images/pic/img4.png";
import img5 from "../../images/pic/img5.png";

const cakeData = [
  { id: 1, title: "Mold Sponge", desc: "Light cocoa sponge layers.", img: img1 },
  { id: 2, title: "Chocolate Truffle", desc: "Rich chocolate ganache.", img: img2 },
  { id: 3, title: "Soft Caramel", desc: "Buttery caramel layer.", img: img3 },
  { id: 4, title: "Berry Confit", desc: "Tangy berry sweetness.", img: img4 },
  { id: 5, title: "Crunchy Base", desc: "Crunchy biscuit base.", img: img5 },
];

export default function CakeCustomizer() {
  return (
    <>
      {/* NORMAL SCROLL → STICKY → NORMAL */}
      <section className="cake-scroll-section">
        <OrbitCake items={cakeData} />
      </section>

    </>
  );
}
