import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OrbitCake({ items }) {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,

        // ✅ allow normal partial scroll first
        start: "top 75%",

        // ✅ pin only when section is fully reached
        end: `+=${items.length * window.innerHeight}`,

        pin: pinRef.current,
        scrub: true,
        anticipatePin: 1,

        onUpdate: (self) => {
          const index = Math.round(self.progress * (items.length - 1));
          setActive(index);
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [items.length]);

  return (

    <>

    
    <section ref={wrapperRef} className="cake-scroll-wrapper">
      <div ref={pinRef} className="cake-pin">

        <img
          src={items[active].img}
          className="main-cake"
          alt={items[active].title}
        />

        {items.map((item, i) => (
          <div key={item.id} className={`orbit-item orbit-${i}`}>
            <img src={item.img} alt={item.title} />
          </div>
        ))}

        <div className="cake-info">
          <h2>{items[active].title}</h2>
          <p>{items[active].desc}</p>
        </div>

      </div>
    </section>
    </>
  );
}
