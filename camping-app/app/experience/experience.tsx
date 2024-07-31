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
          <View style={styles.reactionItem}>
            <FontAwesome name="share" size={20} color="#B3492D" />
            <Text style={styles.reactionText}>{item.shareCounter}</Text>
          </View>
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
    backgroundColor: '#073436',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E7E5E5',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#E7E5E5',
    marginBottom: 12,
  },
  imageSlider: {
    marginBottom: 12,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  location: {
    fontSize: 14,
    color: '#B3492D',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#B3492D',
    marginBottom: 4,
  },
  filterCategory: {
    fontSize: 14,
    color: '#B3492D',
    marginBottom: 12,
  },
  reactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionText: {
    fontSize: 14,
    color: '#B3492D',
    marginLeft: 4,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentButtonText: {
    fontSize: 14,
    color: '#B3492D',
    marginLeft: 4,
  },
  commentsSection: {
    marginTop: 12,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E7E5E5',
    marginBottom: 8,
  },
  commentContainer: {
    marginBottom: 8,
  },
  commentUserSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E7E5E5',
  },
  comment: {
    fontSize: 14,
    color: '#E7E5E5',
  },
  commentInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderRadius: 4,
    borderColor: '#B3492D',
    borderWidth: 1,
    padding: 8,
    color: '#E7E5E5',
  },
  commentSubmitButton: {
    marginLeft: 8,
    backgroundColor: '#B3492D',
    borderRadius: 4,
    padding: 8,
  },
  commentSubmitText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ExperienceList;
