import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Search, Package, Heart } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { useQuery, QueryClient, useQueryClient } from '@tanstack/react-query';
import LoadingSpinner from '../../components/LoadingSpinner';
import SearchableDropdown from '../../components/SearchableDropdown';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [category, setCategory] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [location, setLocation] = useState('');
  const [searchParams, setSearchParams] = useState({});
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
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

  const handleCollegeSelect = (college) => {
    setSelectedCollege(college.name);
    setFormData((prevFormData) => ({
      ...prevFormData,
      collegeId: college._id, // Set collegeId with the selected college's _id
    }));
  };

  const { data: listings, isLoading, refetch } = useQuery({
    queryKey: ['listings', searchParams],
    queryFn: async ({ queryKey }) => {
      const [, { query, minPrice, maxPrice, category, collegeId, location }] = queryKey;
      console.log('Fetching with params:', { query, minPrice, maxPrice, category, collegeId, location }); // Debugging
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
    initialData: [], // Provide an initial empty array to avoid undefined issues
  });

  const uniqueLocations = [...new Set(colleges.map((college) => college.location))];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search submitted', { query, category, collegeId, minPrice, maxPrice, location });
    setSearchParams({ query, category, collegeId, location, minPrice, maxPrice });
    // Trigger the query with the updated search parameters
  };

  useEffect(() => {
    refetch();
  }, [searchParams, refetch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
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


  useEffect(() => {
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

  const categories = ["Books", "Electronics", "Furniture", "Appliances", "Clothing", "Sports"];
  return (
    <div className="min-h-screen bg-zinc-900 ">

      <div className='pt-20 lg:pl-64'>
        {/* Search Header */}
        <form className="mb-4" onSubmit={handleSearch}>
          <div className="bg-zinc-900 shadow-sm py-6">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search for items..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-zinc-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <button type='submit' className="bg-green-500 text-black px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mb-6 px-4">
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Category Dropdown */}
              <div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full py-3 p-2 bg-zinc-800 rounded-lg text-gray-400"
                >
                  <option value="" className='w-80'>All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* College Dropdown */}
              <div>
                <SearchableDropdown
                  colleges={colleges}
                  value={selectedCollege}
                  onChange={(college) => {
                    setSelectedCollege(college);
                    setCollegeId(college ? college._id : '');
                  }}
                />
              </div>

              {/* Price Range */}
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center w-full">
                  {/* Display Selected Price Range */}
                  <div className="flex justify-center flex-grow text-white">
                    <span>Min: Rs.{minPrice}</span>
                    <span className="mx-4">-</span>
                    <span>Max: Rs{maxPrice}</span>
                  </div>

                  {/* Reset Button */}
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(100000);
                    }}
                  >
                    Reset
                  </button>
                </div>

                {/* Slider */}
                <div className="flex items-center space-x-4 w-full">
                  {/* Min Price Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="500"
                    value={minPrice}
                    onChange={handleMinPriceChange}
                    className="w-full"
                  />

                  {/* Max Price Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="500"
                    value={maxPrice}
                    onChange={handleMaxPriceChange}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-3 p-2 bg-zinc-800 rounded-lg text-gray-400"
                >
                  <option value="" className='w-80'>All Locations</option>
                  {uniqueLocations.map((loc, index) => (
                    <option key={index} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="max-w-7xl mx-3 xl:pr-12 xl:pl-96 lg:pl-72 px-4">
        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:gap-10 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="bg-zinc-800 rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                  <ImageSlider images={listing.images} />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-100">{listing.title}</h3>
                    <span className="text-lg font-bold text-green-500">Rs.{listing.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-300">{listing.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className='space-y-2'>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-green-400 text-sm rounded-full text-gray-600">
                          {listing.category}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
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
                          href={`/profile/${listing.createdBy._id}`}
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
        ) : (
          <div className="text-center text-gray-400 py-10">
            No listings found
          </div>
        )}
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
            className="w-full lg:h-80 h-60 object-cover rounded-t-lg"
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
        <div className="w-full h-80 bg-zinc-800 rounded-t-lg flex items-center justify-center">
          <Package className="w-10 h-10 text-zinc-600" />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
