import { SilverPrice, PricePoint, ChinaSilverPrice } from './types'

// Configuration for API usage
// Set USE_REAL_API to true and configure API_KEY to use real data
// IMPORTANT: Use environment variables in production to avoid exposing API keys
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API === 'true' || false
const API_KEY = import.meta.env.VITE_API_KEY || '' // Set via environment variable

// Price simulation constants
const PRICE_FLUCTUATION_RANGE = 0.3
const MIN_SILVER_PRICE = 28
const MAX_SILVER_PRICE = 35
const MIN_CHINA_PRICE = 29
const MAX_CHINA_PRICE = 36
const CHINA_BASE_PREMIUM = 1.02
const CHINA_PREMIUM_VARIANCE = 0.01

// Cache for storing the last successful price data
let priceCache: SilverPrice | null = null
let chinaPriceCache: ChinaSilverPrice | null = null

// Base price that slowly varies to simulate real market movement
let baseGlobalPrice = 30.50 + Math.random() * 0.5
let baseChinaPrice = 31.20 + Math.random() * 0.5

export async function fetchSilverPrice(): Promise<SilverPrice> {
  if (USE_REAL_API && API_KEY) {
    try {
      // Example using metals-api.com - adjust endpoint based on your chosen provider
      const response = await fetch(
        `https://metals-api.com/api/latest?access_key=${API_KEY}&base=USD&symbols=XAG`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Calculate change from cached price
      const price = data.rates?.USDXAG || data.price || 0
      const change = priceCache ? price - priceCache.price : 0
      const changePercent = priceCache && priceCache.price > 0 
        ? ((price - priceCache.price) / priceCache.price) * 100 
        : 0
      
      const silverPrice: SilverPrice = {
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        timestamp: Date.now()
      }
      
      priceCache = silverPrice
      return silverPrice
    } catch (error) {
      console.error('Failed to fetch silver price from API:', error)
      // Fall through to mock data on error
    }
  }
  
  // Generate realistic mock data with small random fluctuations
  const fluctuation = (Math.random() - 0.5) * PRICE_FLUCTUATION_RANGE
  baseGlobalPrice = Math.max(MIN_SILVER_PRICE, Math.min(MAX_SILVER_PRICE, baseGlobalPrice + fluctuation))
  
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

export async function fetchChinaSilverPrice(): Promise<ChinaSilverPrice> {
  if (USE_REAL_API && API_KEY) {
    try {
      // Fetch silver price in USD
      const response = await fetch(
        `https://metals-api.com/api/latest?access_key=${API_KEY}&base=USD&symbols=XAG`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const basePrice = data.rates?.USDXAG || data.price || 0
      
      // Shanghai silver typically trades at a small premium to global markets
      // Adding a realistic 1-3% premium for China market
      const chinaPremium = CHINA_BASE_PREMIUM + (Math.random() * CHINA_PREMIUM_VARIANCE)
      const chinaUsdPrice = basePrice * chinaPremium
      
      const change = chinaPriceCache ? chinaUsdPrice - chinaPriceCache.usdPrice : 0
      const changePercent = chinaPriceCache && chinaPriceCache.usdPrice > 0 
        ? ((chinaUsdPrice - chinaPriceCache.usdPrice) / chinaPriceCache.usdPrice) * 100 
        : 0
      
      const chinaSilverPrice: ChinaSilverPrice = {
        usdPrice: parseFloat(chinaUsdPrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        premium: parseFloat(((chinaPremium - 1) * 100).toFixed(2)),
        timestamp: Date.now()
      }
      
      chinaPriceCache = chinaSilverPrice
      return chinaSilverPrice
    } catch (error) {
      console.error('Failed to fetch China silver price from API:', error)
      // Fall through to mock data on error
    }
  }
  
  // Generate realistic mock data with small random fluctuations
  // China typically has 2-3% premium
  const fluctuation = (Math.random() - 0.5) * PRICE_FLUCTUATION_RANGE
  baseChinaPrice = Math.max(MIN_CHINA_PRICE, Math.min(MAX_CHINA_PRICE, baseChinaPrice + fluctuation))
  
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
