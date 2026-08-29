export type MinuteSlug = "eustachian-tube" | "low-back-pain" | "fever" | "cough" | "sprain-strain";

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
    title: "Why Ear Pain Doesn't Always Need Antibiotics",
    lede: "Understanding the Eustachian tube and how the ear and nose are connected.",
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
    title: "Understanding Low Back Pain",
    lede: "What's going on underneath it all and when to worry.",
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
    title: "Fever: Your Body's Secret Weapon...",
    lede: "...and why it's usually not dangerous.",
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
  {
    slug: "cough",
    n: "04",
    title: "Bronchitis vs Pneumonia",
    lede: "The sound and color of mucus do not tell you whether you have a serious lung infection.",
    paragraphs: [
      "Green or yellow mucus is usually your own immune cells and shed lining from the airway — not bacteria. Colored phlegm is normal during ordinary viral colds and chest infections. It does not mean you need antibiotics.",
      "A loud, rattling, “junky” cough usually comes from mucus in the larger upper airways — the windpipe and bronchial tubes. That mucus is meant to be coughed up. The noise is your body clearing it, not a sign of pneumonia.",
      "More than 9 out of 10 healthy adults with a sudden cough have a virus. Antibiotics do not treat viruses.",
      "Acute bronchitis is a short-term inflammation of the breathing tubes, almost always viral. Cough with or without phlegm, often after a cold, chest may feel rattly — and vital signs are usually normal. It gets better on its own. Pneumonia is infection deep in the air sacs of the lung. That can be more serious. Fever, a fast heart rate, fast or hard breathing, chest pain with a breath, feeling very unwell, or a chest X-ray showing it are the clues that point that way.",
      "Noisy cough plus colored mucus is not pneumonia and is not a reason for antibiotics by itself. What actually matters is how you feel and your vital signs.",
      "Get seen for fever of 100.4°F / 38°C or higher or shaking chills, shortness of breath or fast hard breathing, chest pain when breathing, coughing up blood, a cough lasting more than 3 weeks or getting worse, or if you are over 65, pregnant, or have a heart, lung, or immune condition.",
    ],
    image: "/images/minutes-cough.png",
    imageAlt:
      "Infographic: loud cough and colored mucus are not always bacterial. Three mucus myths, bronchitis versus pneumonia, warning signs, and when to seek care.",
  },
  {
    slug: "sprain-strain",
    n: "05",
    title: "What Is a Strain vs Sprain",
    lede: "Why it takes so long for these to heal.",
    paragraphs: [
      "A strain is muscle or tendon. Muscle runs to bone through tendon. A sprain is ligament — bone to bone, the fibers that keep a joint from going the wrong way. They get used interchangeably in the waiting room. They are not the same injury.",
      "Muscle has a richer blood supply and often heals faster. Tendons and ligaments are dense collagen with limited blood flow, so the same “stretch or tear” takes longer. Healing is cleanup, then a weak disorganized patch, then weeks to months of remodeling while load lines the fibers back up. Pain can ease before full strength is back. That is why it still gives out if you jump back in too soon.",
      "What actually helps: protect it briefly, compress and elevate for swelling, ice 15–20 minutes for pain, then gentle motion and progressive loading. Sleep, eat, skip nicotine. Ibuprofen or naproxen can help pain and swelling. Acetaminophen often helps pain about as well. They are a pain tool, not a healing shortcut — lowest effective dose, shortest time, if they are safe for you.",
      "Get checked for deformity, numbness, major weakness, inability to bear weight, a pop with lost function, or an injury that is worsening or not improving.",
    ],
    image: "/images/minutes-sprain.png",
    imageAlt:
      "Infographic: sprain versus strain. Muscle strain, tendon strain, and ligament sprain, why collagen healing takes weeks, what actually helps, and red flags that need an exam.",
  },
];

export function getMinute(slug: string): Minute | undefined {
  return minutes.find((m) => m.slug === slug);
}
