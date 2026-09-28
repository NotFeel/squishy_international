# Documentation Index / 文档索引

This directory is the single documentation area for the project.

本目录是项目统一文档区，业务教程、操作手册和方案文档都放在这里。

## Directory Layout / 目录规范

```text
docs/
├── README.md                         # This index / 本索引
├── zh-CN/                            # Chinese guides / 中文教程
│   └── product-excel-import.md
├── en/                               # English guides / 英文教程
│   └── product-excel-import.md
└── plans/                            # Plans and design references / 方案与设计文档
    ├── catalog_optimization_plan_v2.md
    ├── product_import_optimization_v2.md
    ├── squishy_preorder_feature_implementation_plan.md
    ├── require_1.md
    ├── squishy_international_site_design.md
    └── squishy_product_catalog_optimization_plan.md
```

## Root README Files / 根目录入口

```text
README.md          # Bilingual landing page / 双语入口
README.zh-CN.md    # Full Chinese project guide / 中文项目文档
README.en.md       # Full English project guide / 英文项目文档
```

## Guides / 操作教程

| Language | Document |
|---|---|
| 中文 | [产品 Excel 维护与 Python 导入教程](./zh-CN/product-excel-import.md) |
| English | [Product Excel Maintenance and Python Import Guide](./en/product-excel-import.md) |

## Plans / 方案文档

- [Catalog Optimization Plan V2](./plans/catalog_optimization_plan_v2.md)
- [Product Import Optimization V2](./plans/product_import_optimization_v2.md)
- [Pre-Order Feature Implementation Plan](./plans/squishy_preorder_feature_implementation_plan.md)
- [Product Data and Metadata Requirements](./plans/require_1.md)
- [International Site Design](./plans/squishy_international_site_design.md)
- [Catalog Optimization Plan](./plans/squishy_product_catalog_optimization_plan.md)

Plan documents are reference material. They describe intended architecture or historical decisions and may not always match the current implementation.

方案文档用于记录需求和设计决策，可能包含历史版本；当前操作步骤以本索引中的教程和两份 README 为准。

## Naming Rules / 命名规范

- Use lowercase kebab-case file names.
- Chinese tutorials go under `docs/zh-CN/`.
- English tutorials go under `docs/en/`.
- Plans, requirements, and design drafts go under `docs/plans/`.
- Do not place generated deployment files in `docs/`.
- Keep only README language entry files in the repository root.
- Mark superseded documents clearly instead of mixing old and new instructions.

- 文件名使用小写 kebab-case。
- 中文教程统一放在 `docs/zh-CN/`。
- 英文教程统一放在 `docs/en/`。
- 方案、需求和设计稿统一放在 `docs/plans/`。
- `docs/` 不存放构建产物或部署文件。
- 项目根目录只保留 README 语言入口。
- 过期文档必须明确标记，不能和新步骤混写。
