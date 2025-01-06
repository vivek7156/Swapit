import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { X } from 'lucide-react';

const FilterSidebar = ({ priceRange, setPriceRange, categories, selectedCategories, toggleCategory, colleges, selectedColleges, toggleCollege, conditions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Button to toggle sidebar */}
      <button
        onClick={toggleSidebar}
        className="text-black fixed top-[140px] bg-green-500 p-3 rounded-lg shadow-md z-10 right-8"
      >
        <SlidersHorizontal className="w-6 h-6" />
      </button>

      {/* Filter Sidebar */}
      <div
        className={`fixed top-[160px] right-4 bottom-0 bg-gray-800 bg-opacity-50 z-10 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={toggleSidebar} // Close the sidebar when clicking outside
      >
        <div
          className={`w-64 flex-shrink-0 bg-zinc-800 rounded-lg shadow-sm p-4 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={toggleSidebar} className="text-gray-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-2">
            <h3 className="font-medium mb-1">Price Range</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-2">
            <h3 className="font-medium mb-1">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Colleges */}
          <div className="mb-2">
            <h3 className="font-medium mb-1">Colleges</h3>
            <div className="space-y-2">
              {colleges.map((college) => (
                <label key={college} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedColleges.includes(college)}
                    onChange={() => toggleCollege(college)}
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{college}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div className="mb-2">
            <h3 className="font-medium mb-1">Condition</h3>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <label key={condition} className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-green-500 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{condition}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <X className="w-4 h-4" />
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
