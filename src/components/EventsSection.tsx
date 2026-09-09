'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { Check, Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { isPast, parse } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface Event {
  date: string;
  name: string;
  venue: string;
  details: string;
  isCompleted?: boolean;
}

const events: Event[] = [
  { date: "Oct 26", name: "AI Hackathon Kickoff", venue: "Online", details: "The grand kickoff for our annual AI hackathon. Form teams and get ready to build!" },
  { date: "Nov 12", name: "Workshop: Intro to PyTorch", venue: "Room 404, Tech Hall", details: "A hands-on workshop covering the fundamentals of PyTorch for building neural networks." },
  { date: "Nov 28", name: "Guest Lecture: AI Ethics", venue: "Auditorium", details: "A talk from a leading industry expert on the ethical implications of modern AI." },
  { date: "Dec 15", name: "Project Showcase & Mixer", venue: "Main Atrium", details: "Members showcase their semester projects, followed by a festive mixer." },
];

interface VerticalStepItemProps {
  event: Event;
  index: number;
  scrollYProgress: MotionValue<number>;
  progressPoint: number;
}

const VerticalStepItem = ({ event, index, scrollYProgress, progressPoint }: VerticalStepItemProps) => {
  const isLeft = index % 2 === 0;
  const startOpacity = useTransform(scrollYProgress, [progressPoint - 0.1, progressPoint], [0, 1]);
  const startX = useTransform(scrollYProgress, [progressPoint - 0.1, progressPoint], [isLeft ? -20 : 20, 0]);

  return (
    <div className={`flex items-center relative ${isLeft ? 'justify-start' : 'justify-end'}`}>
      <div className={`w-1/2 px-4 ${isLeft ? 'text-right' : 'text-left'}`}>
        <motion.div style={{ opacity: startOpacity, x: startX }}>
          <Popover>
            <PopoverTrigger asChild>
              <div className="inline-block p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer">
                <p className="font-bold text-lg">{event.name}</p>
                <p className="text-sm text-gray-400">{event.date}</p>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-gray-900 border-gray-700 text-white">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h3 className="font-medium leading-none">{event.name}</h3>
                  <p className="text-sm text-gray-400">{event.details}</p>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <span className="text-sm font-semibold">Venue</span>
                    <span className="col-span-2 text-sm">{event.venue}</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </motion.div>
      </div>
      {/* The circle on the timeline */}
      <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-dark-bg border-2 border-neon-green flex items-center justify-center">
        {event.isCompleted && <Check className="w-5 h-5 text-neon-green" />}
      </div>
    </div>
  );
};

const VerticalStepper = ({ eventsWithStatus }: { eventsWithStatus: Event[] }) => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start end", "end start"],
    });

    const pathLength = useTransform(scrollYProgress, [0.05, 0.9], [0, 1]);

    const eventCount = eventsWithStatus.length;
    const progressPoints = Array.from({ length: eventCount }, (_, i) => (i + 1) / (eventCount + 1));
    
    return (
      <div ref={targetRef} className="relative w-full py-16">
        <svg width="100" height="100%" viewBox="0 0 100 800" className="absolute left-1/2 -translate-x-1/2 h-full" preserveAspectRatio="none">
          <motion.path
            d="M 50 0 V 180 Q 50 230 20 230 H 20 Q 50 230 50 280 V 380 Q 50 430 80 430 H 80 Q 50 430 50 480 V 580 Q 50 630 20 630 H 20 Q 50 630 50 680 V 800"
            fill="none"
            stroke="hsl(var(--neon-green))"
            strokeWidth="2"
            style={{ pathLength }}
            strokeDasharray="1"
            strokeDashoffset="0"
          />
        </svg>
        <div className="space-y-24">
          {eventsWithStatus.map((event, index) => (
            <VerticalStepItem
              key={index}
              event={event}
              index={index}
              scrollYProgress={scrollYProgress}
              progressPoint={progressPoints[index]}
            />
          ))}
        </div>
      </div>
    );
};

const HorizontalStepper = ({ eventsWithStatus }: { eventsWithStatus: Event[] }) => {
    const [activeStep, setActiveStep] = useState(0);

    const firstUpcomingIndex = useMemo(() => eventsWithStatus.findIndex(event => !event.isCompleted), [eventsWithStatus]);
  
    const progressWidth = useMemo(() => {
        if (firstUpcomingIndex === -1) return 100; // All events completed
        if (eventsWithStatus.length <= 1) return 0;

        const completedCount = firstUpcomingIndex;
        const basePercentage = (completedCount / (eventsWithStatus.length - 1)) * 100;
        
        const activeUpcomingStep = activeStep - completedCount;
        const upcomingEventsCount = eventsWithStatus.length - completedCount;

        if (activeUpcomingStep < 0) return basePercentage;
        
        const upcomingProgress = upcomingEventsCount > 1 
            ? (activeUpcomingStep / (upcomingEventsCount - 1)) * (100 - basePercentage)
            : 0;
            
        return basePercentage + upcomingProgress;
    }, [activeStep, firstUpcomingIndex, eventsWithStatus]);
    
    useEffect(() => {
        if (firstUpcomingIndex !== -1) {
            setActiveStep(firstUpcomingIndex);
        } else if (eventsWithStatus.length > 0) {
            setActiveStep(eventsWithStatus.length - 1);
        }
    }, [firstUpcomingIndex, eventsWithStatus.length]);


  return (
    <div className="w-full max-w-4xl text-center px-4 mx-auto">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter title-hover-neon-green mb-20">
          Upcoming Events
        </h2>
        <div className="relative w-full">
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-700 -translate-y-1/2 rounded-full">
            <motion.div 
              className="h-full bg-neon-green rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressWidth}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between relative">
            {eventsWithStatus.map((event, index) => (
               <Popover key={index}>
                <PopoverTrigger asChild>
                  <div 
                    className="flex flex-col items-center cursor-pointer group"
                    onClick={() => setActiveStep(index)}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full border-2 bg-dark-bg flex items-center justify-center relative"
                      animate={{ 
                        borderColor: activeStep >= index ? 'hsl(var(--neon-green))' : '#4a5568',
                        scale: activeStep === index ? 1.2 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {event.isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                          className="w-full h-full rounded-full bg-neon-green flex items-center justify-center"
                        >
                          <Check className="w-6 h-6 text-dark-bg" />
                        </motion.div>
                      )}
                       {!event.isCompleted && (
                         <div className="w-3 h-3 rounded-full bg-gray-400 group-hover:bg-white transition-colors" />
                       )}
                    </motion.div>
                    <div className="mt-4 text-center">
                      <p className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{event.date}</p>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-gray-900 border-gray-700 text-white">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium leading-none">{event.name}</h3>
                      <p className="text-sm text-gray-400">{event.details}</p>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid grid-cols-3 items-center gap-4">
                        <span className="text-sm font-semibold">Venue</span>
                        <span className="col-span-2 text-sm">{event.venue}</span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>
    </div>
  );
};

const EventsSection = () => {
    const isMobile = useIsMobile();
    
    const eventsWithStatus = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return events.map(event => {
          const eventDate = parse(`${event.date} ${currentYear}`, 'MMM dd yyyy', new Date());
          return {
            ...event,
            isCompleted: isPast(eventDate),
          };
        });
      }, []);

  return (
    <section id="events" className="section-standard bg-dark-bg text-dark-fg z-30 overflow-hidden">
        {isMobile ? (
            <>
                <h2 className="text-4xl font-black uppercase tracking-tighter title-hover-neon-green text-center mb-8">
                    Upcoming Events
                </h2>
                <VerticalStepper eventsWithStatus={eventsWithStatus} />
            </>
        ) : (
            <HorizontalStepper eventsWithStatus={eventsWithStatus} />
        )}
    </section>
  );
};

export default EventsSection;
