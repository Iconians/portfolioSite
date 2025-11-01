<!-- 30f5565c-cfb3-4d0f-b3d4-fe72920e11a7 2f7e15ba-3a52-4b52-8f32-f2b66a33ebdd -->
# Integrate Modern Portfolio Design

## Overview

Merge `/Users/claytoncripe/Desktop/portfolio-site` into the current Next.js portfolio (`/Users/claytoncripe/Desktop/Personal projects/portfolioSite`), adopting the modern design system while preserving existing functionality.

## Current State Analysis

### Existing Portfolio (portfolioSite)

- **Stack**: Next.js 15, Framer Motion, CSS Modules
- **Features**: Photo carousel, catchphrase hero, joke/advice API, portfolio grid, reviews, blog with MDX
- **Styling**: CSS Modules, custom color variables, manual responsive design

### New Portfolio (portfolio-site)

- **Stack**: Next.js 14, Tailwind CSS 4, shadcn/ui, Radix UI
- **Features**: Terminal loader hero, personality cards (static jokes/advice), modern navigation, projects grid, articles, videos, testimonials
- **Styling**: Tailwind with design tokens, shadcn/ui components, dark theme

## Integration Strategy

### Phase 1: Setup & Dependencies

**Add new dependencies without breaking existing**

1. Install Tailwind CSS 4 and shadcn/ui
2. Add Radix UI components
3. Install supporting libraries (class-variance-authority, tailwind-merge, lucide-react)
4. Configure Tailwind alongside existing CSS Modules

### Phase 2: Design System Migration

**Adopt new visual language**

1. Copy shadcn/ui components to `/src/app/Components/ui/`
2. Migrate color palette from CSS variables to Tailwind theme
3. Replace CSS Module styles with Tailwind utilities (gradual)
4. Keep Framer Motion animations

### Phase 3: Component Replacements

#### Hero Section

- **Replace**: Photo carousel + catchphrase
- **With**: Terminal loader + bio text from new hero
- **Keep**: Framer Motion animations

#### Navigation

- **Replace**: Current nav
- **With**: Sticky nav with intersection observer
- **Keep**: Links to blogs, about

#### Joke/Advice Section

- **Upgrade**: Current API-based JokeAdviceComponent
- **Adopt**: Card design from PersonalityCards
- **Keep**: API fetching logic, refresh button
- **Add**: Icons (Smile, Lightbulb from lucide-react)

#### Portfolio/Projects

- **Merge**: Current PortfolioSection + new Projects
- **Use**: shadcn Card component
- **Keep**: Existing portfolio items + modal
- **Add**: Tags/badges, GitHub/demo buttons

#### Reviews/Testimonials

- **Replace**: Current ReviewComponent carousel
- **With**: New Testimonials component
- **Keep**: Review data
- **Simplify**: Remove complex carousel, use grid layout

#### Blog

- **Keep**: Existing blog structure, MDX rendering
- **Update**: Styling with Tailwind
- **Replace**: BlogCard CSS with shadcn Card

### Phase 4: Layout & Pages

#### Homepage (`src/app/page.tsx`)

```tsx
<Hero /> {/* Terminal loader + bio */}
<Navigation /> {/* Sticky nav */}
<JokeAdviceCards /> {/* API-driven personality cards */}
<Projects /> {/* Portfolio items */}
<Articles /> {/* Blog previews */}
<Testimonials /> {/* Client reviews */}
<Footer />
```

#### About Page

- Keep existing content
- Apply new styling

#### Blog Pages

- Keep MDX rendering
- Update layout with Tailwind

## File-by-File Plan

### Files to Copy (from portfolio-site)

```
components/ui/* → src/app/Components/ui/*
components/hero.tsx → src/app/Components/Hero/Hero.tsx
components/navigation.tsx → src/app/Components/Nav/Navigation.tsx
components/terminal-loader.tsx → src/app/Components/TerminalLoader/TerminalLoader.tsx
components/footer.tsx → src/app/Components/Footer/Footer.tsx
components/testimonials.tsx → src/app/Components/Testimonials/Testimonials.tsx
lib/utils.ts → src/app/lib/utils.ts
components.json → root
```

### Files to Update

**`src/app/globals.css`**

- Keep existing CSS variables for backward compatibility
- Add Tailwind imports
- Merge theme tokens

**`src/app/Components/Joke&AdviceComponent/JokeAdviceComponent.tsx`**

- Replace styling with shadcn Card
- Add lucide-react icons
- Keep API fetch logic
- Update to match PersonalityCards grid layout

**`src/app/Components/PortfolioSection/PortfolioSection.tsx`**

- Replace CSS with shadcn Card
- Add Badge components for tags
- Add GitHub/demo buttons
- Keep modal functionality

**`src/app/Components/ReviewComponet/ReviewComponent.tsx`**

- Simplify to grid layout
- Remove carousel complexity
- Use shadcn Card
- Keep review data

**`src/app/page.tsx`**

- Import new Hero
- Import new Navigation
- Update JokeAdviceComponent import
- Reorder sections

### Files to Delete (after migration)

```
src/app/Components/PhotoCarousel/* (replaced by Terminal)
src/app/Components/CatchPhrase/* (integrated into Hero)
src/app/Components/ClientWrapper/* (not needed)
```

## Configuration Updates

### `package.json`

Add dependencies:

```json
{
  "dependencies": {
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwindcss": "^4.1.9",
    "lucide-react": "^0.454.0",
    "tailwind-merge": "^2.5.5",
    "next-themes": "^0.4.6"
  }
}
```

### `tailwind.config.ts`

Create Tailwind config with theme tokens

### `postcss.config.mjs`

Update for Tailwind 4

## Key Design Decisions

1. **Keep Framer Motion**: Existing animations are good; Tailwind doesn't replace them
2. **Gradual CSS Module→Tailwind**: Both can coexist during transition
3. **API over static**: Keep dynamic joke/advice fetching
4. **Simplify reviews**: Grid > carousel for mobile
5. **shadcn/ui base**: Use as foundation, customize as needed

## Testing Checklist

- [ ] All pages render without errors
- [ ] Jokes/advice fetch and refresh
- [ ] Portfolio modal opens/closes
- [ ] Blog pages render MDX correctly
- [ ] Navigation scrolls smoothly
- [ ] Dark mode works (new feature)
- [ ] Mobile responsive (320px–1920px)
- [ ] Animations perform well

## Timeline Estimate

- Phase 1 (Setup): 1–2 hours
- Phase 2 (Design System): 2–3 hours
- Phase 3 (Components): 4–6 hours
- Phase 4 (Pages): 1–2 hours
- Testing/Polish: 2–3 hours

**Total**: 10–16 hours

### To-dos

- [ ] Install Tailwind CSS 4, shadcn/ui, Radix UI components, and supporting libraries
- [ ] Copy shadcn/ui components from portfolio-site to src/app/Components/ui/
- [ ] Configure Tailwind CSS 4 and postcss, create tailwind.config.ts with design tokens
- [ ] Update globals.css to include Tailwind imports while keeping existing CSS variables
- [ ] Copy and adapt Hero.tsx and TerminalLoader.tsx components
- [ ] Copy and adapt Navigation.tsx with sticky behavior and intersection observer
- [ ] Redesign JokeAdviceComponent with shadcn Card, lucide icons, keeping API fetch logic
- [ ] Update PortfolioSection with shadcn Card, badges, and GitHub/demo buttons
- [ ] Replace carousel ReviewComponent with grid-based Testimonials layout
- [ ] Restructure homepage with new Hero, Navigation, and component order
- [ ] Apply Tailwind styling to blog pages and BlogCard component
- [ ] Test all pages and components across mobile, tablet, and desktop viewports