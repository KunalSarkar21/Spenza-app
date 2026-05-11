import { motion } from "motion/react";
import {
  TrendingUp,
  Wallet,
  PieChart,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Target,
  Bell
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    {
      icon: Wallet,
      title: "Smart Budgeting",
      description: "Set custom budgets and track spending across categories with intelligent alerts",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: PieChart,
      title: "Expense Analytics",
      description: "Visualize spending patterns with beautiful charts and insights",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Investment Tracking",
      description: "Monitor your portfolio performance and track financial goals",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is encrypted and protected with industry-leading security",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { value: "500K+", label: "Active Users" },
    { value: "$2.5B+", label: "Money Managed" },
    { value: "4.9/5", label: "User Rating" },
    { value: "150+", label: "Countries" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Spenza
            </span>
          </motion.div>

          {/* <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#download" className="text-slate-300 hover:text-white transition-colors">Download</a>
            <a href="#about" className="text-slate-300 hover:text-white transition-colors">About</a>
          </div> */}

          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-slate-300 hover:text-white transition-colors">Features</Link>
            <Link to="/download" className="text-slate-300 hover:text-white transition-colors">Download</Link>
            <Link to="/about" className="text-slate-300 hover:text-white transition-colors">About</Link>
          </div>

          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full mb-6 border border-blue-500/30"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-400 font-medium">New: AI-Powered Insights</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
                Take Control of Your{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Financial Future
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8">
                The smartest way to track expenses, manage budgets, and achieve your financial goals.
                All in one beautiful, intuitive platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 hover:shadow-xl transition-shadow w-full sm:w-auto"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-slate-800 text-white rounded-xl border-2 border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    Create Account
                  </motion.button>
                </Link>
              </div>

              <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 border-2 border-slate-900" />
                  ))}
                </div>
                <div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-400">Loved by 500K+ users</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-slate-300">Monthly Overview</span>
                  <Bell className="w-5 h-5 text-slate-400" />
                </div>

                <div className="mb-6">
                  <p className="text-sm text-slate-400 mb-2">Total Balance</p>
                  <motion.p
                    className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    ₹24,580.50
                  </motion.p>
                  <p className="text-sm text-green-400 mt-1">+12.5% from last month</p>
                </div>

                <div className="space-y-3 pb-8">
                  {[
                    { label: "Income", amount: "₹8,420", color: "bg-green-500", width: "75%" },
                    { label: "Expenses", amount: "₹3,280", color: "bg-red-500", width: "45%" },
                    { label: "Savings", amount: "₹5,140", color: "bg-blue-500", width: "60%" }
                  ].map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                    >
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{item.label}</span>
                        <span className="font-medium text-white">{item.amount}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: item.width }}
                          transition={{ delay: 0.8 + idx * 0.1, duration: 0.8 }}
                          className={`h-full ${item.color}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Floating cards */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
                className="absolute -top-6 -right-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 shadow-xl"
              >
                <TrendingUp className="w-8 h-8 text-white mb-2" />
                <p className="text-white text-sm font-medium">+24% ROI</p>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-4 -left-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 shadow-xl"
              >
                <Target className="w-8 h-8 text-white mb-2" />
                <p className="text-white text-sm font-medium">Goals Met</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <motion.p
                  className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6" id="features">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Powerful features designed to simplify your financial life
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onHoverStart={() => setHoveredFeature(idx)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer relative overflow-hidden"
              >
                <motion.div
                  animate={{
                    opacity: hoveredFeature === idx ? 0.1 : 0,
                    scale: hoveredFeature === idx ? 1 : 0.8
                  }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color}`}
                />

                <div className="relative z-10">
                  <motion.div
                    animate={{
                      scale: hoveredFeature === idx ? 1.1 : 1,
                      rotate: hoveredFeature === idx ? 5 : 0
                    }}
                    className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-slate-300 mb-4">{feature.description}</p>

                  <motion.div
                    animate={{
                      x: hoveredFeature === idx ? 5 : 0
                    }}
                    className="flex items-center gap-2 text-blue-400 font-medium"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"
            />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Start Your Financial Journey Today
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have transformed their finances with Spenza
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl font-medium hover:shadow-xl transition-shadow w-full sm:w-auto"
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-transparent text-white rounded-xl border-2 border-white/50 hover:bg-white/10 transition-colors"
                  >
                    Create Account
                  </motion.button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
                {[
                  "No credit card required",
                  "14-day free trial",
                  "Cancel anytime"
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-white/80" />
                    <span className="text-white/80">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>© 2026 Spenza. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
