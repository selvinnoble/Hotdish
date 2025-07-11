import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { useCart } from "../../context/CartContext";
import Header from "../Header";
import Footer from "../Footer";
import "../../components/css/RestaurantDetail.css";

const RestaurantDetail = () => {
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const vendorId = queryParams.get("vendorId");
  const subCategoryId = queryParams.get("subCategoryId");

  const { cartItems, addToCart, decrementQtyZero } = useCart();
  const bellSound = new Audio("/bell-172780.mp3");

 useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const itemQuery = query(
        collection(db, "restaurantitems"),
        where("VendorId", "==", vendorId),
        ...(subCategoryId
          ? [where("SubCategoryId", "==", subCategoryId)]
          : [])
      );
      const itemSnap = await getDocs(itemQuery);
      const itemsData = itemSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const vendorRef = doc(db, "vendors", vendorId);
      const vendorSnap = await getDoc(vendorRef);
      const vendorData = vendorSnap.exists()
        ? { id: vendorSnap.id, ...vendorSnap.data() }
        : null;
      setVendors(vendorData ? [vendorData] : []);

      if (subCategoryId) {
        const categorySnap = await getDocs(collection(db, "subcategory"));
        const subCatData = categorySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubCategories(subCatData);
      }

      setItems(itemsData);

      // Set quantity only once (based on existing cart)
      const initialQuantities = {};
      itemsData.forEach((item) => {
        const cartItem = cartItems.find((ci) => ci.id === item.id);
        initialQuantities[item.id] = cartItem ? cartItem.quantity : 0;
      });
      setQuantities(initialQuantities);
    } catch (err) {
      console.error("Error fetching restaurant detail data", err);
    }
    setIsLoading(false);
  };

  fetchData();
}, [vendorId, subCategoryId]); // ✅ Removed `cartItems`

useEffect(() => {
  const updatedQuantities = {};
  items.forEach((item) => {
    const cartItem = cartItems.find((ci) => ci.id === item.id);
    updatedQuantities[item.id] = cartItem ? cartItem.quantity : 0;
  });
  setQuantities(updatedQuantities);
}, [cartItems]);


  const getVendorName = useCallback(
    (id) => vendors.find((v) => v.id === id)?.name || `Unknown Vendor (${id})`,
    [vendors]
  );

  const playBell = () => {
    bellSound.currentTime = 0;
    bellSound.play();
  };

  const increaseQty = (item, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    const itemId = item.id;
    setQuantities((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    addToCart({
      id: item.id,
      name: item.ItemName,
      price: item.ItemPrice,
      image: item.ImageBlob,
      vendorId: item.VendorId,
      vendorName: getVendorName(item.VendorId),
      quantity: 1,
      ItemDiscount: item.ItemDiscount || 0,
    });
    playBell();
  };

  const decreaseQty = (item, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    decrementQtyZero(item.id);
    setQuantities((prev) => ({
      ...prev,
      [item.id]: Math.max((prev[item.id] || 0) - 1, 0),
    }));
    playBell();
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

      <main className="flex-grow-1 overflow-auto">
        <div className="main-content m-2">
          <h4 className="mb-3">Items for {getVendorName(vendorId)}</h4>

          <div className="ribbon-wrapper position-relative">
            <div className="row g-3">
              {items.length === 0 && !isLoading ? (
                <p>No items found.</p>
              ) : (
                items.map((item) => (
                  <div className="col-12 col-sm-6 col-md-4" key={item.id}>
                    <div className="card border-0 shadow-sm rounded-4 h-100 position-relative overflow-hidden">
                      {item.ImageBlob && (
                        <img
                          src={item.ImageBlob}
                          alt={item.ItemName}
                          className="card-img-top rounded-top-4"
                          style={{
                            height: "200px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )}

                      <div className="card-body p-3">
                        <h5 className="card-title fw-bold">{item.ItemName}</h5>

                        {item.ItemDiscount && item.ItemDiscount > 0 ? (
                          <p className="mb-1">
                            <span className="text-muted text-decoration-line-through me-2">
                              ₹{item.ItemPrice}
                            </span>
                            <span className="text-success fw-bold">
                              ₹
                              {(
                                item.ItemPrice -
                                (item.ItemPrice * item.ItemDiscount) / 100
                              ).toFixed(2)}
                            </span>
                            <span className="text-danger ms-2">
                              ({item.ItemDiscount}% OFF)
                            </span>
                          </p>
                        ) : (
                          <p className="text-muted mb-1">
                            ₹{item.ItemPrice}
                          </p>
                        )}

                        <p className="small text-secondary mb-2">
                          {item.ItemDescription}
                        </p>
                        <span className="badge bg-light text-dark rounded-pill">
                          {getVendorName(item.VendorId)}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div
                        className="position-absolute"
                        style={{
                          bottom: "15px",
                          right: "15px",
                          background: "#fff",
                          borderRadius: "50px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          overflow: "hidden",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {quantities[item.id] === 0 ? (
                          <button
                            type="button"
                            className="btn btn-danger px-4 py-1 fw-bold"
                            style={{ borderRadius: "50px" }}
                            onClick={(e) => increaseQty(item, e)}
                          >
                            Add
                          </button>
                        ) : (
                          <div className="d-flex align-items-center">
                            <button
                              type="button"
                              className="btn btn-light py-1 px-2"
                              style={{
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                              }}
                              onClick={(e) => decreaseQty(item, e)}
                            >
                              −
                            </button>
                            <div
                              className="px-3"
                              style={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                                background: "#f8f9fa",
                                minWidth: "40px",
                                textAlign: "center",
                              }}
                            >
                              {quantities[item.id]}
                            </div>
                            <button
                              type="button"
                              className="btn btn-light py-1 px-2"
                              style={{
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                              }}
                              onClick={(e) => increaseQty(item, e)}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>

                      <div
                        className="ribbon bg-danger text-white"
                        style={{ display: "none" }}
                      >
                        50% OFF
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default RestaurantDetail;
