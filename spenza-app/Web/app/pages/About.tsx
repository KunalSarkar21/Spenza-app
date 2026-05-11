import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { DollarSign, Users, Heart, Target, Globe } from "lucide-react";

export function About() {
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
            <Link to="/download" className="text-slate-300 hover:text-white transition-colors">Download</Link>
            <Link to="/about" className="text-white font-medium">About</Link>
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
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Mission is to <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Democratize Finance
              </span>
            </h1>
            <p className="text-xl text-slate-400">
              We built Spenza because we believe that everyone deserves the tools to understand, manage, and grow their money.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mt-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">The Story</h2>
              <p className="text-slate-400 leading-relaxed">
                Founded in 2026, Spenza started as a simple spreadsheet. Our founders were frustrated by the complexity and high costs of existing financial software. They wanted something beautiful, intuitive, and most importantly, respectful of user privacy.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Today, we've grown into a comprehensive platform serving hundreds of thousands of users globally. Our commitment to design and user experience remains our guiding star.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center hover:bg-slate-800 transition-colors">
                <Users className="w-8 h-8 text-indigo-400 mb-3" />
                <h3 className="text-2xl font-bold mb-1">500K+</h3>
                <p className="text-slate-500 text-sm">Active Users</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center hover:bg-slate-800 transition-colors mt-8">
                <Globe className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="text-2xl font-bold mb-1">150+</h3>
                <p className="text-slate-500 text-sm">Countries</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center hover:bg-slate-800 transition-colors -mt-8">
                <Heart className="w-8 h-8 text-pink-400 mb-3" />
                <h3 className="text-2xl font-bold mb-1">4.9/5</h3>
                <p className="text-slate-500 text-sm">Average Rating</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-center items-center text-center hover:bg-slate-800 transition-colors">
                <DollarSign className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-2xl font-bold mb-1">$2.5B+</h3>
                <p className="text-slate-500 text-sm">Managed</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Join our journey</h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Take control of your finances today. We promise you'll love the experience.
          </p>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
            >
              Start for free
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}