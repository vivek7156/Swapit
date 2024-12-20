import React, { useState } from 'react';
import { Bell, Check, Trash2, Mail, Heart, UserPlus, MessageSquare, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

const NotificationsPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState("Notifications");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      title: 'New Message',
      description: 'John Doe sent you a message about your listing',
      time: '2 minutes ago',
      read: false,
      icon: MessageSquare
    },
    {
      id: 2,
      type: 'like',
      title: 'New Like',
      description: 'Sarah liked your MacBook Pro listing',
      time: '1 hour ago',
      read: false,
      icon: Heart
    },
    {
      id: 3,
      type: 'follow',
      title: 'New Follower',
      description: 'Mike started following you',
      time: '2 hours ago',
      read: true,
      icon: UserPlus
    },
    {
      id: 4,
      type: 'order',
      title: 'Order Update',
      description: 'Your order #1234 has been shipped',
      time: '1 day ago',
      read: false,
      icon: Package
    },
    {
      id: 5,
      type: 'system',
      title: 'System Update',
      description: 'We\'ve updated our privacy policy',
      time: '2 days ago',
      read: true,
      icon: Bell
    }
  ]);

  const getUnreadCount = () => notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  return (
    <div className='bg-zinc-900'>
            <Navbar toggleSidebar={toggleSidebar} 
        selectedButton={selectedButton}
        setSelectedButton={setSelectedButton}/>

            <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    <div className="max-w-7xl mx-auto p-6 bg-zinc-800 rounded-xl min-h-screen lg:ml-72">
      
      <div className="space-y-6 mt-16">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="md:text-3xl sm:text-2xl font-bold flex items-center gap-2">
              <Bell className="w-8 h-8" />
              Notifications
              {getUnreadCount() > 0 && (
                <Badge variant="destructive" className="ml-2 max-sm:hidden">
                  {getUnreadCount()} new
                </Badge>
              )}
            </h1>
            <p className="text-gray-400 mt-2 max-sm:hidden">Stay updated with your latest activities</p>
          </div>
          
          <div className="flex gap-2">
            {getUnreadCount() > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead} className="text-gray-100 border-gray-600 bg-gray-800">
                <Check className="w-4 h-4 mr-2 max-sm:mr-0" />
                <div className='max-sm:hidden'>Mark all as read</div>
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="destructive" onClick={handleDeleteAll}>
                <Trash2 className="w-4 h-4 mr-2 max-sm:mr-0" />
                <div className='max-sm:hidden'>Delete all</div>
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Bell className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-300">No notifications</h3>
              <p className="text-gray-400">You're all caught up!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const IconComponent = notification.icon;
              return (
                <Card 
                  key={notification.id}
                  className={`transition-colors ${notification.read ? 'bg-gray-400' : 'bg-gray-200'}`}
                >
                  <CardContent className="flex items-start justify-between p-4">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {notification.title}
                          {!notification.read && (
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{notification.description}</p>
                        <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div></div>
  );
};

export default NotificationsPage;