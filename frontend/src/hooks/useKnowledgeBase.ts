import { useEffect, useState } from "react";
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  type KnowledgeArticle,
  type CreateArticleRequest,
} from "../api/knowledgeBaseApi";

export default function useKnowledgeBase() {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const data = await getArticles();
      setArticles(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function create(payload: CreateArticleRequest) {
    await createArticle(payload);
    await refresh();
  }

  async function update(
    id: string,
    payload: CreateArticleRequest
  ) {
    await updateArticle(id, payload);
    await refresh();
  }

  async function remove(id: string) {
    await deleteArticle(id);
    await refresh();
  }

  return {
    articles,
    loading,
    refresh,
    create,
    update,
    remove,
  };
}
