<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowUpRight, AlertTriangle, DollarSign, Package, ShoppingCart, Sparkles, TrendingUp, Users } from 'lucide-vue-next'
import { useShopStore } from '../stores/shopStore'

const store=useShopStore()
const period=ref('Last 30 days')
const stats=computed(()=>[
 {label:'Revenue',value:'₹'+store.totalRevenue.toLocaleString('en-IN'),change:'+12.8%',icon:DollarSign,tone:'violet'},
 {label:'Orders',value:store.totalOrders.toLocaleString('en-IN'),change:'+8.4%',icon:ShoppingCart,tone:'blue'},
 {label:'Customers',value:store.totalCustomers.toLocaleString('en-IN'),change:'+5.7%',icon:Users,tone:'fuchsia'},
 {label:'Low Stock',value:store.lowStockProducts.length.toString(),change:'Needs attention',icon:Package,tone:'amber'}
])
const recentOrders=computed(()=>[...store.orders].sort((a,b)=>+new Date(b.createdAt)-+new Date(a.createdAt)).slice(0,6))
const customerName=(id:string)=>store.customers.find(c=>c.id===id)?.name??'Unknown'
const money=(n:number)=>'₹'+n.toLocaleString('en-IN')
const revenueBars=[42,58,47,69,55,76,63,84,71,91,78,96]
const topProducts=computed(()=>[...store.products].sort((a,b)=>b.sales-a.sales).slice(0,5))
const monthlyRevenue=[42000,51000,47000,62000,58000,71000,68000,79000,74000,86000,82000,94000]
const monthLabels=['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep']
const orderMix=computed(()=>[
 {label:'Delivered',value:store.orders.filter(o=>o.status==='Delivered').length},
 {label:'Processing',value:store.orders.filter(o=>o.status==='Processing').length},
 {label:'Shipped',value:store.orders.filter(o=>o.status==='Shipped').length},
 {label:'Pending',value:store.orders.filter(o=>o.status==='Pending').length},
 {label:'Other',value:store.orders.filter(o=>['Cancelled','Refunded'].includes(o.status)).length}
])
</script>

<template>
<section class="min-h-[calc(100vh-4rem)] bg-[#f7f7fc] p-5 sm:p-6 lg:p-8">
<div class="mx-auto max-w-[1500px]">
<div class="relative mb-7 overflow-hidden rounded-[28px] bg-orange-400 p-6 text-white shadow-xl shadow-orange-400/20 sm:p-8">
<div class="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl"></div><div class="absolute -bottom-20 right-24 h-48 w-48 rounded-full bg-white/10 blur-3xl"></div>
<div class="relative flex flex-wrap items-end justify-between gap-5"><div><div class="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur"><Sparkles :size="14"/> Live store overview</div><h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">Good afternoon, Admin 👋</h1><p class="mt-2 max-w-xl text-sm text-orange-50">A quick pulse on revenue, customers, orders and inventory health.</p></div><select v-model="period" class="rounded-xl border border-white/20 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white outline-none backdrop-blur"><option class="text-slate-900">Today</option><option class="text-slate-900">Last 7 days</option><option class="text-slate-900">Last 30 days</option><option class="text-slate-900">This year</option></select></div>
</div>
<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
<div v-for="stat in stats" :key="stat.label" class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10">
<div class="absolute right-0 top-0 h-20 w-20 rounded-full bg-orange-50 blur-xl transition group-hover:scale-150"></div><div class="relative flex items-center justify-between"><div :class="['grid h-11 w-11 place-items-center rounded-xl',stat.tone==='amber'?'bg-amber-50 text-amber-600':stat.tone==='blue'?'bg-blue-50 text-blue-600':stat.tone==='fuchsia'?'bg-fuchsia-50 text-fuchsia-600':'bg-orange-50 text-orange-600']"><component :is="stat.icon" :size="20"/></div><ArrowUpRight :size="17" class="text-slate-300 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-orange-500"/></div>
<p class="relative mt-5 text-sm text-slate-500">{{stat.label}}</p><p class="relative mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{{stat.value}}</p><p class="relative mt-2 flex items-center gap-1 text-xs font-bold" :class="stat.tone==='amber'?'text-amber-600':'text-emerald-600'"><AlertTriangle v-if="stat.tone==='amber'" :size="13"/><TrendingUp v-else :size="13"/>{{stat.change}}</p>
</div></div>

<div class="mt-6 grid gap-6 xl:grid-cols-3">
<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2"><div class="flex items-start justify-between"><div><h2 class="font-bold text-slate-900">Revenue overview</h2><p class="mt-1 text-sm text-slate-500">Monthly revenue trend</p></div><span class="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">12 months</span></div>
<div class="mt-6 flex h-56 items-end gap-2 sm:gap-3"><div v-for="(value,i) in monthlyRevenue" :key="monthLabels[i]" class="group relative flex h-full flex-1 items-end"><div :style="{height:(value/100000*100)+'%'}" class="w-full min-h-[10px] rounded-t-lg bg-orange-200 transition-all duration-500 group-hover:bg-orange-500 group-hover:-translate-y-1"></div><span class="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">₹{{value.toLocaleString('en-IN')}}</span></div></div>
<div class="mt-3 flex justify-between text-[10px] font-medium text-slate-400"><span v-for="m in monthLabels" :key="m">{{m}}</span></div></div>
<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 class="font-bold">Order status</h2><p class="mt-1 text-sm text-slate-500">Current fulfillment mix</p><div class="mt-6 space-y-4"><div v-for="item in orderMix" :key="item.label"><div class="mb-1.5 flex justify-between text-xs"><span class="font-semibold text-slate-600">{{item.label}}</span><span class="font-bold text-slate-900">{{item.value}}</span></div><div class="h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-orange-400 transition-all duration-700" :style="{width:(Math.max(4,item.value/Math.max(1,store.totalOrders)*100))+'%'}"></div></div></div></div></div>
</div>
<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
<div class="flex flex-wrap items-start justify-between gap-4"><div><div class="flex items-center gap-2"><h2 class="font-bold text-slate-900">Revenue performance</h2><span class="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">+12.8%</span></div><p class="mt-1 text-sm text-slate-500">{{period}} · interactive trend</p></div><p class="text-2xl font-extrabold text-slate-950">{{money(store.totalRevenue)}}</p></div>
<div class="mt-8 flex h-64 items-end gap-2 sm:gap-3">
<div v-for="(height,i) in revenueBars" :key="i" class="group flex h-full flex-1 items-end"><div :style="{height:height+'%'}" class="relative w-full rounded-t-xl bg-orange-400 transition-all duration-500 group-hover:bg-orange-500"><span class="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-lg bg-slate-950 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">₹{{Math.round(height*1320).toLocaleString('en-IN')}}</span></div></div>
</div><div class="mt-3 flex justify-between text-[11px] font-medium text-slate-400"><span>Sep 01</span><span>Sep 10</span><span>Sep 20</span></div>
</div>
<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div class="flex items-center justify-between"><div><h2 class="font-bold">Inventory alerts</h2><p class="mt-1 text-sm text-slate-500">Needs your attention</p></div><span class="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600"><AlertTriangle :size="18"/></span></div><div class="mt-5 space-y-3"><div v-for="p in store.lowStockProducts.slice(0,5)" :key="p.id" class="group flex items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:border-amber-200 hover:bg-amber-50/40"><div class="min-w-0"><p class="truncate text-sm font-semibold">{{p.name}}</p><p class="text-xs text-slate-500">{{p.stock}} units left · reorder {{p.reorderLevel}}</p></div><ArrowUpRight :size="16" class="text-slate-300 transition group-hover:text-amber-600"/></div><p v-if="!store.lowStockProducts.length" class="text-sm text-slate-500">No inventory alerts 🎉</p></div></div>
</div>

<div class="mt-6 grid gap-6 lg:grid-cols-5">
<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3"><div class="flex items-center justify-between"><div><h2 class="font-bold">Recent orders</h2><p class="mt-1 text-sm text-slate-500">Latest customer transactions</p></div><RouterLink to="/orders" class="rounded-lg px-3 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50">View all</RouterLink></div><div class="mt-5 overflow-x-auto"><table class="w-full min-w-[650px] text-left text-sm"><thead class="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400"><tr><th class="pb-3">Order</th><th class="pb-3">Customer</th><th class="pb-3">Amount</th><th class="pb-3">Status</th></tr></thead><tbody><tr v-for="r in recentOrders" :key="r.id" class="border-b border-slate-50 transition hover:bg-orange-50/30"><td class="py-4 font-bold text-slate-800">{{r.id}}</td><td class="py-4">{{customerName(r.customerId)}}</td><td class="py-4 font-bold">{{money(r.total)}}</td><td class="py-4"><span class="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">{{r.status}}</span></td></tr></tbody></table></div></div>
<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"><h2 class="font-bold">Top products</h2><p class="mt-1 text-sm text-slate-500">Best sellers by units</p><div class="mt-5 space-y-4"><div v-for="(p,i) in topProducts" :key="p.id" class="flex items-center gap-3"><span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-orange-50 text-xs font-extrabold text-orange-700">{{i+1}}</span><div class="min-w-0 flex-1"><div class="flex justify-between gap-3"><p class="truncate text-sm font-semibold">{{p.name}}</p><span class="text-xs font-bold text-slate-500">{{p.sales.toLocaleString('en-IN')}}</span></div><div class="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-orange-400 transition-all duration-700" :style="{width:Math.min(100,Math.max(8,p.sales/Math.max(1,topProducts[0]?.sales||1)*100))+'%'}"></div></div></div></div></div></div>
</div>
</div>
</section>
</template>
