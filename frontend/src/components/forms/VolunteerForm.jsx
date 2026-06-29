import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function VolunteerForm() {

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {

    try {

      console.log(data);

      toast.success(
        "Application submitted successfully"
      );

      reset();

    } catch (error) {

      toast.error(
        "Application failed"
      );

    }

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className="row">

        <div className="col-md-6 mb-3">
          <input
            className="form-control"
            placeholder="First Name"
            {...register("first_name")}
          />
        </div>

        <div className="col-md-6 mb-3">
          <input
            className="form-control"
            placeholder="Last Name"
            {...register("last_name")}
          />
        </div>

      </div>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Email"
          {...register("email")}
        />
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Phone"
          {...register("phone")}
        />
      </div>

      <div className="mb-3">

        <textarea
          rows="4"
          className="form-control"
          placeholder="Skills and experience"
          {...register("skills")}
        />

      </div>

      <button
        className="btn btn-success"
        disabled={isSubmitting}
      >
        Submit Application
      </button>

    </form>
  );
}

export default VolunteerForm;