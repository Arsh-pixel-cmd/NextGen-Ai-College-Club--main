'use client';
import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";
import { motion } from "framer-motion";

const newsItems = [
  {
    source: "AI Today",
    date: "Nov 5, 2025",
    title: "The Future of Generative AI",
    snippet: "Exploring the next wave of creativity and innovation powered by advanced AI models and what it means for developers and artists alike.",
    image: "https://picsum.photos/seed/news1/400/300",
    dataAiHint: 'abstract tech',
    sourceUrl: "aitoday.com",
    category: "Insights",
    readTime: "5 min read",
  },
  {
    source: "ML Insights",
    date: "Nov 4, 2025",
    title: "AI in Healthcare: A Revolution",
    snippet: "How machine learning is transforming diagnostics, patient care, and the future of medicine.",
    image: "https://picsum.photos/seed/news2/400/300",
    dataAiHint: 'medical technology',
    sourceUrl: "mlinsights.io",
    category: "Health",
    readTime: "7 min read",
  },
  {
    source: "Ethics Weekly",
    date: "Nov 2, 2025",
    title: "Ethical AI: Navigating the New Frontier",
    snippet: "A look into the frameworks ensuring fairness and accountability in artificial intelligence systems.",
    image: "https://picsum.photos/seed/news3/400/300",
    dataAiHint: 'abstract balance',
    sourceUrl: "ethics.org",
    category: "Ethics",
    readTime: "6 min read",
  },
  {
    source: "Quantum AI",
    date: "Oct 30, 2025",
    title: "Quantum Computing Meets AI",
    snippet: "The convergence of two powerful technologies poised to solve some of the world's most complex problems.",
    image: "https://picsum.photos/seed/news4/400/300",
    dataAiHint: 'quantum computer',
    sourceUrl: "quantamai.net",
    category: "Future Tech",
    readTime: "9 min read",
  },
   {
    source: "DevOps Journal",
    date: "Oct 28, 2025",
    title: "The Rise of AIOps",
    snippet: "Automating IT operations through artificial intelligence and machine learning.",
    image: "https://picsum.photos/seed/news5/400/300",
    dataAiHint: 'cloud infrastructure',
    sourceUrl: "devopsjournal.com",
    category: "Automation",
    readTime: "8 min read",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  },
};

const NewsSection = () => {
  return (
    <section 
      id="news" 
      className="section-standard bg-dark-bg text-dark-fg z-30"
    >
      <div className="w-full max-w-7xl px-4">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Newspaper className="w-6 h-6" />
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Latest Blogs
                </h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-6">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {newsItems.map((item, index) => (
                    <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/2">
                      <motion.div
                        className="p-2 md:p-1 h-full"
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                      >
                        <Card className="bg-[#1C1C1C] border-gray-800 text-white rounded-lg overflow-hidden h-full flex flex-col">
                          <CardContent className="flex flex-col md:flex-row gap-6 p-6 flex-grow">
                            <div className="flex-1 flex flex-col">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                  {item.source.substring(0, 2)}
                                </div>
                                <span className="text-sm text-gray-400">{item.source} &middot; {item.date}</span>
                              </div>
                              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">
                                {item.snippet}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-auto">
                                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-0">{item.sourceUrl}</Badge>
                                <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-0">{item.category}</Badge>
                                <span>{item.readTime}</span>
                              </div>
                            </div>
                            <div className="w-full md:w-32 h-40 md:h-auto flex-shrink-0">
                                <img 
                                    src={item.image}
                                    data-ai-hint={item.dataAiHint}
                                    alt={item.title} 
                                    className="w-full h-full object-cover rounded-md"
                                />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="absolute left-[-20px] top-1/2 -translate-y-1/2" />
                  <CarouselNext className="absolute right-[-20px] top-1/2 -translate-y-1/2" />
                </div>
              </Carousel>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};

export default NewsSection;
