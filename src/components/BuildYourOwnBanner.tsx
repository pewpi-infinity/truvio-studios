import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkle, GitBranch, Copy } from '@phosphor-icons/react'
import { toast } from 'sonner'

// Repository configuration - can be set via environment variable
const REPO_URL = import.meta.env.VITE_REPO_URL || 'https://github.com/pewpi-infinity/truvio-studios'
const REPO_OWNER_AND_NAME = REPO_URL.replace('https://github.com/', '')

export function BuildYourOwnBanner() {
  const handleCopyRepoUrl = () => {
    navigator.clipboard.writeText(REPO_URL)
    toast.success('Repository URL copied!', {
      description: 'Paste this URL to fork and build your own studio'
    })
  }

  const handleOpenSpark = () => {
    // Open GitHub Spark with this repository as a template
    window.open('https://githubnext.com/projects/spark', '_blank')
  }

  const handleForkRepo = () => {
    // Direct link to fork the repository
    window.open(`${REPO_URL}/fork`, '_blank')
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkle size={24} weight="fill" className="text-primary" />
          Build Your Own Studio
        </CardTitle>
        <CardDescription>
          Want to create your own presentation studio? Clone this template and customize it for your business!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleForkRepo} className="gap-2">
            <GitBranch size={18} />
            Fork Repository
          </Button>
          <Button onClick={handleOpenSpark} variant="outline" className="gap-2">
            <Sparkle size={18} />
            Open in Spark
          </Button>
          <Button onClick={handleCopyRepoUrl} variant="outline" className="gap-2">
            <Copy size={18} />
            Copy Repo URL
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Create your own branded studio to present your products, services, or market insights. 
          Full ownership and control over your content.
        </p>
      </CardContent>
    </Card>
  )
}
