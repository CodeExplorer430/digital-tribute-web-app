import { POST } from '@/app/auth/signout/route'

const mockGetUser = vi.fn()
const mockSignOut = vi.fn()
const mockRevalidatePath = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: {
      getUser: mockGetUser,
      signOut: mockSignOut,
    },
  }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}))

describe('POST /auth/signout', () => {
  beforeEach(() => {
    mockGetUser.mockReset()
    mockSignOut.mockReset()
    mockRevalidatePath.mockReset()
  })

  it('redirects to /login without signing out when no user is present', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const req = new Request('http://localhost/auth/signout', { method: 'POST' })
    const res = await POST(req as never)

    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('http://localhost/login')
    expect(mockSignOut).not.toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
  })

  it('signs out authenticated user and redirects to /login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockSignOut.mockResolvedValue({})

    const req = new Request('http://localhost/auth/signout', { method: 'POST' })
    const res = await POST(req as never)

    expect(res.status).toBe(302)
    expect(res.headers.get('location')).toBe('http://localhost/login')
    expect(mockSignOut).toHaveBeenCalled()
    expect(mockRevalidatePath).toHaveBeenCalledWith('/', 'layout')
  })
})
