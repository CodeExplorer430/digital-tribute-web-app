import { POST } from '@/app/api/internal/video-transcode/callback/route'

const mockEq = vi.fn()
const mockUpdate = vi.fn(() => ({ eq: mockEq }))
const mockFrom = vi.fn(() => ({ update: mockUpdate }))
const mockServiceClient = { from: mockFrom }

vi.mock('@/lib/supabase/service', () => ({
  createServiceRoleClient: () => mockServiceClient,
}))

describe('POST /api/internal/video-transcode/callback', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    process.env.VIDEO_TRANSCODE_CALLBACK_TOKEN = 'callback-secret'
    mockEq.mockReset()
    mockUpdate.mockClear()
    mockEq.mockResolvedValue({ error: null })
  })

  it('rejects invalid callback token', async () => {
    const req = new Request('http://localhost/api/internal/video-transcode/callback', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer wrong' },
      body: JSON.stringify({
        jobId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'processing',
      }),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(403)
  })

  it('updates job on completed callback', async () => {
    const req = new Request('http://localhost/api/internal/video-transcode/callback', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: 'Bearer callback-secret' },
      body: JSON.stringify({
        jobId: '550e8400-e29b-41d4-a716-446655440000',
        status: 'completed',
        outputPublicId: 'everlume/page/video-1',
        outputUrl: 'https://res.cloudinary.com/demo/video/upload/v1/everlume/page/video-1.mp4',
        outputBytes: 99000000,
      }),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(200)
    expect(mockFrom).toHaveBeenCalledWith('video_upload_jobs')
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'completed',
        output_public_id: 'everlume/page/video-1',
      })
    )
  })
})
