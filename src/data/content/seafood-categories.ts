export interface SeafoodCategory {
  name: string;
  description: string;
  position: number;
}

export const seafoodCategories: SeafoodCategory[] = [
  {
    position: 1,
    name: "White Fish",
    description:
      "Daily wild-caught white fish from the Aegean Sea around Skiathos. Ideal for grilling, baking, and pan-searing.",
  },
  {
    position: 2,
    name: "Cephalopods & Invertebrates",
    description:
      "Local octopus, squid, and cuttlefish from Skiathos and the Northern Sporades. Traditional Greek island cooking essentials.",
  },
  {
    position: 3,
    name: "Shellfish & Crustaceans",
    description:
      "Live shellfish and crustaceans for sea-to-table dining, restaurants, and private yacht provisioning in Skiathos.",
  },
  {
    position: 4,
    name: "Deep-Sea Wild Catch",
    description:
      "Large-format deep-sea fish for special occasions, whole roasting, salt-crust baking, and luxury yacht provisioning.",
  },
];
