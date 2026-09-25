"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div className={`faq-item ${expanded ? "is-open" : ""}`} key={item.question}>
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`faq-answer-${index}`}
              onClick={() => setOpen(expanded ? -1 : index)}
            >
              <span>{item.question}</span>
              <i aria-hidden="true" />
            </button>
            <div id={`faq-answer-${index}`} className="faq-item__answer">
              <div>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
