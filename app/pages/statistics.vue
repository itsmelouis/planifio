<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart } from '@/components/ui/chart-area'
import { DonutChart } from '@/components/ui/chart-donut'
import { ArrowUp, ArrowDown, DollarSign, Wallet, CreditCard, TrendingUp } from 'lucide-vue-next'
import { useColorMode } from '@vueuse/core'

definePageMeta({
  middleware: 'auth'
})

interface Transaction {
  readonly id: string
  readonly date: string
  readonly amount: number
  readonly category: string
  readonly description: string
  readonly type: 'expense' | 'income'
  readonly status: 'completed' | 'pending' | 'cancelled'
}

interface Payment {
  readonly id: string
  readonly date: string
  readonly amount: number
  readonly type: string
  readonly status: 'completed' | 'pending' | 'cancelled'
  readonly frequency: 'monthly' | 'one-time'
}

interface ChartData {
  readonly name: string
  readonly value: number
}

interface MonthlyData {
  readonly name: string
  readonly total: number
  readonly predicted: number
}

const transactions = ref<Transaction[]>([])
const payments = ref<Payment[]>([])
const categoryData = ref<ChartData[]>([])
const paymentTypeData = ref<ChartData[]>([])
const statusData = ref<ChartData[]>([])
const monthlyData = ref<MonthlyData[]>([])

const totalSpent = ref<number>(0)
const totalIncome = ref<number>(0)
const averageTransaction = ref<number>(0)
const pendingPayments = ref<number>(0)

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

const trend = computed(() => {
  if (!monthlyData.value.length) return 0
  const lastTwo = monthlyData.value.slice(-2)
  if (lastTwo.length < 2) return 0
  
  const currentMonth = lastTwo[1]
  const previousMonth = lastTwo[0]
  
  if (!currentMonth || !previousMonth) return 0
  
  const current = currentMonth.total
  const previous = previousMonth.total
  
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
})

const trendIsPositive = computed(() => trend.value >= 0)

const mode = useColorMode()
const colorsArea = computed(() => {
  const isDark = mode.value === 'dark'
  return ['#0EA5E9', isDark ? '#1E293B' : '#E2E8F0']
})

const colorsDonut = computed(() => [
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#EF4444',
  '#14B8A6',
  '#6366F1'
])

const generateTestData = () => {
  type Category = 'food' | 'transport' | 'housing' | 'entertainment' | 'salary' | 'freelance'
  type PaymentType = 'Cash' | 'Bank_transfer' | 'Credit_card' | 'Paypal'
  type Status = 'completed' | 'pending' | 'cancelled'

  const categories: Category[] = ['food', 'transport', 'housing', 'entertainment', 'salary', 'freelance']
  const paymentTypes: PaymentType[] = ['Cash', 'Bank_transfer', 'Credit_card', 'Paypal']
  const statuses: Status[] = ['completed', 'pending', 'cancelled']

  const testTransactions: Transaction[] = []
  const testPayments: Payment[] = []

  const today = new Date()
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0).getDate()

    const numTransactions = Math.floor(Math.random() * 10) + 10
    for (let j = 0; j < numTransactions; j++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1
      const date = new Date(month.getFullYear(), month.getMonth(), day)

      const isExpense = Math.random() > 0.3
      const amount = Math.floor(Math.random() * (isExpense ? 200 : 2000)) + (isExpense ? 10 : 1000)

      const statusIndex = Math.floor(Math.random() * statuses.length)
      const status: Status = statuses[statusIndex] || 'pending'
      
      let selectedCategory: Category
      if (isExpense) {
        const index = Math.floor(Math.random() * (categories.length - 2))
        selectedCategory = categories[index] || 'food'
      } else {
        const index = Math.floor(Math.random() * 2) + categories.length - 2
        selectedCategory = categories[index] || 'salary'
      }

      testTransactions.push({
        id: `t-${date.getTime()}-${j}`,
        date: date.toISOString(),
        amount,
        category: selectedCategory,
        description: isExpense ? 'Test expense' : 'Test income',
        type: isExpense ? 'expense' : 'income',
        status
      })
    }

    const numPayments = Math.floor(Math.random() * 3) + 2
    for (let j = 0; j < numPayments; j++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1
      const date = new Date(month.getFullYear(), month.getMonth(), day)

      const statusIndex = Math.floor(Math.random() * statuses.length)
      const status: Status = statuses[statusIndex] || 'pending'
      
      const typeIndex = Math.floor(Math.random() * paymentTypes.length)
      const paymentType: PaymentType = paymentTypes[typeIndex] || 'Cash'

      testPayments.push({
        id: `p-${date.getTime()}-${j}`,
        date: date.toISOString(),
        amount: Math.floor(Math.random() * 1000) + 100,
        type: paymentType,
        status,
        frequency: Math.random() > 0.5 ? 'monthly' : 'one-time'
      })
    }
  }
  
  return {
    transactions: testTransactions,
    payments: testPayments
  }
}

const loadData = () => {
  try {
    const storedTransactions = localStorage.getItem('transactions')
    const storedPayments = localStorage.getItem('payments')
    
    if (storedTransactions) {
      const parsedTransactions = JSON.parse(storedTransactions)
      transactions.value = parsedTransactions.map((t: Partial<Transaction>) => ({
        id: t.id || `t-${Date.now()}-${Math.random()}`,
        date: t.date || new Date().toISOString(),
        amount: t.amount || 0,
        category: t.category || 'other',
        description: t.description || '',
        type: t.type || 'expense',
        status: t.status || 'pending'
      }))
    }
    if (storedPayments) {
      const parsedPayments = JSON.parse(storedPayments)
      payments.value = parsedPayments.map((p: Partial<Payment>) => ({
        id: p.id || `p-${Date.now()}-${Math.random()}`,
        date: p.date || new Date().toISOString(),
        amount: p.amount || 0,
        type: p.type || 'other',
        status: p.status || 'pending',
        frequency: p.frequency || 'one-time'
      }))
    }

    totalSpent.value = transactions.value
      .filter(t => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)

    totalIncome.value = transactions.value
      .filter(t => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)

    averageTransaction.value = transactions.value.length > 0
      ? transactions.value.reduce((sum, t) => sum + t.amount, 0) / transactions.value.length
      : 0

    pendingPayments.value = payments.value
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0)

    const categoryTotals = new Map<string, number>()
    const paymentTypeTotals = new Map<string, number>()
    const statusTotals = new Map<string, number>()
    const monthlyTotals = new Map<string, { total: number; predicted: number }>()

    const today = new Date()
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthKey = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      monthlyTotals.set(monthKey, { total: 0, predicted: 0 })
    }

    transactions.value.forEach(t => {
      const currentCategoryTotal = categoryTotals.get(t.category) || 0
      categoryTotals.set(t.category, currentCategoryTotal + t.amount)

      const currentStatusTotal = statusTotals.get(t.status) || 0
      statusTotals.set(t.status, currentStatusTotal + 1)

      const transactionDate = new Date(t.date)
      const monthKey = transactionDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      const monthData = monthlyTotals.get(monthKey)
      if (monthData && t.status === 'completed') {
        monthData.total += t.amount
      }
    })

    payments.value.forEach(p => {
      const currentTypeTotal = paymentTypeTotals.get(p.type) || 0
      paymentTypeTotals.set(p.type, currentTypeTotal + p.amount)
    })

    categoryData.value = Array.from(categoryTotals.entries()).map(([name, value]) => ({ name, value }))
    paymentTypeData.value = Array.from(paymentTypeTotals.entries()).map(([name, value]) => ({ name, value }))
    statusData.value = Array.from(statusTotals.entries()).map(([name, value]) => ({ name, value }))
    monthlyData.value = Array.from(monthlyTotals.entries()).map(([name, data]) => ({
      name,
      total: data.total,
      predicted: data.total * 1.1
    }))

    if (!transactions.value.length && !payments.value.length) {
      const { transactions: testTransactions, payments: testPayments } = generateTestData()
      localStorage.setItem('transactions', JSON.stringify(testTransactions))
      localStorage.setItem('payments', JSON.stringify(testPayments))
      transactions.value = testTransactions
      payments.value = testPayments
      loadData()
    }
  } catch (error) {
    console.error('Error loading data for statistics:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <main class="container py-6">
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Statistics</h2>

    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ formatCurrency(totalSpent) }}</div>
          <p class="text-xs text-muted-foreground">
            <span :class="trendIsPositive ? 'text-green-500' : 'text-red-500'" class="flex items-center">
              <component :is="trendIsPositive ? ArrowUp : ArrowDown" class="mr-1 h-4 w-4" />
              {{ Math.abs(trend).toFixed(1) }}%
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
          <div class="text-2xl font-bold">{{ formatCurrency(totalIncome) }}</div>
          <p class="text-xs text-muted-foreground">
            Balance: {{ formatCurrency(totalIncome - totalSpent) }}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Average Transaction</CardTitle>
          <CreditCard class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ formatCurrency(averageTransaction) }}</div>
          <p class="text-xs text-muted-foreground">
            {{ formatNumber(transactions.length) }} transactions total
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Pending Payments</CardTitle>
          <TrendingUp class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ formatCurrency(pendingPayments) }}</div>
          <p class="text-xs text-muted-foreground">
            {{ formatNumber(payments.filter((p: Payment) => p.status === 'pending').length) }} payments pending
          </p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending</CardTitle>
          <CardDescription>Your spending pattern over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent class="h-[300px]">
          <AreaChart 
            :data="monthlyData" 
            index="name" 
            :categories="['total', 'predicted']" 
            :colors="colorsArea" 
            :value-formatter="formatCurrency"
            class="h-full w-full" 
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>Distribution of expenses by category</CardDescription>
        </CardHeader>
        <CardContent class="h-[300px] relative">
          <DonutChart
            :data="categoryData"
            index="name"
            category="value"
            :value-formatter="formatCurrency"
            :show-legend="true"
            :colors="colorsDonut"
            class="h-full w-full"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Distribution of payment methods used</CardDescription>
        </CardHeader>
        <CardContent class="h-[300px] relative">
          <DonutChart
            :data="paymentTypeData"
            index="name"
            category="value"
            :value-formatter="formatCurrency"
            :show-legend="true"
            :colors="colorsDonut"
            class="h-full w-full"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction Status</CardTitle>
          <CardDescription>Overview of transaction statuses</CardDescription>
        </CardHeader>
        <CardContent class="h-[300px] relative">
          <DonutChart
            :data="statusData"
            index="name"
            category="value"
            :value-formatter="formatNumber"
            :show-legend="true"
            :colors="colorsDonut"
            class="h-full w-full"
          />
        </CardContent>
      </Card>
    </div>
  </main>
</template>
