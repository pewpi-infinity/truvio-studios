import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { motion } from 'framer-motion'
import { fetchSilverPrice, generateMockPriceHistory } from '@/lib/silverApi'
import { PricePoint } from '@/lib/types'

export function SilverPriceChart() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [data, setData] = useState<PricePoint[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadData = async () => {
      const currentPrice = await fetchSilverPrice()
      const history = generateMockPriceHistory(currentPrice.price, 24)
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

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.price)! * 0.998,
        d3.max(data, d => d.price)! * 1.002
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

  }, [data])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-lg p-6 shadow-lg"
      ref={containerRef}
    >
      <h3 className="text-xl font-semibold mb-4 text-foreground" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        24-Hour Price Chart
      </h3>
      <svg ref={svgRef} className="w-full"></svg>
    </motion.div>
  )
}
