'use client'

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export interface StaggeredMenuItem {
  label: string
  ariaLabel: string
  link: string
}

interface StaggeredMenuProps {
  items: StaggeredMenuItem[]
  logoUrl?: string
  onNavigate?: (link: string) => void
}

export default function StaggeredMenu({
  items,
  logoUrl,
  onNavigate,
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const preLayersRef = useRef<HTMLDivElement | null>(null)
  const preLayerElsRef = useRef<HTMLElement[]>([])
  const plusHRef = useRef<HTMLSpanElement | null>(null)
  const plusVRef = useRef<HTMLSpanElement | null>(null)
  const iconRef = useRef<HTMLSpanElement | null>(null)
  const textInnerRef = useRef<HTMLSpanElement | null>(null)
  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close'])
  const openTlRef = useRef<gsap.core.Timeline | null>(null)
  const closeTweenRef = useRef<gsap.core.Tween | null>(null)
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null)
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null)
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null)
  const busyRef = useRef(false)
  const [isOnHero, setIsOnHero] = useState(true)

  const menuButtonColor = '#1a1a1a'
  const openMenuButtonColor = '#1a1a1a'
  const accentColor = 'hsl(143, 25%, 55%)'
  const colors = ['hsl(143, 25%, 75%)', 'hsl(143, 25%, 55%)']

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current
      const preContainer = preLayersRef.current
      const plusH = plusHRef.current
      const plusV = plusVRef.current
      const icon = iconRef.current
      const textInner = textInnerRef.current
      if (!panel || !plusH || !plusV || !icon || !textInner) return

      let preLayers: HTMLElement[] = []
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[]
      }
      preLayerElsRef.current = preLayers

      gsap.set([panel, ...preLayers], { xPercent: 100 })
      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 })
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 })
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
      gsap.set(textInner, { yPercent: 0 })
      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor })
    })
    return () => ctx.revert()
  }, [])

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return null
    openTlRef.current?.kill()
    closeTweenRef.current?.kill()
    closeTweenRef.current = null

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[]
    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })

    const tl = gsap.timeline({ paused: true })
    layers.forEach((el, i) => {
      tl.fromTo(el, { xPercent: Number(gsap.getProperty(el, 'xPercent')) }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07)
    })
    const lastTime = layers.length ? (layers.length - 1) * 0.07 : 0
    const panelInsertTime = lastTime + (layers.length ? 0.08 : 0)
    tl.fromTo(panel, { xPercent: Number(gsap.getProperty(panel, 'xPercent')) }, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, panelInsertTime)
    if (itemEls.length) {
      const itemsStart = panelInsertTime + 0.65 * 0.15
      tl.to(itemEls, { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } }, itemsStart)
    }
    openTlRef.current = tl
    return tl
  }, [])

  const playOpen = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true
    const tl = buildOpenTimeline()
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false })
      tl.play(0)
    } else {
      busyRef.current = false
    }
  }, [buildOpenTimeline])

  const playClose = useCallback(() => {
    openTlRef.current?.kill()
    openTlRef.current = null
    const panel = panelRef.current
    const layers = preLayerElsRef.current
    if (!panel) return
    closeTweenRef.current?.kill()
    closeTweenRef.current = gsap.to([...layers, panel], {
      xPercent: 100,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[]
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 })
        busyRef.current = false
      },
    })
  }, [])

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current
    const h = plusHRef.current
    const v = plusVRef.current
    if (!icon || !h || !v) return
    spinTweenRef.current?.kill()
    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' })
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power4.out' } }).to(h, { rotate: 45, duration: 0.5 }, 0).to(v, { rotate: -45, duration: 0.5 }, 0)
    } else {
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power3.inOut' } }).to(h, { rotate: 0, duration: 0.35 }, 0).to(v, { rotate: 90, duration: 0.35 }, 0).to(icon, { rotate: 0, duration: 0.001 }, 0)
    }
  }, [])

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current
    if (!inner) return
    textCycleAnimRef.current?.kill()
    const currentLabel = opening ? 'Menu' : 'Close'
    const targetLabel = opening ? 'Close' : 'Menu'
    const seq: string[] = [currentLabel]
    let last = currentLabel
    for (let i = 0; i < 3; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu'
      seq.push(last)
    }
    if (last !== targetLabel) seq.push(targetLabel)
    seq.push(targetLabel)
    setTextLines(seq)
    gsap.set(inner, { yPercent: 0 })
    const lineCount = seq.length
    const finalShift = ((lineCount - 1) / lineCount) * 100
    textCycleAnimRef.current = gsap.to(inner, { yPercent: -finalShift, duration: 0.5 + lineCount * 0.07, ease: 'power4.out' })
  }, [])

  const toggleMenu = useCallback(() => {
    const target = !openRef.current
    openRef.current = target
    setOpen(target)
    if (target) { playOpen() } else { playClose() }
    animateIcon(target)
    animateText(target)
  }, [playOpen, playClose, animateIcon, animateText])

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false
      setOpen(false)
      playClose()
      animateIcon(false)
      animateText(false)
    }
  }, [playClose, animateIcon, animateText])

  const handleNav = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
      e.preventDefault()
      closeMenu()
      setTimeout(() => {
        onNavigate?.(link)
        const el = document.querySelector(link)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 350)
    },
    [closeMenu, onNavigate]
  )

  React.useEffect(() => {
    if (!open) return
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current && !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, closeMenu])

  // Detect scroll position for color change
  React.useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.9
      setIsOnHero(window.scrollY < heroHeight)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update button color based on scroll and open state
  React.useEffect(() => {
    if (!toggleBtnRef.current) return
    const color = open ? '#1a1a1a' : (isOnHero ? '#ffffff' : '#1a1a1a')
    gsap.to(toggleBtnRef.current, { color, duration: 0.3, ease: 'power2.out' })
  }, [isOnHero, open])

  return (
    <div className="sm-scope fixed top-0 left-0 w-screen z-50 pointer-events-none" style={{ height: 'auto' }}>
      <div className="staggered-menu-wrapper relative w-full pointer-events-none z-50" style={{ ['--sm-accent' as string]: accentColor } as React.CSSProperties}>
        <div ref={preLayersRef} className="fixed top-0 right-0 bottom-0 pointer-events-none z-[45]" style={{ width: 'clamp(260px, 38vw, 420px)' }} aria-hidden="true">
          {colors.map((c, i) => (
            <div key={i} className="sm-prelayer absolute top-0 right-0 h-full w-full" style={{ background: c }} />
          ))}
        </div>

        <header 
          className="fixed top-0 left-0 w-full flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6 pointer-events-none z-50 transition-all duration-300"
          style={{
            backgroundColor: isOnHero ? 'transparent' : 'rgba(255, 255, 255, 0.98)',
            boxShadow: isOnHero ? 'none' : '0 2px 10px rgba(0, 0, 0, 0.08)',
          }}
          aria-label="Main navigation header"
        >
          <div className="flex items-center select-none pointer-events-auto" aria-label="Logo">
            {logoUrl && (
              <img src={logoUrl} alt="Allen & Vea Wedding Logo" className="block h-8 w-auto object-contain" draggable={false} width={110} height={24} />
            )}
            {!logoUrl && (
              <span 
                className="font-serif text-2xl transition-colors duration-300"
                style={{ color: open ? '#1a1a1a' : (isOnHero ? '#ffffff' : '#1a1a1a') }}
              >
                {'Allen & Vea'}
              </span>
            )}
          </div>

          <button
            ref={toggleBtnRef}
            className="sm-toggle relative inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer font-sans font-medium text-sm leading-none overflow-visible pointer-events-auto tracking-widest uppercase"
            style={{ color: menuButtonColor }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span className="relative inline-block h-[1em] overflow-hidden whitespace-nowrap" aria-hidden="true">
              <span ref={textInnerRef} className="flex flex-col leading-none">
                {textLines.map((l, i) => (
                  <span className="block h-[1em] leading-none" key={i}>{l}</span>
                ))}
              </span>
            </span>
            <span ref={iconRef} className="relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center" aria-hidden="true">
              <span ref={plusHRef} className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2" />
              <span ref={plusVRef} className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2" />
            </span>
          </button>
        </header>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="fixed top-0 right-0 h-full flex flex-col p-16 pt-24 sm:p-20 sm:pt-28 overflow-y-auto z-[46] backdrop-blur-xl pointer-events-auto"
          style={{ width: 'clamp(260px, 38vw, 420px)', backgroundColor: 'hsl(60, 20%, 97%)' }}
          aria-hidden={!open}
        >
          <div className="flex-1 flex flex-col gap-5">
            <ul className="list-none m-0 p-0 flex flex-col gap-3" role="list">
              {items.map((it, idx) => (
                <li className="relative overflow-hidden leading-none" key={it.label + idx}>
                  <a
                    className="relative font-sans font-semibold text-3xl sm:text-4xl cursor-pointer leading-none tracking-tight uppercase inline-block no-underline pr-4 text-foreground transition-colors duration-150 hover:text-sage"
                    href={it.link}
                    aria-label={it.ariaLabel}
                    onClick={(e) => handleNav(e, it.link)}
                  >
                    <span className="sm-panel-itemLabel inline-block" style={{ transformOrigin: '50% 100%', willChange: 'transform' }}>
                      {it.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8 flex flex-col gap-3">
              <h3 className="m-0 text-sm font-sans font-medium tracking-widest uppercase text-sage">{'March 28, 2026'}</h3>
              <p className="text-muted-foreground text-sm font-sans">{'Hawaii | 3:00 PM'}</p>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .sm-scope .staggered-menu-wrapper aside { width: 100% !important; left: 0; right: 0; }
          .sm-scope .staggered-menu-wrapper .sm-prelayer { width: 100vw !important; }
          .sm-scope div[class*="fixed top-0 right-0 bottom-0"] { width: 100vw !important; }
        }
      `}</style>
    </div>
  )
}
