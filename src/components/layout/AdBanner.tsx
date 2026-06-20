"use client";
import { useEffect, useState } from "react";

const ADS = ["/ad1.png", "/ad2.png", "/ad3.png", "/ad4.png"];

export default function AdBanner() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent(i => (i + 1) % ADS.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ad-banner" style={{
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#0D0F0A",
    }}>
      <img
        src={ADS[current]}
        alt="Advertisement"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease",
          display: "block",
        }}
      />
    </div>
  );
}