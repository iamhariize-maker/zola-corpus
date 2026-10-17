// Keyword rules that suggest taxonomy topics (tools/upsc-taxonomy.mjs ids). A tag is a hint for review, never a verdict.
// Rule: prefer no tag to a wrong tag. Ambiguous words need context. Every rule has a test.

export const RULES = [
  ['polity-constitution', /\bconstitution(al)?\b|\barticle \d+|\bfundamental rights?\b|\bsupreme court\b.*\b(judgment|verdict|ruling|held)\b/i],
  ['polity-governance', /\bbill\b|\bact\b|\bordinance\b|\bscheme\b|\bmission\b|\byojana\b|\bPMAY|\bPM-[A-Z]{2,}|\bawas\b|\bcabinet approves?\b|\bgovernance\b|\be-governance\b|\brules?\b/i],
  ['polity-bodies', /\b(national|election|human rights|finance|pay|law|statutory|women|minorities|backward classes|central|state|public service|safai|official language)\s+commissions?\b|\bcommission of inquiry\b|\btribunals?\b|\bcomptroller\b|\bcag\b|\belection commission\b|\bcaqm\b|\bnhrc\b|\bhuman rights commission\b|\bauthority\b|\bombudsman\b/i],
  ['economy-macro', /\brepo rate\b|\bmpc\b|\brbi\b|\binflation\b|\bfiscal\b|\bbudget\b|\bgdp\b|\bgst\b|\bmonetary policy\b|\btax(ation)?\b|\bmsmes?\b|\bsmall and medium\b/i],
  ['economy-banking-markets', /\bbank(s|ing)?\b|\bbankers?\b|\bnbfc\b|\bsebi\b|\bloan\b|\bsecurities\b|\bstock exchange\b/i],
  ['economy-external-trade', /\btrade\b|\bexports?\b|\bimports?\b|\bfdi\b|\bwto\b|\bforex\b|\btariff\b/i],
  ['agriculture-food', /\bmsp\b|\bkharif\b|\brabi\b|\bcrops?\b|\bagricultur|\bfood security\b|\bfertili[sz]er\b/i],
  ['environment-ecology', /\bspecies\b|\bwildlife\b|\btiger\b|\bramsar\b|\bbiodiversity\b|\bprotected area\b|\bforest\b|\bnational park\b|\bsanctuary\b/i],
  ['environment-climate', /\bcaqm\b|\bclimate\b|\bcop\d*\b|\bemission\w*\b|\bcarbon\b|\bair quality\b|\bpollution\b|\bpaddy\b|\bstubble\b/i],
  ['science-space', /\bisro\b|\bspace\b|\bsatellite\b|\brocket\b|\blunar\b|\bmoon\b|\bartemis\b|\bgaganyaan\b/i],
  ['science-health-biotech', /\bvaccin\w*\b|\bbiotech\w*\b|\bmedic(al|ine)\b|\bdisease\b|\bayush\b|\bayurved\w*\b|\bhealth(care|ministry|system|services?|insurance)?\b|\bhospitals?\b|\bpatients?\b|\bdrug\b/i],
  ['security-defence', /\bnavy\b|\bnaval\b|\barmy\b|\bair force\b|\bdefen[cs]e\b|\bmissile\b|\bwarship\b|\bINS [a-z]|\bNSG\b|\bCAPF\b|\bcentral armed police\b|\bparamilitary\b/i],
  ['disaster-management', /\bflood\w*\b|\bcyclone\b|\bearthquake\b|\blandslide\b|\bdisaster\b|\bNDMA\b/i],
  ['ir-groupings', /\bsummit\b|\bbilateral\b|\bBRICS\b|\bG20\b|\bG7\b|\bSCO\b|\bQuad\b|\bASEAN\b|\bdelegation\b|\bstate visit\b/],
  ['art-culture-heritage', /\bunesco\b|\bheritage\b|\bGI tag\b|\bexcavation\b|\bmuseum\b|\bfestival\b|\bnavaratri\b|\bsargotsavam\b|\bpuraskar\b/i],
  ['indices-reports', /\bindex\b|\brank(s|ing)?\b|\breport\b|\bsurvey\b/i],
  ['assam-state-policy', /\bassam\b|\bguwahati\b|\bdispur\b/i],
  ['assam-environment-disaster', /\bkaziranga\b|\bmanas\b|\bbrahmaputra\b/i],
];

export function topicsFor(title = '') {
  const found = [];
  for (const [id, rx] of RULES) if (rx.test(title)) found.push(id);
  return found;
}
