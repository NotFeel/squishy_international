# Squishy International

English product showcase and WhatsApp inquiry website for squishy toys, built with Next.js static export and deployed through GitHub Pages.

面向国际市场的英文捏捏乐产品展示与 WhatsApp 询盘站，使用 Next.js 静态导出并部署到 GitHub Pages。

## Languages / 语言

- [中文项目文档](./README.zh-CN.md)
- [English Project Documentation](./README.en.md)
- [Documentation Index / 文档索引](./docs/README.md)

## Quick Links / 快速入口

- [中文：产品 Excel 维护与 Python 导入教程](./docs/zh-CN/product-excel-import.md)
- [English: Product Excel and Python Import Guide](./docs/en/product-excel-import.md)
- [Catalog Optimization Plan V2](./docs/plans/catalog_optimization_plan_v2.md)
- [Product Import Optimization V2](./docs/plans/product_import_optimization_v2.md)

## What Is Included / 项目内容

- Material-based product catalog and static material routes
- Product-name search scoped to the current material
- Pagination with 10 / 20 / 50 products per page
- Product detail pages, SEO metadata, Product JSON-LD, and Open Graph images
- WhatsApp Click-to-Chat inquiry links
- Excel-based product maintenance and Python import
- GitHub Actions workflow for GitHub Pages

## Quick Commands / 常用命令

```bash
npm ci
npm run dev
npm run validate
npm run build
```

Product import:

```bash
python -m pip install -r requirements.txt
python scripts/import_products.py --excel import/products.xlsx --check
python scripts/import_products.py --excel import/products.xlsx
```

Read the Chinese or English README for Windows and macOS setup details, environment variables, deployment, and release checks.
