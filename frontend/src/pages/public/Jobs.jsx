
import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  Bookmark,
  ArrowUpRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import "./Jobs.css";

const jobsData = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechNova",
    location: "Sousse, Tunisia",
    type: "Full-time",
    category: "Development",
    level: "Junior",
    salary: "1,200 – 1,800 TND",
    posted: "2 days ago",
    description:
      "Join our development team and help build modern, user-friendly web applications.",
    skills: ["React", "JavaScript", "CSS"],
    color: "violet",
    initials: "TN",
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "DigitalWave",
    location: "Tunis, Tunisia",
    type: "Internship",
    category: "Design",
    level: "Entry level",
    salary: "Paid internship",
    posted: "1 day ago",
    description:
      "Create meaningful digital experiences through research, wireframes and visual design.",
    skills: ["Figma", "UI Design", "Prototyping"],
    color: "peach",
    initials: "DW",
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "CodeCraft",
    location: "Sfax, Tunisia",
    type: "Full-time",
    category: "Development",
    level: "Junior",
    salary: "1,500 – 2,000 TND",
    posted: "3 days ago",
    description:
      "Work on scalable backend systems, APIs and database-driven applications.",
    skills: ["Java", "Spring Boot", "MySQL"],
    color: "blue",
    initials: "CC",
  },
  {
    id: 4,
    title: "Digital Marketing Intern",
    company: "CreativeHub",
    location: "Sousse, Tunisia",
    type: "Internship",
    category: "Marketing",
    level: "Entry level",
    salary: "Paid internship",
    posted: "4 days ago",
    description:
      "Support digital campaigns, social media strategy and content creation.",
    skills: ["Marketing", "SEO", "Social Media"],
    color: "pink",
    initials: "CH",
  },
  {
    id: 5,
    title: "Data Analyst",
    company: "InnovateLab",
    location: "Remote",
    type: "Remote",
    category: "Data",
    level: "Junior",
    salary: "1,300 – 1,900 TND",
    posted: "5 days ago",
    description:
      "Turn data into useful insights and help teams make better decisions.",
    skills: ["Python", "SQL", "Power BI"],
    color: "green",
    initials: "IL",
  },
  {
    id: 6,
    title: "Mobile Developer",
    company: "NextGen",
    location: "Monastir, Tunisia",
    type: "Full-time",
    category: "Development",
    level: "Entry level",
    salary: "1,400 – 1,900 TND",
    posted: "1 week ago",
    description:
      "Build and maintain mobile applications with a focus on performance and usability.",
    skills: ["Flutter", "Dart", "Firebase"],
    color: "orange",
    initials: "NG",
  },
];

function Jobs() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [savedJobs, setSavedJobs] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      const searchMatch =
        `${job.title} ${job.company} ${job.skills.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const locationMatch =
        job.location.toLowerCase().includes(location.toLowerCase());

      const categoryMatch =
        category === "All" || job.category === category;

      const typeMatch =
        jobType === "All" || job.type === jobType;

      return searchMatch && locationMatch && categoryMatch && typeMatch;
    });
  }, [search, location, category, jobType]);

  const toggleSave = (id) => {
    setSavedJobs((previous) =>
      previous.includes(id)
        ? previous.filter((jobId) => jobId !== id)
        : [...previous, id]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("All");
    setJobType("All");
  };

  return (
    <main className="jobs-page">
      <section className="jobs-hero">
        <div className="jobs-hero-content">
          <span className="jobs-eyebrow">
            <span className="jobs-eyebrow-dot" />
            YOUR NEXT OPPORTUNITY STARTS HERE
          </span>

          <h1>
            Find a job that
            <br />
            <span>moves you forward.</span>
          </h1>

          <p>
            Discover opportunities that match your skills, ambitions
            and the future you want to build.
          </p>

          <div className="jobs-search-box">
            <div className="jobs-search-field">
              <Search size={19} />
              <input
                type="text"
                placeholder="Job title, company or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="jobs-search-divider" />

            <div className="jobs-search-field jobs-location-field">
              <MapPin size={19} />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button className="jobs-search-button">
              <Search size={17} />
              Search jobs
            </button>
          </div>

          <div className="jobs-hero-note">
            <span>Explore opportunities</span>
            <span>·</span>
            <span>Build your career</span>
            <span>·</span>
            <span>Grow with confidence</span>
          </div>
        </div>

        <div className="jobs-hero-decoration">
          <div className="jobs-decoration-circle jobs-circle-one" />
          <div className="jobs-decoration-circle jobs-circle-two" />
          <div className="jobs-floating-card">
            <div className="jobs-floating-icon">
              <BriefcaseBusiness size={21} />
            </div>
            <div>
              <strong>New opportunities</strong>
              <span>Your next chapter awaits.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="jobs-listing">
        <div className="jobs-listing-heading">
          <div>
            <span className="jobs-section-label">CAREER OPPORTUNITIES</span>
            <h2>Explore job openings</h2>
            <p>Find the opportunity that feels right for you.</p>
          </div>

          <button
            className="jobs-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        <div className={`jobs-filter-bar ${showFilters ? "show" : ""}`}>
          <div className="jobs-filter-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All categories</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Data">Data</option>
            </select>
          </div>

          <div className="jobs-filter-group">
            <label>Job type</label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="All">All types</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <button className="jobs-reset-button" onClick={resetFilters}>
            <X size={15} />
            Clear filters
          </button>
        </div>

        <div className="jobs-results-header">
          <p>
            Showing <strong>{filteredJobs.length}</strong> opportunities
          </p>
          <span>Sorted by: <strong>Most recent</strong></span>
        </div>

        <div className="jobs-grid">
          {filteredJobs.map((job, index) => (
            <motion.article
              className="job-card"
              key={job.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <div className="job-card-top">
                <div className={`job-company-logo ${job.color}`}>
                  {job.initials}
                </div>

                <button
                  className={`job-save-button ${
                    savedJobs.includes(job.id) ? "saved" : ""
                  }`}
                  onClick={() => toggleSave(job.id)}
                  aria-label="Save job"
                >
                  <Bookmark
                    size={19}
                    fill={savedJobs.includes(job.id) ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <div className="job-card-title">
                <span className="job-posted">
                  <Clock3 size={13} />
                  {job.posted}
                </span>
                <h3>{job.title}</h3>
                <p>{job.company}</p>
              </div>

              <div className="job-meta">
                <span><MapPin size={14} />{job.location}</span>
                <span><BriefcaseBusiness size={14} />{job.type}</span>
              </div>

              <p className="job-description">{job.description}</p>

              <div className="job-skills">
                {job.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <div className="job-card-bottom">
                <div className="job-salary">
                  <strong>{job.salary}</strong>
                  <span>{job.level}</span>
                </div>

                <Link to={`/jobs/${job.id}`} className="job-details-button">
                  Details
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="jobs-empty-state">
            <div><Search size={25} /></div>
            <h3>No jobs found</h3>
            <p>Try changing your search or adjusting the filters.</p>
            <button onClick={resetFilters}>Clear all filters</button>
          </div>
        )}
      </section>
    </main>
  );
}

export default Jobs;
