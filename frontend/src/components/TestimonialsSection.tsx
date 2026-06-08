import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Freelance Designer',
    avatar: 'PS',
    color: 'bg-pink-100 text-pink-700',
    stars: 5,
    text: '"ExpenSleek completely changed how I manage my finances. The category breakdown helped me realize I was overspending on subscriptions by 40%. Incredible tool."',
  },
  {
    name: 'Arjun Patel',
    role: 'Software Engineer',
    avatar: 'AP',
    color: 'bg-blue-100 text-blue-700',
    stars: 5,
    text: '"I\'ve tried dozens of expense trackers but ExpenSleek is the only one I\'ve stuck with. The UI is gorgeous, the analytics are insightful, and it just works."',
  },
  {
    name: 'Meera Krishnan',
    role: 'MBA Student',
    avatar: 'MK',
    color: 'bg-emerald-100 text-emerald-700',
    stars: 5,
    text: '"As a student on a tight budget, ExpenSleek helps me track every rupee. The monthly trends chart showed me exactly where I could cut back. Saved ₹3,000 in my first month!"',
  },
  {
    name: 'Rahul Verma',
    role: 'Startup Founder',
    avatar: 'RV',
    color: 'bg-purple-100 text-purple-700',
    stars: 4,
    text: '"We use ExpenSleek to track our team\'s operational expenses. The filter by category feature makes month-end reporting a breeze. Highly recommended for small teams."',
  },
  {
    name: 'Ananya Gupta',
    role: 'Marketing Manager',
    avatar: 'AG',
    color: 'bg-amber-100 text-amber-700',
    stars: 5,
    text: '"The design alone makes me want to log expenses. It feels premium, like a fintech app. The fact that it\'s also deeply functional is the cherry on top."',
  },
  {
    name: 'Vikram Singh',
    role: 'Data Analyst',
    avatar: 'VS',
    color: 'bg-cyan-100 text-cyan-700',
    stars: 5,
    text: '"Finally an expense tracker that respects good design and data. The Chart.js visualizations are clean, the API is snappy, and the UX is top-tier."',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-[88rem] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-black/50 text-sm uppercase tracking-widest mb-3">What People Say</p>
            <h2
              className="text-4xl md:text-5xl font-medium leading-tight"
              style={{ letterSpacing: '-0.03em' }}
            >
              Loved by thousands.
            </h2>
          </div>
          <p className="text-black/50 text-base max-w-md leading-relaxed">
            Join a community of smart spenders who trust ExpenSleek for their daily financial tracking and budget optimization.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 bg-white/60 backdrop-blur-sm border border-black/5 hover:bg-white hover:shadow-lg hover:shadow-black/[0.03] transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                {Array.from({ length: 5 - t.stars }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-black/10" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#1a1a2e] text-sm leading-relaxed mb-6">
                {t.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center text-xs font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a2e]">{t.name}</p>
                  <p className="text-xs text-black/40">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
