"use client";

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (value: string) => void;
}

export default function SortDropdown({ sortBy, setSortBy }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">সাজান:</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="select select-bordered select-sm bg-white text-sm"
      >
        <option value="default">ডিফল্ট</option>
        <option value="price-asc">দাম: কম থেকে বেশি</option>
        <option value="price-desc">দাম: বেশি থেকে কম</option>
      </select>
    </div>
  );
}