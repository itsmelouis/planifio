<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Github } from 'lucide-vue-next';

import { useToast } from '@/components/ui/toast/use-toast'

const { openInPopup } = useUserSession()
const { toast } = useToast()

definePageMeta({
  layout: 'login',
});

function connectToGitHub() {
  window.location.href = '/auth/github'
}
</script>

<template>
  <Card>
    <CardHeader class="space-y-1">
      <CardTitle class="text-2xl">
        Create an account
      </CardTitle>
      <CardDescription>
        Enter your email below to create your account
      </CardDescription>
    </CardHeader>
    <CardContent class="grid gap-4">
      <div class="grid grid-cols-1 gap-6">

        <Button variant="outline" @click="connectToGitHub()">
          <Github class=" mr-2 h-4 w-4" />
          GitHub
        </Button>
      </div>
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" />
      </div>
      <div class="grid gap-2">
        <Label for="password">Password</Label>
        <Input id="password" type="password" />
      </div>
    </CardContent>
    <CardFooter>
      <Button class="w-full" @click="() => {
        toast({
          title: 'Uh oh, something went wrong',
          description: 'We do not support classical login for now, please use GitHub to sign up',
          variant: 'destructive',
        });
      }">
        Create account
      </Button>
    </CardFooter>
  </Card>
</template>
