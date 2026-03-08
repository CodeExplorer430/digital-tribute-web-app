interface TimelineEvent {
  id: string
  year: number
  text: string
}

interface TributeTimelineProps {
  timeline: TimelineEvent[]
}

export function TributeTimeline({ timeline }: TributeTimelineProps) {
  return (
    <section id="timeline" className="space-y-8 border-t border-border/80 pt-12">
      <div className="space-y-2 text-center">
        <h2 className="section-title">Life Timeline</h2>
        <p className="text-sm text-muted-foreground">A brief sequence of meaningful moments.</p>
      </div>

      <div className="mx-auto max-w-2xl">
        {timeline && timeline.length > 0 ? (
          <div className="relative ml-4 space-y-8 border-l-2 border-border/80 pb-4">
            {timeline.map((event) => (
              <article key={event.id} className="relative pl-8">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-4 border-background bg-primary shadow-sm" />
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/95">{event.year}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground md:text-base">{event.text}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface-card px-6 py-10 text-center">
            <p className="text-lg font-semibold text-foreground">A life story is still being assembled.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Milestones, places, and family memories will appear here as the timeline is completed.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
