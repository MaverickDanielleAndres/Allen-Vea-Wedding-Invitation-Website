'use client'

import React, { useRef, useEffect } from 'react'
import { X } from 'lucide-react'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
}

export default function VideoModal({ isOpen, onClose, videoSrc }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      if (videoRef.current) {
        videoRef.current.currentTime = 0
        videoRef.current.play()
      }
    } else {
      document.body.style.overflow = ''
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-sage transition-colors z-10"
        aria-label="Close video"
      >
        <X size={32} />
      </button>

      <div
        className="relative w-full max-w-6xl mx-4 sm:mx-8 aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover rounded-sm"
          controls
          autoPlay
          playsInline
        />
      </div>
    </div>
  )
}
