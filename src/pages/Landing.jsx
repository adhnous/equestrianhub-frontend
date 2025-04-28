// 📄 Landing.jsx – Full, Updated, Beautiful Version
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-600 rounded-full mix-blend-screen blur-3xl animate-float-delayed"></div>
      </div>

      <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 max-w-6xl w-full text-center border border-white/10 overflow-hidden">
        {/* Glow Border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-white/5 pointer-events-none"></div>

        {/* App Name */}
        <h1 className="text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            {t('landing.appName')}
          </span> 🐎
        </h1>


       {/* 🏛 Project Information Section */}
<div className="mb-16 flex justify-center">
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 text-purple-100 text-xl w-full max-w-2xl text-center space-y-6">
    <div className="font-bold text-2xl text-purple-300">
      {t('landing.collegeName')}
    </div>
    <div className="text-lg">
      {t('landing.departmentName')}
    </div>
    <div className="text-lg">
      {t('landing.students')}:
    
        <h1>آلاء صالح سالم شامخ - 2191809943</h1>
        <h1>نهال محمد المبروك الجبير - 2191807474</h1>
    </div>
  </div>
</div>

        {/* 🚀 Call to Action Button */}
        <Link to="/login">
          <button className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold px-10 py-4 rounded-xl text-lg transform transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl">
            {t('landing.cta')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </Link>
      </div>
    </div>
  );
}
