import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Package } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const WatchlistPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const [watchlistedItems, setWatchlistedItems] = useState([]);

  const { data: listings, isLoading, isError } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${authUser._id}/watchlist`);
      return response.data;
    }
  });

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
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      toast.error('Failed to remove from watchlist');
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


  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading watchlist</div>;
  if (!listings || listings.length === 0) {
    return (
      <div className="flex h-screen lg:pl-64 pt-16">
        <div className="flex-1 bg-zinc-900 p-8">
          <div className="flex flex-col items-center justify-center h-full">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-300">No items in watchlist</h2>
            <p className="text-gray-500">Items you add to watchlist will appear here</p>
          </div>
        </div>
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
          {
            _id: authUser._id,
            role: 'buyer'
          },
          {
            _id: listing.createdBy._id,
            role: 'seller'
          }
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

  return (
    <div className="flex min-h-screen bg-zinc-900 lg:pl-64 pt-16">
      <div className="flex-1 bg-zinc-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-white mb-6">Your Watchlist</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="bg-zinc-800 rounded-lg shadow-sm overflow-hidden">
                <div className="relative w-full h-48">
                  <ImageSlider
                    images={listing.images}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start border-b border-zinc-700 pb-4">
                    <h3 className="text-lg font-semibold text-white">{listing.title}</h3>
                    <span className="text-lg font-bold text-green-500">Rs.{listing.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-white">{listing.description}</p>
                  <div className="mt-4 space-y-2 flex justify-between items-center">
                    <div className='space-y-2'>
                      <div className="flex items-center text-sm text-white">
                        <span className="font-medium">Category:</span>
                        <span className="ml-2">{listing.category}</span>
                      </div>
                      <div className="flex items-center text-sm text-white">
                        <span className="font-medium">College:</span>
                        <span className="ml-2">{listing.collegeId?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center text-sm text-white">
                        {listing.createdBy?.profileImage && (
                          <img
                            src={listing.createdBy.profileImage || '/4737448_account_user_avatar_profile_icon.svg'}
                            alt={listing.createdBy.username || 'User Avatar'}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        )}
                        <a
                          href={`/profile/${listing.createdBy.username}`}
                          className="text-green-500 font-medium hover:underline"
                        >
                          {listing.createdBy?.username || 'Unknown'}
                        </a>
                      </div>
                      <div className="text-sm text-white">
                        {new Date(listing.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <div>
                      {listing?.createdBy?._id !== authUser?._id && (
                        <div className='flex space-x-2'>
                          {listing.status === 'swapped' ? (
                            <div className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg text-center">
                              Swapped
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => handleWatchlistToggle(listing)}
                                className="mt-4 px-4 py-2 text-red-400 rounded-lg hover:bg-zinc-600 flex items-center gap-2"
                              >
                                <Heart
                                  className={`w-4 h-4 ${watchlistedItems.includes(listing._id) ? 'fill-current' : ''
                                    }`}
                                />
                              </button>
                              <button
                                onClick={() => handleRequest(listing)}
                                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                              >
                                Request
                              </button>
                            </>
                          )}
                        </div>
                      )}
                      <div className="mt-4 flex justify-end items-center">
                        <button
                          onClick={() => handleRemoveFromWatchlist(listing._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative">
      {images.length > 0 ? (
        <>
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {images.length > 1 && (
            <>
              <button
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
                onClick={handlePrev}
              >
                &#8249;
              </button>
              <button
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
                onClick={handleNext}
              >
                &#8250;
              </button>
            </>
          )}
        </>
      ) : (
        <div className="w-full h-48 bg-zinc-800 rounded-t-lg flex items-center justify-center">
          <Package className="w-10 h-10 text-zinc-600" />
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;