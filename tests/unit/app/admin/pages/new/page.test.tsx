const mockRedirect = vi.fn()

vi.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
}))

describe('app/admin/pages/new/page', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockRedirect.mockReset()
  })

  it('redirects to /admin/memorials/new', async () => {
    const mod = await import('@/app/admin/pages/new/page')
    mod.default()

    expect(mockRedirect).toHaveBeenCalledWith('/admin/memorials/new')
  })
})
