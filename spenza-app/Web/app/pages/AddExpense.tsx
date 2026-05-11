import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Minus, DollarSign, Calendar, Tag, 
  FileText, Upload, File as FileIcon, Loader2, X 
} from "lucide-react";
// Firebase Imports
import { collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth"; 
import { db, auth, storage } from "../firebase";

const getCategoryStyling = (cat: string) => {
  switch (cat) {
    case "food": return { iconName: "Coffee", color: "text-amber-500", bg: "bg-amber-500/20" };
    case "housing": return { iconName: "Home", color: "text-blue-500", bg: "bg-blue-500/20" };
    case "shopping": return { iconName: "ShoppingBag", color: "text-pink-500", bg: "bg-pink-500/20" };
    case "transportation": return { iconName: "Car", color: "text-emerald-500", bg: "bg-emerald-500/20" };
    case "utilities": return { iconName: "Wifi", color: "text-violet-500", bg: "bg-violet-500/20" };
    case "entertainment": return { iconName: "Target", color: "text-rose-500", bg: "bg-rose-500/20" };
    default: return { iconName: "CreditCard", color: "text-slate-400", bg: "bg-slate-400/20" };
  }
};

export function AddExpense() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 1. Protection State
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  
  // Form State
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  
  // File State
  const [file, setFile] = useState<File | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>(undefined); // Local preview URL
  const [fileName, setFileName] = useState<string | null>(null);
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. Authentication Protection
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

  // 3. Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile); // Save the actual file to upload later
    setFileName(selectedFile.name);
    
    // Create local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptUrl(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
    setFileName(null);
    setReceiptUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 4. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return setError("You must be logged in.");
    if (!category) return setError("Please select a category.");
    
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return setError("Amount must be greater than zero.");
    }

    setIsLoading(true);
    setError("");

    try {
      const styling = getCategoryStyling(category);
      const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
      const finalAmount = Number(parsedAmount.toFixed(2));
      
      // 🔥 UPDATED: Cloudinary Upload Logic 🔥
      let uploadedReceiptUrl = "";
      
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        
        // PASTE YOUR PRESET NAME HERE
        formData.append("upload_preset", "spenza_receipts"); 

        // PASTE YOUR CLOUD NAME HERE
        const CLOUD_NAME = "dsrcqxwzx";
        
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();
        
        if (uploadRes.ok) {
          uploadedReceiptUrl = uploadData.secure_url; // Gets the live HTTPS URL from Cloudinary
        } else {
          console.error("Cloudinary Error:", uploadData);
          throw new Error("File upload failed");
        }
      }
      
      // Save transaction to Firestore
      await addDoc(collection(db, "transactions"), {
        userId: auth.currentUser.uid,
        name: notes || displayCategory,
        amount: -Math.abs(finalAmount),
        category: displayCategory,
        date,
        notes,
        receiptUrl: uploadedReceiptUrl, // Save the Cloudinary URL here
        iconName: styling.iconName,
        color: styling.color,
        bg: styling.bg,
        isHidden: false,
        createdAt: new Date().toISOString()
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding expense:", err);
      setError("Failed to save expense. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
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
          <h1 className="text-2xl font-bold">Add Expense</h1>
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
                <DollarSign className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onBlur={() => amount && setAmount(parseFloat(amount).toFixed(2))}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-2xl font-bold focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-slate-500" />
              </div>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-200 appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="">Select category...</option>
                <option value="housing">Housing</option>
                <option value="food">Food & Dining</option>
                <option value="transportation">Transportation</option>
                <option value="shopping">Shopping</option>
                <option value="entertainment">Entertainment</option>
                <option value="utilities">Utilities</option>
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
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Receipt</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden" 
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full border rounded-2xl py-3 px-3 text-sm flex items-center justify-center gap-2 transition-colors ${
                fileName ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              {fileName ? (
                <>
                  <FileIcon className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">{fileName}</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </>
              )}
            </button>
          </div>
          
          <AnimatePresence>
            {receiptUrl && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900"
              >
                <button 
                  type="button"
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-slate-900/80 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-rose-500 transition-colors z-10"
                >
                  <X className="w-4 h-4" />
                </button>
                {/* NEW: PDF Preview Logic */}
                {receiptUrl.startsWith("data:application/pdf") ? (
                  <iframe 
                    src={`${receiptUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                    title="PDF Preview"
                    className="w-full h-56 border-0 rounded-xl"
                  />
                ) : (
                  <img src={receiptUrl} alt="Receipt preview" className="w-full h-48 object-cover opacity-80 hover:opacity-100 transition-opacity" />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Notes (Optional)</label>
            <div className="relative">
              <div className="absolute top-3 left-4 pointer-events-none">
                <FileText className="h-5 w-5 text-slate-500" />
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors min-h-[100px]"
                placeholder="Add details..."
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-2xl py-4 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Minus className="w-5 h-5" /> Save Expense
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}