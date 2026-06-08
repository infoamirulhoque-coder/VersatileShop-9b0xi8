import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Megaphone, LogOut, Plus, Trash2,
  Edit3, Save, X, Bell, AlertCircle, TrendingUp, RefreshCw
} from 'lucide-react';
import {
  getProducts, addProduct, updateProduct, deleteProduct,
  getOrders, updateOrder, getAnnouncements, addAnnouncement, updateAnnouncement,
  deleteAnnouncement, getAdminAuth, clearAdminAuth
} from '@/lib/storage';
import { Product, Order, Announcement } from '@/types';
import { CATEGORIES, LOGO_URL } from '@/constants';
import { generateId, formatPriceEn, formatDateEn, cn } from '@/lib/utils';
import { toast } from 'sonner';

type Tab = 'overview' | 'products' | 'orders' | 'announcements';

const EMPTY_PRODUCT: Omit<Product, 'id' | 'createdAt'> = {
  name: '', nameBn: '', price: 0, category: 'cap', images: [],
  description: '', descriptionBn: '', stock: 10, featured: false,
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

  const refresh = useCallback(() => {
    setProducts(getProducts());
    setOrders(getOrders());
    setAnnouncements(getAnnouncements());
  }, []);

  useEffect(() => {
    if (!getAdminAuth()) { navigate('/admin'); return; }
    refresh();
  }, [navigate, refresh]);

  const handleLogout = () => {
    clearAdminAuth();
    toast.success('লগআউট সফল।');
    navigate('/admin');
  };

  // ===== PRODUCTS =====
  const handleAddProduct = () => {
    if (!newProduct.nameBn.trim()) { toast.error('বাংলায় পণ্যের নাম দিন।'); return; }
    if (!newProduct.name.trim()) { toast.error('English name required.'); return; }
    if (newProduct.price <= 0) { toast.error('সঠিক মূল্য দিন।'); return; }
    const p: Product = {
      ...newProduct,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    addProduct(p);
    refresh();
    setShowAddProduct(false);
    setNewProduct({ ...EMPTY_PRODUCT });
    setNewImgUrl('');
    toast.success('✅ পণ্য সফলভাবে যোগ করা হয়েছে!');
  };

  const handleUpdateProduct = () => {
    if (!editProduct) return;
    if (!editProduct.nameBn.trim() || !editProduct.name.trim()) {
      toast.error('পণ্যের নাম দিন।'); return;
    }
    updateProduct(editProduct);
    refresh();
    setEditProduct(null);
    setEditImgUrl('');
    toast.success('✅ পণ্য আপডেট হয়েছে!');
  };

  const handleDeleteProduct = (id: string) => {
    if (!confirm('এই পণ্যটি মুছে ফেলবেন? এটি পুনরুদ্ধার করা যাবে না।')) return;
    deleteProduct(id);
    refresh();
    toast.success('পণ্য মুছে ফেলা হয়েছে।');
  };

  // ===== ORDERS =====
  const handleUpdateOrderStatus = (order: Order, status: Order['status']) => {
    updateOrder({ ...order, status });
    refresh();
    toast.success('অর্ডার স্ট্যাটাস আপডেট হয়েছে!');
  };

  // ===== ANNOUNCEMENTS =====
  const handleAddAnnouncement = () => {
    if (!newAnnouncement.textBn.trim()) { toast.error('বাংলায় ঘোষণা লিখুন।'); return; }
    if (!newAnnouncement.text.trim()) { toast.error('Write announcement in English.'); return; }
    const a: Announcement = {
      id: generateId(),
      ...newAnnouncement,
      active: true,
      createdAt: new Date().toISOString(),
    };
    addAnnouncement(a);
    refresh();
    setNewAnnouncement({ text: '', textBn: '', type: 'info' });
    setShowAddAnn(false);
    toast.success('✅ ঘোষণা যোগ করা হয়েছে!');
  };

  const handleToggleAnnouncement = (a: Announcement) => {
    updateAnnouncement({ ...a, active: !a.active });
    refresh();
    toast.success(a.active ? 'ঘোষণা বন্ধ করা হয়েছে।' : 'ঘোষণা সক্রিয় করা হয়েছে।');
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (!confirm('ঘোষণাটি মুছে ফেলবেন?')) return;
    deleteAnnouncement(id);
    refresh();
    toast.success('ঘোষণা মুছে ফেলা হয়েছে।');
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

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary bangla placeholder:text-muted-foreground";

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
      <div className="w-16 md:w-60 bg-slate-900 flex flex-col shrink-0 sticky top-0 h-screen overflow-hidden">
        <div className="p-3 md:p-4 border-b border-slate-800 shrink-0">
          <img src={LOGO_URL} alt="Logo" className="h-8 md:h-10 w-auto object-contain mx-auto md:mx-0" />
        </div>
        <nav className="flex-1 p-2 md:p-3 space-y-1 overflow-y-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={cn(
                "w-full flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-xl transition-all duration-200 bangla text-sm font-medium",
                tab === t.id
                  ? "bg-primary text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}>
              {t.icon}
              <span className="hidden md:block">{t.label}</span>
              {t.id === 'orders' && pendingOrders > 0 && (
                <span className="hidden md:flex ml-auto w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full items-center justify-center shrink-0">
                  {pendingOrders}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-2 md:p-3 border-t border-slate-800 shrink-0">
          <button onClick={refresh}
            className="w-full flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-700 hover:text-white transition-all bangla text-sm mb-1">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:block">রিফ্রেশ</span>
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 md:px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all bangla text-sm">
            <LogOut className="w-4 h-4" />
            <span className="hidden md:block">লগআউট</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto min-w-0">
        {/* Top Header */}
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-4 md:px-6 py-4 flex items-center justify-between z-10">
          <h1 className="bangla font-bold text-lg">
            {tabs.find(t => t.id === tab)?.label || 'ড্যাশবোর্ড'}
          </h1>
          <div className="flex items-center gap-3">
            {pendingOrders > 0 && (
              <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1.5 rounded-full text-xs font-semibold bangla">
                <Bell className="w-3.5 h-3.5" /> {pendingOrders}টি নতুন অর্ডার
              </div>
            )}
            <button onClick={refresh}
              className="p-2 rounded-xl hover:bg-muted transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">

          {/* ===== OVERVIEW ===== */}
          {tab === 'overview' && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'মোট পণ্য', value: products.length, icon: <Package className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                  { label: 'মোট অর্ডার', value: orders.length, icon: <ShoppingBag className="w-5 h-5" />, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/30' },
                  { label: 'অপেক্ষমাণ', value: pendingOrders, icon: <AlertCircle className="w-5 h-5" />, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
                  { label: 'মোট আয়', value: formatPriceEn(totalRevenue), icon: <TrendingUp className="w-5 h-5" />, color: 'text-primary', bg: 'bg-primary/10' },
                ].map((s, i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg transition-shadow">
                    <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
                      {s.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="bangla text-2xl font-extrabold truncate">{s.value}</p>
                      <p className="bangla text-xs text-muted-foreground">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Recent Orders */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="bangla font-bold mb-4 text-base">সাম্প্রতিক অর্ডার</h3>
                {orders.length === 0 ? (
                  <div className="text-center py-10">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="bangla text-muted-foreground text-sm">কোনো অর্ডার নেই।</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="bangla font-semibold text-sm truncate">{o.customer.name}</p>
                          <p className="bangla text-xs text-muted-foreground">{o.customer.phone} · {o.customer.district}</p>
                        </div>
                        <span className="font-bold text-sm text-primary shrink-0">{formatPriceEn(o.totalAmount)}</span>
                        <span className={`bangla px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${statusColors[o.status]}`}>
                          {statusLabels[o.status]}
                        </span>
                      </div>
                    ))}
                    {orders.length > 5 && (
                      <button onClick={() => setTab('orders')}
                        className="w-full text-center text-xs text-primary bangla font-medium hover:underline py-1">
                        সব অর্ডার দেখুন ({orders.length}টি) →
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Products */}
              <div className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="bangla font-bold text-base">সাম্প্রতিক পণ্য</h3>
                  <button onClick={() => setTab('products')} className="text-xs text-primary bangla font-medium hover:underline">
                    সব দেখুন →
                  </button>
                </div>
                {products.length === 0 ? (
                  <p className="bangla text-muted-foreground text-sm text-center py-6">কোনো পণ্য নেই।</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {products.slice(0, 4).map(p => (
                      <div key={p.id} className="bg-muted/50 rounded-xl p-3 text-center">
                        <img src={p.images[0] || 'https://via.placeholder.com/80'} alt={p.nameBn}
                          className="w-12 h-12 rounded-lg object-cover mx-auto mb-2" />
                        <p className="bangla text-xs font-semibold line-clamp-1">{p.nameBn}</p>
                        <p className="text-primary font-bold text-sm">{formatPriceEn(p.price)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== PRODUCTS ===== */}
          {tab === 'products' && (
            <div className="space-y-5 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <p className="bangla text-sm text-muted-foreground">মোট <strong>{products.length}</strong>টি পণ্য</p>
                <button onClick={() => { setShowAddProduct(true); setNewProduct({ ...EMPTY_PRODUCT }); setNewImgUrl(''); }}
                  className="btn-primary text-white px-4 py-2.5 rounded-xl font-semibold bangla flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> নতুন পণ্য যোগ করুন
                </button>
              </div>

              {/* Add Product Modal */}
              {showAddProduct && (
                <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4">
                  <div className="bg-background rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in border border-border">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="bangla font-bold text-lg">নতুন পণ্য যোগ করুন</h3>
                      <button onClick={() => setShowAddProduct(false)}
                        className="p-2 rounded-full hover:bg-muted transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">পণ্যের নাম (বাংলা) *</label>
                        <input value={newProduct.nameBn}
                          onChange={e => setNewProduct({ ...newProduct, nameBn: e.target.value })}
                          className={inputCls} placeholder="যেমন: নীল টি-শার্ট" />
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">Product Name (English) *</label>
                        <input value={newProduct.name}
                          onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                          className={inputCls} placeholder="e.g: Blue T-Shirt" />
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">মূল্য (৳) *</label>
                        <input type="number" value={newProduct.price || ''}
                          onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                          className={inputCls} placeholder="0" min="0" />
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">আসল মূল্য (৳) — ছাড় দেখাতে</label>
                        <input type="number" value={newProduct.originalPrice || ''}
                          onChange={e => setNewProduct({ ...newProduct, originalPrice: Number(e.target.value) || undefined })}
                          className={inputCls} placeholder="0 (ঐচ্ছিক)" min="0" />
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">বিভাগ *</label>
                        <select value={newProduct.category}
                          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                          className={`${inputCls} cursor-pointer`}>
                          {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                            <option key={c.id} value={c.id}>{c.icon} {c.nameBn}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">স্টক পরিমাণ</label>
                        <input type="number" value={newProduct.stock}
                          onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                          className={inputCls} min="0" />
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">ব্যাজ</label>
                        <select value={newProduct.badge || ''}
                          onChange={e => setNewProduct({ ...newProduct, badge: (e.target.value as Product['badge']) || undefined })}
                          className={`${inputCls} cursor-pointer`}>
                          <option value="">কোনো ব্যাজ নেই</option>
                          <option value="new">🆕 নতুন (New)</option>
                          <option value="hot">🔥 হট (Hot)</option>
                          <option value="sale">🏷️ সেল (Sale)</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <input type="checkbox" id="featuredNew" checked={newProduct.featured}
                          onChange={e => setNewProduct({ ...newProduct, featured: e.target.checked })}
                          className="w-5 h-5 accent-primary rounded cursor-pointer" />
                        <label htmlFor="featuredNew" className="bangla text-sm font-medium cursor-pointer">
                          ⭐ হোমপেজে ফিচার্ড হিসেবে দেখাবে
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="bangla text-sm font-semibold mb-1.5 block">বিবরণ (বাংলা)</label>
                        <textarea value={newProduct.descriptionBn}
                          onChange={e => setNewProduct({ ...newProduct, descriptionBn: e.target.value })}
                          rows={2} className={`${inputCls} resize-none`}
                          placeholder="পণ্যের বিস্তারিত বিবরণ..." />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="bangla text-sm font-semibold mb-1.5 block">Description (English)</label>
                        <textarea value={newProduct.description}
                          onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                          rows={2} className={`${inputCls} resize-none`}
                          placeholder="Product description..." />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="bangla text-sm font-semibold mb-1.5 block">পণ্যের ছবির URL যোগ করুন</label>
                        <div className="flex gap-2 mb-3">
                          <input value={newImgUrl} onChange={e => setNewImgUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className={`flex-1 ${inputCls}`}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && newImgUrl.trim()) {
                                setNewProduct({ ...newProduct, images: [...newProduct.images, newImgUrl.trim()] });
                                setNewImgUrl('');
                              }
                            }} />
                          <button
                            onClick={() => {
                              if (newImgUrl.trim()) {
                                setNewProduct({ ...newProduct, images: [...newProduct.images, newImgUrl.trim()] });
                                setNewImgUrl('');
                              }
                            }}
                            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1">
                            <Plus className="w-4 h-4" /> যোগ
                          </button>
                        </div>
                        {newProduct.images.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {newProduct.images.map((img, i) => (
                              <div key={i} className="relative w-16 h-16 group">
                                <img src={img} alt="" className="w-full h-full object-cover rounded-xl border border-border" />
                                <button
                                  onClick={() => setNewProduct({ ...newProduct, images: newProduct.images.filter((_, j) => j !== i) })}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {newProduct.images.length === 0 && (
                          <p className="bangla text-xs text-muted-foreground mt-1">
                            ছবির URL পেস্ট করে "যোগ" বোতামে ক্লিক করুন (একাধিক ছবি যোগ করা যাবে)
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setShowAddProduct(false)}
                        className="flex-1 py-3 rounded-xl border border-border bangla font-semibold hover:bg-muted transition-colors">
                        বাতিল
                      </button>
                      <button onClick={handleAddProduct}
                        className="flex-1 btn-primary text-white py-3 rounded-xl font-bold bangla flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> পণ্য যোগ করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Edit Product Modal */}
              {editProduct && (
                <div className="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4">
                  <div className="bg-background rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in border border-border">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="bangla font-bold text-lg">পণ্য সম্পাদনা করুন</h3>
                      <button onClick={() => { setEditProduct(null); setEditImgUrl(''); }}
                        className="p-2 rounded-full hover:bg-muted transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">পণ্যের নাম (বাংলা)</label>
                        <input value={editProduct.nameBn}
                          onChange={e => setEditProduct({ ...editProduct, nameBn: e.target.value })}
                          className={inputCls} />
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">Product Name (English)</label>
                        <input value={editProduct.name}
                          onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                          className={inputCls} />
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">মূল্য (৳)</label>
                        <input type="number" value={editProduct.price}
                          onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                          className={inputCls} min="0" />
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">আসল মূল্য (৳)</label>
                        <input type="number" value={editProduct.originalPrice || ''}
                          onChange={e => setEditProduct({ ...editProduct, originalPrice: Number(e.target.value) || undefined })}
                          className={inputCls} min="0" />
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">বিভাগ</label>
                        <select value={editProduct.category}
                          onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}
                          className={`${inputCls} cursor-pointer`}>
                          {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                            <option key={c.id} value={c.id}>{c.icon} {c.nameBn}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">স্টক</label>
                        <input type="number" value={editProduct.stock}
                          onChange={e => setEditProduct({ ...editProduct, stock: Number(e.target.value) })}
                          className={inputCls} min="0" />
                      </div>
                      <div>
                        <label className="bangla text-sm font-semibold mb-1.5 block">ব্যাজ</label>
                        <select value={editProduct.badge || ''}
                          onChange={e => setEditProduct({ ...editProduct, badge: (e.target.value as Product['badge']) || undefined })}
                          className={`${inputCls} cursor-pointer`}>
                          <option value="">কোনো ব্যাজ নেই</option>
                          <option value="new">🆕 নতুন</option>
                          <option value="hot">🔥 হট</option>
                          <option value="sale">🏷️ সেল</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-3 pt-4">
                        <input type="checkbox" id="featuredEdit" checked={editProduct.featured}
                          onChange={e => setEditProduct({ ...editProduct, featured: e.target.checked })}
                          className="w-5 h-5 accent-primary rounded cursor-pointer" />
                        <label htmlFor="featuredEdit" className="bangla text-sm font-medium cursor-pointer">
                          ⭐ হোমপেজে ফিচার্ড হিসেবে দেখাবে
                        </label>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="bangla text-sm font-semibold mb-1.5 block">বিবরণ (বাংলা)</label>
                        <textarea value={editProduct.descriptionBn}
                          onChange={e => setEditProduct({ ...editProduct, descriptionBn: e.target.value })}
                          rows={2} className={`${inputCls} resize-none`} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="bangla text-sm font-semibold mb-1.5 block">ছবির URL যোগ করুন</label>
                        <div className="flex gap-2 mb-3">
                          <input value={editImgUrl} onChange={e => setEditImgUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className={`flex-1 ${inputCls}`}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && editImgUrl.trim()) {
                                setEditProduct({ ...editProduct, images: [...editProduct.images, editImgUrl.trim()] });
                                setEditImgUrl('');
                              }
                            }} />
                          <button
                            onClick={() => {
                              if (editImgUrl.trim()) {
                                setEditProduct({ ...editProduct, images: [...editProduct.images, editImgUrl.trim()] });
                                setEditImgUrl('');
                              }
                            }}
                            className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1">
                            <Plus className="w-4 h-4" /> যোগ
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {editProduct.images.map((img, i) => (
                            <div key={i} className="relative w-16 h-16 group">
                              <img src={img} alt="" className="w-full h-full object-cover rounded-xl border border-border" />
                              <button
                                onClick={() => setEditProduct({ ...editProduct, images: editProduct.images.filter((_, j) => j !== i) })}
                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => { setEditProduct(null); setEditImgUrl(''); }}
                        className="flex-1 py-3 rounded-xl border border-border bangla font-semibold hover:bg-muted transition-colors">
                        বাতিল
                      </button>
                      <button onClick={handleUpdateProduct}
                        className="flex-1 btn-primary text-white py-3 rounded-xl font-bold bangla flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> পরিবর্তন সেভ করুন
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              {products.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="bangla text-muted-foreground text-lg mb-2">কোনো পণ্য যোগ করা হয়নি।</p>
                  <p className="bangla text-muted-foreground text-sm">উপরের বোতামে ক্লিক করে পণ্য যোগ করুন।</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map(p => (
                    <div key={p.id} className="glass-card rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300'}
                          alt={p.nameBn}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300'; }}
                        />
                        {p.featured && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-white text-xs rounded-full bangla font-semibold">
                            ⭐ ফিচার্ড
                          </span>
                        )}
                        {p.badge && (
                          <span className={cn(
                            "absolute top-2 right-2 px-2 py-0.5 text-white text-xs rounded-full font-semibold",
                            p.badge === 'new' ? 'badge-new' : p.badge === 'hot' ? 'badge-hot' : 'badge-sale'
                          )}>
                            {p.badge === 'new' ? 'NEW' : p.badge === 'hot' ? 'HOT' : 'SALE'}
                          </span>
                        )}
                      </div>
                      <div className="p-3 space-y-2">
                        <h4 className="bangla font-semibold text-sm line-clamp-1">{p.nameBn}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-primary font-bold text-base">{formatPriceEn(p.price)}</span>
                          <span className="bangla text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            স্টক: {p.stock}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setEditProduct({ ...p }); setEditImgUrl(''); }}
                            className="flex-1 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-semibold bangla flex items-center justify-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                            <Edit3 className="w-3 h-3" /> সম্পাদনা
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)}
                            className="flex-1 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold bangla flex items-center justify-center gap-1 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
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
            <div className="space-y-4 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <p className="bangla text-sm text-muted-foreground">মোট <strong>{orders.length}</strong>টি অর্ডার</p>
                {pendingOrders > 0 && (
                  <span className="bangla px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold">
                    {pendingOrders}টি অপেক্ষমাণ
                  </span>
                )}
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="bangla text-muted-foreground text-lg">কোনো অর্ডার নেই।</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="glass-card rounded-2xl p-5 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="text-xs text-muted-foreground font-mono">
                              #{order.id.slice(-8).toUpperCase()}
                            </span>
                            <span className={`bangla px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                              {statusLabels[order.status]}
                            </span>
                            <span className={`bangla px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              order.paymentMethod === 'cod'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                            }`}>
                              {order.paymentMethod === 'cod' ? '💵 COD' : '💳 বিকাশ'}
                            </span>
                          </div>
                          <h4 className="bangla font-bold text-base">{order.customer.name}</h4>
                          <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                          <p className="bangla text-sm text-muted-foreground">{order.customer.address}, {order.customer.upazila}, {order.customer.district}</p>
                          {order.bkashTransactionId && (
                            <p className="text-xs text-pink-600 mt-1">
                              বিকাশ Txn: <strong>{order.bkashTransactionId}</strong>
                            </p>
                          )}
                        </div>
                        <div className="text-left sm:text-right shrink-0">
                          <p className="text-primary font-bold text-xl">{formatPriceEn(order.totalAmount)}</p>
                          <p className="bangla text-xs text-muted-foreground mt-0.5">
                            ডেলিভারি: {order.deliveryCharge === 0 ? 'বিনামূল্যে' : formatPriceEn(order.deliveryCharge)}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDateEn(order.createdAt)}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {order.items.map(item => (
                          <span key={item.product.id}
                            className="bangla text-xs bg-muted px-2.5 py-1 rounded-full border border-border/50">
                            {item.product.nameBn} ×{item.quantity}
                          </span>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="bangla text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-xl mb-3">
                          📝 নোট: {order.notes}
                        </p>
                      )}

                      {/* Status Update Buttons */}
                      <div>
                        <p className="bangla text-xs text-muted-foreground mb-2 font-medium">স্ট্যাটাস পরিবর্তন করুন:</p>
                        <div className="flex flex-wrap gap-2">
                          {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as Order['status'][]).map(s => (
                            <button key={s} onClick={() => handleUpdateOrderStatus(order, s)}
                              className={cn(
                                "bangla px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                                order.status === s
                                  ? statusColors[s] + ' ring-2 ring-offset-1 ring-current font-bold'
                                  : 'bg-muted text-muted-foreground hover:bg-border cursor-pointer'
                              )}>
                              {statusLabels[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ===== ANNOUNCEMENTS ===== */}
          {tab === 'announcements' && (
            <div className="space-y-5 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <p className="bangla text-sm text-muted-foreground">মোট <strong>{announcements.length}</strong>টি ঘোষণা</p>
                <button onClick={() => setShowAddAnn(true)}
                  className="btn-primary text-white px-4 py-2.5 rounded-xl font-semibold bangla flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" /> নতুন ঘোষণা যোগ করুন
                </button>
              </div>

              {showAddAnn && (
                <div className="glass-card rounded-2xl p-6 space-y-4 animate-scale-in border-2 border-primary/20 bg-primary/5">
                  <h3 className="bangla font-bold text-base">নতুন ঘোষণা লিখুন</h3>
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">ঘোষণা (বাংলায়) *</label>
                    <input value={newAnnouncement.textBn}
                      onChange={e => setNewAnnouncement({ ...newAnnouncement, textBn: e.target.value })}
                      placeholder="বাংলায় ঘোষণা লিখুন..." className={inputCls} />
                  </div>
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">Announcement (English) *</label>
                    <input value={newAnnouncement.text}
                      onChange={e => setNewAnnouncement({ ...newAnnouncement, text: e.target.value })}
                      placeholder="Write announcement in English..." className={inputCls} />
                  </div>
                  <div>
                    <label className="bangla text-sm font-semibold mb-1.5 block">ধরন নির্বাচন করুন</label>
                    <select value={newAnnouncement.type}
                      onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value as Announcement['type'] })}
                      className={`${inputCls} cursor-pointer`}>
                      <option value="info">ℹ️ তথ্য (Info)</option>
                      <option value="promo">🎉 প্রমো (Promo)</option>
                      <option value="warning">⚠️ সতর্কতা (Warning)</option>
                      <option value="success">✅ সাফল্য (Success)</option>
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setShowAddAnn(false); setNewAnnouncement({ text: '', textBn: '', type: 'info' }); }}
                      className="flex-1 py-2.5 rounded-xl border border-border bangla font-semibold hover:bg-muted transition-colors">
                      বাতিল
                    </button>
                    <button onClick={handleAddAnnouncement}
                      className="flex-1 btn-primary text-white py-2.5 rounded-xl font-bold bangla flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> ঘোষণা যোগ করুন
                    </button>
                  </div>
                </div>
              )}

              {announcements.length === 0 ? (
                <div className="text-center py-20">
                  <Megaphone className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="bangla text-muted-foreground text-lg">কোনো ঘোষণা নেই।</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map(a => (
                    <div key={a.id}
                      className={cn(
                        "glass-card rounded-2xl p-4 flex items-start gap-4 transition-all",
                        !a.active && "opacity-50"
                      )}>
                      <Megaphone className={`w-5 h-5 mt-0.5 shrink-0 ${a.active ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="bangla font-semibold text-sm mb-0.5">{a.textBn}</p>
                        <p className="text-xs text-muted-foreground mb-2">{a.text}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`bangla text-xs px-2.5 py-1 rounded-full font-semibold ${
                            a.active
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {a.active ? '✅ সক্রিয়' : '⭕ নিষ্ক্রিয়'}
                          </span>
                          <span className="bangla text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{a.type}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleToggleAnnouncement(a)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-semibold bangla transition-all",
                            a.active
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                          )}>
                          {a.active ? 'বন্ধ করুন' : 'চালু করুন'}
                        </button>
                        <button onClick={() => handleDeleteAnnouncement(a.id)}
                          className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors">
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
