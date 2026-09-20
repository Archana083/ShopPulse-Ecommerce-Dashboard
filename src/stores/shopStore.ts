import { defineStore } from 'pinia'
import products from '../data/products.json'
import customers from '../data/customers.json'
import orders from '../data/orders.json'
import categories from '../data/categories.json'
import type { Product, Customer, Order, Category } from '../types/ecommerce'

export const useShopStore = defineStore('shop', {
  state: () => ({
    products: products as Product[],
    customers: customers as Customer[],
    orders: orders as Order[],
    categories: categories as Category[]
  }),
  getters: {
    totalRevenue: (state) => state.orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: (state) => state.orders.length,
    totalCustomers: (state) => state.customers.length,
    lowStockProducts: (state) => state.products.filter(p => p.stock <= p.reorderLevel),
    productById: (state) => (id: string) => state.products.find(p => p.id === id),
    orderById: (state) => (id: string) => state.orders.find(o => o.id === id)
  },
  actions: {
    addProduct(product: Product) { this.products.unshift(product) },
    updateProduct(id: string, changes: Partial<Product>) {
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) this.products[index] = { ...this.products[index], ...changes }
    },
    archiveProduct(id: string) { this.updateProduct(id, { status: 'Archived' }) }
  }
})