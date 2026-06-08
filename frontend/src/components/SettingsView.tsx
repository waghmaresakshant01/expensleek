import { useState } from 'react'
import { Settings, ShieldAlert, CheckCircle2 } from 'lucide-react'

interface SettingsViewProps {
  onClearData: () => Promise<void>
}

export default function SettingsView({ onClearData }: SettingsViewProps) {
  const [dailyBudget, setDailyBudget] = useState(() => localStorage.getItem('dailyBudget') || '1000')
  const [weeklyBudget, setWeeklyBudget] = useState(() => localStorage.getItem('weeklyBudget') || '7000')
  const [monthlyBudget, setMonthlyBudget] = useState(() => localStorage.getItem('monthlyBudget') || '30000')
  const [currency, setCurrency] = useState(() => localStorage.getItem('currency') || '₹')
  const [vibeEnabled, setVibeEnabled] = useState(() => localStorage.getItem('vibeEnabled') === 'true')
  const [showConfirmClear, setShowConfirmClear] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToastMsg = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const saveSettings = () => {
    localStorage.setItem('dailyBudget', dailyBudget)
    localStorage.setItem('weeklyBudget', weeklyBudget)
    localStorage.setItem('monthlyBudget', monthlyBudget)
    localStorage.setItem('currency', currency)
    localStorage.setItem('vibeEnabled', String(vibeEnabled))
    showToastMsg('Settings saved successfully!')
  }

  const handleClear = async () => {
    await onClearData()
    localStorage.clear()
    // Re-initialize values
    setDailyBudget('1000')
    setWeeklyBudget('7000')
    setMonthlyBudget('30000')
    setCurrency('₹')
    setVibeEnabled(false)
    setShowConfirmClear(false)
    showToastMsg('All data cleared!')
  }

  return (
    <div className="min-h-screen mesh-bg text-[#1a1a2e] pt-24 pb-16 px-6">
      <div className="max-w-[48rem] mx-auto">
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-500/5 via-purple-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-6 h-6 text-black/60" />
              <h2 className="text-2xl font-semibold tracking-tight">System Settings</h2>
            </div>

            <div className="space-y-6">
              {/* Budgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-black/50 text-xs uppercase tracking-wider mb-2 block font-medium">Daily Budget ({currency})</label>
                  <input
                    type="number"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(e.target.value)}
                    className="floating-input w-full rounded-xl py-3 px-4 text-sm"
                  />
                </div>
                <div>
                  <label className="text-black/50 text-xs uppercase tracking-wider mb-2 block font-medium">Weekly Budget ({currency})</label>
                  <input
                    type="number"
                    value={weeklyBudget}
                    onChange={(e) => setWeeklyBudget(e.target.value)}
                    className="floating-input w-full rounded-xl py-3 px-4 text-sm"
                  />
                </div>
                <div>
                  <label className="text-black/50 text-xs uppercase tracking-wider mb-2 block font-medium">Monthly Budget ({currency})</label>
                  <input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    className="floating-input w-full rounded-xl py-3 px-4 text-sm"
                  />
                </div>
              </div>

              {/* Currency & Vibe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-black/5">
                <div>
                  <label className="text-black/50 text-xs uppercase tracking-wider mb-2 block font-medium">Currency Symbol</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="floating-input w-full rounded-xl py-3 px-4 text-sm appearance-none cursor-pointer"
                  >
                    <option value="₹">₹ (INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={vibeEnabled}
                      onChange={(e) => setVibeEnabled(e.target.checked)}
                      className="w-5 h-5 rounded-lg border-black/10 text-black focus:ring-black accent-black cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-semibold text-[#1a1a2e] block">Vibe-Based Category Names</span>
                      <span className="text-xs text-black/40">Use funny titles with emojis (e.g. 🍕 Munch Fund)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Save Settings */}
              <div className="pt-6">
                <button
                  onClick={saveSettings}
                  className="bg-black text-white font-semibold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors text-sm"
                >
                  Save Settings
                </button>
              </div>

              {/* Danger Zone */}
              <div className="pt-8 border-t border-red-500/10 mt-8">
                <h3 className="text-red-600 font-semibold text-sm uppercase tracking-wider mb-3">Danger Zone</h3>
                <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="text-sm font-semibold text-[#1a1a2e] block">Reset All Application Data</span>
                    <span className="text-xs text-red-500/60">This permanently deletes all transaction history and resets all custom budgets/settings.</span>
                  </div>
                  <button
                    onClick={() => setShowConfirmClear(true)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors shrink-0"
                  >
                    Clear All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div className="modal-overlay" onClick={() => setShowConfirmClear(false)}>
          <div
            className="glass-card p-8 max-w-sm mx-4 text-center"
            style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-[#1a1a2e]">Clear All Data?</h3>
            <p className="text-black/40 text-sm mb-6">This operation cannot be undone. All expense entries will be wiped from database and settings cleared.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 py-2.5 rounded-full border border-black/10 text-black/60 hover:bg-black/[0.03] transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="flex-1 py-2.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-semibold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toast && (
        <div className="toast toast-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {toast}
        </div>
      )}
    </div>
  )
}
