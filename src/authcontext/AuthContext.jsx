import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; // ✅ Ensure this path is correct
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem("user");
      const parsed = stored && stored !== "undefined" ? JSON.parse(stored) : null;
      return parsed && parsed.fullName ? parsed : null; // ✅ ensure fullName exists
    } catch (err) {
      console.error("Error parsing user from localStorage:", err);
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredUser());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);
        } else {
          // fallback if no localStorage but user is authenticated
          const fallbackUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || "New User",
            profileImage: firebaseUser.photoURL || "",
          };
          updateUser(fallbackUser); // ✅ sync fallback
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUser = (newUser) => {
    if (!newUser || !newUser.fullName) {
      console.warn("updateUser: Missing fullName, skipping update");
      return;
    }

    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, updateUser, isAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
