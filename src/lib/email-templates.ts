export interface EmailTemplate {
  id: string;
  title: string;
  subject: string;
  body: string;
}

export const onboardingEmailTemplates: EmailTemplate[] = [
  {
    id: "invitation-accepted",
    title: "Invitation accepted",
    subject: "Your Native Society access is ready",
    body: `Dear [First Name],

Thank you for your interest in Native Society.

After reviewing your background, we are pleased to invite you to the founding cohort. Native Society is a private matchmaking society for adults who grew up in New York City and attended independent private or boarding schools. Introductions are curated and personally managed. There is no casual browsing and no open messaging.

Your login credentials:
Email: [email]
Temporary password: [password]

Please sign in at [login URL] and complete your compatibility questionnaire. Gallery access is granted only after the questionnaire and photographs are approved.

We look forward to making thoughtful introductions.

Oliver Estreich
Native Society`,
  },
  {
    id: "questionnaire-reminder",
    title: "Questionnaire reminder",
    subject: "Complete your Native Society questionnaire",
    body: `Dear [First Name],

Your Native Society account is active, but we have not yet received your compatibility questionnaire.

The questionnaire is required before we can curate your Private Gallery. It typically takes 15–20 minutes. Once submitted and approved, you will receive your first set of profiles.

Login: [login URL]

If you have any questions, reply to this email.

Oliver Estreich`,
  },
  {
    id: "gallery-live",
    title: "Gallery is live",
    subject: "Your Private Gallery is ready",
    body: `Dear [First Name],

Your Private Gallery is now active.

You will see a limited selection of curated profiles. You may request an introduction to anyone who interests you. We will only facilitate the introduction if the interest is mutual. There is no direct messaging before that point.

Login to view your gallery: [login URL]

We recommend reviewing the profiles thoughtfully rather than quickly. Quality of introduction matters more than volume.

Oliver Estreich`,
  },
  {
    id: "post-intro-feedback",
    title: "Post-introduction feedback",
    subject: "Brief feedback on your recent introduction",
    body: `Dear [First Name],

We facilitated an introduction between you and [Other Member First Name] on [date].

If you have a moment, a short confidential note would be helpful:
- Did the introduction feel well-curated?
- Was the process clear and comfortable?
- Any suggestions for future curation?

Your feedback stays private and is used only to improve future introductions.

Thank you,
Oliver Estreich`,
  },
  {
    id: "thirty-day-checkin",
    title: "30-day check-in",
    subject: "How has Native Society been so far?",
    body: `Dear [First Name],

You have been a member for roughly 30 days. I wanted to check in personally.

Have the profiles and introductions felt relevant? Is there anything in your preferences or questionnaire that we should adjust?

Reply with any thoughts—short notes are welcome.

Oliver Estreich`,
  },
];
