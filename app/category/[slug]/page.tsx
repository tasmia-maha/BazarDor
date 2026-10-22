"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toBengaliNumber } from "@/app/lib/utils";
import SortDropdown from "@/components/sortDropDown";

interface ProductItem {
  id: number;
  slug: string;
  nameBn: string;
  image?: string;
  unit?: string;
  today: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
}

interface CategoryInfo {
  nameBn: string;
  icon?: string;
}

const unitBn: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  hali: "হালি",
  piece: "টি",
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("default");

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(false);

        const [productsRes, categoryRes] = await Promise.all([
          fetch(`https://api.api-store.workers.dev/api/bazardor/products?category=${slug}`),
          fetch(`https://api.api-store.workers.dev/api/bazardor/categories/${slug}`),
        ]);

        if (!productsRes.ok || !categoryRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const productsData = await productsRes.json();
        const categoryData = await categoryRes.json();

        setProducts(productsData.products || productsData || []);
        setCategory(categoryData.category || categoryData || { nameBn: slug });
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  // Immutable sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-asc") return a.today - b.today;
    if (sortBy === "price-desc") return b.today - a.today;
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-24 bg-gray-200 rounded-2xl mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
          <div className="h-40 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
        <h2 className="text-2xl font-bold mb-2">কোনো পণ্য পাওয়া যায়নি</h2>
        <p className="text-gray-500 mb-6">দুঃখিত, এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য উপলব্ধ নেই।</p>
        <Link href="/" className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-300 text-slate-800">
      <main className="max-w-6xl mx-auto p-6">

        {/* Category Banner */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl shrink-0">
            {category?.icon || "🛒"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{category?.nameBn || slug}</h1>
            <p className="text-sm text-slate-500">{toBengaliNumber(sortedProducts.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
          </div>
        </div>

        {/* Sort Bar (আলাদা bar, ডানে) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-3 mb-5 flex items-center justify-end">
            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        </div>
        
        <p className="text-sm text-slate-500 mb-4">
          মোট {toBengaliNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedProducts.map((item) => (
            <Link
              key={item.id}
              href={`/product/${item.slug}`}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-0.5 transition"
            >
              {/* উপরে: icon + নাম + একক */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0">
                  {item.image || " "}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{item.nameBn}</h3>
                  <p className="text-xs text-slate-400">
                    প্রতি {unitBn[item.unit || ""] || item.unit || "কেজি"}
                  </p>
                </div>
              </div>

              {/* নিচে: দাম + পরিবর্তন badge */}
              <div className="border-t border-slate-100 mt-4 pt-3 flex justify-between items-end">
                <div>
                  <span className="text-xs text-slate-400 block">আজকের দাম</span>
                  <span className="text-xl font-bold text-slate-900">
                    {toBengaliNumber(item.today)} টাকা
                  </span>
                </div>

                {item.change?.dir === "up" && (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full shrink-0">
                    ▲ {toBengaliNumber(item.change.pct)}%
                  </span>
                )}
                {item.change?.dir === "down" && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full shrink-0">
                    ▼ {toBengaliNumber(item.change.pct)}%
                  </span>
                )}
                {item.change?.dir === "flat" && (
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full shrink-0">
                    — ০%
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}