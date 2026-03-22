'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ceremony = {
  type: 'Ceremony',
  name: 'Foster Botanical Garden',
  address: '50 N. Vineyard Blvd, Honolulu, HI 96817',
  time: '10:30 AM',
  image: '/venue/ceremony.jpg',
  description: 'Join us as we exchange vows surrounded by the beauty of Foster Botanical Garden.',
}

const reception = {
  type: 'Reception',
  name: "Max's Restaurant",
  address: '801 Dillingham Blvd Suite 108, Honolulu, HI 96817',
  time: '12:00 PM',
  description: 'Celebrate with us over lunch and joyful moments at Max\'s Restaurant.',
}

export default function CeremonySection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const card = sectionRef.current?.querySelector<HTMLElement>('.venue-card')
      const img = sectionRef.current?.querySelector<HTMLElement>('.venue-img')
      const content = sectionRef.current?.querySelector<HTMLElement>('.venue-content')

      if (card && img && content) {
        gsap.fromTo(
          img,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              end: 'top 40%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        gsap.fromTo(
          content,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              end: 'top 35%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="ceremony" className="py-20 sm:py-28 px-5 sm:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-3">Join us at</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground">The Venues</h2>
          <div className="w-16 h-px bg-sage mx-auto mt-5" />
        </div>

        <div className="venue-card flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="venue-img w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-sm">
            <img
              src={ceremony.image}
              alt={`${ceremony.name} venue`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="venue-content w-full md:w-1/2 flex flex-col gap-10">
            <div>
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-2 block">{ceremony.type}</span>
              <h3 className="font-serif text-3xl sm:text-4xl text-foreground mb-3">{ceremony.name}</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-5">{ceremony.description}</p>
              <p className="font-sans text-sm text-foreground/80 mb-1">{ceremony.address}</p>
              <p className="font-sans text-sm text-foreground/80">{ceremony.time}</p>
            </div>

            <div className="w-full h-px bg-sage/20" />

            <div>
              <span className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-2 block">{reception.type}</span>
              <h3 className="font-serif text-3xl sm:text-4xl text-foreground mb-3">{reception.name}</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-5">{reception.description}</p>
              <p className="font-sans text-sm text-foreground/80 mb-1">{reception.address}</p>
              <p className="font-sans text-sm text-foreground/80">{reception.time}</p>
            </div>
          </div>
              </div>
      </div>
    </section>
  )
}
