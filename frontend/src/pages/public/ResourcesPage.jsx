import { useEffect, useState } from "react";
import PageBanner from "../../components/common/PageBanner";
import CTASection from "../../components/sections/CTASection";
import blogService from "../../services/blogService";
import courseService from "../../services/courseService";
import programService from "../../services/programService";

function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadResources = async () => {
      try {
        const [programsResponse, coursesResponse, blogsResponse] = await Promise.all([
          programService.getPrograms().catch(() => []),
          courseService.getCourses().catch(() => []),
          blogService.getBlogs().catch(() => []),
        ]);

        const normalizeList = (payload) => {
          if (Array.isArray(payload)) return payload;
          if (Array.isArray(payload?.data)) return payload.data;
          if (Array.isArray(payload?.items)) return payload.items;
          if (Array.isArray(payload?.programs)) return payload.programs;
          if (Array.isArray(payload?.courses)) return payload.courses;
          if (Array.isArray(payload?.blogs)) return payload.blogs;
          return [];
        };

        const nextResources = [
          ...normalizeList(programsResponse).slice(0, 3).map((item) => ({
            id: item.id || item._id || item.slug,
            title: item.title || item.name || "Program resource",
            type: "Program",
            description: item.description || item.summary || "Explore this program to learn more.",
          })),
          ...normalizeList(coursesResponse).slice(0, 3).map((item) => ({
            id: item.id || item._id || item.slug,
            title: item.title || item.name || "Course resource",
            type: "Course",
            description: item.description || item.summary || "Join this course to build practical skills.",
          })),
          ...normalizeList(blogsResponse).slice(0, 3).map((item) => ({
            id: item.id || item._id || item.slug,
            title: item.title || item.name || "Article resource",
            type: "Article",
            description: item.summary || item.excerpt || "Read our latest insights and stories.",
          })),
        ].slice(0, 6);

        if (active) {
          setResources(nextResources);
        }
      } catch (error) {
        console.error("Failed to load resources", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadResources();

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageBanner
        title="Resources"
        subtitle="Download useful materials and learning guides."
      />

      <section className="container py-5">
        {loading ? (
          <div className="text-center py-5 text-muted">Loading resources...</div>
        ) : (
          <div className="row g-4">
            {resources.map((resource) => (
              <div className="col-md-6 col-xl-4" key={resource.id}>
                <div className="card border-0 shadow rounded-5 h-100">
                  <div className="card-body p-4">
                    <span className="badge bg-success mb-3">{resource.type}</span>
                    <h5 className="fw-bold">{resource.title}</h5>
                    <p className="text-muted mt-3 mb-0">{resource.description}</p>
                    <button className="btn btn-primary rounded-pill mt-3">Explore</button>
                  </div>
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

export default ResourcesPage;