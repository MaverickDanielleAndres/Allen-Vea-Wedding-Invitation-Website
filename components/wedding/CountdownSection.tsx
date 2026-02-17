'use client'

import React, { useRef, useLayoutEffect, useState, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const WEDDING_DATE = new Date('2026-03-28T15:00:00-10:00')

function calcCountdown() {
  const now = new Date()
  const diff = WEDDING_DATE.getTime() - now.getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

/* ── Rolling digit component ── */
function RollingDigit({ digit, delay = 0 }: { digit: string; delay?: number }) {
  const digitRef = useRef<HTMLDivElement>(null)
  const prevDigit = useRef(digit)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!digitRef.current) return

    // Initial dramatic roll-in animation
    if (!hasAnimated.current) {
      hasAnimated.current = true
      const targetNum = parseInt(digit, 10) || 0
      // Roll through numbers from 0 to target
      gsap.fromTo(digitRef.current,
        { yPercent: -100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2 + delay * 0.15,
          ease: 'elastic.out(1, 0.6)',
          delay: delay * 0.12,
        }
      )
      prevDigit.current = digit
      return
    }

    // On digit change — smooth roll
    if (prevDigit.current !== digit) {
      gsap.fromTo(digitRef.current,
        { yPercent: -30, opacity: 0.3 },
        { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
      prevDigit.current = digit
    }
  }, [digit, delay])

  return (
    <div className="relative overflow-hidden" style={{ width: '0.65em', height: '1.1em' }}>
      <div ref={digitRef} className="absolute inset-0 flex items-center justify-center">
        <span className="tabular-nums">{digit}</span>
      </div>
    </div>
  )
}

/* ── Rolling Number Display ── */
function RollingNumber({ value, unitDelay = 0 }: { value: number; unitDelay?: number }) {
  const str = String(value).padStart(2, '0')
  return (
    <div className="flex items-center justify-center">
      {str.split('').map((d, i) => (
        <RollingDigit key={i} digit={d} delay={unitDelay + i} />
      ))}
    </div>
  )
}

export default function CountdownSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [countdown, setCountdown] = useState(calcCountdown)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCountdown(calcCountdown()), 1000)
    return () => clearInterval(timer)
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Section title entrance
      gsap.fromTo('.countdown-title', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      })

      // Trigger visible for rolling animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        onEnter: () => setVisible(true),
        once: true,
      })

      gsap.utils.toArray<HTMLElement>('.countdown-unit').forEach((unit, i) => {
        gsap.fromTo(
          unit,
          { opacity: 0, y: 40, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const units = [
    { label: 'Days', value: countdown.days },
    { label: 'Hours', value: countdown.hours },
    { label: 'Minutes', value: countdown.minutes },
    { label: 'Seconds', value: countdown.seconds },
  ]

  return (
    <section ref={sectionRef} id="countdown" className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src="/sampleimage.jpg" alt="" className="w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-foreground/70" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="countdown-title font-sans text-xs tracking-[0.3em] uppercase text-primary-foreground/60 mb-3">Save the Date</p>
        <h2 className="countdown-title font-serif text-4xl sm:text-5xl md:text-6xl text-primary-foreground mb-4">Counting Down</h2>
        <p className="countdown-title font-sans text-sm text-primary-foreground/60 mb-12">to March 28, 2026 at 3:00 PM HST</p>

        <div className="flex justify-center gap-4 sm:gap-8">
          {units.map((u, i) => (
            <div key={u.label} className="countdown-unit flex flex-col items-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-sm border border-primary-foreground/20 bg-primary-foreground/5 backdrop-blur-sm flex items-center justify-center mb-3">
                <span className="font-sans text-2xl sm:text-4xl font-light text-primary-foreground">
                  {visible ? (
                    <RollingNumber value={u.value} unitDelay={i * 2} />
                  ) : (
                    <span className="tabular-nums opacity-0">00</span>
                  )}
                </span>
              </div>
              <span className="font-sans text-[10px] sm:text-xs tracking-[0.2em] uppercase text-primary-foreground/50">{u.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
