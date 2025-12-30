import { motion } from 'framer-motion'
import { Link, Hash, Sparkle, TrendUp } from '@phosphor-icons/react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

export function ConnectionGuide() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-6"
    >
      <Separator className="my-12" />
      
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            How to Link Your Truvio Studio
          </h2>
          <p className="text-lg text-muted-foreground">
            Connect studios together to build a decentralized video network
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Alert className="bg-card/50 border-accent/30 hover:border-accent/60 transition-colors">
            <Hash className="text-accent" size={24} />
            <AlertTitle className="text-lg font-semibold mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Use Hashtags
            </AlertTitle>
            <AlertDescription className="text-muted-foreground leading-relaxed">
              Add hashtags like <span className="text-accent font-mono">#investing</span>, <span className="text-accent font-mono">#silver</span>, or <span className="text-accent font-mono">#business</span> to your video descriptions. When users click hashtags, they can discover other Truvio Studios using the same tags.
            </AlertDescription>
          </Alert>

          <Alert className="bg-card/50 border-accent/30 hover:border-accent/60 transition-colors">
            <Link className="text-accent" size={24} />
            <AlertTitle className="text-lg font-semibold mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Share Your Studio URL
            </AlertTitle>
            <AlertDescription className="text-muted-foreground leading-relaxed">
              Every Truvio Studio is a Spark - a standalone web app. Share your URL with others so they can discover your content and link to their own studios through the search engine integration.
            </AlertDescription>
          </Alert>

          <Alert className="bg-card/50 border-accent/30 hover:border-accent/60 transition-colors">
            <Sparkle className="text-accent" size={24} />
            <AlertTitle className="text-lg font-semibold mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Build Your Network
            </AlertTitle>
            <AlertDescription className="text-muted-foreground leading-relaxed">
              Each user creates their own Truvio Studio Spark. Connect studios together by using consistent hashtags across videos. The more studios that use related tags, the stronger the network becomes.
            </AlertDescription>
          </Alert>

          <Alert className="bg-card/50 border-accent/30 hover:border-accent/60 transition-colors">
            <TrendUp className="text-accent" size={24} />
            <AlertTitle className="text-lg font-semibold mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Monetization Potential
            </AlertTitle>
            <AlertDescription className="text-muted-foreground leading-relaxed">
              Connected studios create opportunities for ads, business partnerships, social engagement, token integration, and more. The network effect multiplies value across all linked studios.
            </AlertDescription>
          </Alert>
        </div>

        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-6 border border-accent/20">
          <h3 className="text-xl font-semibold mb-3 text-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Powered by Infinity
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Truvio Studios represents the future of decentralized content - where creators own their platforms, audiences discover through natural connections, and value flows through an interconnected ecosystem. Each Spark is independent yet part of an infinite network of possibilities.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
