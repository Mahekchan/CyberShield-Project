import React, { useRef } from "react";
import customImg from "../assets/cybershield.png";
import logoImg from "../assets/mylogo.png";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI-Powered Detection",
    description:
      "Advanced machine learning algorithms analyze text communications to identify potential cyberbullying incidents with high accuracy.",
    icon: "🤖",
  },
  {
    title: "Real-time Alerts",
    description:
      "Immediate notifications when potential cyberbullying is detected, allowing for swift intervention by school staff.",
    icon: "🚨",
  },
  {
    title: "Comprehensive Reporting",
    description:
      "Detailed analytics and reports to track incidents, identify patterns, and measure the effectiveness of anti-bullying initiatives.",
    icon: "📊",
  },
  {
    title: "Customizable Settings",
    description:
      "Tailor the system to your school's specific needs with adjustable sensitivity levels and custom alert preferences.",
    icon: "⚙️",
  },
  {
    title: "Educational Resources",
    description:
      "A library of resources to help educate students, parents, and staff about cyberbullying prevention and digital citizenship.",
    icon: "📚",
  },
  {
    title: "Privacy-Focused",
    description:
      "Designed with student privacy in mind, using secure encryption and complying with all relevant data protection regulations.",
    icon: "🔒",
  },
];

const blueGradient = "linear-gradient(90deg, #1669e5 10%, #23a6f0 80%, #38eaf2 100%)";

const navGetStartedButtonStyle: React.CSSProperties = {
  marginLeft: 18,
  background: blueGradient,
  color: "#fff",
  fontWeight: 700,
  padding: "12px 34px",
  borderRadius: 7,
  fontSize: 18,
  textDecoration: "none",
  border: "none",
  boxShadow: "0 2px 12px #1669e533",
  transition: "background 0.2s, color 0.2s, box-shadow 0.2s",
  position: "relative",
  overflow: "hidden",
  outline: "none",
  cursor: "pointer",
  display: "inline-block",
};

const LandingPage: React.FC = () => {
  // Use react-router Link for navigation, not href
  const navBtnRef = useRef<HTMLAnchorElement | null>(null);

  const handleNavBtnMouseOver = () => {
    if (navBtnRef.current) {
      navBtnRef.current.style.background = "#fff";
      navBtnRef.current.style.color = "#1669e5";
      navBtnRef.current.style.border = "2px solid #23a6f0";
      navBtnRef.current.style.boxShadow = "none";
    }
  };

  const handleNavBtnMouseOut = () => {
    if (navBtnRef.current) {
      navBtnRef.current.style.background = blueGradient;
      navBtnRef.current.style.color = "#fff";
      navBtnRef.current.style.border = "none";
      navBtnRef.current.style.boxShadow = "0 2px 12px #1669e533";
    }
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", position: "relative" }}>
      {/* LOGO ON TOP LEFT CORNER */}
      <div
        style={{
          position: "absolute",
          top: 14,
          left: 30,
          display: "flex",
          alignItems: "center",
          zIndex: 999,
          height: 90,
        }}
      >
        <img
          src={logoImg}
          alt="Logo"
          style={{
            width: 82,
            height: 70,
            objectFit: "contain",
            marginRight: 0,
          }}
        />
        <span
          style={{
            fontWeight: 900,
            fontSize: 32,
            background: blueGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 2,
            textShadow: "0 2px 8px rgba(48,134,201,0.09)",
            lineHeight: 1,
            marginLeft: 4,
          }}
        >
          CyberShield
        </span>
      </div>

      {/* Navbar */}
      <nav style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "28px 8vw 28px 220px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(48,134,201,0.07)",
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{ display: "flex", gap: 34, alignItems: "center" }}>
          <a href="#" style={{ color: "#3086c9", fontWeight: 600, textDecoration: "none" }}>Home</a>
          <a href="#features" style={{ color: "#333", fontWeight: 500, textDecoration: "none" }}>Features</a>
          <a href="#about" style={{ color: "#333", fontWeight: 500, textDecoration: "none" }}>About</a>
          <a href="#contact" style={{ color: "#333", fontWeight: 500, textDecoration: "none" }}>Contact</a>
          {/* Navbar Get Started button with Learn More effect */}
          <Link
            ref={navBtnRef}
            to="/signin"
            style={navGetStartedButtonStyle}
            onMouseOver={handleNavBtnMouseOver}
            onMouseOut={handleNavBtnMouseOut}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "64px 8vw 40px 8vw",
        gap: 40
      }}>
        <div style={{ flex: 1, minWidth: 330 }}>
          <h1 style={{ fontSize: 45, color: "#222", fontWeight: 800, marginBottom: 20, letterSpacing: 1 }}>
            Protecting Students<br />Against <span style={{ background: blueGradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Cyberbullying</span>
          </h1>
          <p style={{ fontSize: 20, color: "#444", marginBottom: 30, maxWidth: 520 }}>
            CyberShield is an advanced cyberbullying detection and alert system designed specifically for schools. Our AI-powered platform monitors digital communications to identify and prevent cyberbullying incidents before they escalate.
          </p>
          <div style={{ display: "flex", gap: 18 }}>
            <a href="#features"
              style={{
                background: blueGradient,
                color: "#fff",
                fontWeight: 700,
                padding: "14px 38px",
                borderRadius: 8,
                fontSize: 18,
                textDecoration: "none",
                boxShadow: "0 2px 12px #1669e533",
                border: "none",
                transition: "background 0.2s, box-shadow 0.2s",
                position: "relative",
                overflow: "hidden",
                outline: "none",
              }}
            >
              Learn More
            </a>
            <Link
              to="/signin"
              style={{
                color: "#1669e5",
                background: "#fff",
                fontWeight: 700,
                padding: "14px 38px",
                borderRadius: 8,
                fontSize: 18,
                textDecoration: "none",
                border: "2px solid #23a6f0",
                boxShadow: "none",
                position: "relative",
                overflow: "hidden",
                transition: "border 0.18s, color 0.18s, background 0.18s",
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLAnchorElement).style.background =
                  "linear-gradient(90deg, #1669e5 10%, #23a6f0 80%, #38eaf2 100%)";
                (e.currentTarget as HTMLAnchorElement).style.color = "#fff";
                (e.currentTarget as HTMLAnchorElement).style.border = "2px solid #1669e5";
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#fff";
                (e.currentTarget as HTMLAnchorElement).style.color = "#1669e5";
                (e.currentTarget as HTMLAnchorElement).style.border = "2px solid #23a6f0";
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
        <div style={{
          flex: 1,
          textAlign: "center",
          minWidth: 350,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <img
            src={customImg}
            alt="Cyberbullying prevention"
            style={{
              width: 510,
              height: 500,
              objectFit: "cover",
              borderRadius: 0,
              boxShadow: "none",
              border: "none",
              display: "block"
            }}
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "60px 8vw 40px 8vw", background: "#fff" }}>
        <h2 style={{ fontSize: 36, color: "#222", fontWeight: 800, textAlign: "center", marginBottom: 44 }}>
          How <span style={{ color: "#3086c9" }}>CyberShield</span> Works
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))",
          gap: 38,
          margin: "0 auto",
          maxWidth: 1160
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "#f7faff",
              borderRadius: 12,
              boxShadow: "0 2px 12px rgba(48,134,201,0.07)",
              padding: "36px 28px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start"
            }}>
              <span style={{
                fontSize: 36,
                marginBottom: 16
              }}>{f.icon}</span>
              <div style={{ fontWeight: 700, fontSize: 22, color: "#3086c9", marginBottom: 7 }}>{f.title}</div>
              <div style={{ color: "#444", fontSize: 16 }}>{f.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose */}
      <section id="about" style={{ padding: "60px 8vw 30px 8vw", background: "#f7faff" }}>
        <h2 style={{ fontSize: 36, color: "#222", fontWeight: 800, textAlign: "center", marginBottom: 18 }}>
          Why Choose <span style={{ color: "#3086c9" }}>CyberShield?</span>
        </h2>
        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
          color: "#444",
          fontSize: 18,
          marginBottom: 32
        }}>
          CyberShield was developed by a team of educators, psychologists, and technology experts committed to creating safer digital environments for students. Our mission is to empower schools with the tools they need to effectively prevent and address cyberbullying.
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
          gap: 28,
          maxWidth: 900,
          margin: "0 auto",
          marginBottom: 36
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 8,
            padding: "30px 18px",
            boxShadow: "0 2px 10px rgba(48,134,201,0.07)",
            fontSize: 17,
            color: "#3086c9",
            fontWeight: 700
          }}>
            Proven Results<br />
            <span style={{ color: "#444", fontWeight: 500, fontSize: 16 }}>
              Up to <span style={{ color: "#3086c9", fontWeight: 800, fontSize: 18 }}>60% reduction</span> in cyberbullying incidents within the first semester.
            </span>
          </div>
          <div style={{
            background: "#fff",
            borderRadius: 8,
            padding: "30px 18px",
            boxShadow: "0 2px 10px rgba(48,134,201,0.07)",
            fontSize: 17,
            color: "#3086c9",
            fontWeight: 700
          }}>
            Easy Implementation<br />
            <span style={{ color: "#444", fontWeight: 500, fontSize: 16 }}>
              Seamless integration with your existing school technology infrastructure.
            </span>
          </div>
          <div style={{
            background: "#fff",
            borderRadius: 8,
            padding: "30px 18px",
            boxShadow: "0 2px 10px rgba(48,134,201,0.07)",
            fontSize: 17,
            color: "#3086c9",
            fontWeight: 700
          }}>
            Dedicated Support<br />
            <span style={{ color: "#444", fontWeight: 500, fontSize: 16 }}>
              Comprehensive training and ongoing technical support to ensure success.
            </span>
          </div>
        </div>
        <div style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 2px 18px rgba(48,134,201,0.09)",
          padding: "32px 30px",
          fontStyle: "italic",
          fontSize: 18,
          color: "#333",
          marginBottom: 24
        }}>
          <div style={{ marginBottom: 13 }}>
            “CyberShield has transformed how we approach digital safety at our school. The early detection system has allowed us to intervene before situations escalate, and the educational resources have helped us build a culture of respect online.”
          </div>
          <div style={{ fontWeight: 700, color: "#3086c9" }}>
            Sarah Johnson<br />
            <span style={{ color: "#888", fontWeight: 500, fontStyle: "normal" }}>Principal, Lincoln Middle School</span>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 18 }}>
          <Link to="/signin"
            style={{
              background: "linear-gradient(90deg,#1767e5 0%,#23a6f0 100%)",
              color: "#fff",
              fontWeight: 700,
              padding: "14px 50px",
              borderRadius: 8,
              fontSize: 20,
              textDecoration: "none",
              boxShadow: "0 2px 12px #1767e544"
            }}>
            Get Started
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ background: "#fff", padding: "60px 8vw" }}>
        <h2 style={{ fontSize: 34, color: "#222", fontWeight: 800, textAlign: "center", marginBottom: 24 }}>
          Contact Us
        </h2>
        <div style={{
          maxWidth: 500,
          margin: "0 auto",
          background: "#f7faff",
          borderRadius: 12,
          padding: "34px 32px",
          boxShadow: "0 2px 14px rgba(48,134,201,0.09)"
        }}>
          <form>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontWeight: 600, color: "#3086c9" }}>Name</label>
              <input type="text" placeholder="Your name" style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 7,
                border: "1px solid #b5c4dc",
                fontSize: 16,
                marginTop: 6
              }} required />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontWeight: 600, color: "#3086c9" }}>Email</label>
              <input type="email" placeholder="your@email.com" style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 7,
                border: "1px solid #b5c4dc",
                fontSize: 16,
                marginTop: 6
              }} required />
            </div>
            <div style={{ marginBottom: 22 }}>
              <label style={{ fontWeight: 600, color: "#3086c9" }}>School/Organization</label>
              <input type="text" placeholder="School name" style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 7,
                border: "1px solid #b5c4dc",
                fontSize: 16,
                marginTop: 6
              }} required />
            </div>
            <div style={{ marginBottom: 26 }}>
              <label style={{ fontWeight: 600, color: "#3086c9" }}>Message</label>
              <textarea placeholder="Your message" style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 7,
                border: "1px solid #b5c4dc",
                fontSize: 16,
                marginTop: 6,
                minHeight: 80,
                resize: "vertical"
              }} required />
            </div>
            <button type="submit" style={{
              background: "linear-gradient(90deg,#1767e5 0%,#23a6f0 100%)",
              color: "#fff",
              fontWeight: 700,
              padding: "13px 0",
              borderRadius: 7,
              fontSize: 18,
              border: "none",
              width: "100%",
              cursor: "pointer"
            }}>Send Message</button>
          </form>
          <div style={{
            marginTop: 14,
            fontSize: 13,
            color: "#888",
            textAlign: "center"
          }}>
            This is a demo contact form. In a real implementation, form submission would be handled securely.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: "#3086c9",
        color: "#fff",
        padding: "40px 8vw 18px 8vw",
        marginTop: 30
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 30,
          marginBottom: 28
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: 1 }}>CyberShield</div>
            <div style={{ margin: "13px 0 0 0", fontSize: 15, color: "#eaf3fa" }}>
              Protecting students from cyberbullying with advanced AI detection and alert systems. Creating safer digital environments for schools.
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 18 }}>
              <a href="#" title="Facebook" style={{ color: "#fff", fontSize: 19 }}>🌐</a>
              <a href="#" title="Instagram" style={{ color: "#fff", fontSize: 19 }}>📸</a>
              <a href="#" title="Twitter" style={{ color: "#fff", fontSize: 19 }}>🐦</a>
              <a href="#" title="LinkedIn" style={{ color: "#fff", fontSize: 19 }}>💼</a>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 7 }}>Solutions</div>
            <div><a href="#" style={{ color: "#eaf3fa", textDecoration: "none", fontSize: 15 }}>For Schools</a></div>
            <div><a href="#" style={{ color: "#eaf3fa", textDecoration: "none", fontSize: 15 }}>For Districts</a></div>
            <div><a href="#" style={{ color: "#eaf3fa", textDecoration: "none", fontSize: 15 }}>For Parents</a></div>
            <div><a href="#" style={{ color: "#eaf3fa", textDecoration: "none", fontSize: 15 }}>Pricing</a></div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 7 }}>Company</div>
            <div><a href="#about" style={{ color: "#eaf3fa", textDecoration: "none", fontSize: 15 }}>About</a></div>
            <div><a href="#" style={{ color: "#eaf3fa", textDecoration: "none", fontSize: 15 }}>Blog</a></div>
            <div><a href="#" style={{ color: "#eaf3fa", textDecoration: "none", fontSize: 15 }}>Careers</a></div>
            <div><a href="#contact" style={{ color: "#eaf3fa", textDecoration: "none", fontSize: 15 }}>Contact</a></div>
          </div>
        </div>
        <div style={{
          textAlign: "center",
          color: "#eaf3fa",
          fontSize: 15,
          marginTop: 12,
          borderTop: "1px solid #4897d7",
          paddingTop: 14
        }}>
          © 2025 CyberShield, Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;