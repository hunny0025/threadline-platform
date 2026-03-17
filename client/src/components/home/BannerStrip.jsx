const items = [
  "SS'25 Drop Now Live",
  "Free Shipping Over INR 1499",
  "New: The Linen Edit",
  "Limited pieces, unlimited impact",
  "Movement meets elegance",
  "Returns within 14 days",
];

export default function BannerStrip() {
  return (
    <div
      style={{
        background: "#030213",
        color: "#fff",
        padding: "10px 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "center",
          animation: "marquee 24s linear infinite",
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#d4183d",
                flexShrink: 0,
                animation: "bpulse 1.6s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes bpulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.8); } }
      `}</style>
    </div>
  );
}
