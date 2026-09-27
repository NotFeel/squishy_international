# 产品导入 V2 可执行方案

## 目标

将产品运维收敛为一个 Excel 文件：

- 产品数据由 `Products` Sheet 维护。
- 产品图片直接嵌入对应的 `image_*` 单元格。
- `slug` 唯一决定产品目录。
- Python 脚本从 `.xlsx` 中提取嵌入图片，不要求运维人员单独建立图片文件夹或改文件名。
- 导入后生成 `data/products.json` 和 `public/products/<slug>/...`。
- 图片统一转 WebP、限制最大尺寸、尽量控制体积，并生成 1200×630 OG 图。

## Excel

核心字段：

`product_id`、`slug`、`name`、`short_description`、`material_id`、`size`、`weight_g`、`moq_pcs`、`image_1_cover`

推荐字段：

包装、OEM、精选、新品、上下架、箱规、SEO、标签

图片列：

`image_1_cover` ~ `image_7_packaging`

## 图片映射

| Excel 图片列 | 输出 |
|---|---|
| image_1_cover | 01-cover.webp |
| image_2_front | 02-front.webp |
| image_3_side | 03-side.webp |
| image_4_back | 04-back.webp |
| image_5_squeeze | 05-squeeze.webp |
| image_6_size | 06-size.webp |
| image_7_packaging | 07-packaging.webp |

## 导入安全

正式导入前建议始终执行：

```bash
python scripts/import_products.py --excel import/products.xlsx --check
```

正式导入会备份已有 `data/products.json`。

## 运行

```bash
python -m pip install -r requirements.txt

python scripts/import_products.py \
  --excel import/products.xlsx \
  --project-root . \
  --check

python scripts/import_products.py \
  --excel import/products.xlsx \
  --project-root .
```

## 注意事项

Excel 插图应尽量使用 `Place in Cell`；如果使用普通浮动图片，图片左上角必须落在目标图片单元格内。

Excel 文件可以直接复制给运维人员使用，不需要额外图片目录。

