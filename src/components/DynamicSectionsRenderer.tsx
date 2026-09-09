import { useDynamicSections } from '@/hooks/useDynamicSections';
import { motion } from 'framer-motion';
import type { ContentBlock } from '@/types/content';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BlockCard = ({ block }: { block: ContentBlock }) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    className="bg-[#1C1C1C] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
  >
    {block.image_url && (
      <img
        src={block.image_url}
        alt={block.title}
        className="w-full h-48 object-cover"
      />
    )}
    <div className="p-5">
      <h3 className="text-white font-bold text-lg mb-2">{block.title}</h3>
      {block.description && (
        <p className="text-gray-400 text-sm leading-relaxed">{block.description}</p>
      )}
      {block.link && (
        <a
          href={block.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-[#39FF14] text-sm font-medium hover:underline"
        >
          Learn more →
        </a>
      )}
    </div>
  </motion.div>
);

const DynamicSectionsRenderer = () => {
  const { data: sections, isLoading } = useDynamicSections(true);

  if (isLoading || !sections || sections.length === 0) {
    return null;
  }

  return (
    <>
      {sections.map((section) => (
        <section
          key={section.id}
          className="section-standard bg-dark-bg text-dark-fg z-30"
        >
          <div className="w-full max-w-7xl px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter title-hover-neon-green">
              {section.title}
            </h2>
            {section.subtitle && (
              <p className="mt-4 text-lg text-gray-400">{section.subtitle}</p>
            )}
            {section.content_blocks && section.content_blocks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 text-left">
                {section.content_blocks.map((block, index) => (
                  <BlockCard key={index} block={block} />
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
};

export default DynamicSectionsRenderer;
