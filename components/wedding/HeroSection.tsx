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
  const decorLeftRef = useRef<HTMLDivElement>(null)
  const decorRightRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
        .fromTo(inviteRef.current, { opacity: 0, y: 30, letterSpacing: '0.8em' }, { opacity: 1, y: 0, letterSpacing: '0.35em', duration: 1 }, '-=0.3')
        .fromTo(nameRef.current, { opacity: 0, y: 60, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 1.4 }, '-=0.5')
        .fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, '-=0.6')
        .fromTo(dateRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
        .fromTo(scrollRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')

      // Animate decorative elements
      tl.fromTo([decorLeftRef.current, decorRightRef.current], 
        { opacity: 0, scale: 0 }, 
        { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)' }, 
        '-=0.8'
      )

      // Animate floating particles
      gsap.utils.toArray<HTMLElement>('.hero-particle').forEach((particle, i) => {
        gsap.fromTo(
          particle,
          { opacity: 0, y: 20, scale: 0 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            delay: 0.5 + i * 0.1,
            ease: 'power2.out',
          }
        )
        
        // Floating animation
        gsap.to(particle, {
          y: '-=15',
          duration: 2 + i * 0.3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.2,
        })
      })

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
    <section ref={sectionRef} id="home" className="relative w-full h-screen min-h-screen overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/sampleimage.jpg"
          alt="Allen and Vea wedding portrait"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlays */}
      <div ref={overlayRef} className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />

      {/* Floating decorative particles */}
      <div className="hero-particle absolute top-1/4 left-[15%] w-2 h-2 rounded-full bg-white/30 pointer-events-none" />
      <div className="hero-particle absolute top-1/3 right-[20%] w-3 h-3 rounded-full bg-gold/40 pointer-events-none" />
      <div className="hero-particle absolute bottom-1/3 left-[25%] w-2 h-2 rounded-full bg-white/25 pointer-events-none" />
      <div className="hero-particle absolute bottom-1/4 right-[15%] w-2 h-2 rounded-full bg-gold/30 pointer-events-none" />
      <div className="hero-particle absolute top-[40%] left-[10%] w-1.5 h-1.5 rounded-full bg-white/20 pointer-events-none" />
      <div className="hero-particle absolute top-[60%] right-[12%] w-1.5 h-1.5 rounded-full bg-gold/25 pointer-events-none" />

      {/* Decorative geometric shapes */}
      <div ref={decorLeftRef} className="absolute left-8 sm:left-16 top-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 border border-white/10 rotate-45 pointer-events-none" />
      <div ref={decorRightRef} className="absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-gold/10 pointer-events-none" />

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
          <span className="block sm:inline font-serif tracking-normal mx-0 sm:mx-8 my-2 sm:my-0 text-white/60" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>&amp;</span>
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
