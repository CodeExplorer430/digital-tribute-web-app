/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus } from 'lucide-react'

interface TimelineEditorProps {
  pageId: string
}

export function TimelineEditor({ pageId }: TimelineEditorProps) {
  const [events, setEvents] = useState<any[]>([])
  const [newYear, setNewYear] = useState('')
  const [newText, setNewText] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase.from('timeline_events').select('*').eq('page_id', pageId).order('year', { ascending: true })

    setEvents(data || [])
    setLoading(false)
  }, [pageId, supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents()
  }, [fetchEvents])

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('timeline_events').insert({
      page_id: pageId,
      year: parseInt(newYear),
      text: newText,
    })

    if (error) alert(error.message)
    else {
      setNewYear('')
      setNewText('')
      fetchEvents()
    }
  }

  const deleteEvent = async (id: string) => {
    await supabase.from('timeline_events').delete().eq('id', id)
    fetchEvents()
  }

  if (loading) return <div className="text-sm text-muted-foreground">Loading timeline...</div>

  return (
    <div className="space-y-5">
      <form onSubmit={addEvent} className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input className="sm:w-24" type="number" placeholder="Year" value={newYear} onChange={(e) => setNewYear(e.target.value)} required />
          <Input className="flex-1" placeholder="Event description..." value={newText} onChange={(e) => setNewText(e.target.value)} required />
          <Button type="submit" size="icon" aria-label="Add timeline event">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <ul className="space-y-2">
        {events.map((event) => (
          <li key={event.id} className="flex items-start justify-between rounded-md border border-border bg-secondary/40 p-3">
            <div className="pr-2 text-sm">
              <span className="mr-2 font-semibold">{event.year}</span>
              <span className="text-muted-foreground">{event.text}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)} aria-label="Delete timeline event">
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}
