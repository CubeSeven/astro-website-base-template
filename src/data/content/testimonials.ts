// Replace with your customer reviews.
// Each review needs: quote, name, role, avatar (image path), rating (1-5),
// source (e.g. "google", "tripadvisor", "facebook", "manual"), and optional sourceUrl.

export const SOURCE_LABELS: Record<string, string> = {
  google: "Google",
  tripadvisor: "TripAdvisor",
  facebook: "Facebook",
  manual: "Customer",
};

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  source: string;
  sourceUrl?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "Add your customer reviews here — they appear in the testimonial slider on the homepage.",
    name: "Customer Name",
    role: "Google Reviewer",
    avatar: "/images/placeholder.svg",
    rating: 5,
    source: "google",
    sourceUrl: "",
  },
];
