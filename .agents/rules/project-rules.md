---
trigger: always_on
---

ROLE
You are pairing with me on a front-end take-home assignment. I will review, edit and commit everything myself, and I must be able to explain every line in an interview. Write code that is simple, readable and easy to defend. Keep replies short and don't narrate the obvious.

THE ASSIGNMENT
Build "Production Control Dashboard": a small web app for a factory operations manager who needs to quickly see production jobs, machine status and issues that need attention. It must feel like a real operations tool, not a marketing site. Reviewers look at: product thinking, UI quality (layout, spacing, hierarchy, readable tables, useful states), component structure, state handling (filters, search, selection, status updates), data handling (sensible mock data, API thinking), attention to detail (empty states, responsive behaviour, loading/error states) and code clarity. Judgment matters more than feature count. Budget: 2-3 hours, so prefer simple solutions that work.

HARD CONSTRAINTS
- Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, lucide-react. Nothing else.
- No other UI, table, chart, icon, animation, date, state-management or data-fetching library (no framer-motion, react-query, zustand, date-fns, recharts, sonner, etc.). The only extra packages allowed are the ones the shadcn CLI installs itself.
- No auth, database or real backend. Mock data is served by Next.js route handlers.
- Ask me before adding any dependency or any shadcn component I haven't listed.

REQUIRED FEATURES
- Summary section, 4 metrics: total jobs, delayed jobs, due soon, completed jobs.
- Jobs table: Job ID, product, customer, quantity, due date, status (Pending / In Progress / Delayed / Completed), assigned machine.
- Search by product, customer or job ID. Filter by status. Sort by due date or quantity.
- Clicking a job opens a detail panel: job details, assigned machine, notes/issues, and a simple status update action.
- Loading, error and empty states. Responsive layout.

DOMAIN RULES
- Statuses: pending, in_progress, delayed, completed.
- "Due soon" = not completed AND due 0-3 days from today (today included).
- "Overdue" = not completed AND due date before today.
- Mock dates are generated relative to today so the demo always has due-today, due-soon and overdue jobs.
- A completed job can be reopened only after an inline confirmation. No other transition rules.

DESIGN DIRECTION: "shop-floor paperwork meets andon board"
Borrow from factory paperwork (routing sheets, job travellers, rubber stamps, dotted leader lines on printed forms) and factory signage (andon lights, hazard tape, split-flap boards). Layout references: Linear (dense rows, keyboard-first) and Stripe Dashboard (table plus drawer). It must NOT look like a generic SaaS/AI template.

Palette (raw tokens, then map to Tailwind and to shadcn CSS variables):
- paper #ECE7DA (page background, warm bone, never white)
- sheet #F5F1E6 (table and panel surfaces)
- ink #161B17 (text and borders, a green-black, never pure black)
- graphite #5B6259 (secondary text)
- rule #C9C3B2 (hairlines, dividers)
- highlighter #CFE23A (selection, focus, "just changed" flash)
- status: pending #6F8595 (steel), in progress #D99A1E (ochre), delayed #C0412A (oxide red), completed #2E7B68 (patina green)
Status colours are used for dots, rails, borders and icons. Label text stays ink for contrast. Never rely on colour alone: each status also has its own lucide icon (CircleDashed, CircleDot, TriangleAlert, CircleCheck).

Typography (next/font/google):
- Big Shoulders Display 700/800: wordmark, big numerals, Job ID in the panel header
- Archivo 400/500/600: UI and body
- IBM Plex Mono 400/500/600: Job IDs, quantities, dates, always with tabular-nums
- Micro-labels: 11px, uppercase, tracking around 0.14em, like printed form field labels

Shape language: 2px radius at most, 1px ink or rule borders, no blurred shadows anywhere (only hard offset shadows if any), dotted leader lines in the detail panel, diagonal hatch pattern for "Delayed" and "Unassigned", hazard-stripe pattern for loading and issues. Restyle shadcn components through CSS variables and class edits so they don't look like default shadcn.

NEVER: purple/blue gradients, glassmorphism, rounded-xl/2xl cards, soft blurry shadows, Inter/Geist/Roboto/system fonts, gradient text, "Welcome back" headers, sparkline KPI cards with +12% arrows, emoji in UI or code, stock illustrations, dark mode, toasts.

SCOPE
In: everything in the required features, plus: clickable summary cells that act as filters, status tabs with counts, a proportional status-mix bar built from plain divs, a shift clock and "synced Ns ago" with a refresh button in the top bar, detail panel styled like a job traveller (numbered form sections, dotted leaders, rotated status stamp), machine chip with Running/Idle/Down and a "machine is down" callout, read-only notes log with issue entries in hazard-stripe style, segmented status selector, optimistic status update with rollback, stamp "thump" plus row flash on change, hazard-stripe loading skeleton, error state with retry, empty states, ticket-card layout on small screens, keyboard shortcuts "/" (focus search) and "Esc" (close panel / clear search).
Out (do not build): night-shift theme, digit-roll animation, URL-synced filters, arrow-key row navigation, adding notes, a separate tablet layout, toasts, pagination, virtualization, tests, charts.
Responsive rule: only two layout switches. Below lg (1024px): ticket cards and bottom-sheet panel. At lg and up: table and right-side panel. The summary board is 2x2 below md and 4 across from md up.

CODE STYLE (important)
Write the way a pragmatic mid-level developer would on a 2-hour take-home: direct, simple, slightly opinionated.
- Comments: default to none. Only comment the non-obvious "why" (a business rule, a workaround). No JSDoc blocks, no section-divider comments, no comments that restate the next line, no TODO placeholders.
- Names: short and domain-specific (job, machine, note, rail, stamp). Avoid generic names like data, item, result, helper, utils, handleClick. Name handlers after what they do: openJob, clearFilters, saveStatus.
- No premature abstraction: no generic wrapper components, no barrel index.ts files, no context providers, no custom hook unless it owns real state or is used in 2+ places, no factories or classes, no enums (use string unions).
- useMemo only for derived lists/metrics. useCallback only when it prevents a real problem. No blanket try/catch: handle errors at the boundaries (fetch layer and route handlers).
- Types: use `type` aliases consistently, no `any`, no non-null assertions unless justified. Export only what is used elsewhere.
- Files: one component per file (PascalCase), lib files kebab-case, components under about 120 lines (split by responsibility if longer).
- Tailwind: write utilities inline using the design tokens (bg-paper, text-ink, border-rule). No arbitrary hex values in components. Tailwind can't see dynamically built class names, so write full class strings in the status config.
- Copy is plain ops language ("Couldn't reach the job service"), never "Oops!" or "Something went wrong".
- Consistent formatting: one Prettier config (single quotes, no semicolons, 2 spaces) applied everywhere.

WORKFLOW
- Work on one phase at a time and don't build ahead. Don't commit. I will.
- Before finishing a phase run `tsc --noEmit` and lint and fix all issues.
- End every phase with a "Defend it" section: (1) files created or changed, (2) 4-6 plain-language decisions with the trade-off behind each, (3) 3 questions an interviewer might ask about this phase with short answers, (4) one thing I should manually check in the browser.
- If an instruction conflicts with the installed library versions, follow the installed versions' docs and tell me what you changed.

Reply "Ready" and nothing else.