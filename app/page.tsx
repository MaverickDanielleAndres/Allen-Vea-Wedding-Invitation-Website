'use client'

import React, { useState, useCallback, useRef, useLayoutEffect, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'

gsap.registerPlugin(ScrollTrigger)

/* ───── Background Music Hook ───── */
function useBackgroundMusic(shouldPlay: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!audioRef.current) {
      audioRef.current = new Audio('/BGMUSIC.webm')
      audioRef.current.loop = true
    }

    if (shouldPlay && audioRef.current) {
      // Start immediately at audible volume
      audioRef.current.volume = 0.4
      audioRef.current.play().catch(error => {
        console.log('Audio autoplay prevented:', error)
      })

      // Quick fade to target volume
      gsap.to(audioRef.current, { 
        volume: 0.5, 
        duration: 1, 
        ease: 'linear' 
      })
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [shouldPlay])

  return null
}

const EnvelopeAnimation = dynamic(() => import('@/components/wedding/EnvelopeAnimation'), { ssr: false })
const StaggeredMenu = dynamic(() => import('@/components/wedding/StaggeredMenu'), { ssr: false })
const HeroSection = dynamic(() => import('@/components/wedding/HeroSection'), { ssr: false })
const CoupleSection = dynamic(() => import('@/components/wedding/CoupleSection'), { ssr: false })
const VideoSection = dynamic(() => import('@/components/wedding/VideoSection'), { ssr: false })
const CeremonySection = dynamic(() => import('@/components/wedding/CeremonySection'), { ssr: false })
const TimelineSection = dynamic(() => import('@/components/wedding/TimelineSection'), { ssr: false })
const CountdownSection = dynamic(() => import('@/components/wedding/CountdownSection'), { ssr: false })
const LoveStorySection = dynamic(() => import('@/components/wedding/LoveStorySection'), { ssr: false })
const GallerySection = dynamic(() => import('@/components/wedding/GallerySection'), { ssr: false })
const WeddingPartySection = dynamic(() => import('@/components/wedding/WeddingPartySection'), { ssr: false })
const DressCodeSection = dynamic(() => import('@/components/wedding/DressCodeSection'), { ssr: false })
const GiftSection = dynamic(() => import('@/components/wedding/GiftSection'), { ssr: false })
const FAQSection = dynamic(() => import('@/components/wedding/FAQSection'), { ssr: false })
const RSVPSection = dynamic(() => import('@/components/wedding/RSVPSection'), { ssr: false })
const ThankYouSection = dynamic(() => import('@/components/wedding/ThankYouSection'), { ssr: false })

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to hero section', link: '#home' },
  { label: 'Our Story', ariaLabel: 'Read our love story', link: '#story' },
  { label: 'Ceremony', ariaLabel: 'View ceremony details', link: '#ceremony' },
  { label: 'Timeline', ariaLabel: 'View wedding timeline', link: '#timeline' },
  { label: 'Gallery', ariaLabel: 'View photo gallery', link: '#gallery' },
  { label: 'Wedding Party', ariaLabel: 'Meet the wedding party', link: '#party' },
  { label: 'Dress Code', ariaLabel: 'View dress code', link: '#dresscode' },
  { label: 'Gift Registry', ariaLabel: 'View gift suggestions', link: '#gifts' },
  { label: 'FAQ', ariaLabel: 'Frequently asked questions', link: '#faq' },
  { label: 'RSVP', ariaLabel: 'RSVP to the wedding', link: '#rsvp' },
]

export default function WeddingPage() {
  const [envelopeComplete, setEnvelopeComplete] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const contentWrapperRef = useRef<HTMLDivElement>(null)
  const envelopeRef = useRef<HTMLDivElement>(null)

  const [showMain, setShowMain] = useState(false)
  const [startMusic, setStartMusic] = useState(false)

  // Start background music IMMEDIATELY when envelope completes (intro fades out)
  useBackgroundMusic(startMusic)

  // Ensure page starts at the top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  const handleEnvelopeComplete = useCallback(() => {
    // Start main content immediately - it will fade in UNDER the envelope
    setShowMain(true)
    // Ensure we're at the absolute top
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    // Start fading out envelope after hero starts fading in
    setTimeout(() => {
      if (envelopeRef.current) {
        gsap.to(envelopeRef.current, {
          opacity: 0,
          duration: 1.2,
          ease: 'power1.out',
          onComplete: () => {
            setEnvelopeComplete(true)
          }
        })
      }
    }, 300)
  }, [])

  const handleMusicStart = useCallback(() => {
    // Start music immediately after Vea Lee Mantilla finishes typing
    setStartMusic(true)
  }, [])

  useLayoutEffect(() => {
    if (!showMain || !mainRef.current || !contentWrapperRef.current) return
    
    // CRITICAL: Force scroll to absolute top IMMEDIATELY
    const forceScrollToTop = () => {
      if (contentWrapperRef.current) {
        contentWrapperRef.current.scrollTop = 0
      }
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    
    // Execute multiple times
    forceScrollToTop()
    requestAnimationFrame(forceScrollToTop)
    setTimeout(forceScrollToTop, 0)
    
    // Prevent ANY scrolling during fade-in
    const preventScroll = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
      forceScrollToTop()
    }
    
    // Lock all scroll methods
    const wrapper = contentWrapperRef.current
    wrapper.addEventListener('scroll', preventScroll, { passive: false, capture: true })
    window.addEventListener('scroll', preventScroll, { passive: false, capture: true })
    window.addEventListener('wheel', preventScroll, { passive: false, capture: true })
    window.addEventListener('touchmove', preventScroll, { passive: false, capture: true })
    document.addEventListener('scroll', preventScroll, { passive: false, capture: true })
    
    const ctx = gsap.context(() => {
      // Fade in from black immediately, UNDER the envelope
      gsap.fromTo(mainRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 2.0,
          ease: 'power1.inOut',
          onComplete: () => {
            // Unlock scrolling
            wrapper.removeEventListener('scroll', preventScroll, { capture: true } as any)
            window.removeEventListener('scroll', preventScroll, { capture: true } as any)
            window.removeEventListener('wheel', preventScroll, { capture: true } as any)
            window.removeEventListener('touchmove', preventScroll, { capture: true } as any)
            document.removeEventListener('scroll', preventScroll, { capture: true } as any)
            
            // Change to normal layout
            if (mainRef.current) {
              mainRef.current.classList.remove('fixed', 'inset-0')
              mainRef.current.classList.add('relative')
              mainRef.current.style.zIndex = 'auto'
            }
            
            forceScrollToTop()
          }
        }
      )
    })
    
    return () => {
      ctx.revert()
      wrapper.removeEventListener('scroll', preventScroll, { capture: true } as any)
      window.removeEventListener('scroll', preventScroll, { capture: true } as any)
      window.removeEventListener('wheel', preventScroll, { capture: true } as any)
      window.removeEventListener('touchmove', preventScroll, { capture: true } as any)
      document.removeEventListener('scroll', preventScroll, { capture: true } as any)
    }
  }, [showMain])

  return (
    <>
      {/* Envelope intro animation - stays visible during crossfade */}
      {!envelopeComplete && (
        <div ref={envelopeRef} style={{ position: 'fixed', inset: 0, zIndex: 10000 }}>
          <EnvelopeAnimation 
            onComplete={handleEnvelopeComplete}
            onMusicStart={handleMusicStart}
          />
        </div>
      )}

      {/* Main wedding content - fades in UNDER envelope */}
      {showMain && (
        <div 
          ref={mainRef} 
          className="fixed inset-0 bg-black"
          style={{ 
            opacity: 0,
            zIndex: 9999,
            overflow: 'hidden'
          }}
        >
          {/* Content wrapper that will become scrollable */}
          <div 
            ref={contentWrapperRef}
            className="w-full h-full overflow-y-auto overflow-x-hidden"
            style={{ scrollBehavior: 'smooth' }}
          >
          {/* Navigation */}
          <StaggeredMenu items={menuItems} />

          {/* All sections */}
          <main>
            <HeroSection />
            <CoupleSection />
            <VideoSection />
            <LoveStorySection />
            <CeremonySection />
            <TimelineSection />
            <CountdownSection />
            <GallerySection />
            <WeddingPartySection />
            <DressCodeSection />
            <GiftSection />
            <FAQSection />
            <RSVPSection />
            <ThankYouSection />
          </main>

          {/* Footer */}
          <footer className="py-8 px-5 bg-foreground text-center">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-primary-foreground/40">
              Allen & Vea <span className="mx-2 text-sage/40">|</span> March 28, 2026
            </p>
            <p className="font-sans text-[10px] text-primary-foreground/20 mt-2">
              Made with love
            </p>
          </footer>
          </div>
        </div>
      )}
    </>
  )
}
