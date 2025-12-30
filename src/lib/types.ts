export interface Video {
  id: string
  title: string
  description: string
  videoUrl: string
  thumbnailUrl?: string
  hashtags: string[]
  createdAt: number
  ownerId: string
}

export interface SilverPrice {
  price: number
  change: number
  changePercent: number
  timestamp: number
}

export interface ChinaSilverPrice {
  usdPrice: number
  change: number
  changePercent: number
  premium: number
  timestamp: number
}

export interface PricePoint {
  time: number
  price: number
}
