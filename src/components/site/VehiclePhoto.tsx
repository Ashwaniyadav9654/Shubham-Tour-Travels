import React from 'react'
import { cn } from '@/lib/utils'

/**
 * Vehicle photo for cards and detail pages. By default it crops to fill the
 * box; with `full` it shows the whole photo (e.g. portrait shots like the bus)
 * letterboxed over a blurred copy of itself, so there are no bare bars.
 */
export default function VehiclePhoto({
  src,
  alt,
  full = false,
  className,
  imgClassName,
}: {
  src: string
  alt: string
  full?: boolean
  className?: string
  imgClassName?: string
}) {
  return (
    <div className={cn('relative overflow-hidden bg-line', className)}>
      {full && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl opacity-70"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn('relative h-full w-full', full ? 'object-contain' : 'object-cover', imgClassName)}
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).src = '/images/cars/crysta.png'
        }}
      />
    </div>
  )
}
