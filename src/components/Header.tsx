// components/Header.tsx

"use client";

import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic here, e.g., clearing tokens or session storage
    console.log("User logged out");
    // Redirect to the login page after logout
    router.push("/");
  };

  return (
    <header className="flex justify-between items-center bg-gray-200 shadow-md p-4">
      <h1 className="text-2xl font-bold text-gray-700" style={{fontFamily: 'cursive'}}>FansSecret</h1>
      <button
        onClick={handleLogout}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2" />
        Logout
      </button>
    </header>
  );
};

export default Header;
