import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const revealElementsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const revealElements = revealElementsRef.current.filter(Boolean);
    
    if (revealElements.length > 0 && sectionRef.current) {
      gsap.fromTo(
        revealElements,
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealElementsRef.current.includes(el)) {
      revealElementsRef.current.push(el);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="section-full bg-dark-bg text-dark-fg z-20"
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        
        {/* LEFT: Text Section */}
        <div className="text-left">
          <h2 
            ref={addToRefs}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter title-hover-neon-green"
          >
            Our Mission
          </h2>

          <p 
            ref={addToRefs}
            className="mt-8 text-xl md:text-2xl text-gray-300 leading-snug"
          >
            NEXTGENXAI is a community for the next generation of innovators and creators. We bridge the gap between theory and practice through workshops, hackathons, and real-world AI projects.
          </p>

          <p 
            ref={addToRefs}
            className="mt-6 text-lg text-gray-400 leading-relaxed"
          >
            Our members explore AI-driven solutions across diverse domains—healthcare, agriculture, finance, and education—learning to turn imagination into innovation through collaboration and technology.
          </p>

          <p 
            ref={addToRefs}
            className="mt-6 text-lg text-gray-400 leading-relaxed"
          >
            Whether you're new to AI or pushing its boundaries, NEXTGENXAI is your launchpad for creating the future.
          </p>
        </div>

        {/* RIGHT: Video Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 items-center">
          
          {/* Large Hero Video */}
          <div 
            ref={addToRefs}
            className="relative sm:col-span-2 aspect-video bg-gradient-to-br from-ai-blue/30 to-neon-green/30 rounded-2xl shadow-lg overflow-hidden group"
          >
            <video
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="/videos/aboutsection_!.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
          </div>

          {/* Two smaller side videos */}
          <div 
            ref={addToRefs}
            className="relative aspect-video bg-gradient-to-br from-neon-red/30 to-neon-yellow/30 rounded-2xl shadow-lg overflow-hidden group"
          >
            <video
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="/videos/aboutsection_2.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
          </div>

          <div 
            ref={addToRefs}
            className="relative aspect-video bg-gradient-to-br from-purple-500/30 to-ai-blue/30 rounded-2xl shadow-lg overflow-hidden group"
          >
            <video
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="/videos/aboutsection_3.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
