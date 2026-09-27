# Shivam Patel — Software Engineering Portfolio

Personal portfolio built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4**.

## Features

- **Animated hero** — typewriter role rotation, animated counters, gradient blobs, and a tech-stack marquee
- **Experience timeline** — alternating, expandable timeline with roles and dates
- **Interactive system design visualizer** — three architectures (DAG orchestration, streaming, webhook delivery) with animated request flow and clickable components
- **Project archive** — search by technology, filter by domain, sort, and per-project case studies with prev/next navigation
- **Command palette** — `⌘K` / `Ctrl K` to jump to any page, project, or action
- **Portfolio assistant** — chat widget that answers from the site's own data (experience, projects, skills, contact)
- **Engineering notes** — write-ups tied back to the projects where each concept was applied
- **Contact form** — validated form backed by Resend
- Persistent light/dark theme, scroll progress bar, back-to-top, `prefers-reduced-motion` support
- SEO: per-page metadata, Open Graph, JSON-LD `Person` schema, `sitemap.xml`, and `robots.txt`

## Editing content

All content lives in `src/data/` — update these files and every section, the assistant, and the command palette pick up the change:

| File | Content |
| --- | --- |
| `profile.ts` | Name, headline, summary, availability, links |
| `experience.ts` | Internships (role, company, dates, highlights) |
| `projects.ts` | Project case studies and homepage featured list |
| `skills.ts` | Skill groups, competencies, marquee |
| `education.ts` | Degree, CGPA, coursework |
| `achievements.ts` | Achievements, credentials, leadership |
| `certificates.ts` | Certificate list (PDFs in `public/certificates/`) |
| `notes.ts` | Engineering notes |

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

### Environment variables (contact form)

```
RESEND_API_KEY=...
CONTACT_RECEIVER_EMAIL=...
```
