
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-base-100 px-4 text-center">
      <h1 className="text-8xl font-bold text-primary">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">
        Page Not Found
      </h2>

      <p className="mt-2 text-base-content/70">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link href="/" className="btn btn-primary mt-6">
        Back to Home
      </Link>
    </main>
  );
}
