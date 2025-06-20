import React from 'react';

const useCases = [
  {
    title: 'High School Students',
    description: 'Discover your dream university',
    image: 'https://images.pexels.com/photos/1462630/pexels-photo-1462630.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-blue-500 to-purple-600'
  },
  {
    title: 'Transfer Students',
    description: 'Find the perfect fit for your next step',
    image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    title: 'Graduate Students',
    description: 'Advance your career with the right program',
    image: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-orange-500 to-red-600'
  },
  {
    title: 'International Students',
    description: 'Navigate studying abroad with confidence',
    image: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-indigo-500 to-blue-600'
  },
  {
    title: 'Parents & Families',
    description: 'Support your student\'s decision',
    image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-pink-500 to-rose-600'
  },
  {
    title: 'Career Changers',
    description: 'Find programs for your new direction',
    image: 'https://images.pexels.com/photos/1181712/pexels-photo-1181712.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-violet-500 to-purple-600'
  }
];

export default function UseCases() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Supporting Every Student Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're just starting out or changing direction, ChalkTalk connects you 
            with the right people and information for your unique path.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {/* Background Image */}
              <div className="aspect-[4/3] relative">
                <img 
                  src={useCase.image} 
                  alt={useCase.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${useCase.color} opacity-80`}></div>
              </div>
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <h3 className="text-xl font-bold mb-2">
                  {useCase.title}
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}