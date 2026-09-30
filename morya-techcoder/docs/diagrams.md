# Architecture & App Flow Diagrams

Visual companion to [architecture.md](./architecture.md). All diagrams are
[Mermaid](https://mermaid.js.org/) and render natively on GitHub and in the
VS Code Markdown preview (with a Mermaid extension).

---

## 1. System architecture

Everything runs inside one Next.js app. There is no database — content is
files in Git. The only server-side runtime call to another service is the newsletter
(Resend). In the browser, Vercel Analytics, tweets, and video/code embeds
load third-party resources.

```mermaid
flowchart LR
    subgraph Browser["Browser"]
        UI["Static HTML + Client islands<br/>(ThemeToggle, BlogList search,<br/>NewsletterBox, TOC, Carousel)"]
        VA["Vercel Analytics<br/>Analytics component"]
    end

    subgraph Next["Next.js 16 App (App Router)"]
        direction TB
        subgraph Site["app/(site)/ — public site"]
            Home["/"]
            Blog["/blog"]
            Article["/blog/[slug]"]
            Cat["/blog/category/[category]<br/>/topics/[category]"]
            Static["/about /contact<br/>/privacy /terms"]
        end
        subgraph Meta["Metadata routes"]
            Sitemap["sitemap.ts"]
            Robots["robots.ts"]
            OG["/og · /og/blog/[slug]<br/>generated share PNGs"]
            NF["not-found.tsx<br/>404"]
        end
        subgraph API["app/api/"]
            NewsAPI["POST /api/newsletter"]
            KsAPI["/api/keystatic/*<br/>(dev only)"]
        end
        KsUI["/keystatic<br/>Admin editor (dev only)"]

        subgraph Content["content/ — data layer"]
            Loader["loader.ts<br/>posts + frontmatter"]
            Compile["compile.ts<br/>MDX → React"]
            MdxMap["mdx-components.tsx"]
        end
        subgraph Lib["lib/ — business logic"]
            Posts["posts.ts"]
            Cats["categories.ts"]
            Author["author.ts"]
            Newsletter["newsletter.ts"]
            SiteCfg["site.ts<br/>SITE_URL"]
            Flags["featureFlags.ts"]
            KsFlag["keystatic.ts"]
        end
        Comps["components/<br/>layout · sections · ui · mdx · reading"]
    end

    subgraph FS["Git repository (filesystem)"]
        MDX[("content/posts/*.mdx")]
        Authors[("content/authors/*.json")]
        Images[("public/content/blog/:slug/*")]
    end

    Resend[["Resend API<br/>contacts + emails"]]

    UI -- "page requests" --> Site
    UI -- "fetch JSON" --> NewsAPI
    VA -. "page views" .-> Vercel[["Vercel Analytics"]]

    Site --> Comps
    Site --> Loader
    Article --> Compile
    Compile --> MdxMap --> Comps
    Site --> Posts & Cats & Flags
    Loader --> Author
    Loader --> MDX
    Author --> Authors
    Sitemap --> Loader
    OG --> Loader

    NewsAPI --> Newsletter --> Resend

    KsUI --> KsAPI
    KsAPI -- "read / write" --> MDX & Authors & Images
    KsFlag -. "gates" .-> KsUI & KsAPI
```

---

## 2. Build-time content pipeline

Content is read once on the server and baked into static HTML. It is never
fetched from the browser.

```mermaid
flowchart TD
    A[("content/posts/**/*.mdx")] --> B["loader.ts<br/>findPostFiles()"]
    B --> C["gray-matter<br/>parse frontmatter + body"]
    C --> D["Normalize<br/>slug · ISO date · SEO · review<br/>assets · reading time"]
    D --> E["getAuthor(slug)<br/>content/authors/*.json<br/>(fallback: default author)"]
    E --> F{"draft: true<br/>and NODE_ENV = production?"}
    F -- yes --> X["Excluded"]
    F -- no --> G["blogPosts: PostDetail[]<br/>cached for process lifetime"]

    G --> H["postSummaries<br/>(body stripped)"]
    H --> I["Home · /blog · category routes<br/>(cards, filters, search index)"]
    G --> S["sitemap.ts"]
    G --> OGR["/og/blog/[slug]<br/>ImageResponse → PNG"]
    OGR --> M

    G --> J["/blog/[slug]<br/>generateStaticParams()"]
    J --> K["compile.ts → compileMDX"]
    K --> K1["remark-gfm"]
    K --> K2["rehype-pretty-code<br/>(Shiki highlighting)"]
    K --> K3["rehypeImageSize"]
    K1 & K2 & K3 --> L["mdx-components.tsx<br/>→ components/mdx/*"]
    L --> M["Static HTML (SSG)"]
    I --> M
```

---

## 3. Reader navigation flow

```mermaid
flowchart LR
    Entry(["Visitor<br/>(search / social / direct)"]) --> Home

    Home["Home /<br/>Hero · TopicGrid · Featured<br/>Carousel · Capabilities · CTA"]
    Blog["Blog index /blog<br/>search + category filter"]
    Topic["Category page<br/>/blog/category/[c] · /topics/[c]"]
    Article["Article /blog/[slug]<br/>TOC · reading progress · share"]
    Info["About · Contact<br/>Privacy · Terms"]
    NL{{"Newsletter form"}}

    Home --> Blog
    Home --> Topic
    Home --> Article
    Blog --> Article
    Blog --> Topic
    Topic --> Article
    Article -- "prev / next<br/>related posts" --> Article
    Article -- "category badge" --> Topic
    Article --> NL
    Home --> NL
    Home & Blog & Article -. "Navbar / Footer" .-> Info
```

---

## 4. Newsletter subscription sequence

```mermaid
sequenceDiagram
    autonumber
    actor U as Reader
    participant NB as NewsletterBox (client)
    participant API as POST /api/newsletter
    participant L as lib/newsletter.ts
    participant R as Resend API

    U->>NB: Enter email, submit
    NB->>API: fetch { email }
    API->>API: Parse JSON, check type
    alt bad body
        API-->>NB: 400 { status: "invalid" }
    end
    API->>L: subscribeToNewsletter(email)
    L->>L: normalizeEmail()
    alt invalid email / missing RESEND_API_KEY
        L-->>API: invalid / error
    else
        L->>R: GET /contacts/{email}
        alt 200 exists
            R-->>L: found
            L-->>API: { status: "duplicate" }
        else 404 new
            L->>R: POST /contacts (or /audiences/{id}/contacts)
            R-->>L: created
            L->>R: POST /emails (welcome email)
            Note over L,R: Skipped if RESEND_FROM_EMAIL is unset.<br/>A failed send is logged; still "subscribed".
            L-->>API: { status: "subscribed" }
        else other error
            L-->>API: { status: "error" }
        end
    end
    API-->>NB: 200 / 400 / 502 + status
    NB-->>U: Success / already subscribed / error message
```

---

## 5. Authoring & publishing flow

```mermaid
flowchart LR
    A["Author runs<br/>npm run dev"] --> B["/keystatic editor<br/>(local storage)"]
    A2["Or edit .mdx<br/>by hand"] --> C
    B -- "writes files" --> C[("content/posts/*.mdx<br/>content/authors/*.json<br/>public/content/blog/:slug/")]
    C --> D["Preview at localhost<br/>(drafts visible)"]
    D --> E["git commit + push<br/>→ PR → main"]
    E --> CI["GitHub Actions CI<br/>lint · typecheck · build"]
    E --> F["Host rebuilds on merge to main<br/>(e.g. Vercel Git integration)<br/>next build · drafts filtered · SSG"]
    F --> G["Deploy<br/>(Keystatic routes 404<br/>unless ENABLE_KEYSTATIC)"]
    G --> H(["techcoder.tech"])
```
