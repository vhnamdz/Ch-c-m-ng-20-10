import React, { useState, useRef } from "react";
import gsap from "gsap";
import config from "./config";
import greetings from "./greetings";
import "./App.css";

function removeVietnameseTones(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function App() {
  const [inputName, setInputName] = useState("");
  const [person, setPerson] = useState(null);
  const [searchedName, setSearchedName] = useState("");
  const [showCurtain, setShowCurtain] = useState(true);
  const [animate, setAnimate] = useState(false);

  const pathRef = useRef(null);
  const curtainRef = useRef(null);

  // Hiệu ứng kéo mở rèm SVG khi bấm nút "Khám phá"
  const handleOpenWebsite = () => {
    // Trạng thái ban đầu & trạng thái kết thúc đường cong SVG
    const svgPath = pathRef.current;
    if (!svgPath) return;

    // Chuỗi biến đổi đường cong SVG
    const start = "M 0 0 V 100 Q 50 100 100 100 V 0 Z";
    const curve = "M 0 0 V 50 Q 50 0 100 50 V 0 Z";
    const end = "M 0 0 V 0 Q 50 0 100 0 V 0 Z";

    const tl = gsap.timeline({
      onComplete: () => setShowCurtain(false),
    });

    tl.to(svgPath, {
      duration: 0.8,
      attr: { d: curve },
      ease: "power2.in",
    }).to(svgPath, {
      duration: 0.6,
      attr: { d: end },
      ease: "power2.out",
    });

    gsap.to(".curtain-content", { opacity: 0, duration: 0.5 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    const key = removeVietnameseTones(inputName);
    const foundPerson = greetings[key];

    setAnimate(false);
    setPerson(foundPerson || null);
    setSearchedName(inputName);

    setTimeout(() => {
      setAnimate(true);
    }, 50);
  };

  return (
    <main
      className="page"
      style={{
        "--bg": config.backgroundColor || "#fff1f5",
        "--card": config.cardColor || "#fffafd",
        "--text": config.textColor || "#874c65",
        "--accent": config.accentColor || "#d4779a",
        "--page-background-image": config.backgroundImage
          ? `linear-gradient(#fff5f577, #fff5f577), url("${config.backgroundImage}")`
          : "none",
      }}
    >
      {/* 🌹 MÀN CÁNH HOA CURVE MANIPULATION (SVG MỞ SANG TRÊN) */}
      {showCurtain && (
        <div className="svg-curtain" ref={curtainRef}>
          <div className="curtain-content">
            <div className="flower-icon">🌹</div>
            <h2>Chào mừng Ngày Phụ nữ Việt Nam 20/10</h2>
            <button className="open-btn" onClick={handleOpenWebsite}>
              {`{ Chạm để mở lời chúc }`}
            </button>
          </div>
          <svg className="svg-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="100%">
                <stop offset="0%" stopColor="#ffb3c6" />
                <stop offset="100%" stopColor="#d4779a" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              fill="url(#grad)"
              d="M 0 0 V 100 Q 50 100 100 100 V 0 Z"
            />
          </svg>
        </div>
      )}

      {/* Thẻ thông tin chính */}
      <section className="card">
        <p className="eyebrow">✿ NGÀY PHỤ NỮ VIỆT NAM 20/10 ✿</p>
        <h1>{config.title || "Trao yêu thương"}</h1>
        <h2>{config.subtitle || "Gửi ngàn lời chúc 20/10"}</h2>

        <form onSubmit={handleSearch} className="search-box">
          <input
            type="text"
            placeholder="Nhập tên của bạn (VD: Nguyễn Thị Minh Anh)..."
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
          />
          <button type="submit">Xem lời chúc</button>
        </form>

        {person ? (
          <div className={`greeting-content ${animate ? "show" : ""}`}>
            <div className="flower bounce-flower">💐</div>
            <p>Thân gửi</p>
            <h3 className="recipient-name">{person.name}</h3>

            <div className="messages-container">
              {Array.isArray(person.message) ? (
                person.message.map((msg, index) => (
                  <div key={index} className="message-item">
                    <p className="message">{msg}</p>
                  </div>
                ))
              ) : (
                <div className="message-item">
                  <p className="message">{person.message}</p>
                </div>
              )}
            </div>

            <p className="signature">Chúc bạn luôn rạng rỡ và hạnh phúc ♡</p>
          </div>
        ) : searchedName ? (
          <p className="not-found">
            ❌ Không tìm thấy lời chúc cho "{searchedName}".
          </p>
        ) : (
          <p className="hint-text">
            ✨ Nhập tên của bạn vào ô bên trên để nhận lời chúc nhé!
          </p>
        )}
      </section>
