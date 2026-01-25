import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Mail, Heart, UserPlus, MessageSquare, Package } from 'lucide-react';
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import axios from 'axios';

const NotificationsPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState("Notifications");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     type: 'message',
  //     title: 'New Message',
  //     description: 'John Doe sent you a message about your listing',
  //     time: '2 minutes ago',
  //     read: false,
  //     icon: MessageSquare
  //   },
  //   {
  //     id: 2,
  //     type: 'like',
  //     title: 'New Like',
  //     description: 'Sarah liked your MacBook Pro listing',
  //     time: '1 hour ago',
  //     read: false,
  //     icon: Heart
  //   },
  //   {
  //     id: 3,
  //     type: 'follow',
  //     title: 'New Follower',
  //     description: 'Mike started following you',
  //     time: '2 hours ago',
  //     read: true,
  //     icon: UserPlus
  //   },
  //   {
  //     id: 4,
  //     type: 'order',
  //     title: 'Order Update',
  //     description: 'Your order #1234 has been shipped',
  //     time: '1 day ago',
  //     read: false,
  //     icon: Package
  //   },
  //   {
  //     id: 5,
  //     type: 'system',
  //     title: 'System Update',
  //     description: 'We\'ve updated our privacy policy',
  //     time: '2 days ago',
  //     read: true,
  //     icon: Bell
  //   }
  // ]);
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      console.log('Notifications:', response.data);
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const getUnreadCount = () => notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      // Update local state
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      // Update local state
      setNotifications(notifications.filter(notification => notification._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all as read in the backend
      const promises = notifications
        .filter(n => !n.isRead)
        .map(n => axios.patch(`/api/notifications/${n._id}/read`));
      
      await Promise.all(promises);
      
      // Update local state
      setNotifications(notifications.map(notification => ({ 
        ...notification, 
        isRead: true 
      })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete('/api/notifications');
      // Clear local state
      setNotifications([]);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-900 lg:pl-64 pt-16">
      <div className="flex-1 bg-zinc-900 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-white">Notifications</h1>
            <div className="flex space-x-2">
              <Button onClick={handleMarkAllAsRead} className="mr-2 hover:bg-zinc-700">
                Mark all as read
              </Button>
              <Button onClick={handleDeleteAll} className="hover:bg-red-700">
                Delete all
              </Button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Bell className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-400">No notifications yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card 
                  key={notification._id}
                  className={`transition-colors top-2 ${notification.isRead ? 'opacity-60' : ''}`}
                >
                  <CardContent className="flex items-start justify-between">
                    <div className="flex items-end space-x-4 space-y-2">
                      <div className="p-2 bg-zinc-800 rounded-lg">
                        <Bell className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-200">{notification.content}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-end space-y-4">
                      {!notification.isRead && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification._id)}
                        >
                          <Check className="w-4 h-4 text-white" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(notification._id)}
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;