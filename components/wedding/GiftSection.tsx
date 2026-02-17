'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const giftOptions = [
  {
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: 'Cash Gift',
    description: 'For our guests traveling from afar, a monetary gift would be greatly appreciated and will help us start our life together.',
  },
  {
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
    title: 'Gift Registry',
    description: 'We have curated a selection of items to help us build our home. Your thoughtfulness means the world to us.',
  },
  {
    icon: (
      <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    ),
    title: 'Your Presence',
    description: 'Your presence at our wedding is the greatest gift of all. Having you celebrate with us is all we truly need.',
  },
]

export default function GiftSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.gift-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.15,
            scrollTrigger: {
              trigger: card,
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
    <section ref={sectionRef} id="gifts" className="py-20 sm:py-28 px-5 sm:px-8 bg-sage/5">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-3">Gift Giving</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground">Gift Suggestions</h2>
          <div className="w-16 h-px bg-sage mx-auto mt-5" />
          <p className="font-sans text-sm text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed italic">
            Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we have a few suggestions below.
          </p>
        </div>

        {/* Gift options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {giftOptions.map((option, i) => (
            <div
              key={i}
              className="gift-card flex flex-col items-center text-center p-6 sm:p-8 rounded-sm border border-sage/15 bg-background/50 hover:bg-background transition-colors duration-300"
            >
              <div className="text-sage mb-5">
                {option.icon}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">{option.title}</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {option.description}
              </p>
            </div>
          ))}
        </div>

        {/* Note for international guests */}
        <div className="mt-12 p-6 sm:p-8 rounded-sm border border-gold/20 bg-gold/5 text-center">
          <p className="font-sans text-xs sm:text-sm text-foreground/70 leading-relaxed">
            <span className="font-medium text-gold">For our loved ones who are unable to attend:</span> We completely understand that traveling to Hawaii may not be possible for some of our family and friends, especially with most of our loved ones based in the Philippines. Your love and support mean the world to us, even from afar. Should you wish to send a gift, a cash gift would be deeply appreciated, as it avoids the challenges of international shipping and allows us to cherish your generosity in a meaningful way.
          </p>
        </div>
      </div>
    </section>
  )
}
