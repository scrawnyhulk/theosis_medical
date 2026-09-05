export type StoreItem = {
  id: string;
  n: string;
  title: string;
  tag: string;
  blurb: string;
  image: string;
  imageAlt: string;
};

export const storeIntro = {
  kicker: "Not for sale. Yet.",
  title: "The Shop",
  paragraphs: [
    "If I made Theosis gear, it would look like this — the shield, the line I actually mean, nothing loud. Heavy fabric. Dark colors. Something you could wear to a shift or a Saturday without looking like a billboard.",
    "Nothing here is for sale. If you would actually wear one, tell me which. That is how I decide whether this ever becomes real.",
  ],
} as const;

export const storeItems: StoreItem[] = [
  {
    id: "shield-tee",
    n: "01",
    title: "Shield Tee",
    tag: "Navy · heavyweight",
    blurb: "The heater shield on the chest. Gold on navy. The whole company in one mark.",
    image: "/images/store/tee-shield.jpg",
    imageAlt: "Navy heavyweight t-shirt with the Theosis Medical shield on the chest.",
  },
  {
    id: "kindness-tee",
    n: "02",
    title: "Seen. Heard. Kindness.",
    tag: "Charcoal · heavyweight",
    blurb: "The last line of Why Theosis, printed so you do not have to explain it.",
    image: "/images/store/tee-kindness.jpg",
    imageAlt:
      "Charcoal t-shirt with the words Seen. Heard. Treated with kindness. and a small Theosis shield.",
  },
  {
    id: "hoodie",
    n: "03",
    title: "Shield Hoodie",
    tag: "Black · fleece",
    blurb: "Small shield on the chest. For the 3 a.m. drive home or the hotel coffee.",
    image: "/images/store/hoodie.jpg",
    imageAlt: "Black pullover hoodie with a small Theosis Medical shield on the left chest.",
  },
  {
    id: "cap",
    n: "04",
    title: "Field Cap",
    tag: "Navy · unstructured",
    blurb: "Embroidered shield. Brim you can actually wear. Not a costume.",
    image: "/images/store/cap.jpg",
    imageAlt: "Navy dad hat with an embroidered Theosis Medical shield on the front.",
  },
  {
    id: "mug",
    n: "05",
    title: "Locums Mug",
    tag: "Matte black · ceramic",
    blurb: "Gold shield on a black mug. For the hotel room that is doing its best.",
    image: "/images/store/mug.jpg",
    imageAlt: "Matte black ceramic mug with a gold Theosis Medical shield.",
  },
];

export function getStoreItem(id: string): StoreItem | undefined {
  return storeItems.find((item) => item.id === id);
}
