import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const Hero = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      navigate('/login');
    } else if (user.role === 'student') {
      navigate('/dashboard/user');
    } else if (user.role === 'admin') {
      navigate('/dashboard/admin');
    } else {
      navigate('/login'); // fallback if role is unknown
    }
  };

  return (
    <section
      className="flex flex-col items-center justify-between bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-gradient.png')] bg-cover bg-center h-[785px] px-4 sm:px-8 lg:px-24 text-center text-[#0f172a]"
    >
      {/* Hero Content */}
      <div className="flex flex-col items-center justify-center w-full mt-48">
        <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] drop-shadow-sm">
          File Complaints. Get Resolutions.
        </h1>
        <p className="text-base mt-6 max-w-xl text-[#1e293b] font-medium">
          A modern complaint resolution portal for students and administrators to track, manage, and resolve issues efficiently.
        </p>

        {/* Complaint Input Box */}
        <div className="max-w-xl w-full bg-white/90 border border-gray-300 rounded-xl overflow-hidden mt-6 shadow-lg">
          <textarea
            className="w-full p-4 resize-none outline-none bg-transparent text-[#0f172a] placeholder:text-gray-600"
            placeholder="Describe your campus issue here..."
            rows={3}
          />
          <div className="flex items-center justify-between px-4 pb-3">
            <button className="flex items-center justify-center bg-[#e2e8f0] hover:bg-[#cbd5e1] p-2 rounded-full text-[#0f172a] transition">
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

        {/* Prompt Suggestions */}
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
