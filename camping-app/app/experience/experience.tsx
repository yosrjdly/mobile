import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';

const ExperienceList = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [userId, setUserId] = useState(null);

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
        const response = await axios.get('http://192.168.10.7:5000/api/experienceTip/all/get');
        setExperiences(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLikeToggle = async (experienceId, isLiked) => {
    try {
      if (userId === null) {
        console.error('User ID not found');
        return;
      }

      const url = isLiked
        ? `http://192.168.10.7:5000/api/like/${experienceId}/unlike`
        : `http://192.168.10.7:5000/api/like/${experienceId}/like`;

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
                  ? exp.likes.filter(like => like.user.id !== userId) 
                  : [...exp.likes, { user: { id: userId } }] 
              }
            : exp
        )
      );
    } catch (error) {
      console.error('Error liking/unliking experience:', error);
    }
  };

  const handleShare = async (experienceId) => {
    try {
      if (userId === null) {
        console.error('User ID not found');
        return;
      }

      await axios.post('http://192.168.10.7:5000/api/share/add', {
        userId,
        experienceId,
      });

      // Update state with new share count
      setExperiences(prevExperiences =>
        prevExperiences.map(exp =>
          exp.id === experienceId
            ? { ...exp, shareCounter: exp.shareCounter + 1 }
            : exp
        )
      );
    } catch (error) {
      console.error('Error sharing experience:', error);
    }
  };

  const toggleComments = (experienceId) => {
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
      const response = await axios.post(`http://192.168.10.7:5000/api/comment/add`, {
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
    const isLiked = item.likes.some(like => like.user.id === userId);

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
            <FontAwesome name={isLiked ? "thumbs-up" : "thumbs-o-up"} size={20} color="#B3492D" />
            <Text style={styles.reactionText}>{item.likeCounter}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleShare(item.id)} style={styles.reactionItem}>
            <FontAwesome name="share" size={20} color="#B3492D" />
            <Text style={styles.reactionText}>{item.shareCounter}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleComments(item.id)} style={styles.commentButton}>
            <AntDesign name="message1" size={20} color="#B3492D" />
            <Text style={styles.commentButtonText}>{item.comments.length}</Text>
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
      </View>
    );
  };

  return (
    <FlatList
      data={experiences}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderExperience}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#00595E',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceCard: {
    backgroundColor: '#E6D5B8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
    elevation: 3,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
  },
  content: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  imageSlider: {
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 5,
  },
  location: {
    fontSize: 12,
    color: '#888',
  },
  category: {
    fontSize: 12,
    color: '#888',
  },
  filterCategory: {
    fontSize: 12,
    color: '#888',
    marginBottom: 5,
  },
  reactions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 5,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionText: {
    marginLeft: 5,
    color: '#B3492D',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentButtonText: {
    marginLeft: 5,
    color: '#B3492D',
  },
  commentsSection: {
    marginTop: 10,
  },
  commentsTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  commentContainer: {
    marginBottom: 10,
  },
  commentUserSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUserName: {
    fontWeight: 'bold',
    color: '#333',
  },
  comment: {
    fontSize: 14,
    color: '#555',
  },
  commentInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#B3492D',
    borderRadius: 10,
    padding: 5,
    marginRight: 10,
    color: '#333',
  },
  commentSubmitButton: {
    backgroundColor: '#B3492D',
    borderRadius: 10,
    padding: 5,
  },
  commentSubmitText: {
    color: '#fff',
  },
});

export default ExperienceList;
