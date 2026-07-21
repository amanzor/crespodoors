import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import { fadeUp, viewportOnce } from '../lib/motion'

const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', placeholder: 'Jordan Lee' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 012-3456' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'jordan@email.com' },
]

const PROJECTS = ['Replace windows', 'Replace doors', 'Both windows & doors', 'New construction / builder', 'Impact / hurricane upgrade']

function FloatingInput({ field, value, onChange }) {
  return (
    <label className="group relative block">
      <input
        required
        type={field.type}
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder=" "
        className="peer w-full rounded-lg border border-stone-700 bg-stone-900/60 px-4 pb-2.5 pt-6 text-stone-50 outline-none transition-colors focus:border-maroon-500"
      />
      <span className="pointer-events-none absolute left-4 top-4 text-sm text-stone-500 transition-all peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-maroon-400 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]">
        {field.label}
      </span>
    </label>
  )
}

export default function CTAForm() {
  const [values, setValues] = useState({ name: '', phone: '', email: '', project: PROJECTS[0], message: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success

  const update = (name, v) => setValues((s) => ({ ...s, [name]: v }))

  const submit = (e) => {
    e.preventDefault()
    setStatus('loading')
    setTimeout(() => setStatus('success'), 1400)
  }

  return (
    <section id="quote" className="bg-stone-950 py-28 text-stone-100">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-5 sm:px-8 lg:grid-cols-5">
        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="lg:col-span-2">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-maroon-400">Get started</span>
          <h2 className="mt-4 font-display text-4xl font-semibold text-stone-50">Request your free, no-pressure quote.</h2>
          <p className="mt-4 text-stone-400">An estimator will confirm your appointment within one business day — most sites are visited within 48 hours.</p>

          <div className="mt-10 space-y-5">
            <a href="tel:18005551234" className="flex items-center gap-3 text-stone-200 transition-colors hover:text-maroon-400">
              <Phone size={18} className="text-maroon-400" /> (800) 555-1234
            </a>
            <a href="mailto:quotes@crespodoors.com" className="flex items-center gap-3 text-stone-200 transition-colors hover:text-maroon-400">
              <Mail size={18} className="text-maroon-400" /> quotes@crespodoors.com
            </a>
            <div className="flex items-center gap-3 text-stone-200">
              <MapPin size={18} className="text-maroon-400" /> Showroom & warehouse open to the public
            </div>
            <div className="flex items-center gap-3 text-stone-200">
              <Clock size={18} className="text-maroon-400" /> Mon&ndash;Sat, 7:00am&ndash;6:00pm
            </div>
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={viewportOnce} variants={fadeUp} className="lg:col-span-3">
          <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/60 p-7 sm:p-9">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}>
                    <CheckCircle2 size={56} className="text-maroon-400" />
                  </motion.div>
                  <h3 className="mt-5 font-display text-2xl font-semibold text-stone-50">Request received.</h3>
                  <p className="mt-2 max-w-xs text-stone-400">An estimator will reach out to {values.name.split(' ')[0] || 'you'} shortly to confirm a time.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {FIELDS.map((f) => (
                    <div key={f.name} className={f.name === 'name' ? 'sm:col-span-2' : ''}>
                      <FloatingInput field={f} value={values[f.name]} onChange={update} />
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs uppercase tracking-wide text-stone-500">Project type</label>
                    <div className="flex flex-wrap gap-2">
                      {PROJECTS.map((p) => (
                        <button
                          type="button"
                          key={p}
                          onClick={() => update('project', p)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                            values.project === p ? 'border-maroon-500 bg-maroon-700 text-stone-50' : 'border-stone-700 text-stone-400 hover:border-stone-500'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <textarea
                      rows={3}
                      value={values.message}
                      onChange={(e) => update('message', e.target.value)}
                      placeholder="Anything else we should know? (opening sizes, timeline, HOA requirements...)"
                      className="w-full resize-none rounded-lg border border-stone-700 bg-stone-900/60 px-4 py-3 text-sm text-stone-50 outline-none transition-colors placeholder:text-stone-600 focus:border-maroon-500"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={status === 'loading'}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-maroon-700 px-7 py-3.5 text-sm font-semibold text-stone-50 shadow-lg shadow-maroon-950/40 transition-colors hover:bg-maroon-600 disabled:opacity-70 sm:col-span-2"
                  >
                    {status === 'loading' ? (
                      <><Loader2 size={16} className="animate-spin" /> Sending request...</>
                    ) : (
                      <>Request Free Quote <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
