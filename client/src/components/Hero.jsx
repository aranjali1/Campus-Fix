import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Hero = () => {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const handleSubmit = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Save draft complaint data
    localStorage.setItem(
      "draftComplaint",
      JSON.stringify({
        description: text
      })
    );

    // Save images separately (cannot store File objects in localStorage)
    window.uploadBuffer = photos;

    if (!token || !user) {
      navigate('/login');
    } else {
      navigate('/submit');
    }
  };

  const handleImageSelect = (event) => {
    setPhotos([...event.target.files]);
  };

  return (
    <section
      className="flex flex-col items-center justify-between bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-gradient.png')] bg-cover bg-center h-[785px] px-4 sm:px-8 lg:px-24 text-center text-[#0f172a]"
    >
      <div className="flex flex-col items-center justify-center w-full mt-48">
        <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] drop-shadow-sm">
          File Complaints. Get Resolutions.
        </h1>

        <p className="text-base mt-6 max-w-xl text-[#1e293b] font-medium">
          A modern complaint resolution portal for students and administrators to track, manage, and resolve issues efficiently.
        </p>

        <div className="max-w-xl w-full bg-white/90 border border-gray-300 rounded-xl overflow-hidden mt-6 shadow-lg">
          <textarea
            className="w-full p-4 resize-none outline-none bg-transparent text-[#0f172a] placeholder:text-gray-600"
            placeholder="Describe your campus issue here..."
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Hidden File Input */}
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageSelect}
            className="hidden"
          />

          <div className="flex items-center justify-between px-4 pb-3">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center justify-center bg-[#e2e8f0] hover:bg-[#cbd5e1] p-2 rounded-full text-[#0f172a] transition"
            >
              +
            </button>

            <button
              onClick={handleSubmit}
              className="flex items-center cursor-pointer justify-center px-4 py-2 bg-[#0f172a] text-white rounded-full hover:bg-[#1e293b] transition"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 text-sm text-[#334155] max-w-3xl">
          <p className="cursor-pointer hover:underline">Trash not cleaned near Main Gate</p>
          <p className="cursor-pointer hover:underline">Broken benches outside CSE Department</p>
          <p className="cursor-pointer hover:underline">No lights working in Library reading room</p>
          <p className="cursor-pointer hover:underline">Leaking tap near Admin Block entrance</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
