"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SigninRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main auth page with signin active
    router.push("/signup");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
}
