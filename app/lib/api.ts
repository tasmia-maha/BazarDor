
import type { Product } from "@/types/products";

const apiBaseUrl =
  "https://api.api-store.workers.dev/api/bazardor";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${apiBaseUrl}/products`);

  if (!response.ok) {
    throw new Error(`Products fetch failed: ${response.status}`);
  }

  const result = await response.json();

  console.log("API Response:", result);

  return result.data;
}

