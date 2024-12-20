import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';

const SearchableDropdown = ({ 
  colleges, 
  value, 
  onChange, 
  placeholder = "Select College" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Filter colleges based on search term
  const filteredColleges = colleges.filter(college => 
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (college) => {
    onChange(college);
    setIsOpen(false);
    setSearchTerm('');
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
  };

  return (
    <div 
      ref={dropdownRef}
      className="relative w-full"
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-800 p-3 rounded-lg flex items-center justify-between cursor-pointer"
      >
        <span className={`${value ? 'text-white' : 'text-gray-400'}`}>
          {value ? value.name : placeholder}
        </span>
        <div className="flex items-center space-x-2">
          {value && (
            <X 
              className="text-gray-400 hover:text-red-500" 
              size={20} 
              onClick={clearSelection}
            />
          )}
          <ChevronDown className="text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-zinc-800 rounded-lg mt-2 shadow-lg max-h-60 overflow-y-auto">
          {/* Search Input */}
          <div className="p-2 sticky top-0 bg-zinc-800 z-20">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search colleges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 bg-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                size={20} 
              />
            </div>
          </div>

          {/* Colleges List */}
          <div className="py-1">
            {filteredColleges.length > 0 ? (
              filteredColleges.map((college) => (
                <div 
                  key={college._id}
                  onClick={() => handleSelect(college)}
                  className="px-4 py-2 hover:bg-zinc-700 text-white cursor-pointer transition-colors duration-200"
                >
                  {college.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400 text-center">
                No colleges found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;