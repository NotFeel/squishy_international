import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { withBasePath } from "@/lib/site";

interface MaterialCardProps {
  name: string;
  description: string;
  href: string;
  image: string;
  index: number;
  accent?: string;
}

export function MaterialCard({
  name,
  description,
  href,
  image,
  index,
  accent = "blush",
}: MaterialCardProps) {
  return (
    <Link className={`material-card material-card--${accent}`} href={href}>
      <div className="material-card__image">
        <Image
          src={withBasePath(image)}
          alt={`${name} squishy toy collection`}
          width={640}
          height={640}
          sizes="(max-width: 767px) 50vw, (max-width: 1100px) 33vw, 20vw"
        />
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="material-card__copy">
        <h3>{name}</h3>
        <p>{description}</p>
        <span>
          Explore <Icon name="arrow" size={17} />
        </span>
      </div>
    </Link>
  );
}
