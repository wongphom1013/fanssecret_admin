// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// const AdminPage = () => {
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/");
//       return;
//     }

//     const checkAdmin = async () => {
//       try {
//         const response = await fetch("/api/auth/verify-admin", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) {
//           router.push("/login");
//         }
//       } catch {
//         router.push("/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAdmin();
//   }, [router]);

//   if (loading) return <p>Loading...</p>;

//   return <h1>Welcome to the Admin Dashboard</h1>;
// };

// export default AdminPage;


'use client'
import Link from "next/link";
import { HomeIcon, UsersIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Header from "@/components/Header";
import UsersPage from "./all_users/page";
import BannedWord from "./bannedword/page";
import Contents from "./contents/page";
import AdminMessage from "./adminmessage/page";

const AdminPage = () => {
  const [activePage, setActivePage] = useState<string>("users");
  const navItems = [
    {
      id: "contents",
      label: "Content",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
          />
        </svg>
      ),
    },
    {
      id: "message",
      label: "Message",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
      ),
    },
    {
      id: "bannedword",
      label: "Banned Word",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="w-6 h-6"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      ),
    },
    {
      id: "users",
      label: "User View",
      icon: <UsersIcon className="w-6 h-6" />,
    },
  ]
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />
      {/* Sidebar */}
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 text-white">
          <div className="flex flex-row items-center p-5 text-2xl font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Admin Panel
          </div>
          <nav className="flex flex-col p-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center mb-2 p-2 rounded ${activePage === item.id ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-8">
          {/* {activePage === "dashboard" && (
          <div>
            <h1 className="text-3xl font-bold mb-4">Welcome to the Admin Panel</h1>
            <p className="text-gray-600">
              This is your central hub for managing the application.
            </p>
          </div>
        )} */}
          {activePage === "contents" && (
            <div>
              {/* <h1 className="text-3xl font-bold mb-4">Content</h1> */}
              <Contents />
            </div>
          )}
          {activePage === "bannedword" && (
            <div>
              {/* <h1 className="text-3xl font-bold mb-4">Banned Word</h1> */}
              <BannedWord />
            </div>
          )}
          {activePage === "message" && (
            <div>
              {/* <h1 className="text-3xl font-bold mb-4">Message</h1> */}
              <AdminMessage />
            </div>
          )}
          {activePage === "users" && <UsersPage />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
