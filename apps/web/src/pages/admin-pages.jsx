import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  Outlet,
  useLocation,
  useOutletContext
} from "react-router-dom";
import {
  Boxes,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  X
} from "lucide-react";
import { apiRequest } from "../lib/api.js";
import {
  Button,
  EmptyPanel,
  Input,
  LoadingPanel,
  Panel,
  Select,
  StatusBadge,
  TextArea
} from "../components/ui.jsx";

const adminGroups = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard }
    ]
  },
  {
    label: "Catalog",
    items: [
      { to: "/admin/products", panel: "categories", label: "Categories", icon: Boxes },
      { to: "/admin/products", panel: "products", label: "Products", icon: Boxes }
    ]
  },
  {
    label: "Content",
    items: [
      { to: "/admin/content", panel: "sections", label: "Page Sections", icon: FileText },
      { to: "/admin/content", panel: "testimonials", label: "Testimonials", icon: FileText }
    ]
  },
  {
    label: "Leads",
    items: [
      { to: "/admin/enquiries", panel: "enquiries", label: "Enquiries", icon: ClipboardList },
      { to: "/admin/enquiries", panel: "service", label: "Service Requests", icon: ClipboardList }
    ]
  }
];

const createCategory = () => ({ name: "", slug: "", description: "", sort_order: 0, is_active: true });
const createProduct = (categoryId = "") => ({ category_id: categoryId, name: "", slug: "", short_description: "", description: "", specs_json: "{}", primary_image_url: "", gallery_urls_json: "", is_featured: false, is_active: true });
const createContent = () => ({ page_key: "about", section_key: "main", title: "", body: "" });
const createTestimonial = () => ({ name: "", company: "", quote: "", is_active: true, sort_order: 0 });

const buildAdminHref = (item) => item.panel ? `${item.to}?panel=${item.panel}` : item.to;
const getActivePanel = (location) => new URLSearchParams(location.search).get("panel") || "";

const isAdminItemActive = (location, item) => {
  if (location.pathname !== item.to) return false;
  if (!item.panel) return getActivePanel(location) === "";
  return getActivePanel(location) === item.panel;
};

function useAdminContext() {
  return useOutletContext();
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

/* ── Shared admin components ── */

function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

function MetricCard({ label, value, detail }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-0.5 text-xs text-gray-400">{detail}</p>
    </div>
  );
}

function SectionTitle({ title, description, action }) {
  return (
    <div className="flex items-center justify-between border-b border-black/5 px-5 py-3.5">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function ListButton({ active, onClick, label, sublabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
        active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-black/5 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      <p className={`text-sm font-medium ${active ? "text-white" : "text-gray-900"}`}>{label}</p>
      {sublabel && <p className={`mt-0.5 text-xs ${active ? "text-gray-300" : "text-gray-400"}`}>{sublabel}</p>}
    </button>
  );
}

function ViewTabs({ basePath, activeValue, items }) {
  return (
    <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
      {items.map((item) => {
        const href = item.value ? `${basePath}?panel=${item.value}` : basePath;
        const active = activeValue === item.value;
        return (
          <Link
            key={item.value || item.label}
            to={href}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function SmallList({ items, emptyTitle, emptyBody, renderItem }) {
  if (!items.length) return <EmptyPanel title={emptyTitle} body={emptyBody} />;
  return <div className="space-y-2">{items.map(renderItem)}</div>;
}

/* ── Layout ── */

export function AdminLayout({ token, onLogout }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname, location.search]);

  if (!token) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-shell">
      <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col border-r border-black/5 bg-white transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center gap-2.5 border-b border-black/5 px-4 py-3.5">
            <img src="/images/mlogo-mark.png" alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
            <div>
              <p className="font-display text-sm font-bold text-gray-900">Mechnnovation</p>
              <p className="text-[10px] text-gray-400">Admin</p>
            </div>
            <button type="button" onClick={() => setSidebarOpen(false)} className="ml-auto rounded-md p-1 text-gray-400 hover:bg-gray-100 lg:hidden">
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-3">
            {adminGroups.map((group) => (
              <div key={group.label} className="mb-4">
                <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">{group.label}</p>
                {group.items.map((item) => {
                  const active = isAdminItemActive(location, item);
                  const href = buildAdminHref(item);
                  return (
                    <Link
                      key={href}
                      to={href}
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition ${
                        active
                          ? "bg-gray-900 font-medium text-white"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className={`h-4 w-4 ${active ? "text-white" : "text-gray-400"}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="border-t border-black/5 px-3 py-3">
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4 text-gray-400" /> Log Out
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Main content */}
        <div className="min-w-0 flex flex-col">
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-black/5 bg-white/80 px-5 py-3 backdrop-blur-lg lg:px-6">
            <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-sm font-medium text-gray-900">Admin Dashboard</p>
          </header>
          <main className="flex-1 px-5 py-5 lg:px-6">
            <Outlet context={{ token, onLogout }} />
          </main>
        </div>
      </div>
    </div>
  );
}

/* ── Login ── */

export function AdminLoginPage({ token, onLogin }) {
  const [form, setForm] = useState({ email: "admin@mechnnovation.local", password: "ChangeMe123!" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (token) return <Navigate to="/admin" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await apiRequest("/admin/login", { method: "POST", body: form });
      onLogin(response.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <img src="/images/mlogo-mark.png" alt="Logo" className="h-10 w-10 rounded-xl object-cover" />
          <div>
            <p className="font-display text-xl font-bold text-gray-900">Mechnnovation</p>
            <p className="text-xs text-gray-500">Admin Login</p>
          </div>
        </div>

        <Panel className="mt-6 p-6">
          <form className="grid gap-3" onSubmit={submit}>
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full mt-1">
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Panel>

        <p className="mt-4 text-center text-xs text-gray-400">
          Default: admin@mechnnovation.local / ChangeMe123!
        </p>
      </div>
    </div>
  );
}

/* ── Dashboard ── */

export function AdminDashboardPage() {
  const { token } = useAdminContext();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setDashboard(await apiRequest("/admin/dashboard", { token }));
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (loading) return <LoadingPanel label="Loading dashboard..." />;

  const recentLeads = [
    ...(dashboard?.recentEnquiries || []).map((item) => ({ ...item, source: "Enquiry" })),
    ...(dashboard?.recentServiceRequests || []).map((item) => ({ ...item, source: "Service" }))
  ]
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    .slice(0, 6);

  const quickLinks = [
    { label: "Categories", to: "/admin/products?panel=categories" },
    { label: "Products", to: "/admin/products?panel=products" },
    { label: "Page Sections", to: "/admin/content?panel=sections" },
    { label: "Testimonials", to: "/admin/content?panel=testimonials" },
    { label: "Enquiries", to: "/admin/enquiries?panel=enquiries" },
    { label: "Service Requests", to: "/admin/enquiries?panel=service" }
  ];

  return (
    <div className="space-y-5">
      <PageHeader title="Dashboard" description="Overview of your catalog, content, and leads." />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Products" value={dashboard?.counts?.products || 0} detail="Catalog items" />
        <MetricCard label="Categories" value={dashboard?.counts?.categories || 0} detail="Product groups" />
        <MetricCard label="Enquiries" value={dashboard?.counts?.enquiries || 0} detail="Quote requests" />
        <MetricCard label="Service Requests" value={dashboard?.counts?.serviceRequests || 0} detail="Machining leads" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        {/* Quick links */}
        <Panel className="overflow-hidden p-0">
          <SectionTitle title="Quick actions" />
          <div className="grid gap-2 p-4 sm:grid-cols-2">
            {quickLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-between rounded-lg border border-black/5 bg-gray-50 px-3.5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-white"
              >
                {item.label}
                <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              </Link>
            ))}
          </div>
        </Panel>

        {/* Lead pipeline statuses */}
        <Panel className="overflow-hidden p-0">
          <SectionTitle title="Lead pipeline" description="Available status steps" />
          <div className="flex flex-wrap gap-2 p-4">
            {(dashboard?.statuses || []).map((status) => (
              <StatusBadge key={status} status={status} />
            ))}
          </div>
        </Panel>
      </div>

      {/* Recent leads table */}
      <Panel className="overflow-hidden p-0">
        <SectionTitle title="Recent leads" description="Latest enquiries and service requests" />
        {recentLeads.length === 0 ? (
          <div className="p-4"><EmptyPanel title="No leads yet" body="New submissions will appear here." /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-black/5 bg-gray-50 text-left text-xs text-gray-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Name</th>
                  <th className="px-4 py-2.5 font-medium">Type</th>
                  <th className="px-4 py-2.5 font-medium">Date</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {recentLeads.map((item) => (
                  <tr key={`${item.source}-${item.id}`} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.source}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(item.created_at)}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ── Products & Categories ── */

export function AdminProductsPage() {
  const { token } = useAdminContext();
  const location = useLocation();
  const activePanel = getActivePanel(location) || "categories";
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryMessage, setCategoryMessage] = useState("");
  const [productMessage, setProductMessage] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categoryForm, setCategoryForm] = useState(createCategory());
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productForm, setProductForm] = useState(createProduct());

  const applyCategorySelection = (item) => {
    if (!item) {
      setSelectedCategoryId("new");
      setCategoryForm(createCategory());
      return;
    }
    setSelectedCategoryId(item.id || "new");
    setCategoryForm({ id: item.id, name: item.name || "", slug: item.slug || "", description: item.description || "", sort_order: item.sort_order || 0, is_active: item.is_active ?? true });
  };

  const applyProductSelection = (item, fallbackCategoryId = "") => {
    if (!item) {
      setSelectedProductId("new");
      setProductForm(createProduct(fallbackCategoryId));
      return;
    }
    setSelectedProductId(item.id || "new");
    setProductForm({ id: item.id, category_id: item.category_id || fallbackCategoryId, name: item.name || "", slug: item.slug || "", short_description: item.short_description || "", description: item.description || "", specs_json: JSON.stringify(item.specs_json || {}, null, 2), primary_image_url: item.primary_image_url || "", gallery_urls_json: (item.gallery_urls_json || []).join("\n"), is_featured: item.is_featured ?? false, is_active: item.is_active ?? true });
  };

  const load = async (nextCatId = selectedCategoryId, nextProdId = selectedProductId) => {
    setLoading(true);
    try {
      const [catData, prodData] = await Promise.all([apiRequest("/admin/categories", { token }), apiRequest("/admin/products", { token })]);
      const cats = catData.items || [];
      const prods = prodData.items || [];
      setCategories(cats);
      setProducts(prods);
      applyCategorySelection(cats.find((c) => c.id === nextCatId) || cats[0] || null);
      const prodItem = prods.find((p) => p.id === nextProdId) || prods[0] || null;
      applyProductSelection(prodItem, prodItem?.category_id || cats[0]?.id || "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [token]);

  const saveCategory = async (e) => {
    e.preventDefault();
    setCategoryMessage("");
    try {
      const method = categoryForm.id ? "PATCH" : "POST";
      const path = categoryForm.id ? `/admin/categories/${categoryForm.id}` : "/admin/categories";
      const saved = await apiRequest(path, { method, body: { ...categoryForm, sort_order: Number(categoryForm.sort_order || 0) }, token });
      setCategoryMessage("Saved.");
      await load(saved.id, selectedProductId);
    } catch (err) { setCategoryMessage(err.message); }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setProductMessage("");
    try {
      const method = productForm.id ? "PATCH" : "POST";
      const path = productForm.id ? `/admin/products/${productForm.id}` : "/admin/products";
      const saved = await apiRequest(path, { method, body: { ...productForm, specs_json: JSON.parse(productForm.specs_json || "{}"), gallery_urls_json: (productForm.gallery_urls_json || "").split(/\n|,/).map((s) => s.trim()).filter(Boolean) }, token });
      setProductMessage("Saved.");
      await load(selectedCategoryId, saved.id);
    } catch (err) { setProductMessage(err.message || "Invalid JSON."); }
  };

  const removeCategory = async (id) => {
    await apiRequest(`/admin/categories/${id}`, { method: "DELETE", token });
    setCategoryMessage("Deleted.");
    await load("", selectedProductId);
  };

  const removeProduct = async (id) => {
    await apiRequest(`/admin/products/${id}`, { method: "DELETE", token });
    setProductMessage("Deleted.");
    await load(selectedCategoryId, "");
  };

  if (loading) return <LoadingPanel label="Loading catalog..." />;

  const filteredProducts = selectedCategoryId && selectedCategoryId !== "new"
    ? products.filter((p) => p.category_id === selectedCategoryId)
    : products;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products & Categories"
        description="Manage your product catalog."
        actions={
          <ViewTabs basePath="/admin/products" activeValue={activePanel} items={[
            { value: "categories", label: "Categories" },
            { value: "products", label: "Products" }
          ]} />
        }
      />

      {activePanel === "categories" ? (
        <div className="grid gap-5 xl:grid-cols-[260px_1fr_1fr]">
          {/* Category list */}
          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Categories" description={`${categories.length} total`} action={
              <button type="button" onClick={() => applyCategorySelection(null)} className="rounded-md bg-gray-900 p-1 text-white hover:bg-gray-800"><Plus className="h-3.5 w-3.5" /></button>
            } />
            <div className="max-h-[calc(100vh-240px)] space-y-1.5 overflow-y-auto p-3">
              <SmallList items={categories} emptyTitle="No categories" emptyBody="Create your first category." renderItem={(item) => (
                <div key={item.id} className="flex gap-1.5">
                  <ListButton active={selectedCategoryId === item.id} onClick={() => applyCategorySelection(item)} label={item.name} sublabel={item.slug} />
                  <button type="button" onClick={() => removeCategory(item.id)} className="shrink-0 rounded-lg border border-black/5 px-2 text-xs text-gray-400 hover:bg-red-50 hover:text-red-500">Del</button>
                </div>
              )} />
            </div>
          </Panel>

          {/* Category editor */}
          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Category editor" />
            <form className="grid gap-3 p-4" onSubmit={saveCategory}>
              <Input label="Name" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
              <Input label="Slug" value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} />
              <TextArea label="Description" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} className="min-h-[100px]" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Sort order" type="number" value={categoryForm.sort_order} onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: e.target.value })} />
                <label className="ui-field block text-sm">
                  <span className="ui-label mb-1.5 block font-medium">Active</span>
                  <div className="flex h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-3">
                    <input type="checkbox" className="h-4 w-4 rounded" checked={Boolean(categoryForm.is_active)} onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })} />
                    <span className="text-xs text-gray-500">{categoryForm.is_active ? "Yes" : "No"}</span>
                  </div>
                </label>
              </div>
              {categoryMessage && <p className="text-xs text-gray-600">{categoryMessage}</p>}
              <div className="flex justify-end gap-2">
                {categoryForm.id && <Button type="button" variant="secondary" onClick={() => removeCategory(categoryForm.id)}>Delete</Button>}
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Panel>

          {/* Products in category */}
          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Products in category" description={`${filteredProducts.length} items`} />
            <div className="max-h-[calc(100vh-240px)] space-y-2 overflow-y-auto p-4">
              <SmallList items={filteredProducts} emptyTitle="No products" emptyBody="Add products from the Products tab." renderItem={(item) => (
                <div key={item.id} className="rounded-lg border border-black/5 bg-gray-50 p-3">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{item.category?.name || item.category_id}</p>
                </div>
              )} />
            </div>
          </Panel>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
          {/* Product list */}
          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Products" description={`${products.length} items`} action={
              <button type="button" onClick={() => applyProductSelection(null, categories[0]?.id || "")} className="rounded-md bg-gray-900 p-1 text-white hover:bg-gray-800"><Plus className="h-3.5 w-3.5" /></button>
            } />
            <div className="max-h-[calc(100vh-240px)] space-y-1.5 overflow-y-auto p-3">
              <SmallList items={products} emptyTitle="No products" emptyBody="Create your first product." renderItem={(item) => (
                <div key={item.id} className="flex gap-2">
                  <button type="button" onClick={() => applyProductSelection(item, categories[0]?.id || "")} className={`flex flex-1 items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition ${selectedProductId === item.id ? "border-gray-900 bg-gray-900 text-white" : "border-black/5 bg-white hover:bg-gray-50"}`}>
                    <img src={item.primary_image_url || "/images/industrial-placeholder.svg"} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className={`truncate text-sm font-medium ${selectedProductId === item.id ? "text-white" : "text-gray-900"}`}>{item.name}</p>
                      <p className={`truncate text-xs ${selectedProductId === item.id ? "text-gray-300" : "text-gray-400"}`}>{item.category?.name || ""}</p>
                    </div>
                  </button>
                  <button type="button" onClick={() => removeProduct(item.id)} className="shrink-0 rounded-lg border border-black/5 px-2 text-xs text-gray-400 hover:bg-red-50 hover:text-red-500">Del</button>
                </div>
              )} />
            </div>
          </Panel>

          {/* Product editor */}
          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Product editor" />
            <div className="p-4">
              {!categories.length ? (
                <EmptyPanel title="Create a category first" body="Products need at least one category." />
              ) : (
                <form className="grid gap-3" onSubmit={saveProduct}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Select label="Category" value={productForm.category_id} onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}>
                      <option value="">Select</option>
                      {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                    <Input label="Slug" value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} />
                  </div>
                  <Input label="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                  <Input label="Primary image URL" value={productForm.primary_image_url} onChange={(e) => setProductForm({ ...productForm, primary_image_url: e.target.value })} />
                  <TextArea label="Short description" value={productForm.short_description} onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })} className="min-h-[80px]" />
                  <TextArea label="Full description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="min-h-[100px]" />
                  <TextArea label="Specs JSON" value={productForm.specs_json} onChange={(e) => setProductForm({ ...productForm, specs_json: e.target.value })} className="min-h-[140px] font-mono text-xs" />
                  <TextArea label="Gallery URLs (one per line)" value={productForm.gallery_urls_json} onChange={(e) => setProductForm({ ...productForm, gallery_urls_json: e.target.value })} className="min-h-[80px]" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="ui-field block text-sm">
                      <span className="ui-label mb-1.5 block font-medium">Featured</span>
                      <div className="flex h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-3">
                        <input type="checkbox" className="h-4 w-4 rounded" checked={Boolean(productForm.is_featured)} onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })} />
                        <span className="text-xs text-gray-500">{productForm.is_featured ? "Yes" : "No"}</span>
                      </div>
                    </label>
                    <label className="ui-field block text-sm">
                      <span className="ui-label mb-1.5 block font-medium">Active</span>
                      <div className="flex h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-3">
                        <input type="checkbox" className="h-4 w-4 rounded" checked={Boolean(productForm.is_active)} onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })} />
                        <span className="text-xs text-gray-500">{productForm.is_active ? "Yes" : "No"}</span>
                      </div>
                    </label>
                  </div>
                  {productMessage && <p className="text-xs text-gray-600">{productMessage}</p>}
                  <div className="flex justify-end gap-2">
                    {productForm.id && <Button type="button" variant="secondary" onClick={() => removeProduct(productForm.id)}>Delete</Button>}
                    <Button type="submit" disabled={!productForm.category_id}>Save</Button>
                  </div>
                </form>
              )}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

/* ── Content & Testimonials ── */

export function AdminContentPage() {
  const { token } = useAdminContext();
  const location = useLocation();
  const activePanel = getActivePanel(location) || "sections";
  const [siteContent, setSiteContent] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContentId, setSelectedContentId] = useState("");
  const [contentForm, setContentForm] = useState(createContent());
  const [contentMetaText, setContentMetaText] = useState("{}");
  const [contentMessage, setContentMessage] = useState("");
  const [selectedTestimonialId, setSelectedTestimonialId] = useState("");
  const [testimonialForm, setTestimonialForm] = useState(createTestimonial());
  const [testimonialMessage, setTestimonialMessage] = useState("");

  const applyContentSelection = (item) => {
    if (!item) {
      setSelectedContentId("new");
      setContentForm(createContent());
      setContentMetaText("{}");
      return;
    }
    setSelectedContentId(item.id || "new");
    setContentForm({ id: item.id, page_key: item.page_key || "about", section_key: item.section_key || "main", title: item.title || "", body: item.body || "" });
    setContentMetaText(JSON.stringify(item.meta_json || {}, null, 2));
  };

  const applyTestimonialSelection = (item) => {
    if (!item) {
      setSelectedTestimonialId("new");
      setTestimonialForm(createTestimonial());
      return;
    }
    setSelectedTestimonialId(item.id || "new");
    setTestimonialForm({ id: item.id, name: item.name || "", company: item.company || "", quote: item.quote || "", is_active: item.is_active ?? true, sort_order: item.sort_order || 0 });
  };

  const load = async (nextContentId = selectedContentId, nextTestimonialId = selectedTestimonialId) => {
    setLoading(true);
    try {
      const [siteData, testData] = await Promise.all([apiRequest("/admin/site-content", { token }), apiRequest("/admin/testimonials", { token })]);
      const sc = (siteData.items || []).slice().sort((a, b) => `${a.page_key}-${a.section_key}`.localeCompare(`${b.page_key}-${b.section_key}`));
      const ts = (testData.items || []).slice().sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
      setSiteContent(sc);
      setTestimonials(ts);
      applyContentSelection(sc.find((i) => i.id === nextContentId) || sc[0] || null);
      applyTestimonialSelection(ts.find((i) => i.id === nextTestimonialId) || ts[0] || null);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [token]);

  const saveContent = async (e) => {
    e.preventDefault();
    setContentMessage("");
    try {
      const payload = { ...contentForm, meta_json: JSON.parse(contentMetaText || "{}") };
      const method = contentForm.id ? "PATCH" : "POST";
      const path = contentForm.id ? `/admin/site-content/${contentForm.id}` : "/admin/site-content";
      const saved = await apiRequest(path, { method, body: payload, token });
      setContentMessage("Saved.");
      await load(saved.id, selectedTestimonialId);
    } catch (err) { setContentMessage(err.message || "Invalid JSON."); }
  };

  const saveTestimonial = async (e) => {
    e.preventDefault();
    setTestimonialMessage("");
    try {
      const method = testimonialForm.id ? "PATCH" : "POST";
      const path = testimonialForm.id ? `/admin/testimonials/${testimonialForm.id}` : "/admin/testimonials";
      const saved = await apiRequest(path, { method, body: { ...testimonialForm, sort_order: Number(testimonialForm.sort_order || 0) }, token });
      setTestimonialMessage("Saved.");
      await load(selectedContentId, saved.id);
    } catch (err) { setTestimonialMessage(err.message); }
  };

  const removeTestimonial = async () => {
    if (!testimonialForm.id) return;
    await apiRequest(`/admin/testimonials/${testimonialForm.id}`, { method: "DELETE", token });
    setTestimonialMessage("Deleted.");
    await load(selectedContentId, "");
  };

  if (loading) return <LoadingPanel label="Loading content..." />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Content & Testimonials"
        description="Manage public page sections and testimonials."
        actions={
          <ViewTabs basePath="/admin/content" activeValue={activePanel} items={[
            { value: "sections", label: "Sections" },
            { value: "testimonials", label: "Testimonials" }
          ]} />
        }
      />

      {activePanel === "sections" ? (
        <div className="grid gap-5 xl:grid-cols-[260px_1fr]">
          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Page sections" description={`${siteContent.length} total`} action={
              <button type="button" onClick={() => applyContentSelection(null)} className="rounded-md bg-gray-900 p-1 text-white hover:bg-gray-800"><Plus className="h-3.5 w-3.5" /></button>
            } />
            <div className="max-h-[calc(100vh-240px)] space-y-1.5 overflow-y-auto p-3">
              <SmallList items={siteContent} emptyTitle="No sections" emptyBody="Add a section for about or contact." renderItem={(item) => (
                <ListButton
                  key={item.id}
                  active={selectedContentId === item.id}
                  onClick={() => applyContentSelection(item)}
                  label={item.title || `${item.page_key} / ${item.section_key}`}
                  sublabel={`${item.page_key} / ${item.section_key}`}
                />
              )} />
            </div>
          </Panel>

          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Section editor" description={`Target: ${contentForm.page_key} / ${contentForm.section_key}`} />
            <form className="grid gap-3 p-4" onSubmit={saveContent}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Page key" value={contentForm.page_key} onChange={(e) => setContentForm({ ...contentForm, page_key: e.target.value.toLowerCase() })} required />
                <Input label="Section key" value={contentForm.section_key} onChange={(e) => setContentForm({ ...contentForm, section_key: e.target.value.toLowerCase() })} required />
              </div>
              <Input label="Title" value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} />
              <TextArea label="Body" value={contentForm.body} onChange={(e) => setContentForm({ ...contentForm, body: e.target.value })} className="min-h-[120px]" />
              <TextArea label="Meta JSON" value={contentMetaText} onChange={(e) => setContentMetaText(e.target.value)} className="min-h-[160px] font-mono text-xs" />
              {contentMessage && <p className="text-xs text-gray-600">{contentMessage}</p>}
              <div className="flex justify-end">
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Panel>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[260px_1fr]">
          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Testimonials" description={`${testimonials.length} total`} action={
              <button type="button" onClick={() => applyTestimonialSelection(null)} className="rounded-md bg-gray-900 p-1 text-white hover:bg-gray-800"><Plus className="h-3.5 w-3.5" /></button>
            } />
            <div className="max-h-[calc(100vh-240px)] space-y-1.5 overflow-y-auto p-3">
              <SmallList items={testimonials} emptyTitle="No testimonials" emptyBody="Add testimonials for the About page." renderItem={(item) => (
                <ListButton
                  key={item.id}
                  active={selectedTestimonialId === item.id}
                  onClick={() => applyTestimonialSelection(item)}
                  label={item.name || "Untitled"}
                  sublabel={item.company || "testimonial"}
                />
              )} />
            </div>
          </Panel>

          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Testimonial editor" />
            <form className="grid gap-3 p-4" onSubmit={saveTestimonial}>
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Name" value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} required />
                <Input label="Company" value={testimonialForm.company} onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })} />
              </div>
              <TextArea label="Quote" value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} className="min-h-[120px]" required />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Sort order" type="number" value={testimonialForm.sort_order} onChange={(e) => setTestimonialForm({ ...testimonialForm, sort_order: e.target.value })} />
                <label className="ui-field block text-sm">
                  <span className="ui-label mb-1.5 block font-medium">Active</span>
                  <div className="flex h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-3">
                    <input type="checkbox" className="h-4 w-4 rounded" checked={Boolean(testimonialForm.is_active)} onChange={(e) => setTestimonialForm({ ...testimonialForm, is_active: e.target.checked })} />
                    <span className="text-xs text-gray-500">{testimonialForm.is_active ? "Yes" : "No"}</span>
                  </div>
                </label>
              </div>
              {testimonialMessage && <p className="text-xs text-gray-600">{testimonialMessage}</p>}
              <div className="flex justify-end gap-2">
                {testimonialForm.id && <Button type="button" variant="secondary" onClick={removeTestimonial}>Delete</Button>}
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Panel>
        </div>
      )}
    </div>
  );
}

/* ── Enquiries & Service Requests ── */

function LeadTable({ title, description, items, onSave, statuses, type }) {
  const [drafts, setDrafts] = useState({});
  const updateDraft = (itemId, item, patch) => {
    setDrafts((cur) => ({ ...cur, [itemId]: { ...(cur[itemId] || item), ...patch } }));
  };

  return (
    <Panel className="overflow-hidden p-0">
      <SectionTitle title={title} description={description} />
      <div className="space-y-3 p-4">
        {items.length === 0 && <EmptyPanel title="No items yet" body="New submissions will show here." />}
        {items.map((item) => {
          const draft = drafts[item.id] || item;
          return (
            <div key={item.id} className="rounded-xl border border-black/5 bg-gray-50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <StatusBadge status={draft.status} />
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{item.email} | {item.phone}</p>
                  {item.company && <p className="text-xs text-gray-500">{item.company}</p>}
                  <p className="mt-2 text-sm text-gray-600">{type === "service" ? item.notes || "No notes" : item.message || "No message"}</p>
                </div>
                <div className="shrink-0 text-right text-xs text-gray-400">
                  <p>{formatDate(item.created_at)}</p>
                  {item.file_url && <a href={item.file_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-electric-500 hover:underline">View file</a>}
                </div>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[180px_160px_1fr_auto]">
                <Select label="Status" value={draft.status} onChange={(e) => updateDraft(item.id, item, { status: e.target.value })}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Input label="Follow-up" type="date" value={draft.follow_up_at || ""} onChange={(e) => updateDraft(item.id, item, { follow_up_at: e.target.value })} />
                <TextArea label="Internal notes" value={draft.internal_notes || ""} onChange={(e) => updateDraft(item.id, item, { internal_notes: e.target.value })} className="min-h-[80px]" />
                <div className="flex items-end">
                  <Button type="button" onClick={() => onSave(item.id, { status: draft.status, internal_notes: draft.internal_notes || "", follow_up_at: draft.follow_up_at || "" })}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

export function AdminEnquiriesPage() {
  const { token } = useAdminContext();
  const location = useLocation();
  const activePanel = getActivePanel(location) || "enquiries";
  const [enquiries, setEnquiries] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [eData, sData] = await Promise.all([apiRequest("/admin/enquiries", { token }), apiRequest("/admin/service-requests", { token })]);
      setEnquiries(eData.items || []);
      setServiceRequests(sData.items || []);
      setStatuses(eData.statuses || sData.statuses || []);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [token]);

  const saveEnquiry = async (id, payload) => { await apiRequest(`/admin/enquiries/${id}`, { method: "PATCH", token, body: payload }); await load(); };
  const saveServiceRequest = async (id, payload) => { await apiRequest(`/admin/service-requests/${id}`, { method: "PATCH", token, body: payload }); await load(); };

  if (loading) return <LoadingPanel label="Loading leads..." />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leads"
        description="Track enquiries and service requests."
        actions={
          <ViewTabs basePath="/admin/enquiries" activeValue={activePanel} items={[
            { value: "enquiries", label: "Enquiries" },
            { value: "service", label: "Service Requests" }
          ]} />
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Enquiries" value={enquiries.length} detail="Product quote requests" />
        <MetricCard label="Service Requests" value={serviceRequests.length} detail="Machining leads" />
        <MetricCard label="Statuses" value={statuses.length} detail="Pipeline steps" />
      </div>

      {activePanel === "service" ? (
        <LeadTable title="Service requests" description="Machining requests with files and follow-up." items={serviceRequests} statuses={statuses} onSave={saveServiceRequest} type="service" />
      ) : (
        <LeadTable title="Product enquiries" description="Quote requests from catalog and contact forms." items={enquiries} statuses={statuses} onSave={saveEnquiry} type="enquiry" />
      )}
    </div>
  );
}
