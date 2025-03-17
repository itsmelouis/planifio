<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HandCoins, Plus, Trash2, ArrowRight, Check, Mail } from 'lucide-vue-next'
import { useToast } from '@/components/ui/toast/use-toast'
import { useRouter } from 'vue-router'

const router = useRouter()
const { toast } = useToast()
const { user } = useUserSession()

interface Payment {
  id: number;
  type: string;
  name: string;
  amount: number;
  frequency: 'regular' | 'unregular';
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
}

interface Transaction {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  title?: string;
}

const payments = ref<Payment[]>([
  { 
    id: 1, 
    type: 'freelance', 
    name: 'Freelance', 
    amount: 1500, 
    frequency: 'unregular', 
    status: 'success',
    email: user?.value?.email ?? 'user@example.com'
  },
  { 
    id: 2, 
    type: 'salary', 
    name: 'Salary', 
    amount: 4000, 
    frequency: 'regular', 
    status: 'success',
    email: user?.value?.email ?? 'user@example.com'
  }
])

const newPayment = ref({
  name: '',
  amount: '',
  type: 'salary',
  frequency: 'regular' as 'regular' | 'unregular',
  email: user?.value?.email ?? ''
})

const selectedType = ref('salary')
const paymentTypes = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'other', label: 'Other' }
]

const selectedFrequency = ref('regular')
const frequencyTypes = [
  { value: 'regular', label: 'Regular' },
  { value: 'unregular', label: 'Irregular' }
]

const selectedStatus = ref('success')
const statusTypes = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'success', label: 'Success' },
  { value: 'failed', label: 'Failed' }
]

const generateTransactionId = () => {
  return Math.random().toString(36).substring(2, 10);
}

const createTransaction = (payment: Payment): Transaction => {
  return {
    id: generateTransactionId(),
    amount: payment.amount,
    status: payment.status,
    email: payment.email,
    title: payment.name
  }
}

const recordTransaction = (payment: Payment) => {
  const transaction = createTransaction(payment)
  
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]')
  transactions.push(transaction)
  localStorage.setItem('transactions', JSON.stringify(transactions))
  
  toast({
    title: 'Transaction recorded',
    description: `Payment "${payment.name}" has been recorded as a transaction`,
  })
}

const addPayment = () => {
  if (!newPayment.value.name || !newPayment.value.amount || !newPayment.value.email) {
    toast({
      title: 'Required fields',
      description: 'Please fill in all required fields',
      variant: 'destructive',
    })
    return
  }

  const amount = parseFloat(newPayment.value.amount)
  if (isNaN(amount) || amount <= 0) {
    toast({
      title: 'Invalid amount',
      description: 'Please enter a valid amount',
      variant: 'destructive',
    })
    return
  }

  const id = Math.max(0, ...payments.value.map(p => p.id)) + 1
  
  const newPaymentObj: Payment = {
    id,
    type: selectedType.value,
    name: newPayment.value.name,
    amount,
    frequency: selectedFrequency.value as 'regular' | 'unregular',
    status: selectedStatus.value as 'pending' | 'processing' | 'success' | 'failed',
    email: newPayment.value.email
  }
  
  payments.value.push(newPaymentObj)
  
  recordTransaction(newPaymentObj)

  newPayment.value = {
    name: '',
    amount: '',
    type: 'salary',
    frequency: 'regular',
    email: user?.value?.email ?? ''
  }
  selectedType.value = 'salary'
  selectedFrequency.value = 'regular'
  selectedStatus.value = 'success'

  toast({
    title: 'Payment added',
    description: 'Payment has been added successfully',
  })
}

const deletePayment = (id: number) => {
  payments.value = payments.value.filter(payment => payment.id !== id)
  toast({
    title: 'Payment deleted',
    description: 'Payment has been deleted successfully',
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800 font-medium';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 font-medium';
    case 'processing':
      return 'bg-blue-100 text-blue-800 font-medium';
    case 'failed':
      return 'bg-red-100 text-red-800 font-medium';
    default:
      return 'bg-gray-100 text-gray-800 font-medium';
  }
}

const getStatusButtonClass = (status: string, isSelected: boolean) => {
  if (isSelected) {
    switch (status) {
      case 'success':
        return 'bg-green-500 text-white hover:bg-green-600';
      case 'pending':
        return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'processing':
        return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'failed':
        return 'bg-red-500 text-white hover:bg-red-600';
      default:
        return '';
    }
  } else {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return '';
    }
  }
}
</script>

<template>
  <div>
    <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
      Payment Management
    </h2>

    <div v-if="!user" class="py-8 text-center">
      <Card>
        <CardContent class="py-10">
          <p class="text-xl font-medium">Please log in</p>
          <p class="text-muted-foreground mt-2">Log in to manage your payments</p>
          <Button class="mt-4" @click="navigateTo('/login')">Log in</Button>
        </CardContent>
      </Card>
    </div>

    <div v-else class="grid gap-6 py-6">
      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">Registered Payments</CardTitle>
          <CardDescription>
            List of your regular and irregular payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="payments.length === 0" class="text-center py-6 text-muted-foreground">
            No registered payments
          </div>
          <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card v-for="payment in payments" :key="payment.id" class="overflow-hidden">
              <CardContent class="p-0">
                <div class="flex flex-col gap-4 items-center p-6">
                  <div class="bg-blue-950 p-4 rounded-md">
                    <HandCoins color="white" />
                  </div>
                  <div class="text-center">
                    <h2 class="text-xl font-semibold text-blue-950">{{ payment.name }}</h2>
                    <p class="text-sm text-gray-400">
                      {{ payment.frequency === 'regular' ? 'Regular payment' : 'Irregular payment' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-3xl font-bold text-blue-950">${{ payment.amount.toLocaleString() }}</p>
                  </div>
                  <div class="flex flex-col items-center gap-2 w-full">
                    <div class="flex items-center gap-2">
                      <span class="text-sm">Status:</span>
                      <span :class="getStatusColor(payment.status)" class="px-2 py-1 rounded-full text-xs">
                        {{ payment.status === 'success' ? 'Success' : 
                           payment.status === 'pending' ? 'Pending' : 
                           payment.status === 'processing' ? 'Processing' : 'Failed' }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2">
                      <Mail class="h-4 w-4" />
                      <span class="text-sm truncate max-w-[150px]">{{ payment.email }}</span>
                    </div>
                  </div>
                  <div class="flex gap-2 w-full">
                    <Button variant="destructive" size="sm" class="flex-1" @click="deletePayment(payment.id)">
                      <Trash2 class="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    <Button variant="default" size="sm" class="flex-1" @click="recordTransaction(payment)">
                      <ArrowRight class="h-4 w-4 mr-1" />
                      Create Transaction
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add a Payment</CardTitle>
          <CardDescription>
            Register a new regular or irregular payment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="addPayment" class="grid gap-4 py-4">
            <div class="grid gap-2">
              <Label for="name">Payment Name</Label>
              <Input id="name" v-model="newPayment.name" placeholder="Ex: Salary, Freelance, etc." />
            </div>
            <div class="grid gap-2">
              <Label for="amount">Amount ($)</Label>
              <Input id="amount" v-model="newPayment.amount" type="number" min="0" step="0.01" placeholder="0.00" />
            </div>
            <div class="grid gap-2">
              <Label for="email">Email</Label>
              <Input id="email" v-model="newPayment.email" type="email" placeholder="email@example.com" />
            </div>
            <div class="grid gap-2">
              <Label for="type">Type</Label>
              <div class="flex flex-wrap gap-2">
                <Button 
                  v-for="type in paymentTypes" 
                  :key="type.value"
                  :variant="selectedType === type.value ? 'default' : 'outline'"
                  @click.prevent="selectedType = type.value"
                  class="flex-1"
                >
                  {{ type.label }}
                </Button>
              </div>
            </div>
            <div class="grid gap-2">
              <Label for="frequency">Frequency</Label>
              <div class="flex gap-2">
                <Button 
                  v-for="freq in frequencyTypes" 
                  :key="freq.value"
                  :variant="selectedFrequency === freq.value ? 'default' : 'outline'"
                  @click.prevent="selectedFrequency = freq.value"
                  class="flex-1"
                >
                  {{ freq.label }}
                </Button>
              </div>
            </div>
            <div class="grid gap-2">
              <Label for="status">Status</Label>
              <div class="flex flex-wrap gap-2">
                <Button 
                  v-for="status in statusTypes" 
                  :key="status.value"
                  :variant="selectedStatus === status.value ? 'default' : 'outline'"
                  :class="getStatusButtonClass(status.value, selectedStatus === status.value)"
                  @click.prevent="selectedStatus = status.value"
                  class="flex-1"
                >
                  {{ status.label }}
                </Button>
              </div>
            </div>
            <Button type="submit" class="mt-4">
              <Plus class="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            View your recent transactions on the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="flex justify-center">
            <Button @click="router.push('/')" class="flex items-center gap-2">
              <Check class="h-4 w-4" />
              View Recent Transactions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
