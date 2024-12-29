import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Settings, Package, Star, Calendar, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import SearchableDropdown from "../../components/ui/searchableDropdown.jsx";


function UserProfile() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState("Your profile");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");
  const [colleges, setColleges] = useState([]);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const { username } = useParams();

  // Fetch user with listings
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/users/profile/${username}`);
        console.log("User profile:", res.data);
        return res.data;
      } catch (err) {
        console.error("Error fetching user profile:", err);
        throw err.response.data.message
      }
    }
  });

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get('/api/colleges');
        setColleges(response.data);
      } catch (err) {
        console.error('Error fetching colleges:', err);
      }
    };

    fetchColleges();
  }, []);

  const userId = user?.user?._id;
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  // Local states for the edit profile modal
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-4">Error loading user profile</div>;
  if (!user) return <div className="p-4">User not found</div>;

  const memberSinceDate = new Date(user.user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:pl-72 xl:pl-64 pt-20">
        {/* Profile Header */}
        <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="relative group">
              <img
                src={user.user.profileImage || "/default-avatar.png"}
                alt={user.user.username}
                className="w-40 h-40 rounded-2xl object-cover ring-2 ring-zinc-700"
              />
              {user.user.verified && (
                <Badge className="absolute -top-2 -right-2 bg-green-500">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified
                </Badge>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{user.user.username}</h1>
                {authUser && authUser._id === userId && (
                <Button
                  variant="outline"
                  className="ml-auto text-black"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                  icon={Package}
                  label="Listings"
                  value={user.user.listings?.length || 0}
                />
                <StatCard
                  icon={Star}
                  label="Rating"
                  value={user.user.ratings || 0}
                />
                <StatCard
                  icon={Calendar}
                  label="Member Since"
                  value={new Date(user.user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
                <StatCard
                  icon={MapPin}
                  label="College"
                  value={user.user.college.name || "Not Set"}
                />
              </div>

              {/* Bio */}
              {user.user.bio && (
                <p className="text-gray-300 mb-4">{user.user.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="w-full bg-zinc-800/50 backdrop-blur-sm mb-6">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            {user.user.listings && user.user.listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.user.listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            ) : (
              <EmptyState message="No listings yet" />
            )}
          </TabsContent>

          <TabsContent value="about">
            <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <div className="space-y-4">
                {user.user.bio && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Bio</h3>
                    <p className="text-white">{user.user.bio}</p>
                  </div>
                )}
                {user.user.link && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Website</h3>
                    <a
                      href={user.user.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {user.user.link}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user.user}
        onSave={refetch}
        colleges={colleges}
      />
    </div>
  );
}

// Helper Components
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-zinc-700/50 rounded-lg p-4">
    <Icon className="w-5 h-5 text-gray-400 mb-2" />
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

const ListingCard = ({ listing }) => (
  <div className="bg-zinc-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all">
    <div className="relative aspect-video">
      <ImageCarousel images={listing.images} />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
      <p className="text-gray-400 text-sm line-clamp-2 mb-2">
        {listing.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-green-400 font-semibold">
          Rs.{listing.price}
        </span>
        <Badge variant="secondary">{listing.category}</Badge>
      </div>
      <div>{new Date(listing.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })} </div>
    </div>
  </div>
);

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images?.length) {
    return (
      <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
        <Package className="w-8 h-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="relative group w-full h-full">
      <img
        src={images[currentIndex]}
        alt="Listing"
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(i => i === 0 ? images.length - 1 : i - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex(i => i === images.length - 1 ? 0 : i + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
    <Package className="w-12 h-12 mb-4" />
    <p>{message}</p>
  </div>
);


const EditProfileModal = ({ isOpen, onClose, user, onSave, colleges }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    college: '',
    bio: '',
    link: '',
    profileImage: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(user?.profileImage || '');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        college: user.college._id || '',
        bio: user.bio || '',
        link: user.link || '',
        profileImage: user.profileImage || ''
      });
      setImagePreview(user.profileImage || '');
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, profileImage: file })); // Store the file object
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('currentpassword', formData.currentPassword);
      formDataToSend.append('newpassword', formData.newPassword);
      formDataToSend.append('college', formData.college);
      formDataToSend.append('bio', formData.bio);
      formDataToSend.append('link', formData.link);
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
  
      console.log('Submitting form data:', formDataToSend);
  
      const response = await axios.post('/api/users/update', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Response:', response.data);
      onSave(response.data.user);
      onClose();
    } catch (err) {
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 text-white border-zinc-700 w-[95vw] max-w-2xl mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl sm:text-2xl font-semibold">Edit Profile</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-2 sm:p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Profile Image */}
            <div className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-4">
              <img 
                src={imagePreview || '/default-avatar.png'}
                alt="Profile Preview"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
              />
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Profile Image(less than 3mb)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-zinc-700 file:text-white
                    hover:file:bg-zinc-600"
                />
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full p-2 bg-zinc-800 rounded-md border border-zinc-600 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 bg-zinc-800 rounded-md border border-zinc-600 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">College</label>
              <SearchableDropdown
                colleges={colleges}
                value={colleges.find(college => college._id === formData.college)}
                onChange={(college) => setFormData({...formData, college: college ? college._id : ''})}
              />
            </div>

            {/* Password Change Section */}
            <div className="sm:col-span-2 space-y-4 pt-4 border-t border-zinc-700">
              <h3 className="font-medium text-base sm:text-lg">Change Password</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Current Password</label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                    className="w-full p-2 bg-zinc-800 rounded-md border border-zinc-600 focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium">New Password</label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                    className="w-full p-2 bg-zinc-800 rounded-md border border-zinc-600 focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Bio & Link */}
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-sm font-medium">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={3}
                className="w-full p-2 bg-zinc-800 rounded-md border border-zinc-600 focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <label className="block text-sm font-medium">Website Link</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                className="w-full p-2 bg-zinc-800 rounded-md border border-zinc-600 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-4 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;