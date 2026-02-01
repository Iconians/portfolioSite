# Portfolio

Welcome to my personal portfolio site — a hub for my freelance work, client reviews, and technical articles.  
This site began as a simple HTML/CSS/JavaScript build, evolved into a React + TypeScript app, and is now rebuilt with Next.js 15 for modern performance, SEO, and scalability.

It’s not just a showcase — it’s my testing ground for design systems, motion-based UI, and full-stack experiments.

---

## For Recruiters

### What You'll Find

- **Freelance projects** – real-world work solving client needs since 2022  
- **Client reviews** – feedback pulled directly from my Upwork profile  
- **Technical articles** – based on both client experience and deep research/practice projects  
- **Motion-rich design** – nearly every component is animated, from headings and sections to lists, code blocks, and blog cards  

### Why Next.js?

- Fast performance and improved SEO with server-side rendering  
- Scalable routing for quickly adding new projects, articles, and sections  
- Polished user experience with consistent animations across the site  
- Modern toolchain built to grow as my work expands  

### Live Site

Visit my portfolio here: [Portfolio Site](https://www.clytoncripe.com)

---

## For Developers

### Tech Stack

- **Framework:** Next.js 15 with App Router  
- **Language:** TypeScript (since the original React build)  
- **Styling:** CSS Modules + Tailwind CSS  
- **Animations:** Framer Motion (`AnimatedParagraph`, `AnimatedList`, `AnimatedCode`, `AnimatedSection`, `AnimatedHeading`, etc.)  
- **Backend:** PostgreSQL with Prisma ORM
- **Authentication:** Auth.js (NextAuth v5) with custom authorization
- **Package Manager:** Bun
- **Deployment:** Vercel  

### Skills / Technologies

- **Frontend:** HTML, CSS, JavaScript, TypeScript, React, React Router, Next.js, Vue, Tailwind, Styled Components  
- **Backend:** Node.js, Express, Go, Python, PostgreSQL, SQLC, Prisma ORM  
- **Testing / Dev Tools:** Bun test runner, Bash, GitHub, GitLab, Trello, Zod, Linux  
- **Other:** Auth.js, WordPress, Unbounce  

### Project Goals

- Showcase freelance work, reviews, and blog posts in one hub  
- Explore motion-first design, where animation enhances every interaction  
- Provide a scalable codebase for future full-stack features  

### Project Timeline

- **Late 2021:** Started full-stack program at Devslopes Academy  
- **2022:** Began freelancing while studying. Built the first portfolio in HTML, CSS, and JavaScript  
- **2022–2023:** Took on freelance projects, added client reviews from Upwork, and built practice/research projects to explore new technologies  
- **2023:** Rebuilt the portfolio as a React + TypeScript app while continuing freelance work  
- **2024:** Graduated from Devslopes Academy. Wrote in-depth technical articles based on both freelance work and research projects  
- **2025:** Migrated from Vite/React to Next.js 15 with App Router, refining performance, design, and content  

### Running Locally

**Prerequisites:**
- Bun installed
- PostgreSQL database running
- Environment variables configured (see `.env.example`)

**Setup:**
```bash
git clone https://github.com/Iconians/portfolioSite.git
cd portfolioSite
bun install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL, AUTH_SECRET, etc.

# Generate Prisma client
bun run db:generate

# Run database migrations
bun run db:migrate

# Migrate existing content to database
bun run migrate:content

# Start development server
bun run dev
```

Then open http://localhost:3000 in your browser.

Build for Production
bash
Copy code
bun run build
bun start
```

### Deployment (Vercel)

- In **Vercel → Project → Settings → Environment Variables**, set `DATABASE_URL` (and `AUTH_SECRET` if using auth) for Production (and Preview if needed).
- If you see “Application error: a server-side exception has occurred” with a **digest** (e.g. `244468507`): open **Vercel → Project → Logs** (or **Deployments → [deployment] → Functions**), filter by time, and search or scan for that digest or for `[App Error]` / `[Global Error]` to see the real error in the server logs.

Recent Updates
✅ Migrated from Vite/React to Next.js 15

✅ Refined App Router setup for dynamic routing

✅ Strengthened TypeScript typing throughout

✅ Added Framer Motion animations across the site (containers, headings, paragraphs, lists, code blocks, blog articles)

✅ Rebuilt About Me and blog content for stronger storytelling

✅ Published technical articles drawn from real freelance and research projects

🔄 Continuing UX and performance improvements

Planned Features
🗂 Expand portfolio with more freelance projects

🤖 AI-powered portfolio assistant to recommend projects and summarize blog posts (planned once API usage costs are feasible)

🎥 Video content & feed to showcase projects and tutorials directly on the site
