"use client";

import { Suspense,useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signIn } from "@/app/lib/auth-client"; 
import toast from "react-hot-toast";
import Link from "next/link";

function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না!");
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে!");
        return;
      }

      toast.success("রেজিস্ট্রেশন সফল হয়েছে!");
      router.push("/auth/sign-in");
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-base-300 min-h-[80vh] flex items-center flex-col justify-center px-4 py-12">
        <div className="text-center space-y-1">
          <h1 className="text-2xl mb-5 font-bold text-slate-900">
            অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-xs mb-5 text-slate-500">
            বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
          </p>
        </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-sm space-y-6">

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="label text-xs font-semibold text-slate-600"
            >
              নাম
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full text-sm"
              placeholder="আপনার পুরো নাম লিখুন"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="label text-xs font-semibold text-slate-600"
            >
              ইমেইল
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="label text-xs font-semibold text-slate-600"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full text-sm"
              placeholder="কমপক্ষে ৮ অক্ষর"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="label text-xs font-semibold text-slate-600"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full text-sm"
              placeholder="পাসওয়ার্ড আবার লিখুন"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none w-full mt-2"
          >
            {loading ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "অ্যাকাউন্ট তৈরি করুন"
            )}
          </button>
        </form>

        {/* Divider & Social Sign In/Up Section */}
        <div className="divider text-xs text-slate-400">অথবা</div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => signIn.social({ provider: "google", callbackURL: callbackUrl })}
            className="btn btn-outline w-full border-slate-300 normal-case font-normal text-slate-700 flex items-center justify-center gap-2"
          >
            Google দিয়ে চালিয়ে যান
          </button>

          <button
            type="button"
            onClick={() => signIn.social({ provider: "github", callbackURL: callbackUrl })}
            className="btn btn-outline w-full border-slate-300 normal-case font-normal text-slate-700 flex items-center justify-center gap-2"
          >
            GitHub দিয়ে চালিয়ে যান
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/auth/sign-in"
            className="text-emerald-600 font-bold hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </main>
  );
}
export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center">লোড হচ্ছে...</div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}