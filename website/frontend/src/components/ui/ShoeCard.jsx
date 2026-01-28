import React from "react";
import { Link } from "wouter";

export default function ShoeCard({ shoe }) {
  return (
    <Link href={`/product/${shoe.id}`} className="group block">
      <div className="cursor-pointer bg-black rounded-xl overflow-hidden border border-yellow-600/20 hover:border-yellow-500 transition-all transform hover:-translate-y-1 shadow-lg">
        
        <div className="relative aspect-square overflow-hidden bg-neutral-900">

          {/* AR Badge */}
          {shoe.arEnabled && (
            <div className="absolute top-3 right-3 z-20 bg-yellow-500 text-black text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
              </svg>
              AR Try-On
            </div>
          )}

          {/* Product Image */}
          <img
            src={shoe.image}
            alt={shoe.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Hover Quick View */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-yellow-500 font-medium backdrop-blur-sm bg-black/40 px-4 py-2 rounded-full border border-yellow-600/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
              </svg>
              Quick View
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-sans font-semibold text-yellow-500 text-base group-hover:text-yellow-400 transition-colors line-clamp-1">
              {shoe.name}
            </h3>
          </div>

          <p className="text-sm text-yellow-300/70 mb-3">{shoe.category}</p>

          <div className="flex items-center justify-between">
            <span className="font-mono text-lg font-bold text-yellow-500">
              ${shoe.price}
            </span>

            <div className="flex gap-1">
              {shoe.colors?.map((c, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-yellow-500/30"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
