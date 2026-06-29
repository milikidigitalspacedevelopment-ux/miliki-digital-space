import { useState } from "react";

function NewsletterForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
    };

    console.log(payload);

    // future
    // await newsletterService.subscribe(payload)

    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="email"
          className="form-control"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn btn-warning">
          Subscribe
        </button>
      </div>
    </form>
  );
}

export default NewsletterForm;