'use client'

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("This is a default text.");
  const [textSize, setTextSize] = useState("full");
  const [alignment, setAlignment] = useState("1");
  const [textColor, setTextColor] = useState("#ffffff");
  const [processedImage, setProcessedImage] = useState<string | null>(null); // Allow processedImage to be string or null
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!image) {
      alert("Please upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("texty", text);
    formData.append("text_size", textSize);
    formData.append("alignment", alignment);
    formData.append("text_color", textColor);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/processimage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // Ensures the response is a blob
      });

      // Create a URL for the image blob and set it as the processed image
      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImage(imageUrl); // Now this works without error
    } catch (error) {
      console.error("Error processing the image:", error);
      alert("Error processing the image. Please check your input or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Image Processing Tool</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={textSize}
              onChange={(e) => setTextSize(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="full">Full Size</option>
              <option value="80">80</option>
              <option value="60">60</option>
              <option value="40">40</option>
            </select>
          </div>
          <div>
            <select
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Top Center</option>
              <option value="2">Center</option>
              <option value="3">Bottom Center</option>
              <option value="4">Left Center</option>
              <option value="5">Right Center</option>
            </select>
          </div>
          <div>
            <input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Upload & Process Image"}
          </button>
        </form>

        {processedImage && (
          <div className="mt-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Processed Image:</h2>
            <img src={processedImage} alt="Processed" className="mx-auto max-w-full rounded-lg shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
