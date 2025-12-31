import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Trash, Hash } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Video } from '@/lib/types'
import { parseHashtagsInText } from '@/lib/helpers'
import { getVideoUrl, deleteVideo as deleteVideoFromStorage } from '@/lib/videoStorage'

interface VideoCardProps {
  video: Video
  isOwner: boolean
  onDelete: (id: string) => void
  onHashtagClick: (hashtag: string) => void
  searchTerm?: string
}

export function VideoCard({ video, isOwner, onDelete, onHashtagClick, searchTerm }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string>(video.videoUrl)

  // Load video URL from IndexedDB when component mounts or video changes
  useEffect(() => {
    const loadVideoUrl = async () => {
      if (!video.videoUrl || video.videoUrl === '') {
        const url = await getVideoUrl(video.id)
        if (url) {
          setVideoUrl(url)
        }
      } else {
        setVideoUrl(video.videoUrl)
      }
    }
    
    loadVideoUrl()
    
    // Cleanup: revoke blob URL when component unmounts
    return () => {
      if (videoUrl && videoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [video.id, video.videoUrl])

  const handleDelete = async () => {
    // Delete from IndexedDB as well
    await deleteVideoFromStorage(video.id)
    onDelete(video.id)
  }

  const isHighlighted = searchTerm && (
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const descriptionParts = parseHashtagsInText(video.description)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: searchTerm && !isHighlighted ? 0.3 : 1,
        scale: searchTerm && !isHighlighted ? 0.95 : 1
      }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card className={`overflow-hidden group hover:shadow-xl transition-all hover:scale-[1.02] ${
        isHighlighted ? 'ring-2 ring-accent' : ''
      }`}>
        <div className="relative aspect-video bg-secondary">
          {showVideo ? (
            <video
              src={videoUrl}
              controls
              autoPlay={isPlaying}
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <>
              {video.thumbnailUrl ? (
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Play size={64} className="text-muted-foreground" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <Button
                size="lg"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-16 h-16 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100"
                onClick={() => {
                  setShowVideo(true)
                  setIsPlaying(true)
                }}
              >
                <Play size={32} weight="fill" />
              </Button>
            </>
          )}
        </div>

        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-semibold text-foreground leading-tight flex-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {video.title}
            </h3>
            {isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash size={18} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Video?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete "{video.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {video.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {descriptionParts.map((part, index) => 
                part.type === 'hashtag' ? (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-all hover:scale-105 mx-0.5"
                    onClick={() => onHashtagClick(part.content)}
                  >
                    {part.content}
                  </Badge>
                ) : (
                  <span key={index}>{part.content}</span>
                )
              )}
            </p>
          )}

          {video.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <Hash size={16} className="text-muted-foreground mt-1" />
              {video.hashtags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all"
                  onClick={() => onHashtagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="text-xs text-muted-foreground pt-2">
            {new Date(video.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
