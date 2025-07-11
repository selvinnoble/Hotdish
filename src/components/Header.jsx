import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../components/css/Header.css";
import { FaArrowLeft } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const isHomePage = location.pathname === "/";

  return (
    <div className="shadow-sm p-2">
     <div className="title d-flex align-items-center justify-content-between">
  <div className="d-flex align-items-center">
    {/* Show back arrow on mobile (before logo/title) */}
    {isMobile && !isHomePage && (
      <button
        onClick={() => navigate(-1)}
        className="btn btn-light rounded-circle shadow-sm me-2"
        style={{ width: "40px", height: "40px", padding: 0, zIndex: 2 }}
      >
        <span className="fs-5">&larr;</span>
      </button>
    )}

    <Link
      to="/"
      className="text-decoration-none text-white d-flex align-items-center"
    >
      <img
        className="osahan-logo me-2"
        src="/img/logo.svg"
        alt="Logo"
        style={{ display: "none" }}
      />
      <span className="hotdish-title">Hot🔥Dish</span>
    </Link>
  </div>

  <button className="border-0 bg-transparent fw-bold" style={{ color: "#f57878" }}>
    <i className="bi bi-list fs-4"></i>
  </button>
</div>


      {/* Hidden search bar */}
      <div
        className="input-group mt-0 rounded shadow-sm overflow-hidden bg-white py-1"
        style={{ display: "none" }}
      >
        <div className="input-group-prepend">
          <button className="border-0 btn btn-outline-secondary text-success bg-white">
            <i className="icofont-search"></i>
          </button>
        </div>
        <input
          type="text"
          className="shadow-none border-0 form-control ps-0"
          placeholder="Search for Categories and Restaurants..."
        />
      </div>

      {/* Scroll offer */}
      <div className="scroll-offer mt-0" style={{display:'none'}}>
        <div className="scroll-text">🎉 Enjoy 50% off on orders above ₹500! 🎉</div>
      </div>
    </div>
  );
};

export default Header;
