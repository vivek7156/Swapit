import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const Navbar = ({ toggleSidebar, selectedButton, setSelectedButton }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();
  const location = useLocation();
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
			queryClient.invalidateQueries({queryKey: ["authUser"]});
    },
    onError: () => {
      toast.error("Couldn't log out. Please try again later.");
    }
  });

  const { data: authUser } = useQuery({queryKey: ['authUser']});


  // Handle icon click and update selectedButton
  const handleButtonClick = (buttonText) => {
    setSelectedButton(buttonText);
    setDropdownOpen(buttonText === 'User' ? !isDropdownOpen : false); // Toggle dropdown only for 'User'
  };

  // Toggle dropdown
  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
    setSelectedButton('User'); // Mark user icon as selected when dropdown is open
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setSelectedButton(null); // Deselect icon when clicking outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-zinc-800 shadow-sm fixed w-full z-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button onClick={toggleSidebar} className="lg:hidden text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-primary">SwapIt</h1>
          </div>
          <div className="flex items-center space-x-4 relative">
            {/* Notifications Icon */}
            <Link
              to="/notifications"
              onClick={() => handleButtonClick('Notifications')}
              className={`${
                isNotificationPage ? 'text-green-500' : 'text-white'
              }`}
            >
              <Bell className="w-6 h-6" />
            </Link>

            {/* User Icon with Dropdown */}
<button
  onClick={handleDropdownToggle}
  className={`w-8 h-8 rounded-full overflow-hidden hover:ring-2 transition-all ${
    selectedButton === 'User' ? 'ring-2 ring-green-500' : 'ring-white'
  }`}
>
  <img
    src={authUser?.profileImage || "/default-avatar.png"}
    alt={authUser?.username || "Profile"}
    className="w-full h-full object-cover"
  />
</button>

            {/* User Dropdown */}
            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-[-10px] top-[-15px] mt-16 w-48 bg-zinc-900 p-4 rounded-lg shadow-lg border border-gray-700"
              >
                <p className="text-gray-400 mb-2">{authUser?.username}</p>
                <p className="text-gray-400 mb-4">{authUser?.email}</p>
                <button 
                  className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                    navigate('/login');
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
