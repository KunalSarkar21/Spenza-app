import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Lock, EyeOff, ShieldAlert, Save, User as UserIcon, 
  Mail, CreditCard, Trash2, Download, LogOut, ChevronRight,
  ChevronLeft, LayoutDashboard, Settings as SettingsIcon,
  Bell, Search
} from "lucide-react";
import { onAuthStateChanged, signOut, User as FirebaseUser, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAppContext } from "../context/AppContext";

export function Settings() {
  const navigate = useNavigate();
  const { 
    isHiddenTransactionsEnabled, 
    setIsHiddenTransactionsEnabled, 
    hiddenPasswordHash, 
    setHiddenPasswordHash 
  } = useAppContext();
  
  // Auth & Settings State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || "");
  const [enabled, setEnabled] = useState(isHiddenTransactionsEnabled);
  const [password, setPassword] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  
  // Password Logic State
  const [dbPassword, setDbPassword] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        
        // Fetch existing vault password from Firestore
        const docRef = doc(db, "userSettings", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const storedPass = docSnap.data().vaultPassword;
          setDbPassword(storedPass || null);
        }
      } else {
        navigate("/login");
      }
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    // THE NEEDFUL: Validation Logic
    setFormError("");
    
    // If enabling for the first time or changing password, a password string is required
    if (enabled && !dbPassword && !password) {
      setFormError("A password is required to enable the Hidden Vault.");
      return;
    }
    
    if (enabled && isChangingPassword && !password) {
      setFormError("Please enter a new password or cancel change.");
      return;
    }

    setIsLoading(true);
    setSaveStatus("idle");

    try {
      await updateProfile(auth.currentUser, { displayName });
      
      const finalPassword = password || dbPassword;
      
      const userSettingsRef = doc(db, "userSettings", auth.currentUser.uid);
      await setDoc(userSettingsRef, {
        isHiddenEnabled: enabled,
        vaultPassword: enabled ? finalPassword : null, // Clear pass if disabled
        currency: currency,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setIsHiddenTransactionsEnabled(enabled);
      if (enabled) {
        setHiddenPasswordHash(finalPassword);
        setDbPassword(finalPassword);
      } else {
        setHiddenPasswordHash(null);
        setDbPassword(null);
      }

      setSaveStatus("success");
      setIsChangingPassword(false);
      setPassword("");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
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
          <Link to="/transactions" className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50">
            <div className="w-2 h-2 rounded-full bg-transparent" />
            Transactions
          </Link>
          <Link to="/settings" className="w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 bg-blue-600/10 text-blue-400 font-medium border border-blue-500/20">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
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
              {user?.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5 text-slate-300" />}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || "User"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </motion.aside>

      <main className="flex-1 md:ml-64 p-6 lg:p-8 flex flex-col items-center overflow-y-auto">
        <div className="w-full max-w-4xl space-y-6">
          <motion.header 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8 sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md py-4"
          >
            <div>
              <h1 className="text-2xl font-bold text-white">Settings</h1>
              <p className="text-slate-400 text-sm">Manage your profile and preferences</p>
            </div>
            <div className="flex items-center gap-4">
              <AnimatePresence>
                {saveStatus === "success" && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-emerald-400 text-sm font-medium animate-pulse"
                  >
                    Saved!
                  </motion.span>
                )}
              </AnimatePresence>
              <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
                <Search className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </motion.header>

          <form onSubmit={handleSaveAll} className="space-y-4">
            {/* PROFILE SECTION */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4"
            >
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <UserIcon size={16} /> Profile
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 ml-1">Display Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)} 
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 focus:border-blue-500 outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* HIDDEN VAULT SECTION */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><EyeOff size={20} /></div>
                  <div><h3 className="font-semibold">Hidden Vault</h3><p className="text-xs text-slate-400">Lock private transactions</p></div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                  <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <AnimatePresence>
                {enabled && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }} 
                    className="pt-4 border-t border-slate-800 mt-4"
                  >
                    {!dbPassword || isChangingPassword ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-slate-400 ml-1">
                            {!dbPassword ? "Set Vault Password" : "New Vault Password"}
                          </label>
                          {isChangingPassword && (
                            <button type="button" onClick={() => setIsChangingPassword(false)} className="text-xs text-rose-400 hover:underline">Cancel</button>
                          )}
                        </div>
                        <div className="relative mt-2">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter password" 
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-blue-500" 
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-slate-950/30 p-3 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-2 text-emerald-400 text-sm">
                          <ShieldAlert size={16} />
                          <span>Password is active</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setIsChangingPassword(true)}
                          className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Change Password
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* PREFERENCES SECTION */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-md space-y-4"
            >
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <CreditCard size={16} /> Preferences
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Currency</span>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500">
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </motion.div>

            <AnimatePresence>
              {formError && (
                <motion.p 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-rose-400 text-sm text-center font-medium animate-pulse"
                >
                  {formError}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 shadow-lg transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <><Save size={20} /> Save All Changes</>
              )}
            </motion.button>
          </form>
        </div>
      </main>
    </div>
  );
}