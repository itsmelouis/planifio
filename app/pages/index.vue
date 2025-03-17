<script setup lang="ts">

definePageMeta({
  middleware: 'auth',
})

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card'

import { CreditCardIcon, Nfc, HandCoins, Download } from 'lucide-vue-next'
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import { valueUpdater } from '~/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import CreditCard from '~/components/CreditCard.vue'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ArrowUpDown, ChevronDown } from 'lucide-vue-next'
import { h, ref, onMounted, computed } from 'vue'

export interface Payment {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
  title?: string
  date?: string
}

export interface UpcomingPayment {
  id: number
  name: string
  amount: number
  date: string
  type: string
}

const data = ref<Payment[]>([])
const upcomingPayments = ref<UpcomingPayment[]>([])

const loadTransactions = () => {
  try {
    const storedTransactions = localStorage.getItem('transactions')
    if (storedTransactions) {
      const parsedTransactions = JSON.parse(storedTransactions)
      // Make sure each transaction has the required properties for the table
      const formattedTransactions = parsedTransactions.map((transaction: any) => ({
        id: transaction.id || generateTransactionId(),
        amount: transaction.amount,
        status: transaction.status || 'success',
        email: transaction.email || user?.value?.email || 'user@example.com',
        title: transaction.title || 'Transaction',
        date: transaction.date || new Date().toISOString().split('T')[0]
      }))
      data.value = formattedTransactions
    }
  } catch (error) {
    console.error('Error loading transactions:', error)
  }
}

const loadUpcomingPayments = () => {
  try {
    const storedPayments = localStorage.getItem('payments')
    if (storedPayments) {
      const parsedPayments = JSON.parse(storedPayments)
      
      // Create upcoming payments from regular payments
      // Only use regular payments with status pending or processing
      const upcoming = parsedPayments
        .filter((payment: any) => 
          payment.frequency === 'regular' && 
          (payment.status === 'pending' || payment.status === 'processing')
        )
        .map((payment: any, index: number) => {
          // Generate a future date for upcoming payment
          const today = new Date()
          const futureDate = new Date()
          futureDate.setDate(today.getDate() + (index + 1) * 7) // Every week
          
          return {
            id: payment.id,
            name: payment.name,
            amount: payment.amount,
            date: futureDate.toISOString().split('T')[0],
            type: payment.type
          }
        })
      
      upcomingPayments.value = upcoming
    }
  } catch (error) {
    console.error('Error loading upcoming payments:', error)
  }
}

onMounted(() => {
  loadTransactions()
  loadUpcomingPayments()
})

const combinedData = computed(() => {
  return data.value
})

const columns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => h(Checkbox, {
      'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
      'ariaLabel': 'Select all',
    }),
    cell: ({ row }) => h(Checkbox, {
      'modelValue': row.getIsSelected(),
      'onUpdate:modelValue': value => row.toggleSelected(!!value),
      'ariaLabel': 'Select row',
    }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('title') || 'Unnamed'),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('status')),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)

      return h('div', { class: 'text-right font-medium' }, formatted)
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original

      return row.getValue("actions")
    },
  },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  data: combinedData,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value },
  },
})

const { user } = useUserSession();

const exportToCSV = () => {
  const visibleColumns = table.getVisibleLeafColumns().filter(
    column => column.id !== 'select' && column.id !== 'actions'
  )
  
  const headers = visibleColumns.map(column => {
    return column.id.charAt(0).toUpperCase() + column.id.slice(1)
  }).join(',')
  
  const rows = table.getRowModel().rows.map(row => {
    return visibleColumns.map(column => {
      const value = row.getValue(column.id)
      if (column.id === 'amount') {
        return value
      }
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : value
    }).join(',')
  }).join('\n')
  
  const csv = `${headers}\n${rows}`
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'transactions.csv')
  
  document.body.appendChild(link)
  
  link.click()
  
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function generateTransactionId() {
  return Math.random().toString(36).substr(2, 9);
}
</script>

<template>
  <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Dashboard</h2>

  <div class="grid auto-rows-min gap-4 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle class="text-3xl">Personal card</CardTitle>
      </CardHeader>
      <CardContent class="w-full max-w-3xl mx-auto">
        <CreditCard :name="user?.name" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle class="text-3xl">Upcoming payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div v-if="upcomingPayments.length === 0" class="text-center py-6 text-muted-foreground">
            No upcoming payments
          </div>
          <div v-else v-for="payment in upcomingPayments" :key="payment.id" class="flex items-center justify-between space-x-4">
            <div class="flex items-center space-x-4">
              <div>
                <p class="text-sm font-medium leading-none">{{ payment.name }}</p>
                <p class="text-sm text-muted-foreground">{{ payment.date }}</p>
              </div>
            </div>
            <div>
              <p class="text-sm font-medium leading-none">${{ payment.amount.toLocaleString() }}</p>
              <p class="text-sm text-muted-foreground capitalize">{{ payment.type }}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    <!-- <div class="aspect-video rounded-xl bg-muted/50" /> -->
  </div>
  <div class="w-full">
    <div class="flex items-center py-4">
      <h2 class="text-xl font-semibold">Recent transactions</h2>
      <div class="ml-auto flex gap-2">
        <Button variant="outline" @click="exportToCSV" class="flex items-center gap-1">
          <Download class="h-4 w-4" />
          Export CSV
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline">
              Columns <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
              :key="column.id" class="capitalize" :model-value="column.getIsVisible()" @update:model-value="(value) => {
                column.toggleVisibility(!!value)
              }">
              {{ column.id }}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="flex-1 text-sm text-muted-foreground">
        {{ table.getFilteredSelectedRowModel().rows.length }} of {{ table.getFilteredRowModel().rows.length }} row(s)
        selected.
      </div>
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          @click="table.previousPage()"
          :disabled="!table.getCanPreviousPage()"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          @click="table.nextPage()"
          :disabled="!table.getCanNextPage()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>
