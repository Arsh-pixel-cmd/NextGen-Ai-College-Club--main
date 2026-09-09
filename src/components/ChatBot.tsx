import { MessageCircle } from 'lucide-react';

const ChatBot = () => {
  const handleChatToggle = () => {
    alert('AI Chatbot coming soon!');
  };

  return (
    <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-50">
      <button 
        id="chat-toggle"
        onClick={handleChatToggle}
        className="w-16 h-16 bg-dark-fg text-dark-bg rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
        aria-label="Open AI Chatbot"
      >
        <MessageCircle className="h-8 w-8" />
      </button>
    </div>
  );
};

export default ChatBot;