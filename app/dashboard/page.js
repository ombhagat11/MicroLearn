import { UserButton } from "@clerk/nextjs";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="flex justify-end">
        <UserButton afterSignOutUrl="/auth/sign-in" />
      </div>

      <h1 className="text-2xl font-semibold mt-6">
        Dashboard
      </h1>
    </div>
  );
}
