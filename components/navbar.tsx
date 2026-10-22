"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "@/app/lib/auth-client";
import toast from "react-hot-toast";
import Image from "next/image";
import { Category, getBanglaDate } from "@/app/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [banglaDate, setBanglaDate] = useState("");

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);

 useEffect(() => {
  setBanglaDate(getBanglaDate());
}, []);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("সাইন আউট সফল!");
          router.push("/");
        },
      },
    });
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg text-xl shadow-sm">
                <Image src="/assets/logo-icon.png" alt="logo" width={40} height={40}/>
              </span>
            </Link>
            <div className="flex flex-col">
              <h3 className="text-black font-bold">বাজার দর</h3>
              <span className="text-xs text-slate-500 hidden sm:inline-block border-l pl-3 border-slate-300">
                {banglaDate}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isPending ? (
              <span className="loading loading-spinner loading-sm text-emerald-600"></span>
            ) : session?.user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-slate-200">
                  <div className="w-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name || "User"} />
                    ) : (
                      session.user.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-50 p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 max-w-[calc(100vw-2rem)] border border-slate-100">
                  <li className="px-3 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-800">{session.user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                  </li>
                  <li>
                    <Link href="/profile">মাই প্রোফাইল</Link>
                  </li>
                  <li>
                    <button onClick={handleSignOut} className="text-red-600">সাইন আউট</button>
                  </li>
                </ul>
                <span className="text-black font-bold">{session.user.name}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/sign-in" className="btn btn-ghost btn-sm text-slate-700">সাইন ইন</Link>
                <Link href="/auth/sign-up" className="btn btn-emerald btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-none">
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Category List Nav */}
        <div className="flex items-center space-x-1 overflow-x-auto py-2 text-sm no-scrollbar border-t border-slate-100">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  isActive ? "bg-emerald-100 text-emerald-800 font-semibold" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.icon} {cat.nameBn}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}