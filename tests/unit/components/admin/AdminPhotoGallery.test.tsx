import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AdminPhotoGallery } from '@/components/admin/AdminPhotoGallery'

vi.mock('next/image', () => ({
  default: () => <div data-testid="next-image" />,
}))

describe('AdminPhotoGallery', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders empty state when there are no photos', () => {
    render(<AdminPhotoGallery photos={[]} heroImageUrl={null} onRefresh={vi.fn()} onSetHero={vi.fn()} />)

    expect(screen.getByText('No photos uploaded yet.')).toBeInTheDocument()
  })

  it('sets hero image and edits caption', async () => {
    const onSetHero = vi.fn()
    const onRefresh = vi.fn()
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))

    const user = userEvent.setup()
    render(
      <AdminPhotoGallery
        photos={[
          {
            id: 'photo-1',
            caption: 'Old caption',
            sort_index: 0,
            image_url: 'https://cdn.example.com/full.jpg',
            thumb_url: 'https://cdn.example.com/thumb.jpg',
          },
        ]}
        heroImageUrl={null}
        onRefresh={onRefresh}
        onSetHero={onSetHero}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Set as Hero' }))
    expect(onSetHero).toHaveBeenCalledWith('https://cdn.example.com/full.jpg')

    await user.click(screen.getByText('Old caption'))
    await user.clear(screen.getByRole('textbox'))
    await user.type(screen.getByRole('textbox'), 'Updated caption')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/admin/photos/photo-1',
        expect.objectContaining({
          method: 'PATCH',
        })
      )
    })
    expect(onRefresh).toHaveBeenCalled()
  })

  it('respects delete confirmation and shows delete API error', async () => {
    const onRefresh = vi.fn()
    const confirmMock = vi.spyOn(window, 'confirm')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ message: 'Delete failed' }), { status: 500 }))

    const user = userEvent.setup()
    render(
      <AdminPhotoGallery
        photos={[
          {
            id: 'photo-1',
            caption: 'Old caption',
            sort_index: 0,
            image_url: 'https://cdn.example.com/full.jpg',
            thumb_url: 'https://cdn.example.com/thumb.jpg',
          },
        ]}
        heroImageUrl={null}
        onRefresh={onRefresh}
        onSetHero={vi.fn()}
      />
    )

    confirmMock.mockReturnValueOnce(false)
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(fetchMock).not.toHaveBeenCalledWith('/api/admin/photos/photo-1', expect.objectContaining({ method: 'DELETE' }))

    confirmMock.mockReturnValueOnce(true)
    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(await screen.findByText('Delete failed')).toBeInTheDocument()
    expect(onRefresh).not.toHaveBeenCalled()
  })
})
