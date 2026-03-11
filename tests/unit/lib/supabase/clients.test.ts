const mockCreateBrowserClient = vi.fn()
const mockCreateServerClient = vi.fn()
const mockCreateJsClient = vi.fn()
const mockCookies = vi.fn()

const mockGetSupabaseUrlOrThrow = vi.fn()
const mockGetSupabasePublishableKeyOrThrow = vi.fn()
const mockGetSupabaseSecretKeyOrThrow = vi.fn()

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: (...args: unknown[]) => mockCreateBrowserClient(...args),
  createServerClient: (...args: unknown[]) => mockCreateServerClient(...args),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: (...args: unknown[]) => mockCreateJsClient(...args),
}))

vi.mock('next/headers', () => ({
  cookies: () => mockCookies(),
}))

vi.mock('@/lib/supabase/env', () => ({
  getSupabaseUrlOrThrow: () => mockGetSupabaseUrlOrThrow(),
  getSupabasePublishableKeyOrThrow: () =>
    mockGetSupabasePublishableKeyOrThrow(),
  getSupabaseSecretKeyOrThrow: () => mockGetSupabaseSecretKeyOrThrow(),
}))

describe('supabase client wrappers', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockCreateBrowserClient.mockReset()
    mockCreateServerClient.mockReset()
    mockCreateJsClient.mockReset()
    mockCookies.mockReset()
    mockGetSupabaseUrlOrThrow.mockReset()
    mockGetSupabasePublishableKeyOrThrow.mockReset()
    mockGetSupabaseSecretKeyOrThrow.mockReset()
    mockGetSupabaseUrlOrThrow.mockReturnValue('https://example.supabase.co')
    mockGetSupabasePublishableKeyOrThrow.mockReturnValue('publishable-key')
    mockGetSupabaseSecretKeyOrThrow.mockReturnValue('service-role-key')
  })

  it('createClient (browser) uses publishable credentials', async () => {
    const expectedClient = { kind: 'browser' }
    mockCreateBrowserClient.mockReturnValue(expectedClient)

    const mod = await import('@/lib/supabase/client')
    const client = mod.createClient()

    expect(client).toBe(expectedClient)
    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'publishable-key'
    )
  })

  it('createPublicClient configures non-persistent auth', async () => {
    const expectedClient = { kind: 'public' }
    mockCreateJsClient.mockReturnValue(expectedClient)

    const mod = await import('@/lib/supabase/public')
    const client = mod.createPublicClient()

    expect(client).toBe(expectedClient)
    expect(mockCreateJsClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'publishable-key',
      expect.objectContaining({
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    )
  })

  it('createServiceRoleClient uses secret key and non-persistent auth', async () => {
    const expectedClient = { kind: 'service' }
    mockCreateJsClient.mockReturnValue(expectedClient)

    const mod = await import('@/lib/supabase/service')
    const client = mod.createServiceRoleClient()

    expect(client).toBe(expectedClient)
    expect(mockCreateJsClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'service-role-key',
      expect.objectContaining({
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    )
  })

  it('createClient (server) wires cookie adapters', async () => {
    const cookieStore = {
      getAll: vi.fn(() => [{ name: 'sb-access-token', value: 'abc' }]),
      set: vi.fn(),
    }
    mockCookies.mockResolvedValue(cookieStore)
    mockCreateServerClient.mockReturnValue({ kind: 'server' })

    const mod = await import('@/lib/supabase/server')
    const client = await mod.createClient()

    expect(client).toEqual({ kind: 'server' })
    expect(mockCreateServerClient).toHaveBeenCalledWith(
      'https://example.supabase.co',
      'publishable-key',
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      })
    )

    const options = mockCreateServerClient.mock.calls[0][2] as {
      cookies: {
        getAll: () => unknown
        setAll: (
          cookiesToSet: Array<{
            name: string
            value: string
            options?: Record<string, unknown>
          }>
        ) => void
      }
    }

    expect(options.cookies.getAll()).toEqual([
      { name: 'sb-access-token', value: 'abc' },
    ])
    options.cookies.setAll([
      { name: 'sb-refresh-token', value: 'def', options: { path: '/' } },
    ])
    expect(cookieStore.set).toHaveBeenCalledWith('sb-refresh-token', 'def', {
      path: '/',
    })
  })

  it('createClient (server) ignores cookie set errors', async () => {
    const cookieStore = {
      getAll: vi.fn(() => []),
      set: vi.fn(() => {
        throw new Error('read-only context')
      }),
    }
    mockCookies.mockResolvedValue(cookieStore)
    mockCreateServerClient.mockReturnValue({ kind: 'server' })

    const mod = await import('@/lib/supabase/server')
    await mod.createClient()

    const options = mockCreateServerClient.mock.calls[0][2] as {
      cookies: {
        setAll: (
          cookiesToSet: Array<{
            name: string
            value: string
            options?: Record<string, unknown>
          }>
        ) => void
      }
    }

    expect(() =>
      options.cookies.setAll([
        { name: 'sb-access-token', value: 'abc', options: { path: '/' } },
      ])
    ).not.toThrow()
  })
})
