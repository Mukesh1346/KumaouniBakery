'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './CakeIngredientScroll.css';
import img1 from "../../images/pic/img1.png";
import img2 from "../../images/pic/img2.png";
import img3 from "../../images/pic/img3.png";
import img4 from "../../images/pic/img4.png";
import img5 from "../../images/pic/img5.png";

gsap.registerPlugin(ScrollTrigger);

const items = [
  { img: img1, title: 'Moist Sponge', subtitle: 'Light cocoa sponge soaked with chocolate syrup' },
  { img: img2, title: 'Chocolate Truffle', subtitle: 'Rich Belgian chocolate with smooth ganache' },
  { img: img3, title: 'Salted Caramel', subtitle: 'Perfectly balanced homemade caramel layer' },
  { img: img4, title: 'Berry Confit', subtitle: 'Slow cooked berries with tangy sweetness' },
  { img: img5, title: 'Crunchy Base', subtitle: 'Caramelized crunch for texture' },
];

export default function CakeIngredientScroll() {
  const wrapperRef = useRef(null);
  const pinRef = useRef(null);
  const [active, setActive] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsReady(true);
  }, []);

useEffect(() => {
  if (!wrapperRef.current) return;

  const vh = window.innerHeight;
  const totalScrollDistance = (items.length - 0.5) * vh;

  const trigger = ScrollTrigger.create({
    trigger: wrapperRef.current,
    start: 'top top',
    end: `+=${totalScrollDistance}`,
    pin: pinRef.current,
    pinSpacing: true,
    scrub: true,
    anticipatePin: 1,

    onUpdate: (self) => {
      const index = Math.round(self.progress * (items.length - 1));
      setActive(index);

      // ✅ FORCE opacity always 1
      gsap.set(pinRef.current, { opacity: 1 });
    }
  });

  return () => trigger.kill();
}, []);

  const handleItemClick = useCallback((index) => {
    setActive(index);
  }, []);

  return (
    <section 
      ref={wrapperRef} 
      className="cake-scroll-section"
      
    >
      <div ref={pinRef} className="cake-scroll-pin">
        <div className="cake-container">
          <div className="cake-content">
            
            {/* Left Image */}
            <div className="cake-left">
              <div className="cake-main-image-container">
                <img 
                  src={items[active]?.img || items[0].img} 
                  alt={items[active]?.title || 'Cake'}
                  className="cake-main-img"
                  key={active}
                />
              </div>
            </div>

            {/* Right Orbit - Using your original orbit positions */}
            <div className="cake-right">
              <div className="cake-orbit-wrapper">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className={`cake-orbit-unit cake-orbit-pos-${i} ${active === i ? 'cake-active' : ''}`}
                    onClick={() => handleItemClick(i)}
                  >
                    <div className="cake-orbit-img-box">
                      <img 
                        src={item.img} 
                        alt={item.title}
                        className="cake-orbit-img"
                      />
                    </div>
                    <div className="cake-orbit-content">
                      <h4 className="cake-orbit-heading">{item.title}</h4>
                      <p className="cake-orbit-desc">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}