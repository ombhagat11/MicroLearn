


import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Dashboard</h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
      <section className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Welcome to your learning dashboard!</h2>
        <p className="mb-6 text-gray-600">
          Here you can track your progress, access personalized content, and continue your micro-learning journey.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/ai" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">AI Chat</Link>
          <Link href="/" className="px-6 py-2 bg-gray-200 text-blue-700 rounded-lg font-semibold shadow hover:bg-gray-300 transition">Home</Link>
        </div>
      </section>
    </main>
  );
}
