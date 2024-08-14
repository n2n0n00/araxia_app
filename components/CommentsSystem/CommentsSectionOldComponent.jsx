import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useAuth } from "../../context/AuthProvider";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  fetchCommentsByPostId,
  addCommentToPost,
  checkUserLikeOnCommentOnPost,
  addUserLikeOnCommentOnPost,
  removeUserLikeOnCommentOnPost,
  updateLikeCounterOnUserCommentsOnPosts,
  fetchRepliesOnCommentsByCommentId,
  addReplyToComment,
  checkUserLikeOnReplyOnComment,
  addUserLikeOnReplyOnComment,
  removeUserLikeOnReplyOnComment,
  updateLikeCounterOnUserReplyOnComment,
} from "../../api/supabase_api";

const CommentSection = ({ postId }) => {
  const { authUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [newReply, setNewReply] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await fetchCommentsByPostId(postId);
      const commentsWithReplies = await Promise.all(
        fetchedComments.map(async (comment) => {
          const replies = await fetchRepliesOnCommentsByCommentId(
            comment.comment_id
          );
          return { ...comment, replies };
        })
      );
      setComments(commentsWithReplies);
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim() !== "") {
      await addCommentToPost(postId, authUser.userId, newComment);
      setNewComment("");
      const updatedComments = await fetchCommentsByPostId(postId);
      setComments(updatedComments);
    }
  };

  const handleAddReply = async (commentId) => {
    if (newReply.trim() !== "") {
      await addReplyToComment(commentId, postId, authUser.userId, newReply);
      setNewReply("");
      const updatedComments = await fetchCommentsByPostId(postId);
      setComments(updatedComments);
    }
  };

  const handleLikeComment = async (commentId, liked) => {
    if (liked) {
      await removeUserLikeOnCommentOnPost(authUser.userId, commentId);
      const updatedComments = comments.map((comment) =>
        comment.comment_id === commentId
          ? {
              ...comment,
              favorite_count: comment.favorite_count - 1,
              liked: false,
            }
          : comment
      );
      setComments(updatedComments);
    } else {
      await addUserLikeOnCommentOnPost(authUser.userId, commentId);
      const updatedComments = comments.map((comment) =>
        comment.comment_id === commentId
          ? {
              ...comment,
              favorite_count: comment.favorite_count + 1,
              liked: true,
            }
          : comment
      );
      setComments(updatedComments);
    }
    await updateLikeCounterOnUserCommentsOnPosts(commentId, liked ? -1 : 1);
  };

  const handleLikeReply = async (replyId, liked) => {
    if (liked) {
      await removeUserLikeOnReplyOnComment(authUser.userId, replyId);
      const updatedComments = comments.map((comment) => ({
        ...comment,
        replies: comment.replies.map((reply) =>
          reply.reply_id === replyId
            ? {
                ...reply,
                favorite_count: reply.favorite_count - 1,
                liked: false,
              }
            : reply
        ),
      }));
      setComments(updatedComments);
    } else {
      await addUserLikeOnReplyOnComment(authUser.userId, replyId);
      const updatedComments = comments.map((comment) => ({
        ...comment,
        replies: comment.replies.map((reply) =>
          reply.reply_id === replyId
            ? {
                ...reply,
                favorite_count: reply.favorite_count + 1,
                liked: true,
              }
            : reply
        ),
      }));
      setComments(updatedComments);
    }
    await updateLikeCounterOnUserReplyOnComment(replyId, liked ? -1 : 1);
  };

  const renderComment = ({ item: comment }) => {
    return (
      <View className="mb-4 p-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white">{comment.comment_content}</Text>
          <TouchableOpacity
            onPress={() => handleLikeComment(comment.comment_id, comment.liked)}
          >
            <AntDesign
              name={comment.liked ? "heart" : "hearto"}
              size={16}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400">{comment.favorite_count} Likes</Text>
        <FlatList
          data={comment.replies}
          renderItem={renderReply}
          keyExtractor={(item) => item.reply_id.toString()}
        />

        <PostReply comment={comment} />
      </View>
    );
  };

  const PostReply = ({ comment }) => (
    <View className="p-4">
      <TextInput
        className="bg-gray-700 text-white p-2 mt-2"
        placeholder="Write a reply..."
        placeholderTextColor="gray"
        onFocus={() => setReplyTo(comment.comment_id)} // Set the comment being replied to
        onChangeText={(text) => setNewReply(text)}
        value={replyTo === comment.comment_id ? newReply : ""}
      />
      <TouchableOpacity onPress={handleAddReply(comment.comment_id)}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );

  const renderReply = ({ item: reply }) => {
    return (
      <View className="pl-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white">{reply.reply_content}</Text>
          <TouchableOpacity
            onPress={() => handleLikeReply(reply.reply_id, reply.liked)}
          >
            <AntDesign
              name={reply.liked ? "heart" : "hearto"}
              size={16}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400">{reply.favorite_count} Likes</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.comment_id.toString()}
          keyboardShouldPersistTaps="always"
          ListHeaderComponent={
            <View className="p-4">
              <TextInput
                className="bg-gray-700 text-white p-2 mt-2"
                placeholder="Add a comment..."
                placeholderTextColor="gray"
                value={newComment}
                onChangeText={(text) => setNewComment(text)}
              />
              <TouchableOpacity onPress={handleAddComment}>
                <Text>Submit</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CommentSection;
