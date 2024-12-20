import React, { useState } from 'react';
import { 
  User, Bell, Lock, CreditCard, Mail, Globe, 
  Smartphone, Shield, LogOut, Trash2, Moon, Sun
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const SettingsPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [selectedButton, setSelectedButton] = useState("Settings");
  
    const toggleSidebar = () => {
      setSidebarOpen(!isSidebarOpen);
    };
  
    const handleButtonClick = (buttonText) => {
      setSelectedButton(buttonText);
    };
  const [settings, setSettings] = useState({
    // Profile Settings
    emailNotifications: true,
    pushNotifications: false,
    marketingEmails: false,
    // Privacy Settings
    profileVisibility: 'public',
    showActivity: true,
    showLocation: false,
    // Account Settings
    darkMode: false,
    twoFactorAuth: true,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className='pl-[8.5px] bg-zinc-900'><Navbar toggleSidebar={toggleSidebar} />
    <div className="max-w-6xl mx-auto p-6">
              
           {/* Sidebar Component */}
    <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}
      />
      <div className="space-y-8 lg:pl-64 mt-16">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-300 mt-2">Manage your account settings and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your profile information and how others see you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-300">Profile Picture</p>
                  <p className="text-sm text-gray-400">Update your profile photo</p>
                </div>
                <Button variant="outline">Change</Button>
              </div>
              <Separator />
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-300">Display Name</label>
                <Input placeholder="Your display name" className="text-gray-400" defaultValue="John Doe" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-300">Bio</label>
                <Input placeholder="Tell us about yourself" className="text-gray-400" defaultValue="Full-stack developer" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-300">Website</label>
                <Input placeholder="Your website URL" className="text-gray-400" defaultValue="https://example.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-300">Email Notifications</p>
                <p className="text-sm text-gray-400">Receive notifications via email</p>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-300">Push Notifications</p>
                <p className="text-sm text-gray-400">Receive push notifications</p>
              </div>
              <Switch 
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle('pushNotifications')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-300">Marketing Emails</p>
                <p className="text-sm text-gray-400">Receive marketing emails</p>
              </div>
              <Switch 
                checked={settings.marketingEmails}
                onCheckedChange={() => handleToggle('marketingEmails')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>
              Control your privacy and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-300">Profile Visibility</p>
                <p className="text-sm text-gray-400">Who can see your profile</p>
              </div>
              <select className="select select-bordered w-28 bg-zinc-800 text-white border-none ">
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="friends">Friends</option>
              </select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-300">Show Activity Status</p>
                <p className="text-sm text-gray-400">Let others see when you're active</p>
              </div>
              <Switch 
                checked={settings.showActivity}
                onCheckedChange={() => handleToggle('showActivity')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-300">Show Location</p>
                <p className="text-sm text-gray-400">Show your location on your profile</p>
              </div>
              <Switch 
                checked={settings.showLocation}
                onCheckedChange={() => handleToggle('showLocation')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Account Settings
            </CardTitle>
            <CardDescription>
              Manage your account preferences and security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-300">Dark Mode</p>
                <p className="text-sm text-gray-400">Toggle dark mode theme</p>
              </div>
              <Switch 
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle('darkMode')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-300">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <Switch 
                checked={settings.twoFactorAuth}
                onCheckedChange={() => handleToggle('twoFactorAuth')}
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Change Password
              </Button>
              <Button variant="outline" className="w-full flex items-center gap-2 text-orange-600 hover:text-orange-700">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
              <Button variant="outline" className="w-full flex items-center gap-2 text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Changes */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" className="bg-zinc-700 border-none">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SettingsPage;