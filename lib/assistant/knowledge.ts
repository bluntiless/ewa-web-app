// Curated knowledge base for the EWA Tracker on-site AI assistant.
// This is the ONLY source of factual grounding the assistant is given, so every
// answer stays accurate to the real site. When site facts change (pricing,
// process, requirements), update this file — no re-indexing or database needed.

export const ASSISTANT_KNOWLEDGE = `
# ABOUT EWA TRACKER LTD
EWA Tracker Ltd is an EAL approved centre delivering the Level 3 Electrotechnical
Experienced Worker Qualification (qualification number 603/5982/1) to experienced
electricians across the UK. It is the direct route for experienced electricians
who do not hold a formal Level 3 qualification to become formally qualified and
work towards the ECS Gold Card.
- Contact email: info@ewatracker.co.uk
- Contact phone: +44 7828 893976
- Serves: United Kingdom

# WHAT IS THE EWA?
The Electrotechnical Experienced Worker Assessment (EWA) is a competence-based
assessment designed by EAL for electricians who gained their expertise on the
job but may not hold a formal Level 3 qualification. It is a practical route to a
recognised Level 3 qualification WITHOUT completing a full apprenticeship.
Key points:
- EAL approved qualification, recognised across the UK.
- Competence-based: focuses on proven real-world ability.
- A key step towards the ECS Gold Card.

## Important entry requirement
From 04/09/2023, learners MUST already hold as a minimum a Level 2 qualification
(as detailed in the TESP skills scan) to take this qualification. See Section 5
of the qualification manual.

## Overseas / non-UK qualifications (ECCTIS comparison)
If a candidate holds electrical qualifications gained OUTSIDE the UK, those
qualifications cannot be accepted at face value. They must first have a formal
comparison carried out by ECCTIS (the UK national agency for the recognition and
comparison of international qualifications, formerly UK NARIC). ECCTIS issues a
Statement of Comparability that maps the overseas qualification to the equivalent
UK level (e.g. confirming it meets the Level 2 minimum entry requirement).
- The candidate obtains this comparison directly from ECCTIS (ecctis.com); it is
  a separate paid service and is NOT arranged or paid for by EWA Tracker Ltd.
- Whenever a visitor mentions overseas, foreign, international, or non-UK
  qualifications/training, the assistant MUST tell them an ECCTIS comparison /
  Statement of Comparability is needed before their qualifications can be
  assessed for EWA eligibility, and recommend they book a consultation call to
  discuss their specific situation.

# THE EWA ASSESSMENT PROCESS (typical steps)
1. Initial Skills Scan — assess existing qualifications and experience to confirm
   the EWA is the right route.
2. Evidence Collection — gather evidence of your work, uploaded via the iOS
   mobile app or the secure SharePoint platform.
3. Practical Assessment — demonstrations of practical skills in a controlled
   environment or via on-site observations.
4. Knowledge Assessment — evaluation of theoretical understanding of
   electrotechnical principles and regulations.
5. Certification — on success you receive the EAL Level 3 qualification.

# ROADMAP TO ECS GOLD CARD (via the EWA route)
To obtain the ECS Gold Card, a candidate typically needs ALL of the following:
1. Achieve the EAL Level 3 Electrotechnical Experienced Worker Qualification
   (603/5982/1) with EWA Tracker Ltd.
2. Pass the AM2E (or AM2ED) — the practical competence end-test for experienced
   workers.
3. Hold a current 18th Edition IET Wiring Regulations qualification (BS 7671) AND
   either the Level 3 Award in Initial Verification of Electrical Installations OR
   the Inspection and Testing of Electrical Installations.
4. Apply for the ECS Gold Card with the Electrotechnical Certification Scheme,
   providing evidence of the EWA, AM2 and 18th Edition qualifications.

IMPORTANT: EWA Tracker Ltd does NOT deliver the 18th Edition, Inspection &
Testing, or AM2 assessments. These are provided by separate training providers
and NET assessment centres. EWA Tracker can recommend approved providers during
a consultation.

# EVIDENCE REQUIREMENTS
- Candidates build a portfolio of evidence of their real electrical work.
- Evidence can be uploaded via the iOS mobile app or the secure SharePoint platform.
- EWA Tracker provides portfolio development support and guidance on what evidence
  is required, plus professional discussion sessions to assess underpinning knowledge.

# PRICING & PACKAGES
Pricing has two parts: (a) the EAL registration fee, and (b) the centre
programme/assessment fee. All pricing is indicative and confirmed during a free
consultation; EAL fees are set by the awarding body and subject to change.

## EAL registration fees
- New registration: £268.80 (inc. VAT) — first-time registration with EAL.
- Transfer registration: £15 — transferring from another EAL approved centre.

## Programme packages (programme fee + EAL registration)
- Standard Programme — Full payment: programme fee £2,000 + £268.80 registration = £2,268.80 total.
- Standard Programme — Instalments: initial payment £768.80, then 3 monthly payments of £500 (total £2,268.80).
- Gold Service — Full payment: programme fee £2,500 + £268.80 registration = £2,768.80 total.
- Gold Service — Instalments: initial payment £768.80, then 4 monthly payments of £500 (total £2,768.80).

## What's included in the EWA programme
Free initial skills scan, no-obligation consultation call, personalised assessment
plan, portfolio development guidance, flexible assessment scheduling, qualified and
experienced assessors, ongoing support, and ECS Gold Card application guidance.

## Additional costs NOT included
The 18th Edition, Level 3 Inspection & Testing, and AM2 assessments are extra and
are delivered by other providers — they are not part of the EWA Tracker fee.

# ON-SITE TOOLS (things the visitor can do on this website)
- Eligibility Checker (path: /eligibility): a quick self-assessment tool to see
  whether the EWA route is likely suitable based on experience and qualifications.
- TESP Skills Scan (path: /skills-scan): download the official fillable Training &
  Experience Self Profile (TESP) Skills Scan PDF, complete it in Adobe Acrobat
  Reader on a DESKTOP/laptop (mobile browsers can corrupt fillable PDFs), then
  upload it for Training Provider review. A free initial skills scan is included.
- Candidate Background Form (path: /candidate-background): download, complete and
  upload a background form as part of onboarding.
- Book a Call (path: /book-a-call): book a free, no-obligation phone consultation.

# KEY LINKS
- Eligibility Checker: /eligibility
- Skills Scan: /skills-scan
- Book a free consultation call: /book-a-call
- EWA cost & pricing guide: /ewa-cost
- ECS Gold Card route: /ecs-gold-card-route
- Contact: /contact
`.trim()
