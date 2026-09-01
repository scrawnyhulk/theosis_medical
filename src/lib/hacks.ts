export type HackSlug =
  | "where-to-start"
  | "dont-drink-calories"
  | "protein-per-pound"
  | "protein-label"
  | "fast-food"
  | "staples"
  | "exercise"
  | "nerd-out"
  | "helpful-videos"
  | "reading-list";

export type Hack = {
  slug: HackSlug;
  n: string;
  title: string;
  lede: string;
  stolenFrom?: string;
  jokeSteal?: boolean;
  featured?: boolean;
  paragraphs: string[];
};

export function creditKicker(source: string, jokeSteal?: boolean) {
  return jokeSteal ? `Stolen from ${source}` : `Reference: ${source}`;
}

export const hackCovers: Partial<Record<HackSlug, { src: string; alt: string }>> = {
  "where-to-start": {
    src: "/images/hack-start-cover.jpg",
    alt: "A path forward: pick a calorie target, eat protein first, spend the rest, keep walking.",
  },
  "dont-drink-calories": {
    src: "/images/hack-drinks-cover.jpg",
    alt: "Calorie drinks on one side, water, coffee, and tea on the other.",
  },
  "protein-per-pound": {
    src: "/images/hack-protein-per-pound-cover.jpg",
    alt: "A gram of protein per pound: protein foods circling a person on the scale.",
  },
  "protein-label": {
    src: "/images/protein-x10-cover.jpg",
    alt: "The protein × 10 trick: ten protein units on one side of the scale versus the calories on the other.",
  },
  "fast-food": {
    src: "/images/hack-fast-food-cover.jpg",
    alt: "Drive-through hack: extra meat, no bun, skip the fries, diet drink.",
  },
  staples: {
    src: "/images/hack-staples-cover.jpg",
    alt: "Protein staples on the counter — what is in the house becomes what you eat.",
  },
  exercise: {
    src: "/images/hack-exercise-cover.jpg",
    alt: "Simple training that actually happens: push, pull, squat, walk, and a hill.",
  },
  "nerd-out": {
    src: "/images/hack-nerd-out-cover.jpg",
    alt: "Looking closer: organs, muscle, mitochondria, molecules.",
  },
  "helpful-videos": {
    src: "/images/hack-helpful-videos-cover.jpg",
    alt: "A tablet opening into the videos worth watching.",
  },
  "reading-list": {
    src: "/images/hack-reading-list-cover.jpg",
    alt: "Books opening into the science behind how we eat, move, and live.",
  },
};

export const hacksIntro = {
  kicker: "Lifestyle medicine — the 20%",
  title: "Holwey’s Handy Health Hacks",
  paragraphs: [
    "Through the years I have unfortunately figured out I am indeed human, and all the nutrition knowledge in the world doesn’t stop McDonald’s fries and a Big Mac with extra special sauce from becoming a must-have after a 12-hour shift. I’ve been lean, I’ve been dad bod, I’ve been somewhere in between saying “I’ll start back up tomorrow” while downing a cream-filled Krispy Kreme delight. Life is hard and I’m in it with you all. Still, it’s because of this that I know how important it is to find a way to make healthfulness sustainable in a hectic life.",
    "I have trial-and-errored a lot of this over the years. I steal what works and discard what does not. I have fallen off the wagon many a time myself — busy shifts, hotels, kids, the whole Tuesday.",
    "What survived is the minimum effective dose: a short list of moves that cut through the noise of nutrition science so you can navigate daily life and still move toward being healthier. Not a 12-week program. Not a personality. How I eat, most days.",
    "I did not invent these. I have stolen a lot of them from people smarter than me that I love to follow and learn from. I consider myself a curator of evidence-based nutritional truth more than an author — and it all still follows the data as it comes. I use them on myself. Do them at least 80% of the time. The other 20% is what keeps you sane — so this never has to be a “diet.”",
  ],
  disclaimer:
    "General education, not a personal treatment plan. If you have a medical condition — kidneys, pregnancy, disordered eating, anything your clinician is already following — talk with them before you overhaul how you eat.",
} as const;

export const hacks: Hack[] = [
  {
    slug: "where-to-start",
    n: "01",
    title: "Where to Start",
    featured: true,
    lede: "Yes, I stole this from a business YouTuber. He stole it from the data. And he’s jacked.",
    stolenFrom: "Alex Hormozi",
    jokeSteal: true,
paragraphs: [
      "I admit… I stole it. It was me. In the library. With the candlestick. However, when I find easy-to-digest information that simplifies a subject overcomplicated by so many others — I’m using it. Plus, he clearly knows what he’s talking about because he’s jacked. Just kidding — but seriously.",
      "In truth he summarizes the data beautifully, and simplifies it in a way that even a tired, overstimulated mother of six — awake with the baby at 2 a.m., who just wants a few hours of shut-eye and a vacation — could easily understand. Watch the video. Figure out your goals.",
      "Need to drop fat quick? Use the bottom number on the spectrum. Want to stay the course? Hold your ground in the mid-range. You can shift the goalposts whatever way you want based on your goals at the time.",
      "Calculate your protein. The remaining calories are free to spend on whatever delectable dish you’ve been denying yourself. If it fits in the remaining calories, you’re golden. If math isn’t your strong suit — or it’s been a long day, or a long year, and you only have a few brain cells still choosing to show up for work — use the calculator below.",
    ],
  },
  {
    slug: "dont-drink-calories",
    n: "02",
    title: "Don't Drink Calories",
    lede: "If it has calories and you can sip it, skip it. Hunger does not count a drink as a meal.",
paragraphs: [
      "Liquid calories do not fill you up the way food does. You can drink 400 calories and still be hungry enough to eat dinner like you never had them. That is why this is near the top of the list.",
      "Water. Sparkling water. Black coffee. Unsweetened tea. Diet soda. Zero-calorie flavored drinks. That is the drink list.",
      "We do not fear fake sweeteners as of the data to date. The human trial data does not support the internet panic. The scary headlines usually come from petri dishes and mega-doses, not from people drinking Diet Coke. [[sweeteners]]",
      "Juice is fruit with the useful parts removed. Regular soda is dessert. The sweet coffee drink is a milkshake in a paper cup. Sports drinks are for people actually sweating through a long session — not for sitting at a desk.",
    ],
  },
  {
    slug: "protein-per-pound",
    n: "03",
    title: "One Gram Per Pound",
    lede: "Eat about 1 gram of protein per pound of body weight. If you have a lot to lose, using a goal weight is reasonable.",
    stolenFrom: "Alex Hormozi, Dr. Ted Naiman, and the protein-first crowd",
paragraphs: [
      "If you weigh 180 pounds, aim for about 180 grams of protein across the day. Not in one sitting. Spread it out so you are not trying to choke down a Costco chicken at 9 p.m.",
      "If you are carrying a lot of extra weight, using a goal or “ideal” weight for that gram-per-pound number is a reasonable way to start. The point is a high-protein floor, not a contest.",
      "Why this works: protein is filling, it protects muscle, and it makes “eat less junk” a lot easier without a spreadsheet diet. Control protein and calories first. Then let carbs and fat be whatever is easiest to maintain.",
      "This is a target, not a religion. If you have kidney disease or another condition your clinician is managing where you have been told to restrict or monitor protein, this is not your plan. Ask them.",
      "And if you still are listening to the person regurgitating myths from the 80's, read/watch below:",
    ],
  },
  {
    slug: "protein-label",
    n: "04",
    title: "The Protein × 10 Trick",
    lede: "The front of the bag is advertising. Two numbers on the back tell you if it is actually a good option.",
    stolenFrom: "Dr. Ted Naiman",
    jokeSteal: true,
paragraphs: [
      "Food companies are not trying to make grocery shopping easy. They are trying to win the shelf. “Protein.” “Healthy.” “Organic.” “Made with whole grains.” That is the advertising major working for Kraft trying to one-up last quarter’s campaign. The label is designed to confuse you. The nutrition facts are the only part that has to tell the truth — and even then, you have to know which two numbers to trust.",
      "This one is not mine. It is Dr. Ted Naiman’s, and I use it every time I turn a bag over. The graphic below is his. I am showing it here so you can steal it the same way I did.",
      "Find protein grams per serving. Multiply by 10 — or just add a zero. Compare that number to calories per serving. If protein × 10 meets or beats the calories, the food is at least 40% protein. That is the ideal.",
      "You do not have to hit 40% every time. If it is 30% protein or more, that is still fine. A 30 g shake with low fat and carbs, a Legendary pastry, a Quest bar — some of those live in that band. The nerdier ranking is protein-to-energy: protein grams divided by carb grams plus fat grams. That is Dr. Naiman’s P:E ratio, and it is how the fast-food page is scored.",
      "That is the whole grocery-aisle algorithm. Two numbers. One decision. No app, no macro spreadsheet, no falling for the front of the box. It also works on a fast-food screen if you bother to open the nutrition panel.",
    ],
  },
  {
    slug: "fast-food",
    n: "05",
    title: "Fast Food Hacks",
    lede: "Let’s be honest, you are going to eat out. The frequency in which you do is directly correlated to the number of children under your care. Trust me, it’s science.",
paragraphs: [
      "I judge not. Plenty a meal has been enjoyed under the golden arches of calorically dense shame. A busy work week, a road trip, scrambling after the kid’s practice, or just no energy to cook — this is where you can survive derailment. The move is not “never drive through.” The move is to pick the highest protein-to-energy version of whatever joint you are already in.",
      "I went looking at published nutrition facts — official pages where they exist, and common tracker listings (MyFitnessPal / Carb Manager / FatSecret) for the no-bun and extra-meat versions. Menus move. Portioning is sloppy. If the numbers are on the screen, run × 10 yourself.",
      "The list is not exhaustive. We focused on the low-hanging fruit — of the foods far from the health status of fruit — to hack our way to health in the drive-through. Lose the buns, find it in your soul to somehow ignore the fries, double the meat, grab a Coke Zero, and voilà… you’ve won fast food.",
    ],
  },
  {
    slug: "staples",
    n: "06",
    title: "Regular Food Hacks",
    lede: "Keep these in the house so the right choice is an easy choice.",
    stolenFrom: "Alex Hormozi",
    jokeSteal: true,
paragraphs: [
      "When I’m on the wagon and not being a hypocrite — doing the 80% of things that keep my overall health under control — these are the staples I’m rotating through.",
      "Between these foods and the periodic “healthy-adjacent” [[takeout]], I’m able to stay sane while getting through a busy day to day. Diets fail when the healthier options require a 12-step recipe and the fatty liver with a side of fries option is a drive-through away. The move is to make the high-protein thing the thing you can grab while you are tired and hangry.",
      "This is not a meal plan. It is a fridge that does not fight you. Hitting the × 10 rule is the ideal. Close still counts.",
      "If a sweet tooth shows up: a Legendary pastry with fat-free Reddi-wip takes the cake… literally and figuratively. Like it’s really, really good.",
      "And then I stole the grocery-aisle recipes from the same jacked business YouTuber as Where to Start. Zero prep. High protein. His versions often land around 80–100 g of protein in one sitting — scale them to your number. The macros below are from the video plus typical labels. Brands move. If the numbers are on the package, trust those.",
    ],
  },
  {
    slug: "exercise",
    n: "07",
    title: "Exercise Hacks",
    lede: "The 20% of exercise most of us will actually do.",
paragraphs: [
      "I’m rarely motivated to work out and I definitely don’t have the time. Not to beat a dead horse, but I think focusing on 20% of the exercises that give you 80% of the benefits is the best starting point. I’m not saying these are the most ideal and extensive methods of exercise. I’m saying they are the most realistic.",
      "If you enjoy romantic 10-mile runs on the beach and two hours of CrossFit six days a week… God bless you and your joints. You probably already know what you’re doing and have already watched all of the YouTubes.",
      "I’m preaching to the same choir as I have everywhere else on this site. Busy, tired, unmotivated, confused, and disenfranchised by prior failure to stick with some program.",
      "(If this is too basic or not enough volume, increase the sets, number of exercises, and days per week — this will help you to advance while keeping things simple.)",
    ],
  },
  {
    slug: "nerd-out",
    n: "08",
    title: "Nutritional Nerd Out",
    lede: "Mechanisms. How stuff actually works. Pick a topic — no need to scroll for days. Compulsory if you are me.",
paragraphs: [
      "Herein lies a rabbit hole of nutritional and physiologic nerditude. The “why” behind so many things related to our health and how to navigate through it all.",
      "Why won’t I shut up about protein? What do I mean by [[energy]]? What actually [[diabetes]], and [[reverse]]",
      "[[grow]] Don’t care about growing muscle? [[whymuscle]]. (No, I’m not saying you have to be jacked and tan.) Muscle serves countless beneficial purposes, and we should at least get it some flowers and let it know we care every once in a while.",
      "But seriously, I love this stuff. You don’t have to, but I think you’ll be happy you stuck around by the end of it.",
    ],
  },
  {
    slug: "helpful-videos",
    n: "09",
    title: "Helpful Videos",
    lede: "Here is a repository for the videos I think are helpful for being successful in health education and management. I may have used them elsewhere already but will consolidate them all here if I can.",
    paragraphs: [],
  },
  {
    slug: "reading-list",
    n: "10",
    title: "Reading List, Stolen With Love",
    lede: "Two books from Dr. Ted Naiman. I am the middleman, not the author.",
paragraphs: [
      "If a hack on this page helped, these are a big part of why. I am not affiliated. I just keep learning from him, then translating it into something I can actually do on a work week.",
    ],
  },
];

export const drinkSwaps = [
  { from: "Regular soda, sweet tea, juice", to: "Water, sparkling water, diet soda, or a zero-calorie flavor" },
  { from: "Flavored latte, blended coffee", to: "Black coffee, unsweetened tea, or a diet / sugar-free version" },
  { from: "Sports drink at a desk", to: "Mio, a zero-calorie flavor enhancer, or just water" },
  { from: "Calories in a glass with dinner", to: "Drink water or diet pop. Eat the calories you can chew." },
] as const;

export type FastFoodItem = {
  name: string;
  how: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: "official" | "tracker" | "built";
};

export type FastFoodChain = {
  place: string;
  blurb: string;
  items: FastFoodItem[];
};

export function proteinPercent(item: { calories: number; protein: number }): number {
  if (item.calories <= 0) return 0;
  return (item.protein * 4 * 100) / item.calories;
}

export function peRatio(item: FastFoodItem): number {
  const energy = item.carbs + item.fat;
  if (energy <= 0) return Number.POSITIVE_INFINITY;
  return item.protein / energy;
}

export function peTone(pe: number): "best" | "good" | "mid" | "low" {
  if (pe >= 2) return "best";
  if (pe >= 1) return "good";
  if (pe >= 0.5) return "mid";
  return "low";
}

export const fastFoodChains: FastFoodChain[] = [
  {
    place: "Chick-fil-A",
    blurb: "The grilled nuggets are the cheat code. Fried nuggets are a different food.",
    items: [
      { name: "8-ct grilled nuggets", how: "No sauce, or Buffalo / mustard if you need one.", calories: 130, protein: 25, carbs: 1, fat: 3, source: "official" },
      { name: "12-ct grilled nuggets", how: "Same bird, more of it.", calories: 200, protein: 38, carbs: 2, fat: 5, source: "official" },
      { name: "30-ct grilled nuggets", how: "The whole bag. Split it, or don’t.", calories: 500, protein: 95, carbs: 5, fat: 13, source: "built" },
      { name: "Grilled chicken, no bun", how: "Filet in a tray or on lettuce.", calories: 130, protein: 23, carbs: 4, fat: 4, source: "tracker" },
      { name: "Spicy grilled filet, no bun", how: "Same move as the regular filet. Spice is free.", calories: 140, protein: 25, carbs: 3, fat: 4, source: "tracker" },
      { name: "Egg White Grill, no muffin", how: "Breakfast. English muffin in the trash. Black coffee.", calories: 180, protein: 26, carbs: 5, fat: 7, source: "built" },
      { name: "Grilled chicken sandwich", how: "With the bun. Middle of the pack — still 29% protein.", calories: 390, protein: 28, carbs: 45, fat: 11, source: "official" },
    ],
  },
  {
    place: "Chipotle",
    blurb: "Double the chicken. Skip the rice, chips, queso, and the regular soda. Salsa and fajita vegetables are free real estate.",
    items: [
      { name: "High-protein chicken cup", how: "Side of Adobo chicken. Eat it as a snack or dump it on anything.", calories: 180, protein: 32, carbs: 0, fat: 7, source: "official" },
      { name: "Triple chicken", how: "Three sides of chicken in a bowl. No rice. This is the actual meal.", calories: 540, protein: 96, carbs: 0, fat: 21, source: "built" },
      { name: "Steak (standard portion)", how: "Their listed steak serving. High P:E, a little less protein than chicken.", calories: 150, protein: 21, carbs: 1, fat: 6, source: "official" },
      { name: "Barbacoa (standard portion)", how: "A little saucier than steak. Still a protein order.", calories: 170, protein: 24, carbs: 2, fat: 7, source: "official" },
      {
        name: "Double chicken bowl, no rice",
        how: "Chicken ×2, fajita veg, tomato salsa, lettuce. No rice, no cheese, no chips, no sour cream.",
        calories: 410,
        protein: 64,
        carbs: 12,
        fat: 16,
        source: "built",
      },
      {
        name: "Double steak bowl, no rice",
        how: "Steak ×2, fajita veg, tomato salsa, lettuce. Same rules as chicken.",
        calories: 350,
        protein: 44,
        carbs: 13,
        fat: 13,
        source: "built",
      },
      {
        name: "Chicken salad, no dressing",
        how: "Lettuce, chicken, fajita veg, salsa. Skip the vinaigrette if you want the ratio to stay honest.",
        calories: 240,
        protein: 34,
        carbs: 10,
        fat: 8,
        source: "built",
      },
    ],
  },
  {
    place: "Culver’s",
    blurb: "Midwest drive-through that quietly has one of the best grilled-chicken numbers in the country.",
    items: [
      { name: "Grilled chicken, no bun", how: "Ask for no bun. The bird is the meal.", calories: 160, protein: 34, carbs: 0, fat: 2, source: "tracker" },
      { name: "Grilled chicken sandwich", how: "Even with the bun this clears 40% protein.", calories: 390, protein: 41, carbs: 40, fat: 8, source: "tracker" },
      { name: "Grilled chicken club, no bun", how: "Bacon and cheese if they fit leftover calories. Mustard, not mayo.", calories: 250, protein: 38, carbs: 2, fat: 10, source: "tracker" },
      { name: "Pot roast, no bun", how: "The Midwest stew, minus the bread. Skip gravy if it is a sugar bomb.", calories: 220, protein: 28, carbs: 4, fat: 10, source: "tracker" },
      { name: "Double ButterBurger, no bun", how: "Two beef patties. Fattier than the chicken. Still a protein order.", calories: 400, protein: 34, carbs: 2, fat: 28, source: "tracker" },
    ],
  },
  {
    place: "McDonald’s",
    blurb: "Grilled chicken if they have it — no bun. Extra beef if they don’t. Breakfast: keep the egg, lose the muffin. Skip juice.",
    items: [
      { name: "Grilled chicken, no bun", how: "Ask for no bun. Mustard, not mayo. Diet drink. Not at every McDonald’s anymore.", calories: 140, protein: 29, carbs: 2, fat: 2, source: "tracker" },
      { name: "Two hamburger patties", how: "No bun, no ketchup. Just the meat.", calories: 180, protein: 16, carbs: 0, fat: 14, source: "tracker" },
      { name: "Egg McMuffin, no muffin", how: "Canadian bacon, egg, cheese in a tray. Black coffee.", calories: 160, protein: 12, carbs: 2, fat: 12, source: "tracker" },
      { name: "Bacon, egg & cheese, no muffin", how: "Same breakfast move. Tray. Black coffee.", calories: 190, protein: 14, carbs: 3, fat: 14, source: "built" },
      { name: "McDouble, no bun", how: "Plain as you like. Ketchup and mustard are fine. Diet drink.", calories: 240, protein: 17, carbs: 5, fat: 16, source: "tracker" },
      { name: "Quarter Pounder, no bun", how: "The bigger patty. Cheese if it fits leftover calories.", calories: 370, protein: 25, carbs: 14, fat: 24, source: "tracker" },
      { name: "Double Quarter Pounder, no bun", how: "Hungry. No bun. Diet drink. Skip the fries even harder.", calories: 540, protein: 48, carbs: 10, fat: 36, source: "built" },
    ],
  },
  {
    place: "Sonic",
    blurb: "Diet drink. Skip the tots. Grilled chicken if they have it, extra beef if they do not.",
    items: [
      { name: "Grilled chicken, no bun", how: "Ask for no bun. Mustard, not mayo. Route 44 diet.", calories: 290, protein: 26, carbs: 10, fat: 15, source: "tracker" },
      { name: "Grilled chicken sandwich", how: "Even with the bun this still clears 25%. Skip mayo if you can.", calories: 440, protein: 31, carbs: 38, fat: 17, source: "tracker" },
      { name: "SuperSONIC Double, no bun", how: "Two patties, cheese, no bun. Fattier. Still a protein order.", calories: 540, protein: 35, carbs: 3, fat: 43, source: "tracker" },
      { name: "Jr. burger, no bun", how: "Smaller beef order when you are not that hungry. Mustard.", calories: 180, protein: 13, carbs: 2, fat: 14, source: "tracker" },
      { name: "Egg & cheese, no toast", how: "Breakfast. Skip the toaster bread. Black coffee.", calories: 200, protein: 14, carbs: 4, fat: 14, source: "tracker" },
    ],
  },
  {
    place: "Wendy’s",
    blurb: "Chili is the easy order. Grilled chicken is the better P:E if you skip the mayo.",
    items: [
      { name: "Grilled chicken, no bun", how: "Mustard or nothing. Side salad instead of fries.", calories: 180, protein: 31, carbs: 3, fat: 4, source: "tracker" },
      { name: "Grilled chicken sandwich", how: "Mustard or nothing. Side salad instead of fries.", calories: 350, protein: 33, carbs: 35, fat: 8, source: "tracker" },
      { name: "Small chili", how: "Works as a side or a small meal.", calories: 280, protein: 19, carbs: 22, fat: 11, source: "official" },
      { name: "Large chili", how: "More of the same.", calories: 370, protein: 25, carbs: 29, fat: 15, source: "official" },
      { name: "Dave’s Single, no bun", how: "The bigger beef patty, no bun. Cheese if it fits leftover calories.", calories: 330, protein: 25, carbs: 4, fat: 24, source: "built" },
      { name: "Double Stack, no bun", how: "Two smaller patties. Still skip the bun and the fries.", calories: 250, protein: 20, carbs: 5, fat: 16, source: "built" },
    ],
  },
  {
    place: "Taco Bell",
    blurb: "Chicken, extra chicken, skip the rice and the cinnamon twists. Diet Baja Blast is fine.",
    items: [
      { name: "Extra chicken (add-on)", how: "Order it as a side or dump it on whatever you already got.", calories: 70, protein: 11, carbs: 1, fat: 3, source: "tracker" },
      { name: "Chicken ×3, as a plate", how: "Three extra-chicken add-ons. Diet Baja Blast. That is the meal.", calories: 210, protein: 33, carbs: 3, fat: 9, source: "built" },
      { name: "Power Menu Bowl, chicken, no rice", how: "Chicken, lettuce, pico, salsa. No rice, no sour cream, no chips.", calories: 310, protein: 24, carbs: 12, fat: 18, source: "tracker" },
      { name: "Power Menu Bowl, steak, no rice", how: "Same bowl, steak instead. Still no rice, no sour cream.", calories: 300, protein: 22, carbs: 11, fat: 17, source: "tracker" },
      { name: "Cantina chicken bowl, extra chicken, no rice", how: "Customize in the app. No sour cream, no chips.", calories: 390, protein: 31, carbs: 19, fat: 22, source: "tracker" },
      { name: "Chicken soft taco, Fresco", how: "Fresco swaps the sauce for pico. Middle of the pack — still clears 25%.", calories: 150, protein: 11, carbs: 15, fat: 5, source: "tracker" },
      { name: "Cantina chicken taco", how: "The fancier taco. Still chicken-first. Skip creamy sauce if you can.", calories: 170, protein: 13, carbs: 13, fat: 7, source: "tracker" },
    ],
  },
  {
    place: "Arby’s",
    blurb: "Roast beef without the bun is the move. With the bun you are sitting on the 25% line.",
    items: [
      { name: "Classic roast beef, no bun", how: "Single stack of beef in a tray. Horsey sauce if it fits leftover calories.", calories: 210, protein: 20, carbs: 2, fat: 12, source: "built" },
      { name: "Double roast beef, no bun", how: "Meat in a tray or lettuce. Horsey sauce if it fits leftover calories.", calories: 310, protein: 31, carbs: 2, fat: 20, source: "tracker" },
      { name: "Half-pound roast beef, no bun", how: "Hungry. No bun. Diet drink.", calories: 480, protein: 46, carbs: 4, fat: 30, source: "tracker" },
      { name: "Classic roast beef sandwich", how: "With the bun. Barely clears 25% protein.", calories: 360, protein: 23, carbs: 37, fat: 14, source: "official" },
      { name: "Grand Turkey Club, no bun", how: "Turkey, bacon, no bun. Skip the mayo if you want the ratio to stay honest.", calories: 350, protein: 32, carbs: 4, fat: 22, source: "tracker" },
    ],
  },
  {
    place: "Burger King",
    blurb: "Lose the bun. Diet drink. Grilled chicken if they have it. Extra beef if they don’t. Ignore the fries.",
    items: [
      { name: "Ham, egg & cheese, no croissant", how: "Breakfast. Tray or lettuce. Black coffee.", calories: 160, protein: 14, carbs: 2, fat: 11, source: "tracker" },
      { name: "Egg & cheese, no muffin", how: "Even simpler breakfast. Black coffee.", calories: 150, protein: 12, carbs: 2, fat: 11, source: "tracker" },
      { name: "Double hamburger, no bun", how: "Two patties, no ketchup if you can. Mustard is fine.", calories: 220, protein: 20, carbs: 4, fat: 16, source: "built" },
      { name: "Whopper Jr., no bun", how: "Smaller flame-grilled beef. Mustard, no mayo. Diet drink.", calories: 180, protein: 15, carbs: 4, fat: 12, source: "built" },
      { name: "Grilled chicken, no bun", how: "Ask for no bun. Mustard, not mayo. Not at every BK.", calories: 270, protein: 30, carbs: 1, fat: 16, source: "tracker" },
      { name: "Flame-grilled chicken sandwich", how: "Even with the bun this still clears 30% protein. Skip mayo if they put it on.", calories: 410, protein: 35, carbs: 43, fat: 15, source: "tracker" },
    ],
  },
  {
    place: "Subway",
    blurb: "The protein bowl is the sandwich without the problem. Extra meat. Mustard. Vegetables.",
    items: [
      { name: "Turkey protein bowl", how: "No bread. All the vegetables. Mustard, not mayo.", calories: 160, protein: 25, carbs: 11, fat: 2, source: "tracker" },
      { name: "Black forest ham protein bowl", how: "Same idea. Extra ham if you are actually hungry.", calories: 140, protein: 21, carbs: 10, fat: 3, source: "tracker" },
      { name: "Oven-roasted chicken protein bowl", how: "Same idea. Double meat if you are actually hungry.", calories: 200, protein: 26, carbs: 9, fat: 6, source: "tracker" },
      { name: "Rotisserie-style chicken, extra meat", how: "Protein bowl, extra chicken, all the vegetables, mustard.", calories: 280, protein: 40, carbs: 10, fat: 8, source: "built" },
      { name: "Double chicken salad", how: "Salad bowl, extra chicken, no croutons, no creamy dressing.", calories: 220, protein: 36, carbs: 8, fat: 4, source: "tracker" },
      { name: "Sweet onion chicken teriyaki protein bowl", how: "The sauce costs you carbs. Protein still wins. 45% of calories from protein.", calories: 300, protein: 34, carbs: 33, fat: 5, source: "tracker" },
      { name: "6-inch turkey, double meat, no cheese, no mayo", how: "If you insist on bread. All the vegetables. Mustard.", calories: 360, protein: 34, carbs: 48, fat: 5, source: "built" },
    ],
  },
  {
    place: "Jimmy John’s",
    blurb: "The Unwich is lettuce instead of bread. Slims are meat and lettuce, period. Extra meat. That is the whole restaurant.",
    items: [
      { name: "Slim 1 ham Unwich", how: "Ham and lettuce. No mayo, no cheese.", calories: 90, protein: 15, carbs: 2, fat: 2, source: "tracker" },
      { name: "Slim 4 turkey Unwich", how: "Turkey and lettuce. No mayo, no cheese. The cleanest order in the building.", calories: 80, protein: 16, carbs: 2, fat: 1, source: "tracker" },
      { name: "Slim 2 roast beef Unwich", how: "Roast beef, lettuce. Same idea.", calories: 100, protein: 16, carbs: 1, fat: 3, source: "tracker" },
      { name: "Turkey Unwich, extra meat", how: "Lettuce wrap. No mayo if you want the ratio to stay honest.", calories: 250, protein: 24, carbs: 4, fat: 16, source: "tracker" },
      { name: "Hunter’s Club Unwich", how: "Roast beef, turkey, lettuce. Skip the mayo. 42 g of protein.", calories: 480, protein: 42, carbs: 8, fat: 28, source: "tracker" },
      { name: "Bootlegger Club Unwich", how: "Roast beef, turkey, ham, lettuce. Extra meat if you want. Skip the mayo.", calories: 420, protein: 38, carbs: 6, fat: 24, source: "tracker" },
    ],
  },
  {
    place: "Domino’s",
    blurb: "The pizza is the problem. The wings are the hack. Plain or dry-rub, not the breaded boneless, not a side of ranch you drink.",
    items: [
      { name: "8-pc plain bone-in wings", how: "No sauce, or a dry rub. The crust is what you are not ordering.", calories: 390, protein: 34, carbs: 5, fat: 26, source: "tracker" },
      { name: "16-pc plain bone-in wings", how: "Two people, or one very hungry person. Still skip the ranch vat.", calories: 780, protein: 68, carbs: 10, fat: 52, source: "built" },
      { name: "8-pc hot buffalo bone-in", how: "Sauce is fine. Sugar-glaze BBQ is the one that starts to wander.", calories: 410, protein: 34, carbs: 8, fat: 26, source: "tracker" },
    ],
  },
  {
    place: "Pizza Hut",
    blurb: "Same rule as Domino’s. Naked traditional wings. The slice will not hit the ratio. The bird will.",
    items: [
      { name: "6-pc naked traditional wings", how: "Smaller order. Bone-in, unsauced.", calories: 480, protein: 54, carbs: 0, fat: 27, source: "built" },
      { name: "8-pc naked traditional wings", how: "Bone-in, unsauced. 9 g protein a wing, no bun hiding in the breading.", calories: 640, protein: 72, carbs: 0, fat: 36, source: "tracker" },
      { name: "12-pc naked traditional wings", how: "Share it or don’t. Diet drink. No breadsticks.", calories: 960, protein: 108, carbs: 0, fat: 54, source: "built" },
    ],
  },
  {
    place: "Blaze Pizza",
    blurb: "The rare pizza that is actually a protein food. Keto crust — whey, casein, cauliflower, flax, egg — not the cauliflower-rice crust, which is still a carb bomb. Extra chicken. Easy on the cheese.",
    items: [
      { name: "11\" keto crust, chicken, light cheese, veg", how: "Keto crust, extra chicken, go easy on the cheese, pile the vegetables. Skip the flour dough and the cauliflower crust that is pretending.", calories: 660, protein: 66, carbs: 20, fat: 31, source: "tracker" },
      { name: "11\" keto crust, chicken ×2", how: "Second chicken. Light cheese. Vegetables. This is the pizza-shaped protein bowl.", calories: 760, protein: 84, carbs: 20, fat: 34, source: "built" },
      { name: "Salad, extra chicken, light dressing", how: "If even keto crust feels like a stretch. Vinegar-based dressing, not ranch.", calories: 320, protein: 42, carbs: 10, fat: 12, source: "tracker" },
    ],
  },
  {
    place: "Starbucks",
    blurb: "Do not drink the calories. Egg bites beat the pastry case. Black coffee.",
    items: [
      { name: "Egg white & red pepper bites", how: "The lighter bites. 28% protein.", calories: 170, protein: 12, carbs: 13, fat: 8, source: "official" },
      { name: "Bacon & Gruyère egg bites", how: "Just over 25% protein. More fat. Fine if it fits leftover calories.", calories: 300, protein: 19, carbs: 11, fat: 20, source: "official" },
      { name: "Kale & mushroom egg bites", how: "The other bites. Still beats a muffin.", calories: 230, protein: 15, carbs: 11, fat: 14, source: "official" },
      { name: "Turkey bacon, egg white & cheddar sandwich", how: "The sandwich that actually clears 25%. Skip the pastry case next to it.", calories: 230, protein: 17, carbs: 28, fat: 5, source: "official" },
      { name: "Chicken & quinoa protein bowl", how: "When you need a real meal and not a pastry with a protein claim.", calories: 420, protein: 27, carbs: 42, fat: 16, source: "official" },
    ],
  },
];

export const fastFoodNotes = [
  "Nothing on this list is under 25% calories from protein. × 10 (40%) is the ideal. 30% or more is still fine.",
  "P:E is Dr. Ted Naiman’s protein-to-energy ratio: protein grams ÷ (carb grams + fat grams). Higher is better. Green is the good end. Red is the leftover-calories end.",
  "These numbers are roughly based on nutrition facts from restaurant websites. Take them with a grain of salt.",
  "If there are no available restaurants and you’re stuck with a hotel breakfast, a gas station, an airport — same rules still apply. Eggs, Greek yogurt, string cheese, a simple shake, jerky with a short ingredient list, diet soda. Grab protein. Skip the pastry and the orange juice.",
] as const;


export const nerdTopics = [
  {
    id: "protein",
    title: "What’s special about protein",
    lede: "Protein is not a gym-bro religion. It is the building material. Fuel is carbs and fat. You cannot make muscle out of pasta.",
    stolenFrom: "Simpson and Raubenheimer, Dr. Ted Naiman, and a pile of unglamorous physiology",
    paragraphs: [
      "This is not a gym-bro religion. Protein is not the macronutrient we picked because it photographs well. It has a special place at the top because things fall apart without it. Proteins are building materials — muscle, enzymes, skin, and bone — the actual structure of you. Carbs and fat are fuel, but you cannot make muscle out of pasta. Protein is crucial to take in every day, but even more so when trying to lose weight.",
      "In a calorie deficit, low protein intake is a great way to lose the hard-earned muscle you wanted to keep. Lift a little and eat enough protein, and more of what comes off your body is fat. That is the whole argument for making protein the first number to count, not the last.",
      "Your body is very reluctant to turn protein into fat even when you overconsume it. There is no protein storage container the way there is a fat warehouse. Excess amino acids (building blocks of proteins) get used for repair and growth, or they get burned. Turning them into stored body fat is theoretically possible, but the body has to work harder than it wants to to do it, so the juice is typically not worth the squeeze.",
      "Per calorie, protein is the most filling of the three macronutrients. Two hundred calories of chicken breast and two hundred calories of chips do not produce the same experience over the next hour or three. That is why the × 10 trick exists: you are picking food that shuts hunger down, gets on stage and does a great Ozempic impression. We all know this intuitively. Four eggs for breakfast keep us content much longer than a bowl of cinnamon and sugar-O’s.",
      "The protein leverage hypothesis in brief says: animals — including people — appear to eat until they hit a protein quota for the day. If the food around you is diluted with carbs and fat (a low P:E ratio, if you will), you keep eating to get enough protein, and the extra calories come along for the ride. Raise the protein density and calorie intake often falls without a heroic act of willpower. Fix the protein, and the overeating loses steam.",
      "One more quiet nerd fact: digesting protein costs more energy than digesting carbs or fats. Roughly 20–30% of the protein calories get used in the processing. So 400 calories of protein when all is said and done is really 300 calories, and so on and so forth.",
    ],
    image: "/images/nerd-protein.png",
    imageAlt:
      "Infographic: why protein is different. Builder first, fuel when needed, a reluctant route to body fat. No protein warehouse, high thermic effect, ×10 protein check, and the protein-leverage idea.",
    imageCredit:
      "Count protein early — not as an afterthought. Educational only. ×10 is a screening tool, not a score of whether a food is good or bad.",
    seeAlso: {
      hash: "muscle",
      label: "How do we grow muscle?",
      note: "One set to failure. Put the protein to work.",
    },
  },
  {
    id: "muscle",
    title: "How do we grow muscle?",
    lede: "Mechanical tension, enough hard sets, and recovery. Size and strength overlap — they are not the same program.",
    paragraphs: [],
    image: "/images/nerd-hypertrophy.png",
    imageAlt:
      "Infographic: how to maximize muscle hypertrophy. Mechanical tension, enough hard sets, and recovery. Stimulus, dose, quality, progression, fuel, and feedback.",
    imageCredit:
      "The 80/20 hypertrophy formula. Training ranges are starting points. Adjust for experience, age, injuries, and recovery.",
    steps: [
      {
        title: "Hypertrophy",
        paragraphs: [
          "The growth equation is mechanical tension × enough hard sets × recovery. The target is more contractile tissue — not a pump, not soreness, not scale weight.",
        ],
        image: "/images/nerd-hypertrophy.png",
        imageAlt:
          "Infographic: how to maximize muscle hypertrophy. Mechanical tension, enough hard sets, and recovery. Stimulus, dose, quality, progression, fuel, and feedback.",
        imageCredit:
          "The 80/20 hypertrophy formula. Training ranges are starting points. Adjust for experience, age, injuries, and recovery.",
      },
      {
        title: "Strength",
        paragraphs: [
          "Strength is muscle size × neural skill × movement technique. Getting strong and getting big overlap. They are not the same program: specific + heavy + fresh versus volume + hard sets + recovery.",
        ],
        image: "/images/nerd-strength.png",
        imageAlt:
          "Infographic: how to maximize muscle strength. Strength is muscle size times neural skill times movement technique. Specific, heavy, and fresh versus volume for size.",
        imageCredit:
          "The 80/20 strength formula. To get strong: specific + heavy + fresh. To get big: volume + hard sets + recovery.",
      },
    ],
  },
  {
    id: "muscle-speed",
    title: "How fast can you build muscle?",
    lede: "Muscle grows slowly — one protein at a time. The pump is not new muscle.",
    paragraphs: [
      "After you lift, the fiber is under tension, sensors turn that force into a growth signal, blood delivers amino acids from the protein you ate, and ribosomes assemble those amino acids into more contractile protein. Synthesis stays up for roughly 24–48 hours. Repeat that enough times and the fibers get thicker. That is hypertrophy. It is not a overnight remodel.",
      "The honest timeline: the pump right after a session is mostly fluid. Strength in the first 1–4 weeks is often skill and nervous-system coordination. Measurable size can start around 6–8 weeks. Visible change is more like 8–12+ weeks. The body you actually want is months to years of small cycles stacked on each other.",
      "You do not have to destroy the muscle to build it. Soreness can happen. It is not the goal. Mechanical tension plus repeated protein synthesis is the goal.",
      "Stack the odds the same way as everywhere else on this site: progressive resistance, hard sets near failure, train consistently, a gram of protein per pound of body weight, enough calories, sleep. Newer lifters grow faster. A deficit, older age, and inconsistent training all slow it down. Individual responses vary. Nobody is a monthly transformation except the ads.",
    ],
    image: "/images/nerd-muscle-speed.png",
    imageAlt:
      "Infographic: how fast you can build muscle. Tension, signal, deliver, build, repeat. Honest timeline from the pump to months of real growth. You do not have to destroy muscle to build it.",
    imageCredit: "Muscle grows slowly — one protein at a time. Individual responses vary widely.",
    seeAlso: {
      hash: "muscle",
      label: "How do we grow muscle?",
      note: "The minimum-effective-dose version I will actually do.",
    },
  },
  {
    id: "why-muscle",
    title: "Why should we care about muscle growth?",
    lede: "Muscle is more than strength — blood sugar, bones, falls, independence, heart, longevity.",
    paragraphs: [],
    image: "/images/why-muscle.png",
    imageAlt:
      "Infographic: muscle is more than strength — it helps control blood sugar, protects bones, prevents falls, supports independence, heart health, and longevity.",
    imageCredit: "It is never too late to build it. References are on the poster.",
  },
  {
    id: "energy",
    title: "What do we mean by “energy”? Part 1",
    lede: "The body is a machine made of protein parts, running on carb and fat fuel.",
    paragraphs: [],
    steps: [
      {
        title: "We are a machine",
        paragraphs: [
          "We are a machine. We are made of parts and we run on fuel.",
          "Protein = parts (with some nuance). Carbs and fat = fuel (with some nuance).",
        ],
        image: "/images/naiman-energy-machine.png",
        imageAlt:
          "Infographic: the body as a machine made of protein parts, running on carb and fat fuel, with glycogen and fat storage and the protein-to-energy ratio.",
        imageCredit: "Credit / reference: Dr. Ted Naiman — The P:E Diet",
      },
      {
        title: "Carbs and fat become ATP",
        paragraphs: [
          "Carbs and fat get burned to make ATP (adenosine triphosphate) — that’s the molecule that powers everything in the body.  In muscles, it powers every contraction.  When ATP does work, it drops a phosphate and becomes ADP (adenosine diphosphate), which has to be recharged back to ATP before it can work again.",
        ],
        image: "/images/nerd-glucose-fat-atp.png",
        imageAlt:
          "Infographic: how muscle turns glucose and fat into ATP. Two fuels, different entrances, one currency. Glycolysis, Krebs, electron transport, beta-oxidation, ketones, creatine refill, and lactate when demand outruns mitochondria.",
        imageCredit: "Two fuels. Different entrances. One usable energy currency. Educational only.",
      },
      {
        title: "Creatine",
        paragraphs: [
          "Creatine does that recharge STAT. Phosphocreatine hands a phosphate to ADP so ATP comes back in a blink. Not extra calories. A few more seconds of maximal effort — a lift, a sprint, a jump.",
        ],
        image: "/images/nerd-creatine.png",
        imageAlt:
          "Infographic: creatine kinase, the muscle’s ATP recharge system. ATP powers contraction, phosphocreatine donates a phosphate, creatine kinase rebuilds ATP. Creatine supplements can increase muscle phosphocreatine stores.",
        imageCredit: "The first few seconds. Educational only.",
        extraImage: "/images/nerd-creatine-recharger.png",
        extraImageAlt:
          "Infographic: creatine, the cell’s instant ATP recharger. Phosphocreatine donates a phosphate to ADP, restoring ATP in the first seconds of all-out work. Creatine does not make energy from nothing — it enlarges the reserve.",
        extraImageCredit: "ATP’s rapid backup system. Educational only.",
      },
      {
        title: "Ketones",
        paragraphs: [
          "When glucose is low and fat supply is high, the liver packages fat into a portable fuel it cannot use itself: ketones. Brain, heart, and muscle can burn them. Nutritional ketosis is not diabetic ketoacidosis.",
        ],
        image: "/images/nerd-ketones.png",
        imageAlt:
          "Infographic: ketone production, the liver’s portable fat-fuel factory. Fatty acids to acetyl-CoA to ketones. The liver exports ketones; other organs turn them into ATP. Nutritional ketosis is not diabetic ketoacidosis.",
        imageCredit: "Ketones are portable fuel made from fat by the liver when glucose is limited. Educational only.",
      },
    ],
    seeAlso: {
      hash: "fuel-biochem",
      label: "Part 2",
      note: "How a bagel and a stick of butter both become ATP.",
    },
  },
  {
    id: "fuel-biochem",
    title: "What do we mean by “energy”? Part 2",
    lede: "This is the super nerdy biochemistry of how your body literally makes the energy to contract muscle, send nerve signals, fight infection...you name it. ATP is the actual currency of energy that makes things happen. It is the final destination of the fuel you eat in your diet.\n\nBelow is the biochemistry of how fat and carbs turn into ATP...and then some. So buckle up!",
    paragraphs: [],
    steps: [
      {
        title: "Glycolysis",
        paragraphs: [
          "Say you are sprinting and you need fuel fast, glycolysis below is how you can quickly make ATP, but it doesn't make a lot.",
        ],
        image: "/images/nerd-glycolysis.png",
        imageAlt:
          "Infographic: glycolysis, the cell’s rapid sugar-splitting line. One glucose is split into two pyruvates. Net 2 ATP plus 2 NADH. Oxygen not required. Pyruvate can go to mitochondria or to lactate.",
        imageCredit: "The fast first cut. Small ATP profit. Educational only.",
      },
      {
        title: "Lactate",
        paragraphs: [
          "You're sprinting pretty fast, you're starting to feel a burn, you're not getting enough oxygen to your muscle...now you're making lactic acid...",
        ],
        image: "/images/nerd-lactate.png",
        imageAlt:
          "Infographic: lactate production, the high-speed NAD+ recycling loop. Pyruvate plus NADH become lactate plus NAD+ so glycolysis can keep making ATP. Lactate is not metabolic trash — it can be burned as fuel or recycled into glucose.",
        imageCredit: "Often called lactic acid — at body pH it is mostly lactate. Educational only.",
      },
      {
        title: "Beta-oxidation",
        paragraphs: [
          "Ok, now you've stopped sprinting and are finally able to rest. You go home, take a shower and then put a movie on. Now we have plenty of oxygen available to burn our fat stores for fuel. This is more efficient and will give way more ATP bang for our buck.",
        ],
        image: "/images/nerd-beta-oxidation.png",
        imageAlt:
          "Infographic: beta-oxidation. Mitochondria dismantle fatty acids two carbons at a time through the carnitine shuttle, the oxidation spiral, Krebs, and the electron transport chain.",
        imageCredit: "The repeating two-carbon chop. Educational only.",
      },
      {
        title: "Krebs cycle",
        kicker: "The nerd out within the nerd out…",
        image: "/images/nerd-krebs.png",
        imageAlt:
          "Infographic: the Krebs cycle, the mitochondrial carbon refinery. Acetyl-CoA enters, NADH, FADH2, GTP, and CO2 come out. Carbs and fat both arrive as acetyl-CoA.",
        imageCredit: "The cycle’s main job is loading electron carriers for the ETC. Educational only.",
      },
      {
        title: "Electron transport chain",
        image: "/images/nerd-etc.png",
        imageAlt:
          "Infographic: the electron transport chain, the mitochondrial hydroelectric plant. NADH and FADH2 deliver electrons, proton pumps fill the H+ reservoir, ATP synthase spins to recharge ATP. Oxygen is the final electron acceptor.",
        imageCredit: "Most ATP from glucose is made here. Educational only.",
      },
    ],
  },
  {
    id: "burning-fat",
    title: "How does my body decide which fuel?",
    lede: "You are almost always burning fat. The mix shifts all day. A moment of fat-burn is not the same as losing body fat.",
    paragraphs: [
      "The freshman fifteen that so commonly occurs that first year of college is attributable to many concepts below. As we are fasting overnight we are mostly using fat stores for fuel, since insulin is low and we are very inactive.",
      "If this night of sleep occurred in a tent in the Rockies and we were woken up by a bear and suddenly running for our lives, the fuel of choice would shift to glycogen (stored glucose).",
      "If we survived this ordeal and found the nearest Irish pub and had a few rounds of whiskey and beer to celebrate, followed by a big plate of Irish nachos and a Paddy Burger, now we shift gears in metabolism.",
      "If it was just the food, we’d shut down fat burning and start fat storing and focusing on burning the carbs from the meal. We have limited carb storage so we focus on that first. Adding the booze — which is metabolized to the ol’ acetaldehyde, a.k.a. poison — goes right to the top of the priority list to clear from the body. Now even the carbs might turn to fat if glycogen stores are full.",
      "As the alcohol is cleared and the carbohydrates are stored in muscle and liver, all the fat that was in that meal is now on the hips. You can see how this process, repeated over a couple of semesters, can create a new experience on the scale by the time you say sophomore year.",
      "Basically we burn fuel based on how easy we store it, how toxic it is to us, and how quickly we can use it — and this is constantly in flux based on what is happening in the moment, as noted above.",
      "Still, if all those different fuels and the calories tied to them add up to a number that is less than what we need for the day, we will eventually get to a point where we use fat to fill in the gap, and we will burn off the fat from the hips that just got stored there earlier — and then some.",
      "See below for pretty pictures to summarize this neat dance that occurs in the body.",
    ],
    image: "/images/burning-fat.png",
    imageAlt:
      "Infographic: you are almost always burning fat. Fuel mix shifts all day. Fat burned in a moment is not the same as losing body fat over weeks. Trends in weight, waist, photos, and clothing fit matter more than ketones or a fat-burning zone on a watch.",
    imageCredit: "References: Open Evidence — openevidence.com",
    steps: [
      {
        title: "The fuel mix",
        image: "/images/burning-fat.png",
        imageAlt:
          "Infographic: you are almost always burning fat. Fuel mix shifts all day. Fat burned in a moment is not the same as losing body fat over weeks. Trends in weight, waist, photos, and clothing fit matter more than ketones or a fat-burning zone on a watch.",
        imageCredit: "References: Open Evidence — openevidence.com",
      },
      {
        title: "Mix, not a switch",
        paragraphs: [
          "Your body does not flip fuels on and off. It continuously changes the mix. Sprint and glycogen takes a bigger share. Sit and fat takes a bigger share. Both still contribute.",
        ],
        image: "/images/nerd-metabolic-flexibility.png",
        imageAlt:
          "Infographic: metabolic flexibility. Sprint is carbohydrate-dominant, rest is fat-dominant. The mix shifts with ATP demand, fuel availability, and hormones — not an on/off switch.",
        imageCredit: "A metabolically flexible body matches the fuel mix to the moment. Educational only.",
      },
      {
        title: "Alcohol",
        paragraphs: [
          "Alcohol is about 7 calories a gram, and the body cannot store it as ethanol. Clearing it jumps the front of the line — fat burning pauses, and some of the meal’s fat waits on the hips. That is the Irish-pub chapter of the story above.",
        ],
        image: "/images/nerd-alcohol.png",
        imageAlt:
          "Infographic: how alcohol becomes fuel. Ethanol to acetaldehyde to acetate to acetyl-CoA to ATP. About 7 kcal per gram. The liver clears it first, which temporarily rewires the fuel mix and suppresses fat burning.",
        imageCredit:
          "Alcohol supplies usable energy — but clearing it temporarily rewires the body’s fuel economy. Educational only. Not a drinking guide.",
      },
    ],
  },
  {
    id: "fat-burn-limit",
    title: "Your body has a fat-burning speed limit",
    lede: "Stored fat can only release energy so fast. Push the deficit past that ceiling and muscle starts paying the bill.",
    stolenFrom: "Klein et al., Gastroenterology (2002); Arner et al., Nature Medicine (2019)",
    paragraphs: [
      "You can only pull energy out of stored fat so quickly. A useful research-based rule of thumb is about 31 calories per day for every pound of body fat you are carrying. That is a ceiling, not a promise, and not an exact limit for every person.",
      "The more fat you have, the higher that potential rate. Roughly: 20 lb of fat ≈ 620 calories a day. 50 lb ≈ 1,550. 80 lb ≈ 2,480. As you get leaner, the ceiling falls. That is why the last 10 pounds feel slower than the first 30, and why a deficit that was fine at a higher weight starts chewing on muscle when you are already pretty lean.",
      "Do not confuse the rate with the tank. About 31 calories per pound per day is how fast stored fat may supply energy. About 3,500 calories per pound is the approximate energy stored in one pound of fat. One is speed. The other is capacity.",
      "If your daily deficit is bigger than that ceiling, fat may not cover the full gap. The rest tends to come from lean tissue — especially if protein is low and you are not lifting. Aggressive dieting is how people “lose weight” and still look softer.",
      "The leaner you get, the slower you should cut. Smaller deficit. Enough protein. Resistance training. Same three moves as everywhere else on this site — they just matter more when the fat warehouse is running low.",
    ],
    image: "/images/nerd-fat-burn-limit.png",
    imageAlt:
      "Infographic: stored fat can only release energy so fast. About 31 calories per day per pound of body fat is a research-based ceiling. A deficit past that ceiling raises the risk of losing muscle. Rate is not the same as the 3,500 calories stored in a pound of fat.",
    imageCredit:
      "Research-based estimate, not an exact personal limit. Klein et al., Gastroenterology (2002); Arner et al., Nature Medicine (2019). Individual physiology varies.",
    seeAlso: {
      hash: "protein",
      label: "Why we keep protein high in a deficit",
      note: "So the gap does not get taken from muscle.",
    },
  },
  {
    id: "carbon",
    title: "Everything is carbon. You’re carbon. I’m carbon. It’s all carbon.",
    lede: "Follow one carbon atom from the air to a plant to you, then out the lungs as CO2.",
    paragraphs: [],
    image: "/images/carbon.png",
    imageAlt:
      "Infographic: follow one carbon atom from atmosphere to plant to food to body fat or ATP, then out the lungs as CO2. Carbon in versus carbon out.",
    imageCredit:
      "As explained by Dr. Andy Galpin on Huberman Lab and Dr. Ted Naiman in The P:E Diet.",
  },
  {
    id: "how-much",
    title: "How much you eat matters more than what you eat",
    lede: "Excess body fat is the biggest lever. How much you eat often matters more than eating perfectly.",
    stolenFrom: "Open Evidence",
    paragraphs: [],
    image: "/images/excess-body-fat.png",
    imageAlt:
      "Infographic: excess body fat is the biggest lever for metabolic health. How much you eat often matters more than eating perfectly. Visceral and ectopic fat raise risk. A surplus of healthy food can worsen risk; a deficit even with imperfect food often improves markers. The best answer is both high-protein food and the right total calories.",
    imageCredit: "Credit / reference: Open Evidence — openevidence.com",
  },
  {
    id: "sweeteners",
    title: "But it's fake! What are nonnutritive sweeteners exactly?",
    lede: "Sugar is a sweet signal plus fuel. Nonnutritive sweeteners are the signal with almost no fuel. That is the whole trick.",
    stolenFrom: "Dr. Layne Norton",
    paragraphs: [
      "Because they are hundreds to thousands of times sweeter than sugar, you only need a tiny amount. Typical diet-soda intake stays well below the amounts considered safe every day for a lifetime. Petri-dish headlines and mega-dose rat studies are not how people actually use Diet Coke.",
      "They are useful for cutting sugar and calories. They are not required, and they are not a magic weight-loss tool. If you have PKU, avoid aspartame. “Sugar-free” still does not make a cookie a health food.",
    ],
    image: "/images/nerd-sweeteners.png",
    imageAlt:
      "Infographic: nonnutritive sweeteners are a sweet signal with almost no fuel. Metabolic passports for aspartame, sucralose, stevia, monk fruit and others. Little or no glucose or insulin rise when consumed alone. Approved use is considered safe at established intake limits.",
    imageCredit: "Sweet signal. Almost no fuel. Educational only.",
    videoId: "HmXDu897fic",
    videoTitle: "Artificial Sweeteners are Toxic?",
    videoCredit: "Dr. Layne Norton · Biolayne",
    videoSummary:
      "A short, evidence-first look at the scare headlines. Human trials do not show the harm that petri-dish and mega-dose animal studies get shared as.",
  },
  {
    id: "personal-fat-threshold",
    title: "What actually causes type 2 diabetes",
    lede: "Type 2 is usually the fuel tank overflowing past your personal fat threshold — not a life sentence.",
    stolenFrom: "Dr. Ted Naiman — Personal Fat Threshold; Open Evidence",
    paragraphs: [
      "As discussed above: the body is a machine. It is made of parts, and it runs on fuel. The parts are protein. The fuel is carbs and fats. Type 2 diabetes is what happens when the fuel tank overflows.",
      "About 90–95% of all diabetes is type 2. Of that, 80–90% can pretty much be explained by the “personal fat threshold” as the cause. After years of gradual overfueling, the tank finally gets too full, overflowing into the organs that help regulate blood sugar.",
      "Everyone has a personal limit — highly individual — for how much fat the body can store safely under the skin. Genetics largely determine this capacity: some people can generate new fat cells when full and can keep expanding subcutaneous storage, avoiding insulin resistance even as they gain substantial weight (in rare cases reaching extremes like those seen on TV weighing 1,000 pounds), while others overflow after only a modest extra 10 pounds or so.",
      "Most of us eventually max out at some point. Once that limit is passed, excess fuel spills into visceral fat around the organs. Keep filling up beyond that and fat accumulates in and around the liver and pancreas. The liver, overflowing with fat and glucose, essentially starts leaking fuel; the pancreas grows sluggish and can no longer keep up with the body’s insulin demands. Blood sugar stays elevated, [[a1c]] climbs, and type 2 diabetes is the result. Yes, this is a gross oversimplification, but it is essentially what is happening and has been shown in multiple studies to be the case.",
      "My biggest pet peeve is that most patients are never told how reversible type 2 diabetes is. If you can understand the process by which you became diabetic, if we reverse your steps, we can largely revert you back to the way you were before. There are aspects that never quite return back to 100% normal, but you can get pretty close. Still, people get handed a lifetime prescription and a shrug, and I feel that we can do better.",
      "Now just to clarify, this is NOT type 1 diabetes. Type 1 is an entirely different beast — an autoimmune failure to make insulin — and a whole other discussion.",
    ],
    image: "/images/nerd-pft.png",
    imageAlt:
      "Infographic: your personal fat threshold. Safe subcutaneous storage, the personal limit, visceral overflow, fatty liver, ectopic fat in pancreas and muscle, then circulating fuel overflow. Why two people at the same weight can differ, the metabolic dominoes, and how to move back below the threshold.",
    imageCredit:
      "Educational model. Individual fat distribution and disease progression vary. Never stop diabetes medication without clinician guidance. Personal Fat Threshold hypothesis · ReTUNE · DiRECT · Twin Cycle research · ADA Standards of Care.",
    extraImages: [
      {
        src: "/images/nerd-personal-fat-threshold.png",
        alt: "Infographic: when your personal fat threshold is crossed. Safe storage, the tipping zone, then spillover into muscle, liver, and pancreas. Early type 2 can sometimes move back below this point.",
        credit: "The tipping point from safe storage to metabolic spillover. Educational only.",
      },
    ],
    seeAlso: {
      hash: "reverse-diabetes",
      label: "How to reverse type 2 diabetes (for most)",
      note: "The other half of the sentence.",
    },
    videoId: "VWfpKJ9ltdk",
    videoTitle: "Personal Fat Threshold",
    videoCredit: "Dr. Ted Naiman",
    videoSummary:
      "Naiman’s 14-minute walk through personal fat threshold: why two people at different sizes can have completely different metabolic health, and why getting back under your own threshold reverses the overflow that shows up as insulin resistance.",
  },
  {
    id: "a1c",
    title: "What is hemoglobin A1c?",
    lede: "A1c is the three-month average of blood sugar — the percent of red cells with sugar stuck to them.",
    paragraphs: [],
    image: "/images/open-evidence-a1c.png",
    imageAlt:
      "Infographic: hemoglobin A1c is the three-month average of blood sugar, measured as the percent of red blood cells with sugar stuck to them.",
    imageCredit: "Credit / reference: Open Evidence — openevidence.com",
  },
  {
    id: "reverse-diabetes",
    title: "How to reverse type 2 diabetes (for most)",
    lede: "For most people with type 2 diabetes, emptying the extra fuel — especially fat in the liver and pancreas — can bring blood sugar back down.",
    stolenFrom: "Open Evidence; Dr. Ted Naiman — Personal Fat Threshold",
    paragraphs: [
      "For most people with type 2 diabetes, this is reversible to some extent. Remission means normal blood sugar without diabetes medications. Lose the fat inside the liver and pancreas, and the organs can start working again.",
      "We decrease fat stores through caloric restriction. Calories below maintenance. How many do I need to be below maintenance? [[hormozi]] That is emptying the fuel tank. There is no one magic diet. Very-low-calorie shakes, low-carb, low fat, paleo, vegan, Mediterranean-style — they can all work. The common denominator is the calorie reduction and the inherent fat lost.",
      "The important thing to remember once again is to keep protein high while you are in a deficit. About a gram per pound. This prevents the body stealing fuel from the muscle itself out of desperation. Our body still thinks it is 10,000 BC and doesn’t know there’s a Walmart and eight McDonald’s around the corner. It thinks we might starve tomorrow, and muscle uses a lot more energy than fat at rest. If you are not using your muscles or feeding the muscles, it will dispense with the muscles.",
      "So: losing excess fat, especially belly fat, is the single most powerful change you can make. Keep and build muscle with resistance work. Do both. If you have to prioritize, reducing fat has the biggest payoff. The number on the scale is not the whole story. Where the fat is stored matters more.",
      "Resistance training of some kind. It increases insulin sensitivity in the muscle. It increases mitochondria — the powerhouses that burn the fuel — and it raises metabolic rate. You do not need a 90-minute bro session unless that flaps your jacks. Bare bones: at least one set to failure of a push, a pull, and a leg. Two to four days a week is enough to count.",
      "Walk. 10,000 steps a day, or more. Not glamorous. It burns fuel, and it is the activity most people will actually do on a work week.",
      "Medications can aid this. GLP-1s, metformin, the rest of the toolbox. If we are keeping it simple, the bare-bones approach is: calories below maintenance, protein high in the deficit, walk, lift a little. Do not start a crash diet or stop insulin or other diabetes medication on your own. Blood sugar can drop fast. Work with your clinician so the meds come down as the tank empties, not as a surprise.",
      "Remission is not the same as cured. Keep the fat off and it tends to stay gone. The overflow comes back and so does the diabetes.",
      "I hope to offer consultations in the future and be a part of this process for patients. I am not able to provide that yet.",
    ],
    image: "/images/open-evidence-t2d-reversible.png",
    imageAlt:
      "Infographic: type 2 diabetes is reversible for many people by losing extra body fat, especially fat in the liver and pancreas, then keeping it off.",
    imageCredit:
      "Credit / reference: Open Evidence — openevidence.com. A research summary, not a personal treatment plan. Do not stop diabetes medication without your clinician.",
    seeAlso: {
      hash: "protein",
      label: "Why we keep protein high in a deficit",
      note: "So the machine still has parts.",
    },
  },
  {
    id: "cholesterol",
    title: "Understanding Cholesterol",
    lede: "Cholesterol is essential. The danger is too many ApoB-containing particles circulating for too long.",
    stolenFrom: "Open Evidence; 2026 ACC/AHA Dyslipidemia Guideline",
    paragraphs: [
      "Cholesterol is cargo. Lipoproteins are the trucks. ApoB is the ID tag on every atherogenic particle — each VLDL, remnant, and LDL carries one. LDL-C is how much cholesterol is inside LDL. ApoB is how many of those particles you have. Non-HDL-C is the cholesterol inside all ApoB particles.",
      "More ApoB particles for more years means more chances to enter the artery wall, get stuck, and build plaque. High HDL does not cancel high LDL or ApoB.",
      "Energy surplus past your personal fat threshold, saturated fat, genetics, and inactivity all push the numbers. If extra fat is stored, a sustained calorie deficit is often the highest-leverage move — even about 5% weight loss can improve the pattern.",
      "Levers that work: swap butter and processed fats for olive oil, avocado, nuts, and fish; add oats, barley, beans, and plant sterols; get below your personal fat threshold; and exercise. Low-carb, low-fat, and fasting each change the labs differently. Recheck lipids after a major diet or weight change.",
      "Lifestyle is first. Medication is not a personal failure — genetics can overpower an excellent lifestyle. Treatment goals depend on total cardiovascular risk, not one isolated number. Do not stop prescribed lipid medication without speaking with your clinician.",
    ],
    image: "/images/nerd-cholesterol.png",
    imageAlt:
      "Infographic: cholesterol as cargo, lipoproteins as carriers, ApoB as the particle count that drives plaque. Energy surplus, diet, exercise, fasting, genetics, and medication all change the numbers. High HDL does not cancel high LDL or ApoB.",
    imageCredit:
      "Educational only. Source synthesis: OpenEvidence.com · 2026 ACC/AHA Dyslipidemia Guideline · American Heart Association Dietary Guidance · NIH Endotext. Not a substitute for your clinician. Do not stop prescribed lipid medication without speaking with them.",
    tldrImage: "/images/nerd-cholesterol-simplified.png",
    tldrImageAlt:
      "TL;DR infographic: Cholesterol, Simplified. Cargo versus carriers, how plaque starts, the energy-surplus pathway, what raises LDL, the five moves that work, and the four lab numbers that matter.",
    tldrImageCredit:
      "TL;DR version. Quick-read summary — see the full infographic for details. Educational only. Sources: OpenEvidence.com · 2026 ACC/AHA · American Heart Association · NIH Endotext.",
    extraImages: [
      {
        title: "A deeper dive into HDL",
        src: "/images/nerd-hdl.png",
        alt: "Infographic: how HDL works. HDL is a particle that moves cholesterol to the liver — it does not scrub arteries clean. Reverse cholesterol transport, what else HDL can do, how HDL-C can rise, ways to raise the number that do not equal better health, and reading the lab in context.",
        credit:
          "Educational only. Lipid treatment should be based on total cardiovascular risk and individualized with a qualified clinician. Sources: NHLBI · American Heart Association · AIM-HIGH · HPS2-THRIVE · HDL efflux research.",
      },
    ],
    seeAlso: {
      hash: "personal-fat-threshold",
      label: "What actually causes type 2 diabetes",
      note: "The same overflow story, from a blood-sugar angle.",
    },
  },
  {
    id: "you-are-what-you-eat",
    title: "You are what you eat",
    lede: "Every meal is molecules the body builds, stores, burns, or eliminates.",
    paragraphs: [],
    image: "/images/you-are-what-you-eat.png",
    imageAlt:
      "Infographic: your food becomes you. Every meal is molecules the body builds, stores, burns, or eliminates.",
    imageCredit: "Every bite has a destination.",
  },
  {
    id: "stardust",
    title: "You are made of stardust",
    lede: "This is just a fun one. It hurts my brain every once in a while to think about the fact that the atoms I am touching on my arm were floating around in space,...lightyears away...after stars exploded.\n\nAll of us...have been to space.",
    paragraphs: [],
    image: "/images/stardust.png",
    imageAlt:
      "Infographic: follow one carbon atom from an ancient star through a plant, a cow, a burger, and into a biceps. The atoms in you have a history older than Earth.",
    imageCredit: "The atoms in you have a history older than Earth.",
  },
] as const;

export const nerdGroups = [
  {
    id: "machine",
    title: "Build and repair",
    topicIds: ["protein", "muscle", "muscle-speed", "why-muscle"],
  },
  {
    id: "fuel",
    title: "Fuel and energy",
    topicIds: ["energy", "fuel-biochem", "burning-fat", "fat-burn-limit", "carbon", "how-much", "sweeteners"],
  },
  {
    id: "overflow",
    title: "When it goes wrong",
    topicIds: ["personal-fat-threshold", "a1c", "reverse-diabetes", "cholesterol"],
  },
  {
    id: "bigger",
    title: "The bigger picture",
    topicIds: ["you-are-what-you-eat", "stardust"],
  },
] as const;

export const nerdCovers: Partial<Record<(typeof nerdTopics)[number]["id"], { src: string; alt: string }>> = {
  protein: {
    src: "/images/nerd-covers/protein.jpg",
    alt: "Protein foods becoming amino acids, then muscle fibers.",
  },
  muscle: {
    src: "/images/nerd-covers/muscle.jpg",
    alt: "Lifting with muscle fibers under tension — train, then the tissue rebuilds.",
  },
  "muscle-speed": {
    src: "/images/nerd-covers/muscle-speed.jpg",
    alt: "Amino acids falling through an hourglass into muscle fiber — growth takes time.",
  },
  "why-muscle": {
    src: "/images/nerd-covers/why-muscle.jpg",
    alt: "An older hiker with heart, muscle, and bone shown — independence, not just size.",
  },
  energy: {
    src: "/images/nerd-covers/energy.jpg",
    alt: "Protein builds the machine. Carb and fat fill the tanks.",
  },
  "fuel-biochem": {
    src: "/images/nerd-covers/fuel-biochem.jpg",
    alt: "A mitochondrion burning carbs and fat into ATP.",
  },
  "burning-fat": {
    src: "/images/nerd-covers/burning-fat.jpg",
    alt: "Walking on fat, sprinting on glycogen — the fuel mix shifts with the work.",
  },
  "fat-burn-limit": {
    src: "/images/nerd-covers/fat-burn-limit.jpg",
    alt: "Fat flowing through a limited valve into mitochondria — a speed limit on fat burn.",
  },
  carbon: {
    src: "/images/nerd-covers/carbon.jpg",
    alt: "A carbon atom cycling from air to a plant to food to a breath of CO2.",
  },
  "how-much": {
    src: "/images/nerd-covers/how-much.jpg",
    alt: "A scale: a pile of whole food versus a burger and fries, with the body in the middle.",
  },
  sweeteners: {
    src: "/images/nerd-covers/sweeteners.jpg",
    alt: "Sweet signal to the brain, almost no fuel — sugar crystals versus a diet drink.",
  },
  "personal-fat-threshold": {
    src: "/images/nerd-covers/personal-fat-threshold.jpg",
    alt: "Fat overflowing into the liver and pancreas — the personal fat threshold.",
  },
  a1c: {
    src: "/images/nerd-covers/a1c.jpg",
    alt: "A red blood cell opened to show hemoglobin with sugar attached.",
  },
  "reverse-diabetes": {
    src: "/images/nerd-covers/reverse-diabetes.jpg",
    alt: "Emptying extra fat so the liver and pancreas can work — type 2 can reverse.",
  },
  cholesterol: {
    src: "/images/nerd-covers/cholesterol.jpg",
    alt: "An artery wall with cholesterol particles and plaque building up.",
  },
  "you-are-what-you-eat": {
    src: "/images/nerd-covers/you-are-what-you-eat.jpg",
    alt: "A meal becoming molecules, then muscle, fat, and the rest of you.",
  },
  stardust: {
    src: "/images/nerd-covers/stardust.jpg",
    alt: "A figure made of stars, with Earth and a galaxy behind them.",
  },
};

export type StapleRecipe = {
  name: string;
  how: string;
  ingredients: string[];
  swap?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const hormoziRecipes: StapleRecipe[] = [
  {
    name: "Fruity Pebbles yogurt bowl",
    how: "Stir Crystal Light into 0% Greek yogurt. Keep the cereal on top so it stays crunchy. Do not mix it in.",
    ingredients: [
      "Fage 0% Greek yogurt, ~32 oz tub",
      "1 packet Crystal Light (fruit punch / berry)",
      "½–1 cup Fruity Pebbles on top — or a high-protein cereal",
    ],
    swap: "Ghost protein cereal is a good swap here. About 17–18 g of protein per serving versus about 1 g in Fruity Pebbles, similar crunch if you keep it on top. Premier Protein cereal lives in the same neighborhood. Macros below are for the Fruity Pebbles version.",
    calories: 550,
    protein: 83,
    carbs: 54,
    fat: 2,
  },
  {
    name: "Premier Protein cereal + Fairlife",
    how: "Cereal in a bowl. High-protein milk on it. That is the whole recipe.",
    ingredients: [
      "Premier Protein cereal, 3 cups — or Ghost protein cereal",
      "Fairlife ultra-filtered milk or Core Power, ~16 oz",
    ],
    swap: "Ghost works here too. Slightly less protein per cup than Premier, still a real protein cereal instead of dessert with a crunch.",
    calories: 700,
    protein: 90,
    carbs: 80,
    fat: 12,
  },
  {
    name: "Chocolate egg whites",
    how: "Liquid egg whites + zero-sugar Hershey’s syrup. Drink it, or microwave it until it puffs.",
    ingredients: [
      "Liquid egg whites, ~3 cups (about a carton and a half)",
      "Zero-sugar Hershey’s syrup, 1–2 tbsp",
    ],
    calories: 270,
    protein: 54,
    carbs: 8,
    fat: 0,
  },
  {
    name: "Microwave egg-white salsa bowl",
    how: "Microwave the whites until they set. Spoon salsa on top. Looks like a sad souffle. Hits like protein.",
    ingredients: ["Liquid egg whites, ~3 cups", "Zero-calorie or low-calorie salsa"],
    calories: 260,
    protein: 54,
    carbs: 8,
    fat: 0,
  },
  {
    name: "Fairlife as the meal",
    how: "Open the bottle. That is the prep. Two Core Power Elite shakes is the version from the video.",
    ingredients: ["Fairlife Core Power Elite 42 g, two bottles"],
    calories: 460,
    protein: 84,
    carbs: 16,
    fat: 3,
  },
  {
    name: "Jerky + light string cheese",
    how: "The travel combo. Keep both in the bag. No fridge required for a work day.",
    ingredients: ["Original beef jerky, ~1 bag as sold", "Light string cheese, 4 sticks"],
    calories: 680,
    protein: 84,
    carbs: 24,
    fat: 18,
  },
  {
    name: "Shrimp cocktail",
    how: "Thaw the pre-cooked shrimp. Dip in cocktail sauce. Zero cooking.",
    ingredients: ["Pre-cooked shrimp, ~12 oz", "Cocktail sauce, ~¼ cup"],
    calories: 400,
    protein: 72,
    carbs: 16,
    fat: 4,
  },
  {
    name: "Tuna yogurt bowl",
    how: "Drain the tuna. Stir in 0% yogurt until it looks like tuna salad. Mustard is optional. Low-calorie mayo or Miracle Whip if you want it creamier.",
    ingredients: [
      "Chunk light tuna in water, enough for ~66 g protein (about 3 cans / 15 oz drained)",
      "Fage 0% yogurt, ~¾ cup",
      "Yellow mustard — optional",
      "Or low-calorie mayo / Miracle Whip if you want it creamier",
    ],
    calories: 380,
    protein: 84,
    carbs: 10,
    fat: 4,
  },
  {
    name: "Ezekiel lox toast",
    how: "Toast the bread. Fat-free cream cheese. Mash the salmon on top. Three open-face slices is his sitting.",
    ingredients: [
      "Ezekiel 4:9 bread, 3 slices, toasted — or any high-protein / keto bread",
      "Fat-free cream cheese",
      "Smoked salmon / lox, ~8 oz",
    ],
    swap: "Hero, Carbonaut, Aldi’s keto loaf, or whatever high-protein bread is on the shelf this week. Same job. Macros below are for Ezekiel.",
    calories: 620,
    protein: 72,
    carbs: 48,
    fat: 12,
  },
  {
    name: "Lean beef + riced cauliflower",
    how: "Microwave a bag of riced cauliflower. Brown extra-lean beef or turkey. Sauce: light mayo, sriracha, a packet of stevia if you want it sweet-heat.",
    ingredients: [
      "93/7 or 96/4 ground beef or ground turkey, ~8 oz cooked",
      "Steam-bag riced cauliflower",
      "Light mayo + sriracha (+ optional stevia)",
    ],
    calories: 520,
    protein: 52,
    carbs: 14,
    fat: 24,
  },
  {
    name: "Bro nachos",
    how: "Quest chips on a plate. Warm Hormel chili (no beans). Greek yogurt and salsa on top instead of sour cream.",
    ingredients: [
      "Quest Cool Ranch chips, 2 bags",
      "Hormel chili, no beans, 1 can",
      "Fage 0% yogurt + salsa",
    ],
    calories: 890,
    protein: 100,
    carbs: 52,
    fat: 28,
  },
];

export const hormoziRecipeNotes = [
  "Stolen from Alex Hormozi’s cookbook video. I did not invent these. I am the middleman.",
  "His plates are often a full meal at 80–100 g of protein. Cut everything in half if that is more than you need in one sitting.",
  "Calories, protein, carbs, and fat are rounded from the video plus typical labels. Brands reformulate. If the package disagrees, the package wins.",
] as const;

export const referenceVideos = [
  {
    videoId: "-BcGPN2nXs0",
    title: "How Much Protein Is Too Much for Your Kidneys?",
    credit: "Dr. Layne Norton",
    summary:
      "Human trials: higher protein does not harm healthy kidneys. The 1980s myth does not match the data.",
    anchor: "protein-kidneys",
    usedOn: { slug: "protein-per-pound" as const, label: "One Gram Per Pound" },
  },
  {
    videoId: "fxyhIXZ6Yog",
    title: "The Alex Hormozi Diet (REVEALED)",
    credit: "Alex Hormozi",
    summary:
      "Five minutes. Calories from body weight and your goal, a gram of protein per pound, leftover calories spent however you want.",
    anchor: "hormozi",
    usedOn: { slug: "where-to-start" as const, label: "Where to Start" },
  },
  {
    videoId: "hGX_z5rXRlU",
    title: "The Alex Hormozi Cookbook [REVEALED]",
    credit: "Alex Hormozi",
    summary:
      "Twelve zero-prep high-protein assemblies. Yogurt and cereal, lox on Ezekiel, tuna-yogurt, shrimp, cauliflower beef, bro nachos, egg whites. I stole the list and put the recipes on Regular Food Hacks.",
    anchor: "hormozi-cookbook",
    usedOn: { slug: "staples" as const, label: "Regular Food Hacks" },
  },
  {
    videoId: "HmXDu897fic",
    title: "Artificial Sweeteners are Toxic?",
    credit: "Dr. Layne Norton · Biolayne",
    summary:
      "A short, evidence-first look at the scare headlines. Human trials do not show the harm that petri-dish and mega-dose animal studies get shared as. This is why diet pop stays on the drink list.",
    anchor: "fake-sugar",
    usedOn: { slug: "dont-drink-calories" as const, label: "Don't Drink Calories" },
  },
  {
    videoId: "VWfpKJ9ltdk",
    title: "Personal Fat Threshold",
    credit: "Dr. Ted Naiman",
    summary:
      "Why two people at different sizes can have completely different metabolic health, and why getting back under your own threshold reverses the overflow that shows up as type 2 diabetes.",
    anchor: "naiman",
    usedOn: { slug: "nerd-out" as const, label: "Nutritional Nerd Out", hash: "personal-fat-threshold" },
  },
] as const;

export const readingList = [
  {
    title: "The P:E Diet",
    authors: "Dr. Ted Naiman and William Shewfelt",
    why: "The protein-to-energy idea behind the label trick. If you only steal one book, start here.",
  },
  {
    title: "Satiety Per Calorie",
    authors: "Dr. Ted Naiman",
    why: "Why some food shuts hunger down per calorie and some food does not. Same instinct as the hacks, with more of the why.",
  },
] as const;

export function getHack(slug: string): Hack | undefined {
  return hacks.find((h) => h.slug === slug);
}

export function getNerdTopic(id: string) {
  return nerdTopics.find((topic) => topic.id === id);
}
