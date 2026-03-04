/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Check, Trash2, X } from 'lucide-react'

export default function GuestbookModeration() {
  const [entries, setEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const fetchEntries = useCallback(async () => {
    const { data } = await supabase.from('guestbook').select('*, pages(title)').order('created_at', { ascending: false })
    setEntries(data || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEntries()
  }, [fetchEntries])

  const approveEntry = async (id: string) => {
    const { error } = await supabase.from('guestbook').update({ is_approved: true }).eq('id', id)
    if (error) alert(error.message)
    fetchEntries()
  }

  const deleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return

    const { error } = await supabase.from('guestbook').delete().eq('id', id)
    if (error) alert(error.message)
    fetchEntries()
  }

  const unapproveEntry = async (id: string) => {
    const { error } = await supabase.from('guestbook').update({ is_approved: false }).eq('id', id)
    if (error) alert(error.message)
    fetchEntries()
  }

  if (loading) return <div className="surface-card p-8 text-sm text-muted-foreground">Loading entries...</div>

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Guestbook Moderation</h2>
        <p className="text-sm text-muted-foreground">Approve or remove messages before they appear publicly.</p>
      </div>

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary/80 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">From / Page</th>
                <th className="px-4 py-3 text-left">Message</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entries.length > 0 ? (
                entries.map((entry) => (
                  <tr key={entry.id} className="align-top">
                    <td className="px-4 py-3">
                      {entry.is_approved ? (
                        <span className="inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-xs text-muted-foreground">{entry.pages?.title}</div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="line-clamp-3 leading-relaxed text-foreground/95" title={entry.message}>
                        {entry.message}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{format(new Date(entry.created_at), 'MMM d, yyyy')}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {!entry.is_approved ? (
                          <Button variant="ghost" size="sm" onClick={() => approveEntry(entry.id)}>
                            <Check className="h-4 w-4 text-emerald-700" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => unapproveEntry(entry.id)}>
                            <X className="h-4 w-4 text-amber-700" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm italic text-muted-foreground">
                    No guestbook entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
