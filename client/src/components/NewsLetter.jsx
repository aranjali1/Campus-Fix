import React from 'react'

const Newsletter = () => {
  return (
    <section className="w-full my-8 mx-auto rounded-3xl bg-[#0f172a] text-white py-16 px-4">
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center px-4">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold">Stay Updated</h2>
        <p className="text-gray-300 mt-3 text-sm md:text-base max-w-xl">
          Subscribe to our newsletter and never miss an important CampusFix update or feature release.
        </p>

        {/* Form */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-white/30 transition"
          />
          <button className="bg-white text-[#0f172a] px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition active:scale-95">
            Subscribe
          </button>
        </div>

        {/* Consent text */}
        <p className="text-xs text-gray-400 mt-5">
          By subscribing, you agree to our <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </section>
  )
}

export default Newsletter
