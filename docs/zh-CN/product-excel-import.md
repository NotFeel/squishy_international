# 产品 Excel 维护与 Python 导入教程

本文档适用于 `squishy_international` 项目。运营人员只维护 Excel，导入脚本负责生成 `data/products.json`、产品图片目录和 OG 分享图。

## 1. 相关文件

| 路径 | 用途 |
|---|---|
| `products_import_template_v2.xlsx` | 空白维护模板 |
| `import/products.xlsx` | 实际待导入工作簿，可自行复制模板后使用 |
| `scripts/import_products.py` | 产品导入脚本 |
| `requirements.txt` | Python 依赖 |
| `config/materials.json` | 材质主数据 |
| `data/products.json` | 导入后生成的网站产品数据 |
| `data/backup/` | 正式导入前自动生成的历史 JSON 备份 |
| `public/products/<slug>/` | 导入后生成的商品图片目录 |

Excel 是产品维护源文件，`data/products.json` 是生成结果。不要只修改 `data/products.json`，否则下次完整导入会覆盖手工修改。

## 2. Excel 工作表说明

工作簿必须包含 `Products` 工作表。模板还包含：

- `Instructions`：操作说明
- `Materials`：材质参考
- `Field Guide`：字段解释
- `Example`：图片插入示例

导入脚本默认读取：

```text
Products
```

`Example` 工作表不会被导入。

## 3. Products 表字段

### 3.1 必填字段

| 列名 | 类型 | 规则 |
|---|---|---|
| `product_id` | 文本 | 每个产品唯一，例如 `SP-001` |
| `slug` | 文本 | 只能使用小写字母、数字和连字符 |
| `name` | 文本 | 英文商品名 |
| `short_description` | 文本 | 卡片和摘要使用的英文短描述 |
| `material_id` | 文本 | 必须存在于 `config/materials.json`，且必须为启用状态 |
| `size` | 文本 | 产品尺寸，例如 `5.5 × 4.5 × 5.5 cm` |
| `weight_g` | 数字 | 产品重量，单位克 |
| `moq_pcs` | 整数 | 最小起订量，单位 PCS |
| `image_1_cover` | 单元格图片 | 必须存在 |

### 3.2 推荐字段

| 列名 | 类型 | 说明 |
|---|---|---|
| `description` | 文本 | 完整英文描述 |
| `tags` | 文本 | 使用中英文逗号或分号分隔 |
| `packaging` | 文本 | 包装方式 |
| `oem` | 布尔值 | 是否支持 OEM |
| `featured` | 布尔值 | 是否首页精选 |
| `new_arrival` | 布尔值 | 是否新品 |
| `enabled` | 布尔值 | 是否启用；当前导入会保留该值 |
| `carton_dimensions` | 文本 | 外箱长宽高，推荐格式 `55.5 × 40.5 × 38 cm` |
| `carton_qty_pcs` | 整数 | 每箱 PCS，可选 |
| `carton_weight_kg` | 数字 | 每箱毛重 kg，可选 |
| `seo_title` | 文本 | 留空时默认为商品名 |
| `seo_description` | 文本 | 留空时默认为短描述 |

布尔值支持：

```text
TRUE / FALSE
1 / 0
YES / NO
Y / N
是 / 否
有 / 无
```

箱规字段均为可选。`carton_dimensions` 支持 `55.5 × 40.5 × 38 cm`、`55.5 x 40.5 x 38`、`55.5*40.5*38cm`，导入时会统一规范为 `55.5 × 40.5 × 38 cm`。商品详情页会分别展示 Carton Dimensions、Carton Quantity 和 Carton Gross Weight；没有维护的字段不会显示。

## 4. 图片维护

图片必须嵌入单元格，不能只在单元格中写文件名。

图片列与输出文件名：

| Excel 列 | 输出文件 |
|---|---|
| `image_1_cover` | `01-cover.webp` |
| `image_2_front` | `02-front.webp` |
| `image_3_side` | `03-side.webp` |
| `image_4_back` | `04-back.webp` |
| `image_5_squeeze` | `05-squeeze.webp` |
| `image_6_size` | `06-size.webp` |
| `image_7_packaging` | `07-packaging.webp` |

推荐操作：

1. 在 Excel 中选择 `Insert → Pictures → Place in Cell`。
2. 每个 `image_*` 单元格只放一张图片。
3. 使用普通浮动图片时，图片左上角必须位于对应的 `image_*` 单元格内。
4. `image_1_cover` 必须存在。
5. 其他图片可以留空。
6. 保存并关闭 Excel 后再执行导入脚本。

脚本会自动：

- 将图片转换为 WebP。
- 最大边长限制为 1600 px。
- 尽量将单张图片控制在 500 KB 以下。
- 从封面生成 `og-image.webp`。
- 将 OG 图片调整为 1200 × 630。

## 5. 材质维护

材质配置：

```text
config/materials.json
```

示例：

```json
{
  "id": "gel",
  "name": "Gel",
  "enabled": true,
  "sort": 10
}
```

Excel 中填写 `material_id`，不要填写显示名称：

```text
正确：gel
错误：Gel
```

如果材质不存在或 `enabled` 为 `false`，导入会失败。

新增材质的标准流程：

1. 修改 `config/materials.json`。
2. 设置唯一 `id`、英文 `name`、`enabled` 和 `sort`。
3. 在 Excel 中使用该 `id`。
4. 重新执行导入和构建。

## 6. 安装 Python 环境

### 6.1 Windows

推荐使用 PowerShell。要求 Python 3.10 或更高版本。

```powershell
py -3 --version
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

如果 PowerShell 禁止执行激活脚本：

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

也可以不激活虚拟环境，直接使用：

```powershell
.\.venv\Scripts\python.exe scripts\import_products.py --help
```

CMD 用户可以使用：

```bat
py -3 -m venv .venv
.venv\Scripts\activate.bat
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### 6.2 macOS

```bash
python3 --version
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

如果同时维护 Node.js，请确保 `npm` 命令也可用。

## 7. 第一步：只校验，不修改文件

先把 Excel 放到：

```text
import/products.xlsx
```

### Windows PowerShell

```powershell
python scripts\import_products.py `
  --excel import\products.xlsx `
  --project-root . `
  --check
```

或者不激活虚拟环境：

```powershell
.\.venv\Scripts\python.exe scripts\import_products.py `
  --excel import\products.xlsx `
  --project-root . `
  --check
```

### macOS

```bash
python scripts/import_products.py \
  --excel import/products.xlsx \
  --project-root . \
  --check
```

成功输出示例：

```text
[OK]   Row 3: SP-001 | needoh-icecubes | images=5 [...]
[PASS] Validation succeeded for 1 products.
[NEXT] Run without --check to generate data/products.json and product images.
```

`--check` 不会修改 JSON 或产品图片，正式导入前必须先执行。

## 8. 第二步：正式导入

确认校验通过后执行：

### Windows PowerShell

```powershell
python scripts\import_products.py `
  --excel import\products.xlsx `
  --project-root .
```

### macOS

```bash
python scripts/import_products.py \
  --excel import/products.xlsx \
  --project-root .
```

脚本会生成：

```text
data/products.json
public/products/<slug>/
├── 01-cover.webp
├── 02-front.webp
├── ...
└── og-image.webp
```

已有 `data/products.json` 会先备份为：

```text
data/backup/products_YYYYMMDD_HHMMSS.json
```

## 9. 增量导入与完整替换

默认导入逻辑：

- 已存在的同 `slug` 商品目录会被更新。
- Excel 中已删除、但已不在 Excel 中的旧目录不会自动删除。
- `data/products.json` 永远按当前 Excel 全部有效行重新生成。

如果要完整替换整个产品目录，并清掉不在当前 Excel 中的旧图片目录，可以执行：

### Windows PowerShell

```powershell
python scripts\import_products.py `
  --excel import\products.xlsx `
  --project-root . `
  --clean-products
```

### macOS

```bash
python scripts/import_products.py \
  --excel import/products.xlsx \
  --project-root . \
  --clean-products
```

重要：`--clean-products` 会删除 `public/products/` 下的现有商品目录。必须先执行 `--check`，并确认 Excel 包含完整产品列表。

## 10. 导入后的项目验证

```bash
npm run validate
npm run build
```

检查以下内容：

```text
data/products.json
public/products/<slug>/01-cover.webp
public/products/<slug>/og-image.webp
out/products/<slug>/index.html
```

浏览器检查：

```text
/products/
/products/material/<material-id>/
/products/<slug>/
```

重点检查：

- URL 是否正常
- 图片是否显示
- 材质分类是否正确
- 搜索和分页是否正常
- WhatsApp 商品链接是否包含正确的商品 URL与图片信息

## 11. Git 提交流程

```bash
git status
git diff -- data/products.json
npm run validate
npm run build
git add data/products.json public/products import/products.xlsx
git commit -m "content: update product catalog"
git push
```

如果修改了材质：

```bash
git add config/materials.json
```

## 12. 常见错误

### Excel file not found

检查路径和文件名，路径区分大小写的情况在 macOS 上尤其明显。

### Sheet 'Products' not found

确认默认工作表名称确实是 `Products`，或者显式指定：

```bash
python scripts/import_products.py \
  --excel import/products.xlsx \
  --sheet Products
```

### material_id not found

检查：

```text
config/materials.json
```

确保 Excel 中填写的是稳定的 `id`。

### material_id is disabled

将材质改为：

```json
"enabled": true
```

或者换用已启用材质。

### embedded image is required

确认 `image_1_cover` 是真正的单元格嵌入图片，不是文件路径文本。

### 图片放入后脚本没有读取

- 使用 `.xlsx`，不要使用旧版 `.xls`。
- 关闭 Excel 后重新保存。
- 确认图片左上角在正确单元格。
- 不要合并图片单元格。
- 使用模板中的 `Example` 工作表检查操作方式。

### 箱规校验失败

`carton_dimensions` 必须包含三个大于 0 的尺寸值，例如 `55.5 × 40.5 × 38 cm`。只维护箱重或只维护外箱数量也是允许的。

## 13. 上线前检查清单

- [ ] `product_id` 唯一
- [ ] `slug` 唯一
- [ ] `material_id` 已启用
- [ ] 每行至少包含封面图片
- [ ] 箱规字段格式正确，未维护的字段保持为空
- [ ] `--check` 通过
- [ ] 正式导入完成
- [ ] `npm run validate` 通过
- [ ] `npm run build` 通过
- [ ] `git diff` 已人工检查
- [ ] GitHub Actions 部署成功
- [ ] 线上商品 URL、图片和 WhatsApp 消息已验证
