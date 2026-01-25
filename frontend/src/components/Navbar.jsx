import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import logo from "../assets/logo.png";

const Navbar = ({ toggleSidebar, selectedButton, setSelectedButton }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const isNotificationPage = location.pathname === '/notifications';

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate('/login');
    },
    onError: () => {
      toast.error("Couldn't log out. Please try again later.");
    }
  });

  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  // Handle icon click
  const handleButtonClick = (buttonText) => {
    setSelectedButton && setSelectedButton(buttonText);
    setDropdownOpen(buttonText === 'User' ? !isDropdownOpen : false);
  };

  // Toggle dropdown
  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
    setSelectedButton && setSelectedButton('User');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setSelectedButton && setSelectedButton(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSelectedButton]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Left: Logo & Sidebar Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="SwapIt" className="size-8 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-green-400 transition-colors">SwapIt</span>
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">

            {/* Notifications */}
            <Link
              to="/notifications"
              onClick={() => handleButtonClick('Notifications')}
              className={`p-2 rounded-full transition-all duration-300 relative group ${isNotificationPage ? 'bg-green-500/10 text-green-500' : 'hover:bg-white/5 text-zinc-400 hover:text-white'
                }`}
            >
              <Bell className="w-5 h-5" />
              {isNotificationPage && <span className="absolute top-2 right-2.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
            </Link>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className={`flex items-center gap-3 pl-1 pr-1 py-1 rounded-full transition-all duration-300 ${isDropdownOpen ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'
                  }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                  <img
                    src={authUser?.profileImage || "/default-avatar.png"}
                    alt={authUser?.username || "Profile"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-[#111] border border-white/10 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-white/5 mb-2">
                    <p className="text-sm font-semibold text-white truncate">{authUser?.username}</p>
                    <p className="text-xs text-zinc-500 truncate">{authUser?.email}</p>
                  </div>

                  {/* Links */}
                  <Link
                    to={`/profile/${authUser?.username}`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    My Profile
                  </Link>

                  <div className="my-2 border-t border-white/5" />

                  {/* Logout */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
