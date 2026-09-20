<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bell, ChevronDown, DollarSign, Menu, Package, ShoppingCart, Users, TrendingUp } from 'lucide-vue-next'

const sidebarOpen = ref(true)
const period = ref('Last 30 days')

const stats = computed(() => [
  {label:'Total Revenue',value:'₹24,82,450',change:'+12.8%',icon:DollarSign},
  {label:'Total Orders',value:'18,492',change:'+8.4%',icon:ShoppingCart},
  {label:'Customers',value:'12,847',change:'+5.7%',icon:Users},
  {label:'Products Sold',value:'31,284',change:'+10.2%',icon:Package},
])
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <aside :class="['fixed inset-y-0 left-0 z-30 w-64 border-r border-slate-200 bg-white transition-transform', sidebarOpen ? 'translate-x-0' : '-translate-x-full']">
      <div class="flex h-16 items-center gap-3 border-b px-6">
        <div class="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white font-bold">S</div>
        <span class="text-lg font-bold">ShopPulse</span>
      </div>
      <nav class="space-y-1 p-4">
        <a class="block rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">Dashboard</a>
        <a v-for="item in ['Products','Orders','Customers','Categories','Inventory','Analytics','Reports']" :key="item" class="block rounded-lg px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100">{{ item }}</a>
      </nav>
    </aside>

    <main :class="['min-h-screen transition-all', sidebarOpen ? 'ml-64' : 'ml-0']">
      <header class="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/90 px-6 backdrop-blur">
        <button @click="sidebarOpen=!sidebarOpen" class="rounded-lg p-2 hover:bg-slate-100"><Menu :size="20"/></button>
        <div class="flex items-center gap-4">
          <button class="rounded-lg p-2 hover:bg-slate-100"><Bell :size="19"/></button>
          <div class="flex items-center gap-2 border-l pl-4"><div class="grid h-8 w-8 place-items-center rounded-full bg-slate-200 text-xs font-bold">AM</div><span class="text-sm font-medium">Admin</span><ChevronDown :size="16"/></div>
        </div>
      </header>

      <section class="p-6 lg:p-8">
        <div class="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p class="text-sm text-slate-500">Overview</p><h1 class="mt-1 text-2xl font-bold">Good afternoon, Admin 👋</h1><p class="mt-1 text-sm text-slate-500">Here's what's happening with your store.</p></div>
          <select v-model="period" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none"><option>Today</option><option>Last 7 days</option><option>Last 30 days</option><option>This year</option></select>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div v-for="stat in stats" :key="stat.label" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between"><p class="text-sm text-slate-500">{{stat.label}}</p><component :is="stat.icon" :size="19" class="text-slate-400"/></div>
            <p class="mt-3 text-2xl font-bold">{{stat.value}}</p><p class="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600"><TrendingUp :size="14"/>{{stat.change}} vs previous period</p>
          </div>
        </div>

        <div class="mt-6 grid gap-6 lg:grid-cols-3">
          <div class="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div class="flex justify-between"><div><h2 class="font-semibold">Revenue overview</h2><p class="text-sm text-slate-500">{{period}}</p></div><span class="text-lg font-bold">₹24.82L</span></div>
            <div class="mt-8 flex h-64 items-end gap-2">
              <div v-for="(height,i) in [35,48,42,62,55,70,64,78,68,84,73,92,80,96]" :key="i" class="group flex flex-1 items-end h-full"><div :style="{height:height+'%'}" class="w-full rounded-t-md bg-slate-900/85 transition hover:bg-slate-700"></div></div>
            </div>
            <div class="mt-3 flex justify-between text-xs text-slate-400"><span>Sep 01</span><span>Sep 15</span><span>Sep 30</span></div>
          </div>
          <div class="rounded-xl border border-slate-200 bg-white p-6"><h2 class="font-semibold">Top categories</h2><div class="mt-6 space-y-5">
            <div v-for="row in [{n:'Electronics',v:'₹8.42L',p:78},{n:'Fashion',v:'₹5.86L',p:61},{n:'Home & Living',v:'₹4.21L',p:48},{n:'Beauty',v:'₹3.15L',p:36}]" :key="row.n"><div class="mb-2 flex justify-between text-sm"><span>{{row.n}}</span><span class="font-medium">{{row.v}}</span></div><div class="h-2 rounded-full bg-slate-100"><div :style="{width:row.p+'%'}" class="h-2 rounded-full bg-slate-900"></div></div></div>
          </div></div>
        </div>

        <div class="mt-6 rounded-xl border border-slate-200 bg-white p-6"><div class="flex items-center justify-between"><div><h2 class="font-semibold">Recent orders</h2><p class="text-sm text-slate-500">Latest customer transactions</p></div><button class="text-sm font-medium text-slate-700 hover:underline">View all</button></div>
          <div class="mt-5 overflow-x-auto"><table class="w-full min-w-[700px] text-left text-sm"><thead class="border-b text-xs uppercase text-slate-400"><tr><th class="pb-3">Order</th><th class="pb-3">Customer</th><th class="pb-3">Amount</th><th class="pb-3">Payment</th><th class="pb-3">Status</th></tr></thead><tbody><tr v-for="r in [{id:'#ORD-10928',c:'Rahul Sharma',a:'₹4,999',pay:'Paid',s:'Delivered'},{id:'#ORD-10927',c:'Sneha Patel',a:'₹2,499',pay:'Paid',s:'Processing'},{id:'#ORD-10926',c:'Amit Verma',a:'₹8,750',pay:'Paid',s:'Shipped'},{id:'#ORD-10925',c:'Priya Shah',a:'₹1,899',pay:'Refunded',s:'Refunded'}]" :key="r.id" class="border-b last:border-0"><td class="py-4 font-medium">{{r.id}}</td><td class="py-4">{{r.c}}</td><td class="py-4 font-medium">{{r.a}}</td><td class="py-4 text-slate-500">{{r.pay}}</td><td class="py-4"><span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium">{{r.s}}</span></td></tr></tbody></table></div>
        </div>
      </section>
    </main>
  </div>
</template>