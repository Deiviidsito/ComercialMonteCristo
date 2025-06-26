export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'vendedor';
  createdAt: Date;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  businessName: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  isBlocked: boolean;
  quotationCount: number;
  purchaseCount: number;
  totalPurchases: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuotationItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface Quotation {
  id: string;
  number: string;
  clientId: string;
  client: Client;
  items: QuotationItem[];
  subtotal: number;
  iva: number;
  total: number;
  deliveryAddress: string;
  deliveryCost: number;
  validUntil: Date;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  notes: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  respondedAt?: Date;
}

export interface Invoice {
  id: string;
  quotationId: string;
  number: string;
  clientId: string;
  total: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  createdAt: Date;
}

export interface DeliveryGuide {
  id: string;
  quotationId: string;
  number: string;
  clientId: string;
  deliveryAddress: string;
  status: 'pending' | 'in_transit' | 'delivered';
  createdAt: Date;
  deliveredAt?: Date;
}