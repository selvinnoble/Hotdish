import React from "react";
import { Routes, Route } from "react-router-dom";
import './style.css'
import Home from './components/pages/home';
import RestaurantDetail from "./components/pages/RestaurantDetail";
import { CartProvider } from "./context/CartContext";
import CreateMyAccount from "./components/pages/CreateMyAccount";
import EditProfile from "./components/pages/EditProfile";
import Cart from "./components/pages/Cart";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import ProtectedRoute from "./components/pages/ProtectedRoute"; // ✅ import
import Checkout from "./components/pages/Checkout";
import ConfirmOrder from "./components/pages/ConfirmOrder";

function App() {
  return (
    <div className="fixed-bottom-padding">
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurant" element={<RestaurantDetail />} />
         <Route path="/cart" element={<Cart />}/>
         <Route path="/payment" element={<Checkout />}/>
          <Route path="/confirm" element={<ConfirmOrder />}/>
        {/* 🔒 Protected routes */}
        <Route
          path="/myaccount"
          element={
            <ProtectedRoute>
              <CreateMyAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editprofile"
          element={
          
              <EditProfile />
          }
        />
       
      </Routes>
    </CartProvider>
    </div>
  );
}

export default App;
