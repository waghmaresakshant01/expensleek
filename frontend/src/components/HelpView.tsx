import { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, Keyboard, Zap, BookOpen, MessageCircle, Play, CheckCircle } from 'lucide-react'

const faqs = [
  {
    q: 'How do I add my first expense?',
    a: 'Click the "+ Add Expense" button on the Dashboard. Fill in the amount, category, description, date, and payment method, then hit Save. Your expense will instantly appear in the transaction list and charts.'
  },
  {
    q: 'Can I edit or delete an expense after adding it?',
    a: 'Yes! Click the pencil icon (✏️) next to any transaction to edit it, or the trash icon (🗑️) to delete it. Changes are reflected immediately across all charts and stats.'
  },
  {
    q: 'What categories are available?',
    a: 'ExpenSleek supports: Food, Transport, Entertainment, Shopping, Health, Utilities, Education, Travel, Rent, Groceries, and Other. More categories may be added in future updates.'
  },
  {
    q: 'How does the Daily Budget work?',
    a: 'Set your daily budget in Settings. The dashboard will show how much you\'ve spent today vs your budget with an animated progress bar. If you exceed it, you\'ll get a friendly (sassy) warning!'
  },
  {
    q: 'What is the Streak Counter?',
    a: 'The streak tracks how many consecutive days you\'ve logged at least one expense. It encourages consistent financial tracking habits. Your streak resets if you miss a day.'
  },
  {
    q: 'How do Split Expenses work?',
    a: 'When adding an expense, toggle "Split Expense" to mark it as shared. Enter the number of people splitting the cost and their names. The app tracks who owes you and shows unsettled splits.'
  },
  {
    q: 'Is my data secure and private?',
    a: 'Your expenses are stored in a secure MongoDB Atlas cloud database. The app uses HTTPS encryption and no data is shared with third parties.'
  },
  {
    q: 'Can I export my expense data?',
    a: 'Yes! Use the Export button (↓) in the Dashboard to download your expenses as a CSV file, perfect for importing into Excel or Google Sheets.'
  },
  {
    q: 'What are Savings Goals?',
    a: 'In the Goals section, you can set specific savings targets (e.g., "New Laptop — ₹80,000"). Track your progress with a visual progress bar and mark goals as complete when achieved.'
  },
  {
    q: 'How accurate is the Spend Forecast?',
    a: 'The forecast analyzes your spending velocity in the current month and projects your total by month-end. The more expenses you log, the more accurate the prediction becomes.'
  },
]

const shortcuts = [
  { key: 'N', action: 'New expense', icon: '➕' },
  { key: 'Esc', action: 'Close modal', icon: '✖' },
  { key: 'S', action: 'Open Settings', icon: '⚙️' },
  { key: 'G', action: 'Go to Goals', icon: '🎯' },
  { key: 'D', action: 'Go to Dashboard', icon: '📊' },
  { key: '/', action: 'Focus search', icon: '🔍' },
]

const guides = [
  { step: 1, title: 'Add Your First Expense', desc: 'Hit "+ Add Expense" and fill in the details. Takes 10 seconds.', icon: '💸', done: false },
  { step: 2, title: 'Set a Daily Budget', desc: 'Go to Settings and set your daily spending limit.', icon: '🎯', done: false },
  { step: 3, title: 'Check Your Analytics', desc: 'After a week of logging, visit Analytics for patterns.', icon: '📊', done: false },
  { step: 4, title: 'Create a Savings Goal', desc: 'Set a goal in the Goals tab and watch your progress.', icon: '🏆', done: false },
  { step: 5, title: 'Review Weekly', desc: 'Check Insights every Sunday for your weekly financial grade.', icon: '📅', done: false },
]

export default function HelpView() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [searchQ, setSearchQ] = useState('')

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(searchQ.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQ.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#F8F8F8] pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            <HelpCircle size={12} /> Help Center
          </div>
          <h1 className="text-4xl font-bold text-black tracking-tight mb-3">How can we help?</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Everything you need to get the most out of ExpenSleek.</p>

          {/* Search */}
          <div className="relative max-w-md mx-auto mt-6">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              className="w-full border border-black/10 bg-white rounded-2xl pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 shadow-sm"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>
        </div>

        {/* Quick Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: '🚀', title: 'Getting Started', desc: '5-step guide to set up', color: 'bg-blue-50 border-blue-100' },
            { icon: '⌨️', title: 'Keyboard Shortcuts', desc: 'Work faster with hotkeys', color: 'bg-amber-50 border-amber-100' },
            { icon: '🐛', title: 'Report an Issue', desc: 'Something not working?', color: 'bg-red-50 border-red-100' },
            { icon: '💡', title: 'Feature Request', desc: 'Suggest something new', color: 'bg-green-50 border-green-100' },
          ].map((c, i) => (
            <div key={i} className={`${c.color} border rounded-2xl p-5 text-center cursor-pointer hover:shadow-sm transition-all`}>
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="text-sm font-bold text-black mb-1">{c.title}</div>
              <div className="text-xs text-gray-500">{c.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Getting Started Guide */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-black/5 p-7">
            <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-sm">🚀</span>
              Getting Started in 5 Steps
            </h3>
            <div className="space-y-4">
              {guides.map((g) => (
                <div key={g.step} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {g.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span>{g.icon}</span>
                      <h4 className="text-sm font-bold text-black">{g.title}</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-black rounded-3xl p-7 text-white">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Keyboard size={18} /> Keyboard Shortcuts
            </h3>
            <div className="space-y-3">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{s.icon}</span>
                    <span className="text-sm text-white/70">{s.action}</span>
                  </div>
                  <kbd className="bg-white/10 text-white/90 text-xs font-mono px-2.5 py-1 rounded-lg border border-white/10 min-w-[2.5rem] text-center">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs text-white/40">Press any key while the modal is closed to trigger shortcuts.</p>
            </div>
          </div>
        </div>

        {/* Feature Quick-Reference */}
        <div className="bg-white rounded-3xl border border-black/5 p-7 mb-8">
          <h3 className="text-xl font-bold text-black mb-6">⚡ Feature Quick-Reference</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: '📊', name: 'Dashboard', desc: 'Main view with all transactions, charts, and real-time stats.' },
              { icon: '🔥', name: 'Streak Counter', desc: 'Tracks consecutive days of expense logging to build habits.' },
              { icon: '📅', name: 'Daily Budget', desc: 'Set a spend limit and monitor it with an animated bar.' },
              { icon: '🎯', name: 'Savings Goals', desc: 'Create and track financial milestones with progress bars.' },
              { icon: '👥', name: 'Split Expenses', desc: 'Split bills with friends and track who owes you.' },
              { icon: '📈', name: 'Spend Forecast', desc: 'AI-like projection of your month-end spending total.' },
              { icon: '🔔', name: 'Subscription Tracker', desc: 'Flags recurring payments automatically in your history.' },
              { icon: '💎', name: 'Weekly Grade', desc: 'Get an A–F grade every Sunday based on budget adherence.' },
              { icon: '📱', name: 'Export CSV', desc: 'Download all expenses for Excel or Google Sheets.' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <span className="text-xl flex-shrink-0">{f.icon}</span>
                <div>
                  <div className="text-sm font-bold text-black mb-0.5">{f.name}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl border border-black/5 p-7">
          <h3 className="text-xl font-bold text-black mb-6">❓ Frequently Asked Questions</h3>
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No results for "{searchQ}" — try different keywords.</div>
          ) : (
            <div className="space-y-2">
              {filteredFaqs.map((faq, i) => (
                <div key={i} className="border border-black/5 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-black pr-4">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
