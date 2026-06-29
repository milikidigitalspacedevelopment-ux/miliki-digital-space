import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import BlogCard from "../../components/cards/BlogCard";
import CTASection from "../../components/sections/CTASection";

import blogService from "../../services/blogService";

function BlogDetailsPage() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);

  useEffect(() => {
    loadBlog();
  }, [id]);

  const loadBlog = async () => {
    try {
      const response = await blogService.getBlogById(id);
      setBlog(response.data);
    } catch {
      setBlog({
        title: "Empowering Youth Through Digital Skills",
        image: "/images/blog.jpg",
        author: "Miliki Team",
        date: "July 2026",
        readTime: "5 min read",
        content: `
Digital literacy is becoming one of the most important skills for the modern world.

Our programs are equipping young people with practical knowledge that creates employment opportunities and encourages innovation.
        `,
      });
    }
  };

  if (!blog) return null;

  return (
    <>
      <section className="container py-5">

        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Blog", path: "/blog" },
            { label: blog.title },
          ]}
        />

        <div className="row g-5">

          <div className="col-lg-8">

            <img
              src={blog.image}
              alt={blog.title}
              className="img-fluid rounded-5 shadow mb-4"
            />

            <h1 className="fw-bold mb-3">
              {blog.title}
            </h1>

            <div className="text-muted mb-4">
              {blog.author} · {blog.date} · {blog.readTime}
            </div>

            <div className="fs-5 lh-lg">
              {blog.content}
            </div>

          </div>

          <div className="col-lg-4">

            <div
              className="p-4 shadow"
              style={{
                borderRadius: "30px",
                position: "sticky",
                top: "100px",
                background: "rgba(255,255,255,.9)",
                backdropFilter: "blur(15px)",
              }}
            >
              <h5 className="fw-bold mb-4">
                Share Article
              </h5>

              <button className="btn btn-outline-primary w-100 rounded-pill mb-3">
                Facebook
              </button>

              <button className="btn btn-outline-info w-100 rounded-pill mb-3">
                Twitter
              </button>

              <button className="btn btn-outline-success w-100 rounded-pill">
                WhatsApp
              </button>

            </div>

          </div>

        </div>

        <div className="mt-5">

          <h2 className="fw-bold mb-4">
            Related Articles
          </h2>

          <div className="row g-4">

            {[1, 2].map((item) => (
              <div
                className="col-md-6"
                key={item}
              >
                <BlogCard />
              </div>
            ))}

          </div>

        </div>

      </section>

      <CTASection />
    </>
  );
}

export default BlogDetailsPage;