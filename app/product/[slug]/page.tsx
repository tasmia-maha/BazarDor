import Link from "next/link";
import { notFound } from "next/navigation";
import { toBengaliNumber } from "@/app/lib/utils";
import { Suspense } from "react";
import { FaCaretDown,FaCaretUp,FaMinus } from "react-icons/fa";

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface ProductDetail {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: { dir: "up" | "down" | "flat"; pct: number };
  markets: Market[];
}

const unitBn: Record<string, string> = {
  kg: "কেজি",
  litre: "লিটার",
  dozen: "ডজন",
  hali: "হালি",
  piece: "টি",
};


async function getProduct(slug: string): Promise<ProductDetail | null> {
  const res = await fetch("https://api.api-store.workers.dev/api/bazardor/products", {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const products: ProductDetail[] = await res.json();
  return products.find((p) => p.slug === slug) || null;
}

async function ProductContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const { slug } = await params;

  const product = await getProduct(slug);


  if (!product) notFound();

  const markets = product.markets ?? [];
  const hasMarkets = markets.length > 0;

  
  const marketsByDivision = markets.reduce(
    (acc, market) => {
      if (!acc[market.division]) acc[market.division] = [];
      acc[market.division].push(market);
      return acc;
    },
    {} as Record<string, Market[]>
  );

  
  const allMins = markets.map((m) => m.min);
  const allMaxs = markets.map((m) => m.max);
  const minPrice = hasMarkets ? Math.min(...allMins) : product.today;
  const maxPrice = hasMarkets ? Math.max(...allMaxs) : product.today;
  const avgPrice = hasMarkets
    ? Math.round(markets.reduce((sum, m) => sum + (m.min + m.max) / 2, 0) / markets.length)
    : product.today;

  const unitLabel = `প্রতি ${unitBn[product.unit] || product.unit || "কেজি"}`;

  
  const history = [
    { label: "আজ", value: product.today },
    { label: "গতকাল", value: product.yesterday },
    { label: "গত সপ্তাহ", value: product.lastWeek },
    { label: "গত মাস", value: product.lastMonth },
  ];

  return (
    <div className="min-h-screen bg-base-300 text-slate-800">
      <main className="max-w-6xl mx-auto p-6 space-y-5">

        
        <div className="breadcrumbs text-sm text-slate-500">
          <ul>
            <li><Link href="/" className="hover:text-emerald-600">হোম</Link></li>
            <li>
              <Link href={`/category/${product.category}`} className="hover:text-emerald-600">
                {product.categoryNameBn}
              </Link>
            </li>
            <li className="text-slate-700 font-medium">{product.nameBn}</li>
          </ul>
        </div>

        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl shrink-0">
              {product.image || ""}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{product.nameBn}</h1>
              <p className="text-sm text-slate-500">{unitLabel}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="badge badge-sm bg-emerald-50 text-emerald-700 border-emerald-100">
                  {product.categoryIcon} {product.categoryNameBn}
                </span>
                <span className="badge badge-sm bg-slate-50 text-slate-600 border-slate-200">
                  {unitLabel}
                </span>
                {product.change?.dir === "up" && (
                  <span className="badge badge-sm bg-red-50 text-red-600 border-red-100">
                    <FaCaretUp size={12}/>{toBengaliNumber(product.change.pct)}%
                  </span>
                )}
                {product.change?.dir === "down" && (
                  <span className="badge badge-sm bg-emerald-50 text-emerald-600 border-emerald-100">
                    <FaCaretDown size={12}/>{toBengaliNumber(product.change.pct)}%
                  </span>
                )}
                {product.change?.dir === "flat" && (
                  <span className="badge badge-sm bg-slate-100 text-slate-500 border-slate-200"><FaMinus size={12}/> ০%</span>
                )}
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl px-6 py-3 text-center bg-slate-50/60 shrink-0">
            <p className="text-xs text-slate-400">আজকের দাম</p>
            <p className="text-2xl font-bold text-slate-900">{toBengaliNumber(product.today)} টাকা</p>
          </div>
        </div>

        
        <section>
          <h2 className="font-bold text-slate-800 mb-3">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs text-slate-400">সর্বনিম্ন দাম</p>
              <p className="text-2xl font-bold text-emerald-600">{toBengaliNumber(minPrice)} টাকা</p>
              <p className="text-xs text-slate-400 mt-1">সব বাজার মিলিয়ে সবচেয়ে কম</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs text-slate-400">সর্বোচ্চ দাম</p>
              <p className="text-2xl font-bold text-red-500">{toBengaliNumber(maxPrice)} টাকা</p>
              <p className="text-xs text-slate-400 mt-1">সব বাজার মিলিয়ে সবচেয়ে বেশি</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs text-slate-400">গড় দাম</p>
              <p className="text-2xl font-bold text-slate-900">{toBengaliNumber(avgPrice)} টাকা</p>
              <p className="text-xs text-slate-400 mt-1">
                মোট {toBengaliNumber(markets.length)}টি বাজারের গড়
              </p>
            </div>
            <div className="bg-emerald-600 rounded-2xl shadow-sm p-5 text-white">
              <p className="text-xs text-emerald-100">আজকের দাম</p>
              <p className="text-2xl font-bold">{toBengaliNumber(product.today)} টাকা</p>
              <p className="text-xs text-emerald-100 mt-1">{unitLabel}</p>
            </div>
          </div>
        </section>

        
        <section>
          <h2 className="font-bold text-slate-800 mb-3">বাজারভিত্তিক বাজারের দাম</h2>
          {hasMarkets ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-slate-500 text-xs">
                    <th>বাজার</th>
                    <th>বিভাগ</th>
                    <th>সর্বনিম্ন</th>
                    <th>সর্বোচ্চ</th>
                    <th>গড় মূল্য</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(marketsByDivision).map(([division, divisionMarkets]) =>
                    divisionMarkets.map((m) => (
                      <tr key={`${division}-${m.market}`}>
                        <td className="font-medium text-slate-800">{m.market}</td>
                        <td className="text-slate-500">{division}</td>
                        <td className="text-emerald-600 font-semibold">{toBengaliNumber(m.min)} টাকা</td>
                        <td className="text-red-500 font-semibold">{toBengaliNumber(m.max)} টাকা</td>
                        <td className="font-bold text-slate-900">
                          {toBengaliNumber(Math.round((m.min + m.max) / 2))} টাকা
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-sm text-slate-500">
              এই পণ্যের বাজারভিত্তিক দাম এখনো যোগ করা হয়নি।
            </div>
          )}
        </section>

     
        <section>
          <h2 className="font-bold text-slate-800 mb-3">দামের প্রবণতা</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {history.map((h) => {
              const diff = product.today - h.value;
              return (
                <div key={h.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <p className="text-xs text-slate-400">{h.label}</p>
                  <p className="text-xl font-bold text-slate-900">{toBengaliNumber(h.value)} টাকা</p>
                  {h.label === "আজ" ? (
                    <p className="text-xs text-slate-400 mt-1">বর্তমান দাম</p>
                  ) : diff === 0 ? (
                    <p className="text-xs text-slate-400 mt-1">আজকের সাথে সমান</p>
                  ) : (
                    <p className={`text-xs font-semibold mt-1 ${diff > 0 ? "text-red-500" : "text-emerald-600"}`}>
                      {diff > 0 ? "▲" : "▼"} {h.label}ের চেয়ে{" "}
                      {toBengaliNumber(Math.abs(diff))} টাকা {diff > 0 ? "বেশি" : "কম"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center">পণ্যের তথ্য লোড হচ্ছে...</div>
      }
    >
      <ProductContent params={params} />
    </Suspense>
  );
}