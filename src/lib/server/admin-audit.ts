import { AdminSupabase } from '@/lib/server/admin-auth'

type AuditAction =
  | 'page.create'
  | 'page.update'
  | 'photo.create'
  | 'photo.update'
  | 'photo.delete'
  | 'video.create'
  | 'video.delete'
  | 'video.upload_init'
  | 'video.upload_start'
  | 'video.upload_attach'
  | 'timeline.create'
  | 'timeline.delete'
  | 'guestbook.approve'
  | 'guestbook.unapprove'
  | 'guestbook.delete'
  | 'redirect.create'
  | 'redirect.update'
  | 'redirect.delete'
  | 'user.create'
  | 'user.update'
  | 'user.deactivate'
  | 'site_settings.update'

type LogAdminAuditInput = {
  actorId: string
  action: AuditAction
  entity: 'page' | 'photo' | 'video' | 'video_upload' | 'timeline' | 'guestbook' | 'redirect' | 'user' | 'site_settings'
  entityId: string
  metadata?: Record<string, unknown>
}

export async function logAdminAudit(supabase: AdminSupabase, input: LogAdminAuditInput) {
  const { actorId, action, entity, entityId, metadata } = input
  try {
    await supabase.from('admin_audit_logs').insert({
      actor_id: actorId,
      action,
      entity,
      entity_id: entityId,
      metadata: metadata ?? {},
    })
  } catch {
    // Do not fail product flows if audit logging is unavailable.
  }
}
