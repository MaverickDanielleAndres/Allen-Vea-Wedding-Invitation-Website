'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
  20 images arranged in columns with varied sizes to fill space beautifully.
  Single-image columns stretch vertically to fill space and avoid gaps.
  Mix of single and stacked arrangements for dynamic visual interest.
*/
const galleryColumns = [
  // Column 1 - one tall stretched
  { images: [{ src: '/sampleimage.jpg', alt: 'Wedding moment 1', aspect: '3/5' }], width: 'w-[280px] sm:w-[360px] md:w-[420px]' },
  // Column 2 - two stacked small
  { images: [
    { src: '/sampleimage.jpg', alt: 'Wedding moment 2', aspect: '1/1' },
    { src: '/sampleimage.jpg', alt: 'Wedding moment 3', aspect: '3/4' },
  ], width: 'w-[180px] sm:w-[220px] md:w-[260px]' },
  // Column 3 - one tall portrait stretched
  { images: [{ src: '/sampleimage.jpg', alt: 'Wedding moment 4', aspect: '2/5' }], width: 'w-[160px] sm:w-[200px] md:w-[240px]' },
  // Column 4 - two stacked
  { images: [
    { src: '/sampleimage.jpg', alt: 'Wedding moment 5', aspect: '16/10' },
    { src: '/sampleimage.jpg', alt: 'Wedding moment 6', aspect: '1/1' },
  ], width: 'w-[200px] sm:w-[240px] md:w-[280px]' },
  // Column 5 - one tall stretched
  { images: [{ src: '/sampleimage.jpg', alt: 'Wedding moment 7', aspect: '3/4' }], width: 'w-[220px] sm:w-[280px] md:w-[320px]' },
  // Column 6 - two stacked small
  { images: [
    { src: '/sampleimage.jpg', alt: 'Wedding moment 8', aspect: '3/4' },
    { src: '/sampleimage.jpg', alt: 'Wedding moment 9', aspect: '4/3' },
  ], width: 'w-[170px] sm:w-[210px] md:w-[250px]' },
  // Column 7 - one very tall portrait stretched
  { images: [{ src: '/sampleimage.jpg', alt: 'Wedding moment 10', aspect: '2/5' }], width: 'w-[180px] sm:w-[220px] md:w-[260px]' },
  // Column 8 - two stacked
  { images: [
    { src: '/sampleimage.jpg', alt: 'Wedding moment 11', aspect: '1/1' },
    { src: '/sampleimage.jpg', alt: 'Wedding moment 12', aspect: '16/9' },
  ], width: 'w-[190px] sm:w-[230px] md:w-[270px]' },
  // Column 9 - one tall stretched
  { images: [{ src: '/sampleimage.jpg', alt: 'Wedding moment 13', aspect: '3/5' }], width: 'w-[260px] sm:w-[320px] md:w-[380px]' },
  // Column 10 - two stacked small
  { images: [
    { src: '/sampleimage.jpg', alt: 'Wedding moment 14', aspect: '1/1' },
    { src: '/sampleimage.jpg', alt: 'Wedding moment 15', aspect: '3/4' },
  ], width: 'w-[170px] sm:w-[210px] md:w-[250px]' },
  // Column 11 - one very tall portrait stretched
  { images: [{ src: '/sampleimage.jpg', alt: 'Wedding moment 16', aspect: '2/5' }], width: 'w-[180px] sm:w-[220px] md:w-[260px]' },
  // Column 12 - two stacked
  { images: [
    { src: '/sampleimage.jpg', alt: 'Wedding moment 17', aspect: '4/3' },
    { src: '/sampleimage.jpg', alt: 'Wedding moment 18', aspect: '1/1' },
  ], width: 'w-[200px] sm:w-[240px] md:w-[280px]' },
  // Column 13 - one tall stretched
  { images: [{ src: '/sampleimage.jpg', alt: 'Wedding moment 19', aspect: '3/4' }], width: 'w-[190px] sm:w-[240px] md:w-[280px]' },
  // Column 14 - one very tall stretched
  { images: [{ src: '/sampleimage.jpg', alt: 'Wedding moment 20', aspect: '2/5' }], width: 'w-[170px] sm:w-[210px] md:w-[250px]' },
]

// Flatten all images for modal navigation
const allImages = galleryColumns.flatMap((col) => col.images)
// Loop the columns
const loopedColumns = [...galleryColumns, ...galleryColumns]

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIndex, setModalIndex] = useState(0)

  const modalTouchStart = useRef(0)

  // Infinite scroll loop
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const maxScroll = container.scrollWidth / 2

      if (scrollLeft >= maxScroll - 100) {
        container.scrollLeft = scrollLeft - maxScroll
      } else if (scrollLeft <= 100) {
        container.scrollLeft = scrollLeft + maxScroll
      }
    }

    container.addEventListener('scroll', handleScroll)
    // Set initial position to middle
    container.scrollLeft = container.scrollWidth / 4

    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gallery-header',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )
      gsap.fromTo(
        '.gallery-col',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  // Modal logic
  const openModal = useCallback((flatIndex: number) => {
    setModalIndex(flatIndex % allImages.length)
    setModalOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    document.body.style.overflow = ''
  }, [])

  const nextImage = useCallback(() => {
    setModalIndex(prev => (prev + 1) % allImages.length)
  }, [])

  const prevImage = useCallback(() => {
    setModalIndex(prev => (prev - 1 + allImages.length) % allImages.length)
  }, [])

  // Keyboard
  useEffect(() => {
    if (!modalOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [modalOpen, closeModal, nextImage, prevImage])

  // Track flat image index across columns
  let flatIdx = 0

  return (
    <section ref={sectionRef} id="gallery" className="py-16 sm:py-24 bg-stone-50 overflow-hidden select-none">
      {/* Header */}
      <div className="gallery-header text-center px-5 mb-10 sm:mb-14">
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-stone-800 mb-2">Captured Moments</h2>
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-stone-500">Fragments of time</p>
      </div>

      {/* Horizontal scroll strip with columns (some have 2 stacked images) */}
      <div
        ref={scrollContainerRef}
        className="relative w-full overflow-x-auto overflow-y-hidden pb-4 scrollbar-hide"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex gap-3 sm:gap-4 px-4 sm:px-8 w-max items-start">
          {loopedColumns.map((col, colIdx) => {
            const colStartIdx = flatIdx

            const colContent = (
              <div
                key={colIdx}
                className={`gallery-col shrink-0 flex flex-col gap-3 sm:gap-4 ${col.width}`}
                style={{ marginTop: colIdx % 3 === 1 ? '24px' : colIdx % 5 === 3 ? '40px' : '0px' }}
              >
                {col.images.map((img, imgIdx) => {
                  const currentFlatIdx = flatIdx
                  flatIdx++

                  return (
                    <button
                      key={`${colIdx}-${imgIdx}`}
                      className="w-full rounded-xl sm:rounded-2xl overflow-hidden relative group transition-transform duration-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl"
                      style={{ aspectRatio: img.aspect }}
                      onClick={() => openModal(currentFlatIdx)}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </button>
                  )
                })}
              </div>
            )

            return colContent
          })}
        </div>
      </div>

      {/* Navigation arrows (desktop only) */}
      <div className="hidden md:flex justify-center gap-4 mt-6">
        <button
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollBy({ left: -500, behavior: 'smooth' })
            }
          }}
          className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 hover:text-stone-800 hover:border-stone-500 transition-colors"
          aria-label="Scroll left"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollBy({ left: 500, behavior: 'smooth' })
            }
          }}
          className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center text-stone-500 hover:text-stone-800 hover:border-stone-500 transition-colors"
          aria-label="Scroll right"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Swipe hint */}
      <div className="text-center mt-4 md:hidden">
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-stone-400 animate-pulse">
          Swipe to Explore
        </span>
      </div>

      {/* Lightbox Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md px-4"
          onClick={closeModal}
        >
          {/* Close */}
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-50 p-2"
            aria-label="Close"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center outline-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => { modalTouchStart.current = e.targetTouches[0].clientX }}
            onTouchEnd={(e) => {
              const diff = modalTouchStart.current - e.changedTouches[0].clientX
              if (Math.abs(diff) > 50) {
                if (diff > 0) nextImage()
                else prevImage()
              }
            }}
          >
            <img
              src={allImages[modalIndex].src}
              alt={allImages[modalIndex].alt}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
            />

            {/* Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
              aria-label="Previous"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextImage}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
              aria-label="Next"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 font-sans text-xs tracking-widest">
              {modalIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
    </section>
  )
}
