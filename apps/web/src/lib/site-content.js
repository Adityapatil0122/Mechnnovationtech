const cloneValue = (value) => JSON.parse(JSON.stringify(value ?? null));

const normalizeStat = (item) => {
  if (typeof item === "string") {
    return { label: "", value: item };
  }

  return {
    label: item?.label || "",
    value: item?.value || ""
  };
};

const normalizeProcessStep = (item, index) => {
  if (typeof item === "string") {
    return {
      step: String(index + 1).padStart(2, "0"),
      title: item,
      body: ""
    };
  }

  return {
    step: item?.step || String(index + 1).padStart(2, "0"),
    title: item?.title || "",
    body: item?.body || ""
  };
};

const normalizeCard = (item) => {
  if (typeof item === "string") {
    return { title: item, body: "" };
  }

  return {
    title: item?.title || "",
    body: item?.body || ""
  };
};

const normalizeMetaByVariant = (variant, templateMeta, incomingMeta) => {
  const merged = {
    ...(cloneValue(templateMeta) || {}),
    ...(incomingMeta || {})
  };

  if (variant === "home-stats") {
    const rawStats = Array.isArray(merged.stats) && merged.stats.length > 0
      ? merged.stats
      : Array.isArray(merged.cards)
        ? merged.cards
        : cloneValue(templateMeta?.stats) || [];

    return {
      ...merged,
      stats: rawStats.map(normalizeStat)
    };
  }

  if (variant === "home-process") {
    const rawSteps = Array.isArray(merged.steps) && merged.steps.length > 0
      ? merged.steps
      : cloneValue(templateMeta?.steps) || [];

    return {
      ...merged,
      steps: rawSteps.map(normalizeProcessStep)
    };
  }

  if (variant === "story") {
    return {
      ...merged,
      stats: (Array.isArray(merged.stats) ? merged.stats : cloneValue(templateMeta?.stats) || []).map(normalizeStat)
    };
  }

  if (variant === "about-cards") {
    return {
      ...merged,
      cards: (Array.isArray(merged.cards) ? merged.cards : cloneValue(templateMeta?.cards) || []).map(normalizeCard)
    };
  }

  return merged;
};

const formatSectionLabel = (value = "") =>
  value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const SITE_PAGE_TEMPLATES = {
  home: [
    {
      section_key: "hero",
      aliases: ["hero"],
      label: "Hero Banner",
      variant: "hero",
      title: "Precision CNC machining & industrial tooling",
      body: "Moulding dies, CNC turned components, and VMC job work. Fast response, practical communication, reliable execution.",
      meta_json: {
        eyebrow: "Mechnno Vation Technologies",
        image_url: "/images/indian_cnc_bgworker.png",
        primaryCtaLabel: "Contact",
        secondaryCtaLabel: "Browse Products"
      }
    },
    {
      section_key: "stats",
      aliases: ["stats", "trust"],
      label: "Stats Strip",
      variant: "home-stats",
      title: "",
      body: "",
      meta_json: {
        eyebrow: "",
        stats: [
          { label: "Years of Experience", value: "12+" },
          { label: "Manufacturing Focus", value: "CNC / VMC" },
          { label: "Location", value: "Pune, India" },
          { label: "GST Registered Since", value: "2020" }
        ]
      }
    },
    {
      section_key: "process",
      aliases: ["process"],
      label: "Process",
      variant: "home-process",
      title: "Simple process, reliable results",
      body: "From drawing review to production delivery, every step is built for clarity and predictable execution.",
      meta_json: {
        eyebrow: "How It Works",
        steps: [
          { step: "01", title: "Share Your Requirement", body: "Upload drawings, specify material, quantity, and timeline." },
          { step: "02", title: "Feasibility Review", body: "We review machining approach, tooling, and production timeline." },
          { step: "03", title: "Get a Quote", body: "Receive a practical quote with clear next steps for production." },
          { step: "04", title: "Production & Delivery", body: "Parts manufactured to spec with quality checks at every stage." }
        ]
      }
    },
    {
      section_key: "cta",
      aliases: ["cta", "why_choose_us"],
      label: "Bottom CTA",
      variant: "home-cta",
      title: "Ready to discuss your project?",
      body: "Share your drawing or requirement and get a practical quote from our team.",
      meta_json: {
        eyebrow: "Start Your Enquiry",
        image_url: "/images/indian_workshop_team.png",
        primaryCtaLabel: "Submit Enquiry",
        secondaryCtaLabel: "Service Request"
      }
    }
  ],
  about: [
    {
      section_key: "story",
      aliases: ["story"],
      label: "About Hero",
      variant: "story",
      title: "12+ years of tooling and machining expertise.",
      body: "Mechnno Vation Technologies is a Pune-based partnership firm specializing in moulding dies, CNC components, and VMC job work.",
      meta_json: {
        eyebrow: "About Us",
        image_url: "/images/indian_about_hero.png",
        stats: [
          { label: "Years", value: "12+" },
          { label: "Products", value: "100+" },
          { label: "Location", value: "Pune" },
          { label: "GST", value: "Verified" }
        ]
      }
    },
    {
      section_key: "capabilities",
      aliases: ["capabilities"],
      label: "Capabilities",
      variant: "capabilities",
      title: "Capabilities",
      body: "CNC and VMC machining, moulding dies, drawing-based manufacturing, and custom industrial work.",
      meta_json: {
        list: [
          "CNC / VMC machining",
          "Moulding die development",
          "2D / 3D design support",
          "Custom industrial manufacturing"
        ]
      }
    },
    {
      section_key: "why_choose_us",
      aliases: ["why_choose_us"],
      label: "Why Choose Us",
      variant: "about-cards",
      title: "Built on trust & precision",
      body: "Every part we deliver reflects our commitment to quality, communication, and reliable execution.",
      meta_json: {
        eyebrow: "Why Choose Us",
        cards: [
          { title: "Precision First", body: "Every component machined to spec with strict dimensional accuracy and surface finish control." },
          { title: "Direct Communication", body: "Talk directly with the people handling your job, with no middlemen and no confusion." },
          { title: "On-Time Delivery", body: "Production schedules planned around your deadlines with regular status updates." },
          { title: "12+ Years Experience", body: "Proven track record across automotive, industrial, and custom tooling projects." }
        ]
      }
    },
    {
      section_key: "approach",
      aliases: ["approach"],
      label: "Our Approach",
      variant: "about-approach",
      title: "Practical manufacturing, not just promises",
      body: "We focus on what matters: understanding your requirement, reviewing feasibility honestly, and delivering parts that perform as expected. No inflated claims, and no unnecessary complexity.",
      meta_json: {
        eyebrow: "Our Approach",
        image_url: "/images/indian_about_approach.png",
        list: [
          "Drawing review and feasibility check before quoting",
          "Transparent communication on timeline and limitations",
          "Quality checks at every stage of production",
          "Flexible batch sizes, from prototypes to repeat orders"
        ]
      }
    }
  ],
  contact: [
    {
      section_key: "main",
      aliases: ["main"],
      label: "Contact Header",
      variant: "contact-main",
      title: "Get in touch",
      body: "Have a requirement? Share your drawing or project details, and our team will get back to you with a practical quote.",
      meta_json: {
        eyebrow: "Contact Us",
        formHeading: "Send an Enquiry",
        formSubmitLabel: "Submit Enquiry",
        phone: "08047314415 Ext 9922",
        email: "mechnnovationtechnologies@gmail.com",
        address: "Shop No. 5, Sr. No. 38/1, Rajlaxmi Industrial Estate, Near Khudekar Industrial Estate, Narhe, Pune 411041",
        gstin: "27ABNFM1466C1Z9",
        mapQuery: "Rajlaxmi Industrial Estate Narhe Pune"
      }
    }
  ]
};

export function getPageTemplateKeys(pageKey) {
  return (SITE_PAGE_TEMPLATES[pageKey] || []).map((template) => template.section_key);
}

export function resolvePageSections(pageKey, sections = []) {
  const templates = SITE_PAGE_TEMPLATES[pageKey] || [];
  const matchedIds = new Set();

  const resolved = templates.map((template) => {
    const possibleKeys = [template.section_key, ...(template.aliases || [])];
    const existing = sections.find((item) => !matchedIds.has(item.id) && possibleKeys.includes(item.section_key));

    if (existing?.id) {
      matchedIds.add(existing.id);
    }

    return {
      id: existing?.id || "",
      page_key: pageKey,
      section_key: template.section_key,
      title: existing?.title ?? template.title ?? "",
      body: existing?.body ?? template.body ?? "",
      meta_json: normalizeMetaByVariant(template.variant, template.meta_json, existing?.meta_json),
      editor_label: template.label,
      editor_variant: template.variant,
      source_section_key: existing?.section_key || template.section_key,
      is_template_only: !existing
    };
  });

  const extras = sections
    .filter((item) => item.id && !matchedIds.has(item.id))
    .map((item) => ({
      ...item,
      meta_json: cloneValue(item.meta_json) || {},
      editor_label: formatSectionLabel(item.section_key),
      editor_variant: "generic",
      source_section_key: item.section_key,
      is_template_only: false
    }));

  return [...resolved, ...extras];
}

