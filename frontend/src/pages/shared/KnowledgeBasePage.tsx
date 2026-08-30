import DashboardLayout from "../../layouts/DashboardLayout";
import useKnowledgeBase from "../../hooks/useKnowledgeBase";
import { successToast } from "../../utils/toast";
import {
  Search,
  BookOpen,
  Star,
  Clock3,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const categoryColors: Record<string, string> = {
  "Getting Started": "from-cyan-500 to-blue-600",
  "Tickets & Support": "from-emerald-500 to-green-600",
  Billing: "from-violet-500 to-purple-600",
  "Account & Security": "from-orange-500 to-pink-600",
  "API Documentation": "from-indigo-500 to-blue-700",
  "Workspace Settings": "from-slate-500 to-slate-700",
};

export default function KnowledgeBasePage() {
  const { articles = [] } = useKnowledgeBase();

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const categories = useMemo(() => {
    const counts = articles.reduce((acc: any, article: any) => {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {});

    return [
      { title: "All", count: articles.length, color: "from-cyan-500 to-sky-600" },
      ...Object.entries(counts).map(([title, count]) => ({
        title,
        count,
        color: categoryColors[title] ?? "from-slate-500 to-slate-700",
      })),
    ];
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter((article: any) => {
      const matchesSearch =
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        article.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, query, selectedCategory]);

  const featured = filtered.slice(0, 3);

  const recentlyUpdated = [...filtered]
    .sort(
      (a: any, b: any) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
    )
    .slice(0, 6);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Hero */}
        <div className="page-header">
          <p className="subtitle">HELP CENTER</p>

          <h1>Knowledge Base</h1>

          <p>
            Search documentation, troubleshooting guides, FAQs and customer
            support articles.
          </p>

          <div className="relative mt-6 max-w-2xl">
            <Search
              className="absolute left-4 top-4 text-slate-400"
              size={20}
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search knowledge articles..."
              className="w-full rounded-full border border-cyan-500/30 bg-slate-900/70 py-4 pl-12 pr-5 text-white outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Categories */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Browse Categories
            </h2>

            <span className="text-sm text-slate-400">
              {categories.length - 1} Categories
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category: any) => (
              <button
                key={category.title}
                onClick={() => setSelectedCategory(category.title)}
                className={`glass-card rounded-[30px] p-[1px] text-left transition hover:scale-[1.02] ${
                  selectedCategory === category.title
                    ? "border border-cyan-400 bg-cyan-500/10"
                    : ""
                }`}
              >
                <div className="rounded-[28px] bg-slate-950 p-6">
                  <div
                    className={`inline-flex rounded-2xl bg-gradient-to-br ${category.color} p-3`}
                  >
                    <BookOpen className="text-white" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    {category.count} Articles
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-cyan-400">
                    Explore <ArrowRight size={16} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-3">
              <Star className="text-yellow-400" />

              <h2 className="text-2xl font-bold text-white">
                Featured Articles
              </h2>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              {featured.map((article: any) => (
                <article
                  key={article.id}
                  className="glass-card p-6 transition hover:border-cyan-500"
                >
                  <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">
                    Featured
                  </span>

                  <h3 className="mt-4 text-xl font-semibold text-white">
                    {article.title}
                  </h3>

                  <p className="mt-3 line-clamp-4 text-sm text-slate-400">
                    {article.content}
                  </p>

                  <div className="mt-6 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Clock3 size={15} />
                      {formatDate(article.updated_at)}
                    </span>

                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      Read →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Recently Updated */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <Clock3 className="text-cyan-400" />

            <h2 className="text-2xl font-bold text-white">
              Recently Updated
            </h2>
          </div>

          <div className="space-y-4">
            {recentlyUpdated.map((article: any) => (
              <div
                key={article.id}
                className="glass-card p-5 transition hover:border-cyan-500"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex-1">
                    <span className="rounded-full bg-cyan-600/20 px-3 py-1 text-xs text-cyan-300">
                      {article.category}
                    </span>

                    <h3 className="mt-3 text-lg font-semibold text-white">
                      {article.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                      {article.content}
                    </p>

                    <p className="mt-3 text-xs text-slate-500">
                      Updated {formatDate(article.updated_at)}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="rounded-full border border-cyan-500/40 px-4 py-2 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    Read Article
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="glass-card p-12 text-center">
            <Search size={42} className="mx-auto text-slate-500" />

            <h3 className="mt-5 text-xl font-semibold text-white">
              No articles found
            </h3>

            <p className="mt-2 text-slate-400">
              Try another keyword or choose a different category.
            </p>
          </div>
        )}

        {/* Article Drawer */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
            <div className="h-full w-full max-w-xl overflow-y-auto border-l border-slate-700 bg-slate-950 p-8">
              <div className="mb-6 flex items-center justify-between">
                <span className="rounded-full bg-cyan-600/20 px-3 py-1 text-xs text-cyan-300">
                  {selectedArticle.category}
                </span>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X size={22} />
                </button>
              </div>

              <h2 className="text-3xl font-bold text-white">
                {selectedArticle.title}
              </h2>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <Clock3 size={16} />
                Updated {formatDate(selectedArticle.updated_at)}
              </div>

              <p className="mt-8 whitespace-pre-wrap leading-8 text-slate-300">
                {selectedArticle.content}
              </p>

              <div className="mt-10 border-t border-slate-800 pt-6">
                <p className="mb-4 text-sm text-slate-400">
                  Was this article helpful?
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      successToast("Thanks for your feedback 👍")
                    }
                    className="flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-white hover:bg-emerald-500"
                  >
                    <ThumbsUp size={18} />
                    Helpful
                  </button>

                  <button
                    onClick={() =>
                      successToast("Feedback recorded. We'll improve this article.")
                    }
                    className="flex items-center gap-2 rounded-full border border-slate-700 px-5 py-2 text-slate-300 hover:bg-slate-800"
                  >
                    <ThumbsDown size={18} />
                    Not Helpful
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}






















