"use client";

import { useState, useEffect } from "react";
import { MdDelete } from 'react-icons/md';

const AdminMessage = () => {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [newMessage, setNewMessage] = useState({ title: "", content: "" });
  const [editingMessage, setEditingMessage] = useState(null); // Track message being edited

  // Fetch messages from the server with pagination
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/adminmessage?page=${currentPage}`);
        const data = await response.json();
        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
          setTotalPages(Math.ceil(data.totalMessages / itemsPerPage));
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.title || !newMessage.content) {
      alert("Please fill out both title and content.");
      return;
    }

    try {
      const response = await fetch("/api/adminmessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newMessage.title, content: newMessage.content }),
      });

      if (response.ok) {
        const addedMessage = await response.json();

        // Update the messages state to add the new message at the beginning
        setMessages((prevMessages) => [addedMessage, ...prevMessages]);

        setNewMessage({ title: "", content: "" });
        setCurrentPage(1); // Go back to the first page after adding a new message
      } else {
        console.error("Failed to add message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Handle editing a message
  const handleEdit = (message: any) => {
    setEditingMessage(message); // Set the message being edited
    setNewMessage({ title: message.m_title, content: message.m_content }); // Pre-fill form with message data
  };

  // Handle updating the message
  const handleUpdateMessage = async (id: number) => {
    if (!newMessage.title || !newMessage.content) {
      alert("Please fill out both title and content.");
      return;
    }

    try {
      const response = await fetch(`/api/adminmessage/${editingMessage.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newMessage.title, content: newMessage.content }),
      });

      if (response.ok) {
        const updatedMessage = await response.json();
        console.log("TTTTTTTT: ", updatedMessage);
        setMessages((prevMessages) => prevMessages.map((msg: any) => msg.id === updatedMessage.id ? updatedMessage : msg)
        );
        setEditingMessage(null);
        setNewMessage({ title: "", content: "" });
        setCurrentPage(1);
      } else {
        console.error("Failed to update message");
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  // Handle removing a message
  const handleRemove = async (id: number) => {
    try {
      const response = await fetch(`/api/adminmessage/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== id)
        );
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error removing message:", error);
    }
  };

  return (
    <div className="flex h-screen p-4 bg-gray-100 space-x-4">
      {/* Left Half - Message Editor */}
      <div className="w-1/2 p-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">New Message</h2>

        <div className="mb-4">
          <label className="block mb-1">Title:</label>
          <input
            type="text"
            value={newMessage.title}
            onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Content:</label>
          <textarea
            style={{resize: 'none'}}
            value={newMessage.content}
            onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
            className="w-full h-40 p-2 border border-gray-300 rounded"
          />
          <button
            onClick={editingMessage ? handleUpdateMessage : handleSendMessage}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editingMessage ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
              : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            }
          </button>
        </div>


      </div>

      {/* Right Half - Message List Table */}
      <div className="w-1/2 p-4 bg-white rounded shadow-md overflow-auto">
        <h2 className="text-2xl font-bold text-center mb-4">Message List</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">&#8470;</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Content</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message: any, index) => (
              <tr key={message.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 text-center">{index + 1 + (currentPage - 1) * itemsPerPage} {/* Calculate sequential number */}</td>
                <td className="px-4 py-2 text-center">{message.m_title}</td>
                <td className="px-4 py-2 text-center">{message.m_content}</td>
                <td className="px-4 py-2 text-center">{new Date(message.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(message)}
                    className="text-yellow-500 hover:text-yellow-600 mr-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>

                  </button>
                  <button
                    onClick={() => handleRemove(message.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <MdDelete size={24} /> {/* Icon for delete */}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`mx-1 px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
                }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMessage;
