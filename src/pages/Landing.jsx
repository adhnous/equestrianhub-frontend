import { Link } from 'react-router-dom'

export default function Landing() {
  const sampleTrainees = [
    'Ali Faraj',
    'Salma Hussein',
    'Elias Ben Amar',
    'Aws El Mejri',
    'Siren Fadhnous'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 max-w-4xl text-center border border-white/10 overflow-hidden">
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-3xl border-2 border-white/5 pointer-events-none"></div>
        
        <h1 className="text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            EquestrianHub
          </span>
          🐎
        </h1>
        
        <p className="text-lg text-purple-100/80 mb-8 max-w-2xl mx-auto">
          Revolutionizing equestrian training through innovation, care, and championship development
        </p>

        {/* Hero Image */}
        <div className="relative mb-8 group">
          <img
            src="https://images.unsplash.com/photo-1598819640586-d41d02a5e91b?auto=format&fit=crop&w=1280&q=80"
            alt="Champion Horse"
            className="rounded-2xl w-full h-96 object-cover shadow-2xl transform transition-transform duration-500 group-hover:scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent rounded-2xl"></div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {['🏆 Championship Training', '📈 Progress Tracking', '👨🏫 Expert Coaches'].map((feature) => (
            <div key={feature} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <h3 className="font-semibold text-purple-300">{feature}</h3>
            </div>
          ))}
        </div>

        {/* Trainee Badges */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-purple-300 mb-4">Featured Champions</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {sampleTrainees.map((name, index) => (
              <div
                key={index}
                className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <span className="bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Link to="/login">
          <button className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
            Start Your Journey
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  )
}