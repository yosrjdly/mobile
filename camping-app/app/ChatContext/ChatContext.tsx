import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    const socketInstance = io('http://192.168.10.4:5000'); 
    setSocket(socketInstance);
    
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      console.log('fetchMessages');
      
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`http://192.168.10.4:5000/api/chat/conversations/${conversationId}/messages`, {
          headers: { Authorization: token },
        });
        const data = await response.json();
        console.log(data);
        
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    if (socket && conversationId) {
      socket.emit('joinRoom', conversationId);

      socket.on('newMessage', (newMessage) => {
        console.log(newMessage);
        
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, conversationId]);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit('sendMessage', message);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, setConversationId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
