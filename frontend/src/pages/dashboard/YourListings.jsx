import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  MessageSquare,
  List,
  User,
  Settings,
  Edit,
  Trash2,
  X,
  Upload,
  Plus,
  Package,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

const UserListingsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    newImages: [],
  });
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    images: [], // for image upload
  });
  const [existingImages, setExistingImages] = useState([]);
  const queryClient = useQueryClient();

  // const [isSidebarOpen, setSidebarOpen] = useState(false); // Unused

  const { data: user } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/myprofile');
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  });

  const userId = user?._id;
  const userCollege = user?.college;
  const { data: listings } = useQuery({
    queryKey: ['listings', userId],
    queryFn: async () => {
      try {
        if (!userId) {
          throw new Error("User ID is required to fetch listings");
        }

        const res = await fetch(`/api/users/${userId}/listings`);
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
    enabled: !!userId,
  });

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append('title', createForm.title);
      formdata.append('description', createForm.description);
      formdata.append('price', createForm.price);
      formdata.append('category', createForm.category);
      formdata.append('collegeId', userCollege);
      if (createForm.images) {
        for (let i = 0; i < createForm.images.length; i++) {
          formdata.append('images', createForm.images[i]);
        }
      }

      const res = await fetch('/api/items', {
        method: 'POST',
        body: formdata,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      setIsCreateModalOpen(false);
      setCreateForm({
        title: "",
        description: "",
        price: "",
        category: "",
        images: []
      });
      queryClient.invalidateQueries('listings');
    } catch (error) {
      console.error('Error creating listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditListing = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!selectedListing || !selectedListing._id) {
      console.error('No listing selected for editing');
      return;
    }
    try {
      const formdata = new FormData();
      formdata.append('title', editForm.title);
      formdata.append('description', editForm.description);
      formdata.append('price', editForm.price);
      formdata.append('category', editForm.category);
      formdata.append('collegeId', userCollege);
      formdata.append('existingImages', JSON.stringify(existingImages));

      if (editForm.newImages && editForm.newImages.length > 0) {
        for (let i = 0; i < editForm.newImages.length; i++) {
          formdata.append('images', editForm.newImages[i]);
        }
      }

      const res = await fetch(`/api/items/${selectedListing._id}`, {
        method: 'PUT',
        body: formdata,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsEditModalOpen(false);
      setEditForm({
        title: '',
        description: '',
        price: '',
        category: '',
        newImages: [],
      });
      setExistingImages([]);
      setSelectedListing(null);
      queryClient.invalidateQueries('listings');
    } catch (error) {
      console.error('Error updating listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async () => {
    if (!selectedListing || !selectedListing._id) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/items/${selectedListing?._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsDeleteModalOpen(false);
        queryClient.invalidateQueries('listings');
      } else {
        console.error('Failed to delete the listing');
      }
    } catch (error) {
      console.error('Error deleting the listing:', error);
    } finally {
      setLoading(false);
    }
  };



  // const [listings] = useState([
  //   {
  //     id: 1,
  //     title: "Computer Science Textbook",
  //     description: "Used textbook in great condition, perfect for CS101",
  //     price: 45.00,
  //     category: "Books",
  //     condition: "Like New",
  //     image: "/api/placeholder/300/200",
  //     createdAt: "2024-03-15"
  //   },
  //   {
  //     id: 2,
  //     title: "Graphing Calculator",
  //     description: "TI-84 Plus, barely used, comes with case",
  //     price: 75.00,
  //     category: "Electronics",
  //     condition: "Good",
  //     image: "/api/placeholder/300/200",
  //     createdAt: "2024-03-14"
  //   }
  // ]);
  // e.preventDefault();
  // if (!selectedListing || !selectedListing._id) {
  //   console.error('No listing selected for editing');
  //   return;
  // }
  // console.log('editForm:', editForm);
  // console.log('selectedListing ID:', selectedListing._id);
  // try {
  //   const formdata = new FormData();
  //   formdata.append('title', editForm.title);
  //   formdata.append('description', editForm.description);
  //   formdata.append('price', editForm.price);
  //   formdata.append('category', editForm.category);
  //   formdata.append('collegeId', userCollege);
  //   if (editForm.images) {
  //     for (let i = 0; i < editForm.images.length; i++) {
  //       formdata.append('images', editForm.images[i]);
  //     }
  //   }
  //   console.log('FormData entries:');
  //   for (let pair of formdata.entries()) {
  //     console.log(pair[0], pair[1]);
  //   }
  //   const res = await fetch(`/api/items/${selectedListing._id}`, {
  //     method: 'PUT',
  //     body: formdata,
  //   });
  //   const data = await res.json();
  //   console.log(data);
  //   if (!res.ok) {
  //     throw new Error(data.error || 'Something went wrong');
  //   }
  //   setIsCreateModalOpen(false);
  //   setEditForm({});
  //   setSelectedListing(null);
  //   queryClient.invalidateQueries('listings');
  // } catch (error) {
  //   console.error('Error updating listing:', error);
  // }

  const handleCreate = () => {
    setCreateForm({
      title: "",
      description: "",
      price: "",
      category: "",
      images: []
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (listing) => {
    setSelectedListing(listing);
    setEditForm({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      category: listing.category,
      newImages: [],
    });
    setExistingImages(listing.images || []);
    setIsEditModalOpen(true);
  };

  const handleDelete = (listing) => {
    setSelectedListing(listing);
    setIsDeleteModalOpen(true);
  };

  const categories = ["Books", "Electronics", "Furniture", "Appliances", "Clothing", "Sports"];

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <div className="flex-1 overflow-auto lg:pl-64 mt-16">
        <div className="md:p-8 p-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Your Listings</h1>
              <p className="text-zinc-400">Manage your items for sale</p>
            </div>
            <button
              onClick={() => handleCreate()}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-black font-medium rounded-full transition-all shadow-lg shadow-green-900/20 active:scale-95 group"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>New Listing</span>
            </button>
          </div>

          {(!listings || listings.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 bg-[#111] rounded-3xl border border-white/5">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/5">
                <Package className="w-10 h-10 opacity-50" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No active listings</h3>
              <p>Start selling by creating your first listing!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <div key={listing._id || listing.id} className="group bg-[#111] rounded-2xl border border-white/5 overflow-hidden hover:border-green-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-green-900/10">
                  <div className="relative aspect-[4/3] bg-zinc-900">
                    <ImageSlider images={listing.images} />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                      {listing.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="text-lg font-semibold text-white truncate flex-1" title={listing.title}>{listing.title}</h3>
                      <span className="text-lg font-bold text-green-500 whitespace-nowrap">₹ {listing.price}</span>
                    </div>
                    <p className="text-sm text-zinc-400 mb-4 line-clamp-2 min-h-[2.5rem]">{listing.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-xs text-zinc-500">
                        {new Date(listing.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(listing)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(listing)}
                          className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div
            initial="hidden" animate="visible" exit="hidden" variants={overlayVariants}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-xl font-bold text-white">Create New Listing</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <form onSubmit={handleCreateListing} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">Title</label>
                    <input
                      type="text"
                      value={createForm.title || ""}
                      onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-zinc-600 transition-all"
                      placeholder="e.g., Engineering Mathematics Textbook"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-300">Price (₹)</label>
                      <input
                        type="number"
                        value={createForm.price || ""}
                        onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-zinc-600 transition-all"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-300">Category</label>
                      <select
                        value={createForm.category || ""}
                        onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white transition-all appearance-none"
                        required
                      >
                        <option value="" disabled className='bg-zinc-900'>Select Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category} className='bg-zinc-900'>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">Description</label>
                    <textarea
                      value={createForm.description || ""}
                      onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-zinc-600 resize-none transition-all"
                      placeholder="Describe the condition, features, etc..."
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">Images</label>
                    <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-green-500/30 transition-colors bg-white/[0.02]">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setCreateForm({
                            ...createForm,
                            images: [...createForm.images, ...files],
                          });
                        }}
                        className="hidden"
                        id="createImages"
                      />
                      <label htmlFor="createImages" className="cursor-pointer flex flex-col items-center gap-2">
                        <div className="p-3 bg-zinc-900 rounded-full">
                          <Upload className="w-6 h-6 text-green-500" />
                        </div>
                        <p className="text-sm text-zinc-400 font-medium">Click to upload or drag & drop</p>
                        <p className="text-xs text-zinc-600">JPG, PNG up to 5MB</p>
                      </label>
                    </div>

                    {createForm.images && createForm.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {Array.from(createForm.images).map((file, index) => (
                          <div key={index} className="relative aspect-square border border-white/10 rounded-lg overflow-hidden group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                              onClick={() => {
                                const updatedImages = Array.from(createForm.images).filter((_, i) => i !== index);
                                setCreateForm({ ...createForm, images: updatedImages });
                              }}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20"
                    >
                      {loading ? 'Creating...' : 'Create Listing'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial="hidden" animate="visible" exit="hidden" variants={overlayVariants}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-xl font-bold text-white">Edit Listing</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <form onSubmit={handleEditListing} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-zinc-600 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-300">Price (₹)</label>
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-zinc-600 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-300">Category</label>
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white transition-all appearance-none"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category} className='bg-zinc-900'>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-zinc-900/50 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-zinc-600 resize-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-300">Images</label>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div className="mb-3 grid grid-cols-4 gap-2">
                        {existingImages.map((url, index) => (
                          <div key={`exist-${index}`} className="relative aspect-square border border-white/10 rounded-lg overflow-hidden group">
                            <img src={url} alt={`Existing ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                              onClick={() => {
                                const updatedImages = existingImages.filter((_, i) => i !== index);
                                setExistingImages(updatedImages);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-green-500/30 transition-colors bg-white/[0.02] flex flex-col items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          setEditForm({
                            ...editForm,
                            newImages: [...editForm.newImages, ...files],
                          });
                        }}
                        className="hidden"
                        id="editImages"
                      />
                      <label htmlFor="editImages" className="cursor-pointer flex items-center gap-2 text-zinc-400 hover:text-green-500 transition-colors">
                        <Plus className="w-5 h-5" />
                        <span className="text-sm font-medium">Add more images</span>
                      </label>
                    </div>

                    {/* New Images Preview */}
                    {editForm.newImages.length > 0 && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {editForm.newImages.map((file, index) => (
                          <div key={`new-${index}`} className="relative aspect-square border border-white/10 rounded-lg overflow-hidden group">
                            <img src={URL.createObjectURL(file)} alt={`New Preview ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md"
                              onClick={() => {
                                const updatedNewImages = editForm.newImages.filter((_, i) => i !== index);
                                setEditForm({ ...editForm, newImages: updatedNewImages });
                              }}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-900/20"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial="hidden" animate="visible" exit="hidden" variants={overlayVariants}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              variants={modalVariants}
              className="bg-[#111] border border-white/10 rounded-2xl max-w-sm w-full p-6 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Delete Listing</h2>
                <p className="text-zinc-400 text-sm">
                  Are you sure you want to delete <span className="text-white font-medium">"{selectedListing?.title}"</span>? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:bg-white/5 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={handleDeleteListing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors shadow-lg shadow-red-900/20"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
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
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
        <Package className="w-10 h-10 text-zinc-700" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-100 mix-blend-difference">
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

export default UserListingsPage;