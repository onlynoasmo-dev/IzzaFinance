import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Wallet,
  List,
  Target,
  Download,
  Upload,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Sun,
  Moon,
  Search,
  X,
  ChevronRight,
  Database,
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const INITIAL_TRANSACTIONS = [
  {
    id: '1',
    title: 'Matcha Latte Oat',
    amount: 38000,
    type: 'expense',
    category: 'Minuman & Kafe',
    paymentMethod: 'QRIS',
    note: 'Sore hari',
    date: '2026-11-22'
  },
  {
    id: '2',
    title: 'Honor Proyek Desain',
    amount: 3500000,
    type: 'income',
    category: 'Pemasukan',
    paymentMethod: 'Transfer',
    note: 'Pembayaran klien',
    date: '2026-11-18'
  },
  {
    id: '3',
    title: 'Kebutuhan Perawatan Diri',
    amount: 245000,
    type: 'expense',
    category: 'Perawatan',
    paymentMethod: 'E-Wallet',
    note: 'Stok bulanan',
    date: '2026-11-15'
  },
  {
    id: '4',
    title: 'Belanja Pakaian',
    amount: 120000,
    type: 'expense',
    category: 'Sandang',
    paymentMethod: 'QRIS',
    note: 'Diskon akhir bulan',
    date: '2026-10-28'
  },
  {
    id: '5',
    title: 'Tiket Acara Musik',
    amount: 850000,
    type: 'expense',
    category: 'Hiburan',
    paymentMethod: 'Transfer',
    note: 'Sudah lunas',
    date: '2026-08-14'
  }
];

const INITIAL_GOALS = [
  { id: 'g1', name: 'Dana Acara Musik', target: 1500000, current: 950000 },
  { id: 'g2', name: 'Dana Tablet Baru', target: 12000000, current: 4800000 },
  { id: 'g3', name: 'Dana Liburan', target: 5000000, current: 2300000 }
];

const CATEGORIES = [
  { name: 'Minuman & Kafe', color: '#588157' },
  { name: 'Perawatan', color: '#84a98c' },
  { name: 'Sandang', color: '#a3b18a' },
  { name: 'Hiburan', color: '#6b9080' },
  { name: 'Makanan', color: '#3a5a40' },
  { name: 'Pemasukan', color: '#2d6a4f' },
  { name: 'Lainnya', color: '#95d5b2' }
];

const parseLocalDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

const formatDateISO = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const sumByType = (list, txType) => {
  return list
    .filter((item) => item.type === txType)
    .reduce((acc, item) => acc + Number(item.amount || 0), 0);
};

export default function App() {
  const todayStr = useMemo(() => formatDateISO(new Date()), []);
  const currentMonthPrefix = todayStr.slice(0, 7);

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('izza_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('izza_goals');
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Filter untuk riwayat transaksi
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Mode pengecekan khusus: 'weekly' (Minggu Ini) atau 'range' (Range Tanggal)
  const [checkMode, setCheckMode] = useState('weekly');
  const [rangeStart, setRangeStart] = useState(todayStr);
  const [rangeEnd, setRangeEnd] = useState(todayStr);

  // Form transaksi
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Minuman & Kafe');
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [note, setNote] = useState('');
  const [txDate, setTxDate] = useState(todayStr);

  // Form target tabungan
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  // Top-up tabungan
  const [topUpGoalId, setTopUpGoalId] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('izza_transactions', JSON.stringify(transactions));
    } catch {
      // Abaikan jika penyimpanan penuh
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('izza_goals', JSON.stringify(goals));
    } catch {
      // Abaikan jika penyimpanan penuh
    }
  }, [goals]);

  // 1. Saldo keuangan saat ini (seluruh data all-time, tidak berubah karena filter)
  const currentBalance = useMemo(() => {
    const allIncome = sumByType(transactions, 'income');
    const allExpense = sumByType(transactions, 'expense');
    return allIncome - allExpense;
  }, [transactions]);

  // 2. Data Hari Ini (tanpa filter)
  const todayTransactions = useMemo(() => {
    return transactions.filter((t) => t.date === todayStr);
  }, [transactions, todayStr]);

  const todayIncome = useMemo(() => sumByType(todayTransactions, 'income'), [todayTransactions]);
  const todayExpense = useMemo(() => sumByType(todayTransactions, 'expense'), [todayTransactions]);

  // 3. Data Bulan Ini (tanpa filter)
  const monthTransactions = useMemo(() => {
    return transactions.filter((t) => t.date && t.date.startsWith(currentMonthPrefix));
  }, [transactions, currentMonthPrefix]);

  const monthIncome = useMemo(() => sumByType(monthTransactions, 'income'), [monthTransactions]);
  const monthExpense = useMemo(() => sumByType(monthTransactions, 'expense'), [monthTransactions]);

  // 4. Data Minggu Ini (7 hari terakhir sampai hari ini) atau Range Tanggal
  const weeklyStartStr = useMemo(() => {
    const ref = parseLocalDate(todayStr) || new Date();
    const start = new Date(ref);
    start.setDate(ref.getDate() - 6);
    return formatDateISO(start);
  }, [todayStr]);

  const checkedTransactions = useMemo(() => {
    if (checkMode === 'weekly') {
      return transactions.filter(
        (t) => t.date && t.date >= weeklyStartStr && t.date <= todayStr
      );
    }
    return transactions.filter((t) => {
      if (!t.date) return false;
      if (rangeStart && t.date < rangeStart) return false;
      if (rangeEnd && t.date > rangeEnd) return false;
      return true;
    });
  }, [transactions, checkMode, weeklyStartStr, todayStr, rangeStart, rangeEnd]);

  const checkedIncome = useMemo(
    () => sumByType(checkedTransactions, 'income'),
    [checkedTransactions]
  );
  const checkedExpense = useMemo(
    () => sumByType(checkedTransactions, 'expense'),
    [checkedTransactions]
  );

  // Grafik pengeluaran bulan ini
  const monthExpenseChartData = useMemo(() => {
    const map = {};
    monthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + Number(t.amount || 0);
      });
    return Object.keys(map).map((key) => ({
      name: key,
      value: map[key]
    }));
  }, [monthTransactions]);

  // Filter riwayat transaksi
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        t.title.toLowerCase().includes(q) ||
        (t.note || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q);
      const matchCategory = filterCategory === 'All' || t.category === filterCategory;
      return matchQuery && matchCategory;
    });
  }, [transactions, searchQuery, filterCategory]);

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    const newItem = {
      id: Date.now().toString(),
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      paymentMethod,
      note: note.trim(),
      date: txDate || todayStr
    };

    setTransactions([newItem, ...transactions]);
    setTitle('');
    setAmount('');
    setNote('');
    setTxDate(todayStr);
    setShowAddModal(false);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalName.trim() || !goalTarget) return;

    const newGoal = {
      id: Date.now().toString(),
      name: goalName.trim(),
      target: Number(goalTarget),
      current: 0
    };

    setGoals([...goals, newGoal]);
    setGoalName('');
    setGoalTarget('');
    setShowGoalModal(false);
  };

  const handleTopUpGoal = (goalId) => {
    const val = Number(topUpAmount);
    if (!val || val <= 0) return;

    setGoals(
      goals.map((g) => {
        if (g.id === goalId) {
          return { ...g, current: Math.min(g.target, g.current + val) };
        }
        return g;
      })
    );
    setTopUpGoalId(null);
    setTopUpAmount('');
  };

  const exportJSON = () => {
    const payload = JSON.stringify({ transactions, goals }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `izzafinance_backup_${todayStr}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const header = 'ID,Tanggal,Judul,Tipe,Kategori,Metode,Nominal,Catatan\n';
    const rows = transactions
      .map(
        (t) =>
          `${t.id},${t.date},"${(t.title || '').replace(/"/g, '""')}",${t.type},"${
            t.category
          }",${t.paymentMethod},${t.amount},"${(t.note || '').replace(/"/g, '""')}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `izzafinance_transaksi_${todayStr}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result || '{}');
        if (Array.isArray(parsed.transactions) && Array.isArray(parsed.goals)) {
          setTransactions(parsed.transactions);
          setGoals(parsed.goals);
          alert('Data berhasil dipulihkan.');
        } else {
          alert('Format file backup tidak sesuai.');
        }
      } catch {
        alert('Gagal membaca file JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const resetAllData = () => {
    if (window.confirm('Reset semua data ke pengaturan awal?')) {
      setTransactions(INITIAL_TRANSACTIONS);
      setGoals(INITIAL_GOALS);
      localStorage.removeItem('izza_transactions');
      localStorage.removeItem('izza_goals');
    }
  };

  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(Number(val || 0));
  };

  const bgMain = darkMode
    ? 'bg-[#162018] text-[#e8f3ea]'
    : 'bg-[#f3f7f4] text-[#223326]';
  const cardBg = darkMode
    ? 'bg-[#1f2d22] border-[#314736]'
    : 'bg-white border-[#dce8df]';
  const mutedText = darkMode ? 'text-[#9cb5a1]' : 'text-[#637868]';

  return (
    <div className={`min-h-screen ${bgMain} font-sans pb-24 transition-colors duration-200`}>
      {/* HEADER */}
      <header
        className={`sticky top-0 z-20 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between ${
          darkMode
            ? 'bg-[#162018]/90 border-[#314736]'
            : 'bg-[#f3f7f4]/90 border-[#dce8df]'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#588157] text-white flex items-center justify-center shadow-sm">
            <Wallet size={18} />
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight tracking-tight">IzzaFinance</h1>
            <p className={`text-[11px] ${mutedText}`}>Catatan Keuangan Pribadi</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Ganti tema"
          className={`p-2 rounded-xl border ${cardBg} transition-colors`}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </header>

      {/* KONTEN UTAMA */}
      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* KARTU SALDO SAAT INI (SELALU TAMPIL BESAR & TETAP) */}
        <section className="rounded-3xl bg-gradient-to-br from-[#588157] to-[#3a5a40] text-white p-5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#d8e8dc] uppercase tracking-wider">
              Saldo Saat Ini
            </span>
            <span className="text-[11px] bg-white/15 px-2.5 py-0.5 rounded-full">
              Terkini
            </span>
          </div>
          <p className="text-3xl font-extrabold tracking-tight mt-1.5">
            {formatRupiah(currentBalance)}
          </p>
          <p className="text-[11px] text-[#dce8df] mt-1.5">
            Akumulasi seluruh pemasukan dikurangi pengeluaran
          </p>
        </section>

        {/* TAB DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* RINGKASAN HARI INI (TANPA FILTER) */}
            <section className={`p-4 rounded-3xl border ${cardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">Hari Ini</h2>
                <span className={`text-xs ${mutedText}`}>{todayStr}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div
                  className={`p-3 rounded-2xl border ${
                    darkMode
                      ? 'bg-[#172219] border-[#2b3f30]'
                      : 'bg-[#f6faf7] border-[#e2ede5]'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <ArrowDownRight size={14} />
                    <span>Pemasukan</span>
                  </div>
                  <p className="text-sm font-bold mt-1">{formatRupiah(todayIncome)}</p>
                </div>

                <div
                  className={`p-3 rounded-2xl border ${
                    darkMode
                      ? 'bg-[#172219] border-[#2b3f30]'
                      : 'bg-[#f6faf7] border-[#e2ede5]'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                    <ArrowUpRight size={14} />
                    <span>Pengeluaran</span>
                  </div>
                  <p className="text-sm font-bold mt-1">{formatRupiah(todayExpense)}</p>
                </div>
              </div>
            </section>

            {/* RINGKASAN BULAN INI (TANPA FILTER) */}
            <section className={`p-4 rounded-3xl border ${cardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">Bulan Ini</h2>
                <span className={`text-xs ${mutedText}`}>{currentMonthPrefix}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div
                  className={`p-3 rounded-2xl border ${
                    darkMode
                      ? 'bg-[#172219] border-[#2b3f30]'
                      : 'bg-[#f6faf7] border-[#e2ede5]'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingUp size={14} />
                    <span>Pemasukan</span>
                  </div>
                  <p className="text-sm font-bold mt-1">{formatRupiah(monthIncome)}</p>
                </div>

                <div
                  className={`p-3 rounded-2xl border ${
                    darkMode
                      ? 'bg-[#172219] border-[#2b3f30]'
                      : 'bg-[#f6faf7] border-[#e2ede5]'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
                    <TrendingDown size={14} />
                    <span>Pengeluaran</span>
                  </div>
                  <p className="text-sm font-bold mt-1">{formatRupiah(monthExpense)}</p>
                </div>
              </div>
            </section>

            {/* CEK MINGGU INI ATAU RANGE TANGGAL */}
            <section className={`p-4 rounded-3xl border ${cardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Calendar size={15} className="text-[#588157]" />
                  <h2 className="text-sm font-bold">Cek Periode</h2>
                </div>

                <div className="flex rounded-xl p-0.5 bg-[#588157]/10">
                  <button
                    type="button"
                    onClick={() => setCheckMode('weekly')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      checkMode === 'weekly'
                        ? 'bg-[#588157] text-white'
                        : 'text-[#588157] dark:text-[#a3c4a8]'
                    }`}
                  >
                    Minggu Ini
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckMode('range')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      checkMode === 'range'
                        ? 'bg-[#588157] text-white'
                        : 'text-[#588157] dark:text-[#a3c4a8]'
                    }`}
                  >
                    Range Tanggal
                  </button>
                </div>
              </div>

              {checkMode === 'weekly' ? (
                <p className={`text-xs ${mutedText}`}>
                  Periode 7 hari terakhir: {weeklyStartStr} s/d {todayStr}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={`text-[11px] font-medium ${mutedText}`}>Dari Tanggal</label>
                    <input
                      type="date"
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                      className={`w-full mt-1 px-2.5 py-1.5 rounded-xl border text-xs ${cardBg}`}
                    />
                  </div>
                  <div>
                    <label className={`text-[11px] font-medium ${mutedText}`}>Sampai Tanggal</label>
                    <input
                      type="date"
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value)}
                      className={`w-full mt-1 px-2.5 py-1.5 rounded-xl border text-xs ${cardBg}`}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div
                  className={`p-3 rounded-2xl border ${
                    darkMode
                      ? 'bg-[#172219] border-[#2b3f30]'
                      : 'bg-[#f6faf7] border-[#e2ede5]'
                  }`}
                >
                  <span className={`text-[11px] ${mutedText}`}>Pemasukan</span>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatRupiah(checkedIncome)}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-2xl border ${
                    darkMode
                      ? 'bg-[#172219] border-[#2b3f30]'
                      : 'bg-[#f6faf7] border-[#e2ede5]'
                  }`}
                >
                  <span className={`text-[11px] ${mutedText}`}>Pengeluaran</span>
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                    {formatRupiah(checkedExpense)}
                  </p>
                </div>
              </div>

              {checkedTransactions.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {checkedTransactions.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1.5 border-t border-[#dce8df]/60 dark:border-[#314736]"
                    >
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className={`text-[11px] ${mutedText}`}>
                          {item.date} • {item.category}
                        </p>
                      </div>
                      <span
                        className={`font-bold ${
                          item.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {item.type === 'income' ? '+' : '-'}
                        {formatRupiah(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={`text-xs text-center py-2 ${mutedText}`}>
                  Tidak ada transaksi pada periode ini.
                </p>
              )}
            </section>

            {/* GRAFIK PENGELUARAN BULAN INI */}
            <section className={`p-4 rounded-3xl border ${cardBg} space-y-3`}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold">Distribusi Pengeluaran Bulan Ini</h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('transactions')}
                  className="text-xs font-semibold text-[#588157] dark:text-[#a3c4a8] flex items-center"
                >
                  Riwayat <ChevronRight size={14} />
                </button>
              </div>

              {monthExpenseChartData.length === 0 ? (
                <p className={`text-xs text-center py-5 ${mutedText}`}>
                  Belum ada pengeluaran di bulan ini.
                </p>
              ) : (
                <div className="space-y-3">
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={monthExpenseChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={66}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {monthExpenseChartData.map((entry, idx) => (
                            <Cell
                              key={entry.name}
                              fill={CATEGORIES[idx % CATEGORIES.length].color}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val) => formatRupiah(val)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {monthExpenseChartData.map((d, idx) => (
                      <div key={d.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 truncate">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: CATEGORIES[idx % CATEGORIES.length].color
                            }}
                          />
                          <span className="truncate">{d.name}</span>
                        </div>
                        <span className={`font-medium ml-1 ${mutedText}`}>
                          {formatRupiah(d.value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* TAB RIWAYAT TRANSAKSI */}
        {activeTab === 'transactions' && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search size={15} className={`absolute left-3 top-2.5 ${mutedText}`} />
                <input
                  type="text"
                  placeholder="Cari nama atau catatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 rounded-2xl border text-xs focus:outline-none ${cardBg}`}
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`px-3 py-2 rounded-2xl border text-xs focus:outline-none ${cardBg}`}
              >
                <option value="All">Semua</option>
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {filteredTransactions.length === 0 ? (
              <div className={`p-6 rounded-3xl border ${cardBg} text-center text-xs ${mutedText}`}>
                Belum ada transaksi yang sesuai.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTransactions.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-2xl border ${cardBg} flex items-center justify-between`}
                  >
                    <div>
                      <p className="text-xs font-bold">{t.title}</p>
                      <p className={`text-[11px] mt-0.5 ${mutedText}`}>
                        {t.date} • {t.category} • {t.paymentMethod}
                      </p>
                      {t.note && <p className={`text-[11px] mt-0.5 ${mutedText}`}>{t.note}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-bold ${
                          t.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatRupiah(t.amount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTransaction(t.id)}
                        aria-label="Hapus transaksi"
                        className={`p-1.5 rounded-lg ${mutedText} hover:text-rose-600`}
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

        {/* TAB TARGET TABUNGAN */}
        {activeTab === 'goals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Target Tabungan</h2>
              <button
                type="button"
                onClick={() => setShowGoalModal(true)}
                className="px-3 py-1.5 rounded-xl bg-[#588157] text-white text-xs font-semibold flex items-center space-x-1"
              >
                <Plus size={14} />
                <span>Tambah Target</span>
              </button>
            </div>

            <div className="space-y-3">
              {goals.map((g) => {
                const percent = Math.min(100, Math.round((g.current / g.target) * 100));
                return (
                  <div key={g.id} className={`p-4 rounded-3xl border ${cardBg} space-y-3`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-bold">{g.name}</h3>
                        <p className={`text-[11px] mt-0.5 ${mutedText}`}>
                          {formatRupiah(g.current)} dari {formatRupiah(g.target)}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#588157] dark:text-[#a3c4a8]">
                        {percent}%
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-[#588157]/15 overflow-hidden">
                      <div
                        className="h-full bg-[#588157] rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {topUpGoalId === g.id ? (
                      <div className="flex space-x-2 pt-1">
                        <input
                          type="number"
                          placeholder="Nominal"
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                          className={`flex-1 px-3 py-1.5 rounded-xl border text-xs ${cardBg}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleTopUpGoal(g.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#588157] text-white text-xs font-semibold"
                        >
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => setTopUpGoalId(null)}
                          className={`px-2.5 py-1.5 rounded-xl border text-xs ${cardBg}`}
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setTopUpGoalId(g.id);
                          setTopUpAmount('');
                        }}
                        className="w-full py-2 rounded-2xl border border-[#588157] text-[#588157] dark:text-[#a3c4a8] text-xs font-semibold hover:bg-[#588157] hover:text-white transition-colors"
                      >
                        Tambah Dana
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB DATA & PANDUAN ANDROID */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <section className={`p-4 rounded-3xl border ${cardBg} space-y-3`}>
              <h2 className="text-sm font-bold">Kelola Data Lokal</h2>
              <p className={`text-xs leading-relaxed ${mutedText}`}>
                Data tersimpan otomatis di browser perangkat ini. Unduh cadangan secara berkala
                sebelum membersihkan data browser atau pindah perangkat.
              </p>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={exportJSON}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#588157] text-white text-xs font-semibold flex items-center justify-center space-x-2"
                >
                  <Download size={14} />
                  <span>Unduh Backup (.JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={exportCSV}
                  className="w-full py-2.5 px-4 rounded-2xl border border-[#588157] text-[#588157] dark:text-[#a3c4a8] text-xs font-semibold flex items-center justify-center space-x-2"
                >
                  <Download size={14} />
                  <span>Ekspor Tabel (.CSV)</span>
                </button>

                <label
                  className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer ${cardBg}`}
                >
                  <Upload size={14} />
                  <span>Pulihkan dari File (.JSON)</span>
                  <input type="file" accept=".json" onChange={importJSON} className="hidden" />
                </label>

                <button
                  type="button"
                  onClick={resetAllData}
                  className="w-full py-2.5 px-4 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-semibold flex items-center justify-center space-x-2"
                >
                  <Trash2 size={14} />
                  <span>Reset Data</span>
                </button>
              </div>
            </section>

            <section className={`p-4 rounded-3xl border ${cardBg} space-y-2`}>
              <h2 className="text-sm font-bold">Pasang ke Layar Android</h2>
              <p className={`text-xs leading-relaxed ${mutedText}`}>
                Buka alamat aplikasi ini di Google Chrome Android, ketuk menu titik tiga di kanan
                atas, lalu pilih <strong>Tambahkan ke layar utama</strong> atau{' '}
                <strong>Instal aplikasi</strong>. Aplikasi akan muncul sebagai ikon mandiri di layar
                depan.
              </p>
            </section>
          </div>
        )}
      </main>

      {/* MODAL INPUT TRANSAKSI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl border ${cardBg} p-5 space-y-4`}>
            <div className="flex items-center justify-between border-b border-[#dce8df] dark:border-[#314736] pb-3">
              <h3 className="text-sm font-bold">Catat Transaksi</h3>
              <button type="button" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-3">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#588157]/10">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    type === 'expense'
                      ? 'bg-[#588157] text-white'
                      : 'text-[#588157] dark:text-[#a3c4a8]'
                  }`}
                >
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    type === 'income'
                      ? 'bg-[#588157] text-white'
                      : 'text-[#588157] dark:text-[#a3c4a8]'
                  }`}
                >
                  Pemasukan
                </button>
              </div>

              <div>
                <label className={`text-[11px] font-semibold ${mutedText}`}>Keterangan</label>
                <input
                  type="text"
                  placeholder="Contoh: Makan siang / Gaji"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full mt-1 px-3 py-2 rounded-2xl border text-xs ${cardBg}`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`text-[11px] font-semibold ${mutedText}`}>Nominal (Rp)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="25000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`w-full mt-1 px-3 py-2 rounded-2xl border text-xs ${cardBg}`}
                    required
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-semibold ${mutedText}`}>Tanggal</label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className={`w-full mt-1 px-3 py-2 rounded-2xl border text-xs ${cardBg}`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`text-[11px] font-semibold ${mutedText}`}>Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full mt-1 px-3 py-2 rounded-2xl border text-xs ${cardBg}`}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`text-[11px] font-semibold ${mutedText}`}>Metode Bayar</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={`w-full mt-1 px-3 py-2 rounded-2xl border text-xs ${cardBg}`}
                  >
                    <option value="QRIS">QRIS</option>
                    <option value="E-Wallet">E-Wallet</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Tunai">Tunai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`text-[11px] font-semibold ${mutedText}`}>Catatan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Catatan singkat"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={`w-full mt-1 px-3 py-2 rounded-2xl border text-xs ${cardBg}`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#588157] text-white text-xs font-bold mt-1"
              >
                Simpan Transaksi
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH TARGET TABUNGAN */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className={`w-full max-w-md rounded-t-3xl sm:rounded-3xl border ${cardBg} p-5 space-y-4`}>
            <div className="flex items-center justify-between border-b border-[#dce8df] dark:border-[#314736] pb-3">
              <h3 className="text-sm font-bold">Target Tabungan Baru</h3>
              <button type="button" onClick={() => setShowGoalModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-3">
              <div>
                <label className={`text-[11px] font-semibold ${mutedText}`}>Nama Target</label>
                <input
                  type="text"
                  placeholder="Contoh: Dana Darurat"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className={`w-full mt-1 px-3 py-2 rounded-2xl border text-xs ${cardBg}`}
                  required
                />
              </div>

              <div>
                <label className={`text-[11px] font-semibold ${mutedText}`}>Target Nominal (Rp)</label>
                <input
                  type="number"
                  min="1"
                  placeholder="2000000"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  className={`w-full mt-1 px-3 py-2 rounded-2xl border text-xs ${cardBg}`}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#588157] text-white text-xs font-bold mt-1"
              >
                Simpan Target
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NAVIGASI BAWAH */}
      <nav
        className={`fixed bottom-0 left-0 right-0 z-30 max-w-md mx-auto border-t backdrop-blur-md px-5 py-2 flex items-center justify-between ${
          darkMode
            ? 'bg-[#162018]/95 border-[#314736]'
            : 'bg-white/95 border-[#dce8df]'
        }`}
      >
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'dashboard' ? 'text-[#588157] dark:text-[#a3c4a8]' : mutedText
          }`}
        >
          <Wallet size={18} />
          <span className="text-[10px] font-semibold">Beranda</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'transactions' ? 'text-[#588157] dark:text-[#a3c4a8]' : mutedText
          }`}
        >
          <List size={18} />
          <span className="text-[10px] font-semibold">Riwayat</span>
        </button>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          aria-label="Tambah transaksi"
          className="w-11 h-11 rounded-2xl bg-[#588157] text-white flex items-center justify-center shadow-md -mt-4 active:scale-95 transition-transform"
        >
          <Plus size={22} />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('goals')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'goals' ? 'text-[#588157] dark:text-[#a3c4a8]' : mutedText
          }`}
        >
          <Target size={18} />
          <span className="text-[10px] font-semibold">Target</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center space-y-1 ${
            activeTab === 'settings' ? 'text-[#588157] dark:text-[#a3c4a8]' : mutedText
          }`}
        >
          <Database size={18} />
          <span className="text-[10px] font-semibold">Data</span>
        </button>
      </nav>
    </div>
  );
}
