import { defineStore } from 'pinia'
import products from '../data/products.json'
import customers from '../data/customers.json'
import orders from '../data/orders.json'
import categories from '../data/categories.json'
import type { Product, Customer, Order, Category, StockMovement, ActivityLog } from '../types/ecommerce'

const seedActivity: ActivityLog[] = [
  {id:'ACT-1001',action:'Order shipped',detail:'ORD-1048 was marked as shipped',type:'order',createdAt:'2026-09-21T13:20:00Z'},
  {id:'ACT-1002',action:'Inventory restocked',detail:'Wireless Headphones received 40 units',type:'inventory',createdAt:'2026-09-21T11:05:00Z'},
  {id:'ACT-1003',action:'Product updated',detail:'Product pricing was updated by Admin',type:'product',createdAt:'2026-09-20T16:42:00Z'},
  {id:'ACT-1004',action:'New customer',detail:'A new customer profile was created',type:'customer',createdAt:'2026-09-20T09:18:00Z'},
  {id:'ACT-1005',action:'Report exported',detail:'Sales report CSV was generated',type:'system',createdAt:'2026-09-19T14:10:00Z'}
]

export const useShopStore = defineStore('shop', {
  state: () => ({
    products: products as Product[],
    customers: customers as Customer[],
    orders: orders as Order[],
    categories: categories as Category[],
    stockMovements: [] as StockMovement[],
    activities: seedActivity,
    notifications: [
      {id:'N-1',title:'Low stock alert',detail:'6 products are below reorder level',type:'warning',read:false},
      {id:'N-2',title:'New orders',detail:'12 orders need fulfillment review',type:'order',read:false},
      {id:'N-3',title:'Daily report ready',detail:'Yesterday\'s sales report is available',type:'system',read:true}
    ] as {id:string;title:string;detail:string;type:string;read:boolean}[]
  }),
  getters: {
    totalRevenue: (state) => state.orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: (state) => state.orders.length,
    totalCustomers: (state) => state.customers.length,
    lowStockProducts: (state) => state.products.filter(p => p.stock <= p.reorderLevel),
    unreadNotifications: (state) => state.notifications.filter(n=>!n.read).length,
    productById: (state) => (id: string) => state.products.find(p => p.id === id),
    orderById: (state) => (id: string) => state.orders.find(o => o.id === id)
  },
  actions: {
    log(action:string,detail:string,type:ActivityLog['type']) {
      this.activities.unshift({id:`ACT-${Date.now()}`,action,detail,type,createdAt:new Date().toISOString()})
    },
    markNotificationRead(id:string){const n=this.notifications.find(n=>n.id===id);if(n)n.read=true},
    markAllNotificationsRead(){this.notifications.forEach(n=>n.read=true)},
    addCategory(category: Category) { this.categories.unshift(category); this.log('Category created',`${category.name} was added to the catalog`,'product') },
    updateCategory(id: string, changes: Partial<Category>) { const i=this.categories.findIndex(c=>c.id===id); if(i!==-1){this.categories[i]={...this.categories[i],...changes};this.log('Category updated','A catalog category was updated','product')} },
    deleteCategory(id: string) { if(this.products.some(p=>p.categoryId===id)) return false; this.categories=this.categories.filter(c=>c.id!==id); this.log('Category deleted','An unused catalog category was removed','product'); return true },
    addProduct(product: Product) { this.products.unshift(product); this.log('Product created',product.name+' was added to the catalog','product') },
    updateProduct(id: string, changes: Partial<Product>) {
      const index = this.products.findIndex(p => p.id === id)
      if (index !== -1) { this.products[index] = { ...this.products[index], ...changes }; this.log('Product updated','Product information was updated','product') }
    },
    archiveProduct(id: string) { this.updateProduct(id, { status: 'Archived' }) },
    adjustStock(productId: string, quantity: number, note = 'Manual stock adjustment') {
      const product = this.products.find(p => p.id === productId)
      if (!product || quantity === 0 || product.stock + quantity < 0) return false
      product.stock += quantity
      this.stockMovements.unshift({ id: `MOV-${Date.now()}`, productId, type: quantity > 0 ? 'Restock' : 'Adjustment', quantity: Math.abs(quantity), note, createdAt: new Date().toISOString() })
      this.log(quantity>0?'Inventory restocked':'Inventory adjusted',`${product.name}: ${Math.abs(quantity)} units`,'inventory')
      return true
    },
    updateOrderStatus(id: string, status: Order['status']) {
      const order = this.orders.find(o => o.id === id)
      if (order) { order.status = status; this.log('Order status changed',`${id} moved to ${status}`,'order') }
    },
    updatePaymentStatus(id: string, status: Order['paymentStatus']) {
      const order = this.orders.find(o => o.id === id)
      if (order) { order.paymentStatus = status; this.log('Payment updated',`${id} payment is ${status}`,'order') }
    }
  }
})
