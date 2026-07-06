import { useState } from "react";
import { ArrowRight, HeartHandshake, Users, Sparkles, CalendarDays, ShieldCheck, CheckCircle2 } from "lucide-react";
import PageBanner from "../../components/common/PageBanner";
import VolunteerForm from "../../components/forms/VolunteerForm";

function VolunteerPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <PageBanner title="Volunteer With Miliki" subtitle="Serve your community through mentorship, events, and digital support." />

      <section className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-lg-7">
            <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill mb-3">Community impact</span>
            <h1 className="display-5 fw-bold mb-3">Give your time and skills to create lasting change.</h1>
            <p className="lead text-muted">Join a growing network of volunteers supporting learners, events, outreach, and technology programs across Kenya.</p>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <div className="bg-light rounded-4 px-3 py-3">
                <div className="fw-bold">800+</div>
                <small className="text-muted">Volunteers</small>
              </div>
              <div className="bg-light rounded-4 px-3 py-3">
                <div className="fw-bold">120+</div>
                <small className="text-muted">Community events</small>
              </div>
              <div className="bg-light rounded-4 px-3 py-3">
                <div className="fw-bold">54</div>
                <small className="text-muted">Communities reached</small>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow rounded-4 p-4">
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-success text-white p-3 me-3"><HeartHandshake size={24} /></div>
                <div>
                  <h4 className="fw-bold mb-0">Why volunteer?</h4>
                  <p className="text-muted mb-0">Your skills can power real impact.</p>
                </div>
              </div>
              <ul className="list-unstyled">
                <li className="d-flex align-items-center mb-2"><CheckCircle2 size={18} className="text-success me-2" />Mentor learners and youth</li>
                <li className="d-flex align-items-center mb-2"><CheckCircle2 size={18} className="text-success me-2" />Support community events</li>
                <li className="d-flex align-items-center mb-2"><CheckCircle2 size={18} className="text-success me-2" />Use your tech or admin skills</li>
                <li className="d-flex align-items-center"><CheckCircle2 size={18} className="text-success me-2" />Gain leadership experience</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                <div className="rounded-circle bg-primary text-white p-3 mb-3" style={{ width: 48, height: 48 }}><Users size={22} /></div>
                <h5 className="fw-bold">Community service</h5>
                <p className="text-muted mb-0">Support outreach, training sessions, and direct community programs.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                <div className="rounded-circle bg-warning text-white p-3 mb-3" style={{ width: 48, height: 48 }}><Sparkles size={22} /></div>
                <h5 className="fw-bold">Grow your skills</h5>
                <p className="text-muted mb-0">Develop confidence, communication, and leadership through hands-on service.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
                <div className="rounded-circle bg-info text-white p-3 mb-3" style={{ width: 48, height: 48 }}><CalendarDays size={22} /></div>
                <h5 className="fw-bold">Flexible opportunities</h5>
                <p className="text-muted mb-0">Choose events, mentorship, or administrative support that fits your availability.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="card border-0 shadow rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-lg-7 p-5">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">Volunteer application</span>
              <h2 className="fw-bold mb-3">Ready to join?</h2>
              <p className="text-muted">Tell us about your interests and availability. We’ll review your application and get back to you shortly.</p>
              <div className="d-flex align-items-center text-success mt-3"><ShieldCheck size={18} className="me-2" />Trusted process with quick follow-up.</div>
            </div>
            <div className="col-lg-5 bg-dark text-white p-5 d-flex flex-column justify-content-center">
              <h4 className="fw-bold mb-3">Start your impact journey</h4>
              <p className="text-light-emphasis">Fill out the form and become part of our volunteer network.</p>
              <button className="btn btn-success rounded-pill px-4 align-self-start" onClick={() => setSubmitted(true)}>
                {submitted ? "Application received" : "Apply now"} <ArrowRight size={18} className="ms-2" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-5">
        <VolunteerForm />
      </section>
    </>
  );
}

export default VolunteerPage;