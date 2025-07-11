import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Register.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the path as needed
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidMobile = (mobile) =>
    /^[6-9]\d{9}$/.test(mobile); // Indian mobile format

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required.";
    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!isValidMobile(mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!password.trim()) newErrors.password = "Password is required.";
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Save additional data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: name,
        mobile: mobile,
        email: email,
        createdAt: new Date(),
      });

      // Success alert
      await Swal.fire({
        title: "Registration Successful!",
        text: "You can now log in to your account.",
        icon: "success",
        confirmButtonColor: "#28a745",
      });

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.message);
      Swal.fire({
        title: "Registration Failed!",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  return (
    <div className="osahan-home-page">
 <div className="osahan-body">
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img
            src="/src/assets/img/login_bike_1.jpg"
            alt="Register Banner"
            className="login-header-img"
          />
        </div>

        <div className="hotdish-title-wrapper">
          <span className="hotdish-title">Hot🔥Dish</span>
        </div>

        <div className="login-body">
          <form autoComplete="off" onSubmit={handleRegister}>
            <label>Your name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: "" }));
              }}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}

            <label>Mobile number</label>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              maxLength={10}
              onChange={(e) => {
                setMobile(e.target.value);
                setErrors((prev) => ({ ...prev, mobile: "" }));
              }}
            />
            {errors.mobile && <div className="error-message">{errors.mobile}</div>}

            <label>Your email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
              }}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}

            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}

            <label>Confirm password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
            />
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}

            <button type="submit" className="login-button">
              Register →
            </button>
          </form>

          <div className="register-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login!</span>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Register;
