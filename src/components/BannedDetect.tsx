"use client";
import { useEffect, useState } from 'react';

const BannedNotifications = () => {
  const [bannedBehaviors, setBannedBehaviors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${month}/${day}/${year}, ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchBannedBehaviors = async () => {
      try {
        const response = await fetch('/api/bannedbehaviors'); // Adjust the API endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch banned behaviors');
        }
        const data = await response.json();
        setBannedBehaviors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBannedBehaviors();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Banned Word Notifications</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="px-4 py-2 text-center">&#8470;</th>
              <th className="px-4 py-2 text-center">Sender/Poster</th>
              <th className="px-4 py-2 text-center">Receiver</th>
              <th className="px-4 py-2 text-center">Type</th>
              <th className="px-4 py-2 text-center">Banned Word</th>
              <th className="px-4 py-2 text-center">Content</th>
              <th className="px-4 py-2 text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {bannedBehaviors.map((behavior, index) => (
              <tr key={behavior.id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2 text-center">{behavior.senderId}</td>
                <td className="px-4 py-2 text-center">{behavior.receiverId}</td>
                <td
                  className={`px-4 py-2 text-center ${behavior.bannedtype === "MSG" ? "text-red-500" : "text-blue-500"
                    }`}
                >
                  {behavior.bannedtype === 'MSG' ?
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg> : 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>}
                </td>
                <td className="px-4 py-2 text-center">{behavior.bannedword}</td>
                <td className="px-4 py-2 text-center">{behavior.send_content}</td>
                <td className="px-4 py-2 text-center">{formatDate(new Date(behavior.send_time))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannedNotifications;