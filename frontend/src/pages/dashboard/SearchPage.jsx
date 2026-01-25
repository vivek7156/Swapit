import React, { useState, useEffect, useRef } from 'react';
import { Search, Package, Heart, ChevronDown, Check, X, MapPin, User, Calendar, Filter } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import SearchableDropdown from '../../components/SearchableDropdown';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [location, setLocation] = useState('');
  const [searchParams, setSearchParams] = useState({});
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [watchlistedItems, setWatchlistedItems] = useState([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  const handleMinPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value <= maxPrice) setMinPrice(value);
  };

  const handleMaxPriceChange = (e) => {
    const value = Number(e.target.value);
    if (value >= minPrice) setMaxPrice(value);
  };

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch(`/api/colleges`);
        const data = await response.json();
        setColleges(data);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }
    };
    fetchColleges();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams({ query, category, collegeId, location, minPrice, maxPrice });
    }, 500);

    return () => clearTimeout(handler);
  }, [query, category, collegeId, location, minPrice, maxPrice]);

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['listings', searchParams],
    queryFn: async ({ queryKey }) => {
      const [, { query, minPrice, maxPrice, category, collegeId, location }] = queryKey;
      try {
        const res = await fetch(`/api/items/search?query=${query || ''}&minPrice=${minPrice || ''}&maxPrice=${maxPrice || ''}&category=${category || ''}&collegeId=${collegeId || ''}&location=${location || ''}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    initialData: [],
  });

  const uniqueLocations = [...new Set(colleges.map((college) => college.location))];

  const handleSearch = (e) => {
    e.preventDefault();
    // Immediate search on enter/click, cancelling pending debounce
    setSearchParams({ query, category, collegeId, location, minPrice, maxPrice });
  };

  useEffect(() => {
    refetch();
  }, [searchParams, refetch]);

  const handleRequest = async (listing) => {
    try {
      const response = await axios.post(`/api/chat/request`, {
        itemId: listing._id,
        sellerId: listing.createdBy._id,
        buyerId: authUser._id,
        participants: [
          { _id: authUser._id, role: 'buyer' },
          { _id: listing.createdBy._id, role: 'seller' }
        ],
        initialMessage: `Hi, I'm interested in your ${listing.title}`
      });

      if (response.status === 201 || response.status === 200) {
        navigate(`/messages`);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        navigate(`/messages`);
      } else {
        console.error('Error requesting item:', error);
      }
    }
  };

  useEffect(() => {
    if (!authUser?._id) return;
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`/api/users/${authUser._id}/watchlist`);
        setWatchlistedItems(response.data.map(item => item._id));
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    };
    fetchWatchlist();
  }, [authUser]);

  const handleWatchlistToggle = async (listing) => {
    try {
      const isWatchlisted = watchlistedItems.includes(listing._id);

      if (isWatchlisted) {
        await axios.delete(`/api/users/${authUser._id}/watchlist`, {
          data: { itemId: listing._id }
        });
        setWatchlistedItems(prev => prev.filter(id => id !== listing._id));
        toast.success('Removed from watchlist');
      } else {
        await axios.post(`/api/users/${authUser._id}/watchlist`, {
          itemId: listing._id
        });
        setWatchlistedItems(prev => [...prev, listing._id]);
        toast.success('Added to watchlist');
      }

      queryClient.invalidateQueries(['watchlist']);
    } catch (error) {
      toast.error('Failed to update watchlist');
    }
  };

  const categories = ["Books", "Electronics", "Furniture", "Appliances", "Clothing", "Sports"];
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className='pt-28 lg:pt-20 lg:pl-64 pb-12'>

        {/* Search Header Area */}
        <div className="sticky top-16 z-30 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 pb-6 pt-4 px-4 sm:px-8">
          <form onSubmit={handleSearch} className="max-w-7xl mx-auto space-y-4">
            {/* Main Search Bar */}
            <div className="relative group">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#111] rounded-xl border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500/50 transition-all shadow-sm group-hover:bg-[#161616]"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
              <button type='submit' className="absolute right-2 top-2 bottom-2 bg-green-500 hover:bg-green-600 text-black font-semibold px-6 rounded-lg transition-all text-sm">
                Search
              </button>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Category Custom Dropdown */}
              <CustomDropdown
                options={categories}
                value={category}
                onChange={setCategory}
                placeholder="Category"
                label="Category"
              />

              {/* College Searchable Dropdown */}
              <div className="w-full">
                <SearchableDropdown
                  colleges={colleges}
                  value={selectedCollege}
                  onChange={(college) => {
                    setSelectedCollege(college);
                    setCollegeId(college ? college._id : '');
                  }}
                  placeholder="Select College"
                />
              </div>

              {/* Location Custom Dropdown */}
              <CustomDropdown
                options={uniqueLocations}
                value={location}
                onChange={setLocation}
                placeholder="Location"
                label="Location"
              />

              {/* Price Range */}
              <div className="bg-[#111] border border-white/10 rounded-xl px-4 py-2 flex flex-col justify-center">
                <div className="flex justify-between items-center text-xs text-zinc-400 mb-1.5">
                  <span>Price Range</span>
                  <span className="text-green-400 font-medium">₹{minPrice} - ₹{maxPrice}+</span>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="500"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="500"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Listings Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
          {listings && listings.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              {listings.map((listing) => (
                <motion.div
                  key={listing._id}
                  variants={item}
                  className="group bg-[#111] rounded-2xl border border-white/5 overflow-hidden hover:border-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-900/10 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageSlider images={listing.images} />
                    <div className="absolute top-3 right-3 z-10">
                      {listing.createdBy._id !== authUser?._id && listing.status !== 'swapped' && (
                        <button
                          onClick={() => handleWatchlistToggle(listing)}
                          className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${watchlistedItems.includes(listing._id)
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-black/50 text-white hover:bg-black/70'
                            }`}
                        >
                          <Heart className={`w-4 h-4 ${watchlistedItems.includes(listing._id) ? 'fill-current' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-green-400 transition-colors">
                        {listing.title}
                      </h3>
                      <span className="text-lg font-bold text-green-500 shrink-0 ml-2">₹{listing.price}</span>
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-grow">
                      {listing.description}
                    </p>

                    <div className="space-y-3 pt-3 border-t border-white/5">
                      <div className="flex items-center text-xs text-zinc-500">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <User className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate hover:text-green-400 cursor-pointer transition-colors" onClick={() => navigate(`/profile/${listing.createdBy.username}`)}>
                            {listing.createdBy?.username || 'Unknown'}
                          </span>
                        </div>
                        <span className="mx-2 text-zinc-700">|</span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{listing.collegeId?.name || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>

                    {listing.createdBy._id !== authUser?._id && (
                      <div className="mt-4 pt-2">
                        {listing.status === 'swapped' ? (
                          <div className="w-full py-2.5 bg-zinc-800 text-zinc-400 rounded-xl text-center text-sm font-medium border border-white/5">
                            Swapped
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRequest(listing)}
                            className="w-full py-2.5 bg-green-600 hover:bg-green-500 text-black rounded-xl text-sm font-bold transition-colors shadow-lg shadow-green-900/20 active:scale-[0.98]"
                          >
                            Request
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[#111] rounded-2xl border border-white/5">
              <div className="bg-zinc-800 p-4 rounded-full mb-4">
                <Package className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-1">No items found</h3>
              <p className="text-zinc-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomDropdown = ({ options, value, onChange, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#111] border transition-all duration-200 p-3 rounded-xl flex items-center justify-between cursor-pointer ${isOpen ? 'border-green-500 ring-1 ring-green-500/20' : 'border-white/10 hover:border-white/20'
          }`}
      >
        <span className={`${value ? 'text-white' : 'text-zinc-500'}`}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <div role="button" onClick={(e) => { e.stopPropagation(); onChange(''); }} className="hover:bg-white/10 p-0.5 rounded-full">
              <X size={14} className="text-zinc-400 hover:text-red-400" />
            </div>
          )}
          <ChevronDown size={16} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#161616] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto custom-scrollbar"
          >
            {options.map((option) => (
              <div
                key={option}
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between ${value === option ? 'bg-green-500/10 text-green-400' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
              >
                {option}
                {value === option && <Check size={14} />}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
        <Package className="w-8 h-8 text-zinc-700" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group/slider">
      <img
        src={images[currentIndex]}
        alt={`Item view ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
      {images.length > 1 && (
        <>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, idx) => (
              <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/40'}`} />
            ))}
          </div>

          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-sm hover:bg-black/60"
          >
            <ChevronDown className="rotate-90 w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-sm hover:bg-black/60"
          >
            <ChevronDown className="-rotate-90 w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};


export default SearchPage;
