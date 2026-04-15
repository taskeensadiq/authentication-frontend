
'use client';
import { useState, useEffect } from 'react';
import { Package, Plus, Pencil, Trash2, Search, CheckCircle2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchParams, usePathname } from 'next/navigation';

interface Product {
  id: string;
  description: string;
  name: string;
  createdAt: string;
  isArchived: boolean;
  updatedAt: string;
  archivedAt: string;
  justRestored?: boolean;
}

interface ProductDTO {
  name: string;
  description: string;
  editingId: string;
}

export default function InventoryDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productInput, setProductInput] = useState<ProductDTO>({ name: '', description: '', editingId: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const viewFilter =
    (searchParams.get('status') as 'all' | 'active' | 'archived') || 'all';
  const router = useRouter();
  const API_URL = 'http://localhost:4000/products';

  const formatDisplayDate = (p: any) => {
    const createdAt = new Date(p.createdAt).getTime();
    const updatedAt = new Date(p.updatedAt).getTime();
    const dateObj = new Date(p.updatedAt);

    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    let statusLabel = "Created";
    let statusColor = "text-slate-400";

    if (p.justRestored) {
      statusLabel = "Restored";
      statusColor = "text-green-600";
    }
    else if (p.isArchived) {
      statusLabel = "Archived";
      statusColor = "text-red-500";
    }
    else if (Math.abs(updatedAt - createdAt) > 2000) {
      statusLabel = "Modified";
      statusColor = "text-amber-500";
    }

    return (
      <div className="flex flex-col">
        <span className="text-sm text-slate-600 font-medium">
          {month} {day}, {year} — {displayHours}:{minutes} {ampm}
        </span>
        <span className={`text-[10px] font-bold uppercase tracking-tighter ${statusColor}`}>
          {statusLabel}
        </span>
      </div>
    );
  };

  const token = localStorage.getItem('token');
  const fetchProducts = async () => {
    try {
      const url =
        viewFilter === "all"
          ? `${API_URL}`
          : `${API_URL}?status=${viewFilter}`;

      const response = await fetch(
        url,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        router.push('/login');
        return;
      }

      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching products with filter:", viewFilter);
    fetchProducts();
  }, [viewFilter]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productInput.name.trim()) return;

    try {
      if (editingId) {
        // UPDATE (PATCH)
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name: productInput.name, description: productInput.description }),
        });
        if (response.ok) {
          const updatedProduct = await response.json();
          setProducts(prevProducts =>
            prevProducts.map(p =>
              p.id === editingId
                ? updatedProduct
                : p
            )
          );
          setEditingId(null);
        }
      }

      else {
        // CREATE (POST)
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ name: productInput.name, description: productInput.description }),
        });
        if (response.ok) {
          const newProduct = await response.json();
          setProducts(prev => [newProduct, ...prev]);
        }
      }

      setProductInput({ name: '', description: '', editingId: '' });
      // fetchProducts();
    } catch (error) {
      console.error("The actual error is:", error);
      alert("Failed to save product");
    }
  };

  const permanentlyDelete = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!confirm(`Are you sure? This will permanently remove "${product?.name}" from the database.`)) return;
    try {
      const response = await fetch(`${API_URL}/${id}/permanent`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error("Permanent delete failed:", error);
    }
  };

  const toggleArchive = async (id: string) => {
    const action = products.find(p => p.id === id)?.isArchived ? "Restore" : "Archive";
    const product = products.find(p => p.id === id);
    if (!confirm(`${action} ${product?.name}?`)) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      }
    } catch (error) {
      console.error("Toggle archive failed:", error);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setProductInput({ name: p.name, description: p.description, editingId: p.id });
  };

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesView =
        viewFilter === 'all' ? true :
          viewFilter === 'archived' ? p.isArchived === true :
            p.isArchived === false;

      return matchesSearch && matchesView;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER & SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Inventory</h1>
            <p className="text-slate-500 text-sm">Manage your database entries.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-auto group">
                <select
                  value={viewFilter}
                  onChange={(e) => {
                    const value = e.target.value;
                    const params = new URLSearchParams(searchParams.toString());

                    if (value === "all") {
                      params.delete("status");
                    } else {
                      params.set("status", value);
                    }

                    router.push(`${pathname}?${params.toString()}`);
                  }}
                  className="appearance-none pl-3 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-sm cursor-pointer"
                >
                  <option value="active">Active Items</option>
                  <option value="archived">Archived</option>
                  <option value="all">All Products</option>
                </select>

                {/* CROSS ICON (inside select) */}
                {viewFilter !== "all" && (
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete("status");
                      router.push(`${pathname}?${params.toString()}`);
                    }}
                    className="
        absolute right-2 top-1/2 -translate-y-1/2
        text-slate-400 hover:text-red-500
        opacity-0 group-hover:opacity-100
        transition
      "
                    title="Clear filter"
                  >
                    ✕
                  </button>
                )}
              </div>

            </div>
            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* FORM (Left Side) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
            <div className="flex items-center gap-2 mb-6">
              <div className={`p-2 rounded-lg ${editingId ? 'bg-amber-100' : 'bg-blue-100'}`}>
                {editingId ? <Pencil className="w-5 h-5 text-amber-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
              </div>
              <h2 className="font-bold text-slate-800">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Product Name</label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    required
                    value={productInput.name}
                    onChange={(e) => setProductInput({ ...productInput, name: e.target.value })}
                    placeholder="Enter item name..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Product Description</label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={productInput.description || ''}
                    onChange={(e) => setProductInput({ ...productInput, description: e.target.value })}
                    placeholder="Enter item description..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-white transition-all active:scale-[0.97] shadow-lg ${editingId
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                  }`}
              >
                {editingId ? 'Update' : 'Save'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setProductInput({ name: '', description: '', editingId: '' }); }}
                  className="w-full py-3 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* TABLE (Right Side) */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 flex flex-col items-center gap-4 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  <p>Connecting to Database...</p>
                </div>
              ) : (

                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Product Info</th>
                      {/* New Header Column */}
                      <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Product Description</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">Last Activity</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-700">{p.name}</span>
                            {/* <span className="text-xs text-slate-400 uppercase tracking-widest">UUID: {p.id.substring(0, 8)}...</span> */}
                          </div>
                        </td>

                        {/* New Data Column */}
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600">
                            {p.description || <span className="text-slate-300 italic">No description</span>}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-600 font-medium">
                              {formatDisplayDate(p)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {!p.isArchived ? (
                              <>
                                <button
                                  onClick={() => startEdit(p)}
                                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                  title="Edit"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => toggleArchive(p.id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Archive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => toggleArchive(p.id)}
                                  className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                  title="Restore"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => permanentlyDelete(p.id)}
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Delete Permanently"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredProducts.length === 0 && (
                      <tr>
                        {/* Updated colSpan from 2 to 3 to cover the new column */}
                        <td colSpan={3} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center gap-2 text-slate-400">
                            <Package className="w-8 h-8 opacity-20" />
                            <p className="text-sm italic">No entries found.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Database Status</span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-3 h-3" /> Postgres Connected
              </span>
            </div>
          </div>
        </div>

        <div className='flex justify-end'>
          <button className='cursor-pointer bg-slate-800 text-white px-4 py-2 rounded-lg' onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}