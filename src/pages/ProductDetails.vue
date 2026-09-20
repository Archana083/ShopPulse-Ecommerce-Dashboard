<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Archive, Boxes, CalendarDays, Edit3, Package, ShoppingBag, Star, X } from 'lucide-vue-next'
import { useShopStore } from '../stores/shopStore'
import ProductForm from './ProductForm.vue'

const route=useRoute()
const router=useRouter()
const store=useShopStore()
const product=computed(()=>store.productById(route.params.id as string))
const categoryName=computed(()=>product.value?store.categories.find(c=>c.id===product.value?.categoryId)?.name??'Unknown':'')
const money=(n:number)=>'₹'+n.toLocaleString('en-IN')
const showForm=ref(false)
const showArchive=ref(false)
function archive(){if(product.value){store.archiveProduct(product.value.id);showArchive.value=false}}
</script>
<template>
<section v-if="product" class="min-h-[calc(100vh-4rem)] bg-[#f7f7fc] px-5 py-6 sm:px-6 lg:px-8"><div class="mx-auto max-w-6xl">
<button @click="router.push('/products')" class="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-700"><ArrowLeft :size="17"/> Back to products</button>
<div class="rounded-3xl border border-orange-100 bg-white p-6 shadow-xl shadow-orange-100/40 sm:p-8">
<div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"><div class="flex gap-4"><div class="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-orange-50 text-orange-700"><Package :size="28"/></div><div><div class="flex flex-wrap items-center gap-2"><span class="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">{{product.status}}</span><span class="text-xs text-slate-400">{{product.id}}</span></div><h1 class="mt-2 text-2xl font-bold text-slate-950">{{product.name}}</h1><p class="mt-1 text-sm text-slate-500">{{product.sku}} · {{categoryName}}</p></div></div>
<div class="flex gap-2"><button @click="showForm=true" class="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-orange-50 hover:text-orange-700"><Edit3 :size="16"/> Edit</button><button v-if="product.status!=='Archived'" @click="showArchive=true" class="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"><Archive :size="16"/> Archive</button></div></div>
<div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div class="kpi"><p>Price</p><strong>{{money(product.price)}}</strong><span>Selling price</span></div><div class="kpi"><p>Current stock</p><strong>{{product.stock}}</strong><span :class="product.stock<=product.reorderLevel?'!text-amber-600':''">{{product.stock<=product.reorderLevel?'Needs reorder':'Healthy level'}}</span></div><div class="kpi"><p>Total sales</p><strong>{{product.sales.toLocaleString('en-IN')}}</strong><span>Units sold</span></div><div class="kpi"><p>Rating</p><strong class="flex items-center gap-2">{{product.rating}} <Star :size="20" class="fill-amber-400 text-amber-400"/></strong><span>Customer rating</span></div></div>
</div>
<div class="mt-6 grid gap-6 lg:grid-cols-3"><div class="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2"><h2 class="font-semibold">Product information</h2><div class="mt-5 grid gap-4 sm:grid-cols-2"><div class="info"><Boxes :size="17"/><div><span>Category</span><strong>{{categoryName}}</strong></div></div><div class="info"><ShoppingBag :size="17"/><div><span>Cost price</span><strong>{{money(product.costPrice)}}</strong></div></div><div class="info"><Package :size="17"/><div><span>Reorder level</span><strong>{{product.reorderLevel}} units</strong></div></div><div class="info"><CalendarDays :size="17"/><div><span>Created</span><strong>{{new Date(product.createdAt).toLocaleDateString('en-IN')}}</strong></div></div></div></div>
<div class="rounded-2xl border border-slate-200 bg-white p-6"><h2 class="font-semibold">Inventory health</h2><div class="mt-6"><div class="flex justify-between text-xs text-slate-500"><span>Stock level</span><span>{{product.stock}} units</span></div><div class="mt-2 h-3 overflow-hidden rounded-full bg-slate-100"><div class="h-full rounded-full bg-orange-400 transition-all duration-500" :style="{width:Math.min(100,Math.max(8,product.stock/Math.max(1,product.reorderLevel*4)*100))+'%'}"/></div><p class="mt-4 text-sm text-slate-500">{{product.stock<=product.reorderLevel?'Stock is at or below the reorder threshold.':'Inventory is above the reorder threshold.'}}</p></div></div></div>
</div></section>
<section v-else class="grid min-h-[calc(100vh-4rem)] place-items-center bg-[#f7f7fc]"><div class="text-center"><Package :size="40" class="mx-auto text-slate-300"/><h1 class="mt-4 text-xl font-bold">Product not found</h1><button @click="router.push('/products')" class="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white">Back to products</button></div></section>

<ProductForm v-if="product" :is-open="showForm" :product-id="product.id" @close="showForm=false"/>
<Teleport to="body"><Transition name="confirm"><div v-if="showArchive" class="fixed inset-0 z-[110] grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" @click.self="showArchive=false"><div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div class="flex items-start justify-between"><div class="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-orange-600"><Archive :size="20"/></div><button @click="showArchive=false" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X :size="18"/></button></div><h2 class="mt-5 text-lg font-bold">Archive product?</h2><p class="mt-2 text-sm leading-6 text-slate-500">This will hide <strong class="text-slate-700">{{product?.name}}</strong> from active catalog workflows. You can still find it using the Archived filter.</p><div class="mt-6 flex justify-end gap-3"><button @click="showArchive=false" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">Cancel</button><button @click="archive" class="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Archive product</button></div></div></div></Transition></Teleport>
</template>
<style scoped>
.kpi{border-radius:1rem;background:#fff7ed;padding:1rem}.kpi p{font-size:.75rem;color:#64748b}.kpi strong{display:block;margin-top:.35rem;font-size:1.35rem;color:#0f172a}.kpi span{display:block;margin-top:.2rem;font-size:.72rem;color:#94a3b8}.info{display:flex;gap:.75rem;align-items:flex-start;border:1px solid #f1f5f9;border-radius:.9rem;padding:1rem;color:#ea580c}.info span{display:block;font-size:.72rem;color:#94a3b8}.info strong{display:block;margin-top:.2rem;font-size:.9rem;color:#334155}.confirm-enter-active,.confirm-leave-active{transition:opacity .2s ease}.confirm-enter-from,.confirm-leave-to{opacity:0}
</style>