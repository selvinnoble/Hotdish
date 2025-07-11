import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaThLarge, FaShoppingCart, FaUser } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "../components/css/Footer.css"

const Footer = () => {
  const location = useLocation();
  const { getTotalQuantity } = useCart();
  const totalQty = getTotalQuantity();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="footer-nav fixed-bottom shadow-sm luxury-footer d-flex justify-content-around align-items-center border-top">
      <Link to="/" className="footer-link text-center">
        <FaHome className={`footer-icon ${isActive("/") ? "active-icon" : ""}`} />
        <p className={isActive("/") ? "active-label" : ""}>Home</p>
      </Link>
      <Link to="/category" className="footer-link text-center">
        <FaThLarge className={`footer-icon ${isActive("/category") ? "active-icon" : ""}`} />
        <p className={isActive("/category") ? "active-label" : ""}>Category</p>
      </Link>
      <Link to="/cart" className="footer-link text-center position-relative">
        <FaShoppingCart className={`footer-icon ${isActive("/cart") ? "active-icon" : ""}`} />
        {totalQty > 0 && (
  <span
    className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger"
    style={{
      fontSize: "0.75rem",       // Increased font size
      padding: "4px 8px",        // Bigger pill padding
      //transform: "translate(-30%, -40%)", // Adjust position right
    }}
  >
    {totalQty}
  </span>
)}

        <p className={isActive("/cart") ? "active-label" : ""}>Cart</p>
      </Link>
      <Link to="/myaccount" className="footer-link text-center">
        <FaUser className={`footer-icon ${isActive("/myaccount") ? "active-icon" : ""}`} />
        <p className={isActive("/myaccount") ? "active-label" : ""}>Account</p>
      </Link>
    </div>
  );
};

export default Footer;
