'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type EntouragePerson = {
  name: string
  role: string
}

const entourageGroups: Array<{ title: string; people: EntouragePerson[] }> = [
  {
    title: 'Our Parents',
    people: [
      { name: 'Ronnel C. Bagaoisan', role: "Groom's Father" },
      { name: 'Ailene Grace A. Bagaoisan', role: "Groom's Mother" },
      { name: 'Jovito L. Mantilla', role: "Bride's Father" },
      { name: 'Pablita P. Mantilla', role: "Bride's Mother" },
    ],
  },
  {
    title: "Bestman and Grooms Man",
    people: [
      { name: 'Aaron Ralph A Bagaoisan', role: 'Best Man' },
      { name: 'Brinden Peek', role: "Groom's Man" },
      { name: 'Reymund M. Palatan', role: "Groom's Man" },
      { name: 'John ronnie Domingo', role: "Groom's Man" },
      { name: 'Brndo C. Orpila', role: "Groom's Man" },
    ],
  },
  {
    title: 'Brides Maid',
    people: [
      { name: 'Airo Peek', role: "Bride's Maid" },
      { name: 'Gabriella Forbes', role: "Bride's Maid" },
    ],
  },
  {
    title: 'Ninong and Ninang',
    people: [
      { name: 'Anacleto Bagaoisan', role: 'Ninong' },
      { name: 'Lanie Bagaoisan', role: 'Ninang' },
      { name: 'Nestor Pabilona', role: 'Ninong' },
      { name: 'Ruvelin Pabilona', role: 'Ninang' },
      { name: 'Jacqueline A. Luz', role: 'Ninang' },
    ],
  },
  {
    title: 'Special Participation',
    people: [
      { name: 'Remberto Palatan', role: 'Bride Parents' },
      { name: 'Lina Palatan', role: 'Bride Parents' },
    ],
  },
  {
    title: 'Grandparents',
    people: [
      { name: 'Virginia Aribuabo', role: "Groom's Grand Parent" },
      { name: 'Virginia Vargo', role: "Groom's Grand Parent" },
      { name: 'Joe Vargo', role: "Groom's Grand Parent" },
    ],
  }
]

export default function WeddingPartySection() {
  const sectionRef = useRef<HTMLElement>(null)

  const nameClass = 'font-serif text-3xl sm:text-4xl text-foreground text-center leading-tight'
  const roleClass = 'font-sans text-sm sm:text-base tracking-[0.2em] uppercase text-sage mt-1'

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.party-group').forEach((group, i) => {
        gsap.fromTo(
          group,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: {
              trigger: group,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="party" className="py-20 sm:py-28 px-5 sm:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-3">The Entourage</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground">Wedding Party</h2>
          <div className="w-16 h-px bg-sage mx-auto mt-5" />
        </div>

        <div>
          {entourageGroups.map((group, groupIndex) => (
            <div key={group.title} className={`party-group ${groupIndex < entourageGroups.length - 1 ? 'mb-14 sm:mb-16' : ''}`}>
              <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-gold text-center mb-8">{group.title}</h3>

              {group.title === 'Our Parents' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {group.people.slice(0, 2).map((person) => (
                      <div key={person.name} className="text-center">
                        <p className={nameClass}>{person.name}</p>
                        <p className={roleClass}>{person.role}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {group.people.slice(2, 4).map((person) => (
                      <div key={person.name} className="text-center">
                        <p className={nameClass}>{person.name}</p>
                        <p className={roleClass}>{person.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {group.title === 'Bestman and Grooms Man' && (
                <div className="space-y-6">
                  <div className="max-w-xl mx-auto text-center">
                    <p className={nameClass}>{group.people[0].name}</p>
                    <p className={roleClass}>{group.people[0].role}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
                    {group.people.slice(1).map((person) => (
                      <div key={person.name} className="text-center">
                        <p className={nameClass}>{person.name}</p>
                        <p className={roleClass}>{person.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {group.title === 'Brides Maid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
                  {group.people.map((person) => (
                    <div key={person.name} className="text-center">
                      <p className={nameClass}>{person.name}</p>
                      <p className={roleClass}>{person.role}</p>
                    </div>
                  ))}
                </div>
              )}

              {group.title === 'Special Participation' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
                  {group.people.map((person) => (
                    <div key={person.name} className="text-center">
                      <p className={nameClass}>{person.name}</p>
                      <p className={roleClass}>{person.role}</p>
                    </div>
                  ))}
                </div>
              )}

              {group.title === 'Ninong and Ninang' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-4xl mx-auto">
                  {group.people.map((person, index) => {
                    const isLastOdd = group.people.length % 2 === 1 && index === group.people.length - 1

                    return (
                      <div key={person.name} className={`text-center ${isLastOdd ? 'md:col-span-2 md:max-w-md md:mx-auto' : ''}`}>
                        <p className={nameClass}>{person.name}</p>
                        <p className={roleClass}>{person.role}</p>
                      </div>
                    )
                  })}
                </div>
              )}

              {group.title !== 'Our Parents' &&
                group.title !== 'Bestman and Grooms Man' &&
                group.title !== 'Brides Maid' &&
                group.title !== 'Ninong and Ninang' &&
                group.title !== 'Special Participation' && (
                  <div className={`grid gap-4 sm:gap-5 ${group.people.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
                    {group.people.map((person) => (
                      <div key={person.name} className="text-center">
                        <p className={nameClass}>{person.name}</p>
                        <p className={roleClass}>{person.role}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
