import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendUp, TrendDown, Globe } from '@phosphor-icons/react'
import { fetchChinaSilverPrice } from '@/lib/silverApi'
import { ChinaSilverPrice } from '@/lib/types'
import { formatPrice, formatPriceChange } from '@/lib/helpers'

export function ChinaSilverPriceTicker() {
  const [price, setPrice] = useState<ChinaSilverPrice | null>(null)
  const [prevPrice, setPrevPrice] = useState<number | null>(null)

  useEffect(() => {
    const loadPrice = async () => {
      const data = await fetchChinaSilverPrice()
      setPrice((prevPrice) => {
        setPrevPrice(prevPrice?.usdPrice || null)
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
  const priceChanged = prevPrice !== null && price.usdPrice !== prevPrice

  return (
    <div className="bg-gradient-to-br from-card to-secondary border border-border rounded-lg px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Globe className="text-orange-400" size={24} weight="fill" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground font-medium">China Silver Price (USD)</div>
            <div className="flex items-baseline gap-2">
              <motion.div
                key={price.usdPrice}
                initial={priceChanged ? { scale: 1.1, color: isPositive ? '#4ade80' : '#ef4444' } : false}
                animate={{ scale: 1, color: 'inherit' }}
                transition={{ duration: 0.3 }}
                className="text-3xl font-bold text-foreground"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontVariantNumeric: 'tabular-nums' }}
              >
                ${formatPrice(price.usdPrice)}
              </motion.div>
              <span className="text-sm text-muted-foreground">USD/oz</span>
            </div>
            <div className="text-xs text-orange-400 mt-1">
              +{price.premium.toFixed(2)}% premium vs global
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
    </div>
  )
}
