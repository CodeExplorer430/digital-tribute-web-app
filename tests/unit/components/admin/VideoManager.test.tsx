import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { VideoManager } from '@/components/admin/VideoManager'

describe('VideoManager', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders policy notice and existing videos', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ videos: [{ id: '1', provider_id: 'abcdefghijk', title: 'Clip' }] }), { status: 200 })
    )

    render(<VideoManager pageId="page-1" />)

    expect(await screen.findByText(/Upload videos to YouTube first/)).toBeInTheDocument()
    expect(await screen.findByText('Clip')).toBeInTheDocument()
  })

  it('inserts valid youtube video', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const url = String(input)
      if (url === '/api/admin/videos' && init?.method === 'POST') {
        return new Response(JSON.stringify({ video: { id: 'new' } }), { status: 201 })
      }

      return new Response(JSON.stringify({ videos: [{ id: '1', provider_id: 'abcdefghijk', title: 'Clip' }] }), { status: 200 })
    })

    const user = userEvent.setup()
    render(<VideoManager pageId="page-1" />)

    await screen.findByText(/Upload videos to YouTube first/)
    await user.type(screen.getByPlaceholderText(/YouTube URL/), 'https://www.youtube.com/watch?v=abcdefghijk')
    await user.type(screen.getByPlaceholderText(/Video Title/), 'Memorial Video')
    await user.click(screen.getByRole('button', { name: /add video/i }))

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/videos',
      expect.objectContaining({
        method: 'POST',
      })
    )
  })
})
