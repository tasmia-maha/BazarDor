import { getBanglaDate } from "@/app/lib/utils";
import Image from "next/image";
export default function Hero() {
  return (
    <div className="bg-white mt-5 rounded-3xl p-6 sm:p-10 border border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
      {/* Left Content */}
      <div className="space-y-3 max-w-full text-center md:text-left z-10">
        <div className="inline-block bg-[#d2e7d5] text-emerald-900 text-xs px-3 py-1 rounded-full font-medium">
          {getBanglaDate()}
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          আজকের বাজারের দাম এক নজরে
        </h1>
        
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
        </p>
        
        <div className="pt-2">
          <a
            href="#সব-পণ্য"
            className="btn bg-[#009b4d] hover:bg-[#008240] text-white border-none rounded-xl px-6 font-semibold text-sm shadow-sm"
          >
            সব পণ্য দেখুন
          </a>
        </div>
      </div>

      {/* Right Emoji Illustration */}
      <div className="text-7xl sm:text-8xl select-none z-10">
        <Image src="/assets/bazar-hero.png" alt="hero" width={100} height={100}/>
      </div>
    </div>
  );
}