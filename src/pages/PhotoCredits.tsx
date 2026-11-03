import React from 'react'
import { photoCredits } from '@/data/photoCredits'

export default function PhotoCreditsPage() {
  return (
    <div className="bg-mist">
      <section className="mx-auto max-w-4xl px-5 pb-20 pt-16 sm:px-8 md:pt-24">
        <h1 className="font-display text-4xl font-semibold text-navy">Photo credits</h1>
        <p className="mt-4 text-navy-muted">
          Some destination photos on this site come from Wikimedia Commons and are used under the licences
          listed below. Other photos are our own or from Unsplash.
        </p>
        <ul className="mt-10 divide-y divide-line rounded-3xl border border-line bg-white">
          {photoCredits.map((c) => (
            <li key={c.image} className="flex items-center gap-4 p-4">
              <img src={c.image.replace(/\.(jpg|webp)$/, '-800.webp')} alt={c.title} width={80} height={56} loading="lazy" className="h-14 w-20 shrink-0 rounded-xl object-cover" />
              <p className="text-sm text-navy-soft">
                <a href={c.source} target="_blank" rel="noopener noreferrer" className="font-medium text-navy hover:text-sea">
                  {c.title}
                </a>{' '}
                by {c.author},{' '}
                {c.licenseUrl ? (
                  <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-sea">
                    {c.license}
                  </a>
                ) : (
                  c.license
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
