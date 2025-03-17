<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

import { ref } from 'vue'
import { toast } from '~/components/ui/toast'

// Appearance
const theme = ref<'light' | 'dark'>('light')
const color = useColorMode()

const updateAppearance = () => {
  color.preference = theme.value
  toast({
    title: 'Preferences updated!',
    description: `Theme: ${theme.value}`,
  })
}

// Display
const items = [
  { id: 'overview', label: 'Overview' },
  { id: 'messages', label: 'Messages' },
  { id: 'payments', label: 'Payments' },
  { id: 'statitics', label: 'Statitics' },
]
const selectedItems = ref<string[]>(['recents', 'home'])

const updateDisplay = () => {
  toast({
    title: 'Display updated!',
    description: `Selected items: ${selectedItems.value.join(', ')}`,
  })
}

// Notifications
const notificationType = ref<'all' | 'mentions' | 'none'>('all')
const communicationEmails = ref(false)
const marketingEmails = ref(false)
const socialEmails = ref(true)
const securityEmails = ref(true)
const mobileSettings = ref(false)

const updateNotifications = () => {
  toast({
    title: 'Notifications updated!',
    description: JSON.stringify({
      type: notificationType.value,
      communicationEmails: communicationEmails.value,
      marketingEmails: marketingEmails.value,
      socialEmails: socialEmails.value,
      securityEmails: securityEmails.value,
      mobileSettings: mobileSettings.value,
    }, null, 2),
  })
}
</script>

<template>
  <h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
    Settings
  </h2>

  <!-- Appearance -->
  <div class="mt-6 space-y-4">
    <h3 class="text-lg font-medium">Appearance</h3>
    <p class="text-sm text-muted-foreground">Customize the appearance of the app.</p>
    <Separator />

    <div class="space-y-1">
    <label class="font-medium text-sm">Theme</label>
    <p class="text-sm text-muted-foreground">Select the theme for the dashboard.</p>

    <RadioGroup v-model="theme" class="grid grid-cols-2 max-w-md gap-8 pt-2">
      
      <!-- Light Theme -->
      <label
        for="theme-light"
        class="cursor-pointer [&:has([data-state=checked])>div]:border-primary"
      >
        <RadioGroupItem id="theme-light" value="light" class="sr-only" />

        <div
          class="items-center border-2 border-muted rounded-md p-1 hover:border-accent"
        >
          <div class="rounded-sm bg-[#ecedef] p-2 space-y-2">
            <div class="rounded-md bg-white p-2 shadow-sm space-y-2">
              <div class="h-2 w-20 rounded-lg bg-[#ecedef]" />
              <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
            </div>
            <div class="flex items-center rounded-md bg-white p-2 shadow-sm space-x-2">
              <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
              <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
            </div>
            <div class="flex items-center rounded-md bg-white p-2 shadow-sm space-x-2">
              <div class="h-4 w-4 rounded-full bg-[#ecedef]" />
              <div class="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
            </div>
          </div>
        </div>
        <span class="block w-full p-2 text-center font-normal">Light</span>
      </label>

      <!-- Dark Theme -->
      <label
        for="theme-dark"
        class="cursor-pointer [&:has([data-state=checked])>div]:border-primary"
      >
        <RadioGroupItem id="theme-dark" value="dark" class="sr-only" />

        <div
          class="items-center border-2 border-muted rounded-md bg-popover p-1 hover:bg-accent hover:text-accent-foreground"
        >
          <div class="rounded-sm bg-slate-950 p-2 space-y-2">
            <div class="rounded-md bg-slate-800 p-2 shadow-sm space-y-2">
              <div class="h-2 w-20 rounded-lg bg-slate-400" />
              <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
            </div>
            <div class="flex items-center rounded-md bg-slate-800 p-2 shadow-sm space-x-2">
              <div class="h-4 w-4 rounded-full bg-slate-400" />
              <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
            </div>
            <div class="flex items-center rounded-md bg-slate-800 p-2 shadow-sm space-x-2">
              <div class="h-4 w-4 rounded-full bg-slate-400" />
              <div class="h-2 w-[100px] rounded-lg bg-slate-400" />
            </div>
          </div>
        </div>
        <span class="block w-full p-2 text-center font-normal">Dark</span>
      </label>

    </RadioGroup>
  </div>
  <div class="flex justify-start">
      <Button type="submit" @click="updateAppearance">
        Update appearance
      </Button>
    </div>
  </div>

  <!-- Display -->
  <div class="mt-10 space-y-4">
    <h3 class="text-lg font-medium">Display</h3>
    <p class="text-sm text-muted-foreground">Control what's displayed in the app.</p>
    <Separator />

    <div class="space-y-2">
      <label class="text-base">Sidebar</label>
      <div v-for="item in items" :key="item.id" class="flex items-center space-x-2">
        <Checkbox type="checkbox" :value="item.id" :default-value="true" />
        <label :for="item.id">{{ item.label }}</label>
      </div>

      <Button @click="updateDisplay">Update display</Button>
    </div>
  </div>

  <!-- Notifications -->
  <div class="mt-10 space-y-4">
    <h3 class="text-lg font-medium">Notifications</h3>
    <p class="text-sm text-muted-foreground">Configure how you receive notifications.</p>
    <Separator />

    <div class="space-y-4">
      <Label>Notify me about...</Label>
      <RadioGroup v-model="notificationType" class="flex flex-col space-y-2">
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="notify-all" value="all" />
          <Label for="notify-all">All new messages</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="notify-mentions" value="mentions" />
          <Label for="notify-mentions">Direct messages and mentions</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="notify-none" value="none" />
          <Label for="notify-none">Nothing</Label>
        </div>
      </RadioGroup>


      <div class="space-y-4">
        <div class="flex items-center justify-between border p-4 rounded">
          <div>
            <p>Communication emails</p>
            <small>Receive emails about your account activity.</small>
          </div>
          <Switch v-model:checked="communicationEmails" />
        </div>

        <div class="flex items-center justify-between border p-4 rounded">
          <div>
            <p>Marketing emails</p>
            <small>Receive emails about new products and features.</small>
          </div>
          <Switch v-model:checked="marketingEmails" />
        </div>

        <div class="flex items-center justify-between border p-4 rounded">
          <div>
            <p>Social emails</p>
            <small>Receive emails for friend requests, follows, and more.</small>
          </div>
          <Switch v-model:checked="socialEmails" />
        </div>

        <div class="flex items-center justify-between border p-4 rounded">
          <div>
            <p>Security emails</p>
            <small>Receive emails about security and login.</small>
          </div>
          <Switch v-model:checked="securityEmails" />
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <Checkbox type="checkbox" v-model="mobileSettings" />
        <label>Use different settings for mobile devices</label>
      </div>

      <Button @click="updateNotifications">Update notifications</Button>
    </div>
  </div>
</template>
