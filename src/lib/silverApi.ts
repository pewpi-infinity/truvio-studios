import { SilverPrice, PricePoint } from './types'

export async function fetchSilverPrice(): Promise<SilverPrice> {
  try {
    const response = await fetch('https://api.metals.live/v1/spot/silver')
    const data = await response.json()
    
    return {
      price: data.price || 0,
      change: data.change || 0,
      changePercent: data.changePercent || 0,
      timestamp: Date.now()
    }
  } catch (error) {
    console.error('Failed to fetch silver price:', error)
    return {
      price: 24.50,
      change: 0.15,
      changePercent: 0.62,
      timestamp: Date.now()
    }
  }
}

export function generateMockPriceHistory(currentPrice: number, points: number = 24): PricePoint[] {
  const history: PricePoint[] = []
  const now = Date.now()
  const hourInMs = 60 * 60 * 1000
  
  let price = currentPrice - (Math.random() * 2 - 1)
  
  for (let i = points - 1; i >= 0; i--) {
    const variation = (Math.random() - 0.5) * 0.5
    price = Math.max(price + variation, currentPrice * 0.95)
    price = Math.min(price, currentPrice * 1.05)
    
    history.push({
      time: now - (i * hourInMs),
      price: parseFloat(price.toFixed(2))
    })
  }
  
  history[history.length - 1].price = currentPrice
  
  return history
}
