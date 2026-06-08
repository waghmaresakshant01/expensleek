import { useState } from 'react'
import { Newspaper, TrendingUp, Clock, Tag, ArrowUpRight } from 'lucide-react'

const featured = {
  tag: 'Cover Story',
  emoji: '🏦',
  title: 'India\'s Middle Class and the Savings Crisis: Why We Spend More Than We Earn',
  excerpt: 'A deep dive into why 76% of Indian millennials have less than ₹10,000 saved despite earning more than any previous generation. The psychology, the traps, and the escape.',
  readTime: '12 min read',
  date: 'June 2026',
  color: 'from-purple-900 to-black',
}

const articles = [
  {
    category: 'Personal Finance', tag: '🔥 Trending',
    title: 'The ₹500 Rule That\'s Saving Thousands of Indians Every Month',
    excerpt: 'A simple mental trick where you ask "Is this worth 2.5 hours of my work?" before every purchase.',
    readTime: '4 min', date: 'Jun 5, 2026', color: 'bg-orange-50 border-orange-100',
  },
  {
    category: 'Investing', tag: '📈 Markets',
    title: 'SIP vs Lump Sum in 2026: Which Strategy Is Winning?',
    excerpt: 'With markets at new highs, financial advisors are split. Here\'s what the data actually says.',
    readTime: '7 min', date: 'Jun 4, 2026', color: 'bg-blue-50 border-blue-100',
  },
  {
    category: 'Budgeting', tag: '💡 Tips',
    title: 'Zero-Budget Month: What Happened When I Spent Only on Essentials',
    excerpt: 'A personal experiment that saved ₹22,000 and revealed which expenses were truly necessary.',
    readTime: '6 min', date: 'Jun 3, 2026', color: 'bg-green-50 border-green-100',
  },
  {
    category: 'Credit', tag: '⚠️ Warning',
    title: 'Buy Now Pay Later: The Hidden Debt Trap Targeting Gen Z',
    excerpt: '43% of BNPL users report spending more than they planned. Here\'s the science behind why.',
    readTime: '5 min', date: 'Jun 2, 2026', color: 'bg-red-50 border-red-100',
  },
  {
    category: 'Savings', tag: '🎯 Strategy',
    title: 'High-Yield Savings in India: FDs vs Liquid Funds in 2026',
    excerpt: 'Liquid mutual funds are now beating most FD rates. We compared 15 products so you don\'t have to.',
    readTime: '8 min', date: 'Jun 1, 2026', color: 'bg-emerald-50 border-emerald-100',
  },
  {
    category: 'Mindset', tag: '🧠 Psychology',
    title: 'Money Shame Is Real — And It\'s Costing You More Than You Think',
    excerpt: 'Financial therapists explain how embarrassment about money leads to worse financial decisions.',
    readTime: '6 min', date: 'May 31, 2026', color: 'bg-violet-50 border-violet-100',
  },
]

const quickBites = [
  { emoji: '💰', stat: '₹4.2L', label: 'Average Indian household debt (2026)' },
  { emoji: '📱', stat: '₹3,200', label: 'Avg monthly spend on subscriptions' },
  { emoji: '🛒', stat: '23%', label: 'Of grocery spend is impulse buying' },
  { emoji: '☕', stat: '₹67,000', label: 'Saved yearly by making coffee at home' },
]

const tipOfDay = {
  emoji: '💡',
  tip: 'Before buying anything online, add it to your cart and wait 24 hours. Studies show 35% of items are abandoned when the impulse cools. Your future self will thank you.',
  author: 'ExpenSleek Financial Team',
  date: new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
}

const categories = ['All', 'Personal Finance', 'Investing', 'Budgeting', 'Savings', 'Credit', 'Mindset']

export default function NewsView() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All' ? articles : articles.filter(a => a.category === activeCategory)

  return (
    <div className="min-h-screen bg-[#F8F8F8] pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <Newspaper size={12} /> Financial News
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-black tracking-tight mb-2">Money & Markets</h1>
              <p className="text-gray-500 text-lg">Curated financial news, tips, and insights — updated daily.</p>
            </div>
            <div className="text-sm text-gray-400">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        {/* Tip of the Day */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-3xl p-6 mb-8 flex items-start gap-5">
          <div className="text-4xl flex-shrink-0">{tipOfDay.emoji}</div>
          <div>
            <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Tip of the Day — {tipOfDay.date}</div>
            <p className="text-gray-800 text-base leading-relaxed font-medium mb-2">"{tipOfDay.tip}"</p>
            <div className="text-xs text-gray-400">— {tipOfDay.author}</div>
          </div>
        </div>

        {/* Featured Article */}
        <div className={`bg-gradient-to-br ${featured.color} rounded-3xl p-8 md:p-10 mb-8 text-white relative overflow-hidden cursor-pointer group`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">{featured.tag}</span>
              <span className="text-white/50 text-xs">{featured.date}</span>
              <span className="text-white/50 text-xs flex items-center gap-1"><Clock size={11} />{featured.readTime}</span>
            </div>
            <div className="text-5xl mb-4">{featured.emoji}</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 max-w-2xl leading-tight group-hover:text-white/90 transition-colors">{featured.title}</h2>
            <p className="text-white/70 text-base max-w-xl leading-relaxed mb-6">{featured.excerpt}</p>
            <button className="flex items-center gap-2 bg-white text-black text-sm font-bold px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors">
              Read Full Story <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Quick Bites */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickBites.map((b, i) => (
            <div key={i} className="bg-white rounded-2xl border border-black/5 p-5 text-center hover:shadow-sm transition-shadow">
              <div className="text-3xl mb-2">{b.emoji}</div>
              <div className="text-2xl font-bold text-black mb-1">{b.stat}</div>
              <div className="text-xs text-gray-400 leading-snug">{b.label}</div>
            </div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-black text-white' : 'bg-white text-gray-500 border border-black/10 hover:border-black/30 hover:text-black'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {filtered.map((a, i) => (
            <div key={i} className={`${a.color} border rounded-3xl p-6 cursor-pointer group hover:shadow-md transition-all`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 bg-white/70 px-2.5 py-1 rounded-full">{a.category}</span>
                <span className="text-xs font-semibold text-gray-500">{a.tag}</span>
              </div>
              <h3 className="text-base font-bold text-black mb-2 leading-snug group-hover:text-gray-700 transition-colors">{a.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{a.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock size={11} />{a.readTime}</span>
                  <span>{a.date}</span>
                </div>
                <ArrowUpRight size={14} className="text-gray-300 group-hover:text-black transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-black rounded-3xl p-8 text-center text-white">
          <div className="text-3xl mb-3">📬</div>
          <h3 className="text-2xl font-bold mb-2">Stay Financially Sharp</h3>
          <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">Get weekly money tips, market updates, and personalized insights delivered to your inbox. No spam, ever.</p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 bg-white/10 text-white placeholder-white/40 border border-white/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30" />
            <button className="bg-white text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-white/30 mt-3">Join 12,000+ readers getting smarter about money.</p>
        </div>
      </div>
    </div>
  )
}
