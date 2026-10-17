// Current-affairs study notes (ZC-02), re-checked on 16 October 2026 against the primary pages named in each entry.
// Where a fact was taken from Codex's check of a page this build could not reach (the e-Gazette and the Sansad
// tracker), the note says so. Same rules as tools/articles-data.mjs: "background" marks general knowledge.

export const CURRENT_ARTICLES = [
  {
    slug: 'rbi-repo-hike-october-2026',
    category: 'economy',
    title: 'RBI raises repo rate to 5.50%: the first hike since February 2023',
    dek: 'The MPC moved the repo rate up by 25 basis points. The vote on the rate was unanimous; the change of stance was not.',
    event: 'Decided 7 October 2026',
    facts: [
      'Repo rate raised by 25 basis points, from 5.25% to 5.50%, under the liquidity adjustment facility (LAF). The MPC voted unanimously on the rate.',
      'Standing deposit facility (SDF) rate: 5.25%. Marginal standing facility (MSF) rate, also the Bank Rate: 5.75% (RBI release).',
      'The MPC also changed the stance from neutral to "calibrated tightening". Two members, Dr Nagesh Kumar and Prof Ram Singh, wanted the stance to stay neutral (RBI release).',
      'Projections: real GDP growth for 2026-27 at 7.1%; CPI inflation for 2026-27 at 5.2% (RBI release).',
      'The 63rd MPC meeting ran from 5 to 7 October 2026. The next meeting is scheduled for 2 to 4 December 2026 (RBI release).',
    ],
    sections: [
      {
        heading: 'What happened',
        paragraphs: [
          'The Monetary Policy Committee raised the repo rate by a quarter point to 5.50%. The repo is the rate at which banks borrow from the RBI, so the hike feeds through to loan rates over time. The reports call it the first hike since February 2023.',
          'Read the release for the split. The rate decision was unanimous. The change of stance was a 4 to 2 vote, because the two members who wanted to stay neutral are named in the release. The two votes are easy to mix up, so keep them apart in your notes.',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Repo is the rate at which the RBI lends to banks. Reverse repo is the rate at which it borrows from banks (background). The SDF is the floor of the corridor and the MSF is the ceiling (background).',
          'The MPC has six members: three from the RBI and three external members appointed by the government (background).',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Why hike when growth is strong? The release points to commodity prices and pass-through of earlier price rises (CPI projection 5.2%). Ask whether monetary policy is the right tool for a supply shock such as oil, or whether fiscal policy has to share the load.',
        ],
      },
    ],
    caveats: [
      'The minutes of the meeting were due after this check, so any detail from the minutes is not covered here.',
    ],
    sources: [
      { label: 'RBI, Monetary Policy Statement 2026-27, press release 2026-2027/1264 (7 October 2026)', url: 'https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63742', kind: 'Official' },
      { label: 'SCC Online, RBI hikes repo rate to 5.50%; shifts policy stance to calibrated tightening (context only)', url: 'https://www.scconline.com/blog/post/2026/10/09/rbi-hikes-repo-rate-to-5-50-percent-october-2026/', kind: 'News report' },
    ],
  },
  {
    slug: 'public-examinations-amendment-act-2026',
    category: 'polity',
    title: 'Public Examinations (Prevention of Unfair Means) Amendment Act, 2026',
    dek: 'Parliament passed the amendment in the Monsoon Session and the President gave assent on 31 July 2026. It covers UPSC, so every aspirant should know what it does.',
    event: 'Act No. 10 of 2026, assent 31 July 2026',
    facts: [
      'Act No. 10 of 2026, assented to on 31 July 2026. It amends the Public Examinations (Prevention of Unfair Means) Act, 2024 (Gazette text, as transcribed by a non-government site; the e-Gazette PDF was not reachable from the build environment).',
      'The Act amends section 12 so that investigation can be handed to a Special Task Force that the Central Government constitutes by notification. Where a Special Task Force is constituted, only it investigates.',
      'Investigations must be completed within two months, counted from the date of the information (or the reference or notification to the Central Investigating Agency or the Special Task Force).',
      'Each State Government and Union Territory Administration, after consulting the Chief Justice of the High Court, designates a Court of Session as a Special Fast Track Court, by notification. Trials proceed day-to-day, and Special Public Prosecutors are appointed for these courts. Trials must be completed within three months of the chargesheet being filed, or, for an already-pending transferred case, of its receipt by the designated court.',
      'Appeals lie to the High Court against a judgment, sentence or order of these courts that is not interlocutory, and are heard by a bench of two High Court judges. Appeals against bail orders are separate. An appeal is filed within thirty days, which the High Court may extend for sufficient cause, but no appeal is entertained after ninety days. It is disposed of within three months as far as possible.',
      'The penalties are revised. The figures in the bill as introduced are in the PRS summary. Check the enacted sections 10 to 12 for the final numbers.',
    ],
    sections: [
      {
        heading: 'What it changes',
        paragraphs: [
          'The 2024 Act was passed after paper leaks in recruitment exams (background). The 2026 amendment keeps that structure and adds three things: a Special Task Force route for investigation, short time limits for investigation and trial, and a High Court appeal route with a two-judge bench.',
          'The Act covers public examination authorities that include the Union Public Service Commission (PRS summary of the 2024 Act\'s scope).',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Know the Act number and the date of assent: Act No. 10 of 2026, 31 July 2026. The bill was introduced in Lok Sabha on 27 July 2026 (PRS), so it was enacted within days of introduction.',
          'A Special Task Force, a Special Fast Track Court and a two-judge High Court bench are the three new institutions to remember.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Is a heavier penalty enough to stop paper leaks? Look at the other side too: the time limits for investigation and trial, the role of the Centre in investigation, and whether fast track courts can keep up. This is a good governance answer on accountability in recruitment.',
        ],
      },
    ],
    caveats: [
      'The Act text here is a transcription on a non-government site. The official Gazette record is CG-DL-E-31072026-275035 (egazette.gov.in). Use the official PDF for exact wording before quoting it in an answer.',
    ],
    sources: [
      { label: 'Gazette of India, Act No. 10 of 2026 (official record, not reached from the build environment)', url: 'https://egazette.gov.in/WriteReadData/2026/275035.pdf', kind: 'Official' },
      { label: 'Gazette text of the Act, transcribed (non-government site)', url: 'https://www.policyindex.ai/in/gazette/the-public-examinations-prevention-of-unfair-means-amendment-act-2026-0kz057', kind: 'Research' },
      { label: 'PIB, Monsoon Session 2026 summary (13 August 2026): bill passed by both Houses, assented', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2298901', kind: 'Government' },
      { label: 'PRS Legislative Research, the bill as introduced', url: 'https://prsindia.org/billtrack/the-public-examinations-prevention-of-unfair-means-amendment-bill-2026', kind: 'Research' },
    ],
  },
  {
    slug: 'supreme-court-judges-amendment-2026',
    category: 'polity',
    title: 'Supreme Court (Number of Judges) Amendment Act, 2026',
    dek: 'Raises the maximum number of Supreme Court judges, other than the Chief Justice, from 33 to 37. It replaces the ordinance of 16 May 2026, and it was deemed in force from that date.',
    event: 'Act No. 14 of 2026, assent 11 August 2026, deemed in force from 16 May 2026',
    facts: [
      'Act No. 14 of 2026, assented to on 11 August 2026. Deemed to have come into force on 16 May 2026 (Gazette text, as transcribed by a non-government site).',
      'Amends section 2 of the Supreme Court (Number of Judges) Act, 1956, replacing "thirty-three" with "thirty-seven". The maximum number of Supreme Court judges, other than the Chief Justice, goes from 33 to 37.',
      'Repeals the Supreme Court (Number of Judges) Amendment Ordinance, 2026. Anything done under the ordinance is treated as done under the 1956 Act as amended.',
      'Introduced in Lok Sabha on 20 July 2026 (PRS). PIB\'s Monsoon Session summary says both Houses passed it (PIB, 13 August 2026).',
    ],
    sections: [
      {
        heading: 'Act and ordinance: keep them apart',
        paragraphs: [
          'An ordinance is issued by the President when Parliament is not in session (background). It lapses six weeks after Parliament reassembles, unless a law replaces it first (background). This Act replaced the May ordinance, and it is deemed to have come into force on the ordinance\'s date.',
          'The Chief Justice of India is not counted in the number that Parliament fixes for the other judges (PRS). Article 124 lets Parliament change the number by law (background).',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Pendency in courts is often blamed on too few judges. Does adding judges solve delay, or does it also need better case management and fewer adjournments? Cover both the supply of judges and the way cases move.',
        ],
      },
    ],
    caveats: [
      'The Act text is a transcription on a non-government site. The official Gazette record is CG-DL-E-11082026-275379 (egazette.gov.in), which was not reachable from the build environment.',
    ],
    sources: [
      { label: 'Gazette of India, Act No. 14 of 2026 (official record, not reached from the build environment)', url: 'https://egazette.gov.in/WriteReadData/2026/275379.pdf', kind: 'Official' },
      { label: 'Gazette text of the Act, transcribed (non-government site)', url: 'https://gazettetracker.com/g/CG-DL-E-11082026-275379', kind: 'Research' },
      { label: 'PIB, Monsoon Session 2026 summary (13 August 2026)', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2298901', kind: 'Government' },
    ],
  },
  {
    slug: 'tribunals-reforms-act-2026',
    category: 'polity',
    title: 'Tribunals Reforms Act, 2026: the National Tribunals Commission',
    dek: 'Assent on 13 August 2026. It repeals the 2021 tribunals law. The Act provides for a National Tribunals Commission; its establishment date is to be appointed by a separate notification.',
    event: 'Act No. 17 of 2026, assent 13 August 2026; all provisions in force 25 August 2026',
    facts: [
      'Act No. 17 of 2026, assented to on 13 August 2026 (Gazette text, as transcribed by a non-government site).',
      'All provisions came into force on 25 August 2026 under notification S.O. 4713(E) of the same date.',
      'Section 3 provides that the National Tribunals Commission is established from a date that the Central Government appoints by notification in the Official Gazette. The notices read here do not give that establishment date.',
      'Chairperson: a person who is or has been a Supreme Court judge or a Chief Justice of a High Court. Judicial members: a Chief Justice or a judge of a High Court. Technical members: at least 25 years of special knowledge and experience in public administration, finance, law, accountancy, banking, management or technology.',
      'Functions include selection for tribunal vacancies, review of tribunal performance, inquiry into complaints about members\' conduct, and a National Tribunals Data Grid (bill as introduced, PRS).',
    ],
    sections: [
      {
        heading: 'Background',
        paragraphs: [
          'Tribunals decide disputes in fields such as tax, service matters and environment, outside the regular courts (background). The PRS summary says the Supreme Court struck down some provisions of the 2021 Act. The 2026 Act repeals that law and rewrites the rules to follow the Court\'s directions.',
        ],
      },
      {
        heading: 'Commencement and establishment: two different things',
        paragraphs: [
          'The Act came into force on 25 August 2026. The Commission itself is established only from the date the Central Government fixes under section 3. Do not write that the 25 August notice established the Commission.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Judicial independence against efficiency. Tribunals were set up to take load off the courts. Does a commission under the executive weaken the independence of members, or does it make appointments more transparent? Give both sides, then your view.',
        ],
      },
    ],
    caveats: [
      'The Act text is a transcription on a non-government site. The official Gazette record is CG-DL-E-13082026-275447 (egazette.gov.in), not reached from the build environment.',
      'The establishment date under section 3 is not in the notices read here. The October rules notice (G.S.R. 856(E)) refers to the Commission but does not set that date, per the ZC-03 review.',
    ],
    sources: [
      { label: 'Gazette of India, Act No. 17 of 2026 (official record, not reached from the build environment)', url: 'https://egazette.gov.in/WriteReadData/2026/275447.pdf', kind: 'Official' },
      { label: 'Gazette text of the Act, transcribed (non-government site)', url: 'https://gazettetracker.com/g/CG-DL-E-13082026-275447', kind: 'Research' },
      { label: 'Gazette notification S.O. 4713(E), commencement on 25 August 2026, transcribed (non-government site)', url: 'https://gazettetracker.com/g/CG-DL-E-25082026-275749', kind: 'Research' },
      { label: 'Gazette notification G.S.R. 856(E) (official record, not reached from the build environment)', url: 'https://egazette.gov.in/WriteReadData/2026/276693.pdf', kind: 'Official' },
      { label: 'Gazette notification G.S.R. 856(E), transcribed (non-government site)', url: 'https://gazettetracker.com/g/CG-DL-E-01102026-276693', kind: 'Research' },
      { label: 'PRS Legislative Research, the bill as introduced', url: 'https://prsindia.org/billtrack/the-tribunals-reforms-bill-2026', kind: 'Research' },
    ],
  },
  {
    slug: 'mines-minerals-amendment-act-2026',
    category: 'polity',
    title: 'Mines and Minerals (Development and Regulation) Amendment Act, 2026: state levies on mineral rights',
    dek: 'Assent on 17 August 2026. It limits state levies on mineral rights and mineral-bearing land, with a new section 9D. It raises a federalism question and an equality question.',
    event: 'Act No. 20 of 2026, assent 17 August 2026; in force 22 August 2026 (per the ZC-03 review)',
    facts: [
      'Act No. 20 of 2026, assented to on 17 August 2026 (Gazette text, as transcribed by a non-government site).',
      'Inserts section 9D. A State levy on mineral rights or mineral-bearing land, whether based on quantity, value or royalty, is allowed only under conditions the Central Government prescribes.',
      'Section 9D deems invalid any such levy that had not been deposited with the State Government or recovered by it before the Act\'s commencement. Amounts already deposited or recovered are not refundable.',
      'Section 13(2) is amended to cover the conditions or restrictions on levies under section 9D. A new definition of "mineral bearing land" is added to section 3.',
      'Commencement: the Central Government appointed the date of publication of S.O. 4642(E), 22 August 2026, as the effective date. The transcription was checked; the official PDF was not reached.',
    ],
    sections: [
      {
        heading: 'What is at stake',
        paragraphs: [
          'States earn revenue from minerals through taxes and levies. Section 9D takes away a State\'s power to levy on mineral rights except within Centre-set conditions, and makes unpaid levies invalid. The government says uneven State levies caused problems for the sector. The States say taxing their own resources is part of their financial autonomy.',
          'PRS raised an equality point about the bill as introduced: companies that still owed dues would not have to pay them, while companies that had paid could not get a refund. That is PRS\'s analysis of the bill, not a finding by any court or by the Act.',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Mineral regulation sits partly in the Union List and partly in the State List (PRS). Taxes on mineral rights are a State List entry, subject to limits set by Parliament by law (background: Entry 50 of the State List).',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Federalism. Ask whether Parliament should set limits on state taxes, and what protects state revenue when the Centre can limit it. Bring in the Finance Commission and cooperative federalism, and keep the equality point separate from the federal one.',
        ],
      },
    ],
    caveats: [
      'The Act text is a transcription on a non-government site. The official Gazette record is CG-DL-E-17082026-275519 (egazette.gov.in), not reached from the build environment. Quote the Act itself for exact wording.',
    ],
    sources: [
      { label: 'Gazette of India, Act No. 20 of 2026 (official record, not reached from the build environment)', url: 'https://egazette.gov.in/WriteReadData/2026/275519.pdf', kind: 'Official' },
      { label: 'Gazette text of the Act, transcribed (non-government site)', url: 'https://gazettetracker.com/g/CG-DL-E-17082026-275519', kind: 'Research' },
      { label: 'Gazette notification S.O. 4642(E) (official record, not reached from the build environment)', url: 'https://egazette.gov.in/WriteReadData/2026/275676.pdf', kind: 'Official' },
      { label: 'Gazette notification S.O. 4642(E), transcribed (non-government site)', url: 'https://gazettetracker.com/g/CG-DL-E-22082026-275676', kind: 'Research' },
      { label: 'PRS Legislative Research, the bill as introduced', url: 'https://prsindia.org/billtrack/the-mines-and-minerals-development-and-regulation-amendment-bill-2026', kind: 'Research' },
    ],
  },
  {
    slug: 'ins-samarthak-commissioned-2026',
    category: 'governance',
    title: 'INS Samarthak: the first multi-purpose vessel, built by a private yard',
    dek: 'Commissioned on 16 October 2026. First of its class, and the first major warship built by an Indian private shipyard.',
    event: 'Commissioned 16 October 2026',
    facts: [
      'First of class of Multi-Purpose Vessels (MPVs) for the Indian Navy.',
      'Designed and built by L&T Shipyard, the first major warship built by an Indian private shipyard (PIB).',
      'Over 75% indigenous content, with modular construction and pre-outfitting (PIB).',
      'Presided over by Vice-President C. P. Radhakrishnan. Chief of the Naval Staff: Admiral Krishna Swaminathan.',
      'Conceived as a versatile platform for trials and evaluation.',
    ],
    sections: [
      {
        heading: 'Why it matters',
        paragraphs: [
          'The main story is the builder, not the ship. A private yard delivering a major warship is a test of the "Aatmanirbhar Bharat" plan for defence manufacturing. Keep the two facts apart: the vessel is a platform for trials, and the yard is the first private one to build a major warship (PIB).',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Indigenous content is a common Prelims point. The PIB figure of over 75% is the number to remember for this ship. The Vice-President presided at the commissioning; the Chief of the Naval Staff is the Navy\'s head (background).',
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
      'Displacement and length are not in the PIB release used here. Check them against the Navy or PIB before quoting.',
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
    dek: 'A new order makes remote camera monitoring of fuel use and emissions mandatory for a wider set of NCR industries, with a 30 November 2026 deadline.',
    event: 'Order reported 16 October 2026',
    facts: [
      'Commission: Commission for Air Quality Management in NCR and Adjoining Areas (CAQM).',
      'The order extends the PTZ (pan-tilt-zoom) camera requirement to all industries covered under Statutory Direction No. 98.',
      'Covered: all 17 highly polluting categories identified by CPCB, Red Category (medium and large) air-polluting industries, food and food processing and textile units with boilers or thermic fluid heaters, and metal industries with furnaces.',
      'Deadline: the order says the installation and operation of the required PTZ cameras, with real-time transmission of video feeds, must be done by 30 November 2026 (PIB release quoting the order).',
      'The order supersedes an earlier CAQM order of 5 October 2026.',
    ],
    sections: [
      {
        heading: 'What it does',
        paragraphs: [
          'The camera rule is a monitoring tool. It lets regulators see what fuel goes in and check emission controls from a distance. The change here is scope: it moves from the most polluting units to a wider group, including food and textile units that run boilers.',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'CAQM is a statutory body for the NCR and adjoining areas (background). The Red, Orange and Green categories are a CPCB classification (background). The order is a direction under the CAQM framework, not a new law.',
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
      'The deadline and coverage are quoted from the PIB release. The order itself was not read here; check it for camera placement and streaming details before quoting them.',
    ],
    sources: [
      { label: 'PIB, CAQM expands PTZ camera-based remote monitoring to all industries under Direction No. 98 (16 October 2026)', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2324557', kind: 'Government' },
      { label: 'PIB English feed (where this release was listed on 16 October 2026)', url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Reg=3&Lang=1', kind: 'Government' },
    ],
  },
  {
    slug: 'pmay-urban-2-csmc-october-2026',
    category: 'governance',
    title: 'PMAY-Urban 2.0: 1.93 lakh more houses approved at one CSMC meeting',
    dek: 'The 10th CSMC meeting approved more houses. Cumulative sanctions under the mission now stand at 20.80 lakh.',
    event: 'CSMC meeting held 16 October 2026',
    facts: [
      'Scheme: Pradhan Mantri Awas Yojana - Urban 2.0 (PMAY-U 2.0), run by the Ministry of Housing and Urban Affairs (MoHUA).',
      'Meeting: 10th Central Sanctioning and Monitoring Committee (CSMC), 16 October 2026, chaired by the Secretary, Department of Urban Development.',
      'Approved at this meeting: 1.93 lakh additional houses. Cumulative sanctions under the mission: 20.80 lakh.',
      'At this meeting, the approvals were for EWS families under the Beneficiary Led Construction (BLC) and Affordable Housing in Partnership (AHP) verticals.',
      'Largest approvals in this round: Uttar Pradesh (73,182), Bihar (52,866), Telangana (18,120) and West Bengal (16,559).',
    ],
    sections: [
      {
        heading: 'Why it matters',
        paragraphs: [
          'Scheme questions in Prelims often ask about target group, verticals and the ministry. This release gives the approvals made in one meeting. The scheme-wide eligible groups and all its verticals come from the scheme guideline, which this note does not cover.',
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
  {
    slug: 'constitution-131st-amendment-bill-2026',
    category: 'polity',
    title: 'Constitution (131st Amendment) Bill, 2026: no further action after the Lok Sabha motion',
    dek: 'The bill to expand the Lok Sabha and change the basis of delimitation did not get the two-thirds majority it needed. PIB says no further action was taken.',
    event: 'Introduced 16 April 2026; motion failed in April 2026 (PIB)',
    facts: [
      'Introduced in Lok Sabha on 16 April 2026, together with the Union Territories Laws (Amendment) Bill, 2026 and the Delimitation Bill, 2026 (PRS).',
      'PIB, Budget Session 2026 summary (18 April 2026): the bill "could not have the required majority as per Article 368(2)" on its motion for consideration, so "no further action was taken". The two dependent bills were "not proceeded further".',
      'Vote tally, from news reports only (LiveLaw, Vision IAS): 298 members for and 230 against, out of 528 present and voting, short of the two-thirds required. The official division record was not reached.',
      'As introduced, the constitutional bill raised the maximum size of the Lok Sabha to 850 members: up to 815 from the States and up to 35 from the Union Territories (PRS).',
      'PRS says the bills remove the fixed census provision. The Delimitation Bill, 2026 would use the latest published census, which PRS says implies the 2011 census for the next delimitation.',
    ],
    sections: [
      {
        heading: 'What the bill was for',
        paragraphs: [
          'The 106th Constitution Amendment (2023) reserves one-third of seats in the Lok Sabha and State Assemblies for women. That reservation starts after the first census following the 2023 Act. The census reference date is 1 March 2027 (PRS). PRS notes that the 2029 Lok Sabha election is unlikely to come after a delimitation based on the 2027 census, so women\'s reservation would not apply in 2029. PRS says the bill removes the census-linked requirement for the reservation to start.',
          'The last Delimitation Commission was set up in 2002, and its orders were finalised in 2008 (PRS).',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'A constitutional amendment needs a special majority: a majority of the total membership of the House and two-thirds of the members present and voting (background: Article 368(2)). A simple majority is not enough, which is why a motion with 298 votes in favour can still fail.',
          'Some amendments also need ratification by at least half of the State legislatures (background: the proviso to Article 368(2)). The Bill as introduced changes Article 55 (clause 2 of the Bill, which amends the Explanation to Article 55). Article 368(2) names Article 55 in its proviso, so a Bill that passed both Houses would have needed ratification by at least half of the State legislatures before it could go for the President\x27s assent. This Bill failed on its Lok Sabha motion, so that stage was never reached.',
          'Delimitation is the redrawing of constituency boundaries. The Delimitation Commission does this work, and its orders are final (background).',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Representation against federal balance. Critics said a seat increase based on the 2011 census would cut the share of southern and north-eastern states (reports). Ask how population-based representation can be balanced with the interests of states that have controlled their population growth. Then ask how women\'s reservation fits into that balance.',
        ],
      },
    ],
    caveats: [
      'The 298 to 230 tally is from news reports (LiveLaw, Vision IAS). PIB\'s summary does not give it. Check the Lok Sabha division record before you quote the numbers.',
      'Reports talked about a revised bill in the Monsoon Session. None of the sources read here confirm that a revised bill was introduced or voted on. Do not write that a revised bill passed.',
      'The census basis is attributed as PRS attributes it. The constitutional bill removes the fixed census provision, and the Delimitation Bill sets the basis.',
    ],
    sources: [
      { label: 'PIB, Budget Session 2026 summary (18 April 2026): the bill could not get the Article 368(2) majority', url: 'https://pib.gov.in/PressReleasePage.aspx?PRID=2253254', kind: 'Government' },
      { label: 'PRS Legislative Research, The Constitution (131st Amendment) Bill, 2026 [Delimitation Bills of 2026]', url: 'https://prsindia.org/billtrack/the-constitution-131st-amendment-bill-2026', kind: 'Research' },
      { label: 'LiveLaw, Lok Sabha rejects Constitution (131st) Amendment Bill 2026 on delimitation (vote tally)', url: 'https://www.livelaw.in/amp/top-stories/lok-sabha-rejects-constitution-131st-bill-2026-on-delimitation-530736', kind: 'News report' },
      { label: 'Vision IAS, Constitution (131st) Amendment Bill 2026 defeated in Lok Sabha (vote tally)', url: 'https://visionias.in/current-affairs/news-today/2026-04-18/polity-and-governance/constitution-131st-amendment-bill-2026-defeated-in-lok-sabha', kind: 'News report' },
    ],
  },
];
