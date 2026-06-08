import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Plus, Search, Trash2, Edit3, X, TrendingUp, DollarSign, Calendar, Filter,
  ChevronLeft, ChevronRight, BarChart3, ArrowUpRight, Flame, Users, Download, Check
} from 'lucide-react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, LinearScale,
  BarElement, PointElement, LineElement
)

interface Expense {
  _id: string
  amount: number
  category: string
  date: string
  description: string
  paymentMethod: string
  isSplit?: boolean
  splitPeopleCount?: number
  splitPeopleNames?: string[]
  isSettled?: boolean
}

interface Stats {
  total: { amount: number; count: number }
  categoryBreakdown: { category: string; totalAmount: number; count: number }[]
  monthlySummary: { year: number; month: number; monthName: string; totalAmount: number; count: number }[]
}

interface Pagination {
  totalItems: number
  totalPages: number
  currentPage: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

const CATEGORIES = [
  'Food & Dining', 'Shopping', 'Transport', 'Entertainment',
  'Rent & Utilities', 'Health', 'Education', 'Other'
]

const CATEGORY_COLORS = [
  '#6366f1', '#ec4899', '#3b82f6', '#10b981',
  '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'
]

const CATEGORY_BADGES: Record<string, string> = {
  'Food & Dining': 'bg-amber-50 text-amber-700 border border-amber-200/50',
  'Shopping': 'bg-pink-50 text-pink-700 border border-pink-200/50',
  'Transport': 'bg-blue-50 text-blue-700 border border-blue-200/50',
  'Entertainment': 'bg-purple-50 text-purple-700 border border-purple-200/50',
  'Rent & Utilities': 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
  'Health': 'bg-red-50 text-red-700 border border-red-200/50',
  'Education': 'bg-indigo-50 text-indigo-700 border border-indigo-200/50',
  'Other': 'bg-gray-50 text-gray-700 border border-gray-200/50',
}

const VIBE_CATEGORIES: Record<string, { label: string; emoji: string }> = {
  'Food & Dining': { label: 'Munch Fund', emoji: '🍕' },
  'Transport': { label: 'Fuel Money', emoji: '🚗' },
  'Shopping': { label: 'Glow Up Fund', emoji: '🛍️' },
  'Entertainment': { label: 'Chill Budget', emoji: '🎮' },
  'Health': { label: 'Body First', emoji: '💊' },
  'Education': { label: 'Brain Fuel', emoji: '📚' },
  'Rent & Utilities': { label: 'Survival Bills', emoji: '🏠' },
  'Other': { label: 'Random Stuff', emoji: '💸' },
}

const emptyExpense = {
  amount: '',
  category: 'Food & Dining',
  date: new Date().toISOString().split('T')[0],
  description: '',
  paymentMethod: 'UPI',
  isSplit: false,
  splitPeopleCount: '2',
  splitPeopleNamesStr: '',
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [sortBy, setSortBy] = useState('date:desc')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyExpense)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Local settings
  const [dailyBudget, setDailyBudget] = useState(1000)
  const [weeklyBudget, setWeeklyBudget] = useState(7000)
  const [monthlyBudget, setMonthlyBudget] = useState(30000)
  const [currencySymbol, setCurrencySymbol] = useState('₹')
  const [vibeEnabled, setVibeEnabled] = useState(false)
  const [streakDays, setStreakDays] = useState(0)
  const [showShortcutTooltip, setShowShortcutTooltip] = useState(() => !localStorage.getItem('shortcutTooltipShown'))
  const [showShareCard, setShowShareCard] = useState(false)
  const [activeTab, setActiveTab] = useState<'transactions' | 'analytics'>('transactions')

  useEffect(() => {
    const db = localStorage.getItem('dailyBudget')
    const wb = localStorage.getItem('weeklyBudget')
    const mb = localStorage.getItem('monthlyBudget')
    const cur = localStorage.getItem('currency')
    const vib = localStorage.getItem('vibeEnabled')

    if (db) setDailyBudget(Number(db))
    if (wb) setWeeklyBudget(Number(wb))
    if (mb) setMonthlyBudget(Number(mb))
    if (cur) setCurrencySymbol(cur)
    if (vib) setVibeEnabled(vib === 'true')
  }, [])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Particle Confetti
  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: any[] = []
    const colors = ['#6366f1', '#3b82f6', '#10b981', '#ec4899', '#f59e0b']

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 16 - 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 8 - 4,
      })
    }

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p, index) => {
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.4
        p.vx *= 0.98
        p.rotation += p.rotSpeed

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()

        if (p.y > canvas.height + 20) {
          particles.splice(index, 1)
        }
      })

      frame++
      if (particles.length > 0 && frame < 150) {
        requestAnimationFrame(animate)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    animate()
  }

  const fetchExpenses = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(page),
      limit: '10',
      sortBy,
    })
    if (searchQuery) params.set('q', searchQuery)
    if (filterCategory) params.set('category', filterCategory)

    try {
      const res = await fetch(`/api/expenses?${params}`)
      const json = await res.json()
      if (json.success) {
        setExpenses(json.data)
        setPagination(json.pagination)
      }
    } catch {
      showToast('Failed to load transaction ledger', 'error')
    }
  }, [page, searchQuery, filterCategory, sortBy])

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses/stats')
      const json = await res.json()
      if (json.success) setStats(json.data)
    } catch {
      /* silent */
    }
  }, [])

  const calculateStreak = useCallback(async () => {
    try {
      const res = await fetch('/api/expenses?limit=100')
      const json = await res.json()
      if (json.success && json.data) {
        const loggedDates = new Set(json.data.map((e: any) => e.date.split('T')[0]))
        let streak = 0
        let current = new Date()
        
        while (true) {
          const dateStr = current.toISOString().split('T')[0]
          if (loggedDates.has(dateStr)) {
            streak++
            current.setDate(current.getDate() - 1)
          } else {
            if (streak === 0) {
              const yesterday = new Date()
              yesterday.setDate(yesterday.getDate() - 1)
              const yesterdayStr = yesterday.toISOString().split('T')[0]
              if (loggedDates.has(yesterdayStr)) {
                current.setDate(current.getDate() - 1)
                continue
              }
            }
            break
          }
        }
        setStreakDays(streak)
      }
    } catch {
      /* silent */
    }
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  useEffect(() => {
    fetchStats()
    calculateStreak()
  }, [fetchStats, calculateStreak])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault()
        localStorage.setItem('shortcutTooltipShown', 'true')
        setShowShortcutTooltip(false)
        openAdd()
      }
      if (e.key === 'Escape') {
        setShowModal(false)
        setShowDeleteConfirm(null)
        setShowShareCard(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSubmit = async () => {
    if (!form.amount || !form.description) {
      showToast('Required fields are missing', 'error')
      return
    }

    const payload: any = {
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      description: form.description,
      paymentMethod: form.paymentMethod,
      isSplit: form.isSplit,
    }

    if (form.isSplit) {
      payload.splitPeopleCount = Number(form.splitPeopleCount) || 2
      payload.splitPeopleNames = form.splitPeopleNamesStr
        ? form.splitPeopleNamesStr.split(',').map((n) => n.trim())
        : []
      payload.isSettled = false
    }

    const url = editingId ? `/api/expenses/${editingId}` : '/api/expenses'
    const method = editingId ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.success) {
        showToast(editingId ? 'Expense slip updated' : 'Expense slip saved')
        setShowModal(false)
        setEditingId(null)
        setForm(emptyExpense)
        fetchExpenses()
        fetchStats()
        calculateStreak()
        
        const spentToday = expenses
          .filter((e) => e.date.split('T')[0] === new Date().toISOString().split('T')[0])
          .reduce((sum, e) => sum + e.amount, 0)
        
        if (spentToday + Number(payload.amount) < dailyBudget) {
          triggerConfetti()
        }
      }
    } catch {
      showToast('Network error', 'error')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        showToast('Expense removed')
        setShowDeleteConfirm(null)
        fetchExpenses()
        fetchStats()
        calculateStreak()
      }
    } catch {
      showToast('Failed to delete record', 'error')
    }
  }

  const handleSettleSplit = async (id: string) => {
    try {
      const original = expenses.find((e) => e._id === id)
      if (!original) return
      
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...original, isSettled: true })
      })
      const json = await res.json()
      if (json.success) {
        showToast('Settled successfully')
        fetchExpenses()
        fetchStats()
      }
    } catch {
      showToast('Settlement fail', 'error')
    }
  }

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyExpense)
    setShowModal(true)
  }

  const openEdit = (exp: Expense) => {
    setEditingId(exp._id)
    setForm({
      amount: String(exp.amount),
      category: exp.category,
      date: exp.date.split('T')[0],
      description: exp.description,
      paymentMethod: exp.paymentMethod,
      isSplit: !!exp.isSplit,
      splitPeopleCount: String(exp.splitPeopleCount || '2'),
      splitPeopleNamesStr: exp.splitPeopleNames ? exp.splitPeopleNames.join(', ') : '',
    })
    setShowModal(true)
  }

  const getCatDisplay = (cat: string) => {
    if (vibeEnabled && VIBE_CATEGORIES[cat]) {
      return `${VIBE_CATEGORIES[cat].emoji} ${VIBE_CATEGORIES[cat].label}`
    }
    return cat
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const spentToday = expenses
    .filter((e) => e.date.split('T')[0] === todayStr)
    .reduce((sum, e) => sum + e.amount, 0)
  
  const dailyRemaining = Math.max(dailyBudget - spentToday, 0)
  const dailyPct = Math.min((spentToday / dailyBudget) * 100, 100)
  const getProgressBarColor = (pct: number) => {
    if (pct < 70) return 'bg-indigo-600'
    if (pct < 95) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const startOfWeekStr = startOfWeek.toISOString().split('T')[0]
  const spentThisWeek = expenses
    .filter((e) => e.date >= startOfWeekStr)
    .reduce((sum, e) => sum + e.amount, 0)
  
  const weeklyRatio = spentThisWeek / weeklyBudget
  let grade = 'A+'
  let gradeExplanation = 'Excellent savings hygiene!'
  
  if (weeklyRatio > 1.2) {
    grade = 'F'
    gradeExplanation = 'Budget overrun occurred.'
  } else if (weeklyRatio > 1.0) {
    grade = 'D'
    gradeExplanation = 'Limit exceeded.'
  } else if (weeklyRatio > 0.8) {
    grade = 'C'
    gradeExplanation = 'Approaching weekly limit.'
  } else if (weeklyRatio > 0.6) {
    grade = 'B'
    gradeExplanation = 'Moderate spending.'
  } else if (weeklyRatio > 0.4) {
    grade = 'A'
    gradeExplanation = 'Healthy budget range.'
  }

  const unsettledSplits = expenses.filter((e) => e.isSplit && !e.isSettled)
  const totalOwed = unsettledSplits.reduce((sum, e) => {
    const count = e.splitPeopleCount || 2
    const share = e.amount / count
    return sum + (e.amount - share)
  }, 0)

  const subsMap: Record<string, { totalAmount: number; count: number; name: string }> = {}
  expenses.forEach((e) => {
    const cleanDesc = e.description.toLowerCase().trim()
    const isLikelySub = cleanDesc.includes('netflix') || cleanDesc.includes('spotify') ||
      cleanDesc.includes('youtube') || cleanDesc.includes('cloud') ||
      cleanDesc.includes('premium') || cleanDesc.includes('gym') ||
      cleanDesc.includes('amazon') || cleanDesc.includes('recharge')
    
    if (isLikelySub) {
      if (!subsMap[cleanDesc]) {
        subsMap[cleanDesc] = { totalAmount: 0, count: 0, name: e.description }
      }
      subsMap[cleanDesc].totalAmount += e.amount
      subsMap[cleanDesc].count += 1
    }
  })

  // Chart Formatting
  const doughnutData = {
    labels: stats?.categoryBreakdown.map((c) => getCatDisplay(c.category)) || [],
    datasets: [
      {
        data: stats?.categoryBreakdown.map((c) => c.totalAmount) || [],
        backgroundColor: CATEGORY_COLORS.slice(0, stats?.categoryBreakdown.length || 0),
        borderWidth: 0,
        hoverOffset: 2,
      },
    ],
  }

  const payments = { cash: 0, upi: 0, card: 0 }
  expenses.forEach((e) => {
    if (e.paymentMethod === 'UPI') payments.upi++
    else if (e.paymentMethod === 'Card') payments.card++
    else payments.cash++
  })
  
  const paymentDoughnutData = {
    labels: ['UPI', 'Card', 'Cash'],
    datasets: [
      {
        data: [payments.upi, payments.card, payments.cash],
        backgroundColor: ['#6366f1', '#3b82f6', '#10b981'],
        borderWidth: 0,
      },
    ],
  }

  const months = stats?.monthlySummary.map((m) => m.monthName).reverse() || []
  const values = stats?.monthlySummary.map((m) => m.totalAmount).reverse() || []
  
  let forecastVal = 0
  if (values.length > 0) {
    const currentMonthVal = values[values.length - 1]
    const daysInMonth = 30
    const currentDay = new Date().getDate()
    forecastVal = Math.round((currentMonthVal / Math.max(currentDay, 1)) * daysInMonth)
  }

  const barData = {
    labels: [...months, 'Forecasted'],
    datasets: [
      {
        label: 'Spend Ledger',
        data: [...values, 0],
        backgroundColor: '#4f46e5',
        borderRadius: 2,
      },
      {
        label: 'Linear Projection',
        data: [...new Array(values.length).fill(0), forecastVal],
        backgroundColor: forecastVal > (values[values.length - 2] || 0) ? '#ef4444' : '#10b981',
        borderRadius: 2,
      }
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af', font: { size: 9, family: 'monospace' } },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#9ca3af', font: { size: 9, family: 'monospace' } },
        grid: { color: '#f3f4f6' },
      },
    },
  }

  const getPersonalityLabel = () => {
    let foodSum = 0
    let shopSum = 0
    let eduSum = 0
    let totalSum = 0

    expenses.forEach((e) => {
      totalSum += e.amount
      if (e.category === 'Food & Dining') foodSum += e.amount
      else if (e.category === 'Shopping') shopSum += e.amount
      else if (e.category === 'Education') eduSum += e.amount
    })

    if (totalSum === 0) return 'Silent Saver 🧠'
    if (foodSum / totalSum > 0.4) return 'Chai Budget Broke ☕'
    if (shopSum / totalSum > 0.35) return 'Impulse King 🛍️'
    if (eduSum / totalSum > 0.25) return 'Always Leveling Up 📈'
    return 'Silent Saver 🧠'
  }

  const generateAndDownloadCard = () => {
    const label = getPersonalityLabel()
    const canvas = document.createElement('canvas')
    canvas.width = 1080
    canvas.height = 1920
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, 1080, 1920)

    ctx.fillStyle = '#09090b'
    ctx.font = 'bold 56px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('EXPENSLEEK // INSIGHT', 540, 320)

    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#e4e4e7'
    ctx.lineWidth = 1
    
    const x = 140, y = 550, w = 800, h = 800, r = 12
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#09090b'
    ctx.font = 'bold 56px sans-serif'
    ctx.fillText(label, 540, 920)

    ctx.fillStyle = '#71717a'
    ctx.font = '32px monospace'
    ctx.fillText(`SPENT TODAY: ${currencySymbol}${spentToday}`, 540, 1040)
    ctx.fillText(`WEEKLY SCORE: ${grade}`, 540, 1100)

    ctx.fillStyle = '#a1a1aa'
    ctx.font = '28px monospace'
    ctx.fillText('FINANCIAL PROFILE GENERATED BY SYSTEM', 540, 1720)

    const link = document.createElement('a')
    link.download = 'personality-report.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  const emptyMessages = [
    "No expenses logged in this window.",
    "Clean ledger sheet.",
    "No records found matching query filter."
  ]
  const [emptyMsg] = useState(() => emptyMessages[Math.floor(Math.random() * emptyMessages.length)])

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#09090B] pt-24 pb-16 px-6 font-sans">
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />

      {showShortcutTooltip && (
        <div className="fixed bottom-6 right-6 bg-white border border-[#E4E4E7] text-[#09090B] px-3.5 py-2.5 rounded shadow-sm z-40 flex items-center gap-3 text-xs">
          <span>Press <kbd className="bg-gray-100 px-1 py-0.5 border border-gray-200 rounded font-mono font-bold">N</kbd> to log.</span>
          <button onClick={() => setShowShortcutTooltip(false)} className="text-[#a1a1aa] hover:text-[#09090b]">✕</button>
        </div>
      )}

      <div className="max-w-[76rem] mx-auto">
        
        {/* ── Metric Strip ───────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#E4E4E7] divide-x divide-[#E4E4E7] mb-10 pb-6">
          {[
            { label: 'BALANCE SPENT', val: `${currencySymbol}${stats?.total.amount.toLocaleString('en-IN') || '0.00'}` },
            { label: 'TRANSACTIONS', val: stats?.total.count || '0' },
            { label: 'CATEGORIES ACTIVE', val: stats?.categoryBreakdown.length || '0' },
            { label: 'TOTAL OWED TO YOU', val: `${currencySymbol}${totalOwed.toLocaleString('en-IN')}` }
          ].map((item, idx) => (
            <div key={idx} className="px-6 py-2">
              <span className="text-[10px] tracking-widest text-gray-400 font-bold block">{item.label}</span>
              <span className="text-2xl font-semibold tracking-tight text-gray-900 block mt-1">{item.val}</span>
            </div>
          ))}
        </div>

        {/* ── Two-Column Layout ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT COLUMN: Main Ledger View */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* View Switcher tab */}
            <div className="flex border-b border-[#E4E4E7]">
              <button
                onClick={() => setActiveTab('transactions')}
                className={`pb-3 text-xs font-semibold tracking-wider uppercase border-b-2 px-4 transition-all ${
                  activeTab === 'transactions' ? 'border-[#09090B] text-[#09090B]' : 'border-transparent text-gray-400'
                }`}
              >
                Ledger Entries
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`pb-3 text-xs font-semibold tracking-wider uppercase border-b-2 px-4 transition-all ${
                  activeTab === 'analytics' ? 'border-[#09090B] text-[#09090B]' : 'border-transparent text-gray-400'
                }`}
              >
                Analytics & Trends
              </button>
            </div>

            {activeTab === 'transactions' ? (
              <div className="space-y-4">
                
                {/* Clean inline filter inputs */}
                <div className="flex flex-wrap items-center gap-3 bg-white border border-[#E4E4E7] rounded p-2.5">
                  <div className="flex items-center gap-2 flex-1 min-w-[200px] border-r border-[#E4E4E7] pr-3">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search description..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                      className="bg-transparent text-xs text-gray-900 focus:outline-none w-full"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={filterCategory}
                      onChange={(e) => { setFilterCategory(e.target.value); setPage(1) }}
                      className="bg-transparent text-xs text-gray-600 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="">All Categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{getCatDisplay(c)}</option>
                      ))}
                    </select>

                    <span className="w-px h-4 bg-[#E4E4E7]" />

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs text-gray-600 focus:outline-none cursor-pointer font-medium"
                    >
                      <option value="date:desc">Newest First</option>
                      <option value="date:asc">Oldest First</option>
                      <option value="amount:desc">Highest Price</option>
                      <option value="amount:asc">Lowest Price</option>
                    </select>
                  </div>
                </div>

                {/* Ledger Sheet Table */}
                <div className="bg-white border border-[#E4E4E7] rounded overflow-hidden">
                  <div className="hidden md:block">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#E4E4E7] bg-gray-50/50">
                          {['Description', 'Category', 'Amount', 'Date', 'Method', 'Actions'].map((h) => (
                            <th key={h} className="text-[10px] font-bold text-gray-400 py-3 px-6 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E4E4E7]">
                        {expenses.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-gray-400 italic">
                              {emptyMsg}
                            </td>
                          </tr>
                        ) : (
                          expenses.map((exp) => (
                            <tr key={exp._id} className="hover:bg-gray-50/30 transition-colors">
                              <td className="py-3.5 px-6 font-semibold text-gray-900 max-w-[200px] truncate">
                                <div className="flex flex-col">
                                  <span>{exp.description}</span>
                                  {exp.isSplit && (
                                    <span className="text-[9px] text-amber-700 font-mono mt-0.5">
                                      Owed: {currencySymbol}{((exp.amount - (exp.amount / (exp.splitPeopleCount || 2)))).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3.5 px-6">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${CATEGORY_BADGES[exp.category] || 'badge-other'}`}>
                                  {getCatDisplay(exp.category)}
                                </span>
                              </td>
                              <td className="py-3.5 px-6 font-bold text-gray-900 font-mono">
                                {currencySymbol}{exp.amount.toLocaleString()}
                              </td>
                              <td className="py-3.5 px-6 text-gray-400 font-mono">
                                {new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                              </td>
                              <td className="py-3.5 px-6">
                                <span className="text-[10px] text-gray-500 bg-gray-150 px-1.5 py-0.5 rounded font-mono">
                                  {exp.paymentMethod}
                                </span>
                              </td>
                              <td className="py-3.5 px-6">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => openEdit(exp)} className="text-gray-400 hover:text-gray-900 transition-colors p-1 rounded hover:bg-gray-100">
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => setShowDeleteConfirm(exp._id)} className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards view */}
                  <div className="block md:hidden p-4 space-y-4">
                    {expenses.length === 0 ? (
                      <div className="py-12 text-center text-gray-400 italic">
                        {emptyMsg}
                      </div>
                    ) : (
                      expenses.map((exp) => (
                        <div key={exp._id} className="p-4 rounded border border-[#E4E4E7] bg-white flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900">{exp.description}</h4>
                              <span className="text-[10px] text-gray-400 block mt-0.5">{new Date(exp.date).toLocaleDateString()}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-950 font-mono">
                              {currencySymbol}{exp.amount}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-semibold ${CATEGORY_BADGES[exp.category] || 'badge-other'}`}>
                              {getCatDisplay(exp.category)}
                            </span>
                            <span className="text-[9px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                              {exp.paymentMethod}
                            </span>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-[#E4E4E7] mt-1">
                            <button onClick={() => openEdit(exp)} className="text-[10px] font-semibold px-2.5 py-1.5 rounded transition-colors flex items-center gap-1 border border-[#E4E4E7] text-gray-600 hover:bg-gray-50">
                              Edit
                            </button>
                            <button onClick={() => setShowDeleteConfirm(exp._id)} className="text-[10px] font-semibold px-2.5 py-1.5 rounded transition-colors bg-red-50 text-red-600 hover:bg-red-100">
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pagination control strip */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-[#E4E4E7] bg-gray-50/50">
                      <span className="text-gray-400 text-xs">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      <div className="flex gap-2">
                        <button
                          disabled={!pagination.hasPrevPage}
                          onClick={() => setPage((p) => p - 1)}
                          className="p-1.5 rounded border border-[#E4E4E7] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={!pagination.hasNextPage}
                          onClick={() => setPage((p) => p + 1)}
                          className="p-1.5 rounded border border-[#E4E4E7] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              // ANALYTICS & CHARTS PANEL
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-[#E4E4E7] rounded p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-4">Category breakdown</h3>
                    <div className="h-60 flex items-center justify-center">
                      {stats && stats.categoryBreakdown.length > 0 ? (
                        <Doughnut
                          data={doughnutData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: { color: '#71717a', font: { size: 9, family: 'monospace' } },
                              },
                            },
                            cutout: '75%',
                          }}
                        />
                      ) : (
                        <p className="text-xs text-gray-400 italic">No breakdown available.</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-[#E4E4E7] rounded p-6">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-4">Payment Analytics</h3>
                    <div className="h-60 flex items-center justify-center">
                      <Doughnut
                        data={paymentDoughnutData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                              labels: { color: '#71717a', font: { size: 9, family: 'monospace' } },
                            },
                          },
                          cutout: '75%',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#E4E4E7] rounded p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-4">Spend Trends & linear projections</h3>
                  <div className="h-60">
                    <Bar data={barData} options={chartOptions} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar Widgets (Cleanly Structured) */}
          <div className="space-y-6">
            
            {/* Widget: Daily Budget */}
            <div className="bg-white border border-[#E4E4E7] rounded p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Target</span>
                  <h3 className="text-xs font-bold text-gray-900 mt-0.5">Today's Budget</h3>
                </div>
                <span className="text-[10px] font-mono text-gray-500 bg-gray-50 border border-gray-150 px-2 py-0.5 rounded">
                  Limit: {currencySymbol}{dailyBudget}
                </span>
              </div>

              <div className="my-2.5">
                <div className="flex justify-between items-end text-[10px] mb-1 font-mono">
                  <span className="text-gray-400">SPENT: {currencySymbol}{spentToday}</span>
                  <span className="font-bold">{Math.round(dailyPct)}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${getProgressBarColor(dailyPct)}`}
                    style={{ width: `${dailyPct}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100 text-[10px] font-mono text-gray-400">
                <span>REMAINING: {currencySymbol}{dailyRemaining}</span>
                {spentToday > dailyBudget ? (
                  <span className="text-red-500 font-bold">Bro you cooked 💀</span>
                ) : (
                  <span className="text-[#10b981] font-semibold">Under Budget</span>
                )}
              </div>
            </div>

            {/* Widget: Performance grade & streaks */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-[#E4E4E7] rounded p-4 text-center flex flex-col justify-between items-center">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">STREAK</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center my-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-xs font-bold text-gray-900">🔥 {streakDays} days</span>
              </div>

              <div className="bg-white border border-[#E4E4E7] rounded p-4 text-center flex flex-col justify-between items-center">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">GRADE</span>
                <div className="text-xl font-bold text-gray-900 my-1.5 w-8 h-8 flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
                  {grade}
                </div>
                <span className="text-[9px] text-gray-400 line-clamp-1">{gradeExplanation}</span>
              </div>
            </div>

            {/* Widget: Subscription detector */}
            <div className="bg-white border border-[#E4E4E7] rounded p-5">
              <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Watchdog</span>
              <h4 className="text-xs font-bold text-gray-900 mt-0.5">Recurring Subscriptions</h4>
              
              <div className="space-y-2.5 mt-4 max-h-[140px] overflow-y-auto pr-1">
                {Object.keys(subsMap).length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic">No subscriptions detected</p>
                ) : (
                  Object.values(subsMap).map((sub: any, idx) => {
                    const yearlyVal = sub.totalAmount * 12
                    const exceedsWarning = yearlyVal > 10000
                    return (
                      <div key={idx} className="flex justify-between items-center text-xs p-1.5 rounded bg-gray-50 border border-gray-100">
                        <div>
                          <span className="font-semibold block truncate max-w-[120px]">{sub.name}</span>
                        </div>
                        <span className={`font-mono font-bold ${exceedsWarning ? 'text-red-500' : 'text-gray-800'}`}>
                          {currencySymbol}{yearlyVal}/yr
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Widget: Character Generator */}
            <div className="bg-white border border-[#E4E4E7] rounded p-5 flex flex-col gap-3">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Persona</span>
                <h4 className="text-xs font-bold text-gray-900 mt-0.5">Spend Profile</h4>
                <div className="my-2.5 py-3 rounded bg-gray-50 border border-gray-100 text-center">
                  <span className="text-xs font-bold text-gray-800 font-mono">{getPersonalityLabel()}</span>
                </div>
              </div>
              <button
                onClick={() => setShowShareCard(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Share Profile Card
              </button>
            </div>

            {/* Pending Settlements Widget */}
            {unsettledSplits.length > 0 && (
              <div className="bg-white border border-[#E4E4E7] rounded p-5">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold block">Splits</span>
                <h4 className="text-xs font-bold text-gray-900 mt-0.5 mb-3">Pending Settlements</h4>
                
                <div className="space-y-3">
                  {unsettledSplits.map((split) => {
                    const count = split.splitPeopleCount || 2
                    const share = split.amount / count
                    const owedAmount = split.amount - share
                    return (
                      <div key={split._id} className="p-3 rounded bg-gray-50 border border-gray-150 flex flex-col gap-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold truncate max-w-[100px]">{split.description}</span>
                          <span className="font-mono text-gray-400">{new Date(split.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-gray-200/50 pt-2">
                          <div>
                            <span className="text-[8px] text-gray-400 block uppercase font-medium">Claim</span>
                            <span className="font-bold text-gray-950 font-mono">{currencySymbol}{owedAmount}</span>
                          </div>
                          <button
                            onClick={() => handleSettleSplit(split._id)}
                            className="bg-gray-950 hover:bg-gray-800 text-white text-[10px] font-semibold px-2 py-1 rounded"
                          >
                            Settle
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* ── Add/Edit Modal ────────────────────────── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="bg-white border border-[#E4E4E7] w-full max-w-md p-6 mx-4 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold text-gray-900">
                {editingId ? 'EDIT SLIP' : 'CREATE SLIP'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-[9px] uppercase tracking-wider mb-1 block font-bold">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="floating-input w-full rounded py-2 px-3 text-xs"
                  placeholder="Slip name / description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-[9px] uppercase tracking-wider mb-1 block font-bold">Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="floating-input w-full rounded py-2 px-3 text-xs"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-[9px] uppercase tracking-wider mb-1 block font-bold">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="floating-input w-full rounded py-2 px-3 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-[9px] uppercase tracking-wider mb-1 block font-bold">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="floating-input w-full rounded py-2 px-3 text-xs appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{getCatDisplay(c)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-[9px] uppercase tracking-wider mb-1 block font-bold">Method</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="floating-input w-full rounded py-2 px-3 text-xs appearance-none cursor-pointer"
                  >
                    {['Cash', 'UPI', 'Card'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-1 select-none">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isSplit}
                    onChange={(e) => setForm({ ...form, isSplit: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer accent-[#09090b]"
                  />
                  <span className="text-xs font-semibold text-gray-900">Split expense</span>
                </label>
              </div>

              {form.isSplit && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded bg-gray-50 border border-gray-200">
                  <div>
                    <label className="text-gray-400 text-[8px] uppercase tracking-wider mb-0.5 block font-bold">Total People</label>
                    <input
                      type="number"
                      value={form.splitPeopleCount}
                      onChange={(e) => setForm({ ...form, splitPeopleCount: e.target.value })}
                      className="floating-input w-full rounded py-1.5 px-2 text-xs"
                      min={2}
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-[8px] uppercase tracking-wider mb-0.5 block font-bold">Names</label>
                    <input
                      type="text"
                      value={form.splitPeopleNamesStr}
                      onChange={(e) => setForm({ ...form, splitPeopleNamesStr: e.target.value })}
                      className="floating-input w-full rounded py-1.5 px-2 text-xs"
                      placeholder="Aniket, Leo"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-800 transition-colors text-xs mt-3"
              >
                SAVE RECORD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Share Modal ──────────────────────────── */}
      {showShareCard && (
        <div className="modal-overlay" onClick={() => setShowShareCard(false)}>
          <div
            className="bg-white border border-[#E4E4E7] w-full max-w-sm p-6 mx-4 rounded flex flex-col gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center text-xs">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Share card preview</span>
              <button onClick={() => setShowShareCard(false)} className="text-gray-400 hover:text-gray-900">✕</button>
            </div>
            
            <div className="rounded border border-gray-200 bg-gray-50 p-6 text-center flex flex-col justify-between gap-6 h-[200px]">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400">ExpenSleek Profile</span>
                <h3 className="text-base font-bold text-gray-900 mt-2 font-mono">{getPersonalityLabel()}</h3>
              </div>
              <div className="text-xs text-gray-500 font-mono">
                GRADE: <span className="font-bold text-gray-900">{grade}</span>
              </div>
            </div>

            <button
              onClick={generateAndDownloadCard}
              className="bg-black text-white text-xs font-semibold py-2 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5" /> Download Image
            </button>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ───────────────────────── */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div
            className="bg-white border border-[#E4E4E7] p-6 max-w-sm mx-4 text-center rounded shadow-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xs font-bold mb-1 text-gray-900">Remove Expense?</h3>
            <p className="text-[11px] text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-1.5 rounded border border-[#E4E4E7] text-gray-500 hover:bg-gray-50 transition-colors text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white transition-colors text-xs font-semibold"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ─────────────────────────────────── */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
