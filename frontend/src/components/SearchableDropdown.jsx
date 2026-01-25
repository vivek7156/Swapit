import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        className={`w-full bg-zinc-900 border transition-all duration-200 p-3 rounded-xl flex items-center justify-between cursor-pointer ${isOpen ? 'border-green-500 ring-1 ring-green-500/20' : 'border-white/10 hover:border-white/20'
          }`}
      >
        <span className={`${value ? 'text-white font-medium' : 'text-zinc-500'}`}>
          {value ? value.name : placeholder}
        </span>
        <div className="flex items-center space-x-2">
          {value && (
            <div
              role="button"
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              onClick={clearSelection}
            >
              <X className="text-zinc-400 hover:text-red-400" size={16} />
            </div>
          )}
          <ChevronDown className={`text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={20} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full bg-[#111] border border-white/10 rounded-xl mt-2 shadow-2xl max-h-60 overflow-hidden flex flex-col"
          >
            {/* Search Input */}
            <div className="p-2 border-b border-white/5 bg-[#111]">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full p-2 pl-9 bg-zinc-800/50 border border-white/5 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500"
                  size={14}
                />
              </div>
            </div>

            {/* Colleges List */}
            <div className="overflow-y-auto custom-scrollbar flex-1 p-1">
              {filteredColleges.length > 0 ? (
                filteredColleges.map((college) => (
                  <button
                    key={college._id}
                    onClick={() => handleSelect(college)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors duration-150 flex items-center justify-between group"
                  >
                    <span>{college.name}</span>
                    {value?._id === college._id && <Check className="w-4 h-4 text-green-500" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-zinc-500 text-center text-sm">
                  No colleges found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchableDropdown;