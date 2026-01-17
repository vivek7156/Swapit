import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ArrowUp, ArrowLeft, Send, Image, Paperclip } from 'lucide-react';
import socket from '../../socket';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

const MessagingPage = ({ }) => {
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
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const [authUserId, setAuthUserId] = useState(() => {
    return localStorage.getItem('authUserId') || null;
  });

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

  const StatusMessage = ({ status }) => (
    <div className="flex justify-center my-4">
      <span className={`px-4 py-2 rounded-full text-sm ${status === 'accepted' ? 'bg-green-500/20 text-green-500' :
        status === 'rejected' ? 'bg-red-500/20 text-red-500' :
          'bg-gray-500/20 text-gray-500'
        }`}>
        Sorry! Your Request was {status} by the seller.
      </span>
    </div>
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data: receivedData } = await axios.get('/api/chat/received');
        setMessageRequests(receivedData);
        if (receivedData.length > 0) {
          setSelectedConversationId(receivedData[0].conversationId);
        }
        else {
          setSelectedConversationId(null);
        }
        console.log('Received Requests:', receivedData);

        const { data: sentData } = await axios.get('/api/chat/sent');
        setSentRequests(sentData);
        if (sentData.length > 0) {
          setSelectedConversationId(sentData[0].conversationId);
        }
        else {
          setSelectedConversationId(null);
        }
        console.log('Sent Requests:', sentData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleRequestClick = async (conversationId) => {
    if (!conversationId) {
      console.error('No conversation ID provided');
      return;
    }

    try {
      console.log('Fetching conversation:', conversationId);

      const response = await axios.get(`/api/chat/conversations/${conversationId}`, {
        withCredentials: true
      });
      console.log('Conversation:', response.data);

      if (response.data.success && response.data.conversation) {
        setActiveChat(response.data.conversation);
        setMessages(response.data.conversation.messages || []);
        setParticipants(response.data.conversation.participants || []);


        socket.emit('joinChat', { conversationId: response.data.conversation._id });

        scrollToBottom();
      } else {
        console.error('Invalid conversation data received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching conversation:', error.response?.data || error);
    }
  };

  useEffect(() => {
    if (!activeChat) return;

    const handleReceiveMessage = (message) => {
      console.log('Received message:', message);

      if (!message) {
        console.error('no message');
        return;
      }
      // Format message with role and sender info
      const formattedMessage = {
        _id: message._id || Date.now(),
        content: message.content,
        senderId: typeof message.senderId === 'object' ? message.senderId._id : message.senderId,
        createdAt: message.createdAt || new Date(),
        isSender: (typeof message.senderId === 'object' ?
          message.senderId._id === authUserId :
          message.senderId === authUserId
        )
      };

      setMessages(prevMessages => [...prevMessages, formattedMessage]);
      scrollToBottom();
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [activeChat, authUserId]);


  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat?._id) return;

    const participantIds = activeChat.participants.map(participant => participant._id.toString());

    // Ensure there are exactly two participants
    if (participantIds.length !== 2) {
      console.error('Invalid number of participants:', participantIds);
      return;
    }

    const [buyerId, sellerId] = participantIds;

    const newMessage = {
      textMessage: messageInput,
      senderId: authUserId,
      conversationId: activeChat._id,
    };

    try {
      const response = await axios.post(`/api/chat/send`, newMessage);
      if (response.status === 201) {
        // Optionally, you can optimistically add the message
        socket.emit('sendMessage', {
          conversationId: activeChat._id,
          senderId: authUserId,
          content: messageInput,
        });
        setMessageInput('');
      } else {
        console.error('Error sending message:', response);
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
        socket.emit('updateStatus', {
          roomId: activeChat._id,
          status: newStatus
        });

        const statusMessage = {
          _id: Date.now(),
          type: 'status',
          content: newStatus,
          createdAt: new Date()
        };
        setMessages(prev => [...prev, statusMessage]);

        // Update local state
        setActiveChat(prev => ({
          ...prev,
          status: newStatus
        }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    if (!activeChat) return;

    const handleStatusUpdate = ({ status }) => {
      setActiveChat(prev => ({
        ...prev,
        status
      }));

      const statusMessage = {
        _id: Date.now(),
        type: 'status',
        content: status,
        createdAt: new Date()
      };
      setMessages(prev => [...prev, statusMessage]);
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
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setRating(stars);
        setHasRated(true);

        socket.emit('sellerRated', {
          conversationId: activeChat._id,
          rating: stars
        });
      }
    } catch (error) {
      console.error('Error rating user:', error);
    }
  };

  return (
    <div className="flex h-screen lg:pl-64 pt-16">
      {/* Left Panel */}
      <div className={`w-full md:w-80 bg-zinc-900 border-r border-gray-800 ${activeChat ? 'hidden md:block' : 'block'
        }`}>
        {/* Header with Tabs */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'received' ? 'bg-green-500 text-white' : 'bg-zinc-800 text-gray-400'
                }`}
            >
              Received
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors ${activeTab === 'sent' ? 'bg-green-500 text-white' : 'bg-zinc-800 text-gray-400'
                }`}
            >
              Sent
            </button>
          </div>
        </div>

        {/* Message Requests */}
        <div className="overflow-y-auto h-[calc(100vh-12rem)]">
          {(activeTab === 'received' ? messageRequests : sentRequests).map((request) => (
            <div
              key={request._id}
              onClick={() => handleRequestClick(request._id)}
              className="cursor-pointer p-4 hover:bg-zinc-800 border-b border-gray-800"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={request.avatar || "/api/placeholder/40/40"}
                  alt={request.user || "User"}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-400">
                    {request.user || "Unknown User"}
                  </h4>
                  <p className="text-xs text-green-500">
                    Item: {request.itemTitle}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {request.message || "No messages yet"}
                  </p>
                </div>
                <div
                  className={`flex flex-col items-end p-1 rounded-lg ${request.status !== 'rejected' ? 'bg-green-700' : 'bg-red-700'
                    }`}
                >
                  <span className="text-sm">{request.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Chat Area */}
      <div className={`flex-1 flex flex-col bg-zinc-900 ${activeChat ? 'flex' : 'hidden sm:flex'}`}>
        {!activeChat ? (
          // Default View
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Your Messages</h3>
            <p className="text-gray-500 max-w-sm">
              Select a conversation from the left to start messaging
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button onClick={() => navigate(-1)} className="sm:hidden p-2 hover:bg-zinc-800 rounded-lg">
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                </button>
                <Link
                  to={`/profile/${participants.find(p => p._id._id !== authUserId)?._id.username}`}
                  className="flex items-center space-x-3 hover:bg-zinc-800 p-2 rounded-lg transition-colors"
                >
                  <img
                    src={participants.find(p => p._id._id !== authUserId)?._id.profileImage || "/api/placeholder/40/40"}
                    alt={participants.find(p => p._id._id !== authUserId)?._id.username || "Contact"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <h2 className="text-lg font-semibold text-gray-300">
                    {participants.find(p => p._id._id !== authUserId)?._id.username || 'Unknown'}
                  </h2>
                </Link>
                <p className="text-sm text-green-500">
                  {activeChat?.itemId?.title}
                </p>
              </div>
            </div>

            {/* Item Preview Section */}
            <div className="p-4 border-b border-gray-800 bg-zinc-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={activeChat?.itemId?.images[0] || "/placeholder-item.png"}
                    alt={activeChat?.itemId?.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {activeChat?.itemId?.title}
                    </h3>
                    <span className={`text-sm ${activeChat?.status === 'accepted' ? 'text-green-500' :
                      activeChat?.status === 'rejected' ? 'text-red-500' :
                        'text-gray-500'
                      }`}>
                      Status: {activeChat?.status || 'pending'}
                    </span>
                  </div>
                </div>
                {activeChat?.status === 'accepted' &&
                  activeChat.participants.find(p => p._id._id === authUserId)?.role === 'buyer' &&
                  !hasRated && (
                    <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg">
                      <p className="text-sm text-gray-300 mb-2">Rate your experience with the seller</p>
                      <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRateUser(star)}
                            className={`text-2xl focus:outline-none ${rating >= star ? 'text-yellow-400' : 'text-gray-500'
                              }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {hasRated && (
                  <div className="mt-2 text-sm text-green-500">
                    Thanks for rating!
                  </div>
                )}
                {activeChat?.participants.find(p => p._id._id === authUserId)?.role === 'seller' &&
                  activeChat?.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange('rejected')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleStatusChange('accepted')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
                      >
                        Accept
                      </button>
                    </div>
                  )}
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-4">
              {showScrollButton && (
                <button
                  onClick={scrollToTop}
                  className="fixed bottom-20 right-8 p-2 bg-green-500 hover:bg-green-600 
                        text-white rounded-full shadow-lg transition-all duration-200"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              )}
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.senderId === authUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${message.senderId === authUserId
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-900'
                      }`}
                  >
                    <p>{message.content}</p>
                    <span className={`text-xs ${message.senderId === authUserId
                      ? 'text-zinc-200'
                      : 'text-gray-500'
                      }`}>
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <input type="text" placeholder="Type a message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 py-2 px-4 border border-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  <button onClick={handleSendMessage} className="p-2 bg-green-500 hover:bg-green-700 rounded-full">
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
