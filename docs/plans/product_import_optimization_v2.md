# Squishy Toys Factory — Product Import V2

This V2 workflow uses one Excel workbook as the product maintenance source.

## What the operator maintains

Open `products_import_template_v2.xlsx` and use the `Products` sheet.

- One row = one product.
- Core required columns are highlighted orange.
- Recommended fields are yellow.
- Image columns are blue.
- `material_id` is selected from the `Materials` sheet; the website's real material categories remain driven by `config/materials.json`.

### Embedded pictures

Use one picture per image column:

- `image_1_cover` → `01-cover.webp`
- `image_2_front` → `02-front.webp`
- `image_3_side` → `03-side.webp`
- `image_4_back` → `04-back.webp`
- `image_5_squeeze` → `05-squeeze.webp`
- `image_6_size` → `06-size.webp`
- `image_7_packaging` → `07-packaging.webp`

Recommended Excel operation:

`Insert → Pictures → Place in Cell`

when that feature is available in the installed Excel version.

For normal floating pictures, keep the picture's top-left anchor inside the intended image cell. The importer reads the drawing anchor and maps it to the image column.

The importer accepts the normal `.xlsx` package structure directly and does not depend on openpyxl.

## Project layout

```text
your-nextjs-project/
├── app/
├── components/
├── config/
│   └── materials.json
├── data/
│   └── products.json
├── public/
│   └── products/
├── scripts/
│   └── import_products.py
└── import/
    └── products.xlsx
```

The V2 importer package only needs the script. Copy it into your Next.js project as `scripts/import_products.py`.

## Install

```bash
python -m pip install -r requirements.txt
```

## 1. Validate only

This checks the Excel structure, required fields, slug, material ID, carton data and embedded pictures. It does not modify your product JSON or image folders.

```bash
python scripts/import_products.py \
  --excel import/products.xlsx \
  --project-root . \
  --check
```

Expected output:

```text
[OK]   Row 3: SQ001 | panda-squishy | images=5 [...]
[PASS] Validation succeeded for 1 products.
```

## 2. Formal import

```bash
python scripts/import_products.py \
  --excel import/products.xlsx \
  --project-root .
```

Generated output:

```text
data/products.json

public/products/panda-squishy/
├── 01-cover.webp
├── 02-front.webp
├── 03-side.webp
├── 04-back.webp
├── 05-squeeze.webp
└── og-image.webp
```

The script automatically:

1. Reads product rows.
2. Extracts the embedded Excel pictures.
3. Uses `slug` to create the product directory.
4. Renames pictures according to the image column.
5. Converts images to WebP.
6. Resizes to a maximum of 1600×1600.
7. Tries to keep product images around 500 KB or less.
8. Generates a 1200×630 `og-image.webp` from the cover.
9. Generates `data/products.json`.
10. Backs up the previous `data/products.json` into `data/backup/`.

## Material config

Example:

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
  }
]
```

The Excel product must use the `id`, for example:

```text
material_id = gel
```

The importer validates that the material exists and is enabled.

## Important slug rule

Use lowercase letters, numbers and hyphens only:

```text
panda-squishy
bear-squishy
cute-pudding
```

The slug controls:

- product URL
- product image directory
- generated image URLs
- WhatsApp product link
- Open Graph image path

Do not casually change a slug after a product has been published.

## Product JSON example

The script generates the catalog object in the format used by the Next.js site:

```json
{
  "id": "SQ001",
  "slug": "panda-squishy",
  "name": "Panda Squishy Toy",
  "shortDescription": "Cute slow-rising panda squishy toy.",
  "description": "",
  "materialId": "gel",
  "size": "10 × 8 × 8 cm",
  "weight": "65 g",
  "moq": "100 pcs",
  "packaging": "OPP Bag / Custom Packaging",
  "oem": true,
  "featured": true,
  "newArrival": true,
  "enabled": true,
  "tags": [
    "panda",
    "slow-rising"
  ],
  "images": [
    "/products/panda-squishy/01-cover.webp",
    "/products/panda-squishy/02-front.webp"
  ],
  "ogImage": "/products/panda-squishy/og-image.webp",
  "seo": {
    "title": "Panda Squishy Toy | Slow Rising Squishy",
    "description": "Cute slow-rising panda squishy toy."
  },
  "carton": {
    "lengthCm": 60,
    "widthCm": 40,
    "heightCm": 40,
    "qtyPcs": 24,
    "weightKg": 4.2
  }
}
```

## Recommended operating procedure

```text
Edit Excel
   ↓
Insert pictures into image_* cells
   ↓
Save
   ↓
python scripts/import_products.py --check
   ↓
Fix any reported errors
   ↓
python scripts/import_products.py
   ↓
npm run build
   ↓
git diff
   ↓
git add .
git commit
git push
```

For the first deployment, keep the `Example` sheet as the visual reference for picture insertion.
