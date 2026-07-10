import {
  BookOpen,
  Users,
  HandHeart,
  Briefcase,
  GraduationCap,
  Globe
} from "lucide-react";
import { Link } from "react-router-dom";

function FeaturesSection() {

  const features = [
    {
      icon: <GraduationCap size={32} />,
      title: "Skills Training",
      color: "primary",
      path: "/courses"
    },
    {
      icon: <Briefcase size={32} />,
      title: "Entrepreneurship",
      color: "success",
      path: "/programs"
    },
    {
      icon: <HandHeart size={32} />,
      title: "Community Support",
      color: "danger",
      path: "/success-stories"
    },
    {
      icon: <BookOpen size={32} />,
      title: "Mentorship",
      color: "warning",
      path: "/resources"
    },
    {
      icon: <Users size={32} />,
      title: "Volunteer Programs",
      color: "info",
      path: "/volunteer"
    },
    {
      icon: <Globe size={32} />,
      title: "Global Partnerships",
      color: "secondary",
      path: "/partners"
    }
  ];

  return (
    <section className="py-3 bg-light">

      <div className="container">

        <div className="row g-3 g-md-4">

          {features.map((item, index) => (

            <div
              key={index}
              className="col-6 col-sm-4 col-md-4 col-lg-4"
            >

              <Link 
                to={item.path}
                style={{ textDecoration: "none" }}
              >
                <div
                  className={`card border-0 shadow text-center bg-${item.color}-subtle`}
                  style={{
                    borderRadius: "30px 8px 30px 8px",
                    minHeight: "auto",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
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
              </Link>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default FeaturesSection;