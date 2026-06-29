import {
  BookOpen,
  Users,
  HandHeart,
  Briefcase,
  GraduationCap,
  Globe
} from "lucide-react";

function FeaturesSection() {

  const features = [
    {
      icon: <GraduationCap size={32} />,
      title: "Skills Training",
      color: "primary"
    },
    {
      icon: <Briefcase size={32} />,
      title: "Entrepreneurship",
      color: "success"
    },
    {
      icon: <HandHeart size={32} />,
      title: "Community Support",
      color: "danger"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Mentorship",
      color: "warning"
    },
    {
      icon: <Users size={32} />,
      title: "Volunteer Programs",
      color: "info"
    },
    {
      icon: <Globe size={32} />,
      title: "Global Partnerships",
      color: "secondary"
    }
  ];

  return (
    <section className="py-5 bg-light">

      <div className="container">

        <div className="row g-3 g-md-4">

          {features.map((item, index) => (

            <div
              key={index}
              className="col-6 col-sm-4 col-md-4 col-lg-4"
            >

              <div
                className={`card border-0 shadow text-center bg-${item.color}-subtle`}
                style={{
                  borderRadius: "30px 8px 30px 8px",
                  minHeight: "auto"
                }}
              >

                <div className="card-body p-3">

                  <div
                    className={`text-${item.color} mb-3`}
                  >
                    {item.icon}
                  </div>

                  <h5 className="mb-0 fs-6 fw-semibold">{item.title}</h5>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default FeaturesSection;