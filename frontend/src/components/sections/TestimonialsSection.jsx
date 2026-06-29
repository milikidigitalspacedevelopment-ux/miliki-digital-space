function TestimonialsSection() {
  const testimonials = [
    {
      name: "Jane Doe",
      role: "Graduate",
      quote: "The training transformed my life.",
    },
    {
      name: "John Smith",
      role: "Volunteer",
      quote: "Amazing community impact.",
    },
    {
      name: "Mary Wanjiru",
      role: "Participant",
      quote: "I found confidence and practical skills.",
    },
    {
      name: "Samuel K.",
      role: "Trainer",
      quote: "The community energy is inspiring.",
    },
  ];

  return (
    <section className="py-5">

      <div className="container">

        <h2 className="fw-bold mb-5">
          Testimonials
        </h2>

        <div className="testimonial-marquee-wrapper">
          <div className="testimonial-marquee-track">
            {testimonials.concat(testimonials).map((item, index) => (
              <div className="testimonial-card" key={`${item.name}-${index}`}>
                <div className="card h-100 shadow-sm border-0">
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

      </div>

    </section>
  );
}

export default TestimonialsSection;