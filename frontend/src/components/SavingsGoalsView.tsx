import { useState, useEffect } from 'react'
import { Target, Plus, Trash2, Calendar, Coins, Sparkles, X, Check } from 'lucide-react'

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  savedAmount: number
  deadline: string
  emoji: string
}

export default function SavingsGoalsView() {
  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('savingsGoals')
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'MacBook Pro', targetAmount: 150000, savedAmount: 63000, deadline: '2026-12-31', emoji: '💻' },
      { id: '2', name: 'Goa Trip', targetAmount: 25000, savedAmount: 15000, deadline: '2026-09-15', emoji: '🌴' }
    ]
  })
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [deadline, setDeadline] = useState('')
  const [emoji, setEmoji] = useState('💰')
  
  const [showContributeModal, setShowContributeModal] = useState<string | null>(null)
  const [contributeAmount, setContributeAmount] = useState('')

  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(goals))
  }, [goals])

  const showToastMsg = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleAddGoal = () => {
    if (!name || !targetAmount || !deadline) {
      showToastMsg('Please fill all fields')
      return
    }
    const newGoal: SavingsGoal = {
      id: String(Date.now()),
      name,
      targetAmount: Number(targetAmount),
      savedAmount: 0,
      deadline,
      emoji: emoji || '💰'
    }
    setGoals([...goals, newGoal])
    setShowModal(false)
    setName('')
    setTargetAmount('')
    setDeadline('')
    setEmoji('💰')
    showToastMsg('Goal created successfully!')
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id))
    showToastMsg('Goal removed')
  }

  const handleContribute = () => {
    if (!contributeAmount || Number(contributeAmount) <= 0) return
    setGoals(goals.map(g => {
      if (g.id === showContributeModal) {
        const updatedAmount = g.savedAmount + Number(contributeAmount)
        if (updatedAmount >= g.targetAmount) {
          showToastMsg(`Goal reached! 🎉 Congratulations on saving for ${g.name}!`)
        } else {
          showToastMsg(`Added contribution to ${g.name}`)
        }
        return { ...g, savedAmount: Math.min(updatedAmount, g.targetAmount) }
      }
      return g
    }))
    setShowContributeModal(null)
    setContributeAmount('')
  }

  const currencySymbol = localStorage.getItem('currency') || '₹'

  return (
    <div className="min-h-screen mesh-bg text-[#1a1a2e] pt-24 pb-16 px-6">
      <div className="max-w-[64rem] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-medium tracking-tight" style={{ letterSpacing: '-0.03em' }}>Savings Goals</h2>
            <p className="text-black/50 text-sm mt-1">Visualize your milestones and stay motivated</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="glass-card p-16 text-center text-black/30">
            <Target className="w-12 h-12 mx-auto mb-4 text-black/10" />
            <p className="text-sm">No savings goals defined yet. Set one up to start saving!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const pct = Math.min(Math.round((goal.savedAmount / goal.targetAmount) * 100), 100)
              return (
                <div key={goal.id} className="glass-card p-6 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{goal.emoji}</span>
                        <div>
                          <h4 className="font-semibold text-lg">{goal.name}</h4>
                          <div className="flex items-center gap-1 text-black/40 text-xs mt-0.5">
                            <Calendar className="w-3.5 h-3.5" />
                            Target: {new Date(goal.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-black/25 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="my-6">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-semibold text-black/40 uppercase tracking-wider">Progress</span>
                        <span className="text-sm font-bold">{pct}%</span>
                      </div>
                      <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5">
                    <div>
                      <div className="text-xs text-black/40 uppercase font-medium">Saved / Target</div>
                      <div className="text-base font-semibold">
                        {currencySymbol}{goal.savedAmount.toLocaleString()} <span className="text-black/40 font-normal">/ {currencySymbol}{goal.targetAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowContributeModal(goal.id)}
                      className="bg-black/[0.03] hover:bg-black/[0.06] text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 border border-black/5"
                    >
                      <Coins className="w-3.5 h-3.5" /> Contribute
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* New Goal Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="glass-card w-full max-w-md p-8 mx-4"
            style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1a1a2e]">Create Savings Goal</h3>
              <button onClick={() => setShowModal(false)} className="text-black/30 hover:text-black transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-black/50 text-xs uppercase tracking-wider mb-2 block font-medium">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g. New Laptop, Vacation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="floating-input w-full rounded-xl py-3 px-4 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-black/50 text-xs uppercase tracking-wider mb-2 block font-medium">Target Amount ({currencySymbol})</label>
                  <input
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="floating-input w-full rounded-xl py-3 px-4 text-sm"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-black/50 text-xs uppercase tracking-wider mb-2 block font-medium">Goal Emoji</label>
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="floating-input w-full rounded-xl py-3 px-4 text-sm text-center text-lg"
                    placeholder="💰"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <label className="text-black/50 text-xs uppercase tracking-wider mb-2 block font-medium">Target Date</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="floating-input w-full rounded-xl py-3 px-4 text-sm"
                />
              </div>

              <button
                onClick={handleAddGoal}
                className="w-full bg-black text-white font-semibold py-3.5 rounded-full hover:bg-gray-800 transition-colors text-sm mt-2"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      {showContributeModal && (
        <div className="modal-overlay" onClick={() => setShowContributeModal(null)}>
          <div
            className="glass-card w-full max-w-sm p-8 mx-4"
            style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">Add Savings Contribution</h3>
              <button onClick={() => setShowContributeModal(null)} className="text-black/30 hover:text-black transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-black/50 text-xs uppercase tracking-wider mb-2 block font-medium">Contribution Amount ({currencySymbol})</label>
                <input
                  type="number"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  className="floating-input w-full rounded-xl py-3 px-4 text-sm"
                  placeholder="0.00"
                  autoFocus
                />
              </div>

              <button
                onClick={handleContribute}
                className="w-full bg-black text-white font-semibold py-3 rounded-full hover:bg-gray-800 transition-colors text-sm"
              >
                Confirm Deposit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toast && (
        <div className="toast toast-success flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          {toast}
        </div>
      )}
    </div>
  )
}
