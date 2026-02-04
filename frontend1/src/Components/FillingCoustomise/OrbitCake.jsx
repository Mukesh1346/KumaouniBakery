import { useEffect, useState } from "react";

export default function OrbitCake({ data }) {
  const [active, setActive] = useState(data.items[0]);

  /* RESET ACTIVE ITEM WHEN TAB CHANGES */
  useEffect(() => {
    setActive(data.items[0]);
  }, [data]);

  return (
    <div className="orbit-wrapper">
      {/* BIG CENTER IMAGE */}
      <img src={active.main} alt="" className="main-cake" />

      {/* ORBIT CIRCULAR TABS */}
      {data.items.map((item, index) => (
        <div
          key={item.id}
          className={`orbit-item orbit-${index} ${
            active.id === item.id ? "active" : ""
          }`}
          onClick={() => setActive(item)}
        >
          <img src={item.img} alt="" />
        </div>
      ))}

      {/* TEXT CONTENT */}
      <div className="cake-info">
        <h3>{active.title}</h3>
        <p>{active.desc}</p>
      </div>
    </div>
  );
}
