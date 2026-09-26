# International Squishy Website

基于 `squishy_international_site_design.md` 实现的英文国际捏捏乐产品展示与 WhatsApp 询盘站。项目使用 Next.js App Router、TypeScript 和静态导出，无后端、无购物车、无在线支付。

## 已实现

- 首页：Hero、材质分类、精选商品、品牌价值、Wholesale / OEM CTA、生活方式、信任信息、FAQ 和最终询盘
- 产品目录：材质静态分类、名称搜索、10 / 20 / 50 分页和 URL 状态同步
- 商品详情：4 视图图库、规格、定制能力、关联商品和商品级 WhatsApp 预填消息
- 产品分享：每个商品独立生成 1200 × 630 JPG Open Graph 图片
- 业务页面：Wholesale、OEM / ODM、About、FAQ、Contact、Privacy、Terms
- 全站：响应式导航、移动固定 WhatsApp CTA、GA4 `click_whatsapp` 事件
- SEO：独立商品 URL、Metadata、Open Graph、Product JSON-LD、Sitemap、Robots、Manifest
- 部署：GitHub Pages GitHub Actions 工作流
- 商品数据与 UI 分离：`data/products.json`、`config/materials.json`
- 类型与组件结构：`types/product.ts`、`lib/materials.ts`、`components/MaterialNav.tsx`、`components/ProductCatalog.tsx`
- 本地图片资产：48 张 WebP 商品视图和品牌 SVG/PNG 资产

## 本地运行

要求 Node.js 20.9+，推荐 Node.js 22。

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

静态导出验证：

```bash
npm run build
```

构建结果位于 `out/`。本地预览可使用任意静态服务器，例如：

```bash
python3 -m http.server 4173 -d out
```

## 环境配置

复制 `.env.example` 为 `.env.local`，替换实际业务信息：

```bash
cp .env.example .env.local
```

| 变量 | 用途 |
|---|---|
| `NEXT_PUBLIC_BRAND_NAME` | 网站显示品牌名，用于 Logo、SEO、页脚和 WhatsApp 消息 |
| `NEXT_PUBLIC_SITE_URL` | 站点 Origin，例如 `https://yourname.github.io`；不要附加仓库路径 |
| `NEXT_PUBLIC_BASE_PATH` | GitHub Pages 项目站点的子路径，例如 `/squishy_international`；自定义域名使用空值 |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | 国际格式 WhatsApp 号码，不含 `+` 和空格 |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 联系邮箱 |
| `NEXT_PUBLIC_GA_ID` | GA4 Measurement ID，未设置时不加载分析脚本 |

品牌、号码、邮箱和域名都通过环境变量配置。当前 `.env.example` 中的 `Squishy Loom` 等值仅是演示占位信息，上线前必须替换。

## 商品维护

1. 将真实商品图优化为 WebP，推荐 1600-2400 px 长边和 150-500 KB。
2. 按 `public/products/[slug]/01-cover.webp` 等命名替换演示图。
3. 每个产品准备一张 1200 × 630 的 `og-image.jpg`，用于 WhatsApp / Facebook / LinkedIn 链接预览。
4. 在 `data/products.json` 中更新 `materialId`、`description`、`ogImage`、SEO 和图片路径。
5. 执行 `npm run validate` 和 `npm run build` 验证。
6. 提交并推送到 `main`，GitHub Actions 自动部署。

商品字段说明：

```json
{
  "id": "SQ001",
  "slug": "panda-squishy",
  "name": "Panda Squishy Toy",
  "shortDescription": "Cute slow-rising panda squishy.",
  "description": "A soft slow-rising panda squishy for gifting and stress relief.",
  "materialId": "pu-foam",
  "tags": ["panda", "slow-rising"],
  "material": "PU Foam",
  "size": "10 x 8 x 8 cm",
  "weight": "65 g",
  "moq": "100 pcs",
  "packaging": "OPP Bag / Custom Packaging",
  "oem": true,
  "featured": true,
  "newArrival": false,
  "images": ["/products/panda-squishy/01-cover.webp"],
  "ogImage": "/products/panda-squishy/og-image.jpg",
  "seo": {
    "title": "Panda Squishy Toy | Slow Rising Squishy",
    "description": "Cute slow-rising panda squishy toy."
  }
}
```

材质分类全部维护在：

```text
config/materials.json
```

当前启用的材质 ID：

- `pu-foam`
- `tpr`
- `mixed`

材质增加、停用和排序只需修改 `config/materials.json`。修改后执行构建，会自动生成对应的 `/products/material/[slug]/` 静态页面。

产品数据校验会在 `npm run build` 前自动执行：

```bash
npm run validate
```

检查内容包括 `materialId` 是否存在、Slug 是否重复、图片和 OG 图片是否存在，以及必填字段是否为空。

如需重新生成当前矢量演示图，执行：

```bash
npm run generate:art
```

## GitHub Pages 部署

1. 推送到 GitHub 的 `main` 分支。
2. 在仓库 `Settings -> Pages -> Build and deployment` 中选择 `GitHub Actions`。
3. 项目站点会默认生成 `NEXT_PUBLIC_SITE_URL=https://<用户>.github.io` 和 `NEXT_PUBLIC_BASE_PATH=/<仓库名>`；如使用自定义域名，再配置这两个变量。
4. 重新运行 `Deploy Next.js to GitHub Pages` 工作流。

生产环境建议绑定自定义域名并开启 HTTPS。`next.config.ts` 已启用：

```ts
output: "export";
trailingSlash: true;
```

这会在 `npm run build` 后生成 `out/`，适配静态托管和 `/products/[slug]/` URL。

## Open Graph 与 WhatsApp 验证

构建后检查：

```bash
npm run build
sed -n '1,120p' out/products/panda-squishy/index.html
```

产品页必须包含：

```html
<meta property="og:title" content="Panda Squishy Toy | Slow Rising Squishy">
<meta property="og:description" content="...">
<meta property="og:image" content="https://your-domain.com/products/panda-squishy/og-image.jpg">
<meta property="og:url" content="https://your-domain.com/products/panda-squishy/">
```

`og:image` 必须是可公开访问的 HTTPS 绝对 URL，尺寸为 1200 × 630。WhatsApp 不会直接加载 `ogImage` 字段，而是先读取产品 URL 返回的 HTML Metadata。

## 上线前检查


- 替换所有演示品牌、联系人、号码和域名
- 将演示商品图替换为真实、统一风格的商品摄影
- 核对每个商品的材质、尺寸、重量、MOQ 和包装信息
- 配置 GA4、Search Console 和 Microsoft Clarity（如需要）
- 在 WhatsApp 中逐个测试首页、Wholesale、OEM 和商品详情 CTA
- 在手机和桌面浏览器测试所有主要路径
