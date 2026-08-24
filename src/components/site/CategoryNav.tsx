'use client'

import { useEffect, useRef, useState } from 'react'
import { categories } from '@/lib/catalog-data'

export function CategoryNav() {
  const [active, setActive] = useState<string>(categories[0]?.slug ?? '')
  const navRef = useRef<HTMLDivElement>(null)

  // Scroll-spy: highlight active category as user scrolls
  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(`c-${c.slug}`))
      .filter((el): el is HTMLElement => Boolean(el))

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersection ratio that's intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          const slug = visible[0].target.id.replace(/^c-/, '')
          setActive(slug)
          // Scroll the pill into view inside the nav
          const pill = navRef.current?.querySelector<HTMLButtonElement>(`[data-slug="${slug}"]`)
          pill?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
        }
      },
      {
        rootMargin: '-30% 0px -55% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 1],
      }
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleClick = (slug: string, e: React.MouseEvent) => {
    e.preventDefault()
    const el = document.getElementById(`c-${slug}`)
    if (el) {
      // Offset for sticky header + nav (~140px)
      const top = el.getBoundingClientRect().top + window.scrollY - 130
      window.scrollTo({ top, behavior: 'smooth' })
      setActive(slug)
    }
  }

  return (
    <nav className="sticky top-[112px] sm:top-[124px] z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DCC8]">
      <div
        ref={navRef}
        className="mx-auto max-w-6xl px-3 sm:px-6 flex gap-2 overflow-x-auto no-scrollbar py-2.5 snap-x scroll-pl-3"
      >
        {categories.map((c) => (
          <a
            key={c.slug}
            href={`#c-${c.slug}`}
            data-slug={c.slug}
            onClick={(e) => handleClick(c.slug, e)}
            className={`snap-start flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              active === c.slug
                ? 'bg-[#E5533C] text-white shadow-sm scale-105'
                : 'bg-white text-[#2A1A14] border border-[#E8DCC8] hover:bg-[#FFF1E0]'
            }`}
          >
            {c.name}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                active === c.slug ? 'bg-white/20' : 'bg-[#FFF1E0] text-[#8A6F5A]'
              }`}
            >
              {c.count}
            </span>
          </a>
        ))}
      </div>
    </nav>
  )
}
