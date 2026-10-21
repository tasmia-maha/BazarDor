import type { Product } from "@/types/products"
const apiBaseUrl="https://openapi.programming-hero.com/api/bazardor/products"
export async function getProducts():Promise<Product[]> {
    const response=await fetch(
        `${apiBaseUrl}/products`
    )
    if(!response.ok){
        throw new Error(`Products fetch failed:${response.status}`)
    }
    const result=await response.json()
    return result.data
}