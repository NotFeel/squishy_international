import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const materials = JSON.parse(
  fs.readFileSync(path.join(root, "config/materials.json"), "utf8"),
);
const products = JSON.parse(
  fs.readFileSync(path.join(root, "data/products.json"), "utf8"),
);

const materialById = new Map(materials.map((material) => [material.id, material]));
const productIds = new Set();
const productSlugs = new Set();
const seoTitles = new Set();
const seoDescriptions = new Set();
const errors = [];
const warnings = [];
const requiredStringFields = [
  "id",
  "slug",
  "name",
  "shortDescription",
  "description",
  "materialId",
  "material",
  "size",
  "moq",
  "packaging",
  "ogImage",
];

function exists(publicPath) {
  return fs.existsSync(path.join(root, "public", publicPath.replace(/^\//, "")));
}

for (const product of products) {
  const label = product.id || product.slug || "Unknown product";

  for (const field of requiredStringFields) {
    if (typeof product[field] !== "string" || !product[field].trim()) {
      errors.push(`${label}: missing or invalid "${field}"`);
    }
  }

  if (productIds.has(product.id)) errors.push(`Duplicate product id: ${product.id}`);
  productIds.add(product.id);

  if (productSlugs.has(product.slug)) {
    errors.push(`Duplicate product slug: ${product.slug}`);
  }
  productSlugs.add(product.slug);

  const material = materialById.get(product.materialId);
  if (!material) {
    errors.push(
      `Product ${label} references unknown materialId: ${product.materialId}`,
    );
  } else if (!material.enabled) {
    warnings.push(
      `Product ${label} references disabled materialId: ${product.materialId}`,
    );
  }

  if (!Array.isArray(product.tags)) {
    errors.push(`Product ${label}: "tags" must be an array`);
  }

  if (!Array.isArray(product.images) || product.images.length === 0) {
    errors.push(`Product ${label}: at least one image is required`);
  } else {
    for (const image of product.images) {
      if (!exists(image)) errors.push(`Product ${label}: image not found: ${image}`);
    }
  }

  if (product.ogImage && !exists(product.ogImage)) {
    errors.push(`Product ${label}: OG image not found: ${product.ogImage}`);
  }

  if (seoTitles.has(product.seo?.title)) {
    warnings.push(`Duplicate SEO title: ${product.seo?.title}`);
  }
  seoTitles.add(product.seo?.title);

  if (seoDescriptions.has(product.seo?.description)) {
    warnings.push(`Duplicate SEO description: ${product.seo?.description}`);
  }
  seoDescriptions.add(product.seo?.description);
}

const duplicateSorts = materials
  .map((material) => material.sort)
  .filter((sort, index, all) => all.indexOf(sort) !== index);
if (duplicateSorts.length > 0) {
  warnings.push(`Duplicate material sort values: ${[...new Set(duplicateSorts)].join(", ")}`);
}

if (warnings.length > 0) {
  console.warn(`Product validation warnings:\n- ${warnings.join("\n- ")}`);
}

if (errors.length > 0) {
  console.error(`Product validation failed:\n- ${errors.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(
    `Validation passed: ${products.length} products, ${materials.filter((item) => item.enabled).length} enabled materials.`,
  );
}
