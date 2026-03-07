import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimelineEditor } from '@/components/admin/TimelineEditor'

describe('TimelineEditor', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders current timeline events', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ events: [{ id: 't1', year: 1990, text: 'Born' }] }), { status: 200 })
    )

    render(<TimelineEditor pageId="page-1" />)
    expect(await screen.findByText('Born')).toBeInTheDocument()
  })

  it('inserts event', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
      const url = String(input)
      if (url === '/api/admin/timeline' && init?.method === 'POST') {
        return new Response(JSON.stringify({ event: { id: 'new' } }), { status: 201 })
      }

      return new Response(JSON.stringify({ events: [{ id: 't1', year: 1990, text: 'Born' }] }), { status: 200 })
    })

    const user = userEvent.setup()
    render(<TimelineEditor pageId="page-1" />)

    await screen.findByText('Born')
    await user.type(screen.getByPlaceholderText('Year'), '2001')
    await user.type(screen.getByPlaceholderText('Event description...'), 'Started university')
    await user.click(screen.getByRole('button', { name: /add timeline event/i }))

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/timeline',
      expect.objectContaining({
        method: 'POST',
      })
    )
  })
})
