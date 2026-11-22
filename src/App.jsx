import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Sparkles, TrendingUp, TrendingDown, Wallet, PieChart as PieIcon, 
  List, Target, Download, Upload, Trash2, ArrowUpRight, ArrowDownRight,
  Sun, Moon, Filter, Search, Tag, Coffee, Heart, Smartphone, ShoppingBag,
  Sparkle, Award, CheckCircle, RefreshCw, X, ChevronRight, PiggyBank,
  Smile, Zap
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// --- DATA INITIAL / DEFAULT ---
const INITIAL_TRANSACTIONS = [
  { id: '1', title: 'Iced Oat Matcha Latte 🍵', amount: 38000, type: 'expense', category: 'Matcha & Coffee', paymentMethod: 'QRIS', tag: '#MatchaDaily', date: '2026-11-20' },
  { id: '2', title: 'Gaji Freelance Aesthetic Design ✨', amount: 3500000, type: 'income', category: 'Gaji / Income', paymentMethod: 'Transfer', tag: '#CuanEra', date: '2026-11-18' },
  { id: '3', title: 'Skincare Cushion & Lip Tint 💄', amount: 245000, type: 'expense', category: 'Beauty & Skincare', paymentMethod: 'E-Wallet', tag: '#SelfCare', date: '2026-11-15' },
  { id: '4', title: 'Thrifting Cardigan Oversize 👗', amount: 120000, type: 'expense', category: 'Fashion & OOTD', paymentMethod: 'QRIS', tag: '#OOTDGoals', date: '2026-11-12' },
  { id: '5', title: 'Tiket Konser Niki 🎟️', amount: 850000, type: 'expense', category: 'Entertainment', paymentMethod: 'Transfer', tag: '#ConcertLife', date: '2026-11-10' },
];

const INITIAL_GOALS = [
  { id: 'g1', name: 'Tiket Konser Wave to Earth 🎟️', target: 1500000, current: 950000, icon: '🎟️' },
  { id: 'g2', name: 'iPad Pro Matcha Edition 📱', target: 12000000, current: 4800000, icon: '📱' },
  { id: 'g3', name: 'Liburan ke Bali 🌊', target: 5000000, current: 2300000, icon: '🌊' }
];

const MATCHA_CATEGORIES = [
  { name: 'Matcha & Coffee', emoji: '🍵', color: '#709775' },
  { name: 'Beauty & Skincare', emoji: '💄', color: '#A1CCA5' },
  { name: 'Fashion & OOTD', emoji: '👗', color: '#8FB996' },
  { name: 'Entertainment', emoji: '🎟️', color: '#B5E2FA' },
  { name: 'Makan & Snacks', emoji: '🥑', color: '#97A97C' },
  { name: 'Gaji / Income', emoji: '💸', color: '#415D43' },
  { name: 'Lain-lain', emoji: '🍡', color: '#C7F9CC' }
];

const MATCHA_TIPS = [
  "Matcha Latte itu kebutuhan jiwa, tapi jangan lupa top-up tabungan impianmu ya, Girlie! 🍃✨",
  "Ingat rumus 50/30/20: 50% Butuh, 30% Matcha & Healing, 20% Masa Depan Slay! 🍵💖",
  "Nahan wishlist promo 11.11 beda tipis sama investasi kecantikan finansial. Stay Strong! 🥑💅",
  "Tabungan konser makin tebel, senyum makin lebar. Slay financial goals! 🎟️✨"
];

export default function App() {
  // LocalStorage state loader
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('slay_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('slay_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modal Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Matcha & Coffee');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [tag, setTag] = useState('#MatchaDaily');

  // Goal Form State
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalIcon, setGoalIcon] = useState('🍵');

  // Top Up Goal State
  const [topUpGoalId, setTopUpGoalId] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('slay_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('slay_goals', JSON.stringify(goals));
  }, [goals]);

  // Calculations
  const totalIncome = useMemo(() => {
    return transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [transactions]);

  const balance = totalIncome - totalExpense;

  // Chart Data
  const chartData = useMemo(() => {
    const catMap = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
    });
    return Object.keys(catMap).map(cat => ({
      name: cat,
      value: catMap[cat]
    }));
  }, [transactions]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.tag.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'All' || t.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [transactions, searchQuery, filterCategory]);

  // Handlers
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    const newTx = {
      id: Date.now().toString(),
      title,
      amount: Number(amount),
      type,
      category,
      paymentMethod,
      tag: tag.startsWith('#') ? tag : `#${tag}`,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTx, ...transactions]);
    setTitle('');
    setAmount('');
    setShowAddModal(false);
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;

    const newG = {
      id: Date.now().toString(),
      name: goalName,
      target: Number(goalTarget),
      current: 0,
      icon: goalIcon
    };

    setGoals([...goals, newG]);
    setGoalName('');
    setGoalTarget('');
    setShowGoalModal(false);
  };

  const handleTopUpGoal = (id) => {
    if (!topUpAmount || isNaN(topUpAmount)) return;
    setGoals(goals.map(g => {
      if (g.id === id) {
        return { ...g, current: Math.min(g.target, g.current + Number(topUpAmount)) };
      }
      return g;
    }));
    setTopUpGoalId(null);
    setTopUpAmount('');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Backup & Restore
  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ transactions, goals }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `slay_finance_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Tanggal,Judul,Tipe,Kategori,Metode,Nominal,Tag\n";
    transactions.forEach(t => {
      csvContent += `${t.id},${t.date},"${t.title}",${t.type},"${t.category}",${t.paymentMethod},${t.amount},"${t.tag}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transaksi_slayfinance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const importJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.transactions && parsed.goals) {
            setTransactions(parsed.transactions);
            setGoals(parsed.goals);
            alert("✨ Berhasil restore data SlayFinance kamu!");
          } else {
            alert("File tidak valid.");
          }
        } catch (err) {
          alert("Gagal membaca file JSON.");
        }
      };
    }
  };

  const resetAllData = () => {
    if (window.confirm("Yakin mau hapus semua data dan kembali ke awal?")) {
      setTransactions(INITIAL_TRANSACTIONS);
      setGoals(INITIAL_GOALS);
      localStorage.clear();
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Colors based on theme
  const bgMain = darkMode ? 'bg-[#1b241c] text-[#e8f5e9]' : 'bg-[#f4f7f4] text-[#2c3e2e]';
  const cardBg = darkMode ? 'bg-[#243326] border-[#344d37]' : 'bg-white border-[#d8e8d9]';

  return (
    <div className={`min-h-screen ${bgMain} font-sans pb-24 transition-colors duration-300`}>
      {/* HEADER MOBILE & DESKTOP */}
      <header className={`sticky top-0 z-20 backdrop-blur-md ${darkMode ? 'bg-[#1b241c]/80 border-[#344d37]' : 'bg-[#f4f7f4]/80 border-[#d8e8d9]'} border-b px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#709775] to-[#a1cca5] flex items-center justify-center text-white shadow-md shadow-[#709775]/20">
            <span className="text-xl">🍵</span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight flex items-center space-x-1">
              <span>SlayFinance</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#709775]/20 text-[#709775] font-semibold">Matcha 🍃</span>
            </h1>
            <p className="text-[#8fb996] text-xs font-medium">Gen Z Money Tracker</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className={`p-2 rounded-xl border ${darkMode ? 'bg-[#243326] border-[#344d37] text-amber-300' : 'bg-white border-[#d8e8d9] text-[#709775]'} transition-transform active:scale-95 shadow-sm`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        
        {/* BANNER SALDO COQUETTE MATCHA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#709775] via-[#588157] to-[#3a5a40] text-white p-6 shadow-xl shadow-[#709775]/20">
          <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none text-9xl font-bold">🍃</div>
          <div className="relative z-10 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#a1cca5] font-semibold">Total Net Worth</span>
                <h2 className="text-3xl font-black mt-1 tracking-tight">{formatRupiah(balance)}</h2>
              </div>
              <span className="text-2xl animate-pulse">✨</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5">
                <div className="flex items-center space-x-1 text-emerald-200 text-xs">
                  <ArrowDownRight size={14} />
                  <span>Pemasukan</span>
                </div>
                <p className="font-bold text-sm text-emerald-100 mt-0.5">{formatRupiah(totalIncome)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5">
                <div className="flex items-center space-x-1 text-rose-200 text-xs">
                  <ArrowUpRight size={14} />
                  <span>Pengeluaran</span>
                </div>
                <p className="font-bold text-sm text-rose-100 mt-0.5">{formatRupiah(totalExpense)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RANDOM MATCHA TIP */}
        <div className={`p-3.5 rounded-2xl border ${darkMode ? 'bg-[#243326]/60 border-[#344d37]' : 'bg-[#e8f5e9]/80 border-[#a1cca5]/40'} flex items-center space-x-3`}>
          <span className="text-xl">💡</span>
          <p className="text-xs font-medium leading-relaxed italic text-[#588157] dark:text-[#a1cca5]">
            "{MATCHA_TIPS[Math.floor(Math.random() * MATCHA_TIPS.length)]}"
          </p>
        </div>

        {/* TABS NAVIGATION */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            
            {/* SAVINGS GOALS PREVIEW */}
            <div className={`p-4 rounded-3xl border ${cardBg} shadow-sm space-y-3`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm flex items-center space-x-1.5">
                  <Target size={16} className="text-[#709775]" />
                  <span>Matcha Savings Goals 👛</span>
                </h3>
                <button 
                  onClick={() => setActiveTab('goals')} 
                  className="text-xs font-bold text-[#709775] hover:underline flex items-center"
                >
                  Lihat Semua <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-2.5">
                {goals.slice(0, 2).map((g) => {
                  const percent = Math.min(100, Math.round((g.current / g.target) * 100));
                  return (
                    <div key={g.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{g.icon} {g.name}</span>
                        <span className="text-[#709775]">{percent}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#709775] to-[#a1cca5] transition-all duration-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TRANSAKSI TERAKHIR */}
            <div className={`p-4 rounded-3xl border ${cardBg} shadow-sm space-y-3`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm flex items-center space-x-1.5">
                  <List size={16} className="text-[#709775]" />
                  <span>Recent Activity 🍃</span>
                </h3>
                <button 
                  onClick={() => setActiveTab('transactions')} 
                  className="text-xs font-bold text-[#709775] hover:underline flex items-center"
                >
                  Semua <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-2.5">
                {transactions.slice(0, 4).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#709775]/5 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#709775]/10 flex items-center justify-center text-lg">
                        {MATCHA_CATEGORIES.find(c => c.name === t.category)?.emoji || '🍃'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-snug">{t.title}</h4>
                        <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 mt-0.5">
                          <span>{t.date}</span>
                          <span>•</span>
                          <span className="text-[#709775] font-medium">{t.tag}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs font-extrabold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB TRANSAKSI LENGKAP */}
        {activeTab === 'transactions' && (
          <div className="space-y-3">
            {/* SEARCH & FILTER */}
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari transaksi / hashtag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-2xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#709775] ${cardBg}`}
                />
              </div>
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`px-3 py-2 rounded-2xl border text-xs focus:outline-none ${cardBg}`}
              >
                <option value="All">Semua Kategori</option>
                {MATCHA_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            {/* LIST TRANSAKSI */}
            <div className="space-y-2">
              {filteredTransactions.map((t) => (
                <div key={t.id} className={`p-3 rounded-2xl border ${cardBg} flex items-center justify-between shadow-sm`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#709775]/10 flex items-center justify-center text-lg">
                      {MATCHA_CATEGORIES.find(c => c.name === t.category)?.emoji || '🍵'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold">{t.title}</h4>
                      <p className="text-[10px] text-gray-400">{t.date} • {t.paymentMethod} • <span className="text-[#709775]">{t.tag}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-extrabold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                    </span>
                    <button 
                      onClick={() => handleDeleteTransaction(t.id)}
                      className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB SAVINGS GOALS */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm">Target Tabungan Aesthetic 👛</h3>
              <button 
                onClick={() => setShowGoalModal(true)}
                className="px-3 py-1.5 rounded-2xl bg-[#709775] text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-
