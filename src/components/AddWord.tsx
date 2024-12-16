import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import ToggleSwitch from "@/components/ToggleSwitch";
import { FaSearch } from "react-icons/fa";
interface BannedWord {
    id: number;
    text: string;
    time: string;
    banned_state: boolean;
}

const AddWord = () => {
    const [bannedWords, setBannedWords] = useState<{ text: string; time: string }[]>([]);
    const [newWord, setNewWord] = useState<string>("");
    // Words List Enabled/Disabled    
    const [showAllWords, setShowAllWords] = useState<boolean>(false); // State for switch button
    // Toggle state for disabling elements
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    //--PageNation
    const [currentPage, setCurrentPage] = useState<number>(1);
    const wordsPerPage = 7; // Max words per page  

    //Search Bar
    const [searchQuery, setSearchQuery] = useState<string>('');

    const filteredWords = bannedWords.filter(bannedword => {
        const searchLower = searchQuery.toLowerCase();
        return (
            bannedword.text.toLowerCase().includes(searchLower)
        );
    });


    // Fetch banned words on initial load and after adding a new word
    const fetchBannedWords = async () => {
        const response = await fetch(`/api/bannedword`);
        if (response.ok) {
            const data = await response.json();
            const formattedData = data.map((word: any) => ({
                id: word.id,
                text: word.word,
                time: formatDate(new Date(word.createdAt)),
                banned_state: word.banned_state,
            }));
            setBannedWords(formattedData);
        } else {
            alert("Failed to load banned words");
        }
    };

    ////////////////////////////
    const handleToggle = async () => {
        const newState = !isDisabled; // Toggle the state
        setIsDisabled(newState); // Update local state

        try {
            // Send the new state to the server
            const response = await fetch(`/api/bannedactive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ban_active: newState }), // Send the new state
            });

            if (!response.ok) {
                throw new Error('Failed to update banned active state');
            }

            // Optionally, handle the response if needed
            const result = await response.json();
            console.log('Updated banned active state:', result);
        } catch (error) {
            console.error('Error updating banned active state:', error);
            // Revert the toggle state if the update fails
            setIsDisabled(!newState);
        }
    };

    useEffect(() => {
        fetchBannedWords();
        fetch(`/api/bannedactive`)
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        setIsDisabled(data[0].ban_active);
                    });
                } else {
                    alert("Failed to load banned words");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleAddWord = async () => {
        if (newWord.trim() !== "") {
            const response = await fetch(`/api/bannedword`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ word: newWord }),
            });

            if (response.ok) {
                setNewWord(""); // Clear the input field
                fetchBannedWords(); // Re-fetch the banned words from the database
            } else {
                alert("Failed to add banned word");
            }
        }
    };

    const handleToggleBan = async (id: number) => {
        const response = await fetch(`/api/bannedword/${id}`, {
            method: "PATCH",
        });

        if (response.ok) {
            fetchBannedWords(); // Re-fetch the banned words to reflect the updated state
        } else {
            alert("Failed to toggle banned state");
        }
    };
    //Remove added banned word
    const handleRemoveWord = async (id: number) => {
        try {
            const response = await fetch(`/api/bannedword/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete banned word");
            }

            // Re-fetch the banned words to update the UI
            await fetchBannedWords();
        } catch (error) {
            console.error(error);
            alert("Failed to delete banned word");
        }
    };

    // Function to format the date as "12/9/2024, 14:45"
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${month}/${day}/${year}, ${hours}:${minutes}`;
    };

    //----------PageNation
    // Calculate the current page's word slice
    const indexOfLastWord = currentPage * wordsPerPage;
    const indexOfFirstWord = indexOfLastWord - wordsPerPage;
    const currentWords = bannedWords.slice(indexOfFirstWord, indexOfLastWord);

    // Total pages
    const totalPages = Math.ceil(bannedWords.length / wordsPerPage);

    //Add a new Banned word 

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">Banned Words</h2>
                {/* Toggle Switch */}
                <ToggleSwitch isToggled={isDisabled} onToggle={handleToggle} />
            </div>

            <div className={`mt-4 ${isDisabled ? "pointer-events-none opacity-50" : ""}`}>
                <div className="mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                            placeholder="Search by banned word"
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 bg-gray-50 focus:ring-gray-500 focus:border-gray-500 dark:bg-[#1F1F1F] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-x-gray-500"
                        />
                    {/* <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>        */}
                </div>
            </div>
            {/* Input Section */}
            <div className="mt-4 flex items-center space-x-2">
                <input
                    type="text"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="Enter a banned word"
                    className="p-2 border border-gray-300 flex-1"
                />
                <button
                    onClick={handleAddWord}
                    className="p-2 bg-blue-500 text-white hover:bg-blue-600 w-24"
                >
                    Add
                </button>
            </div>

                {/* Display Added Words */}
                <div className="mt-6">
                    {/* <h3 className="text-xl font-semibold mb-2">Added Banned Words</h3> */}
                    {filteredWords.length > 0 ? (
                        <ul className="space-y-4">
                            {filteredWords.map((word: any) => (
                                <li key={word.id} className="p-2 bg-gray-100 flex justify-between items-center">
                                    <div>
                                        <p className="text-lg font-bold">{word.text}</p>
                                        <p className="text-sm text-gray-500">{word.time}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleToggleBan(word.id)}
                                            className={`p-2 text-white ${word.banned_state ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:blue-600"}`}
                                        >
                                            {word.banned_state ? "Banned" : "Ban"}
                                        </button>
                                        <button
                                            onClick={() => handleRemoveWord(word.id)}
                                            className="p-2 bg-red-500 text-white hover:bg-red-600"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="font-bold text-red-500">No banned words added yet.</p>
                    )}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-between items-center">
                    {/* First and Previous Buttons */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Page Number */}
                    <span className="text-lg font-semibold">
                        {currentPage}
                    </span>

                    {/* Next and Last Buttons */}
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200"
                        >
                            <ArrowRightIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:bg-gray-200"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default AddWord;
