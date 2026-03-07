import { renderToStaticMarkup } from 'react-dom/server'

const mockServiceWorkerRegister = vi.fn()

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}))

vi.mock('@/components/public/ServiceWorkerRegister', () => ({
  ServiceWorkerRegister: () => {
    mockServiceWorkerRegister()
    return <div data-testid="service-worker-register" />
  },
}))

describe('app/layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockServiceWorkerRegister.mockReset()
  })

  it('renders root layout with skip link, service worker register, and children', async () => {
    const mod = await import('@/app/layout')
    const node = mod.default({ children: <div>App child</div> })
    const html = renderToStaticMarkup(node)

    expect(html).toContain('Skip to content')
    expect(html).toContain('href="#main-content"')
    expect(html).toContain('data-testid="service-worker-register"')
    expect(html).toContain('App child')
    expect(mockServiceWorkerRegister).toHaveBeenCalled()
  })
})
