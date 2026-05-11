import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, DollarSign, Calendar, Tag, FileText, Loader2 } from "lucide-react";
// 1. Firebase Imports
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";

// Helper to assign icons/colors for Income Sources
const getSourceStyling = (src: string) => {
  switch (src) {
    case "salary": return { iconName: "Briefcase", color: "text-emerald-500", bg: "bg-emerald-500/20" };
    case "freelance": return { iconName: "Laptop", color: "text-blue-500", bg: "bg-blue-500/20" };
    case "investments": return { iconName: "TrendingUp", color: "text-purple-500", bg: "bg-purple-500/20" };
    case "gift": return { iconName: "Gift", color: "text-pink-500", bg: "bg-pink-500/20" };
    default: return { iconName: "Plus", color: "text-emerald-500", bg: "bg-emerald-500/20" };
  }
};

export function AddIncome() {
  const navigate = useNavigate();

  // 1. Protection State: Prevents unauthenticated users from seeing the form
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. Authentication Protection Hook
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else {
        setIsAuthenticating(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 3. Handle Save to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return setError("You must be logged in.");
    if (!source) return setError("Please select an income source.");
    
    // 3. Precision Logic: Convert string to float and force 2 decimal places
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return setError("Amount must be greater than zero.");
    }

    setIsLoading(true);
    setError("");

    try {
      const styling = getSourceStyling(source);
      const displaySource = source.charAt(0).toUpperCase() + source.slice(1);

      // Force consistent decimal storage (e.g., 1000 becomes 1000.00)[cite: 1, 2]
      const finalAmount = Number(parsedAmount.toFixed(2));

      await addDoc(collection(db, "transactions"), {
        userId: auth.currentUser.uid,
        name: notes || displaySource,
        amount: Math.abs(finalAmount), // Income is saved as a POSITIVE number[cite: 1]
        category: displaySource,
        date,
        notes,
        iconName: styling.iconName,
        color: styling.color,
        bg: styling.bg,
        isHidden: false,
        createdAt: new Date().toISOString()
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding income:", err);
      setError("Failed to save income. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Auth Loading Guard
  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Add Income</h1>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-emerald-400" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={() => amount && setAmount(parseFloat(amount).toFixed(2))} // Auto-format to .00 on blur[cite: 1]
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-2xl font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Income Source</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-slate-500" />
              </div>
              <select 
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-200 appearance-none focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">Select source...</option>
                <option value="salary">Salary</option>
                <option value="freelance">Freelance</option>
                <option value="investments">Investments</option>
                <option value="gift">Gift</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Notes (Optional)</label>
            <div className="relative">
              <div className="absolute top-3 left-4 pointer-events-none">
                <FileText className="h-5 w-5 text-slate-500" />
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors min-h-[100px]"
                placeholder="Add details..."
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" /> Save Income
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}