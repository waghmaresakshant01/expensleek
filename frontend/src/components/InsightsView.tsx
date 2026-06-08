import { useState, useEffect } from 'react'
import { Lightbulb, TrendingUp, Shield, Target, Clock, Coffee, ShoppingBag, Car, Zap, BookOpen, ChevronRight, Star } from 'lucide-react'

interface Stats {
  total: { amount: number; count: number }
  categoryBreakdown: { category: string; totalAmount: number; count: number }[]
  monthlySummary: { year: number; month: number; monthName: string; totalAmount: number; count: number }[]
}

const tips = [
  { icon: '☕', title: 'The Latte Factor', body: 'Skipping one ₹200 coffee daily = ₹73,000/year saved. Small habits compound into massive wealth.', tag: 'Savings', color: 'bg-amber-50 border-amber-100' },
  { icon: '📱', title: 'Subscription Audit', body: 'The average person wastes ₹3,500/month on forgotten subscriptions. Audit yours monthly.', tag: 'Budgeting', color: 'bg-blue-50 border-blue-100' },
  { icon: '🛒', title: 'Never Shop Hungry', body: 'Shopping hungry increases impulse spending by up to 64%. Eat before you shop — always.', tag: 'Mindset', color: 'bg-green-50 border-green-100' },
  { icon: '💳', title: 'Delay Big Purchases', body: 'Wait 48 hours before any purchase over ₹2,000. You\'ll eliminate 80% of impulse buys.', tag: 'Discipline', color: 'bg-purple-50 border-purple-100' },
  { icon: '🎯', title: '1% Better Rule', body: 'Save just 1% more each month. Starting at 5%, in 2 years you\'ll be saving 29% effortlessly.', tag: 'Growth', color: 'bg-rose-50 border-rose-100' },
  { icon: '🏦', title: 'Pay Yourself First', body: 'Auto-transfer savings the same day you get paid. You\'ll never miss money you never see.', tag: 'Strategy', color: 'bg-cyan-50 border-cyan-100' },
]

const articles = [
  { title: 'The 50/30/20 Rule: A Beginner\'s Guide to Budgeting', time: '4 min read', category: 'Budgeting', emoji: '📊' },
  { title: 'Why Your Emergency Fund Should Have 6 Months of Expenses', time: '6 min read', category: 'Savings', emoji: '🛡️' },
  { title: 'How to Negotiate Bills and Save ₹5,000/Month', time: '5 min read', category: 'Tips', emoji: '💬' },
  { title: 'Index Funds vs Fixed Deposits: What\'s Better in 2026?', time: '8 min read', category: 'Investing', emoji: '📈' },
  { title: 'Zero-Based Budgeting: Give Every Rupee a Job', time: '5 min read', category: 'Budgeting', emoji: '🎯' },
  { title: 'The Psychology of Spending: Why We Overspend', time: '7 min read', category: 'Mindset', emoji: '🧠' },
]

export default function InsightsView() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [income, setIncome] = useState('')
  const [activeRule, setActiveRule] = useState<'50/30/20' | '70/20/10'>('50/30/20')

  useEffect(() => {
    fetch('/api/expenses/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data) })
      .catch(console.error)
  }, [])

  const totalSpent = stats?.total.amount ?? 0
  const topCat = stats?.categoryBreakdown[0]
  const incomeNum = parseFloat(income) || 0

  const rules = {
    '50/30/20': { needs: 0.5, wants: 0.3, savings: 0.2, labels: ['Needs 50%', 'Wants 30%', 'Savings 20%'], colors: ['bg-blue-500', 'bg-purple-500', 'bg-green-500'] },
    '70/20/10': { needs: 0.7, wants: 0.2, savings: 0.1, labels: ['Living 70%', 'Savings 20%', 'Giving 10%'], colors: ['bg-amber-500', 'bg-green-500', 'bg-rose-500'] },
  }
  const rule = rules[activeRule]

  // Personalized insight based on data
  const getPersonalizedInsight = () => {
    if (!stats || stats.total.count === 0) return null
    const foodCat = stats.categoryBreakdown.find(c => c.category === 'Food' || c.category === 'Groceries')
    if (foodCat && totalSpent > 0 && (foodCat.totalAmount / totalSpent) > 0.4) {
      return { icon: '🍕', text: `Food & Groceries account for ${((foodCat.totalAmount / totalSpent) * 100).toFixed(0)}% of your spending — above the recommended 30%. Try meal prepping to reduce this.` }
    }
    const months = stats.monthlySummary
    if (months.length >= 2) {
      const last = months[months.length - 1]?.totalAmount ?? 0
      const prev = months[months.length - 2]?.totalAmount ?? 0
      if (last > prev * 1.2) {
        return { icon: '📈', text: `Your spending jumped ${(((last - prev) / prev) * 100).toFixed(0)}% this month vs last month. Review your recent transactions to identify what changed.` }
      }
    }
    return { icon: '✅', text: `You've logged ${stats.total.count} transactions totaling ₹${totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}. Keep tracking consistently for better insights!` }
  }

  const insight = getPersonalizedInsight()

  return (
    <div className="min-h-screen bg-[#F8F8F8] pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <Lightbulb size={12} /> Insights
          </div>
          <h1 className="text-4xl font-bold text-black tracking-tight mb-2">Financial Intelligence</h1>
          <p className="text-gray-500 text-lg">Personalized tips, smart rules, and knowledge to grow your wealth.</p>
        </div>

        {/* Personalized Insight Banner (if data exists) */}
        {insight && (
          <div className="bg-black text-white rounded-3xl p-6 mb-8 flex items-start gap-4">
            <span className="text-3xl flex-shrink-0">{insight.icon}</span>
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">Your Personal Insight</div>
              <p className="text-white/90 text-base leading-relaxed">{insight.text}</p>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Budget Rule Calculator */}
          <div className="md:col-span-1 bg-white rounded-3xl border border-black/5 p-6">
            <h3 className="text-lg font-bold text-black mb-1">Budget Rule Calculator</h3>
            <p className="text-sm text-gray-400 mb-4">Find your ideal money split</p>

            <div className="flex gap-1 bg-black/5 rounded-xl p-1 mb-5">
              {(['50/30/20', '70/20/10'] as const).map(r => (
                <button key={r} onClick={() => setActiveRule(r)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeRule === r ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}>
                  {r}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-2">Monthly Income (₹)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={income}
                onChange={e => setIncome(e.target.value)}
                className="w-full border border-black/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/20"
              />
            </div>

            <div className="space-y-3">
              {[
                { label: rule.labels[0], amount: incomeNum * rule.needs, color: rule.colors[0] },
                { label: rule.labels[1], amount: incomeNum * rule.wants, color: rule.colors[1] },
                { label: rule.labels[2], amount: incomeNum * rule.savings, color: rule.colors[2] },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-black">
                    {incomeNum > 0 ? `₹${item.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—'}
                  </span>
                </div>
              ))}
            </div>

            {totalSpent > 0 && incomeNum > 0 && (
              <div className="mt-4 pt-4 border-t border-black/5">
                <div className="text-xs text-gray-500 mb-1">Your actual spending this period</div>
                <div className={`text-sm font-bold ${totalSpent > incomeNum * rule.needs ? 'text-red-500' : 'text-green-600'}`}>
                  ₹{totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  {totalSpent > incomeNum * rule.needs ? ' ⚠️ Over budget' : ' ✅ On track'}
                </div>
              </div>
            )}
          </div>

          {/* Tips Grid */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-black mb-4">💡 Smart Money Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tips.map((tip, i) => (
                <div key={i} className={`rounded-2xl border p-5 ${tip.color} hover:shadow-sm transition-shadow cursor-pointer`}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <span className="text-xs font-semibold text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">{tip.tag}</span>
                  </div>
                  <h4 className="text-sm font-bold text-black mb-1">{tip.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Financial Health Score */}
        {stats && stats.total.count > 0 && (
          <div className="bg-gradient-to-r from-black to-gray-800 rounded-3xl p-8 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Financial Health</div>
                <h3 className="text-2xl font-bold mb-2">
                  {stats.categoryBreakdown.length >= 3 ? '🌟 Diversified Spender' : stats.total.count >= 10 ? '📊 Active Tracker' : '🌱 Getting Started'}
                </h3>
                <p className="text-white/70 text-sm max-w-md">
                  {stats.categoryBreakdown.length >= 3
                    ? `Your spending spans ${stats.categoryBreakdown.length} categories — great diversity! Keep monitoring for balance.`
                    : `You've logged ${stats.total.count} expenses. Keep tracking to unlock deeper insights and patterns.`}
                </p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.total.count}</div>
                  <div className="text-xs text-white/50 uppercase tracking-widest">Transactions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.categoryBreakdown.length}</div>
                  <div className="text-xs text-white/50 uppercase tracking-widest">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{stats.monthlySummary.length}</div>
                  <div className="text-xs text-white/50 uppercase tracking-widest">Months</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reading List */}
        <div>
          <h3 className="text-lg font-bold text-black mb-4">📚 Recommended Reading</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {articles.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl border border-black/5 p-5 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer group">
                <span className="text-2xl flex-shrink-0">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{a.category}</span>
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-black group-hover:underline leading-snug">{a.title}</h4>
                </div>
                <ChevronRight size={16} className="text-gray-300 flex-shrink-0 mt-0.5 group-hover:text-black transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
