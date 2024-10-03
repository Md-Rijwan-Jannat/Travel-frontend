"use client";

import React, { useState } from "react";
import {
  useAddCommentsForPostsMutation,
  useGetCommentsForPostsQuery,
  useReplayCommentsForPostsMutation,
} from "@/src/redux/features/post/commentApi";
import { TComment } from "@/src/types";
import "react-comments-section/dist/index.css";
import CommentInput from "./commentInput";
import ReplyCommentInput from "./replyCommentInput";
import { Avatar } from "@nextui-org/avatar";

// Component Props
interface CommentCardProps {
  postId: string;
}

// Comment Data Interface for rendering purposes
interface RenderedComment {
  userId: string;
  comId: string;
  fullName: string;
  avatarUrl: string | undefined;
  text: string;
  replies?: RenderedComment[];
}

const CommentCard: React.FC<CommentCardProps> = ({ postId }) => {
  // Fetching comments data using hook query
  const { data: commentsData } = useGetCommentsForPostsQuery(postId);
  const comments = commentsData?.data as TComment[] | undefined;

  // Extract replies' _id from comments
  const repliesId =
    comments?.flatMap((comment) =>
      comment?.replies?.map((reply) => reply._id)
    ) ?? [];

  // Filter out comments whose _id matches any replies' _id
  const filteredComments =
    comments?.filter((comment) => !repliesId.includes(comment._id)) ?? [];

  // Transform comments for rendering
  const transformedComments: RenderedComment[] = filteredComments
    .slice(0, 2)
    .map((comment) => ({
      userId: comment.user._id,
      comId: comment._id,
      fullName: comment.user.name,
      avatarUrl: comment.user.image,
      text: comment.text,
      replies: comment.replies?.map((reply) => ({
        userId: reply.user?._id,
        comId: reply._id,
        fullName: reply.user?.name || "Anonymous",
        avatarUrl: reply.user?.image || undefined,
        text: reply.text,
      })),
    }));

  // Comment hook mutations
  const [addComment] = useAddCommentsForPostsMutation();
  const [replyComment] = useReplayCommentsForPostsMutation();

  // State management
  const [newComment, setNewComment] = useState<string>("");
  const [replyCommentText, setReplyCommentText] = useState<string>("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // New Comment Submission Handler
  const handleNewCommentSubmit = async () => {
    try {
      const commentData = { post: postId, text: newComment };
      await addComment(commentData);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting new comment:", error);
    }
  };

  // Reply Comment Submission Handler
  const handleReplySubmit = async () => {
    if (!replyingTo) return;

    try {
      const replyData = {
        commentId: replyingTo,
        data: { post: postId, text: replyCommentText },
      };
      await replyComment(replyData);
      setReplyCommentText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  // Handle canceling reply action
  const handleReplyCancel = () => {
    setReplyCommentText("");
    setReplyingTo(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xs font-semibold">Comments</h2>
      {transformedComments.map((comment) => (
        <div key={comment.comId} className="space-y-2">
          <div className="flex items-start space-x-3">
            <Avatar
              src={comment.avatarUrl}
              name={comment.fullName.charAt(0).toUpperCase()}
              alt={`${comment.fullName}'s avatar`}
              size="sm"
            />
            <div>
              <div className="font-semibold text-sm">{comment.fullName}</div>
              <div className="text-sm">{comment.text}</div>

              {replyingTo === comment.comId ? (
                <ReplyCommentInput
                  value={replyCommentText}
                  onChange={(e) => setReplyCommentText(e.target.value)}
                  onSubmit={handleReplySubmit}
                  onCancel={handleReplyCancel}
                />
              ) : (
                <button
                  className="text-xs text-pink-500 hover:underline"
                  onClick={() => setReplyingTo(comment.comId)}
                >
                  Reply
                </button>
              )}

              {/* Render replies */}
              {comment?.replies?.length! > 0 && (
                <div className="mt-4 space-y-2 pl-8 border-l-2 border-default-200">
                  {comment?.replies?.map((reply) => (
                    <div
                      key={reply.comId}
                      className="flex items-start space-x-3"
                    >
                      <Avatar
                        src={reply.avatarUrl}
                        name={reply.fullName.charAt(0).toUpperCase()}
                        alt={`${reply.fullName}'s avatar`}
                        size="sm"
                      />
                      <div>
                        <div className="font-semibold text-sm">
                          {reply.fullName}
                        </div>
                        <div className="text-sm">{reply.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Comment Input for new comments */}
      <CommentInput
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        onSubmit={handleNewCommentSubmit}
      />
    </div>
  );
};

export default CommentCard;
