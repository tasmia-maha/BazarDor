import CategoryContent from "./app/category/[slug]/category-content";

// Build er somoyi sob category page pre-build hoy — eta optional kintu faster
export async function generateStaticParams() {
  try {
    const res = await fetch("https://api.api-store.workers.dev/api/bazador/categories");
    const categories = await res.json();
    return categories.map((c: { slug: string }) => ({ slug: c.slug }));
  } catch {
    return []; // API down thakle build fail hobe na
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryContent slug={slug} />;
}