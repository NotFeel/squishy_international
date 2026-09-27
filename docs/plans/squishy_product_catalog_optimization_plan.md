# 捏捏乐国际站产品目录优化——可执行方案

## 1. 需求目标

在现有“Next.js + TypeScript + Tailwind CSS + GitHub Pages 静态部署”的一期项目基础上，完成以下 3 项优化：

1. **取消动物 / 食物 / 人物产品类目**，改为**材质分类**，例如：
   - Gel
   - Flour
   - Maltose
   - Petroleum Jelly
   - Clay

   材质分类不再写死在页面代码中，而是由独立配置文件维护。后续只修改配置文件，重新构建并部署后，页面自动显示新的材质分类。

2. **产品类目页面增加名称搜索框**，只搜索当前材质分类下的产品。

3. **产品页面增加分页**，支持每页显示：**10 / 20 / 50** 条，并提供上一页、下一页和页码。

---

# 2. 最终实现效果

## 2.1 产品分类逻辑

原方案：

```text
Animal
Food
Character
```

调整为：

```text
All Materials
├── Gel
├── Flour
├── Maltose
├── Petroleum Jelly
└── Clay
```

页面中的材质分类全部读取：

```text
config/materials.json
```

不再在 React 页面里直接写：

```ts
['Gel', 'Flour', 'Maltose']
```

这样后续增加：

```text
Silicone
Memory Foam
Slime
```

只需要修改配置文件。

---

# 3. 配置方案：推荐 JSON，不推荐用环境变量维护材质列表

## 3.1 推荐目录

新增：

```text
config/
└── materials.json
```

推荐使用 JSON 的原因：

- 材质是业务数据，不是部署参数。
- 一个项目可能有 5、10、20 个材质，JSON 更适合维护。
- 可以直接提交 Git，修改记录清晰。
- GitHub Pages 是静态站点，构建时把 JSON 编译进页面即可。
- 页面不需要后端即可读取。

## 3.2 关于环境变量

可以使用环境变量保存：

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_WHATSAPP_NUMBER
```

但**不建议使用环境变量保存整个材质分类列表**。

原因是 GitHub Pages 静态导出后，没有运行中的 Node.js 服务。环境变量变化后仍然需要重新 Build + Deploy，无法像数据库后台一样实时生效。

因此本项目建议：

```text
业务分类配置 -> config/materials.json
站点部署参数 -> .env / GitHub Actions Secrets
```

---

# 4. 材质配置文件

文件：

```text
config/materials.json
```

示例：

```json
[
  {
    "id": "gel",
    "name": "Gel",
    "enabled": true,
    "sort": 10
  },
  {
    "id": "flour",
    "name": "Flour",
    "enabled": true,
    "sort": 20
  },
  {
    "id": "maltose",
    "name": "Maltose",
    "enabled": true,
    "sort": 30
  },
  {
    "id": "petroleum-jelly",
    "name": "Petroleum Jelly",
    "enabled": true,
    "sort": 40
  },
  {
    "id": "clay",
    "name": "Clay",
    "enabled": true,
    "sort": 50
  }
]
```

## 4.1 字段说明

| 字段 | 类型 | 用途 |
|---|---|---|
| `id` | string | 稳定标识，供产品数据引用和 URL 使用 |
| `name` | string | 页面实际显示名称 |
| `enabled` | boolean | 是否在前台显示 |
| `sort` | number | 页面显示顺序 |

建议不要用 `name` 作为产品数据关联值，例如不要写：

```json
"material": "Gel"
```

而使用稳定 ID：

```json
"materialId": "gel"
```

这样以后把 `Gel` 改成 `Gel Material`，不会影响产品数据关联。

---

# 5. 材质 TypeScript 类型

新增文件：

```text
lib/materials.ts
```

建议：

```ts
import materialsConfig from "@/config/materials.json";

export interface Material {
  id: string;
  name: string;
  enabled: boolean;
  sort: number;
}

const materials = (materialsConfig as Material[])
  .filter((item) => item.enabled)
  .sort((a, b) => a.sort - b.sort);

export function getAllMaterials(): Material[] {
  return materials;
}

export function getMaterialById(id: string): Material | undefined {
  return materials.find((item) => item.id === id);
}
```

这样页面不直接操作 JSON。

页面统一通过：

```ts
getAllMaterials()
```

获得材质分类。

---

# 6. 产品数据调整

原来的产品数据如果是：

```json
{
  "id": "SQ001",
  "category": "animal-squishy",
  "name": "Panda Squishy Toy"
}
```

修改为：

```json
{
  "id": "SQ001",
  "slug": "panda-squishy",
  "name": "Panda Squishy Toy",
  "materialId": "gel",
  "shortDescription": "Cute slow-rising panda squishy toy for stress relief, gifting and wholesale.",
  "tags": ["panda", "slow-rising", "stress-relief"],
  "material": "PU Foam",
  "size": "10 × 8 × 8 cm",
  "weight": "65 g",
  "moq": "100 pcs",
  "packaging": "OPP Bag / Custom Packaging",
  "oem": true,
  "featured": true,
  "newArrival": true,
  "images": [
    "/products/panda-squishy/01-cover.webp",
    "/products/panda-squishy/02-front.webp",
    "/products/panda-squishy/03-side.webp",
    "/products/panda-squishy/04-back.webp",
    "/products/panda-squishy/05-squeeze.webp",
    "/products/panda-squishy/06-size.webp",
    "/products/panda-squishy/07-packaging.webp"
  ],
  "ogImage": "/products/panda-squishy/og-image.webp",
  "seo": {
    "title": "Panda Squishy Toy | Slow Rising Squishy",
    "description": "Cute slow-rising panda squishy toy for stress relief, gifting and wholesale. OEM and custom packaging available."
  }
}
```

核心变化只有：

```diff
- "category": "animal-squishy"
+ "materialId": "gel"
```

`tags` 可以继续保留用于 SEO 和产品详情描述，但**不再承担产品主类目的职责**。

---

# 7. 产品 TypeScript 类型修改

文件：

```text
lib/products.ts
```

产品接口修改为：

```ts
export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  materialId: string;
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
  ogImage: string;
  seo: {
    title: string;
    description: string;
  };
}
```

新增方法：

```ts
export function getProductsByMaterial(materialId: string): Product[] {
  return productList.filter(
    (product) => product.materialId === materialId
  );
}
```

完整示例：

```ts
import products from "@/data/products.json";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  materialId: string;
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
  ogImage: string;
  seo: {
    title: string;
    description: string;
  };
}

const productList = products as Product[];

export function getAllProducts(): Product[] {
  return productList;
}

export function getProductBySlug(slug: string): Product | undefined {
  return productList.find((product) => product.slug === slug);
}

export function getProductsByMaterial(materialId: string): Product[] {
  return productList.filter(
    (product) => product.materialId === materialId
  );
}
```

---

# 8. 页面 URL 设计

推荐使用 SEO 友好的静态材质分类 URL：

```text
/products/
/products/material/gel/
/products/material/flour/
/products/material/maltose/
/products/material/petroleum-jelly/
/products/material/clay/
```

产品详情继续使用：

```text
/products/panda-squishy/
```

这样有两个层级：

```text
材质分类页
/products/material/gel/

    ↓

产品详情页
/products/panda-squishy/
```

---

# 9. 为什么推荐动态材质分类页面

不要把所有材质都写死：

```text
app/products/material/gel/page.tsx
app/products/material/flour/page.tsx
app/products/material/maltose/page.tsx
```

而是统一使用：

```text
app/products/material/[slug]/page.tsx
```

由配置文件自动生成静态页面。

例如配置增加：

```json
{
  "id": "silicone",
  "name": "Silicone",
  "enabled": true,
  "sort": 60
}
```

重新 Build 后自动生成：

```text
/products/material/silicone/
```

不需要新增 React 页面文件。

---

# 10. 材质分类页面实现

文件：

```text
app/products/material/[slug]/page.tsx
```

代码：

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCatalog from "@/components/ProductCatalog";
import { getAllMaterials, getMaterialById } from "@/lib/materials";
import { getProductsByMaterial } from "@/lib/products";
import { siteConfig } from "@/lib/site";

interface MaterialPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return getAllMaterials().map((material) => ({
    slug: material.id,
  }));
}

export async function generateMetadata({
  params,
}: MaterialPageProps): Promise<Metadata> {
  const { slug } = await params;
  const material = getMaterialById(slug);

  if (!material) {
    return {};
  }

  const title = `${material.name} Squishy Toys`;
  const description = `Browse ${material.name.toLowerCase()} squishy toys available for wholesale, gifting and custom projects.`;
  const url = `${siteConfig.url}/products/material/${material.id}/`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteConfig.name,
    },
  };
}

export default async function MaterialProductsPage({
  params,
}: MaterialPageProps) {
  const { slug } = await params;
  const material = getMaterialById(slug);

  if (!material) {
    notFound();
  }

  const products = getProductsByMaterial(material.id);
  const materials = getAllMaterials();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
          Material
        </p>
        <h1 className="text-3xl font-bold">
          {material.name} Squishy Toys
        </h1>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <a
          href="/products/"
          className="rounded-full border px-4 py-2 text-sm"
        >
          All Materials
        </a>

        {materials.map((item) => (
          <a
            key={item.id}
            href={`/products/material/${item.id}/`}
            className={`rounded-full border px-4 py-2 text-sm ${
              item.id === material.id ? "font-semibold" : ""
            }`}
          >
            {item.name}
          </a>
        ))}
      </div>

      <ProductCatalog products={products} />
    </main>
  );
}
```

说明：

- 分类页的产品列表由 `materialId` 决定。
- 分类按钮全部来自 `materials.json`。
- `generateStaticParams()` 确保 GitHub Pages 构建时生成所有材质页面。
- 页面搜索与分页不需要后端。

---

# 11. 全部产品页面

文件：

```text
app/products/page.tsx
```

这里展示全部产品 + 全部材质入口：

```tsx
import ProductCatalog from "@/components/ProductCatalog";
import { getAllMaterials } from "@/lib/materials";
import { getAllProducts } from "@/lib/products";

export default function ProductsPage() {
  const materials = getAllMaterials();
  const products = getAllProducts();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
          Product Catalog
        </p>
        <h1 className="text-3xl font-bold">Squishy Toys</h1>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <a
          href="/products/"
          className="rounded-full border px-4 py-2 text-sm font-semibold"
        >
          All Materials
        </a>

        {materials.map((material) => (
          <a
            key={material.id}
            href={`/products/material/${material.id}/`}
            className="rounded-full border px-4 py-2 text-sm"
          >
            {material.name}
          </a>
        ))}
      </div>

      <ProductCatalog products={products} />
    </main>
  );
}
```

---

# 12. 名称搜索 + 分页组件

新增 / 修改：

```text
components/ProductCatalog.tsx
```

该组件负责：

```text
输入名称
  ↓
过滤当前页面传入的 products
  ↓
计算总数
  ↓
计算总页数
  ↓
按 pageSize 截取
  ↓
显示产品卡片
```

建议实现为 Client Component，因为搜索框和分页需要浏览器交互。

完整示例：

```tsx
"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/products";

interface ProductCatalogProps {
  products: Product[];
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function ProductCatalog({ products }: ProductCatalogProps) {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return products;
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(normalizedKeyword)
    );
  }, [keyword, products]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / pageSize)
  );

  const safePage = Math.min(page, totalPages);

  const currentProducts = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, safePage, pageSize]);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const startItem = filteredProducts.length === 0
    ? 0
    : (safePage - 1) * pageSize + 1;

  const endItem = Math.min(
    safePage * pageSize,
    filteredProducts.length
  );

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <label
            htmlFor="product-search"
            className="mb-2 block text-sm font-medium"
          >
            Search by product name
          </label>

          <input
            id="product-search"
            type="search"
            value={keyword}
            onChange={(event) => handleKeywordChange(event.target.value)}
            placeholder="Search product name..."
            className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm whitespace-nowrap">
            Show
          </label>

          <select
            id="page-size"
            value={pageSize}
            onChange={(event) =>
              handlePageSizeChange(Number(event.target.value))
            }
            className="rounded-xl border px-3 py-3"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <span className="text-sm text-gray-500">per page</span>
        </div>
      </div>

      <div className="mb-5 text-sm text-gray-500">
        {filteredProducts.length === 0
          ? "0 products"
          : `Showing ${startItem}-${endItem} of ${filteredProducts.length} products`}
      </div>

      {currentProducts.length === 0 ? (
        <div className="rounded-2xl border p-12 text-center text-gray-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {currentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <span className="text-sm text-gray-500">
            Page {safePage} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={safePage <= 1}
              className="rounded-xl border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`min-w-10 rounded-xl border px-3 py-2 ${
                    pageNumber === safePage ? "font-semibold" : ""
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={safePage >= totalPages}
              className="rounded-xl border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
```

---

# 13. 搜索行为要求

用户进入：

```text
/products/material/gel/
```

该页面只有 Gel 产品。

例如共有：

```text
48 个 Gel 产品
```

搜索：

```text
Panda
```

结果只在这 48 个 Gel 产品中匹配：

```text
Panda Squishy Toy
Panda Bear Slow Rising Toy
Panda Stress Ball
```

**不会搜索 Flour / Clay 等其他分类。**

## 13.1 搜索字段

当前需求明确为：

```text
产品名称 name
```

匹配方式：

```ts
product.name.toLowerCase().includes(keyword.toLowerCase())
```

暂时不要把：

```text
tag
description
material
```

混到名称搜索里，保持搜索语义明确。

后续需要增强搜索时，再单独增加“关键词搜索”。

---

# 14. 分页规则

## 14.1 页大小

固定三个选项：

```text
10
20
50
```

默认：

```text
10
```

## 14.2 页码变化

例如 67 个产品：

```text
10 / page -> 7 pages
20 / page -> 4 pages
50 / page -> 2 pages
```

## 14.3 搜索后自动回到第一页

例如用户当前在：

```text
Page 5
```

然后输入：

```text
Panda
```

必须自动：

```text
Page 1
```

否则可能出现：

```text
Panda 只有 2 个产品
Page 5
No products found
```

所以搜索变化时必须：

```ts
setPage(1);
```

## 14.4 切换每页数量自动回第一页

例如：

```text
当前：20 / page，Page 4
```

切换：

```text
50 / page
```

自动：

```text
Page 1
```

---

# 15. 产品分类导航自动读取配置

可以抽出公共组件：

```text
components/MaterialNav.tsx
```

建议：

```tsx
import Link from "next/link";
import { getAllMaterials } from "@/lib/materials";

export default function MaterialNav({
  activeId,
}: {
  activeId?: string;
}) {
  const materials = getAllMaterials();

  return (
    <nav className="mb-8 flex flex-wrap gap-2">
      <Link
        href="/products/"
        className={`rounded-full border px-4 py-2 text-sm ${
          !activeId ? "font-semibold" : ""
        }`}
      >
        All Materials
      </Link>

      {materials.map((material) => (
        <Link
          key={material.id}
          href={`/products/material/${material.id}/`}
          className={`rounded-full border px-4 py-2 text-sm ${
            activeId === material.id ? "font-semibold" : ""
          }`}
        >
          {material.name}
        </Link>
      ))}
    </nav>
  );
}
```

这样分类页面不会重复写导航代码。

---

# 16. 推荐最终项目结构

优化后建议目录如下：

```text
squishy-website/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── products/
│       ├── page.tsx
│       ├── [slug]/
│       │   └── page.tsx
│       └── material/
│           └── [slug]/
│               └── page.tsx
│
├── components/
│   ├── MaterialNav.tsx
│   ├── ProductCard.tsx
│   ├── ProductCatalog.tsx
│   ├── ProductGallery.tsx
│   ├── ProductSpecs.tsx
│   └── WhatsAppButton.tsx
│
├── config/
│   └── materials.json
│
├── data/
│   └── products.json
│
├── lib/
│   ├── materials.ts
│   ├── products.ts
│   ├── site.ts
│   └── whatsapp.ts
│
├── public/
│   ├── brand/
│   │   └── logo.webp
│   └── products/
│       └── ...
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

# 17. 已有代码需要清理的地方

需要全局搜索并删除 / 替换以下旧逻辑：

```text
animal
food
character
animal-squishy
food-squishy
character-squishy
category
```

重点检查：

```text
首页分类导航
产品列表页
产品卡片
筛选组件
产品详情页
SEO metadata
sitemap
产品 JSON
```

其中：

```text
category
```

如果只用于旧的动物 / 食物 / 人物分类，则删除。

如果某些代码只是为了标签展示，可以改成：

```text
tags
```

不要把 `category` 留下来与 `materialId` 并行承担相同职责，否则后续维护容易出现分类冲突。

---

# 18. SEO 建议

## 18.1 材质分类页标题

例如：

```text
Gel Squishy Toys | Your Brand
```

或者：

```text
Gel Squishy Toys Wholesale | Your Brand
```

## 18.2 产品页标题

继续使用：

```text
Panda Squishy Toy | Slow Rising Squishy | Your Brand
```

## 18.3 材质分类页描述

例如：

```text
Browse Gel squishy toys available for wholesale, gifting and custom projects.
```

## 18.4 产品分类页不要把搜索关键词拼到 Title

例如用户输入：

```text
panda
```

不要动态生成：

```text
Panda Gel Squishy Toys
```

作为 SEO canonical 页面标题。

搜索只是用户界面过滤，不应产生大量索引页面。

---

# 19. 推荐是否把搜索 / 分页同步到 URL

建议一期就做 URL 状态同步，但不要为每一个搜索结果生成静态页面。

例如：

```text
https://www.yourbrand.com/products/material/gel/?q=panda&page=1&pageSize=20
```

其中：

```text
q        -> 搜索关键字
page     -> 当前页
pageSize -> 每页条数
```

优点：

- 刷新页面后状态可以保留。
- 用户可以复制结果 URL。
- 浏览器前进 / 后退更自然。
- 不需要后台。

注意：

**材质分类本身仍然使用静态路径：**

```text
/products/material/gel/
```

查询参数只用于前端交互状态。

---

# 20. URL 状态同步的实现方式

如果需要支持：

```text
?q=panda&page=2&pageSize=20
```

建议 `ProductCatalog.tsx` 使用：

```tsx
useSearchParams
useRouter
```

核心逻辑：

```ts
const searchParams = useSearchParams();
const router = useRouter();

const keyword = searchParams.get("q") ?? "";
const page = Number(searchParams.get("page") ?? "1");
const pageSize = Number(searchParams.get("pageSize") ?? "10");
```

当搜索变化：

```ts
const params = new URLSearchParams(searchParams.toString());
params.set("q", value);
params.set("page", "1");
router.replace(`?${params.toString()}`);
```

切换 pageSize：

```ts
const params = new URLSearchParams(searchParams.toString());
params.set("pageSize", String(size));
params.set("page", "1");
router.replace(`?${params.toString()}`);
```

翻页：

```ts
const params = new URLSearchParams(searchParams.toString());
params.set("page", String(pageNumber));
router.push(`?${params.toString()}`);
```

如果采用 `useSearchParams()`，生产构建时应给使用它的 Client Component 增加 `Suspense` 边界，避免静态导出构建时出现预渲染相关问题。

如果一期更强调实现速度，也可以先使用纯 `useState`，后续再补 URL 状态同步。

---

# 21. 分页按钮数量优化

如果未来产品达到几百甚至几千个，不建议直接渲染：

```text
1 2 3 4 5 6 7 8 9 10 11 12 ... 100
```

建议使用：

```text
Previous  1  2  3  ...  8  9  10  Next
```

一期产品数量如果只有几十 / 几百，直接显示全部页码即可。

建议预留一个分页工具函数：

```text
lib/pagination.ts
```

后续再优化视觉与页码折叠逻辑。

---

# 22. 性能方案

由于项目部署在 GitHub Pages：

```text
静态 HTML + JS + 图片
```

搜索与分页全部在浏览器完成。

数据流程：

```text
Build
  ↓
products.json
  ↓
Next.js Static Export
  ↓
HTML / JS
  ↓
Browser
  ↓
名称搜索
  ↓
分页
```

一期不需要：

```text
API
数据库
Redis
Java 后端
Node 服务
```

### 数据量建议

如果只有：

```text
100 ~ 1000 个产品
```

客户端过滤 + 分页完全可以采用这个方案。

如果后续超过几万条产品，应该再考虑服务端搜索、索引或第三方搜索服务。但这不属于一期范围。

---

# 23. Git 管理方式

后续维护流程：

## 增加材质

只修改：

```text
config/materials.json
```

然后新增产品：

```text
data/products.json
```

并把产品图片放到：

```text
public/products/<slug>/
```

提交 Git：

```bash
git add config/materials.json data/products.json public/products/
git commit -m "feat: add new material and products"
git push origin main
```

GitHub Actions 自动：

```text
Checkout
  ↓
npm ci
  ↓
npm run build
  ↓
Next.js static export
  ↓
GitHub Pages deploy
```

---

# 24. 验收标准

## 24.1 材质配置

验收：

```text
修改 config/materials.json
```

例如增加：

```json
{
  "id": "silicone",
  "name": "Silicone",
  "enabled": true,
  "sort": 60
}
```

重新部署后，页面必须自动出现：

```text
Silicone
```

并且能够打开：

```text
/products/material/silicone/
```

无需修改 React 页面文件。

## 24.2 禁用材质

将：

```json
"enabled": false
```

重新部署后：

- 分类导航中不显示。
- 不生成该材质分类页面。

对于已经存在、但被禁用的产品，如果产品仍引用该材质，建议发布前校验数据并在构建日志中给出警告；一期至少应确保不会因为错误引用导致整个页面报错。

## 24.3 当前材质搜索

进入：

```text
/products/material/gel/
```

搜索：

```text
Panda
```

只能返回 `materialId = gel` 的产品。

## 24.4 分页

下拉框必须出现：

```text
10
20
50
```

切换后产品数量正确变化。

## 24.5 搜索 + 分页组合

必须同时正确：

```text
材质 = Gel
关键词 = Panda
每页 = 20
```

结果必须是：

```text
Gel 产品
    ↓
名称包含 Panda
    ↓
分页 20 条
```

而不是先分页后搜索。

正确处理顺序：

```text
material filter
      ↓
name search
      ↓
pagination
```

---

# 25. 数据一致性校验建议

由于产品数据全部由 JSON 管理，建议增加一个构建前校验脚本。

例如：

```text
scripts/validate-products.mjs
```

检查：

1. 产品 `materialId` 是否存在于 `materials.json`。
2. 产品 `slug` 是否重复。
3. 产品图片是否存在。
4. 必填字段是否为空。

例如检测：

```text
Product SQ001 references unknown materialId: abc
```

构建直接失败，可以避免线上产品没有分类。

推荐 package.json：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "npm run validate && next build",
    "validate": "node scripts/validate-products.mjs"
  }
}
```

这是静态站非常值得增加的一层保护，因为没有后台帮你校验商品数据。

---

# 26. 构建前校验脚本示例

`scripts/validate-products.mjs`

```js
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const materialsPath = path.join(root, "config/materials.json");
const productsPath = path.join(root, "data/products.json");

const materials = JSON.parse(fs.readFileSync(materialsPath, "utf8"));
const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));

const materialIds = new Set(materials.map((item) => item.id));
const productSlugs = new Set();

for (const product of products) {
  if (!product.id) {
    throw new Error(`Product missing id`);
  }

  if (!product.slug) {
    throw new Error(`Product ${product.id} missing slug`);
  }

  if (productSlugs.has(product.slug)) {
    throw new Error(`Duplicate product slug: ${product.slug}`);
  }

  productSlugs.add(product.slug);

  if (!product.materialId) {
    throw new Error(
      `Product ${product.id} missing materialId`
    );
  }

  if (!materialIds.has(product.materialId)) {
    throw new Error(
      `Product ${product.id} references unknown materialId: ${product.materialId}`
    );
  }

  for (const image of product.images ?? []) {
    const imagePath = path.join(root, "public", image.replace(/^\//, ""));

    if (!fs.existsSync(imagePath)) {
      throw new Error(
        `Product ${product.id} image not found: ${image}`
      );
    }
  }
}

console.log(
  `Validation passed: ${products.length} products, ${materials.length} materials.`
);
```

---

# 27. 第一阶段最终业务架构

最终整体关系：

```text
                     config/materials.json
                              │
                              ▼
                     getAllMaterials()
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
       MaterialNav                     generateStaticParams
             │                                 │
             ▼                                 ▼
      材质分类导航                     静态生成分类页面
                                               │
                                               ▼
                                      /products/material/gel/
                                               │
                                               ▼
                                     getProductsByMaterial()
                                               │
                                               ▼
                                        ProductCatalog
                                               │
                         ┌─────────────────────┼──────────────────┐
                         ▼                     ▼                  ▼
                       搜索                  分页              ProductCard
                         │                     │                  │
                         └──────────────┬──────┘                  ▼
                                        ▼                    Product Detail
                                   浏览器前端                    │
                                                              ▼
                                                        WhatsApp
```

---

# 28. 推荐实施顺序

## 第 1 步：迁移数据模型

先修改：

```text
products.json
```

把：

```text
category
```

改成：

```text
materialId
```

同时建立：

```text
config/materials.json
```

并保证每一个产品都有合法 `materialId`。

## 第 2 步：增加材料数据层

新增：

```text
lib/materials.ts
```

统一读取和排序材质。

## 第 3 步：修改产品路由

增加：

```text
app/products/material/[slug]/page.tsx
```

使用 `generateStaticParams()` 自动生成材质页。

## 第 4 步：统一分类导航

增加：

```text
components/MaterialNav.tsx
```

所有页面都从配置文件获取分类。

## 第 5 步：实现搜索

增加 / 修改：

```text
components/ProductCatalog.tsx
```

完成：

```text
名称搜索
```

## 第 6 步：实现分页

同一个组件完成：

```text
10 / 20 / 50
```

## 第 7 步：增加数据校验

新增：

```text
scripts/validate-products.mjs
```

并让：

```text
npm run build
```

先校验，再执行 Next.js Build。

## 第 8 步：GitHub Pages 验证

验证：

```bash
npm run validate
npm run build
```

确认：

```text
out/products/index.html
out/products/material/gel/index.html
out/products/material/flour/index.html
out/products/panda-squishy/index.html
```

均存在。

---

# 29. 本次优化涉及的文件清单

### 新增

```text
config/materials.json
lib/materials.ts
components/MaterialNav.tsx
components/ProductCatalog.tsx
app/products/material/[slug]/page.tsx
scripts/validate-products.mjs
```

### 修改

```text
data/products.json
lib/products.ts
app/products/page.tsx
```

### 可能需要检查

```text
app/page.tsx
components/ProductCard.tsx
app/products/[slug]/page.tsx
app/sitemap.ts
```

---

# 30. 一期不做的内容

本次需求只处理产品目录体验，不引入后端。

暂不增加：

```text
购物车
在线支付
用户登录
产品数据库
后台管理系统
服务端搜索
Redis
搜索引擎服务
```

WhatsApp 询价逻辑继续沿用现有方案：

```text
Product Detail
     ↓
Ask About This Product
     ↓
wa.me
     ↓
预填产品名称 + 产品 URL
     ↓
WhatsApp
```

---

# 31. 最终推荐

本项目的一期目录模型最终固定为：

```text
配置文件：
config/materials.json

产品字段：
materialId

分类路由：
/products/material/[slug]/

搜索：
当前材质下按 product.name 搜索

分页：
10 / 20 / 50

部署：
Next.js static export + GitHub Pages

数据源：
JSON + Git

后端：
无
```

这样后续最常见的运营动作就是：

```text
新增一个材质
    ↓
修改 materials.json
    ↓
新增产品并填写 materialId
    ↓
提交 Git
    ↓
GitHub Actions 自动构建
    ↓
新材质分类页自动出现
```

整个流程不需要再改页面代码。
