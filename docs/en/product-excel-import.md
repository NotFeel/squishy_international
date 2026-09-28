# Product Excel Maintenance and Python Import Guide

This guide applies to the `squishy_international` project. Product operators maintain one Excel workbook. The Python importer generates `data/products.json`, product image folders, and Open Graph images.

## 1. Relevant Files

| Path | Purpose |
|---|---|
| `products_import_template_v2.xlsx` | Blank maintenance template |
| `import/products.xlsx` | Working workbook used by the importer |
| `scripts/import_products.py` | Product import script |
| `requirements.txt` | Python dependencies |
| `config/materials.json` | Material master data |
| `data/products.json` | Generated website catalog |
| `data/backup/` | Automatic JSON backups |
| `public/products/<slug>/` | Generated product image directories |

Excel is the maintenance source. `data/products.json` is generated output. Do not edit only `data/products.json`, because a future full import will overwrite it.

## 2. Excel Worksheets

The workbook must include the `Products` worksheet. The template also contains:

- `Instructions`
- `Materials`
- `Field Guide`
- `Example`

The importer reads `Products` by default. The `Example` worksheet is not imported.

## 3. Products Worksheet Fields

### 3.1 Required

| Column | Type | Rule |
|---|---|---|
| `product_id` | Text | Unique ID, such as `SP-001` |
| `slug` | Text | Lowercase letters, numbers, and hyphens only |
| `name` | Text | English product name |
| `short_description` | Text | Short English catalog description |
| `status` | Dropdown | `available`, `preorder`, or `coming_soon` |
| `material_id` | Text | Must exist and be enabled in `config/materials.json` |
| `size` | Text | Product size, such as `5.5 × 4.5 × 5.5 cm` |
| `weight_g` | Number | Product weight in grams |
| `moq_pcs` | Integer | Minimum order quantity in PCS |
| `image_1_cover` | Embedded image | Required |

### 3.2 Recommended

| Column | Type | Description |
|---|---|---|
| `description` | Text | Full English product description |
| `tags` | Text | Comma or semicolon separated |
| `packaging` | Text | Packaging method |
| `oem` | Boolean | OEM availability |
| `featured` | Boolean | Show as featured |
| `new_arrival` | Boolean | New arrival flag |
| `enabled` | Boolean | Enabled flag preserved in generated JSON |
| `carton_dimensions` | Text | Combined dimensions, preferably `55.5 × 40.5 × 38 cm` |
| `carton_qty_pcs` | Integer | PCS per carton; optional |
| `carton_weight_kg` | Number | Gross carton weight; optional |
| `seo_title` | Text | Defaults to product name |
| `seo_description` | Text | Defaults to short description |

Status values:

```text
available   Standard available product
preorder    Pre-order product
coming_soon Coming soon
```

Values such as `pre-order` or `PreOrder` are rejected.

Accepted Boolean values:

```text
TRUE / FALSE
1 / 0
YES / NO
Y / N
是 / 否
有 / 无
```

Carton fields are optional. `carton_dimensions` accepts formats such as `55.5 × 40.5 × 38 cm`, `55.5 x 40.5 x 38`, or `55.5*40.5*38cm`; the importer normalizes the result to `55.5 × 40.5 × 38 cm`. The product detail page shows Carton Dimensions, Carton Quantity, and Carton Gross Weight independently. Any unmaintained value is omitted.

## 4. Product Images

Images must be embedded in cells. Do not enter only a file path as text.

| Excel column | Output file |
|---|---|
| `image_1_cover` | `01-cover.webp` |
| `image_2_front` | `02-front.webp` |
| `image_3_side` | `03-side.webp` |
| `image_4_back` | `04-back.webp` |
| `image_5_squeeze` | `05-squeeze.webp` |
| `image_6_size` | `06-size.webp` |
| `image_7_packaging` | `07-packaging.webp` |

Recommended process:

1. Use `Insert → Pictures → Place in Cell` when available.
2. Place exactly one image in each `image_*` cell.
3. For floating images, keep the top-left anchor inside the correct cell.
4. `image_1_cover` is required.
5. Close Excel before running the importer.

The importer converts images to WebP, limits the long edge to 1600 px, targets approximately 500 KB or less, and generates a 1200 × 630 `og-image.webp` from the cover.

## 5. Material Maintenance

Material master data:

```text
config/materials.json
```

Example:

```json
{
  "id": "gel",
  "name": "Gel",
  "enabled": true,
  "sort": 10
}
```

Use the stable ID in Excel:

```text
Correct: gel
Wrong: Gel
```

Import fails if the material does not exist or is disabled.

## 6. Install Python

### 6.1 Windows PowerShell

```powershell
py -3 --version
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

If script execution is blocked:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
```

You may also call the virtual-environment Python directly:

```powershell
.\.venv\Scripts\python.exe scripts\import_products.py --help
```

CMD:

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

## 7. Validate Only

Place the workbook at `import/products.xlsx`.

### Windows PowerShell

```powershell
python scripts\import_products.py `
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

Expected output:

```text
[OK]   Row 3: SP-001 | needoh-icecubes | images=5 [...]
[PASS] Validation succeeded for 1 products.
[NEXT] Run without --check to generate data/products.json and product images.
```

`--check` does not modify product data or images.

## 8. Formal Import

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

Generated output:

```text
data/products.json
public/products/<slug>/
├── 01-cover.webp
├── 02-front.webp
├── ...
└── og-image.webp
```

The previous `data/products.json` is backed up to:

```text
data/backup/products_YYYYMMDD_HHMMSS.json
```

## 9. Incremental and Full Imports

Default behavior:

- Existing directories with the same slug are updated.
- Directories no longer present in Excel remain unless cleanup is requested.
- `data/products.json` is regenerated from every valid Excel row.

To remove old product directories that are no longer in the workbook:

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

Warning: `--clean-products` deletes existing directories under `public/products/`. Run `--check` first and verify that the workbook contains the complete catalog.

## 10. Build and Verify

```bash
npm run validate
npm run build
```

Check:

```text
data/products.json
public/products/<slug>/01-cover.webp
public/products/<slug>/og-image.webp
out/products/<slug>/index.html
```

Browser checks:

```text
/products/
/products/material/<material-id>/
/products/<slug>/
```

Verify images, material grouping, search, pagination, product URL, and the WhatsApp product link.

## 11. Git Workflow

```bash
git status
git diff -- data/products.json
npm run validate
npm run build
git add data/products.json public/products import/products.xlsx
git commit -m "content: update product catalog"
git push
```

If materials changed:

```bash
git add config/materials.json
```

## 12. Troubleshooting

### Excel file not found

Check the path and filename. macOS paths are case-sensitive.

### Sheet 'Products' not found

Confirm the worksheet name or specify it explicitly:

```bash
python scripts/import_products.py \
  --excel import/products.xlsx \
  --sheet Products
```

### material_id not found

Check `config/materials.json` and use the stable ID in Excel.

### material_id is disabled

Set `"enabled": true` or choose an enabled material.

### embedded image is required

Confirm `image_1_cover` contains an actual embedded image, not a text path.

### Image is not detected

- Use `.xlsx`, not legacy `.xls`.
- Close and save Excel before importing.
- Place the image's top-left anchor inside the correct cell.
- Do not merge image cells.
- Compare with the template's `Example` sheet.

### Carton validation fails

`carton_dimensions` must contain three values greater than zero, such as `55.5 × 40.5 × 38 cm`. Carton quantity and carton weight may be maintained independently.

## 13. Release Checklist

- [ ] `product_id` is unique
- [ ] `slug` is unique
- [ ] `material_id` is enabled
- [ ] Every row has a cover image
- [ ] Carton dimensions are valid and unmaintained carton fields are blank
- [ ] `--check` passes
- [ ] Formal import completes
- [ ] `npm run validate` passes
- [ ] `npm run build` passes
- [ ] `git diff` has been reviewed
- [ ] GitHub Actions deploys successfully
- [ ] Live URLs, images, and WhatsApp messages are verified
