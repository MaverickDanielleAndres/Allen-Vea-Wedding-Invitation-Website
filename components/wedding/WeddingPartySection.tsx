'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface PartyMember {
  name: string
  role: string
  image: string
}

const bridesmaids: PartyMember[] = [
  { name: 'Maria Santos', role: 'Maid of Honor', image: '/sampleimage.jpg' },
  { name: 'Isabella Cruz', role: 'Bridesmaid', image: '/sampleimage.jpg' },
  { name: 'Sofia Reyes', role: 'Bridesmaid', image: '/sampleimage.jpg' },
  { name: 'Ana Garcia', role: 'Bridesmaid', image: '/sampleimage.jpg' },
]

const groomsmen: PartyMember[] = [
  { name: 'Miguel Torres', role: 'Best Man', image: '/sampleimage.jpg' },
  { name: 'Rafael Lim', role: 'Groomsman', image: '/sampleimage.jpg' },
  { name: 'Carlos Rivera', role: 'Groomsman', image: '/sampleimage.jpg' },
  { name: 'David Aquino', role: 'Groomsman', image: '/sampleimage.jpg' },
]

const parents: PartyMember[] = [
  { name: 'Roberto Bogaoisan', role: 'Father of the Groom', image: '/sampleimage.jpg' },
  { name: 'Elena Bogaoisan', role: 'Mother of the Groom', image: '/sampleimage.jpg' },
  { name: 'Ricardo Mantilla', role: 'Father of the Bride', image: '/sampleimage.jpg' },
  { name: 'Carmen Mantilla', role: 'Mother of the Bride', image: '/sampleimage.jpg' },
]

const ninong: PartyMember[] = [
  { name: 'Antonio Del Rosario', role: 'Ninong', image: '/sampleimage.jpg' },
  { name: 'Fernando Villanueva', role: 'Ninong', image: '/sampleimage.jpg' },
  { name: 'Eduardo Santos', role: 'Ninong', image: '/sampleimage.jpg' },
  { name: 'Rodrigo Martinez', role: 'Ninong', image: '/sampleimage.jpg' },
  { name: 'Vicente Lopez', role: 'Ninong', image: '/sampleimage.jpg' },
  { name: 'Alejandro Ramos', role: 'Ninong', image: '/sampleimage.jpg' },
]

const ninang: PartyMember[] = [
  { name: 'Lucia Fernandez', role: 'Ninang', image: '/sampleimage.jpg' },
  { name: 'Teresa Gonzales', role: 'Ninang', image: '/sampleimage.jpg' },
  { name: 'Rosa Morales', role: 'Ninang', image: '/sampleimage.jpg' },
  { name: 'Beatriz Santiago', role: 'Ninang', image: '/sampleimage.jpg' },
  { name: 'Gloria Castillo', role: 'Ninang', image: '/sampleimage.jpg' },
  { name: 'Mercedes Flores', role: 'Ninang', image: '/sampleimage.jpg' },
]

function PersonCard({ member, index }: { member: PartyMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: index * 0.1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
    return () => ctx.revert()
  }, [index])

  return (
    <div ref={cardRef} className="flex flex-col items-center text-center">
      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mb-4 border-2 border-sage/20">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <h3 className="font-serif text-xl sm:text-2xl text-foreground">{member.name}</h3>
      <p className="font-sans text-xs tracking-[0.15em] uppercase text-sage mt-1">{member.role}</p>
    </div>
  )
}

export default function WeddingPartySection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} id="party" className="py-20 sm:py-28 px-5 sm:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-3">The Entourage</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground">Wedding Party</h2>
          <div className="w-16 h-px bg-sage mx-auto mt-5" />
        </div>

        {/* Bridesmaids */}
        <div className="mb-16">
          <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-gold text-center mb-10">Bridesmaids</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {bridesmaids.map((m, i) => (
              <PersonCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </div>

        {/* Groomsmen */}
        <div className="mb-16">
          <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-gold text-center mb-10">Groomsmen</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {groomsmen.map((m, i) => (
              <PersonCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </div>

        {/* Parents */}
        <div className="mb-16">
          <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-gold text-center mb-10">Our Beloved Parents</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
            {parents.map((m, i) => (
              <PersonCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </div>

        {/* Ninong */}
        <div className="mb-16">
          <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-gold text-center mb-10">Ninong</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
            {ninong.map((m, i) => (
              <PersonCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </div>

        {/* Ninang */}
        <div>
          <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-gold text-center mb-10">Ninang</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10">
            {ninang.map((m, i) => (
              <PersonCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
