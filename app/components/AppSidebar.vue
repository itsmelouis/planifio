<script setup lang="ts">
import { Home, Inbox, CreditCard, Settings, UserCircle, ChartAreaIcon } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const topItems = [
  {
    title: "Overview",
    url: "/",
    icon: Home,
  },
  {
    title: "Messages",
    url: "#",
    icon: Inbox,
    disabled: true,
  },
  {
    title: "Payments",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "Statitics",
    url: "/statistics",
    icon: ChartAreaIcon,
  },
];

const bottomItems = [
  {
    title: "Accounts",
    url: "/account",
    icon: UserCircle
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Planifio</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in topItems" :key="item.title" >
              <SidebarMenuButton asChild :isActive="$route.path === item.url">
                <NuxtLink :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
            <SidebarMenuItem v-for="item in bottomItems" :key="item.title">
              <SidebarMenuButton asChild :isActive="$route.path === item.url">
                <NuxtLink :to="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>
