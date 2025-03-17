<script setup lang="ts" generic="T extends Record<string, any>">
import type { BaseChartProps } from '@/components/ui/chart/interface'
import { cn } from '@/lib/utils'
import { ChartCrosshair, ChartLegend, defaultColors } from '@/components/ui/chart'
import { type BulletLegendItemInterface } from '@unovis/ts'
import { Axis, GroupedBar } from '@unovis/ts'
import { VisAxis, VisGroupedBar as VisBar, VisXYContainer } from '@unovis/vue'
import { useMounted } from '@vueuse/core'
import { type Component, computed, ref } from 'vue'

// Simple hook to generate unique IDs
function useId(): string {
  return `id-${Math.random().toString(36).substring(2, 9)}`;
}

const props = withDefaults(defineProps<BaseChartProps<T> & {
  /**
   * Render custom tooltip component.
   */
  customTooltip?: Component
  /**
   * Controls the visibility of gradient.
   * @default true
   */
  showGradient?: boolean
  /**
   * Controls the corner radius of the bars.
   * @default 4
   */
  cornerRadius?: number
  /**
   * Controls the padding between bars.
   * @default 0.2
   */
  padding?: number
}>(), {
  filterOpacity: 0.2,
  margin: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  showXAxis: true,
  showYAxis: true,
  showTooltip: true,
  showLegend: true,
  showGridLine: true,
  showGradient: true,
  cornerRadius: 4,
  padding: 0.2,
})

const emits = defineEmits<{
  legendItemClick: [d: BulletLegendItemInterface, i: number]
}>()

type KeyOfT = Extract<keyof T, string>
type Data = T

const chartRef = ref<string>(useId())

const index = computed<KeyOfT>(() => props.index as KeyOfT)
const colors = computed<string[]>(() => props.colors?.length ? props.colors : defaultColors(props.categories.length))

const legendItems = ref<BulletLegendItemInterface[]>(props.categories.map((category, i) => ({
  name: category,
  color: colors.value[i],
  inactive: false,
})))

const isMounted = useMounted()

function handleLegendItemClick(d: BulletLegendItemInterface, i: number): void {
  emits('legendItemClick', d, i)
}
</script>

<template>
  <div :class="cn('w-full h-[400px] flex flex-col items-end', $attrs.class ?? '')">
    <ChartLegend v-if="showLegend" v-model:items="legendItems" @legend-item-click="handleLegendItemClick" />

    <VisXYContainer :style="{ height: isMounted ? '100%' : 'auto' }" :margin="{ left: 20, right: 20 }" :data="data">
      <svg width="0" height="0">
        <defs>
          <linearGradient v-for="(color, i) in colors" :id="`${chartRef}-color-${i}`" :key="i" x1="0" y1="0" x2="0" y2="1">
            <template v-if="showGradient">
              <stop offset="5%" :stop-color="color" stop-opacity="0.8" />
              <stop offset="95%" :stop-color="color" stop-opacity="0.6" />
            </template>
            <template v-else>
              <stop offset="0%" :stop-color="color" />
            </template>
          </linearGradient>
        </defs>
      </svg>

      <ChartCrosshair v-if="showTooltip" :colors="colors" :items="legendItems" :index="index" :custom-tooltip="customTooltip" />

      <template v-for="(category, i) in categories" :key="category">
        <VisBar
          :x="(d: Data, i: number) => i"
          :y="(d: Data) => d[category] as number"
          :color="colors[i]"
          :corner-radius="cornerRadius"
          :padding="padding"
          :attributes="{
            [GroupedBar.selectors.bar]: {
              fill: showGradient ? `url(#${chartRef}-color-${i})` : colors[i],
              opacity: legendItems.find(item => item.name === category)?.inactive ? filterOpacity : 1,
            },
          }"
        />
      </template>

      <VisAxis
        v-if="showXAxis"
        type="x"
        :tick-format="xFormatter ?? ((v: number) => data[v]?.[index] as string)"
        :grid-line="false"
        :tick-line="false"
        tick-text-color="hsl(var(--vis-text-color))"
      />
      <VisAxis
        v-if="showYAxis"
        type="y"
        :tick-line="false"
        :tick-format="yFormatter"
        :domain-line="false"
        :grid-line="showGridLine"
        :attributes="{
          [Axis.selectors.grid]: {
            class: 'text-muted',
          },
        }"
        tick-text-color="hsl(var(--vis-text-color))"
      />

      <slot />
    </VisXYContainer>
  </div>
</template>
