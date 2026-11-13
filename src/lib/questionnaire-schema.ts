export const QUESTIONNAIRE_SECTION_COUNT = 5;

export const questionnaireSections = [
  {
    id: "relationshipIntent" as const,
    title: "Relationship intent",
    intro:
      "Answer thoughtfully. Responses are used solely to curate introductions and are never shared with other members.",
    fields: [
      {
        key: "q1_seeking",
        label:
          "What type of relationship are you primarily seeking right now?",
        type: "select" as const,
        options: [
          "Serious long-term",
          "Marriage-minded",
          "Open to exploring",
          "Prefer not to define yet",
        ],
      },
      {
        key: "q2_success",
        label:
          "What would a successful outcome from Native Society look like for you in the next 12 months?",
        type: "textarea" as const,
      },
      {
        key: "q3_nyc_schools",
        label:
          "How important is it that a partner also grew up in New York City or attended similar schools?",
        type: "select" as const,
        options: ["Essential", "Strong preference", "Nice to have", "Not important"],
      },
      {
        key: "q4_non_negotiables",
        label:
          "Are there any non-negotiables regarding future plans (children, location, career intensity)?",
        type: "textarea" as const,
      },
    ],
  },
  {
    id: "valuesLife" as const,
    title: "Values & daily life",
    fields: [
      {
        key: "q5_values_rank",
        label:
          "Rank your top five values (comma-separated, 1 = most important): Family, Ambition, Creativity, Intellectual curiosity, Adventure, Stability, Community, Personal growth, Independence, Philanthropy",
        type: "textarea" as const,
        placeholder: "e.g. Family, Stability, Intellectual curiosity, Community, Creativity",
      },
      {
        key: "q6_weekend",
        label: "Describe a typical free weekend in New York for you.",
        type: "textarea" as const,
      },
      {
        key: "q7_evenings",
        label: "How do you prefer to spend most evenings?",
        type: "select" as const,
        options: ["Social", "Quiet at home", "Mix", "Varies widely"],
      },
      {
        key: "q8_shared_interests",
        label:
          "What cultural, intellectual, or creative interests would you most enjoy sharing with a partner?",
        type: "textarea" as const,
      },
    ],
  },
  {
    id: "lifestyle" as const,
    title: "Lifestyle & practical details",
    fields: [
      {
        key: "q9_neighborhoods",
        label:
          "Which neighborhoods do you currently live in or feel most at home in?",
        type: "textarea" as const,
      },
      {
        key: "q10_travel",
        label: "Travel frequency and style",
        type: "textarea" as const,
      },
      {
        key: "q11_activities",
        label: "Regular activities or pursuits",
        type: "textarea" as const,
      },
      {
        key: "q12_lifestyle_factors",
        label:
          "Any lifestyle factors that would strongly attract or deter you?",
        type: "textarea" as const,
      },
    ],
  },
  {
    id: "partnerPrefs" as const,
    title: "Partner preferences",
    fields: [
      {
        key: "q13_age_range",
        label: "Age range you are open to considering.",
        type: "text" as const,
      },
      {
        key: "q14_qualities",
        label: "What qualities or traits tend to make someone interesting to you?",
        type: "textarea" as const,
      },
      {
        key: "q15_request_intro",
        label: "After seeing a profile, what would make you request an introduction?",
        type: "textarea" as const,
      },
      {
        key: "q16_resonant",
        label:
          "Optional: background elements (school, neighborhood, profession, interests) that feel particularly resonant.",
        type: "textarea" as const,
      },
    ],
  },
  {
    id: "profileVisibility" as const,
    title: "Profile & visibility",
    fields: [
      {
        key: "q17_photos",
        label:
          "Photograph upload (demo: describe the 3–5 images you would submit)",
        type: "textarea" as const,
      },
      {
        key: "q18_display_name",
        label: "First name and age (as you would like them displayed)",
        type: "text" as const,
      },
      {
        key: "q19_descriptors",
        label: "Three to five interests or descriptors for your public profile",
        type: "textarea" as const,
      },
      {
        key: "q20_school_visibility",
        label:
          "Would you like your school or neighborhood information visible to other members?",
        type: "select" as const,
        options: ["Yes", "No", "Only after mutual interest"],
      },
      {
        key: "q21_concierge_notes",
        label: "Additional notes for the concierge (optional, private)",
        type: "textarea" as const,
      },
    ],
  },
];

export const ADMIN_QUESTIONNAIRE_SCORING = `Weight shared New York background and relationship intent highest in the founding cohort. Lifestyle compatibility and values alignment are secondary but useful filters. Avoid over-indexing on surface interests.`;
