import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center text-center">
        {/* Logo and Brand */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-6">
          <img
            src={assets.logo}
            alt="CampusFix Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
          />
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">Campus Fix</h2>
        </div>

        {/* Description */}
        <p className="max-w-2xl text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
          A smart and efficient complaint resolution platform for students and administrators.
          Raise, track, and resolve issues — all in one place.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-[#334155]" />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs sm:text-sm text-gray-400">
        © {new Date().getFullYear()} CampusFix. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
