<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Plus, SlidersHorizontal, PackageOpen, ArrowUpDown, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
import { useShopStore } from '../stores/shopStore'
const store=useShopStore()
const router=useRouter()
const openNew=()=>router.push('/products/new')
const openDetails=(id:string)=>router.push('/products/'+id)
const search=ref('')
const category=ref('All')
const status=ref('All')
const stock=ref('All')
const sortKey=ref<'name'|'price'|'stock'|'sales'|'rating'>('name')
const sortDir=ref<'asc'|'desc'>('asc')
const page=ref(1)
const perPage=10
const filtered=computed(()=>{
 const rows=store.products.filter(p=>(!search.value||[p.name,p.sku,p.id].some(v=>v.toLowerCase().includes(search.value.toLowerCase())))&&(category.value==='All'||p.categoryId===category.value)&&(status.value==='All'||p.status===status.value)&&(stock.value==='All'||(stock.value==='Low'?p.stock<=p.reorderLevel:stock.value==='In Stock'?p.stock>p.reorderLevel:true)))
 return [...rows].sort((a,b)=>{const av=a[sortKey.value],bv=b[sortKey.value]; const result=typeof av==='string'?av.localeCompare(bv as string):Number(av)-Number(bv); return sortDir.value==='asc'?result:-result})
})
const totalPages=computed(()=>Math.max(1,Math.ceil(filtered.value.length/perPage)))
const paginated=computed(()=>filtered.value.slice((page.value-1)*perPage,page.value*perPage))
const categoryName=(id:string)=>store.categories.find(c=>c.id===id)?.name??'Unknown'
const money=(n:number)=>'₹'+n.toLocaleString('en-IN')
const changePage=(n:number)=>page.value=Math.min(totalPages.value,Math.max(1,n))
const sort=(key:'name'|'price'|'stock'|'sales'|'rating')=>{if(sortKey.value===key)sortDir.value=sortDir.value==='asc'?'desc':'asc';else{sortKey.value=key;sortDir.value='asc'}}
const reset=()=>{search.value='';category.value='All';status.value='All';stock.value='All';page.value=1}
const hasFilters=computed(()=>!!search.value||category.value!=='All'||status.value!=='All'||stock.value!=='All')
</script>
<template>
<section class="p-5 sm:p-6 lg:p-8">
 <div class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-sm text-slate-500">Catalog</p><h1 class="mt-1 text-2xl font-bold">Products</h1><p class="mt-1 text-sm text-slate-500">Manage your product catalog, pricing and stock.</p></div><button @click="openNew" class="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-orange-500/30"><Plus :size="17"/> Add product</button></div>
 <div class="mt-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4"><div class="relative min-w-[240px] flex-1"><Search :size="17" class="absolute left-3 top-2.5 text-slate-400"/><input v-model="search" @input="page=1" placeholder="Search product, SKU or ID..." class="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-orange-400"/></div><select v-model="category" @change="page=1" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="All">All categories</option><option v-for="c in store.categories" :key="c.id" :value="c.id">{{c.name}}</option></select><select v-model="status" @change="page=1" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="All">All statuses</option><option value="Active">Active</option><option value="Draft">Draft</option><option value="Archived">Archived</option></select><select v-model="stock" @change="page=1" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="All">All stock</option><option value="Low">Low stock</option><option value="In Stock">In stock</option></select><button v-if="hasFilters" @click="reset" class="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"><X :size="15"/> Clear</button><button class="rounded-lg border border-slate-200 px-3 py-2 text-sm"><SlidersHorizontal :size="16"/></button></div>
 <div class="mt-4 flex items-center justify-between text-sm text-slate-500"><span>{{filtered.length.toLocaleString('en-IN')}} products</span><span>Page {{page}} of {{totalPages}}</span></div>
 <div class="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white"><div class="overflow-x-auto"><table class="w-full min-w-[980px] text-left text-sm"><thead class="bg-orange-50/70 text-xs uppercase text-slate-500"><tr><th class="px-5 py-3">Product</th><th class="px-5 py-3">SKU</th><th class="px-5 py-3">Category</th><th class="px-5 py-3 cursor-pointer" @click="sort('price')">Price <ArrowUpDown :size="13" class="inline"/></th><th class="px-5 py-3 cursor-pointer" @click="sort('stock')">Stock <ArrowUpDown :size="13" class="inline"/></th><th class="px-5 py-3 cursor-pointer" @click="sort('sales')">Sales <ArrowUpDown :size="13" class="inline"/></th><th class="px-5 py-3 cursor-pointer" @click="sort('rating')">Rating <ArrowUpDown :size="13" class="inline"/></th><th class="px-5 py-3">Status</th></tr></thead><tbody><tr v-for="p in paginated" :key="p.id" @click="openDetails(p.id)" class="cursor-pointer border-t transition hover:bg-orange-50/50"><td class="px-5 py-4"><div class="flex items-center gap-3"><div class="grid h-9 w-9 place-items-center rounded-lg bg-orange-50 text-violet-600"><PackageOpen :size="17" class="text-orange-500"/></div><div><p class="font-semibold text-slate-800 hover:text-orange-700">{{p.name}}</p><p class="text-xs text-slate-400">{{p.id}}</p></div></div></td><td class="px-5 py-4 text-slate-500">{{p.sku}}</td><td class="px-5 py-4">{{categoryName(p.categoryId)}}</td><td class="px-5 py-4 font-medium">{{money(p.price)}}</td><td class="px-5 py-4"><span :class="p.stock<=p.reorderLevel?'font-semibold text-amber-600':''">{{p.stock}}<span v-if="p.stock<=p.reorderLevel" class="ml-1 text-xs">Low</span></span></td><td class="px-5 py-4">{{p.sales.toLocaleString('en-IN')}}</td><td class="px-5 py-4">★ {{p.rating}}</td><td class="px-5 py-4"><span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium">{{p.status}}</span></td></tr><tr v-if="!paginated.length"><td colspan="8" class="py-16 text-center text-slate-500">No products match your filters.</td></tr></tbody></table></div><div class="flex items-center justify-between border-t px-5 py-4"><span class="text-xs text-slate-400">Showing {{filtered.length?((page-1)*perPage+1):0}}–{{Math.min(page*perPage,filtered.length)}} of {{filtered.length}}</span><div class="flex items-center gap-1"><button @click="changePage(page-1)" :disabled="page===1" class="grid h-8 w-8 place-items-center rounded-md hover:bg-orange-50 disabled:opacity-30"><ChevronLeft :size="16"/></button><button v-for="n in totalPages" :key="n" @click="changePage(n)" :class="['h-8 min-w-8 rounded-md px-2 text-sm',page===n?'bg-orange-500 text-white':'hover:bg-orange-50']">{{n}}</button><button @click="changePage(page+1)" :disabled="page===totalPages" class="grid h-8 w-8 place-items-center rounded-md hover:bg-orange-50 disabled:opacity-30"><ChevronRight :size="16"/></button></div></div></div>
</section>
</template>