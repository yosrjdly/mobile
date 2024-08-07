  import React, { useState, useEffect } from 'react';
  import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
  import { useRoute } from '@react-navigation/native';
  import { useChat } from '../ChatContext/ChatContext';

  const ConversationMessages = () => {
    const route = useRoute();
    const { conversationId } = route.params;
    const [message, setMessage] = useState('');
    const { messages, sendMessage, setConversationId } = useChat();

    

    useEffect(() => {
      setConversationId(conversationId);
      return () => {
      };
    }, [conversationId]);

    const handleSend = () => {
      const newMessage = {
        senderId: 1, //////// i dont wanna hardcode the user id , i want it to be dynamic 
        receiverId: 2, //// i dont wanna hardcode the user id , i want it to be dynamic 
        content: message,
        conversationId: Number(conversationId),
      };
      sendMessage(newMessage);
      setMessage('');
    };

    return (
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.messageContainer}>
              <Text style={styles.message}>{item.content}</Text>
            </View>
          )}
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
    },
    messageContainer: {
      marginVertical: 5,
    },
    message: {
      fontSize: 16,
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
    },
  });

  export default ConversationMessages;
