export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w]+/g
  const matches = text.match(hashtagRegex)
  return matches ? matches.map(tag => tag.toLowerCase()) : []
}

export function parseHashtagsInText(text: string): Array<{ type: 'text' | 'hashtag', content: string }> {
  const parts: Array<{ type: 'text' | 'hashtag', content: string }> = []
  const hashtagRegex = /(#[\w]+)/g
  
  let lastIndex = 0
  let match
  
  while ((match = hashtagRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, match.index) })
    }
    parts.push({ type: 'hashtag', content: match[0] })
    lastIndex = match.index + match[0].length
  }
  
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex) })
  }
  
  return parts.length > 0 ? parts : [{ type: 'text', content: text }]
}

export function createVideoThumbnail(videoFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    
    video.preload = 'metadata'
    video.muted = true
    
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1, video.duration / 2)
    }
    
    video.onseeked = () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context?.drawImage(video, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
      URL.revokeObjectURL(video.src)
    }
    
    video.onerror = () => {
      reject(new Error('Failed to load video'))
      URL.revokeObjectURL(video.src)
    }
    
    video.src = URL.createObjectURL(videoFile)
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function formatPrice(price: number): string {
  return price.toFixed(2)
}

export function formatPriceChange(change: number, changePercent: number): string {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`
}
