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
  UserCircle,
  WhatsappLogo,
  Compass,
  ChatCircle
} from "@phosphor-icons/react";
import { apiRequest, companyDetails, uploadFile } from "../lib/api.js";
import { subscribeCatalogUpdates } from "../lib/catalog-sync.js";
import { getPageTemplateKeys, resolvePageSections } from "../lib/site-content.js";
import {
  Button,
  Container,
  EmptyPanel,
  Input,
  LoadingPanel,
  Panel,
  StatTile,
  TextArea
} from "../components/ui.jsx";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/catalog", label: "Products" },
  { to: "/service-request", label: "Services" },
  { to: "/about", label: "About" }
];

/* Ã¢â€â‚¬Ã¢â€â‚¬ Home page data Ã¢â€â‚¬Ã¢â€â‚¬ */

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


// Use one stronger shared visual for product pages until dedicated product photography is ready.
const sharedProductPageImages = [
  "/images/indian_product_shared.png"
];

/* Ã¢â€â‚¬Ã¢â€â‚¬ Shared components Ã¢â€â‚¬Ã¢â€â‚¬ */

function FeatureCard({ product }) {
  const productImage = product.primary_image_url || sharedProductPageImages[0];

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
    <footer className="relative overflow-hidden bg-gray-950">
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
              <img src="/images/mlogo-mark.png" alt="Mechnno Vation Technologies logo" className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10" />
              <div>
                <p className="font-display text-xl font-bold text-white">Mechnno Vation</p>
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
            &copy; {new Date().getFullYear()} Mechnno Vation Technologies. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            GSTIN: <span className="text-gray-500">{companyDetails.gstin}</span>
            <span className="mx-2 text-gray-700">&bull;</span>
            Partnership firm
            <span className="mx-2 text-gray-700">&bull;</span>
            Narhe, Pune 411041
          </p>
        </div>
      </Container>
    </footer>
  );
}

/* WhatsApp floating button */
const WA_NUMBER = "919970791081"; // Indian format, no +
const WA_MESSAGE = encodeURIComponent("Hello! I'm interested in your CNC machining / moulding die services. Please share details.");
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={WA_HREF}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Chat on WhatsApp"
      className="wa-float-btn"
    >
      {/* Tooltip */}
      <span
        className="wa-tooltip"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(8px)",
        }}
      >
        Chat with us
      </span>
      {/* Icon */}
      <WhatsappLogo className="h-[34px] w-[34px] text-white" weight="fill" />
    </a>
  );
}

export function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [menuOpen, setListOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setListOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="public-shell min-h-screen">
      {/* WhatsApp floating button */}
      <WhatsAppButton />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <Container className="flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/images/mlogo-mark.png" alt="Mechnno Vation Technologies logo" className="h-9 w-9 rounded-lg object-cover sm:h-10 sm:w-10" />
            <div>
              <p className="font-display text-lg font-bold leading-none text-white sm:text-xl">Mechnno Vation</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Technologies</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-white/10 text-white" : "text-gray-300 hover:text-white"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button to="/contact" className="ml-3 bg-white text-gray-900 hover:bg-gray-100">Contact</Button>
          </nav>

          <button
            type="button"
            onClick={() => setListOpen((v) => !v)}
            className="rounded-xl border border-white/10 bg-black/50 p-2 text-gray-300 shadow-sm transition hover:border-white/20 hover:bg-black/70 lg:hidden"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
          </button>
        </Container>
      </header>

      <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setListOpen(false)}
          className={`absolute inset-0 bg-slate-950/28 backdrop-blur-[2px] transition-opacity duration-300 ${menuOpen ? "opacity-100" : "opacity-0"}`}
        />

        <aside className={`absolute inset-y-0 right-0 flex w-full max-w-[320px] flex-col border-l border-black/5 bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="border-b border-black/5 px-5 pb-4 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src="/images/mlogo-mark.png" alt="Mechnno Vation Technologies logo" className="h-10 w-10 rounded-xl object-cover" />
                <div>
                  <p className="font-display text-base font-bold text-gray-900">Mechnno Vation</p>
                  <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-gray-400">Technologies</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setListOpen(false)}
                className="rounded-xl border border-black/5 bg-white p-2 text-gray-500 shadow-sm transition hover:border-black/10 hover:text-gray-900"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setListOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-gray-900 text-white shadow-[0_14px_30px_rgba(17,24,39,0.14)]" : "border border-transparent bg-gray-50 text-gray-700 hover:border-black/5 hover:bg-white hover:text-gray-900"}`
                  }
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4 opacity-60" />
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 rounded-2xl border border-black/5 bg-gradient-to-br from-gray-50 to-white p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">Direct Contact</p>
              <a href={`tel:${companyDetails.phone}`} className="mt-3 flex items-center gap-2.5 text-sm font-medium text-gray-900 transition hover:text-electric-500">
                <Phone className="h-4 w-4 text-electric-500" weight="fill" /> {companyDetails.phone}
              </a>
              <a href={`mailto:${companyDetails.email}`} className="mt-3 flex items-start gap-2.5 text-sm text-gray-600 transition hover:text-electric-500">
                <Envelope className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" weight="fill" />
                <span className="break-all">{companyDetails.email}</span>
              </a>
            </div>
          </div>

          <div className="border-t border-black/5 p-4">
            <Button to="/contact" onClick={() => setListOpen(false)} className="w-full justify-center">
              Contact Us
            </Button>
          </div>
        </aside>
      </div>

      <main className={location.pathname === "/" ? "" : "pt-20"}>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
export function HomePage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    apiRequest("/site-content/home").then(setContent).catch(() => {});
  }, []);

  const resolvedSections = resolvePageSections("home", content?.sections || []);
  const knownSectionKeys = new Set(getPageTemplateKeys("home"));
  const sectionMap = Object.fromEntries(resolvedSections.map((item) => [item.section_key, item]));
  const heroSection = sectionMap.hero;
  const processSection = sectionMap.process;
  const statsSection = sectionMap.stats;
  const ctaSection = sectionMap.cta;
  const processSteps = processSection?.meta_json?.steps || [];
  const homeStats = statsSection?.meta_json?.stats || [];
  const extraSections = resolvedSections.filter((item) => !knownSectionKeys.has(item.section_key));

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[100vh] flex items-center bg-cover bg-center bg-fixed" style={{ backgroundImage: `url(${heroSection?.meta_json?.image_url || "/images/indian_cnc_bgworker.png"})` }}>
        {/* Background image - full visibility, no blur */}


        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-gray-950/5" />

        <Container className="relative py-20 sm:py-28 lg:py-36">
          <div className="motion-fade-up max-w-2xl">
            {heroSection?.meta_json?.eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-electric-300">
                {heroSection.meta_json.eyebrow}
              </p>
            )}
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {heroSection?.title || (
                <>Precision CNC machining<br className="hidden sm:block" /> & <span style={{ color: "#c70e08" }}>industrial tooling</span></>
              )}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-gray-300 sm:text-lg">
              {heroSection?.body || "Moulding dies, CNC turned components, and VMC job work. Fast response, practical communication, reliable execution."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button to="/contact" className="bg-white text-gray-900 shadow-none hover:bg-gray-100">
                {heroSection?.meta_json?.primaryCtaLabel || "Contact"} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button to="/catalog" variant="ghost" className="text-white/80 hover:text-white">
                {heroSection?.meta_json?.secondaryCtaLabel || "Browse Products"} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Container>
      </section>
      {/* Stats */}
      <section className="border-b border-black/5 bg-white">
        <Container className="pt-0 pb-6 sm:pt-0 sm:pb-8">

          {homeStats.length > 0 && (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {homeStats.map((stat, i) => (
                <div key={`${stat.label}-${stat.value}-${i}`} className="motion-fade-up rounded-2xl border border-black/5 px-5 py-6 text-center" style={{ "--motion-delay": `${i * 80}ms` }}>
                  <p className="font-display text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.label ? <p className="mt-1 text-xs text-gray-500">{stat.label}</p> : null}
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>



      {/* Capabilities */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="motion-fade-up text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/15 bg-electric-500/5 px-3.5 py-1.5">
              <GearSix className="h-3.5 w-3.5 text-electric-500" weight="fill" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">What We Do</span>
            </div>
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
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-electric-500/8 text-electric-500">
                  <card.icon className="h-8 w-8" weight="duotone" />
                </div>
                <h3 className="mt-5 text-center font-display text-lg font-bold text-gray-900">{card.title}</h3>
                <p className="mt-2 text-center text-sm leading-6 text-gray-600">{card.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Machine Highlights */}
      <section className="border-y border-black/5 bg-gray-50 py-16 sm:py-20">
        <Container>
          <div className="motion-fade-up max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/15 bg-electric-500/5 px-3.5 py-1.5">
              <Factory className="h-3.5 w-3.5 text-electric-500" weight="fill" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">Our Machines</span>
            </div>
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
                  <h3 className="mt-1 font-display text-xl font-bold text-gray-900">{item.title}</h3>
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
            {processSection?.meta_json?.eyebrow && (
              <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/15 bg-electric-500/5 px-3.5 py-1.5">
                <Blueprint className="h-3.5 w-3.5 text-electric-500" weight="fill" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">{processSection.meta_json.eyebrow}</span>
              </div>
            )}
            <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              {processSection?.title || "Simple process, reliable results"}
            </h2>
            {processSection?.body && <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">{processSection.body}</p>}
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item, i) => (
              <div key={`${item.step}-${item.title}-${i}`} className="motion-fade-up relative pl-6" style={{ "--motion-delay": `${100 + i * 80}ms` }}>
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-electric-500/30 to-transparent" />
                <span className="font-display text-3xl font-bold text-electric-400/30">{item.step}</span>
                <h3 className="mt-3 font-display text-base font-bold text-gray-900">{item.title}</h3>
                {item.body && <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Extra Sections */}
      {extraSections.length > 0 && (
        <section className="py-16 sm:py-20 lg:py-24 border-t border-black/5 bg-gray-50/50">
          <Container className="grid gap-5 lg:grid-cols-2">
            {extraSections.map((section) => (
              <Panel key={section.id} className="overflow-hidden p-0 flex flex-col bg-white">
                {section.meta_json?.image_url && (
                  <img src={section.meta_json.image_url} alt={section.title || section.section_key} className="h-48 w-full object-cover border-b border-black/5 shrink-0" />
                )}
                <div className="p-5 flex-1">
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
                </div>
              </Panel>
            ))}
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0">
          <img src={ctaSection?.meta_json?.image_url || "/images/indian_workshop_team.png"} alt="" className="h-full w-full object-cover blur-[2px] scale-[1.02]" />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-gray-900/30 to-electric-600/20" />
        </div>
        <Container className="relative text-center">
          <div className="motion-fade-up mx-auto max-w-xl rounded-3xl border border-white/15 bg-white/8 px-8 py-10 shadow-2xl backdrop-blur-md sm:px-12">
            {ctaSection?.meta_json?.eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.22em] text-electric-200">{ctaSection.meta_json.eyebrow}</p>}
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl drop-shadow-sm">
              {ctaSection?.title || "Ready to discuss your project?"}
            </h2>
            <p className="mt-3 text-base text-white/75">
              {ctaSection?.body || "Share your drawing or requirement and get a practical quote from our team."}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button to="/contact" className="bg-white/90 text-gray-900 shadow-lg shadow-black/10 backdrop-blur-sm hover:bg-white">
                {ctaSection?.meta_json?.primaryCtaLabel || "Submit Enquiry"} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button to="/service-request" variant="ghost" className="text-white/90 hover:text-white">
                {ctaSection?.meta_json?.secondaryCtaLabel || "Service Request"} <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export function CatalogPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

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
  }, [refreshTick]);

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
  }, [deferredSearch, activeCategory, refreshTick]);

  useEffect(() => {
    return subscribeCatalogUpdates(() => {
      setRefreshTick((tick) => tick + 1);
    });
  }, []);

  return (
    <Container className="py-16">
      <div className="motion-fade-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/15 bg-electric-500/5 px-3.5 py-1.5">
          <StackSimple className="h-3.5 w-3.5 text-electric-500" weight="fill" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">Products & Services</span>
        </div>
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

/* Ã¢â€â‚¬Ã¢â€â‚¬ Product Detail Ã¢â€â‚¬Ã¢â€â‚¬ */

export function ProductDetailPage() {
  const { slug } = useParams();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", quantity: "", message: "", file: null });

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest(`/products/${slug}`)
      .then((data) => { if (active) setPayload(data); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  if (loading) return <Container className="py-16"><LoadingPanel label="Loading product..." /></Container>;
  if (!payload?.product) return <Container className="py-16"><EmptyPanel title="Product not found" body="The product you requested could not be loaded." /></Container>;

  const { product, related } = payload;
  const galleryImages = Array.isArray(product.gallery_urls_json) ? product.gallery_urls_json : [];
  const productImages = [
    product.primary_image_url,
    ...galleryImages
  ].filter(Boolean);
  const allImages = productImages.length > 0 ? productImages : sharedProductPageImages;
  const heroImage = allImages[0];
  const sideImage = allImages[1] || allImages[0];
  const specs = Object.entries(product.specs_json || {});

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSuccess("");
    try {
      const fileUrl = form.file ? await uploadFile(form.file) : "";
      await apiRequest("/enquiries", {
        method: "POST",
        body: { product_id: product.id, name: form.name, company: form.company, phone: form.phone, email: form.email, quantity: form.quantity, message: form.message, file_url: fileUrl }
      });
      setSuccess("Requirement submitted successfully. Our team will contact you shortly.");
      setForm({ name: "", company: "", phone: "", email: "", quantity: "", message: "", file: null });
    } catch (error) {
      setSuccess(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToQuote = () => { setShowQuoteForm(true); setTimeout(() => document.getElementById("quote-form")?.scrollIntoView({ behavior: "smooth" }), 100); };

  return (
    <>
      {/* Hero â€” same style as home: full image, no blur, left-to-right gradient */}
      <section className="relative overflow-hidden min-h-[55vh] flex items-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover scale-[1.02]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-gray-950/5" />

        <Container className="relative z-10 py-16 lg:py-20">
          {/* Breadcrumb */}
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-400">
            <Link to="/catalog" className="hover:text-white transition">Products</Link>
            <CaretRight className="h-3.5 w-3.5" />
            <Link to={`/catalog?category=${product.category?.slug || ""}`} className="hover:text-white transition">{product.category?.name || "All"}</Link>
            <CaretRight className="h-3.5 w-3.5" />
            <span className="text-gray-300">{product.name}</span>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-electric-500/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-electric-400">
              {product.category?.name || "Industrial Product"}
            </span>
            <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">{product.name}</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-gray-300 sm:text-lg">{product.short_description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button onClick={scrollToQuote} className="bg-white text-gray-900 shadow-none hover:bg-gray-100 gap-2">
                Request Quote <ArrowRight className="h-4 w-4" />
              </Button>
              <Button to="/service-request" variant="ghost" className="text-white/80 hover:text-white gap-2">
                Send Drawing <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            </div>

            <Panel className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur sm:mx-auto sm:max-w-md lg:mx-0">
              <div className="relative">
                <img src={sideImage} alt={`${product.name} preview`} className="h-64 w-full object-cover sm:h-72 lg:h-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
                  Product Preview
                </div>
              </div>
            </Panel>
          </div>
        </Container>
      </section>

      {/* Product details body */}
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left column */}
          <div className="space-y-8">
            {/* Full description */}
            {product.description && product.description !== product.short_description && (
              <div>
                <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-gray-900">
                  <StackSimple className="h-5 w-5 text-electric-500" weight="fill" /> About This Product
                </h2>
                <p className="mt-4 text-base leading-7 text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            {specs.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-gray-900">
                  <GearSix className="h-5 w-5 text-electric-500" weight="fill" /> Technical Specifications
                </h2>
                <div className="mt-5 rounded-2xl border border-black/5 overflow-hidden">
                  {specs.map(([label, value], i) => (
                    <div key={label} className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${i % 2 === 0 ? "bg-gray-50/70" : "bg-white"}`}>
                      <span className="font-medium text-gray-900">{label}</span>
                      <span className="text-right text-gray-600 font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key features */}
            <div>
              <h2 className="flex items-center gap-2.5 font-display text-xl font-bold text-gray-900">
                <CheckCircle className="h-5 w-5 text-electric-500" weight="fill" /> Why Choose Us
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: ShieldCheck, title: "Quality Assured", desc: "Inspection-backed manufacturing process" },
                  { icon: Timer, title: "On-Time Delivery", desc: "Planned turnaround with clear timelines" },
                  { icon: Blueprint, title: "Drawing Support", desc: "2D/3D drawing-based manufacturing" },
                  { icon: Factory, title: "Production Ready", desc: "Prototype to batch production capability" }
                ].map((f) => (
                  <div key={f.title} className="flex items-start gap-3 rounded-xl border border-black/5 bg-white p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-electric-500/8">
                      <f.icon className="h-4.5 w-4.5 text-electric-500" weight="fill" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column â€” sticky sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Quote form â€” always visible in sidebar */}
            <Panel className="p-5 lg:p-6" id="quote-form">
              <h3 className="font-display text-lg font-bold text-gray-900">Request a Quote</h3>
              <p className="mt-1 text-sm text-gray-500">Share your requirement and we'll respond within one working day.</p>
              <form className="mt-5 grid gap-3" onSubmit={submit}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  <Input label="Company" placeholder="e.g. Mechnno Vation Technologies" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Phone" placeholder="+91 80 4731 4415" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  <Input label="Email" type="email" placeholder="rahul@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <Input label="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 50 pieces" />
                <TextArea label="Requirements" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Material, tolerances, timeline..." required />
                <label className="block text-sm text-gray-700">
                  <span className="mb-1.5 block font-medium">Upload Drawing / File</span>
                  <input type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} className="block w-full rounded-xl border border-dashed border-black/10 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-electric-500 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white" />
                  <span className="mt-1 block text-xs text-gray-400">PDF, STEP, DXF, DWG, ZIP, JPG, PNG (max 20 MB)</span>
                </label>
                {success && <p className="rounded-lg bg-electric-500/8 px-4 py-2.5 text-sm font-medium text-electric-600">{success}</p>}
                <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Submitting..." : "Submit Requirement"}</Button>
              </form>
            </Panel>

            {/* Contact card */}
            <Panel className="p-5 bg-gray-50">
              <h3 className="font-display text-base font-bold text-gray-900">Need help choosing?</h3>
              <p className="mt-2 text-sm text-gray-500">Our team can advise on material, process, and specs.</p>
              <div className="mt-4 space-y-2.5">
                <a href={`tel:${companyDetails.phone}`} className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-electric-500 transition">
                  <Phone className="h-4 w-4 text-electric-500" weight="fill" /> {companyDetails.phone}
                </a>
                <a href={`mailto:${companyDetails.email}`} className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-electric-500 transition">
                  <Envelope className="h-4 w-4 text-electric-500" weight="fill" /> {companyDetails.email}
                </a>
              </div>
            </Panel>

            {/* Trust badges */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: "GST Verified" },
                { icon: Certificate, label: "12+ Years" },
                { icon: Factory, label: "Pune, India" }
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-1.5 rounded-xl border border-black/5 bg-white p-3 text-center">
                  <b.icon className="h-5 w-5 text-electric-500" weight="fill" />
                  <span className="text-[11px] font-medium text-gray-600">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-black/5">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-2xl font-bold text-gray-900">Related Products</h2>
              <Button to="/catalog" variant="ghost" className="text-sm gap-1.5">View All <ArrowRight className="h-3.5 w-3.5" /></Button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => <FeatureCard key={item.id} product={item} />)}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

/* Ã¢â€â‚¬Ã¢â€â‚¬ Service Request Ã¢â€â‚¬Ã¢â€â‚¬ */

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
            <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/15 bg-electric-500/5 px-3.5 py-1.5">
              <Wrench className="h-3.5 w-3.5 text-electric-500" weight="fill" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">On-Demand Machining</span>
            </div>
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
          <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/15 bg-electric-500/5 px-3.5 py-1.5">
            <Star className="h-3.5 w-3.5 text-electric-500" weight="fill" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">Client Feedback</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">What our clients say</h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-gray-600">
            Businesses across Pune trust us for reliable CNC, VMC, and moulding job work.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            {
              quote: "We needed a quick turnaround on a CNC batch, and Mechnno Vation handled it well. The team was clear about feasibility and delivered exactly to our drawing specifications.",
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
              quote: "Their moulding die work is excellent. The team clearly knows the trade, and they suggested a tooling improvement that reduced our production cycle time.",
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

/* Ã¢â€â‚¬Ã¢â€â‚¬ About Ã¢â€â‚¬Ã¢â€â‚¬ */

export function AboutPage() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    apiRequest("/site-content/about").then(setContent).catch(() => {});
  }, []);

  const pageSections = resolvePageSections("about", content?.sections || []);
  const knownSectionKeys = new Set(getPageTemplateKeys("about"));
  const sections = Object.fromEntries(pageSections.map((item) => [item.section_key, item]));
  const storySection = sections.story;
  const capabilitySection = sections.capabilities;
  const whyChooseSection = sections.why_choose_us;
  const approachSection = sections.approach;
  const stats = storySection?.meta_json?.stats || [];
  const capabilities = capabilitySection?.meta_json?.list || [];
  const whyChooseCards = whyChooseSection?.meta_json?.cards || [];
  const approachItems = approachSection?.meta_json?.list || [];
  const extraSections = visibleSections.filter((item) => !knownSectionKeys.has(item.section_key));
  const testimonials = content?.testimonials || [];

  return (
    <Container className="py-16">
      {/* Hero */}
      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr]">
        <div className="motion-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/15 bg-electric-500/5 px-3.5 py-1.5">
            <Users className="h-3.5 w-3.5 text-electric-500" weight="fill" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">{storySection?.meta_json?.eyebrow || "About Us"}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">{storySection?.title || "About Us"}</h1>
          {storySection?.body && <p className="mt-4 text-base leading-7 text-gray-600">{storySection.body}</p>}
          {stats.length > 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {stats.map((item) => (
                <StatTile
                  key={`${item.label}-${item.value}`}
                  label={item.label}
                  value={item.value}
                  detail={item.label.toLowerCase().includes("gst") ? companyDetails.gstin : undefined}
                />
              ))}
            </div>
          )}
        </div>
        <Panel className="overflow-hidden">
          <img src={storySection?.meta_json?.image_url || "/images/indian_about_hero.png"} alt="Mechnno Vation workshop team" className="h-full min-h-[360px] w-full object-cover" />
        </Panel>
      </div>

      {/* Capabilities + Business */}
      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Panel className="p-5">
          <h2 className="font-display text-lg font-bold text-gray-900">{capabilitySection?.title || "Capabilities"}</h2>
          {capabilitySection?.body && <p className="mt-2 text-sm leading-6 text-gray-600">{capabilitySection.body}</p>}
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
            <p><span className="font-medium text-gray-900">Legal Status:</span> Partnership firm</p>
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
            <Panel key={section.id} className="overflow-hidden p-0 flex flex-col">
              {section.meta_json?.image_url && (
                <img src={section.meta_json.image_url} alt={section.title || section.section_key} className="h-48 w-full object-cover border-b border-black/5 shrink-0" />
              )}
              <div className="p-5 flex-1">
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
              </div>
            </Panel>
          ))}
        </div>
      )}

      {/* Why Work With Us */}
      <div className="mt-16">
        <div className="motion-fade-up text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/15 bg-electric-500/5 px-3.5 py-1.5">
            <Trophy className="h-3.5 w-3.5 text-electric-500" weight="fill" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">{whyChooseSection?.meta_json?.eyebrow || "Why Choose Us"}</span>
          </div>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            {whyChooseSection?.title || "Built on trust & precision"}
          </h2>
          {whyChooseSection?.body && (
            <p className="mx-auto mt-3 max-w-xl text-base text-gray-600">
              {whyChooseSection.body}
            </p>
          )}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseCards.map((item, i) => {
            const Icon = [Target, Handshake, Timer, Trophy][i % 4];
            return (
              <div key={`${item.title}-${i}`} className="motion-fade-up rounded-2xl border border-black/5 bg-white p-6 text-center" style={{ "--motion-delay": `${100 + i * 80}ms` }}>
                <div className="mx-auto inline-flex rounded-xl bg-electric-500/8 p-3 text-electric-500">
                  <Icon className="h-6 w-6" weight="duotone" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-gray-900">{item.title}</h3>
                {item.body && <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>}
              </div>
            );
          })}
        </div>
      </div>
      {/* Our Approach */}
      <div className="mt-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="motion-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/15 bg-electric-500/5 px-3.5 py-1.5">
              <Compass className="h-3.5 w-3.5 text-electric-500" weight="fill" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">{approachSection?.meta_json?.eyebrow || "Our Approach"}</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-gray-900 sm:text-3xl">
              {approachSection?.title || "Practical manufacturing, not just promises"}
            </h2>
            {approachSection?.body && (
              <p className="mt-4 text-base leading-7 text-gray-600">
                {approachSection.body}
              </p>
            )}
            <div className="mt-6 space-y-4">
              {approachItems.map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-electric-500" weight="fill" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <Panel className="overflow-hidden">
            <img src={approachSection?.meta_json?.image_url || "/images/indian_about_approach.png"} alt="CNC operator at work" className="h-full min-h-[320px] w-full object-cover" />
          </Panel>
        </div>
      </div>
      {/* Testimonials */}
      {(() => {
        const placeholderTestimonials = [
          {
            id: "ph-1",
            quote: "Mechnno Vation delivered our CNC turned components ahead of schedule with excellent dimensional accuracy. Their team was responsive and understood our batch production requirements well.",
            name: "Rajesh Kulkarni",
            company: "Kulkarni Engineering Works, Pune"
          },
          {
            id: "ph-2",
            quote: "We rely on Mechnno Vation for our moulding die requirements. Their workshop team is technically strong, and communication throughout the job was clear and professional.",
            name: "Priya Deshmukh",
            company: "Deshmukh Plastics Pvt. Ltd., Pune"
          },
          {
            id: "ph-3",
            quote: "We were impressed with the VMC job work quality. They reviewed our drawings carefully and flagged potential issues before production, which saved us time and rework costs.",
            name: "Suresh Patil",
            company: "Patil Industries, MIDC Narhe"
          }
        ];
        const displayList = testimonials.length > 0 ? testimonials : placeholderTestimonials;
        return (
          <div className="mt-16">
            <div className="motion-fade-up text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/15 bg-electric-500/5 px-3.5 py-1.5">
                <Quotes className="h-3.5 w-3.5 text-electric-500" weight="fill" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-electric-500">Client Feedback</span>
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                Trusted by manufacturing teams
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600">
                Real feedback from industrial customers who rely on us for tooling, machining, and repeat production support.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {displayList.map((item, i) => (
                <Panel key={item.id} className="motion-fade-up h-full p-6" style={{ "--motion-delay": `${100 + i * 80}ms` }}>
                  <Quotes className="h-8 w-8 text-electric-500/20" weight="fill" />
                  <p className="mt-4 text-sm leading-7 text-gray-600">{item.quote}</p>
                  <div className="mt-6 flex items-center gap-3">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-11 w-11 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <UserCircle className="h-6 w-6" weight="fill" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.company}</p>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        );
      })()}
    </Container>
  );
}

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

  const contactInfo = {
    phone: mainSection?.meta_json?.phone || companyDetails.phone,
    email: mainSection?.meta_json?.email || companyDetails.email,
    address: mainSection?.meta_json?.address || companyDetails.address,
    gstin: mainSection?.meta_json?.gstin || companyDetails.gstin,
  };
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
            <div className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-electric-500" weight="fill" /> <span>{contactInfo.phone}</span></div>
            <div className="flex items-center gap-2.5"><Envelope className="h-4 w-4 text-electric-500" weight="fill" /> <span>{contactInfo.email}</span></div>
            <div className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 text-electric-500" weight="fill" /> <span>{contactInfo.address}</span></div>
            <div className="flex items-center gap-2.5"><ShieldCheck className="h-4 w-4 text-electric-500" weight="fill" /> <span>GSTIN: {contactInfo.gstin}</span></div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-black/5">
            <iframe
              title="Mechnno Vation Technologies location"
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
              <Input label="Name" placeholder="e.g. Rahul Patil" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <TextArea label="Requirement" placeholder="Material, tolerances, timeline, drawings or special instructions..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="min-h-[220px]" rows={8} required />
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





