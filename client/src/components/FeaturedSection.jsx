import React from 'react'
import { ShieldCheck, Send, Clock } from 'lucide-react' // or any icons you prefer

const features = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-[#0f172a]" />,
    title: 'Secure & Private',
    desc: 'All complaints are safely stored and accessible only to authorized users.',
  },
  {
    icon: <Send className="h-8 w-8 text-[#0f172a]" />,
    title: 'Fast Response',
    desc: 'Admins are instantly notified and can manage complaints from the dashboard.',
  },
  {
    icon: <Clock className="h-8 w-8 text-[#0f172a]" />,
    title: 'Real-time Tracking',
    desc: 'Track the status of your complaint with automatic progress updates.',
  },
]

const FeaturedSection = () => {
  return (
    <section className="bg-white py-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4">
          Why Use CampusFix?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          CampusFix helps students and administrators communicate seamlessly and solve campus issues efficiently.
        </p>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-center justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#0f172a] mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedSection
