import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "../css/Register.css";
import Swal from "sweetalert2";

const EditProfile = () => {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    profileImage: "",
  });
  const [tempImage, setTempImage] = useState(""); // For preview
  const [isLoading, setIsLoading] = useState(true);

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words.slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  };

  // Auth listener and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setFormData({
            fullName: data.fullName || "",
            mobile: data.mobile || "",
            email: data.email || "",
            profileImage: data.profileImage || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        fullName: formData.fullName,
        mobile: formData.mobile,
        email: formData.email,
        profileImage: tempImage || formData.profileImage,
      });

      setFormData((prev) => ({
        ...prev,
        profileImage: tempImage || prev.profileImage,
      }));
      setTempImage("");

      Swal.fire({
        title: "Profile Updated!",
        text: "Your changes have been saved successfully.",
        icon: "success",
        confirmButtonColor: "#28a745",
      });
    } catch (err) {
      console.error("Update failed:", err);
      Swal.fire({
        title: "Update Failed!",
        text: "Something went wrong while saving your profile.",
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setTempImage(reader.result); // Preview only
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Hot🔥Dish</div>
        </div>
      )}

      <Header />
      <div id="edit_profile">
        <div className="p-4 profile text-center border-bottom">
          <div
            className="profile-image-wrapper mx-auto position-relative"
            onClick={() => document.getElementById("profileImageInput").click()}
            style={{ cursor: "pointer", width: "90px", height: "90px" }}
          >
            {tempImage || formData.profileImage ? (
              <img
                src={tempImage || formData.profileImage}
                alt="User"
                className="profile-img rounded-pill"
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                className="rounded-pill bg-secondary text-white d-flex align-items-center justify-content-center"
                style={{
                  width: "90px",
                  height: "90px",
                  fontSize: "24px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {getInitials(formData.fullName)}
              </div>
            )}

            <div className="upload-hover-overlay text-center">
              <i className="icofont-camera camera-icon" />
              <div className="upload-hover-text">Upload Image</div>
            </div>
          </div>

          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />

          <h6 className="fw-bold m-0 mt-2">{formData.fullName}</h6>
          <p className="small text-muted m-0">{formData.email}</p>
        </div>

        <div className="p-3">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="text"
                className="form-control"
                id="mobile"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="text-center d-grid">
              <button type="submit" className="btn btn-success btn-lg">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="additional">
          <div className="change_password border-bottom border-top">
            <Link
              to="/change_password"
              className="p-3 bg-white btn d-flex align-items-center border-0 rounded-0"
            >
              Change Password
              <i className="icofont-rounded-right ms-auto"></i>
            </Link>
          </div>
          <div className="deactivate_account border-bottom">
            <Link
              to="/deactivate_account"
              className="p-3 bg-white btn d-flex align-items-center border-0 rounded-0"
            >
              Deactivate Account
              <i className="icofont-rounded-right ms-auto"></i>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
