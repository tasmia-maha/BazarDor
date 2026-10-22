"use client";

import { useEffect, useState } from "react";
import { Product, formatPrice, toBengaliNumber } from "@/app/lib/utils";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => {});
  }, []);

  if (!products.length) return null;

  const tickerItems = [...products, ...products];

  return (
    <div className="bg-white border-y border-slate-100 py-2.5 sticky top-27 z-30 overflow-hidden whitespace-nowrap text-xs shadow-sm">
      <div className="inline-block animate-marquee">
        {tickerItems.map((item, idx) => (
          <span 
            key={`${item.id}-${idx}`} 
            className="inline-flex items-center mx-5 space-x-1.5 border-r border-slate-100 pr-5"
          >
            <span className="font-semibold text-slate-700">{item.nameBn}</span>
            <span className="font-bold text-slate-900">৳{formatPrice(item.today)}</span>
            
            {item.change.dir === "up" && (
              <span className="text-red-600 font-bold inline-flex items-center">
                <FaArrowUp size={12}/> {toBengaliNumber(item.change.pct)}%
              </span>
            )}
            {item.change.dir === "down" && (
              <span className="text-emerald-600 font-bold inline-flex items-center">
                <FaArrowDown size={12}/> {toBengaliNumber(item.change.pct)}%
              </span>
            )}
            {item.change.dir === "flat" && (
              <span className="text-slate-400 font-bold inline-flex items-center">
                <FaMinus size={12}/>0%
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}