import { useEffect, useState } from "react";
import testimonialService from "../../services/testimonialService";

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const data = await testimonialService.getTestimonials("approved");
        setTestimonials(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadTestimonials();
  }, []);

  return (
    <section className="py-3">

      <div className="container">

        <h2 className="fw-bold mb-5">
          Testimonials
        </h2>

        {loading ? (
          <div className="text-muted">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-muted">No testimonials yet. Be the first to share yours.</div>
        ) : (
          <div className="testimonial-marquee-wrapper">
            <div className="testimonial-marquee-track">
              {testimonials.concat(testimonials).map((item, index) => (
                <div className="testimonial-card" key={`${item.name}-${index}`}>
                  <div className="card h-100 shadow-sm border-0">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="card-img-top" style={{ height: 180, objectFit: "cover" }} />
                    ) : null}
                    <div className="card-body">
                      <p className="fst-italic mb-4">"{item.quote}"</p>
                      <h6 className="fw-bold mb-1">{item.name}</h6>
                      <small className="text-muted">{item.role}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </section>
  );
}

export default TestimonialsSection;