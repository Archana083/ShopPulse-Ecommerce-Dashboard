<script setup lang="ts">
import { computed } from 'vue'
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-vue-next'
import { useShopStore } from '../stores/shopStore'
const store = useShopStore()
const stats = computed(() => [
  {label:'Total Revenue',value:'₹'+store.totalRevenue.toLocaleString('en-IN'),change:'+12.8%',icon:DollarSign},
  {label:'Total Orders',value:store.totalOrders.toLocaleString('en-IN'),change:'+8.4%',icon:ShoppingCart},
  {label:'Customers',value:store.totalCustomers.toLocaleString('en-IN'),change:'+5.7%',icon:Users},
  {label:'Low Stock',value:store.lowStockProducts.length.toString(),change:'Needs attention',icon:Package},
])
const recentOrders = computed(() => [...store.orders].sort((a,b)=>+new Date(b.createdAt)-+new Date(a.createdAt)).slice(0,6))
const customerName = (id:string) => store.customers.find(c=>c.id===id)?.name ?? 'Unknown'
const money = (n:number) => '₹'+n.toLocaleString('en-IN')
</script>

<template>
<section class="p-5 sm:p-6 lg:p-8">
  <div class="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p class="text-sm text-slate-500">Overview</p><h1 class="mt-1 text-2xl font-bold tracking-tight">Good afternoon, Admin 👋</h1><p class="mt-1 text-sm text-slate-500">Here's what's happening with your store.</p></div><select class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"><option>Last 30 days</option><option>Last 7 days</option><option>This year</option></select></div>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div v-for="stat in stats" :key="stat.label" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div class="flex items-center justify-between"><p class="text-sm text-slate-500">{{stat.label}}</p><component :is="stat.icon" :size="19" class="text-slate-400"/></div><p class="mt-3 text-2xl font-bold">{{stat.value}}</p><p class="mt-2 flex items-center gap-1 text-xs font-medium" :class="stat.label==='Low Stock'?'text-amber-600':'text-emerald-600'"><TrendingUp v-if="stat.label!=='Low Stock'" :size="14"/><AlertTriangle v-else :size="14"/>{{stat.change}}</p></div>
  </div>
  <div class="mt-6 grid gap-6 lg:grid-cols-3">
    <div class="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2"><div class="flex justify-between"><div><h2 class="font-semibold">Revenue overview</h2><p class="text-sm text-slate-500">Last 14 days</p></div><span class="text-lg font-bold">{{money(store.totalRevenue)}}</span></div><div class="mt-8 flex h-56 items-end gap-2"><div v-for="(height,i) in [35,48,42,62,55,70,64,78,68,84,73,92,80,96]" :key="i" class="flex h-full flex-1 items-end"><div :style="{height:height+'%'}" class="w-full rounded-t-md bg-slate-900 transition hover:bg-slate-700"/></div></div><div class="mt-3 flex justify-between text-xs text-slate-400"><span>Sep 07</span><span>Sep 14</span><span>Sep 20</span></div></div>
    <div class="rounded-xl border border-slate-200 bg-white p-6"><h2 class="font-semibold">Inventory alerts</h2><p class="mt-1 text-sm text-slate-500">Products below reorder level</p><div class="mt-5 space-y-3"><div v-for="p in store.lowStockProducts" :key="p.id" class="flex items-center justify-between rounded-lg bg-slate-50 p-3"><div class="min-w-0"><p class="truncate text-sm font-medium">{{p.name}}</p><p class="text-xs text-slate-500">{{p.stock}} units left</p></div><ArrowUpRight :size="16" class="text-slate-400"/></div><p v-if="!store.lowStockProducts.length" class="text-sm text-slate-500">No inventory alerts.</p></div></div>
  </div>
  <div class="mt-6 rounded-xl border border-slate-200 bg-white p-6"><div class="flex items-center justify-between"><div><h2 class="font-semibold">Recent orders</h2><p class="text-sm text-slate-500">Latest customer transactions</p></div><RouterLink to="/orders" class="text-sm font-medium hover:underline">View all</RouterLink></div><div class="mt-5 overflow-x-auto"><table class="w-full min-w-[760px] text-left text-sm"><thead class="border-b text-xs uppercase text-slate-400"><tr><th class="pb-3">Order</th><th class="pb-3">Customer</th><th class="pb-3">Amount</th><th class="pb-3">Payment</th><th class="pb-3">Status</th></tr></thead><tbody><tr v-for="r in recentOrders" :key="r.id" class="border-b last:border-0"><td class="py-4 font-medium">{{r.id}}</td><td class="py-4">{{customerName(r.customerId)}}</td><td class="py-4 font-medium">{{money(r.total)}}</td><td class="py-4 text-slate-500">{{r.paymentStatus}}</td><td class="py-4"><span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium">{{r.status}}</span></td></tr></tbody></table></div></div>
</section>
</template>