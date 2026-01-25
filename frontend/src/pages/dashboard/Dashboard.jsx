import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Package, Heart } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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
    if(!authUser?._id) return;

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
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching listings.</div>;
  }

  if (!listings || listings.length === 0) {
    return <div>No listings available.</div>;
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

  return (
    <div className="min-h-screen bg-zinc-900">

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {limitedListings.map((listing) => (
              <div key={listing.id} className="bg-zinc-800 rounded-lg shadow-sm overflow-hidden">
                {/* Image Slider */}
                <div className="relative">
                  <ImageSlider images={listing.images} />
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
                      {listing.createdBy._id !== authUser._id && (
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
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

export default DashboardPage;
