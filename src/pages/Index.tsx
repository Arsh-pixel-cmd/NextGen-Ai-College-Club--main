'use client';
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import MenuOverlay from "@/components/MenuOverlay";
import HomeSection from "@/components/HomeSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import MembersSection from "@/components/MembersSection";
import ContactSection from "@/components/ContactSection";
import ChatBot from "@/components/ChatBot";
import Dashboard from "@/components/Dashboard";
import NewsSection from "@/components/NewsSection";
import EventsSection from "@/components/EventsSection";
import MemberAccess from "@/components/MemberAccess";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import Footer from "@/components/Footer";

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleMenuToggle = () => setIsMenuOpen(true);
  const handleMenuClose = () => setIsMenuOpen(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-bg">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden bg-dark-bg font-inter">
      <Header onMenuToggle={handleMenuToggle} />
      <MenuOverlay isOpen={isMenuOpen} onClose={handleMenuClose} />
      
      <main id="smooth-wrapper">
        <div id="smooth-content">
          <HomeSection user={user} />
          <AboutSection />
          <ProjectsSection />
          <MembersSection />
          {user ? (
            <>
              <NewsSection />
              <EventsSection />
              <ContactSection />
              <Dashboard />
            </>
          ) : (
            <MemberAccess />
          )}

          <Footer />
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default Index;
