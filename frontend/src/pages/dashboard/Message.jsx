import React, { useState } from 'react';
import { Search, MoreVertical, Send, Image, Paperclip, ChevronDown, ChevronUp } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';

const MessagingPage = () => {
  const [activeChat, setActiveChat] = useState(null); // initially no chat selected
  const [messageInput, setMessageInput] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState("Messages");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleButtonClick = (buttonText) => {
    setSelectedButton(buttonText);
  };

  const messageRequests = [
    { id: 'req1', user: 'Sarah Wilson', message: "Hi! Is the textbook still available?", time: '2h ago', avatar: '/api/placeholder/40/40', type: 'listing_request' },
    { id: 'req2', user: 'David Lee', message: "Hey! I'm interested in your calculator", time: '4h ago', avatar: '/api/placeholder/40/40', type: 'listing_request' }
  ];

  const sentRequests = [
    { id: 'sent1', user: 'Alex Turner', message: "Is this still available?", time: '1d ago', avatar: '/api/placeholder/40/40', type: 'sent_request', item: 'Mini Fridge' }
  ];

  const messages = [
    { id: 1, sender: 'user1', text: "Hi! Is the textbook still available?", time: "10:30 AM", sent: false },
    { id: 2, sender: 'me', text: "Yes, it is! Would you like to see more photos?", time: "10:32 AM", sent: true },
    { id: 3, sender: 'user1', text: "That would be great!", time: "10:33 AM", sent: false },
    { id: 4, sender: 'me', text: "Here you go! Let me know if you need any more information.", time: "10:35 AM", sent: true },
    { id: 5, sender: 'user1', text: "Thanks! What's the condition like?", time: "10:36 AM", sent: false },
  ];

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col sm:flex-row">
      <Navbar toggleSidebar={toggleSidebar} />
      
      {/* Left Sidebar - Contacts */}
      <div className={`w-full sm:w-64 bg-zinc-900 border-r border-gray-800 flex flex-col ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
        <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} selectedButton={selectedButton} setSelectedButton={setSelectedButton} />
      </div>

      {/* Center Section - Message Requests */}
      <div className={`w-full sm:w-80 bg-zinc-900 border-r border-gray-800 flex flex-col mt-16 ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-gray-400">Messages</h2>
        </div>

        {/* Listing Requests */}
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Requests for your listings</h3>
          {messageRequests.map((request) => (
            <div key={request.id} onClick={() => setActiveChat(request.id)} className="cursor-pointer mb-4 p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <img src={request.avatar} alt={request.user} className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-400">{request.user}</h4>
                  <p className="text-sm text-gray-500 truncate">{request.message}</p>
                  <span className="text-xs text-gray-400">{request.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sent Requests */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Your requests</h3>
          {sentRequests.map((request) => (
            <div key={request.id} onClick={() => setActiveChat(request.id)} className="cursor-pointer mb-4 p-3 bg-zinc-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <img src={request.avatar} alt={request.user} className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-400">{request.user} - {request.item}</h4>
                  <p className="text-sm text-gray-500 truncate">{request.message}</p>
                  <span className="text-xs text-gray-400">{request.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Chat Area */}
      <div className={`flex-1 flex flex-col bg-zinc-900 mt-16 ${activeChat ? 'flex' : 'hidden sm:flex'}`}>
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/api/placeholder/40/40" alt="Contact" className="w-10 h-10 rounded-full" />
            <div>
              <h2 className="text-lg font-semibold text-gray-300">John Smith</h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <button onClick={() => setActiveChat(null)} className="sm:hidden p-2 hover:bg-gray-700 rounded-xl">
            <ChevronUp className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-lg ${message.sent ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-900'}`}>
                <p>{message.text}</p>
                <span className={`text-xs ${message.sent ? 'text-zinc-200' : 'text-gray-500'}`}>{message.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-700 rounded-xl">
              <Image className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-xl">
              <Paperclip className="w-5 h-5 text-gray-500" />
            </button>
            <input type="text" placeholder="Type a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} className="flex-1 py-2 px-4 border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            <button className="p-2 bg-green-500 hover:bg-green-700 rounded-full">
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingPage;
