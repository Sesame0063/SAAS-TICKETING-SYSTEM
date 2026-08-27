import api from "./axios";

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CreateKnowledgeArticleRequest {
  title: string;
  category: string;
  content: string;
}

export async function getArticles(): Promise<KnowledgeArticle[]> {
  const response = await api.get("/knowledge-base");
  return response.data.data;
}

export async function createArticle(
  payload: CreateKnowledgeArticleRequest
): Promise<KnowledgeArticle> {
  const response = await api.post("/knowledge-base", payload);
  return response.data.data;
}

export async function updateArticle(
  id: string,
  payload: CreateKnowledgeArticleRequest
): Promise<KnowledgeArticle> {
  const response = await api.put(`/knowledge-base/${id}`, payload);
  return response.data.data;
}

export async function deleteArticle(id: string): Promise<void> {
  await api.delete(`/knowledge-base/${id}`);
}
