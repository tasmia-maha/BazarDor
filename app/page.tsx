import Hero from "@/components/hero";
import ProductCard from "@/components/productCard";
import { Product, toBengaliNumber } from "@/app/lib/utils";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://api.api-store.workers.dev/api/bazardor/products", {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

async function HomeContent() {
  const products = await getProducts();

  const risers = products
    .filter((p) => p.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = products
    .filter((p) => p.change.dir === "down")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <div className="bg-base-300 min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">
        <Hero />

        {/* Price Risers */}
        {risers.length > 0 && (
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-red-600 font-bold text-sm">▲</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                আজ দাম বেড়েছে
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {risers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Price Fallers */}
        {fallers.length > 0 && (
          <section>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-emerald-600 font-bold text-sm">▼</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                আজ দাম কমেছে
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {fallers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* All Products */}
        <section id="সব-পণ্য" className="scroll-mt-20">
          <div className="mb-4 space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              সব পণ্য
            </h2>
            <p className="text-xs text-slate-500">
              মোট {toBengaliNumber(products.length)}টি পণ্য দেখানো হচ্ছে
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-6 text-center">
          পণ্য লোড হচ্ছে...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}