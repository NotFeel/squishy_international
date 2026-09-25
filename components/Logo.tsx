import Link from "next/link";
import { site } from "@/lib/site";

export function Logo({ light = false }: { light?: boolean }) {
  const words = site.name.trim().split(/\s+/);
  const primary = words.length > 1 ? words.slice(0, -1).join(" ") : words[0];
  const secondary = words.length > 1 ? words.at(-1) : "TOYS";

  return (
    <Link className={`logo ${light ? "logo--light" : ""}`} href="/" aria-label={`${site.name} home`}>
      <span className="logo__mark" aria-hidden="true">
        <span />
        <span />
        <i />
      </span>
      <span className="logo__copy">
        <strong>{primary}</strong>
        <em>{secondary?.toUpperCase()}</em>
      </span>
    </Link>
  );
}
