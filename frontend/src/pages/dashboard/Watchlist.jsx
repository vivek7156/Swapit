import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Package, Trash2, ExternalLink, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const WatchlistPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const [watchlistedItems, setWatchlistedItems] = useState([]);

  // Fetch watchlist data
  const { data: listings, isLoading, isError } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${authUser._id}/watchlist`);
      return response.data;
    },
    enabled: !!authUser?._id // Only fetch if user is authenticated
  });

  // Sync local state with fetched data (functionality preservation)
  useEffect(() => {
    if (listings) {
      setWatchlistedItems(listings.map(item => item._id));
    }
  }, [listings]);

  // Separate effect for initial fetch if needed to ensure sync, 
  // though react-query handles this mostly. Keeping strictly to logic pattern.
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

  const handleRemoveFromWatchlist = async (itemId) => {
    try {
      await axios.delete(`/api/users/${authUser._id}/watchlist`, {
        data: { itemId }
      });
      queryClient.invalidateQueries(['watchlist']);
      toast.success('Removed from watchlist');
      // Optimistic update
      setWatchlistedItems(prev => prev.filter(id => id !== itemId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
    }
  };

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
        toast.error("Failed to request item");
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] lg:pl-64 pt-20">
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Watchlist</h1>
          <p className="text-zinc-400">Keep track of items you're interested in.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-[#111] h-96 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-red-500 bg-red-500/10 p-4 rounded-xl">Error loading watchlist. Please try again.</div>
        ) : !listings || listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-[#111] rounded-3xl border border-white/5">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/5">
              <Package className="w-10 h-10 text-zinc-500" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h2>
            <p className="text-zinc-500 max-w-xs mb-6">Browse items and tap the heart icon to save them for later.</p>
            <Link to="/search" className="px-6 py-2.5 bg-green-500 hover:bg-green-400 text-black font-medium rounded-full transition-all">
              Browse Items
            </Link>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {listings.map((listing) => (
                <motion.div
                  key={listing._id}
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="group bg-[#111] rounded-2xl border border-white/5 overflow-hidden hover:border-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-900/10 flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden">
                    <ImageSlider images={listing.images} />

                    <div className="absolute top-3 right-3 flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveFromWatchlist(listing._id); }}
                        className="p-2 bg-black/60 hover:bg-red-500/80 backdrop-blur-md text-white rounded-full transition-all"
                        title="Remove from Watchlist"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                        {listing.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-lg font-semibold text-white truncate flex-1" title={listing.title}>
                        {listing.title}
                      </h3>
                      <span className="text-lg font-bold text-green-500 whitespace-nowrap">₹ {listing.price}</span>
                    </div>

                    <p className="text-sm text-zinc-400 mb-4 line-clamp-2 min-h-[2.5rem] flex-1">
                      {listing.description}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-white/5">
                      {/* User Info */}
                      <div className="flex items-center justify-between text-sm">
                        <Link to={`/profile/${listing.createdBy?.username}`} className="flex items-center gap-2 group/user">
                          <img
                            src={listing.createdBy?.profileImage || '/default-avatar.png'}
                            alt={listing.createdBy?.username || 'User'}
                            className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10"
                          />
                          <span className="text-zinc-400 group-hover/user:text-green-400 transition-colors">
                            {listing.createdBy?.username || 'Unknown'}
                          </span>
                        </Link>
                        <span className="text-zinc-600">
                          {new Date(listing.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        {listing.status === 'swapped' ? (
                          <div className="w-full py-2.5 bg-zinc-800 text-zinc-500 rounded-xl text-center text-sm font-medium cursor-not-allowed">
                            Item Swapped
                          </div>
                        ) : listing.createdBy?._id === authUser?._id ? (
                          <div className="w-full py-2.5 bg-zinc-800 text-zinc-400 rounded-xl text-center text-sm font-medium">
                            Your Item
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRequest(listing)}
                            className="w-full py-2.5 bg-green-500 hover:bg-green-400 text-black font-medium rounded-xl transition-colors shadow-lg shadow-green-900/20 active:scale-95 flex items-center justify-center gap-2"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Request Item</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
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

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
        <Package className="w-8 h-8 text-zinc-700" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {images.length > 1 && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all"
            onClick={handlePrev}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all"
            onClick={handleNext}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WatchlistPage;