
import { useState } from "react";
import { loginUser } from "../services/authService";
import { Link, useNavigate } from "react-router";
import {
  UserRound,
  BriefcaseBusiness,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import "./Login.css";

function Login() {
  const [role, setRole] = useState("Candidate");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const roles = [
    { name: "Candidate", icon: UserRound },
    { name: "Recruiter", icon: BriefcaseBusiness },
    { name: "Admin", icon: ShieldCheck },
  ];

  const activeIndex = roles.findIndex(
    (item) => item.name === role
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const user = await loginUser({
        email,
        password,
        role: role.toUpperCase(),
      });

      // Store user information, never the password
      localStorage.setItem("skillupUser", JSON.stringify(user));

      if (user.role === "CANDIDATE") {
        navigate("/candidate/dashboard");
      } else if (user.role === "RECRUITER") {
        navigate("/recruiter/dashboard");
      } else {
        setError("The admin dashboard is not configured yet.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <main className="login-page">
      <section className="login-card">

        {/* LEFT SIDE */}
        <div className="login-form-section">

          <div className="login-form-header">
            <h1>Welcome back</h1>
            <p>
              Sign in to your SkillUp account and continue
              your journey.
            </p>
          </div>

          {/* ROLE SELECTION */}
          <div
            className="role-selector"
            style={{
              "--active-index": activeIndex,
            }}
          >
            <div
              className="role-selection-indicator"
              style={{
                transform: `translateX(calc(${activeIndex * 100}% + ${activeIndex * 12}px))`,
              }}
            />

            {roles.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setRole(item.name)}
                  className={`role-option ${role === item.name ? "selected" : ""
                    }`}
                  aria-pressed={role === item.name}
                >
                  <Icon
                    className="role-icon"
                    size={25}
                    strokeWidth={1.8}
                  />

                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* LOGIN FORM */}
          <form
            onSubmit={handleSubmit}
            className="login-form-animated"
          >
            <div className="login-input-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="password">Password</label>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="remember-option">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />
                Remember me
              </label>

              <Link to="/forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              <span>{loading ? "Signing in..." : `Sign in as ${role}`}</span>
              <ArrowRight size={19} />
            </button>
          </form>
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <div className="login-register">
            New to SkillUp?
            <Link to="/register"> Create an account</Link>
          </div>

          <div className="login-terms">
            By continuing, you agree to SkillUp's
            <Link to="/terms"> Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy"> Privacy Policy</Link>.
          </div>

        </div>

        {/* RIGHT SIDE - NORMAL WELCOME PANEL */}
        <div className="login-welcome">

          <div className="welcome-decoration decoration-one" />
          <div className="welcome-decoration decoration-two" />

          <div className="welcome-content">

            <span className="welcome-badge">
              <span className="welcome-dot" />
              AI recruitment, made human
            </span>

            <h2>
              Your talent.
              <br />
              Your opportunity.
              <br />
              Your future.
            </h2>

            <p>
              SkillUp connects talented candidates with
              the right opportunities through smarter
              recruitment.
            </p>

            <div className="welcome-highlight">
              <span className="highlight-icon">✧</span>

              <div>
                <strong>Discover your potential.</strong>
                <p>
                  Make your next career move with confidence.
                </p>
              </div>
            </div>

          </div>

          <div className="welcome-bottom">
            <span>SkillUp.</span>
            <span>Find your talent. Build your future.</span>
          </div>

        </div>

      </section>
    </main>
  );
}

export default Login;
