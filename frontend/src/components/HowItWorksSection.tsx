import { Scan, PieChart, TrendingUp, Zap } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: Scan,
    title: 'Log your expenses',
    desc: 'Add expenses in seconds with our streamlined form — amount, category, payment method, done.',
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    num: '02',
    icon: PieChart,
    title: 'See the breakdown',
    desc: 'ExpenSleek automatically categorizes and visualizes your spending across beautiful charts.',
    color: 'bg-purple-500/10 text-purple-600',
  },
  {
    num: '03',
    icon: TrendingUp,
    title: 'Track your trends',
    desc: 'Monthly trends, category insights, and smart filters help you spot patterns and cut waste.',
    color: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    num: '04',
    icon: Zap,
    title: 'Optimize spending',
    desc: 'Use data-driven insights to set budgets, reduce overspending, and save more each month.',
    color: 'bg-amber-500/10 text-amber-600',
  },
]

export default function HowItWorksSection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-[88rem] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-black/50 text-sm uppercase tracking-widest mb-3">How It Works</p>
          <h2
            className="text-4xl md:text-5xl font-medium leading-tight"
            style={{ letterSpacing: '-0.03em' }}
          >
            Four steps to
            <br />
            financial clarity.
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="group relative rounded-2xl p-7 bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300"
            >
              <span className="text-[80px] font-bold leading-none text-black/[0.03] absolute top-4 right-6 select-none">
                {step.num}
              </span>
              <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-5`}>
                <step.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ letterSpacing: '-0.01em' }}>
                {step.title}
              </h3>
              <p className="text-black/50 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
