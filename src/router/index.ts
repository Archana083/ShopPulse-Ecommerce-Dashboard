import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Products from '../pages/Products.vue'
import Orders from '../pages/Orders.vue'
import OrderDetails from '../pages/OrderDetails.vue'
import ProductDetails from '../pages/ProductDetails.vue'
import Customers from '../pages/Customers.vue'
import CustomerDetails from '../pages/CustomerDetails.vue'
import Placeholder from '../pages/Placeholder.vue'

const placeholder = (title: string, description: string) => ({
  component: Placeholder,
  props: { title, description }
})

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Dashboard },
    { path: '/products', component: Products },
    { path: '/products/:id', component: ProductDetails },
    { path: '/orders/:id', component: OrderDetails },
    { path: '/orders', component: Orders },
    { path: '/customers', component: Customers },
    { path: '/customers/:id', component: CustomerDetails },
    { path: '/categories', ...placeholder('Categories', 'Organize your catalog and monitor category performance.') },
    { path: '/inventory', ...placeholder('Inventory', 'Monitor stock levels, reorder points, and inventory movement.') },
    { path: '/analytics', ...placeholder('Analytics', 'Explore revenue, sales, customer, and product performance.') },
    { path: '/reports', ...placeholder('Reports', 'Generate business reports and export operational data.') },
    { path: '/settings', ...placeholder('Settings', 'Manage workspace preferences and administration.') }
  ]
})