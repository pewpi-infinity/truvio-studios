export interface Video {
  id: string
  title: string
  description: string
  videoUrl: string  // Path to video file in repository (e.g., 'public/videos/video-123.mp4')
  thumbnailUrl?: string  // Path to thumbnail in repository (e.g., 'public/thumbnails/video-123.png')
  hashtags: string[]
  createdAt: number
  ownerId: string
}

export interface SilverPrice {
  price: number
  change: number
  changePercent: number
  timestamp: number
  high24h?: number
  low24h?: number
  volume24h?: number
  exchanges?: ExchangePrice[]
  dataSource?: 'api' | 'cache' | 'mock'  // Track data source
}

export interface ExchangePrice {
  exchange: string
  price: number
  weight: number
  active: boolean
  timestamp: number
}

export interface ChinaSilverPrice {
  usdPrice: number
  change: number
  changePercent: number
  premium: number
  timestamp: number
  dataSource?: 'api' | 'cache' | 'mock'  // Track data source
}

export interface PricePoint {
  time: number
  price: number
  exchanges?: { [key: string]: number }
}
