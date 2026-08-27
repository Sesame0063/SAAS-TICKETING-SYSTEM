import { useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  Plus,
  Trash2,
  Pencil,
  X,
} from "lucide-react";

import useKnowledgeBase from "../../hooks/useKnowledgeBase";
import type { KnowledgeArticle } from "../../api/knowledgeBaseApi";

export default function KnowledgeBasePage() {
  const {
    articles,
    loading,
    create,
    update,
    remove,
  } = useKnowledgeBase();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] =
    useState<KnowledgeArticle | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [articleCategory, setArticleCategory] =
    useState("General");

  const categories = useMemo(() => {
    const list = Array.from(
      new Set(articles.map((a) => a.category))
    );
    return ["ALL", ...list];
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        article.content
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "ALL" ||
        article.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [articles, search, category]);

  function newArticle() {
    setEditing(null);
    setTitle("");
    setContent("");
    setArticleCategory("General");
    setOpenModal(true);
  }

  function editArticle(article: KnowledgeArticle) {
    setEditing(article);
    setTitle(article.title);
    setContent(article.content);
    setArticleCategory(article.category);
    setOpenModal(true);
  }

  async function saveArticle() {
    if (!title || !content) return;

    const payload = {
      title,
      content,
      category: articleCategory,
    };

    if (editing) {
      await update(editing.id, payload);
    } else {
      await create(payload);
    }

    setOpenModal(false);
  }

  return (
    <div className="space-y-8 p-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Knowledge Base
          </h1>

          <p className="text-slate-500">
            Documentation, FAQs and troubleshooting guides.
          </p>
        </div>

        <button
          onClick={newArticle}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          New Article
        </button>

      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow md:flex-row">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search articles..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-4 focus:border-blue-600 focus:outline-none"
          />

        </div>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="rounded-lg border border-slate-300 px-4 py-2"
        >
          {categories.map((cat, index) => (
            <option key={`${cat}-${index}`}>{cat}</option>
          ))}
        </select>

      </div>

      {loading ? (
        <div className="rounded-xl bg-blue-50 p-6 text-center text-blue-600">
          Loading articles...
        </div>
      ) : (
        <div className="space-y-5">

          {filtered.map((article) => (
            <div key={article.id}
              className="rounded-2xl bg-white p-6 shadow"
            >

              <div className="flex items-start justify-between">

                <div>

                  <div className="mb-2 flex items-center gap-3">

                    <BookOpen className="text-blue-600" />

                    <h2 className="text-xl font-bold">
                      {article.title}
                    </h2>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {article.category}
                    </span>

                  </div>

                  <p className="whitespace-pre-wrap text-slate-600">
                    {article.content}
                  </p>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      editArticle(article)
                    }
                    className="rounded-lg bg-amber-100 p-2 text-amber-600 hover:bg-amber-200"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() =>
                      remove(article.id)
                    }
                    className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

            </div>

          ))}

          {filtered.length === 0 && (
            <div className="rounded-xl bg-white p-8 text-center shadow">
              No articles found.
            </div>
          )}

        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                {editing
                  ? "Edit Article"
                  : "New Article"}
              </h2>

              <button
                onClick={() =>
                  setOpenModal(false)
                }
              >
                <X />
              </button>

            </div>

            <div className="space-y-4">

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Article title"
                className="w-full rounded-lg border p-3"
              />

              <input
                value={articleCategory}
                onChange={(e) =>
                  setArticleCategory(
                    e.target.value
                  )
                }
                placeholder="Category"
                className="w-full rounded-lg border p-3"
              />

              <textarea
                rows={8}
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                placeholder="Article content..."
                className="w-full rounded-lg border p-3"
              />

              <button
                onClick={saveArticle}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
              >
                {editing
                  ? "Update Article"
                  : "Create Article"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}






