<script setup lang="ts">
import { ref } from 'vue'
import { Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter(); const auth = useAuthStore()
const email = ref(''); const password = ref(''); const showPassword = ref(false); const remember = ref(false); const error = ref('')
const submit = () => { error.value=''; const result=auth.login(email.value.trim(),password.value); if(result.ok) router.push('/'); else error.value=result.message || 'Unable to sign in.' }
</script>
<template>
<div class="min-h-screen bg-[#f8f8fb] text-slate-900">
 <div class="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
  <section class="relative hidden overflow-hidden bg-orange-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
   <div class="absolute -right-28 -top-28 h-72 w-72 rounded-full border-[60px] border-white/10"></div><div class="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[70px] border-white/10"></div>
   <div class="relative"><div class="flex items-center gap-3"><div class="grid h-11 w-11 place-items-center rounded-2xl bg-white text-lg font-black text-orange-500">S</div><span class="text-xl font-black tracking-tight">ShopPulse</span></div><div class="mt-24 max-w-lg"><p class="text-sm font-bold uppercase tracking-[.2em] text-orange-100">Commerce OS</p><h1 class="mt-4 text-5xl font-black leading-[1.05] tracking-tight">Run your store with clarity.</h1><p class="mt-6 max-w-md text-base leading-7 text-orange-50">One workspace for products, orders, customers, inventory and business analytics.</p></div></div>
   <div class="relative flex items-center gap-3 text-sm text-orange-50"><ShieldCheck :size="18"/> Secure workspace access</div>
  </section>
  <section class="flex items-center justify-center p-6 sm:p-10"><div class="w-full max-w-md">
   <div class="mb-8 lg:hidden"><div class="flex items-center gap-3"><div class="grid h-10 w-10 place-items-center rounded-xl bg-orange-500 font-black text-white">S</div><span class="text-xl font-black">ShopPulse</span></div></div>
   <div><p class="text-sm font-semibold text-orange-600">Welcome back</p><h2 class="mt-1 text-3xl font-black tracking-tight">Sign in to ShopPulse</h2><p class="mt-2 text-sm text-slate-500">Manage your commerce workspace from one place.</p></div>
   <form class="mt-8 space-y-5" @submit.prevent="submit">
    <div><label class="mb-2 block text-sm font-semibold">Email</label><input v-model="email" type="email" required autocomplete="email" placeholder="you@company.com" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"/></div>
    <div><div class="mb-2 flex items-center justify-between"><label class="text-sm font-semibold">Password</label><button type="button" @click="router.push('/forgot-password')" class="text-xs font-bold text-orange-600 hover:text-orange-700">Forgot password?</button></div><div class="relative"><input v-model="password" :type="showPassword?'text':'password'" required autocomplete="current-password" placeholder="Enter your password" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"/><button type="button" @click="showPassword=!showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><EyeOff v-if="showPassword" :size="18"/><Eye v-else :size="18"/></button></div></div>
    <label class="flex items-center gap-2 text-xs text-slate-500"><input v-model="remember" type="checkbox" class="accent-orange-500"/> Remember me on this device</label>
    <p v-if="error" class="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">{{error}}</p>
    <button :disabled="auth.loading" class="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:opacity-60">{{auth.loading?'Signing in...':'Sign in'}} <ArrowRight :size="17"/></button>
   </form>
   <p class="mt-7 text-center text-sm text-slate-500">New to ShopPulse? <button @click="router.push('/register')" class="font-bold text-orange-600 hover:text-orange-700">Create an account</button></p>
   <p class="mt-8 text-center text-[11px] text-slate-400">Demo access: admin@shoppulse.com · any password</p>
  </div></section>
 </div>
</div>
</template>
