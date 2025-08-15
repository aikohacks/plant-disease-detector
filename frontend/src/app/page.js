"use client";
import { useState, useRef } from "react";
import "../app/globals.css";

export default function Home() {
  const [image, setImage] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  // Start camera
  const handleTakePhoto = async () => {
    if (streaming) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setStreaming(true);
    } catch (err) {
      alert("Unable to access camera: " + err.message);
    }
  };

  // Capture photo from camera
  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);

    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;
    setStreaming(false);
  };

  // Scan image
  const handleScan = () => {
    if (!image) return alert("Please upload or take a photo first!");
    alert("Scanning image... 🔍");
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

        {/* Buttons */}
        <div className="buttons-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="image-upload"
          />
          <label htmlFor="image-upload" className="btn">
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
        {image && (
          <div className="image-preview">
            <img src={image} alt="Preview" />
            <button className="btn scan-btn" onClick={handleScan}>
              Scan Image
            </button>
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
