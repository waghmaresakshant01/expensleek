import LogoIcon from './LogoIcon'

export type SubView = 'dashboard' | 'goals' | 'settings'
export type LandingPage = 'home' | 'features' | 'analytics' | 'insights' | 'help' | 'news'

interface NavbarProps {
  onLaunchApp: () => void
  isDashboard: boolean
  onBackToHome: () => void
  subView?: SubView
  onChangeSubView?: (view: SubView) => void
  landingPage?: LandingPage
  onNavLink?: (page: LandingPage) => void
}

const landingNavLinks: { label: string; page: LandingPage }[] = [
  { label: 'Features', page: 'features' },
  { label: 'Analytics', page: 'analytics' },
  { label: 'Insights', page: 'insights' },
  { label: 'Help', page: 'help' },
  { label: 'News', page: 'news' },
]

export default function Navbar({
  onLaunchApp,
  isDashboard,
  onBackToHome,
  subView = 'dashboard',
  onChangeSubView,
  landingPage = 'home',
  onNavLink,
}: NavbarProps) {
  const handleNavLink = (page: LandingPage) => {
    if (page === 'features') {
      // Scroll to the features section on the landing page
      if (isDashboard) {
        onBackToHome()
        setTimeout(() => {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
      }
      onNavLink?.('home')
    } else {
      onNavLink?.(page)
    }
  }

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
      <div className="flex items-center justify-between max-w-[88rem] mx-auto">
        {/* Left: Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => { onBackToHome(); onNavLink?.('home') }}
        >
          <LogoIcon className="w-7 h-7 text-black" />
          <span className="text-2xl font-medium tracking-tight text-black">
            ExpenSleek
          </span>
        </div>

        {/* Center: Nav links */}
        {!isDashboard ? (
          <div className="hidden md:flex items-center gap-8">
            {landingNavLinks.map(({ label, page }) => (
              <button
                key={label}
                onClick={() => handleNavLink(page)}
                className={`text-base font-medium transition-colors duration-200 relative group ${
                  landingPage === page && page !== 'home'
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {label}
                {landingPage === page && page !== 'home' && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black rounded-full" />
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-6">
            {(
              [
                { label: 'Dashboard', value: 'dashboard' },
                { label: 'Goals', value: 'goals' },
                { label: 'Settings', value: 'settings' },
              ] as const
            ).map((item) => (
              <span
                key={item.value}
                onClick={() => onChangeSubView?.(item.value)}
                className={`text-base font-medium transition-colors duration-200 cursor-pointer ${
                  subView === item.value ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}
              >
                {item.label}
              </span>
            ))}
          </div>
        )}

        {/* Right: CTA */}
        {isDashboard ? (
          <button
            onClick={() => { onBackToHome(); onNavLink?.('home') }}
            className="bg-black/5 text-black text-base font-medium px-7 py-2.5 rounded-full hover:bg-black/10 transition-colors duration-200 border border-black/5"
          >
            Back to Home
          </button>
        ) : (
          <button
            onClick={onLaunchApp}
            className="bg-black text-white text-base font-medium px-7 py-2.5 rounded-full hover:bg-gray-800 transition-colors duration-200"
          >
            Open Tracker
          </button>
        )}
      </div>
    </nav>
  )
}
