
import { getProducts } from "./lib/api";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <header className="mb-8 rounded-xl bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-bold text-green-800">
          🛒 বাজার দর
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          প্রতিদিনের বাজারদর জানুন সহজেই
        </p>
      </header>

      <h2 className="mb-4 text-xl font-bold text-gray-800">
        সব পণ্য
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.id}
            className="rounded-xl border border-green-100 bg-white p-5 shadow-sm"
          >
            <p className="text-4xl">{product.image}</p>

            <h3 className="mt-3 text-lg font-bold text-gray-800">
              {product.nameBn}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              প্রতি {product.unit}
            </p>

            <div className="mt-4 flex items-center justify-between gap-2">
              <p className="font-semibold text-gray-800">
                আজকের দাম: {product.today} টাকা
              </p>

              <span
                className={`rounded-full px-2 py-1 text-sm ${
                  product.change.dir === "up"
                    ? "bg-red-100 text-red-700"
                    : product.change.dir === "down"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {product.change.dir === "up"
                  ? "▲"
                  : product.change.dir === "down"
                  ? "▼"
                  : "—"}{" "}
                {product.change.pct}%
              </span>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
