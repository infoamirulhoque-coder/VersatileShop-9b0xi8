import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Megaphone, LogOut, Plus, Trash2,
  Edit3, Save, X, Image as ImageIcon, Tag, Star, Eye, ChevronDown, Bell, AlertCircle, CheckCircle, TrendingUp, Users
} from 'lucide-react';
import {
  getProducts, saveProducts, addProduct, updateProduct, deleteProduct,
  getOrders, updateOrder, getAnnouncements, addAnnouncement, updateAnnouncement,
  deleteAnnouncement, getAdminAuth, clearAdminAuth
} from '@/lib/storage';
import { Product, Order, Announcement } from '@/types';
import { CATEGORIES, LOGO_URL } from '@/constants';
import { generateId, formatPriceEn, formatDateEn, cn } from '@/lib/utils';
import { toast } from 'sonner';

type Tab = 'overview' | 'products' | 'orders' | 'announcements';

const EMPTY_PRODUCT: Omit<Product, 'id' | 'createdAt'> = {
  name: '', nameBn: '', price: 0, category: 'cap', images: [], description: '', descriptionBn: '', stock: 10, featured: false,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'createdAt'>>(EMPTY_PRODUCT);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newImgUrl, setNewImgUrl] = useState('');
  const [editImgUrl, setEditImgUrl] = useState('');
  const [newAnnouncement, setNewAnnouncement] = useState({ text: '', textBn: '', type: 'info' as Announcement['type'] });
  const [showAddAnn, setShowAddAnn] = useState(false);

  useEffect(() => {
    if (!getAdminAuth()) { navigate('/admin'); return; }
    refresh();
  }, []);

  const refresh = () => {
    setProducts(getProducts());
    setOrders(getOrders());
    setAnnouncements(getAnnouncements());
  };

  const handleLogout = () => {
    clearAdminAuth();
    toast.success('লগআউট সফল।');
    navigate('/admin');
  };

  // Products
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.nameBn || newProduct.price <= 0) {
      toast.error('সব তথ্য সঠিকভাবে পূরণ করুন।'); return;
    }
    const p: Product = { ...newProduct, id: generateId(), createdAt: new Date().toISOString() };
    addProduct(p);
    refresh();
    setShowAddProduct(false);
    setNewProduct(EMPTY_PRODUCT);
    setNewImgUrl('');
    toast.success('পণ্য যোগ করা হয়েছে!');
  };

  const handleUpdateProduct = () => {
    if (!editProduct) return;
    updateProduct(editProduct);
    refresh();
    setEditProduct(null);
    toast.success('পণ্য আপডেট হয়েছে!');
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm('এই পণ্যটি মুছে ফেলবেন?')) return;
    deleteProduct(id);
    refresh();
    toast.success('পণ্য মুছে ফেলা হয়েছে!');
  };

  // Orders
  const handleUpdateOrderStatus = (order: Order, status: Order['status']) => {
    updateOrder({ ...order, status });
    refresh();
    toast.success('অর্ডার স্ট্যাটাস আপডেট হয়েছে!');
  };

  // Announcements
  const handleAddAnnouncement = () => {
    if (!newAnnouncement.text || !newAnnouncement.textBn) { toast.error('উভয় ভাষায় টেক্সট দিন।'); return; }
    const a: Announcement = { id: generateId(), ...newAnnouncement, active: true, createdAt: new Date().toISOString() };
    addAnnouncement(a);
    refresh();
    setNewAnnouncement({ text: '', textBn: '', type: 'info' });
    setShowAddAnn(false);
    toast.success('ঘোষণা যোগ করা হয়েছে!');
  };

  const handleToggleAnnouncement = (a: Announcement) => {
    updateAnnouncement({ ...a, active: !a.active });
    refresh();
  };

  const handleDeleteAnnouncement = (id: string) => {
    deleteAnnouncement(id);
    refresh();
    toast.success('ঘোষণা মুছে ফেলা হয়েছে!');
  };

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'ওভারভিউ', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', label: 'পণ্য', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: 'অর্ডার', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'announcements', label: 'ঘোষণা', icon: <Megaphone className="w-4 h-4" /> },
  ];

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary bangla";

  const statusColors: Record<Order['status'], string> = {
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  const statusLabels: Record<Order['status'], string> = {
    pending: 'অপেক্ষমাণ', confirmed: 'কনফার্ম', shipped: 'শিপড', delivered: 'ডেলিভারড', cancelled: 'বাতিল',
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <div className="w-16 md:w-56 bg-slate-900 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-3 md:p-4 border-b border-slate-800">
          <img src={LOGO_URL} alt="Logo" className="h-8 md:h-10 w-auto object-contain mx-auto md:mx-0" />
        </div>
        <nav className="flex-1 p-2 md:p-3 space-y-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn("w-full flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-xl transition-all duration-200 bangla text-sm font-medium",
                tab === t.id ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white")}>
              {t.icon}
              <span className="hidden md:block">{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-2 md:p-3 border-t border-slate-800">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all bangla text-sm">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:block">লগআউট</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-4 md:px-6 py-4 flex items-center justify-between z-10">
          <h1 className="bangla font-bold text-lg">
            {tabs.find(t => t.id === tab)?.label}
          </h1>
          {pendingOrders > 0 && (
            <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-full text-xs font-semibold bangla">
              <Bell className="w-3.5 h-3.5" /> {pendingOrders}টি নতুন অর্ডার
            </div>
          )}
        </div>

        <div className="p-4 md:p-6">
          {/* ===== OVERVIEW ===== */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'মোট পণ্য', value: products.length, icon: <Package className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                  { label: 'মোট অর্ডার', value: orders.length, icon: <ShoppingBag className="w-5 h-5" />, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
                  { label: 'অপেক্ষমাণ', value: pendingOrders, icon: <AlertCircle className="w-5 h-5" />, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
                  { label: 'মোট আয়', value: formatPriceEn(totalRevenue), icon: <TrendingUp className="w-5 h-5" />, color: 'text-primary', bg: 'bg-primary/10' },
                ].map((s, i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>{s.icon}</div>
                    <div>
                      <p className="bangla text-2xl font-extrabold">{s.value}</p>
                      <p className="bangla text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Recent Orders */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="bangla font-bold mb-4">সাম্প্রতিক অর্ডার</h3>
                {orders.slice(0, 5).length === 0 ? (
                  <p className="bangla text-muted-foreground text-sm text-center py-6">কোনো অর্ডার নেই।</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="bangla font-semibold text-sm">{o.customer.name}</p>
                          <p className="bangla text-xs text-muted-foreground">{o.customer.phone} · {o.customer.district}</p>
                        </div>
                        <span className="font-bold text-sm text-primary">{formatPriceEn(o.totalAmount)}</span>
                        <span className={`bangla px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[o.status]}`}>
                          {statusLabels[o.status]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== PRODUCTS ===== */}
          {tab === 'products' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="bangla text-sm text-muted-foreground">মোট {products.length}টি পণ্য</p>
                <button onClick={() => setShowAddProduct(true)}
                  className="btn-primary text-white px-4 py-2.5 rounded-xl font-semibold bangla flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> পণ্য যোগ করুন
                </button>
              </div>

              {/* Add Product Modal */}
              {showAddProduct && (
                <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4">
                  <div className="bg-background rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="bangla font-bold text-lg">নতুন পণ্য যোগ করুন</h3>
                      <button onClick={() => setShowAddProduct(false)} className="p-2 rounded-full hover:bg-muted"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="bangla text-sm font-semibold mb-1 block">পণ্যের নাম (বাংলা) *</label>
                        <input value={newProduct.nameBn} onChange={e => setNewProduct({ ...newProduct, nameBn: e.target.value })} className={inputCls} placeholder="যেমন: নীল টি-শার্ট" /></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">Product Name (English) *</label>
                        <input value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className={inputCls} placeholder="e.g: Blue T-Shirt" /></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">মূল্য (৳) *</label>
                        <input type="number" value={newProduct.price || ''} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className={inputCls} placeholder="0" /></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">আসল মূল্য (৳, ঐচ্ছিক)</label>
                        <input type="number" value={newProduct.originalPrice || ''} onChange={e => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) || undefined })} className={inputCls} placeholder="0" /></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">বিভাগ *</label>
                        <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className={`${inputCls} cursor-pointer`}>
                          {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                        </select></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">স্টক</label>
                        <input type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className={inputCls} /></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">ব্যাজ</label>
                        <select value={newProduct.badge || ''} onChange={e => setNewProduct({ ...newProduct, badge: (e.target.value as Product['badge']) || undefined })} className={`${inputCls} cursor-pointer`}>
                          <option value="">কোনোটি নয়</option>
                          <option value="new">নতুন</option>
                          <option value="hot">হট 🔥</option>
                          <option value="sale">সেল</option>
                        </select></div>
                      <div className="flex items-center gap-3 pt-5">
                        <input type="checkbox" id="featuredNew" checked={newProduct.featured} onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })} className="w-4 h-4 accent-primary" />
                        <label htmlFor="featuredNew" className="bangla text-sm font-medium">ফিচার্ড পণ্য</label>
                      </div>
                      <div className="sm:col-span-2"><label className="bangla text-sm font-semibold mb-1 block">বিবরণ (বাংলা)</label>
                        <textarea value={newProduct.descriptionBn} onChange={e => setNewProduct({ ...newProduct, descriptionBn: e.target.value })} rows={2} className={`${inputCls} resize-none`} /></div>
                      <div className="sm:col-span-2"><label className="bangla text-sm font-semibold mb-1 block">Description (English)</label>
                        <textarea value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} rows={2} className={`${inputCls} resize-none`} /></div>
                      <div className="sm:col-span-2">
                        <label className="bangla text-sm font-semibold mb-1 block">পণ্যের ছবির URL</label>
                        <div className="flex gap-2 mb-2">
                          <input value={newImgUrl} onChange={e => setNewImgUrl(e.target.value)} placeholder="https://..." className={`flex-1 ${inputCls}`} />
                          <button onClick={() => { if (newImgUrl) { setNewProduct({ ...newProduct, images: [...newProduct.images, newImgUrl] }); setNewImgUrl(''); } }}
                            className="px-3 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newProduct.images.map((img, i) => (
                            <div key={i} className="relative w-16 h-16">
                              <img src={img} alt="" className="w-full h-full object-cover rounded-xl border border-border" />
                              <button onClick={() => setNewProduct({ ...newProduct, images: newProduct.images.filter((_, j) => j !== i) })}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => setShowAddProduct(false)} className="flex-1 py-2.5 rounded-xl border border-border bangla font-semibold hover:bg-muted">বাতিল</button>
                      <button onClick={handleAddProduct} className="flex-1 btn-primary text-white py-2.5 rounded-xl font-bold bangla">পণ্য যোগ করুন</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Product Modal */}
              {editProduct && (
                <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4">
                  <div className="bg-background rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="bangla font-bold text-lg">পণ্য সম্পাদনা</h3>
                      <button onClick={() => setEditProduct(null)} className="p-2 rounded-full hover:bg-muted"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div><label className="bangla text-sm font-semibold mb-1 block">পণ্যের নাম (বাংলা)</label>
                        <input value={editProduct.nameBn} onChange={e => setEditProduct({ ...editProduct, nameBn: e.target.value })} className={inputCls} /></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">Product Name (English)</label>
                        <input value={editProduct.name} onChange={e => setEditProduct({ ...editProduct, name: e.target.value })} className={inputCls} /></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">মূল্য (৳)</label>
                        <input type="number" value={editProduct.price} onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) })} className={inputCls} /></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">আসল মূল্য (৳)</label>
                        <input type="number" value={editProduct.originalPrice || ''} onChange={e => setEditProduct({ ...editProduct, originalPrice: Number(e.target.value) || undefined })} className={inputCls} /></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">বিভাগ</label>
                        <select value={editProduct.category} onChange={e => setEditProduct({ ...editProduct, category: e.target.value })} className={`${inputCls} cursor-pointer`}>
                          {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.nameBn}</option>)}
                        </select></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">স্টক</label>
                        <input type="number" value={editProduct.stock} onChange={e => setEditProduct({ ...editProduct, stock: Number(e.target.value) })} className={inputCls} /></div>
                      <div><label className="bangla text-sm font-semibold mb-1 block">ব্যাজ</label>
                        <select value={editProduct.badge || ''} onChange={e => setEditProduct({ ...editProduct, badge: (e.target.value as Product['badge']) || undefined })} className={`${inputCls} cursor-pointer`}>
                          <option value="">কোনোটি নয়</option>
                          <option value="new">নতুন</option>
                          <option value="hot">হট</option>
                          <option value="sale">সেল</option>
                        </select></div>
                      <div className="flex items-center gap-3 pt-5">
                        <input type="checkbox" id="featuredEdit" checked={editProduct.featured} onChange={e => setEditProduct({ ...editProduct, featured: e.target.checked })} className="w-4 h-4 accent-primary" />
                        <label htmlFor="featuredEdit" className="bangla text-sm font-medium">ফিচার্ড পণ্য</label>
                      </div>
                      <div className="sm:col-span-2"><label className="bangla text-sm font-semibold mb-1 block">বিবরণ (বাংলা)</label>
                        <textarea value={editProduct.descriptionBn} onChange={e => setEditProduct({ ...editProduct, descriptionBn: e.target.value })} rows={2} className={`${inputCls} resize-none`} /></div>
                      <div className="sm:col-span-2">
                        <label className="bangla text-sm font-semibold mb-1 block">ছবির URL যোগ করুন</label>
                        <div className="flex gap-2 mb-2">
                          <input value={editImgUrl} onChange={e => setEditImgUrl(e.target.value)} placeholder="https://..." className={`flex-1 ${inputCls}`} />
                          <button onClick={() => { if (editImgUrl) { setEditProduct({ ...editProduct, images: [...editProduct.images, editImgUrl] }); setEditImgUrl(''); } }}
                            className="px-3 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editProduct.images.map((img, i) => (
                            <div key={i} className="relative w-16 h-16">
                              <img src={img} alt="" className="w-full h-full object-cover rounded-xl border border-border" />
                              <button onClick={() => setEditProduct({ ...editProduct, images: editProduct.images.filter((_, j) => j !== i) })}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => setEditProduct(null)} className="flex-1 py-2.5 rounded-xl border border-border bangla font-semibold hover:bg-muted">বাতিল</button>
                      <button onClick={handleUpdateProduct} className="flex-1 btn-primary text-white py-2.5 rounded-xl font-bold bangla flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> সেভ করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Products List */}
              {products.length === 0 ? (
                <div className="text-center py-16 bangla text-muted-foreground">কোনো পণ্য যোগ করা হয়নি।</div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(p => (
                    <div key={p.id} className="glass-card rounded-2xl overflow-hidden">
                      <div className="aspect-square bg-muted relative">
                        <img src={p.images[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300'} alt={p.nameBn} className="w-full h-full object-cover" />
                        {p.featured && <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full bangla">ফিচার্ড</span>}
                      </div>
                      <div className="p-3 space-y-2">
                        <h4 className="bangla font-semibold text-sm line-clamp-1">{p.nameBn}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-bold">{formatPriceEn(p.price)}</span>
                          <span className="bangla text-xs text-muted-foreground">স্টক: {p.stock}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditProduct(p)}
                            className="flex-1 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold bangla flex items-center justify-center gap-1 hover:bg-blue-200 transition-colors">
                            <Edit3 className="w-3 h-3" /> সম্পাদনা
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)}
                            className="flex-1 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold bangla flex items-center justify-center gap-1 hover:bg-red-200 transition-colors">
                            <Trash2 className="w-3 h-3" /> মুছুন
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== ORDERS ===== */}
          {tab === 'orders' && (
            <div className="space-y-4">
              <p className="bangla text-sm text-muted-foreground">মোট {orders.length}টি অর্ডার</p>
              {orders.length === 0 ? (
                <div className="text-center py-16 bangla text-muted-foreground">কোনো অর্ডার নেই।</div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="glass-card rounded-2xl p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-muted-foreground">#{order.id.slice(-6).toUpperCase()}</span>
                            <span className={`bangla px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                              {statusLabels[order.status]}
                            </span>
                          </div>
                          <h4 className="bangla font-bold">{order.customer.name}</h4>
                          <p className="text-sm text-muted-foreground">{order.customer.phone} · {order.customer.district}</p>
                          <p className="bangla text-xs text-muted-foreground mt-0.5">{order.customer.address}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-bold text-lg">{formatPriceEn(order.totalAmount)}</p>
                          <p className="bangla text-xs text-muted-foreground">{order.paymentMethod === 'bkash' ? `বিকাশ · ${order.bkashTransactionId || '-'}` : 'ক্যাশ অন ডেলিভারি'}</p>
                          <p className="text-xs text-muted-foreground">{formatDateEn(order.createdAt)}</p>
                        </div>
                      </div>
                      {/* Items */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {order.items.map(item => (
                          <span key={item.product.id} className="bangla text-xs bg-muted px-2.5 py-1 rounded-full">
                            {item.product.nameBn} ×{item.quantity}
                          </span>
                        ))}
                      </div>
                      {order.notes && <p className="bangla text-xs text-muted-foreground mb-3">নোট: {order.notes}</p>}
                      {/* Status Update */}
                      <div className="flex flex-wrap gap-2">
                        {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map(s => (
                          <button key={s} onClick={() => handleUpdateOrderStatus(order, s)}
                            className={cn("bangla px-3 py-1 rounded-full text-xs font-semibold transition-all", order.status === s ? statusColors[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-muted text-muted-foreground hover:bg-border')}>
                            {statusLabels[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== ANNOUNCEMENTS ===== */}
          {tab === 'announcements' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="bangla text-sm text-muted-foreground">মোট {announcements.length}টি ঘোষণা</p>
                <button onClick={() => setShowAddAnn(true)}
                  className="btn-primary text-white px-4 py-2.5 rounded-xl font-semibold bangla flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> ঘোষণা যোগ করুন
                </button>
              </div>

              {showAddAnn && (
                <div className="glass-card rounded-2xl p-5 space-y-4 animate-scale-in border-2 border-primary/20">
                  <h3 className="bangla font-bold">নতুন ঘোষণা</h3>
                  <div><label className="bangla text-sm font-semibold mb-1 block">ঘোষণা (বাংলায়) *</label>
                    <input value={newAnnouncement.textBn} onChange={e => setNewAnnouncement({ ...newAnnouncement, textBn: e.target.value })} placeholder="বাংলায় ঘোষণা লিখুন..." className={inputCls} /></div>
                  <div><label className="bangla text-sm font-semibold mb-1 block">Announcement (English) *</label>
                    <input value={newAnnouncement.text} onChange={e => setNewAnnouncement({ ...newAnnouncement, text: e.target.value })} placeholder="Write announcement in English..." className={inputCls} /></div>
                  <div><label className="bangla text-sm font-semibold mb-1 block">ধরন</label>
                    <select value={newAnnouncement.type} onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as Announcement['type'] })} className={`${inputCls} cursor-pointer`}>
                      <option value="info">তথ্য (Info)</option>
                      <option value="promo">প্রমো (Promo)</option>
                      <option value="warning">সতর্কতা (Warning)</option>
                      <option value="success">সাফল্য (Success)</option>
                    </select></div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowAddAnn(false)} className="flex-1 py-2.5 rounded-xl border border-border bangla font-semibold hover:bg-muted">বাতিল</button>
                    <button onClick={handleAddAnnouncement} className="flex-1 btn-primary text-white py-2.5 rounded-xl font-bold bangla">যোগ করুন</button>
                  </div>
                </div>
              )}

              {announcements.length === 0 ? (
                <div className="text-center py-16 bangla text-muted-foreground">কোনো ঘোষণা নেই।</div>
              ) : (
                <div className="space-y-3">
                  {announcements.map(a => (
                    <div key={a.id} className={cn("glass-card rounded-2xl p-4 flex items-start gap-4", !a.active && "opacity-60")}>
                      <Megaphone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="bangla font-semibold text-sm">{a.textBn}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.text}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`bangla text-xs px-2 py-0.5 rounded-full font-semibold ${a.active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                            {a.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                          </span>
                          <span className="bangla text-xs text-muted-foreground">{a.type}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleToggleAnnouncement(a)}
                          className={cn("px-3 py-1.5 rounded-xl text-xs font-semibold bangla transition-all", a.active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400')}>
                          {a.active ? 'বন্ধ' : 'চালু'}
                        </button>
                        <button onClick={() => handleDeleteAnnouncement(a.id)}
                          className="p-1.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
