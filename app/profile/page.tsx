"use client";

import { useState } from "react";
import { useSession, updateUser } from "@/app/lib/auth-client";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // সেশনের নাম লোড হলে স্টেটে সেট করার জন্য
  if (session?.user?.name && !name && !loading) {
    setName(session.user.name);
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await updateUser({
      name: name,
    });

    setLoading(false);

    if (error) {
      toast.error("আপডেট ব্যর্থ হয়েছে!");
    } else {
      toast.success("প্রোফাইল আপডেট হয়েছে!");
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center space-x-2">
        <span className="text-slate-600 text-sm">লোড হচ্ছে...</span>
        <span className="loading loading-spinner loading-lg text-emerald-600"></span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-600 text-sm">আপনি লগইন করেননি।</p>
        <Link href="/signin" className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none btn-sm">
          সাইন ইন করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-[#f4f7f4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Page Title */}
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold text-slate-900">আমার প্রোফাইল</h1>
          <p className="text-xs text-slate-500">আপনার অ্যাকাউন্টের তথ্য দেখতে ও পরিবর্তন করতে পারেন</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl font-bold border border-emerald-300 overflow-hidden shrink-0">
              {session.user.image ? (
                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
              ) : (
                session.user.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{session.user.name}</h2>
              <p className="text-xs text-slate-500">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Update Form Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-3 border-slate-100">
            তথ্য
          </h3>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="label text-xs font-semibold text-slate-600">নাম</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full text-sm bg-slate-50/50"
                placeholder="আপনার নাম লিখুন"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn bg-[#009b4d] hover:bg-[#008240] text-white border-none w-full sm:w-auto px-8 "
              >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : "আপডেট করুন"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}