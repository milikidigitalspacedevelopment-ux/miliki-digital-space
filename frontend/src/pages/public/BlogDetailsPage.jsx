import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import BlogCard from "../../components/cards/BlogCard";
import CTASection from "../../components/sections/CTASection";

import blogService from "../../services/blogService";

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function BlogDetailsPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [error, setError] = useState("");
  const startTimeRef = useRef(Date.now());
  const hasTrackedViewRef = useRef(false);
  const hasSentTimeRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    hasTrackedViewRef.current = false;
    hasSentTimeRef.current = false;
    setBlog(null);
    setRelatedBlogs([]);
    setError("");
    void loadBlog();
  }, [slug]);

  useEffect(() => {
    if (!blog) return;

    updatePageMetadata(blog);

    if (!hasTrackedViewRef.current) {
      hasTrackedViewRef.current = true;
      void blogService.trackView(blog.slug || blog.id).catch(() => null);
    }

    void loadRelatedBlogs(blog);
  }, [blog]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendTimeSpent();
      }
    };

    const handleBeforeUnload = () => {
      sendTimeSpent();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sendTimeSpent();
    };
  }, [blog]);

  const updateMetaTag = (attrName, attrValue, content) => {
    const selector = `meta[${attrName}="${attrValue}"]`;
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attrName, attrValue);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  const updatePageMetadata = (blogData) => {
    const pageUrl = window.location.href;
    document.title = `${blogData.title} | Miliki`;

    updateMetaTag("property", "og:title", blogData.title);
    updateMetaTag("property", "og:description", blogData.excerpt || "Read this article on Miliki Digital Space.");
    updateMetaTag("property", "og:image", blogData.image);
    updateMetaTag("property", "og:url", pageUrl);
    updateMetaTag("property", "og:type", "article");
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", blogData.title);
    updateMetaTag("name", "twitter:description", blogData.excerpt || "Read this article on Miliki Digital Space.");
    updateMetaTag("name", "twitter:image", blogData.image);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);
  };

  const formatBlogContent = (rawContent) => {
    if (!rawContent) return "";

    let content = String(rawContent)

      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`{1,3}([^`]+)`{1,3}/g, "$1")
      .replace(/~~(.+?)~~/g, "$1")
      .replace(/\s{2,}/g, " ")
      .trim();

    const hasHtmlTags = /<[^>]+>/.test(content);
    if (hasHtmlTags) {
      return content;
    }

    const sentences = content
      .split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-Þ0-9])/g)
      .map((sentence) => sentence.trim())
      .filter(Boolean);

    return sentences.map((sentence) => `<p>${sentence}</p>`).join("");
  };

  const loadBlog = async () => {
    try {
      const response = await blogService.getBlogBySlug(slug);
      const blogData = response?.data || response;

      setBlog({
        ...blogData,
        title: blogData?.title || "Untitled article",
        image: blogData?.featured_image || blogData?.image || "/images/blog.jpg",
        author: blogData?.author_name || blogData?.author || "Miliki Team",
        date:
          blogData?.published_at
            ? new Date(blogData.published_at).toLocaleDateString()
            : blogData?.date || "TBD",
        readTime:
          blogData?.readTime ||
          `${Math.max(3, Math.ceil((String(blogData?.content || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).length || 0) / 200))} min read`,
        content: formatBlogContent(blogData?.content || blogData?.excerpt || "No content available yet."),
        excerpt: blogData?.excerpt || "",
        views: Number(blogData?.views || 0),
        share_count: Number(blogData?.share_count || 0),
      });
    } catch (error) {
      console.error(error);
      setError("Unable to load this article. Please try again later.");
    }
  };

  const loadRelatedBlogs = async (blogData) => {
    try {
      const params = { perPage: 4 };
      if (blogData.category_name) {
        params.category = blogData.category_name;
      }

      const response = await blogService.getBlogs(params);
      const related = Array.isArray(response)
        ? response.filter((item) => item.id !== blogData.id && item.slug !== blogData.slug)
        : [];

      setRelatedBlogs(related.slice(0, 3));
    } catch (error) {
      console.error("Failed to load related articles", error);
    }
  };

  const sendTimeSpent = () => {
    if (!blog || hasSentTimeRef.current) return;

    const seconds = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000));
    if (seconds <= 0) return;
    hasSentTimeRef.current = true;

    try {
      const endpoint = `${apiBaseUrl}/blogs/${blog.slug || blog.id}/track-time`;
      const payload = JSON.stringify({ seconds });

      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon(endpoint, blob);
      } else {
        void fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => null);
      }
    } catch (error) {
      console.error("Failed to send time spent", error);
    }
  };

  const heroWrapperStyles = {
    width: "100%",
    maxHeight: "clamp(260px, 32vw, 420px)",
    minHeight: "240px",
    overflow: "hidden",
  };

  const heroImageStyles = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  };

  const openShareWindow = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShare = async (provider) => {
    if (!blog) return;

    const pageUrl = window.location.href;
    const text = `${blog.title} — ${blog.excerpt || "Read this article on Miliki Digital Space."}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(pageUrl);
    let shareUrl = "";

    switch (provider) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    openShareWindow(shareUrl);
    void blogService.trackShare(blog.slug || blog.id).catch(() => null);
  };

  const shareStats = useMemo(() => {
    if (!blog) return null;
    return [
      { label: "Views", value: blog.views },
      { label: "Shares", value: blog.share_count },
      { label: "Read time", value: blog.readTime },
    ];
  }, [blog]);

  if (!blog) {
    return (
      <section className="container py-5">
        <div className="alert alert-info">Loading article...</div>
      </section>
    );
  }

  return (
    <>
      <section className="container py-5">

        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Blog", path: "/blogs" },
            { label: blog.title },
          ]}
        />

        <div className="row g-5">

          <div className="col-lg-9">

            <div className="overflow-hidden rounded-5 shadow mb-4" style={heroWrapperStyles}>
              <img
                src={blog.image}
                alt={blog.title}
                className="img-fluid"
                style={heroImageStyles}
              />
            </div>

            <h1 className="fw-bold mb-3">
              {blog.title}
            </h1>

            <div className="text-muted mb-4">
              {blog.author} · {blog.date} · {blog.readTime}
            </div>

            <article
              className="blog-content"
              style={{ fontSize: "1rem", lineHeight: 1.8, color: "#212529", width: "100%", maxWidth: "100%" }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

          </div>

          <div className="col-lg-3">

            <div className="blog-details-sidebar position-sticky">
              <div className="card border-0 shadow-sm rounded-5 mb-4">
                <div className="card-body">
                  <h5 className="fw-bold mb-4">Share this article</h5>

                  <div className="blog-share-buttons d-flex flex-nowrap gap-2 mb-3">
                    <button type="button" className="btn btn-primary rounded-pill flex-fill" onClick={() => handleShare("facebook")}>Facebook</button>
                    <button type="button" className="btn btn-info rounded-pill flex-fill text-white" onClick={() => handleShare("twitter")}>Twitter</button>
                    <button type="button" className="btn btn-success rounded-pill flex-fill" onClick={() => handleShare("whatsapp")}>WhatsApp</button>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-5">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">About this article</h5>
                  <p className="mb-2"><strong>Category:</strong> {blog.category_name || blog.category || "General"}</p>
                  <p className="mb-2"><strong>Author:</strong> {blog.author}</p>
                  <p className="mb-0"><strong>Published:</strong> {blog.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedBlogs.length > 0 && (
          <div className="mt-5">
            <h2 className="fw-bold mb-4">Related articles</h2>
            <div className="row g-4">
              {relatedBlogs.map((related) => (
                <div className="col-md-6" key={related.id || related.slug}>
                  <BlogCard blog={related} />
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger mt-4">{error}</div>}
      </section>

      <CTASection />
    </>
  );
}

export default BlogDetailsPage;