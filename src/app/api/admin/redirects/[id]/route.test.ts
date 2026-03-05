import { DELETE } from '@/app/api/admin/redirects/[id]/route'

const mockGetUser = vi.fn()
const mockRedirectSingle = vi.fn()
const mockRedirectEqCreatedBy = vi.fn(() => ({ single: mockRedirectSingle }))
const mockRedirectEqId = vi.fn(() => ({ eq: mockRedirectEqCreatedBy }))
const mockRedirectSelect = vi.fn(() => ({ eq: mockRedirectEqId }))
const mockDeleteEq = vi.fn()
const mockDelete = vi.fn(() => ({ eq: mockDeleteEq }))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: mockGetUser },
    from: () => ({
      select: mockRedirectSelect,
      delete: mockDelete,
    }),
  }),
}))

describe('DELETE /api/admin/redirects/[id]', () => {
  beforeEach(() => {
    mockGetUser.mockReset()
    mockRedirectSingle.mockReset()
    mockDeleteEq.mockReset()
  })

  it('returns forbidden for non-owner', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockRedirectSingle.mockResolvedValue({ data: null })

    const req = new Request('http://localhost/api/admin/redirects/550e8400-e29b-41d4-a716-446655440000', { method: 'DELETE' })
    const res = await DELETE(req as never, { params: Promise.resolve({ id: '550e8400-e29b-41d4-a716-446655440000' }) })
    expect(res.status).toBe(403)
  })

  it('deletes redirect for owner', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockRedirectSingle.mockResolvedValue({ data: { id: 'r1' } })
    mockDeleteEq.mockResolvedValue({ error: null })

    const req = new Request('http://localhost/api/admin/redirects/550e8400-e29b-41d4-a716-446655440000', { method: 'DELETE' })
    const res = await DELETE(req as never, { params: Promise.resolve({ id: '550e8400-e29b-41d4-a716-446655440000' }) })
    expect(res.status).toBe(200)
  })
})
