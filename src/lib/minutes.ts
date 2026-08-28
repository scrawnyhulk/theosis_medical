export type MinuteSlug = "eustachian-tube" | "low-back-pain" | "fever";

export type Minute = {
  slug: MinuteSlug;
  n: string;
  title: string;
  lede: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
};

export const minutesIntro = {
  kicker: "The ER talk, written down",
  title: "Medical Minutes",
  paragraphs: [
    "Understanding complex medical conditions in a way lay people can actually use is the job. These are the explanations I give over and over in the emergency department — ear pressure, the cough that will not quit, why most fevers are not an emergency — so you can understand what is going on and when you actually need to be seen.",
    "This is general education. It is not a diagnosis and it is not a substitute for an exam. If you are severely ill, go to the ER.",
  ],
  disclaimer:
    "General education only — not a substitute for advice from your healthcare provider. When in doubt, get examined.",
} as const;

export const minutes: Minute[] = [
  {
    slug: "eustachian-tube",
    n: "01",
    title: "Your Nose and Middle Ear Share a Tunnel",
    lede: "That connection explains pressure, muffled hearing — and why ear pain does not always need antibiotics.",
    paragraphs: [
      "The middle ear is a tiny room behind the eardrum. The Eustachian tube is the hallway that connects that room to the back of the nose. When a cold or allergies swell the lining, the hallway cannot open, pressure drops, fluid can collect, and the ear feels full, pops, crackles, or hurts.",
      "That is often a pressure-and-drainage problem, not a bacterial infection. Antibiotics do not open the tube or treat a virus. Looking at the eardrum is how we tell the difference. Ear pain is a symptom — not a diagnosis.",
      "Swallow, yawn, chew gum, treat known allergies as directed, use pain relievers as directed, and give the swelling time. Get examined for severe or worsening pain, fever, fluid or pus draining from the ear, hearing loss that lasts, repeated episodes, dizziness, a severe headache, or swelling behind the ear.",
    ],
    image: "/images/minutes-eustachian.png",
    imageAlt:
      "Infographic: the nose and middle ear share a Eustachian tube. A cold can block that hallway, causing pressure and muffled hearing. Antibiotics are not automatic.",
  },
  {
    slug: "low-back-pain",
    n: "02",
    title: "Low Back Pain",
    lede: "Most low back pain is non-specific. Most of it gets better in a few weeks. Hurting does not always mean harm.",
    paragraphs: [
      "We often do not find a single injury or disease that explains it. Muscle spasm is a common reason the back hurts. True nerve compression — disc, bony narrowing, or deep gluteal muscles irritating the sciatic nerve — is less common than people think, and it is not the cause of all low back pain.",
      "What actually helps: stay active as you are able. Avoid bed rest. Heat for comfort. Exercise if it lasts more than a few weeks. NSAIDs at the lowest dose for the shortest time may help; acetaminophen alone usually does not. Opioids are generally not recommended.",
      "For typical back pain without red flags, early X-ray, CT, or MRI usually does not help and can lead to extra worry or treatment. Get seen now for loss of bladder or bowel control, numbness in the groin or inner thighs, new weakness in both legs, fever, cancer history or unexplained weight loss, a major injury, back pain with belly pain or a pulsing abdomen, severe night pain, or IV drug use with new back pain. See your clinician if pain is severe, not improving after a few weeks, or a red flag appears.",
    ],
    image: "/images/minutes-low-back.png",
    imageAlt:
      "Infographic: most low back pain is non-specific and improves in a few weeks. Sciatica can come from a disc, bony narrowing, or deep gluteal compression. Red flags need care now. Stay active. Imaging is usually not needed.",
  },
  {
    slug: "fever",
    n: "03",
    title: "Fever: Your Body Turned Up the Heat",
    lede: "As much as I know it can be scary when you or your child has a fever, it's rarely dangerous and is just a clue that your body is fighting something it needs a little extra help with.",
    paragraphs: [
      "The hypothalamus is the thermostat. In an infection it raises the set point on purpose. Immune cells work better at that higher temperature. The body is not broken. It turned the heat up.",
      "A high fever from infection almost never reaches temperatures that injure the brain. Dangerous overheating is a different problem — heatstroke, or a child left in a hot car. How the person looks, acts, breathes, drinks, and urinates matters more than the exact number on the thermometer.",
      "You do not have to chase a normal temperature. Treat discomfort. Acetaminophen or ibuprofen can help comfort; the number may only drop a few degrees and can rise again when the medicine wears off. Fever medicine does not reliably prevent febrile seizures. Routine fever suppression has not been shown to shorten common respiratory illnesses.",
      "Fluids, light clothing, rest, and weight-based dosing. Do not give aspirin to children or teens with a viral illness. Avoid ice baths and alcohol rubs.",
      "Get medical help for any fever in a baby under 3 months, trouble breathing, a stiff neck, a purple or non-blanching rash, severe dehydration, confusion or hard to wake, a first seizure or one lasting 5 minutes, looking very ill, heat exposure, or fever repeatedly above 104°F / 40°C.",
    ],
    image: "/images/minutes-fever.png",
    imageAlt:
      "Infographic: fever is a controlled immune response. The hypothalamus raises the set point. Treat discomfort, not just the number. Get help for infants under 3 months and other red flags.",
  },
];

export function getMinute(slug: string): Minute | undefined {
  return minutes.find((m) => m.slug === slug);
}
