import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link,useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/Cart.css";
import Header from "../Header";
import Footer from "../Footer";

function Cart() {
  const { cartItems, incrementQty, decrementQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  const bellSound = new Audio("/bell-172780.mp3");
  const auth = getAuth();
  const user = auth.currentUser;

  const [mode, setMode] = useState("Delivery");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "CustomerContact"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAddresses(list);
      } catch (error) {
        console.error("Failed to load addresses:", error);
      }
    };
    fetchAddresses();
  }, [user]);

  const playBell = () => {
    bellSound.currentTime = 0;
    bellSound.play().catch((e) => console.error("Audio play error:", e));
  };

  const handleIncrement = (id) => {
    incrementQty(id);
    playBell();
  };

  const handleDecrement = (id) => {
    decrementQty(id);
    playBell();
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalDiscount = cartItems.reduce((acc, item) => {
    const discount = item.ItemDiscount || 0;
    return acc + ((item.price * discount) / 100) * item.quantity;
  }, 0);
  const total = subtotal - totalDiscount;

  const handleProceedToPayment = () => {
  if (!user) {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "You must be logged in to proceed.",
      confirmButtonText: "Login",
    }).then((res) => {
      if (res.isConfirmed) navigate("/login");
    });
    return;
  }

  if (mode === "Delivery" && addresses.length > 0 && !selectedAddressId) {
    Swal.fire({
      icon: "warning",
      title: "Select Address",
      text: "Please select a delivery address to continue.",
    });
    return;
  }

  const selected = addresses.find((a) => a.id === selectedAddressId);

  // Get vendorId and vendorName from the first item
  const firstItem = cartItems.find((item) => item.quantity > 0);
  console.log("firstItem: ",firstItem)
  const vendorId = firstItem?.vendorId || null;
  const vendorName = firstItem?.vendorName || "Unknown Vendor";

  navigate("/payment", {
    state: {
      address: selected || null,
      subtotal,
      totalDiscount,
      total: (subtotal - totalDiscount).toFixed(2),
      vendorId,
      vendorName,
      orderMode: mode, // Also pass whether Delivery or Pickup
    },
  });
};


  const groupedCartItems = cartItems
    .filter((item) => item.quantity > 0)
    .reduce((groups, item) => {
      const key = item.vendorName || "Unknown Vendor";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {});

  return (
    <><Header />
    <main className="flex-grow-1 overflow-auto">
      <div className="main-content m-2">
        {/* Toggle */}
        <div className="d-flex justify-content-between mb-3">
          <button className={`btn ${mode === "Delivery" ? "btn-outline-dark" : "btn-light"}`} onClick={() => setMode("Delivery")}>Delivery</button>
          <button className={`btn ${mode === "Pickup" ? "btn-danger text-white" : "btn-light"}`} onClick={() => setMode("Pickup")}>Pickup</button>
        </div>

        {/* Pickup Address */}
        {mode === "Pickup" && (
          <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm mb-3">
            <div>
              <small className="text-muted">Pickup this order at:</small><br />
              <span className="fw-bold text-dark">2154 South For Apache Road</span>
            </div>
            <img src="/img/map-thumb.png" alt="Map" style={{ width: "60px", borderRadius: "10px" }} />
          </div>
        )}

        {/* Cart Items */}
        {Object.entries(groupedCartItems).map(([vendor, items]) => (
          <div key={vendor} className="mb-2">
            <h6 className="text-uppercase text-success mb-2 small">{vendor}</h6>
            {items.map((item) => (
              <div key={item.id} className="d-flex justify-content-between align-items-center mb-1 bg-light rounded p-2">
                <div className="d-flex align-items-center">
                  <img src={item.image || "/img/food-placeholder.png"} alt={item.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: "cover", marginRight: 10 }} />
                  <div>
                    <div className="fw-bold">{item.name}</div>
                    {item.ItemDiscount && item.ItemDiscount > 0 ? (
                      <div className="small">
                        <span className="text-muted text-decoration-line-through me-1">₹{item.price}</span>
                        <span className="text-success fw-bold">₹{(item.price - (item.price * item.ItemDiscount) / 100).toFixed(2)}</span>
                        <span className="text-danger ms-1">({item.ItemDiscount}% OFF)</span>
                      </div>
                    ) : (
                      <div className="text-muted small">₹{item.price}</div>
                    )}
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center border rounded px-2 py-1">
                    <button className="btn btn-sm text-danger" onClick={() => handleDecrement(item.id)}>-</button>
                    <span className="mx-2">{item.quantity}</span>
                    <button className="btn btn-sm text-success" onClick={() => handleIncrement(item.id)}>+</button>
                  </div>
                  <button className="btn p-0 text-white ms-2" style={{
                    width: "20px", height: "20px", backgroundColor: "#dc3545",
                    borderRadius: "50%", fontSize: "12px", lineHeight: "1", border: "none"
                  }} onClick={() => removeFromCart(item.id)}>×</button>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Add More */}
        <div className="d-flex justify-content-end">
          <button className="btn btn-link text-danger p-0 fw-bold" onClick={() => navigate("/")}  style={{ textDecoration: "none" }}>
            + Add more items
          </button>
        </div>

        {/* Voucher */}
        <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded mb-2">
          <div className="text-danger fw-bold">
            <i className="icofont-sale-discount me-1" /> Apply Voucher
          </div>
          <i className="icofont-simple-right" />
        </div>

        {/* Summary */}
        <div className="bg-white rounded p-3 shadow-sm mb-3">
          <div className="d-flex justify-content-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          {totalDiscount > 0 && (
            <div className="d-flex justify-content-between text-success">
              <span>Discount</span>
              <span>- ₹{totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <hr />
          <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>

        {/* Delivery Address Selection (if in Delivery Mode) */}
        {mode === "Delivery" && (
          <div className="bg-white rounded p-3 shadow-sm mb-2">
            <h6 className="text-danger p-0 fw-bold">Select Delivery Address</h6>
            {!user ? (
              <div className="text-danger small">Please login to select a delivery address.</div>
            ) : addresses.length === 0 ? (
              <div>
                <p className="small text-muted">No saved addresses found.</p>
                <button className="btn btn-link p-0 text-danger fw-bold small" onClick={() => navigate("/addressbook")}>
                  + Add New Address
                </button>
              </div>
            ) : (
             <div className="d-flex flex-column gap-3">
  {addresses.map((address) => (
    <div
      key={address.id}
      onClick={() => setSelectedAddressId(address.id)}
      className={`p-3 rounded-4 shadow-sm border transition-all cursor-pointer ${
        selectedAddressId === address.id
          ? "border-warning bg-light"
          : "border-light bg-white"
      }`}
      style={{
        cursor: "pointer",
        borderWidth: "2px",
        transition: "0.3s ease",
      }}
    >
      <div className="d-flex align-items-start">
       <input
  type="radio"
  name="address"
  className="form-check-input mt-1 me-3"
  value={address.id}
  checked={selectedAddressId === address.id}
  onChange={() => setSelectedAddressId(address.id)}
  style={{ appearance: "radio", borderRadius: "50%" }} // Enforce roundness
/>

        <div>
          <div className="fw-bold text-dark">{address.type || "Other"}</div>
          <div className="text-muted small">{address.address}</div>
          {address.additionalDetails && (
            <div className="text-muted small">{address.additionalDetails}</div>
          )}
        </div>
      </div>
    </div>
  ))}

<div className="d-flex justify-content-end ">
       <button
  className="btn btn-link text-danger p-0 fw-bold"
  onClick={() => navigate("/addressbook")}
  style={{ textDecoration: "none" }}
>
  + Add New Address
</button>
</div>

</div>

            )}
          </div>
        )}

        {/* Continue */}
        <div className="d-grid">
          <button className="btn btn-danger btn-lg " onClick={handleProceedToPayment}>
            Continue
          </button>
        </div>
      </div>
    </main>
   <Footer/>
    </>
  );
}

export default Cart;
