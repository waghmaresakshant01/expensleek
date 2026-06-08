import { useState } from 'react'
import Navbar from './components/Navbar'
import type { SubView } from './components/Navbar'
import HeroSection from './components/HeroSection'
import InfoSection from './components/InfoSection'
import BackedBySection from './components/BackedBySection'
import UseCasesSection from './components/UseCasesSection'
import Dashboard from './components/Dashboard'
import SavingsGoalsView from './components/SavingsGoalsView'
import SettingsView from './components/SettingsView'

import HowItWorksSection from './components/HowItWorksSection'
import StatsSection from './components/StatsSection'
import TestimonialsSection from './components/TestimonialsSection'
import FAQSection from './components/FAQSection'
import CTABanner from './components/CTABanner'

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')
  const [subView, setSubView] = useState<SubView>('dashboard')

  const launchApp = () => {
    setView('dashboard')
    setSubView('dashboard')
  }
  const goHome = () => setView('landing')

  const handleClearData = async () => {
    try {
      await fetch('/api/expenses', { method: 'DELETE' })
    } catch (err) {
      console.error('Failed to clear API data', err)
    }
  }

  return (
    <div className="flex flex-col bg-[#F5F5F5]">
      <Navbar
        onLaunchApp={launchApp}
        isDashboard={view === 'dashboard'}
        onBackToHome={goHome}
        subView={subView}
        onChangeSubView={setSubView}
      />

      {view === 'landing' ? (
        <>
          {/* Hero: full-screen wrapper */}
          <div className="h-screen flex flex-col overflow-hidden">
            <HeroSection onLaunchApp={launchApp} />
          </div>

          <InfoSection />
          <BackedBySection />
          <UseCasesSection />
          <HowItWorksSection />
          <StatsSection />
          <TestimonialsSection />
          <FAQSection />
          <CTABanner onLaunchApp={launchApp} />

          {/* Footer */}
          <footer className="bg-[#F5F5F5] border-t border-black/5 py-12 px-6">
            <div className="max-w-[88rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-widest text-black/40">
              <div>© 2026 ExpenSleek. Premium Expense Intelligence.</div>
              <div className="flex gap-6">
                <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-black transition-colors">Documentation</a>
              </div>
            </div>
          </footer>
        </>
      ) : (
        <>
          {subView === 'dashboard' && <Dashboard />}
          {subView === 'goals' && <SavingsGoalsView />}
          {subView === 'settings' && <SettingsView onClearData={handleClearData} />}
        </>
      )}
    </div>
  )
}
