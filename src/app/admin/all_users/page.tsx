
'use client';
import { useEffect, useState } from 'react';
import { IoClose } from "react-icons/io5";
interface User {
    id: number;
    email: string;
    name: string;
    image: string;
    age: number;
    profile: string;
    days: number;
    message: string[];
    isBlocked: boolean;
}

interface Post {
    id: string;
    text: string;
    mediaUrl?: string;
    mediaType: string;
    createdAt: string;
    likes: number;
    hashtags: string;
    isPublic: number;

}

interface Message {
    id: number;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
    sender: { name: string };
    receiver: { name: string };

}

const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    //Profile
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    //Posts
    const [showDialog, setShowDialog] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    //Block
    const [blockingUserId, setBlockingUserId] = useState<number | null>(null);
    //Messsage
    const [messages, setMessages] = useState<Message[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    //Search Bar
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Store IP of logged-in user
    const [trackedIp, setTrackedIp] = useState<{ [key: number]: string }>({});

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${month}/${day}/${year}, ${hours}:${minutes}`;
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data = await response.json();
                setUsers(data);
                await fetchIpAddresses(data); // Fetch IP addresses after users are loaded
            } catch (err) {
                setError('Failed to load users');
            } finally {
                setLoading(false);
            }
        };

        const fetchIpAddresses = async (users: User[]) => {
            const ipPromises = users.map(async (user) => {
                try {
                    const response = await fetch(`https://api.ipify.org?format=json`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data: { ip: string } = await response.json();
                    return { id: user.id, ip: data.ip };
                } catch (error) {
                    console.error('Error fetching IP address:', error);
                    return { id: user.id, ip: 'No Login' }; // Return 'No Login' on error
                }
            });

            const ipResults = await Promise.all(ipPromises);
            const ipMap = ipResults.reduce((acc, { id, ip }) => {
                acc[id] = ip;
                return acc;
            }, {} as { [key: number]: string });

            setTrackedIp(ipMap);
        };

        fetchUsers();
    }, []);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;


    const handleProfileClick = (user: User) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedUser(null);
    };

    const closePostDialog = () => {
        setShowDialog(false);
        setPosts([]);
        setSelectedUserId(null);
        setSelectedUser(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setMessages([]);
    };

    const fetchUserPosts = async (user: User) => {
        setSelectedUser(user);
        try {
            const response = await fetch(`/api/posts/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
                //setSelectedUserId(data);
                setShowDialog(true);
            } else {
                console.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleShowMessages = async (user: User) => {
        setSelectedUser(user);
        try {
            const response = await fetch(`/api/messages/${user.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
            const data = await response.json();
            setMessages(data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDaysChange = (userId: number, value: string) => {
        const parsedValue = parseInt(value);

        // Ensure the value is an integer greater than 0
        if (parsedValue > 0) {
            setUsers(users.map(user =>
                user.id === userId ? { ...user, days: parsedValue } : user
            ));
        } else {
            // Optionally handle the case where the value is invalid
            console.error('Please enter a number greater than 0');
        }
    };

    const handleBlockToggle = async (userId: number) => {
        try {
            const user = users.find((user) => user.id === userId);
            if (!user) return;

            // Determine new values for isBlocked and days
            const newIsBlocked = !user.isBlocked;
            const newDays = newIsBlocked ? user.days : "";

            // Send a PATCH request to update isBlocked and possibly clear days in the database
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, isBlocked: newIsBlocked, days: newDays }),
            });

            if (!response.ok) {
                throw new Error('Failed to update block status');
            }

            // Update the local state
            setUsers(
                users.map((u: any) =>
                    u.id === userId
                        ? { ...u, isBlocked: newIsBlocked, days: newDays }
                        : u
                )
            );
        } catch (error) {
            console.error(error);
            alert('Failed to update block status');
        }
    };



    const handleRemoveUser = async (userId: number) => {
        try {
            // Send request to remove the user (replace with actual API endpoint)
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',  // Or use the appropriate method (e.g., POST, PUT)
            });

            if (response.ok) {
                // Remove the user from the local state after successful deletion
                setUsers(users.filter(user => user.id !== userId));
            } else {
                console.error("Failed to remove user");
            }
        } catch (error) {
            console.error("Error removing user", error);
        }
    };
    const filteredUsers = users.filter(user => {
        const searchLower = searchQuery.toLowerCase();
        return (
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        );
    });

    // const handleTrackIp = async (userId: number) => {
    //     try {
    //        const response = await fetch('https://api.ipify.org?format=json');
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch IP");
    //         }
    //         const data = await response.json();
    //         setTrackedIp(data.ip); // Store fetched IP
    //         alert(`Your IP Address: ${data.ip}`);
    //     } catch (error) {
    //         console.error("Error tracking IP:", error);
    //         alert("Failed to fetch IP");
    //     }
    // };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                {/* Centered H1 */}
                <h1 className="text-3xl font-bold flex-1 text-center">All Users Details...</h1>

                {/* Search Bar */}
                <div className="ml-4" style={{ maxWidth: '15em' }}>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg
                                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="name or email..."
                            className="border border-gray-300 p-2 pl-10 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>
                </div>

            </div>


            {/* Add an IP Track button */}
            {/* <div className="mb-4">
                <button
                    onClick={handleTrackIp}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Track My IP
                </button>
                {trackedIp && <p>Your IP Address: {trackedIp}</p>}
            </div> */}
            <div className="w-full overflow-x-auto bg-white p-4 rounded-lg shadow-md">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600" >
                            <th className="px-4 py-2 text-center">&#8470;</th>
                            <th className="px-4 py-2 text-center">Name</th>
                            <th className="px-4 py-2 text-center">Email</th>
                            <th className="px-4 py-2 text-center">Age</th>
                            <th className="px-4 py-2 text-center">Profile</th>
                            <th className="px-4 py-2 text-center">Content</th>
                            <th className="px-4 py-2 text-center">Message</th>
                            <th className="px-4 py-2 text-center">Finance</th>
                            <th className="px-4 py-2 text-center">IP</th>
                            <th className="px-4 py-2 text-center">Day</th>
                            <th className="px-4 py-2 text-center">Block</th>
                            <th className="px-4 py-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user, index) => (
                                <tr key={user.id} className="border-t hover:bg-gray-100" style={{ textAlign: 'center' }}>
                                    <td className="px-4 py-2" >{index + 1}</td>
                                    <td className="px-4 py-2" >{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.age}</td>
                                    <td className="border-gray-300 px-4 py-2">
                                        <button
                                            onClick={() => handleProfileClick(user)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            details...
                                        </button>
                                    </td>
                                    <td className="border-gray-300 px-4 py-2">
                                        <button
                                            onClick={() => fetchUserPosts(user)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            details...
                                        </button>
                                    </td>
                                    <td className="border-gray-300 px-4 py-2">
                                        <button
                                            onClick={() => handleShowMessages(user)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            details...
                                        </button>
                                    </td>
                                    <td className="px-4 py-2">Finance</td>
                                    {/* <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleTrackIp(user.id)}
                                            className="text-blue-500 hover:underline"
                                        >
                                            View...
                                        </button>
                                        {trackedIp[user.id] && (
                                            <p className="text-gray-600 mt-2">{trackedIp[user.id]}</p>
                                        )}
                                    </td> */}
                                    <td className="px-4 py-2">
                                        {trackedIp[user.id] || 'No Login'}
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={user.days || ''}
                                            onChange={(e) => handleDaysChange(user.id, e.target.value)}
                                            className="w-20 p-2 border border-gray-300"
                                            placeholder="day"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleBlockToggle(user.id)}
                                            disabled={!user.days || user.days <= 0 || user.days > 100} // Button enabled when days > 0
                                            className={`px-4 py-2 rounded-md text-white ${user.isBlocked ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-blue-600'
                                                } ${(!user.days || user.days <= 0) && 'opacity-50 cursor-not-allowed'}`} // Style for disabled state
                                        >
                                            {user.isBlocked ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                                    <path
                                                        fill="currentColor"
                                                        fillRule="evenodd"
                                                        d="M13.477 14.89A6 6 0 0 1 5.11 6.524zm1.414-1.414L6.524 5.11a6 6 0 0 1 8.367 8.367M18 10a8 8 0 1 1-16 0a8 8 0 0 1 16 0"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                                    <path
                                                        fill="currentColor"
                                                        fillRule="evenodd"
                                                        d="M13.477 14.89A6 6 0 0 1 5.11 6.524zm1.414-1.414L6.524 5.11a6 6 0 0 1 8.367 8.367M18 10a8 8 0 1 1-16 0a8 8 0 0 1 16 0"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleRemoveUser(user.id)}
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 
                                                2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 
                                                1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 
                                                2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={11} className="px-4 py-2 text-center font-bold text-red-800">
                                    No users found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Profile Dialog */}
                {isDialogOpen && selectedUser && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-md shadow-md relative" style={{ width: '337px', height: '600px' }}>
                            {/* Close Icon Button */}
                            <button
                                onClick={closeDialog}
                                className="absolute top-2 right-2 text-gray-600 hover:text-red-600 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                            <h3 className="text-xl font-bold mb-4 text-center">Profile</h3>
                            {/* <p className="mb-4"> */}
                            <div className="image-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                <img id="image" src={selectedUser.image} style={{ width: '120px', height: '120px', borderRadius: '50%', border: '1px solid green' }} />
                            </div>
                            {/* </p> */}
                            <p className="mb-4">
                                <strong>Name:</strong> {selectedUser.name}
                            </p>
                            <p className="mb-4">
                                <strong>Email:</strong> {selectedUser.email}
                            </p>
                            <p className="mb-4">
                                <strong>Age:</strong> {selectedUser.age}
                            </p>
                        </div>
                    </div>
                )}
            </div>


            {/*Posts Dialog */}
            {
                showDialog && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="relative bg-white p-6 rounded-md w-3/4 max-h-[80vh] overflow-y-auto" style={{ width: '900px', height: '506px' }}>
                            {/* Close Icon Button */}
                            <button
                                onClick={closePostDialog}
                                className="absolute top-3 right-3 text-gray-600 hover:text-red-600 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            {/* Modal Content */}
                            <h2 className="text-2xl font-bold mb-4 text-center">
                                Posts for {selectedUser.name}
                            </h2>
                            {posts.length > 0 ? (
                                <table className="min-w-full bg-white border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="px-4 py-2 border text-center">Text</th>
                                            <th className="px-4 py-2 border text-center">Media</th>
                                            <th className="px-4 py-2 border text-center">Type</th>
                                            <th className="px-4 py-2 border text-center">Public</th>
                                            <th className="px-4 py-2 border text-center">Created At</th>
                                            <th className="px-4 py-2 border text-center">Likes</th>
                                            <th className="px-4 py-2 border text-center">Hashtags</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {posts.map((post) => (
                                            <tr key={post.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 border text-center align-middle">
                                                    {post.text}
                                                </td>
                                                <td className="px-4 py-2 border text-center align-middle">
                                                    {post.mediaUrl ? (
                                                        <img
                                                            src={post.mediaUrl}
                                                            alt="Media"
                                                            className="w-12 h-12 object-cover rounded mx-auto"
                                                        />
                                                    ) : (
                                                        'No Media'
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 border text-center align-middle">
                                                    {post.mediaType}
                                                </td>
                                                <td className="px-4 py-2 border text-center align-middle">
                                                    {post.isPublic === 0 ? 'Private' : 'Public'}
                                                </td>
                                                <td className="px-4 py-2 border text-center align-middle">
                                                    {formatDate(new Date(post.createdAt))}
                                                </td>
                                                <td className="px-4 py-2 border text-center align-middle">
                                                    {post.likes}
                                                </td>
                                                <td className="px-4 py-2 border text-center align-middle">
                                                    {post.hashtags || 'N/A'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No posts found for this user.</p>
                            )}
                        </div>
                    </div>

                )
            }


            {/* Messages Dialog */}
            {
                isModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-md shadow-md max-w-lg w-full relative" style={{ width: '900px', height: '506px' }}>
                            {/* Close Icon Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 focus:outline-none"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>

                            <h3 className="text-xl font-bold mb-4" style={{ textAlign: 'center' }}>
                                Messages for {selectedUser.name}
                            </h3>
                            <div className="max-h-64 overflow-y-auto">
                                {messages.length > 0 ? (
                                    messages.map((message) => (
                                        <div key={message.id} className="border-b py-2">
                                            <p className="text-gray-700">
                                                <strong>
                                                    {message.sender.name} ➔ {message.receiver.name}:
                                                </strong>{' '}
                                                {message.content}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(message.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No messages found.</p>
                                )}
                            </div>
                            {/* <div className="flex justify-center items-center">
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                >
                                    Close
                                </button>
                            </div> */}
                        </div>
                    </div>

                )
            }
        </div >
    );
};

export default UsersPage;