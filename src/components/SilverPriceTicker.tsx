import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendUp, TrendDown, ChartLine, Circle, Warning } from '@phosphor-icons/react'
import { fetchSilverPrice } from '@/lib/silverApi'
import { SilverPrice } from '@/lib/types'
import { formatPrice, formatPriceChange } from '@/lib/helpers'

export function SilverPriceTicker() {
  const [price, setPrice] = useState<SilverPrice | null>(null)
  const [prevPrice, setPrevPrice] = useState<number | null>(null)

  useEffect(() => {
    const loadPrice = async () => {
      const data = await fetchSilverPrice()
      setPrice((prevPrice) => {
        setPrevPrice(prevPrice?.price || null)
        return data
      })
    }

    loadPrice()
    const interval = setInterval(loadPrice, 60000)

    return () => clearInterval(interval)
  }, [])

  if (!price) {
    return (
      <div className="bg-card border border-border rounded-lg px-6 py-4">
        <div className="animate-pulse flex items-center gap-4">
          <div className="h-8 w-32 bg-muted rounded"></div>
          <div className="h-6 w-24 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const isPositive = price.change >= 0
  const priceChanged = prevPrice !== null && price.price !== prevPrice
  const isSimulatedData = price.dataSource === 'mock'

  return (
    <div className="bg-gradient-to-br from-card to-secondary border border-border rounded-lg px-6 py-4 shadow-lg">
      {isSimulatedData && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
          <Warning size={16} className="text-yellow-500" weight="fill" />
          <span className="text-xs text-yellow-500 font-medium">
            Showing simulated data. Configure API keys in .env to use real market data.
          </span>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted/50 rounded-lg">
              <ChartLine className="text-accent" size={24} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-medium">Worldwide Silver Price (Aggregated)</div>
              <div className="flex items-baseline gap-2">
                <motion.div
                  key={price.price}
                  initial={priceChanged ? { scale: 1.1, color: isPositive ? '#4ade80' : '#ef4444' } : false}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.3 }}
                  className="text-3xl font-bold text-foreground"
                  style={{ fontFamily: 'Space Grotesk, sans-serif', fontVariantNumeric: 'tabular-nums' }}
                >
                  ${formatPrice(price.price)}
                </motion.div>
                <span className="text-sm text-muted-foreground">USD/oz</span>
              </div>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {isPositive ? <TrendUp size={20} weight="bold" /> : <TrendDown size={20} weight="bold" />}
            <span className="font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatPriceChange(price.change, price.changePercent)}
            </span>
          </div>
        </div>

        {/* 24h Metrics */}
        {(price.high24h || price.low24h || price.volume24h) && (
          <div className="flex gap-6 text-sm border-t border-border/50 pt-3">
            {price.high24h && (
              <div>
                <span className="text-muted-foreground">24h High: </span>
                <span className="font-semibold text-green-400">${formatPrice(price.high24h)}</span>
              </div>
            )}
            {price.low24h && (
              <div>
                <span className="text-muted-foreground">24h Low: </span>
                <span className="font-semibold text-red-400">${formatPrice(price.low24h)}</span>
              </div>
            )}
            {price.volume24h && (
              <div>
                <span className="text-muted-foreground">Volume: </span>
                <span className="font-semibold">{(price.volume24h / 1000000).toFixed(2)}M oz</span>
              </div>
            )}
          </div>
        )}

        {/* Active Exchanges */}
        {price.exchanges && price.exchanges.length > 0 && (
          <div className="flex gap-4 border-t border-border/50 pt-3">
            <div className="text-xs text-muted-foreground">Active Exchanges:</div>
            <div className="flex gap-3 flex-wrap">
              {price.exchanges.map((exchange) => (
                <div key={exchange.exchange} className="flex items-center gap-1.5">
                  <Circle 
                    size={8} 
                    weight="fill" 
                    className={exchange.active ? 'text-green-400' : 'text-muted-foreground'} 
                  />
                  <span className="text-xs font-medium">
                    {exchange.exchange}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    (${formatPrice(exchange.price)})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
