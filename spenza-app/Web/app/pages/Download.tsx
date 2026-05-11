import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { DollarSign, Download as DownloadIcon, Smartphone, Monitor, CheckCircle2, Apple } from "lucide-react";

export function Download() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Spenza
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-slate-300 hover:text-white transition-colors">Features</Link>
            <Link to="/download" className="text-white font-medium">Download</Link>
            <Link to="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
          </div>

          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              Sign In
            </motion.button>
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Take Spenza <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Everywhere you go
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Download our mobile apps or desktop client to seamlessly sync your financial data across all your devices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* iOS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col items-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
              <Apple className="w-16 h-16 text-slate-300 mb-6" />
              <h3 className="text-2xl font-bold mb-2">iOS App</h3>
              <p className="text-slate-400 mb-8 text-center">Requires iOS 14.0 or later. Perfect for iPhone and iPad.</p>
              <button className="mt-auto w-full py-3 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                <DownloadIcon className="w-5 h-5" /> Download on App Store
              </button>
            </motion.div>

            {/* Android */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col items-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl" />
              <Smartphone className="w-16 h-16 text-slate-300 mb-6" />
              <h3 className="text-2xl font-bold mb-2">Android App</h3>
              <p className="text-slate-400 mb-8 text-center">Requires Android 8.0 or later. Optimized for all screens.</p>
              <button className="mt-auto w-full py-3 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                <DownloadIcon className="w-5 h-5" /> Get it on Google Play
              </button>
            </motion.div>

            {/* Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 flex flex-col items-center relative overflow-hidden"
            >
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
              <Monitor className="w-16 h-16 text-slate-300 mb-6" />
              <h3 className="text-2xl font-bold mb-2">Desktop Client</h3>
              <p className="text-slate-400 mb-8 text-center">Available for macOS, Windows, and Linux. Full power.</p>
              <button className="mt-auto w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <DownloadIcon className="w-5 h-5" /> Download for Mac
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Web App CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 md:p-16 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-4">Don't want to install anything?</h2>
            <p className="text-slate-400 mb-6 max-w-md">
              Spenza is fully available as a powerful web application. You can use it from any browser without downloading a single byte.
            </p>
            <ul className="space-y-3 mb-8">
              {['Always up to date', 'Works on any device', 'Instant access'].map(feature => (
                <li key={feature} className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-400" /> {feature}
                </li>
              ))}
            </ul>
          </div>
          <Link to="/login" className="shrink-0 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg"
            >
              Open Web App
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}