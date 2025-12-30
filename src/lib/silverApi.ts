import { SilverPrice, PricePoint, ChinaSilverPrice } from './types'

// Cache for storing the last successful price data
let priceCache: SilverPrice | null = null
let chinaPriceCache: ChinaSilverPrice | null = null

// Base price that slowly varies to simulate real market movement
let baseGlobalPrice = 30.50 + Math.random() * 0.5
let baseChinaPrice = 31.20 + Math.random() * 0.5

export async function fetchSilverPrice(): Promise<SilverPrice> {
  try {
    // Try to fetch from a real API first (user can configure their own API key in production)
    // For now, this will fall through to mock data
    throw new Error('Using mock data - configure API key for real data')
  } catch (error) {
    // Generate realistic mock data with small random fluctuations
    const fluctuation = (Math.random() - 0.5) * 0.3
    baseGlobalPrice = Math.max(28, Math.min(35, baseGlobalPrice + fluctuation))
    
    const change = priceCache ? baseGlobalPrice - priceCache.price : 0.15
    const changePercent = priceCache && priceCache.price > 0 
      ? ((baseGlobalPrice - priceCache.price) / priceCache.price) * 100 
      : 0.49
    
    const silverPrice: SilverPrice = {
      price: parseFloat(baseGlobalPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      timestamp: Date.now()
    }
    
    // Update cache
    priceCache = silverPrice
    
    return silverPrice
  }
}

export async function fetchChinaSilverPrice(): Promise<ChinaSilverPrice> {
  try {
    // Try to fetch from a real API first (user can configure their own API key in production)
    throw new Error('Using mock data - configure API key for real data')
  } catch (error) {
    // Generate realistic mock data with small random fluctuations
    // China typically has 2-3% premium
    const fluctuation = (Math.random() - 0.5) * 0.3
    baseChinaPrice = Math.max(29, Math.min(36, baseChinaPrice + fluctuation))
    
    const change = chinaPriceCache ? baseChinaPrice - chinaPriceCache.usdPrice : 0.18
    const changePercent = chinaPriceCache && chinaPriceCache.usdPrice > 0 
      ? ((baseChinaPrice - chinaPriceCache.usdPrice) / chinaPriceCache.usdPrice) * 100 
      : 0.58
    
    // Calculate premium relative to global price
    const globalPrice = priceCache?.price || baseGlobalPrice
    const premium = ((baseChinaPrice - globalPrice) / globalPrice) * 100
    
    const chinaSilverPrice: ChinaSilverPrice = {
      usdPrice: parseFloat(baseChinaPrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      premium: parseFloat(Math.max(0, premium).toFixed(2)),
      timestamp: Date.now()
    }
    
    // Update cache
    chinaPriceCache = chinaSilverPrice
    
    return chinaSilverPrice
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
