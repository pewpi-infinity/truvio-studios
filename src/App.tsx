import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CloudArrowUp, MagnifyingGlass, Sparkle } from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/sonner'
import { SilverPriceTicker } from '@/components/SilverPriceTicker'
import { SilverPriceChart } from '@/components/SilverPriceChart'
import { VideoUploadDialog } from '@/components/VideoUploadDialog'
import { VideoCard } from '@/components/VideoCard'
import { EmptyState } from '@/components/EmptyState'
import { ConnectionGuide } from '@/components/ConnectionGuide'
import { Video } from '@/lib/types'
import { toast } from 'sonner'

function App() {
  const [videos, setVideos] = useKV<Video[]>('truvio-videos', [])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await window.spark.user()
        setUserId(user?.id?.toString() || 'anonymous-user')
      } catch (error) {
        setUserId('anonymous-user')
      }
    }
    loadUser()
  }, [])

  const handleUpload = (video: Video) => {
    setVideos((currentVideos) => [...(currentVideos || []), video])
  }

  const handleDelete = (videoId: string) => {
    setVideos((currentVideos) => (currentVideos || []).filter(v => v.id !== videoId))
    toast.success('Video deleted')
  }

  const handleHashtagClick = (hashtag: string) => {
    const searchValue = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag
    setSearchTerm(searchValue)
    toast.info(`Searching for: ${hashtag}`, {
      description: 'In a connected network, this would search across all Truvio Studios'
    })
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const videoList = videos || []
  const filteredVideos = searchTerm
    ? videoList.filter(video => 
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : videoList

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.45_0.12_210_/_0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,oklch(0.72_0.15_210_/_0.1),transparent_50%)]" />
        
        <div className="relative">
          <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-2">
                    <Sparkle size={32} className="text-white" weight="fill" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent" style={{ fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.02em' }}>
                      Truvio Studios
                    </h1>
                    <p className="text-sm text-muted-foreground">Powered by Infinity</p>
                  </div>
                </motion.div>

                <Button onClick={() => setUploadDialogOpen(true)} size="lg">
                  <CloudArrowUp size={20} />
                  Upload Video
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative"
              >
                <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search videos by title, description, or hashtags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-card border-border"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    Clear
                  </Button>
                )}
              </motion.div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SilverPriceTicker />
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {searchTerm ? `Search Results (${filteredVideos.length})` : `Your Videos (${videoList.length})`}
                  </h2>
                </div>

                {videoList.length === 0 ? (
                  <EmptyState onUploadClick={() => setUploadDialogOpen(true)} />
                ) : (
                  <div className="grid gap-6">
                    {filteredVideos.length === 0 && searchTerm ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No videos found for "{searchTerm}"</p>
                        <Button variant="outline" onClick={() => setSearchTerm('')} className="mt-4">
                          Clear Search
                        </Button>
                      </div>
                    ) : (
                      filteredVideos.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                          isOwner={video.ownerId === userId}
                          onDelete={handleDelete}
                          onHashtagClick={handleHashtagClick}
                          searchTerm={searchTerm}
                        />
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <SilverPriceChart />
              </div>
            </div>

            <ConnectionGuide />
          </main>

          <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-16">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">
                  <span className="font-semibold text-foreground">Truvio Studios</span> - Decentralized Video Platform
                </p>
                <p>Connect your content. Build your network. Own your studio.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <VideoUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUpload}
        userId={userId}
      />

      <Toaster position="bottom-right" />
    </div>
  )
}

export default App