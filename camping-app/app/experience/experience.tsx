import React, { useEffect, useState } from 'react';
import {Modal , View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';

const ExperienceList = ({ navigation }) => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decodedToken = JWT.decode(token.replace('Bearer ', ''), 'mySuperSecretPrivateKey');
          if (decodedToken) {
            setUserId(decodedToken.id);
          }
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get('http://192.168.10.4:5000/api/experienceTip/all/get');
        setExperiences(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLikeToggle = async (experienceId: any, isLiked: any) => {
    try {
      if (userId === null) {
        console.error('User ID not found');
        return;
      }

      const url = isLiked

        ? `http://192.168.10.4:5000/api/like/${experienceId}/unlike`
        : `http://192.168.10.4:5000/api/like/${experienceId}/like`;

      const method = isLiked ? 'DELETE' : 'POST';

      await axios({
        method,
        url,
        data: { userId },
      });

      // Update state with new like status
      setExperiences(prevExperiences =>
        prevExperiences.map(exp =>
          exp.id === experienceId
            ? { 
                ...exp, 
                likeCounter: isLiked ? exp.likeCounter - 1 : exp.likeCounter + 1,
                likes: isLiked 
                  ? exp.likes.filter((like: { user: { id: any; }; }) => like.user.id !== userId) 
                  : [...exp.likes, { user: { id: userId } }] 
              }
            : exp
        )
      );
    } catch (error) {
      console.error('Error liking/unliking experience:', error);
    }
  };

  const handleShare = async (experienceId: any) => {
    try {
      if (userId === null) {
        console.error('User ID not found');
        return;
      }

      await axios.post('http://192.168.10.4:5000/api/share/add', {

        userId,
        experienceId,
      });

      // Update state with new share count
      setExperiences(prevExperiences =>
        prevExperiences.map(exp =>
          exp.id === experienceId
           ? {...exp, shareCounter: exp.shareCounter + 1 }
            : exp
        )
      );

      // Show share modal
      setShowShareModal(true);
    } catch (error) {
      console.error('Error sharing experience:', error);
    }
  };

  const toggleComments = (experienceId: string | number | React.SetStateAction<null>) => {
    setSelectedExperienceId(experienceId);
    setExpandedComments(prevState => ({
      ...prevState,
      [experienceId]: !prevState[experienceId],
    }));
  };

  const handleCommentSubmit = async () => {
    if (newComment.trim() === '' || selectedExperienceId === null) {
      return; // Avoid submitting empty comments or without selecting an experience
    }

    try {

      const response = await axios.post(`http://192.168.10.4:5000/api/comment/add`, {

        content: newComment,
        experienceId: selectedExperienceId,
        userId: userId
      });

      // Update state with new comment
      setExperiences(prevExperiences => 
        prevExperiences.map(exp => 
          exp.id === selectedExperienceId 
            ? { ...exp, comments: [...exp.comments, response.data] }
            : exp
        )
      );
      setNewComment('');
      setExpandedComments(prevState => ({
        ...prevState,
        [selectedExperienceId]: true,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#B3492D" style={styles.loading} />;
  }

  const renderExperience = ({ item }) => {
    const isLiked = item.likes.some((like: { user: { id: null; }; }) => like.user.id === userId);

    return (
      <View style={styles.experienceCard}>
        <View style={styles.userSection}>
          <Image
            source={{ uri: item.user.imagesProfile[0] || 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=' }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{item.user.name}</Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <FlatList
          horizontal
          data={item.imagesUrl}
          keyExtractor={(url) => url}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.image} />
          )}
          showsHorizontalScrollIndicator={false}
          style={styles.imageSlider}
        />
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.filterCategory}>{item.filterCategory}</Text>
        <View style={styles.reactions}>
          <TouchableOpacity onPress={() => handleLikeToggle(item.id, isLiked)} style={styles.reactionItem}>
            <FontAwesome name={isLiked? "thumbs-up" : "thumbs-o-up"} size={20} color="#B3492D" />
            <Text style={styles.reactionText}>{item.likeCounter}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleComments(item.id)} style={styles.commentButton}>
            <AntDesign name="message1" size={20} color="#B3492D" />
            <Text style={styles.commentButtonText}>{item.comments.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleShare(item.id)} style={styles.reactionItem}>
            <FontAwesome name="share" size={20} color="#B3492D" />
            <Text style={styles.reactionText}>{item.shareCounter}</Text>
          </TouchableOpacity>
        </View>
        {expandedComments[item.id] && (
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments:</Text>
            <FlatList
              data={item.comments}
              keyExtractor={(comment) => comment.id.toString()}
              renderItem={({ item: comment }) => (
                <View key={comment.id} style={styles.commentContainer}>
                  <View style={styles.commentUserSection}>
                    <Image
                      source={{ uri: comment.user.imagesProfile[0] || 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=' }}
                      style={styles.commentProfileImage}
                    />
                    <Text style={styles.commentUserName}>{comment.user.name}</Text>
                  </View>
                  <Text style={styles.comment}>{comment.content}</Text>
                </View>
              )}
            />
            <View style={styles.commentInputSection}>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity onPress={handleCommentSubmit} style={styles.commentSubmitButton}>
                <Text style={styles.commentSubmitText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
<Modal
  visible={showShareModal}
  animationType="slide"
  transparent={true}
  onRequestClose={() => setShowShareModal(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalCard}>
      <Text style={styles.modalTitle}>Experience Shared!</Text>
      <Text style={styles.modalMessage}>Your experience has been shared successfully!</Text>
      <TouchableOpacity onPress={() => setShowShareModal(false)}>
        <View style={styles.modalButton}>
          <Text style={styles.modalButtonText}>Close</Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AntDesign name="left" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.header}>Experiences</Text>
      <FlatList
        data={experiences}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExperience}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00595E',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  backButton: {
    position: 'absolute',
    top:  40,
    left: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(1, 64, 67, 0.8)',
  },
  modalCard: {
    backgroundColor: '#014043',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignSelf: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#B3492D',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 85,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceCard: {
    backgroundColor: '#014043',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 10,
  },
  userName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color:"#fff"
  },
  content: {
    fontSize: 16,
    color: '#fff',
  },
  imageSlider: {
    marginVertical: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginRight: 5,
  },
  location: {
    fontSize: 14,
    color: '#fff',
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterCategory: {
    fontSize: 14,
    color: '#B3492D',
  },
  reactions: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginVertical: 10,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  reactionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  commentsSection: {
    marginTop: 10,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentUserSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  comment: {
    fontSize: 14,
    color: '#333',
  },
  commentInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
  },
  commentSubmitButton: {
    backgroundColor: '#B3492D',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  commentSubmitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExperienceList;