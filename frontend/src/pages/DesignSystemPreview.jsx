import "./DesignSystemPreview.css";
import React from "react";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";

import "../components/common/common.css";
import "../styles/design-system.css";

function DesignSystemPreview() {
  const colors = [
    { name: "Warm Ivory", hex: "#FFF1E9" },
    { name: "Soft Coral", hex: "#F4A58C" },
    { name: "Light Lavender", hex: "#E9D9F7" },
    { name: "Lavender", hex: "#E9E4FF" },
    { name: "Violet", hex: "#8065DF" },
    { name: "Deep Navy", hex: "#17152F" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Light Gray", hex: "#F7F7FB" },
    { name: "Success", hex: "#25A56A" },
    { name: "Warning", hex: "#F4A340" },
  ];

  return (
    <main className="ds-page">
      <header className="ds-header">
        <Badge variant="info">SKILLUP DESIGN SYSTEM</Badge>

        <h1>Design System Preview</h1>

        <p>
          A consistent visual language for a smarter
          recruitment experience.
        </p>
      </header>

      {/* COLOR PALETTE */}
      <section className="ds-section">
        <h2>01. Color Palette</h2>
        <p className="ds-description">
          The official colors defining the SkillUp identity.
        </p>

        <div className="ds-colors">
          {colors.map((color) => (
            <div className="ds-color" key={color.name}>
              <div
                className="ds-color__sample"
                style={{ backgroundColor: color.hex }}
              />
              <strong>{color.name}</strong>
              <span>{color.hex}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TYPOGRAPHY */}
      <section className="ds-section">
        <h2>02. Typography</h2>

        <div className="ds-typography">
          <h1>Heading 1 — SkillUp</h1>
          <h2>Heading 2 — Recruitment Platform</h2>
          <h3>Heading 3 — Find Your Opportunity</h3>
          <p>
            Body text — Connecting talented candidates
            with the right professional opportunities.
          </p>
          <small>Small text — Supporting information</small>
        </div>
      </section>

      {/* BUTTONS */}
      <section className="ds-section">
        <h2>03. Buttons</h2>

        <div className="ds-flex">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>

        <div className="ds-flex">
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </section>

      {/* INPUTS */}
      <section className="ds-section">
        <h2>04. Inputs</h2>

        <div className="ds-inputs">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="example@email.com"
            helperText="We will never share your email."
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error="This field is required."
          />

          <Input
            label="Disabled Input"
            placeholder="Disabled field"
            disabled
          />
        </div>
      </section>

      {/* CARDS */}
      <section className="ds-section">
        <h2>05. Cards</h2>

        <div className="ds-cards">
          <Card
            title="Default Card"
            description="A reusable card component."
          >
            <p>
              SkillUp helps candidates discover
              professional opportunities.
            </p>
          </Card>

          <Card
            title="Interactive Card"
            description="Card with hover interaction."
            hoverable
          >
            <Badge variant="success">Active</Badge>
            <p>Discover a better recruitment experience.</p>
          </Card>
        </div>
      </section>

      {/* BADGES */}
      <section className="ds-section">
        <h2>06. Badges</h2>

        <div className="ds-flex">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Information</Badge>
        </div>
      </section>

      <footer className="ds-footer">
        <p>SkillUp Design System · Frontend Team · 2026</p>
      </footer>
    </main>
  );
}

export default DesignSystemPreview;
