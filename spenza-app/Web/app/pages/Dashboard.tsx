import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from "firebase/auth";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppContext, iconMap } from "../context/AppContext";
import {
  Plus,
  Minus,
  Target,
  Coffee,
  ChevronLeft,
  CreditCard,
  Wifi,
  MoreVertical,
  Bell,
  Search,
  User,
  ArrowUpRight,
  Settings,
  Edit2,
  Trash2,
  EyeOff,
  Lock,
  LogOut,
  AlertTriangle,
  X,
  Paperclip // Added for receipt indicator
} from "lucide-react";

export function Dashboard() {
  const { isHiddenTransactionsEnabled } = useAppContext();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  
  // State for the Delete & Preview Popups
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [previewTransaction, setPreviewTransaction] = useState<any | null>(null); // NEW: Receipt preview state

  // Firebase State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Real Transactions State
  const [transactions, setTransactions] = useState<any[]>([]);

  // 1. Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // 2. Real-time Firestore Listener for Transactions
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      return;
    }

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by newest first
      txData.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions(txData);
    });

    return () => unsubscribe();
  }, [user]);

  // Scroll handler for FAB
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteTransaction = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setTransactionToDelete(id);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await deleteDoc(doc(db, "transactions", transactionToDelete));
      setTransactionToDelete(null); 
    } catch (error) {
      console.error("Error deleting transaction: ", error);
    }
  };

  const handleHideTransaction = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await updateDoc(doc(db, "transactions", id), {
        isHidden: true
      });
    } catch (error) {
      console.error("Error hiding transaction: ", error);
    }
  };

  // --- Dynamic Math Calculations ---

  const totalBalance = transactions
    .filter((tx) => !tx.isHidden)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const dynamicCategoryData = transactions
    .filter((tx) => !tx.isHidden && tx.amount < 0) 
    .reduce((acc, tx) => {
      const existing = acc.find((item: any) => item.name === tx.category);
      if (existing) {
        existing.value += Math.abs(tx.amount);
      } else {
        acc.push({
          name: tx.category,
          value: Math.abs(tx.amount),
          color: tx.color.replace("text-", "").split("-")[0] === "blue" ? "#3b82f6" : 
                 tx.color.includes("amber") ? "#f59e0b" :
                 tx.color.includes("pink") ? "#ec4899" :
                 tx.color.includes("emerald") ? "#10b981" :
                 tx.color.includes("violet") ? "#8b5cf6" : "#64748b" 
        });
      }
      return acc;
    }, [] as any[])
    .sort((a, b) => b.value - a.value); 

  const totalExpenses = dynamicCategoryData.reduce((sum, item) => sum + item.value, 0);

  const netWorthData = transactions
    .slice() 
    .reverse() 
    .reduce((acc, tx, index) => {
      const prevBalance = index === 0 ? 0 : acc[index - 1].balance;
      const monthStr = new Date(tx.date).toLocaleString('default', { month: 'short' });
      acc.push({
        month: monthStr,
        balance: prevBalance + tx.amount
      });
      return acc;
    }, [{ month: "Start", balance: 0 }] as any[]);

  const budgets = [
    { name: "Dining Out", spent: 450, total: 500, color: "stroke-amber-500" },
    { name: "Shopping", spent: 300, total: 600, color: "stroke-pink-500" },
    { name: "Entertainment", spent: 150, total: 300, color: "stroke-violet-500" },
  ];

  // --- Components ---

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-300 text-sm mb-1">{label}</p>
          <p className="text-white font-bold">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const CircularProgress = ({ spent, total, name, color }: { spent: number; total: number; name: string; color: string }) => {
    const percentage = Math.min(100, (spent / total) * 100);
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r={radius} className="stroke-slate-700" strokeWidth="8" fill="none" />
            <motion.circle
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="48"
              cy="48"
              r={radius}
              className={`${color}`}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-bold text-white">{Math.round(percentage)}%</span>
          </div>
        </div>
        <p className="text-slate-300 text-sm mt-2 font-medium">{name}</p>
        <p className="text-slate-500 text-xs">${spent} / ${total}</p>
      </div>
    );
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar Navigation */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 border-r border-slate-800/60 bg-slate-900/40 backdrop-blur-xl hidden md:flex flex-col p-6 fixed h-full z-10"
      >
        <Link to="/" className="flex items-center gap-2 mb-10 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Back to Home
          </span>
        </Link>

        <nav className="flex-1 space-y-2">
          <Link to="/dashboard" className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 bg-blue-600/10 text-blue-400 font-medium border border-blue-500/20">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Overview
          </Link>
          <Link to="/transactions" className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
            <div className="w-2 h-2 rounded-full bg-transparent" />
            Transactions
          </Link>
          <Link to="/settings" className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
            <div className="w-2 h-2 rounded-full bg-transparent" />
            Settings
          </Link>
          {isHiddenTransactionsEnabled && (
            <Link to="/hidden-transactions" className="w-full mt-4 text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 border border-amber-900/30">
              <Lock className="w-4 h-4" />
              Hidden Vault
            </Link>
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-slate-400 hover:text-rose-400 hover:bg-rose-900/20"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>

          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-300" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || "User"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-6 lg:p-8 max-w-7xl mx-auto w-full relative">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md py-4 -mx-6 px-6 lg:-mx-8 lg:px-8 border-b border-slate-800/0">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-slate-400 text-sm">Welcome back, {user?.displayName || "User"}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
              <Search className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link to="/settings" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Link to="/add-expense">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-full bg-gradient-to-br from-blue-600/20 to-blue-600/10 hover:from-blue-600/30 hover:to-blue-600/20 border border-blue-500/30 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                <Minus className="w-6 h-6" />
              </div>
              <span className="text-blue-100 font-medium text-sm">Add Expense</span>
            </motion.button>
          </Link>

          <Link to="/add-income">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-full bg-gradient-to-br from-purple-600/20 to-purple-600/10 hover:from-purple-600/30 hover:to-purple-600/20 border border-purple-500/30 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-purple-100 font-medium text-sm">Add Income</span>
            </motion.button>
          </Link>

          <Link to="/set-goal" className="col-span-2 md:col-span-1">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-full bg-gradient-to-br from-emerald-600/20 to-emerald-600/10 hover:from-emerald-600/30 hover:to-emerald-600/20 border border-emerald-500/30 p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-emerald-100 font-medium text-sm">Set Goal</span>
            </motion.button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Net Worth Trend Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md"
            >
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-200 mb-1">Net Worth Trend</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-white">${totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    {totalBalance > 0 && (
                      <span className="text-emerald-400 text-sm font-medium flex items-center bg-emerald-400/10 px-2 py-0.5 rounded-full">
                        <ArrowUpRight className="w-3 h-3 mr-1" /> Active
                      </span>
                    )}
                  </div>
                </div>
                <select className="bg-slate-800 border border-slate-700 text-sm text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500">
                  <option>All Time</option>
                </select>
              </div>

              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <AreaChart data={netWorthData.length > 1 ? netWorthData : [{month: "Now", balance: totalBalance}]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs key="custom-defs">
                      <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid key="grid" strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip key="tooltip" content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Transaction Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-200">Recent Transactions</h2>
                <Link to="/transactions" className="text-sm text-blue-400 hover:text-blue-300 font-medium">View All</Link>
              </div>

              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No transactions yet. Add your first one!</p>
                ) : (
                  transactions.filter(t => !t.isHidden).slice(0, 5).map((tx, i) => {
                    const Icon = iconMap[tx.iconName] || Coffee;
                    return (
                      <motion.div 
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (i * 0.05) }}
                        // NEW: Make row clickable if there's a receipt
                        onClick={() => {
                          if (tx.receiptUrl) {
                            setPreviewTransaction(tx);
                          }
                        }}
                        className={`flex items-center justify-between p-3 rounded-2xl hover:bg-slate-800/50 transition-colors group relative ${tx.receiptUrl ? 'cursor-pointer' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.bg} ${tx.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">{tx.name}</p>
                              {/* NEW: Receipt indicator icon */}
                              {tx.receiptUrl && <Paperclip className="w-3.5 h-3.5 text-blue-400 opacity-80" />}
                            </div>
                            <p className="text-xs text-slate-500">{tx.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="hidden group-hover:flex items-center gap-2 mr-2">
                            <button className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit" onClick={(e) => e.stopPropagation()}>
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => handleHideTransaction(e, tx.id)} className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors" title="Hide">
                              <EyeOff className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => handleDeleteTransaction(e, tx.id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right min-w-[70px]">
                            <p className="font-bold text-white">{tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}</p>
                            <p className="text-xs text-slate-500">{tx.category}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            
            {/* Card Management */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-200">My Cards</h2>
                <button className="text-slate-400 hover:text-white transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-48 w-full rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 p-6 overflow-hidden shadow-2xl shadow-blue-900/20 border border-slate-600/30 group cursor-pointer mb-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/30 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -ml-10 -mb-10 group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="text-slate-200 font-bold text-lg italic tracking-wider">Spenza</div>
                    <Wifi className="w-6 h-6 text-slate-300 transform rotate-90" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-5 rounded bg-slate-300/20 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-slate-300/80" />
                      </div>
                      <span className="text-slate-300 text-sm font-mono tracking-widest">•••• •••• •••• 4289</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">Card Holder</p>
                        <p className="text-white text-sm font-medium tracking-wide">{user?.displayName || "User"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">Expires</p>
                        <p className="text-white text-sm font-medium tracking-wide">12/28</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Card Status</span>
                <span className="text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md font-medium">Active</span>
              </div>
            </motion.div>

            {/* Category Breakdown Donut */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md"
            >
              <h2 className="text-lg font-semibold text-slate-200 mb-2">Expenses by Category</h2>
              
              {dynamicCategoryData.length === 0 ? (
                 <p className="text-slate-500 text-center py-8 text-sm">No expenses recorded yet.</p>
              ) : (
                <>
                  <div className="h-[220px] w-full relative min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <PieChart>
                        <Pie
                          data={dynamicCategoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {dynamicCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                          itemStyle={{ color: '#f8fafc' }}
                          formatter={(value: number) => `$${value}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                      <span className="text-slate-400 text-xs">Total</span>
                      <span className="text-xl font-bold text-white">${totalExpenses.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2">
                    {dynamicCategoryData.map((category) => (
                      <div key={category.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="text-xs text-slate-300 truncate">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>

            {/* Budget Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md"
            >
              <h2 className="text-lg font-semibold text-slate-200 mb-6">Budget Progress</h2>
              
              <div className="flex justify-between gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {budgets.map((budget) => (
                  <CircularProgress
                    key={budget.name}
                    spent={budget.spent}
                    total={budget.total}
                    name={budget.name}
                    color={budget.color}
                  />
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      {/* Floating Actions */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 flex flex-col items-end gap-3"
            onMouseEnter={() => setIsFabOpen(true)}
            onMouseLeave={() => setIsFabOpen(false)}
          >
            <AnimatePresence>
              {isFabOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: 20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-end gap-3 pb-2"
                >
                  <motion.div className="group flex items-center gap-3">
                    <span className="bg-slate-800/90 backdrop-blur-md text-slate-200 text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none">
                      Set Goal
                    </span>
                    <motion.button onClick={() => navigate('/set-goal')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-slate-800/90 hover:bg-slate-700 backdrop-blur-md border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                      <Target className="w-5 h-5" />
                    </motion.button>
                  </motion.div>

                  <motion.div className="group flex items-center gap-3">
                    <span className="bg-slate-800/90 backdrop-blur-md text-slate-200 text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none">
                      Add Income
                    </span>
                    <motion.button onClick={() => navigate('/add-income')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-slate-800/90 hover:bg-slate-700 backdrop-blur-md border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </motion.div>

                  <motion.div className="group flex items-center gap-3">
                    <span className="bg-slate-800/90 backdrop-blur-md text-slate-200 text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none">
                      Add Expense
                    </span>
                    <motion.button onClick={() => navigate('/add-expense')} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-12 h-12 bg-slate-800/90 hover:bg-slate-700 backdrop-blur-md border border-rose-500/30 rounded-full flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
                      <Minus className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: isFabOpen ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-600/30 border border-blue-400/30 relative z-10"
            >
              <Plus className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {transactionToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-700/50 rounded-3xl p-6 shadow-2xl max-w-sm w-full relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Transaction?</h3>
                <p className="text-slate-400 text-sm mb-8">
                  Are you sure you want to delete this? This action cannot be undone and will permanently affect your balances.
                </p>

                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setTransactionToDelete(null)}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-xl transition-colors shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW: Receipt Preview Modal */}
      <AnimatePresence>
        {previewTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
            onClick={() => setPreviewTransaction(null)} // Clicking the background closes it
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-slate-900 border border-slate-700/50 rounded-3xl p-6 shadow-2xl max-w-2xl w-full relative overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()} // Prevent clicking modal from closing it
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Receipt Preview</h3>
                <button 
                  onClick={() => setPreviewTransaction(null)} 
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="w-full h-[60vh] bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800 relative">
                {previewTransaction.receiptUrl?.toLowerCase().includes('.pdf') ? (
                  <iframe 
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewTransaction.receiptUrl)}&embedded=true`} 
                    className="w-full h-full border-0 bg-white" 
                    title="PDF Receipt"
                  />
                ) : (
                  <img 
                    src={previewTransaction.receiptUrl} 
                    alt="Receipt" 
                    className="max-w-full max-h-full object-contain" 
                  />
                )}
              </div>
              
              <div className="mt-4 flex justify-between items-center text-sm text-slate-400 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-200">{previewTransaction.name}</span>
                  <span className="text-xs">{previewTransaction.date}</span>
                </div>
                <div className="text-right">
                  <span className={`font-bold text-lg ${previewTransaction.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                    ${Math.abs(previewTransaction.amount).toFixed(2)}
                  </span>
                  <p className="text-xs uppercase tracking-wider mt-0.5">{previewTransaction.category}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}