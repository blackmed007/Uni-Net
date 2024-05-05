import React from 'react';

const Features = () => {
  return (
    <section className="bg-gray-800 py-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-gray-900 text-white rounded-lg p-6 flex flex-col items-center animate-fade-in animate-delay-100">
          <div className="bg-green-600 p-4 rounded-full mb-4">
            <i className="fas fa-book fa-lg"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Find Study Groups</h3>
          <p className="text-center text-gray-400">
            Join academic discussions and study sessions with peers.
          </p>
        </div>
        <div className="bg-gray-900 text-white rounded-lg p-6 flex flex-col items-center animate-fade-in animate-delay-200">
          <div className="bg-yellow-600 p-4 rounded-full mb-4">
            <i className="fas fa-calendar-alt fa-lg"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Upcoming Events</h3>
          <p className="text-center text-gray-400">
            Stay updated on the latest campus events and activities.
          </p>
        </div>
        <div className="bg-gray-900 text-white rounded-lg p-6 flex flex-col items-center animate-fade-in animate-delay-300">
          <div className="bg-red-600 p-4 rounded-full mb-4">
            <i className="fas fa-user-friends fa-lg"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Alumni Networking</h3>
          <p className="text-center text-gray-400">
            Connect with graduates for career advice and opportunities.
          </p>
        </div>
        <div className="bg-gray-900 text-white rounded-lg p-6 flex flex-col items-center animate-fade-in animate-delay-400">
          <div className="bg-blue-600 p-4 rounded-full mb-4">
            <i className="fas fa-globe fa-lg"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Global Exchange</h3>
          <p className="text-center text-gray-400">
            Explore international student exchange programs.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;