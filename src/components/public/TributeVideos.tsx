interface Video {
  id: string
  provider_id: string
  title: string | null
}

interface TributeVideosProps {
  videos: Video[]
}

export function TributeVideos({ videos }: TributeVideosProps) {
  if (!videos || videos.length === 0) return null

  return (
    <section className="space-y-8 border-t border-border/80 pt-12">
      <div className="space-y-2 text-center">
        <h2 className="section-title">Video Memories</h2>
        <p className="text-sm text-muted-foreground">Recorded stories and moments from loved ones.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {videos.map((video) => (
          <article key={video.id} className="surface-card overflow-hidden p-3 md:p-4">
            <div className="aspect-video overflow-hidden rounded-md bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${video.provider_id}`}
                className="h-full w-full"
                allowFullScreen
                title={video.title || 'Video'}
              />
            </div>
            {video.title && <p className="px-1 pt-3 text-sm font-medium text-muted-foreground">{video.title}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}
