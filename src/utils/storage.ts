// Storage utility for managing orders and products with localStorage

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    description: string;
}

export interface Order {
    id: string;
    name: string;
    phone: string;
    item: string;
    quantity: number;
    deliveryType: 'delivery' | 'pickup';
    status: 'pending' | 'processing' | 'completed';
    createdAt: string;
}

export interface StaffMember {
    id: number;
    name: string;
    jobRole: string;
    phone: string;
    workStatus: 'active' | 'inactive' | 'on_leave';
}

export interface StaffUser {
    email: string;
    password: string;
}

// Default staff credentials
const DEFAULT_STAFF = {
    email: 'staff@flowerlighting.com',
    password: 'admin123'
};

// Storage keys
const ORDERS_KEY = 'flower_lighting_orders';
const PRODUCTS_KEY = 'flower_lighting_products';
const STAFF_SESSION_KEY = 'flower_lighting_staff_session';

// Initialize with default products
function initializeProducts(): Product[] {
    if (typeof localStorage === 'undefined') return [];

    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (!stored) {
        const defaultProducts: Product[] = [
            {
                id: 1,
                name: 'Crystal Chandelier',
                category: 'chandeliers',
                price: 2500,
                description: 'Beautiful crystal chandelier for luxury interiors'
            },
            {
                id: 2,
                name: 'LED Ceiling Light',
                category: 'lights',
                price: 450,
                description: 'Modern LED ceiling light with adjustable brightness'
            },
            {
                id: 3,
                name: 'Wall Sconce',
                category: 'lights',
                price: 350,
                description: 'Elegant wall sconce for bedroom and hallway'
            },
            {
                id: 4,
                name: 'Electrical Wire (100m)',
                category: 'wires',
                price: 800,
                description: 'Premium quality copper wiring cable'
            },
            {
                id: 5,
                name: 'Power Adapter',
                category: 'accessories',
                price: 120,
                description: 'Universal power adapter for various devices'
            },
            {
                id: 6,
                name: 'Gold Pendant Light',
                category: 'chandeliers',
                price: 1800,
                description: 'Stylish gold-finish pendant light fixture'
            },
            {
                id: 7,
                name: 'Fiber Optic Cable',
                category: 'wires',
                price: 600,
                description: 'High-speed fiber optic cable for networks'
            },
            {
                id: 8,
                name: 'Light Switch',
                category: 'accessories',
                price: 85,
                description: 'Modern minimalist light switch'
            }
        ];
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    return JSON.parse(stored);
}

// Product Management
export function getProducts(): Product[] {
    if (typeof localStorage === 'undefined') return [];
    const stored = localStorage.getItem(PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : initializeProducts();
}

export function addProduct(product: Omit<Product, 'id'>): Product {
    if (typeof localStorage === 'undefined') throw new Error('localStorage not available');

    const products = getProducts();
    const newProduct: Product = {
        ...product,
        id: Math.max(...products.map((p) => p.id), 0) + 1
    };
    products.push(newProduct);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return newProduct;
}

export function updateProduct(id: number, updates: Partial<Product>): Product {
    if (typeof localStorage === 'undefined') throw new Error('localStorage not available');

    const products = getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');

    products[index] = { ...products[index], ...updates };
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    return products[index];
}

export function deleteProduct(id: number): void {
    if (typeof localStorage === 'undefined') throw new Error('localStorage not available');

    const products = getProducts().filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getProductById(id: number): Product | undefined {
    return getProducts().find((p) => p.id === id);
}

// Order Management
export function getOrders(): Order[] {
    if (typeof localStorage === 'undefined') return [];
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
    if (typeof localStorage === 'undefined') throw new Error('localStorage not available');

    const orders = getOrders();
    const newOrder: Order = {
        ...order,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: 'pending'
    };
    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return newOrder;
}

export function updateOrderStatus(id: string, status: Order['status']): Order {
    if (typeof localStorage === 'undefined') throw new Error('localStorage not available');

    const orders = getOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error('Order not found');

    order.status = status;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return order;
}

export function deleteOrder(id: string): void {
    if (typeof localStorage === 'undefined') throw new Error('localStorage not available');

    const orders = getOrders().filter((o) => o.id !== id);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getOrderById(id: string): Order | undefined {
    return getOrders().find((o) => o.id === id);
}

// Staff Authentication
export function loginStaff(email: string, password: string): boolean {
    if (email === DEFAULT_STAFF.email && password === DEFAULT_STAFF.password) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STAFF_SESSION_KEY, JSON.stringify({ email, loggedInAt: new Date().toISOString() }));
        }
        return true;
    }
    return false;
}

export function logoutStaff(): void {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(STAFF_SESSION_KEY);
    }
}

export function isStaffLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return !!localStorage.getItem(STAFF_SESSION_KEY);
}

export function getStaffSession(): { email: string; loggedInAt: string } | null {
    if (typeof localStorage === 'undefined') return null;
    const session = localStorage.getItem(STAFF_SESSION_KEY);
    return session ? JSON.parse(session) : null;
}
