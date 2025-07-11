import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
function ConfirmOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalAmount, paymentMethod, orderDetails = [] } = location.state || {};
const groupedByVendor = orderDetails.reduce((acc, item) => {
  const vendor = item.vendorName || "Unknown Vendor";
  if (!acc[vendor]) acc[vendor] = [];
  acc[vendor].push(item);
  return acc;
}, {});

  return (
    <main className="container py-4" style={{ maxWidth: "500px" }}>
      <div className="text-center mb-4">
        <div className="mb-2">
          <FaCheckCircle size={60} color="#f97316" className="mb-3" />
        </div>
        <h5 className="fw-bold">Thank You!</h5>
        <p className="text-muted">Your Order is confirmed</p>
      </div>

      <div className="bg-white rounded-4 shadow-sm p-3 mb-3">
        <div className="d-flex justify-content-between mb-2">
          <strong>Your Order ID</strong>
          <span className="fw-bold">{orderId || "N/A"}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <strong>Your Order Amount</strong>
          <span className="fw-bold">₹{Number(totalAmount).toFixed(2)}</span>
        </div>

        <div className="mt-3">
  <strong className="mb-2 d-block">Order Details</strong>
  {Object.entries(groupedByVendor).length === 0 ? (
    <div className="text-muted small">No items</div>
  ) : (
    Object.entries(groupedByVendor).map(([vendorName, items]) => (
      <div key={vendorName} className="mb-0">
        <div className="fw-bold text-danger text-uppercase mb-0">{vendorName}</div>
        {items.map((item, index) => (
          <div
            key={index}
            className="d-flex justify-content-between align-items-center border-bottom py-2"
          >
            <div>
              <div className="fw-bold">{item.name}</div>
              <div className="small text-muted">
                ₹{item.originalPrice} x{item.quantity}
                {item.discount > 0 && (
                  <span className="text-success fw-bold ms-2">
                    {item.discount}% OFF
                  </span>
                )}
              </div>
            </div>
            <div className="fw-bold text-dark">
              ₹{Number(item.totalPrice).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    ))
  )}
</div>


        <div className="d-flex justify-content-between mt-3">
          <strong>Payment Method</strong>
          <span className="fw-bold">{paymentMethod || "N/A"}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-grid gap-2">
        <button
          className="btn btn-warning fw-bold"  style={{ backgroundColor: "#FF5A00" }} 
          onClick={() => navigate("/track", { state: { orderId } })}
        >
          Track Order
        </button>
        <button
          className="btn btn-outline-dark"
          onClick={() => navigate("/")}
        >
          Back to Menu
        </button>
      </div>
    </main>
  );
}

export default ConfirmOrder;
