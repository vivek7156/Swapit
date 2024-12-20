// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, MessageSquare, List, User, Settings } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setSidebarOpen, selectedButton, setSelectedButton }) => {
  const handleButtonClick = (buttonText) => {
    setSelectedButton(buttonText);
  };

  return (
    <div
      className={`fixed left-0 top-0 z-10 h-full w-64 bg-zinc-800 shadow-md pt-16 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="px-4 py-6 space-y-4">
        <div className="space-y-2">
          {[
            { icon: ShoppingBag, text: 'Shop', link: '/shop' },
            { icon: Search, text: 'Search', link: '/search' },
            { icon: MessageSquare, text: 'Messages', link: '/messages' },
            { icon: List, text: 'Your Listings', link: '/listings' },
            { icon: User, text: 'Your Profile', link: '/profile' },
            { icon: Settings, text: 'Settings', link: '/settings' }
          ].map((item, index) =>
            item.link ? (
              <Link
                key={index}
                to={item.link}
                onClick={() => handleButtonClick(item.text)}
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg transition-colors ${
                  selectedButton === item.text ? 'bg-primary text-black' : 'hover:bg-zinc-600 text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.text}</span>
              </Link>
            ) : (
              <button
                key={index}
                onClick={() => handleButtonClick(item.text)}
                className={`flex items-center space-x-3 w-full px-4 py-2 text-white rounded-lg transition-colors ${
                  selectedButton === item.text ? 'bg-primary' : 'hover:bg-zinc-600'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.text}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
