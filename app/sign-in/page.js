import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SignIn
        appearance={{
          elements: {
            card: "shadow-lg rounded-lg",
          },
        }}
      />
    </div>
  );
}
