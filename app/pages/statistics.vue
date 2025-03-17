<script setup lang="ts">
import { DonutChart } from '@/components/ui/chart-donut'
import { AreaChart } from '@/components/ui/chart-area'


// definePageMeta({
  //   middleware: 'auth',
  // })
  
const mode = useColorMode()

const colorsDonut = computed(() => {
  return mode.value === 'dark'
    ? ['#FFC700', '#FFA400', '#FF8A00', '#FF6F00', '#FF5300']
    : ['#21295cff', '#1b3b6fff', '#065a82ff', '#1c7293ff', '#9eb3c2ff']
})

const colorsArea = computed(() => {
  return mode.value === 'dark' ? ['white', 'green'] : ['black', 'green']
})
const data = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 4000) + 500,
    predicted: Math.floor(Math.random() * 4000) + 500,
  },
  {
    name: 'Feb',
    total: Math.floor(Math.random() * 4000) + 500,
    predicted: Math.floor(Math.random() * 4000) + 500,
  },
  {
    name: 'Mar',
    total: Math.floor(Math.random() * 4000) + 500,
    predicted: Math.floor(Math.random() * 4000) + 500,
  },
  {
    name: 'Apr',
    total: Math.floor(Math.random() * 4000) + 500,
    predicted: Math.floor(Math.random() * 4000) + 500,
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 4000) + 500,
    predicted: Math.floor(Math.random() * 4000) + 500,
  },
  {
    name: 'Jun',
    total: Math.floor(Math.random() * 4000) + 500,
    predicted: Math.floor(Math.random() * 4000) + 500,
  },
]

const data2 = [
  { name: 'Jan', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Feb', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Mar', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Apr', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'May', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Jun', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Jul', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
]

function valueFormatter(tick: number | Date) {
  return typeof tick === 'number'
    ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
    : ''
}
</script>

<template>
  <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Statistics
  </h2>

  <div class="grid auto-rows-min gap-4 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle class="text-3xl">Total earning in half year</CardTitle>
      </CardHeader>
      <CardContent>
        <DonutChart index="name" :category="'total'" :data="data" :value-formatter="valueFormatter" :colors="colorsDonut" />
      </CardContent>
    </Card>
  </div>
  <div class="w-full">
    <Card>
      <CardHeader>
        <CardTitle class="text-3xl"> Evolutions of earnings </CardTitle>
      </CardHeader>
      <CardContent>
        <AreaChart :data="data2" index="name" :categories="['total', 'predicted']" :colors="colorsArea" />
      </CardContent>
    </Card>
  </div>
</template>
