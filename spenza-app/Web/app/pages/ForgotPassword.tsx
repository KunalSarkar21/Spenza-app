import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowRight, DollarSign, CheckCircle2, ArrowLeft } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Firebase magic: Sends the reset link to their email
      await sendPasswordResetEmail(auth, email);
      setIsSuccess(true); // Switch the UI to the success state
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError("We couldn't find an account with that email address.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to send reset email. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col relative overflow-hidden">
      
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center p-6 relative z-10">
        
        {/* LEFT SIDE: Animated Logo & Branding */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 hidden md:flex">
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20"
          >
            <DollarSign className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Spenza
            </h1>
            <p className="text-slate-400 text-lg max-w-md">
              Don't worry, it happens to the best of us. We'll get you back into your account in no time.
            </p>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Reset Card */}
        <div className="flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Logo for mobile only */}
            <div className="flex md:hidden justify-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Spenza
                </span>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-slate-700 min-h-[400px] flex flex-col justify-center">
              
              <AnimatePresence mode="wait">
                {/* SUCCESS STATE */}
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-2 border border-green-500/30">
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Check your email</h2>
                    <p className="text-slate-400 text-sm mb-6">
                      We sent a password reset link to <br/>
                      <span className="font-medium text-slate-300">{email}</span>
                    </p>
                    
                    <Link to="/login" className="w-full">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-8 py-3 bg-slate-800 text-white rounded-xl border-2 border-slate-700 hover:border-slate-600 hover:bg-slate-700/50 transition-all font-medium flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Login
                      </motion.button>
                    </Link>
                  </motion.div>

                ) : (

                  /* FORM STATE */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="w-full"
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-1 text-center">Reset password</h2>
                      <p className="text-slate-400 text-center text-sm">Enter your email to receive a reset link</p>
                    </div>

                    {error && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-500" />
                          </div>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-xl pl-11 pr-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            placeholder="you@example.com"
                            required
                            autoFocus
                          />
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        type="submit"
                        className="w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-70 mt-2"
                      >
                        {isLoading ? "Sending link..." : "Send Reset Link"}
                        {!isLoading && <ArrowRight className="w-5 h-5" />}
                      </motion.button>
                    </form>

                    <p className="mt-6 text-center text-slate-400 text-sm flex items-center justify-center gap-1">
                      <ArrowLeft className="w-4 h-4" />
                      <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                        Back to login
                      </Link>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 bg-slate-900 border-t border-slate-800 relative z-10 w-full mt-auto">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>© 2026 Spenza. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}