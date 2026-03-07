import { POST } from '@/app/api/admin/videos/uploads/init/route'

const mockGetUser = vi.fn()
const mockProfileSingle = vi.fn()
const mockProfileEq = vi.fn(() => ({ single: mockProfileSingle }))
const mockProfileSelect = vi.fn(() => ({ eq: mockProfileEq }))

const mockPageSingle = vi.fn()
const mockPageEqOwner = vi.fn(() => ({ single: mockPageSingle }))
const mockPageEqId = vi.fn(() => ({ eq: mockPageEqOwner }))
const mockPageSelect = vi.fn(() => ({ eq: mockPageEqId }))

const mockJobInsertSingle = vi.fn()
const mockJobInsertSelect = vi.fn(() => ({ single: mockJobInsertSingle }))
const mockJobInsert = vi.fn(() => ({ select: mockJobInsertSelect }))

const mockJobUpdateSingle = vi.fn()
const mockJobUpdateSelect = vi.fn(() => ({ single: mockJobUpdateSingle }))
const mockJobUpdateEq = vi.fn(() => ({ select: mockJobUpdateSelect }))
const mockJobUpdate = vi.fn(() => ({ eq: mockJobUpdateEq }))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: mockGetUser },
    from: (table: string) => {
      if (table === 'profiles') return { select: mockProfileSelect }
      if (table === 'pages') return { select: mockPageSelect }
      if (table === 'video_upload_jobs') return { insert: mockJobInsert, update: mockJobUpdate }
      return { insert: vi.fn(), update: vi.fn(), select: vi.fn() }
    },
  }),
}))

vi.mock('@/lib/server/video-upload', () => ({
  isVideoTranscodeConfigured: () => true,
  getVideoTranscodeApiBaseOrThrow: () => 'https://transcode.example.com',
  getVideoTranscodeApiTokenOrThrow: () => 'token',
  videoUploadStatusSchema: { _type: 'uploading' },
}))

vi.mock('@/lib/server/admin-audit', () => ({
  logAdminAudit: vi.fn(),
}))

describe('POST /api/admin/videos/uploads/init', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockGetUser.mockReset()
    mockProfileSingle.mockReset()
    mockPageSingle.mockReset()
    mockJobInsertSingle.mockReset()
    mockJobUpdateSingle.mockReset()
    mockProfileSingle.mockResolvedValue({ data: { role: 'editor', is_active: true }, error: null })
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ uploadUrl: 'https://upload.example.com/file.mp4', uploadMethod: 'PUT' }), { status: 200 })
    )
  })

  it('returns unauthorized when no user exists', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const req = new Request('http://localhost/api/admin/videos/uploads/init', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        pageId: '550e8400-e29b-41d4-a716-446655440000',
        fileName: 'tribute.mp4',
        fileSize: 139000000,
        mimeType: 'video/mp4',
      }),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(401)
  })

  it('creates upload job and returns upload target', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockPageSingle.mockResolvedValue({ data: { id: 'page-1' } })
    mockJobInsertSingle.mockResolvedValue({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        page_id: 'page-1',
        created_by: 'user-1',
        status: 'queued',
        source_filename: 'tribute.mp4',
        source_mime: 'video/mp4',
        source_bytes: 139000000,
      },
      error: null,
    })
    mockJobUpdateSingle.mockResolvedValue({
      data: { id: '550e8400-e29b-41d4-a716-446655440000', status: 'uploading', upload_url: 'https://upload.example.com/file.mp4', upload_method: 'PUT' },
      error: null,
    })

    const req = new Request('http://localhost/api/admin/videos/uploads/init', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        pageId: '550e8400-e29b-41d4-a716-446655440000',
        fileName: 'tribute.mp4',
        fileSize: 139000000,
        mimeType: 'video/mp4',
      }),
    })
    const res = await POST(req as never)
    expect(res.status).toBe(201)
    expect(mockJobInsert).toHaveBeenCalled()
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://transcode.example.com/jobs/init',
      expect.objectContaining({ method: 'POST' })
    )
  })
})
