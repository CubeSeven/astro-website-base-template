export interface DeliveryArea {
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export const deliveryAreas: DeliveryArea[] = [
  {
    title: "Skiathos Town Core",
    description:
      "Papadiamantis Street, Old Port, new harbor, Bourtzi, and the town center restaurant district. Morning kitchen-ready deliveries available.",
    image: "/images/skiathos-fish-01.webp",
    tags: ["Restaurants", "Hotels", "Shops"],
  },
  {
    title: "South Coast Villas",
    description:
      "Kolios, Troulos, Vromolimnos, and Koukounaries luxury villa complexes. Discreet delivery coordinated with concierges.",
    image: "/images/skiathos-fish-02.webp",
    tags: ["Villas", "Concierge", "Private Chefs"],
  },
  {
    title: "Maritime Vessels",
    description:
      "Skiathos Marina, Old Port anchorages, and offshore yacht provisioning. Harbor delivery with dockside coordination.",
    image: "/images/skiathos-fish-03.webp",
    tags: ["Yachts", "Marina", "Charters"],
  },
  {
    title: "North & East Beaches",
    description:
      "Megali Ammos, Xanemos, Aselinos, and Mandraki. Event catering and beach club supply routes.",
    image: "/images/skiathos-fish-04.webp",
    tags: ["Beach Clubs", "Events", "Catering"],
  },
  {
    title: "Remote Villas & Estates",
    description:
      "Secluded luxury villas and private estates far from town center. Premium delivery service to remote locations across the island.",
    image: "/images/skiathos-fish-05.webp",
    tags: ["Remote", "Private", "Estate"],
  },
  {
    title: "Other Islands",
    description:
      "Upon request, we serve Skopelos, Alonissos, and other nearby Sporades islands. Advanced booking required for inter-island delivery.",
    image: "/images/skiathos-fish-06.webp",
    tags: ["Skopelos", "Alonissos", "Sporades"],
  },
];
