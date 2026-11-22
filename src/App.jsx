import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Wallet, List, Target, Download, Upload, Trash2,
  ArrowUpRight, ArrowDownRight, Sun, Moon, Search, X, ChevronRight,
  PiggyBank, Calendar
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const INITIAL_TRANSACTIONS = [
  { id: '1', title: 'Iced Oat Matcha Latte 🍵', amount: 38000, type: 'expense', category: 'Matcha & Coffee', paymentMethod: 'QRIS', tag: '#MatchaDaily', date: '2026-11-22' },
  { id: '2', title: 'Gaji Freelance Aesthetic Design ✨', amount: 3500000, type: 'income', category: 'Gaji / Income', paymentMethod: 'Transfer', tag: '#CuanEra', date: '2026-11-18' },
  { id: '3', title: 'Skincare Cushion & Lip Tint 💄', amount: 245000, type: 'expense', category: 'Beauty & Skincare', paymentMethod: 'E-Wallet', tag: '#SelfCare', date: '2026-11-15' },
  { id: '4', title: 'Thrifting Cardigan Oversize 👗', amount: 120000, type: 'expense', category: 'Fashion & OOTD', paymentMethod: 'QRIS', tag: '#OOTDGoals', date: '2026-10-28' },
  { id: '5', title: 'Tiket Konser Niki 🎟️', amount: 850000, type: 'expense', category: 'Entertainment', paymentMethod: 'Transfer', tag: '#ConcertLife', date: '2026-08-14' },
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

const PERIOD_OPTIONS = [
  { id: 'all', label: 'Selama Ini' },
  { id: 'daily', label: 'Harian' },
  { id: 'weekly', label: 'Mingguan' },
  { id: 'monthly', label: 'Bulanan' },
  { id: 'yearly', label: 'Tahunan' },
  { id: 'custom', label: 'Range Tanggal' }
];

const MONTHS = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' }
];

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

export default function App() {
  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

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

  // Filter Periode State
  const [periodMode, setPeriodMode] = useState('all');
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedMonth, setSelectedMonth] = useState(todayStr.slice(5, 7));
  const [selectedYear, setSelectedYear] = useState(todayStr.slice(0, 4));
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);

  // Modal Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Matcha & Coffee');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [tag, setTag] = useState('#MatchaDaily');
  const [txDate, setTxDate] = useState(todayStr);

  // Goal Form State
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalIcon, setGoalIcon] = useState('🍵');

  // Top Up Goal State
  const [topUpGoalId, setTopUpGoalId] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('slay_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('slay_goals', JSON.stringify(goals));
  }, [goals]);

  const availableYears = useMemo(() => {
    const years = new Set([todayStr.slice(0, 4)]);
    transactions.forEach((t) => {
      if (t.date && t.date.length >= 4) {
        years.add(t.date.slice(0, 4));
      }
    });
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [transactions, todayStr]);

  const periodTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!t.date) return periodMode === 'all';
      if (periodMode === 'all') return true;
      if (periodMode === 'daily') return t.date === selectedDate;

      if (periodMode === 'weekly') {
        const txD = parseLocalDate(t.date);
        const refD = parseLocalDate(selectedDate);
        if (!txD || !refD) return false;
        const startWeek = new Date(refD);
        startWeek.setDate(refD.getDate() - 6);
        return txD >= startWeek && txD <= refD;
      }

      if (periodMode === 'monthly') {
        return t.date.slice(0, 7) === `${selectedYear}-${selectedMonth}`;
      }

      if (periodMode === 'yearly') {
        return t.date.slice(0, 4) === selectedYear;
      }

      if (periodMode === 'custom') {
        if (startDate && t.date < startDate) return false;
        if (endDate && t.date > endDate) return false;
        return true;
      }

      return true;
    });
  }, [transactions, periodMode, selectedDate, selectedMonth, selectedYear, startDate, endDate]);

  const periodLabel = useMemo(() => {
    if (periodMode === 'all') return 'Selama Ini (All Time)';
    if (periodMode === 'daily') return `Harian • ${selectedDate}`;
    if (periodMode === 'weekly') {
      const refD = parseLocalDate(selectedDate) || new Date();
      const startWeek = new Date(refD);
      startWeek.setDate(refD.getDate() - 6);
      const sw = `${startWeek.getFullYear()}-${String(startWeek.getMonth() + 1).padStart(2, '0')}-${String(startWeek.getDate()).padStart(2, '0')}`;
      return `Mingguan • ${sw} s/d ${selectedDate}`;
    }
    if (periodMode === 'monthly') {
      const mName = MONTHS.find((m) => m.value === selectedMonth)?.label || selectedMonth;
      return `Bulanan • ${mName} ${selectedYear}`;
    }
    if (periodMode === 'yearly') return `Tahunan • ${selectedYear}`;
    if (periodMode === 'custom') return `Range • ${startDate || '...'} s/d ${endDate || '...'}`;
    return 'Selama Ini';
  }, [periodMode, selectedDate, selectedMonth, selectedYear, startDate, endDate]);

  const totalIncome = useMemo(() => {
    return periodTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [periodTransactions]);

  const totalExpense = useMemo(() => {
    return periodTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, curr) => acc + Number(curr.amount), 0);
  }, [periodTransactions]);

  const balance = totalIncome - totalExpense;

  const chartData = useMemo(() => {
    const catMap = {};
    periodTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        catMap[t.category] = (catMap[t.category] || 0) + Number(t.amount);
      });
    return Object.keys(catMap).map((cat) => ({
      name: cat,
      value: catMap[cat]
    }));
  }, [periodTransactions]);

  const filteredTransactions = useMemo(() => {
    return periodTransactions.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.tag || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = filterCategory === 'All' || t.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [periodTransactions, searchQuery, filterCategory]);

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
      date: txDate || todayStr
    };

    setTransactions([newTx, ...transactions]);
    setTitle('');
    setAmount('');
    setTxDate(todayStr);
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
    setGoals(
      goals.map((g) => {
        if (g.id === id) {
          return { ...g, current: Math.min(g.target, g.current + Number(topUpAmount)) };
        }
        return g;
      })
    );
    setTopUpGoalId(null);
    setTopUpAmount('');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const exportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ transactions, goals }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `slay_finance_backup_${todayStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,ID,Tanggal,Judul,Tipe,Kategori,Metode,Nominal,Tag\n';
    transactions.forEach((t) => {
      csvContent += `${t.id},${t.date},"${t.title}",${t.type},"${t.category}",${t.paymentMethod},${t.amount},"${t.tag}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transaksi_slayfinance_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const importJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.transactions && parsed.goals) {
            setTransactions(parsed.transactions);
            setGoals(parsed.goals);
            alert('✨ Berhasil restore data SlayFinance kamu!');
          } else {
            alert('File tidak valid.');
          }
        } catch (err) {
          alert('Gagal membaca file JSON.');
        }
      };
    }
  };

  const resetAllData = () => {
    if (window.confirm('Yakin mau hapus semua data dan kembali ke awal?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      setGoals(INITIAL_GOALS);
      localStorage.clear();
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const bgMain = darkMode ? 'bg-[#1b241c] text-[#e8f5e9]' : 'bg-[#f4f7f4] text-[#2c3e2e]';
  const cardBg = darkMode ? 'bg-[#243326] border-[#344d37]' : 'bg-white border-[#d8e8d9]';

  return (
    <div className={`min-h-screen ${bgMain} font-sans pb-24 transition-colors duration-300`}>
      <header
        className={`sticky top-0 z-20 backdrop-blur-md ${
          darkMode ? 'bg-[#1b241c]/80 border-[#344d37]' : 'bg-[#f4f7f4]/80 border-[#d8e8d9]'
        } border-b px-4 py-3 flex items-center justify-between`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#709775] to-[#a1cca5] flex items-center justify-center text-white shadow-md shadow-[#709775]/20">
            <span className="text-xl">🍵</span>
          </div>
          <div>
            <h1 className="font-extrabold text-lg tracking-tight flex items-center space-x-1">
              <span>Izza Finance</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#709775]/20 text-[#709775] font-semibold">
                Matcha 🍃
              </span>
            </h1>
            <p className="text-[#8fb996] text-xs font-medium">Money Tracker of Izza</p>
          </div>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-xl border ${
            darkMode
              ? 'bg-[#243326] border-[#344d37] text-amber-300'
              : 'bg-white border-[#d8e8d9] text-[#709775]'
          } transition-transform active:scale-95 shadow-sm`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* PANEL FILTER PERIODE HARIAN / MINGGUAN / BULANAN / TAHUNAN / RANGE */}
        <div className={`p-3.5 rounded-3xl border ${cardBg} shadow-sm space-y-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#709775]">
              <Calendar size={15} />
              <span>Filter Periode Data</span>
            </div>
            {periodMode !== 'all' && (
              <button
                type="button"
                onClick={() => setPeriodMode('all')}
                className="text-[11px] font-bold text-[#709775] hover:underline"
              >
                Reset (Selama Ini)
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPeriodMode(opt.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-colors ${
                  periodMode === opt.id
                    ? 'bg-[#709775] text-white'
                    : darkMode
                    ? 'bg-[#1b241c] text-[#a1cca5] border border-[#344d37]'
                    : 'bg-[#f4f7f4] text-[#588157] border border-[#d8e8d9]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {(periodMode === 'daily' || periodMode === 'weekly') && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">
                {periodMode === 'daily' ? 'Pilih Tanggal Harian' : 'Tanggal Akhir (7 Hari ke Belakang)'}
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-2xl border text-xs ${cardBg}`}
              />
            </div>
          )}

          {periodMode === 'monthly' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Pilih Bulan</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-2xl border text-xs ${cardBg}`}
                >
                  {MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Pilih Tahun</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-2xl border text-xs ${cardBg}`}
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {periodMode === 'yearly' && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">Pilih Tahun</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-2xl border text-xs ${cardBg}`}
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          )}

          {periodMode === 'custom' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Dari Tanggal</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-2xl border text-xs ${cardBg}`}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Sampai Tanggal</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`w-full px-3 py-1.5 rounded-2xl border text-xs ${cardBg}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* BANNER SALDO MENGIKUTI PERIODE */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#709775] via-[#588157] to-[#3a5a40] text-white p-6 shadow-xl shadow-[#709775]/20">
          <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none text-9xl font-bold">
            🍃
          </div>
          <div className="relative z-10 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#d8e8d9] font-semibold">
                  {periodLabel}
                </span>
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
                <p className="font-bold text-sm text-emerald-100 mt-0.5">
                  {formatRupiah(totalIncome)}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5">
                <div className="flex items-center space-x-1 text-rose-200 text-xs">
                  <ArrowUpRight size={14} />
                  <span>Pengeluaran</span>
                </div>
                <p className="font-bold text-sm text-rose-100 mt-0.5">
                  {formatRupiah(totalExpense)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RANDOM MATCHA TIP */}
        <div
          className={`p-3.5 rounded-2xl border ${
            darkMode
              ? 'bg-[#243326]/60 border-[#344d37]'
              : 'bg-[#e8f5e9]/80 border-[#a1cca5]/40'
          } flex items-center space-x-3`}
        >
          <span className="text-xl">💡</span>
          <p className="text-xs font-medium leading-relaxed italic text-[#588157] dark:text-[#a1cca5]">
            "{MATCHA_TIPS[Math.floor(Math.random() * MATCHA_TIPS.length)]}"
          </p>
        </div>

        {/* TAB DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
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
                        <span>
                          {g.icon} {g.name}
                        </span>
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

            <div className={`p-4 rounded-3xl border ${cardBg} shadow-sm space-y-3`}>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm flex items-center space-x-1.5">
                  <List size={16} className="text-[#709775]" />
                  <span>Aktivitas Periode Ini 🍃</span>
                </h3>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-bold text-[#709775] hover:underline flex items-center"
                >
                  Semua <ChevronRight size={14} />
                </button>
              </div>

              {periodTransactions.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  Belum ada transaksi pada periode ini.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {periodTransactions.slice(0, 4).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#709775]/5 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#709775]/10 flex items-center justify-center text-lg">
                          {MATCHA_CATEGORIES.find((c) => c.name === t.category)?.emoji || '🍃'}
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
                      <span
                        className={`text-xs font-extrabold ${
                          t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatRupiah(t.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB RIWAYAT TRANSAKSI */}
        {activeTab === 'transactions' && (
          <div className="space-y-3">
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
                {MATCHA_CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className={`p-6 rounded-3xl border ${cardBg} text-center text-xs text-gray-400`}>
                Tidak ada transaksi yang cocok dengan filter ini.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTransactions.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-2xl border ${cardBg} flex items-center justify-between shadow-sm`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#709775]/10 flex items-center justify-center text-lg">
                        {MATCHA_CATEGORIES.find((c) => c.name === t.category)?.emoji || '🍵'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">{t.title}</h4>
                        <p className="text-[10px] text-gray-400">
                          {t.date} • {t.paymentMethod} •{' '}
                          <span className="text-[#709775]">{t.tag}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-extrabold ${
                          t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatRupiah(t.amount)}
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
            )}
          </div>
        )}

        {/* TAB SAVINGS GOALS */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm">Target Tabungan Aesthetic 👛</h3>
              <button
                onClick={() => setShowGoalModal(true)}
                className="px-3 py-1.5 rounded-2xl bg-[#709775] text-white text-xs font-bold flex items-center space-x-1 shadow-md shadow-[#709775]/20"
              >
                <Plus size={14} />
                <span>Target Baru</span>
              </button>
            </div>

            <div className="space-y-3">
              {goals.map((g) => {
                const percent = Math.min(100, Math.round((g.current / g.target) * 100));
                return (
                  <div key={g.id} className={`p-4 rounded-3xl border ${cardBg} space-y-3 shadow-sm`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl p-2 rounded-2xl bg-[#709775]/10">{g.icon}</span>
                        <div>
                          <h4 className="font-bold text-xs">{g.name}</h4>
                          <p className="text-[10px] text-gray-400">
                            {formatRupiah(g.current)} / {formatRupiah(g.target)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#709775] bg-[#709775]/10 px-2 py-1 rounded-full">
                        {percent}%
                      </span>
                    </div>

                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#709775] to-[#a1cca5] transition-all duration-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {topUpGoalId === g.id ? (
                      <div className="flex space-x-2 pt-1">
                        <input
                          type="number"
                          placeholder="Nominal Top-up"
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                          className={`flex-1 px-3 py-1 rounded-xl border text-xs ${cardBg}`}
                        />
                        <button
                          onClick={() => handleTopUpGoal(g.id)}
                          className="px-3 py-1 rounded-xl bg-[#709775] text-white text-xs font-bold"
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => setTopUpGoalId(null)}
                          className="px-2 py-1 rounded-xl border text-xs"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setTopUpGoalId(g.id)}
                        className="w-full py-2 rounded-2xl border border-[#709775] text-[#709775] text-xs font-bold hover:bg-[#709775] hover:text-white transition-colors"
                      >
                        + Top Up Tabungan 💖
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-3xl border ${cardBg} shadow-sm space-y-4`}>
              <h3 className="font-bold text-sm text-center">
                Analisis Pengeluaran ({periodLabel}) 📊
              </h3>

              {chartData.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">
                  Belum ada data pengeluaran pada periode ini.
                </p>
              ) : (
                <>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={MATCHA_CATEGORIES[index % MATCHA_CATEGORIES.length].color}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatRupiah(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {chartData.map((d, i) => (
                      <div key={d.name} className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: MATCHA_CATEGORIES[i % MATCHA_CATEGORIES.length].color
                          }}
                        />
                        <span className="truncate">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* TAB BACKUP & SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-3xl border ${cardBg} shadow-sm space-y-3`}>
              <h3 className="font-bold text-sm flex items-center space-x-2">
                <PiggyBank size={16} className="text-[#709775]" />
                <span>Kelola Data (100% Gratis & Safe) 🔒</span>
              </h3>
              <p className="text-xs text-gray-400">
                Data kamu otomatis tersimpan di HP/laptop ini (`localStorage`). Kamu bisa download
                backup-nya agar tidak hilang saat ganti perangkat.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={exportJSON}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#709775] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-[#709775]/20"
                >
                  <Download size={14} />
                  <span>Download Backup JSON</span>
                </button>

                <button
                  onClick={exportCSV}
                  className="w-full py-2.5 px-4 rounded-2xl border border-[#709775] text-[#709775] text-xs font-bold flex items-center justify-center space-x-2"
                >
                  <Download size={14} />
                  <span>Export Transaksi to Excel (.CSV)</span>
                </button>

                <label className="w-full py-2.5 px-4 rounded-2xl border border-gray-300 dark:border-gray-700 text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer">
                  <Upload size={14} />
                  <span>Restore Data dari JSON</span>
                  <input type="file" accept=".json" onChange={importJSON} className="hidden" />
                </label>

                <button
                  onClick={resetAllData}
                  className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-900/20 text-xs font-bold flex items-center justify-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Reset Semua Data</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL INPUT TRANSAKSI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl ${cardBg} p-5 space-y-4`}>
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-sm">Catat Cuan / Spending 🍃</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-3">
              <div className="flex rounded-2xl p-1 bg-gray-100 dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                    type === 'expense' ? 'bg-rose-500 text-white' : 'text-gray-400'
                  }`}
                >
                  Pengeluaran 💸
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                    type === 'income' ? 'bg-emerald-500 text-white' : 'text-gray-400'
                  }`}
                >
                  Pemasukan ✨
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Judul Transaksi</label>
                <input
                  type="text"
                  placeholder="Misal: Iced Matcha Oat Milk 🍵"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-2xl border text-xs mt-1 ${cardBg}`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Nominal (Rp)</label>
                  <input
                    type="number"
                    placeholder="38000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full px-3 py-2 rounded-2xl border text-xs mt-1 ${cardBg}`}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Tanggal</label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className={`w-full px-3 py-2 rounded-2xl border text-xs mt-1 ${cardBg}`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full px-3 py-2 rounded-2xl border text-xs mt-1 ${cardBg}`}
                  >
                    {MATCHA_CATEGORIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.emoji} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Pembayaran</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={`w-full px-3 py-2 rounded-2xl border text-xs mt-1 ${cardBg}`}
                  >
                    <option value="QRIS">QRIS</option>
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Hashtag Tag</label>
                <input
                  type="text"
                  placeholder="#MatchaDaily"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className={`w-full px-3 py-2 rounded-2xl border text-xs mt-1 ${cardBg}`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#709775] text-white font-bold text-xs shadow-lg shadow-[#709775]/30 mt-2"
              >
                Simpan Transaksi 💖
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ADD GOAL */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl ${cardBg} p-5 space-y-4`}>
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-sm">Target Impian Baru 👛</h3>
              <button onClick={() => setShowGoalModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nama Impian</label>
                <input
                  type="text"
                  placeholder="Misal: Liburan ke Japan ⛩️"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-2xl border text-xs mt-1 ${cardBg}`}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Target Biaya (Rp)</label>
                <input
                  type="number"
                  placeholder="5000000"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  className={`w-full px-3 py-2 rounded-2xl border text-xs mt-1 ${cardBg}`}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Pilih Emoji</label>
                <div className="flex space-x-2 mt-1">
                  {['🍵', '🎟️', '📱', '👗', '🌊', '✈️'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setGoalIcon(emoji)}
                      className={`p-2 rounded-xl text-lg ${
                        goalIcon === emoji ? 'bg-[#709775]/20 border border-[#709775]' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#709775] text-white font-bold text-xs shadow-lg shadow-[#709775]/30 mt-2"
              >
                Tambah Target ✨
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto ${
          darkMode ? 'bg-[#1b241c]/90 border-[#344d37]' : 'bg-white/90 border-[#d8e8d9]'
        } border-t backdrop-blur-md px-6 py-2 flex justify-between items-center rounded-t-3xl shadow-lg`}
      >
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'dashboard' ? 'text-[#709775]' : 'text-gray-400'
          }`}
        >
          <Wallet size={18} />
          <span className="text-[10px] font-semibold">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'transactions' ? 'text-[#709775]' : 'text-gray-400'
          }`}
        >
          <List size={18} />
          <span className="text-[10px] font-semibold">Riwayat</span>
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#709775] to-[#a1cca5] text-white flex items-center justify-center shadow-lg shadow-[#709775]/40 -mt-6 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>

        <button
          onClick={() => setActiveTab('goals')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'goals' ? 'text-[#709775]' : 'text-gray-400'
          }`}
        >
          <Target size={18} />
          <span className="text-[10px] font-semibold">Impian</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'settings' ? 'text-[#709775]' : 'text-gray-400'
          }`}
        >
          <PiggyBank size={18} />
          <span className="text-[10px] font-semibold">Data</span>
        </button>
      </nav>
    </div>
  );
}
