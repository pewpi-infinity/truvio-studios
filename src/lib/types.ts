export interface Video {
  id: string
  title: string
  description: string
  videoUrl: string  // Empty string indicates video is stored in IndexedDB
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
  high24h?: number
  low24h?: number
  volume24h?: number
  exchanges?: ExchangePrice[]
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
}

export interface PricePoint {
  time: number
  price: number
  exchanges?: { [key: string]: number }
}
