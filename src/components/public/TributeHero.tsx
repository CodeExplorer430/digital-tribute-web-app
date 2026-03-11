import { format } from 'date-fns'
import Image from 'next/image'

interface TributeHeroProps {
  memorial: {
    title: string
    full_name: string | null
    dob: string | null
    dod: string | null
    hero_image_url: string | null
  }
}

export function TributeHero({ memorial }: TributeHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="relative h-[72vh] min-h-[480px] w-full bg-foreground">
        {memorial.hero_image_url ? (
          <Image
            src={memorial.hero_image_url}
            alt={memorial.full_name || memorial.title}
            fill
            sizes="100vw"
            className="object-cover opacity-76"
            priority
          />
        ) : (
          <div
            data-testid="hero-fallback"
            className="h-full w-full bg-[linear-gradient(180deg,#3a3d34_0%,#24281f_100%)]"
          />
        )}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,14,12,0.08),rgba(11,14,12,0.34)_42%,rgba(11,14,12,0.82)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 top-[38%] bg-[radial-gradient(circle_at_bottom,rgba(233,222,199,0.16),transparent_48%)]" />
      <div className="page-container absolute inset-x-0 bottom-0 py-10 text-white md:py-16">
        <div className="max-w-5xl rounded-[2.2rem] border border-white/16 bg-[linear-gradient(180deg,rgba(13,16,14,0.22),rgba(13,16,14,0.42))] p-6 backdrop-blur-[8px] md:p-8">
          <p className="mb-4 inline-flex rounded-full border border-white/35 bg-black/20 px-3 py-1 text-xs tracking-wide text-white/85">
            In Loving Memory
          </p>
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px] md:items-end">
            <div>
              <h1 className="max-w-3xl font-display text-5xl font-semibold leading-none md:text-7xl">
                {memorial.title}
              </h1>
              <p className="mt-4 text-base italic text-white/88 md:text-xl">
                {memorial.full_name}
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.75rem] border border-white/14 bg-white/6 p-4 text-sm text-white/78">
              <div>
                <p className="text-[0.7rem] uppercase tracking-[0.24em] text-white/55">
                  Life remembered
                </p>
                {memorial.dob || memorial.dod ? (
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-white/88 md:text-base">
                    {memorial.dob
                      ? format(new Date(memorial.dob), 'MMMM d, yyyy')
                      : '...'}{' '}
                    -{' '}
                    {memorial.dod
                      ? format(new Date(memorial.dod), 'MMMM d, yyyy')
                      : 'Present'}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-white/74">
                    Family stories, milestones, and tributes gathered in one
                    place.
                  </p>
                )}
              </div>
              <div className="h-px bg-white/12" />
              <p className="text-sm leading-relaxed text-white/74">
                A space for remembrance, shared stories, and family-guided
                tribute stewardship.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
