import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";

function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const loadFaqs = async () => {
    try {
      const response = await api.get("/faqs");
      setFaqs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post("/faqs", data);
      toast.success("Your question has been submitted");
      reset();
      await loadFaqs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to submit your question");
    }
  };

  return (
    <section className="py-3">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Frequently Asked Questions</h2>
          <p className="text-muted mb-0">Browse common questions or submit your own below.</p>
        </div>

        {loading ? (
          <div className="text-center text-muted">Loading questions...</div>
        ) : (
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, index) => (
              <div key={faq.id || index} className="accordion-item border-0 shadow-sm mb-3" style={{ borderRadius: "25px" }}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${index === 0 ? "" : "collapsed"} rounded-4`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq${index + 1}`}
                  >
                    {faq.question}
                  </button>
                </h2>
                <div id={`faq${index + 1}`} className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`} data-bs-parent="#faqAccordion">
                  <div className="accordion-body">
                    {faq.answer || "Thanks for asking — we will review your question and respond soon."}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="card border-0 shadow-sm rounded-4 p-4 mt-4">
          <h4 className="fw-bold mb-3">Ask a new question</h4>
          <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
            <div className="col-md-6">
              <input className="form-control" placeholder="Your name" {...register("name")} />
            </div>
            <div className="col-md-6">
              <input type="email" className="form-control" placeholder="Your email" {...register("email")} />
            </div>
            <div className="col-12">
              <textarea rows="4" className="form-control" placeholder="Type your question" {...register("question", { required: "Question is required" })} />
              <small className="text-danger">{errors.question?.message}</small>
            </div>
            <div className="col-12">
              <button className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit question"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;