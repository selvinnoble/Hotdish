import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // 👈 import firebase auth

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 👈 for redirecting back
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async () => {
    setAuthError(""); // reset any previous errors
    let valid = true;

    if (!email.trim()) {
      setEmailError("Email is required.");
      valid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Invalid email format.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is required.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ✅ Redirect to previous page or home
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setAuthError("Invalid email or password.");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!value) {
      setEmailError("Email is required.");
    } else if (!isValidEmail(value)) {
      setEmailError("Invalid email format.");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="/src/assets/img/login_bike_1.jpg"
            alt="Login Banner"
            className="login-header-img"
          />
        </div>

        <div className="hotdish-title-wrapper">
          <span className="hotdish-title">Hot🔥Dish</span>
        </div>

        <div className="login-body">
          <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <label>Your email</label>
            <input
              type="email"
              name="login_email"
              autoComplete="off"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <div className="error-message">{emailError}</div>}

            <label>Your password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="login_password"
                autoComplete="new-password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
            {authError && (
              <div className="error-message">{authError}</div>
            )}
          </form>

          <div className="forgot-link">Forgot password?</div>

          <button className="login-button" onClick={handleLogin}>
            Log in →
          </button>

          <div className="register-text">
            Don’t have an account?{" "}
            <span onClick={() => navigate("/register")}>Register!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
