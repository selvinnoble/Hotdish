// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    // Redirect to login with "from" location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
