import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, MessageSquare, List, User, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const Sidebar = ({ isSidebarOpen, setSidebarOpen, selectedButton, setSelectedButton, toggleSidebar }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);
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
      case '/watchlist':
        setSelectedButton('Watchlist');
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
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen &&
        window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, setSidebarOpen]);

  return (
    <aside
      ref={sidebarRef}
      className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-[#0a0a0a] border-r border-white/10 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="py-6 px-3 h-full overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Menu</p>
          {[
            { icon: ShoppingBag, text: 'Shop', link: '/shop' },
            { icon: Search, text: 'Search', link: '/search' },
            { icon: MessageSquare, text: 'Messages', link: '/messages' },
            { icon: List, text: 'Your Listings', link: '/listings' },
            { icon: Heart, text: 'Watchlist', link: '/watchlist' },
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
              className={`group flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 ${selectedButton === item.text
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${selectedButton === item.text ? 'text-green-400' : 'group-hover:text-white'
                }`} />
              <span className="font-medium text-sm">{item.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;