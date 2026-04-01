const productImage = "/images/tooling-gears.jpg";
const machiningImage = "/images/cnc-operator.jpg";
const componentsImage = "/images/precision-parts.jpg";
const serviceImage = "/images/engineering-office.jpg";

export const leadStatuses = [
  "new",
  "qualified",
  "quoted",
  "negotiating",
  "won",
  "lost"
];

export const companyProfile = {
  name: "Mechnnovation Technologies",
  legal_status: "Partnership Firm",
  speciality: [
    "Moulding Die",
    "VMC Machine Job Work",
    "CNC Turned Components"
  ],
  location: "Narhe, Pune 411041, Maharashtra",
  address: [
    "Shop No. 5, Sr. No. 38/1, Rajlaxmi Industrial Estate,",
    "Near Khudekar Industrial Estate, Narhe, Pune 411041"
  ].join(" "),
  email: "mechnnovationtechnologies@gmail.com",
  phone: "08047314415 Ext 9922",
  gstin: "27ABNFM1466C1Z9",
  gst_date: "2020-01-14",
  experience_years: 12,
  annual_turnover: "0 - 40 Lakhs",
  capability_tags: [
    "2D / 3D Design Support",
    "Precision CNC & VMC Machining",
    "Industrial Custom Manufacturing"
  ]
};

export const categories = [
  {
    id: "cat-moulding-die",
    name: "Moulding Die",
    slug: "moulding-die",
    description: "High-precision moulding dies for rubber, plastic, bottle, and vacuum forming applications.",
    sort_order: 1,
    is_active: true
  },
  {
    id: "cat-cnc-components",
    name: "CNC Turned Components",
    slug: "cnc-turned-components",
    description: "Durable CNC turned and machined components for industrial applications.",
    sort_order: 2,
    is_active: true
  },
  {
    id: "cat-wear-plates",
    name: "Wear Plates",
    slug: "wear-plates",
    description: "Oilless wear plates engineered for reduced friction and high-load reliability.",
    sort_order: 3,
    is_active: true
  },
  {
    id: "cat-engine-mounting",
    name: "Engine Mounting",
    slug: "engine-mounting",
    description: "Specialized industrial engine mounting and pneumatic cylinder solutions.",
    sort_order: 4,
    is_active: true
  },
  {
    id: "cat-vmc-job-work",
    name: "VMC Machine Job Work",
    slug: "vmc-machine-job-work",
    description: "On-demand VMC machining services for prototypes, batch production, and precision job work.",
    sort_order: 5,
    is_active: true
  },
  {
    id: "cat-cnc-machining-services",
    name: "CNC Machining Services",
    slug: "cnc-machining-services",
    description: "Custom CNC machining and precision manufacturing support for industrial buyers.",
    sort_order: 6,
    is_active: true
  }
];

export const products = [
  {
    id: "prod-4-cavity-rubber-moulding-die",
    category_id: "cat-moulding-die",
    name: "4 Cavity Rubber Moulding Die",
    slug: "4-cavity-rubber-moulding-die",
    short_description: "Multi-cavity moulding die built for consistent cycle times and repeatable output.",
    description: "Designed for industrial rubber part manufacturing, this 4 cavity rubber moulding die delivers accurate cavity balance, robust durability, and dependable production quality for repeated shop-floor use.",
    specs_json: {
      Material: "Tool steel",
      Application: "Rubber moulding",
      Cavities: "4",
      Finish: "Precision machined"
    },
    primary_image_url: productImage,
    gallery_urls_json: [productImage, machiningImage],
    is_featured: true,
    is_active: true,
    created_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "prod-plastic-blow-moulding-die",
    category_id: "cat-moulding-die",
    name: "Plastic Blow Moulding Die",
    slug: "plastic-blow-moulding-die",
    short_description: "Custom blow moulding die for durable plastic product manufacturing.",
    description: "A high-accuracy blow moulding die engineered for production consistency, dimensional control, and cleaner finish across industrial plastic components.",
    specs_json: {
      Material: "Alloy steel / aluminium",
      Process: "Blow moulding",
      Industry: "Packaging and industrial plastics",
      Tolerance: "Application-specific"
    },
    primary_image_url: productImage,
    gallery_urls_json: [productImage],
    is_featured: false,
    is_active: true,
    created_at: "2025-01-02T00:00:00.000Z"
  },
  {
    id: "prod-plastic-bottle-moulding-die",
    category_id: "cat-moulding-die",
    name: "Plastic Bottle Moulding Die",
    slug: "plastic-bottle-moulding-die",
    short_description: "Bottle moulding die optimized for repeatability and production throughput.",
    description: "Precision-made bottle moulding die for plastic bottle applications requiring stable geometry, repeatable performance, and production-ready durability.",
    specs_json: {
      Material: "Hardened steel",
      Product: "Bottle moulding",
      Output: "Production tooling",
      Surface: "Machined and polished"
    },
    primary_image_url: productImage,
    gallery_urls_json: [productImage],
    is_featured: false,
    is_active: true,
    created_at: "2025-01-03T00:00:00.000Z"
  },
  {
    id: "prod-aluminium-vacuum-forming-mould-die",
    category_id: "cat-moulding-die",
    name: "Aluminium Vacuum Forming Mould Die",
    slug: "aluminium-vacuum-forming-mould-die",
    short_description: "Lightweight aluminium tooling for vacuum forming processes.",
    description: "Built for vacuum forming applications, this aluminium mould die offers fast machining turnaround, good thermal behavior, and accurate part reproduction.",
    specs_json: {
      Material: "Aluminium",
      Process: "Vacuum forming",
      Use: "Prototype and production",
      Finish: "Industrial polished"
    },
    primary_image_url: productImage,
    gallery_urls_json: [productImage, serviceImage],
    is_featured: true,
    is_active: true,
    created_at: "2025-01-04T00:00:00.000Z"
  },
  {
    id: "prod-vmc-job-service",
    category_id: "cat-cnc-components",
    name: "VMC Job Service",
    slug: "vmc-job-service",
    short_description: "Precision VMC job work support for custom industrial parts and batches.",
    description: "Reliable VMC job service for components requiring repeatable machining quality, tight process control, and industry-ready turnaround times.",
    specs_json: {
      Service: "VMC machining",
      Batch: "Prototype to medium production",
      Material: "MS, SS, aluminium, brass",
      Support: "Drawing-based manufacturing"
    },
    primary_image_url: machiningImage,
    gallery_urls_json: [machiningImage, serviceImage],
    is_featured: true,
    is_active: true,
    created_at: "2025-01-05T00:00:00.000Z"
  },
  {
    id: "prod-stainless-steel-insert",
    category_id: "cat-cnc-components",
    name: "Stainless Steel Insert",
    slug: "stainless-steel-insert",
    short_description: "Machined stainless steel insert for industrial assemblies and fixtures.",
    description: "A precision stainless steel insert manufactured for fit-critical industrial applications where finish, consistency, and durability matter.",
    specs_json: {
      Material: "Stainless steel",
      Finish: "Precision turned",
      Use: "Assemblies and fixtures",
      Tolerance: "Tight tolerance available"
    },
    primary_image_url: componentsImage,
    gallery_urls_json: [componentsImage],
    is_featured: false,
    is_active: true,
    created_at: "2025-01-06T00:00:00.000Z"
  },
  {
    id: "prod-cnc-components",
    category_id: "cat-cnc-components",
    name: "CNC Components",
    slug: "cnc-components",
    short_description: "Custom CNC machined components for industrial and manufacturing buyers.",
    description: "Versatile CNC components manufactured to client drawings with dependable dimensional accuracy and production-ready repeatability.",
    specs_json: {
      Process: "CNC machining",
      Materials: "Steel, aluminium, brass, engineering plastics",
      Output: "Custom components",
      Quality: "Inspection-backed manufacturing"
    },
    primary_image_url: componentsImage,
    gallery_urls_json: [componentsImage, machiningImage],
    is_featured: true,
    is_active: true,
    created_at: "2025-01-07T00:00:00.000Z"
  },
  {
    id: "prod-cnc-turned-components",
    category_id: "cat-cnc-components",
    name: "CNC Turned Components",
    slug: "cnc-turned-components",
    short_description: "Turned parts for industrial buyers needing repeatability and finish quality.",
    description: "Production-friendly CNC turned components made for ongoing industrial use, tailored to dimensional needs and material selection.",
    specs_json: {
      Process: "Turning",
      Use: "Industrial components",
      Batch: "Low to medium volume",
      Quality: "Controlled machining process"
    },
    primary_image_url: componentsImage,
    gallery_urls_json: [componentsImage],
    is_featured: true,
    is_active: true,
    created_at: "2025-01-08T00:00:00.000Z"
  },
  {
    id: "prod-brass-oilless-wear-plate",
    category_id: "cat-wear-plates",
    name: "Brass Oilless Wear Plate",
    slug: "brass-oilless-wear-plate",
    short_description: "Durable brass wear plate designed for low-maintenance industrial movement.",
    description: "Brass oilless wear plate solution designed for long life, reduced maintenance, and dependable load performance in industrial assemblies.",
    specs_json: {
      Material: "Brass",
      Feature: "Oilless",
      Application: "Wear control",
      Industry: "Industrial machinery"
    },
    primary_image_url: componentsImage,
    gallery_urls_json: [componentsImage],
    is_featured: false,
    is_active: true,
    created_at: "2025-01-09T00:00:00.000Z"
  },
  {
    id: "prod-pneumatic-vehicle-cylinder",
    category_id: "cat-engine-mounting",
    name: "Pneumatic Vehicle Cylinder",
    slug: "pneumatic-vehicle-cylinder",
    short_description: "Precision vehicle cylinder component for demanding industrial performance.",
    description: "Custom-built pneumatic vehicle cylinder and mounting support component engineered for industrial durability and precision fitting.",
    specs_json: {
      Material: "Application-specific alloy",
      System: "Pneumatic",
      Use: "Vehicle / industrial mounting",
      Build: "Custom machining support"
    },
    primary_image_url: serviceImage,
    gallery_urls_json: [serviceImage],
    is_featured: false,
    is_active: true,
    created_at: "2025-01-10T00:00:00.000Z"
  },
  {
    id: "prod-vmc-machine-services",
    category_id: "cat-vmc-job-work",
    name: "VMC Machine Services",
    slug: "vmc-machine-services",
    short_description: "Precision VMC machine services for industrial fabrication and machining.",
    description: "End-to-end VMC machine services with drawing-based machining support, repeatable production accuracy, and practical turnaround planning.",
    specs_json: {
      Service: "VMC machine services",
      Materials: "MS, SS, aluminium, brass",
      Support: "Batch job work",
      Turnaround: "On request"
    },
    primary_image_url: machiningImage,
    gallery_urls_json: [machiningImage],
    is_featured: true,
    is_active: true,
    created_at: "2025-01-11T00:00:00.000Z"
  },
  {
    id: "prod-vmc-job-work",
    category_id: "cat-vmc-job-work",
    name: "VMC Job Work",
    slug: "vmc-job-work",
    short_description: "Job work machining support for precise component manufacturing.",
    description: "Flexible VMC job work service for industrial buyers who need custom machining based on part drawings, tolerances, and batch needs.",
    specs_json: {
      Service: "Job work",
      Capacity: "Custom batches",
      Input: "2D / 3D drawing support",
      Focus: "Precision machining"
    },
    primary_image_url: machiningImage,
    gallery_urls_json: [machiningImage],
    is_featured: true,
    is_active: true,
    created_at: "2025-01-12T00:00:00.000Z"
  },
  {
    id: "prod-cnc-precision-components-job-work",
    category_id: "cat-vmc-job-work",
    name: "CNC Precision Components Job Work",
    slug: "cnc-precision-components-job-work",
    short_description: "Precision job work for custom CNC components with controlled tolerances.",
    description: "Built for industrial accuracy, this job work service supports precision component manufacturing across varied materials and production volumes.",
    specs_json: {
      Service: "Precision job work",
      Process: "CNC / VMC",
      Output: "Custom components",
      IdealFor: "OEMs and industrial buyers"
    },
    primary_image_url: machiningImage,
    gallery_urls_json: [machiningImage, componentsImage],
    is_featured: false,
    is_active: true,
    created_at: "2025-01-13T00:00:00.000Z"
  },
  {
    id: "prod-precision-machining-service",
    category_id: "cat-vmc-job-work",
    name: "Precision Machining Service",
    slug: "precision-machining-service",
    short_description: "Custom precision machining service for demanding industrial requirements.",
    description: "Ideal for buyers who need accurate machining, controlled delivery, and collaborative manufacturing support from enquiry to dispatch.",
    specs_json: {
      Service: "Precision machining",
      Support: "Quote-based",
      Industry: "Industrial / OEM",
      Process: "Custom machining"
    },
    primary_image_url: serviceImage,
    gallery_urls_json: [serviceImage, machiningImage],
    is_featured: true,
    is_active: true,
    created_at: "2025-01-14T00:00:00.000Z"
  },
  {
    id: "prod-precision-vmc-machining-job-work",
    category_id: "cat-cnc-machining-services",
    name: "Precision VMC Machining Job Work",
    slug: "precision-vmc-machining-job-work",
    short_description: "High-accuracy VMC machining job work for custom part production.",
    description: "Precision VMC machining job work suitable for customers requiring process discipline, high-quality finish, and dependable delivery cycles.",
    specs_json: {
      Process: "VMC machining",
      Service: "Job work",
      Material: "Application-based",
      Output: "Custom precision parts"
    },
    primary_image_url: machiningImage,
    gallery_urls_json: [machiningImage],
    is_featured: false,
    is_active: true,
    created_at: "2025-01-15T00:00:00.000Z"
  },
  {
    id: "prod-precision-machining-job-works",
    category_id: "cat-cnc-machining-services",
    name: "Precision Machining Job Works",
    slug: "precision-machining-job-works",
    short_description: "Industrial machining job work for buyers needing production-ready accuracy.",
    description: "A flexible machining service for industrial part requirements, from one-off development parts to repeatable batch job work.",
    specs_json: {
      Service: "Machining job work",
      Volume: "Prototype to repeat production",
      Drawings: "Client-supplied drawings supported",
      Quality: "Inspection-based release"
    },
    primary_image_url: serviceImage,
    gallery_urls_json: [serviceImage, machiningImage],
    is_featured: false,
    is_active: true,
    created_at: "2025-01-16T00:00:00.000Z"
  }
];

export const siteContent = [
  {
    id: "content-about-story",
    page_key: "about",
    section_key: "story",
    title: "12+ years of tooling and machining expertise.",
    body: "Mechnnovation Technologies is a Pune-based partnership firm specializing in moulding dies, CNC components, and VMC job work.",
    meta_json: {
      stats: [
        { label: "Years", value: "12+" },
        { label: "Products", value: "100+" },
        { label: "Location", value: "Pune" },
        { label: "GST", value: "Verified" }
      ]
    },
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "content-about-capabilities",
    page_key: "about",
    section_key: "capabilities",
    title: "Capabilities",
    body: "CNC and VMC machining, moulding dies, drawing-based manufacturing, and custom industrial work.",
    meta_json: {
      list: [
        "CNC / VMC machining",
        "Moulding die development",
        "2D / 3D design support",
        "Custom industrial manufacturing"
      ]
    },
    updated_at: "2025-01-01T00:00:00.000Z"
  },
  {
    id: "content-contact-main",
    page_key: "contact",
    section_key: "main",
    title: "Contact Us",
    body: "Share your requirement, and our team will get back to you with the next step.",
    meta_json: {
      mapQuery: "Narhe Pune Rajlaxmi Industrial Estate"
    },
    updated_at: "2025-01-01T00:00:00.000Z"
  }
];

export const testimonials = [
  {
    id: "testimonial-1",
    name: "Procurement Lead",
    company: "Industrial Buyer",
    quote: "Clear communication and dependable machining support.",
    is_active: true,
    sort_order: 1
  },
  {
    id: "testimonial-2",
    name: "Operations Manager",
    company: "Manufacturing Partner",
    quote: "Quick review and practical turnaround planning.",
    is_active: true,
    sort_order: 2
  },
  {
    id: "testimonial-3",
    name: "Project Engineer",
    company: "OEM Vendor Network",
    quote: "Good support on custom components and drawing-based job work.",
    is_active: true,
    sort_order: 3
  }
];







