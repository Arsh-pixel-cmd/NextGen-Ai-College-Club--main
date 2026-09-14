import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MediaCluster from './MediaCluster';
import { User } from '@supabase/supabase-js';

interface HomeSectionProps {
  user: User | null;
}

const HomeSection = ({ user }: HomeSectionProps) => {
  const subHeadlineRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const revealElementsRef = useRef<(HTMLElement | null)[]>([]);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const marqueeRef = useRef<HTMLHeadingElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(TextPlugin);

    const section = sectionRef.current;
    const video = bgVideoRef.current;
    const marquee = marqueeRef.current;

    // ✨ Typing animation
    const subText = 'Putting the power of Intelligence in your hands';
    const typeTimeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 2,
      defaults: { ease: 'none' },
    });

    if (subHeadlineRef.current && cursorRef.current) {
      typeTimeline
        .to(subHeadlineRef.current, {
          duration: subText.length * 0.12,
          text: subText,
        })
        .to(cursorRef.current, {
          autoAlpha: 0,
          duration: 0.8,
          repeat: 4,
          yoyo: true,
        })
        .to(subHeadlineRef.current, {
          duration: subText.length * 0.05,
          text: '',
        });
    }

    // 🎬 Reveal animations for buttons
    const revealElements = revealElementsRef.current.filter(
      Boolean
    ) as HTMLElement[];
    if (revealElements.length > 0) {
      gsap.fromTo(
        revealElements,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.2,
          delay: 1.2,
          stagger: 0.25,
          ease: 'power3.out',
        }
      );
    }

    // 🎥 Crystal-clear video effect
    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    if (section && video) {
      gsap.set(video, {
        opacity: 0.1,
        scale: 0.92,
        filter: 'blur(2px) brightness(0.9)',
      });

      handleMouseMove = (e: MouseEvent) => {
        const rect = section.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
        const maxDistance = Math.min(rect.width, rect.height) / 2;
        const proximity = Math.max(0, 1 - distance / maxDistance);

        gsap.to(video, {
          opacity: gsap.utils.mapRange(0, 1, 0.1, 1, proximity),
          scale: gsap.utils.mapRange(0, 1, 0.92, 1, proximity),
          filter: `blur(${gsap.utils.mapRange(
            0,
            1,
            6,
            0
          )}px) brightness(${gsap.utils.mapRange(0, 1, 0.6, 1.15)})`,
          duration: 0.4,
          ease: 'power2.out',
        });
      };

      section.addEventListener('mousemove', handleMouseMove);
    }

    // 🚀 Marquee scroll (infinite + responsive)
    if (marquee) {
      const mm = gsap.matchMedia();
      // Ensure scrollWidth is calculated after rendering
      const totalWidth = marquee.scrollWidth / 2;

      if (totalWidth > 0) {
        mm.add(
          {
            isMobile: '(max-width: 768px)',
            isDesktop: '(min-width: 769px)',
          },
          (context) => {
            const { isMobile } = context.conditions as { isMobile: boolean };

            gsap.to(marquee, {
              x: `-=${totalWidth}`,
              duration: isMobile ? 40 : 25, // Slower marquee for better readability
              ease: 'none',
              repeat: -1,
              modifiers: {
                x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
              },
            });
            
            return () => { // Cleanup for matchMedia
              gsap.killTweensOf(marquee);
            }
          }
        );
      }
    }

    // 🧹 Combined Cleanup Function
    return () => {
      typeTimeline.kill();
      if (marquee) {
        gsap.killTweensOf(marquee);
      }
      if (section && handleMouseMove) {
        section.removeEventListener('mousemove', handleMouseMove);
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-background text-foreground text-center z-10 flex flex-col items-center justify-center"
    >
      {/* 🎞 Background Video —  */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <video
          ref={bgVideoRef}
          className="w-[60vmin] h-[60vmin] rounded-3xl object-cover shadow-2xl transition-all duration-500"
          src="/videos/homepage.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      {/* 🌌 Floating Particles / Media Cluster */}
      <MediaCluster />

      {/* 🏷️ Infinite Scrolling Headline */}
      <div className="overflow-hidden w-full absolute top-1/2 -translate-y-1/2">
        <h1
          ref={marqueeRef}
          className="flex text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none whitespace-nowrap"
        >
          <span>
            AI is not a robot apocalypse; it's a tool for a better future
            •&nbsp;
          </span>
          <span>The Spark For All Things AI •&nbsp;</span>
          {/* 🔁 Duplicate once for seamless loop */}
          <span>
            AI is not a robot apocalypse; it's a tool for a better future
            •&nbsp;
          </span>
          <span>The Spark For All Things AI •&nbsp;</span>
        </h1>
      </div>

      {/* 💬 Sub-Headline Typing Effect */}
      <p className="font-audiowide text-lg md:text-2xl lg:text-3xl mt-4 text-gray-700 min-h-[1.5em] relative z-10">
        <span ref={subHeadlineRef} id="sub-headline"></span>
        <span ref={cursorRef} id="cursor" className="cursor-blink inline-block">
          _
        </span>
      </p>

      {/* 🔘 Buttons */}
      <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-4 md:gap-8 px-4 z-20">
        <a
          ref={(el) => {
            if (el) revealElementsRef.current[0] = el;
          }}
          href="#projects"
          className="inline-block px-6 py-2.5 md:px-8 md:py-3 bg-primary text-primary-foreground text-sm md:text-lg font-bold uppercase tracking-wider rounded-full border-2 border-primary hover:bg-background hover:text-foreground transition-colors duration-300"
        >
          Projects
        </a>
        <svg
          className="w-8 h-8 animate-bounce hidden md:block text-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
        <a
          ref={(el) => {
            if (el) revealElementsRef.current[1] = el;
          }}
          href={user ? '#contact' : '#member-access'}
          className="inline-block px-6 py-2.5 md:px-8 md:py-3 border-2 border-primary text-foreground text-sm md:text-lg font-bold uppercase tracking-wider rounded-full hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
        >
          {user ? 'Contact Us' : 'Join Us'}
        </a>
      </div>
    </section>
  );
};

export default HomeSection;
