'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const venues = [
  {
    type: 'Ceremony',
    name: 'Haiku Gardens',
    address: '46-336 Haiku Road, Kaneohe, HI 96744',
    time: '3:00 PM - 4:30 PM',
    image: '/images/ceremony-venue.jpg',
    description: 'Nestled beneath the majestic Ko\'olau mountains, Haiku Gardens is a breathtaking tropical paradise where we will exchange our vows surrounded by lush greenery and the whisper of Hawaiian winds.',
  },
  {
    type: 'Reception',
    name: 'The Willows Honolulu',
    address: '901 Hausten Street, Honolulu, HI 96826',
    time: '6:00 PM - 11:00 PM',
    image: '/images/reception-venue.jpg',
    description: 'Join us for an enchanting evening of dinner, dancing, and celebration at The Willows, a historic Hawaiian venue surrounded by natural springs and tropical beauty.',
  },
]

export default function CeremonySection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.venue-card').forEach((card, i) => {
        const img = card.querySelector('.venue-img')
        const content = card.querySelector('.venue-content')
        const direction = i % 2 === 0 ? -60 : 60

        gsap.fromTo(
          img,
          { x: direction, opacity: 0 },
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
          { x: -direction, opacity: 0 },
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
      })
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

        {/* Venue cards */}
        <div className="flex flex-col gap-20 sm:gap-28">
          {venues.map((venue, i) => (
            <div
              key={venue.type}
              className={`venue-card flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}
            >
              {/* Image */}
              <div className="venue-img w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-sm">
                <img
                  src="/sampleimage.jpg"
                  alt={`${venue.name} - ${venue.type} venue`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="venue-content w-full md:w-1/2 flex flex-col">
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-2">{venue.type}</span>
                <h3 className="font-serif text-3xl sm:text-4xl text-foreground mb-4">{venue.name}</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">{venue.description}</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 mt-0.5 text-sage shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span className="font-sans text-sm text-foreground/80">{venue.address}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 mt-0.5 text-sage shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className="font-sans text-sm text-foreground/80">{venue.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
