import { useDeferredValue, useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useParams
} from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Certificate,
  CheckCircle,
  CaretRight,
  Factory,
  Blueprint,
  GearSix,
  StackSimple,
  Envelope,
  MapPin,
  Phone,
  MagnifyingGlass,
  ShieldCheck,
  Sparkle,
  Timer,
  Wrench,
  X,
  List,
  Users,
  Handshake,
  Trophy,
  Target,
  Star,
  Quotes,
  UserCircle
} from "@phosphor-icons/react";
import { apiRequest, companyDetails, uploadFile } from "../lib/api.js";
import {
  Button,
  Container,
  EmptyPanel,
  Input,
  LoadingPanel,
  Panel,
  SectionHeading,
  StatTile,
  TextArea
} from "../components/ui.jsx";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Products" },
  { to: "/service-request", label: "Services" },
  { to: "/about", label: "About" }
];

/* â”€â”€ Home page data â”€â”€ */

const capabilityCards = [
  {
    title: "Moulding Die",
    body: "Rubber, bottle, plastic, and vacuum-forming tooling built for repeat production.",
    icon: StackSimple
  },
  {
    title: "CNC Components",
    body: "Turned and machined components for batches, assemblies, and repeat orders.",
    icon: Factory
  },
  {
    title: "VMC Job Work",
    body: "Drawing-based machining support for fixtures, inserts, and precision parts.",
    icon: Wrench
  },
  {
    title: "Requirement Review",
    body: "Share scope, quantity, and drawings for a practical quote and next-step review.",
    icon: MagnifyingGlass
  }
];

const homeStats = [
  { label: "Years of Experience", value: "12+" },
  { label: "Manufacturing Focus", value: "CNC / VMC" },
  { label: "Location", value: "Pune, India" },
  { label: "GST Registered Since", value: "2020" }
];

const homeMachineHighlights = [
  {
    title: "CNC Machining",
    body: "Precision machining for turned parts, inserts, and repeat production components.",
    icon: Factory,
    image: "/images/indian_cnc_operator.png"
  },
  {
    title: "VMC Job Work",
    body: "Drawing-based support for fixtures, machined parts, and industrial manufacturing needs.",
    icon: Wrench,
    image: "/images/indian_workshop_team.png"
  },
  {
    title: "Moulding Die",
    body: "Custom die and tooling support for moulding, wear parts, and shop-floor applications.",
    icon: GearSix,
    image: "/images/indian_tooling_gears.png"
  }
];

const processSteps = [
  { step: "01", title: "Share Your Requirement", body: "Upload drawings, specify material, quantity, and timeline." },
  { step: "02", title: "Feasibility Review", body: "We review machining approach, tooling, and production timeline." },
  { step: "03", title: "Get a Quote", body: "Receive a practical quote with clear next steps for production." },
  { step: "04", title: "Production & Delivery", body: "Parts manufactured to spec with quality checks at every stage." }
];

// Use one stronger shared visual for product pages until dedicated product photography is ready.
const sharedProductPageImages = [
  "/images/indian_product_shared.png"
];

/* â”€â”€ Shared components â”€â”€ */

function FeatureCard({ product }) {
  const productImage = sharedProductPageImages[0];

  return (
    <Panel className="group card-hover overflow-hidden motion-fade-up flex flex-col">
      <div className="overflow-hidden">
        <img
          src={productImage}
          alt={`${product.name} manufacturing preview`}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <span className="inline-flex self-start rounded-full bg-electric-500/8 px-3 py-1 text-xs font-medium text-electric-600">
          {product.category?.name || "Industrial"}
        </span>
        <div className="flex-1">
          <h3 className="font-display text-xl font-bold text-gray-900">{product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600 line-clamp-2">{product.short_description}</p>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button to={`/product/${product.slug}`} className="gap-1.5 text-xs">
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Button to="/service-request" variant="ghost" className="text-xs">
            Request Quote
          </Button>
        </div>
      </div>
    </Panel>
  );
}

function PublicFooter() {
  const services = [
    "Moulding Die Manufacturing",
    "CNC Turned Components",
    "VMC Job Work",
    "Fixture & Insert Machining",
    "Drawing-Based Quoting",
    "Batch Production Support"
  ];

  return (
    <footer className="relative mt-20 overflow-hidden bg-gray-950">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, #16bfb4 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16bfb4 0%, transparent 50%)" }} />

      {/* Top accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-electric-500/60 to-transparent" />

      <Container className="relative py-16">
        {/* Main grid */}
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/images/mlogo-mark.png" alt="Mechnnovation Technologies logo" className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10" />
              <div>
                <p className="font-display text-xl font-bold text-white">Mechnnovation</p>
                <p className="text-xs text-electric-400">Technologies</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-gray-400">
              Industrial manufacturer for moulding dies, CNC turned components, and VMC job work. Based in Narhe, Pune since 2012.
            </p>
            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-gray-400">
                <ShieldCheck className="h-3 w-3 text-electric-400" weight="fill" /> GST Verified
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-gray-400">
                <Certificate className="h-3 w-3 text-electric-400" weight="fill" /> 12+ Years
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-xs text-gray-400">
                <Factory className="h-3 w-3 text-electric-400" weight="fill" /> Pune, India
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Services</p>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s} className="text-sm text-gray-400 transition hover:text-electric-400 cursor-default">{s}</li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Navigation</p>
            <div className="space-y-2.5">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} className="block text-sm text-gray-400 transition hover:text-white">
                  {link.label}
                </Link>
              ))}
              <Link to="/admin/login" className="block text-sm text-gray-500 transition hover:text-gray-300">
                Admin Login
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Contact</p>
            <div className="space-y-3.5">
              <a href={`tel:${companyDetails.phone}`} className="flex items-start gap-2.5 text-sm text-gray-400 transition hover:text-white">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric-500" weight="fill" />
                <span>{companyDetails.phone}</span>
              </a>
              <a href={`mailto:${companyDetails.email}`} className="flex items-start gap-2.5 text-sm text-gray-400 transition hover:text-white">
                <Envelope className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric-500" weight="fill" />
                <span className="break-all">{companyDetails.email}</span>
              </a>
              <div className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric-500" weight="fill" />
                <span>{companyDetails.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px bg-white/6" />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-600">
            Â© {new Date().getFullYear()} Mechnnovation Technologies. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            GSTIN: <span className="text-gray-500">{companyDetails.gstin}</span>
            <span className="mx-2 text-gray-700">Â·</span>
            Partnership Firm
            <span className="mx-2 text-gray-700">Â·</span>
            Narhe, Pune â€” 411041
          </p>
        </div>
      </Container>
    </footer>
  );
}

export function PublicLayout() {
  const [menuOpen, setListOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setListOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="public-shell min-h-screen">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <Container className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/images/mlogo-mark.png" alt="Mechnnovation Technologies logo" className="h-9 w-9 rounded-lg object-cover sm:h-10 sm:w-10" />
            <div>
              <p className="font-display text-lg font-bold leading-none text-gray-900 sm:text-xl">Mechnnovation</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Precision Manufacturing</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button to="/contact" className="ml-3">Contact</Button>
          </nav>

          <button
            type="button"
            onClick={() => setListOpen((v) => !v)}
            className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
          </button>
        </Container>

        {menuOpen ? (
          <div className="border-t border-black/5 bg-white lg:hidden">
            <Container className="grid gap-1 py-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  {link.label}
                </NavLink>
              ))}
              <Button to="/contact" className="mt-2 w-full">Contact</Button>
            </Container>
          </div>
        ) : null}
      </header>

      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

/* â”€â”€ Home Page â”€â”€ */

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background image â€” full visibility, no blur */}
        <div className="absolute inset-0">
          <img
            src="/images/indian_cnc_bgworker.png"
            alt=""
            className="h-full w-full object-cover scale-[1.02]"
          />
        </div>

        {/* Left-to-right fade overlay: near-opaque dark on left â†’ almost transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-gray-950/5" />

        <Container className="relative py-20 sm:py-28 lg:py-36">
          <div className="motion-fade-up max-w-2xl">
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Precision CNC machining<br className="hidden sm:block" /> & <span style={{ color: "#c70e08" }}>industrial tooling</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-gray-300 sm:text-lg">
              Moulding dies, CNC turned components, and VMC job work. Fast response, practical communication, reliable execution.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to="/contact" className="bg-white text-gray-900 shadow-none hover:bg-gray-100">
                Contact <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button to="/catalog" variant="ghost" className="text-white/80 hover:text-white">
                Browse Products <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats bar */}
      <section className="border-b border-black/5 bg-white">
        <Container className="grid grid-cols-2 divide-x divide-black/5 lg:grid-cols-4">
          {homeStats.map((stat, i) => (
            <div key={stat.label} className="motion-fade-up px-5 py-6 text-center" style={{ "--motion-delay": `${i * 80}ms` }}>
              <p className="font-display text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* Capabilities */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="motion-fade-up text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">What We Do</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Core capabilities
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-gray-600">
              End-to-end manufacturing support for industrial buyers, from drawing review to production delivery.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {capabilityCards.map((card, i) => (
              <div
                key={card.title}
                className="motion-fade-up card-hover rounded-2xl border border-black/5 bg-white p-6"
                style={{ "--motion-delay": `${100 + i * 80}ms` }}
              >
                <div className="inline-flex rounded-xl bg-electric-500/8 p-3 text-electric-500">
                  <card.icon className="h-6 w-6" weight="duotone" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-gray-900">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{card.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Machine Highlights */}
      <section className="border-y border-black/5 bg-gray-50 py-16 sm:py-20">
        <Container>
          <div className="motion-fade-up max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">Our Machines</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Production-ready machining
            </h2>
            <p className="mt-3 text-base text-gray-600">
              CNC, VMC, and tooling support managed around actual shop requirements.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {homeMachineHighlights.map((item, i) => (
              <article
                key={item.title}
                className="motion-fade-up group card-hover overflow-hidden rounded-2xl border border-black/5 bg-white"
                style={{ "--motion-delay": `${100 + i * 80}ms` }}
              >
                <div className="overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-52 w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="inline-flex rounded-xl bg-electric-500/8 p-2.5 text-electric-500">
                    <item.icon className="h-5 w-5" weight="duotone" />
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>
                  <Link to="/contact" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-electric-500 transition hover:text-electric-600">
                    Send Enquiry <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="motion-fade-up text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">How It Works</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Simple process, reliable results
            </h2>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item, i) => (
              <div key={item.step} className="motion-fade-up relative pl-6" style={{ "--motion-delay": `${100 + i * 80}ms` }}>
                {i < processSteps.length - 1 && (
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-electric-500/30 to-transparent" />
                )}
                {i === processSteps.length - 1 && (
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-electric-500/30 to-transparent" />
                )}
                <span className="font-display text-3xl font-bold text-electric-400/30">{item.step}</span>
                <h3 className="mt-3 font-display text-base font-bold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0">
          <img src="/images/indian_workshop_team.png" alt="" className="h-full w-full object-cover blur-[2px] scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-900/30 to-electric-600/20" />
        </div>
        <Container className="relative text-center">
          <div className="motion-fade-up mx-auto max-w-xl rounded-3xl border border-white/15 bg-white/8 px-8 py-10 shadow-2xl backdrop-blur-md sm:px-12">
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl drop-shadow-sm">
              Ready to discuss your project?
            </h2>
            <p className="mt-3 text-base text-white/75">
              Share your drawing or requirement and get a practical quote from our team.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button to="/contact" className="bg-white/90 text-gray-900 shadow-lg shadow-black/10 backdrop-blur-sm hover:bg-white">
                Submit Enquiry <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button to="/service-request" variant="ghost" className="text-white/90 hover:text-white">
                Service Request <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

/* â”€â”€ Catalog â”€â”€ */

export function CatalogPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest("/categories")
      .then((data) => {
        if (active) setCategories(data.items || []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = new URLSearchParams();
    if (deferredSearch) params.set("search", deferredSearch);
    if (activeCategory) params.set("category", activeCategory);
    params.set("pageSize", "24");

    apiRequest(`/products?${params.toString()}`)
      .then((data) => {
        if (!active) return;
        setProducts(data.items || []);
        setTotal(data.total || 0);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [deferredSearch, activeCategory]);

  return (
    <Container className="py-16">
      <div className="motion-fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">Products & Services</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">Product catalog</h1>
        <p className="mt-2 text-base text-gray-600">Browse our catalog and send your requirement for a quote.</p>
      </div>

      <div className="mt-8 space-y-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search moulding dies, CNC components, VMC job work..."
          className="w-full rounded-xl border border-black/8 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("")}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${activeCategory === "" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${activeCategory === cat.slug ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>{total} items</span>
        <Link to="/service-request" className="inline-flex items-center gap-1 text-electric-500 hover:text-electric-600">
          Need custom machining? <CaretRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="mt-8"><LoadingPanel label="Loading catalog..." /></div>
      ) : products.length === 0 ? (
        <div className="mt-8"><EmptyPanel title="No products found" body="Adjust your search or switch categories." /></div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <FeatureCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </Container>
  );
}

/* â”€â”€ Product Detail â”€â”€ */

export function ProductDetailPage() {
  const { slug } = useParams();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", quantity: "", message: "", file: null });

  useEffect(() => {
    let active = true;
    apiRequest(`/products/${slug}`)
      .then((data) => { if (active) setPayload(data); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  if (loading) return <Container className="py-16"><LoadingPanel label="Loading product..." /></Container>;
  if (!payload?.product) return <Container className="py-16"><EmptyPanel title="Product not found" body="The product you requested could not be loaded." /></Container>;

  const { product, related } = payload;
  const productImages = sharedProductPageImages;

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess("");
    try {
      const fileUrl = form.file ? await uploadFile(form.file) : "";
      await apiRequest("/enquiries", {
        method: "POST",
        body: {
          product_id: product.id,
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email,
          quantity: form.quantity,
          message: form.message,
          file_url: fileUrl
        }
      });
      setSuccess("Requirement submitted successfully. Our team will contact you shortly.");
      setForm({ name: "", company: "", phone: "", email: "", quantity: "", message: "", file: null });
    } catch (error) {
      setSuccess(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-16">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/catalog" className="hover:text-gray-900">Products</Link>
        <CaretRight className="h-3.5 w-3.5" />
        <span className="text-gray-900">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Panel className="overflow-hidden">
            <img src={productImages[0]} alt={`${product.name} manufacturing preview`} className="h-[400px] w-full object-cover" />
          </Panel>
          {productImages.length > 1 && (
            <div className="mt-4 grid gap-3 grid-cols-3">
              {productImages.map((image, index) => (
                <Panel key={`${image}-${index}`} className="overflow-hidden">
                  <img src={image} alt={`${product.name} preview ${index + 1}`} className="h-28 w-full object-cover" />
                </Panel>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">{product.category?.name}</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-3 text-base leading-7 text-gray-600">{product.description}</p>
          </div>

          {Object.keys(product.specs_json || {}).length > 0 && (
            <Panel className="p-5">
              <h2 className="font-display text-lg font-bold text-gray-900">Specifications</h2>
              <div className="mt-4 space-y-2.5">
                {Object.entries(product.specs_json || {}).map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-black/5 pb-2.5 text-sm">
                    <span className="font-medium text-gray-900">{label}</span>
                    <span className="text-right text-gray-600">{String(value)}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <Panel className="p-5">
            <h2 className="font-display text-lg font-bold text-gray-900">Request This Product</h2>
            <form className="mt-4 grid gap-3" onSubmit={submit}>
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <Input label="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              <TextArea label="Custom Requirements" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              <label className="block text-sm text-gray-700">
                <span className="mb-1.5 block font-medium">Upload Drawing / File</span>
                <input type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} className="block w-full rounded-xl border border-dashed border-black/10 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-electric-500 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white" />
              </label>
              {success ? <p className="text-sm text-electric-500">{success}</p> : null}
              <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Submitting..." : "Submit Requirement"}</Button>
            </form>
          </Panel>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-gray-900">Related Products</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {related.map((item) => <FeatureCard key={item.id} product={item} />)}
          </div>
        </div>
      )}
    </Container>
  );
}

/* â”€â”€ Service Request â”€â”€ */

export function ServiceRequestPage() {
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", work_type: "CNC", material: "", quantity: "", deadline: "", notes: "", file: null });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const fileUrl = form.file ? await uploadFile(form.file) : "";
      await apiRequest("/service-requests", {
        method: "POST",
        body: {
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email,
          work_type: form.work_type,
          material: form.material,
          quantity: form.quantity,
          deadline: form.deadline,
          notes: form.notes,
          file_url: fileUrl
        }
      });
      setMessage("Service request submitted. We will review your drawing and reach out.");
      setForm({ name: "", company: "", phone: "", email: "", work_type: "CNC", material: "", quantity: "", deadline: "", notes: "", file: null });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-16">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <div className="motion-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">On-Demand Machining</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">Send your drawing</h1>
            <p className="mt-3 text-base text-gray-600">Upload drawings, specify quantity, material, and target date for a practical machining quote.</p>
          </div>

          <Panel className="overflow-hidden">
            <img src="/images/indian_engineering_office.png" alt="Engineer reviewing technical drawings" className="h-[200px] w-full object-cover" />
          </Panel>

          <Panel className="p-5">
            <h3 className="font-display text-lg font-bold text-gray-900">How it works</h3>
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-900">1.</span> Share work type, material, quantity, and drawing files.</p>
              <p><span className="font-semibold text-gray-900">2.</span> We review feasibility, machining approach, and timeline.</p>
              <p><span className="font-semibold text-gray-900">3.</span> You receive a quote with clear next steps.</p>
            </div>
          </Panel>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatTile label="Work Types" value="CNC / VMC" detail="Moulding and custom jobs" />
            <StatTile label="Drawings" value="2D / 3D" detail="PDF, STEP, DXF, DWG" />
            <StatTile label="Turnaround" value="Quote-Based" detail="Based on complexity" />
          </div>
        </div>

        <Panel className="p-5 lg:p-6">
          <h2 className="font-display text-2xl font-bold text-gray-900">Request Machining Support</h2>
          <form className="mt-5 grid gap-3" onSubmit={submit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Customer Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Rahul Sharma" />
              <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Tata Motors" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required placeholder="+91 98765 43210" />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder="rahul@example.com" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm text-gray-700">
                <span className="mb-1.5 block font-medium">Type of Work</span>
                <select value={form.work_type} onChange={(e) => setForm({ ...form, work_type: e.target.value })} className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-electric-400 focus:ring-2 focus:ring-electric-500/15">
                  <option>CNC</option><option>VMC</option><option>Moulding</option><option>Other</option>
                </select>
              </label>
              <Input label="Material Type" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} placeholder="e.g. Aluminum 6061, EN8" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 500 pcs" />
              <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <TextArea label="Additional Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Describe surface finish, tolerances, or any specific requirements..." />
            <label className="block text-sm text-gray-700">
              <span className="mb-1.5 block font-medium">Upload 2D / 3D Drawing</span>
              <input type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} className="block w-full rounded-xl border border-dashed border-black/10 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-electric-500 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white" />
            </label>
            {message ? <p className="text-sm text-electric-500">{message}</p> : null}
            <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Submitting..." : "Submit Service Request"}</Button>
          </form>
        </Panel>
      </div>

      {/* Service Testimonials */}
      <div className="mt-20">
        <div className="motion-fade-up text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">Client Feedback</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">What our clients say</h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-gray-600">
            Businesses across Pune trust us for reliable CNC, VMC, and moulding job work.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            {
              quote: "Quick turnaround on our CNC batch requirement. Mechnnovation team was very practical about feasibility and delivered exactly to our drawing specifications.",
              name: "Amit Joshi",
              company: "Joshi Auto Components, Pimpri",
              avatar: 1
            },
            {
              quote: "We submitted our VMC job work drawing on Monday and had a confirmed quote by Tuesday. The machined parts were spot-on and required no rework.",
              name: "Kavita Shinde",
              company: "Shinde Precision Tools, Narhe MIDC",
              avatar: 2
            },
            {
              quote: "Their moulding die work is top quality. The team clearly knows the trade — they suggested a tooling improvement that actually reduced our production cycle time.",
              name: "Mahesh Bhosale",
              company: "Bhosale Plastics Pvt. Ltd., Pune",
              avatar: 3
            }
          ].map((item, i) => (
            <div
              key={item.name}
              className="motion-fade-up relative flex flex-col rounded-2xl border border-black/5 bg-white p-6"
              style={{ "--motion-delay": `${100 + i * 100}ms` }}
            >
              <Quotes className="h-8 w-8 text-electric-500/20" weight="fill" />
              <p className="mt-3 flex-1 text-base leading-7 text-gray-700">{item.quote}</p>
              <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-4">
                <img
                  src={`/images/indian_avatar_${item.avatar}.png`}
                  alt={item.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm bg-gray-100"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.company}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 text-amber-400" weight="fill" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

/* â”€â”€ About â”€â”€ */

export function AboutPage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    apiRequest("/site-content/about").then(setContent).catch(() => {});
  }, []);

  const pageSections = content?.sections || [];
  const sections = Object.fromEntries(pageSections.map((item) => [item.section_key, item]));
  const storySection = sections.story;
  const capabilitySection = sections.capabilities;
  const stats = storySection?.meta_json?.stats || [];
  const capabilities = capabilitySection?.meta_json?.list || [];
  const extraSections = pageSections.filter((item) => !["story", "capabilities"].includes(item.section_key));
  const testimonials = content?.testimonials || [];

  return (
    <Container className="py-16">
      {/* Hero */}
      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr]">
        <div className="motion-fade-up">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">About Us</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">{storySection?.title || "About Mechnnovation"}</h1>
          {storySection?.body && <p className="mt-4 text-base leading-7 text-gray-600">{storySection.body}</p>}
          {stats.length > 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {stats.map((item) => <StatTile key={item.label} label={item.label} value={item.value} detail={companyDetails.location} />)}
            </div>
          )}
        </div>
        <Panel className="overflow-hidden">
          <img src="/images/indian_about_hero.png" alt="Workshop team" className="h-full min-h-[360px] w-full object-cover" />
        </Panel>
      </div>

      {/* Capabilities + Business */}
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Panel className="p-5">
          <h2 className="font-display text-lg font-bold text-gray-900">Capabilities</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            {capabilities.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" weight="fill" /> <span>{item}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-5">
          <h2 className="font-display text-lg font-bold text-gray-900">Business Snapshot</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p><span className="font-medium text-gray-900">Legal Status:</span> Partnership Firm</p>
            <p><span className="font-medium text-gray-900">GST Registered:</span> 14-01-2020</p>
            <p><span className="font-medium text-gray-900">Annual Turnover:</span> 0 - 40 Lakhs</p>
            <p><span className="font-medium text-gray-900">Location:</span> {companyDetails.location}</p>
          </div>
        </Panel>
      </div>

      {/* Extra Sections */}
      {extraSections.length > 0 && (
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {extraSections.map((section) => (
            <Panel key={section.id} className="p-5">
              <div className="flex items-center gap-2 text-electric-500">
                <Sparkle className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em]">{section.page_key}</span>
              </div>
              <h2 className="mt-3 font-display text-lg font-bold text-gray-900">{section.title || section.section_key}</h2>
              {section.body && <p className="mt-3 text-sm leading-6 text-gray-600">{section.body}</p>}
              {Array.isArray(section.meta_json?.list) && (
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {section.meta_json.list.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" weight="fill" /> <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          ))}
        </div>
      )}

      {/* Why Work With Us */}
      <div className="mt-16">
        <div className="motion-fade-up text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">Why Choose Us</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Built on trust & precision
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-gray-600">
            Every part we deliver reflects our commitment to quality, communication, and reliable execution.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Target, title: "Precision First", body: "Every component machined to spec with strict dimensional accuracy and surface finish control." },
            { icon: Handshake, title: "Direct Communication", body: "Talk directly with the people who run your job â€” no middlemen, no miscommunication." },
            { icon: Timer, title: "On-Time Delivery", body: "Production schedules planned around your deadlines with regular status updates." },
            { icon: Trophy, title: "12+ Years Experience", body: "Proven track record across automotive, industrial, and custom tooling projects." }
          ].map((item, i) => (
            <div key={item.title} className="motion-fade-up rounded-2xl border border-black/5 bg-white p-6 text-center" style={{ "--motion-delay": `${100 + i * 80}ms` }}>
              <div className="mx-auto inline-flex rounded-xl bg-electric-500/8 p-3 text-electric-500">
                <item.icon className="h-6 w-6" weight="duotone" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Approach */}
      <div className="mt-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="motion-fade-up">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">Our Approach</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Practical manufacturing, not just promises
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              We focus on what matters â€” understanding your requirement, reviewing feasibility honestly, and delivering parts that work. No inflated claims, no unnecessary complexity.
            </p>
            <div className="mt-6 space-y-4">
              {[
                "Drawing review and feasibility check before quoting",
                "Transparent communication on timeline and limitations",
                "Quality checks at every stage of production",
                "Flexible batch sizes â€” from prototype to repeat orders"
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" weight="fill" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <Panel className="overflow-hidden">
            <img src="/images/indian_about_approach.png" alt="CNC operator at work" className="h-full min-h-[320px] w-full object-cover" />
          </Panel>
        </div>
      </div>

      {/* Testimonials */}
      {(() => {
        const placeholderTestimonials = [
          {
            id: "ph-1",
            quote: "Mechnnovation delivered our CNC turned components ahead of schedule with excellent dimensional accuracy. Their team is responsive and understands batch production requirements very well.",
            name: "Rajesh Kulkarni",
            company: "Kulkarni Engineering Works, Pune"
          },
          {
            id: "ph-2",
            quote: "We rely on Mechnnovation for our moulding die requirements. Their workshop team is technically sound and the communication throughout the job is very clear and professional.",
            name: "Priya Deshmukh",
            company: "Deshmukh Plastics Pvt. Ltd., Pune"
          },
          {
            id: "ph-3",
            quote: "Very impressed with the VMC job work quality. They reviewed our drawings carefully and flagged potential issues before production — saved us time and rework costs.",
            name: "Suresh Patil",
            company: "Patil Industries, MIDC Narhe"
          }
        ];
        const displayList = testimonials.length > 0 ? testimonials : placeholderTestimonials;
        return (
          <div className="mt-16">
            <div className="motion-fade-up text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">Testimonials</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">What customers value</h2>
              <p className="mx-auto mt-3 max-w-lg text-base text-gray-600">
                Hear from the businesses and engineers who rely on us for their production needs.
              </p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {displayList.map((item, i) => (
                <div
                  key={item.id}
                  className="motion-fade-up relative flex flex-col rounded-2xl border border-black/5 bg-white p-6"
                  style={{ "--motion-delay": `${100 + i * 100}ms` }}
                >
                  <Quotes className="h-8 w-8 text-electric-500/20" weight="fill" />
                  <p className="mt-3 flex-1 text-base leading-7 text-gray-700">{item.quote}</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-black/5 pt-4">
                    <img
                      src={`/images/indian_avatar_${(i % 3) + 1}.png`}
                      alt={item.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover shadow-sm bg-gray-100"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.company}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 text-amber-400" weight="fill" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Team CTA */}
      <div className="mt-16">
        <div className="motion-fade-up relative overflow-hidden rounded-2xl border border-black/5 bg-gray-50 p-8 text-center sm:p-12">
          {/* Decorative background drawing lines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.09]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c70e08" strokeWidth="1" />
                  <path d="M 40 20 L 0 20 M 20 40 L 20 0" fill="none" stroke="#c70e08" strokeWidth="0.5" opacity="0.5" />
                </pattern>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#c70e08" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
              
              {/* Complex mechanical assembly (Top Right) */}
              <svg x="85%" y="20%" style={{ overflow: "visible" }}>
                <circle cx="0" cy="0" r="120" fill="none" stroke="#c70e08" strokeWidth="1.5" strokeDasharray="8 4" />
                <circle cx="0" cy="0" r="90" fill="none" stroke="#c70e08" strokeWidth="1" />
                <circle cx="0" cy="0" r="30" fill="none" stroke="#c70e08" strokeWidth="2" />
                <circle cx="0" cy="0" r="10" fill="none" stroke="#c70e08" strokeWidth="1" />
                {/* Crosshairs */}
                <line x1="-150" y1="0" x2="150" y2="0" stroke="#c70e08" strokeWidth="0.75" />
                <line x1="0" y1="-150" x2="0" y2="150" stroke="#c70e08" strokeWidth="0.75" />
                {/* Little circles on the perimeter */}
                <circle cx="90" cy="0" r="6" fill="#c70e08" />
                <circle cx="-90" cy="0" r="6" fill="#c70e08" />
                <circle cx="0" cy="90" r="6" fill="#c70e08" />
                <circle cx="0" cy="-90" r="6" fill="#c70e08" />
                {/* Angle lines */}
                <line x1="-80" y1="-80" x2="80" y2="80" stroke="#c70e08" strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="-80" y1="80" x2="80" y2="-80" stroke="#c70e08" strokeWidth="0.5" strokeDasharray="4 4" />
                {/* Dimension line */}
                <line x1="-120" y1="-135" x2="120" y2="-135" stroke="#c70e08" strokeWidth="1" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                <text x="0" y="-142" fill="#c70e08" fontSize="12" fontFamily="monospace" textAnchor="middle">Ã˜ 240.0</text>
              </svg>

              {/* Smaller assembly (Bottom Left) */}
              <svg x="15%" y="85%" style={{ overflow: "visible" }}>
                <circle cx="0" cy="0" r="60" fill="none" stroke="#c70e08" strokeWidth="1" />
                <circle cx="0" cy="0" r="45" fill="none" stroke="#c70e08" strokeWidth="1" strokeDasharray="2 4" />
                <circle cx="0" cy="0" r="15" fill="none" stroke="#c70e08" strokeWidth="1.5" />
                {/* Small gears/teeth representation */}
                <path d="M -5 60 L 5 60 L 3 65 L -3 65 Z M -5 -60 L 5 -60 L 3 -65 L -3 -65 Z M 60 -5 L 60 5 L 65 3 L 65 -3 Z M -60 -5 L -60 5 L -65 3 L -65 -3 Z" fill="#c70e08" />
                <line x1="-80" y1="0" x2="80" y2="0" stroke="#c70e08" strokeWidth="0.5" />
                <line x1="0" y1="-80" x2="0" y2="80" stroke="#c70e08" strokeWidth="0.5" />
                <text x="0" y="25" fill="#c70e08" fontSize="10" fontFamily="monospace" textAnchor="middle">GEAR_A</text>
              </svg>

              {/* Connecting drafting lines */}
              <path d="M 15% 85% L 45% 50% L 60% 50% L 85% 20%" fill="none" stroke="#c70e08" strokeWidth="1" strokeDasharray="6 4" />
              <circle cx="45%" cy="50%" r="4" fill="none" stroke="#c70e08" strokeWidth="1.5" />
              <circle cx="60%" cy="50%" r="4" fill="none" stroke="#c70e08" strokeWidth="1.5" />
              
              {/* Arbitrary chamfer / block drawing (Top Left) */}
              <svg x="20%" y="20%" style={{ overflow: "visible" }}>
                <rect x="-40" y="-30" width="80" height="60" fill="none" stroke="#c70e08" strokeWidth="1" />
                <path d="M -40 -15 L -25 -30" fill="none" stroke="#c70e08" strokeWidth="1" />
                <path d="M 25 -30 L 40 -15" fill="none" stroke="#c70e08" strokeWidth="1" />
                <path d="M 40 15 L 25 30" fill="none" stroke="#c70e08" strokeWidth="1" />
                <path d="M -25 30 L -40 15" fill="none" stroke="#c70e08" strokeWidth="1" />
                <circle cx="0" cy="0" r="10" fill="none" stroke="#c70e08" strokeWidth="1" />
                <circle cx="0" cy="0" r="2" fill="#c70e08" />
                <line x1="-50" y1="0" x2="50" y2="0" stroke="#c70e08" strokeWidth="0.5" strokeDasharray="2 2" />
                <line x1="0" y1="-40" x2="0" y2="40" stroke="#c70e08" strokeWidth="0.5" strokeDasharray="2 2" />
              </svg>
            </svg>
          </div>

          <div className="relative z-10">
            <Blueprint className="mx-auto h-12 w-12 text-[#c70e08]/70" weight="duotone" />
            <h2 className="mt-5 font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              Ready to work together?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base text-gray-600">
              Whether you need a single prototype or a full production run, our team is ready to review your requirement and provide a practical quote.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button to="/contact">
                Get in Touch <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button to="/service-request" variant="secondary">
                Submit Drawing
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

/* â”€â”€ Contact â”€â”€ */

export function ContactPage() {
  const [content, setContent] = useState(null);
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", message: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiRequest("/site-content/contact").then(setContent).catch(() => {});
  }, []);

  const sections = content?.sections || [];
  const mainSection = sections.find((item) => item.section_key === "main") || sections[0];
  const extraSections = sections.filter((item) => item.id !== mainSection?.id);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await apiRequest("/enquiries", {
        method: "POST",
        body: {
          name: form.name,
          company: form.company,
          phone: form.phone,
          email: form.email,
          quantity: "",
          message: form.message,
          file_url: ""
        }
      });
      setMessage("Enquiry submitted successfully. We will get back to you soon.");
      setForm({ name: "", company: "", phone: "", email: "", message: "" });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="motion-fade-up space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">Contact Us</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">{mainSection?.title || "Get in touch"}</h1>
            {mainSection?.body && <p className="mt-3 text-base text-gray-600">{mainSection.body}</p>}
          </div>

          <div className="space-y-3 rounded-2xl border border-black/5 bg-white p-5 text-sm text-gray-600">
            <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-electric-500" weight="fill" /> <span>{companyDetails.phone}</span></div>
            <div className="flex items-center gap-2.5"><Envelope className="h-4 w-4 text-electric-500" weight="fill" /> <span>{companyDetails.email}</span></div>
            <div className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 text-electric-500" weight="fill" /> <span>{companyDetails.address}</span></div>
            <div className="flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 text-electric-500" weight="fill" /> <span>GSTIN: {companyDetails.gstin}</span></div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/5">
            <iframe
              title="Mechnnovation location"
              src="https://www.google.com/maps?q=Rajlaxmi%20Industrial%20Estate%20Narhe%20Pune&output=embed"
              className="h-[280px] w-full border-0"
              loading="lazy"
            />
          </div>
        </div>

        <Panel className="p-5 lg:p-6">
          <h2 className="font-display text-2xl font-bold text-gray-900">Send an Enquiry</h2>
          <form className="mt-5 grid gap-3" onSubmit={submit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <TextArea label="Requirement" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            {message ? <p className="text-sm text-electric-500">{message}</p> : null}
            <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Submitting..." : "Submit Enquiry"}</Button>
          </form>
        </Panel>
      </div>

      {extraSections.length > 0 && (
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {extraSections.map((section) => (
            <Panel key={section.id} className="p-5">
              <div className="flex items-center gap-2 text-electric-500">
                <Sparkle className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold uppercase tracking-[0.16em]">{section.section_key}</span>
              </div>
              <h2 className="mt-3 font-display text-lg font-bold text-gray-900">{section.title || section.section_key}</h2>
              {section.body && <p className="mt-3 text-sm leading-6 text-gray-600">{section.body}</p>}
              {Array.isArray(section.meta_json?.list) && (
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {section.meta_json.list.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" weight="fill" /> <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          ))}
        </div>
      )}
    </Container>
  );
}



