import type { Component } from 'vue'

export interface BaseChartProps<T extends Record<string, any>> {
  /**
   * Data for the chart
   */
  data: T[]
  /**
   * Sets the name of the key containing the categorical data.
   */
  index: keyof T
  /**
   * Sets the name of the keys containing the quantitative chart values.
   */
  categories: string[]
  /**
   * Controls the colors of the chart.
   */
  colors?: string[]
  /**
   * Controls the margin of the chart.
   */
  margin?: { top: number; right: number; bottom: number; left: number }
  /**
   * Controls the visibility of the x-axis.
   * @default true
   */
  showXAxis?: boolean
  /**
   * Controls the visibility of the y-axis.
   * @default true
   */
  showYAxis?: boolean
  /**
   * Controls the visibility of the tooltip.
   * @default true
   */
  showTooltip?: boolean
  /**
   * Controls the visibility of the legend.
   * @default true
   */
  showLegend?: boolean
  /**
   * Controls the visibility of the grid lines.
   * @default true
   */
  showGridLine?: boolean
  /**
   * Controls the opacity of the filtered items.
   * @default 0.2
   */
  filterOpacity?: number
  /**
   * Controls the formatting for the x-axis.
   */
  xFormatter?: (tick: number, i?: number, ticks?: number[]) => string
  /**
   * Controls the formatting for the y-axis.
   */
  yFormatter?: (tick: number, i?: number, ticks?: number[]) => string
}
