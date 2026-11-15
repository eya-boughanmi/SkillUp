
import { Link } from "react-router";
import "./About.css";

function About() {
  const values = [
    {
      icon: "♡",
      title: "Human first",
      description:
        "AI assists decisions — people make them.",
    },
    {
      icon: "◎",
      title: "Fair by design",
      description:
        "We score skills and experience, never identity.",
    },
    {
      icon: "♧",
      title: "Radically clear",
      description:
        "Every score comes with an explanation.",
    },
  ];

  const testimonials = [
    {
      quote:
        "The AI analysis showed me exactly what my CV was missing. Two weeks later I had three interviews.",
      initials: "LM",
      name: "Léa Martin",
      role: "Product Designer at Nova Health",
    },
    {
      quote:
        "Ranked shortlisted candidates by how we hire. We spend our time talking to the right people.",
      initials: "CN",
      name: "Chidi Nwosu",
      role: "Head of Talent at Nova Labs",
    },
    {
      quote:
        "Seeing my match score before applying saved me so much time. It feels like having a coach.",
      initials: "YA",
      name: "Yassine Ben Ali",
      role: "Full Stack Engineer",
    },
  ];

  return (
    <main className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
       {/*<span className="about-eyebrow">About us</span>*/}

        <h1>
          We believe talent is
          <br />
          everywhere.
          <br />
          Opportunity should be
          <br />
          too.
        </h1>

        <p className="about-intro">
          SkillUp was born from a simple frustration:
          great people get lost in piles of CVs.
          We use AI to surface potential and give every
          candidate a clear, fair shot.
        </p>

        <div className="about-values">
          {values.map((value, index) => (
            <article className="value-card" key={index}>
              <span className="value-icon">{value.icon}</span>
              <h3>{value.title}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="about-stats">
        <div className="stat-item">
          <strong>12,400+</strong>
          <span>Talents matched</span>
        </div>

        <div className="stat-item">
          <strong>860+</strong>
          <span>Hiring companies</span>
        </div>

        <div className="stat-item">
          <strong>60%</strong>
          <span>Faster screening</span>
        </div>

        <div className="stat-item">
          <strong>94%</strong>
          <span>Match accuracy</span>
        </div>
      </section>

      {/* Testimonials */}
      <section className="about-testimonials">
        {testimonials.map((item, index) => (
          <article className="testimonial-card" key={index}>
            <span className="quote-icon">❞</span>

            <p className="testimonial-quote">
              "{item.quote}"
            </p>

            <div className="testimonial-author">
              <div className={`author-avatar avatar-${index}`}>
                {item.initials}
              </div>

              <div>
                <h4>{item.name}</h4>
                <span>{item.role}</span>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Call To Action */}
      <section className="about-cta">
        <span className="cta-icon">✧</span>

        <h2>
          Your next opportunity
          <br />
          starts here.
        </h2>

        <p>
          Join thousands of talents and recruiters
          building better careers with SkillUp.
        </p>

        <div className="cta-buttons">
          <Link to="/register" className="cta-primary">
            Create free account
          </Link>

          <Link to="/login" className="cta-secondary">
            ↗ Try the demo
          </Link>
        </div>
      </section>

    </main>
  );
}

export default About;
