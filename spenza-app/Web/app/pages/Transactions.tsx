import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Coffee, Search, Filter, Edit2, EyeOff, 
  Trash2, ChevronLeft, LogOut, Lock, Bell, User as UserIcon 
} from "lucide-react";
import { 
  collection, query, where, onSnapshot, doc, deleteDoc, updateDoc 
} from "firebase/firestore";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { auth, db } from "../firebase";
import { useAppContext, iconMap } from "../context/AppContext";

export function Transactions() {
  const navigate = useNavigate();
  const { isHiddenTransactionsEnabled } = useAppContext();
  
  // Auth & Data State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Auth Protection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Real-time Firestore Listener
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      where("isHidden", "==", false) // Hide items that are in the vault
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort by newest date
      txData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(txData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleHideTransaction = async (id: string) => {
    try {
      await updateDoc(doc(db, "transactions", id), { isHidden: true });
    } catch (err) {
      console.error("Error hiding:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const filteredTransactions = transactions.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
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
          <Link to="/dashboard" className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
            <div className="w-2 h-2 rounded-full bg-transparent" />
            Overview
          </Link>
          <Link to="/transactions" className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 bg-blue-600/10 text-blue-400 font-medium border border-blue-500/20">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
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
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-slate-400 hover:text-rose-400 hover:bg-rose-900/20">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-800/40 border border-slate-700/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
              <UserIcon className="w-5 h-5 text-slate-300" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || "User"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 lg:p-8 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-4xl space-y-8">
          <header className="flex justify-between items-center sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">All Transactions</h1>
              <p className="text-slate-400 text-sm">Review and manage your history</p>
            </div>
            <div className="flex gap-3">
               <button className="bg-slate-900 border border-slate-800 text-slate-300 p-2.5 rounded-xl hover:bg-slate-800 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </header>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or category..." 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-md">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                <p className="text-slate-500">No transactions found.</p>
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {filteredTransactions.map((tx, i) => {
                    const Icon = iconMap[tx.iconName] || Coffee;
                    return (
                      <motion.div 
                        key={tx.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800/50 transition-all group border border-transparent hover:border-slate-700/50 relative"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.bg} ${tx.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200 group-hover:text-white">{tx.name}</p>
                            <p className="text-xs text-slate-500">{tx.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="hidden group-hover:flex items-center gap-1">
                            <button 
                              onClick={() => handleHideTransaction(tx.id)}
                              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors"
                              title="Move to Hidden Vault"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right min-w-[80px]">
                            <p className={`font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                              {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                            </p>
                            <p className="text-xs text-slate-500">{tx.category}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}