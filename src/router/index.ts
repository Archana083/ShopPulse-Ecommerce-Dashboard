import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../pages/Dashboard.vue'
import Products from '../pages/Products.vue'
import Orders from '../pages/Orders.vue'
import OrderDetails from '../pages/OrderDetails.vue'
import ProductDetails from '../pages/ProductDetails.vue'
import Customers from '../pages/Customers.vue'
import CustomerDetails from '../pages/CustomerDetails.vue'
import Inventory from '../pages/Inventory.vue'
import Categories from '../pages/Categories.vue'
import Analytics from '../pages/Analytics.vue'
import Reports from '../pages/Reports.vue'
import Placeholder from '../pages/Placeholder.vue'
import Settings from '../pages/Settings.vue'
import Activity from '../pages/Activity.vue'

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
    { path: '/categories', component: Categories },
    { path: '/inventory', component: Inventory },
    { path: '/analytics', component: Analytics },
    { path: '/reports', component: Reports },
    { path: '/activity', component: Activity },
    { path: '/settings', component: Settings },
    
  ]
})