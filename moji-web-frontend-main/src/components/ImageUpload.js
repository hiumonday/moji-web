import React, { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";

const ImageUpload = ({ onFileChange, currentImage }) => {
  const [preview, setPreview] = useState(currentImage);

  useEffect(() => {
    setPreview(currentImage);
  }, [currentImage]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onFileChange(file);
    }
  };

  return (
    <div>
      <div className="border-2 border-dashed rounded-lg p-8 text-center transition-colors border-gray-300 hover:border-gray-400">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <FaUpload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-600">Click to select an image</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        </label>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleChange} accept="image/*" />
      </div>
      {preview && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Image Preview</h4>
          <div className="w-full h-64 border rounded-lg overflow-hidden">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 