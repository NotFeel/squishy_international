# Squishy International

An English product showcase and WhatsApp inquiry website for squishy toys. It uses Next.js App Router, TypeScript, and static export. There is no cart, payment, login, database, or runtime backend, making it suitable for GitHub Pages.

[中文 README](./README.zh-CN.md) · [Documentation Index](./docs/README.md)

## 1. Features

- Responsive Home, Wholesale, OEM / ODM, About, FAQ, Contact, Privacy, and Terms pages
- Material-based catalog configuration
- Static material routes: `/products/material/<material-id>/`
- Dedicated New Arrivals, Pre-Order, and Featured Products homepage sections
- Product-name search scoped to the current material
- Available / Pre-Order / Coming Soon status filtering
- Dedicated New Arrivals and Pre-Order static pages
- `10 / 20 / 50` products per page
- URL synchronization for search and pagination
- Product detail pages, metadata, and Product JSON-LD
- Per-product Open Graph images
- WhatsApp Click-to-Chat with product name, SKU, and product URL
- GitHub Pages deployment through GitHub Actions
- Excel-based product maintenance and Python import

## 2. Technology

| Technology | Purpose |
|---|---|
| Next.js 16 | App Router and static generation |
| React 19 | UI components |
| TypeScript | Type safety |
| CSS | Responsive visual system |
| Python 3.10+ | Excel product import |
| Pillow | Image conversion and OG generation |
| GitHub Actions | Build and deployment |

## 3. Project Structure

```text
squishy_international/
├── app/
│   └── products/
│       ├── page.tsx
│       ├── [slug]/page.tsx
│       └── material/[slug]/page.tsx
├── components/
├── config/
│   └── materials.json
├── data/
│   ├── products.json
│   └── backup/
├── docs/
│   ├── README.md
│   ├── zh-CN/
│   ├── en/
│   └── plans/
├── import/
│   └── products.xlsx
├── public/
│   ├── brand/
│   └── products/<slug>/
├── scripts/
│   ├── import_products.py
│   └── validate-products.mjs
├── .github/workflows/deploy.yml
├── next.config.ts
├── package.json
└── requirements.txt
```

## 4. Requirements

- Node.js 20.9+, preferably Node.js 22
- npm 10+
- Python 3.10+
- Microsoft Excel or another `.xlsx` editor
- A GitHub repository
- GitHub Pages configured to use GitHub Actions

## 5. Install

### 5.1 macOS

```bash
git clone <repository-url>
cd squishy_international
npm ci
cp .env.example .env.local
```

### 5.2 Windows PowerShell

```powershell
git clone <repository-url>
cd squishy_international
npm ci
Copy-Item .env.example .env.local
```

If script execution is blocked:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## 6. Environment Variables

Local file:

```text
.env.local
```

Example:

```env
NEXT_PUBLIC_BRAND_NAME=Squishy Factory
NEXT_PUBLIC_SITE_URL=https://yourname.github.io
NEXT_PUBLIC_BASE_PATH=/squishy_international
NEXT_PUBLIC_WHATSAPP_PHONE=8613812345678
NEXT_PUBLIC_CONTACT_EMAIL=hello@example.com
NEXT_PUBLIC_LOCATION=Global sourcing, serving worldwide
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Next.js variable precedence:

```text
Command-line environment
↓
.env.production.local
↓
.env.local
↓
.env.production
↓
.env
```

`.env.example` is never loaded automatically. `.env.local` overrides `.env`.

`NEXT_PUBLIC_*` values are compiled during `npm run build`; rebuild after changing them.

## 7. Local Development

```bash
npm run dev
```

Default URL:

```text
http://localhost:3000
```

Commands:

```bash
npm run typecheck
npm run validate
npm run build
npm run generate:art
```

Static output is written to `out/`.

## 8. Product Maintenance

Workflow:

```text
Edit products_import_template_v2.xlsx
↓
Save as import/products.xlsx
↓
Run the Python importer with --check
↓
Run the formal import
↓
data/products.json
↓
public/products/<slug>/
↓
npm run validate
↓
npm run build
↓
Commit and deploy
```

Guides:

- [中文产品 Excel 维护与 Python 导入教程](./docs/zh-CN/product-excel-import.md)
- [English Product Excel and Python Import Guide](./docs/en/product-excel-import.md)

## 9. GitHub Pages Deployment

Workflow:

```text
.github/workflows/deploy.yml
```

Deployment flow:

```text
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

### 9.1 GitHub Settings

1. Open `Settings → Pages`.
2. Set `Build and deployment → Source` to `GitHub Actions`.
3. Open `Settings → Secrets and variables → Actions → Variables`.
4. Add deployment variables.

### 9.2 Project Site

For:

```text
https://yourname.github.io/squishy_international/
```

Use:

```env
NEXT_PUBLIC_SITE_URL=https://yourname.github.io
NEXT_PUBLIC_BASE_PATH=/squishy_international
```

If these values are omitted, the workflow attempts to calculate them from the GitHub repository.

### 9.3 Custom Domain

```env
NEXT_PUBLIC_SITE_URL=https://www.yourbrand.com
NEXT_PUBLIC_BASE_PATH=
```

Configure DNS and HTTPS in GitHub Pages.

### 9.4 Other Variables

| Variable | Required | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_BRAND_NAME` | Recommended | Site brand name |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | Yes | International number without `+` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Recommended | Contact email |
| `NEXT_PUBLIC_LOCATION` | Recommended | Company address or service location shown on Contact and Footer |
| `NEXT_PUBLIC_GA_ID` | No | GA4 Measurement ID |

## 10. Build and Release

```bash
npm run validate
npm run build
```

Commit:

```bash
git status
git diff
git add .
git commit -m "content: update product catalog"
git push
```

Then open:

```text
GitHub Repository → Actions → Deploy Next.js to GitHub Pages
```

Confirm that both `build` and `deploy` succeed.

## 11. Release Checklist

- [ ] Home, product, and material pages load
- [ ] Search stays within the selected material
- [ ] 10 / 20 / 50 pagination works
- [ ] Product images load
- [ ] `og:title`, `og:description`, and `og:image` are correct
- [ ] WhatsApp includes the product name and URL
- [ ] `sitemap.xml` and `robots.txt` are correct
- [ ] GitHub Pages uses HTTPS
- [ ] GA4 `click_whatsapp` works
- [ ] Mobile and desktop layouts have no horizontal overflow

## 12. Troubleshooting

### Page loads but JS/CSS returns 404

Verify `NEXT_PUBLIC_BASE_PATH` against the actual GitHub Pages project path.

### Environment changes do not appear

Check `.env.local` precedence and rebuild the site.

### `npm run build` fails during validation

Run:

```bash
npm run validate
```

Fix the reported JSON, material, image, or slug issue.

### WhatsApp does not show a preview

Verify:

- The product URL is public HTTPS.
- `og:image` is an absolute HTTPS URL.
- The OG image is publicly accessible.
- WhatsApp has not cached an older preview.

## 13. Documentation Convention

- Chinese guides: `docs/zh-CN/`
- English guides: `docs/en/`
- Plans and design documents: `docs/plans/`
- Documentation index: `docs/README.md`

Do not place tutorials throughout the repository root. Root files are limited to `README.md`, `README.zh-CN.md`, and `README.en.md`.
