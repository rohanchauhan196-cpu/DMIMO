import { PrismaClient, CategoryType, ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { imagePool, projectImage } from "../src/lib/images";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding D Mimo Architects database…");

  // --- Admin user -----------------------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@dmimoarchitects.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "change-this-password";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Studio Admin",
      role: "ADMIN",
    },
  });
  console.log(`Admin user ready: ${adminEmail}`);

  // --- Categories -------------------------------------------------------
  const projectCategoryDefs = [
    { name: "Residential", slug: "residential" },
    { name: "Commercial", slug: "commercial" },
    { name: "Hospitality", slug: "hospitality" },
    { name: "Interiors", slug: "interiors" },
    { name: "Others", slug: "others" },
  ];
  const blogCategoryDefs = [
    { name: "Architecture", slug: "architecture" },
    { name: "Interior Design", slug: "interior-design" },
    { name: "Design Trends", slug: "design-trends" },
    { name: "Projects", slug: "projects" },
    { name: "Materials", slug: "materials" },
    { name: "Sustainability", slug: "sustainability" },
  ];

  const projectCategories: Record<string, { id: string }> = {};
  for (let i = 0; i < projectCategoryDefs.length; i++) {
    const c = projectCategoryDefs[i];
    projectCategories[c.slug] = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, type: CategoryType.PROJECT, order: i },
    });
  }

  const blogCategories: Record<string, { id: string }> = {};
  for (let i = 0; i < blogCategoryDefs.length; i++) {
    const c = blogCategoryDefs[i];
    blogCategories[c.slug] = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, type: CategoryType.BLOG, order: i },
    });
  }
  console.log("Categories ready.");

  // --- Projects -----------------------------------------------------
  type ProjectSeed = {
    title: string;
    slug: string;
    category: string;
    location: string;
    year: number;
    client: string;
    architect: string;
    area: string;
    status: ProjectStatus;
    shortDescription: string;
    story: string;
    featured: boolean;
  };

  const projectDefs: ProjectSeed[] = [
    {
      title: "Obsidian Court",
      slug: "obsidian-court",
      category: "residential",
      location: "Alibaug, Maharashtra",
      year: 2025,
      client: "Private Residence",
      architect: "D Mimo Architects",
      area: "18,500 sq.ft.",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "A coastal residence organised around a central reflecting court, where basalt, teak and glass hold a quiet conversation with the sea.",
      story:
        "Obsidian Court sits on a gentle rise above the Konkan coastline, its black basalt volumes pressed low into the landscape to preserve the horizon from every room. The brief asked for a home that felt carved rather than built — a single gesture rather than a collection of rooms. We organised the plan around a central reflecting court, open to the sky, that draws light and sea air through the depth of the house and anchors circulation without a single corridor.\n\nMaterial restraint was the governing discipline. Basalt from a quarry two hours inland forms the primary mass; teak, aged to silver-grey, lines the interior soffits; and a single plane of frameless glass runs the full length of the living wing, folding away completely to merge the court with the lawn beyond. At night, the house reads as a lantern — its mass dissolves and only the warm teak interior remains visible, floating above the stone plinth.",
      featured: true,
    },
    {
      title: "Meridian Exchange",
      slug: "meridian-exchange",
      category: "commercial",
      location: "Bandra Kurla Complex, Mumbai",
      year: 2024,
      client: "Meridian Capital Group",
      architect: "D Mimo Architects",
      area: "142,000 sq.ft.",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "A twelve-storey financial headquarters wrapped in a fluted stone and bronze facade that reinterprets the city's Art Deco heritage.",
      story:
        "Meridian Exchange is a headquarters building for a capital markets firm, commissioned to anchor a corner site in Mumbai's financial district. Rather than default to an all-glass curtain wall, we drew on the city's Art Deco lineage — fluted stone piers, deep-set bronze mullions and a stepped crown — reinterpreted at the scale and performance standard of a contemporary workplace.\n\nInternally, the building is organised around a full-height atrium that brings daylight to the core of every floor plate and gives the firm's six hundred staff a shared civic space rather than a service corridor. The ground floor dissolves into a publicly accessible arcade, extending the pavement experience into a colonnaded forecourt framed by water and stone benches.",
      featured: true,
    },
    {
      title: "The Amaranth Hotel",
      slug: "the-amaranth-hotel",
      category: "hospitality",
      location: "Udaipur, Rajasthan",
      year: 2024,
      client: "Amaranth Hospitality",
      architect: "D Mimo Architects",
      area: "96,000 sq.ft.",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "A 64-key lakeside retreat that reworks the traditional haveli courtyard as a sequence of shaded, water-cooled pavilions.",
      story:
        "The Amaranth Hotel occupies a narrow site between a working lake and the old city wall, a condition that shaped the project into a sequence of pavilions rather than a single block. Each pavilion steps down toward the water, linked by open-air galleries lined in hand-chiselled sandstone jali screens that filter light into shifting lattice patterns through the day.\n\nWe worked closely with local stone masons and textile artisans to keep the craft economy of the region visible throughout the project, from the lime-plastered walls to the block-printed soft furnishings. The result is a hotel that reads as an extension of the old city rather than an import — contemporary in plan and performance, but unmistakably of its place.",
      featured: true,
    },
    {
      title: "Birchwood Residence",
      slug: "birchwood-residence",
      category: "residential",
      location: "Lonavala, Maharashtra",
      year: 2023,
      client: "Private Residence",
      architect: "D Mimo Architects",
      area: "9,800 sq.ft.",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "A weekend retreat in the Sahyadris built around a continuous cantilevered deck that hovers above the monsoon mist line.",
      story:
        "Set into a steep hillside, Birchwood Residence is organised as two simple stacked volumes connected by a cantilevered timber deck that extends twelve metres beyond the lower floor, suspending the living spaces above the valley mist. Exposed board-formed concrete anchors the house to the slope, while a lightweight timber and glass upper volume holds the bedrooms, oriented to frame the Sahyadri ridgeline from every pillow.",
      featured: false,
    },
    {
      title: "Alder & Finch Flagship",
      slug: "alder-finch-flagship",
      category: "commercial",
      location: "Khan Market, New Delhi",
      year: 2023,
      client: "Alder & Finch",
      architect: "D Mimo Architects",
      area: "6,200 sq.ft.",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "A three-level retail flagship where a sculptural brass stair becomes the organising device for the entire customer journey.",
      story:
        "For this heritage fashion house's first flagship, the brief was to turn a conventional retail stack into a destination. A sculptural brass and travertine stair spirals through all three floors, visible from the street through a full-height glazed facade, pulling customers upward through the collection narrative rather than relying on signage.",
      featured: false,
    },
    {
      title: "Sundown Villas",
      slug: "sundown-villas",
      category: "residential",
      location: "Goa",
      year: 2023,
      client: "Sundown Developers",
      architect: "D Mimo Architects",
      area: "64,000 sq.ft. (12 villas)",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "A gated cluster of twelve courtyard villas that choreograph privacy and shared landscape across a former cashew plantation.",
      story:
        "Sundown Villas reinterprets the Goan courtyard house as a repeatable but never identical module across twelve private residences. Laterite stone retaining walls follow the natural contours of the former plantation, preserving mature cashew and mango trees as the primary landscape structure rather than clearing the site for a masterplan grid.",
      featured: false,
    },
    {
      title: "Harrow Street Lofts",
      slug: "harrow-street-lofts",
      category: "interiors",
      location: "Bandra, Mumbai",
      year: 2022,
      client: "Private Residence",
      architect: "D Mimo Architects",
      area: "3,400 sq.ft.",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "An interior-only intervention inside a converted textile mill, built around a single 11-metre library wall in blackened oak.",
      story:
        "This full interior fit-out occupies a raw mill-conversion shell, left deliberately industrial — exposed services, original cast-iron columns, board-marked concrete soffits. A single 11-metre joinery wall in blackened oak runs the length of the apartment, concealing storage, a library and a fold-away guest suite behind a continuous, almost monolithic surface.",
      featured: true,
    },
    {
      title: "Cedarfield Office Park",
      slug: "cedarfield-office-park",
      category: "commercial",
      location: "Whitefield, Bengaluru",
      year: 2022,
      client: "Cedarfield Developments",
      architect: "D Mimo Architects",
      area: "410,000 sq.ft.",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "A four-building technology campus organised around a shaded, naturally ventilated central spine and water garden.",
      story:
        "Cedarfield is a campus for three thousand technology workers, planned around a central landscaped spine that each building's lobby opens directly onto. Deep brise-soleil screens in anodised aluminium cut solar gain by sixty percent on the east and west facades, reducing the cooling load enough to allow a significantly smaller mechanical plant than a comparable sealed glass tower.",
      featured: false,
    },
    {
      title: "Porto Marina Residences",
      slug: "porto-marina-residences",
      category: "hospitality",
      location: "Candolim, Goa",
      year: 2021,
      client: "Porto Hospitality Group",
      architect: "D Mimo Architects",
      area: "58,000 sq.ft.",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "A 40-key boutique marina hotel with a continuous ground-floor promenade linking every suite to the waterfront.",
      story:
        "Porto Marina Residences sits directly on a working marina, and the design treats the waterline as the primary public room of the hotel. A continuous timber promenade connects all forty suites at ground level, lined with casuarina and interrupted by small shaded courts that double as private plunge-pool terraces for the upper units.",
      featured: false,
    },
    {
      title: "Greywater Pavilion",
      slug: "greywater-pavilion",
      category: "others",
      location: "Auroville, Tamil Nadu",
      year: 2021,
      client: "Auroville Foundation",
      architect: "D Mimo Architects",
      area: "2,100 sq.ft.",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "A compressed-earth-block research pavilion and greywater demonstration facility for a sustainable living research campus.",
      story:
        "Built entirely from compressed stabilised earth blocks made on-site from excavated soil, the Greywater Pavilion houses a research and demonstration facility for a constructed-wetland water treatment system. The building itself is a teaching tool — its structural logic, load paths and passive cooling strategy are left legible rather than concealed, with signage developed in collaboration with the research team.",
      featured: false,
    },
    {
      title: "Thornbury Residence",
      slug: "thornbury-residence",
      category: "residential",
      location: "Bengaluru",
      year: 2020,
      client: "Private Residence",
      architect: "D Mimo Architects",
      area: "7,200 sq.ft.",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "An urban infill residence on a tight corner plot that turns a structural constraint into a signature perforated brick skin.",
      story:
        "On a compact corner plot hemmed in by neighbouring walls on two sides, Thornbury Residence wraps its upper floors in a custom-moulded perforated brick screen that provides privacy, cross-ventilation and dappled daylight simultaneously, while the ground floor opens fully onto a small internal garden court.",
      featured: false,
    },
    {
      title: "Northgate Transit Hub",
      slug: "northgate-transit-hub",
      category: "others",
      location: "Pune",
      year: 2026,
      client: "Pune Metropolitan Region Development Authority",
      architect: "D Mimo Architects",
      area: "220,000 sq.ft.",
      status: ProjectStatus.ONGOING,
      shortDescription:
        "A multimodal transit concourse currently under construction, unifying metro, bus and cycle infrastructure beneath a single timber-lattice canopy.",
      story:
        "Currently on site, Northgate Transit Hub will unify metro, inter-city bus and cycle-share infrastructure under a single gridshell timber canopy spanning ninety metres without intermediate columns at platform level. The project is being delivered in three phases to keep the existing transit interchange operational throughout construction.",
      featured: false,
    },
    {
      title: "Ferro House",
      slug: "ferro-house",
      category: "residential",
      location: "Coonoor, Tamil Nadu",
      year: 2026,
      client: "Private Residence",
      architect: "D Mimo Architects",
      area: "11,400 sq.ft.",
      status: ProjectStatus.CONCEPT,
      shortDescription:
        "A concept study for a hillside residence in the Nilgiris, built from rusted steel and glass to weather into the surrounding tea landscape.",
      story:
        "Ferro House is currently in design development for a site overlooking a working tea estate in the Nilgiri hills. The scheme proposes a weathering-steel structure left to rust naturally over its first two years, gradually matching the iron-rich red soil of the region, with glazed volumes inserted between steel frames to frame specific views of the estate below.",
      featured: false,
    },
    {
      title: "Lattice House",
      slug: "lattice-house",
      category: "interiors",
      location: "Jor Bagh, New Delhi",
      year: 2020,
      client: "Private Residence",
      architect: "D Mimo Architects",
      area: "5,600 sq.ft.",
      status: ProjectStatus.COMPLETED,
      shortDescription:
        "A full interior renovation of a 1970s bungalow, replacing a warren of small rooms with one continuous, light-filled living sequence.",
      story:
        "This renovation gutted a 1970s bungalow's compartmentalised interior down to its structural frame, replacing load-bearing partitions with a steel portal system that allowed the entire ground floor to open into one continuous living, dining and garden-room sequence, unified by a book-matched travertine floor laid without a single visible threshold.",
      featured: false,
    },
  ];

  for (let i = 0; i < projectDefs.length; i++) {
    const p = projectDefs[i];
    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        categoryId: projectCategories[p.category].id,
        location: p.location,
        year: p.year,
        client: p.client,
        architect: p.architect,
        area: p.area,
        status: p.status,
        shortDescription: p.shortDescription,
        story: p.story,
        coverImage: projectImage(i),
        featured: p.featured,
        published: true,
        order: i,
        seoTitle: `${p.title} — ${p.location}`,
        seoDescription: p.shortDescription,
      },
    });

    const existingGalleryCount = await prisma.projectImage.count({ where: { projectId: project.id } });
    if (existingGalleryCount === 0) {
      const galleryCount = 5;
      const layouts = ["full", "half", "half", "large", "small"];
      for (let g = 0; g < galleryCount; g++) {
        await prisma.projectImage.create({
          data: {
            projectId: project.id,
            url: projectImage(i + g + 3),
            caption: g === 0 ? `${p.title} — exterior view` : undefined,
            layout: layouts[g % layouts.length],
            order: g,
          },
        });
      }
    }
  }
  console.log(`Seeded ${projectDefs.length} projects.`);

  // --- Services -------------------------------------------------------
  const serviceDefs = [
    {
      title: "Architecture",
      slug: "architecture",
      number: "01",
      shortDescription: "Ground-up design for residential, commercial and civic buildings.",
      description:
        "From first sketch to final certificate of occupancy, we lead the full architectural process — concept design, statutory approvals, construction documentation and site supervision — for buildings that are resolved in both idea and detail.",
      image: imagePool.services.architecture,
      capabilities: ["Concept & Schematic Design", "Design Development", "Construction Documentation", "Statutory Approvals", "Site Supervision"],
    },
    {
      title: "Interior Design",
      slug: "interior-design",
      number: "02",
      shortDescription: "Bespoke interiors for homes, offices and hospitality spaces.",
      description:
        "Our interiors practice treats material, light and joinery as structural decisions, not decoration. We design custom furniture, lighting schemes and material palettes that are specific to each client and site.",
      image: imagePool.services.interiorDesign,
      capabilities: ["Space Planning", "Custom Joinery & Furniture", "Material & Lighting Design", "FF&E Procurement", "Art & Styling Direction"],
    },
    {
      title: "Residential Design",
      slug: "residential",
      number: "03",
      shortDescription: "Private homes and residential developments designed around how people actually live.",
      description:
        "Whether a single family home or a multi-unit residential development, we start from daily rituals — how light enters a kitchen at breakfast, where a family gathers in the evening — and build the architecture outward from there.",
      image: imagePool.services.residential,
      capabilities: ["Villas & Private Homes", "Residential Masterplanning", "Multi-Unit Developments", "Landscape Integration"],
    },
    {
      title: "Commercial Design",
      slug: "commercial",
      number: "04",
      shortDescription: "Workplaces, retail and mixed-use buildings built for performance and identity.",
      description:
        "We design commercial buildings that perform rigorously — daylighting, energy load, circulation efficiency — while giving each client a distinct architectural identity in a competitive market.",
      image: imagePool.services.commercial,
      capabilities: ["Corporate Headquarters", "Retail & Flagship Stores", "Mixed-Use Towers", "Workplace Strategy"],
    },
    {
      title: "Hospitality",
      slug: "hospitality",
      number: "05",
      shortDescription: "Hotels, resorts and restaurants designed around guest experience and place.",
      description:
        "Hospitality projects live or die on atmosphere. We work closely with operators from the earliest feasibility stage through to opening, embedding brand and guest journey into the architecture itself.",
      image: imagePool.services.hospitality,
      capabilities: ["Hotels & Resorts", "F&B & Restaurant Design", "Spa & Wellness", "Guest Journey Strategy"],
    },
    {
      title: "Urban Planning",
      slug: "urban-planning",
      number: "06",
      shortDescription: "Masterplans and public realm strategies for neighbourhoods and campuses.",
      description:
        "Our planning work operates at the scale of neighbourhoods, campuses and transit infrastructure, balancing density, mobility and public space to produce places that remain legible and humane at full build-out.",
      image: imagePool.services.urbanPlanning,
      capabilities: ["Masterplanning", "Transit-Oriented Design", "Public Realm Strategy", "Feasibility Studies"],
    },
    {
      title: "Renovation",
      slug: "renovation",
      number: "07",
      shortDescription: "Adaptive reuse and renovation of existing structures and heritage buildings.",
      description:
        "We approach renovation as a dialogue with what already exists — structure, material, history — rather than a blank canvas, extending the life of buildings that still have something to offer.",
      image: imagePool.services.renovation,
      capabilities: ["Adaptive Reuse", "Heritage Restoration", "Structural Retrofits", "Interior Renovation"],
    },
    {
      title: "Project Consultancy",
      slug: "consultancy",
      number: "08",
      shortDescription: "Design advisory, feasibility and project management for complex briefs.",
      description:
        "For clients who need strategic design input without a full architectural commission, we offer advisory services spanning feasibility, design review and project management across the construction process.",
      image: imagePool.services.consultancy,
      capabilities: ["Design Advisory", "Feasibility Studies", "Project Management", "Design Review & Audit"],
    },
  ];

  for (let i = 0; i < serviceDefs.length; i++) {
    const s = serviceDefs[i];
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        title: s.title,
        slug: s.slug,
        number: s.number,
        shortDescription: s.shortDescription,
        description: s.description,
        image: s.image,
        capabilities: s.capabilities,
        order: i,
        published: true,
      },
    });
  }
  console.log(`Seeded ${serviceDefs.length} services.`);

  // --- Blogs -------------------------------------------------------
  const blogDefs = [
    {
      title: "Why Material Honesty Still Matters in 2026",
      slug: "why-material-honesty-still-matters-in-2026",
      category: "architecture",
      excerpt:
        "As finishes become easier to fake, the discipline of letting a material simply be itself has become more valuable, not less.",
      content:
        "<p>There has never been a moment in architectural history when it was easier to disguise one material as another. Laminates mimic timber grain down to the knot; porcelain slabs replicate the veining of Calacatta marble at a fraction of the cost and weight; printed vinyl can convincingly pass for board-formed concrete from across a room.</p><p>And yet, on every project we take on at D Mimo, we return to the same governing principle: let the material be what it is. A concrete wall should read as concrete — its formwork marks, its subtle colour variation, the evidence of how it was poured — not as a smooth, characterless surface pretending to be something more refined.</p><blockquote>Material honesty is not a aesthetic preference. It is a form of respect — for the user, who deserves to know what they are touching, and for the material itself.</blockquote><p>This doesn't mean rejecting sophistication. A honed basalt floor can be extraordinarily refined. But its refinement comes from the quality of the stone and the precision of the finish, not from pretending to be marble it isn't.</p>",
    },
    {
      title: "Inside the Courtyard: A Typology That Refuses to Age",
      slug: "inside-the-courtyard-a-typology-that-refuses-to-age",
      category: "design-trends",
      excerpt:
        "From Roman atriums to contemporary villas, the courtyard remains the most resilient organising device in residential architecture.",
      content:
        "<p>Long before mechanical cooling, the courtyard solved a problem that air conditioning only partially addresses today: how to bring light and air deep into a building's plan without exposing every room to direct sun.</p><h2>A Climate Response That Became a Social One</h2><p>What began as a purely climatic response — a shaded, ventilated void at the centre of a dense urban plan — became, over centuries, a social one. The courtyard is neither fully inside nor fully outside. It is a room with no roof, and that ambiguity is precisely its value.</p><p>On Obsidian Court, our recently completed residence in Alibaug, the central court does triple duty: it ventilates the plan passively, it choreographs how a visitor moves through the house without a single corridor, and it gives every room — even those facing away from the sea — a private relationship with the sky.</p>",
    },
    {
      title: "Specifying Stone: A Field Guide for Architects",
      slug: "specifying-stone-a-field-guide-for-architects",
      category: "materials",
      excerpt:
        "Porosity, veining direction, finish — the decisions that separate a stone specification that lasts decades from one that fails in five years.",
      content:
        "<p>Stone is unforgiving. Specify it wrong and the consequences — staining, spalling, efflorescence — can take years to appear and are nearly impossible to fully reverse once they do.</p><h2>Porosity First</h2><p>Before aesthetics, every stone specification should start with a porosity test appropriate to its application. A beautiful limestone that performs well as interior cladding can fail catastrophically as an exterior paving material in a monsoon climate.</p><h2>Reading the Quarry Block</h2><p>Veining direction relative to the quarry block affects both appearance and structural behaviour. We always request block photographs before finalising a stone specification on any project above a few hundred square feet, never relying on a small showroom sample alone.</p>",
    },
    {
      title: "Designing for the Monsoon: Lessons from the Western Ghats",
      slug: "designing-for-the-monsoon-lessons-from-the-western-ghats",
      category: "sustainability",
      excerpt:
        "Two thousand millimetres of rain in four months changes everything about how a roofline, a drainage plan and a material palette should be conceived.",
      content:
        "<p>Designing a building to merely survive the monsoon is a low bar. Designing one that is genuinely improved by it — where the sound of rain on a deep eave, or the sight of water sheeting off a cantilevered roof, becomes part of the architectural experience — requires rethinking the brief entirely.</p><p>On Birchwood Residence in Lonavala, we oriented the entire roof geometry around monsoon wind direction rather than solar path, a reversal of the usual design priority in this climate, because for four months of the year wind-driven rain — not sun — is the dominant environmental force on the building envelope.</p>",
    },
    {
      title: "The Economics of Good Daylighting",
      slug: "the-economics-of-good-daylighting",
      category: "sustainability",
      excerpt:
        "Well-designed daylighting isn't a soft, qualitative benefit — on Meridian Exchange, it measurably reduced the building's lifetime mechanical costs.",
      content:
        "<p>Daylighting is often framed as a wellness consideration — and it is one. But it is also, when designed rigorously, a hard economic lever that affects a building's operating cost for the life of the asset.</p><p>On Meridian Exchange, the full-height atrium we designed to bring daylight to the core of every floor plate allowed us to specify a meaningfully smaller HVAC plant than a comparable sealed glass tower of the same floor area, a saving that compounds every year the building operates.</p>",
    },
    {
      title: "Behind the Design: The Amaranth Hotel",
      slug: "behind-the-design-the-amaranth-hotel",
      category: "projects",
      excerpt:
        "A conversation with our design team on reworking the haveli courtyard typology for a 64-key lakeside hotel in Udaipur.",
      content:
        "<p>When Amaranth Hospitality approached us with a narrow site between a working lake and Udaipur's old city wall, the conventional hotel-block solution simply wasn't available. The site demanded a different organisational logic.</p><p>We spoke with the project's lead architect about the decision to break the hotel into a sequence of stepped pavilions rather than a single mass, the collaboration with local stone masons on the jali screens, and what it took to keep the craft economy of the region visible throughout a project of this scale.</p>",
    },
    {
      title: "What We Look For in a Site Before We Draw Anything",
      slug: "what-we-look-for-in-a-site-before-we-draw-anything",
      category: "architecture",
      excerpt:
        "Long before the first sketch, a site visit answers questions no survey document ever will.",
      content:
        "<p>A topographic survey will tell you the contours of a site. It will not tell you where the afternoon light sits in December, where water pools after the first heavy rain of the season, or which direction the prevailing breeze actually moves through a valley, regardless of what the regional wind rose suggests.</p><p>Every D Mimo project begins with at least one full-day site visit before a single concept sketch is produced — often two, at different times of year when the brief allows it. We've redesigned entire massing strategies based on what we found on a second visit that a survey document alone would never have revealed.</p>",
    },
    {
      title: "Adaptive Reuse: The Most Sustainable Building Is One Already Built",
      slug: "adaptive-reuse-the-most-sustainable-building-is-one-already-built",
      category: "sustainability",
      excerpt:
        "On Harrow Street Lofts, keeping the mill's existing structure wasn't a heritage gesture — it was the single largest sustainability decision on the project.",
      content:
        "<p>The embodied carbon of a building's structural frame — the concrete, the steel, the brick — typically represents half or more of its total lifetime carbon footprint before a single occupant moves in. Demolishing a structurally sound frame to build new, however efficient the replacement building's operations may be, rarely recovers that carbon debt within a reasonable timeframe.</p><p>On Harrow Street Lofts, retaining the mill's original cast-iron columns and concrete floor plates — rather than demolishing and rebuilding — was, by a significant margin, the single highest-impact sustainability decision made on the project, outweighing every subsequent choice about glazing performance or finishes.</p>",
    },
  ];

  for (let i = 0; i < blogDefs.length; i++) {
    const b = blogDefs[i];
    const daysAgo = (blogDefs.length - i) * 11;
    await prisma.blog.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        title: b.title,
        slug: b.slug,
        categoryId: blogCategories[b.category].id,
        author: "D Mimo Architects",
        featuredImage: projectImage(i + 20),
        excerpt: b.excerpt,
        content: b.content,
        published: true,
        publishedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        seoTitle: b.title,
        seoDescription: b.excerpt,
      },
    });
  }
  console.log(`Seeded ${blogDefs.length} blog posts.`);

  // --- Testimonials -------------------------------------------------
  const testimonialDefs = [
    {
      quote:
        "D Mimo didn't just design our home — they understood how our family actually moves through a day before they drew a single wall. Three years in, the house still feels considered in ways we keep discovering.",
      clientName: "Private Client",
      project: "Obsidian Court",
      location: "Alibaug",
    },
    {
      quote:
        "The team's ability to hold a commercial brief's hard numbers — budget, programme, leasing targets — alongside genuine architectural ambition is rare. Meridian Exchange delivered on both.",
      clientName: "Meridian Capital Group",
      project: "Meridian Exchange",
      location: "Mumbai",
    },
    {
      quote:
        "We've built four hotels with four different architecture practices. D Mimo was the first to treat our operations team's input as design information rather than a constraint to work around.",
      clientName: "Amaranth Hospitality",
      project: "The Amaranth Hotel",
      location: "Udaipur",
    },
    {
      quote:
        "What struck us most was the patience in the process — multiple site visits, real material mockups, nothing approved from a rendering alone. That discipline shows in the finished building.",
      clientName: "Private Client",
      project: "Birchwood Residence",
      location: "Lonavala",
    },
  ];

  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    for (let i = 0; i < testimonialDefs.length; i++) {
      const t = testimonialDefs[i];
      await prisma.testimonial.create({ data: { ...t, order: i, published: true } });
    }
  }
  console.log(`Seeded ${testimonialDefs.length} testimonials.`);

  // --- Site Settings -------------------------------------------------
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
  console.log("Site settings ready.");

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
