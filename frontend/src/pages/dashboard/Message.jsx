import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ArrowUp, ArrowLeft, Send, Check, X, Star } from 'lucide-react';
import socket from '../../socket';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const MessagingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeChat, setActiveChat] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [activeTab, setActiveTab] = useState('sent');
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [messageRequests, setMessageRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const messagesEndRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef(null);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const [authUserId] = useState(() => localStorage.getItem('authUserId') || null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = (e) => {
    setShowScrollButton(e.target.scrollTop > 300);
  };

  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data: receivedData } = await axios.get('/api/chat/received');
        setMessageRequests(receivedData);
        if (receivedData.length > 0 && !id) {
          // Optional: Auto-select first if needed, but maybe better to wait for user interaction
        }

        const { data: sentData } = await axios.get('/api/chat/sent');
        setSentRequests(sentData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [id]);

  const handleRequestClick = async (conversationId) => {
    if (!conversationId) return;
    setSelectedConversationId(conversationId);

    try {
      const response = await axios.get(`/api/chat/conversations/${conversationId}`, { withCredentials: true });
      if (response.data.success && response.data.conversation) {
        setActiveChat(response.data.conversation);
        setMessages(response.data.conversation.messages || []);
        setParticipants(response.data.conversation.participants || []);
        socket.emit('joinChat', { conversationId: response.data.conversation._id });

        // Check if user has already rated this seller for this item
        const seller = response.data.conversation.participants.find(p => p.role === "seller");
        if (seller && response.data.conversation.itemId) {
          try {
            const { data } = await axios.get('/api/chat/check-rating', {
              params: {
                sellerId: seller._id._id,
                itemId: response.data.conversation.itemId._id
              }
            });

            if (data.hasRated) {
              setHasRated(true);
              setRating(data.rating);
            } else {
              setHasRated(false);
              setRating(0);
            }
          } catch (error) {
            console.error('Error checking rating:', error);
            // Default to not rated if check fails
            setHasRated(false);
            setRating(0);
          }
        } else {
          setRating(0);
          setHasRated(false);
        }
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  useEffect(() => {
    if (!activeChat) return;

    const handleReceiveMessage = (message) => {
      if (!message) return;

      const formattedMessage = {
        _id: message._id || Date.now(),
        content: message.content,
        senderId: typeof message.senderId === 'object' ? message.senderId._id : message.senderId,
        createdAt: message.createdAt || new Date(),
        type: message.type || 'text'
      };

      setMessages(prev => [...prev, formattedMessage]);
    };

    socket.on('receiveMessage', handleReceiveMessage);
    return () => socket.off('receiveMessage', handleReceiveMessage);
  }, [activeChat]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat?._id) return;

    const newMessage = {
      textMessage: messageInput,
      senderId: authUserId,
      conversationId: activeChat._id,
    };

    try {
      const response = await axios.post(`/api/chat/send`, newMessage);
      if (response.status === 201) {
        socket.emit('sendMessage', {
          conversationId: activeChat._id,
          senderId: authUserId,
          content: messageInput,
        });
        setMessageInput('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!activeChat?._id) return;
    try {
      const response = await axios.post('/api/chat/Status', {
        conversationId: activeChat._id,
        status: newStatus
      });
      if (response.status === 200) {
        socket.emit('updateStatus', { roomId: activeChat._id, status: newStatus });
        setActiveChat(prev => ({ ...prev, status: newStatus }));
        // Optimistically add system message
        setMessages(prev => [...prev, {
          _id: Date.now(),
          type: 'status',
          content: newStatus,
          createdAt: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    if (!activeChat) return;
    const handleStatusUpdate = ({ status }) => {
      setActiveChat(prev => ({ ...prev, status }));
      setMessages(prev => [...prev, {
        _id: Date.now(),
        type: 'status',
        content: status,
        createdAt: new Date()
      }]);
    };
    socket.on('statusUpdated', handleStatusUpdate);
    return () => socket.off('statusUpdated', handleStatusUpdate);
  }, [activeChat]);

  const handleRateUser = async (stars) => {
    try {
      const seller = activeChat.participants.find(p => p.role === "seller");
      const response = await axios.post('/api/chat/rate', {
        sellerId: seller._id._id,
        itemId: activeChat.itemId._id,
        rating: stars
      }, { withCredentials: true });

      if (response.status === 200) {
        setRating(stars);
        setHasRated(true);
        socket.emit('sellerRated', { conversationId: activeChat._id, rating: stars });
      }
    } catch (error) {
      console.error('Error rating user:', error);
      if (error.response?.data?.alreadyRated) {
        // User has already rated, update the UI to reflect this
        setHasRated(true);
        alert('You have already rated this seller for this item.');
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  };

  const otherParticipant = participants.find(p => p._id._id !== authUserId)?._id;
  const isBuyer = activeChat?.participants.find(p => p._id._id === authUserId)?.role === 'buyer';
  const isSeller = activeChat?.participants.find(p => p._id._id === authUserId)?.role === 'seller';

  return (
    <div className="flex h-screen bg-[#0a0a0a] lg:pl-64 pt-20 overflow-hidden">
      {/* Messages List Sidebar */}
      <div className={`w-full md:w-80 lg:w-96 bg-[#111] border-r border-white/5 flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>

        {/* Header Tabs */}
        <div className="p-4 border-b border-white/5 bg-[#111]/95 backdrop-blur z-10">
          <h2 className="text-xl font-bold text-white mb-4 px-2">Messages</h2>
          <div className="flex p-1 bg-zinc-900 rounded-xl border border-white/5">
            {['received', 'sent'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${activeTab === tab
                    ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode='wait'>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="divide-y divide-white/5"
            >
              {(activeTab === 'received' ? messageRequests : sentRequests).map((request) => (
                <div
                  key={request._id}
                  onClick={() => handleRequestClick(request.conversationId || request._id)}
                  className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${selectedConversationId === (request.conversationId || request._id) ? 'bg-white/5' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={request.avatar || "/default-avatar.png"}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-medium text-white truncate">{request.user || "Unknown"}</h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase tracking-wider font-bold ${request.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                            request.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-zinc-500/20 text-zinc-400'
                          }`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-xs text-green-500 font-medium mb-1 truncate">{request.itemTitle}</p>
                      <p className="text-sm text-zinc-500 truncate">{request.message || "Start the conversation..."}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(activeTab === 'received' ? messageRequests : sentRequests).length === 0 && (
                <div className="p-8 text-center text-zinc-500">
                  No {activeTab} messages yet.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col bg-[#0a0a0a] relative ${activeChat ? 'flex' : 'hidden md:flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/5">
              <MessageSquare className="w-8 h-8 opacity-50" />
            </div>
            <p>Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="h-20 border-b border-white/5 bg-[#111]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <button onClick={() => { setActiveChat(null); setSelectedConversationId(null); }} className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <img
                    src={otherParticipant?.profileImage || "/default-avatar.png"}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <Link to={`/profile/${otherParticipant?.username}`} className="font-semibold text-white hover:underline decoration-green-500 underline-offset-4">
                      {otherParticipant?.username || "Unknown User"}
                    </Link>
                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                      {activeChat.itemId?.title && (
                        <span className="text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded-full">
                          For: {activeChat.itemId.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-4">
                {/* Item Preview */}
                {activeChat.itemId?.images?.[0] && (
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 hidden sm:block">
                    <img src={activeChat.itemId.images[0]} alt="Item" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Status Actions */}
                {isSeller && activeChat.status === 'pending' && (
                  <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-white/5">
                    <button onClick={() => handleStatusChange('rejected')} className="p-2 hover:bg-red-500/20 text-red-500 rounded-md transition-colors" title="Reject">
                      <X className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-white/10 mx-1"></div>
                    <button onClick={() => handleStatusChange('accepted')} className="p-2 hover:bg-green-500/20 text-green-500 rounded-md transition-colors" title="Accept">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Status Banner */}
            {activeChat.status !== 'pending' && (
              <div className={`text-xs text-center py-1 font-medium tracking-wide uppercase ${activeChat.status === 'accepted' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                This request has been {activeChat.status}
              </div>
            )}

            {/* Messages */}
            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-[#0a0a0a]"
            >
              {messages.map((message, idx) => (
                <motion.div
                  key={message._id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.content === 'accepted' || message.content === 'rejected' ? 'justify-center' : message.senderId === authUserId ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'status' || message.content === 'accepted' || message.content === 'rejected' ? (
                    <span className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/5">
                      Status updated to {message.content}
                    </span>
                  ) : (
                    <div className={`max-w-[75%] md:max-w-[60%] space-y-1 ${message.senderId === authUserId ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${message.senderId === authUserId
                          ? 'bg-green-600 text-white rounded-tr-none shadow-lg shadow-green-900/20'
                          : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-white/5'
                        }`}>
                        {message.content}
                      </div>
                      <span className="text-[10px] text-zinc-600 px-1">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Rating Prompt for Buyer */}
              {activeChat.status === 'accepted' && isBuyer && !hasRated && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center my-6">
                  <div className="bg-[#111] border border-white/10 p-6 rounded-2xl text-center space-y-3 shadow-xl">
                    <p className="text-zinc-300 font-medium">Rate your experience</p>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRateUser(star)}
                          className={`transition-transform hover:scale-110 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}`}
                        >
                          <Star className={`w-8 h-8 ${rating >= star ? 'fill-yellow-400 text-yellow-500' : 'stroke-current'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Scroll to Bottom Button */}
            <AnimatePresence>
              {showScrollButton && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={scrollToTop}
                  className="absolute bottom-24 right-8 p-3 bg-zinc-800/80 text-white rounded-full shadow-lg backdrop-blur hover:bg-zinc-700 transition-colors z-10 border border-white/10"
                >
                  <ArrowUp className="w-5 h-5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="p-4 bg-[#0a0a0a] border-t border-white/5 pb-8 sm:pb-8">
              <div className="max-w-4xl mx-auto relative flex items-center gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-zinc-900/50 text-white placeholder-zinc-500 border border-white/10 rounded-full px-6 py-3.5 focus:outline-none focus:ring-1 focus:ring-green-500/50 focus:border-green-500/50 transition-all hover:bg-zinc-900"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-3.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:hover:bg-green-500 text-black rounded-full transition-all shadow-lg shadow-green-900/20 active:scale-95"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
