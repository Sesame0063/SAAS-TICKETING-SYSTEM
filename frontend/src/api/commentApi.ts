import api from "./axios";

export interface Comment {
  id: string;
  ticket_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentRequest {
  content: string;
}

export async function getComments(
  ticketId: string
): Promise<Comment[]> {
  const { data } = await api.get(
    `/tickets/${ticketId}/comments`
  );

  return data;
}

export async function createComment(
  ticketId: string,
  payload: CreateCommentRequest
): Promise<Comment> {
  const { data } = await api.post(
    `/tickets/${ticketId}/comments`,
    payload
  );

  return data;
}

export async function deleteComment(
  commentId: string
): Promise<void> {
  await api.delete(`/comments/${commentId}`);
}
