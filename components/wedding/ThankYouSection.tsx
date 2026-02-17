'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ThankYouSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.thankyou-animate').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="thankyou" className="py-24 sm:py-32 px-5 sm:px-8 bg-background">
      <div className="max-w-3xl mx-auto text-center">
        <div className="thankyou-animate">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-4">With All Our Love</p>
        </div>

        <h2 className="thankyou-animate font-serif text-5xl sm:text-6xl md:text-7xl text-foreground mb-6">
          Thank You
        </h2>

        <div className="thankyou-animate w-16 h-px bg-sage mx-auto mb-8" />

        <p className="thankyou-animate font-sans text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto mb-8">
          We are incredibly grateful for your love, support, and presence in our lives. 
          Whether near or far, you hold a special place in our hearts. Thank you for being 
          part of our journey and for celebrating this beautiful chapter with us.
        </p>

        <p className="thankyou-animate font-serif text-3xl sm:text-4xl text-foreground mb-3">
          Allen & Vea
        </p>

        <p className="thankyou-animate font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground">
          March 28, 2026 <span className="mx-2 text-gold">|</span> Hawaii
        </p>

        <div className="thankyou-animate mt-12 flex items-center justify-center gap-3 text-sage/50">
          <div className="w-12 h-px bg-sage/30" />
          <span className="font-serif text-xl text-sage">{'A & V'}</span>
          <div className="w-12 h-px bg-sage/30" />
        </div>
      </div>
    </section>
  )
}
