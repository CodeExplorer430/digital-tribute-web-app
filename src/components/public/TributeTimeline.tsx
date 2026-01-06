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
    <section className="space-y-12 border-t border-gray-100 pt-16">
      <div className="text-center">
        <h2 className="text-3xl font-serif font-semibold text-gray-800">Life Timeline</h2>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {timeline && timeline.length > 0 ? (
          <div className="relative border-l-2 border-gray-200 ml-4 space-y-10 pb-4">
            {timeline.map((event) => (
              <div key={event.id} className="relative pl-8">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
                <div className="space-y-1">
                  <span className="text-sm font-bold text-blue-600 tracking-wider">{event.year}</span>
                  <p className="text-gray-700 leading-relaxed">{event.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 italic">No timeline events shared yet.</p>
        )}
      </div>
    </section>
  )
}
