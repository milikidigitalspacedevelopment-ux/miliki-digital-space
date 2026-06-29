import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function DonationForm() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {

    try {

      console.log(data);

      // await donationService.createDonation(data)

      toast.success("Donation initiated");

    } catch (error) {

      toast.error("Donation failed");

    }

  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Full Name"
          {...register("donor_name", {
            required: true
          })}
        />
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
          placeholder="Phone Number"
          {...register("phone")}
        />
      </div>

      <div className="mb-3">

        <input
          type="number"
          className="form-control"
          placeholder="Amount"
          {...register("amount", {
            required: true,
            min: 100
          })}
        />

        <small className="text-danger">
          {errors.amount &&
            "Minimum amount is Ksh 100"}
        </small>

      </div>

      <div className="mb-4">

        <select
          className="form-select"
          {...register("payment_method")}
        >

          <option value="mpesa">
            M-Pesa
          </option>

          <option value="paypal">
            PayPal
          </option>

          <option value="card">
            Card
          </option>

        </select>

      </div>

      <button
        className="btn btn-warning w-100"
        disabled={isSubmitting}
      >
        Donate Now
      </button>

    </form>
  );
}

export default DonationForm;