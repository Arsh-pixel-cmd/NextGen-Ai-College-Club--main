
'use client';
import * as React from "react";
import DomeGallery from './DomeGallery';
import { useTeamMembers } from '@/hooks/useTeamMembers';

const MembersSection = () => {
  const { data: members, isLoading } = useTeamMembers();

  const domeImages = (members || []).map(member => ({
    src: member.image_url,
    alt: `${member.name} - ${member.position}`
  }));

  if (isLoading) {
    return (
      <section id="members" className="section-full bg-dark-bg text-dark-fg z-30 flex-col">
        <div className='w-full max-w-7xl text-center mb-8'>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter title-hover-neon-green">
            Our Team
          </h2>
          <p className="mt-4 text-lg text-gray-400">Meet the minds behind the innovation.</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-[#39FF14]/30 border-t-[#39FF14] rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (!members || members.length === 0) {
    return (
      <section id="members" className="section-full bg-dark-bg text-dark-fg z-30 flex-col">
        <div className='w-full max-w-7xl text-center mb-8'>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter title-hover-neon-green">
            Our Team
          </h2>
          <p className="mt-4 text-lg text-gray-400">No team members available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="members" 
      className="section-full bg-dark-bg text-dark-fg z-30 flex-col"
    >
      <div className='w-full max-w-7xl text-center mb-8'>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter title-hover-neon-green">
          Our Team
        </h2>
        <p className="mt-4 text-lg text-gray-400">Meet the minds behind the innovation.</p>
      </div>
      <div className="w-full h-[100vh] md:h-[60vh] relative">
        <DomeGallery 
          images={domeImages}
          overlayBlurColor='hsl(var(--dark-background))'
          grayscale={false}
          imageBorderRadius='12px'
          openedImageBorderRadius='12px'
        />
      </div>
    </section>
  );
}

export default MembersSection;