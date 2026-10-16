// Current-affairs study notes from primary pages read on 16 October 2026 (PRS bill pages, PIB releases, an RBI circular
// reproduced by a news site). Same rules as tools/articles-data.mjs: facts with sources, "background" marks general
// knowledge, no exam predictions. Each entry names the page it was read from.

export const CURRENT_ARTICLES = [
  {
    slug: 'rbi-repo-hike-october-2026',
    category: 'economy',
    title: 'RBI raises repo rate to 5.50%: the first hike since February 2023',
    dek: 'The MPC moved the policy rate up by 25 basis points and changed its stance to calibrated tightening.',
    event: 'Decided 7 October 2026',
    facts: [
      'Repo rate raised by 25 basis points, from 5.25% to 5.50%, under the liquidity adjustment facility (LAF).',
      'Standing deposit facility (SDF) rate: 5.25%. Marginal standing facility (MSF) rate: 5.75%. Effective immediately (RBI circular reproduced by news site).',
      'Stance moved from neutral to "calibrated tightening".',
      'Projections: real GDP growth for FY27 raised to 7.1%; CPI inflation for FY27 raised to 5.2% (news reports).',
      'The 63rd MPC meeting ran from 5 to 7 October 2026.',
    ],
    sections: [
      {
        heading: 'What happened',
        paragraphs: [
          'The Monetary Policy Committee raised the repo rate by a quarter point to 5.50%. The rate is the one at which banks borrow from the RBI, so the hike feeds through to loan rates over time. It is the first hike since February 2023, according to the reports.',
          'Two things stand out. The MPC did not only move the rate; it also changed the stance from neutral to "calibrated tightening", which tells the market that more action is possible. And the Governor, Sanjay Malhotra, reportedly said a rate cut is off the table for now.',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Repo is the rate at which the RBI lends to banks. Reverse repo is the rate at which it borrows from banks (background). The SDF and MSF bracket the corridor: the SDF is the floor, the MSF is the ceiling (background).',
          'The RBI decides the policy rate through the MPC, which has six members, three from the RBI and three external (background).',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Why would a central bank hike when growth is strong? Here the reports point to higher crude prices, geopolitical tension and renewed domestic inflation pressure. Ask: is monetary policy the right tool for supply shocks like oil, or does fiscal policy have to share the load?',
        ],
      },
    ],
    caveats: [
      'The corridor figures come from a reproduction of the RBI circular on taxguru.in. The RBI statement itself was not read here, so check rbi.org.in before quoting.',
      'Sources disagree on the vote. The rate hike is reported as unanimous. The stance change is reported as a 4 to 2 split, with two members preferring to keep the neutral stance. Check the official vote record.',
    ],
    sources: [
      { label: 'Taxguru, RBI raises repo rate to 5.50%, SDF to 5.25% and MSF to 5.75% (reproduces the circular)', url: 'https://taxguru.in/rbi/rbi-raises-repo-rate-5-50-percent-sdf-5-25-percent-msf-5-75-percent.html', kind: 'News report' },
      { label: 'SCC Online, RBI hikes repo rate to 5.50%; shifts policy stance to calibrated tightening', url: 'https://www.scconline.com/blog/post/2026/10/09/rbi-hikes-repo-rate-to-5-50-percent-october-2026/', kind: 'News report' },
      { label: 'Reserve Bank of India (official site, check the statement)', url: 'https://www.rbi.org.in', kind: 'Official' },
    ],
  },
  {
    slug: 'public-examinations-amendment-bill-2026',
    category: 'polity',
    title: 'Public Examinations (Prevention of Unfair Means) Amendment Bill, 2026',
    dek: 'A bill that makes the penalties for paper leaks and cheating much heavier. It covers UPSC, so every aspirant should know it.',
    event: 'Introduced in Lok Sabha 27 July 2026',
    facts: [
      'Amends the Public Examinations (Prevention of Unfair Means) Act, 2024.',
      'The Act covers public examination authorities including the Union Public Service Commission and Staff Selection Commission (per PRS).',
      'Penalties go up. For example, the PRS table shows the minimum jail term for persons in charge of a service provider involved in unfair means rising from 3 years to 5 years, and the fine rising to Rs 5 crore.',
      'Debarment of a service provider that engages in unfair means: from 4 years under the Act to 8 years under the Bill.',
      'Every state and UT must designate a Court of Session as a Special Fast Track Court.',
    ],
    sections: [
      {
        heading: 'What the bill does',
        paragraphs: [
          'The 2024 Act was passed after paper leaks in recruitment exams (background). This bill keeps that structure and makes it harsher. Organised crime gets the heaviest penalty: a minimum of 7 years in jail and a minimum fine of Rs 10 crore, per the PRS table.',
          'Special fast track courts will try the offences under the Act, along with any connected offences under the Bharatiya Nyaya Sanhita, 2023 in the same trial. Appeals go to a bench of two High Court judges, must be filed within 30 days, and should be disposed of within three months where possible. Under the Bill, no appeal can be entertained after 90 days from the judgment.',
          'The bill also changes the investigation provisions, and the PRS summary is cut off on that point. Read the bill text before writing anything about who investigates.',
        ],
      },
      {
        heading: 'Why it matters for you',
        paragraphs: [
          'This is the law that applies to the exams you are preparing for. Read the penalty table and the list of covered authorities yourself. It is a good example of how a law is changed by amending an earlier Act, which is a common question type in Polity.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Is a heavier penalty enough to stop paper leaks? Look at the other side too: the role of the state in investigation, the speed of trials, and whether fast track courts can keep up. This works as a governance answer on accountability in recruitment.',
        ],
      },
    ],
    caveats: [
      'The PRS status panel shows both chambers with a passed marker, but the dates are not clear on the page. Confirm the status on the PRS bill page or Sansad before you write it as passed.',
      'The PRS penalty table lists the Act and the Bill side by side. The reading above follows that table; check the exact figures in the bill text.',
    ],
    sources: [
      { label: 'PRS Legislative Research, Public Examinations (Prevention of Unfair Means) Amendment Bill, 2026', url: 'https://prsindia.org/billtrack/the-public-examinations-prevention-of-unfair-means-amendment-bill-2026', kind: 'Research' },
      { label: 'PRS Legislative Research, bill tracker', url: 'https://prsindia.org/billtrack', kind: 'Research' },
    ],
  },
  {
    slug: 'supreme-court-judges-bill-2026',
    category: 'polity',
    title: 'Supreme Court (Number of Judges) Amendment Bill, 2026',
    dek: 'Raises the number of Supreme Court judges from 33 to 37, excluding the Chief Justice. It replaces an ordinance issued in May 2026.',
    event: 'Introduced in Lok Sabha 20 July 2026',
    facts: [
      'Replaces the Supreme Court (Number of Judges) Amendment Ordinance, 2026, issued on 16 May 2026.',
      'Amends the Supreme Court (Number of Judges) Act, 1956.',
      'Strength (excluding the Chief Justice of India) goes from 33 to 37.',
    ],
    sections: [
      {
        heading: 'What it does',
        paragraphs: [
          'The number of judges of the Supreme Court is set by Parliament through a law (background: Article 124 allows Parliament to fix the number). This bill raises it. An ordinance lapses six weeks after Parliament reassembles, unless a law replaces it first (background). That is why the bill was needed to make the change permanent.',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'The Chief Justice of India is not counted in the number that Parliament fixes for the other judges (per PRS). Know the difference between an ordinance and an Act: an ordinance is issued by the President when Parliament is not in session, and it has to be replaced by a law (background).',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Pendency in courts is often blamed on too few judges. Ask: does adding judges solve delay, or does it also need better case management, more benches and fewer adjournments? The answer should cover both the supply of judges and the way cases move.',
        ],
      },
    ],
    caveats: [
      'The PRS page gives the 33 to 37 change and the ordinance date. It does not say whether the bill has been passed by both Houses. Check before writing the status.',
    ],
    sources: [
      { label: 'PRS Legislative Research, Supreme Court (Number of Judges) Amendment Bill, 2026', url: 'https://prsindia.org/billtrack/the-supreme-court-number-of-judges-amendment-bill-2026', kind: 'Research' },
      { label: 'PRS Legislative Research, bill tracker', url: 'https://prsindia.org/billtrack', kind: 'Research' },
    ],
  },
  {
    slug: 'tribunals-reforms-bill-2026',
    category: 'polity',
    title: 'Tribunals Reforms Bill, 2026: the National Tribunals Commission',
    dek: 'Repeals the 2021 tribunals law and sets up a National Tribunals Commission to select and supervise tribunal members.',
    event: 'Introduced in Lok Sabha 10 August 2026',
    facts: [
      'Repeals the Tribunals Reforms Act, 2021.',
      'Establishes the National Tribunals Commission.',
      'Commission composition: a chairperson who is a Supreme Court judge or a High Court Chief Justice; two judicial members (High Court Chief Justice or judge); two technical members with at least 25 years of experience in public administration, finance, law, accounts or related fields.',
      'Functions: selection for tribunal vacancies, performance review, inquiries into complaints about the conduct of tribunal members, and a National Tribunals Data Grid.',
    ],
    sections: [
      {
        heading: 'Background',
        paragraphs: [
          'Tribunals decide disputes in areas like tax, service matters, and environment outside the regular courts (background). The Supreme Court has struck down some provisions of the 2021 Act, according to PRS. This bill tries to write the rules again, in line with the Court\'s directions.',
        ],
      },
      {
        heading: 'Why it matters',
        paragraphs: [
          'The commission would put selection and supervision in one body. That is the main structural change. Who chooses the technical members, and how independent that process is, is where the debate will be.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Separation of powers and judicial independence: tribunals were meant to take load off courts. Does a commission under the executive weaken the independence of tribunal members, or does it make appointments more transparent? Give both sides, then your view.',
        ],
      },
    ],
    caveats: [
      'The PRS summary is the source for the composition and functions. The status and any changes after introduction are not covered here.',
    ],
    sources: [
      { label: 'PRS Legislative Research, The Tribunals Reforms Bill, 2026', url: 'https://prsindia.org/billtrack/the-tribunals-reforms-bill-2026', kind: 'Research' },
      { label: 'PRS Legislative Research, bill tracker', url: 'https://prsindia.org/billtrack', kind: 'Research' },
    ],
  },
  {
    slug: 'mines-minerals-amendment-bill-2026',
    category: 'polity',
    title: 'Mines and Minerals (Development and Regulation) Amendment Bill, 2026: states and mineral tax',
    dek: 'Restricts state powers to tax mineral rights and mineral-bearing land. It raises a federalism question and a question of equality.',
    event: 'Introduced in Lok Sabha 10 August 2026',
    facts: [
      'Amends the Mines and Minerals (Development and Regulation) Act, 1957 (MMDR Act).',
      'Provides for restrictions on states\' powers to tax mineral rights and mineral-bearing lands.',
      'Statement of Objects and Reasons: uneven state taxes and levies, without reasonable limits, caused several issues (per PRS).',
      'Constitutional entries cited by PRS: Entry 54 of the Union List (Parliament regulates mines and minerals as expedient in the public interest) and Entry 23 of the State List, subject to the Union List.',
    ],
    sections: [
      {
        heading: 'What is at stake',
        paragraphs: [
          'States earn revenue from minerals through taxes and levies. The bill would limit that. The government\'s reason is that uneven taxes across states create problems. The states\' reason is that taxing their own resources is part of their financial autonomy.',
          'PRS raises a specific concern. Mining companies that still owe dues would not have to pay them, while companies that already paid cannot get a refund. PRS says this could be treated as a difference in treatment that may raise an issue under Article 14 (equality before the law).',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Mineral regulation sits partly in the Union List and partly in the State List (per PRS). Taxes on mineral rights are a State List entry, subject to limits set by Parliament (background: Entry 50 of the State List).',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Use this for federalism. Ask whether Parliament should set the limits on state taxes, and what protects states\' revenue when the Centre can limit it. Bring in the Finance Commission and cooperative federalism, and keep the Article 14 point separate.',
        ],
      },
    ],
    caveats: [
      'The PRS note is an analysis of the bill, not the bill text. Quote the bill for any exact wording.',
    ],
    sources: [
      { label: 'PRS Legislative Research, The Mines and Minerals (Development and Regulation) Amendment Bill, 2026', url: 'https://prsindia.org/billtrack/the-mines-and-minerals-development-and-regulation-amendment-bill-2026', kind: 'Research' },
      { label: 'PRS Legislative Research, bill tracker', url: 'https://prsindia.org/billtrack', kind: 'Research' },
    ],
  },
  {
    slug: 'ins-samarthak-commissioned-2026',
    category: 'governance',
    title: 'INS Samarthak: the first multi-purpose vessel, built by a private yard',
    dek: 'Commissioned on 16 October 2026. First of its class, first major warship built by an Indian private shipyard.',
    event: 'Commissioned 16 October 2026',
    facts: [
      'First of class of Multi-Purpose Vessels (MPVs) for the Indian Navy.',
      'Designed and built by L&T Shipyard, the first major warship built by an Indian private shipyard (per PIB).',
      'Over 75% indigenous content, with modular construction and pre-outfitting (per PIB).',
      'Presided over by Vice-President C. P. Radhakrishnan. Chief of the Naval Staff: Admiral Krishna Swaminathan.',
      'Conceived as a versatile platform for trials and evaluation.',
    ],
    sections: [
      {
        heading: 'Why it matters',
        paragraphs: [
          'The main story is the builder, not the ship. A private shipyard delivering a major warship is a test of the "Aatmanirbhar Bharat" plan for defence manufacturing. Keep the two facts apart: the vessel is a platform for trials, and the shipyard is the first private yard to build a major warship (per PIB).',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Indigenous content is a common Prelims point. The PIB figure of over 75% is the number to remember for this ship. Check the names and ranks before the exam: the Vice-President presides at commissioning here, while the Chief of the Naval Staff is the Navy\'s head (background).',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Defence indigenisation: what does a private shipyard need to move from one-off builds to a steady line? Look at the supply chain, the OEMs that supply equipment, and whether the Navy\'s order pipeline supports private investment.',
        ],
      },
    ],
    caveats: [
      'Displacement and length are not included in the PIB text used here. Check them against the Navy or PIB release before quoting.',
    ],
    sources: [
      { label: 'PIB, Indian Naval Ship Samarthak commissioned (16 October 2026)', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2324581', kind: 'Government' },
      { label: 'PIB English feed (where this release was listed on 16 October 2026)', url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Reg=3&Lang=1', kind: 'Government' },
    ],
  },
  {
    slug: 'caqm-ptz-cameras-ncr-2026',
    category: 'governance',
    title: 'CAQM extends PTZ camera monitoring to all NCR industries under Direction 98',
    dek: 'A new order makes remote camera monitoring of fuel use and emissions mandatory for a wider set of NCR industries.',
    event: 'Order reported 16 October 2026',
    facts: [
      'Commission: Commission for Air Quality Management in NCR and Adjoining Areas (CAQM).',
      'The order extends the PTZ (pan-tilt-zoom) camera requirement to all industries covered under Statutory Direction No. 98.',
      'Covered: all 17 highly polluting categories identified by CPCB, Red Category (medium and large) air-polluting industries, food and food processing and textile units with boilers or thermic fluid heaters, and metal industries with furnaces.',
      'Cameras must be placed at fuel-feeding and charging points of boilers, thermic fluid heaters, furnaces and kilns.',
      'The order supersedes an earlier CAQM order of 5 October 2026.',
    ],
    sections: [
      {
        heading: 'What it does',
        paragraphs: [
          'The camera rule is a monitoring tool. It lets regulators see what fuel goes in and check emissions controls from a distance. The change in this order is scope: it moves from the most polluting units to a wider group, including food and textile units that run boilers.',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'CAQM is a statutory body for the NCR and adjoining areas (background). Remember the Red, Orange and Green categories of industries are a CPCB classification (background). The order is a direction under the CAQM framework, not a new law.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Air pollution is a federal problem: states, the Centre and agencies all have a role, and crop burning adds to it. Use this for a governance answer on monitoring technology. Ask whether cameras and penalties work without better fuel alternatives and enforcement capacity.',
        ],
      },
    ],
    caveats: [
      'The PIB release gives the order\'s scope and dates. Check the CAQM order itself for the exact wording of each requirement.',
    ],
    sources: [
      { label: 'PIB, CAQM expands PTZ camera-based remote monitoring to all industries under Direction No. 98 (16 October 2026)', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2324557', kind: 'Government' },
      { label: 'PIB English feed (where this release was listed on 16 October 2026)', url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Reg=3&Lang=1', kind: 'Government' },
    ],
  },
  {
    slug: 'pmay-urban-2-csmc-october-2026',
    category: 'governance',
    title: 'PMAY-Urban 2.0: 1.93 lakh more houses sanctioned',
    dek: 'The 10th CSMC meeting sanctioned more houses. Cumulative sanctions under the mission now stand at 20.80 lakh.',
    event: 'CSMC meeting held 16 October 2026',
    facts: [
      'Scheme: Pradhan Mantri Awas Yojana - Urban 2.0 (PMAY-U 2.0), run by the Ministry of Housing and Urban Affairs (MoHUA).',
      'Meeting: 10th Central Sanctioning and Monitoring Committee (CSMC), 16 October 2026, chaired by the Secretary, Department of Urban Development.',
      'Sanctioned in this meeting: 1.93 lakh additional houses. Cumulative sanctions: 20.80 lakh.',
      'Verticals used: Beneficiary Led Construction (BLC) and Affordable Housing in Partnership (AHP), for EWS families.',
      'Largest sanctions in this round: Uttar Pradesh (73,182), Bihar (52,866), Telangana (18,120) and West Bengal (16,559).',
    ],
    sections: [
      {
        heading: 'Why it matters',
        paragraphs: [
          'Government scheme questions in Prelims often ask about the scheme\'s target group, verticals and ministry. For PMAY-U 2.0 the target group is urban EWS families, and the two verticals are BLC and AHP. The ministry is MoHUA, and the CSMC is the body that approves sanctions.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Use the numbers carefully. A sanction is an approval, not a completed house. For a governance answer, ask about the gap between sanction and completion, and about how states with slow progress are supported.',
        ],
      },
    ],
    caveats: [
      'The release gives sanctions, not completions. Do not write that houses were built.',
    ],
    sources: [
      { label: 'PIB, PMAY-U 2.0: 1.93 lakh additional houses approved at the 10th CSMC (16 October 2026)', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2324593', kind: 'Government' },
      { label: 'PIB English feed (where this release was listed on 16 October 2026)', url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Reg=3&Lang=1', kind: 'Government' },
    ],
  },
];
