import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Is ExpenSleek free to use?',
    a: 'Yes! ExpenSleek is completely free and open-source. You can self-host it or use our hosted version at no cost. There are no hidden fees or premium tiers.',
  },
  {
    q: 'What categories are supported?',
    a: 'ExpenSleek supports 8 built-in categories: Food & Dining, Shopping, Transport, Entertainment, Rent & Utilities, Health, Education, and Other. You can filter and sort expenses by any of these.',
  },
  {
    q: 'Can I export my expense data?',
    a: 'The backend API returns clean JSON data that can be easily exported. We are working on CSV/PDF export features for an upcoming release.',
  },
  {
    q: 'How secure is my financial data?',
    a: 'Your data is stored locally in your MongoDB instance. We use Helmet.js for security headers, CORS protection, and input validation on all API endpoints. Your data never leaves your server.',
  },
  {
    q: 'Does ExpenSleek support multiple currencies?',
    a: 'Currently ExpenSleek is optimized for Indian Rupees (₹), but the amount field accepts any numeric value. Multi-currency support with automatic conversion is on our roadmap.',
  },
  {
    q: 'Can I track expenses from multiple payment methods?',
    a: 'Absolutely. ExpenSleek supports Cash, UPI, and Card payment methods. Each expense is tagged with its payment method, making it easy to see spending patterns across different payment channels.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="bg-[#F5F5F5] px-6 py-24">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-black/50 text-sm uppercase tracking-widest mb-3">FAQ</p>
          <h2
            className="text-4xl md:text-5xl font-medium leading-tight mb-6"
            style={{ letterSpacing: '-0.03em' }}
          >
            Got questions?
            <br />
            We've got answers.
          </h2>
          <p className="text-black/50 text-base leading-relaxed max-w-md">
            Everything you need to know about ExpenSleek. Can't find what you're looking for? Reach out to our support team.
          </p>
        </div>

        {/* Right Column: Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'bg-white border-black/8 shadow-sm'
                    : 'bg-white/50 border-black/5 hover:bg-white/80'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-base font-medium text-[#1a1a2e] pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-black/30 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-6 pb-6 text-sm text-black/50 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
