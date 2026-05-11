import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Unlock, Eye, Trash2, ShieldAlert, RefreshCw } from "lucide-react";
import { useAppContext, iconMap } from "../context/AppContext";

// 1. Add Firebase imports
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export function HiddenTransactions() {
  const navigate = useNavigate();
  const { isHiddenTransactionsEnabled } = useAppContext();
  
  const [passwordInput, setPasswordInput] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false); // Default to locked
  const [dbPassword, setDbPassword] = useState<string | null>(null); // State to store DB password
  const [error, setError] = useState(false);

  // 2. Add Firebase state variables
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [hiddenTransactions, setHiddenTransactions] = useState<any[]>([]);

  // 3. Authentication Listener & Fetch DB Password
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch the actual password from Firestore userSettings
        const docRef = doc(db, "userSettings", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDbPassword(docSnap.data().vaultPassword || null);
        }
      } else {
        navigate("/login");
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // 4. Real-time Firestore Listener for HIDDEN Transactions
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid),
      where("isHidden", "==", true) // Only fetch hidden items
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const txData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by newest first
      txData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setHiddenTransactions(txData);
    });

    return () => unsubscribe();
  }, [user]);

  // FIXED: Logic now compares against dbPassword fetched from Firestore
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (dbPassword && passwordInput === dbPassword) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPasswordInput(""); // Clear input on failure
    }
  };

  // 5. Update to use Firestore updateDoc
  const handleUnhideTransaction = async (id: string) => {
    try {
      await updateDoc(doc(db, "transactions", id), {
        isHidden: false
      });
    } catch (err) {
      console.error("Error unhiding transaction:", err);
    }
  };

  // 6. Update to use Firestore deleteDoc
  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteDoc(doc(db, "transactions", id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isHiddenTransactionsEnabled) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-slate-700 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Private Mode Disabled</h1>
        <p className="text-slate-400 mb-6 max-w-sm">Hidden transactions are not enabled on this account. Enable them from Settings.</p>
        <Link to="/settings" className="bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl py-3 px-6 transition-colors">
          Go to Settings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Lock className="w-6 h-6 text-slate-400" />
            Hidden Vault
          </h1>
        </div>

        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div 
              key="lock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md mx-auto bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 mt-12"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold mb-2">Vault Locked</h2>
                <p className="text-sm text-slate-400">Enter your privacy password to view hidden transactions.</p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setError(false);
                  }}
                  placeholder="Enter password"
                  className={`w-full bg-slate-950/50 border ${error ? 'border-rose-500' : 'border-slate-800'} rounded-2xl py-3 px-4 text-center text-lg tracking-widest focus:outline-none focus:border-blue-500 transition-colors`}
                  autoFocus
                />
                {error && <p className="text-rose-400 text-xs text-center">Incorrect password. Try again.</p>}
                
                <button
                  type="submit"
                  className="w-full bg-white text-slate-900 hover:bg-slate-200 font-semibold rounded-2xl py-3 flex items-center justify-center gap-2 transition-colors"
                >
                  <Unlock className="w-5 h-5" />
                  Unlock
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate("/settings")}
                  className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors pt-2 underline"
                >
                  Forgot Vault Password?
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md"
            >
              {hiddenTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <ShieldAlert className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-400">No hidden transactions found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hiddenTransactions.map((tx, i) => {
                    const Icon = iconMap[tx.iconName] || Lock;
                    return (
                      <motion.div 
                        key={tx.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:bg-slate-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-800 text-slate-400`}>
                            <Icon className="w-6 h-6 opacity-50 grayscale" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">{tx.name}</p>
                            <p className="text-xs text-slate-500">{tx.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleUnhideTransaction(tx.id)}
                              className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors flex items-center gap-2"
                              title="Restore to dashboard"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-xs font-medium hidden sm:block">Restore</span>
                            </button>
                            <button 
                              onClick={() => handleDeleteTransaction(tx.id)}
                              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors flex items-center gap-2"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-xs font-medium hidden sm:block">Delete</span>
                            </button>
                          </div>

                          <div className="text-right w-24">
                            <p className="font-bold text-slate-300">{tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}</p>
                            <p className="text-xs text-slate-500">{tx.category}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}