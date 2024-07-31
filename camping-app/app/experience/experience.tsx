import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

const ExperienceList = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);

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
        experienceId: selectedExperienceId, // Include experienceId
        userId: 1 // Replace with the actual user ID from authentication
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

  const renderExperience = ({ item }) => (
    <View style={styles.experienceCard}>
      <View style={styles.userSection}>
        <Image
          source={{ uri: item.user.imagesProfile[0] || 'https://example.com/default-profile.png' }}
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
        <View style={styles.reactionItem}>
          <FontAwesome name="thumbs-up" size={20} color="#B3492D" />
          <Text style={styles.reactionText}>{item.likeCounter}</Text>
        </View>
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
                    source={{ uri: comment.user.imagesProfile[0] || 'https://example.com/default-profile.png' }}
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ddd',
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
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  content: {
    marginBottom: 12,
    color: '#fff',
  },
  imageSlider: {
    marginBottom: 12,
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 8,
    borderRadius: 8,
  },
  location: {
    marginTop: 8,
    fontStyle: 'italic',
    color: '#ddd',
  },
  category: {
    marginTop: 4,
    color: '#ddd',
  },
  filterCategory: {
    marginTop: 4,
    color: '#ddd',
  },
  reactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  reactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reactionText: {
    marginLeft: 4,
    color: '#ddd',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentButtonText: {
    marginLeft: 4,
    color: '#ddd',
  },
  commentsSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  commentsTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  commentContainer: {
    backgroundColor: '#073436',
    padding: 8,
    borderRadius: 4,
    marginVertical: 4,
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
    fontWeight: 'bold',
    color: '#fff',
  },
  comment: {
    color: '#ddd',
  },
  commentInputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    color: '#000',
  },
  commentSubmitButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#B3492D',
    borderRadius: 4,
  },
  commentSubmitText: {
    color: '#fff',
  },
});

export default ExperienceList;
