import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";

function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post("/contacts", data);
      toast.success("Message sent successfully");
      reset();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className="mb-3">
        <label className="form-label">
          Full Name
        </label>

        <input
          className="form-control"
          {...register("name", {
            required: "Name is required"
          })}
        />

        <small className="text-danger">
          {errors.name?.message}
        </small>
      </div>

      <div className="mb-3">

        <label className="form-label">
          Email Address
        </label>

        <input
          type="email"
          className="form-control"
          {...register("email", {
            required: "Email is required"
          })}
        />

        <small className="text-danger">
          {errors.email?.message}
        </small>

      </div>

      <div className="mb-3">

        <label className="form-label">
          Subject
        </label>

        <input
          className="form-control"
          {...register("subject")}
        />

      </div>

      <div className="mb-4">

        <label className="form-label">
          Message
        </label>

        <textarea
          rows="5"
          className="form-control"
          {...register("message", {
            required: "Message is required"
          })}
        />

        <small className="text-danger">
          {errors.message?.message}
        </small>

      </div>

      <button
        className="btn btn-success"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>

    </form>
  );
}

export default ContactForm;