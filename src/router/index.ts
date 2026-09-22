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
import Login from '../pages/auth/Login.vue'
import Register from '../pages/auth/Register.vue'
import ForgotPassword from '../pages/auth/ForgotPassword.vue'
import { useAuthStore } from '../stores/authStore'

const placeholder = (title: string, description: string) => ({
  component: Placeholder,
  props: { title, description }
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: Login, meta: { public: true } },
    { path: '/register', component: Register, meta: { public: true } },
    { path: '/forgot-password', component: ForgotPassword, meta: { public: true } },
    { path: '/', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/products', meta: { requiresAuth: true }, component: Products },
    { path: '/products/:id', meta: { requiresAuth: true }, component: ProductDetails },
    { path: '/orders/:id', meta: { requiresAuth: true }, component: OrderDetails },
    { path: '/orders', meta: { requiresAuth: true }, component: Orders },
    { path: '/customers', meta: { requiresAuth: true }, component: Customers },
    { path: '/customers/:id', meta: { requiresAuth: true }, component: CustomerDetails },
    { path: '/categories', meta: { requiresAuth: true }, component: Categories },
    { path: '/inventory', meta: { requiresAuth: true }, component: Inventory },
    { path: '/analytics', meta: { requiresAuth: true }, component: Analytics },
    { path: '/reports', meta: { requiresAuth: true }, component: Reports },
    { path: '/activity', meta: { requiresAuth: true }, component: Activity },
    { path: '/settings', component: Settings, meta: { requiresAuth: true } },
    
  ]
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.public && auth.isAuthenticated && to.path !== '/forgot-password') return '/'
})

export default router
