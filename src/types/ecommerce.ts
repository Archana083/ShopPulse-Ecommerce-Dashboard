export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded'
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed' | 'Refunded'
export type ProductStatus = 'Active' | 'Draft' | 'Archived'

export interface Category { id:string; name:string; slug:string }
export interface Product { id:string; sku:string; name:string; categoryId:string; price:number; costPrice:number; stock:number; reorderLevel:number; sales:number; rating:number; status:ProductStatus; createdAt:string }
export interface Customer { id:string; name:string; email:string; city:string; state:string; country:string; ordersCount:number; totalSpent:number; segment:'New'|'Returning'|'VIP'|'Inactive'; joinedAt:string }
export interface OrderItem { productId:string; quantity:number; unitPrice:number }
export interface Order { id:string; customerId:string; items:OrderItem[]; subtotal:number; discount:number; tax:number; total:number; paymentStatus:PaymentStatus; status:OrderStatus; paymentMethod:'UPI'|'Card'|'Net Banking'|'COD'|'Wallet'; createdAt:string }

export type StockMovementType = 'Restock' | 'Sale' | 'Adjustment'
export interface StockMovement { id:string; productId:string; type:StockMovementType; quantity:number; note:string; createdAt:string }
