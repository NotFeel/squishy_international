# Squishy Toys 商品“预售”功能新增——详细可执行实施方案

## 1. 需求目标

在现有商品展示站基础上新增“预售（Pre-Order）”产品能力。

本次需求明确：

- 新增产品 `status` 状态字段。
- 支持 `available`、`preorder`、`coming_soon` 三种状态。
- **不增加 `preOrderEndDate`、`expectedDelivery` 等日期字段。**
- 保留现有 `newArrival` 新品字段。
- 保留现有 `featured` 精选字段。
- 新品、预售、精选属于不同维度，可以同时成立。
- 首页直接展示：New Arrivals、Pre-Order、Featured Products。
- 产品总列表支持名称搜索、材质筛选、状态筛选、10/20/50 条分页。
- Excel 继续作为产品主数据维护入口。
- 导入脚本自动把 Excel 数据转换为 `data/products.json`。
- GitHub Pages 继续采用纯静态部署，不增加后端、数据库或支付系统。

## 2. 最终产品数据模型

### 2.1 status：产品状态

```text
available
preorder
coming_soon
```

| status | 含义 | 网站展示 |
|---|---|---|
| available | 正常销售/可询价 | Available |
| preorder | 预售 | Pre-Order |
| coming_soon | 即将推出 | Coming Soon |

### 2.2 newArrival：新品标签

```json
"newArrival": true
```

表示该产品属于新品，与 `status` 无关。例如：

```json
{
  "status": "preorder",
  "newArrival": true
}
```

表示“新品 + 预售”，这是允许的。

### 2.3 featured：精选标签

```json
"featured": true
```

表示该产品属于精选产品，也与 `status`、`newArrival` 独立。

例如：

```json
{
  "status": "preorder",
  "newArrival": true,
  "featured": true
}
```

表示“新品 + 预售 + 精选”。

## 3. 为什么不直接做 `preSale=true`

不建议最终使用：

```json
"preSale": true
```

因为 `available / preorder / coming_soon` 属于互斥的产品状态。使用单独布尔值后，后续容易出现多个状态字段互相矛盾。

因此采用：

```json
"status": "preorder"
```

更清晰，也方便后续扩展。

## 4. Excel 产品维护结构

现有 Excel 增加：

```text
status
```

建议字段顺序：

```text
product_id
slug
name
short_description

status
new_arrival
featured

material_id
tags

size
weight_g
moq_pcs
packaging

carton_length_cm
carton_width_cm
carton_height_cm
carton_qty
carton_weight_kg

image_1_cover
image_2_front
image_3_side
image_4_back
image_5_squeeze
image_6_size
image_7_packaging

seo_title
seo_description
```

## 5. Excel status 下拉配置

`status` 必须使用 Excel 下拉框，可选值：

```text
available
preorder
coming_soon
```

运营人员不要手工填写其他值。

## 6. Excel 示例

### 正常产品

```text
status       = available
new_arrival  = FALSE
featured     = TRUE
```

显示：`FEATURED`

### 新品

```text
status       = available
new_arrival  = TRUE
featured     = FALSE
```

显示：`NEW`

### 新品预售

```text
status       = preorder
new_arrival  = TRUE
featured     = FALSE
```

显示：`NEW` + `PRE-ORDER`

### 预售精选

```text
status       = preorder
new_arrival  = FALSE
featured     = TRUE
```

显示：`PRE-ORDER` + `FEATURED`

### 即将推出新品

```text
status       = coming_soon
new_arrival  = TRUE
featured     = FALSE
```

显示：`NEW` + `COMING SOON`

## 7. products.json 数据结构

```json
{
  "id": "SQ001",
  "slug": "panda-squishy",
  "name": "Panda Squishy Toy",
  "shortDescription": "Cute slow-rising panda squishy toy for stress relief, gifting and wholesale.",
  "status": "available",
  "newArrival": false,
  "featured": true,
  "materialId": "gel",
  "tags": ["panda", "slow-rising", "stress-relief"],
  "size": "10 × 8 × 8 cm",
  "weight": "65 g",
  "moq": "100 pcs",
  "packaging": "OPP Bag / Custom Packaging",
  "images": [
    "/products/panda-squishy/01-cover.webp",
    "/products/panda-squishy/02-front.webp",
    "/products/panda-squishy/03-side.webp"
  ],
  "ogImage": "/products/panda-squishy/og-image.webp",
  "seo": {
    "title": "Panda Squishy Toy | Slow Rising Squishy",
    "description": "Cute slow-rising panda squishy toy for stress relief, gifting and wholesale."
  }
}
```

## 8. TypeScript 类型

`lib/products.ts`：

```ts
export type ProductStatus =
  | "available"
  | "preorder"
  | "coming_soon";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;

  status: ProductStatus;
  newArrival: boolean;
  featured: boolean;

  materialId: string;
  tags: string[];

  size: string;
  weight?: string;
  moq: string;
  packaging?: string;

  images: string[];
  ogImage: string;

  seo: {
    title: string;
    description: string;
  };
}
```

## 9. Python 导入脚本增加 status 校验

```python
VALID_STATUS = {
    "available",
    "preorder",
    "coming_soon",
}
```

读取并校验：

```python
status = normalize_status(row["status"])

if status not in VALID_STATUS:
    errors.append(
        f"{slug}: invalid status '{status}'"
    )
```

如果 Excel 写成 `pre-order`、`PreOrder` 等非标准值，默认报错，不自动猜测。

## 10. 产品卡片 Badge

建议统一由 `ProductBadge.tsx` 管理：

```tsx
{product.newArrival && <Badge>NEW</Badge>}

{product.status === "preorder" && <Badge>PRE-ORDER</Badge>}

{product.status === "coming_soon" && <Badge>COMING SOON</Badge>}

{product.featured && <Badge>FEATURED</Badge>}
```

建议状态 Badge 优先于普通标签，避免图片区域过度拥挤。

## 11. 首页展示

首页建议：

```text
Hero
  ↓
New Arrivals
  ↓
Pre-Order
  ↓
Featured Products
  ↓
Browse by Material
  ↓
All Products
```

每个区域最多展示 8 个产品，并提供进入完整列表的入口。

### New Arrivals

```ts
const newArrivals = products.filter(
  product => product.newArrival
);
```

页面入口：

```text
/products/new-arrivals/
```

### Pre-Order

```ts
const preOrderProducts = products.filter(
  product => product.status === "preorder"
);
```

页面入口：

```text
/products/pre-order/
```

### Featured

```ts
const featuredProducts = products.filter(
  product => product.featured
);
```

## 12. 产品总列表页

`/products/` 顶部提供：

```text
All Products

[ Search products... ]

Status
[ All ] [ Available ] [ Pre-Order ] [ Coming Soon ]

Material
[ All Materials ▼ ]

Show
[ 10 ▼ ]
```

然后显示产品网格和分页。

## 13. 搜索规则

名称搜索只匹配产品名称：

```ts
const matchesSearch = product.name
  .toLowerCase()
  .includes(search.toLowerCase());
```

## 14. 材质 + 状态 + 搜索组合

三个条件可以同时使用：

```ts
const filteredProducts = products.filter(product => {
  const matchesSearch = product.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesMaterial =
    material === "all" ||
    product.materialId === material;

  const matchesStatus =
    status === "all" ||
    product.status === status;

  return matchesSearch && matchesMaterial && matchesStatus;
});
```

例如：

```text
Search: panda
Material: gel
Status: preorder
```

最终只展示同时满足三个条件的产品。

## 15. 分页

分页数量继续支持：

```text
10
20
50
```

正确处理顺序必须是：

```text
全部产品
   ↓
名称搜索
   ↓
材质筛选
   ↓
状态筛选
   ↓
分页
   ↓
页面展示
```

不要先分页再过滤。

```ts
const startIndex = (currentPage - 1) * pageSize;

const pageProducts = filteredProducts.slice(
  startIndex,
  startIndex + pageSize
);
```

当搜索条件、材质、状态或 pageSize 发生变化时，应自动将当前页重置为第 1 页。

## 16. URL 状态同步

推荐将筛选条件同步到 URL：

```text
/products/?status=preorder
```

搜索：

```text
/products/?search=panda&status=preorder
```

材质：

```text
/products/?material=gel
```

组合：

```text
/products/?search=panda&material=gel&status=preorder&page=2
```

这样用户可以直接复制当前页面地址分享。

## 17. 独立新品页面

新增：

```text
app/products/new-arrivals/page.tsx
```

筛选：

```ts
product.newArrival === true
```

页面仍然支持搜索、材质筛选和分页。

## 18. 独立预售页面

新增：

```text
app/products/pre-order/page.tsx
```

筛选：

```ts
product.status === "preorder"
```

页面仍然支持搜索、材质筛选和分页。

页面标题：

```text
PRE-ORDER
Explore squishy toys currently available for pre-order.
```

本次不增加任何预售日期字段。

## 19. 产品详情页

例如：

```text
/products/strawberry-squishy/
```

如果：

```json
{
  "status": "preorder",
  "newArrival": true
}
```

详情页显示：

```text
NEW
PRE-ORDER

Strawberry Squishy Toy

Material: Gel
Size: 10 × 8 × 8 cm
MOQ: 100 pcs

[ Ask About This Product on WhatsApp ]
```

不显示：

```text
Pre-order End Date
Expected Delivery
```

## 20. WhatsApp

正常产品可使用原询盘文案。

预售产品可以根据 `status` 自动把第一句话调整为：

```text
Hi, I'm interested in this pre-order product.
```

然后继续带上：

```text
Product: Strawberry Squishy Toy
Product URL: https://www.example.com/products/strawberry-squishy/

Could you please provide:
1. Wholesale price
2. MOQ
3. Sample information
4. Customization options
5. Production information
6. Shipping information

Thank you.
```

## 21. SEO

新增两个静态页面：

```text
/products/new-arrivals/
/products/pre-order/
```

新品页面可使用：

```text
Title: New Squishy Toys | New Arrivals
```

预售页面可使用：

```text
Title: Pre-Order Squishy Toys | Upcoming Designs
```

description 根据最终品牌名称调整。

## 22. 推荐组件结构

```text
components/
├── ProductCard.tsx
├── ProductGrid.tsx
├── ProductGallery.tsx
├── ProductSpecs.tsx
├── ProductBadge.tsx
├── ProductSearch.tsx
├── ProductFilters.tsx
├── ProductPagination.tsx
└── WhatsAppButton.tsx
```

其中 `ProductBadge` 统一负责 NEW、PRE-ORDER、COMING SOON、FEATURED 的显示规则。

## 23. 推荐数据处理函数

`lib/products.ts`：

```ts
export function getNewArrivals(products: Product[]) {
  return products.filter(product => product.newArrival);
}

export function getPreOrderProducts(products: Product[]) {
  return products.filter(
    product => product.status === "preorder"
  );
}

export function getFeaturedProducts(products: Product[]) {
  return products.filter(product => product.featured);
}

export function getProductsByStatus(
  products: Product[],
  status: ProductStatus
) {
  return products.filter(
    product => product.status === status
  );
}
```

## 24. GitHub Pages 部署不变

仍然使用：

```text
Excel
 ↓
Python Import
 ↓
data/products.json
 ↓
public/products/*
 ↓
git commit / push
 ↓
GitHub Actions
 ↓
Next.js build
 ↓
GitHub Pages
```

不需要后端、数据库或服务器。

## 25. 导入成功输出建议

```text
========================================
 Product Import
========================================

Products:
  ✓ SQ001 panda-squishy
  ✓ SQ002 strawberry-squishy
  ✓ SQ003 bear-squishy

Status:
  available     : 35
  preorder      : 8
  coming_soon   : 3

New Arrivals:
  12

Featured:
  10

Images:
  ✓ 35 products
  ✓ 182 images

JSON:
  ✓ data/products.json

Backup:
  ✓ data/backup/products_20260928_120000.json

========================================
 IMPORT SUCCESS
========================================
```

## 26. 明确不实现

本次预售功能不增加：

```text
preOrderEndDate
expectedDelivery
preOrderStartDate
inventory
stock
price
payment
cart
order
后台管理系统
数据库
用户登录
在线支付
```

继续保持：

```text
Git + Excel + Python + Next.js + GitHub Pages + WhatsApp
```

## 27. 实施顺序

### 第 1 步：Excel

增加 `status` 列和下拉：

```text
available
preorder
coming_soon
```

### 第 2 步：Python

增加 `status` 读取、校验、JSON 输出。

### 第 3 步：TypeScript

增加：

```ts
export type ProductStatus =
  | "available"
  | "preorder"
  | "coming_soon";
```

并给 `Product` 增加：

```ts
status: ProductStatus;
```

### 第 4 步：ProductBadge

统一管理产品状态和标签 Badge。

### 第 5 步：ProductCard

支持 NEW、PRE-ORDER、COMING SOON、FEATURED。

### 第 6 步：首页

增加：

```text
New Arrivals
Pre-Order
Featured Products
```

每个区域最多 8 个产品。

### 第 7 步：产品列表

增加：

```text
Search
Material
Status
Page Size
Pagination
```

### 第 8 步：独立页面

增加：

```text
/products/new-arrivals/
/products/pre-order/
```

### 第 9 步：URL 状态

实现搜索、材质、状态、分页与 URL 参数同步。

### 第 10 步：完整构建

```bash
npm run build
```

确认静态输出至少包含：

```text
out/products/
out/products/new-arrivals/
out/products/pre-order/
out/products/material/
```

## 28. 最终验收标准

### 数据

- [ ] Excel 可以选择 `available`
- [ ] Excel 可以选择 `preorder`
- [ ] Excel 可以选择 `coming_soon`
- [ ] Python 正确读取 status
- [ ] 非法 status 会阻止导入
- [ ] products.json 正确输出 status
- [ ] 不存在 `preOrderEndDate`
- [ ] 不存在 `expectedDelivery`

### 首页

- [ ] New Arrivals 正常展示
- [ ] Pre-Order 正常展示
- [ ] Featured 正常展示
- [ ] 每个区域最多 8 个
- [ ] 没有产品时区域合理隐藏

### 产品列表

- [ ] 名称搜索正常
- [ ] 材质筛选正常
- [ ] Status 筛选正常
- [ ] Search + Material + Status 可以组合
- [ ] 10 条正常
- [ ] 20 条正常
- [ ] 50 条正常
- [ ] 分页正常
- [ ] 筛选后分页自动回到第一页
- [ ] URL 可以保存当前筛选状态

### 产品详情

- [ ] available 产品不显示 PRE-ORDER
- [ ] preorder 产品显示 PRE-ORDER
- [ ] coming_soon 产品显示 COMING SOON
- [ ] newArrival=true 显示 NEW
- [ ] featured=true 可以显示 FEATURED
- [ ] WhatsApp 产品链接正常

### SEO / 静态部署

- [ ] `/products/new-arrivals/` 可访问
- [ ] `/products/pre-order/` 可访问
- [ ] 两个页面有独立 title
- [ ] 两个页面有独立 description
- [ ] 产品详情页 OG 信息正常
- [ ] GitHub Pages 静态构建正常

## 29. 最终架构

```text
                    products.xlsx
                         │
                         ▼
                 Python Import
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Products        Images        Validation
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                  products.json
                         │
                         ▼
                    Next.js
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
 New Arrivals        Pre-Order          Featured
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
                    All Products
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
           Search     Material      Status
                         │
                         ▼
                     Pagination
                         │
                         ▼
                  Product Detail
                         │
                         ▼
                      WhatsApp
```

## 30. 核心设计原则

最终产品数据分成四个清晰维度：

```text
status
    ↓
产品生命周期状态

newArrival
    ↓
新品标签

featured
    ↓
精选标签

materialId
    ↓
材质分类
```

这样预售不会与新品、精选互相冲突；未来新增更多状态或标签时，也不需要重新设计整个产品系统。
