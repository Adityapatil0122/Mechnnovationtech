import { useEffect, useRef, useState } from "react";
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
  Pencil,
  Plus,
  Trash2,
  X
} from "lucide-react";
import { apiRequest, uploadFile } from "../lib/api.js";
import { broadcastCatalogUpdate } from "../lib/catalog-sync.js";
import { resolvePageSections } from "../lib/site-content.js";
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
      { to: "/admin/content", panel: "sections", label: "Page Content", icon: FileText },
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
const createProduct = (categoryId = "") => ({ category_id: categoryId, name: "", slug: "", short_description: "", description: "", primary_image_url: "", gallery_urls_json: "", is_featured: false, is_active: true });
const createContent = () => ({ page_key: "about", section_key: "story", title: "", body: "" });
const createTestimonial = () => ({ name: "", company: "", quote: "", is_active: true, sort_order: 0 });

/* Site page/section structure mapping */
const PAGE_OPTIONS = [
  { value: "home", label: "Home" },
  { value: "about", label: "About Us" },
  { value: "contact", label: "Contact" },
];

const SECTION_OPTIONS_BY_PAGE = {
  home: [
    { value: "hero", label: "Hero Banner" },
    { value: "extra", label: "Extra / Custom Section" },
  ],
  about: [
    { value: "story", label: "Our Story (hero section)" },
    { value: "capabilities", label: "Capabilities (checklist)" },
    { value: "extra", label: "Extra / Custom Section" },
  ],
  contact: [
    { value: "main", label: "Main (header + body)" },
    { value: "extra", label: "Extra / Custom Section" },
  ],
};

const SECTION_TEMPLATES = [
  {
    label: "Home -> Hero Banner",
    page_key: "home",
    section_key: "hero",
    title: "Precision CNC machining & industrial tooling",
    body: "Moulding dies, CNC turned components, and VMC job work. Fast response, practical communication, reliable execution.",
    stats: [],
    list: [],
  },
  {
    label: "Home -> Stats Strip",
    page_key: "home",
    section_key: "stats",
    title: "",
    body: "",
    stats: [
      { label: "Years of Experience", value: "12+" },
      { label: "Manufacturing Focus", value: "CNC / VMC" },
      { label: "Location", value: "Pune, India" },
      { label: "GST Registered", value: "2020" },
    ],
    list: [],
  },
  {
    label: "Home -> Process",
    page_key: "home",
    section_key: "process",
    title: "Simple process, reliable results",
    body: "From drawing review to production delivery, every step is built for clarity and predictable execution.",
    stats: [],
    list: [
      "Share your drawing or requirement",
      "Feasibility review and machining plan",
      "Clear quote with timelines",
      "Production with quality checks"
    ],
  },
  {
    label: "Home -> Bottom CTA",
    page_key: "home",
    section_key: "cta",
    title: "Ready to discuss your project?",
    body: "Share your drawing or requirement and get a practical quote from our team.",
    stats: [],
    list: [],
  },
  {
    label: "About -> Our Story",
    page_key: "about",
    section_key: "story",
    title: "12+ years of tooling and machining expertise.",
    body: "Mechnno Vation Technologies is a Pune-based partnership firm specializing in moulding dies, CNC components, and VMC job work.",
    stats: [
      { label: "Years in Business", value: "12+" },
      { label: "Manufacturing Focus", value: "CNC / VMC" },
      { label: "GST Verified", value: "Since 2020" },
      { label: "Location", value: "Pune, India" },
    ],
    list: [],
  },
  {
    label: "About -> Capabilities",
    page_key: "about",
    section_key: "capabilities",
    title: "Capabilities",
    body: "CNC and VMC machining, moulding dies, drawing-based manufacturing, and custom industrial work.",
    stats: [],
    list: [
      "CNC / VMC machining",
      "Moulding die development",
      "2D / 3D design support",
      "Custom industrial manufacturing",
    ],
  },
  {
    label: "About -> Why Choose Us",
    page_key: "about",
    section_key: "why_choose_us",
    title: "Built on trust & precision",
    body: "Every part we deliver reflects our commitment to quality, communication, and reliable execution.",
    stats: [],
    list: [],
  },
  {
    label: "About -> Our Approach",
    page_key: "about",
    section_key: "approach",
    title: "Practical manufacturing, not just promises",
    body: "We focus on what matters: understanding your requirement, reviewing feasibility honestly, and delivering parts that perform as expected.",
    stats: [],
    list: [
      "Drawing review and feasibility check before quoting",
      "Transparent communication on timeline and limitations",
      "Quality checks at every stage of production",
      "Flexible batch sizes, from prototypes to repeat orders",
    ],
  },
  {
    label: "Contact -> Main Section",
    page_key: "contact",
    section_key: "main",
    title: "Get in touch",
    body: "Have a requirement? Share your drawing or project details, and our team will get back to you with a practical quote.",
    stats: [],
    list: [],
  },
];

/* Theme accent colors used across the site */
const THEME_ACCENTS = [
  { value: "electric", label: "Electric Teal (default)", sample: "#16bfb4" },
  { value: "red", label: "Brand Red", sample: "#c70e08" },
  { value: "amber", label: "Amber / Gold", sample: "#f59e0b" },
  { value: "emerald", label: "Emerald Green", sample: "#10b981" },
  { value: "blue", label: "Steel Blue", sample: "#3b82f6" },
  { value: "gray", label: "Neutral Gray", sample: "#6b7280" },
];

/* Existing images available in the project */
const EXISTING_IMAGES = [
  { url: "/images/indian_about_hero.png", label: "About Hero" },
  { url: "/images/indian_about_approach.png", label: "About Approach" },
  { url: "/images/indian_cnc_bgworker.png", label: "CNC Worker BG" },
  { url: "/images/indian_cnc_operator.png", label: "CNC Operator" },
  { url: "/images/indian_workshop_team.png", label: "Workshop Team" },
  { url: "/images/indian_tooling_gears.png", label: "Tooling Gears" },
  { url: "/images/indian_product_shared.png", label: "Product Shared" },
  { url: "/images/indian_engineering_office.png", label: "Engineering" },
  { url: "/images/indian_avatar_1.png", label: "Avatar 1" },
  { url: "/images/indian_avatar_2.png", label: "Avatar 2" },
  { url: "/images/indian_avatar_3.png", label: "Avatar 3" },
  { url: "/images/mlogo-mark.png", label: "Logo Mark" },
];

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

function createSpecRow(label = "", value = "") {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    label,
    value
  };
}

function specsObjectToRows(specs) {
  return Object.entries(specs || {}).map(([label, value]) => createSpecRow(
    label,
    Array.isArray(value)
      ? value.join(", ")
      : value == null
        ? ""
        : typeof value === "object"
          ? JSON.stringify(value)
          : String(value)
  ));
}

function specsRowsToObject(rows) {
  return rows.reduce((acc, row) => {
    const label = row.label.trim();
    const value = row.value.trim();
    if (!label || !value) return acc;
    acc[label] = value;
    return acc;
  }, {});
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

/* ── Visual Page Editor (WYSIWYG-style) ── */

function VisualPageEditor({ pageKey, sections, token, onSaved }) {
  const resolvedSections = resolvePageSections(pageKey, sections);
  const [edits, setEdits] = useState({});
  const [deletingSectionId, setDeletingSectionId] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const getEditorId = (section) => section.id || `${pageKey}:${section.section_key}`;

  useEffect(() => {
    const initial = {};
    resolvedSections.forEach((section) => {
      initial[getEditorId(section)] = {
        title: section.title || "",
        body: section.body || "",
        meta_json: JSON.parse(JSON.stringify(section.meta_json || {}))
      };
    });
    setEdits(initial);
    setDeletingSectionId("");
    setMessage("");
  }, [pageKey, sections]);

  const updateField = (editorId, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [editorId]: {
        ...(prev[editorId] || { title: "", body: "", meta_json: {} }),
        [field]: value
      }
    }));
  };

  const updateMeta = (editorId, field, value) => {
    setEdits((prev) => ({
      ...prev,
      [editorId]: {
        ...(prev[editorId] || { title: "", body: "", meta_json: {} }),
        meta_json: {
          ...((prev[editorId] && prev[editorId].meta_json) || {}),
          [field]: value
        }
      }
    }));
  };

  const getEdit = (section) => edits[getEditorId(section)] || {
    title: section.title || "",
    body: section.body || "",
    meta_json: section.meta_json || {}
  };

  const sanitizeMeta = (_section, meta = {}) => {
    const next = { ...meta };

    if (Array.isArray(next.list)) {
      next.list = next.list.map((item) => String(item || "").trim()).filter(Boolean);
    }

    if (Array.isArray(next.stats)) {
      next.stats = next.stats
        .map((item) => ({
          label: String(item?.label || "").trim(),
          value: String(item?.value || "").trim()
        }))
        .filter((item) => item.label || item.value);
    }

    if (Array.isArray(next.steps)) {
      next.steps = next.steps
        .map((item, index) => ({
          step: String(item?.step || String(index + 1).padStart(2, "0")).trim(),
          title: String(item?.title || "").trim(),
          body: String(item?.body || "").trim()
        }))
        .filter((item) => item.title || item.body);
    }

    if (Array.isArray(next.cards)) {
      next.cards = next.cards
        .map((item) => ({
          title: String(item?.title || "").trim(),
          body: String(item?.body || "").trim()
        }))
        .filter((item) => item.title || item.body);
    }

    ["eyebrow", "primaryCtaLabel", "secondaryCtaLabel", "formHeading", "formSubmitLabel", "phone", "email", "address", "gstin", "mapQuery", "image_url"].forEach((key) => {
      if (typeof next[key] === "string") {
        next[key] = next[key].trim();
      }
    });

    if (typeof next.disabled !== "boolean") {
      delete next.disabled;
    }

    return next;
  };

  const isDirty = resolvedSections.some((section) => {
    const current = getEdit(section);
    return (
      current.title !== (section.title || "") ||
      current.body !== (section.body || "") ||
      JSON.stringify(current.meta_json || {}) !== JSON.stringify(section.meta_json || {})
    );
  });

  const handleImgUpload = async (editorId, file) => {
    try {
      const url = await uploadFile(file);
      updateMeta(editorId, "image_url", url);
      setMessage("");
    } catch (err) {
      setMessage(err.message || "Upload failed.");
    }
  };

  const saveAll = async () => {
    setSaving(true);
    setMessage("");
    try {
      for (const section of resolvedSections) {
        const editorId = getEditorId(section);
        const edit = edits[editorId];
        if (!edit) continue;

        const meta_json = sanitizeMeta(section, edit.meta_json);
        const payload = {
          page_key: pageKey,
          section_key: section.section_key,
          title: edit.title,
          body: edit.body,
          meta_json
        };
        const method = section.id ? "PATCH" : "POST";
        const path = section.id ? `/admin/site-content/${section.id}` : "/admin/site-content";
        await apiRequest(path, { method, body: payload, token });
      }

      setMessage("Changes published to the live site!");
      onSaved();
    } catch (err) {
      setMessage(err.message || "Error saving.");
    } finally {
      setSaving(false);
    }
  };

  const deleteSection = async (section) => {
    if (isDirty) {
      setMessage("Save your current edits before deleting or restoring a section.");
      return;
    }

    const editorId = getEditorId(section);
    const edit = getEdit(section);
    const hidden = Boolean(edit.meta_json?.disabled);
    setDeletingSectionId(editorId);
    setMessage("");

    try {
      if (section.editor_variant === "generic" && section.id) {
        await apiRequest(`/admin/site-content/${section.id}`, { method: "DELETE", token });
        setMessage("Section deleted.");
      } else {
        const payload = {
          page_key: pageKey,
          section_key: section.section_key,
          title: edit.title,
          body: edit.body,
          meta_json: sanitizeMeta(section, {
            ...(edit.meta_json || {}),
            disabled: !hidden
          })
        };
        const method = section.id ? "PATCH" : "POST";
        const path = section.id ? `/admin/site-content/${section.id}` : "/admin/site-content";
        await apiRequest(path, { method, body: payload, token });
        setMessage(hidden ? "Section restored." : "Section hidden from the live page.");
      }

      onSaved();
    } catch (err) {
      setMessage(err.message || "Unable to update this section.");
    } finally {
      setDeletingSectionId("");
    }
  };

  if (!resolvedSections.length) {
    return <EmptyPanel title="No sections" body="No editable content exists for this page yet." />;
  }

  const sectionBadge = (label) => (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1">
      <Pencil className="h-2.5 w-2.5 text-gray-400" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  );

  const actionPillClass = (tone = "default") => `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-sm transition ${tone === "danger"
    ? "border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50"
    : tone === "muted"
      ? "border-amber-200 bg-white text-amber-700 hover:border-amber-300 hover:bg-amber-50"
      : "border-black/10 bg-white text-gray-700 hover:border-black/15 hover:bg-gray-50"}`;

  const sectionDeleteButton = (section) => {
    const editorId = getEditorId(section);
    const hidden = Boolean(getEdit(section).meta_json?.disabled);

    return (
      <button
        type="button"
        onClick={() => deleteSection(section)}
        disabled={deletingSectionId === editorId || saving}
        className={actionPillClass(hidden ? "muted" : "danger")}
      >
        {hidden ? "Restore section" : <><Trash2 className="h-3.5 w-3.5" /> Delete section</>}
      </button>
    );
  };

  const sectionNotice = (section) => {
    const meta = getEdit(section).meta_json || {};
    if (!meta.disabled) {
      return null;
    }

    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        This section is hidden on the live site. Use the top-right button to restore it.
      </div>
    );
  };

  const imageControls = (editorId, currentUrl, labelText = "Replace image") => (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <label className={actionPillClass()}>
        {currentUrl ? labelText : "Add image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(ev) => {
            const file = ev.target.files?.[0];
            if (file) handleImgUpload(editorId, file);
            ev.target.value = "";
          }}
        />
      </label>
      {currentUrl && (
        <button type="button" onClick={() => updateMeta(editorId, "image_url", "")} className={actionPillClass("muted")}>
          Remove image
        </button>
      )}
    </div>
  );

  const imagePreview = (editorId, currentUrl, emptyLabel = "+ Add image") => (
    <div className="space-y-3">
      <div className="flex justify-end">{imageControls(editorId, currentUrl)}</div>
      {currentUrl ? (
        <img src={currentUrl} alt="" className="h-56 w-full rounded-2xl object-cover" />
      ) : (
        <label className="flex min-h-[220px] w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-gray-300 hover:bg-gray-100">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(ev) => {
              const file = ev.target.files?.[0];
              if (file) handleImgUpload(editorId, file);
              ev.target.value = "";
            }}
          />
          <span className="text-xs font-medium text-gray-400">{emptyLabel}</span>
        </label>
      )}
    </div>
  );

  const listEditor = (editorId, items = [], field = "list") => (
    <div className="space-y-1.5">
      {items.map((item, index) => (
        <div key={`${field}-${index}`} className="group flex items-center gap-2 rounded-xl border border-black/5 bg-gray-50 px-3 py-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-900/5 text-[10px] font-bold text-gray-400">+</span>
          <input
            value={item}
            onChange={(ev) => {
              const next = [...items];
              next[index] = ev.target.value;
              updateMeta(editorId, field, next);
            }}
            className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-300"
            placeholder="List item..."
          />
          <button type="button" onClick={() => updateMeta(editorId, field, items.filter((_, itemIndex) => itemIndex !== index))} className="rounded p-0.5 text-gray-300 opacity-0 transition group-hover:opacity-100 hover:text-red-500">
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => updateMeta(editorId, field, [...items, ""])} className="text-[11px] font-medium text-gray-400 transition hover:text-gray-600">+ Add item</button>
    </div>
  );

  const statsEditor = (editorId, items = []) => (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {items.map((stat, index) => (
          <div key={`stat-${index}`} className="group relative rounded-xl border border-black/5 bg-gray-50 px-3 py-2.5">
            <input
              value={stat.value || ""}
              onChange={(ev) => {
                const next = [...items];
                next[index] = { ...next[index], value: ev.target.value };
                updateMeta(editorId, "stats", next);
              }}
              className="w-full bg-transparent font-display text-lg font-bold text-gray-900 outline-none placeholder:text-gray-300"
              placeholder="Value"
            />
            <input
              value={stat.label || ""}
              onChange={(ev) => {
                const next = [...items];
                next[index] = { ...next[index], label: ev.target.value };
                updateMeta(editorId, "stats", next);
              }}
              className="mt-1 w-full bg-transparent text-[11px] text-gray-500 outline-none placeholder:text-gray-300"
              placeholder="Label"
            />
            <button type="button" onClick={() => updateMeta(editorId, "stats", items.filter((_, itemIndex) => itemIndex !== index))} className="absolute -top-1.5 -right-1.5 rounded-full bg-white p-0.5 text-gray-300 opacity-0 shadow transition group-hover:opacity-100 hover:text-red-500">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => updateMeta(editorId, "stats", [...items, { label: "", value: "" }])} className="mt-2 text-[11px] font-medium text-gray-400 transition hover:text-gray-600">+ Add stat</button>
    </div>
  );

  const stepsEditor = (editorId, items = []) => (
    <div className="space-y-3">
      {items.map((step, index) => (
        <div key={`step-${index}`} className="rounded-2xl border border-black/5 bg-gray-50 p-4">
          <div className="grid gap-3 sm:grid-cols-[88px_1fr_auto]">
            <input
              value={step.step || ""}
              onChange={(ev) => {
                const next = [...items];
                next[index] = { ...next[index], step: ev.target.value };
                updateMeta(editorId, "steps", next);
              }}
              className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
              placeholder="01"
            />
            <input
              value={step.title || ""}
              onChange={(ev) => {
                const next = [...items];
                next[index] = { ...next[index], title: ev.target.value };
                updateMeta(editorId, "steps", next);
              }}
              className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
              placeholder="Step title"
            />
            <button type="button" onClick={() => updateMeta(editorId, "steps", items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-xl border border-black/8 bg-white px-3 py-2 text-xs font-semibold text-gray-500 transition hover:border-red-200 hover:text-red-500">
              Remove
            </button>
          </div>
          <textarea
            value={step.body || ""}
            onChange={(ev) => {
              const next = [...items];
              next[index] = { ...next[index], body: ev.target.value };
              updateMeta(editorId, "steps", next);
            }}
            rows={3}
            className="mt-3 w-full rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-300 focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
            placeholder="Step description..."
          />
        </div>
      ))}
      <button type="button" onClick={() => updateMeta(editorId, "steps", [...items, { step: String(items.length + 1).padStart(2, "0"), title: "", body: "" }])} className="text-[11px] font-medium text-gray-400 transition hover:text-gray-600">+ Add step</button>
    </div>
  );

  const cardsEditor = (editorId, items = []) => (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((card, index) => (
        <div key={`card-${index}`} className="rounded-2xl border border-black/5 bg-gray-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <input
              value={card.title || ""}
              onChange={(ev) => {
                const next = [...items];
                next[index] = { ...next[index], title: ev.target.value };
                updateMeta(editorId, "cards", next);
              }}
              className="w-full bg-transparent font-display text-base font-bold text-gray-900 outline-none placeholder:text-gray-300"
              placeholder="Card title"
            />
            <button type="button" onClick={() => updateMeta(editorId, "cards", items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-full bg-white p-1 text-gray-300 shadow-sm transition hover:text-red-500">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <textarea
            value={card.body || ""}
            onChange={(ev) => {
              const next = [...items];
              next[index] = { ...next[index], body: ev.target.value };
              updateMeta(editorId, "cards", next);
            }}
            rows={4}
            className="mt-3 w-full resize-none bg-transparent text-sm leading-6 text-gray-600 outline-none placeholder:text-gray-300"
            placeholder="Card description..."
          />
        </div>
      ))}
      <button type="button" onClick={() => updateMeta(editorId, "cards", [...items, { title: "", body: "" }])} className="sm:col-span-2 justify-self-start text-[11px] font-medium text-gray-400 transition hover:text-gray-600">+ Add card</button>
    </div>
  );

  const renderFields = (section, editorId, edit, meta) => {
    const showEyebrow = ["hero", "story", "home-stats", "home-process", "home-cta", "contact-main", "about-cards", "about-approach"].includes(section.editor_variant);
    const showTitle = true;
    const showBody = section.editor_variant !== "generic" || true;

    return (
      <div className="space-y-4">
        {showEyebrow && (
          <input
            value={meta.eyebrow || ""}
            onChange={(ev) => updateMeta(editorId, "eyebrow", ev.target.value)}
            className="w-full bg-transparent text-xs font-semibold uppercase tracking-[0.22em] text-electric-500 outline-none placeholder:text-electric-300"
            placeholder="Eyebrow label"
          />
        )}

        {showTitle && (
          <input
            value={edit.title || ""}
            onChange={(ev) => updateField(editorId, "title", ev.target.value)}
            className="w-full bg-transparent font-display text-xl font-bold text-gray-900 outline-none placeholder:text-gray-300 sm:text-2xl"
            placeholder="Section title..."
          />
        )}

        {showBody && (
          <textarea
            value={edit.body || ""}
            onChange={(ev) => updateField(editorId, "body", ev.target.value)}
            rows={section.editor_variant === "story" || section.editor_variant === "about-approach" || section.editor_variant === "home-cta" ? 4 : 3}
            className="w-full resize-none bg-transparent text-sm leading-7 text-gray-600 outline-none placeholder:text-gray-400"
            placeholder="Section description..."
          />
        )}

        {section.editor_variant === "hero" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={meta.primaryCtaLabel || ""}
                onChange={(ev) => updateMeta(editorId, "primaryCtaLabel", ev.target.value)}
                className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
                placeholder="Primary CTA label"
              />
              <input
                value={meta.secondaryCtaLabel || ""}
                onChange={(ev) => updateMeta(editorId, "secondaryCtaLabel", ev.target.value)}
                className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
                placeholder="Secondary CTA label"
              />
            </div>
            {imagePreview(editorId, meta.image_url || "", "+ Add banner image")}
          </>
        )}

        {section.editor_variant === "story" && (
          <>
            {statsEditor(editorId, meta.stats || [])}
            {imagePreview(editorId, meta.image_url || "", "+ Add about image")}
          </>
        )}

        {section.editor_variant === "capabilities" && listEditor(editorId, meta.list || [])}
        {section.editor_variant === "home-stats" && statsEditor(editorId, meta.stats || [])}
        {section.editor_variant === "home-process" && stepsEditor(editorId, meta.steps || [])}

        {section.editor_variant === "home-cta" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={meta.primaryCtaLabel || ""}
                onChange={(ev) => updateMeta(editorId, "primaryCtaLabel", ev.target.value)}
                className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
                placeholder="Primary CTA label"
              />
              <input
                value={meta.secondaryCtaLabel || ""}
                onChange={(ev) => updateMeta(editorId, "secondaryCtaLabel", ev.target.value)}
                className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
                placeholder="Secondary CTA label"
              />
            </div>
            {imagePreview(editorId, meta.image_url || "", "+ Add CTA background")}
          </>
        )}

        {section.editor_variant === "contact-main" && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={meta.formHeading || ""}
                onChange={(ev) => updateMeta(editorId, "formHeading", ev.target.value)}
                className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
                placeholder="Form heading"
              />
              <input
                value={meta.formSubmitLabel || ""}
                onChange={(ev) => updateMeta(editorId, "formSubmitLabel", ev.target.value)}
                className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
                placeholder="Submit button label"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={meta.phone || ""}
                onChange={(ev) => updateMeta(editorId, "phone", ev.target.value)}
                className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
                placeholder="Phone"
              />
              <input
                value={meta.email || ""}
                onChange={(ev) => updateMeta(editorId, "email", ev.target.value)}
                className="rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
                placeholder="Email"
              />
            </div>
            <textarea
              value={meta.address || ""}
              onChange={(ev) => updateMeta(editorId, "address", ev.target.value)}
              rows={3}
              className="w-full rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
              placeholder="Address"
            />
            <input
              value={meta.gstin || ""}
              onChange={(ev) => updateMeta(editorId, "gstin", ev.target.value)}
              className="w-full rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
              placeholder="GSTIN"
            />
            <input
              value={meta.mapQuery || ""}
              onChange={(ev) => updateMeta(editorId, "mapQuery", ev.target.value)}
              className="w-full rounded-xl border border-black/8 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
              placeholder="Google Maps query"
            />
          </>
        )}

        {section.editor_variant === "about-cards" && cardsEditor(editorId, meta.cards || [])}

        {section.editor_variant === "about-approach" && (
          <>
            {listEditor(editorId, meta.list || [])}
            {imagePreview(editorId, meta.image_url || "", "+ Add approach image")}
          </>
        )}

        {section.editor_variant === "generic" && (
          <>
            {imagePreview(editorId, meta.image_url || "", "+ Add section image")}
            {listEditor(editorId, meta.list || [])}
          </>
        )}
      </div>
    );
  };

  const isErrorMessage = /error|failed|unable|save your current edits/i.test(message);

  return (
    <div className="space-y-4">
      {resolvedSections.map((section) => {
        const editorId = getEditorId(section);
        const edit = getEdit(section);
        const meta = edit.meta_json || {};

        return (
          <div key={editorId} className={`rounded-2xl border border-black/5 bg-white p-6 shadow-sm lg:p-8 ${meta.disabled ? "opacity-75" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              {sectionBadge(section.editor_label || section.section_key)}
              <div className="flex flex-wrap items-center gap-2">
                {sectionDeleteButton(section)}
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {sectionNotice(section)}
              {renderFields(section, editorId, edit, meta)}
            </div>
          </div>
        );
      })}

      <div className={`sticky bottom-4 flex items-center justify-between rounded-2xl border bg-white px-5 py-4 shadow-lg transition-all ${isDirty ? "border-gray-900/10" : "border-black/5"}`}>
        <div>
          {isDirty ? (
            <>
              <p className="text-sm font-semibold text-gray-900">Unsaved changes</p>
              <p className="text-xs text-gray-500">Click publish to update the live site.</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">All changes saved.</p>
          )}
          {message && <p className={`mt-1 text-xs font-medium ${isErrorMessage ? "text-red-500" : "text-emerald-600"}`}>{message}</p>}
        </div>
        <Button onClick={saveAll} disabled={saving || !isDirty}>
          {saving ? "Publishing..." : "Save & Publish"}
        </Button>
      </div>
    </div>
  );
}
const CONTENT_PAGE_TABS = [
  { value: "home", label: "Home" },
  { value: "about", label: "About" },
  { value: "contact", label: "Contact" },
  { value: "products", label: "Products", linkTo: "/admin/products?panel=products" },
  { value: "services", label: "Services", linkTo: "/admin/enquiries?panel=service" },
];

/* ── (Legacy) Inline Section Editor Card ── */

function SectionCard({ item, sectionLabel, token, onSaved }) {
  const [title, setTitle] = useState(item.title || "");
  const [body, setBody] = useState(item.body || "");
  const [image, setImage] = useState(item.meta_json?.image_url || "");
  const [list, setList] = useState((item.meta_json?.list || []).join("\n"));
  const [stats, setStats] = useState(() => {
    const s = (item.meta_json?.stats || []).map((s) => ({ id: Math.random().toString(), label: s.label || "", value: s.value || "" }));
    return s.length ? s : [];
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setTitle(item.title || "");
    setBody(item.body || "");
    setImage(item.meta_json?.image_url || "");
    setList((item.meta_json?.list || []).join("\n"));
    const s = (item.meta_json?.stats || []).map((s) => ({ id: Math.random().toString(), label: s.label || "", value: s.value || "" }));
    setStats(s.length ? s : []);
  }, [item.id, item.title, item.body]);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const fileUrl = await uploadFile(file);
      setImage(fileUrl);
    } catch (err) {
      setMessage(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const meta_json = {
        image_url: image,
        list: list.split("\n").map((s) => s.trim()).filter(Boolean),
        stats: stats.filter((s) => s.label.trim()).map((s) => ({ label: s.label.trim(), value: s.value.trim() }))
      };
      await apiRequest(`/admin/site-content/${item.id}`, {
        method: "PATCH",
        body: { page_key: item.page_key, section_key: item.section_key, title, body, meta_json },
        token
      });
      setMessage("Saved successfully.");
      onSaved();
    } catch (err) {
      setMessage(err.message || "Error saving.");
    }
  };

  return (
    <Panel className="overflow-hidden p-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:bg-gray-50/50"
      >
        <div className="flex items-center gap-3 min-w-0">
          {image && <img src={image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover border border-black/5" />}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{title || sectionLabel}</p>
            <p className="mt-0.5 text-xs text-gray-400">{sectionLabel}</p>
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <form className="border-t border-black/5 p-5 grid gap-4" onSubmit={handleSave}>
          <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextArea label="Body / Description" value={body} onChange={(e) => setBody(e.target.value)} className="min-h-[100px]" />

          {/* Image */}
          <div className="rounded-xl border border-dashed border-black/8 bg-gray-50/50 p-4">
            <p className="text-sm font-semibold text-gray-900">Section Image</p>
            <div className={`mt-3 grid gap-3 ${image ? "sm:grid-cols-[1fr_160px]" : ""}`}>
              <label className="block rounded-xl border border-dashed border-black/10 bg-white px-4 py-4 text-center transition hover:border-black/20 cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); e.target.value = ""; }} />
                <span className="text-sm font-medium text-gray-700">{uploading ? "Uploading..." : "Choose image"}</span>
                <span className="mt-1 block text-xs text-gray-400">JPG, PNG, WebP</span>
              </label>
              {image && (
                <div className="relative">
                  <img src={image} alt="" className="h-full min-h-[60px] w-full rounded-lg object-cover border border-black/5" />
                  <button type="button" onClick={() => setImage("")} className="absolute top-1 right-1 rounded-md bg-white/90 p-1 text-gray-400 hover:text-red-500 transition"><X className="h-3 w-3" /></button>
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Or pick existing:</p>
              <div className="flex flex-wrap gap-1.5">
                {EXISTING_IMAGES.filter((img) => !img.label.startsWith("Avatar") && img.label !== "Logo Mark").map((img) => (
                  <button key={img.url} type="button" onClick={() => setImage(img.url)} className={`overflow-hidden rounded-lg border-2 transition ${image === img.url ? "border-gray-900 ring-1 ring-gray-900/20" : "border-black/5 hover:border-black/15"}`}>
                    <img src={img.url} alt={img.label} className="h-10 w-14 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List items */}
          <TextArea label="List Items (one per line)" value={list} onChange={(e) => setList(e.target.value)} className="min-h-[80px]" placeholder={"CNC Turning & Milling\nVMC Job Work"} />

          {/* Stats */}
          {stats.length > 0 && (
            <div className="rounded-xl border border-black/5 bg-gray-50/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900">Statistics</p>
                <Button type="button" variant="secondary" onClick={() => setStats((cur) => [...cur, { id: Math.random().toString(), label: "", value: "" }])} className="!py-1 !px-2 !text-xs">Add</Button>
              </div>
              <div className="space-y-2">
                {stats.map((stat) => (
                  <div key={stat.id} className="flex items-center gap-2">
                    <Input placeholder="Label" value={stat.label} onChange={(e) => setStats((cur) => cur.map((s) => s.id === stat.id ? { ...s, label: e.target.value } : s))} />
                    <Input placeholder="Value" value={stat.value} onChange={(e) => setStats((cur) => cur.map((s) => s.id === stat.id ? { ...s, value: e.target.value } : s))} />
                    <button type="button" onClick={() => setStats((cur) => cur.filter((s) => s.id !== stat.id))} className="text-gray-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {stats.length === 0 && (
            <button type="button" onClick={() => setStats([{ id: Math.random().toString(), label: "", value: "" }])} className="text-xs text-gray-500 hover:text-gray-700 transition">+ Add statistics</button>
          )}

          {message && <p className={`rounded-lg px-3 py-2 text-xs font-medium ${message.includes("Saved") ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-600"}`}>{message}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={uploading}>Save Changes</Button>
          </div>
        </form>
      )}
    </Panel>
  );
}

function CategoryListItem({ item, active, productCount, onSelect, onDelete }) {
  return (
    <div
      className={`rounded-2xl border transition-all ${
        active
          ? "border-gray-900 bg-gray-900 text-white shadow-[0_14px_30px_rgba(17,24,39,0.14)]"
          : "border-black/5 bg-white hover:border-black/10 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3 p-3.5">
        <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-sm font-semibold ${active ? "text-white" : "text-gray-900"}`}>{item.name}</p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              active
                ? "bg-white/12 text-white/80"
                : item.is_active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-gray-500"
            }`}>
              {item.is_active ? "Active" : "Inactive"}
            </span>
          </div>
          <p className={`mt-1 text-xs ${active ? "text-white/70" : "text-gray-500"}`}>/{item.slug || "no-slug"}</p>
          <p className={`mt-2 text-xs leading-5 ${active ? "text-white/78" : "text-gray-500"}`}>
            {item.description || "No description added yet."}
          </p>
          <div className={`mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium ${
            active ? "text-white/78" : "text-gray-500"
          }`}>
            <span className={`rounded-full px-2.5 py-1 ${active ? "bg-white/10 text-white" : "bg-gray-100 text-gray-700"}`}>
              {productCount} {productCount === 1 ? "product" : "products"}
            </span>
            <span>Sort {Number(item.sort_order || 0)}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={onDelete}
          className={`shrink-0 rounded-xl border p-2 transition ${
            active
              ? "border-white/15 bg-white/8 text-white/80 hover:bg-white/14 hover:text-white"
              : "border-black/5 bg-white text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          }`}
          title={`Delete ${item.name}`}
          aria-label={`Delete ${item.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function ViewTabs({ basePath, activeValue, items }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-gray-100 p-1">
      {items.map((item) => {
        const href = item.value ? `${basePath}?panel=${item.value}` : basePath;
        const active = activeValue === item.value;
        return (
          <Link
            key={item.value || item.label}
            to={href}
            className={`min-w-0 flex-1 rounded-md px-3 py-1.5 text-center text-xs font-medium transition sm:flex-none ${
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
      <div className="min-h-screen lg:pl-[240px]">
        {/* Sidebar - fixed on desktop */}
        <aside className={`fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col border-r border-black/5 bg-white transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center gap-2.5 border-b border-black/5 px-4 py-3.5">
            <img src="/images/mlogo-mark.png" alt="Logo" className="h-8 w-8 rounded-lg object-cover" />
            <div>
              <p className="font-display text-sm font-bold text-gray-900">Mechnno Vation</p>
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
          <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-black/5 bg-white/80 px-6 py-4 backdrop-blur-lg lg:px-8">
            <button type="button" onClick={() => setSidebarOpen(true)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-sm font-medium text-gray-900">Admin Dashboard</p>
          </header>
          <main className="flex-1 px-6 py-6 lg:px-8">
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
            <p className="font-display text-xl font-bold text-gray-900">Mechnno Vation</p>
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
  const [specRows, setSpecRows] = useState([createSpecRow()]);
  const [imageUploading, setImageUploading] = useState(false);

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
      setSpecRows([createSpecRow()]);
      setProductMessage("");
      return;
    }
    const nextRows = specsObjectToRows(item.specs_json || {});
    setSelectedProductId(item.id || "new");
    setProductForm({
      id: item.id,
      category_id: item.category_id || fallbackCategoryId,
      name: item.name || "",
      slug: item.slug || "",
      short_description: item.short_description || "",
      description: item.description || "",
      primary_image_url: item.primary_image_url || "",
      gallery_urls_json: (item.gallery_urls_json || []).join("\n"),
      is_featured: item.is_featured ?? false,
      is_active: item.is_active ?? true
    });
    setSpecRows(nextRows.length ? nextRows : [createSpecRow()]);
    setProductMessage("");
  };

  const updateSpecRow = (id, key, value) => {
    setSpecRows((current) => current.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const addSpecRow = () => {
    setSpecRows((current) => [...current, createSpecRow()]);
  };

  const removeSpecRow = (id) => {
    setSpecRows((current) => {
      if (current.length === 1) return [createSpecRow()];
      return current.filter((row) => row.id !== id);
    });
  };

  const handlePrimaryImageUpload = async (file) => {
    if (!file) return;
    setImageUploading(true);
    setProductMessage("");
    try {
      const fileUrl = await uploadFile(file);
      setProductForm((current) => ({ ...current, primary_image_url: fileUrl }));
      setProductMessage("Image uploaded. You can save the product now.");
    } catch (err) {
      setProductMessage(err.message || "Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const productEditorRef = useRef(null);

  const scrollToEditor = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const startNewProduct = () => {
    if (!categories.length) {
      setProductMessage("Create a category first, then add a product.");
      return;
    }
    const preferredCategory =
      (selectedCategoryId && selectedCategoryId !== "new" ? selectedCategoryId : "") ||
      categories[0]?.id ||
      "";
    applyProductSelection(null, preferredCategory);
    scrollToEditor();
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
      const prodItem = nextProdId ? prods.find((p) => p.id === nextProdId) || null : null;
      if (prodItem) {
        applyProductSelection(prodItem, prodItem.category_id || cats[0]?.id || "");
      } else if (!nextProdId) {
        setSelectedProductId("");
      }
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
      broadcastCatalogUpdate();
    } catch (err) { setCategoryMessage(err.message); }
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    setProductMessage("");
    try {
      const method = productForm.id ? "PATCH" : "POST";
      const path = productForm.id ? `/admin/products/${productForm.id}` : "/admin/products";
      const saved = await apiRequest(path, {
        method,
        body: {
          ...productForm,
          specs_json: specsRowsToObject(specRows),
          gallery_urls_json: (productForm.gallery_urls_json || "").split(/\n|,/).map((s) => s.trim()).filter(Boolean)
        },
        token
      });
      setProductMessage("Saved.");
      await load(selectedCategoryId, saved.id);
      broadcastCatalogUpdate();
    } catch (err) { setProductMessage(err.message || "Could not save product."); }
  };

  const removeCategory = async (id) => {
    await apiRequest(`/admin/categories/${id}`, { method: "DELETE", token });
    setCategoryMessage("Deleted.");
    await load("", selectedProductId);
    broadcastCatalogUpdate();
  };

  const removeProduct = async (id) => {
    await apiRequest(`/admin/products/${id}`, { method: "DELETE", token });
    setProductMessage("Deleted.");
    await load(selectedCategoryId, "");
    broadcastCatalogUpdate();
  };

  if (loading) return <LoadingPanel label="Loading catalog..." />;

  const filteredProducts = selectedCategoryId && selectedCategoryId !== "new"
    ? products.filter((p) => p.category_id === selectedCategoryId)
    : products;
  const selectedCategory = categories.find((item) => item.id === selectedCategoryId) || null;
  const productCountByCategory = products.reduce((acc, item) => {
    acc[item.category_id] = (acc[item.category_id] || 0) + 1;
    return acc;
  }, {});
  const activeCategoryCount = categories.filter((item) => item.is_active).length;

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
        <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1.1fr)_minmax(0,0.9fr)]">
          {/* Category list */}
          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Categories" description={`${categories.length} total`} action={
              <button
                type="button"
                onClick={() => applyCategorySelection(null)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
              >
                <Plus className="h-3.5 w-3.5" />
                New
              </button>
            } />
            <div className="grid grid-cols-2 gap-2 border-b border-black/5 bg-gray-50/80 px-4 py-3">
              <div className="rounded-xl border border-black/5 bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">Active</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{activeCategoryCount}</p>
              </div>
              <div className="rounded-xl border border-black/5 bg-white px-3 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">Linked Products</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{products.length}</p>
              </div>
            </div>
            <div className="max-h-[calc(100vh-292px)] space-y-2.5 overflow-y-auto bg-[linear-gradient(180deg,rgba(249,250,251,0.9),rgba(255,255,255,0))] p-3">
              {selectedCategoryId === "new" && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">New category draft</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">Fill in the editor to create a category, then products can be assigned to it.</p>
                </div>
              )}
              <SmallList items={categories} emptyTitle="No categories" emptyBody="Create your first category." renderItem={(item) => (
                <CategoryListItem
                  key={item.id}
                  item={item}
                  active={selectedCategoryId === item.id}
                  productCount={productCountByCategory[item.id] || 0}
                  onSelect={() => applyCategorySelection(item)}
                  onDelete={() => removeCategory(item.id)}
                />
              )} />
            </div>
          </Panel>

          {/* Category editor */}
          <Panel className="overflow-hidden p-0">
            <SectionTitle
              title={categoryForm.id ? "Edit category" : "Create category"}
              description={categoryForm.id ? `Selected: ${categoryForm.name || selectedCategory?.name || "category"}` : "Set up how this group appears in the catalog."}
            />
            <form className="grid gap-3 p-4" onSubmit={saveCategory}>
              <div className="rounded-2xl border border-black/5 bg-gray-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Catalog preview</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold text-gray-900">{categoryForm.name || "Untitled category"}</p>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    categoryForm.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {categoryForm.is_active ? "Visible" : "Hidden"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">/{categoryForm.slug || "category-slug"} - Sort {Number(categoryForm.sort_order || 0)}</p>
              </div>
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
              {categoryMessage && <p className="rounded-xl border border-black/5 bg-gray-50 px-3 py-2 text-xs text-gray-600">{categoryMessage}</p>}
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {categoryForm.id && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => removeCategory(categoryForm.id)}
                      className="w-full border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 sm:w-auto"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Category
                    </Button>
                  )}
                </div>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Panel>

          {/* Products in category */}
          <Panel className="overflow-hidden p-0">
            <SectionTitle
              title={selectedCategoryId === "new" ? "Products in category" : selectedCategory?.name || "Products in category"}
              description={selectedCategoryId === "new" ? "Save the category before attaching products." : `${filteredProducts.length} linked ${filteredProducts.length === 1 ? "item" : "items"}`}
            />
            <div className="max-h-[calc(100vh-240px)] space-y-2 overflow-y-auto p-4">
              <SmallList items={filteredProducts} emptyTitle="No products" emptyBody="Add products from the Products tab." renderItem={(item) => (
                <div key={item.id} className="rounded-2xl border border-black/5 bg-gradient-to-br from-gray-50 to-white p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="mt-1 text-xs text-gray-500">{item.category?.name || item.category_id}</p>
                    </div>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        item.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        {item.is_active ? "Active" : "Inactive"}
                      </span>
                      {item.is_featured && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">Featured</span>}
                    </div>
                  </div>
                  {item.short_description && <p className="mt-2 text-xs leading-5 text-gray-500">{item.short_description}</p>}
                </div>
              )} />
            </div>
          </Panel>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Product editor - shown above table when adding or editing */}
          {selectedProductId && (
            <Panel ref={productEditorRef} className="overflow-hidden p-0">
              <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
                <h2 className="font-display text-xl font-bold text-gray-900">
                  {productForm.id ? "Edit Product" : "New Product"}
                </h2>
                <button type="button" onClick={() => { setSelectedProductId(""); setProductMessage(""); }} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-5">
                {!categories.length ? (
                  <EmptyPanel title="Create a category first" body="Products need at least one category." />
                ) : (
                  <form className="grid gap-4" onSubmit={saveProduct}>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Select label="Category" value={productForm.category_id} onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}>
                        <option value="">Select</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </Select>
                      <Input label="Name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                      <Input label="Slug" value={productForm.slug} onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} placeholder="auto-generated-friendly-name" />
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-black/5 bg-gray-50/80 p-4">
                          <Input
                            label="Primary image URL"
                            value={productForm.primary_image_url}
                            onChange={(e) => setProductForm({ ...productForm, primary_image_url: e.target.value })}
                            placeholder="https://..."
                          />
                          <p className="mt-2 text-xs text-gray-500">Paste an image link here, or use the upload box on the right to fill this automatically.</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <TextArea label="Short description" value={productForm.short_description} onChange={(e) => setProductForm({ ...productForm, short_description: e.target.value })} className="min-h-[100px]" />
                          <TextArea label="Full description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="min-h-[100px]" />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-dashed border-black/10 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Upload product image</p>
                            <p className="mt-1 text-xs leading-5 text-gray-500">Choose a file and we will upload it, then place the image URL into the field automatically.</p>
                          </div>
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-500">JPG, PNG, WebP</span>
                        </div>
                        <label className="mt-4 block rounded-2xl border border-dashed border-black/10 bg-gray-50 px-4 py-5 text-center transition hover:border-black/20 hover:bg-gray-100/70">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              if (file) handlePrimaryImageUpload(file);
                              e.target.value = "";
                            }}
                          />
                          <span className="block text-sm font-medium text-gray-900">{imageUploading ? "Uploading image..." : "Choose image file"}</span>
                          <span className="mt-1 block text-xs text-gray-500">Simple upload for the main product image.</span>
                        </label>
                        <div className="mt-4 overflow-hidden rounded-2xl border border-black/5 bg-gray-50">
                          {productForm.primary_image_url ? (
                            <img
                              src={productForm.primary_image_url}
                              alt={productForm.name || "Product preview"}
                              className="h-48 w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-48 items-center justify-center px-6 text-center text-sm text-gray-400">
                              Image preview will appear here.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/5 bg-white p-4">
                      <div className="flex flex-col gap-3 border-b border-black/5 pb-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Product specifications</p>
                          <p className="mt-1 text-xs text-gray-500">Add label and value pairs. These appear on the product page under Technical Specifications.</p>
                        </div>
                        <Button type="button" variant="secondary" onClick={addSpecRow} className="sm:self-start">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Spec
                        </Button>
                      </div>
                      <div className="mt-4 space-y-3">
                        {specRows.map((row, index) => (
                          <div key={row.id} className="grid gap-3 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)_auto] sm:items-end">
                            <Input
                              label={index === 0 ? "Specification name" : "Spec name"}
                              value={row.label}
                              onChange={(e) => updateSpecRow(row.id, "label", e.target.value)}
                              placeholder="Material"
                            />
                            <Input
                              label={index === 0 ? "Value" : "Spec value"}
                              value={row.value}
                              onChange={(e) => updateSpecRow(row.id, "value", e.target.value)}
                              placeholder="EN8 / Stainless Steel / +/-0.02 mm"
                            />
                            <button
                              type="button"
                              onClick={() => removeSpecRow(row.id)}
                              className="inline-flex h-11 items-center justify-center rounded-xl border border-black/10 px-3 text-sm font-medium text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              title="Remove specification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <TextArea
                      label="Gallery image URLs"
                      value={productForm.gallery_urls_json}
                      onChange={(e) => setProductForm({ ...productForm, gallery_urls_json: e.target.value })}
                      className="min-h-[90px]"
                      placeholder={"https://example.com/product-side.jpg\nhttps://example.com/product-closeup.jpg"}
                    />

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="h-4 w-4 rounded" checked={Boolean(productForm.is_featured)} onChange={(e) => setProductForm({ ...productForm, is_featured: e.target.checked })} />
                        <span className="text-gray-700">Featured</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="h-4 w-4 rounded" checked={Boolean(productForm.is_active)} onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })} />
                        <span className="text-gray-700">Active</span>
                      </label>
                    </div>
                    {productMessage && <p className="rounded-xl border border-black/5 bg-gray-50 px-3 py-2 text-xs text-gray-600">{productMessage}</p>}
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="secondary" onClick={() => { setSelectedProductId(""); setProductMessage(""); }}>Cancel</Button>
                      {productForm.id && <Button type="button" variant="secondary" onClick={() => removeProduct(productForm.id)}>Delete</Button>}
                      <Button type="submit" disabled={!productForm.category_id || imageUploading}>Save</Button>
                    </div>
                  </form>
                )}
              </div>
            </Panel>
          )}

          {/* Products table */}
          <Panel className="overflow-hidden p-0">
            <SectionTitle title="All Products" description={`${products.length} items`} action={
              <Button onClick={startNewProduct} className="flex items-center gap-1.5 !py-1.5 !px-3 !text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Product
              </Button>
            } />
            {productMessage && !selectedProductId && <div className="px-5 pt-3"><p className="text-sm text-gray-600">{productMessage}</p></div>}

            {products.length === 0 ? (
              <div className="p-6">
                <EmptyPanel title="No products yet" body="Click 'Add Product' to create your first product." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="border-b border-black/5 bg-gray-50 text-left text-xs text-gray-500">
                    <tr>
                      <th className="px-5 py-2.5 font-medium">Product</th>
                      <th className="px-5 py-2.5 font-medium">Category</th>
                      <th className="px-5 py-2.5 font-medium">Status</th>
                      <th className="px-5 py-2.5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {products.map((item) => (
                      <tr key={item.id} className={`transition ${selectedProductId === item.id ? "bg-gray-50" : "hover:bg-gray-50/50"}`}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.primary_image_url || "/images/industrial-placeholder.svg"}
                              alt={item.name}
                              className="h-10 w-10 rounded-lg object-cover bg-gray-100"
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              {item.short_description && <p className="mt-0.5 max-w-xs truncate text-xs text-gray-400">{item.short_description}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-600">{item.category?.name || ""}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1.5">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${item.is_active ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                              {item.is_active ? "Active" : "Inactive"}
                            </span>
                            {item.is_featured && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">Featured</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button type="button" onClick={() => { applyProductSelection(item, categories[0]?.id || ""); scrollToEditor(); }} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Edit">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" onClick={() => removeProduct(item.id)} className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
  const [contentImage, setContentImage] = useState("");
  const [contentList, setContentList] = useState("");
  const [contentStats, setContentStats] = useState([{ id: Math.random().toString(), label: "", value: "" }]);
  const [contentImageUploading, setContentImageUploading] = useState(false);
  const [contentMessage, setContentMessage] = useState("");
  const [pageTab, setPageTab] = useState("home");
  const [selectedTestimonialId, setSelectedTestimonialId] = useState("");
  const [testimonialForm, setTestimonialForm] = useState(createTestimonial());
  const [testimonialImage, setTestimonialImage] = useState("");
  const [testimonialImageUploading, setTestimonialImageUploading] = useState(false);
  const [testimonialMessage, setTestimonialMessage] = useState("");

  const handleTestimonialImageUpload = async (file) => {
    if (!file) return;
    setTestimonialImageUploading(true);
    setTestimonialMessage("");
    try {
      const fileUrl = await uploadFile(file);
      setTestimonialImage(fileUrl);
      setTestimonialMessage("Image uploaded.");
    } catch (err) {
      setTestimonialMessage(err.message || "Upload failed.");
    } finally {
      setTestimonialImageUploading(false);
    }
  };

  const applyContentSelection = (item) => {
    if (!item) {
      setSelectedContentId("new");
      setContentForm(createContent());
      setContentImage("");
      setContentList("");
      setContentStats([{ id: Math.random().toString(), label: "", value: "" }]);
      return;
    }
    setSelectedContentId(item.id || "new");
    setContentForm({ id: item.id, page_key: item.page_key || "about", section_key: item.section_key || "main", title: item.title || "", body: item.body || "" });
    const meta = item.meta_json || {};
    setContentImage(meta.image_url || "");
    setContentList((meta.list || []).join("\n"));
    const initialStats = (meta.stats || []).map((s) => ({ id: Math.random().toString(), label: s.label || "", value: s.value || "" }));
    setContentStats(initialStats.length ? initialStats : [{ id: Math.random().toString(), label: "", value: "" }]);
  };

  const handleContentImageUpload = async (file) => {
    if (!file) return;
    setContentImageUploading(true);
    setContentMessage("");
    try {
      const fileUrl = await uploadFile(file);
      setContentImage(fileUrl);
      setContentMessage("Image uploaded.");
    } catch (err) {
      setContentMessage(err.message || "Upload failed.");
    } finally {
      setContentImageUploading(false);
    }
  };

  const applyTestimonialSelection = (item) => {
    if (!item) {
      setSelectedTestimonialId("new");
      setTestimonialForm(createTestimonial());
      setTestimonialImage("");
      return;
    }
    setSelectedTestimonialId(item.id || "new");
    setTestimonialForm({ id: item.id, name: item.name || "", company: item.company || "", quote: item.quote || "", is_active: item.is_active ?? true, sort_order: item.sort_order || 0 });
    setTestimonialImage(item.image_url || "");
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
      const meta_json = {
        image_url: contentImage,
        list: contentList.split("\n").map(s => s.trim()).filter(Boolean),
        stats: contentStats.filter(s => s.label.trim()).map(s => ({ label: s.label.trim(), value: s.value.trim() }))
      };
      const payload = { ...contentForm, meta_json };
      const method = contentForm.id ? "PATCH" : "POST";
      const path = contentForm.id ? `/admin/site-content/${contentForm.id}` : "/admin/site-content";
      const saved = await apiRequest(path, { method, body: payload, token });
      setContentMessage("Saved.");
      await load(saved.id, selectedTestimonialId);
    } catch (err) { setContentMessage(err.message || "Error saving content."); }
  };

  const saveTestimonial = async (e) => {
    e.preventDefault();
    setTestimonialMessage("");
    try {
      const method = testimonialForm.id ? "PATCH" : "POST";
      const path = testimonialForm.id ? `/admin/testimonials/${testimonialForm.id}` : "/admin/testimonials";
      const saved = await apiRequest(path, { method, body: { ...testimonialForm, image_url: testimonialImage, sort_order: Number(testimonialForm.sort_order || 0) }, token });
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
        title="Page Content"
        description="Edit text, images, and content across your website pages."
        actions={
          <ViewTabs basePath="/admin/content" activeValue={activePanel} items={[
            { value: "sections", label: "Page Sections" },
            { value: "testimonials", label: "Testimonials" }
          ]} />
        }
      />

      {activePanel === "sections" ? (() => {
        const sectionsForPage = siteContent.filter((s) => s.page_key === pageTab);
        return (
          <div className="space-y-5">
            {/* Page tabs */}
            <div className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1">
              {CONTENT_PAGE_TABS.map((tab) => {
                if (tab.linkTo) {
                  return (
                    <Link key={tab.value} to={tab.linkTo} className="rounded-lg px-4 py-2 text-xs font-medium text-gray-400 transition hover:text-gray-600">
                      {tab.label} <span className="text-[10px]">{"->"}</span>
                    </Link>
                  );
                }
                const active = pageTab === tab.value;
                return (
                  <button key={tab.value} type="button" onClick={() => setPageTab(tab.value)} className={`rounded-lg px-4 py-2 text-xs font-medium transition ${active ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Visual page editor */}
            <VisualPageEditor pageKey={pageTab} sections={sectionsForPage} token={token} onSaved={() => load()} />
          </div>
        );
      })() : (
        <div className="grid gap-5 xl:grid-cols-[260px_1fr]">
          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Testimonials" description={`${testimonials.length} total`} action={
              <button type="button" onClick={() => applyTestimonialSelection(null)} className="rounded-md bg-gray-900 p-1 text-white hover:bg-gray-800"><Plus className="h-3.5 w-3.5" /></button>
            } />
            <div className="max-h-[calc(100vh-240px)] space-y-1.5 overflow-y-auto p-3">
              <SmallList items={testimonials} emptyTitle="No testimonials" emptyBody="Add testimonials for the About page." renderItem={(item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => applyTestimonialSelection(item)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                    selectedTestimonialId === item.id
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-black/5 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.image_url ? (
                      <img src={item.image_url} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover border border-black/10" />
                    ) : (
                      <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        selectedTestimonialId === item.id ? "bg-white/15 text-white" : "bg-gray-100 text-gray-400"
                      }`}>{(item.name || "?").charAt(0).toUpperCase()}</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium truncate ${selectedTestimonialId === item.id ? "text-white" : "text-gray-900"}`}>{item.name || "Untitled"}</p>
                      <p className={`mt-0.5 text-xs truncate ${selectedTestimonialId === item.id ? "text-gray-300" : "text-gray-400"}`}>{item.company || "testimonial"}</p>
                    </div>
                  </div>
                </button>
              )} />
            </div>
          </Panel>

          <Panel className="overflow-hidden p-0">
            <SectionTitle title="Testimonial editor" />
            <form className="grid gap-3 p-4" onSubmit={saveTestimonial}>
              {/* Photo upload + preview */}
              <div className="rounded-2xl border border-dashed border-black/10 bg-white p-4">
                <p className="text-sm font-semibold text-gray-900">Person Photo</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">Upload a profile photo for the testimonial card.</p>
                <div className="mt-3 flex items-center gap-4">
                  {testimonialImage ? (
                    <div className="relative shrink-0">
                      <img src={testimonialImage} alt="Testimonial" className="h-16 w-16 rounded-full object-cover border-2 border-black/10 shadow-sm" />
                      <button type="button" onClick={() => setTestimonialImage("")} className="absolute -top-1 -right-1 rounded-full bg-white p-0.5 text-gray-400 shadow-sm hover:text-red-500 transition"><X className="h-3 w-3" /></button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-300">
                      {(testimonialForm.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label className="flex-1 rounded-xl border border-dashed border-black/10 bg-gray-50 px-4 py-3 text-center transition hover:border-black/20 hover:bg-gray-100/70 cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0] || null; if (file) handleTestimonialImageUpload(file); e.target.value = ""; }} />
                    <span className="block text-sm font-medium text-gray-900">{testimonialImageUploading ? "Uploading..." : "Choose photo"}</span>
                    <span className="mt-0.5 block text-[11px] text-gray-400">JPG, PNG, WebP</span>
                  </label>
                </div>
                {/* Existing avatar photos */}
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">Or pick from existing photos:</p>
                  <div className="flex flex-wrap gap-2">
                    {EXISTING_IMAGES.filter(img => img.label.startsWith("Avatar") || img.label.includes("Operator") || img.label.includes("Team")).map((img) => (
                      <button
                        key={img.url}
                        type="button"
                        onClick={() => setTestimonialImage(img.url)}
                        className={`relative overflow-hidden rounded-full border-2 transition ${
                          testimonialImage === img.url ? "border-electric-500 ring-2 ring-electric-500/20" : "border-black/5 hover:border-black/20"
                        }`}
                      >
                        <img src={img.url} alt={img.label} className="h-10 w-10 object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

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
                <Button type="submit" disabled={testimonialImageUploading}>Save</Button>
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









