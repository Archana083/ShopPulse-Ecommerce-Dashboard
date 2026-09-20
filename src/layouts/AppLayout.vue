<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { BarChart3, Bell, ChevronDown, LayoutDashboard, Menu, Package, Users, ShoppingCart, Boxes, FileBarChart, Settings, X } from 'lucide-vue-next'

const mobileOpen = ref(false)
const navItems = [
  { label:'Dashboard', to:'/', icon:LayoutDashboard },
  { label:'Products', to:'/products', icon:Package },
  { label:'Orders', to:'/orders', icon:ShoppingCart },
  { label:'Customers', to:'/customers', icon:Users },
  { label:'Categories', to:'/categories', icon:Boxes },
  { label:'Inventory', to:'/inventory', icon:Package },
  { label:'Analytics', to:'/analytics', icon:BarChart3 },
  { label:'Reports', to:'/reports', icon:FileBarChart },
]
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <div v-if="mobileOpen" class="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" @click="mobileOpen=false" />
    <aside :class="['fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 bg-white transition-transform duration-200', mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
      <div class="flex h-16 items-center justify-between border-b px-5">
        <div class="flex items-center gap-3"><div class="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white">S</div><span class="text-lg font-bold">ShopPulse</span></div>
        <button class="rounded-lg p-2 hover:bg-slate-100 lg:hidden" @click="mobileOpen=false"><X :size="18"/></button>
      </div>
      <div class="px-4 pt-5"><p class="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Workspace</p>
        <nav class="mt-2 space-y-1">
          <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" @click="mobileOpen=false" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100 [&.router-link-exact-active]:bg-slate-900 [&.router-link-exact-active]:font-medium [&.router-link-exact-active]:text-white">
            <component :is="item.icon" :size="18"/><span>{{item.label}}</span>
          </RouterLink>
        </nav>
      </div>
      <div class="absolute bottom-0 w-full border-t p-4"><RouterLink to="/settings" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"><Settings :size="18"/>Settings</RouterLink></div>
    </aside>

    <div class="lg:pl-64">
      <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
        <button @click="mobileOpen=true" class="rounded-lg p-2 hover:bg-slate-100 lg:hidden"><Menu :size="20"/></button>
        <div class="hidden text-sm text-slate-500 lg:block">E-commerce Management</div>
        <div class="ml-auto flex items-center gap-2 sm:gap-4">
          <button class="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"><Bell :size="19"/><span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-slate-900"/></button>
          <div class="flex items-center gap-2 border-l pl-3 sm:pl-4"><div class="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-xs font-bold">AM</div><div class="hidden sm:block"><p class="text-sm font-medium">Admin</p><p class="text-[11px] text-slate-400">Administrator</p></div><ChevronDown :size="16" class="text-slate-400"/></div>
        </div>
      </header>
      <main><RouterView /></main>
    </div>
  </div>
</template>