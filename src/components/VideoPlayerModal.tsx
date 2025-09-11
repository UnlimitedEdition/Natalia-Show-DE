import React, { useEffect } from 'react';

interface VideoPlayerModalProps {
  videoUrl: string;
  videoTitle: string;
  videoDescription: string;
  onClose: () => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ 
  videoUrl, 
  videoTitle, 
  videoDescription, 
  onClose 
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle click outside modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">{videoTitle}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
            aria-label="Zatvori"
          >
            &times;
          </button>
        </div>
        
        <div className="p-4">
          <div className="aspect-video mb-4">
            <iframe
              src={videoUrl}
              className="w-full h-full"
              title={videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {videoDescription && (
            <div className="text-gray-300 mb-4 whitespace-pre-wrap">
              {videoDescription}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
            >
              Zatvori
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;