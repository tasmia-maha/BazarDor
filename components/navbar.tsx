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
  const [banglaDate] = useState(() => getBanglaDate());
  const [menuOpen, setMenuOpen] = useState(false); 

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {});
  }, []);


  const handleSignOut = async () => {
    setMenuOpen(false); 
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
                <Image src="/assets/logo-icon.png" alt="logo" width={40} height={40} />
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
            {/*  DESKTOP AUTH (md er upore dekhabe)  */}
            <div className="hidden md:flex items-center space-x-3">
              {isPending ? (
                <span className="loading loading-spinner loading-sm text-emerald-600"></span>
              ) : session?.user ? (
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-slate-200">
                    <div className="w-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        session.user.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="mt-3 z-50 p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 max-w-[calc(100vw-2rem)] border border-slate-100"
                  >
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
                  <Link
                    href="/auth/sign-up"
                    className="btn btn-emerald btn-sm bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                  >
                    সাইন আপ
                  </Link>
                </div>
              )}
            </div>

            {/*  HAMBURGER BUTTON (mobile e matro)  */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="btn btn-ghost btn-circle md:hidden"
              aria-label="মেনু টগল করুন"
            >
              {menuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/*  Category pills — ekhon desktop e matro (mobile e hamburger e ache)*/}
        <div className="hidden md:flex items-center space-x-1 overflow-x-auto py-2 text-sm no-scrollbar border-t border-slate-100">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-emerald-100 text-emerald-800 font-semibold"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat.icon} {cat.nameBn}
              </Link>
            );
          })}
        </div>

        {/* MOBILE DROPDOWN MENU*/}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-[75vh] overflow-y-auto border-t border-slate-100" : "max-h-0"
          }`}
        >
          <div className="py-3 flex flex-col gap-1">
            {/* Categories (mobile) */}
            {categories.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={()=>setMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-emerald-100 text-emerald-800 font-semibold"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat.icon} {cat.nameBn}
                </Link>
              );
            })}

            {/* Auth section (mobile) */}
            <div className="border-t border-slate-100 mt-2 pt-3">
              {isPending ? (
                <div className="flex justify-center py-2">
                  <span className="loading loading-spinner loading-sm text-emerald-600"></span>
                </div>
              ) : session?.user ? (
                <>
                  <div className="px-3 py-2">
                    <p className="font-semibold text-slate-800">{session.user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                  >
                    মাই প্রোফাইল
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
                  >
                    সাইন আউট
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-1">
                  <Link
                    href="/auth/sign-in"
                    className="btn btn-sm w-full btn-ghost text-slate-700 border border-slate-200"
                  >
                    সাইন ইন
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    className="btn btn-sm w-full bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                  >
                    সাইন আপ
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}