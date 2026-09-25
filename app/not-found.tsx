import Link from "next/link";
import { Icon } from "@/components/Icon";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="container page-hero__inner">
        <div>
          <p className="eyebrow">404 - Page not found</p>
          <h1>This little squishy wandered off.</h1>
          <p className="page-hero__description">
            The page may have moved, or the link may be incomplete. Browse the
            collection or ask us for help.
          </p>
          <div className="hero__actions">
            <Link className="button button--primary button--large" href="/products/">
              Browse products <Icon name="arrow" size={19} />
            </Link>
            <WhatsAppButton className="button--large" context="contact">
              Ask on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </section>
  );
}
