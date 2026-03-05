import { POST } from '@/app/api/guestbook/route'

const mockSingle = vi.fn()
const mockInsert = vi.fn()
const mockEq = vi.fn(() => ({ single: mockSingle }))
const mockSelect = vi.fn(() => ({ eq: mockEq }))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    from: (table: string) => {
      if (table === 'pages') {
        return { select: mockSelect }
      }
      return { insert: mockInsert }
    },
  }),
}))

describe('POST /api/guestbook', () => {
  beforeEach(() => {
    mockSingle.mockReset()
    mockInsert.mockReset()
    mockSelect.mockClear()
    mockEq.mockClear()
  })

  it('rejects invalid payload', async () => {
    const req = new Request('http://localhost/api/guestbook', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pageId: 'bad-id', name: '', message: '' }),
    })

    const res = await POST(req as never)
    expect(res.status).toBe(400)
  })

  it('creates guestbook entry for valid payload', async () => {
    mockSingle.mockResolvedValue({ data: { id: 'page-1' } })
    mockInsert.mockResolvedValue({ error: null })

    const req = new Request('http://localhost/api/guestbook', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '1.2.3.4' },
      body: JSON.stringify({
        pageId: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Maria',
        message: 'Forever remembered',
        submittedAt: Date.now() - 3000,
      }),
    })

    const res = await POST(req as never)
    expect(res.status).toBe(201)
    expect(mockInsert).toHaveBeenCalledWith({
      page_id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Maria',
      message: 'Forever remembered',
    })
  })
})
