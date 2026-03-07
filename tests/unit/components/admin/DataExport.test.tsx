import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataExport } from '@/components/admin/DataExport'

describe('DataExport', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  it('exports guestbook CSV and photo metadata CSV', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input)
      if (url === '/api/admin/pages/page-1/guestbook') {
        return new Response(
          JSON.stringify({
            entries: [
              {
                id: 'g1',
                name: 'Ana',
                email: 'ana@example.com',
                message: 'Forever loved',
                is_approved: true,
                created_at: '2026-01-01T00:00:00.000Z',
              },
            ],
          }),
          { status: 200 }
        )
      }
      if (url === '/api/admin/pages/page-1/photos') {
        return new Response(
          JSON.stringify({
            photos: [
              {
                id: 'p1',
                caption: 'Photo 1',
                image_url: 'https://cdn.example.com/full.jpg',
                thumb_url: 'https://cdn.example.com/thumb.jpg',
                cloudinary_public_id: 'memorial/p1',
                created_at: '2026-01-01T00:00:00.000Z',
                taken_at: null,
              },
            ],
          }),
          { status: 200 }
        )
      }
      return new Response(JSON.stringify({}), { status: 200 })
    })

    const user = userEvent.setup()
    render(<DataExport pageId="page-1" pageTitle="Jane Doe" />)

    await user.click(screen.getByRole('button', { name: /Export Guestbook/i }))
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/admin/pages/page-1/guestbook', expect.anything())
    })

    await user.click(screen.getByRole('button', { name: /Export Photo Metadata/i }))
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/admin/pages/page-1/photos', expect.anything())
    })

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled()
  })

  it('shows no-data notice for guestbook export', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ entries: [] }), { status: 200 }))

    const user = userEvent.setup()
    render(<DataExport pageId="page-1" pageTitle="Jane Doe" />)

    await user.click(screen.getByRole('button', { name: /Export Guestbook/i }))
    expect(await screen.findByText('No guestbook entries to export.')).toBeInTheDocument()
  })

  it('exports photos ZIP and surfaces API errors', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = String(input)
      if (url === '/api/admin/pages/page-1/photos') {
        return new Response(
          JSON.stringify({
            photos: [
              {
                id: 'p1',
                caption: 'Photo 1',
                image_url: 'https://cdn.example.com/full.jpg',
                thumb_url: 'https://cdn.example.com/thumb.jpg',
                cloudinary_public_id: 'memorial/p1',
                created_at: '2026-01-01T00:00:00.000Z',
                taken_at: null,
              },
            ],
          }),
          { status: 200 }
        )
      }
      if (url === 'https://cdn.example.com/full.jpg') {
        return new Response(new Blob(['image-bytes'], { type: 'image/jpeg' }), { status: 200 })
      }
      return new Response(JSON.stringify({}), { status: 200 })
    })

    const user = userEvent.setup()
    render(<DataExport pageId="page-1" pageTitle="Jane Doe" />)

    await user.click(screen.getByRole('button', { name: /Download All Photos/i }))
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('https://cdn.example.com/full.jpg')
    })
    await waitFor(() => {
      expect(URL.createObjectURL).toHaveBeenCalled()
    })

    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ message: 'Unable to load photos.' }), { status: 500 }))
    await user.click(screen.getByRole('button', { name: /Export Photo Metadata/i }))
    expect(await screen.findByText(/Export failed: Unable to load photos\./)).toBeInTheDocument()
  })
})
