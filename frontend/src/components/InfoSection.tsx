import { ArrowRight } from 'lucide-react'

export default function InfoSection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-[88rem] mx-auto">
        {/* Row 1: 2-col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-start">
          {/* Left */}
          <div>
            <h2
              className="text-black text-4xl md:text-5xl font-medium leading-tight mb-8"
              style={{ letterSpacing: '-0.03em' }}
            >
              Meet ExpenSleek.
            </h2>
            <button className="inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-gray-800 transition-colors duration-200">
              Discover it
              <span className="bg-white rounded-full p-2">
                <ArrowRight className="w-4 h-4 text-black" />
              </span>
            </button>
          </div>
          {/* Right */}
          <p className="text-black/70 text-2xl md:text-3xl leading-relaxed">
            ExpenSleek is a reward-earning expense tracker that lets your financial insights grow while remaining tied to your daily budget goals.
          </p>
        </div>

        {/* Row 2: 4-col card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 — spans 2 cols on lg */}
          <div
            className="lg:col-span-2 rounded-2xl p-7 min-h-80 flex flex-col justify-between"
            style={{
              backgroundImage:
                'url(https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260423_164207_f243351d-ed59-48ec-83a0-a5e996bdbe3c.png&w=1280&q=85)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <h3
              className="text-black text-2xl font-medium leading-snug"
              style={{ letterSpacing: '-0.02em' }}
            >
              Savings that bloom
            </h3>
            <p className="text-black/70 text-base max-w-xs">
              Gain steady returns as your spending patterns are routed into top-performing budget strategies.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl p-7 min-h-80 flex flex-col justify-between bg-[#2B2644]">
            <h3
              className="text-white text-2xl font-medium leading-snug"
              style={{ letterSpacing: '-0.02em' }}
            >
              Always fluid,
              <br />
              always tracked.
            </h3>
            <p className="text-white/60 text-base">
              Keep fully budget-anchored with on-demand access to insights — no lockups or waits.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl p-7 min-h-80 flex flex-col justify-between bg-[#2B2644]">
            <h3
              className="text-white text-2xl font-medium leading-snug"
              style={{ letterSpacing: '-0.02em' }}
            >
              Fully
              <br />
              automated
            </h3>
            <p className="text-white/60 text-base">
              Skip the task of tuning categories yourself. ExpenSleek runs in the background for you.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
