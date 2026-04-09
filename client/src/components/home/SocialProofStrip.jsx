import { useState } from "react";

const stats = [
  { num: "150", suffix: "K+", label: "Happy Customers" },
  { num: "4.9", suffix: "/5", label: "Avg Rating", stars: true },
  { num: "2", suffix: "K+", label: "Pieces Dropped" },
  { num: "48", suffix: "hr", label: "Avg Dispatch" },
];

function ProofCell({ stat }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "#ececf0" : "#ffffff",
        padding: "16px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1px",
        textAlign: "center",
        transition: "background 0.2s",
      }}
    >
      <div
        style={{
          fontSize: "24px",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: "#af26ff",
        }}
      >
        {stat.num}
        <span style={{ color: "#d4183d" }}>{stat.suffix}</span>
      </div>
      {stat.stars && (
        <div
          style={{
            fontSize: "11px",
            color: "#d4183d",
            letterSpacing: "1px",
            marginTop: "1px",
          }}
        >
          *****
        </div>
      )}
      <div
        style={{
          fontSize: "9px",
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#999",
          marginTop: "3px",
        }}
      >
        {stat.label}
      </div>
    </div>
  );
}

export default function SocialProofStrip() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1px",
        background: "rgba(0,0,0,0.1)",
        borderTop: "1px solid rgba(0,0,0,0.1)",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {stats.map((s, i) => (
        <ProofCell key={i} stat={s} />
      ))}
    </div>
  );
}
