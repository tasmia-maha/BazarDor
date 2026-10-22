"use client";

import { Suspense,useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/app/lib/auth-client";
import toast from "react-hot-toast";
import Link from "next/link";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "সাইন ইন ব্যর্থ হয়েছে!");
    } else {
      toast.success("সাইন ইন সফল!");
      router.push(callbackUrl);
    }
  };

  return (
    <div className="bg-base-300 min-h-[80vh] flex items-center justify-center flex-col px-4 py-12">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">সাইন ইন করুন</h1>
          <p className="text-xs text-slate-500 mt-5">আপনার অ্যাকাউন্টে প্রবেশ করে বাজারের বিস্তারিত তথ্য দেখুন</p>
        </div>
      <div className="bg-white mt-5 border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-sm space-y-6">

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label text-xs font-semibold text-slate-600">ইমেইল</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label text-xs font-semibold text-slate-600">পাসওয়ার্ড</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full text-sm"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none w-full mt-2"
          >
            {loading ? <span className="loading loading-spinner loading-xs"></span> : "সাইন ইন"}
          </button>
        </form>

        <div className="divider text-xs text-slate-400">অথবা</div>
        <div className="space-y-3">
          <button
            onClick={() => signIn.social({ provider: "google", callbackURL: callbackUrl })}
            className="btn btn-outline w-full border-slate-300 normal-case font-normal text-slate-700"
          >
            Google দিয়ে চালিয়ে যান
          </button>
          <button
            onClick={() => signIn.social({ provider: "github", callbackURL: callbackUrl })}
            className="btn btn-outline w-full border-slate-300 normal-case font-normal text-slate-700"
          >
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          অ্যাকাউন্ট নেই?{" "}
          <Link href="/auth/sign-up" className="text-emerald-600 font-bold hover:underline">
            রেজিস্টার করুন
          </Link>
        </p>
      </div>
    </div>
  );
}
export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center">লোড হচ্ছে...</div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}