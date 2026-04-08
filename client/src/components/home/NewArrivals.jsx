import { useState } from "react";

const EASE = "cubic-bezier(0.43,0.13,0.23,0.96)";

const filters = ["All", "Tops", "Bottoms", "Outerwear", "Accessories x"];

const products = [
  {
    id: 1,
    name: "Void Linen Shirt",
    price: "INR 2,199",
    oldPrice: null,
    tag: "New",
    tagStyle: "default",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1974&auto=format&fit=crop",
    bg: "#030213",
    shapeColor: "rgba(255,255,255,0.07)",
  },
  {
    id: 2,
    name: "Sand Cargo Trousers",
    price: "INR 3,499",
    oldPrice: "INR 4,200",
    tag: "Hot",
    tagStyle: "red",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1974&auto=format&fit=crop",
    bg: "#1a1a1a",
    shapeColor: "rgba(255,255,255,0.06)",
  },
  {
    id: 3,
    name: "Ecru Zip Hoodie",
    price: "INR 2,799",
    oldPrice: null,
    tag: "New",
    tagStyle: "default",
    image:
      "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1974&auto=format&fit=crop",
    bg: "#2a2a2a",
    shapeColor: "rgba(255,255,255,0.05)",
  },
  {
    id: 4,
    name: "Onyx Tech Jacket",
    price: "INR 4,999",
    oldPrice: null,
    tag: "Trending",
    tagStyle: "muted",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=1974&auto=format&fit=crop",
    bg: "#111111",
    shapeColor: "rgba(255,255,255,0.05)",
  },
  {
    id: 5,
    name: "Plum Knit Vest",
    price: "INR 1,599",
    oldPrice: "INR 2,199",
    tag: "Sale",
    tagStyle: "red",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1970&auto=format&fit=crop",
    bg: "#0d0d12",
    shapeColor: "rgba(212,24,61,0.14)",
  },
];

const tagStyles = {
  default: { background: "#030213", color: "#fff" },
  red: { background: "#d4183d", color: "#fff" },
  muted: { background: "#ececf0", color: "#030213" },
};

function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: "100%",
        cursor: "pointer",
        transform: hovered ? "translateY(-3px)" : "none",
        transition: `transform 0.22s ${EASE}`,
        fontFamily: "Inter, sans-serif",
      }}
      className="tl-arrival-card"
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "4 / 5",
          borderRadius: "14px",
          overflow: "hidden",
          background: product.bg,
          position: "relative",
          marginBottom: "7px",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.74,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(3,2,19,0.65) 0%, rgba(3,2,19,0.1) 60%, transparent 100%)",
          }}
        />
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: hovered ? "scale(1.07)" : "scale(1)",
            transition: `transform 0.5s ${EASE}`,
          }}
        >
          
        </div>

        <div style={{ position: "absolute", top: "7px", left: "7px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: "9999px",
              fontSize: "8px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "3px 8px",
              ...tagStyles[product.tagStyle],
            }}
          >
            {product.tag}
          </span>
        </div>

        <button
          onClick={() => setWishlisted(!wishlisted)}
          style={{
            position: "absolute",
            top: "7px",
            right: "7px",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.92)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            color: wishlisted ? "#d4183d" : "#030213",
            transition: `transform 0.2s ${EASE}`,
          }}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      <div
        style={{
          fontSize: "11px",
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginBottom: "3px",
          color: "#030213",
        }}
      >
        {product.name}
      </div>

      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#030213" }}>
          {product.price}
        </span>
        {product.oldPrice && (
          <span
            style={{
              fontSize: "10px",
              color: "#bbb",
              textDecoration: "line-through",
            }}
          >
            {product.oldPrice}
          </span>
        )}
      </div>
    </div>
  );
}

export default function NewArrivals() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div style={{ background: "#fff", fontFamily: "Inter, sans-serif" }}>
      <div
        style={{
          padding: "26px clamp(16px,3vw,40px) 14px",
          maxWidth: "1920px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px",
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
            New Arrivals
          </span>
          <button
            style={{
              background: "transparent",
              color: "#030213",
              border: "1.5px solid #030213",
              borderRadius: "9999px",
              padding: "7px 16px",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "Inter, sans-serif",
              cursor: "pointer",
            }}
          >
            View All
          </button>
        </div>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                borderRadius: "9999px",
                fontSize: "11px",
                fontWeight: 500,
                padding: "5px 13px",
                cursor: "pointer",
                fontFamily: "Inter, sans-serif",
                background: activeFilter === f ? "#030213" : "transparent",
                color: activeFilter === f ? "#fff" : "#030213",
                border:
                  activeFilter === f ? "none" : "1px solid rgba(0,0,0,0.1)",
                transition: "transform 0.15s cubic-bezier(0.43,0.13,0.23,0.96)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridAutoColumns: "minmax(220px, 1fr)",
          gap: "14px",
          overflowX: "auto",
          padding: "0 clamp(16px,3vw,40px) 20px",
          scrollbarWidth: "none",
          maxWidth: "1920px",
          margin: "0 auto",
        }}
        className="tl-arrivals-grid"
      >
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
