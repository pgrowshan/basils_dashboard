export const DOSE_COPY = [
  {
    title: "Microdose (80mg to 250mg)",
    body: "This sub-perceptual amount is designed to work in the background without any psychoactive effects.",
  },
  {
    title: "Microdose Plus (250mg to 500mg)",
    body: "Enhance your microdose without noticeable visual or physical effects. Ideal for individuals with higher tolerance levels.",
  },
  {
    title: "Half dose (500mg to 1g)",
    body: "This will deliver a subtle but noticeable level of body high and giddiness. Those with lower tolerances may start to have visual experiences.",
  },
  {
    title: "Full dose (1g to 2g)",
    body: "This should embark you on a full-on trip. With this dosage you'll have the body high and may begin to see visual anomalies (think objects swaying and fractal patterns) along with other sensory amplifications.",
  },
  {
    title: "Deep dose (2g to 3g)",
    body: "This is entering serious dose territory. You may experience a heightened sense of \"oneness\" with the natural elements and people around you, and powerful visual and auditory hallucinations. You might also receive new, unfamiliar patterns of thought.",
  },
  {
    title: "Heroic dose (3g+)",
    body: "Anything beyond 3 grams could be considered a \"heroic\" dose. A dose this strong should be taken under supervision, with preparation, and in the pursuit of an intentional goal. Doses this strong are for experienced users.",
  },
];

const DESCRIPTION =
  "One bite and there's no turning back. Experience 5 grams of perspective-shifting psilocybin covered in sweet chocolate. This bar isn't just delicious, it makes you question time, space, and why you've been ignoring that one part of yourself that still believes in magic. It's smooth. It's intense. It's the trip you take when you're done playing it safe.";

const THREE_GRAM_DOSES = [
  { label: "125mg", pieces: 1 },
  { label: "250mg", pieces: 2 },
  { label: "500mg", pieces: 4 },
  { label: "1 gram", pieces: 8 },
  { label: "1.5 gram", pieces: 12 },
  { label: "2 grams", pieces: 16 },
];

const SIX_GRAM_DOSES = [
  { label: "250mg", pieces: 1 },
  { label: "500mg", pieces: 2 },
  { label: "1 gram", pieces: 4 },
  { label: "1.5 gram", pieces: 6 },
  { label: "2 grams", pieces: 8 },
  { label: "3 grams", pieces: 12 },
  { label: "4 grams", pieces: 16 },
  { label: "5 grams", pieces: 20 },
];

function bar(slug, name, price, grams) {
  return {
    slug,
    name,
    price,
    grams,
    pieceLabel: grams === 6 ? "250MG\n/ PIECE" : "125MG\n/ PIECE",
    doses: grams === 6 ? SIX_GRAM_DOSES : THREE_GRAM_DOSES,
    description: DESCRIPTION,
    category: "MICRODOSE",
  };
}

export const PRODUCTS = {
  "blueberry-dark": bar("blueberry-dark", "3g Blueberry Dark Chocolate Bar", 65, 3),
  "strawberry-white": bar("strawberry-white", "3g Strawberry White Chocolate Bar", 65, 3),
  "hazelnut-milk": bar("hazelnut-milk", "3g Hazelnut Milk Chocolate Bar", 65, 3),
  "6g-blueberry-dark": bar("6g-blueberry-dark", "6g Blueberry Dark Chocolate Bar", 70, 6),
  "6g-hazelnut-milk": bar("6g-hazelnut-milk", "6g Hazelnut Milk Chocolate Bar", 70, 6),
  "berry-happy-set": bar("berry-happy-set", "Berry Happy Microdose Set", 120, 3),
  "sweet-tooth-set": bar("sweet-tooth-set", "Sweet Tooth Microdose Set", 120, 3),
  "blueberry-ease-set": bar("blueberry-ease-set", "Blueberry - Ease into it Set", 120, 3),
  "all-three-set": bar("all-three-set", "All Three Please - Microdose Set", 180, 3),
  "big-two-set": bar("big-two-set", "Big Two - Macrodose Set", 150, 6),
  "everything-set": bar("everything-set", "I'll Take Everything", 400, 6),
};

const RELATED_ORDER = ["blueberry-dark", "berry-happy-set", "blueberry-ease-set", "strawberry-white", "hazelnut-milk"];

export function getProduct(slug) {
  return PRODUCTS[slug] || PRODUCTS["blueberry-dark"];
}

export function getRelated(slug) {
  return RELATED_ORDER.filter((id) => id !== slug)
    .slice(0, 3)
    .map((id) => PRODUCTS[id]);
}

export function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}
