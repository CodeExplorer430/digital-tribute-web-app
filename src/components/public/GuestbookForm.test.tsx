import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GuestbookForm } from '@/components/public/GuestbookForm'

describe('GuestbookForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('submits and shows success message', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 201 })
    )
    const user = userEvent.setup()

    render(<GuestbookForm pageId="page-1" />)

    await user.type(screen.getByLabelText('Your Name'), 'Maria')
    await user.type(screen.getByLabelText('Your Message'), 'Forever remembered')
    await user.click(screen.getByRole('button', { name: 'Post to Guestbook' }))

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/guestbook',
      expect.objectContaining({
        method: 'POST',
      })
    )
    expect(await screen.findByText('Thank you for sharing')).toBeInTheDocument()
  })

  it('shows API error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Service unavailable' }), { status: 500 })
    )
    const user = userEvent.setup()

    render(<GuestbookForm pageId="page-1" />)

    await user.type(screen.getByLabelText('Your Name'), 'Maria')
    await user.type(screen.getByLabelText('Your Message'), 'Forever remembered')
    await user.click(screen.getByRole('button', { name: 'Post to Guestbook' }))

    expect(await screen.findByText('Service unavailable')).toBeInTheDocument()
  })
})
