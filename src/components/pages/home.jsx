import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../Header";
import "../../components/css/PromoSection.css";
import PromoSection from "../PromoSection";
import { db } from "../../firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { FaStar } from "react-icons/fa";
import DistanceToRestaurant from "../distance/distancetorestaurant";
import Footer from "../Footer";
import HomeHeader from "../../components/HomeHeader";


const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorCategoryImages, setVendorCategoryImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState("Fetching location...");
  const [googleLoaded, setGoogleLoaded] = useState(false);


  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);
    }
  }, [location.state]);

  
useEffect(() => {
  const existingScript = document.getElementById("googleMapsScript");

  if (!existingScript) {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyApLXk59hUqmQkHwBWa3BRVftYvfuJuTqU&libraries=places";
    script.id = "googleMapsScript";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("Google Maps Loaded ✅");
      setGoogleLoaded(true);
    };

    document.body.appendChild(script);
  } else {
    if (window.google && window.google.maps) {
      setGoogleLoaded(true);
    }
  }
}, []);

useEffect(() => {
  if (googleLoaded && navigator.geolocation) {
    console.log("Attempting to get current position...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Got position:", position);

        const geocoder = new window.google.maps.Geocoder();
        const latlng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        console.log("Geocoding latlng:", latlng);

        geocoder.geocode({ location: latlng }, (results, status) => {
          console.log("Geocode result:", results, status);

          if (status === "OK" && results[0]) {
            setCurrentLocation(results[0].formatted_address);
          } else {
            setCurrentLocation("Unable to fetch address");
          }
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setCurrentLocation("Location access denied");
      }
    );
  }
}, [googleLoaded]);



  useEffect(() => {
    const fetchImages = async () => {
      const snapshot = await getDocs(collection(db, "vendor_category_images"));
      const images = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setVendorCategoryImages(images);
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [categorySnap, vendorSnap] = await Promise.all([
          getDocs(query(collection(db, "subcategory"), where("active", "==", true))),
          getDocs(query(collection(db, "vendors"), where("isActive", "==", true), limit(20)))
        ]);

        const categories = categorySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const vendors = vendorSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setCategories([{ id: "", name: "All", imageBlob: "" }, ...categories]);
        setVendors(vendors);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);



  const filteredCategories = useMemo(() => {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleCategoryClick = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    setSelectedCategory(categoryId === "" ? null : cat);
  };

  const handleRestaurantClick = (vendorId) => {
    const subCatParam = selectedCategory?.id ? `&subCategoryId=${selectedCategory.id}` : "";
    navigate(`/restaurant?vendorId=${vendorId}${subCatParam}`);
  };

  const filteredRestaurants = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return vendors.filter((vendor) => {
      const matchesName = vendor.name?.toLowerCase().includes(search);
      const matchesCategory = Array.isArray(vendor.categories) &&
        vendor.categories.some((cat) => cat.toLowerCase().includes(search));

      const matchesSelectedCategory = selectedCategory &&
        selectedCategory.name !== "All" &&
        vendor.categories?.includes(selectedCategory.name);

      if (searchTerm) return matchesName || matchesCategory;
      if (selectedCategory && selectedCategory.name !== "All") return matchesSelectedCategory;

      return true;
    });
  }, [vendors, searchTerm, selectedCategory]);

  const getVendorImageForCategory = (vendorId, categoryName, defaultImage) => {
    const match = vendorCategoryImages.find(
      (img) =>
        img.vendorId === vendorId &&
        img.category?.trim().toLowerCase() === categoryName?.trim().toLowerCase()
    );
    const base64 = match?.imageBlob?.trim();
    return base64?.startsWith("data:image") ? base64 : base64 ? `data:image/png;base64,${base64}` : defaultImage;
  };

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Hot🔥Dish</div>
        </div>
      )}

      <HomeHeader />
      <PromoSection />
  <p className="text-muted small">Current Location: {currentLocation}</p>
      <main className="flex-grow-1 overflow-auto">
        <div className="main-content">
          <div className="px-2">
            <div className="input-group rounded shadow-sm overflow-hidden bg-white border" style={{ height: "38px" }}>
              <div className="input-group-prepend">
                <button className="border-0 btn btn-outline-secondary text-success bg-white" style={{ height: "100%" }}>
                  <i className="icofont-search"></i>
                </button>
              </div>
              <input
                type="text"
                className="shadow-none border-0 form-control ps-0"
                placeholder="Search for Categories and Restaurants..."
                style={{ height: "100%", fontSize: "14px" }}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedCategory(null);
                }}
              />
            </div>
          </div>

          <h4 className="section-title pt-3">🥗 Categories</h4>
          <div className="categories">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((item) => (
                <div
                  key={item.id}
                  className={`category-card ${selectedCategory?.id === item.id || (!selectedCategory && item.name === "All") ? "active" : ""}`}
                  onClick={() => handleCategoryClick(item.id)}
                >
                  {item.imageBlob ? (
                    <img src={item.imageBlob} alt={item.name} loading="lazy" />
                  ) : (
                    <div className="category-placeholder">{item.name.charAt(0)}</div>
                  )}
                  <p>{item.name}</p>
                </div>
              ))
            ) : (
              <p className="text-muted px-3">No matching categories found.</p>
            )}
          </div>

          <h4 className="section-title">
            🔥 Popular Restaurants {selectedCategory && selectedCategory.name !== "All" && (
              <span style={{ fontWeight: "normal", fontSize: "14px" }}>
                (filtered by {selectedCategory.name})
              </span>
            )}
          </h4>

          <div className="restaurants fade-transition pt-2">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((vendor) => {
                const dynamicCategoryName = selectedCategory?.name || searchTerm;
                const imageSrc = getVendorImageForCategory(
                  vendor.id,
                  dynamicCategoryName,
                  vendor.imageBlob || "/assets/images/placeholder.jpg"
                );

                return (
                  <div className="restaurant-card" key={vendor.id} onClick={() => handleRestaurantClick(vendor.id)}>
                    <img
                      loading="lazy"
                      src={imageSrc}
                      alt={vendor.name}
                      onError={(e) => { e.target.src = "/assets/images/placeholder.jpg"; }}
                    />
                    <div className="rest-info d-flex justify-content-between align-items-start" style={{ padding: "10px 15px", marginTop: "8px" }}>
                      <div className="vendor-details" style={{ flex: 1, paddingRight: "10px" }}>
                        <h5 style={{ marginBottom: "4px", fontWeight: "bold", fontSize: "1.1rem", color: "#333" }}>{vendor.name}</h5>
                        <span style={{ fontSize: "0.9rem", color: "#666", fontWeight: 500 }}>
                          <FaStar className="me-1" style={{ color: "#FFD700" }} />
                          {vendor.rating || "4.0"}
                        </span>
                      </div>
                      <div className="vendor-distance text-end" style={{ minWidth: "120px", textAlign: "right", fontSize: "0.85rem", fontWeight: 600, color: "#007BFF" }}>
                        <DistanceToRestaurant address={`${vendor.name}, ${vendor.address}`} />

                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted px-3">No restaurants found.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Home;