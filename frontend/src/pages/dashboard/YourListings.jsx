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
  Package
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useQuery, useQueryClient } from '@tanstack/react-query';



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

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState("Your Listings");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

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

  const userId = user?._id; // Use the fetched user ID to fetch listings
  const userCollege = user?.college;
  const { data: listings } = useQuery({
    queryKey: ['listings', userId], // Include userId in the query key for cache invalidation
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
    enabled: !!userId, // Ensure query runs only if userId is available
  });

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('createForm:', createForm);
    console.log('userCollege:', userCollege);
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
      console.log('FormData entries:');
      for (let pair of formdata.entries()) {
        console.log(pair[0], pair[1]);
      }
      const res = await fetch('/api/items', {
        method: 'POST',
        body: formdata,
      });
      const data = await res.json();
      console.log(data);
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
    console.log('handleEditListing triggered');
    if (!selectedListing || !selectedListing._id) {
      console.error('No listing selected for editing');
      return;
    }
    console.log('editForm:', editForm);
    console.log('selectedListing ID:', selectedListing._id);
    try {
      const formdata = new FormData();
      formdata.append('title', editForm.title);
      formdata.append('description', editForm.description);
      formdata.append('price', editForm.price);
      formdata.append('category', editForm.category);
      formdata.append('collegeId', userCollege);
      // Append existing images
      formdata.append('existingImages', JSON.stringify(existingImages));

      if (editForm.newImages && editForm.newImages.length > 0) {
        for (let i = 0; i < editForm.newImages.length; i++) {
          formdata.append('images', editForm.newImages[i]);
        }
      }
      for (let pair of formdata.entries()) {
        console.log(pair[0], pair[1]);
      }
      const res = await fetch(`/api/items/${selectedListing._id}`, {
        method: 'PUT',
        body: formdata,
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      console.log('Edit successful', data);

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
      console.error('No listing selected for deletion');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/items/${selectedListing?._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsDeleteModalOpen(false); // Close the modal
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
    console.log('Editing listing:', listing);
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

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      {/* Sidebar */}
      <Navbar toggleSidebar={toggleSidebar} />
      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto lg:pl-64 mt-16">
        <div className="md:p-8 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-200">Your Listed items</h1>
            <button onClick={() => handleCreate()} className="flex items-center md:space-x-2 px-2 md:px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600 transition-colors">
              <Plus className="w-5 h-5" />
              <span>New Listing</span>
            </button>
          </div>
          {(!listings || listings.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Package className="w-12 h-12 mb-4" />
                <p>No Listings</p>
              </div>
          ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing._id || listing.id} className="bg-zinc-800 rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                  <ImageSlider images={listing.images} />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-gray-100">{listing.title}</h3>
                    <span className="text-lg font-bold text-green-600">Rs.{listing.price}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{listing.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-gray-200 text-sm rounded-full text-gray-800">
                      {listing.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">
                      Posted on {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(listing)}
                        className="p-2 text-gray-600 hover:bg-gray-900 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(listing)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>)}
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center p-4 z-20">
          <div className="bg-zinc-900 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Create Listing</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <form
                onSubmit={handleCreateListing}
                className="space-y-4"
              >
                <div>
                  <label htmlFor='Title' className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={createForm.title || ""}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-zinc-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={createForm.description || ""}
                    onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                    rows={3}
                    className="resize-none w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-zinc-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price (Rupees)</label>
                  <input
                    type="number"
                    value={createForm.price || ""}
                    onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-zinc-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={createForm.category || ""}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-zinc-800"
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files); // Convert FileList to Array
                        setCreateForm({
                          ...createForm,
                          images: [...createForm.images, ...files],
                        });
                      }}
                      className="hidden"
                      id="images"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    </label>
                  </div>

                  {/* Image Preview Section */}
                  {createForm.images && createForm.images.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <div className="flex space-x-2">
                        {Array.from(createForm.images).map((file, index) => (
                          <div key={index} className="relative w-24 h-24 border rounded overflow-hidden flex-shrink-0">
                            <img
                              src={URL.createObjectURL(file)} // Create temporary URL for preview
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-600 p-1 text-white rounded-lg"
                              onClick={() => {
                                // Remove selected image
                                const updatedImages = Array.from(createForm.images).filter((_, i) => i !== index);
                                setCreateForm({ ...createForm, images: updatedImages });
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
                <div className="flex justify-end space-x-3 p-4 border-t">
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-950 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg transition-colors ${loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                  >
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}


      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-zinc-900 bg-opacity-50 flex items-center justify-center p-4 z-20">
          <div className="bg-zinc-900 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Edit Listing</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Make the content area scrollable with a max height */}
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleEditListing} className="space-y-4">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="resize-none w-full px-3 py-2 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                {/* Price Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Price (Rupees)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                {/* Category Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                {/* Images Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Images</label>
                  {/* Existing Images Preview Section */}
                  {existingImages.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <div className="flex space-x-2">
                        {existingImages.map((url, index) => (
                          <div key={index} className="relative w-24 h-24 border rounded overflow-hidden flex-shrink-0">
                            <img src={url} alt={`Existing Image ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-600 p-1 text-white rounded-lg"
                              onClick={() => {
                                const updatedImages = existingImages.filter((_, i) => i !== index);
                                setExistingImages(updatedImages);
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* New Images Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-4">
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
                      id="newImages"
                    />
                    <label htmlFor="newImages" className="cursor-pointer">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    </label>
                  </div>
                  {/* New Images Preview Section */}
                  {editForm.newImages.length > 0 && (
                    <div className="mt-4 overflow-x-auto">
                      <div className="flex space-x-2">
                        {editForm.newImages.map((file, index) => (
                          <div key={index} className="relative w-24 h-24 border rounded overflow-hidden flex-shrink-0">
                            <img src={URL.createObjectURL(file)} alt={`New Preview ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              className="absolute top-1 right-1 bg-red-600 p-1 text-white rounded-lg"
                              onClick={() => {
                                const updatedNewImages = editForm.newImages.filter((_, i) => i !== index);
                                setEditForm({ ...editForm, newImages: updatedNewImages });
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 p-4 border-t">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-950 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg transition-colors ${loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-lg max-w-sm w-full p-4">
            <h2 className="text-lg font-semibold mb-2">Delete Listing</h2>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete "{selectedListing?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-950 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleDeleteListing}
                className={`px-4 py-2 rounded-lg transition-colors ${loading ? 'bg-red-800' : "bg-red-600 text-white  hover:bg-red-700"}`}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
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
          className="w-full h-60 xl:h-80 object-cover rounded-t-lg"
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
      <div className="w-full h-60 xl:h-80 bg-zinc-800 rounded-t-lg flex items-center justify-center">
        <Package className="w-10 h-10 text-zinc-600" />
      </div>
    )}
  </div>
  );
};
export default UserListingsPage;