export type CloudinaryTransformOptions = {
  width?: number
  quality?: 'auto' | 'auto:good' | number
  format?: 'auto' | 'webp' | 'jpg' | 'png' | 'mp4'
  crop?: 'fill' | 'limit' | 'scale'
}

export function buildCloudinaryUrl(
  publicId: string,
  options: CloudinaryTransformOptions = {},
  resourceType: 'image' | 'video' = 'image'
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName || !publicId) {
    return ''
  }

  const transforms: string[] = []

  if (options.crop) transforms.push(`c_${options.crop}`)
  if (options.width) transforms.push(`w_${options.width}`)
  if (options.quality !== undefined) transforms.push(`q_${options.quality}`)
  if (options.format) transforms.push(`f_${options.format}`)

  const transformSegment = transforms.length > 0 ? `${transforms.join(',')}/` : ''
  return `https://res.cloudinary.com/${cloudName}/${resourceType}/upload/${transformSegment}${publicId}`
}

export function buildCloudinaryVideoUrl(publicId: string, options: CloudinaryTransformOptions = {}): string {
  return buildCloudinaryUrl(publicId, options, 'video')
}

export function normalizeCloudinaryPublicId(publicIdOrUrl: string): string {
  if (!publicIdOrUrl) return ''

  if (!publicIdOrUrl.includes('/image/upload/') && !publicIdOrUrl.includes('/video/upload/')) {
    return publicIdOrUrl
  }

  const marker = publicIdOrUrl.includes('/video/upload/') ? '/video/upload/' : '/image/upload/'
  const [, tail] = publicIdOrUrl.split(marker)
  const cleanTail = tail.replace(/^v\d+\//, '')
  return cleanTail
}
