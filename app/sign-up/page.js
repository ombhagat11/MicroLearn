
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">Create Your MicroLearn Account</h1>
        <SignUp
          appearance={{
            elements: {
              card: "shadow-none rounded-none border-none",
            },
          }}
        />
      </div>
    </main>
  );
}
