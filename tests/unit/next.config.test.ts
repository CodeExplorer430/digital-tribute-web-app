import nextConfig from '../../next.config'

describe('next.config security headers', () => {
  it('applies the hardened header policy across all routes', async () => {
    const headers = await nextConfig.headers?.()

    expect(headers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: '/:path*',
          headers: expect.arrayContaining([
            expect.objectContaining({ key: 'Content-Security-Policy' }),
            expect.objectContaining({ key: 'Permissions-Policy' }),
            expect.objectContaining({ key: 'Referrer-Policy' }),
            expect.objectContaining({ key: 'Strict-Transport-Security' }),
            expect.objectContaining({ key: 'X-Content-Type-Options' }),
            expect.objectContaining({ key: 'X-Frame-Options' }),
          ]),
        }),
      ])
    )
  })
})
