import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * Interactive Lookbook Grid
 * Displays a masonry-style or varied block layout of lifestyle imagery.
 * Hovering reveals product tags which can be clicked to go to the PDP.
 */
export default function LookbookGrid() {
  // Mock Lookbook data
  const looks = [
    {
      id: "look-1",
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop",
      title: "Urban Minimal",
      colSpan: "col-span-12 md:col-span-8",
      rowSpan: "row-span-2",
      products: [
        { id: "p1", name: "Oversized Utility Jacket", price: "$180", x: "30%", y: "40%" },
        { id: "p2", name: "Cargo Trousers", price: "$120", x: "60%", y: "70%" },
      ],
    },
    {
      id: "look-2",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1000&auto=format&fit=crop",
      title: "Evening Ready",
      colSpan: "col-span-12 md:col-span-4",
      rowSpan: "row-span-1",
      products: [
        { id: "p3", name: "Silk Blend Shirt", price: "$95", x: "50%", y: "50%" },
      ],
    },
    {
      id: "look-3",
      image:
        "https://images.unsplash.com/photo-1434389678232-02315b8823b4?q=80&w=1000&auto=format&fit=crop",
      title: "Core Essentials",
      colSpan: "col-span-12 md:col-span-4",
      rowSpan: "row-span-1",
      products: [
        { id: "p4", name: "Essential Knit Beanie", price: "$35", x: "40%", y: "20%" },
        { id: "p5", name: "Heavyweight Box Tee", price: "$45", x: "50%", y: "60%" },
      ],
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8 max-w-[1920px] mx-auto bg-white">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 mb-2">
            The Lookbook
          </h2>
          <p className="text-zinc-500 font-body">
            Curated fits. Hover to shop the look.
          </p>
        </div>
        <a
          href="/lookbook"
          className="text-sm font-bold text-zinc-900 hover:text-red-600 transition-colors flex items-center gap-1"
        >
          View All <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-12 gap-4 auto-rows-[300px]">
        {looks.map((look) => (
          <div
            key={look.id}
            className={`relative group overflow-hidden rounded-2xl bg-zinc-100 ${look.colSpan} ${look.rowSpan}`}
          >
            {/* Background Image */}
            <img
              src={look.image}
              alt={look.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 ease-out" />

            {/* Title Badge - Always visible, fades out slightly on hover */}
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm transition-opacity duration-300 group-hover:opacity-0">
              <span className="text-sm font-bold text-zinc-900 tracking-tight">
                {look.title}
              </span>
            </div>

            {/* Product Tags Container - fades in on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
              {look.products.map((product) => (
                <div
                  key={product.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: product.x, top: product.y }}
                >
                  {/* The Tag Dot */}
                  <div className="relative group/tag">
                    <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.3)] animate-pulse" />
                    
                    {/* The Tag Content Card */}
                    <a
                      href={`/product/${product.id}`}
                      className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-max bg-white rounded-xl shadow-xl p-3 flex items-center gap-4 opacity-0 translate-y-2 pointer-events-none group-hover/tag:opacity-100 group-hover/tag:translate-y-0 group-hover/tag:pointer-events-auto transition-all duration-300 ease-out z-10"
                    >
                      <div className="text-left">
                        <p className="text-sm font-bold text-zinc-900">
                          {product.name}
                        </p>
                        <p className="text-xs font-semibold text-zinc-500 mt-0.5">
                          {product.price}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-900 group-hover/tag:bg-zinc-900 group-hover/tag:text-white transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                      
                      {/* Little triangle pointer for the tooltip effect */}
                      <div className="absolute left-1/2 top-full -translate-x-1/2 -mt-1 w-2 h-2 bg-white rotate-45" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
