import React, { useState } from 'react';
import { Settings, Link2, CheckCircle, Mail, GraduationCap, User, Heart, MessageCircle, Share2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const UserProfile = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState("Your profile");
  
    const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
    };
  // Sample initial user data
  const [user, setUser] = useState({
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    college: "Example University",
    verified: true,
    bio: "Full-stack developer | Tech enthusiast",
    link: "https://example.com",
    profileImage: "/api/placeholder/200/200",
    isAdmin: false,
    listings: [
      {
        id: 1,
        title: "MacBook Pro 2021",
        price: 1299,
        description: "Excellent condition, barely used",
        image: "/api/placeholder/300/200",
        likes: 24,
        comments: 8,
        createdAt: "2 days ago"
      },
      {
        id: 2,
        title: "iPhone 13 Pro",
        price: 899,
        description: "Like new, includes original box and accessories",
        image: "/api/placeholder/300/200",
        likes: 15,
        comments: 5,
        createdAt: "5 days ago"
      },
      {
        id: 3,
        title: "iPad Air 2022",
        price: 549,
        description: "Perfect condition with Apple Pencil",
        image: "/api/placeholder/300/200",
        likes: 32,
        comments: 12,
        createdAt: "1 week ago"
      }
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="min-h-screen bg-zinc-900 max-w-9xl mx-auto py-6 px-3 pt-16 lg:pl-72">
           {/* Sidebar Component */}
    <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
      />
      <div className="bg-zinc-900 rounded-lg shadow-lg py-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <img
              src={user.profileImage}
              alt={user.name}
              className="lg:w-32 lg:h-32 w-28 h-24 rounded-full object-cover bg-white"
            />
            <div>
              <div className="flex items-start gap-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.verified && (
                  <Badge variant="" className={"mr-4 mt-2"}>
                    <CheckCircle size={14} className="mr-1" /> Verified
                  </Badge>
                )}
                {user.isAdmin && (
                  <Badge variant="destructive">Admin</Badge>
                )}
              </div>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-gray-800">
                <Settings className="w-4 h-4 text-gray-900" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 p-6">
                <div className="grid gap-2">
                  <label className="text-sm">Name</label>
                  <Input
                    name="name"
                    value={editedUser.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">Username</label>
                  <Input
                    name="username"
                    value={editedUser.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">College</label>
                  <Input
                    name="college"
                    value={editedUser.college}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">Bio</label>
                  <Textarea
                    name="bio"
                    value={editedUser.bio}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm">Website</label>
                  <Input
                    name="link"
                    value={editedUser.link}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-8">
          <p className="text-gray-700">{user.bio}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap className="w-4 h-4" />
              {user.college}
            </div>
            {user.link && (
              <div className="flex items-center gap-2 text-blue-600">
                <Link2 className="w-4 h-4" />
                <a href={user.link} target="_blank" rel="noopener noreferrer">
                  {user.link}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {user.listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <img 
                src={listing.image} 
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      ${listing.price.toLocaleString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-600 mb-4">{listing.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="px-2">
                      <Heart className="w-4 h-4 mr-1" />
                      {listing.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="px-2">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {listing.comments}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="px-2">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Posted {listing.createdAt}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
    </div>
    </div>
    </div>
  );
};

export default UserProfile;