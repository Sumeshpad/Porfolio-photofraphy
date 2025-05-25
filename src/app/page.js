"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";


export default function Home() {
  const lenaRefs = useRef([]);
  const moreauRefs = useRef([]);
  const imageRef = useRef(null);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const quoteRef = useRef(null);
  const socialRef = useRef(null);
  const aboutModalCardRef = useRef(null); // Using this name for the About modal's ref
  const contactModalCardRef = useRef(null); // NEW: Ref for the Contact modal's card

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false); // Renamed original isModalOpen
  const [isContactOpen, setIsContactOpen] = useState(false); // NEW: State for Contact modal visibility

  const [currentImage, setCurrentImage] = useState("/photos/Hero Image.webp");

  const heroImages = [
    "/photos/Hero Image.webp",
    "/photos/20250514_2314_Happy Tourist Posing_remix_01jv7y97g5fv1rybc653mg175c.png"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => {
        const currentIndex = heroImages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % heroImages.length;
        return heroImages[nextIndex];
      });
    }, 7000);

    return () => clearInterval(interval);
  }, [heroImages]); // Added heroImages to dependency array

  // GSAP entry animation for Hero (Keeping your original logic)
  useEffect(() => {
    gsap.set([
      quoteRef.current,
      ...lenaRefs.current,
      ...moreauRefs.current,
      imageRef.current,
      headerRef.current,
      contentRef.current,
      socialRef.current
    ], { opacity: 0 });

    gsap.set(imageRef.current, {
      opacity: 0,
      x: 32,
    });

    const tl = gsap.timeline();

    tl.to(quoteRef.current, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: "power3.out"
    })
      .to(lenaRefs.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.12,
      })
      .to(moreauRefs.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.12,
      })
      .to(imageRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: "power3.out",
      })
      .to([headerRef.current, contentRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.2,
      })
      .to(socialRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      });
  }, []);

  // Animate "About" modal on open
  useEffect(() => {
    if (isAboutModalOpen) { // Use the renamed state
      gsap.from(aboutModalCardRef.current, { // Use the renamed ref
        y: -100,
        rotate: -5,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, [isAboutModalOpen]); // Use the renamed state

  // NEW: Animate "Contact" modal on open
  useEffect(() => {
    if (isContactOpen) {
      gsap.from(contactModalCardRef.current, { // Target the new ref
        y: -100,
        rotate: -5,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, [isContactOpen]); // Listen to the new state

  // NEW: Function to open About modal and ensure Contact modal is closed
  const openAboutModalHandler = () => {
    setIsContactOpen(false);
    setIsAboutModalOpen(true);
  };

  // NEW: Function to open Contact modal and ensure About modal is closed
  const openContactModalHandler = () => {
    setIsAboutModalOpen(false);
    setIsContactOpen(true);
  };


  return (
    <main className="md:h-screen md:overflow-hidden overflow-x-hidden text-black px-6 md:px-20 max-w-7xl mx-auto ">
      {/* About Modal */}
      {isAboutModalOpen && ( // Use renamed state
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div
          ref={aboutModalCardRef} // Use renamed ref
          className="bg-white border border-neutral-200 p-8 rounded-2xl shadow-2xl w-full max-w-xl relative mx-4 sm:mx-0 space-y-4"
        >
          <button
            onClick={() => setIsAboutModalOpen(false)} // Use renamed setter
            className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black transition-colors"
            aria-label="Close about modal"
          >
            ×
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

      {/* NEW: Contact Modal */}
      {isContactOpen && ( // Use new state for contact modal
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div
          ref={contactModalCardRef} // Use the new ref for contact modal card
          className="bg-white border border-neutral-200 p-8 rounded-2xl shadow-2xl w-full max-w-xl relative mx-4 sm:mx-0 space-y-4"
        >
          <button
            onClick={() => setIsContactOpen(false)} // Close contact modal using its state setter
            className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-black transition-colors"
            aria-label="Close contact modal"
          >
            ×
          </button>

          <h2 className="text-3xl font-serif mb-2 text-gray-900">Contact Lena</h2> {/* Placeholder Title */}

          <p className="text-[1.075rem] leading-relaxed text-gray-700 font-light">
            For inquiries, collaborations, or just to say hello, please reach out.
            {/* Placeholder Content */}
          </p>
          <p className="text-[1.075rem] leading-relaxed text-gray-700 font-light">
            Email: <a href="mailto:lena.moreau.photo@example.com" className="text-blue-600 hover:underline">lena.moreau.photo@example.com</a>
            <br />
            You can also find Lena on social media linked below.
             {/* Placeholder Content */}
          </p>
        </div>
      </div>
      )}
      

      {/* Header */}
      <header
        ref={headerRef}
        className="flex justify-between items-center mb-10 pt-6 opacity-0 translate-y-4"
      >
        <div className="text-lg font-bold border py-2 px-4 rounded-full font-serif italic tracking-wide hover:shadow-md hover:shadow-gray-300 transition-all duration-300 ease-in-out">
          M
        </div>
        <nav className="flex gap-6 text-sm md:text-base font-medium" aria-label="Main navigation">
          <button
            onClick={openAboutModalHandler} // Use new handler for About
            className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-in-out after:origin-left transition-all duration-300 ease-in-out"
          >
            About
          </button>
        <>
  <Link
    href="/portfolio"
    className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-in-out after:origin-left transition-all duration-300 ease-in-out"
  >
    Portfolio
  </Link>

 <button
    onClick={openContactModalHandler} // Use new handler for Contact
    className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:bg-black after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-in-out after:origin-left transition-all duration-300 ease-in-out"
  >
    Contact
  </button>
</>

        </nav>
      </header>

      {/* Hero Section (Keeping your original structure and classes) */}
      <section className="flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-20 overflow-x-hidden">
        {/* Text Block */}
        <div className="flex flex-col flex-1 text-left space-y-6 max-w-xl">
          <div className="flex flex-col gap-1 leading-none text-[4.5rem] md:text-[5rem] font-serif tracking-tight">
            <div className="flex gap-[0.2rem] justify-start">
              {"Lena".split("").map((char, index) => (
                <span
                  key={`lena-${index}`}
                  ref={(el) => (lenaRefs.current[index] = el)}
                  className="inline-block opacity-0 translate-y-8"
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="flex gap-[0.2rem] justify-start -mt-2">
              {"Moreau".split("").map((char, index) => (
                <span
                  key={`moreau-${index}`}
                  ref={(el) => (moreauRefs.current[index] = el)}
                  className="inline-block opacity-0 translate-y-8"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Quote */}
          <p
            ref={quoteRef}
            className="italic text-gray-500 text-base md:text-lg opacity-0 -translate-x-4 border-l-4 pl-4 border-neutral-300"

          >
            “La lumière naturelle est ma muse.”
          </p>

          {/* Description */}
          <div
            ref={contentRef}
            className="flex flex-col space-y-4 text-[1.125rem] leading-relaxed text-neutral-700 opacity-0 translate-y-4"
          >
            <p className="text-lg font-medium text-black">
              Fashion · Portrait Photographer · Paris
            </p>
            <p className="text-balance">
              Capturing beauty in stillness and simplicity. Based in Paris, I craft quiet,
              elegant frames that tell stories through mood and light.
            </p>
            <p className="text-sm text-neutral-500 text-balance">
              Clients include Elan Studio, Maison Rive, The Edit Journal, and Vogue Local.
            </p>
          </div>

          {/* Social Links */}
          <div
            ref={socialRef}
            className="flex gap-6 pt-2 opacity-0 translate-y-4"
          >
            <a
              href="#"
              className="hover:scale-105 transition-all duration-300 ease-in-out underline underline-offset-4"
            >
              Instagram
            </a>
            <a
              href="#"
              className="hover:scale-105 transition-all duration-300 ease-in-out underline underline-offset-4"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Image (Keeping your original Image component setup) */}
        <div className="flex justify-center md:justify-end flex-1 max-h-[90vh]  ">
          <Image
            ref={imageRef}
            src={currentImage}
            alt="Portrait of Lena Moreau in natural light"
            width={400}
            height={300}
            className="object-cover rounded-2xl border border-black  opacity-0  hover:brightness-100 grayscale hover:grayscale-0  transition-all duration-300 ease-in-out will-change-transform"
          />
        </div>
      </section>
    </main>
  );
}