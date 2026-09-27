# International Squishy Product Showcase + WhatsApp Inquiry Website
## Phase 1 — Pure Frontend / GitHub Pages Deployment / English Website

> Project objective: build a lightweight international product showcase website for squishy toys, stress-relief toys, and related products.  
> No online payment, no shopping cart, no customer account, no backend database in Phase 1.  
> Primary conversion: **Product discovery → Product detail → WhatsApp inquiry**.

---

# 1. Project Positioning

## 1.1 Website type

This is **not an e-commerce checkout website**. It is a:

**Product Showcase + WhatsApp Inquiry Website**

The website should feel closer to a premium toy/lifestyle brand website with wholesale/OEM capability than a traditional online store.

### Primary business goals

1. Show products clearly and attractively.
2. Help visitors quickly understand product features, materials, sizes and use cases.
3. Support Google/organic search through individual product pages.
4. Turn product interest into WhatsApp conversations.
5. Validate overseas traffic and inquiry conversion before investing in backend infrastructure.

### Explicitly out of scope for Phase 1

- Online payment
- Cart
- Checkout
- Customer registration/login
- Order management
- Inventory management
- Backend database
- Admin dashboard
- CRM
- Online quotation workflow

---

# 2. Target Audience

## 2.1 Primary audiences

### B2C / Gift Buyers
- People looking for cute squishy toys
- Stress-relief / desk-toy shoppers
- Gift buyers
- Collectors
- Parents looking for novelty toys

### B2B / Wholesale Buyers
- Toy stores
- Gift shops
- Retailers
- Distributors
- Online sellers
- TikTok Shop / Amazon / Etsy sellers
- Importers

### OEM / ODM Buyers
- Brands looking for custom squishy products
- Character/IP owners
- Promotional gift companies
- Private-label sellers

---

# 3. Brand Direction

## 3.1 Visual keywords

**Cute · Playful · Clean · Soft · Premium · Modern · International**

Avoid:
- Cheap marketplace style
- Excessive gradients
- Heavy enterprise/B2B visual language
- Too many banners
- Dense tables on the homepage
- Red “BUY NOW” ecommerce patterns

The visual language should communicate:

> Cute enough for consumers, professional enough for wholesale buyers.

---

# 4. Design System

## 4.1 Color palette

Recommended starting palette:

| Role | Color |
|---|---|
| Page background | `#FAFAF7` |
| Surface/card | `#FFFFFF` |
| Primary text | `#1F2328` |
| Secondary text | `#686D73` |
| Primary accent | `#FF7A70` |
| Secondary accent | `#FFD9D4` |
| Soft green accent | `#DDEFE4` |
| Border | `#E8E8E5` |
| WhatsApp | `#25D366` |

The exact brand accent can be changed later without restructuring components.

## 4.2 Typography

Recommended:

- Primary: Inter
- Optional display font: Poppins

Use a maximum of two font families.

### Suggested scale

| Element | Desktop | Mobile |
|---|---:|---:|
| Hero H1 | 56–68 px | 38–44 px |
| Section H2 | 36–44 px | 28–32 px |
| Product title | 20–24 px | 18–22 px |
| Body | 16–18 px | 15–16 px |
| Small/meta | 13–14 px | 12–13 px |

## 4.3 Layout principles

- Desktop max-width: 1200–1280 px
- Main content centered
- Generous whitespace
- 12-column desktop grid
- 4–5 product cards per row on large screens
- 2 columns on tablet
- 2 columns on most mobile product grids
- Border radius: 16–24 px
- Buttons: medium/large size, clearly tappable
- Product photography should dominate cards

---

# 5. Global Navigation

## Desktop header

```text
┌───────────────────────────────────────────────────────────────┐
│ LOGO     Products   Wholesale   OEM / ODM   About   Contact  │
│                                             [WhatsApp]       │
└───────────────────────────────────────────────────────────────┘
```

### Header behavior

- Sticky after scroll
- White or slightly translucent surface
- Subtle bottom border
- Keep header visually lightweight
- WhatsApp CTA can be a compact pill button

## Mobile header

```text
┌──────────────────────────────────┐
│ LOGO                    ☰       │
└──────────────────────────────────┘
```

Mobile menu:

```text
Products
Wholesale
OEM / ODM
About
Contact

───────────────
Chat on WhatsApp
```

---

# 6. Sitemap

```text
/
├── /products/
│
├── /products/[slug]/
│
├── /wholesale/
│
├── /oem/
│
├── /about/
│
├── /faq/
│
├── /contact/
│
├── /privacy/
│
└── /terms/
```

Phase 1 should remain English-only.

Recommended future structure:

```text
/en/
```

or separate localized static routes after validating the English site.

Do not add multiple languages until the English funnel proves useful.

---

# 7. Homepage Design

## 7.1 Hero section

### Goal

Within 5 seconds, communicate:

- What the company/product is
- What makes the product attractive
- That wholesale/OEM is available
- Where to click next

### Suggested copy

**Headline**

> Cute Squishy Toys Made to Make You Smile

**Subheadline**

> Discover soft, slow-rising squishy toys and stress-relief products for retail, gifting, and custom projects.

Primary CTA:

> Explore Products

Secondary CTA:

> Chat on WhatsApp

### Hero layout

```text
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Cute Squishy Toys                                                 │
│  Made to Make You Smile                  ┌─────────────────────┐    │
│                                         │                     │    │
│  Soft, slow-rising toys for gifting,   │  Product lifestyle  │    │
│  retail and stress relief.              │       image         │    │
│                                         │                     │    │
│  [Explore Products] [Chat on WhatsApp] └─────────────────────┘    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Hero image

Use one high-quality lifestyle/product image rather than a collage of ten small product photos.

Preferred visual:
- Hand holding/squeezing product
- Multiple cute products on a clean tabletop
- Soft natural lighting
- Light background
- Product texture clearly visible

---

# 8. Homepage Section Order

Recommended order:

```text
1. Hero
2. Featured Categories
3. Best / New Products
4. Why Squishy
5. Wholesale / OEM CTA
6. Product-in-use lifestyle section
7. Company capability / trust section
8. FAQ preview
9. Final WhatsApp CTA
10. Footer
```

---

# 9. Featured Categories

Recommended first version:

1. Animal Squishy
2. Food & Dessert
3. Cute Characters
4. Stress Relief
5. New Arrivals
6. Custom / OEM

### Card design

```text
┌───────────────────────┐
│                       │
│     Category Image    │
│                       │
│ Animal Squishy        │
│ Cute slow-rising toys │
│                       │
│ Explore →             │
└───────────────────────┘
```

Keep category copy very short.

---

# 10. Featured Products

Homepage should show 6–8 products.

### Card

```text
┌──────────────────────────┐
│                          │
│       Product Image      │
│                          │
├──────────────────────────┤
│ Panda Squishy            │
│ Slow Rising · PU Foam    │
│                          │
│ [View Product]           │
└──────────────────────────┘
```

Do not show excessive technical parameters on the homepage.

---

# 11. Product Listing Page

## Page goal

Allow visitors to browse a catalog quickly.

### Layout

```text
┌────────────────────────────────────────────────────────┐
│ Squishy Toys                                            │
│ Cute, soft and satisfying products for every mood.     │
│                                                        │
│ [All] [Animals] [Food] [Characters] [Stress Relief]   │
│                                                        │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│ │ image  │ │ image  │ │ image  │ │ image  │           │
│ │ title  │ │ title  │ │ title  │ │ title  │           │
│ └────────┘ └────────┘ └────────┘ └────────┘           │
│                                                        │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │
│ │ image  │ │ image  │ │ image  │ │ image  │           │
│ └────────┘ └────────┘ └────────┘ └────────┘           │
└────────────────────────────────────────────────────────┘
```

### Filters

Phase 1 should keep filtering simple:
- Category
- New arrivals
- Optional product tags

Avoid expensive search/filter logic until catalog size requires it.

---

# 12. Product Detail Page

This is the most important conversion page.

## 12.1 Top section

```text
Breadcrumb

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ ┌────────────────────────┐   Panda Squishy                  │
│ │                        │   Cute slow-rising panda toy     │
│ │                        │                                  │
│ │    Main product image  │   ✓ Soft PU foam                 │
│ │                        │   ✓ Slow rising                  │
│ │                        │   ✓ Lightweight                  │
│ └────────────────────────┘                                  │
│ thumbnails underneath              [Ask on WhatsApp]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 12.2 Product image gallery

Recommended images:
1. Main product
2. Front
3. Side
4. Back
5. Squeeze / hand interaction
6. Size reference
7. Packaging
8. Lifestyle image

Optional:
9. Detail texture
10. Short product video

---

# 13. Product Information Structure

## Primary information

```text
Product Name
Short description
Category
Material
Size
Weight
MOQ
OEM / ODM
Packaging
```

### Example

**Panda Squishy Toy**

> A cute slow-rising panda squishy made for stress relief, gifting and novelty retail.

| Specification | Details |
|---|---|
| Material | PU Foam |
| Size | 10 × 8 × 8 cm |
| Weight | 65 g |
| MOQ | 100 pcs |
| Packaging | OPP Bag / Custom Packaging |
| Custom Logo | Available |
| OEM / ODM | Available |

All values must be real and maintained in the product data file.

---

# 14. Product Features

Use icon-based short points:

```text
◉ Slow Rising
◉ Soft & Satisfying
◉ Lightweight
◉ Cute Character Design
◉ Gift Friendly
◉ Customizable
```

Avoid long blocks of marketing copy.

---

# 15. WhatsApp Conversion Design

## 15.1 Global floating button

Desktop:

```text
                          ┌────────────────────────┐
                          │  Chat on WhatsApp  ●   │
                          └────────────────────────┘
```

Mobile:

```text
┌──────────────────────────────────────┐
│         Chat on WhatsApp             │
└──────────────────────────────────────┘
```

Use a fixed bottom CTA on mobile because it is highly visible without taking much space.

## 15.2 Product-specific prefilled message

Each product should generate a message containing:

```text
Hi, I'm interested in this product.

Product: Panda Squishy Toy
Product URL: https://example.com/products/panda-squishy

Could you please send me:
1. Wholesale price
2. MOQ
3. Sample information
4. Customization options
5. Shipping information

Thank you.
```

## 15.3 CTA labels

Different contexts:

- Homepage: `Chat on WhatsApp`
- Product page: `Ask About This Product`
- Wholesale: `Request Wholesale Information`
- OEM: `Discuss Your Custom Project`
- Contact: `Talk to Our Team`

---

# 16. Wholesale Page

## Hero

**Wholesale Squishy Toys for Retailers**

Supporting text:

> Flexible product selection, bulk orders and custom packaging for retailers, online sellers and distributors.

CTA:

> Request Wholesale Information

## Content sections

```text
Who We Serve
      ↓
Wholesale Benefits
      ↓
MOQ / Packaging
      ↓
Popular Product Categories
      ↓
FAQ
      ↓
WhatsApp CTA
```

### Audience cards

```text
Toy Stores
Gift Shops
Online Sellers
Distributors
Retail Brands
Promotional Companies
```

---

# 17. OEM / ODM Page

## Hero

**Create Your Own Squishy Toy**

> From custom shapes and colors to branded packaging, we can support your product concept from idea to production.

CTA:

> Discuss Your Custom Project

## Process

```text
01  Share Your Idea
        ↓
02  Design & Prototype
        ↓
03  Sample Confirmation
        ↓
04  Mass Production
        ↓
05  Quality Inspection
        ↓
06  Shipping
```

## Customization options

```text
Custom Shape
Custom Size
Custom Color
Custom Character
Custom Logo
Custom Packaging
Private Label
```

Do not publish capabilities that are not actually available.

---

# 18. About Page

Focus on factual trust signals rather than generic slogans.

Suggested sections:

```text
Who We Are
What We Make
Manufacturing / Supply Capability
Quality & Packaging
Markets We Serve
OEM / ODM Capability
Contact
```

Optional metrics, only when factual:

```text
10+ Years Experience
100+ Product Designs
20+ Countries Served
OEM / ODM Available
```

---

# 19. FAQ Page

Recommended questions:

### What is the MOQ?

> MOQ depends on the product and customization requirements.

### Do you support OEM and ODM?

> Yes, subject to product and project requirements.

### Can I request samples?

> Yes. Contact us on WhatsApp for sample availability and information.

### Do you ship internationally?

> International shipping options depend on destination and order details.

### Can you customize packaging?

> Custom packaging is available for qualifying projects.

### How can I request a quotation?

> Open WhatsApp from the website and send us the product name or product link.

---

# 20. Contact Page

The contact page should not become a traditional long form.

Primary channel:

**WhatsApp**

Secondary fields may be simple:

- Email
- WhatsApp
- Company
- Location

If there is no backend form, do not create a fake “Submit” workflow. The action should be explicit:

> Chat on WhatsApp

---

# 21. Footer

```text
┌─────────────────────────────────────────────────────────────┐
│ LOGO                                                        │
│ Cute squishy toys for gifting, retail and custom projects. │
│                                                             │
│ Products        Company          Business                   │
│ All Products   About Us         Wholesale                  │
│ Categories     FAQ              OEM / ODM                  │
│                              Contact                       │
│                                                             │
│ WhatsApp: +XX XXX XXX XXXX                                 │
│ Email: hello@example.com                                   │
│                                                             │
│ Privacy Policy | Terms                                     │
│                                                             │
│ © 2026 Your Brand. All rights reserved.                   │
└─────────────────────────────────────────────────────────────┘
```

---

# 22. Responsive Design

## Desktop >= 1200px

- Max content width: 1200–1280 px
- 4-column product grid
- Full navigation
- Hero split layout

## Tablet 768–1199px

- 2–3 column grid
- Slightly smaller hero
- Collapsible navigation when needed

## Mobile < 768px

- 2-column product grid
- Mobile menu
- Large tap targets
- Fixed WhatsApp CTA
- Product gallery becomes swipeable
- Specifications become stacked cards rather than wide tables

---

# 23. Product Data Maintenance Model

The website should separate product content from UI code.

Recommended structure:

```text
data/
└── products.json

public/
├── products/
│   ├── panda-squishy/
│   │   ├── 01-cover.webp
│   │   ├── 02-front.webp
│   │   ├── 03-side.webp
│   │   ├── 04-back.webp
│   │   ├── 05-squeeze.webp
│   │   ├── 06-size.webp
│   │   ├── 07-packaging.webp
│   │   └── 08-lifestyle.webp
│   │
│   ├── cat-squishy/
│   └── strawberry-squishy/
```

This is deliberately human-readable.

---

# 24. Product JSON Standard

Example:

```json
{
  "id": "SQ001",
  "slug": "panda-squishy",
  "name": "Panda Squishy Toy",
  "shortDescription": "Cute slow-rising panda squishy for stress relief and gifting.",
  "category": "animal-squishy",
  "tags": ["panda", "slow-rising", "stress-relief"],
  "material": "PU Foam",
  "size": "10 × 8 × 8 cm",
  "weight": "65 g",
  "moq": "100 pcs",
  "packaging": "OPP Bag / Custom Packaging",
  "oem": true,
  "featured": true,
  "newArrival": false,
  "images": [
    "/products/panda-squishy/01-cover.webp",
    "/products/panda-squishy/02-front.webp",
    "/products/panda-squishy/03-side.webp",
    "/products/panda-squishy/04-back.webp"
  ],
  "seo": {
    "title": "Panda Squishy Toy | Slow Rising Squishy",
    "description": "Cute slow-rising panda squishy toy for gifting, stress relief and wholesale."
  }
}
```

---

# 25. Product Image Standard

## Recommended source images

Each product:

- 1600–2400 px long edge for high-quality source
- WebP for normal images
- AVIF can be added later
- Keep transparent PNG only where genuinely necessary

## Website target sizes

Typical product web images:

- 150–500 KB each after optimization
- Avoid multi-megabyte images wherever possible

## Naming standard

Good:

```text
01-cover.webp
02-front.webp
03-side.webp
04-back.webp
05-squeeze.webp
06-size.webp
07-packaging.webp
08-lifestyle.webp
```

Bad:

```text
IMG_8732.JPG
final-final2.jpg
new_edited_01.png
```

## Why this matters

GitHub recommends keeping repositories small. GitHub blocks regular Git files over 100 MiB, and recommends using object storage or other approaches for very large generated/binary assets. Git LFS exists for large files, but GitHub's current documentation states that Git LFS cannot be used for GitHub Pages sites. Therefore, for Phase 1, optimize product images and keep the repository lightweight; move large media to dedicated object storage/CDN if the catalog eventually becomes very large. citeturn889217search0turn889217search5

---

# 26. Recommended Next.js Project Structure

```text
squishy-website/
├── app/
│   ├── page.tsx
│   ├── products/
│   │   └── page.tsx
│   ├── products/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── wholesale/
│   │   └── page.tsx
│   ├── oem/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── faq/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   └── terms/
│       └── page.tsx
│
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── WhatsAppButton.tsx
│   ├── ProductCard.tsx
│   ├── ProductGallery.tsx
│   ├── ProductSpecs.tsx
│   └── SectionHeading.tsx
│
├── data/
│   └── products.json
│
├── lib/
│   ├── products.ts
│   ├── whatsapp.ts
│   └── seo.ts
│
├── public/
│   ├── products/
│   ├── brand/
│   └── icons/
│
├── app/
│   └── ...
│
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

Note: the actual folder should not duplicate `app/`; the above is a conceptual layout. A clean implementation should contain one `app/` directory.

---

# 27. Static Export Strategy

Use:

```typescript
const nextConfig = {
  output: 'export',
  trailingSlash: true
}

export default nextConfig
```

`output: 'export'` makes `next build` generate the static site into the `out` directory. Next.js documents static export specifically for sites that can be hosted as static HTML/CSS/JS assets. citeturn365704search1

`trailingSlash: true` is recommended here because the target host is GitHub Pages and the resulting route shape is simple:

```text
/products/
/products/panda-squishy/
```

---

# 28. Features to Avoid in Phase 1

Because this is a GitHub Pages static site, avoid features that require a running server.

Do not build:

```text
/app/api/*
Server Actions
Server-side form submission
Database access from the server
Runtime authentication
Dynamic redirects
Server middleware
```

Next.js current static export documentation identifies server-dependent features as unsupported in static export. citeturn365704search1

---

# 29. GitHub Repository

Recommended repository:

```text
your-github-account/
└── squishy-website
```

Keep it organized so product operators can understand it.

Top-level folders should be obvious:

```text
app
components
data
public
```

---

# 30. GitHub Pages Deployment

Recommended flow:

```text
Developer / Operator
        ↓
Edit code / product JSON / images
        ↓
git push
        ↓
GitHub Actions
        ↓
npm ci
        ↓
npm run build
        ↓
out/
        ↓
GitHub Pages
```

GitHub officially supports automatic deployment to Pages with GitHub Actions on pushes to the main branch. citeturn614532search7

---

# 31. GitHub Actions Workflow

File:

```text
.github/workflows/deploy.yml
```

Recommended baseline:

```yaml
name: Deploy Next.js to GitHub Pages

on:
  push:
    branches:
      - main

  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest

    environment:
      name: github-pages

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Versions should be reviewed periodically as GitHub Actions and Node.js move forward. GitHub's current Pages deployment documentation uses the Pages actions and supports automatic publishing from GitHub Actions. citeturn614532search7

---

# 32. GitHub Pages Settings

Repository:

```text
Settings
  ↓
Pages
```

Set:

```text
Build and deployment
Source: GitHub Actions
```

Do not manually upload `out/` if using the workflow above.

---

# 33. Domain Strategy

## Development

Use:

```text
https://YOUR-USERNAME.github.io/squishy-website/
```

## Production

Use a custom brand domain:

```text
https://www.yourbrand.com
```

GitHub Pages supports custom domains. GitHub recommends configuring the custom domain in Pages and DNS carefully; `www` subdomains use a CNAME record to the GitHub Pages domain. citeturn614532search0turn614532search4

GitHub Pages also supports HTTPS for correctly configured custom domains. citeturn614532search1

---

# 34. Recommended Production DNS Model

Example:

```text
www.yourbrand.com
        ↓
CNAME
        ↓
YOUR-USERNAME.github.io
```

For the apex domain:

```text
yourbrand.com
```

use the GitHub Pages-supported apex configuration. GitHub's current documentation lists the supported A/AAAA records and recommends configuring both the apex domain and `www` variant for HTTPS-secured sites. citeturn614532search4

---

# 35. SEO Strategy

Every important product gets its own URL:

```text
/products/panda-squishy/
```

Never rely on:

```text
/products?id=123
```

for the primary SEO page.

Each product page should have:

```text
Title
Meta Description
H1
Canonical URL
Open Graph title
Open Graph description
Open Graph image
Product structured data
```

Recommended title:

```text
Panda Squishy Toy | Slow Rising Squishy | Your Brand
```

Recommended description:

```text
Discover our cute slow-rising panda squishy toy for gifting, stress relief and wholesale. OEM and custom packaging available.
```

---

# 36. SEO URL Rules

Use lowercase English slugs:

```text
panda-squishy
strawberry-squishy
cat-squishy
slow-rising-panda-squishy
```

Avoid:

```text
Panda_Squishy_01
product123
item?id=1
```

---

# 37. Open Graph / Social Sharing

When a product URL is shared on:

- WhatsApp
- Facebook
- Instagram messages
- LinkedIn
- Other social platforms

the preview should show:

```text
┌───────────────────────────────┐
│                               │
│       Product image           │
│                               │
├───────────────────────────────┤
│ Panda Squishy Toy             │
│ Cute slow-rising squishy     │
│ yourbrand.com                 │
└───────────────────────────────┘
```

Every product should have a suitable social image.

---

# 38. Analytics

Install:

- Google Analytics 4
- Google Search Console
- Microsoft Clarity

Core events:

```text
page_view
view_product
click_whatsapp
click_wholesale
click_oem
```

The most important Phase 1 event:

```text
click_whatsapp
```

---

# 39. WhatsApp Attribution

The URL generated by the WhatsApp CTA should contain the product context in the message.

Example:

```text
Product: Panda Squishy Toy
Product URL: https://www.yourbrand.com/products/panda-squishy/
```

This gives the sales team context without requiring another form.

If future campaign attribution is added, track:

```text
utm_source
utm_medium
utm_campaign
utm_content
product
```

---

# 40. Phase 1 Funnel

Measure this funnel:

```text
Visitor
   ↓
Homepage / Landing Page
   ↓
Category
   ↓
Product Detail
   ↓
WhatsApp Click
   ↓
WhatsApp Conversation
```

Primary KPI:

**Qualified WhatsApp inquiries**

Secondary KPIs:

- Product page views
- WhatsApp CTR
- Organic search clicks
- Returning visitors
- Top products by inquiry clicks
- Traffic source

Do not optimize primarily for page views.

---

# 41. Content Strategy

## Homepage content priority

1. Product value
2. Visual appeal
3. Product categories
4. Wholesale/OEM capability
5. Trust
6. WhatsApp CTA

## Product page content priority

1. Product photos/video
2. Key benefits
3. Specifications
4. MOQ
5. Customization
6. WhatsApp CTA

---

# 42. Image / Video UX

For squishy products, motion is especially useful.

Recommended:

- Product squeeze video
- Slow-rise demonstration
- Short looping interaction clip

Ideal length:

**5–15 seconds**

Avoid autoplay sound.

Use muted video.

---

# 43. Product Photography Standard

Use a consistent photography direction:

### Main image

- Light background
- Product centered
- Soft shadow
- No large watermarks
- Minimal text

### Lifestyle image

- Human interaction
- Desk / bedroom / gifting / casual scene
- Product remains the main subject

### B2B image

- Multiple products together
- Packaging
- Assortment
- Custom branding example, if real

---

# 44. Accessibility

Every product image needs meaningful alt text.

Good:

```text
alt="Pink panda squishy toy, slow-rising PU foam"
```

Bad:

```text
alt="image1"
```

Buttons must be understandable without visuals.

Color should not be the only signal.

---

# 45. Performance Rules

Target:

- Above-the-fold hero image optimized
- Lazy-load lower images
- Avoid loading all gallery images at full resolution immediately
- Use WebP/AVIF where practical
- Minimize client-side JavaScript
- Avoid heavy animation libraries unless necessary

The site should feel instant on mobile networks.

---

# 46. Product Maintenance Workflow

## Add product

```text
1. Create product folder
2. Optimize images
3. Add images to public/products/[slug]/
4. Add product record to products.json
5. Test local page
6. Commit
7. Push
8. GitHub Actions builds
9. GitHub Pages publishes
```

## Update product

Only modify:

```text
data/products.json
```

and/or:

```text
public/products/[slug]/
```

unless the layout itself changes.

This separation is intentional.

---

# 47. Git Commit Naming

Recommended:

```text
feat: add panda squishy product
feat: add animal category
content: update panda product images
content: update wholesale MOQ
fix: correct product metadata
design: improve mobile product cards
```

This makes the Git history useful for future maintenance.

---

# 48. Product Data Spreadsheet for Non-Developers

Maintain an Excel/CSV source as the business master list:

```text
SKU
Product Name
Category
Short Description
Material
Size
Weight
MOQ
Packaging
OEM
Featured
New Arrival
Image Folder
SEO Title
SEO Description
```

For Phase 1, the deployable website data can still be generated/copied into `products.json`.

Later this can be replaced with a CMS or Spring Boot API without changing the visual design.

---

# 49. Recommended Product Quantity

First validation release:

**30–50 products**

Target expansion:

**50–100 products**

Do not wait for hundreds of products before launching.

The first goal is to verify:

```text
traffic
   ↓
product interest
   ↓
WhatsApp conversion
```

---

# 50. First Release Page Checklist

## Must Have

- Homepage
- Product listing
- Product detail page
- WhatsApp CTA
- Wholesale page
- OEM page
- About
- FAQ
- Contact
- Privacy Policy
- Terms
- Responsive UI
- SEO metadata
- Sitemap
- Analytics

## Nice to Have

- Product video
- Clarity
- Search
- Category filters
- Social sharing
- Related products

## Do Not Build Yet

- Payment
- Cart
- Login
- Database
- Admin
- CRM
- Inventory
- Order system

---

# 51. Suggested MVP Page Wireframe Summary

## Home

```text
Header
↓
Hero
↓
Categories
↓
Featured Products
↓
Why Squishy
↓
Wholesale / OEM
↓
Lifestyle
↓
Trust / Capability
↓
FAQ Preview
↓
WhatsApp CTA
↓
Footer
```

## Products

```text
Header
↓
Page title
↓
Category filter
↓
Product grid
↓
Footer
```

## Product Detail

```text
Header
↓
Breadcrumb
↓
Gallery + Product Summary
↓
WhatsApp CTA
↓
Features
↓
Specifications
↓
Customization
↓
Related Products
↓
Final WhatsApp CTA
↓
Footer
```

## Wholesale

```text
Hero
↓
Who We Serve
↓
Wholesale Benefits
↓
Product Categories
↓
FAQ
↓
WhatsApp CTA
```

## OEM / ODM

```text
Hero
↓
Customization Options
↓
Process
↓
Capabilities
↓
FAQ
↓
WhatsApp CTA
```

---

# 52. Migration Path to Backend

The first architecture should be deliberately designed so the backend can be added later.

### Phase 1

```text
Next.js
   ↓
products.json
   ↓
GitHub Pages
```

### Phase 2

```text
Next.js
   ↓
CMS / Spring Boot API
   ↓
MySQL
```

### Phase 3

```text
Next.js
   ↓
Spring Boot
   ↓
Product
Lead
Customer
Quote
Order
CRM
```

Important principle:

> Do not put product content directly inside React components.

Keep the UI and product data separated from Day 1.

---

# 53. Recommended Final Phase 1 Architecture

```text
                         Internet
                            │
                            ↓
                       Custom Domain
                            │
                            ↓
                       GitHub Pages
                            │
                            ↓
                    Next.js Static Export
                            │
            ┌───────────────┼────────────────┐
            ↓               ↓                ↓
       Product Data       SEO/OG          Analytics
       products.json
            │
            ↓
       Product Images
       public/products/
            │
            ↓
         Product Page
            │
            ↓
      WhatsApp Click-to-Chat
            │
            ↓
       Sales Conversation
```

No server is required for this Phase 1 architecture.

---

# 54. Recommended Development Order

### Step 1 — Foundation

- Create GitHub repository
- Create Next.js project
- Configure static export
- Configure Tailwind
- Create base layout
- Create header/footer

### Step 2 — Product System

- Define product TypeScript interface
- Create `products.json`
- Create product folder convention
- Build ProductCard
- Build category filtering
- Build Product Detail page

### Step 3 — Conversion

- Build reusable WhatsApp button
- Generate product-specific WhatsApp messages
- Add mobile fixed CTA
- Add event tracking

### Step 4 — Business Pages

- Wholesale
- OEM / ODM
- About
- FAQ
- Contact

### Step 5 — SEO

- Metadata
- Product structured data
- Sitemap
- Robots
- OG images
- Canonical URLs

### Step 6 — Deployment

- GitHub Actions
- GitHub Pages
- Custom domain
- HTTPS
- Production analytics

### Step 7 — Content

- Load 30–50 products
- Optimize all images
- Verify every product URL
- Verify every WhatsApp CTA

---

# 55. Phase 1 Acceptance Criteria

The site can be considered ready when:

### UX

- Mobile and desktop layouts both work
- Product can be found within a few clicks
- Product image gallery works
- WhatsApp CTA is visible
- No dead links

### Product Content

- 30–50 real products
- Consistent photography
- Consistent product fields
- Accurate MOQ/specification information

### SEO

- Every product has unique title/description
- Product routes are crawlable
- Sitemap is generated
- Canonical URLs are correct
- Open Graph previews are correct

### Analytics

- GA4 installed
- `click_whatsapp` event works
- Search Console verified

### Deployment

- GitHub Actions passes
- GitHub Pages deploys automatically
- Custom domain works
- HTTPS enforced

### Conversion

Test at least these paths:

```text
Home → Product → WhatsApp
Google/landing page → Product → WhatsApp
Wholesale → WhatsApp
OEM → WhatsApp
Mobile → Product → Fixed WhatsApp CTA
```

---

# 56. Final Product Philosophy

The website should answer five questions as quickly as possible:

```text
1. What do you sell?
2. Why is this product interesting?
3. What are the specifications?
4. Can you handle wholesale/custom projects?
5. How do I contact you?
```

The final visitor journey should always end with:

> **“I like this product → I know enough about it → I can ask about it immediately.”**

Therefore, every major page should have a clear WhatsApp action.

---

# 57. Core Technical Decision

### Recommended

**Next.js + TypeScript + Tailwind CSS + Static Export + GitHub Pages + products.json + optimized WebP/AVIF + WhatsApp Click-to-Chat + GA4 + Search Console**

### Avoid in Phase 1

**Spring Boot + MySQL + Redis + Nginx + payment + cart + authentication**

The current Next.js documentation explicitly supports static export with `output: 'export'`, producing an `out` directory that can be hosted by static hosting services. citeturn365704search1

GitHub Pages supports automatic deployment through GitHub Actions and custom domains/HTTPS, so the first version can operate without purchasing a VPS/server. citeturn614532search7turn614532search0turn614532search1

---

# 58. One-Sentence Project Definition

> **A clean, fast, English-language squishy product showcase website that turns international product traffic into qualified WhatsApp conversations, while keeping product data and images easy to maintain through GitHub.**
