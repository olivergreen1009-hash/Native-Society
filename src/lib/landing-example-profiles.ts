/**
 * Illustrative landing cards only — not real members.
 *
 * Portrait photos under /public/examples/ (~800px wide, 3:4). AI-generated
 * illustrative portraits (fictional subjects, varied settings/outfits); not
 * real people. Alexandra remains first in display order.
 */
export interface LandingExampleProfile {
  id: string;
  firstName: string;
  age: number;
  neighborhood: string;
  schoolLine: string;
  summerDestination?: string;
  interests: string[];
  prompt: string;
  lookingFor: string;
  imageUrl: string;
}

export const landingExampleProfiles: LandingExampleProfile[] = [
  {
    id: "example-alexandra",
    firstName: "Alexandra",
    age: 32,
    neighborhood: "Upper East Side",
    schoolLine: "Chapin → Dartmouth",
    summerDestination: "Hamptons",
    interests: [
      "Gallery openings",
      "tennis",
      "long Sunday lunches",
      "skiing in Vermont",
    ],
    prompt:
      "A perfect Saturday: the farmers market, a new exhibition, and dinner somewhere I can walk to.",
    lookingFor: "Long-term partnership",
    // AI illustrative — blonde, camel coat, soft indoor window light
    imageUrl: "/examples/example-alexandra.jpg",
  },
  {
    id: "example-james",
    firstName: "James",
    age: 35,
    neighborhood: "West Village",
    schoolLine: "Trinity → Georgetown",
    summerDestination: "Nantucket",
    interests: ["Sailing", "wine", "vinyl records", "weekends upstate"],
    prompt:
      "I'm happiest at a long dinner with good conversation and no phones on the table.",
    lookingFor: "Long-term partnership",
    // AI illustrative — linen on rooftop terrace, golden hour
    imageUrl: "/examples/example-james.jpg",
  },
  {
    id: "example-charlotte",
    firstName: "Charlotte",
    age: 27,
    neighborhood: "Tribeca",
    schoolLine: "Brearley → Brown",
    summerDestination: "Hamptons",
    interests: ["Pilates", "supper clubs", "art fairs", "Hamptons summers"],
    prompt:
      "I'll always say yes to a spontaneous trip somewhere with good food.",
    lookingFor: "Dating to see what happens",
    // AI illustrative — park walk, trench coat, afternoon sun
    imageUrl: "/examples/example-charlotte.jpg",
  },
  {
    id: "example-henry",
    firstName: "Henry",
    age: 29,
    neighborhood: "Brooklyn Heights",
    schoolLine: "Poly Prep → Williams",
    summerDestination: "Newport",
    interests: ["Cycling", "cooking", "jazz", "the occasional round of golf"],
    prompt: "I make a very good risotto and will absolutely cook for you.",
    lookingFor: "Long-term partnership",
    // AI illustrative — burgundy sweater, jazz club amber light
    imageUrl: "/examples/example-henry.jpg",
  },
  {
    id: "example-olivia",
    firstName: "Olivia",
    age: 38,
    neighborhood: "Riverdale",
    schoolLine: "Fieldston → Penn",
    summerDestination: "Europe",
    interests: ["Reading", "hiking", "wine tastings", "theater"],
    prompt:
      "I've been in this city my whole life and I'm still finding new places I love.",
    lookingFor: "Marriage-minded",
    // AI illustrative — outdoor café, silk blouse, tree-lined street
    imageUrl: "/examples/example-olivia.jpg",
  },
];

const ROTATION_SIZE = 4;

/** Four profiles with age and geography spread; rotates by hour for variety. */
export function activeExampleProfiles(): LandingExampleProfile[] {
  const hourBucket = Math.floor(Date.now() / (1000 * 60 * 60)) % landingExampleProfiles.length;
  const out: LandingExampleProfile[] = [];
  for (let i = 0; i < ROTATION_SIZE; i++) {
    out.push(landingExampleProfiles[(hourBucket + i) % landingExampleProfiles.length]);
  }
  return out;
}