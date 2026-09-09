import { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import TeamManager from '@/components/admin/TeamManager';
import BlogManager from '@/components/admin/BlogManager';
import EventManager from '@/components/admin/EventManager';
import DynamicSectionManager from '@/components/admin/DynamicSectionManager';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('team');

  const renderContent = () => {
    switch (activeSection) {
      case 'team':
        return <TeamManager />;
      case 'blogs':
        return <BlogManager />;
      case 'events':
        return <EventManager />;
      case 'sections':
        return <DynamicSectionManager />;
      default:
        return <TeamManager />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <AdminHeader activeSection={activeSection} />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
