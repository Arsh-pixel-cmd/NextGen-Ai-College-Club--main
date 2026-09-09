import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const revealElementsRef = useRef<HTMLElement[]>([]);

  const projects = [
    {
      title: " From Prompt to Publish ",
      subtitle: "Exclusive College Ai Workshop",
      description: "A hands-on workshop to build a complete website with AI using bolt.new, Rocket.ai etc, and master workflow automation with NextGenX Ai Club.",
      image: "/assets/IstProject.png", 
      link: "https://web-for-event-registration.netlify.app/" 
    },
    {
      title: "Smart Agriculture Solutions",
      subtitle: "India's Most Advanced Agricultural Platform",
      description: "Empower your farming with AI-powered crop diagnosis, real-time market prices, expert consultation, and comprehensive learning resources.",
      image: "/assets/2ndProject.png",
      link: "https://inquisitive-llama-5c0d10.netlify.app/"
    },
    {
      title: "Automate DMs on Instagram.",
      subtitle: "Instantly. Intelligently.",
      description: "Respond to reel comments with custom messages. Turn engagement into leads.",
      image: "/assets/3rdProject.png",
      link: "https://fabulous-cassata-18a9d6.netlify.app/"
    }
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const revealElements = revealElementsRef.current.filter(Boolean);
    
    if (revealElements.length > 0 && sectionRef.current) {
      gsap.fromTo(revealElements, 
        { y: 50, autoAlpha: 0 }, 
        {
          y: 0, 
          autoAlpha: 1, 
          duration: 1, 
          stagger: 0.15, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
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
      id="projects" 
      className="section-full bg-background text-foreground z-30"
    >
      <div className="w-full max-w-7xl text-center mx-auto px-4">
        <h2 
          ref={addToRefs}
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter"
        >
          Featured Work
        </h2>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <a
              key={index}
              ref={addToRefs}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-dark-bg text-dark-fg p-4 aspect-square flex flex-col justify-end transition-transform duration-300 hover:scale-105 rounded-lg shadow-lg group overflow-hidden"
            >
              {/* Project Image */}
              <div className="flex-1 overflow-hidden rounded-md">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Text Content */}
              <div className="mt-4 text-left">
                <h3 className="text-2xl font-bold">{project.title}</h3>
                <p className="text-gray-400 mt-1">{project.subtitle}</p>
                <p className="text-gray-500 mt-2 text-sm">{project.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
