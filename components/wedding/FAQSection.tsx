'use client'

import React, { useRef, useState, useLayoutEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    q: 'What is the dress code?',
    a: 'Semi-formal to formal attire in our wedding color palette: sage green, gold, champagne, ivory, or olive. Please avoid wearing white.',
  },
  {
    q: 'Can I bring a plus one?',
    a: 'We kindly ask that only those named on the invitation attend. If you received a plus one, it will be noted on your RSVP.',
  },
  {
    q: 'Will there be parking available?',
    a: 'Yes, complimentary valet parking will be available at both the ceremony and reception venues.',
  },
  {
    q: 'Is there transportation between the ceremony and reception?',
    a: 'Yes, shuttle buses will be provided from Haiku Gardens to The Willows Honolulu. They will depart at 4:45 PM and 5:15 PM.',
  },
  {
    q: 'Are children welcome?',
    a: 'While we love your little ones, our wedding will be an adults-only celebration. We hope you understand.',
  },
  {
    q: 'What should I do if I have dietary restrictions?',
    a: 'Please note any dietary restrictions on your RSVP card, and we will ensure accommodations are made for you.',
  },
  {
    q: 'When should I RSVP by?',
    a: 'Please RSVP by February 28, 2026 to help us finalize the arrangements.',
  },
  {
    q: 'Will the ceremony be outdoors?',
    a: 'Yes, the ceremony will be held in the beautiful outdoor gardens of Haiku Gardens. In the unlikely event of rain, a covered backup area is available.',
  },
]

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false)
  const answerRef = useRef<HTMLDivElement>(null)
  const itemRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          delay: index * 0.08,
          scrollTrigger: {
            trigger: itemRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
    return () => ctx.revert()
  }, [index])

  const toggle = useCallback(() => {
    const el = answerRef.current
    if (!el) return
    if (!open) {
      gsap.set(el, { height: 'auto' })
      const h = el.offsetHeight
      gsap.fromTo(el, { height: 0, opacity: 0 }, { height: h, opacity: 1, duration: 0.4, ease: 'power3.out' })
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.3, ease: 'power3.in' })
    }
    setOpen(!open)
  }, [open])

  return (
    <div ref={itemRef} className="border-b border-sage/15">
      <button
        className="w-full flex items-center justify-between py-5 sm:py-6 text-left group"
        onClick={toggle}
        aria-expanded={open}
      >
        <span className="font-sans text-sm sm:text-base text-foreground pr-4 group-hover:text-sage transition-colors">{faq.q}</span>
        <span className={`shrink-0 w-5 h-5 flex items-center justify-center text-sage transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M7 1v12M1 7h12" />
          </svg>
        </span>
      </button>
      <div ref={answerRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed pb-5 sm:pb-6 pr-8">{faq.a}</p>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} id="faq" className="py-20 sm:py-28 px-5 sm:px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-3">Need to Know</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground">Questions & Answers</h2>
          <div className="w-16 h-px bg-sage mx-auto mt-5" />
        </div>

        {/* FAQ items in 3D shadow container */}
        <div className="bg-white rounded-lg p-6 sm:p-8 md:p-10" style={{
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 25px rgba(0, 0, 0, 0.08), 0 2px 10px rgba(0, 0, 0, 0.06)',
          transform: 'translateZ(0)'
        }}>
          <div>
            {faqs.map((faq, i) => (
              <FAQItem key={faq.q} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
