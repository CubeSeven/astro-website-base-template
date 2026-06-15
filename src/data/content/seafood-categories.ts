// Replace with your product or service categories.
// These appear on your services/products page and in the ItemList schema.

export interface SeafoodCategory {
  name: string;
  description: string;
  position: number;
}

export const seafoodCategories: SeafoodCategory[] = [
  {
    position: 1,
    name: "Category One",
    description: "Describe your first service or product category. What do you offer?",
  },
  {
    position: 2,
    name: "Category Two",
    description: "Describe your second service or product category.",
  },
  {
    position: 3,
    name: "Category Three",
    description: "Describe your third service or product category.",
  },
];
