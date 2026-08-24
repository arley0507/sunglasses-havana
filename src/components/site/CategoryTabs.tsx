'use client'
import { useEffect, useRef, useState } from 'react'

type Category = { id: string; name: string; slug: string }

export function CategoryTabs({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState(categories[0]?.slug ?? '')
  const navRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    const sections = categories
      .map(c => document.getElementById(`c-${c.slug}`))
      .filter((el): el is HTMLElement => Boolean(el))
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          const slug = visible[0].target.id.replace(/^c-/, '')
          setActive(prev => {
            if (prev !== slug) {
              const pill = navRef.current?.querySelector<HTMLElement>(`[data-slug="${slug}"]`)
              if (pill && navRef.current) {
                const navRect = navRef.current.getBoundingClientRect()
                const pillRect = pill.getBoundingClientRect()
                const targetLeft = navRef.current.scrollLeft + (pillRect.left - navRect.left) - (navRect.width / 2) + (pillRect.width / 2)
                navRef.current.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
              }
              return slug
            }
            return prev
          })
        }
      },
      { rootMargin: '-15% 0px -50% 0px', threshold: [0, 0.1, 0.25, 0.5, 1] }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [categories])

  const handleClick = (slug: string, e: React.MouseEvent) => {
    e.preventDefault()
    isScrollingRef.current = true
    const el = document.getElementById(`c-${slug}`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: 'smooth' })
      setActive(slug)
    }
    setTimeout(() => { isScrollingRef.current = false }, 1000)
  }

  if (categories.length === 0) return null

  return (
    <div
      className="bg-white w-full"
      style={{
        position: 'sticky',
        top: '56px',
        zIndex: 20,
      }}
    >
      <div
        ref={navRef}
        className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2.5"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {categories.map(c => (
          <a
            key={c.slug}
            href={`#c-${c.slug}`}
            data-slug={c.slug}
            onClick={e => handleClick(c.slug, e)}
            className={`flex-shrink-0 text-sm font-bold whitespace-nowrap transition-colors ${
              active === c.slug
                ? 'text-[#0A1628] border-b-2 border-[#0A1628] pb-1'
                : 'text-gray-400 hover:text-[#0A1628]'
            }`}
          >
            {c.name}
          </a>
        ))}
      </div>
    </div>
  )
}
