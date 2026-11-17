export const CURRENT_AREAS = [
  "Manhattan",
  "Brooklyn",
  "Queens",
  "Bronx",
  "Staten Island",
  "Westchester",
  "Long Island",
  "New Jersey (metro)",
  "Connecticut (metro)",
  "Elsewhere",
] as const;

export const FAMILY_HOME_DURING_HIGH_SCHOOL = [
  "Manhattan",
  "Brooklyn",
  "Bronx",
  "Queens",
  "Staten Island",
  "Westchester",
  "New Jersey",
  "Connecticut",
  "Other",
] as const;

export const NYC_YEARS_BEFORE_18 = [
  "Under 5 years",
  "5–9 years",
  "10–14 years",
  "All of my childhood",
] as const;

export const LOCATION_PREFERENCES = [
  "No preference",
  "Same borough as me",
  "Manhattan only",
  "Brooklyn only",
  "Queens only",
  "Bronx only",
  "Staten Island only",
  "Any NYC borough",
  "NYC metro area",
] as const;

export const GENDER_OPTIONS = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "non_binary", label: "Non-binary" },
  { value: "self_describe", label: "Self-describe" },
] as const;

export const SEEKING_GENDER_OPTIONS = [
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "non_binary", label: "Non-binary people" },
  { value: "open", label: "Open to all genders" },
] as const;

export const RELATIONSHIP_INTENTIONS = [
  "Long-term partnership",
  "Marriage-minded",
  "Dating to see what happens",
  "Seriously dating",
] as const;

export const HIGH_SCHOOL_TYPES = ["Independent day", "Boarding", "Other"] as const;

export const HEARD_ABOUT_OPTIONS = [
  "Friend or partner referral",
  "School alumni network",
  "Social media",
  "Search",
  "Event or talk",
  "Other",
] as const;

export const SCHOOL_SUGGESTIONS = [
  "Trinity School",
  "Dalton School",
  "Collegiate School",
  "Horace Mann",
  "Brearley School",
  "Chapin School",
  "Spence School",
  "Riverdale Country School",
  "Poly Prep",
  "Packer Collegiate",
  "Saint Ann's School",
  "Brooklyn Friends",
  "UNIS",
  "Regis High School",
  "Fieldston",
  "Exeter",
  "Andover",
  "Choate",
  "Deerfield",
  "Hotchkiss",
  "St. Paul's",
  "Groton",
  "Lawrenceville",
  "Other",
];

export const ADMISSION_AGE_MIN = 21;
export const ADMISSION_AGE_MAX = 50;

export const ADMISSION_AGE_COPY = `Currently admitting ages ${ADMISSION_AGE_MIN}–${ADMISSION_AGE_MAX}.`;

export const SUMMER_DESTINATIONS = [
  "Hamptons",
  "Nantucket",
  "Newport",
  "Europe",
  "Other",
] as const;

export type SummerDestination = (typeof SUMMER_DESTINATIONS)[number];