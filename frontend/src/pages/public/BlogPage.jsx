import { useEffect, useMemo, useState } from "react";

import SearchBar from "../../components/filters/SearchBar";
import BlogCard from "../../components/cards/BlogCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import CTASection from "../../components/sections/CTASection";

import blogService from "../../services/blogService";
import { fetchPublicRows } from "../../services/supabaseRead";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await fetchPublicRows({
        table: "blogs",
        columns: "id, slug, title, excerpt, featured_image, created_at, status, published_at",
        orderBy: "created_at",
        ascending: false,
      });

      const payload = Array.isArray(response) ? response : [];
      const publicBlogs = payload.filter((blog) => {
        const status = (blog?.status || "").toLowerCase();
        return !["draft", "archived"].includes(status);
      });

      setBlogs(publicBlogs);
    } catch (error) {
      console.error("Failed to load blogs from Supabase", error);

      try {
        const fallback = await blogService.getBlogs();
        const payload = Array.isArray(fallback) ? fallback : fallback?.data || fallback?.blogs || [];
        setBlogs(Array.isArray(payload) ? payload : []);
      } catch (fallbackError) {
        console.error("Failed to load blogs from API fallback", fallbackError);
        setBlogs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const unique = [...new Set(blogs.map((blog) => blog.category || blog.category_name || "General"))].filter(Boolean);
    return ["All", ...unique];
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    const query = search.toLowerCase();

    return [...blogs]
      .filter((blog) => {
        const title = (blog.title || "").toLowerCase();
        const excerpt = (blog.excerpt || "").toLowerCase();
        const categoryName = (blog.category || blog.category_name || "General").toLowerCase();
        const matchesSearch = title.includes(query) || excerpt.includes(query);
        const matchesCategory = category === "All" || categoryName === category.toLowerCase();
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return new Date(a.created_at || a.createdAt || 0) - new Date(b.created_at || b.createdAt || 0);
        }

        if (sortBy === "title") {
          return (a.title || "").localeCompare(b.title || "");
        }

        return new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0);
      });
  }, [blogs, category, search, sortBy]);

  return (
    <>
      <section className="container py-4 py-md-5">
        <div className="rounded-4 border border-light-subtle bg-white shadow-sm p-3 p-md-4 mb-4 mb-md-5">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <p className="text-success fw-semibold mb-1">Latest stories</p>
              <h2 className="h4 fw-bold mb-0">Discover practical insights and community updates.</h2>
            </div>
          </div>

          <div className="row g-3 mt-3">
            <div className="col-12 col-md-7">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search articles..."
              />
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-select form-select-sm rounded-pill border-0 shadow-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-select form-select-sm rounded-pill border-0 shadow-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="title">A–Z</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredBlogs.length === 0 ? (
          <EmptyState
            title="No Articles Found"
            message="No matching articles available."
          />
        ) : (
          <div className="row g-4">

            {filteredBlogs.map((blog) => (
              <div
                className="col-sm-6 col-lg-4"
                key={blog.id}
              >
                <BlogCard blog={blog} />
              </div>
            ))}

          </div>
        )}

      </section>

      <CTASection />
    </>
  );
}

export default BlogPage;