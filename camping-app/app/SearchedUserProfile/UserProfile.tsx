import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import profileImage from "../../assets/images/default-avatar.webp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";

const UserProfile = () => {
  const { userId } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sender, setSender] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [experiences, setExperiences] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [selectedExperienceId, setSelectedExperienceId] = useState(null);
  const [activeTab, setActiveTab] = useState("Experiences");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://192.168.10.13:5000/api/users/${userId}`
        );
        setUser(response.data.user);
        setExperiences(response.data.user.experiences);
      } catch (error) {
        setError("Error fetching user data");
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchSender = async () => {
      try {
        const data = await AsyncStorage.getItem("token");
        if (data) {
          const token = data.startsWith("Bearer ")
            ? data.replace("Bearer ", "")
            : data;
          const key = "mySuperSecretPrivateKey";

          try {
            const decodedToken = JWT.decode(token, key);
            if (decodedToken) {
              setSender({
                id: decodedToken.id || "",
                name: decodedToken.name || "",
                email: decodedToken.email || "",
                imagesProfile: decodedToken.imagesProfile,
                role: decodedToken.role || "",
              });
            } else {
              console.error("Failed to decode token");
            }
          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
          }
        } else {
          console.error("Token not found in AsyncStorage");
        }
      } catch (storageError) {
        console.error("Failed to fetch token from AsyncStorage:", storageError);
      }
    };

    fetchSender();
  }, []);

  const handleLikeToggle = async (experienceId, isLiked) => {
    try {
      if (!sender || !sender.id) {
        console.error("User ID not found");
        return;
      }

      const url = isLiked
        ? `http://192.168.10.13:5000/api/like/${experienceId}/unlike`
        : `http://192.168.10.13:5000/api/like/${experienceId}/like`;

      const method = isLiked ? "DELETE" : "POST";

      await axios({
        method,
        url,
        data: { userId: sender.id },
      });

      setExperiences((prevExperiences) =>
        prevExperiences.map((exp) =>
          exp.id === experienceId
            ? {
                ...exp,
                likeCounter: isLiked
                  ? exp.likeCounter - 1
                  : exp.likeCounter + 1,
                likes: isLiked
                  ? exp.likes.filter((like) => like.user.id !== sender.id)
                  : [...exp.likes, { user: { id: sender.id } }],
              }
            : exp
        )
      );
    } catch (error) {
      console.error("Error liking/unliking experience:", error);
    }
  };

  const handleShare = async (experienceId) => {
    try {
      if (!sender || !sender.id) {
        console.error("User ID not found");
        return;
      }

      await axios.post("http://192.168.10.13:5000/api/share/add", {
        userId: sender.id,
        experienceId,
      });

      setExperiences((prevExperiences) =>
        prevExperiences.map((exp) =>
          exp.id === experienceId
            ? {
                ...exp,
                shareCounter: exp.shareCounter + 1,
              }
            : exp
        )
      );
    } catch (error) {
      console.error("Error sharing experience:", error);
    }
  };

  const handleInvite = async () => {
    try {
      const senderId = sender.id;
      const receiverId = userId;

      const response = await axios.post(
        "http://192.168.10.13:5000/api/invitations/send",
        {
          senderId,
          receiverId,
        }
      );

      Alert.alert("Invitation Sent", `Invitation sent to ${user?.name}`);
    } catch (error) {
      console.error("Error sending invitation:", error);
      Alert.alert(
        "Error",
        "Something went wrong while sending the invitation."
      );
    }
  };

  const toggleComments = (id) => {
    setShowComments((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleCommentSubmit = async () => {
    if (!commentContent || !selectedExperienceId) {
      Alert.alert("Error", "Please enter a comment");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.10.13:5000/api/comment/add",
        {
          content: commentContent,
          experienceId: selectedExperienceId,
          userId: sender.id,
        }
      );

      setExperiences((prevExperiences) =>
        prevExperiences.map((exp) =>
          exp.id === selectedExperienceId
            ? { ...exp, comments: [...exp.comments, response.data] }
            : exp
        )
      );
      setCommentContent("");
      setSelectedExperienceId(null);
    } catch (error) {
      console.error("Error submitting comment:", error);
      Alert.alert(
        "Error",
        "Something went wrong while submitting the comment."
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No user data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Header */}
      <View style={styles.profileHeader}>
      <Image
                    source={{ uri: 'https://images5.alphacoders.com/112/1129765.jpg' }}
                    style={styles.headerBackground}
                />
        <Image
          source={{
            uri:
              user.imagesProfile.length > 0
                ? user.imagesProfile[0]
                : profileImage,
          }}
          style={styles.image}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Text style={styles.bio}>{user.bio || "No bio available"}</Text>
      </View>

      {/* Invite Button */}
      <TouchableOpacity style={styles.inviteButton} onPress={handleInvite}>
        <Text style={styles.inviteButtonText}>Invite</Text>
      </TouchableOpacity>

      {/* Tabs for Experiences and Posts */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Posts" && styles.activeTab]}
          onPress={() => setActiveTab("Posts")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Posts" && styles.activeTabText,
            ]}
          >
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Experiences" && styles.activeTab]}
          onPress={() => setActiveTab("Experiences")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Experiences" && styles.activeTabText,
            ]}
          >
            Experiences
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Rendering Based on Active Tab */}
      {activeTab === "Experiences" ? (
        <View style={styles.section}>
          {experiences.length > 0 ? (
            experiences.map((experience) => (
              <View style={styles.experienceContainer} key={experience.id}>
                <ScrollView horizontal>
                  {experience.imagesUrl.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.experienceImage}
                    />
                  ))}
                </ScrollView>
                <View style={styles.experienceContent}>
                  <Text style={styles.experienceTitle}>{experience.title}</Text>
                  <Text style={styles.experienceText}>
                    {experience.content}
                  </Text>
                  <View style={styles.actionsContainer}>
                    {/* Like Button */}
                    <TouchableOpacity
                      style={styles.likeButton}
                      onPress={() =>
                        handleLikeToggle(
                          experience.id,
                          experience.likes.some(
                            (like) => like.user.id === sender.id
                          )
                        )
                      }
                    >
                      <AntDesign
                        name="hearto"
                        size={24}
                        color={
                          experience.likes.some(
                            (like) => like.user.id === sender.id
                          )
                            ? "#B3492D"
                            : "gray"
                        }
                      />
                      <Text style={styles.likeText}>
                        {experience.likeCounter} Likes
                      </Text>
                    </TouchableOpacity>
                    {/* Share Button */}
                    <TouchableOpacity
                      style={styles.shareButton}
                      onPress={() => handleShare(experience.id)}
                    >
                      <FontAwesome name="share" size={24} color="gray" />
                      <Text style={styles.shareText}>
                        {experience.shareCounter} Shares
                      </Text>
                    </TouchableOpacity>
                    {/* Comment Button */}
                    <TouchableOpacity
                      style={styles.commentButton}
                      onPress={() => toggleComments(experience.id)}
                    >
                      <Ionicons
                        name={
                          showComments[experience.id]
                            ? "chatbox-ellipses"
                            : "chatbox-ellipses-outline"
                        }
                        size={24}
                        color="gray"
                      />
                      <Text style={styles.commentText}>
                        {experience.comments.length} Comments
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Comments Section */}
                {showComments[experience.id] && (
                  <View style={styles.commentsSection}>
                    {experience.comments.map((comment, index) => (
                      <View style={styles.commentContainer} key={index}>
                        <Image
                          source={{ uri: comment.user.imagesProfile[0] }}
                          style={styles.commentImage}
                        />
                        <View style={styles.commentContent}>
                          <Text style={styles.commenterName}>
                            {comment.user.name}
                          </Text>
                          <Text style={styles.commentText}>
                            {comment.content}
                          </Text>
                        </View>
                      </View>
                    ))}
                    <View style={styles.newCommentContainer}>
                      <TextInput
                        style={styles.newCommentInput}
                        placeholder="Write a comment..."
                        value={
                          selectedExperienceId === experience.id
                            ? commentContent
                            : ""
                        }
                        onChangeText={setCommentContent}
                        onFocus={() => setSelectedExperienceId(experience.id)}
                      />
                      <Button
                        title="Send"
                        onPress={handleCommentSubmit}
                        color="#B3492D"
                      />
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text>No experiences to show</Text>
          )}
        </View>
      ) : (
        // Placeholder content for "Posts" tab
        <View style={styles.section}>
          {user.posts.length > 0 ? (
            <FlatList
              data={user.posts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.postContainer}>
                  <Image
                    source={{
                      uri:
                        item.images.length > 0 ? item.images[0] : profileImage,
                    }}
                    style={styles.postImage}
                  />
                  <View style={styles.overlay} />
                  <View style={styles.postContent}>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <View style={styles.postInfo}>
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color="#fff"
                      />
                      <Text style={styles.postText}>{item.location}</Text>
                      <FontAwesome name="clock-o" size={16} color="#fff" />
                      <Text style={styles.postText}>{item.createdAt}</Text>
                    </View>
                    <View style={styles.postActions}></View>
                  </View>
                </View>
              )}
            />
          ) : (
            <Text style={styles.noPostsText}>No posts available</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default UserProfile;


















const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#00595E",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 8,
    color: "#ffff",
  },
  email: {
    top:5,
    fontSize: 16,
    color: "#ffff",
  },
  bio: {
    fontSize: 14,
    color: "#014043",
    textAlign: "center",
    marginTop: 8,
  },
  inviteButton: {
    backgroundColor: "#B3492D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 16,
  },
  inviteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  experienceContainer: {
    backgroundColor: "#073436",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  experienceImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginRight: 10,
  },
  experienceContent: {
    marginTop: 16,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  experienceText: {
    fontSize: 14,
    color: "white",
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeText: {
    marginLeft: 8,
    color: "#fff",
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareText: {
    marginLeft: 8,
    color: "#fff",
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentText: {
    marginLeft: 8,
    color: "#ffff",
  },
  commentsSection: {
    marginTop: 16,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  commentContent: {
    backgroundColor: "#",
    borderRadius: 5,
    padding: 8,
    flex: 1,
  },
  commenterName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#B3492D",
  
  },
  newCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  newCommentInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginRight: 8,
    color: "#ffff",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    borderBottomColor: "#B3492D",
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeTab: {
    borderBottomColor: "#B3492D",
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    color: "#fff",
  },
  activeTabText: {
    color: "#B3492D",
    fontWeight: "bold",
  }, postContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#2D9596',
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 200,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  postContent: {
    padding: 10,
  },
  postTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  postInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  postText: {
    color: '#fff',
    marginLeft: 5,
    marginRight: 20,
  },
});