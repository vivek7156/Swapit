import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CheckCircle2, X } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
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
      setNotifications(notifications.filter(notification => notification._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const promises = notifications
        .filter(n => !n.isRead)
        .map(n => axios.patch(`/api/notifications/${n._id}/read`));

      await Promise.all(promises);

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
      setNotifications([]);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] lg:pl-64 pt-20">
      <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
            <p className="text-zinc-400">Manage your alerts and updates.</p>
          </div>

          {notifications.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 rounded-xl transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 text-sm bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 rounded-xl transition-all flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear all</span>
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-24 bg-[#111] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 bg-[#111] rounded-3xl border border-white/5">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/5">
              <Bell className="w-10 h-10 opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
            <p>You're all caught up! Check back later.</p>
          </div>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence mode='popLayout'>
              {notifications.map((notification) => (
                <motion.div
                  key={notification._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group relative p-5 rounded-2xl border transition-all duration-300 ${notification.isRead
                      ? 'bg-[#0a0a0a] border-white/5 hover:border-white/10'
                      : 'bg-[#111] border-green-500/20 shadow-lg shadow-green-900/5'
                    }`}
                >
                  <div className="flex gap-4">
                    <div className={`mt-1 p-2 rounded-full flex-shrink-0 ${notification.isRead ? 'bg-zinc-900 text-zinc-500' : 'bg-green-500/10 text-green-500'
                      }`}>
                      <Bell className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <p className={`text-sm md:text-base leading-relaxed ${notification.isRead ? 'text-zinc-400' : 'text-gray-100 font-medium'
                          }`}>
                          {notification.content}
                        </p>
                        <span className="text-xs text-zinc-500 whitespace-nowrap mt-1">
                          {new Date(notification.createdAt).toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.isRead && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification._id); }}
                        className="p-1.5 bg-zinc-800 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-white/5"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(notification._id); }}
                      className="p-1.5 bg-zinc-800 text-zinc-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-white/5"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {!notification.isRead && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-green-500 rounded-r-full" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;