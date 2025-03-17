<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

import { ref, computed } from 'vue'
import { toast } from '~/components/ui/toast'

const { session, clear } = useUserSession()

const user = computed(() => session.value?.user)

const username = ref(user.value?.name || '')
const email = ref(user.value?.email || '')
const bio = ref('')
const urls = ref<Record<string, string>[]>([])

const verifiedEmails = ref([user.value?.email])

const addUrl = () => {
  urls.value.push({ value: '' })
}

const removeUrl = (index: number) => {
  urls.value.splice(index, 1)
}

const onSubmit = async () => {
  const data = {
    username: username.value,
    email: email.value,
    bio: bio.value,
    urls: urls.value,
  }

  console.log('Form submitted:', data)

  toast({
    title: 'Profile updated',
    description: 'Your information has been successfully saved.',
  })
}

async function logout() {
  await clear();
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const registration of registrations) {
      registration.unregister()
    }
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map(cache => caches.delete(cache)))
  }
  await navigateTo('/login');
}
</script>

<template>
  <div class="max-w-3xl space-y-6 p-6">
    <h2 class="text-3xl font-semibold tracking-tight">My Account</h2>
    <p class="text-muted-foreground">Here are your profile details. You can update them anytime.</p>

    <form @submit.prevent="onSubmit" class="space-y-6">
      <!-- Username -->
      <div>
        <label class="block mb-1 font-medium">Username</label>
        <input
          type="text"
          v-model="username"
          placeholder="Your username"
          class="w-full rounded-md border p-2"
        />
        <p class="text-sm text-muted-foreground">Public display name. You can change it once every 30 days.</p>
      </div>

      <!-- Email -->
      <div>
        <label class="block mb-1 font-medium">Email</label>
        <select v-model="email" class="w-full rounded-md border p-2">
          <option disabled value="">Select an email</option>
          <option v-for="emailItem in verifiedEmails" :key="emailItem" :value="emailItem">
            {{ emailItem }}
          </option>
        </select>
        <p class="text-sm text-muted-foreground">Email used for notifications and login.</p>
      </div>

      <!-- Bio -->
      <div>
        <label class="block mb-1 font-medium">Bio</label>
        <textarea
          v-model="bio"
          placeholder="Tell us a little bit about yourself..."
          rows="4"
          class="w-full rounded-md border p-2"
        />
        <p class="text-sm text-muted-foreground">A few lines to introduce yourself.</p>
      </div>

      <!-- URLs -->
      <div>
        <label class="block mb-1 font-medium">Links (socials, personal website...)</label>
        <div v-for="(url, index) in urls" :key="index" class="flex items-center gap-2 mb-2">
          <input
            type="url"
            v-model="url.value"
            placeholder="https://your-link.com"
            class="flex-1 rounded-md border p-2"
          />
          <button
            type="button"
            @click="removeUrl(index)"
            class="text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        </div>
        <button
          type="button"
          @click="addUrl"
          class="mt-2 rounded-md border px-3 py-1 text-sm hover:bg-gray-100"
        >
          Add a link
        </button>
      </div>

      <!-- Actions -->
      <div class="flex gap-4 mt-6">
        <button type="submit" class="rounded-md bg-black text-white px-4 py-2">
          Update
        </button>
        <button type="button" @click="logout" class="rounded-md border px-4 py-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
          Logout
        </button>
      </div>
    </form>
  </div>
</template>
