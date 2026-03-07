import manifest from '@/app/manifest'

describe('app/manifest', () => {
  it('returns expected web manifest metadata', () => {
    expect(manifest()).toEqual(
      expect.objectContaining({
        name: 'Everlume',
        short_name: 'Everlume',
        start_url: '/',
        display: 'standalone',
        background_color: '#efede4',
        theme_color: '#5f7966',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      })
    )
  })
})
