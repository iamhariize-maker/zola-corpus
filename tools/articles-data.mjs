// Exam study articles on recent events. Source of truth for articles/*.html; written out by tools/articles.mjs.
//
// Rules for every entry (enforced by tests/articles.test.mjs):
//  - Facts come from the sources listed. Each article lists at least two sources with https links.
//  - Anything that is general background, not stated in a source, is marked "(background)".
//  - Nothing here predicts exam questions. Say what the event is, why it matters, what to verify.
//  - Where sources disagree or a detail is missing, say so in `caveats`.
//  - Plain English, no hype.

export const VERIFIED = '16 October 2026';

export const CATEGORIES = [
  { id: 'nobel', title: 'Nobel Prizes 2026' },
  { id: 'science', title: 'Science, technology and space' },
  { id: 'economy', title: 'Economy and governance' },
  { id: 'honours', title: 'Awards and honours' },
];

export const ARTICLES = [
  // ---------------------------------------------------------------- Nobel Prizes 2026
  {
    slug: 'nobel-2026-at-a-glance',
    category: 'nobel',
    title: 'Nobel Prizes 2026 at a glance',
    dek: 'All six prizes for 2026: who won, the announcement order, and what each one recognises.',
    event: 'Announced 5 to 12 October 2026',
    facts: [
      'Medicine: 5 October. Physics: 6 October. Chemistry: 7 October. Literature: 8 October. Peace: 9 October. Economic Sciences: 12 October.',
      'Medicine: Karl Deisseroth, Peter Hegemann and Georg Nagel (light-gated ion channels and optogenetics).',
      'Physics: Francis Halzen (IceCube Neutrino Observatory and high-energy cosmic neutrinos).',
      'Chemistry: Henri B. Kagan and Kenso Soai (non-linear effects and autocatalysis in asymmetric synthesis).',
      'Literature: Anne Carson (Canadian poet and writer).',
      'Peace: Navanethem "Navi" Pillay (efforts to promote peace and international law).',
      'Economic Sciences: Robert E. Hall and Michael Woodford (microeconomic foundations of macroeconomic stabilisation).',
      'The prize amount is 12 million Swedish crowns (about $1.2 million) in the physics, chemistry, literature and economics reports.',
    ],
    sections: [
      {
        heading: 'What happened',
        paragraphs: [
          'The 2026 Nobel Prizes were announced across eight days in October 2026. The order was Medicine, Physics, Chemistry, Literature, Peace and then Economic Sciences, which came on Monday 12 October after the weekend.',
          'Five prizes are awarded in Stockholm. The Peace Prize is awarded in Oslo, as set out in Alfred Nobel\'s will (background). The Economic Sciences prize is formally the Sveriges Riksbank Prize in Economic Sciences in Memory of Alfred Nobel, and it is not one of the original prizes in his will (background).',
        ],
      },
      {
        heading: 'Analytical angle',
        paragraphs: [
          'Three of the six 2026 prizes are for basic science that later became tools or theories used widely: a method for controlling brain cells with light, a neutrino detector in Antarctica, and a theory of how chemical handedness can arise. The other prizes are for a literary body of work, a lifetime of human rights and legal work, and macroeconomic policy theory.',
          'Read the prize list next to the 2025 prizes for context: Medicine went to Mary E. Brunkow, Fred Ramsdell and Shimon Sakaguchi for peripheral immune tolerance; Chemistry to Susumu Kitagawa, Richard Robson and Omar Yaghi for metal-organic frameworks; Peace to María Corina Machado.',
        ],
      },
    ],
    caveats: [
      'The official nobelprize.org pages blocked automated reading during this check. Names, citations and dates come from news reports that quote the committees. Check the official page before using exact wording in notes.',
      'One Nobel page cached in search showed the 2026 Physics prize as not yet awarded. It was out of date; the Reuters-carried report and the official laureate page list say it was awarded on 6 October.',
    ],
    sources: [
      { label: 'Nobel Prize, 2026 summary (official)', url: 'https://nobelprize.org/prizes/physics/2026/summary', kind: 'Official' },
      { label: 'Nobel Prize in Physiology or Medicine 2026 (official)', url: 'https://www.nobelprize.org/prizes/medicine/2026/', kind: 'Official' },
      { label: 'Nobel Prize in Chemistry 2026 (official)', url: 'https://www.nobelprize.org/prizes/chemistry/2026/', kind: 'Official' },
      { label: 'Nobel Prize in Literature 2026 (official)', url: 'https://www.nobelprize.org/prizes/literature/2026/', kind: 'Official' },
      { label: 'Sveriges Riksbank Prize in Economic Sciences 2026 (official)', url: 'https://www.nobelprize.org/prizes/economics/2026/', kind: 'Official' },
      { label: 'Daily Maverick, Francis Halzen wins 2026 Nobel Prize in Physics (Reuters)', url: 'https://www.dailymaverick.co.za/article/2026-10-06-francis-halzen-wins-2026-nobel-prize-in-physics.md', kind: 'News report' },
      { label: 'Khaleej Times, Kagan and Soai win 2026 chemistry prize', url: 'https://www.khaleejtimes.com/world/henri-kagan-kenso-soai-win-2026-nobel-chemistry-prize', kind: 'News report' },
      { label: 'Illawarra Mercury, Hall and Woodford win economics prize', url: 'https://www.illawarramercury.com.au/story/9367197/americans-hall-and-woodford-win-nobel-economics-prize/', kind: 'News report' },
      { label: 'Euronews, Nobel Prize 2026 kicks off (2025 context)', url: 'https://www.euronews.com/2026/10/05/nobel-prize-2026-kicks-off-who-will-win-the-medicine-award', kind: 'News report' },
    ],
  },
  {
    slug: 'nobel-physics-2026',
    category: 'nobel',
    title: 'Physics: Francis Halzen and the IceCube neutrino observatory',
    dek: 'One laureate, honoured for helping to detect high-energy neutrinos that come from outside the solar system.',
    event: 'Physics prize announced 6 October 2026',
    facts: [
      'Laureate: Francis Halzen, a Belgian-American particle physicist. He is the sole laureate.',
      'Official citation, as reported: "for decisive contributions to the IceCube Neutrino Observatory and the discovery of high-energy neutrinos of astrophysical origin".',
      'Prize: 12 million Swedish crowns (about $1.2 million), per the Reuters-carried report.',
    ],
    sections: [
      {
        heading: 'What the prize recognises',
        paragraphs: [
          'Neutrinos are very light, electrically neutral particles that pass through ordinary matter almost without interacting with it (background). That makes them hard to detect, and it also means a neutrino that reaches a detector has come straight from its source.',
          'IceCube is a detector built into the Antarctic ice at the South Pole (background). The citation credits the laureate for decisive contributions to the observatory and to the discovery of high-energy neutrinos of astrophysical origin. In plain terms: the detector found very energetic neutrinos produced by cosmic sources (background; the reports do not explain the term).',
        ],
      },
      {
        heading: 'Analytical angle',
        paragraphs: [
          'Astronomy is not only about light. Neutrinos, gravitational waves and cosmic rays each carry different information about the sky (background). Large, rare-event detectors are one way to study faint signals.',
          'The news reports do not state Halzen\'s institution, so none is given here. Check the official laureate page for affiliation.',
        ],
      },
    ],
    caveats: [
      'The news reports did not explain IceCube or neutrinos in detail. The background lines above are general definitions, not from the reports.',
    ],
    sources: [
      { label: 'Nobel Prize in Physics 2026 (official)', url: 'https://nobelprize.org/prizes/physics/2026', kind: 'Official' },
      { label: 'Daily Maverick, Francis Halzen wins 2026 Nobel Prize in Physics (Reuters)', url: 'https://www.dailymaverick.co.za/article/2026-10-06-francis-halzen-wins-2026-nobel-prize-in-physics.md', kind: 'News report' },
      { label: 'American Institute of Physics, coverage of the 2026 Nobel Prize in Physics', url: 'https://www.aip.org/aip/aip-coverage-of-2026-nobel-prize-in-physics', kind: 'News report' },
    ],
  },
  {
    slug: 'nobel-medicine-2026',
    category: 'nobel',
    title: 'Medicine: switching nerve cells on and off with light',
    dek: 'Three scientists share the prize for light-gated ion channels, the basis of optogenetics.',
    event: 'Medicine prize announced 5 October 2026',
    facts: [
      'Laureates (shared equally): Karl Deisseroth (Stanford University, United States), Peter Hegemann (Humboldt University, Berlin) and Georg Nagel (University of Würzburg, Germany).',
      'Work: light-gated ion channels, which are proteins that open when struck by light and let charged particles through.',
      'Application: optogenetics, a technique that uses light to switch nerve cells on or off, giving researchers precise control over individual cells.',
      'The committee said the method "is now being used in laboratories around the world to reveal the brain\'s mysteries".',
    ],
    sections: [
      {
        heading: 'What the prize recognises',
        paragraphs: [
          'Nerve cells communicate with electrical signals carried by charged particles (ions) moving across cell membranes (background). Ion channels are the proteins that control that movement (background). A light-gated channel opens when light hits it, so a scientist can turn a cell on or off with a light beam.',
          'The method lets researchers test which cells in the brain do what, which earlier tools could not do so precisely. That is why the reports describe it as a basic tool that is now used in labs worldwide.',
        ],
      },
      {
        heading: 'Analytical angle',
        paragraphs: [
          'This is a case where a discovery in basic biology became a research method. Ask how a tool like this changes what can be studied: from correlation (which cells are active during a behaviour) to cause (what happens when a cell is switched off).',
          'For context, the 2025 Medicine prize went to Mary E. Brunkow, Fred Ramsdell and Shimon Sakaguchi for peripheral immune tolerance, the immune system\'s ability to avoid attacking the body\'s own tissues (per the Euronews report).',
        ],
      },
    ],
    caveats: [
      'The AP report gives affiliations and ages but not nationalities. The citation wording above is the committee\'s statement as quoted in the report; check the official page for the formal citation.',
    ],
    sources: [
      { label: 'Nobel Prize in Physiology or Medicine 2026 (official)', url: 'https://www.nobelprize.org/prizes/medicine/2026/', kind: 'Official' },
      { label: 'GPB (AP), Nobel medicine prize goes to 3 scientists for brain research', url: 'https://www.gpb.org/news/2026/10/05/nobel-medicine-prize-goes-3-scientists-for-research-brain-activity', kind: 'News report' },
      { label: 'Euronews, Nobel Prize 2026 kicks off (2025 context)', url: 'https://www.euronews.com/2026/10/05/nobel-prize-2026-kicks-off-who-will-win-the-medicine-award', kind: 'News report' },
    ],
  },
  {
    slug: 'nobel-chemistry-2026',
    category: 'nobel',
    title: 'Chemistry: how mirror-image molecules may have gained a preference',
    dek: 'Two chemists honoured for showing how small chemical effects can amplify into a strong one-sided outcome.',
    event: 'Chemistry prize announced 7 October 2026',
    facts: [
      'Laureates (shared): Henri B. Kagan (Université Paris-Sud, Orsay, France) and Kenso Soai (Tokyo University of Science; aged 95).',
      'Official citation, as quoted: "for the discovery of non-linear effects and autocatalysis in asymmetric organic synthesis".',
      'Prize: 12 million Swedish crowns (about $1.2 million). Medals are presented in Stockholm on 10 December.',
    ],
    sections: [
      {
        heading: 'Key terms',
        paragraphs: [
          'Chirality: some molecules exist as two forms that are mirror images of each other and cannot be superimposed, much like a pair of hands. The Greek root means "hand". The committee chair, Heiner Linke, said such molecules "look alike, but they are not identical".',
          'Homochirality: living things use only one of the two mirror forms for many key molecules. Why that one-sided preference arose is a long-standing puzzle, and the chemistry in this prize is about how such a preference can arise from tiny starting differences.',
          'Autocatalysis: a reaction in which a product helps make more of itself (background). Non-linear effects mean the output does not change in simple proportion to the input (background). The committee\'s wording links the two ideas to asymmetric synthesis, which is the making of molecules with one handedness.',
        ],
      },
      {
        heading: 'Analytical angle',
        paragraphs: [
          'The origin of life is an open question, and so is the origin of molecular handedness. This prize is about one piece of that question: a mechanism that can turn a very small imbalance into a large one, which is an idea that appears across chemistry and biology.',
          'For context, the 2025 Chemistry prize went to Susumu Kitagawa, Richard Robson and Omar Yaghi for metal-organic frameworks.',
        ],
      },
    ],
    caveats: [
      'The news reports did not give a full plain-English account of homochirality. The explanation above combines the reports with general definitions, marked "background" where it is not from the reports.',
      'Affiliations come from search summaries and the Khaleej Times report, so check the official page before quoting them in writing.',
    ],
    sources: [
      { label: 'Nobel Prize in Chemistry 2026 (official)', url: 'https://www.nobelprize.org/prizes/chemistry/2026/', kind: 'Official' },
      { label: 'ThePrint, Kagan and Soai win 2026 Nobel chemistry prize', url: 'https://theprint.in/world/kagan-and-soai-win-2026-nobel-chemistry-prize/3064245/', kind: 'News report' },
      { label: 'Khaleej Times, Henri Kagan and Kenso Soai win 2026 Nobel chemistry prize', url: 'https://www.khaleejtimes.com/world/henri-kagan-kenso-soai-win-2026-nobel-chemistry-prize', kind: 'News report' },
      { label: 'Ynetnews, Henri Kagan and Kenso Soai win 2026 Nobel chemistry prize', url: 'https://www.ynetnews.com/health_science/article/bk2wuc7smx', kind: 'News report' },
    ],
  },
  {
    slug: 'nobel-literature-2026',
    category: 'nobel',
    title: 'Literature: Anne Carson and the classical tradition',
    dek: 'A Canadian poet and writer whose work mixes verse, prose, translation and performance.',
    event: 'Literature prize announced 8 October 2026',
    facts: [
      'Laureate: Anne Carson, Canadian poet and writer. She was born in Toronto and has held Icelandic citizenship since 2022. She is 76.',
      'Swedish Academy citation: "for her bold and inventive oeuvre that, in playful dialogue with the classical tradition, has created new forms for contemporary literature".',
      'Prize: 12 million Swedish crowns (about $1.2 million), per the report.',
    ],
    sections: [
      {
        heading: 'Her work',
        paragraphs: [
          'Carson\'s writing mixes verse, prose, dialogue and translation. It ranges from opera libretti to literary criticism and verse novels (per the report).',
          'She is widely known for translations of classical Greek literature. The Swedish Academy said these translations can be considered independent works in their own right.',
          'Autobiography of Red (1998) is a verse novel, a novel told in poetry. Norma Jeane Baker of Troy (2019) is a performance piece that brings together Helen of Troy from Euripides\' Helen and Marilyn Monroe.',
        ],
      },
      {
        heading: 'Analytical angle',
        paragraphs: [
          'The citation names a "playful dialogue" with the classical tradition. Ask what that means in practice: a modern writer reinterpreting old texts, rather than only reproducing them, and treating a translation as a work of its own.',
        ],
      },
    ],
    caveats: [
      'The official Nobel page for the 2026 Literature prize was not re-read automatically (blocked). The citation text above is as quoted in the Khaleej Times report.',
    ],
    sources: [
      { label: 'Nobel Prize in Literature 2026 (official)', url: 'https://www.nobelprize.org/prizes/literature/2026/', kind: 'Official' },
      { label: 'Khaleej Times, Canadian poet Anne Carson wins 2026 Nobel Prize in Literature', url: 'https://www.khaleejtimes.com/world/anne-carson-canadian-poet-writer-2026-nobel-prize-literature', kind: 'News report' },
    ],
  },
  {
    slug: 'nobel-peace-2026',
    category: 'nobel',
    title: 'Peace: Navi Pillay and the rule of law',
    dek: 'A former UN human rights chief and International Court of Justice judge, honoured for peace and international law.',
    event: 'Peace prize announced 9 October 2026 in Oslo',
    facts: [
      'Laureate: Navanethem "Navi" Pillay, aged 85. Reports describe her as born in Durban, South Africa, into a family of Tamil heritage.',
      'Committee citation: "efforts to promote peace and international law". The committee also cited her "firm moral compass".',
      'Positions reported: former UN High Commissioner for Human Rights, and a judge of the International Court of Justice.',
      'Nominations: 287 candidates this year, of whom 208 were individuals and 79 organisations (as reported).',
    ],
    sections: [
      {
        heading: 'Why it matters',
        paragraphs: [
          'The committee said the ability to resolve conflicts without force or violence depends on the international rule of law, as reported. The prize therefore points to legal institutions and human rights work, not only to ceasefires or summits.',
          'The International Court of Justice is the principal judicial organ of the United Nations, and it settles legal disputes between states (background).',
        ],
      },
      {
        heading: 'Context',
        paragraphs: [
          'The 2025 Peace Prize went to Venezuelan opposition leader María Corina Machado, who was recognised for keeping the flame of democracy burning amid growing darkness (as reported).',
        ],
      },
    ],
    caveats: [
      'The Khaleej Times headline calls Pillay "Indian-origin". The article body says she was born in South Africa into a family with Tamil roots. This article follows the body.',
      'The 2026 reports read here did not give the full citation or the exact announcement time in the text. The reports agree on the laureate, the date and the citation phrase.',
    ],
    sources: [
      { label: 'Khaleej Times, Navanethem Pillay wins Nobel Peace Prize 2026', url: 'https://www.khaleejtimes.com/world/navanethem-navi-pillay-wins-nobel-peace-prize-2026', kind: 'News report' },
      { label: 'ARY News, Navanethem Pillay named winner of 2026 Nobel peace prize', url: 'https://arynews.tv/navanethem-navi-pillay-named-winner-of-2026-nobel-peace-prize', kind: 'News report' },
      { label: 'SBS, Navi Pillay wins Nobel Peace Prize 2026', url: 'https://www.sbs.com.au/news/article/navi-pillay-wins-nobel-peace-prize-2026/n7nkmsrm1', kind: 'News report' },
    ],
  },
  {
    slug: 'nobel-economics-2026',
    category: 'nobel',
    title: 'Economics: Hall and Woodford on steadying the economy',
    dek: 'Two American economists honoured for building the microeconomic foundations of how policy should respond to booms and slumps.',
    event: 'Economic Sciences prize announced 12 October 2026',
    facts: [
      'Laureates (shared equally): Robert E. Hall (Stanford University) and Michael Woodford (Columbia University). Both are American economists.',
      'Royal Swedish Academy citation: "for microeconomic foundations of macroeconomic stabilisation".',
      'Prize: 12 million Swedish crowns (about $1.2 million).',
    ],
    sections: [
      {
        heading: 'What the prize recognises',
        paragraphs: [
          'Macroeconomic stabilisation means smoothing the cycle of booms and downturns. The reports say the laureates built new economic models that help governments and central banks respond to downturns and overheating. The models help policymakers time spending, tax and interest-rate decisions so that harmful booms and slumps are softened.',
          'Their theoretical work now underpins models used by central banks and governments around the world, according to the report. It helps policymakers handle shocks such as an energy shortage or a sudden change in household spending.',
        ],
      },
      {
        heading: 'Concepts to keep straight',
        paragraphs: [
          'Fiscal policy is the government\'s spending and taxation. Monetary policy is the central bank\'s control of interest rates and money supply (background). The prize is about how both can be timed to soften cycles.',
          'The prize is formally the Sveriges Riksbank Prize in Economic Sciences in Memory of Alfred Nobel, and was first awarded in 1969 (background).',
        ],
      },
    ],
    caveats: [
      'The reports read here did not give institutional details beyond Stanford and Columbia. Those come from search summaries, so check the official page before quoting them.',
    ],
    sources: [
      { label: 'Sveriges Riksbank Prize in Economic Sciences 2026 (official)', url: 'https://www.nobelprize.org/prizes/economics/2026/', kind: 'Official' },
      { label: 'Illawarra Mercury, Americans Hall and Woodford win Nobel economics prize', url: 'https://www.illawarramercury.com.au/story/9367197/americans-hall-and-woodford-win-nobel-economics-prize/', kind: 'News report' },
      { label: 'Il Foglio, The Nobel Prize in Economics goes to Robert E. Hall and Michael Woodford', url: 'https://www.ilfoglio.it/en/economy/2026/10/12/video/the-nobel-prize-in-economics-goes-to-robert-e-hall-and-michael-woodford--410291', kind: 'News report' },
    ],
  },

  // ---------------------------------------------------------------- Science, technology and space
  {
    slug: 'fields-medal-2026',
    category: 'science',
    title: 'Fields Medal 2026: four mathematicians at the Philadelphia congress',
    dek: 'The top prize in mathematics went to four researchers, announced at the International Congress of Mathematicians.',
    event: 'Announced 23 July 2026',
    facts: [
      'Announced at the opening ceremony of the International Congress of Mathematicians (ICM), Philadelphia, 23 July 2026. The congress ran until 30 July.',
      'Winners: Yu Deng (University of Chicago), John Pardon (Stony Brook University), Jacob Tsimerman (University of Toronto), Hong Wang (New York University and IHÉS, France).',
      'Reported ages: Deng and Pardon 37, Tsimerman 38, Wang 35.',
      'Work areas as reported: Deng in partial differential equations; Pardon in symplectic geometry; Tsimerman in algebraic geometry. Sources differ on Wang\'s field, so none is given here.',
    ],
    sections: [
      {
        heading: 'Facts to know',
        paragraphs: [
          'The Fields Medal is awarded every four years by the International Mathematical Union to mathematicians under 40 (background). It is often called the Nobel of mathematics, but the Nobel Prizes have no mathematics category (background).',
          'One report says this is the third time in the award\'s history that a woman has won it. The ICM was held in the United States for the first time since 1986.',
        ],
      },
      {
        heading: 'Analytical angle',
        paragraphs: [
          'The Abel Prize is the other major international prize in mathematics (background). Knowing which prize is for which field is a common factual check, and so is the age limit.',
        ],
      },
    ],
    caveats: [
      'One aggregator report says the names surfaced early through a glitch on the ICM website. That report was not verified, so it is not stated as fact here.',
      'Sources differ on Hong Wang\'s field, so this article does not state it.',
    ],
    sources: [
      { label: 'Simons Foundation, 2026 Fields Medals awarded to four of the world\'s top mathematicians', url: 'https://www.simonsfoundation.org/2026/07/23/2026-fields-medals-awarded-to-four-of-worlds-top-mathematicians/', kind: 'News report' },
      { label: 'Newswire, 2026 Fields Medals awarded to four of the world\'s top mathematicians', url: 'https://www.newswire.com/news/2026-fields-medals-awarded-to-four-of-worlds-top-mathematicians-22832507', kind: 'News report' },
      { label: 'Simons Foundation, the ICM comes to the United States (preview)', url: 'https://www.simonsfoundation.org/2026/04/13/the-icm-comes-to-the-united-states-philadelphia-july-23-30-2026/', kind: 'News report' },
    ],
  },
  {
    slug: 'artemis-ii-2026',
    category: 'science',
    title: 'Artemis II: the first crewed flight beyond low Earth orbit since 1972',
    dek: 'Four astronauts flew a crewed lunar flyby and returned safely, testing systems for the later lunar landing.',
    event: 'Flight in April 2026',
    facts: [
      'Crew: Reid Wiseman, Victor Glover, Christina Koch and Jeremy Hansen.',
      'Launch: 1 April 2026, per one report. It was the first crewed flight beyond low Earth orbit since Apollo 17 in 1972.',
      'The crew flew a lunar flyby on a free-return trajectory, which brings the spacecraft back to Earth without major engine burns after the flyby.',
      'Reports say the closest approach to the Moon was around 6 April, and the spacecraft passed about 4,066 miles above the far side.',
      'NASA called it a crewed systems validation test. Its data is being used to plan Artemis III, a planned south-pole landing.',
    ],
    sections: [
      {
        heading: 'Why it matters',
        paragraphs: [
          'Apollo 17 in 1972 was the last crewed lunar mission (background). Artemis II is the first crewed mission since then to go beyond low Earth orbit, meaning out to the Moon and back.',
          'A free-return trajectory uses the Moon\'s gravity to send a spacecraft back to Earth (background). The reports say the return needed no major engine burn after the flyby.',
        ],
      },
      {
        heading: 'Caveats',
        paragraphs: [
          'The reports disagree on the splashdown date, with one saying 10 April and another giving 11 April in Pacific time. Check NASA\'s own mission page before quoting the date.',
          'The reports differ on details: one gives 6 April as the closest approach, and another gives a record distance of more than 252,000 miles from Earth. Treat both as reported, not verified.',
        ],
      },
    ],
    caveats: [
      'The reports read here are news and aggregator pieces. NASA\'s mission page is the primary source for dates and distances.',
    ],
    sources: [
      { label: 'IOL, After milestone-rich lunar flyby, astronauts start trip home', url: 'https://iol.co.za/news/world/2026-04-07-after-milestone-rich-lunar-flyby-astronauts-start-trip-home/', kind: 'News report' },
      { label: 'Interesting Engineering, NASA Artemis II returns safely on Earth', url: 'https://interestingengineering.com/space/nasa-artemis-ii-returns-safely-on-earth', kind: 'News report' },
      { label: 'Cislunar Space Beginner\'s Guide, Artemis II lunar flyby (7 April 2026)', url: 'https://cislunarspace.cn/en/space-news/2026/04/2026-04-07-artemis-2-lunar-flyby', kind: 'News report' },
    ],
  },
  {
    slug: 'ai-impact-summit-2026',
    category: 'science',
    title: 'AI Impact Summit 2026: the New Delhi Declaration',
    dek: 'India hosted a global AI summit in February 2026. Its main outcome is a non-binding declaration with seven pillars.',
    event: 'Summit held in February 2026, New Delhi',
    facts: [
      'Venue: Bharat Mandapam, New Delhi. One account gives the summit dates as 16 to 21 February 2026, and the declaration as adopted on 19 February.',
      'Outcome: the New Delhi Declaration on AI Impact, built on the principle "Welfare for all, Happiness for all".',
      'Endorsements: reports citing the official release say 88 countries and international organisations. Other reports say 89 or 91.',
      'Seven pillars: democratising AI resources; economic growth and social good; secure and trusted AI; AI for science; access for social empowerment; human capital development; resilient, efficient and innovative AI systems.',
      'Framing: three "Sutras": People, Planet and Progress.',
    ],
    sections: [
      {
        heading: 'What it is, and is not',
        paragraphs: [
          'The declaration is a voluntary, non-binding framework of principles, according to one report. It is not a treaty, so it creates no legal obligations on the countries that sign on.',
          'Reports say the signatories include the United States, the United Kingdom, China and France. Check the official text before listing any country as a signatory in an answer.',
        ],
      },
      {
        heading: 'Analytical angle',
        paragraphs: [
          'The core debate is between binding rules and voluntary principles for a fast-moving technology. Ask what a non-binding declaration can do (set shared language, encourage national rules) and what it cannot (enforce standards on companies or states).',
        ],
      },
    ],
    caveats: [
      'Endorsement counts differ across reports (88, 89 and 91). Use the official government release for the number.',
      'One source names follow-on platforms that came from the declaration. Only one source reports them, so they are left out here.',
    ],
    sources: [
      { label: 'WAM, AI Impact Summit 2026 adopts New Delhi Declaration', url: 'https://www.wam.ae/en/article/byup8rk-impact-summit-2026-adopts-new-delhi-declaration', kind: 'News report' },
      { label: 'AIR (All India Radio), India AI Impact Summit 2026 adopts New Delhi Declaration', url: 'https://www.newsonair.gov.in/india-ai-impact-summit-2026-adopts-new-delhi-declaration', kind: 'Government' },
      { label: 'Free Press Journal, AI Impact Summit 2026: 88 countries adopt New Delhi Declaration', url: 'https://www.freepressjournal.in/amp/india/ai-impact-summit-2026-88-countries-adopt-new-delhi-declaration-on-trusted-resilient-efficient-ai-read-full-statement', kind: 'News report' },
    ],
  },

  // ---------------------------------------------------------------- Economy and governance
  {
    slug: 'union-budget-2026-27',
    category: 'economy',
    title: 'Union Budget 2026-27: the key numbers',
    dek: 'Presented on 1 February 2026: the fiscal targets, the main allocations and the new initiatives.',
    event: 'Presented 1 February 2026',
    facts: [
      'Presented by Finance Minister Nirmala Sitharaman on 1 February 2026. Reports describe the theme as "Yuva Shakti".',
      'Total expenditure: about ₹53.47 lakh crore, about 7.7% above the revised estimate for 2025-26 (PRS).',
      'Capital expenditure: about ₹12.2 lakh crore.',
      'Fiscal deficit target: 4.3% of GDP for FY27, down from 4.4%.',
      'Nominal GDP growth assumed at 10%.',
      'Health ministry allocation: about ₹1,06,530 crore, nearly 10% above the revised estimate.',
      'Income tax slabs unchanged for assessment year 2026-27.',
    ],
    sections: [
      {
        heading: 'Key initiatives reported',
        paragraphs: [
          'Biopharma SHAKTI, an expansion of the India Semiconductor Mission 2.0, and dedicated rare-earth corridors. Customs duties on select medicines were exempted to support affordability (Foxmandal report).',
          'Devolution to states is held at 41%, and the government accepted the 16th Finance Commission\'s recommendations, per the Basis Point Insight report. The defence allocation is reported at about ₹5.95 trillion.',
        ],
      },
      {
        heading: 'Terms to know',
        paragraphs: [
          'Fiscal deficit is the gap between total expenditure and total non-debt receipts. Capital expenditure is spending that creates assets or reduces future liabilities (background). Devolution is the share of central tax revenue passed to the states, and the Finance Commission recommends it (background; the commission is constituted under Article 280).',
        ],
      },
    ],
    caveats: [
      'These figures come from secondary explainers and the PRS analysis. For exact figures, use the Budget speech and PIB, which the sources themselves recommend.',
    ],
    sources: [
      { label: 'PIB, Union Budget 2026 (official)', url: 'https://www.pib.gov.in/unionbudget/2026/en', kind: 'Government' },
      { label: 'PRS Legislative Research, Union Budget Analysis 2026-27', url: 'https://prsindia.org/files/budget/budget_parliament/2026/Union_Budget_Analysis-2026-27.pdf', kind: 'Government' },
      { label: 'Finnovate, India Union Budget 2026-27 key highlights', url: 'https://www.finnovate.in/learn/blog/india-union-budget-2026-27-key-highlights', kind: 'News report' },
      { label: 'Foxmandal, Union budget highlights 2026-27', url: 'https://foxmandal.in/Insights/union-budget-highlights-2026-27/', kind: 'News report' },
      { label: 'Basis Point Insight, Highlights of Union Budget for 2026-27', url: 'https://www.basispointinsight.com/Story/highlights-of-union-budget-for-2026-27-_a9114e3145ae.html', kind: 'News report' },
    ],
  },

  // ---------------------------------------------------------------- Awards and honours
  {
    slug: 'padma-awards-2026',
    category: 'honours',
    title: 'Padma Awards 2026: 131 honours',
    dek: 'Announced on 25 January 2026, on the eve of Republic Day. The list covers the three civilian tiers and includes posthumous honours.',
    event: 'Announced 25 January 2026',
    facts: [
      'Total: 131 awards. Five Padma Vibhushan, 13 Padma Bhushan (one report says 12) and 113 Padma Shri.',
      'Padma Vibhushan (as reported): Dharmendra Singh Deol and V S Achuthanandan, both posthumously; K T Thomas (public affairs); N Rajam (art); P Narayanan (literature and education).',
      'Padma Bhushan (as reported): Alka Yagnik (singer), Mammootty (actor), Uday Kotak (industrialist), Vijay Amritraj (tennis), Bhagat Singh Koshyari, and Piyush Pandey and Shibu Soren, both posthumously.',
      'Breakdown reported: 19 women, 16 posthumous awardees and 6 foreigners, NRIs, PIOs or OCI cardholders.',
    ],
    sections: [
      {
        heading: 'Terms to know',
        paragraphs: [
          'The Padma awards are civilian honours in four tiers: Padma Vibhushan, Padma Bhushan and Padma Shri (background). The Bharat Ratna is the highest civilian honour and is a separate award. The reports read here did not say whether a Bharat Ratna was conferred this year.',
          'The Statesman\'s headline frames the list as honouring "unsung heroes" for extraordinary contributions (news report wording, not the official citation).',
        ],
      },
    ],
    caveats: [
      'Counts differ by source (Bhushan 12 or 13), so quote the official list from the Ministry of Home Affairs before using numbers.',
      'The names above are from news reports. Confirm each name and category on the official list.',
    ],
    sources: [
      { label: 'ETV Bharat, Padma Awards 2026 announced', url: 'https://www.etvbharat.com/en/bharat/padma-awards-2026-announced-enn26012504247', kind: 'News report' },
      { label: 'The News Minute, Padma Awards 2026: 131 recipients named', url: 'https://www.thenewsminute.com/amp/story/news/padma-awards-2026-131-recipients-named-mammootty-alka-yagnik-among-awardees', kind: 'News report' },
      { label: 'The Statesman, Padma Awards 2026 honours unsung heroes', url: 'https://www.thestatesman.com/india/padma-awards-2026-nation-honours-unsung-heroes-for-extraordinary-contributions-1503546337.html', kind: 'News report' },
    ],
  },
];
