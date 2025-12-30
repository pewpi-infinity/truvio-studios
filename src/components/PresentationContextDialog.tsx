import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface PresentationContextDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentContext: string
  onSave: (context: string) => void
}

export function PresentationContextDialog({ open, onOpenChange, currentContext, onSave }: PresentationContextDialogProps) {
  const [context, setContext] = useState(currentContext)

  const handleSave = () => {
    if (context.trim()) {
      onSave(context.trim())
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Presentation Context</DialogTitle>
          <DialogDescription>
            Customize what you're presenting. This changes the market data and theme of your studio.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="context">Presentation Topic</Label>
            <Input
              id="context"
              placeholder="e.g., Silver, Gold, Real Estate, Stocks, etc."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <p className="text-sm text-muted-foreground">
              Enter the main topic or commodity you're presenting about.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Context
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
