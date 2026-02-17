'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const dateRef = useRef<HTMLParagraphElement>(null)
  const inviteRef = useRef<HTMLParagraphElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
        .fromTo(inviteRef.current, { opacity: 0, y: 30, letterSpacing: '0.8em' }, { opacity: 1, y: 0, letterSpacing: '0.35em', duration: 1 }, '-=0.3')
        .fromTo(nameRef.current, { opacity: 0, y: 60, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1.4 }, '-=0.5')
        .fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, '-=0.6')
        .fromTo(dateRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
        .fromTo(scrollRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')

      // Perpetual scroll indicator bounce
      gsap.to(scrollRef.current, {
        y: 8,
        duration: 1.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="home" className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/sampleimage.jpg"
          alt="Allen and Vea wedding portrait"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlays */}
      <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />

      {/* Content — all white text */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <p
          ref={inviteRef}
          className="font-sans text-sm sm:text-base md:text-lg tracking-[0.35em] uppercase mb-4 text-white/80"
        >
          You are invited to the wedding of
        </p>

        <h1
          ref={nameRef}
          className="font-serif leading-tight text-white"
        >
          <span className="block sm:inline" style={{ fontSize: 'clamp(5rem, 15vw, 11rem)' }}>Allen</span>
          <span className="block sm:inline font-sans tracking-widest mx-0 sm:mx-4 my-2 sm:my-0 text-white/60" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.5rem)' }}>&amp;</span>
          <span className="block sm:inline" style={{ fontSize: 'clamp(5rem, 15vw, 11rem)' }}>Vea</span>
        </h1>

        <div ref={dividerRef} className="w-24 sm:w-32 h-px bg-white/40 my-6 sm:my-6" style={{ transformOrigin: 'center' }} />

        <p
          ref={dateRef}
          className="font-sans text-base sm:text-lg md:text-xl tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white/80"
        >
          <span className="block sm:inline">March 28, 2026</span>
          <span className="hidden sm:inline mx-2 text-gold">|</span>
          <span className="block sm:inline mt-2 sm:mt-0">Hawaii <span className="mx-2 text-gold">|</span> 3:00 PM</span>
        </p>

        {/* Scroll indicator */}
        <div ref={scrollRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/50">Scroll</span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-white/50">
            <path d="M8 4L8 20M8 20L2 14M8 20L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </section>
  )
}
