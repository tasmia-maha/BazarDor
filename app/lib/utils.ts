export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
  markets: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliNumber(num: number | string): string {
  return String(num).replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

export function formatPrice(price: number): string {
  const formatted = price.toLocaleString("en-IN");
  return toBengaliNumber(formatted);
}

export function getUnitBn(unit: string): string {
  const mapping: Record<string, string> = {
    kg: "প্রতি কেজি",
    litre: "প্রতি লিটার",
    piece: "প্রতি টি",
    pair: "প্রতি জোড়া",
    dozen: "প্রতি ডজন",
    gram: "প্রতি গ্রাম",
    "100g": "প্রতি ১০০ গ্রাম",
    "4pcs": "প্রতি ৪টি (এক হালি)"
  };
  return mapping[unit] || `প্রতি ${unit}`;
}

export function getBanglaDate(): string {
  const days = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
  const months = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  const now = new Date();
  const dayName = days[now.getDay()];
  const dateNum = toBengaliNumber(now.getDate());
  const monthName = months[now.getMonth()];
  const yearNum = toBengaliNumber(now.getFullYear());

  return `${dayName}, ${dateNum} ${monthName}, ${yearNum}`;
}