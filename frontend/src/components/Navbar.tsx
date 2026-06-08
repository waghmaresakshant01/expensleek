import LogoIcon from './LogoIcon'

export type SubView = 'dashboard' | 'goals' | 'settings'

interface NavbarProps {
  onLaunchApp: () => void
  isDashboard: boolean
  onBackToHome: () => void
  subView?: SubView
  onChangeSubView?: (view: SubView) => void
}

export default function Navbar({
  onLaunchApp,
  isDashboard,
  onBackToHome,
  subView = 'dashboard',
  onChangeSubView,
}: NavbarProps) {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-5">
      <div className="flex items-center justify-between max-w-[88rem] mx-auto">
        {/* Left: Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={isDashboard ? onBackToHome : undefined}
        >
          <LogoIcon className="w-7 h-7 text-black" />
          <span className="text-2xl font-medium tracking-tight text-black">
            ExpenSleek
          </span>
        </div>

        {/* Center: Nav links */}
        {!isDashboard ? (
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Analytics', 'Insights', 'Help', 'News'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-base text-gray-700 hover:text-black font-medium transition-colors duration-200"
              >
                {link}
              </a>
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
            onClick={onBackToHome}
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
