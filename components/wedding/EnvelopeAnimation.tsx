'use client'

import React, { useRef, useState, useCallback, useLayoutEffect, useEffect } from 'react'
import { gsap } from 'gsap'

interface EnvelopeAnimationProps {
  onComplete: () => void
}

/* ───── Dramatic Typing Sub-component ───── */
function DramaticTyping({
  lines,
  onDone,
}: {
  lines: { text: string; className: string }[]
  onDone: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [displayed, setDisplayed] = useState('')
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [done, setDone] = useState(false)
  const cursorRef = useRef<HTMLSpanElement>(null)

  // Blink cursor
  useEffect(() => {
    if (!cursorRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: 'power2.inOut' })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (done) return
    if (lineIdx >= lines.length) {
      setDone(true)
      return
    }
    const currentLine = lines[lineIdx].text
    if (charIdx < currentLine.length) {
      const speed = 55 + Math.random() * 35
      const timer = setTimeout(() => {
        setDisplayed(prev => prev + currentLine[charIdx])
        setCharIdx(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else {
      const pause = lineIdx < lines.length - 1 ? 800 : 0
      const timer = setTimeout(() => {
        if (lineIdx < lines.length - 1) {
          setDisplayed(prev => prev + '\n')
        }
        setLineIdx(prev => prev + 1)
        setCharIdx(0)
      }, pause)
      return () => clearTimeout(timer)
    }
  }, [lineIdx, charIdx, done, lines])

  useEffect(() => {
    if (done && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 2.0,
        ease: 'power3.out',
        onComplete: () => {
          setTimeout(onDone, 300)
        }
      })
    }
  }, [done, onDone])

  useLayoutEffect(() => {
    if (!containerRef.current) return
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' })
  }, [])

  const renderedLines = React.useMemo(() => {
    const result: { text: string; className: string }[] = []
    let remaining = displayed
    for (let idx = 0; idx <= lineIdx && idx < lines.length; idx++) {
      if (remaining.length === 0) break
      if (idx > 0 && remaining.startsWith('\n')) remaining = remaining.slice(1)
      const lineText = lines[idx].text
      const take = remaining.slice(0, lineText.length)
      remaining = remaining.slice(take.length)
      result.push({ text: take, className: lines[idx].className })
    }
    return result
  }, [displayed, lines, lineIdx])

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center gap-3 sm:gap-4 px-6 text-center max-w-2xl mx-auto">
      {renderedLines.map((line, i) => (
        <span key={i} className={line.className}>
          {line.text}
          {i === renderedLines.length - 1 && !done && (
            <span ref={cursorRef} className="inline-block ml-0.5 text-white/80">|</span>
          )}
        </span>
      ))}
    </div>
  )
}

/* ───── Main Envelope Animation ───── */
export default function EnvelopeAnimation({ onComplete }: EnvelopeAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const envelopeWrapperRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const flapRef = useRef<HTMLDivElement>(null)
  const envelopeBodyRef = useRef<HTMLDivElement>(null)
  const pocketRef = useRef<HTMLDivElement>(null)

  const [stage, setStage] = useState<'idle' | 'opening' | 'transition' | 'typing1' | 'typing2' | 'done'>('idle')

  // Lock body scroll during intro
  useEffect(() => {
    if (stage !== 'done') {
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
    } else {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.height = ''
    }
  }, [stage])

  // Entrance animation + Initialize card position
  useLayoutEffect(() => {
    if (!envelopeWrapperRef.current || !cardRef.current) return
    const ctx = gsap.context(() => {
      // Position card at the OPENING SLIT where flap meets pocket (55% mark)
      gsap.set(cardRef.current, { 
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 20,  // Right at the envelope opening slit
        opacity: 0, 
        scale: 0.88,  // Smaller when tucked inside
        visibility: 'hidden' 
      })
      
      // Animate envelope entrance
      gsap.fromTo(envelopeWrapperRef.current,
        { scale: 0.7, opacity: 0, y: 60 },
        { scale: 1, opacity: 1, y: 0, duration: 1.8, ease: 'power3.out', delay: 0.3 }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // Click → open
  const handleOpen = useCallback(() => {
    if (stage !== 'idle') return
    setStage('opening')

    const tl = gsap.timeline({
      onComplete: () => setStage('transition'),
    })

    // Stage 1: Open flap - rotates from TOP edge
    tl.to(flapRef.current, {
      rotateX: -180,
      duration: 1.0,
      ease: 'power3.inOut',
    })

    // Stage 2: Card emerges FROM INSIDE envelope, then envelope moves away
    tl.addLabel('emerge', '+=0.3')

    // Immediately move card z-index to FRONT so it's not covered by flap
    tl.set(cardRef.current, { zIndex: 25 }, 'emerge')

    // Card becomes visible and starts emerging from the opening slit
    tl.to(cardRef.current, {
      opacity: 1,
      visibility: 'visible',
      y: -150,  // Emerges upward from the slit
      scale: 1.0,
      duration: 1.4,
      ease: 'power2.out',
    }, 'emerge')

    // Then envelope moves down while card continues up
    tl.addLabel('separate', '+=0.2')

    // Envelope moves down and fades
    tl.to([envelopeBodyRef.current, pocketRef.current], {
      y: 600,
      opacity: 0,
      duration: 1.8,
      ease: 'power3.inOut',
    }, 'separate')

    // Flap also moves down with envelope
    tl.to(flapRef.current, {
      y: 600,
      opacity: 0,
      duration: 1.8,
      ease: 'power3.inOut',
    }, 'separate')

    // Card continues moving up and grows slightly as envelope disappears
    tl.to(cardRef.current, {
      y: -280,
      scale: 1.08,
      duration: 1.8,
      ease: 'power3.inOut',
    }, 'separate')

  }, [stage])

  // Transition phase - card returns to EXACT center
  useEffect(() => {
    if (stage === 'transition' && cardRef.current) {
      const tl = gsap.timeline({
        onComplete: () => setStage('typing1'),
      })

      // Wait a moment after envelope disappears
      tl.addLabel('returnStart', '+=0.4')

      // Card smoothly returns to ABSOLUTE PERFECT CENTER
      tl.to(cardRef.current, {
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        scale: 1,
        duration: 2.2,
        ease: 'power3.inOut',
      }, 'returnStart')

      // Then fade out the card
      tl.to(cardRef.current, {
        opacity: 0,
        duration: 1.3,
        ease: 'power2.in',
      }, '-=0.5')
    }
  }, [stage])

  const handleTyping1Done = useCallback(() => {
    setStage('typing2')
  }, [])

  const handleTyping2Done = useCallback(() => {
    setTimeout(() => {
      onComplete()
      setTimeout(() => setStage('done'), 1500)
    }, 2000)
  }, [onComplete])

  const sentence1Lines = [
    { text: 'By the grace of God', className: 'font-sans text-2xl sm:text-4xl md:text-5xl text-white leading-relaxed' },
    { text: 'and with the blessings of our families...', className: 'font-sans text-2xl sm:text-4xl md:text-5xl text-white leading-relaxed' },
  ]

  const sentence2Lines = [
    { text: 'Allen Bagaoisan', className: 'font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-relaxed' },
    { text: 'and', className: 'font-sans text-xl sm:text-xl text-white/60 tracking-[0.3em] uppercase leading-relaxed' },
    { text: 'Vea Lee Mantilla', className: 'font-serif text-4xl sm:text-5xl md:text-6xl text-white leading-relaxed' },
    { text: 'invites you to join us in the celebration of our marriage', className: 'font-sans text-base sm:text-base md:text-lg text-white/80 tracking-[0.12em] leading-relaxed mt-2' },
  ]

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-1000 overflow-hidden ${stage === 'done' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)' }}
    >
      {/* Background image - brighter/grayish */}
      <div className="absolute inset-0">
        <img
          src="/sampleimage.jpg"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(100%) brightness(0.45) contrast(1.1)', opacity: 0.5 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Corner flourishes */}
      <div className="absolute top-6 left-6 w-12 h-12 sm:w-16 sm:h-16 border-t border-l border-white/[0.08] pointer-events-none" />
      <div className="absolute top-6 right-6 w-12 h-12 sm:w-16 sm:h-16 border-t border-r border-white/[0.08] pointer-events-none" />
      <div className="absolute bottom-6 left-6 w-12 h-12 sm:w-16 sm:h-16 border-b border-l border-white/[0.08] pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-12 h-12 sm:w-16 sm:h-16 border-b border-r border-white/[0.08] pointer-events-none" />

      {/* ─── ENVELOPE ─── */}
      {(stage === 'idle' || stage === 'opening' || stage === 'transition') && (
        <div
          ref={envelopeWrapperRef}
          className="relative cursor-pointer"
          onClick={handleOpen}
          style={{
            perspective: '1400px',
            width: 'min(90vw, 520px)',
            height: 'min(60vw, 350px)',
            filter: 'drop-shadow(0 15px 40px rgba(0,0,0,0.4))',
          }}
        >
          {/* ── Envelope body (back panel) - SOLID to hide card ── */}
          <div ref={envelopeBodyRef} className="absolute inset-0 z-[5]">
            {/* Back panel - sage green - OPAQUE */}
            <div
              className="absolute inset-0 rounded-[6px]"
              style={{
                background: 'linear-gradient(165deg, #8CA88E 0%, #7A9E7E 50%, #6B8E6E 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.1)',
              }}
            />
            {/* Subtle texture */}
            <div className="absolute inset-0 rounded-[6px] opacity-[0.05]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.12'%3E%3Cpath d='M30 30h30v30H30zM0 0h30v30H0z'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* ── INVITATION CARD (behind flap, in front of body) ── */}
          <div
            ref={cardRef}
            className="absolute z-[10]"
            style={{
              width: '82%',
              height: '105%',
              opacity: 0,
              visibility: 'hidden',
            }}
          >
            <img
              src="/invitationcard.png"
              alt="Wedding Invitation"
              className="w-full h-full object-contain rounded-sm"
              style={{ boxShadow: '0 15px 50px rgba(0,0,0,0.5)', background: 'transparent' }}
            />
          </div>

          {/* ── FLAP (covers from TOP - like real envelope) with SHADOW ── */}
          <div
            ref={flapRef}
            className="absolute top-0 left-0 w-full z-[20]"
            style={{
              height: '55%',
              transformOrigin: 'top center',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Front face (visible when closed) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(180deg, #8CA88E 0%, #7A9E7E 50%, #6B8E6E 100%)',
                backfaceVisibility: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            />
            {/* Back face (visible when opened) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                background: 'linear-gradient(0deg, #B5D9B5 0%, #9FC49F 50%, #8FBC8F 100%)',
                transform: 'rotateX(180deg) rotate(180deg)',
                backfaceVisibility: 'hidden',
              }}
            />
            {/* Flap edge shadow (bottom edge where it meets body) */}
            <div
              className="absolute left-0 w-full h-[2px] pointer-events-none"
              style={{
                bottom: '0',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.25), transparent)',
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            />
          </div>

          {/* ── POCKET (bottom back portion) - COVERS CARD INITIALLY ── */}
          <div
            ref={pocketRef}
            className="absolute inset-0 z-[15] rounded-b-[8px]"
            style={{
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              background: 'linear-gradient(180deg, #7A9E7E 0%, #6B8E6E 100%)',
            }}
          >
            {/* Slit line where envelope opens */}
            <div 
              className="absolute left-0 w-full h-[2px] bg-black/30"
              style={{ top: '0' }}
            />
            <div 
              className="absolute left-0 w-full h-[1px] bg-black/10"
              style={{ top: '2px' }}
            />
          </div>

          {/* ── WAX SEAL ── */}
          <div
            className="absolute z-[25] left-1/2 -translate-x-1/2 transition-opacity duration-500"
            style={{
              top: '27%',
              opacity: stage === 'idle' ? 1 : 0,
            }}
          >
            <div
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #6B8E6E 0%, #4A6B4E 50%, #35503A 100%)',
                border: '3px solid rgba(0,0,0,0.15)',
                boxShadow: '0 6px 20px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.2)',
              }}
            >
              <span className="font-serif text-2xl sm:text-3xl text-white/95 tracking-wider" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>A&V</span>
            </div>
          </div>

          {/* Tap hint */}
          <div
            className="absolute -bottom-14 sm:-bottom-16 w-full text-center transition-opacity duration-500"
            style={{ opacity: stage === 'idle' ? 1 : 0 }}
          >
            <div className="animate-pulse">
              <span className="text-white/35 text-[10px] sm:text-xs tracking-[0.35em] uppercase font-sans">
                Tap to Open
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── TYPING STAGE 1 ─── */}
      {stage === 'typing1' && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <DramaticTyping lines={sentence1Lines} onDone={handleTyping1Done} />
        </div>
      )}

      {/* ─── TYPING STAGE 2 ─── */}
      {stage === 'typing2' && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <DramaticTyping lines={sentence2Lines} onDone={handleTyping2Done} />
        </div>
      )}
    </div>
  )
}
