
import Link from "next/link";
import { Product, formatPrice, getUnitBn, toBengaliNumber } from "@/app/lib/utils";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all relative flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-center justify-between">
          {/* Category Icon */}
          <span className="text-2xl bg-slate-50 p-2 rounded-xl border border-slate-100">
            {product.categoryIcon}
          </span>
        </div>

        {/* Product Info */}
        <div className="mt-3">
          <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#009b4d] transition-colors">
            {product.nameBn}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {getUnitBn(product.unit)}
          </p>
        </div>
      </div>

      {/* Price Footer */}
      <div className="flex justify-between mt-4 pt-2 border-t border-slate-50">
        <div>
            <span className="text-[10px] text-slate-400 block">আজকের দাম</span>
            <span className="text-base font-extrabold text-slate-900">
                ৳{formatPrice(product.today)}
            </span>
        </div>
        {/* Price Change Badge with React Icons */}
        <div>
            {product.change.dir === "up" && (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-red-100">
                <FaArrowUp className="text-[9px]" />
                {toBengaliNumber(product.change.pct)}%
              </span>
            )}

            {product.change.dir === "down" && (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                <FaArrowDown className="text-[9px]" />
                {toBengaliNumber(product.change.pct)}%
              </span>
            )}

            {product.change.dir === "flat" && (
              <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-400 text-[11px] font-semibold px-2 py-1 rounded-full border border-slate-100">
                <FaMinus className="text-[8px]" />
                ०%
              </span>
            )}
        </div>
      </div>
    </Link>
  );
}
