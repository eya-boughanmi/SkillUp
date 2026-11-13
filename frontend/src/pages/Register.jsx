
import { useState } from "react";
import { Link } from "react-router";
import {
  UserRound,
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  UploadCloud,
  FileText,
  X,
  Sparkles,
} from "lucide-react";

import "./Register.css";

function Register() {
  const [role, setRole] = useState("candidate");
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    educationLevel: "",
    institution: "",
    fieldOfStudy: "",
    companyName: "",
    jobPosition: "",
    website: "",
    address: "",
    terms: false,
  });

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setStep(1);
    setErrors({});
    setFile(null);
    setSubmitted(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateStepOne = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStepTwo = () => {
    const newErrors = {};

    if (role === "candidate") {
      if (!formData.educationLevel) {
        newErrors.educationLevel = "Please select your education level.";
      }

      if (!formData.institution.trim()) {
        newErrors.institution = "Institution is required.";
      }

      if (!formData.fieldOfStudy.trim()) {
        newErrors.fieldOfStudy = "Field of study is required.";
      }
    }

    if (role === "recruiter") {
      if (!formData.companyName.trim()) {
        newErrors.companyName = "Company name is required.";
      }

      if (!formData.jobPosition.trim()) {
        newErrors.jobPosition = "Job position is required.";
      }

      if (!formData.website.trim()) {
        newErrors.website = "Company website is required.";
      } else if (
        !/^https?:\/\/.+\..+/.test(formData.website)
      ) {
        newErrors.website = "Enter a valid URL (https://...).";
      }

      if (!formData.address.trim()) {
        newErrors.address = "Company address is required.";
      }

      if (!file) {
        newErrors.document = "Company authorization document is required.";
      }
    }

    if (!formData.terms) {
      newErrors.terms = "You must accept the terms and conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStepOne()) {
      setStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateStepTwo()) return;

    // Frontend prototype: connect this part to your backend API.
    setSubmitted(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        document: "Please upload a PDF file.",
      }));
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        document: "File size must not exceed 5 MB.",
      }));
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, document: "" }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      educationLevel: "",
      institution: "",
      fieldOfStudy: "",
      companyName: "",
      jobPosition: "",
      website: "",
      address: "",
      terms: false,
    });

    setFile(null);
    setErrors({});
    setStep(1);
    setSubmitted(false);
  };

  const passwordStrength = () => {
    const password = formData.password;

    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const renderInput = ({
    label,
    name,
    placeholder,
    type = "text",
    icon: Icon,
    autoComplete,
  }) => (
    <div className="register-field" key={name}>
      <label htmlFor={name}>{label}</label>

      <div className={`register-input-wrapper ${errors[name] ? "has-error" : ""}`}>
        {Icon && <Icon className="register-input-icon" size={19} />}

        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          autoComplete={autoComplete}
        />
      </div>

      {errors[name] && (
        <span className="register-error">{errors[name]}</span>
      )}
    </div>
  );

  if (submitted) {
    return (
      <main className="register-page">
        <div className="register-success-card">
          <div className="register-success-icon">
            {role === "recruiter" ? (
              <ShieldCheck size={42} />
            ) : (
              <CheckCircle2 size={42} />
            )}
          </div>

          <span className="register-eyebrow">REGISTRATION COMPLETED</span>

          <h1>
            {role === "recruiter"
              ? "Your request is submitted!"
              : "Welcome to SkillUp!"}
          </h1>

          <p>
            {role === "recruiter"
              ? "Your company registration is now pending admin approval. We will notify you once your account has been reviewed."
              : "Your account information has been validated. You can now continue to your SkillUp journey."}
          </p>

          {role === "recruiter" && (
            <div className="register-pending-box">
              <ShieldCheck size={22} />
              <div>
                <strong>Pending Approval</strong>
                <span>Your account awaits administrator verification.</span>
              </div>
            </div>
          )}

          <Link to="/login" className="register-primary-btn">
            Go to Sign In <ArrowRight size={18} />
          </Link>

          <button className="register-reset-btn" onClick={resetForm}>
            Back to registration
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="register-page">
      <div className="register-shell">

        {/* LEFT SIDE - FORM */}

        <section className="register-form-side">
          <div className="register-form-content">

            <Link to="/" className="register-mobile-logo">
              Skill<span>Up</span>.
            </Link>

            <div className="register-heading">
              <span className="register-eyebrow">
                JOIN THE COMMUNITY
              </span>

              <h1>Create your account<span>.</span></h1>

              <p>
                Start your journey with SkillUp and discover
                new opportunities.
              </p>
            </div>

            {/* ROLE SELECTION */}

            <div className="register-role-section">
              <span className="register-section-label">
                I want to join as
              </span>

              <div className="register-role-selector">

                <button
                  type="button"
                  className={`register-role-card ${role === "candidate" ? "selected" : ""}`}
                  onClick={() => handleRoleChange("candidate")}
                >
                  <UserRound size={25} />
                  <span>Candidate</span>
                  {role === "candidate" && (
                    <CheckCircle2 className="role-check" size={17} />
                  )}
                </button>

                <button
                  type="button"
                  className={`register-role-card ${role === "recruiter" ? "selected" : ""}`}
                  onClick={() => handleRoleChange("recruiter")}
                >
                  <Building2 size={25} />
                  <span>Recruiter</span>
                  {role === "recruiter" && (
                    <CheckCircle2 className="role-check" size={17} />
                  )}
                </button>

              </div>
            </div>

            {/* PROGRESS */}

            <div className="register-progress">
              <div className="register-progress-info">
                <span>Step {step} of 2</span>
                <span>{step === 1 ? "Personal details" : "Additional details"}</span>
              </div>

              <div className="register-progress-track">
                <div
                  className={`register-progress-fill ${step === 2 ? "complete" : ""}`}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              <div className="register-step-content" key={`${role}-${step}`}>

                {step === 1 ? (
                  <>
                    <div className="register-step-heading">
                      <h2>Personal information</h2>
                      <p>Tell us a little about yourself.</p>
                    </div>

                    <div className="register-fields-grid">

                      {renderInput({
                        label: "Full Name",
                        name: "fullName",
                        placeholder: "John Doe",
                        icon: UserRound,
                        autoComplete: "name",
                      })}

                      {renderInput({
                        label: role === "recruiter" ? "Professional Email" : "Email Address",
                        name: "email",
                        placeholder: "you@example.com",
                        type: "email",
                        icon: null,
                        autoComplete: "email",
                      })}

                      {renderInput({
                        label: "Phone Number",
                        name: "phone",
                        placeholder: "+216 XX XXX XXX",
                        type: "tel",
                        icon: null,
                        autoComplete: "tel",
                      })}

                    </div>

                    <div className="register-step-heading register-security-heading">
                      <h2>Security</h2>
                      <p>Choose a strong password to protect your account.</p>
                    </div>

                    <div className="register-fields-grid">

                      <div className="register-field">
                        <label htmlFor="password">Password</label>

                        <div className={`register-input-wrapper ${errors.password ? "has-error" : ""}`}>
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="At least 8 characters"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                          />

                          <button
                            type="button"
                            className="register-eye-btn"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                          >
                            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                          </button>
                        </div>

                        {formData.password && (
                          <div className="password-strength">
                            <div className="password-strength-bars">
                              {[1, 2, 3, 4].map((level) => (
                                <span
                                  key={level}
                                  className={passwordStrength() >= level ? `strength-${passwordStrength()}` : ""}
                                />
                              ))}
                            </div>
                            <small>
                              {["", "Weak", "Fair", "Good", "Strong"][passwordStrength()]}
                            </small>
                          </div>
                        )}

                        {errors.password && (
                          <span className="register-error">{errors.password}</span>
                        )}
                      </div>

                      <div className="register-field">
                        <label htmlFor="confirmPassword">Confirm Password</label>

                        <div className={`register-input-wrapper ${errors.confirmPassword ? "has-error" : ""}`}>
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Re-enter your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            autoComplete="new-password"
                          />

                          <button
                            type="button"
                            className="register-eye-btn"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label="Toggle confirm password visibility"
                          >
                            {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                          </button>
                        </div>

                        {errors.confirmPassword && (
                          <span className="register-error">{errors.confirmPassword}</span>
                        )}
                      </div>

                    </div>
                  </>
                ) : (
                  <>
                    {role === "candidate" ? (
                      <>
                        <div className="register-step-heading">
                          <div className="register-heading-icon">
                            <GraduationCap size={24} />
                          </div>
                          <h2>Academic background</h2>
                          <p>Help us understand your education and interests.</p>
                        </div>

                        <div className="register-fields-grid">

                          <div className="register-field register-full-width">
                            <label htmlFor="educationLevel">Education Level</label>

                            <select
                              id="educationLevel"
                              name="educationLevel"
                              value={formData.educationLevel}
                              onChange={handleChange}
                              className={errors.educationLevel ? "has-error" : ""}
                            >
                              <option value="">Select your education level</option>
                              <option value="High School">High School</option>
                              <option value="Bachelor's Degree">Bachelor's Degree</option>
                              <option value="Master's Degree">Master's Degree</option>
                              <option value="Engineering Degree">Engineering Degree</option>
                              <option value="PhD">PhD</option>
                              <option value="Other">Other</option>
                            </select>

                            {errors.educationLevel && (
                              <span className="register-error">{errors.educationLevel}</span>
                            )}
                          </div>

                          {renderInput({
                            label: "University / Institution",
                            name: "institution",
                            placeholder: "Your university or school",
                            icon: GraduationCap,
                          })}

                          {renderInput({
                            label: "Field of Study",
                            name: "fieldOfStudy",
                            placeholder: "e.g. Computer Science",
                            icon: null,
                          })}

                        </div>
                      </>
                    ) : (
                      <>
                        <div className="register-step-heading">
                          <div className="register-heading-icon">
                            <BriefcaseBusiness size={24} />
                          </div>
                          <h2>Company information</h2>
                          <p>Tell us about the organization you represent.</p>
                        </div>

                        <div className="register-fields-grid">

                          {renderInput({
                            label: "Company Name",
                            name: "companyName",
                            placeholder: "Your company name",
                            icon: Building2,
                          })}

                          {renderInput({
                            label: "Job Position",
                            name: "jobPosition",
                            placeholder: "e.g. HR Manager",
                            icon: BriefcaseBusiness,
                          })}

                          {renderInput({
                            label: "Company Website",
                            name: "website",
                            placeholder: "https://www.company.com",
                            icon: null,
                          })}

                          <div className="register-field">
                            <label htmlFor="address">Company Address</label>
                            <div className={`register-input-wrapper ${errors.address ? "has-error" : ""}`}>
                              <input
                                id="address"
                                name="address"
                                placeholder="City, Country, Street..."
                                value={formData.address}
                                onChange={handleChange}
                              />
                            </div>
                            {errors.address && (
                              <span className="register-error">{errors.address}</span>
                            )}
                          </div>

                          <div className="register-field register-full-width">
                            <label>Company Authorization Document</label>

                            <label
                              htmlFor="companyDocument"
                              className={`register-upload-area ${errors.document ? "upload-error" : ""}`}
                            >
                              {file ? (
                                <div className="register-file-preview">
                                  <FileText size={28} />
                                  <div>
                                    <strong>{file.name}</strong>
                                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setFile(null);
                                    }}
                                    className="register-remove-file"
                                    aria-label="Remove file"
                                  >
                                    <X size={19} />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <UploadCloud size={30} />
                                  <strong>Click to upload your document</strong>
                                  <span>PDF format · Maximum 5 MB</span>
                                </>
                              )}
                            </label>

                            <input
                              id="companyDocument"
                              type="file"
                              accept=".pdf,application/pdf"
                              onChange={handleFileChange}
                              hidden
                            />

                            {errors.document && (
                              <span className="register-error">{errors.document}</span>
                            )}
                          </div>

                        </div>

                        <div className="register-approval-note">
                          <ShieldCheck size={21} />
                          <div>
                            <strong>Admin verification required</strong>
                            <p>Your company details and authorization document will be reviewed before account activation.</p>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="register-terms">
                      <label className="register-checkbox">
                        <input
                          type="checkbox"
                          name="terms"
                          checked={formData.terms}
                          onChange={handleChange}
                        />
                        <span className="custom-checkbox">
                          <CheckCircle2 size={14} />
                        </span>
                        <span>
                          I agree to the{" "}
                          <Link to="/terms" target="_blank">
                            Terms & Conditions
                          </Link>{" "}
                          and{" "}
                          <Link to="/privacy" target="_blank">
                            Privacy Policy
                          </Link>.
                        </span>
                      </label>

                      {errors.terms && (
                        <span className="register-error">{errors.terms}</span>
                      )}
                    </div>

                  </>
                )}

              </div>

              {/* FORM ACTIONS */}

              <div className="register-form-actions">

                {step === 2 && (
                  <button
                    type="button"
                    className="register-back-btn"
                    onClick={() => {
                      setStep(1);
                      setErrors({});
                    }}
                  >
                    <ArrowLeft size={17} /> Back
                  </button>
                )}

                {step === 1 ? (
                  <button
                    type="button"
                    className="register-primary-btn"
                    onClick={handleNext}
                  >
                    Continue <ArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="register-primary-btn"
                  >
                    {role === "recruiter"
                      ? "Submit for approval"
                      : "Create account"}
                    <ArrowRight size={18} />
                  </button>
                )}

              </div>

            </form>

            <div className="register-login-link">
              Already have an account?{" "}
              <Link to="/login">Sign in</Link>
            </div>

            <div className="register-security-footer">
              <ShieldCheck size={15} />
              Your information is protected and secure.
            </div>

          </div>
        </section>

        {/* RIGHT SIDE - VISUAL */}

        <aside className="register-visual-side">
          <div className="register-visual-glow register-glow-one" />
          <div className="register-visual-glow register-glow-two" />

          <Link to="/" className="register-desktop-logo">
            Skill<span>Up</span>.
          </Link>

          <div className="register-visual-content">
            <div className="register-visual-badge">
              <Sparkles size={16} />
              AI recruitment, made human
            </div>

            <div className="register-visual-title">
              {role === "candidate" ? (
                <>
                  Your next opportunity.
                  <br />
                  Your next chapter.
                </>
              ) : (
                <>
                  Find the right talent.
                  <br />
                  Build your team.
                </>
              )}
            </div>

            <p>
              {role === "candidate"
                ? "Create your profile, showcase your potential and discover opportunities that match your ambitions."
                : "Connect with exceptional candidates and make smarter recruitment decisions with SkillUp."}
            </p>

            <div className="register-benefits-card">
              <div className="register-benefit-item">
                <div className="register-benefit-icon">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <strong>
                    {role === "candidate"
                      ? "Discover opportunities"
                      : "Access talented profiles"}
                  </strong>
                  <span>
                    {role === "candidate"
                      ? "Find opportunities that match your skills."
                      : "Connect with potential candidates."}
                  </span>
                </div>
              </div>

              <div className="register-benefit-item">
                <div className="register-benefit-icon">
                  <Sparkles size={20} />
                </div>
                <div>
                  <strong>AI-powered matching</strong>
                  <span>Smarter connections, better decisions.</span>
                </div>
              </div>

              <div className="register-benefit-item">
                <div className="register-benefit-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <strong>Secure experience</strong>
                  <span>Your data and privacy matter to us.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="register-visual-footer">
            <span>SkillUp</span>
            <span>Find your talent. Build your future.</span>
          </div>
        </aside>

      </div>
    </main>
  );
}

export default Register;
