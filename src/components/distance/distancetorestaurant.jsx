import React, { useEffect, useState } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { MdAccessTime } from "react-icons/md";

const DistanceToRestaurant = ({ address }) => {
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      setError("Google Maps not loaded");
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const origin = new window.google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        const service = new window.google.maps.DistanceMatrixService();

        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [address],
            travelMode: window.google.maps.TravelMode.DRIVING,
            unitSystem: window.google.maps.UnitSystem.METRIC,
          },
          (response, status) => {
            if (status === "OK") {
              const result = response.rows[0].elements[0];
              if (result.status === "OK") {
                setDistance(result.distance.text);
                setDuration(result.duration.text);
              } else {
                setError("Distance unavailable");
              }
            } else {
              console.error("DistanceMatrix error:", status);
              setError("API error");
            }
          }
        );
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Permission denied");
      }
    );
  }, [address]);

  if (error)
    return <span style={{ fontSize: "12px", color: "red" }}>⚠️ {error}</span>;

  if (!distance || !duration)
    return <span style={{ fontSize: "12px" }}>📍 Calculating...</span>;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "12px",
        color: "#BFA181",
      }}
    >
      <HiLocationMarker style={{ fontSize: "14px" }} />
      <strong>{distance}</strong>
      <MdAccessTime style={{ fontSize: "14px" }} />
      <strong>{duration}</strong>
    </span>
  );
};

export default DistanceToRestaurant;
