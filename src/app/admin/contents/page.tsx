
'use client';
import { useState, useEffect } from 'react';
import { MdDelete, MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import MediaModal from '@/components/MediaModal';

interface Post {
    id: string;
    text: string;
    mediaUrl?: string;
    mediaType: string;
    createdAt: string;
    likes: number;
    hashtags: string;
    isPublic: number;
    isChecked: number;
    // user: { // Include user object in Post
    //     name: string;
    // };
}

const Contents = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const postsPerPage = 10;
    //View the Media
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [mediaUrl, setMediaUrl] = useState<string>('');
    const [mediaType, setMediaType] = useState<string>('');
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${month}/${day}/${year}, ${hours}:${minutes}`;
    };

    const fetchPosts = async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/posts?page=${page}&limit=${postsPerPage}`);
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            const data = await response.json();
            console.log("ischecked1:", data);
            const normalizedPosts = data.posts.map((post: Post) => ({
                ...post,
                isChecked: post.isChecked === true ? 1 : 0, // Ensure numeric values
            }));
    
            setPosts(normalizedPosts);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const openModal = (mediaUrl: string, mediaType: string) => {
        setMediaUrl(mediaUrl);
        setMediaType(mediaType);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCheck = async (id: string, isChecked: number) => {
        try {
            const newCheckStatus = isChecked === 0? 1: 0;; // Toggle between 0 and 1
            const response = await fetch(`/api/post/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isChecked: newCheckStatus }), // Send new isChecked value to API
            });
           

            if (!response.ok) {
                throw new Error('Failed to update check status');
            }

            // Update the posts state to reflect the change in check status
            const updatedPosts = posts.map((post) =>
                post.id === id ? { ...post, isChecked: newCheckStatus } : post
            );
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error toggling check status:', error);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            const response = await fetch(`/api/post/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove the post');
            }

            // Remove the post from state
            const updatedPosts = posts.filter((post) => post.id !== id);
            setPosts(updatedPosts);
        } catch (error) {
            console.error('Error removing post:', error);
        }
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">All Posts</h2>
            {posts.length > 0 ? (
                <>
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                {/* <th className="px-4 py-2 border text-center">Name</th> */}
                                <th className="px-4 py-2 border text-center">Text</th>
                                <th className="px-4 py-2 border text-center">Media</th>
                                <th className="px-4 py-2 border text-center">Type</th>
                                <th className="px-4 py-2 border text-center">Public</th>
                                <th className="px-4 py-2 border text-center">Date</th>
                                <th className="px-4 py-2 border text-center">Likes</th>
                                <th className="px-4 py-2 border text-center">Hashtags</th>
                                <th className="px-4 py-2 border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    {/* <td className="px-4 py-2 border text-center align-middle">{post.user.name}</td> */}
                                    <td className="px-4 py-2 border text-center align-middle">{post.text}</td>
                                    <td
                                        className="px-4 py-2 border text-center align-middle cursor-pointer"
                                        onClick={() => post.mediaUrl && openModal(post.mediaUrl, post.mediaType)}
                                    >
                                        {post.mediaUrl ? (
                                            post.mediaUrl.endsWith("mp4") || post.mediaUrl.endsWith("avi") ?
                                                <video
                                                    src={post.mediaUrl}
                                                    className="w-12 h-12 object-cover rounded mx-auto"
                                                /> :
                                                <img
                                                    src={post.mediaUrl}
                                                    alt="Media"
                                                    className="w-12 h-12 object-cover rounded mx-auto"
                                                />
                                        ) : (
                                            'No Media'
                                        )}
                                    </td>
                                    <td className="px-4 py-2 border text-center align-middle">{post.mediaType}</td>
                                    <td className="px-4 py-2 border text-center align-middle">{post.isPublic === 0 ? 'Private' : 'Public'}</td>
                                    <td className="px-4 py-2 border text-center align-middle">
                                        {formatDate(new Date(post.createdAt))}
                                    </td>
                                    <td className="px-4 py-2 border text-center align-middle">{post.likes}</td>
                                    <td className="px-4 py-2 border text-center align-middle">{post.hashtags || 'N/A'}</td>
                                    <td className="px-4 py-2 border text-center align-middle">
                                        <div className="flex justify-center items-center space-x-2">
                                            {/* Check/Uncheck Button */}
                                            <button
                                                onClick={() => handleCheck(post.id, post.isChecked)}
                                                className={`p-2 rounded ${post.isChecked === 0
                                                        ? "bg-green-500 text-white hover:bg-green-600"
                                                        : "bg-gray-500 text-white hover:bg-gray-600"
                                                    }`}
                                            >
                                                {post.isChecked === 0 ? "Check" : "Uncheck"}
                                            </button>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemove(post.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                <MdDelete size={24} /> {/* Icon for delete */}
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-4 space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="px-3 py-1 border rounded">
                            {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="text-gray-500">No posts found.</p>
            )}

            <MediaModal isOpen={isModalOpen} onClose={closeModal} mediaUrl={mediaUrl} mediaType={mediaType} />
        </div>
    );
};

export default Contents;
