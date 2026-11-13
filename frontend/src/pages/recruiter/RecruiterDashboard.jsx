
import { useState } from "react";
import { NavLink, Link } from "react-router";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    BriefcaseBusiness,
    UsersRound,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    Search,
    Plus,
    ArrowUpRight,
    TrendingUp,
    CalendarDays,
    MapPin,
    Clock3,
    MoreHorizontal,
    ChevronRight,
    Menu,
    X,
    UserRound,
    CheckCircle2,
    Eye,
    Building2,
    CircleDollarSign,
} from "lucide-react";
import "./RecruiterDashboard.css";

const navigation = [
    { label: "Overview", icon: LayoutDashboard, path: "/recruiter/dashboard" },
    { label: "My Jobs", icon: BriefcaseBusiness, path: "/recruiter/jobs" },
    { label: "Candidates", icon: UsersRound, path: "/recruiter/candidates" },
    { label: "Applications", icon: FileText, path: "/recruiter/applications" },
    { label: "Messages", icon: MessageSquare, path: "/recruiter/messages" },
];

const stats = [
    {
        label: "Active Jobs",
        value: "12",
        change: "+2 this month",
        icon: BriefcaseBusiness,
        color: "violet",
    },
    {
        label: "Total Applicants",
        value: "248",
        change: "+18.5% this week",
        icon: UsersRound,
        color: "lavender",
    },
    {
        label: "Interviews",
        value: "18",
        change: "6 upcoming",
        icon: CalendarDays,
        color: "coral",
    },
    {
        label: "Successful Hires",
        value: "08",
        change: "+3 this month",
        icon: CheckCircle2,
        color: "navy",
    },
];

const applicants = [
    {
        name: "Amira Ben Salem",
        role: "Frontend Developer",
        initials: "AB",
        date: "Nov 13, 2026",
        score: 96,
        status: "Shortlisted",
    },
    {
        name: "Youssef Trabelsi",
        role: "UI/UX Designer",
        initials: "YT",
        date: "Nov 12, 2026",
        score: 91,
        status: "Under review",
    },
    {
        name: "Mariem Gharbi",
        role: "Backend Developer",
        initials: "MG",
        date: "Nov 11, 2026",
        score: 88,
        status: "Interview",
    },
    {
        name: "Ahmed Mansour",
        role: "Frontend Developer",
        initials: "AM",
        date: "Nov 10, 2026",
        score: 82,
        status: "New",
    },
];

const jobs = [
    {
        title: "Frontend Developer",
        department: "Engineering",
        type: "Full-time",
        location: "Sousse, Tunisia",
        applicants: 48,
        progress: 76,
        color: "violet",
    },
    {
        title: "UI/UX Designer",
        department: "Design",
        type: "Hybrid",
        location: "Remote",
        applicants: 32,
        progress: 54,
        color: "coral",
    },
    {
        title: "Backend Developer",
        department: "Engineering",
        type: "Full-time",
        location: "Sahloul, Sousse",
        applicants: 27,
        progress: 38,
        color: "lavender",
    },
];

const topCandidates = [
    {
        name: "Amira Ben Salem",
        role: "Frontend Developer",
        initials: "AB",
        score: 96,
        skills: ["React", "TypeScript", "UI"],
    },
    {
        name: "Youssef Trabelsi",
        role: "UI/UX Designer",
        initials: "YT",
        score: 91,
        skills: ["Figma", "UX", "Prototyping"],
    },
    {
        name: "Mariem Gharbi",
        role: "Backend Developer",
        initials: "MG",
        score: 88,
        skills: ["Java", "Spring", "SQL"],
    },
];

const chartData = [
    { day: "Mon", value: 42 },
    { day: "Tue", value: 68 },
    { day: "Wed", value: 52 },
    { day: "Thu", value: 85 },
    { day: "Fri", value: 62 },
    { day: "Sat", value: 95 },
    { day: "Sun", value: 74 },
];

function RecruiterDashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredApplicants = applicants.filter((applicant) =>
        `${applicant.name} ${applicant.role}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="rd-dashboard">
            {/* SIDEBAR */}
            <aside className={`rd-sidebar ${menuOpen ? "rd-sidebar-open" : ""}`}>
                 <div className="cd-brand">
                    <Link to="/" className="cd-logo">
                        Skill<span>Up</span>
                        <span className="cd-logo-dot" />
                    </Link>

                    <button
                        className="rd-close-menu"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="rd-workspace">
                    <div className="rd-workspace-icon">
                        <Building2 size={19} />
                    </div>
                    <div>
                        <strong>Creative Studio</strong>
                        <span>Recruiter workspace</span>
                    </div>
                    <MoreHorizontal size={19} className="rd-workspace-more" />
                </div>

                <span className="rd-nav-label">WORKSPACE</span>

                <nav className="rd-navigation">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                end={item.path === "/recruiter/dashboard"}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    `rd-nav-link ${isActive ? "active" : ""}`
                                }
                            >
                                <Icon size={19} strokeWidth={1.8} />
                                <span>{item.label}</span>
                                {item.label === "Applications" && (
                                    <span className="rd-nav-count">8</span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="rd-sidebar-bottom">
                    <span className="rd-nav-label">PREFERENCES</span>

                    <NavLink to="/recruiter/settings" className="rd-nav-link">
                        <Settings size={19} />
                        <span>Settings</span>
                    </NavLink>

                    <div className="rd-sidebar-divider" />

                    <div className="rd-account">
                        <div className="rd-account-avatar">CS</div>
                        <div className="rd-account-info">
                            <strong>Creative Studio</strong>
                            <span>Company account</span>
                        </div>
                        <button aria-label="Log out" className="rd-logout">
                            <LogOut size={17} />
                        </button>
                    </div>
                </div>
            </aside>

            {menuOpen && (
                <div
                    className="rd-sidebar-overlay"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* MAIN */}
            <main className="rd-main">
                {/* TOPBAR */}
                <header className="rd-topbar">
                    <div className="rd-topbar-left">
                        <button
                            className="rd-menu-button"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={22} />
                        </button>

                        <div className="rd-breadcrumb">
                            <span>Workspace</span>
                            <ChevronRight size={15} />
                            <strong>Overview</strong>
                        </div>
                    </div>

                    <div className="rd-topbar-actions">
                        <label className="rd-search">
                            <Search size={17} />
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <span>⌘ K</span>
                        </label>

                        <button className="rd-notification" aria-label="Notifications">
                            <Bell size={19} />
                            <i />
                        </button>

                        <div className="rd-topbar-avatar">CS</div>
                    </div>
                </header>

                <div className="rd-content">
                    {/* WELCOME */}
                    <motion.section
                        className="rd-welcome"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="rd-welcome-content">
                            <span className="rd-welcome-label">
                                <TrendingUp size={15} />
                                RECRUITMENT OVERVIEW
                            </span>

                            <h1>Find the people who move you forward.</h1>

                            <p>
                                Great teams start with great matches. Here's what's
                                happening with your recruitment today.
                            </p>

                            <div className="rd-welcome-actions">
                                <Link to="/recruiter/jobs/new" className="rd-primary-button">
                                    <Plus size={18} />
                                    Post a new job
                                </Link>

                                <Link to="/recruiter/candidates" className="rd-text-button">
                                    Explore candidates
                                    <ArrowUpRight size={17} />
                                </Link>
                            </div>
                        </div>

                        <div className="rd-welcome-visual">
                            <div className="rd-visual-circle rd-circle-one" />
                            <div className="rd-visual-circle rd-circle-two" />

                            <div className="rd-visual-card">
                                <div className="rd-visual-icon">
                                    <UsersRound size={27} />
                                </div>
                                <span>Growing your team</span>
                                <strong>248 candidates</strong>
                                <div className="rd-visual-avatars">
                                    <span>AB</span>
                                    <span>YT</span>
                                    <span>MG</span>
                                    <span>+5</span>
                                </div>
                            </div>

                            <div className="rd-floating-badge">
                                <CheckCircle2 size={16} />
                                Smart matching
                            </div>
                        </div>
                    </motion.section>

                    {/* STATS */}
                    <section className="rd-stats-grid">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;

                            return (
                                <motion.div
                                    className="rd-stat-card"
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    whileHover={{ y: -4 }}
                                >
                                    <div className={`rd-stat-icon ${stat.color}`}>
                                        <Icon size={21} />
                                    </div>

                                    <div className="rd-stat-top">
                                        <span>{stat.label}</span>
                                        <MoreHorizontal size={18} />
                                    </div>

                                    <strong className="rd-stat-value">{stat.value}</strong>
                                    <span className="rd-stat-change">{stat.change}</span>
                                </motion.div>
                            );
                        })}
                    </section>

                    {/* CHART + ACTIVITY */}
                    <section className="rd-overview-grid">
                        <motion.div
                            className="rd-panel rd-chart-panel"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <div className="rd-panel-heading">
                                <div>
                                    <span className="rd-eyebrow">PERFORMANCE</span>
                                    <h2>Application overview</h2>
                                    <p>Candidate applications received this week</p>
                                </div>

                                <button className="rd-period-button">
                                    This week
                                    <ChevronRight size={15} />
                                </button>
                            </div>

                            <div className="rd-chart-summary">
                                <strong>186</strong>
                                <span>
                                    <TrendingUp size={14} />
                                    12.8%
                                </span>
                                <small>vs. last week</small>
                            </div>

                            <div className="rd-chart">
                                {chartData.map((item, index) => (
                                    <div className="rd-chart-column" key={item.day}>
                                        <div className="rd-chart-bar-wrap">
                                            <motion.div
                                                className={`rd-chart-bar ${index === 5 ? "highlight" : ""}`}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${item.value}%` }}
                                                transition={{ duration: 0.7, delay: index * 0.08 }}
                                            />
                                        </div>
                                        <span>{item.day}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="rd-panel rd-activity-panel"
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.32 }}
                        >
                            <div className="rd-panel-heading">
                                <div>
                                    <span className="rd-eyebrow">YOUR WORKSPACE</span>
                                    <h2>Recruitment activity</h2>
                                </div>
                                <button className="rd-icon-button" aria-label="More activity options">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="rd-activity-list">
                                <div className="rd-activity-item">
                                    <div className="rd-activity-icon lavender">
                                        <UsersRound size={17} />
                                    </div>
                                    <div>
                                        <p><strong>12 new applications</strong></p>
                                        <span>Frontend Developer position</span>
                                        <small>2 hours ago</small>
                                    </div>
                                </div>

                                <div className="rd-activity-item">
                                    <div className="rd-activity-icon coral">
                                        <CalendarDays size={17} />
                                    </div>
                                    <div>
                                        <p><strong>3 interviews scheduled</strong></p>
                                        <span>Your upcoming interviews</span>
                                        <small>Yesterday</small>
                                    </div>
                                </div>

                                <div className="rd-activity-item">
                                    <div className="rd-activity-icon violet">
                                        <CheckCircle2 size={17} />
                                    </div>
                                    <div>
                                        <p><strong>Candidate shortlisted</strong></p>
                                        <span>Amira Ben Salem · Frontend</span>
                                        <small>Yesterday</small>
                                    </div>
                                </div>
                            </div>

                            <Link to="/recruiter/applications" className="rd-view-all">
                                View all activity <ArrowUpRight size={15} />
                            </Link>
                        </motion.div>
                    </section>

                    {/* APPLICANTS */}
                    <section className="rd-panel rd-applicants-panel">
                        <div className="rd-panel-heading">
                            <div>
                                <span className="rd-eyebrow">CANDIDATE PIPELINE</span>
                                <h2>Recent applicants</h2>
                                <p>Stay on top of your latest applications</p>
                            </div>

                            <Link to="/recruiter/applications" className="rd-outline-button">
                                View all <ArrowUpRight size={15} />
                            </Link>
                        </div>

                        <div className="rd-table-wrap">
                            <table className="rd-applicants-table">
                                <thead>
                                    <tr>
                                        <th>Candidate</th>
                                        <th>Applied for</th>
                                        <th>Applied date</th>
                                        <th>AI match</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredApplicants.map((applicant) => (
                                        <tr key={applicant.name}>
                                            <td>
                                                <div className="rd-candidate-cell">
                                                    <div className="rd-candidate-avatar">
                                                        {applicant.initials}
                                                    </div>
                                                    <strong>{applicant.name}</strong>
                                                </div>
                                            </td>
                                            <td>{applicant.role}</td>
                                            <td>{applicant.date}</td>
                                            <td>
                                                <span className="rd-match-score">
                                                    <TrendingUp size={14} />
                                                    {applicant.score}%
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`rd-status ${applicant.status.toLowerCase().replace(" ", "-")}`}>
                                                    {applicant.status}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="rd-row-more" aria-label={`More options for ${applicant.name}`}>
                                                    <MoreHorizontal size={19} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredApplicants.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="rd-empty">
                                                No applicants found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* JOBS + TOP CANDIDATES */}
                    <section className="rd-bottom-grid">
                        <div className="rd-panel rd-jobs-panel">
                            <div className="rd-panel-heading">
                                <div>
                                    <span className="rd-eyebrow">JOB MANAGEMENT</span>
                                    <h2>Active job offers</h2>
                                </div>
                                <Link to="/recruiter/jobs" className="rd-small-link">
                                    See all <ArrowUpRight size={15} />
                                </Link>
                            </div>

                            <div className="rd-jobs-list">
                                {jobs.map((job) => (
                                    <motion.div
                                        className="rd-job-item"
                                        key={job.title}
                                        whileHover={{ x: 3 }}
                                    >
                                        <div className={`rd-job-icon ${job.color}`}>
                                            <BriefcaseBusiness size={19} />
                                        </div>

                                        <div className="rd-job-info">
                                            <strong>{job.title}</strong>
                                            <span>
                                                {job.department} · {job.type}
                                            </span>
                                            <small>
                                                <MapPin size={12} /> {job.location}
                                            </small>

                                            <div className="rd-job-progress">
                                                <div>
                                                    <span>Hiring progress</span>
                                                    <strong>{job.progress}%</strong>
                                                </div>
                                                <div className="rd-progress-track">
                                                    <span style={{ width: `${job.progress}%` }} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rd-job-applicants">
                                            <UsersRound size={15} />
                                            {job.applicants}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="rd-panel rd-top-candidates">
                            <div className="rd-panel-heading">
                                <div>
                                    <span className="rd-eyebrow">AI RECOMMENDATIONS</span>
                                    <h2>Top candidates</h2>
                                </div>
                                <div className="rd-ai-mark">
                                    <TrendingUp size={17} />
                                </div>
                            </div>

                            <p className="rd-top-description">
                                Candidates with the strongest profile match.
                            </p>

                            <div className="rd-top-list">
                                {topCandidates.map((candidate, index) => (
                                    <div className="rd-top-candidate" key={candidate.name}>
                                        <span className="rd-rank">{String(index + 1).padStart(2, "0")}</span>
                                        <div className="rd-top-avatar">{candidate.initials}</div>

                                        <div className="rd-top-info">
                                            <strong>{candidate.name}</strong>
                                            <span>{candidate.role}</span>
                                            <div className="rd-skill-tags">
                                                {candidate.skills.map((skill) => (
                                                    <span key={skill}>{skill}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="rd-top-score">
                                            <strong>{candidate.score}%</strong>
                                            <span>Match</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link to="/recruiter/candidates" className="rd-view-all">
                                Discover more candidates <ArrowUpRight size={15} />
                            </Link>
                        </div>
                    </section>

                    {/* FOOTER */}
                    <footer className="rd-footer">
                        <span>© 2026 SkillUp. All rights reserved.</span>
                        <span>Made for better connections.</span>
                    </footer>
                </div>
            </main>
        </div>
    );
}

export default RecruiterDashboard;
