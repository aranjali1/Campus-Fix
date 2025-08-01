import React from 'react';


const testimonials = [
  {
    name: 'Tarrak Sharma',
    role: 'Computer Science, 2nd Year',
    text: 'CampusFix made it so easy to report water leakage in our hostel. The response was super fast!',
    img: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=600',
  },
  {
    name: 'Rahul Mehta',
    role: 'Admin - Maintenance Dept.',
    text: 'Tracking and resolving complaints has never been this organized. It really helps us prioritize issues.',
    img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=600',
  },
  {
    name: 'Priya Verma',
    role: 'Electrical Engineering, Final Year',
    text: 'I raised a complaint about classroom lighting and it got resolved in 2 days. Highly recommend!',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=600&h=600&auto=format&fit=crop',
  },
];

const Testimonals = () => {
  return (
    <section className="bg-[#0f172a] text-white py-16 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What People Say About CampusFix</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="max-w-80 bg-white/5 text-white rounded-2xl shadow-md backdrop-blur-md">
            <div className="relative overflow-hidden rounded-t-2xl">
              <img
                src={t.img}
                alt={t.name}
                className="h-[270px] w-full object-cover object-top rounded-t-2xl hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 z-10 h-60 w-full bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
            </div>
            <div className="px-4 pb-4">
              <p className="font-medium border-b border-gray-600 pb-5 italic">“{t.text}”</p>
              <p className="mt-4 font-semibold">— {t.name}</p>
              <p className="text-sm font-medium text-indigo-400">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonals;
