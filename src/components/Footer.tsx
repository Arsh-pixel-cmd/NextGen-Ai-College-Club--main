'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import React, { ImgHTMLAttributes, AnchorHTMLAttributes } from 'react';

interface FooterProps {
  onAdminClick?: () => void;
}

// Fallback components to mimic Next.js's Image and Link for compatibility
type ImageProps = ImgHTMLAttributes<HTMLImageElement>;
const Image = ({ src, alt, width, height, className, ...props }: ImageProps) => (
  <img
    src={src}
    alt={alt ?? ''}
    width={width}
    height={height}
    className={className}
    {...props}
  />
);

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};
const Link = ({ href, children, className, ...props }: LinkProps) => (
  <a href={href} className={className} {...props}>
    {children}
  </a>
);

const developers = [
  {
    name: 'Arsh Mishra',
    github: 'https://github.com/Arsh-pixel-cmd',
    linkedin: 'https://www.linkedin.com/in/arsh-mishra-030093325/',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const socialIconVariants = {
  initial: { y: 0, scale: 1 },
  animate: {
    y: [-2, 2, -2],
    transition: {
      duration: 2.5,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
  hover: {
    scale: 1.2,
    y: -5,
    transition: { duration: 0.2 },
  }
};


export default function Footer({ onAdminClick }: FooterProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.2 });

  return (
    <>
      <motion.footer 
        ref={footerRef}
        className="bg-dark-bg border-t border-gray-800 text-sm overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="container py-12 md:py-16">
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
            
            <motion.div variants={itemVariants} className="lg:col-span-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 ">
                <Image
                  src="/assets/clubLogo.png"
                  alt="NEXTGENXAI"
                  width={40}
                  height={40}
                />
                <span className="font-audiowide text-2xl font-bold">NEXTGENXAI</span>
              </div>
              <p className="text-gray-400 mt-4 max-w-md mx-auto md:mx-0">
                Inspiring tomorrow’s trailblazers to reimagine the world through innovation, human-centered design, and the transformative power of artificial intelligence.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center md:text-left">
              <h4 className="font-audiowide text-lg font-semibold mb-4 text-neon-green">Quick Links</h4>
              <ul className="space-y-2">
                {['#about', '#projects', '#members', '#events', '#contact'].map(link => (
                  <li key={link}>
                    <motion.a 
                      href={link} 
                      className="text-gray-400 hover:text-white capitalize transition-colors"
                      whileHover={{ scale: 1.05, x: 5, color: '#69ff95' }}
                    >
                      {link.substring(1)}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center md:text-left">
              <h4 className="font-audiowide text-lg font-semibold mb-4 text-neon-green">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <Mail className="h-4 w-4 text-neon-green" />
                  <a href="mailto:dtclub@niet.co.in" className="text-gray-400 hover:text-white">nextgenxai@iilm.edu</a>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <Phone className="h-4 w-4 text-neon-green" />
                  <a href="tel:+919412013756" className="text-gray-400 hover:text-white">+91 9873107945</a>
                </li>
                <li className="flex items-start justify-center md:justify-start gap-3">
                  <MapPin className="h-4 w-4 text-neon-green mt-1 flex-shrink-0" />
                  <span className="text-gray-400">Plot No.18, Iilm College Of Engineering & Technology, 16, Knowledge Park II, Greater Noida, Uttar Pradesh 201306, India</span>
                </li>
              </ul>
              <div className="flex space-x-2 mt-6 justify-center md:justify-start">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                   <motion.a 
                    key={index} 
                    href="#" 
                    aria-label="Social media link"
                    variants={socialIconVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button variant="ghost" size="icon">
                      <Icon className="h-5 w-5 text-gray-400" />
                    </Button>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} NEXTGENXAI. All rights reserved.</p>
            <p className="mt-2">
              Designed and developed by -
              <motion.span 
                onClick={() => setIsModalOpen(true)} 
                className="font-semibold text-gray-300 hover:text-neon-green cursor-pointer"
                whileHover={{ scale: 1.05 }}
              > NextGenXAi-Developer Team </motion.span> 
            </p>
          </motion.div>
        </div>
      </motion.footer>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Developer Credits</DialogTitle>
            <DialogDescription>
              This website was brought to life by this talented developer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {developers.map((dev) => (
              <div key={dev.name} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <p className="font-semibold">{dev.name}</p>
                <div className="flex items-center gap-4">
                  <a href={dev.github} target="_blank" rel="noopener noreferrer" aria-label={`${dev.name}'s GitHub`} className="transition-transform hover:scale-110">
                     <img src="/assets/github.png" alt="GitHub" className="w-8 h-8 rounded-full" data-ai-hint="social media icon" />
                  </a>
                  <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${dev.name}'s LinkedIn`} className="transition-transform hover:scale-110">
                     <img src="/assets/linkedin.png" alt="LinkedIn" className="w-8 h-8 rounded-full" data-ai-hint="social media icon" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}