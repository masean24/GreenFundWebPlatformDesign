# GreenFund — AI Agent Build Brief
*Connecting Communities, Capital, and Clean Energy*

> This document is the single source of truth for building the GreenFund prototype. Hand this whole file to your AI coding agent (Claude Code, Cursor, etc.) as the starting prompt. It's built for the Tech Connect HIMAKA 2026 competition (Smart Energy & Sustainability / Digital Platform & Customer Experience sub-theme).

---

## 1. Project Snapshot

**What GreenFund is:** A renewable-energy crowdfunding platform that connects communities, schools, villages, and small businesses running clean-energy projects with supporters, investors, and companies who want to fund them — with full transparency, progress tracking, and measurable impact.

**What makes it different from a generic crowdfunding site:** most platforms stop caring once money is collected. GreenFund keeps going — the **Energy Impact Portfolio** lets every supporter see the real-world outcome of their contribution (kWh generated, CO₂ reduced, households helped), turning donors/investors into visible participants in the energy transition, not just funders.

**Important framing for this build:** this is a **functional prototype for a competition**, not a live fintech product. No real payment processing, no real KYC/legal compliance is needed — but the experience must *feel* real and end-to-end. See Section 10.

---

## 2. What "Done" Looks Like

The agent should produce a working, clickable web app where a judge can, without any setup:
1. Land on the homepage and immediately understand the value proposition.
2. Browse and filter real-feeling projects, open one, and go through a full (simulated) support/investment flow.
3. Log in as any of the three roles instantly via demo accounts and see a dashboard that's clearly built for that role, not a generic reused shell.
4. See one end-to-end connected story: a Project Owner submits a project → Admin approves it → it appears live in Explore Projects → a Supporter funds it → it shows up in that Supporter's Impact Portfolio.

Polish and coherence on a **few flows done completely** beats breadth across all features half-done. See Section 7 for what to build first.

---

## 3. Tech Stack & Hard Constraints (from competition rules)

- **Must use HTML, CSS, and JavaScript** as the base technology.
- Frameworks/libraries are allowed and encouraged: **React + Vite + TypeScript + Tailwind CSS** recommended for build speed and polish.
- **No website builders or CMS** (WordPress, Wix, Webflow, Google Sites, etc.) — must be hand-coded.
- Must be **responsive** and **navigable/intuitive** (this is graded directly — see Section 12).
- **Deployment (decided):** frontend build deployed via **Coolify on the team's own VPS**, since submission just needs one working URL and this is already set up. No separate static host needed.

**Backend / data layer (decided): Supabase Cloud** (managed, not self-hosted — self-hosting Supabase on the VPS adds unnecessary multi-container complexity this close to deadline).
- **Auth**: use Supabase Auth for login/signup. Store `role` (`supporter` / `owner` / `admin`) in the user's metadata; every `/supporter/*`, `/owner/*`, `/admin/*` route guard in Section 4 reads this field.
- **Database**: Postgres tables for `projects`, `users`, `donations`, `investments`, `project_updates`, `verification_reviews`. Use **Row Level Security (RLS)** policies where feasible (e.g. only `admin` role can update a project's verification status) — this is a genuine architecture credibility point for the "Fungsionalitas" judging criterion, not just decoration.
- **Storage**: Supabase Storage for project images and uploaded documents (proposal, budget plan, supporting docs from the Create Project flow).
- **Realtime**: subscribe to `projects` table changes so funding progress bars, supporter counts, and status updates reflect live across the app the moment a demo action happens — this is what makes the prototype feel alive rather than a static mockup (see Section 10).
- Fallback only if Supabase setup becomes a blocker close to deadline: local mock "database" (JSON + React state/Zustand/Context) that persists during a session, with the same field shapes as the Supabase tables so swapping back is easy.

---

## 4. Information Architecture

Single application, three role namespaces, one shared entry point:

```
/                          → Public landing page
/explore                   → Public: browse/filter all projects
/project/:id                → Public: project detail page
/login                      → Shared login
/signup                     → Shared signup entry, role chosen in first step (see Section 5)
/dashboard                  → Smart redirect based on logged-in user's role

/supporter/dashboard
/supporter/explore           (or reuse /explore with logged-in state)
/supporter/project/:id/support   → Support/Invest flow
/supporter/portfolio         → Donations, Investments, Saved Projects
/supporter/impact            → Energy Impact Portfolio (the differentiator feature)

/owner/onboarding            → Organization profile completion (first-time only, see Section 5)
/owner/dashboard
/owner/create-project         → Multi-step project creation form
/owner/projects/:id/analytics
/owner/projects/:id/updates   → Post project updates

/admin/dashboard
/admin/verification           → Review queue: Approve / Reject / Need Revision
/admin/users
/admin/monitoring             → Global impact stats
```

- Route-guard each `/supporter/*`, `/owner/*`, `/admin/*` tree by role; unauthenticated or wrong-role access redirects to `/login`.
- Add a **"Try as Supporter / Project Owner / Admin"** shortcut on the login page — one click, no typing — that logs into a pre-seeded demo account and lands on that role's dashboard. This is the fastest way for a judge to explore all three roles.

---

## 5. Signup & Onboarding Flow

**Only two roles are self-service signup:** Supporter and Project Owner. **Admin has no public signup path at all** — it's an internal GreenFund team account, seeded directly in the database as one of the three demo accounts (Section 10). Don't build any UI that lets someone create an Admin account; that would be a security-logic red flag to judges, not a feature.

**Step 1 of `/signup` — role selection as two cards, not a dropdown.** These two personas have genuinely different goals (give money vs. raise money for a project), so make it a deliberate first choice, not a buried form field:

```
┌─────────────────────┐  ┌─────────────────────┐
│   🤝 Supporter        │  │   🏗️ Project Owner    │
│                      │  │                      │
│ Fund clean energy     │  │ Raise funds for your  │
│ projects and track    │  │ community's energy    │
│ your impact.           │  │ project.              │
└─────────────────────┘  └─────────────────────┘
```

**Step 2 — shared base form** (name, email, password) regardless of role chosen.

**Post-signup routing differs by role:**
- **Supporter** → straight to `/supporter/dashboard`.
- **Project Owner** → routed to `/owner/onboarding` first: a short "Complete Organization Profile" step (organization/community name, category: School / Village / SME / Organization) before they can reach Create Project. A project owner without a completed profile shouldn't be able to submit a project.

**Scope decision for this build: one account = one role.** No multi-role accounts (a real-world user might eventually want to be both a Supporter and a Project Owner, but supporting that adds role-switching logic that isn't worth the time here). Note this as a "future roadmap" item in the submission concept document rather than building it.

---

## 6. Design System

Derived from the existing GreenFund logo and the approved landing page direction (reference image provided separately — follow it closely, it's the approved art direction, not a placeholder).

**Color tokens:**
| Token | Approx. Hex | Use |
|---|---|---|
| `--green-forest` (primary) | `#14432B` | Nav text, primary buttons, headlines' second line |
| `--green-bright` (accent) | `#4CAF50` | "Fund" wordmark accent, links, progress fills, active states |
| `--green-tint` | `#E7F5EA` | Badge/pill backgrounds, icon circle backgrounds, subtle section backgrounds |
| `--teal-accent` | `#1F8A8C` | Secondary accent for charts/data viz, Green Investment elements |
| `--slate-dark` | `#1E2A26` | Body text on light backgrounds |
| `--surface` | `#FAFAF7` | Page background (warm off-white, not stark white) |
| `--white` | `#FFFFFF` | Cards |
| `--gray-border` | `#E5E7E0` | Borders, dividers |

**Typography:**
- One geometric/humanist sans-serif family for everything (e.g. Inter, Manrope, or General Sans) — don't split display/body into two families, it isn't needed here.
- Large, confident weight on hero headlines (700–800), regular body at 400–500.
- Avoid all-caps for every label — the reference image uses a tracked-out caps eyebrow ("CROWDFUNDING FOR A SUSTAINABLE FUTURE") in exactly one place (the hero badge); don't repeat that treatment on every section header. Reserve it for that one moment.

**Component patterns (match the reference image):**
- Rounded pill badges with icon + label for hero stats (Projects Funded, Supporters, Clean Energy Generated, CO₂ Reduced).
- Project cards: image top with two overlay badges (funding % top-left, location top-right), category icon in a circle, title, one-line description, amount raised / target, thin progress bar, save/heart icon bottom-right.
- Primary button: filled dark green, rounded. Secondary button: white with border, same radius.
- Floating card-on-image pattern for "Our Mission" style callouts.
- **Dashboard KPI cards must share one identical component style (radius, shadow, icon-circle treatment) across all three role dashboards** — see Section 8. Only the data changes, never the shell.

**Motion:** keep it to one deliberate moment — e.g. the funding progress bar animating in on load, or a confirmation checkmark animating on the mock-payment success screen. Avoid fade-slide-up on every single section; it reads as generic.

**Avoid these generic-AI tells** (per internal design guidance) since this brief already has a real, specific direction to follow instead:
- Don't default to a warm cream + serif + terracotta combo — this brand is green/white/slate, follow that.
- Don't add numbered markers (01/02/03) unless the content is genuinely a sequence (the funding Timeline — Verification → Fundraising → Construction → Operational — *is* a real sequence, so numbering/steppers are appropriate there).
- Don't add an eyebrow label above every section — use it sparingly, as the reference does.

---

## 7. Build Priority — MVP Flows First

Given the judging weight (UI 25% + UX 25% = 50% of the score), build these five flows to full polish before touching anything else:

1. **Landing page** (already art-directed — build to match the reference image closely, including the live-feeling stats bar and featured projects grid).
2. **Explore Projects → Project Detail** — with real filtering (Funding Type, Energy Type, Funding Status) that actually filters the mock dataset.
3. **Support/Invest flow** (see Section 10 for the mock-payment pattern) ending in a success state + digital certificate.
4. **Supporter → Impact Portfolio** — the signature differentiator feature. Make this visually the most rewarding screen in the app.
5. **One connected owner→admin→supporter loop**: Create Project (owner) → Verification queue (admin, Approve/Reject/Need Revision) → approved project appears live in Explore.

Everything else below (Trust Score, Renewable Energy Map, full Funding Analytics, Community Impact Journey, full Admin User Management) is the **secondary backlog** — build if time allows, and otherwise describe it in the submission document as roadmap, not vaporware in the UI (don't leave dead nav links to unbuilt pages — either build a lightweight version or don't link it yet).

---

## 8. Dashboard Specification by Role

A good dashboard follows one shape: **one hero metric, a KPI row, at most one chart, then an actionable list** — not a wall of charts. Apply this shape to all three dashboards, and keep the KPI card component visually identical across all three (Section 6) — only the data differs. That consistency is a coherence signal to judges that this is one product, not three bolted-together screens.

### Supporter Dashboard
1. **Impact snapshot (hero, top, largest element)** — GreenFund's signature differentiator: total clean energy generated (kWh/MWh) + total CO₂ reduced from this user's contributions.
2. **KPI row (4 cards)**: Total Contributions, Projects Supported, Active Investments, Communities Impacted.
3. **One chart only** — pick one: a donut split of portfolio by funding type (Impact / Green Investment / Hybrid), or a line chart of impact growth over time. Not both.
4. **Recent Activity feed** — e.g. "You funded Solar Power for Sukamaju School," "Wind Energy for Sumba Village posted a new update."
5. **"Recommended for you"** — 2–3 project cards based on categories the user has already supported, to encourage return visits.

### Project Owner Dashboard
1. **KPI row (4 cards)**: Active Projects, Total Funding Raised, Total Supporters, days-to-deadline for the nearest-deadline project.
2. **"Needs Your Attention" action list** — projects marked "Need Revision" by admin, or approaching deadline. Place this above the chart — it's actionable, not just informational.
3. **One chart only** — daily funding trend for the owner's featured/selected project.
4. **Recent supporter activity**.
5. **Prominent "Post an Update" button** — project transparency/updates are core to GreenFund's value proposition, so this action should be easy to find, not buried in a menu.

### Admin Dashboard
1. **Verification queue, front and center** — sorted oldest-first, with Approve / Reject / Need Revision actionable directly from the card, no need to open a separate page first.
2. **KPI row (4 cards)**: Pending Projects, Approved Projects, Total Platform Funding, Active Users.
3. **Global Impact snapshot** — Admin's unique hero metric: Total CO₂ Saved, Communities Served, Clean Energy Generated platform-wide.
4. **One chart only** — platform funding trend, stacked by Donations / Investments / Hybrid.

---

## 9. Feature Backlog by Role (full reference)

### Supporter (Donor / Investor)
- Dashboard: see Section 8
- Explore Projects with filters (Funding Type: Impact/Green Investment/Hybrid; Energy Type: Solar/Wind/Hydro/Biogas; Status: New/Trending/Near Completion)
- Project Detail: overview, funding progress, impact metrics (CO₂ reduction, energy generated, beneficiaries), timeline (Verification → Fundraising → Construction → Operational)
- Support flow: Impact Funding (choose amount → confirm donation), Green Investment (choose amount → ROI projection → confirm), Hybrid (split between both)
- My Portfolio: Donations, Investments, Saved Projects (wishlist)
- **Energy Impact Portfolio**: projects supported count, clean energy generated (kWh/MWh), CO₂ reduction, communities impacted, an overall impact score

### Project Owner (Community / School / SME / Organization)
- Dashboard: see Section 8
- Create Project: basic info (name, location, energy category), funding type selection, funding requirement (target, deadline, and if Investment: ROI/duration/risk level, if Hybrid: community%/capital% split), impact data (estimated energy, CO₂ reduction, beneficiaries), document upload (proposal, budget plan, supporting docs)
- Project status pipeline: Draft → Pending Review → Approved → Fundraising → Construction → Operational
- Funding Analytics: daily funding, supporter growth, funding source breakdown
- Project Updates: post photos, progress notes, fund usage, documentation

### Admin (GreenFund Team)
- Dashboard: see Section 8
- Project Verification: review proposal/budget/impact calc/documents → Approve / Reject / Need Revision
- User Management: supporters and project owners
- Funding Monitoring: total donations, investments, hybrid projects
- Impact Monitoring: global stats (total projects, total CO₂ saved, communities served, clean energy generated)

### Cross-cutting features (secondary priority)
- **Project Trust Score** (0–100, based on proposal completeness, verified identity, financial transparency, updates posted, environmental assessment)
- **Impact Prediction** shown before a user funds a project (e.g. "15,000 kWh/year · 12 tons CO₂ reduced/year · 250 households benefited")
- **Renewable Energy Map** — interactive map of Indonesia showing active/completed projects, energy type, funding status
- **Project Transparency page** — funds in, funds used, timeline, documentation
- **Community Impact Journey** — visual flow per contribution: Funding → Equipment Purchased → Installation → Operational → Generating Clean Energy

---

## 10. Mock Data & Simulated Transactions

Because this is a competition prototype, not a real financial product:

- **Never integrate a real payment gateway.** Build a mock flow instead: choose amount → choose method (VA / QRIS / Card — UI only) → 2-second loading state → success screen with a dummy transaction ID and a downloadable/viewable digital certificate.
- **Seed 6–8 realistic dummy projects** with varied progress (not all at 50%) — mix New, Trending, and Near Completion, across Solar/Wind/Biogas, spread across a few real Indonesian regions (the reference image already uses West Java, East Nusa Tenggara, Central Java, West Nusa Tenggara — keep that pattern), with placeholder/stock imagery.
- **Seed 3 demo accounts**, one per role (Supporter, Project Owner, Admin), with obvious credentials (e.g. `supporter@demo.com` / `owner@demo.com` / `admin@demo.com`, same password), documented on the login page itself. The Admin account only ever exists as a seeded record — never via `/signup` (Section 5).
- **State must actually update**: when a demo supporter funds a project, its progress bar, supporter count, and that supporter's portfolio should all reflect it — this is what makes the prototype feel alive rather than a static mockup.
- Add a **one-line disclaimer** in the submission document: *"GreenFund is a functional prototype built for research/competition purposes. All financial transactions are simulated and do not process real funds."* This shows judges you understand the line between prototype and a real regulated financial product.

---

## 11. Content & Copy Guidance

- Write from the end user's perspective, in plain language — a Supporter manages "Saved Projects," not a "wishlist collection object."
- Buttons say exactly what happens: "Fund This Project," not "Submit." A flow that starts with "Support Project" should end with a success message using the same verb ("Your support was received," not "Transaction complete").
- Empty states are an invitation, not a dead end — e.g. an empty Portfolio should say something like "You haven't supported a project yet" with a CTA into Explore, not a blank card.
- Keep the numbers real and specific in impact copy ("1.8 Tons CO₂ Reduced," "4 Villages Impacted") rather than vague claims.

---

## 12. How This Maps to Judging Criteria

| Criteria | Weight | What to prioritize |
|---|---|---|
| Kesesuaian Tema & Orisinalitas | 25% | Lead with the Energy Impact Portfolio differentiator in the pitch/demo — this is the concept's strongest originality claim. |
| User Interface (UI) | 25% | Follow the approved design system in Section 6 exactly; consistency across all built screens (especially the three dashboards, Section 8) matters more than volume of screens. |
| User Experience (UX) | 25% | The 5 MVP flows in Section 7 must have zero dead links, clear navigation, and obvious next steps at every screen. |
| Fungsionalitas & Solusi | 15% | The connected owner→admin→supporter loop (Section 7, item 5) is the single best demonstration of real functionality. |
| Presentasi Karya | 10% | Prepare the demo-account shortcuts (Section 4) so the live demo is fast and glitch-free in front of judges. |

---

## 13. Submission Checklist (per competition rules)

- [ ] One link to the deployed prototype/website
- [ ] Short concept document covering: concept, problem, solution, key features, tech stack/framework used
- [ ] Built with HTML/CSS/JS (+ any framework) — no CMS/website builder
- [ ] Responsive, clear navigation, UI/UX principles applied
- [ ] No SARA/discrimination/pornography/hate speech content
- [ ] Confirm all digital assets used (stock photos, icons) don't infringe copyright
- [ ] Original work, not a duplicate of a previously awarded submission