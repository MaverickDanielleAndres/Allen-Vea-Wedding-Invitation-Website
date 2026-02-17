'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'

export default function CoupleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const groomRef = useRef<HTMLDivElement>(null)
  const brideRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(groomRef.current, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 1.2 })
        .fromTo(dividerRef.current, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.8 }, '-=0.6')
        .fromTo(brideRef.current, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 1.2 }, '-=0.8')
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 px-5 sm:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16">
          {/* Groom */}
          <div ref={groomRef} className="flex flex-col items-center text-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden mb-6 border-4 border-sage/20 shadow-xl">
              <img
                src="/sampleimage.jpg"
                alt="Allen Bogaoisan - The Groom"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">Allen Bogaoisan</h3>
            <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-sage">The Groom</p>
          </div>

          {/* Divider */}
          <div ref={dividerRef} className="w-px h-20 md:h-40 bg-sage/30" style={{ transformOrigin: 'center' }} />

          {/* Bride */}
          <div ref={brideRef} className="flex flex-col items-center text-center">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full overflow-hidden mb-6 border-4 border-sage/20 shadow-xl">
              <img
                src="/sampleimage.jpg"
                alt="Vea Lee Mantilla - The Bride"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-2">Vea Lee Mantilla</h3>
            <p className="font-sans text-xs sm:text-sm tracking-[0.3em] uppercase text-sage">The Bride</p>
          </div>
        </div>
      </div>
    </section>
  )
}
