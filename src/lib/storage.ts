import { Product, Order, Announcement, CartItem } from '@/types';
import { SAMPLE_PRODUCTS, SAMPLE_ANNOUNCEMENTS } from '@/constants';

const KEYS = {
  products: 'versatile_products',
  orders: 'versatile_orders',
  announcements: 'versatile_announcements',
  cart: 'versatile_cart',
  adminAuth: 'versatile_admin_auth',
  productsInit: 'versatile_products_init',
  announcementsInit: 'versatile_announcements_init',
};

function get<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function set<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// Initialize sample data only once
function initProducts(): Product[] {
  const initialized = localStorage.getItem(KEYS.productsInit);
  if (!initialized) {
    set(KEYS.products, SAMPLE_PRODUCTS);
    localStorage.setItem(KEYS.productsInit, 'true');
    return SAMPLE_PRODUCTS;
  }
  return get<Product[]>(KEYS.products, SAMPLE_PRODUCTS);
}

function initAnnouncements(): Announcement[] {
  const initialized = localStorage.getItem(KEYS.announcementsInit);
  if (!initialized) {
    set(KEYS.announcements, SAMPLE_ANNOUNCEMENTS);
    localStorage.setItem(KEYS.announcementsInit, 'true');
    return SAMPLE_ANNOUNCEMENTS;
  }
  return get<Announcement[]>(KEYS.announcements, SAMPLE_ANNOUNCEMENTS);
}

// Products
export const getProducts = (): Product[] => initProducts();
export const saveProducts = (p: Product[]) => set(KEYS.products, p);
export const addProduct = (p: Product) => {
  const current = getProducts();
  saveProducts([...current, p]);
};
export const updateProduct = (p: Product) => saveProducts(getProducts().map(x => x.id === p.id ? p : x));
export const deleteProduct = (id: string) => saveProducts(getProducts().filter(x => x.id !== id));

// Orders
export const getOrders = (): Order[] => get<Order[]>(KEYS.orders, []);
export const saveOrders = (o: Order[]) => set(KEYS.orders, o);
export const addOrder = (o: Order) => {
  const current = getOrders();
  saveOrders([o, ...current]);
};
export const updateOrder = (o: Order) => saveOrders(getOrders().map(x => x.id === o.id ? o : x));

// Announcements
export const getAnnouncements = (): Announcement[] => initAnnouncements();
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
