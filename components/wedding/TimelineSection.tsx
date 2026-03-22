'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const timeline = [
  { time: '10:30 AM', event: 'Ceremony', detail: 'Foster Botanical Garden' },
  { time: '11:30 AM', event: 'Transition', detail: 'Travel to reception venue' },
  { time: '12:00 PM', event: 'Reception', detail: "Max's Restaurant" },
  { time: 'After Reception', event: 'Afterparty' },
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

      // Animate circles
      gsap.utils.toArray<HTMLElement>('.timeline-circle').forEach((circle, i) => {
        gsap.fromTo(
          circle,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: circle,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            delay: i * 0.08,
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
    <section ref={sectionRef} id="timeline" className="py-20 sm:py-28 px-5 sm:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-3">Honolulu, Hawaii Time</p>
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
                {/* Circle dot - centered on line for both mobile and desktop */}
                <div className="absolute left-[23px] sm:left-1/2 -translate-x-1/2 top-1.5 w-[11px] h-[11px] rounded-full border-2 border-sage bg-white z-10 timeline-circle" />

                {/* Content */}
                <div className={`ml-12 sm:ml-0 sm:w-[45%] ${i % 2 === 0 ? 'sm:text-right sm:pr-10' : 'sm:text-left sm:pl-10'}`}>
                  <span className="font-sans text-xs tracking-[0.2em] uppercase text-gold font-medium">{item.time}</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-foreground mt-1">{item.event}</h3>
                  {item.detail ? <p className="font-sans text-sm text-muted-foreground mt-1">{item.detail}</p> : null}
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
