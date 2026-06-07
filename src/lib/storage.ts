import { Product, Order, Announcement, CartItem } from '@/types';
import { SAMPLE_PRODUCTS, SAMPLE_ANNOUNCEMENTS } from '@/constants';

const KEYS = {
  products: 'versatile_products',
  orders: 'versatile_orders',
  announcements: 'versatile_announcements',
  cart: 'versatile_cart',
  adminAuth: 'versatile_admin_auth',
};

function get<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function set<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Products
export const getProducts = (): Product[] => get<Product[]>(KEYS.products, SAMPLE_PRODUCTS);
export const saveProducts = (p: Product[]) => set(KEYS.products, p);
export const addProduct = (p: Product) => saveProducts([...getProducts(), p]);
export const updateProduct = (p: Product) => saveProducts(getProducts().map(x => x.id === p.id ? p : x));
export const deleteProduct = (id: string) => saveProducts(getProducts().filter(x => x.id !== id));

// Orders
export const getOrders = (): Order[] => get<Order[]>(KEYS.orders, []);
export const saveOrders = (o: Order[]) => set(KEYS.orders, o);
export const addOrder = (o: Order) => saveOrders([o, ...getOrders()]);
export const updateOrder = (o: Order) => saveOrders(getOrders().map(x => x.id === o.id ? o : x));

// Announcements
export const getAnnouncements = (): Announcement[] => get<Announcement[]>(KEYS.announcements, SAMPLE_ANNOUNCEMENTS);
export const saveAnnouncements = (a: Announcement[]) => set(KEYS.announcements, a);
export const addAnnouncement = (a: Announcement) => saveAnnouncements([...getAnnouncements(), a]);
export const updateAnnouncement = (a: Announcement) => saveAnnouncements(getAnnouncements().map(x => x.id === a.id ? a : x));
export const deleteAnnouncement = (id: string) => saveAnnouncements(getAnnouncements().filter(x => x.id !== id));

// Cart
export const getCart = (): CartItem[] => get<CartItem[]>(KEYS.cart, []);
export const saveCart = (c: CartItem[]) => set(KEYS.cart, c);

// Admin
export const setAdminAuth = (v: boolean) => set(KEYS.adminAuth, v);
export const getAdminAuth = (): boolean => get<boolean>(KEYS.adminAuth, false);
export const clearAdminAuth = () => localStorage.removeItem(KEYS.adminAuth);
