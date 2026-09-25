"use client";

import Image from "next/image";
import { useState } from "react";
import { withBasePath } from "@/lib/site";

const labels = ["Cover", "Details", "Lifestyle", "Packaging"];

export function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <Image
          src={withBasePath(images[active])}
          alt={`${productName}, ${labels[active]?.toLowerCase() || "product view"}`}
          width={640}
          height={640}
          priority
          sizes="(max-width: 767px) 100vw, 50vw"
        />
        <span className="product-gallery__label">{labels[active]}</span>
      </div>
      <div className="product-gallery__thumbs" role="group" aria-label="Product image views">
        {images.map((image, index) => (
          <button
            type="button"
            className={active === index ? "is-active" : ""}
            aria-label={`View ${labels[index] || `image ${index + 1}`}`}
            aria-pressed={active === index}
            key={image}
            onClick={() => setActive(index)}
          >
            <Image
              src={withBasePath(image)}
              alt=""
              width={120}
              height={120}
              sizes="100px"
            />
            <span>{labels[index]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
