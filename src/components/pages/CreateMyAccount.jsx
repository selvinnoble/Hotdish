import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const CreateMyAccount = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    setIsLoading(true);
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUserData(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  // Helper: Extract initials from full name
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    const initials = words.slice(0, 2).map((w) => w[0].toUpperCase()).join("");
    return initials;
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
      <div>
        {/* Profile Info */}
        <div className="p-4 profile text-center border-bottom">
          {userData?.profileImage ? (
            <img
              src={userData.profileImage}
              alt="User"
              className="img-fluid rounded-pill"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="rounded-pill bg-secondary text-white d-flex align-items-center justify-content-center mx-auto"
              style={{
                width: "80px",
                height: "80px",
                fontSize: "24px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {getInitials(userData?.fullName)}
            </div>
          )}

          <h6 className="fw-bold m-0 mt-2">
            {userData?.fullName || "Guest User"}
          </h6>
          <p className="small text-muted">{userData?.email || "No email available"}</p>
          <Link to="/editprofile" className="btn btn-success btn-sm">
            <i className="icofont-pencil-alt-5"></i> Edit Profile
          </Link>
        </div>

        {/* Account Sections */}
        <div className="account-sections">
          <ul className="list-group">
            <Link to="/promos" className="text-decoration-none text-dark">
              <li className="border-bottom bg-white d-flex align-items-center p-3">
                <i className="icofont-sale-discount osahan-icofont bg-success me-2"></i>Promos
                <span className="badge badge-success p-1 badge-pill ms-auto">
                  <i className="icofont-simple-right"></i>
                </span>
              </li>
            </Link>

            <Link to="/my_address" className="text-decoration-none text-dark">
              <li className="border-bottom bg-white d-flex align-items-center p-3">
                <i className="icofont-address-book osahan-icofont bg-dark me-2"></i>My Address
                <span className="badge badge-success p-1 badge-pill ms-auto">
                  <i className="icofont-simple-right"></i>
                </span>
              </li>
            </Link>

            <Link to="/terms_conditions" className="text-decoration-none text-dark">
              <li className="border-bottom bg-white d-flex align-items-center p-3">
                <i className="icofont-info-circle osahan-icofont bg-primary me-2"></i>Terms, Privacy & Policy
                <span className="badge badge-success p-1 badge-pill ms-auto">
                  <i className="icofont-simple-right"></i>
                </span>
              </li>
            </Link>

            <Link to="/help_support" className="text-decoration-none text-dark">
              <li className="border-bottom bg-white d-flex align-items-center p-3">
                <i className="icofont-phone osahan-icofont bg-warning me-2"></i>Help & Support
                <span className="badge badge-success p-1 badge-pill ms-auto">
                  <i className="icofont-simple-right"></i>
                </span>
              </li>
            </Link>

            <li
              className="border-bottom bg-white d-flex align-items-center p-3 text-dark"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              <i className="icofont-lock osahan-icofont bg-danger me-2"></i> Logout
            </li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateMyAccount;
