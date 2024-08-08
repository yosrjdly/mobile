import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useChat } from '../../ChatContext/ChatContext';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for local storage

const ConversationMessages = () => {
  const route = useRoute();
  const { conversationId } = route.params;
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null); // Adjust the type as needed
  const { messages, sendMessage, setConversationId } = useChat();
  const flatListRef = useRef<FlatList>(null); // Create a ref for the FlatList

  const [initialScrollIndex, setInitialScrollIndex] = useState<number | null>(null); // Store initial scroll index for first render

  useEffect(() => {
    setConversationId(conversationId);
  }, [conversationId]);

  useEffect(() => {
    // Fetch user information from AsyncStorage
    const fetchUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          setUser(JSON.parse(userJson));
        } else {
          console.error('User not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Failed to fetch user from AsyncStorage:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    // Calculate and set initial scroll index for displaying last 6 messages
    if (messages.length > 6 && !initialScrollIndex) {
      setInitialScrollIndex(messages.length - 6); // Set to index of the 6th message from the end
    }

    // Scroll to the end whenever messages change (except on initial render)
    if (flatListRef.current && messages.length !== 0) { // Avoid unnecessary scrolling
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages, initialScrollIndex]); // Dependency on both messages and initialScrollIndex

  const handleSend = () => {
    console.log('User:', user);
    if (user) {
      const newMessage = {
        senderId: user.id,
        receiverId: user.id,
        content: message,
        conversationId: Number(conversationId),
      };
      sendMessage(newMessage);
      setMessage('');
    } else {
      console.error('User not logged in');
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSentByUser = item.senderId === user?.id;
    return (
      <View
        style={[
          styles.messageContainer,
          isSentByUser ? styles.sentMessageContainer : styles.receivedMessageContainer,
        ]}
      >
        <Text
          style={[styles.message, isSentByUser ? styles.sentMessage : styles.receivedMessage]}
        >
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={renderItem}
        initialNumToRender={6} // Pre-render the initial 6 messages for smoother scrolling
        getItemLayout={(data, index) => (
          { length: 50, offset: 50 * index, index } // Provide item layout for optimized scrolling
        )}
        onContentSizeChange={() => flatListRef.current?.scrollToIndex({ index: initialScrollIndex || 0 })} // Scroll to initial index after content size updates
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message"   

        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#e1e1e1',
  },
  message: {
    fontSize: 16,
    color: '#fff',
  },
  sentMessage: {
    color: '#fff',
  },
  receivedMessage: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
  },
});

export default ConversationMessages;
