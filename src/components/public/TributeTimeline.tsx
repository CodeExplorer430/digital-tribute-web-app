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
    <section className="space-y-8 border-t border-border/80 pt-12">
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
          <p className="text-center text-sm italic text-muted-foreground">No timeline events shared yet.</p>
        )}
      </div>
    </section>
  )
}
