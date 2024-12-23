import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, MessageSquare, List, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Sidebar = ({ isSidebarOpen, setSidebarOpen, selectedButton, setSelectedButton }) => {
  const location = useLocation();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  // Whenever the route changes, set the button based on the current path
  useEffect(() => {
    switch (location.pathname) {
      case '/shop':
        setSelectedButton('Shop');
        break;
      case '/search':
        setSelectedButton('Search');
        break;
      case '/messages':
        setSelectedButton('Messages');
        break;
      case '/listings':
        setSelectedButton('Your Listings');
        break;
      case authUser ? `/profile/${authUser.username}` : '':
        setSelectedButton('Your Profile');
        break;
      default:
        setSelectedButton('');
    }
  }, [location, authUser, setSelectedButton]);

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
            {
              icon: User,
              text: 'Your Profile',
              link: authUser ? `/profile/${authUser.username}` : '#'
            },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.link}
              onClick={() => handleButtonClick(item.text)}
              className={`flex items-center space-x-3 w-full px-4 py-2 rounded-lg transition-colors ${
                selectedButton === item.text ? 'bg-green-500 text-white' : 'hover:bg-zinc-600 text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;