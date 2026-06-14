export interface FAQItem {
  q: string;
  a: string;
}

export const faqs: FAQItem[] = [
  {
    q: "Where is Skiathos Fish Market located?",
    a: "Skiathos Fish Market is at 48 Ethnikis Antistaseos in Skiathos Town, Magnisia 37002, Greece. We are near the Old Port and Papadiamantis Street, and we serve customers across the whole island including Kolios, Koukounaries, Troulos, Vromolimnos, and Megali Ammos.",
  },
  {
    q: "What are the opening hours?",
    a: "We are open 24 hours a day, 7 days a week. We are always available for local families, restaurants, hotels, villa guests, and yacht crews. For the best selection, come in the morning when fresh Aegean catch arrives.",
  },
  {
    q: "Do you deliver to villas and yachts?",
    a: "Yes, we deliver to villas, private chefs, and yachts across Skiathos. Our temperature-controlled delivery keeps seafood in perfect condition at Skiathos Marina, the Old Port, Kolios, Koukounaries, and Megali Ammos. We coordinate directly with villa concierges and yacht chefs.",
  },
  {
    q: "What types of fresh seafood do you sell?",
    a: "We sell four main categories of Aegean seafood: (1) White Fish — daily wild-caught selections for grilling and baking, (2) Cephalopods and Invertebrates — including octopus, squid, and cuttlefish for traditional sun-drying, boiling, and frying, (3) Shellfish and Crustaceans — live selections for specialty dining, and (4) Deep-Sea Wild Catch — large fish for whole roasting and special occasions.",
  },
  {
    q: "Do you offer wholesale for restaurants and hotels?",
    a: "Yes, we are a licensed wholesale fish merchant supplying restaurants, hotels, and hospitality businesses across Skiathos. We offer temperature-controlled bulk delivery, morning kitchen-ready deliveries, commercial preparation with portion control and vacuum packaging, and flexible pricing. We serve establishments along Papadiamantis Street, the Old Port area, and throughout Skiathos Town.",
  },
  {
    q: "Can you clean and prepare the fish for me?",
    a: "Absolutely. Our fishmongers handle cleaning, custom portioning, desalting of preserved cod, and bulk orders at commercial scale. We prepare your seafood so it is cleaned and ready to cook the moment it reaches you.",
  },
  {
    q: "Do you sell traditional desalted cod for Greek holidays?",
    a: "Yes, we desalt preserved cod in-house using the traditional method of controlled water changes. This restores flavor and texture for Greek Easter, Clean Monday (Καθαρά Δευτέρα), and Holy Week. Order early for holiday periods — we get very busy.",
  },
  {
    q: "What seafood is available during fasting periods?",
    a: "During Lent, Clean Monday, and Holy Week, we stock a full range of fasting-approved seafood: shellfish, invertebrates, cephalopods, and preserved specialties. We scale up specifically for these Greek Orthodox observances so families and church communities have everything they need throughout the fasting period.",
  },
  {
    q: "How do I place a yacht provisioning order?",
    a: "Call or WhatsApp us at 693 115 6528 to discuss your provisioning needs. We deliver to Skiathos Marina and the Old Port, with temperature-controlled transport and live selections for onboard tanks. We handle everything from charter menu planning to last-minute requests.",
  },
  {
    q: "How do you ensure freshness?",
    a: "We buy directly from local Aegean fishing boats that work the waters around Skiathos and the Northern Sporades. Our fishmongers hand-select every fish for freshness and quality. We use temperature-controlled delivery for commercial clients, and retail customers get daily shipments. We have been doing this for over 20 years.",
  },
  {
    q: "Do you accept phone orders and WhatsApp?",
    a: "Yes, we take both phone calls and WhatsApp messages at 693 115 6528. Call for immediate needs or to discuss custom preparations. Use WhatsApp to send lists, request photos of what is available, and coordinate delivery details. We respond quickly on both.",
  },
  {
    q: "What makes you different from other fish sellers?",
    a: "We are trusted by our customers, earned over 20 years of serving Skiathos. We are a licensed wholesale fish merchant with professional preparation services, temperature-controlled delivery, and yacht provisioning. We serve both retail families and high-volume commercial clients with the same care and attention.",
  },
  {
    q: "Can I buy frozen seafood?",
    a: "Yes, we sell flash-frozen seafood frozen at peak freshness. Good for stocking up, planned events, and villa guests who want fresh Aegean seafood throughout their stay. Flash-freezing keeps the texture and flavor intact.",
  },
  {
    q: "Do you supply private chefs and catering events?",
    a: "Yes, we supply private chefs and catering operations across Skiathos. We provide custom orders for specific menus, commercial-scale preparation with portion cuts and vacuum packaging, and we handle last-minute orders without compromising on quality.",
  },
];

// ── Helper: generate FAQPage JSON-LD schema ──────────────────────
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
