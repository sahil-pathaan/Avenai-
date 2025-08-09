import React, { useState, useEffect } from 'react';
import ChatView from './components/ChatView';
import AdBanner from './components/AdBanner'; // Import the new AdBanner component
import { getAiResponse } from './services/geminiService';
import type { Message } from './types';
import { AiIcon, PlusIcon } from './components/Icons';

// --- AdSense Configuration ---
// These values are now configured with your AdSense IDs.
const AD_CLIENT_ID = 'ca-app-pub-8392335064861000'; // Your Publisher ID
const AD_SLOT_ID = '9534938534'; // The Ad Unit ID you mentioned.

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSendMessage = async (userMessageText: string) => {
    if (!userMessageText.trim()) return;

    setIsLoading(true);
    const currentUserMessage: Message = { role: 'user', text: userMessageText };
    const historyForAPI = [...messages]; // History for the API call

    // Immediately show user's message in the UI
    setMessages(prevMessages => [...prevMessages, currentUserMessage]);

    try {
        const { text: aiResponseText, sources } = await getAiResponse(userMessageText, historyForAPI);
        const aiMessage: Message = { role: 'model', text: aiResponseText, sources };

        // Update the UI with the AI's response
        setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
        console.error("Failed to send message:", error);
        const errorMessage: Message = { role: 'model', text: "Sorry, I encountered an error. Please try again." };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-800">
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800 shadow-md">
        <div className="flex items-center gap-3">
          <AiIcon className="w-8 h-8 text-blue-500" />
          <h1 className="text-xl font-bold text-white">Aven Ai</h1>
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <PlusIcon className="w-5 h-5" />
          New Chat
        </button>
      </header>
      
      {/* Ad banner acting as a background for the welcome text */}
      <div className="flex-shrink-0 flex justify-center bg-gray-900 py-3">
        <div className="relative w-full max-w-2xl flex items-center justify-center">
          {/* AdBanner will act as the background */}
          <AdBanner adClient={AD_CLIENT_ID} adSlot={AD_SLOT_ID} />
          
          {/* Welcome text positioned on top of the ad, now with responsive font size */}
          <h2 
            className="absolute text-center text-4xl sm:text-5xl md:text-6xl font-dancing-script text-white pointer-events-none"
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.7)' }}
          >
            Welcome Aven Ai
          </h2>
        </div>
      </div>


      <main className="flex-1 flex flex-col min-h-0">
          <ChatView
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
      </main>
    </div>
  );
};

export default App;