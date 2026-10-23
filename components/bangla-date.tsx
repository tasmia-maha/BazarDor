"use client";

import { useState } from "react";
import { getBanglaDate } from "@/app/lib/utils";

export default function BanglaDate() {
  const [date] = useState(() => getBanglaDate());
  return <span>{date}</span>;
}