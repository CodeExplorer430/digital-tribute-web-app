/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus, Youtube } from 'lucide-react'

interface VideoManagerProps {
  pageId: string
}

export function VideoManager({ pageId }: VideoManagerProps) {
  const [videos, setVideos] = useState<any[]>([])
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const fetchVideos = useCallback(async () => {
    const { data } = await supabase.from('videos').select('*').eq('page_id', pageId).order('created_at', { ascending: true })

    setVideos(data || [])
    setLoading(false)
  }, [pageId, supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVideos()
  }, [fetchVideos])

  const getYoutubeId = (youtubeUrl: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = youtubeUrl.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    const videoId = getYoutubeId(url)
    if (!videoId) {
      alert('Invalid YouTube URL')
      return
    }

    const { error } = await supabase.from('videos').insert({
      page_id: pageId,
      provider: 'youtube',
      provider_id: videoId,
      title,
    })

    if (error) alert(error.message)
    else {
      setUrl('')
      setTitle('')
      fetchVideos()
    }
  }

  const deleteVideo = async (id: string) => {
    await supabase.from('videos').delete().eq('id', id)
    fetchVideos()
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading videos...</div>

  return (
    <div className="space-y-5">
      <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
        Upload videos to YouTube first, then paste the link here. For files larger than 100MB, direct app uploads are not supported.
      </div>
      <form onSubmit={addVideo} className="space-y-3">
        <Input
          placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <div className="flex gap-2">
          <Input className="flex-1" placeholder="Video Title (Optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Button type="submit" size="icon" aria-label="Add video">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <div className="space-y-2">
        {videos.map((video) => (
          <div key={video.id} className="flex items-center gap-3 rounded-md border border-border bg-secondary/45 p-3">
            <div className="rounded bg-red-100 p-2">
              <Youtube className="h-5 w-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{video.title || 'Untitled Video'}</p>
              <p className="truncate text-xs text-muted-foreground">ID: {video.provider_id}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => deleteVideo(video.id)} aria-label="Delete video">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
