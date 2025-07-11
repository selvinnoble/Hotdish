import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase";
import { collection, doc, setDoc, serverTimestamp,addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { useCart } from "../../context/CartContext";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const { cartItems, clearCart } = useCart();

  const {
    address,
    subtotal = 0,
    totalDiscount = 0,
    total = 0,
    vendorId,
    orderMode,
  } = location.state || {};

  const [selectedPayment, setSelectedPayment] = useState("COD");

  const paymentOptions = [
    { label: "Cash on Delivery", value: "COD" },
    { label: "Razorpay", value: "Razorpay" },
    { label: "Google Pay", value: "GPay" },
    { label: "UPI", value: "UPI" },
  ];

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("You must be logged in to place an order.");
      return;
    }

    if (!vendorId) {
      alert("Vendor information is missing.");
      return;
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      alert("Cart is empty.");
      return;
    }

    const generatedOrderId = "ORD" + uuidv4().slice(0, 8).toUpperCase();

    const orderDetails = cartItems.map((item) => ({
      name: item.name ?? "Unnamed Item",
      quantity: item.quantity ?? 1,
      originalPrice: item.price ?? 0,
      image: item.image ?? "",
      vendorId: item.vendorId ?? vendorId,
      vendorName: item.vendorName ?? "Unknown Vendor",
      discount: item.ItemDiscount ?? 0,
      discountPrice : (item.price - (item.price * item.ItemDiscount) / 100).toFixed(2),
      totalPrice: (item.price - (item.price * item.ItemDiscount) / 100).toFixed(2) * (item.quantity ?? 1),
    }));

    const orderPayload = {
      FirestoreDocId: generatedOrderId,
      OrderId: generatedOrderId,
      userId: user.uid,
      createdAt: serverTimestamp(),
      status: "Created",
      subtotal,
      discount: totalDiscount,
      totalAmount: total,
      paymentMethod: selectedPayment,
      address: address || null,
      orderMode,
      voucherCode: "",
      orderDetails,
    };

    try {
      const orderDocRef = doc(collection(db, "orders"), generatedOrderId);
      await setDoc(orderDocRef, orderPayload);
       await trackOrderStatus(generatedOrderId, user.uid, "Created");
      clearCart();
      navigate("/confirm", {
  state: {
    orderId: generatedOrderId,
    totalAmount: total, // ✅ Pass correct total from Cart
    paymentMethod: selectedPayment, // ✅ e.g., COD, Razorpay
    orderDetails, // ✅ Full cart for summary
  },
});

    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const trackOrderStatus = async (orderId, userId, statusText) => {
  if (!orderId || !userId || !statusText) {
    console.error("❌ Missing parameters for order tracking");
    return;
  }

  try {
    await addDoc(
      collection(db, "orders", orderId, "statusLogs"),
      {
        orderId,
        userId,
        status: statusText,
        timestamp: serverTimestamp(),
      }
    );
    console.log("✅ Tracking status updated:", statusText);
  } catch (error) {
    console.error("❌ Error updating order tracking:", error);
  }
};


  return (
    <main className="container py-4" style={{ maxWidth: "500px" }}>
      {/* Header with Back Arrow */}
   <div className="d-flex align-items-center justify-content-between mb-4 position-relative">
  <button
    onClick={() => navigate(-1)}
    className="btn btn-light rounded-circle shadow-sm me-2"
    style={{ width: "40px", height: "40px", padding: 0, zIndex: 2 }}
  >
    <span className="fs-5">&larr;</span>
  </button>
  <div className="flex-grow-1 text-center position-absolute top-50 start-50 translate-middle-x">
    <h5 className="fw-bold m-0">Checkout</h5>
  </div>
</div>


      {/* Address */}
      <div className="bg-white rounded-4 shadow-sm p-3 mb-3">
        <div className="fw-semibold mb-2">Delivery Address</div>
        <div className="border rounded px-3 py-2 bg-light small text-muted">
          {address?.address || "No address selected"}
        </div>
      </div>

      {/* Payment */}
      <div className="bg-white rounded-4 shadow-sm p-3 mb-3">
        <div className="fw-semibold mb-2">Payment Method</div>
        {paymentOptions.map((method) => (
          <label
            key={method.value}
            className={`d-flex align-items-center p-2 rounded mb-2 border ${
              selectedPayment === method.value
                ? "border-danger bg-light"
                : "border-light"
            }`}
            style={{ cursor: "pointer", transition: "0.3s ease" }}
          >
            <input
              type="radio"
              name="payment"
              className="form-check-input me-2"
              value={method.value}
              checked={selectedPayment === method.value}
              onChange={() => setSelectedPayment(method.value)}
              style={{ accentColor: "red" }}
            />
            {method.label}
          </label>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-4 shadow-sm p-3 mb-3">
        <div className="d-flex justify-content-between mb-2">
          <span>Subtotal</span>
          <span>₹{Number(subtotal).toFixed(2)}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="d-flex justify-content-between mb-2 text-success">
            <span>Discount</span>
            <span>- ₹{Number(totalDiscount).toFixed(2)}</span>
          </div>
        )}
        <hr />
        <div className="d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span>₹{Number(total).toFixed(2)}</span>
        </div>
      </div>

      {/* Continue */}
      <div className="d-grid">
        <button
          className="btn btn-danger btn-lg rounded-pill"
          onClick={handlePlaceOrder}
        >
          Continue
        </button>
      </div>
    </main>
  );
}

export default Checkout;
