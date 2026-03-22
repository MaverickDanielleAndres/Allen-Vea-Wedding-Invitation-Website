'use client'

import React, { useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const colorPalette = [
  { name: 'Sage Green', hex: '#8fac8f' },
  { name: 'Beige', hex: '#d7c3a3' },
  { name: 'Champagne', hex: '#dbc9a8' },
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
        <div className="text-center mb-10 sm:mb-20 dresscode-animate">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-sage mb-3">What to Wear</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground">Attire & Dress Code</h2>
          <div className="w-16 h-px bg-sage mx-auto mt-5" />
          <p className="font-sans text-sm text-muted-foreground mt-6 max-w-lg mx-auto leading-relaxed">
            We kindly request our guests to wear semi-formal to formal attire and follow our wedding color palette.
          </p>
        </div>

        <div className="dresscode-animate mb-14 sm:mb-16">
          <div className="aspect-[16/10] overflow-hidden rounded-sm max-w-3xl mx-auto">
            <img
              src="/Dresscode/dresscodeimage.png"
              alt="Dress code inspiration"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Color palette */}
        <div className="dresscode-animate mb-16">
          <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-gold text-center mb-8">Color Palette</h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-6 sm:gap-8 place-items-center">
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
      </div>
    </section>
  )
}
