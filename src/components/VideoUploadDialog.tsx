import { useState } from 'react'
import { motion } from 'framer-motion'
import { CloudArrowUp, X } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { extractHashtags, createVideoThumbnail, formatFileSize } from '@/lib/helpers'
import { Video } from '@/lib/types'
import { storeVideo } from '@/lib/videoStorage'
import { toast } from 'sonner'

interface VideoUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (video: Video) => void
  userId: string
}

export function VideoUploadDialog({ open, onOpenChange, onUpload, userId }: VideoUploadDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file')
      return
    }

    if (file.size > 500 * 1024 * 1024) {
      toast.error('Video file must be less than 500MB')
      return
    }

    setVideoFile(file)
    toast.success(`Video selected: ${file.name}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    if (!videoFile) {
      toast.error('Please select a video file')
      return
    }

    setUploading(true)

    try {
      const thumbnailUrl = await createVideoThumbnail(videoFile)
      const hashtags = extractHashtags(description)
      const videoId = `video-${Date.now()}`
      
      // Store video and thumbnail in the repository
      const { videoPath, thumbnailPath } = await storeVideo(videoId, videoFile, thumbnailUrl, {
        title: title.trim(),
        description: description.trim(),
        hashtags,
        createdAt: Date.now(),
        ownerId: userId
      })

      // Create video metadata to store in KV
      const newVideo: Video = {
        id: videoId,
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoPath, // Path to video in repository
        thumbnailUrl: thumbnailPath, // Path to thumbnail in repository
        hashtags,
        createdAt: Date.now(),
        ownerId: userId
      }

      onUpload(newVideo)
      toast.success('Video uploaded and committed to repository!')
      
      setTitle('')
      setDescription('')
      setVideoFile(null)
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to upload video: ' + (error as Error).message)
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Upload Video
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive
                ? 'border-accent bg-accent/10 scale-[1.02]'
                : 'border-border hover:border-accent/50'
            }`}
          >
            <input
              type="file"
              accept="video/*"
              onChange={handleFileInput}
              className="hidden"
              id="video-upload"
            />
            
            <label htmlFor="video-upload" className="cursor-pointer">
              <motion.div
                animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <CloudArrowUp size={48} className="mx-auto mb-4 text-accent" />
              </motion.div>
              
              {videoFile ? (
                <div className="space-y-2">
                  <p className="text-foreground font-medium">{videoFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(videoFile.size)}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      setVideoFile(null)
                    }}
                  >
                    <X size={16} /> Remove
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-foreground font-medium mb-2">
                    Drop your video here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports MP4, MOV, AVI, WebM • Max 500MB
                  </p>
                </div>
              )}
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Video Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description & Hashtags</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your video and add hashtags like #investing #silver #finance..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Use hashtags to connect your video with other Truvio Studios
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading || !videoFile || !title.trim()}>
              {uploading ? 'Uploading...' : 'Upload Video'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
