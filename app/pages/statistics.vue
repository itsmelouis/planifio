<script setup lang="ts">
import { DonutChart } from '@/components/ui/chart-donut'
import { AreaChart } from '@/components/ui/chart-area'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { ref, computed, onMounted } from 'vue'
import { ArrowUp, ArrowDown, DollarSign, CreditCard, Wallet, TrendingUp } from 'lucide-vue-next'

definePageMeta({
  middleware: 'auth',
})
  
const mode = useColorMode()

interface Transaction {
  id?: string
  date?: string
  amount: number
  category?: string
  description?: string
  type: 'income' | 'expense'
  status?: string
}

interface Payment {
  id?: string
  date?: string
  amount: number
  type?: string
  status?: string
  frequency?: string
}

interface CategoryData {
  name: string
  value: number
}

interface StatusData {
  name: string
  value: number
}

interface MonthlyData {
  name: string
  total: number
  predicted: number
}

interface PaymentTypeData {
  name: string
  value: number
}

const colorsDonut = computed(() => {
  return mode.value === 'dark'
    ? ['#FFC700', '#FFA400', '#FF8A00', '#FF6F00', '#FF5300']
    : ['#21295cff', '#1b3b6fff', '#065a82ff', '#1c7293ff', '#9eb3c2ff']
})

const colorsArea = computed(() => {
  return mode.value === 'dark' ? ['white', 'green'] : ['black', 'green']
})

const transactions = ref<Transaction[]>([])
const payments = ref<Payment[]>([])
const monthlyData = ref<MonthlyData[]>([])
const categoryData = ref<CategoryData[]>([])
const statusData = ref<StatusData[]>([])
const paymentTypeData = ref<PaymentTypeData[]>([])

const totalSpent = ref(0)
const totalIncome = ref(0)
const averageTransaction = ref(0)
const pendingPayments = ref(0)

const loadData = () => {
  try {
    const storedTransactions = localStorage.getItem('transactions')
    if (storedTransactions) {
      transactions.value = JSON.parse(storedTransactions)
      
      totalSpent.value = transactions.value
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      totalIncome.value = transactions.value
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      if (transactions.value.length > 0) {
        averageTransaction.value = transactions.value.reduce((sum, t) => sum + t.amount, 0) / transactions.value.length
      }
      
      const categories: Record<string, number> = {}
      transactions.value.forEach(t => {
        const category = t.category || 'Other'
        if (!categories[category]) {
          categories[category] = 0
        }
        categories[category] += t.amount
      })
      
      categoryData.value = Object.keys(categories).map(name => ({
        name,
        value: categories[name] || 0
      }))
      
      const statuses: Record<string, number> = {}
      transactions.value.forEach(t => {
        const status = t.status || 'unknown'
        if (!statuses[status]) {
          statuses[status] = 0
        }
        statuses[status] += 1
      })
      
      statusData.value = Object.keys(statuses).map(name => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: statuses[name] || 0
      }))
      
      const months: Record<string, number> = {}
      const predictedMonths: Record<string, number> = {}
      
      const today = new Date()
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        const monthName = d.toLocaleString('default', { month: 'short' })
        months[monthName] = 0
        predictedMonths[monthName] = 0
      }
      
      transactions.value.forEach(t => {
        if (t.date) {
          const date = new Date(t.date)
          const monthName = date.toLocaleString('default', { month: 'short' })
          if (months[monthName] !== undefined) {
            months[monthName] += t.amount
          }
        }
      })
      
      // Générer des prédictions simples (10% de plus que le mois actuel)
      Object.keys(months).forEach((month, index, arr) => {
        if (index < arr.length - 1) {
          const nextMonth = arr[index + 1];
          if (nextMonth && months[month] !== undefined) {
            predictedMonths[nextMonth] = months[month] * 1.1;
          }
        }
      })
      
      monthlyData.value = Object.keys(months).map(name => ({
        name,
        total: months[name] || 0,
        predicted: predictedMonths[name] || 0
      }))
    }
    
    const storedPayments = localStorage.getItem('payments')
    if (storedPayments) {
      payments.value = JSON.parse(storedPayments)
      
      pendingPayments.value = payments.value
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0)
      
      const types: Record<string, number> = {}
      payments.value.forEach(p => {
        const type = p.type || 'Other'
        if (!types[type]) {
          types[type] = 0
        }
        types[type] += p.amount
      })
      
      paymentTypeData.value = Object.keys(types).map(name => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: types[name] || 0
      }))
    }
  } catch (error) {
    console.error('Error loading data for statistics:', error)
  }
}

onMounted(() => {
  loadData()
})

function valueFormatter(tick: number | string | undefined): string {
  return typeof tick === 'number'
    ? `$${new Intl.NumberFormat('us').format(tick).toString()}`
    : ''
}

const trend = computed(() => {
  if (monthlyData.value.length < 2) return 0
  
  const lastMonthData = monthlyData.value[monthlyData.value.length - 1]
  const prevMonthData = monthlyData.value[monthlyData.value.length - 2]
  
  if (!lastMonthData || !prevMonthData) return 0
  if (!lastMonthData || !prevMonthData) return 0
  
  const currentMonth = lastMonthData.total
  const previousMonth = prevMonthData.total
  
  if (previousMonth === 0) return 100
  
  return ((currentMonth - previousMonth) / previousMonth) * 100
})

const trendIsPositive = computed(() => trend.value >= 0)
</script>

<template>
  <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Statistics</h2>

  <!-- Cards de résumé -->
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Spent</CardTitle>
        <DollarSign class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">${{ totalSpent.toLocaleString() }}</div>
        <p class="text-xs text-muted-foreground">
          <span :class="trendIsPositive ? 'text-green-500' : 'text-red-500'" class="flex items-center">
            <component :is="trendIsPositive ? ArrowUp : ArrowDown" class="mr-1 h-4 w-4" />
            {{ Math.abs(Number(trend)) > 0 ? Math.abs(Number(trend)).toFixed(1) : '0' }}%
          </span>
          from last month
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Total Income</CardTitle>
        <Wallet class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">${{ totalIncome.toLocaleString() }}</div>
        <p class="text-xs text-muted-foreground">
          Balance: ${{ (totalIncome - totalSpent).toLocaleString() }}
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Average Transaction</CardTitle>
        <CreditCard class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">${{ averageTransaction.toFixed(2) }}</div>
        <p class="text-xs text-muted-foreground">
          {{ transactions.length }} transactions total
        </p>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle class="text-sm font-medium">Pending Payments</CardTitle>
        <TrendingUp class="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">${{ pendingPayments.toLocaleString() }}</div>
        <p class="text-xs text-muted-foreground">
          {{ payments.filter(p => p.status === 'pending').length }} payments pending
        </p>
      </CardContent>
    </Card>
  </div>

  <!-- Graphiques -->
  <div class="grid auto-rows-min gap-4 md:grid-cols-2 mt-6">
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>Your spending pattern over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <AreaChart 
          :data="monthlyData" 
          index="name" 
          :categories="['total', 'predicted']" 
          :colors="colorsArea" 
          :value-formatter="valueFormatter"
          class="h-72" 
        />
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>How your money is distributed across categories</CardDescription>
      </CardHeader>
      <CardContent>
        <DonutChart 
          index="name" 
          category="value" 
          :data="categoryData" 
          :value-formatter="valueFormatter" 
          :colors="colorsDonut"
          class="h-72" 
        />
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Transaction Status</CardTitle>
        <CardDescription>Distribution of transaction statuses</CardDescription>
      </CardHeader>
      <CardContent>
        <DonutChart 
          index="name" 
          category="value" 
          :data="statusData" 
          :value-formatter="(v) => v.toString()" 
          :colors="colorsDonut"
          class="h-72" 
        />
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Distribution of payment methods used</CardDescription>
      </CardHeader>
      <CardContent>
        <DonutChart 
          index="name" 
          category="value" 
          :data="paymentTypeData" 
          :value-formatter="valueFormatter" 
          :colors="colorsDonut"
          class="h-72" 
        />
      </CardContent>
    </Card>
  </div>
</template>
