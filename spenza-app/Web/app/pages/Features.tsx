import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { DollarSign, Shield, PieChart, Wallet, TrendingUp, Smartphone, Globe, Lock, Bell, Star } from "lucide-react";

export function Features() {
  const allFeatures = [
    {
      icon: Wallet,
      title: "Smart Budgeting",
      description: "Set custom budgets for different categories and get notified before you overspend. AI predicts your monthly expenses based on past behavior."
    },
    {
      icon: PieChart,
      title: "Deep Analytics",
      description: "Visualize where your money goes with interactive charts. Understand your spending patterns at a glance."
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "We use 256-bit encryption to keep your financial data safe. Your credentials are never stored on our servers."
    },
    {
      icon: Lock,
      title: "Hidden Vault",
      description: "Keep sensitive transactions locked behind an extra layer of password protection."
    },
    {
      icon: Globe,
      title: "Multi-Currency",
      description: "Traveling or working internationally? Track expenses in multiple currencies with real-time exchange rates."
    },
    {
      icon: TrendingUp,
      title: "Goal Tracking",
      description: "Saving for a vacation or a new car? Set goals and let Spenza track your progress automatically."
    }
  ];

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
            <Link to="/features" className="text-white font-medium">Features</Link>
            <Link to="/download" className="text-slate-300 hover:text-white transition-colors">Download</Link>
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

      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Total Financial Control
            </span>
          </h1>
          <p className="text-xl text-slate-400">
            Everything you need to track, manage, and grow your wealth in one beautiful application.
          </p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-6 pb-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allFeatures.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 hover:bg-slate-800/50 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your finances?</h2>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium"
            >
              Create Free Account
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}