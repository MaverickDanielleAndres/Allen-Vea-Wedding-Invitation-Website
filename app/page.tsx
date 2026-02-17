'use client'

import React, { useState, useCallback, useRef, useLayoutEffect, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'

gsap.registerPlugin(ScrollTrigger)

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

  const [showMain, setShowMain] = useState(false)

  const handleEnvelopeComplete = useCallback(() => {
    setEnvelopeComplete(true)
    // Wait for envelope AND text to fade-out completely before showing main content
    setTimeout(() => {
      setShowMain(true)
    }, 1200)
  }, [])

  useLayoutEffect(() => {
    if (!showMain || !mainRef.current) return
    
    // FORCE scroll to absolute top - MULTIPLE times to ensure it stays
    const forceTop = () => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    
    forceTop()
    requestAnimationFrame(forceTop)
    
    // Lock scroll position at top during fade-in - STRONG lock
    const preventScroll = (e: Event) => {
      e.preventDefault()
      forceTop()
    }
    
    window.addEventListener('scroll', preventScroll, { passive: false, capture: true })
    window.addEventListener('wheel', preventScroll, { passive: false, capture: true })
    window.addEventListener('touchmove', preventScroll, { passive: false, capture: true })
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 3.5, 
          ease: 'power3.out',
          delay: 0.2,
          onComplete: () => {
            // Remove ALL scroll locks after fade completes
            window.removeEventListener('scroll', preventScroll, { capture: true } as any)
            window.removeEventListener('wheel', preventScroll, { capture: true } as any)
            window.removeEventListener('touchmove', preventScroll, { capture: true } as any)
          }
        }
      )
    })
    
    return () => {
      ctx.revert()
      window.removeEventListener('scroll', preventScroll, { capture: true } as any)
      window.removeEventListener('wheel', preventScroll, { capture: true } as any)
      window.removeEventListener('touchmove', preventScroll, { capture: true } as any)
    }
  }, [showMain])

  return (
    <>
      {/* Envelope intro animation */}
      {!envelopeComplete && (
        <EnvelopeAnimation onComplete={handleEnvelopeComplete} />
      )}

      {/* Main wedding content - ONLY show when envelope is complete AND showMain is true */}
      {envelopeComplete && showMain && (
        <div ref={mainRef} style={{ opacity: 0 }}>
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
      )}
    </>
  )
}
