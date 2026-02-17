'use client'

import React, { useRef, useLayoutEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VideoModal from './VideoModal'

gsap.registerPlugin(ScrollTrigger)

export default function VideoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in text
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        id="video"
        className="relative bg-sage/10 overflow-hidden cursor-pointer"
        style={{ height: 'clamp(400px, 70vh, 800px)' }}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Video taking 70% height */}
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            muted
            loop
            autoPlay
            playsInline
            poster="/sampleimage.jpg"
          >
            <source src="/samplevideo.mp4" type="video/mp4" />
          </video>

          {/* Dark subtle overlay */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Text overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-8 sm:pb-12 px-5">
            <p
              ref={textRef}
              className="font-sans text-xs sm:text-sm md:text-base text-white tracking-[0.15em] sm:tracking-[0.2em] uppercase leading-relaxed text-center max-w-3xl drop-shadow-lg"
            >
              A glimpse into our journey and the love we share
            </p>
          </div>
        </div>
      </section>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoSrc="/samplevideo.mp4"
      />
    </>
  )
}
