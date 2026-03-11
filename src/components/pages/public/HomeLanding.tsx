import Link from 'next/link'
import {
  ArrowRight,
  Heart,
  Link2,
  ShieldCheck,
  Sparkles,
  Flower2,
  BookHeart,
  ScanLine,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const highlights = [
  {
    title: 'Build the memorial',
    text: 'Shape a memorial with stories, milestones, photos, and film into a tribute that still feels dignified years from now.',
    icon: Heart,
  },
  {
    title: 'Share through short links',
    text: 'Generate QR-ready short links for plaques and printed cards so the memorial can move without reprinting materials.',
    icon: Link2,
  },
  {
    title: 'Moderate with confidence',
    text: 'Review guestbook messages, manage collaborators, and keep every public memory family-approved.',
    icon: ShieldCheck,
  },
]

const stats = [
  { label: 'Private admin controls', value: '3 roles' },
  { label: 'Visitor sharing', value: 'QR + short URL' },
  { label: 'Memorial upkeep', value: 'Anytime updates' },
]

const stewardshipNotes = [
  {
    title: 'Quiet publishing',
    text: 'Move from first tribute to long-term memorial without exposing unfinished details.',
    icon: BookHeart,
  },
  {
    title: 'Print-ready sharing',
    text: 'Connect plaques, service cards, and family handouts to a memorial that can keep evolving.',
    icon: ScanLine,
  },
  {
    title: 'Family oversight',
    text: 'Moderate guestbook entries, protected media, and collaborators in one secure operations space.',
    icon: Flower2,
  },
]

export function HomeLanding() {
  return <LandingContent directoryEnabled={false} memorials={[]} />
}

type LandingMemorial = {
  id: string
  title: string
  slug: string
  full_name: string | null
}

interface LandingContentProps {
  directoryEnabled: boolean
  memorials: LandingMemorial[]
}

export function LandingContent({
  directoryEnabled,
  memorials,
}: LandingContentProps) {
  return (
    <div className="page-shell min-h-screen pb-14">
      <header className="page-container flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-[1.4rem] border border-border/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(240,233,222,0.8))] p-3 shadow-[0_16px_32px_rgba(43,51,42,0.1)]">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide text-foreground">
              Everlume
            </h1>
            <p className="text-xs text-muted-foreground">
              Digital tribute publishing for families
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/login">Admin Login</Link>
        </Button>
      </header>

      <main
        id="main-content"
        className="page-container grid gap-10 py-8 md:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)] md:items-center md:py-16"
      >
        <section className="space-y-7">
          <p className="pill-muted">
            Built for families, parishes, and memorial teams
          </p>
          <div className="space-y-5">
            <h2 className="section-title max-w-4xl text-balance">
              A memorial platform that feels ceremonial in public and
              unmistakably dependable behind the scenes.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Everlume helps families publish a memorial with calm presentation,
              secure admin accounts, and QR-friendly sharing that can endure
              beyond one event or one device.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/login">
                Open Admin
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="#how-it-works">How it works</Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="surface-card data-card px-4 py-4"
              >
                <p className="text-lg font-semibold text-foreground">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {stewardshipNotes.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="surface-card p-5">
                  <div className="mb-4 inline-flex rounded-2xl border border-border/70 bg-[var(--surface-1)] p-2.5">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.text}
                  </p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="surface-card relative overflow-hidden p-6 md:p-8">
          <div className="absolute inset-x-10 top-6 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          <div className="absolute -right-10 -top-8 h-44 w-44 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -bottom-14 left-0 h-48 w-48 rounded-full bg-[rgba(220,200,157,0.48)] blur-3xl" />
          <div className="relative space-y-6">
            <div className="inline-flex rounded-full border border-border/70 bg-white/78 p-3 shadow-[0_18px_36px_rgba(43,51,42,0.1)]">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-4">
              <p className="status-pill w-fit">Memorial Preview</p>
              <blockquote className="font-display text-3xl leading-tight text-foreground md:text-4xl">
                &quot;To live in hearts we leave behind is not to die.&quot;
              </blockquote>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                A digital space for remembrance, reflection, and practical
                memorial stewardship, designed to remain useful long after the
                first day of sharing.
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.8rem] border border-white/55 bg-white/58 p-4 shadow-[0_16px_32px_rgba(44,50,42,0.08)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Example flow
                  </p>
                  <p className="mt-1 text-lg font-semibold">
                    Share gracefully, update later
                  </p>
                </div>
                <div className="rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                  Private by default
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/65 bg-white/70 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    1
                  </p>
                  <p className="mt-1 text-sm font-medium">Create memorial</p>
                </div>
                <div className="rounded-2xl border border-border/65 bg-white/70 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    2
                  </p>
                  <p className="mt-1 text-sm font-medium">Review tributes</p>
                </div>
                <div className="rounded-2xl border border-border/65 bg-white/70 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    3
                  </p>
                  <p className="mt-1 text-sm font-medium">Publish QR link</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section id="how-it-works" className="page-container py-10 md:py-16">
        <div className="mb-8 space-y-2 md:mb-10">
          <p className="section-kicker">How It Works</p>
          <h3 className="section-title">
            Three measured steps from setup to remembrance.
          </h3>
          <p className="max-w-2xl text-muted-foreground">
            Everlume is built to help families move from creation to sharing
            without sacrificing privacy, care, or clarity.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item, idx) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="surface-card data-card p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Step {idx + 1}
                </p>
                <div className="mb-4 inline-flex rounded-2xl border border-border/70 bg-secondary p-2.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-foreground">
                  {item.title}
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      {directoryEnabled && (
        <section
          id="memorial-directory"
          className="page-container py-4 md:py-8"
        >
          <div className="mb-5 space-y-1">
            <p className="section-kicker">Public Directory</p>
            <h3 className="text-2xl font-semibold">Memorial Directory</h3>
            <p className="text-sm text-muted-foreground">
              Browse memorials that families have chosen to publish publicly.
              Private and password-protected memorials remain outside this
              directory.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {memorials.map((memorial) => (
              <article
                key={memorial.id}
                className="surface-card data-card flex h-full flex-col justify-between gap-4 p-5"
              >
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/85">
                    Public memorial
                  </p>
                  <h4 className="text-lg font-semibold text-foreground">
                    {memorial.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {memorial.full_name || 'Memorial'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    everlume / {memorial.slug}
                  </p>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/memorials/${memorial.slug}`}>
                    Open memorial
                  </Link>
                </Button>
              </article>
            ))}
            {memorials.length === 0 && (
              <div className="surface-card col-span-full p-6 text-center">
                <p className="text-lg font-semibold text-foreground">
                  The public directory is ready.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Public memorial sharing is enabled, but no families have
                  published a directory-listed memorial yet.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="page-container py-12">
        <div className="surface-card flex flex-col items-start justify-between gap-5 overflow-hidden p-6 md:flex-row md:items-center md:p-8">
          <div className="space-y-2">
            <p className="section-kicker">Get Started</p>
            <h3 className="section-title text-[2.2rem]">
              Create the first memorial when your family is ready.
            </h3>
            <p className="max-w-xl text-sm text-muted-foreground">
              Publish the essential story first, then continue refining photos,
              timelines, moderation, and guestbook access over time.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link href="/login">Open Admin</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
