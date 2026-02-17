'use client'

import React, { useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function RSVPSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attending: '',
    guests: '1',
    dietary: '',
    message: '',
  })

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.rsvp-animate',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Animate success
    if (formRef.current) {
      gsap.to(formRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => setSubmitted(true),
      })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section ref={sectionRef} id="rsvp" className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/sampleimage.jpg" alt="" className="w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-foreground/80" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Section header */}
        <div className="rsvp-animate text-center mb-12 sm:mb-16">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-primary-foreground/50 mb-3">We Hope to See You</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-primary-foreground">RSVP</h2>
          <div className="w-16 h-px bg-sage mx-auto mt-5" />
          <p className="font-sans text-sm text-primary-foreground/50 mt-6">Kindly respond by February 28, 2026</p>
        </div>

        {!submitted ? (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="rsvp-animate flex flex-col gap-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="rsvp-name" className="font-sans text-xs tracking-[0.15em] uppercase text-primary-foreground/60">
                  Full Name
                </label>
                <input
                  id="rsvp-name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-primary-foreground/5 border border-primary-foreground/15 rounded-sm px-4 py-3 font-sans text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-sage transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="rsvp-email" className="font-sans text-xs tracking-[0.15em] uppercase text-primary-foreground/60">
                  Email
                </label>
                <input
                  id="rsvp-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-primary-foreground/5 border border-primary-foreground/15 rounded-sm px-4 py-3 font-sans text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-sage transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="rsvp-attending" className="font-sans text-xs tracking-[0.15em] uppercase text-primary-foreground/60">
                  Will you attend?
                </label>
                <select
                  id="rsvp-attending"
                  name="attending"
                  required
                  value={formData.attending}
                  onChange={handleChange}
                  className="bg-primary-foreground/5 border border-primary-foreground/15 rounded-sm px-4 py-3 font-sans text-sm text-primary-foreground focus:outline-none focus:border-sage transition-colors appearance-none"
                >
                  <option value="" disabled className="text-foreground">Select...</option>
                  <option value="yes" className="text-foreground">Joyfully Accept</option>
                  <option value="no" className="text-foreground">Regretfully Decline</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="rsvp-guests" className="font-sans text-xs tracking-[0.15em] uppercase text-primary-foreground/60">
                  Number of Guests
                </label>
                <select
                  id="rsvp-guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="bg-primary-foreground/5 border border-primary-foreground/15 rounded-sm px-4 py-3 font-sans text-sm text-primary-foreground focus:outline-none focus:border-sage transition-colors appearance-none"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n} className="text-foreground">{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="rsvp-dietary" className="font-sans text-xs tracking-[0.15em] uppercase text-primary-foreground/60">
                Dietary Restrictions
              </label>
              <input
                id="rsvp-dietary"
                name="dietary"
                type="text"
                value={formData.dietary}
                onChange={handleChange}
                className="bg-primary-foreground/5 border border-primary-foreground/15 rounded-sm px-4 py-3 font-sans text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-sage transition-colors"
                placeholder="Any allergies or dietary needs"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="rsvp-message" className="font-sans text-xs tracking-[0.15em] uppercase text-primary-foreground/60">
                Message for the Couple
              </label>
              <textarea
                id="rsvp-message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="bg-primary-foreground/5 border border-primary-foreground/15 rounded-sm px-4 py-3 font-sans text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-sage transition-colors resize-none"
                placeholder="A warm wish or note..."
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-4 bg-sage text-primary-foreground font-sans text-xs tracking-[0.2em] uppercase rounded-sm hover:bg-sage/90 transition-colors focus:outline-none focus:ring-2 focus:ring-sage focus:ring-offset-2 focus:ring-offset-foreground"
            >
              Send RSVP
            </button>
          </form>
        ) : (
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(143, 25%, 55%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-serif text-3xl text-primary-foreground mb-3">Thank You!</h3>
            <p className="font-sans text-sm text-primary-foreground/60 leading-relaxed">
              Your RSVP has been received. We can&apos;t wait to celebrate with you!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
