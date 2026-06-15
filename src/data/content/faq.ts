// Replace with your FAQ questions and answers.
// These also generate the FAQPage JSON-LD structured data.

export interface FAQItem {
  q: string;
  a: string;
}

export const faqs: FAQItem[] = [
  {
    q: "What are your business hours?",
    a: "Add your first FAQ answer here. Describe your hours, availability, and how customers can reach you.",
  },
  {
    q: "How can I contact you?",
    a: "Add your second FAQ answer here. List your phone, email, and other contact methods.",
  },
  {
    q: "Where are you located?",
    a: "Add your third FAQ answer here. Describe your location and service area.",
  },
];

export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
