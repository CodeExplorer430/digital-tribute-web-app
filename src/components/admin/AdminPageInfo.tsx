/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Globe, Lock } from 'lucide-react'

interface AdminPageInfoProps {
  page: any
  onUpdate: () => void
}

export function AdminPageInfo({ page, onUpdate }: AdminPageInfoProps) {
  const [formData, setFormData] = useState(page)
  const [updating, setUpdating] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setFormData(page)
  }, [page])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    const { error } = await supabase
      .from('pages')
      .update({
        title: formData.title,
        slug: formData.slug,
        full_name: formData.full_name,
        dob: formData.dob,
        dod: formData.dod,
        privacy: formData.privacy,
      })
      .eq('id', page.id)

    if (error) alert(error.message)
    else onUpdate()
    setUpdating(false)
  }

  const togglePrivacy = () => {
    setFormData({ ...formData, privacy: formData.privacy === 'public' ? 'private' : 'public' })
  }

  return (
    <form onSubmit={handleUpdate} className="surface-card space-y-4 p-6">
      <h3 className="border-b border-border pb-2 text-base font-semibold">Basic Information</h3>

      <div className="flex items-center justify-between rounded-md border border-border bg-secondary/55 p-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          {formData.privacy === 'public' ? <Globe className="h-4 w-4 text-primary" /> : <Lock className="h-4 w-4 text-amber-700" />}
          <span className="capitalize">{formData.privacy} Mode</span>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={togglePrivacy}>
          Switch to {formData.privacy === 'public' ? 'Private' : 'Public'}
        </Button>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Page Title</label>
        <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Slug</label>
        <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Full Name</label>
        <Input value={formData.full_name || ''} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">DOB</label>
          <Input type="date" value={formData.dob || ''} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">DOD</label>
          <Input type="date" value={formData.dod || ''} onChange={(e) => setFormData({ ...formData, dod: e.target.value })} />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={updating}>
        {updating ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
