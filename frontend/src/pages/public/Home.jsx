
import { useEffect } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import "./Home.css";
import { UserRound, Compass, Target } from "lucide-react";
import { Brain } from "lucide-react";
import {
  BrainCircuit,
  FileSearch,
  UsersRound,
  Clock3,
  Quote
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const jobs = [
  {
    initials: "NL",
    title: "Senior Frontend Developer",
    company: "Nova Labs",
    location: "Remote",
    salary: "$70k – $95k",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    applicants: 48,
    color: "lavender",
  },
  {
    initials: "KH",
    title: "Product Designer (UI/UX)",
    company: "Kora Health",
    location: "Lagos",
    salary: "$45k – $60k",
    tags: ["Figma", "Prototyping", "User Research"],
    applicants: 31,
    color: "peach",
  },
  {
    initials: "AA",
    title: "Machine Learning Engineer",
    company: "Atlas AI",
    location: "Paris",
    salary: "€75k – €90k",
    tags: ["Python", "PyTorch", "NLP"],
    applicants: 64,
    color: "blue",
  },
  {
    initials: "SP",
    title: "Full Stack Developer",
    company: "Sahel Pay",
    location: "Casablanca",
    salary: "$4k / month",
    tags: ["React", "Node.js", "PostgreSQL"],
    applicants: 27,
    color: "mint",
  },
  {
    initials: "BC",
    title: "Growth Marketing Manager",
    company: "Bloom Commerce",
    location: "Nairobi",
    salary: "Full-time",
    tags: ["SEO", "Analytics", "Lifecycle"],
    applicants: 19,
    color: "peach",
  },
  {
    initials: "MB",
    title: "Junior Data Analyst",
    company: "Medina Bank",
    location: "Tunis",
    salary: "1,200 TND / month",
    tags: ["SQL", "Power BI", "Excel"],
    applicants: 82,
    color: "lavender",
  },
];

const steps = [
  {
    number: "01",
    icon: UserRound,
    title: "Create Your Profile",
    description:
      "Upload your CV and let our AI extract your skills, experience and strengths in seconds.",
  },
  {
    number: "02",
    icon: Compass,
    title: "Discover Opportunities",
    description:
      "Browse curated roles from ambitious companies, filtered to what truly fits you.",
  },
  {
    number: "03",
    icon: Target,
    title: "Get Matched with AI",
    description:
      "Receive a compatibility score for every role and know exactly where you stand.",
  },
];

const benefits = [
  {
    icon: <BrainCircuit size={23} />,
    title: "AI-Powered Matching",
    description: "Connect the right talent with the right opportunities using intelligent matching."
  },
  {
    icon: <FileSearch size={23} />,
    title: "Smart CV Analysis",
    description: "Analyze CVs and identify relevant skills with intelligent insights."
  },
  {
    icon: <UsersRound size={23} />,
    title: "Better Connections",
    description: "Create meaningful connections between recruiters and candidates."
  },
  {
    icon: <Clock3 size={23} />,
    title: "Save Valuable Time",
    description: "Simplify recruitment tasks and focus on what truly matters."
  },
];

const testimonials = [
  {
    quote:
      "The AI analysis showed me exactly what my CV was missing. Two weeks later I had three interviews.",
    initials: "LM",
    name: "Léa Martin",
    role: "Product Designer at Kora Health",
  },
  {
    quote:
      "Ranked shortlists changed how we hire. We spend our time talking to the right people.",
    initials: "CN",
    name: "Chidi Nwosu",
    role: "Head of Talent, Nova Labs",
  },
  {
    quote:
      "Seeing a match score before applying saved me so much time. It feels like having a coach.",
    initials: "YB",
    name: "Yassine Ben Ali",
    role: "Full Stack Engineer",
  },
];

function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

function DashboardPreview() {
  return (
    <div className="su-hero-visual">

      <motion.div
        className="su-dashboard"
        initial={{ opacity: 0, y: 50, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="su-dashboard-header">
          <div>
            <span>AI Recruitment Overview</span>
            <h3>Senior Frontend Developer</h3>
          </div>
          <span className="su-live"><i /> Live</span>
        </div>

        <div className="su-chart">
          {[38, 57, 45, 75, 61, 88, 70, 84].map((height, i) => (
            <motion.div
              key={i}
              className="su-chart-bar"
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{
                duration: 0.9,
                delay: 0.8 + i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <div className="su-dashboard-stats">
          <div><strong>148</strong><span>Applicants</span></div>
          <div><strong>32</strong><span>Shortlisted</span></div>
          <div><strong>6</strong><span>Interviews</span></div>
        </div>
      </motion.div>

      <motion.div
        className="su-ats-card"
        animate={{ y: [0, -12, 0], rotate: [1, -1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="su-card-label">▧ &nbsp; CV analysed</div>
        <h4>ATS score 78% · 3 skills to add</h4>
        <div className="su-progress"><span /></div>
      </motion.div>

      <motion.div
        className="su-candidate-card"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="su-avatar">AO</div>
        <div>
          <strong>Amara Okafor</strong>
          <span>Frontend Developer</span>
          <small>React · TypeScript · Figma</small>
        </div>
      </motion.div>

      <motion.div
        className="su-match-card"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span>✧ &nbsp; AI Match</span>
        <div className="su-match-circle">
          <strong>92%</strong>
        </div>
        <small>Excellent match</small>
      </motion.div>

    </div>
  );
}

function Home() {
  useEffect(() => {
    const counters = document.querySelectorAll(".su-counter");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = Number(el.dataset.value);
            const suffix = el.dataset.suffix || "";
            let start = 0;
            const duration = 1400;
            const increment = target / (duration / 16);

            const timer = setInterval(() => {
              start += increment;

              if (start >= target) {
                start = target;
                clearInterval(timer);
              }

              el.textContent = Math.floor(start).toLocaleString() + suffix;
            }, 16);

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="skillup-home">

      {/* HERO */}
      <section className="su-hero">
        <div className="su-hero-inner">

          <div className="su-hero-content">
            <motion.div
              className="su-eyebrow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <i /> AI recruitment, made human
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.15 }}
            >
              Find Your Talent.
              <br />
              Build Your
              <br />
              <span className="su-title-highlight">Future.</span>
            </motion.h1>

            <motion.p
              className="su-hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              An intelligent recruitment platform connecting
              exceptional talents with opportunities through
              AI-powered matching.
            </motion.p>

            <motion.div
              className="su-hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <a href="#jobs" className="su-btn su-btn-dark">
                Explore Jobs <span>↗</span>
              </a>
              <Link to="/about" className="su-btn su-btn-outline">
                Discover SkillUp
              </Link>
            </motion.div>

            <motion.div
              className="su-social-proof"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="su-avatar-stack">
                <span>AO</span><span>LM</span><span>YB</span><span>KM</span>
              </div>
              <p><strong>12,400+</strong> talents matched this year</p>
            </motion.div>
          </div>

          <DashboardPreview />

        </div>

        <div className="su-hero-bottom">
          <span>SCROLL TO EXPLORE</span>
          <span className="su-scroll-line" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="su-section su-how" id="how-it-works">
        <Reveal className="su-section-heading">
          <span className="su-section-label">HOW SKILLUP WORKS</span>
          <h2>Three steps from profile<br />to perfect match.</h2>
          <p>Your next opportunity is closer than you think.</p>
        </Reveal>

        <div className="su-steps-grid">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div className="su-step-card" key={step.number}>
                <div className="step-top">
                  <div className="step-icon">
                    <Icon size={32} strokeWidth={2} />
                  </div>

                  <span className="step-number">{step.number}</span>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="su-section su-jobs" id="jobs">
        <Reveal className="su-section-heading su-heading-row">
          <div>
            <span className="su-section-label">FEATURED JOBS</span>
            <h2>Roles worth your next move </h2>
          </div>
          <a href="#jobs" className="su-text-link">View all jobs ↗</a>
        </Reveal>

        <div className="su-jobs-grid">
          {jobs.map((job) => (
            <Reveal className="su-job-card" key={job.title}>
              <div className="su-job-top">
                <div className={`su-company-icon ${job.color}`}>
                  {job.initials}
                </div>
                <span className="su-job-time">Recently posted</span>
              </div>

              <h3>{job.title}</h3>
              <p className="su-company-name">{job.company} · {job.location}</p>
              <strong className="su-salary">{job.salary}</strong>

              <div className="su-job-tags">
                {job.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>

              <div className="su-job-bottom">
                <span>{job.applicants} applicants</span>
                <a href="#get-started">Details ↗</a>
                <a href="#get-started" className="su-job-apply">Apply Now ↗</a>

              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AI CV ANALYSIS */}
      <section className="su-section su-ai-section">
        <div className="su-ai-grid">
          <Reveal className="su-ai-content">
            <span className="su-section-label">AI-POWERED RECRUITMENT</span>
            <h2>Your CV, read like a recruiter would — in seconds.</h2>
            <p>
              SkillUp's AI extracts skills, scores your CV for ATS
              compatibility and compares it with every job to surface
              the strongest matches.
            </p>

            <ul className="su-feature-list">
              <li>✓ Intelligent CV parsing & ATS scoring</li>
              <li>✓ Skill gap detection with clear recommendations</li>
              <li>✓ Candidate–job compatibility ranking for recruiters</li>
            </ul>

            <Link to="/about" className="su-btn su-btn-dark">
              Discover the technology ↗
            </Link>
          </Reveal>

          <Reveal className="su-analysis-card">
            <div className="su-analysis-header">
              <div>
                <span>YOUR CV ANALYSIS</span>
                <h3>ATS Compatibility</h3>
              </div>
            </div>

            <div className="su-score-area">
              <div className="su-score-circle">
                <strong>78%</strong>
                <span>ATS Score</span>
              </div>
              <div className="su-score-details">
                {[
                  ["Keywords", 82],
                  ["Experience", 74],
                  ["Formatting", 91],
                  ["Skills", 68],
                ].map(([label, value]) => (
                  <div className="su-score-row" key={label}>
                    <div><span>{label}</span><strong>{value}%</strong></div>
                    <div className="su-score-track">
                      <span style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="su-ai-summary">
              <span>  <Brain size={14} /> AI summary</span>
              <p>
                Strong React and TypeScript foundation. Adding testing
                and accessibility experience could raise your match by 12%.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHY SKILLUP */}
      <section className="su-section su-benefits">
        <Reveal className="su-section-heading">
          <span className="su-section-label">WHY CHOOSE SKILLUP</span>
          <h2>Hiring that feels effortless.</h2>
          <p>Smarter tools. Better matches. More human recruitment.</p>
        </Reveal>

        <div className="su-benefits-grid">
          {benefits.map((item) => (
            <Reveal className="su-benefit-card" key={item.title}>
              <div className="su-benefit-icon">
                {item.icon}
              </div>              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="su-stats-section">
        <div className="su-stats-grid">
          <div><strong className="su-counter" data-value="12400" data-suffix="+">0</strong><span>Talents matched</span></div>
          <div><strong className="su-counter" data-value="850" data-suffix="+">0</strong><span>Hiring companies</span></div>
          <div><strong className="su-counter" data-value="60" data-suffix="%">0</strong><span>Faster screening</span></div>
          <div><strong className="su-counter" data-value="94" data-suffix="%">0</strong><span>Match accuracy</span></div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="su-section su-testimonials">
        <Reveal className="su-section-heading">
          <span className="su-section-label">REAL STORIES</span>
          <h2>Good matches change everything.</h2>
        </Reveal>

        <div className="su-testimonials-grid">
          {testimonials.map((item) => (
            <Reveal className="su-testimonial-card" key={item.name}>
              <Quote size={28} className="su-quote-icon" />
              <blockquote>“{item.quote}”</blockquote>
              <div className="su-person">
                <span>{item.initials}</span>
                <div><strong>{item.name}</strong><small>{item.role}</small></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="su-final-cta" id="get-started">
        <Reveal>
          <span className="su-section-label">YOUR NEXT CHAPTER STARTS HERE</span>
          <h2>Your next opportunity<br />starts here.</h2>
          <p>
            Join talented candidates and recruiters building
            better careers with SkillUp.
          </p>
          <div className="su-hero-actions">
            <Link to="/about" className="su-btn su-btn-dark">
              Create free account ↗
            </Link>
            <Link to="/about" className="su-btn su-btn-outline">
              Discover SkillUp
            </Link>
          </div>
        </Reveal>
      </section>

    </main>
  );
}

export default Home;
