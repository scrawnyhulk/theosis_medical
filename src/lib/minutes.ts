export type MinuteSlug =
  | "eustachian-tube"
  | "low-back-pain"
  | "fever"
  | "cough"
  | "sprain-strain"
  | "ct"
  | "sepsis"
  | "antibiotic-resistance"
  | "how-antibiotics-work";

export type MinuteStep = {
  title: string;
  kicker?: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
};

export type Minute = {
  slug: MinuteSlug;
  n: string;
  title: string;
  lede: string;
  paragraphs: string[];
  extraParagraphs?: string[];
  cover?: string;
  coverAlt?: string;
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
  extraImages?: { src: string; alt: string; credit: string }[];
  steps?: MinuteStep[];
};

export const minutesIntro = {
  kicker: "The ER talk, written down",
  title: "Medical Minutes",
  paragraphs: [
    "Understanding complex medical conditions in a way lay people can actually use is the job. These are the explanations I give over and over in the emergency department — ear pressure, the cough that will not quit, why most fevers are not an emergency, why leftover antibiotics are a bad idea — so you can understand what is going on and when you actually need to be seen.",
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
    cover: "/images/minutes-eustachian-cover.png",
    coverAlt:
      "Side view of the face showing how the nose and middle ear connect through the Eustachian tube.",
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
    cover: "/images/minutes-low-back-cover.png",
    coverAlt:
      "Back view of a person holding the low back, with the spine and sciatic nerve highlighted.",
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
    cover: "/images/minutes-fever-cover.png",
    coverAlt:
      "Person in bed with a glowing hypothalamus and immune cells, showing fever as a controlled response.",
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
    cover: "/images/minutes-cough-cover.png",
    coverAlt:
      "Lungs showing mucus in the airways versus infection in the air sacs — bronchitis versus pneumonia.",
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
    cover: "/images/minutes-sprain-cover.png",
    coverAlt:
      "Muscle-tendon strain versus ligament sprain, with a runner holding the injured knee.",
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
  {
    slug: "ct",
    n: "06",
    title: "Why We Don't CT Everyone",
    lede: "A powerful, sometimes lifesaving tool — used thoughtfully.",
    cover: "/images/minutes-ct-cover.png",
    coverAlt:
      "Patient in a CT scanner with slices of the body and a DNA strand highlighting radiation risk.",
    paragraphs: [
      "A CT takes many X-rays from different angles and builds a detailed picture. Those X-rays are ionizing radiation — enough energy to alter atoms. That is not the same kind of radiation as Wi-Fi or a cell phone. One scan is a small added risk, not zero. Dose, repeats, age, sex, body area, and technique all matter.",
      "Most of the time the DNA damage is repaired. Sometimes the cell dies. Very rarely a repair mistake remains and may contribute to cancer years later. Children and younger adults have more years ahead. Women have a somewhat higher risk for some radiation-linked cancers. Typical dose in perspective: a chest X-ray is about a few days of natural background. A head CT is months. An abdomen and pelvis CT can be a few years of background in one sitting.",
      "“Just to look” can backfire. Radiation adds up. Harmless spots trigger more tests. We find things that never would have caused harm. A clean scan does not rule out every future problem, and whole-body CT screening is not recommended for healthy people without symptoms.",
      "The best scan is the one that changes care. Scan when the answer could change diagnosis or treatment. Pause when it will not. Ask for ultrasound or MRI when they can answer the question without ionizing radiation. Right test, right patient, lowest reasonable dose. If the benefit outweighs the small risk, CT is often absolutely worth it.",
    ],
    image: "/images/minutes-ct.png",
    imageAlt:
      "Infographic: why we don’t CT everyone. What a CT does, ionizing radiation and DNA, dose in perspective, who needs extra care, why scanning just to look can backfire, and when CT is worth it.",
  },
  {
    slug: "sepsis",
    n: "07",
    title: "Sepsis: When the Body's Defenses Turn Destructive",
    lede: "It is not just a bad infection. Severity varies — and it can quickly become an emergency.",
    paragraphs: [
      "An infection usually starts in one place — a lung, a kidney, a wound, the belly. Most of the time the immune system contains it. Sepsis is what happens when that response stops being local and starts injuring the rest of you. Blood vessels leak and widen, blood pressure falls, tiny clots slow oxygen delivery, and organs begin to fail. It is not “a really bad cold.” It is organ dysfunction from a dysregulated response to infection.",
      "There are degrees of severity. Some people are caught early and turn around with treatment. Septic shock is the far end: blood pressure stays dangerously low even after fluids, and circulation and organs fail. Almost any infection can lead here — bacterial, viral, fungal, or parasitic. You cannot diagnose it from a phone. You can notice when someone with an infection is getting worse in a way that is not ordinary — and that change can happen fast.",
      "What you may notice: confusion or hard to wake, fast or difficult breathing, a very fast heart rate, fever or shivering — or feeling very cold — clammy, pale, blue, or mottled skin, very little urine, extreme pain, or looking seriously unwell.",
      "If an infection is getting worse and the person is confused, struggling to breathe, unusually sleepy, or looks seriously ill: seek emergency care now. Early recognition, antibiotics when indicated, fluids, source control, and organ support save lives. Do not wait it out overnight if that picture is unfolding.",
    ],
    image: "/images/minutes-sepsis.png",
    imageAlt:
      "Infographic: sepsis is when the body’s defenses turn destructive. Local infection can become a body-wide emergency. Confusion, fast breathing, low urine, mottled skin, or looking seriously ill means seek emergency care now.",
  },
  {
    slug: "antibiotic-resistance",
    n: "09",
    title: "What Is Antibiotic Resistance",
    lede: "You don't become immune to the medicine. The bacteria do.",
    paragraphs: [
      "You do not become “immune” to antibiotics. The bacteria do. Resistance means a germ has picked up a trick — a pump that spits the drug out, an enzyme that cuts it apart, a lock that no longer fits the key — and that trick can be copied to other bacteria. The pill that used to work may not work the next time, for you or for someone else.",
      "Most of the infections people want a Z-pack for in the ER are viruses: colds, most sinus pressure, most bronchitis, most sore throats. Antibiotics do not treat viruses. Using them anyway still hits the bacteria that live on you all the time, and those are the ones that learn. Leftover pills from last year, a leftover for a family member, and “just in case” prescriptions do the same thing.",
      "This is not a reason to skip antibiotics when you actually need them. Bacterial pneumonia, a kidney infection, strep throat that has been confirmed, cellulitis, an abscess, sepsis — those are the cases where the drug is doing real work. Take them exactly as prescribed. Do not stop early because you feel better, and do not stretch a short course into a long one. How long you take them is a medical decision, not a feeling.",
      "What actually helps: do not pressure for antibiotics when the diagnosis is a virus. Do not share or save leftovers. Vaccines, hand hygiene, and treating true bacterial infections promptly all reduce the problem. Watery diarrhea, fever, or severe belly pain during or after a course can be C. diff — call; do not treat that with leftover antibiotics.",
      "Get seen for fever with shaking chills, a rapidly spreading red area or streaking, a wound that is getting worse, burning urination with back pain or vomiting, a stiff neck, confusion, or looking seriously unwell. Those are not “wait and see if the leftover pills work” problems.",
    ],
    image: "/images/minutes-resistance.png",
    imageAlt:
      "Infographic: antibiotic resistance. Bacteria become resistant, not your body. How resistance is selected, what changes inside the bacterium, how genes travel, why first-line drugs can fail, the one-health loop, and how we slow it down.",
  },
  {
    slug: "how-antibiotics-work",
    n: "08",
    title: "How Do Antibiotics Work",
    lede: "Can't I just take some leftover amoxicillin when I get sick? That'll take care of it, right?",
    paragraphs: [
      "Not quite. Antibiotics are not a general “sick pill.” They work in different ways depending on the type of bacteria — and most of what makes you sick is not bacteria at all.",
      "Before leftover amoxicillin is the right move, three things have to be true.",
      "1. It is truly bacterial. Most of the time it isn’t. Colds, most bronchitis, most sore throats, most sinus pressure — viruses. Amoxicillin does nothing to a virus except wave as it drives by on its way to your colon to see if it’s in the mood for diarrhea.",
      "2. If it is bacterial, we have to infer what kind. Strep is not E. coli is not MRSA is not an atypical pneumonia. The leftover amoxicillin in the cabinet was chosen for a different bug, in a different place, on a different day.",
      "3. That bug has to actually be susceptible to the drug you are considering. Coverage, resistance, and whether the drug even reaches the infection all matter. A pill that stays in the gut will not treat a kidney. Some drugs never treat pneumonia, no matter what the bottle says.",
      "That is why leftover antibiotics are a bad plan even when you mean well. Get examined when you need one. Here is the simple version of how these medicines actually work.",
    ],
    image: "/images/minutes-abx-how.png",
    imageAlt:
      "Infographic: how antibiotics stop bacteria. Some kill, some hold growth so the immune system can finish the job. Five attack points — cell wall, protein factory, DNA/RNA blueprint, folate recipe, and membrane — plus why they do not treat viruses and how resistance wins in the germs, not in you.",
    imageCredit:
      "Educational overview. Antibiotic choice depends on the suspected organism, infection site, allergies, resistance patterns, and patient factors.",
    extraImages: [
      {
        src: "/images/minutes-abx-yeast-diarrhea.png",
        alt: "Infographic: why antibiotics can cause yeast infections and diarrhea. Antibiotics disturb the microbiome, Candida can overgrow, the gut can lose its balance, and not all diarrhea is C. difficile — but don’t miss it. When to call and what helps.",
        credit:
          "Educational overview — not a diagnosis. Antibiotic effects vary by drug, duration, health conditions, and prior microbiome. Contact a healthcare professional for concerning symptoms.",
      },
    ],
    extraParagraphs: [
      "The three maps that follow are denser. They are more for medical professionals — or the committed Dr. Googlers — as a refresher on the coverage of each antibiotic: what it hits, what it misses, and where people get into trouble. They are not a home prescribing guide.",
    ],
    steps: [
      {
        title: "β-Lactams + cell wall",
        kicker: "Master set 1 of 3 — class, key drugs, spectrum, signature miss",
        image: "/images/minutes-abx-cell-wall.png",
        imageAlt:
          "Infographic: Antibiotics decoded, master set 1 of 3. β-lactams and cell-wall agents — penicillins, the cephalosporin ladder, carbapenems, monobactams, newer resistant Gram-negative β-lactams, vancomycin, daptomycin, and the major misses including MRSA, Pseudomonas, and atypicals.",
        imageCredit:
          "Simplified learning map — not a prescribing guide. Availability and approved indications vary. Current through 2026.",
      },
      {
        title: "Non-β-lactams",
        kicker: "Master set 2 of 3 — mechanism, key drugs, coverage, exam pearl",
        image: "/images/minutes-abx-non-beta.png",
        imageAlt:
          "Infographic: Antibiotics decoded, master set 2 of 3. Non-β-lactams by mechanism — 30S and 50S protein synthesis, DNA/RNA agents, folate and cell damage, lower-UTI specialists, topical agents, and memory patterns for atypicals, MRSA, VRE, and anaerobes.",
        imageCredit:
          "Simplified learning map — not a prescribing guide. Spectrum and indications depend on organism, infection site, susceptibility, and local resistance. Current through 2026.",
      },
      {
        title: "Coverage atlas",
        kicker: "Master set 3 of 3 — Gram-positives, resistant Gram-negatives, site traps",
        image: "/images/minutes-abx-atlas.png",
        imageAlt:
          "Infographic: Antibiotics decoded, master set 3 of 3. Coverage atlas — Gram-positive targets, resistant Gram-negatives, atypicals and anaerobes, mycobacteria, and site-of-infection traps. Never memorize coverage without the major misses.",
        imageCredit:
          "Simplified learning map — not a prescribing guide. Susceptibility, infection site, severity, patient factors, and local antibiograms determine real-world decisions. Current through 2026.",
      },
    ],
  },
];

export function getMinute(slug: string): Minute | undefined {
  return minutes.find((m) => m.slug === slug);
}
