import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
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
  globalPOSTPageCommentsListener,
  globalPOSTPageCommentLikesListener,
  globalPOSTPageCommentRepliesListener,
  globalPOSTPageCommentReplyLikesListener,
  fetchUserDetails,
} from "../../api/supabase_api";
import EmptyState from "../../components/EmptyComponent/EmptyState";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CommentProfile from "./CommentProfile";
import TextMedium14 from "../../components/Typography/TextMedium14";
import ReplierProfile from "./ReplyProfile";
import TextRegular13 from "../Typography/TextRegular13";

const PAGE_SIZE = 10;

const CommentSection = ({ postId }) => {
  const { authUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState({
    comments: false,
    replies: false,
  });
  const [hasMore, setHasMore] = useState({
    comments: true,
    replies: {},
  });
  const [page, setPage] = useState(1);
  const [expandedReplies, setExpandedReplies] = useState({});

  const fetchComments = useCallback(async () => {
    setLoading((prev) => ({ ...prev, comments: true }));
    try {
      const fetchedComments = await fetchCommentsByPostId(
        postId,
        page,
        PAGE_SIZE
      );
      setHasMore((prev) => ({
        ...prev,
        comments: fetchedComments.length === PAGE_SIZE,
      }));

      const commentsWithReplies = await Promise.all(
        fetchedComments.map(async (comment) => {
          const isCommentLiked = await checkUserLikeOnCommentOnPost(
            authUser.userId,
            comment.comment_id
          );
          const replies = await fetchRepliesOnCommentsByCommentId(
            comment.comment_id
          );
          const userDetails = await fetchUserDetails(comment.user_id);
          const repliesWithLikes = await Promise.all(
            replies.map(async (reply) => {
              const isReplyLiked = await checkUserLikeOnReplyOnComment(
                authUser.userId,
                reply.reply_id
              );
              const userDetails = await fetchUserDetails(reply.user_id);
              return {
                ...reply,
                userDetails,
                liked: isReplyLiked,
                favorite_count: reply.favorite_count || 0,
              };
            })
          );
          return {
            ...comment,
            replies: repliesWithLikes,
            liked: isCommentLiked,
            userDetails,
            favorite_count: comment.favorite_count || 0,
          };
        })
      );

      setComments((prevComments) =>
        page === 1
          ? commentsWithReplies
          : [...prevComments, ...commentsWithReplies]
      );
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading((prev) => ({ ...prev, comments: false }));
    }
  }, [postId, authUser.userId, page]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    const listeners = [
      globalPOSTPageCommentsListener((newComment) => {
        setComments((prevComments) => {
          const existingCommentIndex = prevComments.findIndex(
            (c) => c.comment_id === newComment.comment_id
          );
          if (existingCommentIndex > -1) {
            const updatedComments = [...prevComments];
            updatedComments[existingCommentIndex] = {
              ...updatedComments[existingCommentIndex],
              ...newComment,
              replies: updatedComments[existingCommentIndex].replies || [],
            };
            return updatedComments;
          } else {
            return [
              { ...newComment, replies: [], liked: false, favorite_count: 0 },
              ...prevComments,
            ];
          }
        });
      }, postId),

      globalPOSTPageCommentLikesListener((updatedLike) => {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.comment_id === updatedLike.comment_id
              ? { ...comment, favorite_count: updatedLike.favorite_count }
              : comment
          )
        );
      }),

      globalPOSTPageCommentRepliesListener((newReply) => {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.comment_id === newReply.comment_id
              ? {
                  ...comment,
                  replies: [
                    ...comment.replies.filter(
                      (r) => r.reply_id !== newReply.reply_id
                    ),
                    { ...newReply, liked: false, favorite_count: 0 },
                  ],
                }
              : comment
          )
        );
      }),

      globalPOSTPageCommentReplyLikesListener((updatedReplyLike) => {
        setComments((prevComments) =>
          prevComments.map((comment) => ({
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.reply_id === updatedReplyLike.reply_id
                ? { ...reply, favorite_count: updatedReplyLike.favorite_count }
                : reply
            ),
          }))
        );
      }),
    ];

    return () => {
      listeners.forEach((listener) => listener.unsubscribe());
    };
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const addedComment = await addCommentToPost(
          postId,
          authUser.userId,
          newComment.trim()
        );
        setComments((prevComments) => [
          {
            ...addedComment,
            comment_content: newComment.trim(),
            replies: [],
            liked: false,
            favorite_count: 0,
          },
          ...prevComments,
        ]);
        setNewComment("");
        setPage(1);
        setHasMore((prev) => ({ ...prev, comments: true }));
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  const handleAddReply = async (commentId) => {
    if (newReply.trim()) {
      try {
        const addedReply = await addReplyToComment(
          commentId,
          postId,
          authUser.userId,
          newReply.trim()
        );
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.comment_id === commentId
              ? {
                  ...comment,
                  replies: [
                    {
                      ...addedReply,
                      reply_content: newReply.trim(),
                      liked: false,
                      favorite_count: 0,
                    },
                    ...comment.replies,
                  ],
                }
              : comment
          )
        );
        setNewReply("");
        setReplyTo(null);
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };

  const handleLike = async (id, type, liked) => {
    try {
      const updateFunctions = {
        comment: {
          addLike: addUserLikeOnCommentOnPost,
          removeLike: removeUserLikeOnCommentOnPost,
          updateLikeCount: updateLikeCounterOnUserCommentsOnPosts,
        },
        reply: {
          addLike: addUserLikeOnReplyOnComment,
          removeLike: removeUserLikeOnReplyOnComment,
          updateLikeCount: updateLikeCounterOnUserReplyOnComment,
        },
      };

      const { addLike, removeLike, updateLikeCount } = updateFunctions[type];

      if (liked) {
        await removeLike(authUser.userId, id);
      } else {
        await addLike(authUser.userId, id);
      }

      setComments((prevComments) =>
        prevComments.map((comment) => ({
          ...comment,
          ...(type === "comment" && comment.comment_id === id
            ? {
                favorite_count: liked
                  ? comment.favorite_count - 1
                  : comment.favorite_count + 1,
                liked: !liked,
              }
            : {}),
          replies: comment.replies.map((reply) =>
            type === "reply" && reply.reply_id === id
              ? {
                  ...reply,
                  favorite_count: liked
                    ? reply.favorite_count - 1
                    : reply.favorite_count + 1,
                  liked: !liked,
                }
              : reply
          ),
        }))
      );

      const item =
        type === "comment"
          ? comments.find((c) => c.comment_id === id)
          : comments.flatMap((c) => c.replies).find((r) => r.reply_id === id);

      if (item) {
        await updateLikeCount(authUser.userId, id);
      }
    } catch (error) {
      console.error(`Error handling like for ${type}:`, error);
    }
  };

  const handleLoadMore = (type, commentId = null) => {
    if (type === "comments" && hasMore.comments && !loading.comments) {
      setPage((prevPage) => prevPage + 1);
    } else if (
      type === "replies" &&
      hasMore.replies[commentId] &&
      !loading.replies
    ) {
      loadMoreReplies(commentId);
    }
  };

  const loadMoreReplies = async (commentId) => {
    setLoading((prev) => ({ ...prev, replies: true }));
    try {
      const currentReplies =
        comments.find((c) => c.comment_id === commentId)?.replies || [];
      const newReplies = await fetchRepliesOnCommentsByCommentId(commentId);
      setHasMore((prev) => ({
        ...prev,
        replies: {
          ...prev.replies,
          [commentId]: newReplies.length === PAGE_SIZE,
        },
      }));
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, replies: [...comment.replies, ...newReplies] }
            : comment
        )
      );
    } catch (error) {
      console.error("Error loading more replies:", error);
    } finally {
      setLoading((prev) => ({ ...prev, replies: false }));
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prevExpandedReplies) => ({
      ...prevExpandedReplies,
      [commentId]: !prevExpandedReplies[commentId],
    }));
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center mb-5">
        <TextInput
          multiline
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Add a comment..."
          placeholderTextColor={"white"}
          className="flex-1 border-2 border-white rounded-[10px] px-4 py-2 mr-2 text-white font-mregular"
        />
        <TouchableOpacity onPress={handleAddComment}>
          <FontAwesome5 name="arrow-circle-right" size={30} color="white" />
        </TouchableOpacity>
      </View>
      {loading.comments && page === 1 ? (
        <View className="pt-10">
          <ActivityIndicator size={60} color="#C796FF" />
        </View>
      ) : comments.length > 0 ? (
        <ScrollView>
          {comments.map((comment) => (
            <CommentItem
              key={comment.comment_id}
              comment={comment}
              userDetails={comment.userDetails[0]}
              expandedReplies={expandedReplies[comment.comment_id]}
              toggleReplies={toggleReplies}
              handleLike={handleLike}
              handleLoadMore={handleLoadMore}
              authUser={authUser}
              replyTo={replyTo}
              setReplyTo={setReplyTo}
              newReply={newReply}
              setNewReply={setNewReply}
              handleAddReply={handleAddReply}
            />
          ))}
          {hasMore.comments && (
            <TouchableOpacity
              className="p-3 items-center"
              onPress={() => handleLoadMore("comments")}
            >
              <Text className="font-mregular text-[#3399ff]">
                Load More Comments
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      ) : (
        <View className="h-full">
          <EmptyState subtitle="No comments yet." />
        </View>
      )}
    </View>
  );
};

const CommentItem = ({
  comment,
  expandedReplies,
  toggleReplies,
  handleLike,
  handleLoadMore,
  authUser,
  replyTo,
  setReplyTo,
  newReply,
  setNewReply,
  handleAddReply,
  userDetails,
}) => (
  <View className="p-4 border-2 border-gray-400 mb-2 rounded-[15px]">
    <CommentProfile
      userId={userDetails.userId}
      username={userDetails.username}
      userAvatar={userDetails.avatar}
    />
    <TextMedium14 extraClasses={"my-4"}>{comment.comment_content}</TextMedium14>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => handleLike(comment.comment_id, "comment", comment.liked)}
      >
        <AntDesign
          name={comment.liked ? "heart" : "hearto"}
          size={24}
          color="white"
        />
        <Text className="font-mregular text-white text-sm ml-2">
          {comment.favorite_count}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setReplyTo(comment.comment_id)}>
        <Text
          className={`font-mregular ${
            replyTo === comment.comment_id ? "text-[#9933ff]" : "text-[#cc99ff]"
          }`}
        >
          Add Reply
        </Text>
      </TouchableOpacity>
      {comment.replies.length > 0 && (
        <TouchableOpacity onPress={() => toggleReplies(comment.comment_id)}>
          <Text className="font-mregular text-[#3399ff]">
            {expandedReplies ? "Hide" : "View"} Replies (
            {comment.replies.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>

    {expandedReplies && (
      <View className="ml-5">
        {comment.replies.map((reply) => (
          <ReplyItem
            key={reply.reply_id}
            reply={reply}
            userDetails={reply.userDetails[0]}
            handleLike={handleLike}
            authUser={authUser}
          />
        ))}
        {comment.replies.length > 0 && (
          <TouchableOpacity
            className="items-center p-3"
            onPress={() => handleLoadMore("replies", comment.comment_id)}
          >
            <Text className="font-mregular text-[#3399ff]">
              Load More Replies
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )}

    {replyTo === comment.comment_id && (
      <View className="flex-row items-center mt-6">
        <TextInput
          multiline
          value={newReply}
          onChangeText={setNewReply}
          placeholder="Add a reply..."
          placeholderTextColor={"white"}
          className="flex-1 border-2 border-white rounded-[10px] px-4 py-2 mr-2 text-white font-mregular"
        />
        <TouchableOpacity onPress={() => handleAddReply(comment.comment_id)}>
          <FontAwesome5 name="arrow-circle-right" size={30} color="white" />
        </TouchableOpacity>
      </View>
    )}
  </View>
);

const ReplyItem = ({ reply, handleLike, authUser, userDetails }) => (
  <View className="p-1 border-gray-400 rounded-[25px] border-2 mt-2 py-2 px-3">
    <ReplierProfile
      userId={userDetails.userId}
      username={userDetails.username}
      userAvatar={userDetails.avatar}
    />
    <TextRegular13>{reply.reply_content}</TextRegular13>

    <TouchableOpacity
      onPress={() => handleLike(reply.reply_id, "reply", reply.liked)}
      className="flex-row items-center justify-end px-2"
    >
      <AntDesign
        name={reply.liked ? "heart" : "hearto"}
        size={18}
        color="white"
      />
      <Text className="font-mregular text-white text-[11px] ml-2">
        {reply.favorite_count}
      </Text>
    </TouchableOpacity>
  </View>
);

export default CommentSection;
