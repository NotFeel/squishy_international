# Squishy International

英文国际捏捏乐产品展示与 WhatsApp 询盘站，使用 Next.js App Router、TypeScript 和静态导出。项目没有购物车、支付、登录、数据库或运行时后端，适合部署到 GitHub Pages。

[English README](./README.en.md) · [文档索引](./docs/README.md)

## 1. 功能概览

- 响应式首页、Wholesale、OEM / ODM、About、FAQ、Contact、Privacy、Terms
- 按材质维护和生成产品分类
- 材质静态页面：`/products/material/<material-id>/`
- 商品名称搜索，只在当前材质内搜索
- 每页 10 / 20 / 50 条分页
- 搜索、分页和每页数量同步到 URL
- 商品详情、SEO Metadata、Product JSON-LD
- 每商品独立 Open Graph 图片
- WhatsApp Click-to-Chat 预填商品名称、SKU 和商品 URL
- GitHub Pages 自动构建与部署
- Excel 产品维护和 Python 批量导入脚本

## 2. 技术栈

| 技术 | 用途 |
|---|---|
| Next.js 16 | App Router 和静态页面生成 |
| React 19 | 页面组件 |
| TypeScript | 类型安全 |
| CSS | 响应式视觉系统 |
| Python 3.10+ | Excel 产品导入 |
| Pillow | 图片转换、压缩和 OG 生成 |
| GitHub Actions | 自动构建与 Pages 部署 |

## 3. 项目结构

```text
squishy_international/
├── app/                          # 页面和动态路由
│   └── products/
│       ├── page.tsx              # 全部产品
│       ├── [slug]/page.tsx       # 商品详情
│       └── material/[slug]/      # 材质分类页
├── components/                   # 公共组件
├── config/
│   └── materials.json            # 材质配置
├── data/
│   ├── products.json             # 产品数据
│   └── backup/                   # 导入自动备份
├── docs/
│   ├── README.md                 # 文档索引与规范
│   ├── zh-CN/                    # 中文操作教程
│   ├── en/                       # English guides
│   └── plans/                    # 历史方案和需求文档
├── import/
│   └── products.xlsx             # 实际导入工作簿
├── public/
│   ├── brand/                    # 品牌图片
│   └── products/<slug>/          # 产品图片和 OG 图片
├── scripts/
│   ├── import_products.py        # Excel 产品导入脚本
│   └── validate-products.mjs     # 构建前数据校验
├── .github/workflows/deploy.yml  # GitHub Pages 部署
├── next.config.ts
├── package.json
└── requirements.txt
```

## 4. 环境要求

- Node.js 20.9+，推荐 Node.js 22
- npm 10+
- Python 3.10+
- Microsoft Excel 或兼容 `.xlsx` 的表格软件
- GitHub 仓库
- GitHub Pages 已启用 GitHub Actions 发布

## 5. 安装项目

### 5.1 macOS

```bash
git clone <repository-url>
cd squishy_international
npm ci
```

创建本地环境变量：

```bash
cp .env.example .env.local
```

### 5.2 Windows PowerShell

```powershell
git clone <repository-url>
cd squishy_international
npm ci
Copy-Item .env.example .env.local
```

如果 PowerShell 执行策略阻止脚本，使用：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## 6. 环境变量

本地文件：

```text
.env.local
```

示例：

```env
NEXT_PUBLIC_BRAND_NAME=Squishy Factory
NEXT_PUBLIC_SITE_URL=https://yourname.github.io
NEXT_PUBLIC_BASE_PATH=/squishy_international
NEXT_PUBLIC_WHATSAPP_PHONE=8613812345678
NEXT_PUBLIC_CONTACT_EMAIL=hello@example.com
NEXT_PUBLIC_LOCATION=Global sourcing, serving worldwide
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Next.js 环境变量优先级：

```text
命令行环境变量
↓
.env.production.local
↓
.env.local
↓
.env.production
↓
.env
```

`.env.example` 不会自动加载。`.env.local` 会覆盖 `.env`。

`NEXT_PUBLIC_*` 会在构建时写入 HTML，修改后必须重新执行 `npm run build`。

## 7. 本地开发

```bash
npm run dev
```

默认打开：

```text
http://localhost:3000
```

常用命令：

```bash
npm run typecheck     # TypeScript 检查
npm run validate      # 产品 JSON、材质和图片校验
npm run build         # 校验 + 静态构建
npm run generate:art  # 重新生成演示矢量资源
```

`npm run build` 的静态结果位于 `out/`。

## 8. 产品维护

产品工作流：

```text
维护 products_import_template_v2.xlsx
↓
复制/保存为 import/products.xlsx
↓
运行 Python 导入脚本 --check
↓
正式导入
↓
生成 data/products.json
↓
生成 public/products/<slug>/
↓
npm run validate
↓
npm run build
↓
Git 提交和部署
```

详细教程：

- [中文产品 Excel 维护与 Python 导入教程](./docs/zh-CN/product-excel-import.md)
- [English Product Excel and Python Import Guide](./docs/en/product-excel-import.md)

## 9. GitHub Pages 部署

工作流：

```text
.github/workflows/deploy.yml
```

部署流程：

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

### 9.1 GitHub 设置

1. 打开仓库 `Settings → Pages`。
2. 将 `Build and deployment → Source` 设置为 `GitHub Actions`。
3. 打开 `Settings → Secrets and variables → Actions → Variables`。
4. 根据实际站点配置变量。

### 9.2 项目站点

如果访问地址为：

```text
https://yourname.github.io/squishy_international/
```

建议配置：

```env
NEXT_PUBLIC_SITE_URL=https://yourname.github.io
NEXT_PUBLIC_BASE_PATH=/squishy_international
```

也可以不配置 `NEXT_PUBLIC_SITE_URL` 和 `NEXT_PUBLIC_BASE_PATH`，工作流会根据仓库名自动计算。

### 9.3 自定义域名

```env
NEXT_PUBLIC_SITE_URL=https://www.yourbrand.com
NEXT_PUBLIC_BASE_PATH=
```

域名 DNS 和 HTTPS 需要在 GitHub Pages 设置中完成。

### 9.4 其他 Actions Variables

| 变量 | 必需 | 说明 |
|---|---:|---|
| `NEXT_PUBLIC_BRAND_NAME` | 建议 | 网站品牌名 |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | 是 | 国际格式号码，不含 `+` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 建议 | 联系邮箱 |
| `NEXT_PUBLIC_LOCATION` | 建议 | Contact 和 Footer 显示的公司地址或业务地区 |
| `NEXT_PUBLIC_GA_ID` | 否 | GA4 Measurement ID |

## 10. 构建与发布

本地构建：

```bash
npm run validate
npm run build
```

提交：

```bash
git status
git diff
git add .
git commit -m "content: update product catalog"
git push
```

推送后打开：

```text
GitHub Repository → Actions → Deploy Next.js to GitHub Pages
```

确认 `build` 和 `deploy` 均成功。

## 11. 上线验收

- [ ] 首页、产品页、材质页均可访问
- [ ] 搜索只在当前材质内执行
- [ ] 10 / 20 / 50 分页正常
- [ ] 商品详情图片正常
- [ ] `og:title`、`og:description`、`og:image` 正确
- [ ] WhatsApp 消息包含商品名和商品 URL
- [ ] sitemap.xml 和 robots.txt 正确
- [ ] GitHub Pages 使用 HTTPS
- [ ] GA4 `click_whatsapp` 事件正常
- [ ] 移动端和桌面端无横向溢出

## 12. 常见问题

### 页面能打开但 JS/CSS 404

检查 `NEXT_PUBLIC_BASE_PATH` 是否与实际 GitHub Pages 路径一致。

### `.env` 修改后没有生效

检查是否存在优先级更高的 `.env.local`，并重新执行构建。

### `npm run build` 校验失败

先运行：

```bash
npm run validate
```

根据错误修复 `data/products.json`、材质配置或图片文件。

### WhatsApp 不显示预览

确认：

- 商品 URL 是公网 HTTPS。
- `og:image` 是绝对 HTTPS URL。
- OG 图片可以直接访问。
- WhatsApp 缓存尚未介入。

## 13. 文档规范

所有项目文档统一放在 `docs/`：

- 中文操作教程：`docs/zh-CN/`
- English guides：`docs/en/`
- 方案、需求和历史设计稿：`docs/plans/`
- 文档总索引：`docs/README.md`

不要把教程散落在项目根目录。根目录只保留语言入口 `README.md`、`README.zh-CN.md` 和 `README.en.md`。
