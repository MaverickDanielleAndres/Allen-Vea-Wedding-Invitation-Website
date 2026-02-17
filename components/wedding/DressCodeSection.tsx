'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const colorPalette = [
  { name: 'Sage Green', hex: '#8fac8f' },
  { name: 'Gold', hex: '#c9a84c' },
  { name: 'Ivory', hex: '#f5f0e8' },
  { name: 'Champagne', hex: '#dbc9a8' },
  { name: 'Olive', hex: '#6b7c5e' },
]

export default function DressCodeSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.dresscode-animate').forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: {
              trigger: el,
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
    <section ref={sectionRef} id="dresscode" className="py-20 sm:py-28 px-5 sm:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20 dresscode-animate">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-3">What to Wear</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground">Attire & Dress Code</h2>
          <div className="w-16 h-px bg-sage mx-auto mt-5" />
          <p className="font-sans text-sm text-muted-foreground mt-6 max-w-lg mx-auto leading-relaxed">
            We kindly request our guests to wear semi-formal to formal attire in our wedding color palette. Please avoid wearing white, as it is reserved for the bride.
          </p>
        </div>

        {/* Color palette */}
        <div className="dresscode-animate mb-16">
          <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-gold text-center mb-8">Color Palette</h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 place-items-center">
              {colorPalette.map((color) => (
                <div key={color.name} className="flex flex-col items-center gap-3">
                  <div
                    className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border border-foreground/10 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    aria-label={color.name}
                  />
                  <span className="font-sans text-[10px] sm:text-xs tracking-wider text-muted-foreground text-center">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dress suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="dresscode-animate">
            <div className="aspect-[2/2.5] overflow-hidden rounded-sm mb-6 max-w-xs mx-auto">
              <img
                src="/sampleimage.jpg"
                alt="Women's attire suggestions"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="font-serif text-2xl text-foreground text-center mb-2">For the Ladies</h3>
            <p className="font-sans text-sm text-muted-foreground text-center leading-relaxed">
              Floor-length or midi cocktail dresses in sage green, gold, champagne, or olive tones. Elegant accessories with gold or pearl accents are encouraged.
            </p>
          </div>

          <div className="dresscode-animate">
            <div className="aspect-[2/2.5] overflow-hidden rounded-sm mb-6 max-w-xs mx-auto">
              <img
                src="/sampleimage.jpg"
                alt="Men's attire suggestions"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="font-serif text-2xl text-foreground text-center mb-2">For the Gentlemen</h3>
            <p className="font-sans text-sm text-muted-foreground text-center leading-relaxed">
              Dark suits in charcoal, navy, or black paired with sage green ties or pocket squares. A barong tagalog is also a wonderful choice.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
