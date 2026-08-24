'use client'

// Fly-to-cart animation: clones the product image and animates it to the cart button
export function flyToCart(
  sourceEl: HTMLElement,
  targetEl: HTMLElement,
  onComplete?: () => void
) {
  if (!sourceEl || !targetEl) {
    onComplete?.()
    return
  }

  const sourceRect = sourceEl.getBoundingClientRect()
  const targetRect = targetEl.getBoundingClientRect()

  const clone = sourceEl.cloneNode(true) as HTMLElement
  clone.style.position = 'fixed'
  clone.style.left = `${sourceRect.left}px`
  clone.style.top = `${sourceRect.top}px`
  clone.style.width = `${sourceRect.width}px`
  clone.style.height = `${sourceRect.height}px`
  clone.style.borderRadius = '12px'
  clone.style.zIndex = '9999'
  clone.style.pointerEvents = 'none'
  clone.style.objectFit = 'cover'
  clone.style.transition = 'all 0.7s cubic-bezier(0.4, 0, 0.6, 1)'
  clone.style.boxShadow = '0 10px 30px rgba(10, 22, 40, 0.4)'
  document.body.appendChild(clone)

  void clone.offsetWidth

  const targetCenterX = targetRect.left + targetRect.width / 2
  const targetCenterY = targetRect.top + targetRect.height / 2
  const deltaX = targetCenterX - sourceRect.left - sourceRect.width / 2
  const deltaY = targetCenterY - sourceRect.top - sourceRect.height / 2

  clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1) rotate(360deg)`
  clone.style.opacity = '0.3'

  setTimeout(() => {
    clone.remove()
    onComplete?.()
  }, 720)
}
