'use client';
import React, { useEffect, useRef, useState } from 'react';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !wrapperRef.current) return;

    // Use GSAP context for proper cleanup
    const ctx = gsap.context(() => {
      const pinHeight = items.length * window.innerHeight;
      
      // Main ScrollTrigger
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: `+=${pinHeight}`,
        pin: pinRef.current,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const index = Math.floor(self.progress * items.length);
          setActive(Math.min(index, items.length - 1));
        }
      });

      // Entrance animation
      gsap.fromTo(
        pinRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );
    });

    return () => ctx.revert(); // Proper cleanup
  }, [isClient]);

  if (!isClient) return null; // Avoid SSR issues

  return (
    <section ref={wrapperRef} className="cake-scroll-wrapper">
      <div ref={pinRef} className="cake-pin">
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            
            {/* Left Image */}
            <div className="col-lg-6 text-center">
              <div className="cake-main">
                <img 
                  src={items[active]?.img?.src || items[active]?.img} 
                  alt={items[active]?.title}
                  className="cake-main-img"
                />
              </div>
            </div>

            {/* Right Orbit */}
            <div className="col-lg-6 position-relative">
              <div className="orbit-area">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className={`orbit-item orbit-${i} ${active === i ? 'active' : ''}`}
                  >
                    <img 
                      src={item.img?.src || item.img} 
                      alt={item.title}
                    />
                    <div className="orbit-text">
                      <h6>{item.title}</h6>
                      <p>{item.subtitle}</p>
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