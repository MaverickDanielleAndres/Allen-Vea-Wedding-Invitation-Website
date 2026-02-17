'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stories = [
  {
    quote: '"The moment I saw you, I knew an adventure was going to happen."',
    date: 'June 2019',
    attribution: '— The Day We Met',
    image: '/sampleimage.jpg',
  },
  {
    quote: '"Every love story is beautiful, but ours is my favorite."',
    date: 'December 2019',
    attribution: '— Our First Date',
    image: '/sampleimage.jpg',
  },
  {
    quote: '"In all the world, there is no heart for me like yours."',
    date: 'February 2021',
    attribution: '— When I Knew',
    image: '/sampleimage.jpg',
  },
  {
    quote: '"I choose you. And I\'ll choose you over and over, without pause, without doubt."',
    date: 'August 2024',
    attribution: '— The Proposal',
    image: '/sampleimage.jpg',
  },
  {
    quote: '"Two souls with but a single thought, two hearts that beat as one."',
    date: 'March 2026',
    attribution: '— Forever Begins',
    image: '/sampleimage.jpg',
  },
]

export default function LoveStorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(0)
  const dragDelta = useRef(0)
  const [isMobile, setIsMobile] = useState(false)
  const descRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.love-story-title',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Animate description text change
  useEffect(() => {
    if (!descRef.current) return
    gsap.fromTo(descRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
  }, [activeIndex])

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= stories.length) return
    setActiveIndex(index)
  }, [])

  const handlePrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])
  const handleNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])

  // Touch / mouse drag
  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    dragStart.current = clientX
    dragDelta.current = 0
  }
  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    dragDelta.current = clientX - dragStart.current
  }
  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (Math.abs(dragDelta.current) > 50) {
      if (dragDelta.current < 0) handleNext()
      else handlePrev()
    }
  }

  // Card width/gap calculations
  const cardWidth = isMobile ? 260 : 360
  const gap = isMobile ? 16 : 30

  const activeStory = stories[activeIndex]

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{
        background: '#ececec',
      }}
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center 40%, rgba(0,0,0,0.02) 0%, transparent 70%)',
      }} />

      {/* Header */}
      <div className="love-story-title text-center mb-10 sm:mb-14 relative z-10">
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-2">Our Love Story</h2>
      </div>

      {/* Carousel viewport */}
      <div
        className="relative z-10 mx-auto"
        style={{ maxWidth: '100vw', overflow: 'visible' }}
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => { if (isDragging) handleDragMove(e.clientX) }}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div
          className="flex items-center select-none"
          style={{
            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
            transform: `translateX(${-activeIndex * (cardWidth + gap) + (isDragging ? dragDelta.current : 0)}px)`,
            paddingLeft: `calc(50vw - ${cardWidth / 2}px)`,
            paddingRight: `calc(50vw - ${cardWidth / 2}px)`,
            paddingTop: '40px',
            paddingBottom: '40px',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          {stories.map((story, index) => {
            const isActive = index === activeIndex
            const distance = Math.abs(index - activeIndex)

            return (
              <div
                key={index}
                className="shrink-0"
                style={{
                  width: cardWidth,
                  marginRight: index < stories.length - 1 ? gap : 0,
                  transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  transform: isActive ? 'scale(1)' : `scale(${Math.max(0.78, 1 - distance * 0.11)})`,
                  opacity: isActive ? 1 : Math.max(0.25, 1 - distance * 0.4),
                  filter: isActive ? 'blur(0px)' : `blur(${Math.min(distance * 4, 8)}px)`,
                  zIndex: isActive ? 10 : 5 - distance,
                }}
                onClick={() => !isDragging && goTo(index)}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: '20px',
                    aspectRatio: '3/4.2',
                    boxShadow: isActive
                      ? '0 30px 60px rgba(0,0,0,0.5), 0 10px 20px rgba(0,0,0,0.3)'
                      : '0 10px 30px rgba(0,0,0,0.3)',
                  }}
                >
                  {/* Image */}
                  <img
                    src={story.image}
                    alt={`Love story - ${story.date}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  {/* Bottom gradient for text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Quote overlay on each card */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                    <p className="font-sans text-[10px] sm:text-xs text-white/50 tracking-[0.2em] uppercase mb-2">
                      {story.date}
                    </p>
                    <p className="font-sans text-xs sm:text-sm text-white/90 leading-relaxed italic">
                      {story.quote}
                    </p>
                    {story.attribution && (
                      <p className="font-sans text-[10px] sm:text-xs text-white/60 mt-2">
                        {story.attribution}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Description text below carousel — changes with active card */}
      <div ref={descRef} className="text-center mt-8 sm:mt-12 px-6 relative z-10 max-w-2xl mx-auto">
        <p className="font-sans text-xs sm:text-sm text-foreground/70 leading-relaxed italic">
          {activeStory.quote}
        </p>
        <p className="font-sans text-[10px] sm:text-xs text-muted-foreground/60 mt-2 tracking-[0.2em] uppercase">
          {activeStory.date} {activeStory.attribution}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mt-6 sm:mt-8 gap-1.5 relative z-10">
        {stories.map((_, index) => (
          <button
            key={index}
            className="transition-all duration-400 rounded-full"
            style={{
              width: index === activeIndex ? 28 : 8,
              height: 4,
              background: index === activeIndex ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.2)',
            }}
            onClick={() => goTo(index)}
            aria-label={`Go to story ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
