import { render, screen } from '@testing-library/react'
import { AdminDashboardView } from '@/components/pages/admin/AdminDashboardView'

const mockTributeList = vi.fn()

vi.mock('@/components/admin/TributeList', () => ({
  TributeList: (props: unknown) => {
    mockTributeList(props)
    return <div data-testid="tribute-list" />
  },
}))

describe('AdminDashboardView', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockTributeList.mockReset()
  })

  it('renders dashboard actions and passes pages to TributeList', () => {
    const pages = [
      { id: 'p1', title: 'Jane', slug: 'jane', created_at: '2026-01-01T00:00:00.000Z' },
      { id: 'p2', title: 'John', slug: 'john', created_at: '2026-01-02T00:00:00.000Z' },
    ]

    render(<AdminDashboardView pages={pages} />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Create New Memorial/i })).toHaveAttribute('href', '/admin/memorials/new')
    expect(screen.getByRole('link', { name: 'Open Guestbook' })).toHaveAttribute('href', '/admin/guestbook')
    expect(screen.getByRole('link', { name: 'Manage Redirects' })).toHaveAttribute('href', '/admin/settings')
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByTestId('tribute-list')).toBeInTheDocument()
    expect(mockTributeList).toHaveBeenCalledWith({ pages })
  })

  it('shows zero memorial count when no pages exist', () => {
    render(<AdminDashboardView pages={[]} />)

    expect(screen.getByText('0')).toBeInTheDocument()
    expect(mockTributeList).toHaveBeenCalledWith({ pages: [] })
  })
})
