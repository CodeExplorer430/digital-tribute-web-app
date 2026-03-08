'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, MessageSquareMore, Printer, Share2 } from 'lucide-react'

interface MemorialActionBarProps {
  memorialTitle: string
  guestbookHref?: string
}

export function MemorialActionBar({ memorialTitle, guestbookHref }: MemorialActionBarProps) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const handleShare = async () => {
    const shareUrl = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: memorialTitle,
          text: `Visit this memorial for ${memorialTitle}.`,
          url: shareUrl,
        })
        setStatusMessage('Share sheet opened.')
        return
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
      }
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl)
      setStatusMessage('Memorial link copied.')
      return
    }

    setStatusMessage('Sharing is unavailable on this device.')
  }

  const handleCopyLink = async () => {
    const shareUrl = window.location.href
    if (!navigator.clipboard?.writeText) {
      setStatusMessage('Copy link is unavailable on this device.')
      return
    }

    await navigator.clipboard.writeText(shareUrl)
    setStatusMessage('Memorial link copied.')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <section className="surface-card mx-auto max-w-5xl border border-border/70 px-4 py-4 md:px-6" aria-label="Memorial actions">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="section-kicker">Visitor Actions</p>
          <p className="text-sm text-muted-foreground">
            Share this memorial, print a keepsake copy, or move directly to the guestbook.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => void handleShare()}>
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button type="button" variant="outline" onClick={() => void handleCopyLink()}>
            <Copy className="h-4 w-4" />
            Copy link
          </Button>
          <Button type="button" variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print memorial
          </Button>
          {guestbookHref ? (
            <Button variant="ghost" asChild>
              <Link href={guestbookHref}>
                <MessageSquareMore className="h-4 w-4" />
                Leave a message
              </Link>
            </Button>
          ) : null}
        </div>
      </div>

      {statusMessage ? <p className="mt-3 text-sm text-muted-foreground">{statusMessage}</p> : null}
    </section>
  )
}
