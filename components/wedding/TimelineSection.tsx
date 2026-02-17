'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  { time: '2:30 PM', event: 'Guest Arrival', detail: 'Welcome drinks and seating at Haiku Gardens' },
  { time: '3:00 PM', event: 'Ceremony Begins', detail: 'The exchange of vows under the floral arch' },
  { time: '3:45 PM', event: 'Ring Exchange & Kiss', detail: 'The moment we\'ve been waiting for' },
  { time: '4:00 PM', event: 'Cocktail Hour', detail: 'Light refreshments and photos at the garden' },
  { time: '4:30 PM', event: 'Travel to Reception', detail: 'Transportation to The Willows Honolulu' },
  { time: '6:00 PM', event: 'Reception Begins', detail: 'Welcome toast and dinner service' },
  { time: '7:30 PM', event: 'First Dance', detail: 'Allen & Vea take the floor' },
  { time: '8:00 PM', event: 'Toasts & Speeches', detail: 'Words from family and friends' },
  { time: '8:30 PM', event: 'Open Dance Floor', detail: 'Dance the night away' },
  { time: '10:30 PM', event: 'Sparkler Send-Off', detail: 'A magical farewell under the stars' },
]

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })

      const line = sectionRef.current?.querySelector('.timeline-line')
      if (line) {
        gsap.fromTo(
          line,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 40%',
              scrub: 1.5,
            },
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="timeline" className="py-20 sm:py-28 px-5 sm:px-8 bg-sage/5">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-3">The Schedule</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground">Our Day</h2>
          <div className="w-16 h-px bg-sage mx-auto mt-5" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="timeline-line absolute left-[23px] sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px bg-sage/30" style={{ transformOrigin: 'top' }} />

          <div className="flex flex-col gap-8 sm:gap-6">
            {timeline.map((item, i) => (
              <div
                key={item.time}
                className={`timeline-item relative flex items-start gap-6 sm:gap-0 ${
                  i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Dot */}
                <div className="absolute left-[18px] sm:left-1/2 sm:-translate-x-1/2 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-sage bg-background z-10" />

                {/* Content */}
                <div className={`ml-12 sm:ml-0 sm:w-[45%] ${i % 2 === 0 ? 'sm:text-right sm:pr-10' : 'sm:text-left sm:pl-10'}`}>
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-gold font-medium">{item.time}</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-foreground mt-1">{item.event}</h3>
                  <p className="font-sans text-sm text-muted-foreground mt-1">{item.detail}</p>
                </div>

                {/* Spacer */}
                <div className="hidden sm:block sm:w-[10%]" />
                <div className={`hidden sm:block sm:w-[45%]`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
