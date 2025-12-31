import { SilverPrice, PricePoint, ChinaSilverPrice, ExchangePrice } from './types'

/**
 * Silver Price System
 * 
 * This module provides realistic silver price data simulation.
 * Prices are updated every minute and aggregated from multiple worldwide exchanges.
 * 
 * Weighted Average Algorithm:
 * - LBMA (London) - 40% weight (global benchmark)
 * - COMEX (USA) - 30% weight
 * - Shanghai Gold Exchange (China) - 20% weight
 * - Other markets - 10% weight
 * 
 * Features:
 * - Realistic price simulation with market volatility
 * - Smart caching (data <30s old is reused)
 * - Automatic updates every 60 seconds
 * - LocalStorage persistence for offline viewing
 * - Calculates 24h high/low/volume and volatility metrics
 * - Realistic market simulation with proper volatility
 */

// Exchange weights for aggregation
const EXCHANGE_WEIGHTS = {
  LBMA: 0.40,    // London - Global benchmark
  COMEX: 0.30,   // USA - Major futures market
  SHANGHAI: 0.20, // China - Shanghai Gold Exchange
  OTHER: 0.10    // Other markets
}

// Cache configuration
const CACHE_DURATION_MS = 30000 // 30 seconds
const CACHE_KEY_PREFIX = 'truvio_silver_'
const STORAGE_KEY_PRICE = CACHE_KEY_PREFIX + 'price'
const STORAGE_KEY_CHINA = CACHE_KEY_PREFIX + 'china'
const STORAGE_KEY_HISTORY = CACHE_KEY_PREFIX + 'history'

// Price simulation constants
const PRICE_FLUCTUATION_RANGE = 0.3
const MIN_SILVER_PRICE = 28
const MAX_SILVER_PRICE = 35
const MIN_CHINA_PRICE = 29
const MAX_CHINA_PRICE = 36
const CHINA_BASE_PREMIUM = 1.02
const CHINA_PREMIUM_VARIANCE = 0.01

// Base price that slowly varies to simulate real market movement
let baseGlobalPrice = 30.50 + Math.random() * 0.5
let baseChinaPrice = 31.20 + Math.random() * 0.5

// Memory cache
let priceCache: SilverPrice | null = null
let chinaPriceCache: ChinaSilverPrice | null = null

/**
 * Load cached data from localStorage
 */
function loadFromStorage<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error)
  }
  return null
}

/**
 * Save data to localStorage
 */
function saveToStorage(key: string, data: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to save to localStorage:', error)
  }
}

/**
 * Check if cached data is still fresh
 */
function isCacheFresh(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION_MS
}

/**
 * Simulate exchange-specific prices with realistic variance
 */
function simulateExchangePrices(basePrice: number): ExchangePrice[] {
  const now = Date.now()
  
  return [
    {
      exchange: 'LBMA',
      price: basePrice * (1 + (Math.random() - 0.5) * 0.001),
      weight: EXCHANGE_WEIGHTS.LBMA,
      active: true,
      timestamp: now
    },
    {
      exchange: 'COMEX',
      price: basePrice * (1 + (Math.random() - 0.5) * 0.002),
      weight: EXCHANGE_WEIGHTS.COMEX,
      active: true,
      timestamp: now
    },
    {
      exchange: 'SHANGHAI',
      price: basePrice * (1.02 + (Math.random() - 0.5) * 0.003),
      weight: EXCHANGE_WEIGHTS.SHANGHAI,
      active: true,
      timestamp: now
    },
    {
      exchange: 'OTHER',
      price: basePrice * (1 + (Math.random() - 0.5) * 0.0015),
      weight: EXCHANGE_WEIGHTS.OTHER,
      active: true,
      timestamp: now
    }
  ]
}

/**
 * Calculate weighted average from exchange prices
 */
function calculateWeightedAverage(exchanges: ExchangePrice[]): number {
  const activeExchanges = exchanges.filter(e => e.active)
  
  if (activeExchanges.length === 0) {
    return exchanges[0]?.price || baseGlobalPrice
  }
  
  const totalWeight = activeExchanges.reduce((sum, e) => sum + e.weight, 0)
  const weightedSum = activeExchanges.reduce((sum, e) => sum + (e.price * e.weight), 0)
  
  return weightedSum / totalWeight
}

/**
 * Calculate 24h metrics from history
 */
function calculate24hMetrics(history: PricePoint[]): { high: number, low: number, volume: number } {
  if (history.length === 0) {
    return { high: 0, low: 0, volume: 0 }
  }
  
  const prices = history.map(p => p.price)
  const high = Math.max(...prices)
  const low = Math.min(...prices)
  
  // Simulate volume based on price volatility
  const volatility = low > 0 ? (high - low) / low : 0
  const volume = Math.round(volatility * 1000000 * (1 + Math.random() * 0.5))
  
  return { high, low, volume }
}

export async function fetchSilverPrice(): Promise<SilverPrice> {
  console.log('[SilverAPI] fetchSilverPrice called - using live price simulation')
  
  // Check if cached data is still fresh
  const cachedPrice = loadFromStorage<SilverPrice>(STORAGE_KEY_PRICE)
  if (cachedPrice && isCacheFresh(cachedPrice.timestamp)) {
    console.log('[SilverAPI] Using fresh cached data', {
      age: Date.now() - cachedPrice.timestamp,
      maxAge: CACHE_DURATION_MS
    })
    priceCache = cachedPrice
    return cachedPrice
  }
  
  if (cachedPrice) {
    console.log('[SilverAPI] Cached data is stale, generating fresh simulation', {
      age: Date.now() - cachedPrice.timestamp,
      maxAge: CACHE_DURATION_MS
    })
  }
  
  // Generate realistic price data with exchange simulation
  console.log('[SilverAPI] Creating fresh simulated price data')
  const fluctuation = (Math.random() - 0.5) * PRICE_FLUCTUATION_RANGE
  baseGlobalPrice = Math.max(MIN_SILVER_PRICE, Math.min(MAX_SILVER_PRICE, baseGlobalPrice + fluctuation))
  
  const exchanges = simulateExchangePrices(baseGlobalPrice)
  const aggregatedPrice = calculateWeightedAverage(exchanges)
  
  // Load or generate history
  let history = loadFromStorage<PricePoint[]>(STORAGE_KEY_HISTORY) || []
  history = updatePriceHistory(history, aggregatedPrice)
  saveToStorage(STORAGE_KEY_HISTORY, history)
  
  const metrics = calculate24hMetrics(history)
  
  const change = priceCache ? aggregatedPrice - priceCache.price : 0.15
  const changePercent = priceCache && priceCache.price > 0 
    ? ((aggregatedPrice - priceCache.price) / priceCache.price) * 100 
    : 0.49
  
  const silverPrice: SilverPrice = {
    price: parseFloat(aggregatedPrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    timestamp: Date.now(),
    high24h: metrics.high,
    low24h: metrics.low,
    volume24h: metrics.volume,
    exchanges,
    dataSource: 'mock'
  }
  
  priceCache = silverPrice
  saveToStorage(STORAGE_KEY_PRICE, silverPrice)
  
  return silverPrice
}

/**
 * Update price history (keep last 24 hours)
 */
function updatePriceHistory(history: PricePoint[], currentPrice: number): PricePoint[] {
  const now = Date.now()
  const hourInMs = 60 * 60 * 1000
  const oneDayAgo = now - (24 * hourInMs)
  
  // Filter out old data (older than 24 hours)
  let updatedHistory = history.filter(p => p.time > oneDayAgo)
  
  // Add current price point
  updatedHistory.push({
    time: now,
    price: currentPrice
  })
  
  return updatedHistory
}

export async function fetchChinaSilverPrice(): Promise<ChinaSilverPrice> {
  // Check if cached data is still fresh
  const cachedPrice = loadFromStorage<ChinaSilverPrice>(STORAGE_KEY_CHINA)
  if (cachedPrice && isCacheFresh(cachedPrice.timestamp)) {
    chinaPriceCache = cachedPrice
    return cachedPrice
  }
  
  // Get global price to calculate premium
  const globalPrice = await fetchSilverPrice()
  
  // Generate realistic China price data with premium
  console.log('[SilverAPI] Creating fresh China price simulation')
  const fluctuation = (Math.random() - 0.5) * PRICE_FLUCTUATION_RANGE
  baseChinaPrice = Math.max(MIN_CHINA_PRICE, Math.min(MAX_CHINA_PRICE, baseChinaPrice + fluctuation))
  
  const change = chinaPriceCache ? baseChinaPrice - chinaPriceCache.usdPrice : 0.18
  const changePercent = chinaPriceCache && chinaPriceCache.usdPrice > 0 
    ? ((baseChinaPrice - chinaPriceCache.usdPrice) / chinaPriceCache.usdPrice) * 100 
    : 0.58
  
  // Calculate premium relative to global price
  const premium = ((baseChinaPrice - globalPrice.price) / globalPrice.price) * 100
  
  const chinaSilverPrice: ChinaSilverPrice = {
    usdPrice: parseFloat(baseChinaPrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    premium: parseFloat(Math.max(0, premium).toFixed(2)),
    timestamp: Date.now(),
    dataSource: 'mock'
  }
  
  chinaPriceCache = chinaSilverPrice
  saveToStorage(STORAGE_KEY_CHINA, chinaSilverPrice)
  
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
    
    // Simulate exchange-specific prices
    const exchanges = simulateExchangePrices(price)
    const exchangeData: { [key: string]: number } = {}
    exchanges.forEach(ex => {
      exchangeData[ex.exchange] = parseFloat(ex.price.toFixed(2))
    })
    
    history.push({
      time: now - (i * hourInMs),
      price: parseFloat(price.toFixed(2)),
      exchanges: exchangeData
    })
  }
  
  // Ensure last point matches current price
  history[history.length - 1].price = currentPrice
  
  return history
}
