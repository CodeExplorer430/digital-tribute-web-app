import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemorialActionBar } from '@/components/public/MemorialActionBar'

describe('MemorialActionBar', () => {
  const originalShare = navigator.share
  const originalClipboard = navigator.clipboard
  const originalPrint = window.print
  const originalHref = window.location.href

  beforeEach(() => {
    vi.restoreAllMocks()
    window.history.replaceState({}, '', '/memorials/jane-doe')
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: originalShare })
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: originalClipboard })
    window.print = originalPrint
    window.history.replaceState({}, '', originalHref)
  })

  it('uses the native share sheet when available', async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'share', { configurable: true, value: shareMock })

    const user = userEvent.setup()
    render(<MemorialActionBar memorialTitle="In Loving Memory of Jane Doe" guestbookHref="#guestbook" />)

    await user.click(screen.getByRole('button', { name: /share/i }))

    expect(shareMock).toHaveBeenCalledWith({
      title: 'In Loving Memory of Jane Doe',
      text: 'Visit this memorial for In Loving Memory of Jane Doe.',
      url: 'http://localhost:3000/memorials/jane-doe',
    })
    expect(screen.getByText('Share sheet opened.')).toBeInTheDocument()
  })

  it('copies the memorial link when clipboard access is available', async () => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined })

    const user = userEvent.setup()
    render(<MemorialActionBar memorialTitle="In Loving Memory of Jane Doe" guestbookHref="#guestbook" />)

    await user.click(screen.getByRole('button', { name: /copy link/i }))

    expect(screen.getByText('Memorial link copied.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /leave a message/i })).toHaveAttribute('href', '#guestbook')
  })

  it('prints the memorial when print action is pressed', async () => {
    window.print = vi.fn()

    const user = userEvent.setup()
    render(<MemorialActionBar memorialTitle="In Loving Memory of Jane Doe" guestbookHref="#guestbook" />)

    await user.click(screen.getByRole('button', { name: /print memorial/i }))

    expect(window.print).toHaveBeenCalled()
  })
})
