<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Package, Save } from 'lucide-vue-next'
import { useShopStore } from '../stores/shopStore'
import type { Product, ProductStatus } from '../types/ecommerce'

const route = useRoute()
const router = useRouter()
const store = useShopStore()
const editingId = computed(() => route.params.id as string | undefined)
const existing = computed(() => editingId.value ? store.productById(editingId.value) : undefined)
const isEdit = computed(() => Boolean(editingId.value && existing.value))
const form = reactive({name:'',sku:'',categoryId:'',price:0,costPrice:0,stock:0,reorderLevel:10,rating:0,status:'Active' as ProductStatus})
const errors = ref<Record<string,string>>({})
function load(p?: Product) { if (!p) return; Object.assign(form,{name:p.name,sku:p.sku,categoryId:p.categoryId,price:p.price,costPrice:p.costPrice,stock:p.stock,reorderLevel:p.reorderLevel,rating:p.rating,status:p.status}) }
load(existing.value)
function validate() {
 errors.value={}
 if(!form.name.trim()) errors.value.name='Product name is required.'
 if(!form.sku.trim()) errors.value.sku='SKU is required.'
 if(!form.categoryId) errors.value.categoryId='Select a category.'
 if(form.price<=0) errors.value.price='Price must be greater than 0.'
 if(form.costPrice<0) errors.value.costPrice='Cost cannot be negative.'
 if(form.stock<0) errors.value.stock='Stock cannot be negative.'
 if(form.reorderLevel<0) errors.value.reorderLevel='Reorder level cannot be negative.'
 return Object.keys(errors.value).length===0
}
function save() {
 if(!validate()) return
 if(isEdit.value && editingId.value){ store.updateProduct(editingId.value,{...form}); router.push('/products/'+editingId.value); return }
 const id='PRD-'+Date.now().toString().slice(-6)
 store.addProduct({id,...form,sales:0,createdAt:new Date().toISOString()})
 router.push('/products/'+id)
}
</script>
<template>
<section class="min-h-[calc(100vh-4rem)] bg-[#f7f7fc] px-5 py-6 sm:px-6 lg:px-8">
<div class="mx-auto max-w-5xl">
<button @click="router.push('/products')" class="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-700"><ArrowLeft :size="17"/> Back to products</button>
<div class="mb-7"><div class="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-orange-600"><Package :size="15"/> Catalog</div><h1 class="text-3xl font-bold tracking-tight text-slate-950">{{isEdit?'Edit product':'Add product'}}</h1><p class="mt-1 text-sm text-slate-500">{{isEdit?'Update your catalog information.':'Create a product for your store catalog.'}}</p></div>
<form @submit.prevent="save" class="space-y-5">
<div class="card"><h2 class="font-semibold">Basic information</h2><div class="mt-5 grid gap-5 md:grid-cols-2">
<label class="md:col-span-2"><span class="label">Product name</span><input v-model="form.name" class="field" placeholder="Wireless Headphones"/><span v-if="errors.name" class="error">{{errors.name}}</span></label>
<label><span class="label">SKU</span><input v-model="form.sku" class="field" placeholder="SKU-10001"/><span v-if="errors.sku" class="error">{{errors.sku}}</span></label>
<label><span class="label">Category</span><select v-model="form.categoryId" class="field"><option value="">Select category</option><option v-for="c in store.categories" :key="c.id" :value="c.id">{{c.name}}</option></select><span v-if="errors.categoryId" class="error">{{errors.categoryId}}</span></label>
</div></div>
<div class="card"><h2 class="font-semibold">Pricing & inventory</h2><div class="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
<label><span class="label">Selling price</span><input v-model.number="form.price" type="number" min="0" step=".01" class="field"/><span v-if="errors.price" class="error">{{errors.price}}</span></label>
<label><span class="label">Cost price</span><input v-model.number="form.costPrice" type="number" min="0" step=".01" class="field"/></label>
<label><span class="label">Current stock</span><input v-model.number="form.stock" type="number" min="0" class="field"/></label>
<label><span class="label">Reorder level</span><input v-model.number="form.reorderLevel" type="number" min="0" class="field"/></label>
</div></div>
<div class="card"><h2 class="font-semibold">Publishing</h2><label class="mt-5 block max-w-sm"><span class="label">Status</span><select v-model="form.status" class="field"><option value="Active">Active</option><option value="Draft">Draft</option><option value="Archived">Archived</option></select></label></div>
<div class="flex justify-end gap-3 pb-6"><button type="button" @click="router.push(isEdit&&editingId?'/products/'+editingId:'/products')" class="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button type="submit" class="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600"><Save :size="16"/> {{isEdit?'Save changes':'Create product'}}</button></div>
</form></div></section>
</template>
<style scoped>
.card{border:1px solid #e2e8f0;border-radius:1.25rem;background:#fff;padding:1.5rem;box-shadow:0 18px 45px -34px rgba(76,29,149,.5)}
.label{display:block;margin-bottom:.45rem;font-size:.75rem;font-weight:600;color:#475569}.field{width:100%;border:1px solid #e2e8f0;border-radius:.75rem;padding:.65rem .8rem;font-size:.875rem;outline:none;background:#fff}.field:focus{border-color:#8b5cf6;box-shadow:0 0 0 3px rgba(249,115,22,.12)}.error{display:block;margin-top:.35rem;font-size:.75rem;color:#dc2626}
</style>