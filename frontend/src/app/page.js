"use client";
import { useState, useRef,useEffect } from "react";
import "../app/globals.css";

export default function Home()
 {useEffect(() => {
  const sections = document.querySelectorAll(".section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  sections.forEach((section) => observer.observe(section));

  return () => {
    sections.forEach((section) => observer.unobserve(section));
  };
}, []);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Start camera
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStreaming(true);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // Capture photo from camera
  const handleCapture = () => {
    const context = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);
    canvasRef.current.toBlob((blob) => {
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      setImage(file);
      setPreview(URL.createObjectURL(file));
      stopCamera();
    });
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setStreaming(false);
  };

  // Send image to backend
  const handleScan = async () => {
    if (!image) {
      alert("Please select or capture an image!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      let res = await fetch("https://plant-disease-detectorrrr.onrender.com/predict", {
        method: "POST",
        body: formData,
      });

      let data = await res.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">🌱 Plant Disease Detector</div>
        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero" id="home">
        <h1>Detect Plant Diseases Instantly</h1>
        <p>Upload an image or take a photo to know the health of your plant 🌿</p>

        <div className="buttons-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="image-upload"
          />
          <label htmlFor="image-upload" className="btn" tabIndex={0} role="button">
            Upload Image
          </label>

          {!streaming && (
            <button className="btn" onClick={handleTakePhoto}>
              Take a Photo
            </button>
          )}
        </div>

        {/* Camera Preview */}
        {streaming && (
          <div className="camera-container">
            <video ref={videoRef}></video>
            <button className="btn capture-btn" onClick={handleCapture}>
              Capture
            </button>
          </div>
        )}

        {/* Image Preview + Scan */}
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <button className="btn scan-btn" onClick={handleScan} disabled={loading}>
              {loading ? "Scanning..." : "Scan Image"}
            </button>
            {loading && <div className="spinner"></div>}
          </div>
        )}

        {/* Prediction Result */}
        {result && (
          <div className="result">
            <h3>Prediction Result</h3>
            <p><strong>Disease:</strong> {result.prediction}</p>
            <p><strong>Confidence:</strong> {result.confidence}</p>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </header>

      {/* Sections */}
      <section className="section" id="about">
        <h2>About Us</h2>
        <p>We provide instant plant disease detection to keep your plants healthy 🌿</p>
      </section>

      <section className="section" id="features">
        <h2>Features</h2>
        <p>Upload images, take live photos, and detect plant diseases instantly.</p>
      </section>

      <section className="section" id="contact">
        <h2>Contact</h2>
        <p>Reach us via email: support@plantdetector.com</p>
      </section>
    </div>
  );
}
