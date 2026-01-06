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
    else onUpdate() // Trigger refresh
    setUpdating(false)
  }

  const togglePrivacy = () => {
    setFormData({ ...formData, privacy: formData.privacy === 'public' ? 'private' : 'public' })
  }

  return (
    <form onSubmit={handleUpdate} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Basic Information</h3>
      
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200">
        <div className="flex items-center space-x-2">
          {formData.privacy === 'public' ? <Globe className="h-4 w-4 text-green-600" /> : <Lock className="h-4 w-4 text-amber-600" />}
          <span className="text-sm font-medium text-gray-700 capitalize">{formData.privacy} Mode</span>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={togglePrivacy}>
          Switch to {formData.privacy === 'public' ? 'Private' : 'Public'}
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Page Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <Input
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <Input
          value={formData.full_name || ''}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">DOB</label>
          <Input
            type="date"
            value={formData.dob || ''}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">DOD</label>
          <Input
            type="date"
            value={formData.dod || ''}
            onChange={(e) => setFormData({ ...formData, dod: e.target.value })}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={updating}>
        {updating ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
