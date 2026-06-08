const stats = [
  { value: '50K+', label: 'Expenses Tracked', sublabel: 'by users worldwide' },
  { value: '₹2.4Cr', label: 'Savings Identified', sublabel: 'through smart insights' },
  { value: '12', label: 'Categories', sublabel: 'auto-classified' },
  { value: '99.9%', label: 'Uptime', sublabel: 'always available' },
]

export default function StatsSection() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-[88rem] mx-auto">
        <div className="rounded-3xl bg-[#1a1a2e] overflow-hidden relative">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-px">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center py-14 px-6 text-center border-r border-white/5 last:border-r-0"
              >
                <span
                  className="text-4xl md:text-5xl font-semibold text-white mb-2"
                  style={{ letterSpacing: '-0.04em' }}
                >
                  {stat.value}
                </span>
                <span className="text-white/60 text-sm font-medium uppercase tracking-wider">{stat.label}</span>
                <span className="text-white/30 text-xs mt-1">{stat.sublabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
