<script setup lang="ts" generic="T extends Record<string, any>">
import { type BaseChartProps } from '.'
import { cn } from '@/lib/utils'
import { ChartSingleTooltip } from '@/components/ui/chart'
import { Donut } from '@unovis/ts'
import { VisDonut, VisSingleContainer } from '@unovis/vue'
import { useMounted } from '@vueuse/core'
import { type Component, computed, ref } from 'vue'

interface ChartData {
  [key: string]: string | number
}

const props = withDefaults(defineProps<Pick<BaseChartProps<T>, 'data' | 'colors' | 'index' | 'margin' | 'showLegend' | 'showTooltip' | 'filterOpacity'> & {
  category: string
  type?: 'donut' | 'pie'
  sortFunction?: (a: ChartData, b: ChartData) => number | undefined
  valueFormatter?: (tick: number, i?: number, ticks?: number[]) => string
  customTooltip?: Component
}>(), {
  margin: () => ({ top: 20, bottom: 20, left: 20, right: 20 }),
  sortFunction: () => undefined,
  valueFormatter: (tick: number) => `${tick}`,
  type: 'donut',
  filterOpacity: 0.2,
  showTooltip: true,
  showLegend: true,
})

interface LegendItem {
  name: string
  color: string
  inactive: boolean
}

const isMounted = useMounted()
const activeSegmentKey = ref<string | undefined>()

// Couleurs par défaut pour le graphique
const defaultColors = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#6366F1', // indigo-500
  '#EC4899', // pink-500
  '#8B5CF6', // violet-500
  '#EF4444', // red-500
  '#14B8A6', // teal-500
]

// Utiliser les couleurs fournies ou les couleurs par défaut
const colors = computed(() => props.colors?.length ? props.colors : defaultColors)

// Calculer les éléments de la légende
const legendItems = computed<LegendItem[]>(() => {
  if (!props.data || !Array.isArray(props.data)) return []
  
  return props.data
    .map((item, i) => {
      const name = item[props.index]
      if (!name) return null
      
      return {
        name: String(name),
        color: colors.value[i % colors.value.length] || defaultColors[0],
        inactive: false,
      }
    })
    .filter((item): item is LegendItem => item !== null)
})

// Calculer la valeur totale pour le label central
const totalValue = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return 0
  
  return props.data.reduce((prev, curr) => {
    const value = curr[props.category]
    return prev + (typeof value === 'number' ? value : 0)
  }, 0)
})

// Style pour le conteneur du graphique
const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
  position: 'relative' as const,
}))

// Style pour le graphique
const chartStyle = computed(() => ({
  width: '100%',
  height: '100%',
}))

// Fonction pour gérer le clic sur un segment
const handleSegmentClick = (d: ChartData, _ev: PointerEvent, i: number, elements: HTMLElement[]) => {
  const key = d?.[props.index]
  if (!key) return
  
  if (key === activeSegmentKey.value) {
    activeSegmentKey.value = undefined
    elements.forEach(el => { el.style.opacity = '1' })
  } else {
    activeSegmentKey.value = String(key)
    elements.forEach((el, idx) => {
      el.style.opacity = idx === i ? '1' : String(props.filterOpacity)
    })
  }
}

// Fonction pour obtenir les éléments du DOM de manière sûre
const getChartElements = (): HTMLElement[] => {
  if (typeof document === 'undefined') return []
  return Array.from(document.querySelectorAll(Donut.selectors.segment)) as HTMLElement[]
}

// Fonction pour créer un événement PointerEvent de manière sûre
const createPointerEvent = (): PointerEvent => {
  if (typeof window === 'undefined') {
    return { type: 'click' } as PointerEvent
  }
  return new window.PointerEvent('click')
}

// Fonction pour extraire la valeur numérique d'un élément de données
const getValue = (d: ChartData): number => {
  const value = d[props.category]
  return typeof value === 'number' ? value : 0
}

// Fonction pour formater les valeurs
const formatValue = computed(() => {
  return (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0 €'
    return props.valueFormatter ? props.valueFormatter(value) : `${value} €`
  }
})

</script>

<template>
  <div :class="cn('relative w-full h-full min-h-[300px]', $attrs.class ?? '')" :style="containerStyle">
    <VisSingleContainer 
      :style="chartStyle" 
      :margin="props.margin"
    >
      <ChartSingleTooltip
        v-if="showTooltip"
        :selector="Donut.selectors.segment"
        :index="props.index"
        :category="props.category"
        :items="legendItems"
        :value-formatter="formatValue"
        :custom-tooltip="customTooltip"
        class="bg-background text-foreground border rounded-lg shadow-lg p-2"
      />

      <VisDonut
        :data="props.data"
        :value="getValue"
        :sort-function="sortFunction"
        :color="colors"
        :arc-width="type === 'donut' ? 30 : 0"
        :show-background="false"
        :central-label="type === 'donut' ? formatValue(totalValue) : ''"
        :events="{
          [Donut.selectors.segment]: {
            click: handleSegmentClick
          }
        }"
      />
    </VisSingleContainer>

    <div 
      v-if="showLegend && legendItems.length > 0" 
      class="absolute right-0 top-1/2 -translate-y-1/2 pr-4 max-h-full overflow-y-auto"
    >
      <div class="flex flex-col gap-2">
        <div 
          v-for="item in legendItems" 
          :key="item.name"
          class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer transition-colors"
          :class="{ 'opacity-20': activeSegmentKey && activeSegmentKey !== item.name }"
          @click="() => {
            const elements = getChartElements()
            const data = { [props.index]: item.name, [props.category]: 0 }
            handleSegmentClick(data, createPointerEvent(), legendItems.indexOf(item), elements)
          }"
        >
          <div 
            :style="{ backgroundColor: item.color }" 
            class="w-3 h-3 rounded-sm flex-shrink-0"
          />
          <span class="text-sm font-medium truncate">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
