import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import PrivacyPolicyModal from "../modals/PrivacyPolicyModal"; 

// Blue gradient for the message panels
const gradientBox = "linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)";
const gradientBoxReverse = "linear-gradient(135deg, #26d0ce 0%, #1a2980 100%)";
const argonBtnGradient = "linear-gradient(90deg, #1a2980 0%, #26d0ce 100%)";
const argonBtnHover = "linear-gradient(90deg, #26d0ce 0%, #1a2980 100%)";

interface AuthCardProps {
  mode?: "signin" | "signup";
}

const AuthCard: React.FC<AuthCardProps> = ({ mode }) => {
  const [isSignIn, setIsSignIn] = useState(mode !== "signup");
  useEffect(() => {
    if (mode === "signin") setIsSignIn(true);
    if (mode === "signup") setIsSignIn(false);
  }, [mode]);

  const [role, setRole] = useState<"student" | "admin">("student");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [resetPasswordMessage, setResetPasswordMessage] = useState("");

  // State to control privacy policy modal visibility
  const [isPrivacyPolicyModalOpen, setIsPrivacyPolicyModalOpen] = useState(false);
  // State for privacy policy checkbox on signup
  const [hasAgreedToPrivacy, setHasAgreedToPrivacy] = useState(false);

  const navigate = useNavigate();

  // Styles for various elements
  const inputStyle: React.CSSProperties = {
    width: "100%",
    marginBottom: 18,
    padding: "14px 14px",
    border: "none",
    borderRadius: 6,
    background: "#f1f1f1",
    fontSize: 18,
    outline: "none",
    fontFamily: "inherit",
  };

  const primaryButtonStyle: React.CSSProperties = {
    width: "100%",
    background: argonBtnGradient,
    color: "#fff",
    fontWeight: 700,
    fontSize: 20,
    border: "none",
    borderRadius: 30,
    padding: "13px 0",
    cursor: "pointer",
    boxShadow: "0 4px 16px 0 #1a298044, 0 1.5px 8px #26d0ce33",
    marginTop: 12,
    marginBottom: 0,
    transition: "background 0.3s, transform 0.18s"
  };

  const secondaryButtonStyle: React.CSSProperties = {
    border: "2px solid #fff",
    background: "transparent",
    color: "#fff",
    fontWeight: 700,
    fontSize: 20,
    borderRadius: 30,
    padding: "13px 0",
    cursor: "pointer",
    boxShadow: "0 2px 10px #1a298044",
    marginTop: 12,
    marginBottom: 0,
    width: 190,
    transition: "background 0.3s, color 0.3s"
  };

  const roleBtnStyle: React.CSSProperties = {
    borderRadius: 24,
    padding: "8px 24px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    outline: "none",
    background: "#fff",
    border: "2px solid #1a2980",
    transition: "all 0.18s"
  };

  // Function to validate password strength - now always returns valid.

  // Renders the Student/Admin role selector buttons
  const renderRoleSelector = () => (
    <div style={{
      display: "flex",
      gap: 12,
      justifyContent: "center",
      margin: "0 0 18px 0"
    }}>
      <button
        type="button"
        style={{
          ...roleBtnStyle,
          background: role === "student" ? "#1a2980" : "#fff",
          color: role === "student" ? "#fff" : "#1a2980",
          border: "2px solid #1a2980"
        }}
        onClick={() => setRole("student")}
        disabled={loading}
      >
        Student
      </button>
      <button
        type="button"
        style={{
          ...roleBtnStyle,
          background: role === "admin" ? "#1a2980" : "#fff",
          color: role === "admin" ? "#fff" : "#1a2980",
          border: "2px solid #1a2980"
        }}
        onClick={() => setRole("admin")}
        disabled={loading}
      >
        Admin
      </button>
    </div>
  );

  // Handles user sign-in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setResetPasswordMessage("");
    setLoading(true);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      if (role === "admin") {
        const db = getFirestore();
        const adminDoc = await getDoc(doc(db, "allowed_admins", loginEmail.toLowerCase()));
        if (!adminDoc.exists()) {
          await auth.signOut();
          setLoginError("Not authorized as admin.");
          setLoading(false);
          return;
        }
      }
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err: any) {
      setLoginError(err.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  // Handles user sign-up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setLoading(true);

    // Check if privacy policy checkbox is agreed
    if (!hasAgreedToPrivacy) {
      setSignupError("You must agree to the Privacy Policy to sign up.");
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth();
      const db = getFirestore();
      if (role === "admin") {
        const adminDoc = await getDoc(doc(db, "allowed_admins", signupEmail.toLowerCase()));
        if (!adminDoc.exists()) {
          setSignupError("Only authorized admins can register as Admin.");
          setLoading(false);
          return;
        }
      }
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      if (role === "student") {
        await setDoc(doc(db, "students", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          fullName: signupName,
          createdAt: new Date(),
        });
      } else {
        await setDoc(doc(db, "admins", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          fullName: signupName,
          createdAt: new Date(),
        });
      }
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err: any) {
      setSignupError(err.message || "Registration error");
    } finally {
      setLoading(false);
    }
  };

  // Handles the "Forgot your password?" click
  const handleForgotPassword = async () => {
    setLoginError("");
    setResetPasswordMessage("");
    if (!loginEmail) {
      setLoginError("Please enter your email to reset password.");
      return;
    }
    setLoading(true);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, loginEmail);
      setResetPasswordMessage("Password reset email sent! Check your inbox.");
    } catch (err: any) {
      setLoginError(err.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  // Privacy Policy content (as a string, for simplicity)
  // This content should accurately reflect your app's data handling practices.
  const privacyPolicyContent = `
    <h1>CyberShield Privacy Policy</h1>
    <p><strong>Last Updated:</strong> July 27, 2025</p>
    <p>Your privacy is important to us. This Privacy Policy explains how CyberShield ("we," "us," or "our") collects, uses, and discloses information about you when you use our application.</p>

    <h2>1. Information We Collect</h2>
    <p>We collect information to provide and improve our services to you.</p>
    <h3>Information You Provide to Us:</h3>
    <ul>
        <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
        <li><strong>Role Information:</strong> We collect your designated role (Student or Admin/Teacher) to grant appropriate access.</li>
        <li><strong>Communication Data:</strong> If you contact us, we may keep a record of that correspondence.</li>
        <li><strong>Content Data:</strong> For the purpose of cyberbullying detection, we collect and store "bully words" or phrases identified within the application's monitored content.</li>
    </ul>
    <h3>Information We Collect Automatically:</h3>
    <ul>
        <li><strong>Usage Data:</strong> We collect information about how you interact with our application, such as features used, and the time and date of your interactions.</li>
        <li><strong>Device Information:</strong> We may collect information about the device you use to access our application, including IP address, browser type, operating system, and unique device identifiers.</li>
    </ul>

    <h2>2. How We Use Your Information</h2>
    <p>We use the information we collect for various purposes, including:</p>
    <ul>
        <li>To provide, operate, and maintain our application.</li>
        <li>To create and manage your account.</li>
        <li>To personalize your experience and deliver content tailored to your role.</li>
        <li>To improve our application and develop new features.</li>
        <li>To communicate with you, including sending updates, security alerts, and support messages.</li>
        <li>To detect, prevent, and address technical issues or security incidents.</li>
        <li>To enforce our terms and conditions.</li>
    </ul>

    <h2>3. How We Share Your Information</h2>
    <p>We do not share your personal information with third parties except in the following limited circumstances:</p>
    <ul>
        <li><strong>With Your Consent:</strong> We may share your information if you give us explicit consent to do so.</li>
        <li><strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency).</li>
        <li><strong>To Protect Rights and Safety:</strong> We may disclose your information when we believe it is necessary to protect our rights, property, or safety, or the rights, property, or safety of others.</li>
        <li><strong>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
    </ul>

    <h2>4. Data Security</h2>
    <p>We implement reasonable security measures designed to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or method of electronic storage is 100% secure.</p>

    <h2>5. Your Choices</h2>
    <ul>
        <li><strong>Account Information:</strong> You can review and update your account information through your dashboard.</li>
    </ul>

    <h2>6. Children's Privacy</h2>
    <p>Our application is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.</p>

    <h2>7. Changes to This Privacy Policy</h2>
    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>

    <h2>8. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy, please contact us.</p>
  `;

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#f7f6f8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <div style={{
        width: 900,
        minHeight: 400,
        background: "#fff",
        boxShadow: "0 10px 36px 0 rgba(31,38,135,0.20), 0 2.8px 2.2px rgba(26,41,128,0.12)",
        borderRadius: 32,
        display: "flex",
        overflow: "hidden",
      }}>
        {/* Message Panel - left for sign up, right for sign in */}
        {isSignIn ? (
          // SIGN IN: message on right
          <>
            <div style={{
              flex: 0.9,
              padding: "56px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <h2 style={{
                fontSize: 36,
                fontWeight: 700,
                marginBottom: 20,
                marginTop: 0,
                textAlign: "center",
                color: "#162770",
                width: "100%",
                alignSelf: "flex-start"
              }}>Sign in</h2>
              {renderRoleSelector()}
              <form onSubmit={handleSignIn} style={{ width: "100%", maxWidth: 370 }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  required
                  style={inputStyle}
                  disabled={loading}
                  autoComplete="username"
                />
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    required
                    style={inputStyle}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <span
                    onClick={() => setShowLoginPassword(v => !v)}
                    style={{
                      position: "absolute",
                      right: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: 20,
                      color: "#1a2980",
                      userSelect: "none",
                    }}
                    tabIndex={0}
                  >
                    {showLoginPassword ? "🙈" : "👁️"}
                  </span>
                </div>
                {/* Forgot your password? link */}
                <div style={{ textAlign: "center", margin: "8px 0 18px 0", color: "#444" }}>
                  <span
                    onClick={handleForgotPassword}
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#1a2980",
                      fontSize: 14,
                    }}
                  >
                    Forgot your password?
                  </span>
                </div>
                {loginError && <div style={{ color: "red", marginBottom: 10 }}>{loginError}</div>}
                {resetPasswordMessage && <div style={{ color: "green", marginBottom: 10 }}>{resetPasswordMessage}</div>}
                <button
                  type="submit"
                  style={{
                    ...primaryButtonStyle,
                    background: hoveredBtn === "signin" ? argonBtnHover : argonBtnGradient,
                  }}
                  disabled={loading}
                  onMouseEnter={() => setHoveredBtn("signin")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >SIGN IN</button>
              </form>
            </div>
            {/* Hello, Friend Message Panel */}
            <div style={{
              flex: 1.2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: gradientBoxReverse,
              borderRadius: "0 32px 32px 0",
            }}>
              <div style={{
                width: 500,
                height: 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <h2 style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 20,
                  marginTop: 0,
                  textAlign: "center"
                }}>Hello, Friend!</h2>
                <div style={{
                  color: "#fff",
                  fontSize: 20,
                  marginBottom: 32,
                  textAlign: "center",
                  width: 320,
                  lineHeight: 1.5
                }}>
                  Sign Up to get Started with CyberShield
                </div>
                <button
                  style={{
                    ...secondaryButtonStyle,
                    border: "2px solid #fff",
                    color: "#fff",
                    background: "transparent",
                    fontSize: 20,
                    fontWeight: 700,
                    width: 190,
                    padding: "13px 0",
                    margin: 0,
                    boxShadow: "0 2px 10px #1a298044"
                  }}
                  onClick={() => setIsSignIn(false)}
                  onMouseEnter={() => setHoveredBtn("ghost-signup")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >SIGN UP</button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Hello, Back Message Panel */}
            <div style={{
              flex: 1.2,
              padding: "56px 40px", // Added padding to this panel for consistency
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: gradientBox,
              borderRadius: "32px 0 0 32px",
            }}>
              <div style={{
                width: 410,
                height: 380,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <h2 style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 14,
                  marginTop: 0,
                  textAlign: "center"
                }}>Welcome Back!</h2>
                <div style={{
                  color: "#fff",
                  fontSize: 20,
                  marginBottom: 32,
                  textAlign: "center",
                  width: 320,
                  lineHeight: 1.5
                }}>
                  To keep connected with CyberShield please login with your personal info
                </div>
                <button
                  style={{
                    ...secondaryButtonStyle,
                    border: "2px solid #fff",
                    color: "#fff",
                    background: "transparent",
                    fontSize: 20,
                    fontWeight: 700,
                    width: 190,
                    padding: "13px 0",
                    margin: 0,
                    boxShadow: "0 2px 10px #1a298044"
                  }}
                  onClick={() => setIsSignIn(true)}
                  onMouseEnter={() => setHoveredBtn("ghost-signin")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >SIGN IN</button>
              </div>
            </div>
            {/* Create Account Panel */}
            <div style={{
              flex: 1.6,
              padding: "56px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <h2 style={{
                fontSize: 36,
                fontWeight: 700,
                marginBottom: 14,
                marginTop: 0,
                textAlign: "center",
                color: "#162770",
                width: "100%",
                alignSelf: "flex-start"
              }}>Create Account</h2>
              {renderRoleSelector()}
              <form onSubmit={handleSignUp} style={{ width: "100%", maxWidth: 370 }}>
                <input
                  type="text"
                  placeholder="Full name"
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  required
                  style={inputStyle}
                  disabled={loading}
                  autoComplete="name"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={signupEmail}
                  onChange={e => setSignupEmail(e.target.value)}
                  required
                  style={inputStyle}
                  disabled={loading}
                  autoComplete="username"
                />
                <div style={{ position: "relative", width: "100%" }}>
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    required
                    style={inputStyle}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <span
                    onClick={() => setShowSignupPassword(v => !v)}
                    style={{
                      position: "absolute",
                      right: 16,
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: 20,
                      color: "#1a2980",
                      userSelect: "none",
                    }}
                    tabIndex={0}
                  >
                    {showSignupPassword ? "🙈" : "👁️"}
                  </span>
                </div>
                
                {/* Privacy Policy Checkbox */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginBottom: 20,
                  marginTop: 10, // Adjust margin as needed
                  fontSize: 14,
                  color: "#444",
                }}>
                  <input
                    type="checkbox"
                    id="privacyPolicyCheckbox"
                    checked={hasAgreedToPrivacy}
                    onChange={(e) => setHasAgreedToPrivacy(e.target.checked)}
                    style={{ cursor: "pointer", width: "16px", height: "16px" }}
                    disabled={loading}
                  />
                  <label htmlFor="privacyPolicyCheckbox" style={{ cursor: "pointer" }}>
                    I agree to the{" "}
                    <span
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent checkbox from toggling when clicking the link
                        setIsPrivacyPolicyModalOpen(true);
                      }}
                      style={{
                        textDecoration: "underline",
                        color: "#1a2980",
                        fontWeight: "bold",
                      }}
                    >
                      Privacy Policy
                    </span>
                  </label>
                </div>

                {signupError && <div style={{ color: "red", marginBottom: 10 }}>{signupError}</div>}
                <button
                  type="submit"
                  style={{
                    ...primaryButtonStyle,
                    background: hoveredBtn === "signup" ? argonBtnHover : argonBtnGradient,
                    color: "#fff",
                    fontSize: 20
                  }}
                  disabled={loading}
                  onMouseEnter={() => setHoveredBtn("signup")}
                  onMouseLeave={() => setHoveredBtn(null)}
                >SIGN UP</button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyModalOpen}
        onClose={() => setIsPrivacyPolicyModalOpen(false)}
        policyContent={privacyPolicyContent}
      />
    </div>
  );
};

export default AuthCard;