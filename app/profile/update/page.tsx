"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, updateUser } from "@/app/lib/auth-client"; // পাথ আপনার প্রজেক্ট অনুযায়ী ঠিক রাখা হয়েছে
import toast from "react-hot-toast";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  // সরাসরি স্টেট ইনিশিয়ালাইজ করা, আলাদা কোনো useEffect লাগবে না
  const [name, setName] = useState(session?.user?.name || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await updateUser({
      name: name,
    });

    setLoading(false);

    if (error) {
      toast.error("আপডেট ব্যর্থ হয়েছে!");
    } else {
      toast.success("প্রোফাইল আপডেট হয়েছে! ");
      router.push("/profile");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
        <h1 className="text-xl font-bold text-slate-900">প্রোফাইল আপডেট করুন</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label text-xs font-semibold text-slate-600">আপনার নাম</label>
            <input
              type="text"
              required
              defaultValue={session?.user?.name || ""} // ← এখানে সরাসরি defaultValue ব্যবহার করা হয়েছে
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full text-sm"
              placeholder="আপনার নাম লিখুন"
            />
          </div>
          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white border-none flex-1 btn-sm"
            >
              {loading ? <span className="loading loading-spinner loading-xs"></span> : "সংরক্ষণ করুন"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-ghost border-slate-200 btn-sm"
            >
              বাতিল
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}