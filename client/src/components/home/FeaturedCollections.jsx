import { useState } from "react";

const EASE = "cubic-bezier(0.43,0.13,0.23,0.96)";

const collections = [
  {
    id: 1,
    name: "Void Collection",
    meta: "Fresh pieces added weekly. Stay ahead of the curve.",
    badge: { label: "New Season", style: "default" },
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=2069&auto=format&fit=crop",
    chips: ["32 pieces", "SS'25"],
    swatches: ["#a43dff", "#ff3232", "#000055"],
    hero: true,
    shapes: [
      {
        w: 260,
        h: 340,
        top: "-60px",
        left: "28%",
        rotate: "-14deg",
        accent: true,
      },
      {
        w: 120,
        h: 160,
        bottom: "20%",
        right: "6%",
        rotate: "0deg",
        accent: false,
      },
      { w: 60, h: 60, top: "18%", left: "8%", rotate: "0deg", accent: false },
    ],
    showShopBtn: true,
  },
  {
    id: 2,
    name: "Quiet Luxury",
    meta: "18 pieces - Limited",
    badge: { label: "Trending", style: "error" },
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2068&auto=format&fit=crop",
    chips: [],
    swatches: ["#c831ff", "#ececf0"],
    hero: false,
    shapes: [
      {
        w: 70,
        h: 180,
        bottom: "22%",
        right: "10%",
        rotate: "10deg",
        accent: false,
      },
      { w: 55, h: 55, top: "20%", left: "16%", rotate: "0deg", accent: true },
    ],
  },
  {
    id: 3,
    name: "Dark Matter",
    meta: "24 pieces",
    badge: { label: "Hot", style: "warning" },
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    chips: [],
    swatches: ["#b341ff", "#d4183d"],
    hero: false,
    shapes: [
      { w: 50, h: 130, top: "18%", left: "20%", rotate: "-6deg", accent: true },
      {
        w: 70,
        h: 70,
        bottom: "28%",
        right: "14%",
        rotate: "0deg",
        accent: false,
      },
    ],
  },
  {
    id: 4,
    name: "Dark Matter",
    meta: "24 pieces",
    badge: { label: "Hot", style: "warning" },
    image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop",
    chips: [],
    swatches: ["#b341ff", "#d4183d"],
    hero: false,
    shapes: [
      { w: 50, h: 130, top: "18%", left: "20%", rotate: "-6deg", accent: true },
      {
        w: 70,
        h: 70,
        bottom: "28%",
        right: "14%",
        rotate: "0deg",
        accent: false,
      },
    ],
  },
];

const badgeStyles = {
  default: { background: "#b13df9", color: "#ffffff" },
  error: { background: "#fee2e2", color: "#ff0000" },
  warning: { background: "#fef3c7", color: "#92400e" },
};

function Badge({ label, style, dot }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        borderRadius: "9999px",
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "4px 10px",
        ...badgeStyles[style],
      }}
    >
      {dot && (
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: style === "default" ? "#fff" : "#991b1b",
            flexShrink: 0,
            animation: "bpulse 1.6s ease-in-out infinite",
            display: "inline-block",
          }}
        />
      )}
      {label}
    </span>
  );
}

function CollectionCard({ col, hovered, onEnter, onLeave }) {
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        borderRadius: "14px",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        background: "#030213",
        gridColumn: col.hero ? "1 / -1" : undefined,
        aspectRatio: col.hero ? "16/7" : "4/5",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: `transform 0.25s ${EASE}`,
      }}
      className="tl-featured-card"
    >
      <img
        src={col.image}
        alt={col.name}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.72,
        }}
      />
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {col.shapes.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              borderRadius: "50%",
              width: s.w,
              height: s.h,
              top: s.top,
              left: s.left,
              bottom: s.bottom,
              right: s.right,
              transform: `rotate(${s.rotate})`,
              background: s.accent
                ? "rgba(212,24,61,0.15)"
                : "rgba(255,255,255,0.04)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0, 0, 0, 0.21) 0%, rgba(3,2,19,0.1) 55%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "6px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Badge
            label={col.badge.label}
            style={col.badge.style}
            dot={col.badge.style === "default"}
          />
          {col.chips.map((c, i) => (
            <span
              key={i}
              style={{
                borderRadius: "9999px",
                fontSize: "10px",
                fontWeight: 500,
                padding: "3px 9px",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {c}
            </span>
          ))}
        </div>

        <div
          style={{
            fontSize: col.hero ? "20px" : "16px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.02em",
            margin: "7px 0 2px",
          }}
        >
          {col.name}
        </div>

        <div
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.05em",
            marginBottom: "9px",
          }}
        >
          {col.meta}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "4px" }}>
            {col.swatches.map((color, i) => (
              <div
                key={i}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: color,
                  border: "1.5px solid rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
          {col.showShopBtn && (
            <button
              style={{
                background: "#fff",
                color: "#030213",
                border: "none",
                borderRadius: "9999px",
                padding: "6px 14px",
                fontSize: "10px",
                fontWeight: 700,
                fontFamily: "Inter, sans-serif",
                cursor: "pointer",
              }}
            >
              Shop Now
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes bpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.8)}}`}</style>
    </div>
  );
}

export default function FeaturedCollections() {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        padding: "26px clamp(16px,3vw,40px) 20px",
        background: "#fff",
        fontFamily: "Inter, sans-serif",
        maxWidth: "1920px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#030213",
          }}
        >
          Featured Collections
        </span>
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#030213",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            cursor: "pointer",
            padding: "7px 0",
          }}
        >
          All Collections <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <div
        style={{ display: "grid", gap: "14px" }}
        className="tl-featured-grid"
      >
        {collections.map((col) => (
          <CollectionCard
            key={col.id}
            col={col}
            hovered={hovered === col.id}
            onEnter={() => setHovered(col.id)}
            onLeave={() => setHovered(null)}
          />
        ))}
      </div>
    </div>
  );
}
