import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {
  const { id } = useParams(); // Conversation ID
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await axios.get(`/api/chat/conversations/${id}`);
        setConversation(response.data.conversation); // Assuming the API returns the conversation
      } catch (error) {
        console.error('Error fetching conversation:', error);
        alert('Error fetching conversation');
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Chat</h1>
      <div>
        {messages.map((msg) => (
          <div key={msg._id}>
            <strong>{msg.senderId === conversation.participants[0] ? 'You' : 'Other'}:</strong>
            {msg.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;
