"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { Send, Mail, User } from "lucide-react";

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const revealElementsRef = useRef<(HTMLElement | null)[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const revealElements = revealElementsRef.current.filter(Boolean) as HTMLElement[];

    if (revealElements.length > 0 && sectionRef.current) {
      gsap.fromTo(
        revealElements,
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealElementsRef.current.includes(el)) {
      revealElementsRef.current.push(el);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill out all fields.");
      return;
    }

    const recipientEmail = "contact@nextgenxai.com";
    const subject = `Message from ${name} (${email})`;
    const body = encodeURIComponent(message);

    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;

    toast.success("Your email client has been opened to send the message.");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-standard bg-dark-bg text-dark-fg z-40 relative"
    >
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Left Column: Form */}
        <div className="flex flex-col justify-center text-left">
          <div ref={addToRefs}>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter title-hover-neon-green">
              Contact Us
            </h2>
            <p className="mt-4 text-lg md:text-2xl text-gray-400">
              We'd love to hear from you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-12 space-y-8">
            <div
              ref={(el) => (revealElementsRef.current[1] = el)}
              className="relative"
            >
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type="text"
                id="name-desktop"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input w-full p-3 pl-10 bg-gray-900/50 border border-gray-800 rounded-lg focus:ring-2 focus:ring-neon-green"
                placeholder="Your Name"
                required
              />
            </div>

            <div
              ref={(el) => (revealElementsRef.current[2] = el)}
              className="relative"
            >
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <Input
                type="email"
                id="email-desktop"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input w-full p-3 pl-10 bg-gray-900/50 border border-gray-800 rounded-lg focus:ring-2 focus:ring-neon-green"
                placeholder="Your Email"
                required
              />
            </div>

            <div ref={(el) => (revealElementsRef.current[3] = el)}>
              <Textarea
                id="message-desktop"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-input w-full p-3 bg-gray-900/50 border border-gray-800 rounded-lg min-h-[140px] focus:ring-2 focus:ring-neon-green"
                placeholder="Your message..."
                required
              />
            </div>

            <div ref={(el) => (revealElementsRef.current[4] = el)}>
              <Button
                type="submit"
                className="w-full px-8 py-4 bg-dark-fg text-dark-bg text-lg font-bold uppercase tracking-wider border-2 border-dark-fg hover:bg-transparent hover:text-dark-fg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Illustration Image */}
        <div
          ref={(el) => (revealElementsRef.current[5] = el)}
          className="hidden md:flex w-full h-full items-center justify-center aspect-square"
        >
          <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/assets/con 3.jpg"
              alt="Contact Illustration"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
