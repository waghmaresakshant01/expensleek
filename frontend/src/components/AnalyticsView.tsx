import { useState, useEffect } from 'react'
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement
} from 'chart.js'
import { Doughnut, Bar, Line } from 'react-chartjs-2'
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, ArrowUpRight, ArrowDownRight, Target, Zap } from 'lucide-react'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement)

interface Stats {
  total: { amount: number; count: number }
  categoryBreakdown: { category: string; totalAmount: number; count: number }[]
  monthlySummary: { year: number; month: number; monthName: string; totalAmount: number; count: number }[]
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#FF6B6B', Transport: '#4ECDC4', Entertainment: '#45B7D1',
  Shopping: '#96CEB4', Health: '#FFEAA7', Utilities: '#DDA0DD',
  Education: '#98D8C8', Travel: '#F7DC6F', Rent: '#BB8FCE',
  Groceries: '#82E0AA', Other: '#AEB6BF',
}

export default function AnalyticsView() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'trends'>('overview')

  useEffect(() => {
    fetch('/api/expenses/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalSpent = stats?.total.amount ?? 0
  const totalTx = stats?.total.count ?? 0
  const avgTx = totalTx > 0 ? totalSpent / totalTx : 0
  const topCategory = stats?.categoryBreakdown[0]

  const months = stats?.monthlySummary?.slice(-6) ?? []
  const currentMonthSpend = months[months.length - 1]?.totalAmount ?? 0
  const prevMonthSpend = months[months.length - 2]?.totalAmount ?? 0
  const monthChange = prevMonthSpend > 0 ? ((currentMonthSpend - prevMonthSpend) / prevMonthSpend) * 100 : 0

  const donutData = {
    labels: stats?.categoryBreakdown.map(c => c.category) ?? [],
    datasets: [{
      data: stats?.categoryBreakdown.map(c => c.totalAmount) ?? [],
      backgroundColor: stats?.categoryBreakdown.map(c => CATEGORY_COLORS[c.category] ?? '#AEB6BF') ?? [],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  }

  const barData = {
    labels: months.map(m => m.monthName?.substring(0, 3) ?? ''),
    datasets: [{
      label: 'Monthly Spending',
      data: months.map(m => m.totalAmount),
      backgroundColor: months.map((_, i) => i === months.length - 1 ? '#000' : '#E5E7EB'),
      borderRadius: 8,
      borderSkipped: false,
    }]
  }

  const lineData = {
    labels: months.map(m => m.monthName?.substring(0, 3) ?? ''),
    datasets: [{
      label: 'Spending Trend',
      data: months.map(m => m.totalAmount),
      borderColor: '#000',
      backgroundColor: 'rgba(0,0,0,0.05)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#000',
      pointRadius: 5,
    }]
  }

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 12 } } },
      y: { grid: { color: '#F3F4F6' }, ticks: { font: { size: 12 }, callback: (v: unknown) => `₹${Number(v).toLocaleString('en-IN')}` } }
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <BarChart3 size={12} /> Analytics
          </div>
          <h1 className="text-4xl font-bold text-black tracking-tight mb-2">Your Financial Overview</h1>
          <p className="text-gray-500 text-lg">Deep insights into your spending patterns and financial health.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : totalTx === 0 ? (
          // Empty state
          <div className="text-center py-24 bg-white rounded-3xl border border-black/5">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 size={36} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-3">No Data Yet</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">Start tracking your expenses in the dashboard to see beautiful analytics and insights here.</p>
            <div className="flex gap-3 justify-center text-sm text-gray-400">
              <span className="flex items-center gap-1">📊 Spending charts</span>
              <span className="flex items-center gap-1">📈 Monthly trends</span>
              <span className="flex items-center gap-1">🎯 Category breakdown</span>
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: <DollarSign size={18} />, sub: `${totalTx} transactions`, up: false },
                { label: 'Avg. Per Transaction', value: `₹${avgTx.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: <Target size={18} />, sub: 'per expense', up: true },
                { label: 'This Month', value: `₹${currentMonthSpend.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, icon: monthChange >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />, sub: `${monthChange >= 0 ? '+' : ''}${monthChange.toFixed(1)}% vs last month`, up: monthChange < 0 },
                { label: 'Top Category', value: topCategory?.category ?? '—', icon: <Zap size={18} />, sub: topCategory ? `₹${topCategory.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : 'No data', up: false },
              ].map((kpi, i) => (
                <div key={i} className="bg-white rounded-2xl border border-black/5 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">{kpi.label}</span>
                    <span className={`p-1.5 rounded-lg ${kpi.up ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>{kpi.icon}</span>
                  </div>
                  <div className="text-2xl font-bold text-black mb-1">{kpi.value}</div>
                  <div className="text-xs text-gray-400">{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-black/5 rounded-xl p-1 w-fit mb-8">
              {(['overview', 'categories', 'trends'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-black text-white shadow' : 'text-gray-500 hover:text-black'}`}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl border border-black/5 p-6">
                  <h3 className="text-lg font-bold text-black mb-1">Spending by Category</h3>
                  <p className="text-sm text-gray-400 mb-6">Where your money goes</p>
                  <div className="h-56"><Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { font: { size: 12 }, boxWidth: 12, padding: 12 } } }, cutout: '65%' }} /></div>
                </div>
                <div className="bg-white rounded-3xl border border-black/5 p-6">
                  <h3 className="text-lg font-bold text-black mb-1">Monthly Spending</h3>
                  <p className="text-sm text-gray-400 mb-6">Last 6 months at a glance</p>
                  <div className="h-56"><Bar data={barData} options={chartOpts as any} /></div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="bg-white rounded-3xl border border-black/5 p-6">
                <h3 className="text-lg font-bold text-black mb-6">Category Breakdown</h3>
                <div className="space-y-4">
                  {stats?.categoryBreakdown.map((cat, i) => {
                    const pct = totalSpent > 0 ? (cat.totalAmount / totalSpent) * 100 : 0
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[cat.category] ?? '#AEB6BF' }} />
                            <span className="text-sm font-medium text-black">{cat.category}</span>
                            <span className="text-xs text-gray-400">{cat.count} transactions</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-black">₹{cat.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                            <span className="text-xs text-gray-400 ml-2">{pct.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: CATEGORY_COLORS[cat.category] ?? '#AEB6BF' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'trends' && (
              <div className="bg-white rounded-3xl border border-black/5 p-6">
                <h3 className="text-lg font-bold text-black mb-1">Spending Trend</h3>
                <p className="text-sm text-gray-400 mb-6">Month-over-month progression</p>
                <div className="h-72"><Line data={lineData} options={chartOpts as any} /></div>
                <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-black/5">
                  {months.slice(-3).map((m, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-gray-400 mb-1">{m.monthName}</div>
                      <div className="text-lg font-bold text-black">₹{m.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                      <div className="text-xs text-gray-400">{m.count} expenses</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
