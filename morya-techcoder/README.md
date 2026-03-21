This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Layout 
morya-techcoder/
├── app/
│   ├── globals.css          ← TechCoder design system (tokens, typography, prose styles)
│   ├── layout.tsx           ← Root layout with Montserrat + Inter fonts, Navbar, Footer
│   ├── page.tsx             ← Home page (Hero + category sections + newsletter)
│   ├── blog/
│   │   ├── page.tsx         ← Blog list with search + category filtering
│   │   └── [slug]/page.tsx  ← Blog detail with markdown renderer + related posts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       ← Translucent blur-on-scroll, mobile hamburger menu
│   │   └── Footer.tsx       ← Brand, nav links, social icons
│   ├── sections/
│   │   ├── HeroSection.tsx  ← Animated hero with staggered Framer Motion reveals
│   │   ├── HomeContent.tsx  ← Category-grouped post grids
│   │   └── BlogListContent.tsx ← Search bar + category pills + filtered grid
│   └── ui/
│       ├── BlogCard.tsx     ← Card with hover lift, category badge, reading time
│       └── NewsletterBox.tsx ← Golden gradient CTA with email form
├── content/
│   └── blogs.ts             ← 6 sample posts (2 AI, 2 WebDev, 2 Tricks) with full bodies
├── lib/
│   └── utils.ts             ← cn(), formatDate(), calcReadingTime()
