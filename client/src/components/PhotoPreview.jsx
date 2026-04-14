import React from 'react';

const PhotoPreview = ({ previewUrl, onRemove, className = "" }) => {
  if (!previewUrl) return null;

  return (
    <div className={`relative mt-3 w-full sm:w-64 rounded-2xl overflow-hidden border border-[#CBD5E1] ${className}`}>
      <img
        src={previewUrl}
        alt="Selected upload preview"
        className="w-full h-40 object-cover"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 bg-black/70 text-white rounded-full px-3 py-1 text-xs hover:bg-black/90 transition-colors"
      >
        Remove
      </button>
    </div>
  );
};

export default PhotoPreview;