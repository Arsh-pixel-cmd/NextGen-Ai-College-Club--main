
'use client';
import * as React from "react";
import DomeGallery from './DomeGallery';

const members = [
  { name: 'Alex Doe', position: 'President', img: 'https://picsum.photos/seed/member1/400/600', dataAiHint: 'man portrait' },
  { name: 'Jane Smith', position: 'Vice President', img: 'https://picsum.photos/seed/member2/400/600', dataAiHint: 'woman portrait' },
  { name: 'Sam Wilson', position: 'Lead Developer', img: 'https://picsum.photos/seed/member3/400/600', dataAiHint: 'man developer' },
  { name: 'Emily Brown', position: 'Project Manager', img: 'https://picsum.photos/seed/member4/400/600', dataAiHint: 'woman manager' },
  { name: 'Chris Lee', position: 'UI/UX Designer', img: 'https://picsum.photos/seed/member5/400/600', dataAiHint: 'designer professional' },
  { name: 'Jessica Ray', position: 'AI Researcher', img: 'https://picsum.photos/seed/member6/400/600', dataAiHint: 'woman researcher' },
  { name: 'Mike Chen', position: 'Backend Developer', img: 'https://picsum.photos/seed/member7/400/600', dataAiHint: 'man software' },
  { name: 'Laura Taylor', position: 'Data Scientist', img: 'https://picsum.photos/seed/member8/400/600', dataAiHint: 'woman data' },
];

const MembersSection = () => {

  const domeImages = members.map(member => ({
    src: member.img,
    alt: `${member.name} - ${member.position}`
  }));

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

    