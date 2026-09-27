#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Import products from an Excel workbook that contains embedded product pictures.

The workbook is intentionally parsed without openpyxl. The script reads the
.xlsx ZIP/XML package directly, so embedded worksheet pictures can be extracted
reliably from xl/media + drawing anchors.

Expected project layout:
    config/materials.json
    data/
    public/products/

Usage:
    # Validate only; does not modify data/products.json or product images.
    python scripts/import_products.py --excel import/products.xlsx --check

    # Validate + generate data/images.
    python scripts/import_products.py --excel import/products.xlsx

Optional:
    --sheet Products
    --project-root .
    --materials config/materials.json
    --clean-products   # remove public/products/* before importing the full catalog

Image rules:
    image_1_cover      -> 01-cover.webp
    image_2_front      -> 02-front.webp
    image_3_side       -> 03-side.webp
    image_4_back       -> 04-back.webp
    image_5_squeeze     -> 05-squeeze.webp
    image_6_size        -> 06-size.webp
    image_7_packaging   -> 07-packaging.webp

Each image is identified by the cell containing its drawing anchor. Put exactly
one picture in each image_* cell. The importer supports normal worksheet
pictures whose top-left anchor is inside the target cell and Excel
"Place in Cell" pictures that use the same drawing relationship structure.
"""

from __future__ import annotations

import argparse
import json
import posixpath
import re
import shutil
import sys
from datetime import datetime
from pathlib import Path
from typing import Any
from zipfile import ZipFile
from xml.etree import ElementTree as ET
from io import BytesIO

from PIL import Image, ImageOps


NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
NS_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS_PKG_REL = "http://schemas.openxmlformats.org/package/2006/relationships"
NS_DRAWING = "http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
NS_DRAWING_A = "http://schemas.openxmlformats.org/drawingml/2006/main"

S = {"m": NS_MAIN, "r": NS_REL, "p": NS_PKG_REL, "xdr": NS_DRAWING, "a": NS_DRAWING_A}
R_EMBED = f"{{{NS_REL}}}embed"
R_ID = f"{{{NS_REL}}}id"

REQUIRED_HEADERS = {
    "product_id",
    "slug",
    "name",
    "short_description",
    "material_id",
    "size",
    "weight_g",
    "moq_pcs",
    "image_1_cover",
}

BASE_HEADERS = [
    "product_id",
    "slug",
    "name",
    "short_description",
    "description",
    "material_id",
    "tags",
    "size",
    "weight_g",
    "moq_pcs",
    "packaging",
    "oem",
    "featured",
    "new_arrival",
    "enabled",
    "carton_length_cm",
    "carton_width_cm",
    "carton_height_cm",
    "carton_qty_pcs",
    "carton_weight_kg",
    "seo_title",
    "seo_description",
]

IMAGE_OUTPUT_NAMES = {
    "image_1_cover": "01-cover.webp",
    "image_2_front": "02-front.webp",
    "image_3_side": "03-side.webp",
    "image_4_back": "04-back.webp",
    "image_5_squeeze": "05-squeeze.webp",
    "image_6_size": "06-size.webp",
    "image_7_packaging": "07-packaging.webp",
}

IMAGE_HEADERS = list(IMAGE_OUTPUT_NAMES.keys())

TRUE_VALUES = {"true", "1", "yes", "y", "是", "有"}
FALSE_VALUES = {"false", "0", "no", "n", "否", "无"}


class ImportErrorEx(Exception):
    """User-facing validation/import error."""


def fail(message: str) -> None:
    raise ImportErrorEx(message)


def clean_str(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def strip_namespaces(tag: str) -> str:
    return tag.split("}", 1)[-1]


def col_to_index(cell_ref: str) -> int:
    letters = re.match(r"([A-Z]+)", cell_ref.upper())
    if not letters:
        return 0
    result = 0
    for ch in letters.group(1):
        result = result * 26 + (ord(ch) - 64)
    return result - 1  # zero-based


def parse_bool(value: Any, field: str, row_num: int) -> bool:
    text = clean_str(value)
    if not text:
        return False
    normalized = text.lower()
    if normalized in TRUE_VALUES:
        return True
    if normalized in FALSE_VALUES:
        return False
    fail(f"Row {row_num}: {field} must be TRUE/FALSE, got {value!r}")


def parse_number(
    value: Any, field: str, row_num: int, integer: bool = False
) -> int | float | None:
    text = clean_str(value)
    if not text:
        return None
    try:
        number = float(text)
        if integer:
            if not number.is_integer():
                fail(f"Row {row_num}: {field} must be an integer, got {value!r}")
            return int(number)
        return number
    except (TypeError, ValueError):
        fail(f"Row {row_num}: {field} must be a number, got {value!r}")


def slug_ok(slug: str) -> bool:
    return bool(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug))


def split_tags(value: Any) -> list[str]:
    text = clean_str(value)
    if not text:
        return []
    return [p.strip() for p in re.split(r"[,，;；]", text) if p.strip()]


def read_xml(zf: ZipFile, name: str) -> ET.Element:
    try:
        return ET.fromstring(zf.read(name))
    except KeyError:
        fail(f"Excel package is missing: {name}")
    except ET.ParseError as exc:
        fail(f"Invalid XML in {name}: {exc}")


def normalize_package_path(base_dir: str, target: str) -> str:
    target = target.replace("\\", "/")
    if target.startswith("/"):
        return target.lstrip("/")
    return posixpath.normpath(posixpath.join(base_dir, target)).lstrip("./")


def load_shared_strings(zf: ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []
    root = read_xml(zf, "xl/sharedStrings.xml")
    values: list[str] = []
    for si in root.findall(f"{{{NS_MAIN}}}si"):
        parts: list[str] = []
        for t in si.iter(f"{{{NS_MAIN}}}t"):
            parts.append(t.text or "")
        values.append("".join(parts))
    return values


def cell_value(cell: ET.Element, shared_strings: list[str]) -> Any:
    cell_type = cell.attrib.get("t")
    v = cell.find(f"{{{NS_MAIN}}}v")

    if cell_type == "inlineStr":
        parts = [t.text or "" for t in cell.iter(f"{{{NS_MAIN}}}t")]
        return "".join(parts)

    if v is None:
        return ""

    text = v.text or ""
    if cell_type == "s":
        try:
            return shared_strings[int(text)]
        except (ValueError, IndexError):
            return ""

    if cell_type == "b":
        return text == "1"

    if cell_type == "str":
        return text

    # Keep numeric cells as strings so later field-specific parsing remains explicit.
    return text


def load_workbook_sheet_paths(zf: ZipFile) -> dict[str, str]:
    workbook = read_xml(zf, "xl/workbook.xml")
    rels_root = read_xml(zf, "xl/_rels/workbook.xml.rels")

    rel_targets: dict[str, str] = {}
    for rel in rels_root.findall(f"{{{NS_PKG_REL}}}Relationship"):
        rel_targets[rel.attrib["Id"]] = normalize_package_path(
            "xl", rel.attrib["Target"]
        )

    result: dict[str, str] = {}
    for sheet in workbook.findall(f"{{{NS_MAIN}}}sheets/{{{NS_MAIN}}}sheet"):
        name = sheet.attrib["name"]
        rid = sheet.attrib.get(R_ID)
        if not rid or rid not in rel_targets:
            continue
        result[name] = rel_targets[rid]
    return result


def load_worksheet_cells(
    zf: ZipFile, sheet_path: str, shared_strings: list[str]
) -> tuple[dict[int, dict[int, Any]], int]:
    root = read_xml(zf, sheet_path)
    sheet_data = root.find(f"{{{NS_MAIN}}}sheetData")
    cells: dict[int, dict[int, Any]] = {}
    max_row = 0

    if sheet_data is None:
        return cells, max_row

    for row_el in sheet_data.findall(f"{{{NS_MAIN}}}row"):
        row_num = int(row_el.attrib.get("r", "0"))
        max_row = max(max_row, row_num)
        row_values: dict[int, Any] = {}
        for cell in row_el.findall(f"{{{NS_MAIN}}}c"):
            ref = cell.attrib.get("r", "")
            col_idx = col_to_index(ref)
            row_values[col_idx] = cell_value(cell, shared_strings)
        cells[row_num] = row_values
    return cells, max_row


def load_sheet_rels(zf: ZipFile, sheet_path: str) -> dict[str, str]:
    base = posixpath.dirname(sheet_path)
    stem = posixpath.basename(sheet_path)
    rels_path = posixpath.join(base, "_rels", stem + ".rels")
    if rels_path not in zf.namelist():
        return {}

    root = read_xml(zf, rels_path)
    result: dict[str, str] = {}
    for rel in root.findall(f"{{{NS_PKG_REL}}}Relationship"):
        result[rel.attrib["Id"]] = normalize_package_path(base, rel.attrib["Target"])
    return result


def load_drawing_relationships(
    zf: ZipFile, drawing_path: str
) -> dict[str, str]:
    base = posixpath.dirname(drawing_path)
    stem = posixpath.basename(drawing_path)
    rels_path = posixpath.join(base, "_rels", stem + ".rels")
    if rels_path not in zf.namelist():
        return {}
    root = read_xml(zf, rels_path)
    result: dict[str, str] = {}
    for rel in root.findall(f"{{{NS_PKG_REL}}}Relationship"):
        result[rel.attrib["Id"]] = normalize_package_path(base, rel.attrib["Target"])
    return result


def extract_embedded_images(
    zf: ZipFile, sheet_path: str
) -> dict[tuple[int, int], tuple[str, bytes]]:
    """
    Returns {(zero_based_row, zero_based_col): (media_path, bytes)}.
    The mapping is based on each drawing object's xdr:from cell anchor.
    """
    sheet_rels = load_sheet_rels(zf, sheet_path)
    drawing_rel_id = None
    # Directly inspect the worksheet XML for <drawing r:id="..."/>.
    sheet_root = read_xml(zf, sheet_path)
    drawing_el = sheet_root.find(f"{{{NS_MAIN}}}drawing")
    if drawing_el is not None:
        drawing_rel_id = drawing_el.attrib.get(R_ID)

    if not drawing_rel_id or drawing_rel_id not in sheet_rels:
        return {}

    drawing_path = sheet_rels[drawing_rel_id]
    drawing_root = read_xml(zf, drawing_path)
    drawing_rels = load_drawing_relationships(zf, drawing_path)

    images: dict[tuple[int, int], tuple[str, bytes]] = {}
    anchors = list(drawing_root.findall(f"{{{NS_DRAWING}}}oneCellAnchor"))
    anchors += list(drawing_root.findall(f"{{{NS_DRAWING}}}twoCellAnchor"))

    for anchor in anchors:
        from_el = anchor.find(f"{{{NS_DRAWING}}}from")
        if from_el is None:
            continue

        col_el = from_el.find(f"{{{NS_DRAWING}}}col")
        row_el = from_el.find(f"{{{NS_DRAWING}}}row")
        if col_el is None or row_el is None:
            continue

        try:
            col_idx = int(col_el.text or "0")
            row_idx = int(row_el.text or "0")
        except ValueError:
            continue

        blip = anchor.find(f".//{{{NS_DRAWING}}}blipFill/{{{NS_DRAWING_A}}}blip")
        if blip is None:
            # Fallback: search any a:blip under the picture.
            blip = anchor.find(f".//{{{NS_DRAWING_A}}}blip")
        if blip is None:
            continue

        media_rel_id = blip.attrib.get(R_EMBED)
        if not media_rel_id or media_rel_id not in drawing_rels:
            continue

        media_path = drawing_rels[media_rel_id]
        if media_path not in zf.namelist():
            continue

        key = (row_idx, col_idx)
        if key in images:
            fail(
                f"Excel contains more than one embedded picture anchored to "
                f"row {row_idx + 1}, column {col_idx + 1}."
            )

        images[key] = (media_path, zf.read(media_path))

    return images


def get_drawing_map(zf: ZipFile, sheet_path: str) -> dict[tuple[int, int], tuple[str, bytes]]:
    return extract_embedded_images(zf, sheet_path)


def row_to_raw(
    row_num: int,
    values: dict[int, Any],
    headers: dict[str, int],
) -> dict[str, Any]:
    raw: dict[str, Any] = {}
    for header, col_idx in headers.items():
        raw[header] = values.get(col_idx, "")
    return raw


def load_materials(path: Path) -> dict[str, dict[str, Any]]:
    if not path.exists():
        fail(f"Material config not found: {path}")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(f"Invalid material config {path}: {exc}")
    if not isinstance(data, list):
        fail(f"{path} must contain a JSON array.")

    result: dict[str, dict[str, Any]] = {}
    for item in data:
        if not isinstance(item, dict):
            continue
        material_id = clean_str(item.get("id"))
        if material_id:
            result[material_id] = item
    return result


def validate_images_for_row(
    row_num: int,
    raw: dict[str, Any],
    drawing_map: dict[tuple[int, int], tuple[str, bytes]],
    header_map: dict[str, int],
) -> list[tuple[str, bytes]]:
    """
    Extract images by logical image header in Excel column order.
    Returns [(header, bytes)] for all present images.
    """
    result: list[tuple[str, bytes]] = []

    for header in IMAGE_HEADERS:
        col_idx = header_map.get(header)
        if col_idx is None:
            continue

        key = (row_num - 1, col_idx)
        found = drawing_map.get(key)
        if found:
            result.append((header, found[1]))
        elif header == "image_1_cover":
            fail(
                f"Row {row_num}: embedded image is required in the "
                f"'{header}' cell."
            )
    return result


def image_output_name(header: str, sequence: int) -> str:
    if header in IMAGE_OUTPUT_NAMES:
        return IMAGE_OUTPUT_NAMES[header]
    return f"{sequence:02d}-detail.webp"


def _save_webp_under_limit(
    image: Image.Image,
    destination: Path,
    max_size: tuple[int, int] = (1600, 1600),
    max_kb: int = 500,
) -> None:
    image = ImageOps.exif_transpose(image)
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA")

    # Flatten transparent PNGs onto white for consistent catalog rendering.
    if image.mode == "RGBA":
        background = Image.new("RGB", image.size, "white")
        background.paste(image, mask=image.getchannel("A"))
        image = background
    else:
        image = image.convert("RGB")

    max_w, max_h = max_size
    scale = min(max_w / image.width, max_h / image.height, 1.0)
    if scale < 1.0:
        image = image.resize(
            (max(1, round(image.width * scale)), max(1, round(image.height * scale))),
            Image.Resampling.LANCZOS,
        )

    qualities = list(range(88, 49, -4))
    scales = [1.0, 0.9, 0.8, 0.7]

    for scale_factor in scales:
        current = image
        if scale_factor < 1.0:
            current = image.resize(
                (
                    max(1, round(image.width * scale_factor)),
                    max(1, round(image.height * scale_factor)),
                ),
                Image.Resampling.LANCZOS,
            )

        for quality in qualities:
            destination.parent.mkdir(parents=True, exist_ok=True)
            current.save(
                destination,
                "WEBP",
                quality=quality,
                method=6,
            )
            if destination.stat().st_size <= max_kb * 1024:
                return

    # Keep a valid WEBP even when a very detailed image cannot meet the target.
    image.save(destination, "WEBP", quality=50, method=6)


def convert_embedded_image(
    image_bytes: bytes,
    destination: Path,
    max_size: tuple[int, int] = (1600, 1600),
    max_kb: int = 500,
) -> None:
    try:
        with Image.open(BytesIO(image_bytes)) as source:
            _save_webp_under_limit(source, destination, max_size, max_kb)
    except Exception as exc:
        fail(f"Invalid embedded image for {destination.name}: {exc}")


def generate_og_image(
    cover_path: Path,
    destination: Path,
    max_kb: int = 500,
) -> None:
    try:
        with Image.open(cover_path) as source:
            source = ImageOps.exif_transpose(source).convert("RGB")
            canvas = Image.new("RGB", (1200, 630), "white")
            contained = ImageOps.contain(
                source, (1080, 570), Image.Resampling.LANCZOS
            )
            x = (1200 - contained.width) // 2
            y = (630 - contained.height) // 2
            canvas.paste(contained, (x, y))
            _save_webp_under_limit(
                canvas,
                destination,
                max_size=(1200, 630),
                max_kb=max_kb,
            )
    except Exception as exc:
        fail(f"Cannot generate OG image from {cover_path}: {exc}")


def validate_row(
    raw: dict[str, Any],
    row_num: int,
    materials: dict[str, dict[str, Any]],
    drawing_map: dict[tuple[int, int], tuple[str, bytes]],
    header_map: dict[str, int],
) -> tuple[list[tuple[str, bytes]], dict[str, Any]]:
    errors: list[str] = []

    product_id = clean_str(raw.get("product_id"))
    slug = clean_str(raw.get("slug"))
    name = clean_str(raw.get("name"))
    short_description = clean_str(raw.get("short_description"))
    material_id = clean_str(raw.get("material_id"))
    size = clean_str(raw.get("size"))

    for field_name, value in [
        ("product_id", product_id),
        ("slug", slug),
        ("name", name),
        ("short_description", short_description),
        ("material_id", material_id),
        ("size", size),
    ]:
        if not value:
            errors.append(f"{field_name} is required")

    if slug and not slug_ok(slug):
        errors.append(
            "slug must use lowercase letters/numbers and hyphens only"
        )

    if material_id:
        material = materials.get(material_id)
        if material is None:
            errors.append(
                f"material_id '{material_id}' not found in config/materials.json"
            )
        elif material.get("enabled") is False:
            errors.append(
                f"material_id '{material_id}' is disabled in config/materials.json"
            )

    try:
        weight_g = parse_number(raw.get("weight_g"), "weight_g", row_num)
    except ImportErrorEx as exc:
        errors.append(str(exc))
        weight_g = None

    try:
        moq_pcs = parse_number(
            raw.get("moq_pcs"), "moq_pcs", row_num, integer=True
        )
    except ImportErrorEx as exc:
        errors.append(str(exc))
        moq_pcs = None

    if weight_g is None:
        errors.append("weight_g is required")
    elif weight_g < 0:
        errors.append("weight_g must be >= 0")

    if moq_pcs is None:
        errors.append("moq_pcs is required")
    elif moq_pcs < 1:
        errors.append("moq_pcs must be >= 1")

    bool_fields = ["oem", "featured", "new_arrival", "enabled"]
    parsed_bools: dict[str, bool] = {}
    for field in bool_fields:
        try:
            parsed_bools[field] = parse_bool(raw.get(field), field, row_num)
        except ImportErrorEx as exc:
            errors.append(str(exc))
            parsed_bools[field] = False

    carton_field_names = [
        "carton_length_cm",
        "carton_width_cm",
        "carton_height_cm",
        "carton_qty_pcs",
        "carton_weight_kg",
    ]
    carton_text = [clean_str(raw.get(f)) for f in carton_field_names]
    any_carton = any(carton_text)
    all_carton = all(carton_text)

    if any_carton and not all_carton:
        errors.append(
            "carton_length_cm/carton_width_cm/carton_height_cm/"
            "carton_qty_pcs/carton_weight_kg must be all filled or all blank"
        )

    carton: dict[str, int | float] | None = None
    if all_carton:
        parsed: dict[str, int | float | None] = {}
        for field in carton_field_names:
            try:
                parsed[field] = parse_number(
                    raw.get(field),
                    field,
                    row_num,
                    integer=(field == "carton_qty_pcs"),
                )
            except ImportErrorEx as exc:
                errors.append(str(exc))
                parsed[field] = None
        if all(value is not None for value in parsed.values()):
            carton = {
                "lengthCm": parsed["carton_length_cm"],  # type: ignore[assignment]
                "widthCm": parsed["carton_width_cm"],    # type: ignore[assignment]
                "heightCm": parsed["carton_height_cm"],  # type: ignore[assignment]
                "qtyPcs": parsed["carton_qty_pcs"],       # type: ignore[assignment]
                "weightKg": parsed["carton_weight_kg"],   # type: ignore[assignment]
            }

    try:
        image_entries = validate_images_for_row(
            row_num, raw, drawing_map, header_map
        )
    except ImportErrorEx as exc:
        errors.append(str(exc))
        image_entries = []

    if errors:
        fail(f"Row {row_num}: " + "; ".join(errors))

    raw_record = {
        "product_id": product_id,
        "slug": slug,
        "name": name,
        "short_description": short_description,
        "description": clean_str(raw.get("description")),
        "material_id": material_id,
        "tags": split_tags(raw.get("tags")),
        "size": size,
        "weight_g": weight_g,
        "moq_pcs": moq_pcs,
        "packaging": clean_str(raw.get("packaging")),
        "oem": parsed_bools["oem"],
        "featured": parsed_bools["featured"],
        "new_arrival": parsed_bools["new_arrival"],
        "enabled": parsed_bools["enabled"],
        "carton": carton,
        "seo_title": clean_str(raw.get("seo_title")) or name,
        "seo_description": clean_str(raw.get("seo_description")) or short_description,
    }
    return image_entries, raw_record


def import_one_product(
    raw_record: dict[str, Any],
    image_entries: list[tuple[str, bytes]],
    products_output: Path,
) -> dict[str, Any]:
    slug = raw_record["slug"]
    out_dir = products_output / slug

    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    output_images: list[str] = []
    cover_path: Path | None = None

    for sequence, (header, image_bytes) in enumerate(image_entries, start=1):
        filename = image_output_name(header, sequence)
        out_file = out_dir / filename
        convert_embedded_image(image_bytes, out_file)
        if header == "image_1_cover":
            cover_path = out_file
        output_images.append(f"/products/{slug}/{filename}")

    if cover_path is None:
        fail(f"{slug}: missing 01-cover.webp after image conversion")

    og_path = out_dir / "og-image.webp"
    generate_og_image(cover_path, og_path)

    product: dict[str, Any] = {
        "id": raw_record["product_id"],
        "slug": slug,
        "name": raw_record["name"],
        "shortDescription": raw_record["short_description"],
        "description": raw_record["description"],
        "materialId": raw_record["material_id"],
        "material": raw_record["material_id"],
        "size": raw_record["size"],
        "weight": f"{raw_record['weight_g']:g} g",
        "moq": f"{raw_record['moq_pcs']} pcs",
        "packaging": raw_record["packaging"],
        "oem": raw_record["oem"],
        "featured": raw_record["featured"],
        "newArrival": raw_record["new_arrival"],
        "enabled": raw_record["enabled"],
        "tags": raw_record["tags"],
        "images": output_images,
        "ogImage": f"/products/{slug}/og-image.webp",
        "seo": {
            "title": raw_record["seo_title"],
            "description": raw_record["seo_description"],
        },
        "carton": raw_record["carton"],
    }
    return product


def find_data_rows(
    cells: dict[int, dict[int, Any]]
) -> tuple[dict[str, int], list[int]]:
    header_row = cells.get(1, {})
    header_map: dict[str, int] = {}
    for col_idx, value in header_row.items():
        header = clean_str(value)
        if header:
            header_map[header] = col_idx

    missing = sorted(REQUIRED_HEADERS - set(header_map))
    if missing:
        fail("Missing required Excel headers: " + ", ".join(missing))

    row_nums: list[int] = []
    for row_num in sorted(cells.keys()):
        if row_num <= 1:
            continue
        values = cells[row_num]
        if not values:
            continue
        if all(clean_str(v) == "" for v in values.values()):
            continue
        row_nums.append(row_num)

    return header_map, row_nums


def run(
    excel_path: Path,
    project_root: Path,
    sheet_name: str,
    material_path: Path,
    check_only: bool,
    clean_products: bool,
) -> None:
    if not excel_path.exists():
        fail(f"Excel file not found: {excel_path}")

    materials = load_materials(material_path)

    data_dir = project_root / "data"
    products_output = project_root / "public" / "products"
    data_dir.mkdir(parents=True, exist_ok=True)
    products_output.mkdir(parents=True, exist_ok=True)

    validated_records: list[tuple[dict[str, Any], list[tuple[str, bytes]], int]] = []

    with ZipFile(excel_path, "r") as zf:
        sheet_paths = load_workbook_sheet_paths(zf)
        if sheet_name not in sheet_paths:
            fail(
                f"Excel sheet '{sheet_name}' not found. "
                f"Available sheets: {', '.join(sheet_paths.keys())}"
            )

        shared_strings = load_shared_strings(zf)
        sheet_path = sheet_paths[sheet_name]
        cells, _ = load_worksheet_cells(zf, sheet_path, shared_strings)
        header_map, row_nums = find_data_rows(cells)
        drawing_map = get_drawing_map(zf, sheet_path)

        seen_ids: set[str] = set()
        seen_slugs: set[str] = set()

        print("=" * 72)
        print("SQUISHY TOYS FACTORY — Product Import")
        print("=" * 72)
        print(f"Excel   : {excel_path}")
        print(f"Sheet   : {sheet_name}")
        print(f"Mode    : {'CHECK ONLY' if check_only else 'IMPORT'}")
        print(f"Rows    : {len(row_nums)}")
        print()

        for row_num in row_nums:
            raw = row_to_raw(row_num, cells[row_num], header_map)
            product_id = clean_str(raw.get("product_id"))

            # Template example rows are ignored.
            if not product_id or product_id.startswith("#") or product_id.upper().startswith("EXAMPLE-"):
                print(f"[SKIP] Row {row_num}: example/comment row")
                continue

            slug = clean_str(raw.get("slug"))
            if product_id in seen_ids:
                fail(f"Row {row_num}: duplicate product_id '{product_id}'")
            if slug in seen_slugs:
                fail(f"Row {row_num}: duplicate slug '{slug}'")

            seen_ids.add(product_id)
            seen_slugs.add(slug)

            image_entries, raw_record = validate_row(
                raw, row_num, materials, drawing_map, header_map
            )

            image_summary = ", ".join(h for h, _ in image_entries)
            print(
                f"[OK]   Row {row_num}: {product_id} | {slug} | "
                f"images={len(image_entries)} [{image_summary}]"
            )
            validated_records.append((raw_record, image_entries, row_num))

    if not validated_records:
        fail(
            "No real product rows found. Delete/overwrite the EXAMPLE row and add product data."
        )

    if check_only:
        print()
        print(f"[PASS] Validation succeeded for {len(validated_records)} products.")
        print("[NEXT] Run without --check to generate data/products.json and product images.")
        return

    if clean_products:
        # Destructive cleanup happens only after the entire workbook has passed validation.
        for child in list(products_output.iterdir()):
            if child.is_dir():
                shutil.rmtree(child)
            else:
                child.unlink()
        print(f"[CLEAN] Removed existing product output under {products_output}")

    products: list[dict[str, Any]] = []
    for raw_record, image_entries, _row_num in validated_records:
        products.append(
            import_one_product(
                raw_record,
                image_entries,
                products_output,
            )
        )

    output_json = data_dir / "products.json"

    if output_json.exists():
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = data_dir / "backup"
        backup_dir.mkdir(parents=True, exist_ok=True)
        backup_path = backup_dir / f"products_{timestamp}.json"
        shutil.copy2(output_json, backup_path)
        print(f"[BACKUP] {backup_path}")

    output_json.write_text(
        json.dumps(products, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print()
    print(f"[DONE] Imported {len(products)} products")
    print(f"[DONE] JSON    : {output_json}")
    print(f"[DONE] Images  : {products_output}")
    print("[NEXT] npm run build")

def main() -> int:
    parser = argparse.ArgumentParser(
        description="Import products and embedded Excel pictures into a Next.js catalog."
    )
    parser.add_argument("--excel", required=True, help="Path to products_import_template_v2.xlsx / products.xlsx")
    parser.add_argument("--project-root", default=".", help="Next.js project root")
    parser.add_argument("--sheet", default="Products", help="Excel sheet name")
    parser.add_argument(
        "--materials",
        default="config/materials.json",
        help="Material config JSON path",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Validate only; do not modify data/products.json or product image output",
    )
    parser.add_argument(
        "--clean-products",
        action="store_true",
        help="Reserved safety flag; currently rejects destructive clean mode after validation",
    )
    args = parser.parse_args()

    try:
        run(
            excel_path=Path(args.excel).resolve(),
            project_root=Path(args.project_root).resolve(),
            sheet_name=args.sheet,
            material_path=(Path(args.project_root) / args.materials).resolve()
            if not Path(args.materials).is_absolute()
            else Path(args.materials).resolve(),
            check_only=args.check,
            clean_products=args.clean_products,
        )
        return 0
    except ImportErrorEx as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("\n[ERROR] Cancelled.", file=sys.stderr)
        return 130


if __name__ == "__main__":
    raise SystemExit(main())
