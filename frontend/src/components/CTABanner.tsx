import { ArrowRight } from 'lucide-react'
import LogoIcon from './LogoIcon'

interface CTABannerProps {
  onLaunchApp: () => void
}

export default function CTABanner({ onLaunchApp }: CTABannerProps) {
  return (
    <section className="px-6 py-20">
      <div className="max-w-[88rem] mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-[#1a1a2e] py-20 px-8 md:px-16 text-center">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <LogoIcon className="w-10 h-10 text-white/20 mx-auto mb-6" />
            <h2
              className="text-4xl md:text-5xl font-medium text-white leading-tight mb-4 max-w-2xl mx-auto"
              style={{ letterSpacing: '-0.03em' }}
            >
              Ready to take control
              <br />
              of your finances?
            </h2>
            <p className="text-white/50 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
              Join thousands of smart spenders who use ExpenSleek to track, analyze, and optimize their daily expenses.
            </p>
            <button
              onClick={onLaunchApp}
              className="inline-flex items-center gap-3 bg-white text-[#1a1a2e] text-base md:text-lg font-semibold pl-8 pr-2.5 py-2.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              Start Tracking Now
              <span className="bg-[#1a1a2e] rounded-full p-2">
                <ArrowRight className="w-5 h-5 text-white" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
