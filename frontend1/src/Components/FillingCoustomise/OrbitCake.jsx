import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OrbitCake({ items }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const orbitRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const total = items.length;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * total}`,
        pin: pinRef.current,
        scrub: 1,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const index = Math.min(
            total - 1,
            Math.floor(self.progress * total)
          );
          setActive(index);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <div
      ref={sectionRef}
      className="cake-scroll-wrapper"
      style={{ height: `${items.length * 100}vh` }}  // 🔥 PERFECT SCROLL HEIGHT
    >
      <div ref={pinRef} className="cake-pin">
        
        {/* CENTER CAKE */}
        <img
          src={items[active].img}
          className="main-cake"
          alt={items[active].title}
        />

        {/* ORBIT */}
        {items.map((item, i) => (
          <div
            key={item.id}
            className={`orbit-item orbit-${i}`}
            ref={(el) => (orbitRefs.current[i] = el)}
          >
            <img src={item.img} alt={item.title} />
          </div>
        ))}

        {/* TEXT */}
        <div className="cake-info">
          <h2>{items[active].title}</h2>
          <p>{items[active].desc}</p>
        </div>
      </div>
    </div>
  );
}
