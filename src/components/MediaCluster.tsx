"use client";
import { useEffect, useRef, useState, useMemo } from "react";
import { gsap } from "gsap";

const MediaCluster = () => {
  const clusterRef = useRef<HTMLDivElement>(null);
  const mediaElements = useRef<(HTMLImageElement | HTMLVideoElement)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const mobileFloatTimelines = useRef<gsap.core.Timeline[]>([]);

  const mediaData = [
    { src: "/assets/web image one.jpg", alt: "AI Neural Networks" },
    { src: "/assets/web 2.jpg", alt: "AI Robot Face" },
    { src: "/assets/we 3.jpg", alt: "Digital Brain" },
    { src: "/assets/web 4.jpg", alt: "Futuristic City" },
    { src: "/assets/web 5.jpg", alt: "Machine Learning" },
    { src: "/assets/web 6.jpg", alt: "AI Lab Students" },
    { src: "/assets/web 7.jpg", alt: "AI Concept 7" },
    { src: "/assets/web 8.jpg", alt: "AI Concept 8" },
    { src: "/assets/web 9 - Copy.jpg", alt: "AI Concept 9" },
    { src: "/assets/web 10 - Copy.jpg", alt: "AI Concept 10" },
    { src: "/assets/web 11 - Copy.jpg", alt: "AI Concept 11" },
    { src: "/assets/web 12 - Copy.jpg", alt: "AI Concept 12" },
  ];

  const basePositions = useMemo(
    () => [
      { x: "-150%", y: "-60%", rotation: -20 },
      { x: "150%", y: "-70%", rotation: 15 },
      { x: "-100%", y: "80%", rotation: 25 },
      { x: "110%", y: "70%", rotation: -10 },
      { x: "0%", y: "-130%", rotation: 5 },
      { x: "40%", y: "-140%", rotation: -15 },
      { x: "-180%", y: "40%", rotation: -30 },
      { x: "170%", y: "10%", rotation: 30 },
      { x: "-200%", y: "-100%", rotation: 40 },
      { x: "200%", y: "-110%", rotation: -35 },
      { x: "-220%", y: "100%", rotation: -20 },
      { x: "210%", y: "90%", rotation: 10 },
    ],
    []
  );

  const parallaxStrengths = useMemo(
    () =>
      Array.from({ length: mediaData.length }).map(() => ({
        x: gsap.utils.random(30, 70),
        y: gsap.utils.random(-70, 70),
        r: gsap.utils.random(-15, 15),
      })),
    [mediaData.length]
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const allMedia = mediaElements.current;
    const homeSection = clusterRef.current?.closest("#home");
    if (!homeSection || allMedia.length === 0) return;

    gsap.killTweensOf(allMedia);
    mobileFloatTimelines.current.forEach((tl) => tl.kill());
    mobileFloatTimelines.current = [];

    // Initial scattered setup
    gsap.set(allMedia, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.2,
      opacity: 0,
      x: () => `${gsap.utils.random(-250, 250)}%`,
      y: () => `${gsap.utils.random(-200, 200)}%`,
      rotation: () => gsap.utils.random(-45, 45),
    });

    // Animate to resting positions
    allMedia.forEach((media, i) => {
      const rest = basePositions[i];
      if (rest) {
        gsap.to(media, {
          x: `${parseFloat(rest.x) + gsap.utils.random(-20, 20)}%`,
          y: `${parseFloat(rest.y) + gsap.utils.random(-20, 20)}%`,
          rotation: rest.rotation + gsap.utils.random(-10, 10),
          opacity: isMobile ? 0.4 : 0.8,
          scale: isMobile ? 0.8 : 1,
          duration: 1.8,
          delay: i * 0.1,
          ease: "power3.out",
        });
      }
    });

    // 🖱️ Desktop mouse parallax
    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const moveX = (e.clientX - centerX) / centerX;
      const moveY = (e.clientY - centerY) / centerY;

      allMedia.forEach((media, i) => {
        const rest = basePositions[i];
        const s = parallaxStrengths[i];
        gsap.to(media, {
          x: `${parseFloat(rest.x) + s.x * moveX}%`,
          y: `${parseFloat(rest.y) + s.y * moveY}%`,
          rotation: rest.rotation + s.r * moveX,
          duration: 0.6,
          ease: "power2.out",
        });
      });
    };

    // 📱 Faster float animation for mobile
    const startMobileFloat = () => {
      allMedia.forEach((media) => {
        const tl = gsap.timeline({ repeat: -1, yoyo: true });
        tl.to(media, {
          x: `+=${gsap.utils.random(-5, 5)}%`,
          y: `+=${gsap.utils.random(-5, 5)}%`,
          rotation: `+=${gsap.utils.random(-5, 5)}`,
          duration: gsap.utils.random(0, 0.5), 
          ease: "sine.inOut",
        });
        mobileFloatTimelines.current.push(tl);
      });
    };

    if (isMobile) startMobileFloat();
    else homeSection.addEventListener("mousemove", handleMouseMove);

    return () => {
      homeSection.removeEventListener("mousemove", handleMouseMove);
      mobileFloatTimelines.current.forEach((tl) => tl.kill());
      mobileFloatTimelines.current = [];
    };
  }, [isMobile, basePositions, parallaxStrengths]);

  return (
    <div
      ref={clusterRef}
      id="image-cluster"
      className="absolute inset-0 w-full h-full z-0 overflow-hidden"
    >
      <div className="relative w-full h-full">
        {mediaData.map((media, index) => (
          <img
            key={index}
            ref={(el) => {
              if (el) mediaElements.current[index] = el;
            }}
            src={media.src}
            alt={media.alt}
            loading="lazy"
            className="absolute top-1/2 left-1/2 w-32 md:w-52 rounded-xl shadow-2xl object-cover select-none pointer-events-none"
          />
        ))}
      </div>
    </div>
  );
};

export default MediaCluster;
