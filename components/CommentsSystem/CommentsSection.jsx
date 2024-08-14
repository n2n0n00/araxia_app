import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
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
import EmptyState from "../../components/EmptyComponent/EmptyState";

const PAGE_SIZE = 10; // Number of comments/replies per page

const CommentSection = ({ postId }) => {
  const { authUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [hasMoreReplies, setHasMoreReplies] = useState({});
  const [commentPage, setCommentPage] = useState(1);
  const [expandedReplies, setExpandedReplies] = useState({});

  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const fetchedComments = await fetchCommentsByPostId(
          postId,
          commentPage,
          PAGE_SIZE
        );
        if (fetchedComments.length < PAGE_SIZE) {
          setHasMoreComments(false);
        }
        const commentsWithReplies = await Promise.all(
          fetchedComments.map(async (comment) => {
            const replies = await fetchRepliesOnCommentsByCommentId(
              comment.comment_id
            );
            const isCommentLiked = await checkUserLikeOnCommentOnPost(
              authUser.userId,
              comment.comment_id
            );
            const repliesWithLikes = await Promise.all(
              replies.map(async (reply) => {
                const isReplyLiked = await checkUserLikeOnReplyOnComment(
                  authUser.userId,
                  reply.reply_id
                );
                return {
                  ...reply,
                  liked: isReplyLiked,
                  favorite_count: reply.favorite_count || 0,
                };
              })
            );
            return {
              ...comment,
              replies: repliesWithLikes,
              liked: isCommentLiked,
              favorite_count: comment.favorite_count || 0,
            };
          })
        );

        setComments((prevComments) => [
          ...prevComments,
          ...commentsWithReplies,
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [postId, commentPage]);

  const handleAddComment = async () => {
    if (newComment.trim() !== "") {
      await addCommentToPost(postId, authUser.userId, newComment);
      setNewComment("");
      setCommentPage(1); // Reset pagination to load the latest comments
      setHasMoreComments(true);
      setComments([]);
    }
  };

  const handleAddReply = async (commentId) => {
    if (newReply.trim() !== "") {
      await addReplyToComment(commentId, postId, authUser.userId, newReply);
      setNewReply("");
      setReplyTo(null); // Reset the reply state
      const updatedReplies = await fetchRepliesOnCommentsByCommentId(commentId);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, replies: [...comment.replies, ...updatedReplies] }
            : comment
        )
      );
    }
  };

  const handleLikeComment = async (commentId, liked) => {
    try {
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
        await updateLikeCounterOnUserCommentsOnPosts(
          commentId,
          updatedComments.find((c) => c.comment_id === commentId)
            .favorite_count - 1
        );
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
        await updateLikeCounterOnUserCommentsOnPosts(
          commentId,
          updatedComments.find((c) => c.comment_id === commentId)
            .favorite_count + 1
        );
      }
    } catch (error) {
      console.error("Error handling comment like:", error);
    }
  };

  const handleLikeReply = async (replyId, liked) => {
    try {
      const updatedComments = comments.map((comment) => ({
        ...comment,
        replies: comment.replies.map((reply) => {
          if (reply.reply_id === replyId) {
            const updatedFavoriteCount = liked
              ? (reply.favorite_count || 0) - 1
              : (reply.favorite_count || 0) + 1;

            return {
              ...reply,
              favorite_count: updatedFavoriteCount,
              liked: !liked,
            };
          }
          return reply;
        }),
      }));

      setComments(updatedComments);

      await updateLikeCounterOnUserReplyOnComment(
        replyId,
        updatedComments
          .flatMap((c) => c.replies)
          .find((r) => r.reply_id === replyId)?.favorite_count
      );

      if (liked) {
        await removeUserLikeOnReplyOnComment(authUser.userId, replyId);
      } else {
        await addUserLikeOnReplyOnComment(authUser.userId, replyId);
      }
    } catch (error) {
      console.error("Error handling reply like:", error);
    }
  };

  const handleLoadMoreComments = () => {
    if (hasMoreComments && !loadingComments) {
      setCommentPage((prevPage) => prevPage + 1);
    }
  };

  const handleToggleReplies = async (commentId) => {
    const isExpanded = expandedReplies[commentId]?.expanded;
    if (!isExpanded) {
      setLoadingReplies(true);
      try {
        const replies = await fetchRepliesOnCommentsByCommentId(commentId);
        const repliesWithLikes = await Promise.all(
          replies.map(async (reply) => {
            const isReplyLiked = await checkUserLikeOnReplyOnComment(
              authUser.userId,
              reply.reply_id
            );
            return {
              ...reply,
              liked: isReplyLiked,
              favorite_count: reply.favorite_count || 0,
            };
          })
        );
        setHasMoreReplies((prev) => ({
          ...prev,
          [commentId]: repliesWithLikes.length >= PAGE_SIZE,
        }));
        setExpandedReplies((prev) => ({
          ...prev,
          [commentId]: { replies: repliesWithLikes, expanded: true },
        }));
      } catch (error) {
        console.error("Error fetching replies:", error);
      } finally {
        setLoadingReplies(false);
      }
    } else {
      setExpandedReplies((prev) => ({
        ...prev,
        [commentId]: { ...prev[commentId], expanded: false },
      }));
    }
  };

  const handleLoadMoreReplies = async (commentId) => {
    if (hasMoreReplies[commentId] && !loadingReplies) {
      setLoadingReplies(true);
      try {
        const nextPageReplies = await fetchRepliesOnCommentsByCommentId(
          commentId
        );
        const repliesWithLikes = await Promise.all(
          nextPageReplies.map(async (reply) => {
            const isReplyLiked = await checkUserLikeOnReplyOnComment(
              authUser.userId,
              reply.reply_id
            );
            return {
              ...reply,
              liked: isReplyLiked,
              favorite_count: reply.favorite_count || 0,
            };
          })
        );
        setHasMoreReplies((prev) => ({
          ...prev,
          [commentId]: repliesWithLikes.length >= PAGE_SIZE,
        }));
        setExpandedReplies((prev) => ({
          ...prev,
          [commentId]: {
            replies: [...prev[commentId]?.replies, ...repliesWithLikes],
            expanded: true,
          },
        }));
      } catch (error) {
        console.error("Error fetching more replies:", error);
      } finally {
        setLoadingReplies(false);
      }
    }
  };

  const renderReply = (reply) => (
    <View key={reply.reply_id} className="pl-4">
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

  const renderComment = (comment) => (
    <View key={comment.comment_id} className="mb-2">
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
      <TouchableOpacity onPress={() => handleToggleReplies(comment.comment_id)}>
        <Text className="text-blue-500">
          {expandedReplies[comment.comment_id]?.expanded
            ? "Hide Replies"
            : "Show Replies"}
        </Text>
      </TouchableOpacity>
      {expandedReplies[comment.comment_id]?.expanded &&
        expandedReplies[comment.comment_id]?.replies.map(renderReply)}
      {expandedReplies[comment.comment_id]?.expanded &&
        hasMoreReplies[comment.comment_id] && (
          <TouchableOpacity
            onPress={() => handleLoadMoreReplies(comment.comment_id)}
          >
            {loadingReplies ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-blue-500">Load More Replies</Text>
            )}
          </TouchableOpacity>
        )}
      <View className="pl-4">
        <TextInput
          className="bg-gray-700 text-white p-2 mt-2"
          placeholder="Write a reply..."
          placeholderTextColor="gray"
          onFocus={() => setReplyTo(comment.comment_id)} // Set the comment being replied to
          onChangeText={setNewReply} // Only update the state, not the database
          value={replyTo === comment.comment_id ? newReply : ""}
        />
        <TouchableOpacity onPress={() => handleAddReply(comment.comment_id)}>
          <Text>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 80}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="always"
      >
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
        <View className="flex-1">
          {comments.length > 0 ? (
            <>
              {comments.map(renderComment)}
              {hasMoreComments && !loadingComments && (
                <TouchableOpacity onPress={handleLoadMoreComments}>
                  <Text className="text-blue-500">Load More Comments</Text>
                </TouchableOpacity>
              )}
              {loadingComments && (
                <ActivityIndicator size="small" color="#ffffff" />
              )}
            </>
          ) : (
            <EmptyState
              comments
              title="No comments here yet..."
              subtitle="Be the first to comment!"
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CommentSection;
