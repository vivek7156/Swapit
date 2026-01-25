import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Package, Heart, MapPin, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const { data: listings, isLoading, isError } = useQuery({
    queryKey: ['listings'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/items/getItems');
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  const limitedListings = listings?.slice(0, 30); // Limit to 30 items

  const [watchlistedItems, setWatchlistedItems] = useState([]);

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
  }, [authUser._id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center lg:pl-64 pt-16">
        <div className="w-10 h-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center lg:pl-64 pt-16 text-red-400">
        Error fetching listings. Please try again later.
      </div>
    );
  }

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

      if (response.status === 201) {
        navigate(`/messages`);
      } else {
        console.error('Error creating chat:', response);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        navigate(`/messages`);
      } else {
        console.error('Error requesting item:', error);
      }
    }
  };


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
      console.error('Error updating watchlist:', error);
      toast.error('Failed to update watchlist');
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Main Content */}
      <main className="lg:pl-64 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Fresh Finds</h1>
            <p className="text-zinc-400">Discover the latest items listed by students across campus.</p>
          </div>

          {!listings || listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 bg-[#111] rounded-2xl border border-white/5">
              <Package className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg">No listings available right now.</p>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {limitedListings.map((listing) => (
                <motion.div
                  key={listing.id}
                  variants={item}
                  className="group bg-[#111] rounded-2xl border border-white/5 overflow-hidden hover:border-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-900/10 flex flex-col h-full"
                >
                  {/* Image Slider */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageSlider images={listing.images} />
                    <div className="absolute top-3 right-3 z-10">
                      {listing.createdBy._id !== authUser._id && listing.status !== 'swapped' && (
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
                      <span className="text-lg font-bold text-green-500 shrink-0 ml-2">
                        ₹{listing.price}
                      </span>
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
                          <span className="truncate">{listing.collegeId?.name || 'Unknown Campus'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(listing.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5">
                          {listing.category}
                        </span>
                      </div>
                    </div>

                    {listing.createdBy._id !== authUser._id && (
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
                            Chat to Buy
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />

          <button
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-sm"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-sm"
            onClick={handleNext}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
