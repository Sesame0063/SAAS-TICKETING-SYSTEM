import { useEffect, useState } from "react";

import {
  getComments,
  createComment,
  deleteComment,
  type Comment,
} from "../api/commentApi";

export default function useComments(ticketId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadComments() {
    try {
      setLoading(true);

      const data = await getComments(ticketId);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  async function sendComment(content: string) {
    const newComment = await createComment(ticketId, {
      content,
    });

    setComments((current) => [newComment, ...current]);
  }

  async function removeComment(commentId: string) {
    await deleteComment(commentId);

    setComments((current) =>
      current.filter((comment) => comment.id !== commentId)
    );
  }

  useEffect(() => {
    if (ticketId) {
      loadComments();
    }
  }, [ticketId]);

  return {
    comments,
    loading,
    reloadComments: loadComments,
    sendComment,
    removeComment,
  };
}
