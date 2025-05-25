"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);

  const imageRef = useRef(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const images = [
    { src: "/alex-gagareen-7rvEfL2x-ys-unsplash.jpg", title: "Calm Gaze", desc: "Muted monochrome softness" },
    { src: "/alex-simon-89ba9p3U9yc-unsplash.jpg", title: "Vintage Vibe", desc: "Old soul with new light" },
    { src: "/anton-kotlovskii-6Qxc9PMjpOI-unsplash.jpg", title: "Bold Smile", desc: "Portrait full of joy" },
    { src: "/dineshkumar-m-N_XU4dkhXWU-unsplash.jpg", title: "Soft Poise", desc: "Elegance in black and white" },
    { src: "/dineshkumar-m-og1ym_6W2VU-unsplash.jpg", title: "Profile Mood", desc: "Quiet confidence" },
    { src: "/jhonatan-saavedra-perales-upbjKzCmyQY-unsplash.jpg", title: "Eyes Closed", desc: "Feeling the light" },
    { src: "/leroy-skalstad-fHHhlqIvG84-unsplash.jpg", title: "Contemplation", desc: "Blurred background, sharp soul" },
    { src: "/luiz-rogerio-nunes-kQwosM_X7Nw-unsplash.jpg", title: "Youth Joy", desc: "Smiling through culture" },
    { src: "/luiz-rogerio-nunes-xQkbX1oefW8-unsplash.jpg", title: "Wise Gaze", desc: "Time etched in wrinkles" },
    { src: "/mahdi-chaghari-2B0si_6PdTQ-unsplash.jpg", title: "Warm Light", desc: "Golden tones in home" },
    { src: "/mahdi-chaghari-MyrITFaiRtw-unsplash.jpg", title: "Cinematic Frame", desc: "Like a movie still" },
    { src: "/mahdi-chaghari-PMOUqIhTrUo-unsplash.jpg", title: "Neon Street", desc: "Modern and moody" },
    { src: "/masoud-razeghi-lqtpf-LwtC4-unsplash.jpg", title: "Boardroom Presence", desc: "Suit and silence" },
    { src: "/mykola-roshylo-sYg8htOPnDk-unsplash.jpg", title: "Dreamlike", desc: "Rain and color" },
    { src: "/ryan-grice-vdiva7py4QM-unsplash.jpg", title: "Reflection", desc: "Isolated stillness" },
  ];

  useEffect(() => {
    const cards = gsap.utils.toArray(".portfolio-card");
    let currentSkew = 0;
    let timeoutId;

    const scrollTriggerInstance = ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = self.getVelocity();
        const newSkew = Math.max(-10, Math.min(10, velocity / -300));
        if (Math.abs(newSkew - currentSkew) > 0.1) {
          currentSkew = newSkew;
          gsap.to(cards, {
            skewY: currentSkew,
            duration: 0.3,
            ease: "power2.out",
            overwrite: true,
          });
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            gsap.to(cards, {
              skewY: 0,
              duration: 0.5,
              ease: "power3.out",
            });
            currentSkew = 0;
          }, 150);
        }
      },
    });

    return () => {
      scrollTriggerInstance.kill();
      clearTimeout(timeoutId);
      gsap.set(cards, { skewY: 0 });
    };
  }, []);

  const openLightbox = useCallback((src) => {
    const index = images.findIndex((img) => img.src === src);
    setSlideDirection(null); // No animation on first open
    setSelectedImage(src);
    setCurrentIndex(index);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [images]);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const handleImageLoad = useCallback((src) => {
    setLoadedImages((prev) => ({ ...prev, [src]: true }));
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.min(Math.max(prev + delta, 1), 4));
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };
    if (imageRef.current) imageRef.current.style.cursor = "grabbing";
  }, [zoom, offset]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && zoom > 1) {
      setOffset({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  }, [isDragging, zoom]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      if (imageRef.current)
        imageRef.current.style.cursor = zoom > 1 ? "grab" : "default";
    }
  }, [isDragging, zoom]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (deltaX > threshold && currentIndex < images.length - 1) {
      setSlideDirection("left");
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setSelectedImage(images[next].src);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    } else if (deltaX < -threshold && currentIndex > 0) {
      setSlideDirection("right");
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      setSelectedImage(images[prev].src);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedImage]);
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    

<>
  {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white border border-neutral-200 p-8 rounded-2xl shadow-2xl w-full max-w-xl relative mx-4 sm:mx-0 space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black transition-colors"
            >
              &times;
            </button>
            <h2 className="text-3xl font-serif mb-2 text-gray-900">About Lena Moreau</h2>
            <p className="text-[1.075rem] leading-relaxed text-gray-700 font-light">
              <strong className="text-gray-900 font-medium">Lena Moreau</strong> is a Paris-based
              portrait & fashion photographer who believes <em>light is a language</em>. Her work has
              appeared in <strong>Vogue Local</strong>, <strong>Elan Studio</strong>, and
              <strong> Maison Rive</strong>.
            </p>
            <p className="text-[1.075rem] leading-relaxed text-gray-700 font-light">
              Through mood, tone, and subtle expressions, she captures timeless moments in a soft,
              cinematic language — crafting photographs that feel both intimate and eternal.
            </p>
          </div>
        </div>
      )}
<header className="flex justify-between items-center mb-10 pt-6 px-4 md:px-20 max-w-7xl mx-auto">
       <Link href="/" >
        <div className="text-lg font-bold border py-2 px-4 rounded-full font-serif italic tracking-wide hover:shadow-md hover:shadow-gray-300 transition-all duration-300 ease-in-out">
          M
        </div>
       </Link>
       
        <nav className="flex gap-6 text-sm md:text-base font-medium">
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-in-out after:origin-left transition-all duration-300 ease-in-out"
          >
            About
          </button>

          

          <Link
            href="/portfolio"
            className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-in-out after:origin-left transition-all duration-300 ease-in-out"
          >
            Portfolio
          </Link>

          <button
            onClick={() => alert('Contact functionality coming soon')}
            className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-in-out after:origin-left transition-all duration-300 ease-in-out"
          >
            Contact
          </button>
        </nav>
      </header>

    <div className="min-h-screen bg-white text-black px-4 py-16 select-none">
       
      <h1 className="text-4xl font-serif font-bold text-center mb-12">Portfolio</h1>

      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {images.map((img) => (
          <div
            key={img.src}
            className="portfolio-card relative cursor-pointer break-inside-avoid overflow-hidden rounded-xl shadow-md group"
            onClick={() => openLightbox(img.src)}
          >
            {!loadedImages[img.src] && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
              </div>
            )}
            <img
              ref={(el) => {
                if (el && el.complete && !loadedImages[img.src]) {
                  handleImageLoad(img.src);
                }
              }}
              src={img.src}
              alt={img.title}
              loading="lazy"
              onLoad={() => handleImageLoad(img.src)}
              className={`w-full h-auto rounded-xl transition-transform duration-300 ease-in-out group-hover:scale-105 will-change-transform ${
                loadedImages[img.src] ? "opacity-100" : "opacity-0"
              }`}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex flex-col justify-center items-center text-white text-center px-4">
              <p className="text-lg font-semibold">{img.title}</p>
              <p className="text-sm">{img.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center overflow-hidden"
          onClick={closeLightbox}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-6 text-white text-3xl font-bold hover:text-gray-300 transition z-50"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
            >
              ×
            </button>
            <img
              ref={imageRef}
              src={selectedImage}
              alt="Zoomable"
              className={`max-w-full max-h-full object-contain transition-all duration-300 ease-in-out ${
                slideDirection === "left"
                  ? "animate-slide-in-left"
                  : slideDirection === "right"
                  ? "animate-slide-in-right"
                  : ""
              }`}
              style={{
                transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease",
                cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              }}
              draggable={false}
            />
          </div>
        </div>
      )}

      <div className="mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">Like what you see?</h2>
        <button className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition">
          Hire Me
        </button>
      </div>
    </div>
    </> 
  );
}
