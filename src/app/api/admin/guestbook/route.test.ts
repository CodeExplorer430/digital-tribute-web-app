import { GET } from '@/app/api/admin/guestbook/route'

const mockGetUser = vi.fn()
const mockOrder = vi.fn()
const mockEq = vi.fn(() => ({ order: mockOrder }))
const mockSelect = vi.fn(() => ({ eq: mockEq }))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: mockGetUser },
    from: () => ({ select: mockSelect }),
  }),
}))

describe('GET /api/admin/guestbook', () => {
  beforeEach(() => {
    mockGetUser.mockReset()
    mockOrder.mockReset()
  })

  it('returns unauthorized without user', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns entries for owner', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockOrder.mockResolvedValue({ data: [{ id: 'g1' }], error: null })

    const res = await GET()
    expect(res.status).toBe(200)
  })
})
