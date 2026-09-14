import { useState } from "react";
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
import { Newspaper, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { BlogDetailModal } from './BlogDetailModal';
import type { BlogPost } from '@/types/content';

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

const LoadingSkeleton = () => (
  <div className="flex gap-4 w-full">
    {[1, 2].map(i => (
      <div key={i} className="flex-1 p-2">
        <div className="bg-[#1C1C1C] border border-gray-800 rounded-lg p-6 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-700" />
            <div className="h-3 w-32 bg-gray-700 rounded" />
          </div>
          <div className="h-5 w-3/4 bg-gray-700 rounded mb-3" />
          <div className="h-3 w-full bg-gray-700 rounded mb-2" />
          <div className="h-3 w-2/3 bg-gray-700 rounded mb-4" />
          <div className="flex gap-2">
            <div className="h-5 w-20 bg-gray-700 rounded" />
            <div className="h-5 w-16 bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const NewsSection = () => {
  const { data: posts, isLoading } = useBlogPosts();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenPost = (post: BlogPost) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

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
                <Newspaper className="w-6 h-6 text-[#39FF14]" />
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Latest Blogs
                </h2>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-6">
              {isLoading ? (
                <LoadingSkeleton />
              ) : !posts || posts.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-gray-400 text-lg">No blog posts available yet.</p>
                </div>
              ) : (
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {posts.map((item) => (
                      <CarouselItem key={item.id} className="basis-full md:basis-1/2 lg:basis-1/2">
                        <motion.div
                          className="p-2 md:p-1 h-full"
                          variants={cardVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.3 }}
                        >
                          <Card
                            onClick={() => handleOpenPost(item)}
                            className="bg-[#1C1C1C] border-gray-800 hover:border-[#39FF14]/50 hover:bg-[#202020] text-white rounded-xl overflow-hidden h-full flex flex-col cursor-pointer transition-all duration-300 group shadow-lg hover:shadow-[#39FF14]/5"
                          >
                            <CardContent className="flex flex-col md:flex-row gap-6 p-6 flex-grow">
                              <div className="flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-gray-700/80 border border-gray-600 flex items-center justify-center text-xs font-bold text-[#39FF14] flex-shrink-0">
                                    {item.source ? item.source.substring(0, 2).toUpperCase() : 'AI'}
                                  </div>
                                  <span className="text-sm text-gray-400">{item.source} &middot; {item.date}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#39FF14] transition-colors leading-snug">
                                  {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                                  {item.snippet}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-3">
                                  <Badge variant="secondary" className="bg-[#39FF14]/10 text-[#39FF14] border-0 text-[11px] font-medium">
                                    {item.category || 'Article'}
                                  </Badge>
                                  {item.source_url && (
                                    <Badge variant="secondary" className="bg-gray-800 text-gray-300 border-0 text-[11px]">
                                      {item.source_url}
                                    </Badge>
                                  )}
                                  <span>{item.read_time}</span>
                                </div>

                                <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-800/80">
                                  <span className="text-xs font-semibold text-[#39FF14] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                                    Read full story <ArrowRight className="w-3.5 h-3.5" />
                                  </span>
                                  <span className="text-[11px] text-gray-500">Click to expand</span>
                                </div>
                              </div>

                              {item.image_url && (
                                <div className="w-full md:w-36 h-44 md:h-auto flex-shrink-0 overflow-hidden rounded-lg bg-gray-800">
                                  <img 
                                    src={item.image_url}
                                    alt={item.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                              )}
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
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Reader Modal */}
      <BlogDetailModal
        post={selectedPost}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
};

export default NewsSection;
