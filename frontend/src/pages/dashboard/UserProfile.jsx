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
import { CheckCircle, Settings, Package, Star, Calendar, MapPin, ChevronLeft, ChevronRight, Edit3, Link as LinkIcon, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";
import axios from "axios";
import SearchableDropdown from "../../components/SearchableDropdown";
import { motion, AnimatePresence } from "framer-motion";

function UserProfile() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [colleges, setColleges] = useState([]);
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

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-red-500 text-center">Error loading user profile</div>;
  if (!user) return <div className="p-8 text-zinc-400 text-center">User not found</div>;

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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:pl-72 xl:pl-64 pt-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Profile Header */}
          <motion.div variants={itemVariants} className="relative group">
            {/* Banner Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl blur-3xl -z-10" />

            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
                {/* Profile Image */}
                <div className="relative shrink-0">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-green-400 to-blue-500">
                    <img
                      src={user.user.profileImage || "/default-avatar.png"}
                      alt={user.user.username}
                      className="w-full h-full rounded-full object-cover border-4 border-[#111]"
                    />
                  </div>
                  {user.user.verified && (
                    <div className="absolute bottom-2 right-2 bg-green-500 text-black p-1.5 rounded-full border-4 border-[#111]" title="Verified User">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{user.user.username}</h1>
                      <div className="flex flex-wrap items-center gap-4 text-zinc-400 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(user.user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{user.user.college.name || "College not set"}</span>
                        </div>
                      </div>
                    </div>

                    {authUser && authUser._id === userId && (
                      <Button
                        onClick={() => setIsEditModalOpen(true)}
                        className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full px-6"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      icon={Package}
                      label="Listings"
                      value={user.user.listings?.length || 0}
                    />
                    <StatCard
                      icon={Star}
                      label="Rating"
                      value={user.user.ratings || "0.0"}
                    />
                    {/* Add more stats if available, or fill space */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs Section */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="w-full bg-transparent border-b border-white/10 rounded-none p-0 h-auto justify-start gap-8">
                <TabsTrigger
                  value="listings"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent data-[state=active]:text-green-500 px-0 py-3 text-zinc-400 hover:text-white transition-all text-base"
                >
                  Listings
                </TabsTrigger>
                <TabsTrigger
                  value="about"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-500 data-[state=active]:bg-transparent data-[state=active]:text-green-500 px-0 py-3 text-zinc-400 hover:text-white transition-all text-base"
                >
                  About
                </TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="listings" className="mt-0 outline-none">
                  {user.user.listings && user.user.listings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {user.user.listings.map((listing) => (
                        <ListingCard key={listing._id} listing={listing} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState message="No listings yet" icon={Package} />
                  )}
                </TabsContent>

                <TabsContent value="about" className="mt-0 outline-none">
                  <div className="bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-green-500" />
                        Bio
                      </h3>
                      <p className="text-zinc-400 leading-relaxed">
                        {user.user.bio || "No bio added yet."}
                      </p>
                    </div>

                    {user.user.link && (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <LinkIcon className="w-5 h-5 text-blue-400" />
                          Links
                        </h3>
                        <a
                          href={user.user.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
                        >
                          {user.user.link}
                          <LinkIcon className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Mail className="w-5 h-5 text-purple-400" />
                        Contact
                      </h3>
                      <p className="text-zinc-400">{user.user.email}</p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </motion.div>
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
  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
    <Icon className="w-6 h-6 text-green-500 mb-2" />
    <span className="text-2xl font-bold text-white">{value}</span>
    <span className="text-xs text-zinc-400 uppercase tracking-wider">{label}</span>
  </div>
);

const ListingCard = ({ listing }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="group bg-[#111] rounded-2xl border border-white/5 overflow-hidden hover:border-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-900/10"
  >
    <div className="relative aspect-[4/3] bg-zinc-900">
      <ImageCarousel images={listing.images} />
      <div className="absolute top-3 inset-x-3 flex justify-between items-start pointer-events-none">
        <Badge className="bg-black/60 backdrop-blur-md border border-white/10 text-white pointer-events-auto">
          {listing.category}
        </Badge>
      </div>
    </div>

    <div className="p-5">
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="text-lg font-semibold text-white truncate flex-1" title={listing.title}>{listing.title}</h3>
        <span className="text-lg font-bold text-green-500 whitespace-nowrap">₹ {listing.price}</span>
      </div>
      <p className="text-sm text-zinc-400 mb-4 line-clamp-2 min-h-[2.5rem]">
        {listing.description}
      </p>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
        <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  </motion.div>
);

const ImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images?.length) {
    return (
      <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
        <Package className="w-10 h-10 text-zinc-700" />
      </div>
    );
  }

  return (
    <div className="relative group w-full h-full">
      <img
        src={images[currentIndex]}
        alt="Listing"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {images.length > 1 && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <button
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => i === 0 ? images.length - 1 : i - 1); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => i === images.length - 1 ? 0 : i + 1); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 relative z-10">
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

const EmptyState = ({ message, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-20 text-zinc-500 bg-[#111] rounded-3xl border border-white/5">
    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/5">
      <Icon className="w-10 h-10 opacity-50" />
    </div>
    <p className="text-lg font-medium text-white">{message}</p>
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
      if (formData.profileImage instanceof File) {
        formDataToSend.append('profileImage', formData.profileImage);
      }

      const response = await axios.post('/api/users/update', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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
      <DialogContent className="bg-[#111] text-white border-white/10 w-[95vw] max-w-2xl mx-auto p-0 overflow-hidden rounded-2xl">
        <DialogHeader className="p-6 border-b border-white/5 bg-zinc-900/50">
          <DialogTitle className="text-xl font-semibold">Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-zinc-900/50 rounded-xl border border-white/5">
                <img
                  src={imagePreview || '/default-avatar.png'}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover ring-2 ring-white/10"
                />
                <div className="flex-1 w-full text-center sm:text-left">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Profile Image (Max 3MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-zinc-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-white/10 file:text-white
                            hover:file:bg-white/20 transition-colors
                            cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white transition-all"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-zinc-400">College</label>
                  <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden [&>div]:border-none">
                    <SearchableDropdown
                      colleges={colleges}
                      value={colleges.find(college => college._id === formData.college)}
                      onChange={(college) => setFormData({ ...formData, college: college ? college._id : '' })}
                    />
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="font-medium text-white flex items-center gap-2">
                  Change Password
                  <span className="text-xs font-normal text-zinc-500">(Leave blank to keep current)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Current Password</label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-400">New Password</label>
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Website Link</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto hover:bg-white/5 text-zinc-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-black"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
