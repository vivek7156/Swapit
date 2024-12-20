import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useQuery } from '@tanstack/react-query';

const DashboardPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState("Shop");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const handleButtonClick = (buttonText) => {
    setSelectedButton(buttonText);
  };

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
  const limitedListings = listings?.slice(0, 20); // Limit to 20 items

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching listings.</div>;
  }

  if (!listings || listings.length === 0) {
    return <div>No listings available.</div>;
  }


  return (
    <div className="min-h-screen bg-zinc-900 ml-[8.5px]">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
      />

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
                    <span className="text-lg font-bold text-primary">${listing.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-white">{listing.description}</p>
                  <div className="mt-4 space-y-2">
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
                        href={`/profile/${listing.createdBy._id}`}
                        className="text-primary font-medium hover:underline"
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

  if (!images || images.length === 0) return null;

  return (
    <div className="relative">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-48 object-cover"
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
    </div>
  );
};

export default DashboardPage;
