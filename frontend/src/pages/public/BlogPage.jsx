import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageBanner from "../../components/common/PageBanner";
import SearchBar from "../../components/filters/SearchBar";
import BlogCard from "../../components/cards/BlogCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import CTASection from "../../components/sections/CTASection";

import blogService from "../../services/blogService";

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    try {
      const response = await blogService.getBlogs();
      const payload = Array.isArray(response) ? response : response?.data || response?.blogs || [];
      setBlogs(payload);
    } catch (error) {
      console.error(error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    (blog.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageBanner
        title="Blog & News"
        subtitle="Stories, insights and updates from our community."
      />

      <section className="container py-5">

        <div className="mb-5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search articles..."
          />
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
                className="col-md-6 col-xl-4"
                key={blog.id}
              >
                <BlogCard blog={blog} />

                <div className="mt-3">
                  <Link
                    to={`/blogs/${blog.id || blog.slug}`}
                    className="btn btn-primary rounded-pill"
                  >
                    Read Article
                  </Link>
                </div>

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