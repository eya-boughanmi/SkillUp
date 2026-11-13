
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { motion } from "framer-motion";
import {
    Lightbulb,
    LayoutDashboard,
    BriefcaseBusiness,
    FileText,
    Bookmark,
    UserRound,
    Settings,
    LogOut,
    Search,
    Bell,
    ChevronRight,
    MapPin,
    Clock3,
    ArrowUpRight,
    Sparkles,
    CheckCircle2,
    MoreHorizontal,
    Plus,
    TrendingUp,
    CalendarDays,
    Menu,
    X,
    Upload,
} from "lucide-react";

import "./CandidateDashboard.css";

const stats = [
    {
        label: "Applications sent",
        value: "12",
        change: "+3 this week",
        icon: FileText,
        color: "violet",
    },
    {
        label: "Interviews",
        value: "03",
        change: "2 upcoming",
        icon: CalendarDays,
        color: "peach",
    },
    {
        label: "Saved jobs",
        value: "08",
        change: "Explore more",
        icon: Bookmark,
        color: "lavender",
    },
    {
        label: "Profile views",
        value: "124",
        change: "+18% this month",
        icon: TrendingUp,
        color: "green",
    },
];

const jobs = [
    {
        id: 1,
        company: "TechNova",
        initials: "TN",
        title: "Frontend Developer",
        location: "Sousse, Tunisia",
        type: "Full-time",
        salary: "1,800 – 2,400 DT",
        match: 96,
        tags: ["React", "TypeScript", "Tailwind"],
        color: "violet",
    },
    {
        id: 2,
        company: "DigitalWave",
        initials: "DW",
        title: "Junior UI Developer",
        location: "Remote",
        type: "Full-time",
        salary: "1,500 – 2,000 DT",
        match: 89,
        tags: ["JavaScript", "CSS", "Figma"],
        color: "peach",
    },
    {
        id: 3,
        company: "CodeCraft",
        initials: "CC",
        title: "React Developer Intern",
        location: "Sahloul, Sousse",
        type: "Internship",
        salary: "Negotiable",
        match: 84,
        tags: ["React", "Git", "REST API"],
        color: "blue",
    },
];

const applications = [
    {
        company: "Pixel Studio",
        role: "Frontend Developer",
        date: "Nov 10, 2026",
        status: "Under review",
        color: "review",
        initials: "PS",
    },
    {
        company: "Innovatech",
        role: "Web Developer Intern",
        date: "Nov 08, 2026",
        status: "Interview",
        color: "interview",
        initials: "IN",
    },
    {
        company: "SoftBridge",
        role: "Junior React Developer",
        date: "Nov 04, 2026",
        status: "Applied",
        color: "applied",
        initials: "SB",
    },
];

const navigation = [
    { label: "Overview", icon: LayoutDashboard, path: "/candidate/dashboard" },
    { label: "Find Jobs", icon: BriefcaseBusiness, path: "/candidate/jobs" },
    { label: "My Applications", icon: FileText, path: "/candidate/applications" },
    { label: "Saved Jobs", icon: Bookmark, path: "/candidate/saved-jobs" },
    { label: "My Profile", icon: UserRound, path: "/candidate/profile" },
];

function CandidateDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [savedJobs, setSavedJobs] = useState([2]);

    const toggleSaved = (id) => {
        setSavedJobs((current) =>
            current.includes(id)
                ? current.filter((jobId) => jobId !== id)
                : [...current, id]
        );
    };

    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.08 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 18 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.45, ease: "easeOut" },
        },
    };

    return (
        <div className="candidate-dashboard">
            {sidebarOpen && (
                <button
                    className="cd-sidebar-overlay"
                    aria-label="Close menu"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`cd-sidebar ${sidebarOpen ? "is-open" : ""}`}>
                <div className="cd-brand">
                    <Link to="/" className="cd-logo">
                        Skill<span>Up</span>
                        <span className="cd-logo-dot" />
                    </Link>

                    <button
                        className="cd-mobile-close"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close navigation"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="cd-sidebar-label">WORKSPACE</div>

                <nav className="cd-navigation">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                end={item.path === "/candidate/dashboard"}
                                className={({ isActive }) =>
                                    `cd-nav-link ${isActive ? "active" : ""}`
                                }
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon size={19} strokeWidth={1.8} />
                                <span>{item.label}</span>
                                {item.label === "My Applications" && (
                                    <span className="cd-nav-count">12</span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="cd-sidebar-bottom">
                    <div className="cd-sidebar-label">PREFERENCES</div>
                    <NavLink to="/candidate/settings" className="cd-nav-link">
                        <Settings size={19} />
                        <span>Settings</span>
                    </NavLink>

                    <div className="cd-sidebar-profile">
                        <div className="cd-avatar">YB</div>
                        <div className="cd-sidebar-user">
                            <strong>Your Profile</strong>
                            <span>Candidate account</span>
                        </div>
                        <button aria-label="Account options">
                            <MoreHorizontal size={19} />
                        </button>
                    </div>

                    <Link to="/login" className="cd-logout">
                        <LogOut size={18} />
                        <span>Log out</span>
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="cd-main">
                {/* TOPBAR */}
                <header className="cd-topbar">
                    <button
                        className="cd-menu-button"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open navigation"
                    >
                        <Menu size={22} />
                    </button>

                    <div className="cd-breadcrumb">
                        <span>Workspace</span>
                        <ChevronRight size={15} />
                        <strong>Overview</strong>
                    </div>

                    <div className="cd-topbar-actions">
                        <label className="cd-search">
                            <Search size={17} />
                            <input type="search" placeholder="Search anything..." />
                            <kbd>⌘ K</kbd>
                        </label>

                        <button className="cd-notification" aria-label="Notifications">
                            <Bell size={19} />
                            <span />
                        </button>

                        <div className="cd-top-avatar">YB</div>
                    </div>
                </header>

                <div className="cd-content">
                    {/* WELCOME */}
                    <motion.section
                        className="cd-welcome"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="cd-welcome-content">
                            <span className="cd-eyebrow">
                                <TrendingUp size={14} /> YOUR CAREER SPACE
                            </span>
                            <h1>Good morning, <span>Yesmine!</span> 👋</h1>
                            <p>
                                Your next opportunity could be just around the corner.
                                Let's make it happen.
                            </p>

                            <Link to="/candidate/jobs" className="cd-primary-btn">
                                Explore opportunities <ArrowUpRight size={17} />
                            </Link>
                        </div>

                        <div className="cd-welcome-decoration">
                            <div className="cd-decoration-circle cd-circle-one" />
                            <div className="cd-decoration-circle cd-circle-two" />
                            <div className="cd-welcome-illustration">
                                <BriefcaseBusiness size={46} strokeWidth={1.3} />
                                <span>YOUR NEXT<br />CHAPTER STARTS HERE</span>
                            </div>
                        </div>
                    </motion.section>

                    {/* PROFILE COMPLETION */}
                    <motion.section
                        className="cd-profile-progress"
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="cd-progress-icon">
                            <UserRound size={21} />
                        </div>
                        <div className="cd-progress-info">
                            <div className="cd-progress-heading">
                                <strong>Complete your profile</strong>
                                <span>75% completed</span>
                            </div>
                            <div className="cd-progress-track">
                                <motion.div
                                    className="cd-progress-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: "75%" }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                />
                            </div>
                            <small>A complete profile helps recruiters discover you.</small>
                        </div>
                        <Link to="/candidate/profile" className="cd-progress-link">
                            Complete profile <ChevronRight size={17} />
                        </Link>
                    </motion.section>

                    {/* STATS */}
                    <motion.section
                        className="cd-stats-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <motion.article
                                    className="cd-stat-card"
                                    key={stat.label}
                                    variants={itemVariants}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                >
                                    <div className="cd-stat-top">
                                        <div className={`cd-stat-icon ${stat.color}`}>
                                            <Icon size={20} />
                                        </div>
                                        <button aria-label={`${stat.label} options`}>
                                            <MoreHorizontal size={19} />
                                        </button>
                                    </div>
                                    <strong className="cd-stat-value">{stat.value}</strong>
                                    <span className="cd-stat-label">{stat.label}</span>
                                    <small className="cd-stat-change">{stat.change}</small>
                                </motion.article>
                            );
                        })}
                    </motion.section>

                    {/* JOB RECOMMENDATIONS */}
                    <section className="cd-section">
                        <div className="cd-section-heading">
                            <div>
                                <span className="cd-section-eyebrow">MADE FOR YOU</span>
                                <h2>Recommended opportunities</h2>
                                <p>Jobs selected based on your skills and interests.</p>
                            </div>
                            <Link to="/candidate/jobs" className="cd-view-all">
                                View all jobs <ArrowUpRight size={16} />
                            </Link>
                        </div>

                        <motion.div
                            className="cd-jobs-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {jobs.map((job) => (
                                <motion.article
                                    className="cd-job-card"
                                    key={job.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                >
                                    <div className="cd-job-top">
                                        <div className={`cd-company-logo ${job.color}`}>
                                            {job.initials}
                                        </div>
                                        <div className="cd-match-badge">
                                            <CheckCircle2 size={13} /> {job.match}% match
                                        </div>
                                        <button
                                            className={`cd-save-btn ${savedJobs.includes(job.id) ? "saved" : ""
                                                }`}
                                            onClick={() => toggleSaved(job.id)}
                                            aria-label="Save job"
                                        >
                                            <Bookmark
                                                size={18}
                                                fill={savedJobs.includes(job.id) ? "currentColor" : "none"}
                                            />
                                        </button>
                                    </div>

                                    <div className="cd-company-name">{job.company}</div>
                                    <h3>{job.title}</h3>

                                    <div className="cd-job-meta">
                                        <span><MapPin size={14} /> {job.location}</span>
                                        <span><Clock3 size={14} /> {job.type}</span>
                                    </div>

                                    <div className="cd-job-tags">
                                        {job.tags.map((tag) => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </div>

                                    <div className="cd-job-footer">
                                        <div>
                                            <small>Salary range</small>
                                            <strong>{job.salary}</strong>
                                        </div>
                                        <Link to={`/candidate/jobs/${job.id}`} className="cd-job-apply">
                                            Details <ArrowUpRight size={15} />
                                        </Link>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    </section>

                    {/* APPLICATIONS */}
                    <section className="cd-section cd-applications-section">
                        <div className="cd-section-heading">
                            <div>
                                <span className="cd-section-eyebrow">KEEP TRACK</span>
                                <h2>Recent applications</h2>
                                <p>Stay up to date with your application progress.</p>
                            </div>
                            <Link to="/candidate/applications" className="cd-view-all">
                                All applications <ArrowUpRight size={16} />
                            </Link>
                        </div>

                        <div className="cd-applications-card">
                            <div className="cd-applications-header">
                                <span>COMPANY & POSITION</span>
                                <span>DATE APPLIED</span>
                                <span>STATUS</span>
                                <span />
                            </div>

                            {applications.map((application) => (
                                <div className="cd-application-row" key={application.company}>
                                    <div className="cd-application-company">
                                        <div className="cd-application-logo">
                                            {application.initials}
                                        </div>
                                        <div>
                                            <strong>{application.company}</strong>
                                            <span>{application.role}</span>
                                        </div>
                                    </div>

                                    <span className="cd-application-date">
                                        {application.date}
                                    </span>

                                    <span className={`cd-status ${application.color}`}>
                                        <i /> {application.status}
                                    </span>

                                    <button
                                        className="cd-row-action"
                                        aria-label="View application"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* BOTTOM TIP */}
                    <motion.section
                        className="cd-tip-card"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="cd-tip-icon"><Lightbulb size={22} /></div>
                        <div>
                            <strong>A little tip for your job search</strong>
                            <p>Keep your CV updated and tailor it to every opportunity you apply for.</p>
                        </div>
                        <Link to="/candidate/profile">
                            Update my CV <Upload size={16} />
                        </Link>
                    </motion.section>

                    <footer className="cd-footer">
                        <span>© 2026 SkillUp. All rights reserved.</span>
                        <span>Built for your next opportunity <Sparkles size={13} /></span>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default CandidateDashboard;
