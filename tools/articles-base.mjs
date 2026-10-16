// The first twelve study notes (ZC-00), rewritten in the owner's exam-note voice on 16 October 2026.
// Facts are the ones checked against primary pages, including the corrections from Codex's review (ZC-00 revision).
// "background" marks general knowledge that no cited page states. Same rules as articles-data.mjs.

export const BASE_ARTICLES = [
  {
    slug: 'nobel-2026-at-a-glance',
    category: 'nobel',
    title: 'Nobel Prizes 2026 at a glance',
    dek: 'All six 2026 prizes in one table: who won, when it was announced, and what for.',
    event: 'Announced 5 to 12 October 2026',
    facts: [
      'Medicine on 5 October, Physics on 6 October, Chemistry on 7 October, Literature on 8 October, Peace on 9 October, Economic Sciences on 12 October.',
      'Medicine: Karl Deisseroth, Peter Hegemann and Georg Nagel, for light-gated ion channels and optogenetics.',
      'Physics: Francis Halzen, for IceCube and the discovery of high-energy neutrinos of astrophysical origin.',
      'Chemistry: Henri B. Kagan and Kenso Soai, for non-linear effects and autocatalysis in asymmetric organic synthesis.',
      'Literature: Anne Carson, a Canadian poet and writer.',
      'Peace: Navanethem "Navi" Pillay, for her efforts to promote peace and international law.',
      'Economic Sciences: Robert E. Hall and Michael Woodford, for microeconomic foundations of macroeconomic stabilisation.',
      'The physics, chemistry, literature and economics reports give the prize as 12 million Swedish crowns, about $1.2 million.',
    ],
    sections: [
      {
        heading: 'The short version',
        paragraphs: [
          'Six prizes, spread over eight days. The order matters a bit for questions on sequence, so remember it: Medicine first, Economic Sciences last, and the Monday in between is 12 October.',
          'Five prizes are given in Stockholm. Peace is given in Oslo, as Alfred Nobel\'s will says (background). The economics prize is not one of the original five in the will. Its formal name is the Sveriges Riksbank Prize in Economic Sciences in Memory of Alfred Nobel (background).',
        ],
      },
      {
        heading: 'Why three of these matter for Prelims',
        paragraphs: [
          'Look at the physics, medicine and chemistry picks together. Each is basic science that turned into a tool or a theory other labs use. A light switch for brain cells, a neutrino detector buried in Antarctic ice, and a theory of how one handedness of molecules can win out. The other three are a body of literary work, a life spent on human rights and international law, and a theory of how policy should smooth booms and busts.',
        ],
      },
      {
        heading: 'Compare with 2025',
        paragraphs: [
          'Medicine 2025 went to Mary E. Brunkow, Fred Ramsdell and Shimon Sakaguchi, for peripheral immune tolerance. Chemistry 2025 went to Susumu Kitagawa, Richard Robson and Omar Yaghi, for metal-organic frameworks. Peace 2025 went to María Corina Machado. If a question mixes years, check which year each one belongs to.',
        ],
      },
    ],
    caveats: [
      'The official nobelprize.org pages could not be read by automated tools in this check. Names, citations and dates come from news reports that quote the committees. Check the official pages before you use exact wording in notes.',
      'One Nobel page in search still showed the 2026 physics prize as not yet awarded. That page was out of date. The Reuters-carried report and the official laureate listing say it was awarded on 6 October.',
    ],
    sources: [
      { label: 'Nobel Prize, 2026 physics summary (official)', url: 'https://nobelprize.org/prizes/physics/2026/summary', kind: 'Official' },
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
    title: 'Physics: Francis Halzen and the IceCube neutrino detector',
    dek: 'One laureate, for helping find very energetic neutrinos that come from cosmic sources.',
    event: 'Physics prize announced 6 October 2026',
    facts: [
      'Laureate: Francis Halzen, a Belgian-American particle physicist. Sole laureate.',
      'Citation as reported: "for decisive contributions to the IceCube Neutrino Observatory and the discovery of high-energy neutrinos of astrophysical origin".',
      'Prize: 12 million Swedish crowns, about $1.2 million (Reuters-carried report).',
    ],
    sections: [
      {
        heading: 'What it is about',
        paragraphs: [
          'Neutrinos are tiny, electrically neutral particles that pass through ordinary matter almost without stopping (background). That is why they are so hard to catch, and also why a neutrino that does reach a detector tells you something about where it came from.',
          'IceCube sits in the Antarctic ice at the South Pole (background). The citation credits Halzen for big contributions to the detector and to finding high-energy neutrinos from cosmic sources. Put simply: the detector caught very energetic neutrinos that were made out there in space, not just the ones made by cosmic rays hitting the atmosphere (background).',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Neutrino, IceCube, South Pole, high-energy, astrophysical origin.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Astronomy is not only about light. Neutrinos, gravitational waves and cosmic rays each carry different information about the sky (background). Big rare-event detectors are one way to study faint signals. Good for a science and society answer on the cost of basic research.',
        ],
      },
    ],
    caveats: [
      'The reports did not explain IceCube or neutrinos. The background lines are general definitions, not from the reports.',
      'The reports do not name Halzen\'s institution, so none is given here. Check the official laureate page.',
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
      'Laureates, shared equally: Karl Deisseroth (Stanford University, United States), Peter Hegemann (Humboldt University, Berlin) and Georg Nagel (University of Würzburg, Germany).',
      'The work: light-gated ion channels. These are proteins that open when light hits them and let charged particles through.',
      'The use: optogenetics. Light switches nerve cells on or off, so a researcher can control single cells.',
      'The committee said the method "is now being used in laboratories around the world to reveal the brain\'s mysteries".',
    ],
    sections: [
      {
        heading: 'What it is about',
        paragraphs: [
          'Nerve cells talk using electrical signals. Those signals are charged particles (ions) crossing the cell membrane (background). Ion channels are the proteins that let them cross (background). A light-gated channel opens when light hits it. So if you put one into a nerve cell, a light beam can turn that cell on or off.',
          'Before this, it was hard to say which cell in the brain does what, with that precision. Now labs can test it directly. That is why the reports call it a tool that labs all over the world use.',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Optogenetics means using light to control living cells. Light-gated ion channels are the core of it. Remember the three names and where they work: Stanford, Berlin (Humboldt) and Würzburg.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'This is a good example of basic science turning into a research method. Ask how a tool like this changes what you can study: from "which cells are active during a behaviour" to "what happens if I switch this cell off". Then ask whether the same logic applies to other fields.',
          'For context, the 2025 Medicine prize went to Mary E. Brunkow, Fred Ramsdell and Shimon Sakaguchi, for peripheral immune tolerance. That means the immune system\'s ability to avoid attacking the body\'s own tissues (as the Euronews report puts it).',
        ],
      },
    ],
    caveats: [
      'The AP report gives affiliations and ages but not nationalities. The citation wording above is the committee\'s statement as quoted in the report. Check the official page for the formal citation.',
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
    title: 'Chemistry: how mirror-image molecules might end up one-sided',
    dek: 'Two chemists, for showing how a tiny imbalance can get amplified into a strong one-sided outcome.',
    event: 'Chemistry prize announced 7 October 2026',
    facts: [
      'Laureates, shared: Henri B. Kagan (Université Paris-Sud, Orsay, France, aged 95) and Kenso Soai (Tokyo University of Science, aged 76).',
      'Citation as quoted: "for the discovery of non-linear effects and autocatalysis in asymmetric organic synthesis".',
      'Prize: 12 million Swedish crowns, about $1.2 million. Medals are presented in Stockholm on 10 December.',
    ],
    sections: [
      {
        heading: 'Three words you need',
        paragraphs: [
          'Chirality: some molecules come in two forms that are mirror images and cannot be laid on top of each other, like your left and right hand. The word comes from the Greek for "hand". The committee chair, Heiner Linke, said such molecules "look alike, but they are not identical".',
          'Homochirality: many of the key molecules in living things use only one of the two mirror forms. Why life picked one side is a long-standing puzzle, and this prize is about a chemical route to that kind of one-sidedness.',
          'Autocatalysis: a reaction where the product helps make more of itself (background). Non-linear effects mean the output does not change in simple proportion to the input (background). The committee ties both to asymmetric synthesis, which is making molecules of one handedness.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'Where did molecular handedness come from? Nobody knows for sure, and that is an open question about the origin of life. This prize is one piece of it: a mechanism that turns a very small imbalance into a big one. Good for a science answer about how chance and selection can work together.',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Chirality, homochirality, autocatalysis, asymmetric synthesis. For the earlier year, remember the 2025 chemistry prize: Kitagawa, Robson and Yaghi, for metal-organic frameworks.',
        ],
      },
    ],
    caveats: [
      'The reports did not give a full plain-English explanation of homochirality. The explanation above combines the reports with general definitions. Lines marked background are general definitions.',
      'Ages come from Chemistry World and AFP. Reuters, which one report cited, could not be read automatically. Affiliations come from search summaries and the Khaleej Times report.',
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
    dek: 'A Canadian poet and writer. Her work mixes verse, prose, translation and performance.',
    event: 'Literature prize announced 8 October 2026',
    facts: [
      'Laureate: Anne Carson, Canadian poet and writer. Born in Toronto. Icelandic citizenship since 2022. Aged 76.',
      'Swedish Academy citation: "for her bold and inventive oeuvre that, in playful dialogue with the classical tradition, has created new forms for contemporary literature".',
      'Prize: 12 million Swedish crowns, about $1.2 million (report).',
    ],
    sections: [
      {
        heading: 'What she writes',
        paragraphs: [
          'Carson mixes verse, prose, dialogue and translation. Her work runs from opera libretti to literary criticism and verse novels (report).',
          'She is best known for translating classical Greek texts. The Swedish Academy says those translations count as independent works in their own right, not just copies.',
          'Autobiography of Red (1998) is a verse novel: a novel told in poems. Norma Jeane Baker of Troy (2019) is a performance piece that puts Helen of Troy from Euripides\' Helen next to Marilyn Monroe.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'The citation says "playful dialogue" with an old tradition. Think about what that means: a modern writer who reworks old texts rather than just repeating them, and who treats translation as a piece of writing in its own right.',
        ],
      },
    ],
    caveats: [
      'The official Nobel page for the 2026 literature prize could not be read automatically. The citation above is as quoted in the Khaleej Times report.',
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
    dek: 'A former UN human rights chief, honoured for work on peace and international law.',
    event: 'Peace prize announced 9 October 2026 in Oslo',
    facts: [
      'Laureate: Navanethem "Navi" Pillay, aged 85. The reports say she was born in Durban, South Africa, to a family of Tamil heritage.',
      'Committee citation: "efforts to promote peace and international law". The committee also praised her "firm moral compass".',
      'Positions reported: former UN High Commissioner for Human Rights. The reports also mention a role at the International Court of Justice, but the exact role was not confirmed in the latest check.',
      'Nominations: 287 candidates this year, 208 individuals and 79 organisations (as reported).',
    ],
    sections: [
      {
        heading: 'Why it matters',
        paragraphs: [
          'The committee said that resolving conflicts without force or violence depends on the international rule of law (as reported). So this prize is about courts, legal rules and human rights work, not only about ceasefires or summits.',
          'The International Court of Justice is the main judicial organ of the United Nations. It settles legal disputes between states (background).',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Oslo is where the Peace Prize is given (background). ICJ is the UN\'s principal judicial organ (background). The UN High Commissioner for Human Rights heads the human rights office (background).',
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
      'The Khaleej Times headline calls Pillay "Indian-origin". The article body says she was born in South Africa to a family with Tamil roots. This note follows the body.',
      'The exact ICJ role is open. The UN biography page could not be read automatically here, so do not state the role until it is confirmed.',
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
    dek: 'Two American economists, for the microeconomic basis of how policy should respond to booms and slumps.',
    event: 'Economic Sciences prize announced 12 October 2026',
    facts: [
      'Laureates, shared equally: Robert E. Hall (Stanford University) and Michael Woodford (Columbia University). Both American economists.',
      'Royal Swedish Academy citation: "for microeconomic foundations of macroeconomic stabilisation".',
      'Prize: 12 million Swedish crowns, about $1.2 million.',
    ],
    sections: [
      {
        heading: 'What it is about',
        paragraphs: [
          'Macroeconomic stabilisation means smoothing out the cycle of booms and slumps. The reports say the two built new economic models that help governments and central banks respond to downturns and overheating. Those models help with timing: when to spend, when to tax, when to move interest rates, so that harmful swings are softened.',
          'Their theory now sits under models used by central banks and governments around the world, according to the report. It is meant to help with shocks like an energy shortage or a sudden change in household spending.',
        ],
      },
      {
        heading: 'Prelims lines',
        paragraphs: [
          'Fiscal policy is what the government does with spending and tax. Monetary policy is what the central bank does with interest rates and the money supply (background). The prize is about timing both to soften the cycle.',
          'The official name is the Sveriges Riksbank Prize in Economic Sciences in Memory of Alfred Nobel. It was first given in 1969 (background).',
        ],
      },
    ],
    caveats: [
      'The reports read here gave no institution beyond Stanford and Columbia. Those came from search summaries, so check the official page before quoting.',
    ],
    sources: [
      { label: 'Sveriges Riksbank Prize in Economic Sciences 2026 (official)', url: 'https://www.nobelprize.org/prizes/economics/2026/', kind: 'Official' },
      { label: 'Illawarra Mercury, Americans Hall and Woodford win Nobel economics prize', url: 'https://www.illawarramercury.com.au/story/9367197/americans-hall-and-woodford-win-nobel-economics-prize/', kind: 'News report' },
      { label: 'Il Foglio, The Nobel Prize in Economics goes to Robert E. Hall and Michael Woodford', url: 'https://www.ilfoglio.it/en/economy/2026/10/12/video/the-nobel-prize-in-economics-goes-to-robert-e-hall-and-michael-woodford--410291', kind: 'News report' },
    ],
  },
  {
    slug: 'fields-medal-2026',
    category: 'science',
    title: 'Fields Medal 2026: four mathematicians at the Philadelphia congress',
    dek: 'The top prize in mathematics went to four researchers, announced at the International Congress of Mathematicians.',
    event: 'Announced 23 July 2026',
    facts: [
      'Announced at the opening of the International Congress of Mathematicians (ICM), Philadelphia, on 23 July 2026. The congress ran until 30 July.',
      'Winners: Yu Deng (University of Chicago), John Pardon (Stony Brook University), Jacob Tsimerman (University of Toronto), Hong Wang (New York University and IHÉS, France).',
      'Ages as reported: Deng and Pardon 37, Tsimerman 38, Wang 35.',
      'Work areas: Hong Wang, in harmonic analysis and geometric measure theory (IMU citation). Deng in partial differential equations, Pardon in symplectic geometry, Tsimerman in algebraic geometry (as reported).',
    ],
    sections: [
      {
        heading: 'Facts to know',
        paragraphs: [
          'The Fields Medal is awarded every four years by the International Mathematical Union, to mathematicians under 40 (background). People call it the Nobel of mathematics, but the Nobel Prizes have no mathematics category (background).',
          'One report says a woman has now won the medal for the third time in its history. The ICM was held in the United States for the first time since 1986.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'The Abel Prize is the other big international award in mathematics (background). Know which prize is for which field, and the age limit. Those are the easy checks.',
        ],
      },
    ],
    caveats: [
      'One aggregator report says the names leaked early through a glitch on the ICM website. That was not verified, so it is not stated here as fact.',
    ],
    sources: [
      { label: 'IMU, Fields Medals 2026 citations', url: 'https://www.mathunion.org/imu-awards/fields-medal/fields-medals-2026', kind: 'Official' },
      { label: 'Simons Foundation, 2026 Fields Medals awarded to four of the world\'s top mathematicians', url: 'https://www.simonsfoundation.org/2026/07/23/2026-fields-medals-awarded-to-four-of-worlds-top-mathematicians/', kind: 'News report' },
      { label: 'Newswire, 2026 Fields Medals awarded to four of the world\'s top mathematicians', url: 'https://www.newswire.com/news/2026-fields-medals-awarded-to-four-of-worlds-top-mathematicians-22832507', kind: 'News report' },
    ],
  },
  {
    slug: 'artemis-ii-2026',
    category: 'science',
    title: 'Artemis II: the first crewed flight beyond low Earth orbit since 1972',
    dek: 'Four astronauts flew a crewed lunar flyby and came home safely. It tested the systems for the later landing.',
    event: 'Flight in April 2026',
    facts: [
      'Crew: Reid Wiseman, Victor Glover, Christina Koch and Jeremy Hansen.',
      'Launch on 1 April 2026, per one report. It was the first crewed flight beyond low Earth orbit since Apollo 17 in 1972.',
      'The lunar flyby used a free-return trajectory. That brings the spacecraft back toward Earth without a major engine burn.',
      'NASA still fired smaller burns. The final one lasted 8 seconds and changed Orion\'s speed by 4.2 feet per second, pushing it toward Earth before splashdown (NASA mission blog).',
      'Reports say the closest approach was around 6 April, passing about 4,066 miles above the far side.',
      'NASA called it a crewed systems validation test. The data feeds planning for Artemis III, a planned south-pole landing.',
    ],
    sections: [
      {
        heading: 'Why it matters',
        paragraphs: [
          'Apollo 17 in 1972 was the last crewed lunar mission (background). Artemis II is the first crewed flight since then to go beyond low Earth orbit, out to the Moon and back.',
          'A free-return trajectory uses the Moon\'s gravity to send the spacecraft home (background). That is a neat point for Prelims: it is a route home, not a proof that no burns happen. NASA did fire small ones.',
        ],
      },
      {
        heading: 'Caveats',
        paragraphs: [
          'Reports disagree on the splashdown date. One says 10 April and another says 11 April in Pacific time. Check NASA\'s mission page before quoting a date.',
          'Reports also differ on details. One gives 6 April as the closest approach. Another gives a record distance of more than 252,000 miles from Earth. Treat both as reported, not verified.',
        ],
      },
    ],
    caveats: [
      'Most of these reports are news and aggregator pieces. NASA\'s own mission pages are the primary source for dates and distances.',
    ],
    sources: [
      { label: 'NASA mission blog, Artemis II crew completes final burn before splashdown', url: 'https://www.nasa.gov/blogs/missions/2026/04/10/artemis-ii-flight-day-10-crew-completes-final-burn-before-splashdown/', kind: 'Official' },
      { label: 'IOL, After milestone-rich lunar flyby, astronauts start trip home', url: 'https://iol.co.za/news/world/2026-04-07-after-milestone-rich-lunar-flyby-astronauts-start-trip-home/', kind: 'News report' },
      { label: 'Interesting Engineering, NASA Artemis II returns safely on Earth', url: 'https://interestingengineering.com/space/nasa-artemis-ii-returns-safely-on-earth', kind: 'News report' },
      { label: 'Cislunar Space Beginner\'s Guide, Artemis II lunar flyby (7 April 2026)', url: 'https://cislunarspace.cn/en/space-news/2026/04/2026-04-07-artemis-2-lunar-flyby', kind: 'News report' },
    ],
  },
  {
    slug: 'ai-impact-summit-2026',
    category: 'science',
    title: 'AI Impact Summit 2026: the New Delhi Declaration',
    dek: 'India hosted a global AI summit in February 2026. The main outcome is a non-binding declaration built on seven pillars.',
    event: 'Summit held in February 2026, New Delhi',
    facts: [
      'Venue: Bharat Mandapam, New Delhi. The PIB release gives the summit dates as 18 to 19 February 2026. The declaration was gathered in New Delhi on 19 February.',
      'Outcome: the New Delhi Declaration on AI Impact, built on the principle "Welfare for all, Happiness for all".',
      'Endorsements: 92 countries and international organisations, according to the PIB release. Earlier news reports gave 88, 89 or 91.',
      'Seven pillars: democratising AI resources; economic growth and social good; secure and trusted AI; AI for science; access for social empowerment; human capital development; resilient, efficient and innovative AI systems.',
      'Framing: three "Sutras", People, Planet and Progress.',
    ],
    sections: [
      {
        heading: 'What it is and is not',
        paragraphs: [
          'The declaration is a voluntary, non-binding set of principles, according to one report. It does not bind the countries that signed it, so do not write it up as a treaty.',
          'Reports say the signatories include the United States, the United Kingdom, China and France. Check the official text before you list any country as a signatory.',
        ],
      },
      {
        heading: 'Mains angle',
        paragraphs: [
          'The core debate is binding rules or voluntary principles for a fast-moving technology. A non-binding declaration can set shared language and push national rules. It cannot enforce standards on companies or states. Write both sides and then your view.',
        ],
      },
    ],
    caveats: [
      'Earlier reports gave 88, 89 and 91 endorsers. This note uses the PIB figure of 92.',
      'One source names follow-on platforms that came out of the declaration. Only one source reports them, so they are left out here.',
    ],
    sources: [
      { label: 'PIB, AI Impact Summit 2026 concludes with adoption of New Delhi Declaration', url: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=2231208', kind: 'Government' },
      { label: 'WAM, AI Impact Summit 2026 adopts New Delhi Declaration', url: 'https://www.wam.ae/en/article/byup8rk-impact-summit-2026-adopts-new-delhi-declaration', kind: 'News report' },
      { label: 'AIR (All India Radio), India AI Impact Summit 2026 adopts New Delhi Declaration', url: 'https://www.newsonair.gov.in/india-ai-impact-summit-2026-adopts-new-delhi-declaration', kind: 'Government' },
    ],
  },
  {
    slug: 'union-budget-2026-27',
    category: 'economy',
    title: 'Union Budget 2026-27: the key numbers',
    dek: 'Presented on 1 February 2026. The fiscal targets, the big allocations and the new schemes.',
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
        heading: 'New initiatives reported',
        paragraphs: [
          'Biopharma SHAKTI is a separate flagship. The India Semiconductor Mission 2.0 is expanded. Dedicated rare-earth corridors are announced. Customs duty was waived on select medicines to help affordability (Foxmandal report).',
          'Devolution to states stays at 41%. The government accepted the 16th Finance Commission\'s recommendations (Basis Point Insight report). The defence allocation is reported at about ₹5.95 trillion.',
        ],
      },
      {
        heading: 'Terms to know',
        paragraphs: [
          'Fiscal deficit is the gap between total expenditure and total non-debt receipts. Capital expenditure is spending that creates assets or reduces future liabilities (background). Devolution is the share of central tax revenue that goes to states, and the Finance Commission recommends it (background; the commission is set up under Article 280).',
        ],
      },
    ],
    caveats: [
      'Most figures come from secondary explainers and the PRS analysis. The key budget figures were checked against PIB. For anything exact, use the Budget speech and PIB.',
    ],
    sources: [
      { label: 'PIB, Union Budget 2026 (official)', url: 'https://www.pib.gov.in/unionbudget/2026/en', kind: 'Government' },
      { label: 'PRS Legislative Research, Union Budget Analysis 2026-27', url: 'https://prsindia.org/files/budget/budget_parliament/2026/Union_Budget_Analysis-2026-27.pdf', kind: 'Research' },
      { label: 'Finnovate, India Union Budget 2026-27 key highlights', url: 'https://www.finnovate.in/learn/blog/india-union-budget-2026-27-key-highlights', kind: 'News report' },
      { label: 'Foxmandal, Union budget highlights 2026-27', url: 'https://foxmandal.in/Insights/union-budget-highlights-2026-27/', kind: 'News report' },
      { label: 'Basis Point Insight, Highlights of Union Budget for 2026-27', url: 'https://www.basispointinsight.com/Story/highlights-of-union-budget-for-2026-27-_a9114e3145ae.html', kind: 'News report' },
    ],
  },
  {
    slug: 'padma-awards-2026',
    category: 'honours',
    title: 'Padma Awards 2026: 131 honours',
    dek: 'Announced on 25 January 2026, on the eve of Republic Day. The list covers the three civilian tiers and includes posthumous honours.',
    event: 'Announced 25 January 2026',
    facts: [
      'Total: 131 awards. Five Padma Vibhushan, 13 Padma Bhushan and 113 Padma Shri, per the MHA list.',
      'Padma Vibhushan (as reported): Dharmendra Singh Deol and V S Achuthanandan, both posthumously; K T Thomas (public affairs); N Rajam (art); P Narayanan (literature and education).',
      'Padma Bhushan (as reported): Alka Yagnik (singer), Mammootty (actor), Uday Kotak (industrialist), Vijay Amritraj (tennis), Bhagat Singh Koshyari, and Piyush Pandey and Shibu Soren, both posthumously.',
      'Breakdown reported: 19 women, 16 posthumous awardees and 6 foreigners, NRIs, PIOs or OCI cardholders.',
    ],
    sections: [
      {
        heading: 'Terms to know',
        paragraphs: [
          'The Padma awards come in three tiers: Padma Vibhushan, Padma Bhushan and Padma Shri. The MHA list says so directly. The Bharat Ratna is the highest civilian honour and is a separate award. The reports read here did not say whether a Bharat Ratna was given this year.',
          'The Statesman\'s headline calls the list a set of "unsung heroes" honours. That is a news framing, not the official citation.',
        ],
      },
    ],
    caveats: [
      'The MHA list (25 January 2026) gives 131 awards, with two duo cases counted as one award each. Names above come from news reports, so check the MHA list before you quote one.',
    ],
    sources: [
      { label: 'Ministry of Home Affairs, Padma Awards 2026 list (official PDF)', url: 'https://www.mha.gov.in/sites/default/files/Padma_Awards2026W_25012026.pdf', kind: 'Government' },
      { label: 'ETV Bharat, Padma Awards 2026 announced', url: 'https://www.etvbharat.com/en/bharat/padma-awards-2026-announced-enn26012504247', kind: 'News report' },
      { label: 'The News Minute, Padma Awards 2026: 131 recipients named', url: 'https://www.thenewsminute.com/amp/story/news/padma-awards-2026-131-recipients-named-mammootty-alka-yagnik-among-awardees', kind: 'News report' },
      { label: 'The Statesman, Padma Awards 2026 honours unsung heroes', url: 'https://www.thestatesman.com/india/padma-awards-2026-nation-honours-unsung-heroes-for-extraordinary-contributions-1503546337.html', kind: 'News report' },
    ],
  },
];
