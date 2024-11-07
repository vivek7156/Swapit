import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io(); // Connect to the server

const Chat = ({ buyerId, sellerId, itemId }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [purchaseStatus, setPurchaseStatus] = useState(null);

    useEffect(() => {
        // Fetch chat history when the component mounts
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/api/chat/${itemId}`);
                setMessages(response.data.messages);
            } catch (error) {
                console.error('Error fetching chat messages:', error);
            }
        };

        fetchMessages();

        // Join the chat room
        socket.emit('joinChat', { buyerId, sellerId, itemId });

        // Listen for new messages
        socket.on('receiveMessage', ({ senderId, content }) => {
            setMessages((prevMessages) => [...prevMessages, { senderId, content }]);
        });

        // Listen for purchase status updates
        socket.on('purchaseStatusUpdated', ({ status }) => {
            setPurchaseStatus(status);
        });

        return () => {
            socket.off('receiveMessage');
            socket.off('purchaseStatusUpdated');
        };
    }, [buyerId, sellerId, itemId]);

    const sendMessage = () => {
        if (message.trim()) {
            const roomId = `${itemId}-${buyerId}-${sellerId}`;
            socket.emit('message', { roomId, senderId: buyerId, content: message });
            setMessage('');
        }
    };

    const updatePurchaseStatus = (status) => {
        const roomId = `${itemId}-${buyerId}-${sellerId}`;
        socket.emit('updatePurchaseStatus', { roomId, status });
    };

    return (
        <div>
            <div>
                <h2>Chat</h2>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.senderId === buyerId ? 'Buyer' : 'Seller'}:</strong> {msg.content}
                    </div>
                ))}
            </div>

            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>

            <div>
                <h3>Purchase Status: {purchaseStatus || 'Pending'}</h3>
                <button onClick={() => updatePurchaseStatus('Approved')}>Approve</button>
                <button onClick={() => updatePurchaseStatus('Rejected')}>Reject</button>
            </div>
        </div>
    );
};

export default Chat;
