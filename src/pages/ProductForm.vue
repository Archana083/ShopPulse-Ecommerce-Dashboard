<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { X, Package, Save } from 'lucide-vue-next'
import { useShopStore } from '../stores/shopStore'
import type { Product, ProductStatus } from '../types/ecommerce'

const props=defineProps<{isOpen:boolean;productId?:string}>()
const emit=defineEmits<{close:[]}>()
const store=useShopStore()
const existing=computed(()=>props.productId?store.productById(props.productId):undefined)
const isEdit=computed(()=>Boolean(props.productId&&existing.value))
const form=reactive({name:'',sku:'',categoryId:'',price:0,costPrice:0,stock:0,reorderLevel:10,rating:0,status:'Active' as ProductStatus})
const errors=ref<Record<string,string>>({})

function reset(p?:Product){
 Object.assign(form,{name:p?.name??'',sku:p?.sku??'',categoryId:p?.categoryId??'',price:p?.price??0,costPrice:p?.costPrice??0,stock:p?.stock??0,reorderLevel:p?.reorderLevel??10,rating:p?.rating??0,status:p?.status??'Active'})
 errors.value={}
}
watch(()=>[props.isOpen,props.productId],([open])=>{if(open)reset(existing.value)})
function validate(){
 errors.value={}
 if(!form.name.trim())errors.value.name='Product name is required.'
 if(!form.sku.trim())errors.value.sku='SKU is required.'
 if(!form.categoryId)errors.value.categoryId='Select a category.'
 if(form.price<=0)errors.value.price='Price must be greater than 0.'
 if(form.costPrice<0)errors.value.costPrice='Cost cannot be negative.'
 if(form.stock<0)errors.value.stock='Stock cannot be negative.'
 if(form.reorderLevel<0)errors.value.reorderLevel='Reorder level cannot be negative.'
 return Object.keys(errors.value).length===0
}
function close(){emit('close')}
function save(){
 if(!validate())return
 if(isEdit.value&&props.productId){store.updateProduct(props.productId,{...form});close();return}
 const id='PRD-'+Date.now().toString().slice(-6)
 store.addProduct({id,...form,sales:0,createdAt:new Date().toISOString()})
 close()
}
</script>

<template>
<Teleport to="body">
<Transition name="modal">
<div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" @click.self="close">
 <div class="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
  <div class="flex items-start justify-between border-b border-slate-200 px-6 py-5">
   <div><div class="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-orange-600"><Package :size="15"/> Catalog</div><h2 class="mt-1 text-xl font-bold text-slate-950">{{isEdit?'Edit product':'Add product'}}</h2><p class="mt-1 text-sm text-slate-500">{{isEdit?'Update catalog information.':'Create a product for your store catalog.'}}</p></div>
   <button @click="close" class="rounded-lg p-2 text-slate-400 transition hover:bg-orange-50 hover:text-orange-600"><X :size="19"/></button>
  </div>
  <form @submit.prevent="save" class="max-h-[calc(92vh-92px)] overflow-y-auto p-6">
   <div class="grid gap-5 md:grid-cols-2">
    <label class="md:col-span-2"><span class="label">Product name</span><input v-model="form.name" class="field" placeholder="Wireless Headphones"/><span v-if="errors.name" class="error">{{errors.name}}</span></label>
    <label><span class="label">SKU</span><input v-model="form.sku" class="field" placeholder="SKU-10001"/><span v-if="errors.sku" class="error">{{errors.sku}}</span></label>
    <label><span class="label">Category</span><select v-model="form.categoryId" class="field"><option value="">Select category</option><option v-for="c in store.categories" :key="c.id" :value="c.id">{{c.name}}</option></select><span v-if="errors.categoryId" class="error">{{errors.categoryId}}</span></label>
    <label><span class="label">Selling price</span><input v-model.number="form.price" type="number" min="0" step=".01" class="field"/><span v-if="errors.price" class="error">{{errors.price}}</span></label>
    <label><span class="label">Cost price</span><input v-model.number="form.costPrice" type="number" min="0" step=".01" class="field"/></label>
    <label><span class="label">Current stock</span><input v-model.number="form.stock" type="number" min="0" class="field"/></label>
    <label><span class="label">Reorder level</span><input v-model.number="form.reorderLevel" type="number" min="0" class="field"/></label>
    <label><span class="label">Status</span><select v-model="form.status" class="field"><option value="Active">Active</option><option value="Draft">Draft</option><option value="Archived">Archived</option></select></label>
   </div>
   <div class="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" @click="close" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="submit" class="flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"><Save :size="16"/> {{isEdit?'Save changes':'Create product'}}</button></div>
  </form>
 </div>
</div>
</Transition>
</Teleport>
</template>
<style scoped>
.label{display:block;margin-bottom:.45rem;font-size:.75rem;font-weight:600;color:#475569}.field{width:100%;border:1px solid #e2e8f0;border-radius:.75rem;padding:.65rem .8rem;font-size:.875rem;outline:none;background:#fff}.field:focus{border-color:#fb923c;box-shadow:0 0 0 3px rgba(249,115,22,.12)}.error{display:block;margin-top:.35rem;font-size:.75rem;color:#dc2626}.modal-enter-active,.modal-leave-active{transition:opacity .2s ease}.modal-enter-active>div>div,.modal-leave-active>div>div{transition:transform .2s ease,opacity .2s ease}.modal-enter-from,.modal-leave-to{opacity:0}.modal-enter-from>div>div,.modal-leave-to>div>div{transform:translateY(12px) scale(.98);opacity:0}
</style>