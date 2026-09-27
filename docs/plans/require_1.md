核心实现已经确定：产品页在构建时生成独立 HTML，generateMetadata 写入每个产品自己的 OG 标题/描述/图片，WhatsApp 只负责预填“产品名 + 产品 URL”。下面我直接给你一套可复制的文件结构。

可以。我按你当前这个项目的目标，给你做成了一套可以直接复制到 Next.js 项目里的代码骨架，核心就是：

产品数据
   ↓
products.json
   ↓
/products/[slug]/
   ↓
generateStaticParams()
   ↓
生成静态产品页
   ↓
generateMetadata()
   ↓
og:title / og:description / og:image / og:url
   ↓
WhatsAppButton
   ↓
wa.me + 产品URL
   ↓
WhatsApp 链接预览

Next.js 当前 App Router 支持 generateMetadata() 动态生成页面 metadata，也支持 generateStaticParams() 在构建阶段预生成动态路由；配合 output: "export" 可以生成静态站点。

1. 直接下载项目骨架

下载完整 Next.js + WhatsApp 技术实现骨架

里面已经包含 21 个文件，重点包括：

squishy-nextjs-whatsapp-starter/
│
├── app/
│   ├── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   │
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── sitemap.ts
│   └── robots.ts
│
├── components/
│   ├── ProductCard.tsx
│   └── WhatsAppButton.tsx
│
├── data/
│   └── products.json
│
├── lib/
│   ├── products.ts
│   ├── site.ts
│   └── whatsapp.ts
│
├── types/
│   └── product.ts
│
├── public/
│   └── products/
│       └── panda-squishy/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── .env.example
├── next.config.ts
├── package.json
└── README.md
2. Product 数据结构

这里我特意没有把产品信息写死在 React 页面里。

types/product.ts：

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;

  category: string;
  tags: string[];

  material: string;
  size: string;
  weight?: string;

  moq: string;
  packaging: string;

  oem: boolean;
  featured: boolean;
  newArrival: boolean;

  images: string[];

  // 专门给 WhatsApp / Facebook / LinkedIn 等分享预览使用
  ogImage: string;

  seo: {
    title: string;
    description: string;
  };
}

然后真正维护产品的是：

data/products.json

例如：

{
  "id": "SQ001",
  "slug": "panda-squishy",
  "name": "Panda Squishy Toy",
  "shortDescription": "Cute slow-rising panda squishy toy for stress relief, gifting and novelty retail.",
  "description": "A soft and slow-rising panda squishy designed for squeezing, relaxation, gifting and novelty retail.",
  "category": "animal-squishy",
  "tags": [
    "panda",
    "slow-rising",
    "stress-relief",
    "cute"
  ],
  "material": "PU Foam",
  "size": "10 × 8 × 8 cm",
  "weight": "65 g",
  "moq": "100 pcs",
  "packaging": "OPP Bag / Custom Packaging",
  "oem": true,
  "featured": true,
  "newArrival": true,
  "images": [
    "/products/panda-squishy/01-cover.webp"
  ],
  "ogImage": "/products/panda-squishy/og-image.jpg",
  "seo": {
    "title": "Panda Squishy Toy | Slow Rising Squishy",
    "description": "Discover our cute slow-rising panda squishy toy for stress relief, gifting and wholesale. OEM and custom packaging available."
  }
}

这样以后新增产品，基本只需要：

新增图片
+
products.json 增加一条
3. 动态产品 URL

目录：

app/products/[slug]/page.tsx

这意味着：

/products/panda-squishy/
/products/cat-squishy/
/products/strawberry-squishy/
/products/bear-squishy/

全部由一个页面模板生成。

关键代码：

export function generateStaticParams() {
  return getAllProducts().map((product) => ({
    slug: product.slug,
  }));
}

例如 products.json 有：

panda-squishy
cat-squishy
strawberry-squishy

执行：

npm run build

以后就会预生成对应产品页面。

4. generateMetadata：解决 WhatsApp 产品图片预览的核心代码

这是整个方案最关键的地方。

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const productUrl =
    absoluteUrl(`/products/${product.slug}/`);

  const ogImageUrl =
    absoluteUrl(product.ogImage);

  return {
    title: product.seo.title,

    description:
      product.seo.description,

    alternates: {
      canonical: productUrl,
    },

    openGraph: {
      title: product.seo.title,

      description:
        product.seo.description,

      url: productUrl,

      siteName:
        "Your Squishy Brand",

      type: "website",

      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: product.seo.title,

      description:
        product.seo.description,

      images: [ogImageUrl],
    },
  };
}

Next.js 官方支持用 Metadata API / generateMetadata() 动态生成 Open Graph metadata；Next.js 也明确说明 Open Graph metadata 对 WhatsApp 等私聊/分享场景的链接展示有帮助。

5. OG 图片结构

每一个产品单独维护：

public/
└── products/
    └── panda-squishy/
        ├── 01-cover.webp
        ├── 02-front.webp
        ├── 03-side.webp
        ├── 04-back.webp
        ├── 05-squeeze.webp
        ├── 06-size.webp
        ├── 07-packaging.webp
        ├── 08-lifestyle.webp
        └── og-image.jpg

我建议：

产品展示图
WebP / AVIF
OG 分享图
og-image.jpg

尺寸：

1200 × 630

这是常见的 Open Graph 分享卡片比例。真正重要的是它必须是公网可以直接访问的绝对 HTTPS 图片 URL。

例如：

https://www.yourbrand.com/products/panda-squishy/og-image.jpg

Open Graph 官方定义的核心字段包括：

og:title
og:type
og:image
og:url

Next.js 会把这些 metadata 生成到最终产品页面的 <head>。

6. 为什么 WhatsApp 能看到这张图片

这里的关系一定要理解：

WhatsApp
    ↑
    │ 产品URL
    │
wa.me
    ↑
    │ 预填产品URL
    │
WhatsAppButton
    ↑
产品详情页

不是把图片塞进 WhatsApp URL。

而是：

产品URL
    ↓
WhatsApp处理这个URL
    ↓
读取网页metadata
    ↓
og:title
og:description
og:image
    ↓
形成链接预览

所以：

ogImage

才是产品分享图的真正入口。

WhatsApp 官方 Click to Chat 支持：

https://wa.me/<number>?text=<urlencoded-message>

其中预填文本会出现在聊天输入框里。

7. WhatsAppButton.tsx

核心代码：

import type { Product } from "@/types/product";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Props = {
  product?: Product;
  children?: React.ReactNode;
  className?: string;
};

export default function WhatsAppButton({
  product,
  children = "Chat on WhatsApp",
  className = "",
}: Props) {
  return (
    <a
      href={buildWhatsAppUrl(product)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={
        product
          ? `Ask about ${product.name} on WhatsApp`
          : "Chat on WhatsApp"
      }
      className={`whatsapp-button ${className}`.trim()}
    >
      {children}
    </a>
  );
}

这个组件不需要：

React useState
useEffect
API
Backend

就是一个普通链接。

8. WhatsApp URL生成

lib/whatsapp.ts：

import type { Product } from "@/types/product";
import { absoluteUrl } from "@/lib/site";

const WHATSAPP_PHONE =
  (process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "")
    .replace(/\D/g, "");

export function buildWhatsAppMessage(
  product?: Product
): string {

  if (!product) {
    return [
      "Hi, I'm interested in your squishy products.",
      "",
      "Please send me your product catalog and wholesale information.",
      "",
      "Thank you."
    ].join("\n");
  }

  const productUrl =
    absoluteUrl(`/products/${product.slug}/`);

  return [
    "Hi, I'm interested in this product.",
    "",
    `Product: ${product.name}`,
    `Product URL: ${productUrl}`,
    "",
    "Could you please provide:",
    "1. Wholesale price",
    "2. MOQ",
    "3. Sample information",
    "4. Customization options",
    "5. Shipping information",
    "",
    "Thank you."
  ].join("\n");
}

export function buildWhatsAppUrl(
  product?: Product
): string {

  const message =
    encodeURIComponent(
      buildWhatsAppMessage(product)
    );

  return `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
}

最终生成：

https://wa.me/8613812345678?text=...

用户进入 WhatsApp 后，输入框里面自动出现：

Hi, I'm interested in this product.

Product: Panda Squishy Toy
Product URL: https://www.yourbrand.com/products/panda-squishy/

Could you please provide:
1. Wholesale price
2. MOQ
3. Sample information
4. Customization options
5. Shipping information

Thank you.

WhatsApp 官方 Click to Chat 文档确认这种国际格式号码 + URL 编码预填消息的方式。

9. 动态 URL 怎么保证正确

lib/site.ts 我专门处理了：

export const BASE_PATH =
  normalizeBasePath(
    process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  );

export const SITE_ORIGIN =
  (
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  ).replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  return new URL(
    `${BASE_PATH}${path}`,
    `${SITE_ORIGIN}/`
  ).toString();
}

例如 GitHub Pages：

NEXT_PUBLIC_SITE_URL=https://yourname.github.io
NEXT_PUBLIC_BASE_PATH=/squishy-website

产品：

/products/panda-squishy/

自动变成：

https://yourname.github.io/squishy-website/products/panda-squishy/

以后绑定自己的域名：

NEXT_PUBLIC_SITE_URL=https://www.yourbrand.com
NEXT_PUBLIC_BASE_PATH=

自动变成：

https://www.yourbrand.com/products/panda-squishy/

所以后面从：

github.io

切换：

yourbrand.com

不需要改产品数据。

10. next.config.ts

这里是 GitHub Pages 静态导出的关键：

import type { NextConfig } from "next";

const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",

  trailingSlash: true,

  basePath,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;

最重要：

output: "export"

构建：

npm run build

生成：

out/

然后 GitHub Pages 只需要发布 out/。

Next.js 当前官方文档支持这种 Static Export 模式。

11. GitHub Pages 自动部署

我已经把：

.github/workflows/deploy.yml

放进项目。

核心：

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

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm install

      - name: Build static site
        run: npm run build

      - name: Setup GitHub Pages
        uses: actions/configure-pages@v5

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./out

  deploy:
    needs: build
    runs-on: ubuntu-latest

    environment:
      name: github-pages

    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4

GitHub 当前 Pages 文档推荐的流程就是：

checkout
↓
构建静态站
↓
upload-pages-artifact
↓
deploy-pages

并要求部署权限以及 github-pages environment。

12. GitHub Actions 环境变量

这里建议使用：

Repository
→ Settings
→ Secrets and variables
→ Actions
→ Variables

建立三个变量：

NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_BASE_PATH
NEXT_PUBLIC_WHATSAPP_PHONE

GitHub Pages 项目站：

NEXT_PUBLIC_SITE_URL
=
https://YOUR_GITHUB_USERNAME.github.io
NEXT_PUBLIC_BASE_PATH
=
/squishy-website
NEXT_PUBLIC_WHATSAPP_PHONE
=
8613812345678

绑定自定义域名后：

NEXT_PUBLIC_SITE_URL
=
https://www.yourbrand.com
NEXT_PUBLIC_BASE_PATH
=
13. 一个非常关键的测试

执行：

npm run build

然后检查：

out/products/panda-squishy/index.html

里面应该能够找到：

<meta property="og:title"
      content="Panda Squishy Toy | Slow Rising Squishy">

<meta property="og:description"
      content="...">

<meta property="og:image"
      content="https://www.yourbrand.com/products/panda-squishy/og-image.jpg">

<meta property="og:url"
      content="https://www.yourbrand.com/products/panda-squishy/">

尤其检查：

og:image

必须是：

https://...

不要：

/products/panda-squishy/og-image.jpg

虽然浏览器能理解相对路径，但做社交分享时，直接生成绝对 HTTPS URL 更稳妥。

14. 最终 WhatsApp 流程

你的整个系统最后就是：

              GitHub
                 │
                 ↓
             Next.js
                 │
           Static Export
                 │
                 ↓
          GitHub Pages
                 │
                 ↓
       www.yourbrand.com
                 │
                 ↓
       /products/panda-squishy/
                 │
       ┌─────────┴─────────┐
       ↓                   ↓
    页面展示             Metadata
                           │
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
         og:title     og:description   og:image
             │             │             │
             └─────────────┼─────────────┘
                           ↓
                      产品URL
                           │
                           ↓
                     WhatsApp
                           │
                           ↓
                   Link Preview
                           │
                           ↓
                    产品图片 + 标题
                    + 描述 + 链接
15. 有一个限制一定要提前知道

这个方案做到的是：

让 WhatsApp 有条件生成产品链接预览。

并不是：

网站强制命令 WhatsApp 必须显示图片。

因为链接预览最终由 WhatsApp 的客户端/服务端处理，而且会受到：

URL 是否公网可访问
HTTPS
OG 标签
OG 图片是否能正常访问
WhatsApp 缓存
WhatsApp 客户端行为
用户是否关闭 link previews

等因素影响。

所以测试的时候不要在：

localhost

判断最终效果。

一定要测试：

https://www.yourbrand.com/products/panda-squishy/
16. 我已经把后期扩展也留好了

现在：

products.json

以后只需要把：

getAllProducts()
getProductBySlug()

的数据源从 JSON 换成：

Spring Boot API

例如：

Phase 1

Next.js
 ↓
products.json


Phase 2

Next.js
 ↓
Spring Boot
 ↓
MySQL

但是：

ProductCard
ProductDetail
WhatsAppButton
generateMetadata

这套页面层逻辑都可以继续使用。

你现在实际落地时，我建议按这个顺序
1. 下载 starter
       ↓
2. npm install
       ↓
3. 配置 .env.local
       ↓
4. 修改 SITE_NAME / WhatsApp
       ↓
5. 填 products.json
       ↓
6. 放产品图片
       ↓
7. npm run dev
       ↓
8. npm run build
       ↓
9. 检查 out/products/xxx/index.html
       ↓
10. 上传 GitHub
       ↓
11. 配 GitHub Actions Variables
       ↓
12. Settings → Pages → GitHub Actions
       ↓
13. 部署
       ↓
14. 用正式 HTTPS URL 测试 WhatsApp

你现在这个阶段，真正值得先把这套 Product 数据结构、动态路由、OG Metadata、WhatsAppButton 和 GitHub Pages 部署打通。 UI 后面再继续精修不会影响这套底层结构。