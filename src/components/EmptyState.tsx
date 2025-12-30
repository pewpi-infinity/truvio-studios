import { motion } from 'framer-motion'
import { Video, CloudArrowUp } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EmptyStateProps {
  onUploadClick: () => void
}

export function EmptyState({ onUploadClick }: EmptyStateProps) {
  const exampleHashtags = ['#investing', '#silver', '#finance', '#business', '#crypto', '#trading']

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-full p-8 mb-6">
        <Video size={80} className="text-accent" weight="duotone" />
      </div>
      
      <h2 className="text-3xl font-bold text-foreground mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        Welcome to Your Studio
      </h2>
      
      <p className="text-lg text-muted-foreground text-center max-w-md mb-8">
        Start building your video library. Upload content, add hashtags, and connect with other studios.
      </p>

      <Button size="lg" onClick={onUploadClick} className="mb-8">
        <CloudArrowUp size={24} />
        Upload Your First Video
      </Button>

      <div className="space-y-3 text-center">
        <p className="text-sm text-muted-foreground">Popular hashtags to get started:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {exampleHashtags.map((tag, index) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge variant="secondary" className="text-sm">
                {tag}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
