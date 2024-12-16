import { FC } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    mediaUrl: string;
    mediaType: string;
}

const MediaModal: FC<ModalProps> = ({ isOpen, onClose, mediaUrl, mediaType }) => {
    if (!isOpen) return null; // Don't render if modal is not open

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-md max-w-lg w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white bg-gray-500 rounded-full p-1"
                    aria-label="Close"
                >
                    ×
                </button>
                <div className="flex justify-center items-center">
                    {mediaType === 'image' ? (
                        <img src={mediaUrl} alt="Media Content" className="max-w-full max-h-[80vh] object-contain" />
                    ) : mediaType === 'video' ? (
                        <video controls className="max-w-full max-h-[80vh]">
                            <source src={mediaUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <p>No media available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MediaModal;
