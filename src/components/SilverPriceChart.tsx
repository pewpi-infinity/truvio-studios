import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'
import { Eye, EyeSlash, Warning } from '@phosphor-icons/react'
import { fetchSilverPrice, generateMockPriceHistory } from '@/lib/silverApi'
import { PricePoint, SilverPrice } from '@/lib/types'
import { Button } from '@/components/ui/button'

export function SilverPriceChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<PricePoint[]>([])
  const [showExchanges, setShowExchanges] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<SilverPrice | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadData = async () => {
      const priceData = await fetchSilverPrice()
      setCurrentPrice(priceData)
      const history = generateMockPriceHistory(priceData.price, 24)
      setData(history)
    }

    loadData()
    // Refresh chart data every minute to keep it current
    const interval = setInterval(loadData, 60000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!svgRef.current || data.length === 0 || !containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = 300
    const margin = { top: 20, right: 30, bottom: 40, left: 60 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.time) as [number, number])
      .range([0, innerWidth])

    // Calculate price range
    const allPrices: number[] = []
    data.forEach(d => {
      allPrices.push(d.price)
      if (showExchanges && d.exchanges) {
        allPrices.push(...Object.values(d.exchanges))
      }
    })

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(allPrices)! * 0.998,
        d3.max(allPrices)! * 1.002
      ])
      .range([innerHeight, 0])

    const line = d3.line<PricePoint>()
      .x(d => xScale(d.time))
      .y(d => yScale(d.price))
      .curve(d3.curveMonotoneX)

    const area = d3.area<PricePoint>()
      .x(d => xScale(d.time))
      .y0(innerHeight)
      .y1(d => yScale(d.price))
      .curve(d3.curveMonotoneX)

    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%')

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'oklch(0.72 0.15 210)')
      .attr('stop-opacity', 0.3)

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'oklch(0.72 0.15 210)')
      .attr('stop-opacity', 0)

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#area-gradient)')
      .attr('d', area)

    const path = g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'oklch(0.72 0.15 210)')
      .attr('stroke-width', 2.5)
      .attr('d', line)

    const totalLength = path.node()?.getTotalLength() || 0
    path
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeQuadInOut)
      .attr('stroke-dashoffset', 0)

    // Draw individual exchange lines if enabled
    if (showExchanges && data[0]?.exchanges) {
      const exchanges = Object.keys(data[0].exchanges)
      const colors = ['#f59e0b', '#8b5cf6', '#ec4899', '#10b981']
      
      exchanges.forEach((exchange, idx) => {
        const exchangeLine = d3.line<PricePoint>()
          .x(d => xScale(d.time))
          .y(d => yScale(d.exchanges?.[exchange] || d.price))
          .curve(d3.curveMonotoneX)
        
        g.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', colors[idx % colors.length])
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '4,4')
          .attr('opacity', 0.6)
          .attr('d', exchangeLine)
      })
    }

    // Add interactive tooltip
    const tooltip = d3.select(tooltipRef.current)
    
    const focus = g.append('g')
      .style('display', 'none')
    
    focus.append('circle')
      .attr('r', 4)
      .attr('fill', 'oklch(0.72 0.15 210)')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
    
    const overlay = g.append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('opacity', 0)
      .on('mouseover', () => {
        focus.style('display', null)
        tooltip.style('display', 'block')
      })
      .on('mouseout', () => {
        focus.style('display', 'none')
        tooltip.style('display', 'none')
      })
      .on('mousemove', (event) => {
        const [mouseX] = d3.pointer(event)
        const x0 = xScale.invert(mouseX)
    const bisect = d3.bisector<PricePoint, number>((d) => d.time).left
        const idx = bisect(data, x0.getTime())
        const d = data[idx]
        
        if (d) {
          focus.attr('transform', `translate(${xScale(d.time)},${yScale(d.price)})`)
          
          let tooltipHTML = `
            <div class="font-semibold">$${d.price.toFixed(2)}</div>
            <div class="text-xs text-muted-foreground">${d3.timeFormat('%H:%M')(new Date(d.time))}</div>
          `
          
          if (showExchanges && d.exchanges) {
            tooltipHTML += '<div class="mt-2 space-y-1">'
            Object.entries(d.exchanges).forEach(([exchange, price]) => {
              tooltipHTML += `<div class="text-xs"><span class="font-medium">${exchange}:</span> $${price.toFixed(2)}</div>`
            })
            tooltipHTML += '</div>'
          }
          
          tooltip
            .html(tooltipHTML)
            .style('left', `${event.pageX + 10}px`)
            .style('top', `${event.pageY - 10}px`)
        }
      })

    const xAxis = d3.axisBottom(xScale)
      .ticks(6)
      .tickFormat((d) => d3.timeFormat('%H:%M')(d as Date))

    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `$${d.toFixed(2)}`)

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', 'oklch(0.65 0.01 260)')
      .selectAll('text')
      .style('font-size', '11px')

    g.append('g')
      .call(yAxis)
      .attr('color', 'oklch(0.65 0.01 260)')
      .selectAll('text')
      .style('font-size', '11px')

    g.selectAll('.domain')
      .attr('stroke', 'oklch(0.3 0.02 260)')

    g.selectAll('.tick line')
      .attr('stroke', 'oklch(0.3 0.02 260)')

    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
      )
      .call(g => g.select('.domain').remove())

  }, [data, showExchanges])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-lg p-6 shadow-lg"
      ref={containerRef}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          24-Hour Price Chart
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExchanges(!showExchanges)}
          className="flex items-center gap-2"
        >
          {showExchanges ? <EyeSlash size={16} /> : <Eye size={16} />}
          {showExchanges ? 'Hide' : 'Show'} Exchanges
        </Button>
      </div>
      {currentPrice?.dataSource === 'mock' && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
          <Warning size={16} className="text-yellow-500" weight="fill" />
          <span className="text-xs text-yellow-500 font-medium">
            Chart shows simulated data. Configure API keys to display real market data.
          </span>
        </div>
      )}
      <svg ref={svgRef} className="w-full"></svg>
      <div 
        ref={tooltipRef}
        className="absolute bg-card border border-border rounded-lg px-3 py-2 shadow-lg pointer-events-none z-10"
        style={{ display: 'none' }}
      />
    </motion.div>
  )
}
