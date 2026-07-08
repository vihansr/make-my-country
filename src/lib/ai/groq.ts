import Groq from 'groq-sdk';
import { InitialNationStats } from '../data/countries';
import { PolicyOption } from '../data/policies';
import { SimulationEvent } from '../simulation/engine';

const groq = new Groq({
  apiKey: process.env.key || 'dummy_key',
});

export interface TurnNarrativeResponse {
  headline: string;
  summary: string;
  internationalReaction: string;
  publicOpinion: string;
}

export interface AdvisorReport {
  name: string;
  role: string;
  status: 'Optimal' | 'Stable' | 'Caution' | 'Critical';
  summary: string;
  recommendation: string;
}

export interface AdvisorReportsResponse {
  finance: AdvisorReport;
  defense: AdvisorReport;
  foreign: AdvisorReport;
  environment: AdvisorReport;
}

export async function generateTurnNarrative(
  countryName: string,
  leaderRole: string,
  currentYear: number,
  currentTurn: number,
  stats: InitialNationStats,
  enactedPolicies: PolicyOption[],
  triggeredEvent?: SimulationEvent
): Promise<TurnNarrativeResponse> {
  const policiesText = enactedPolicies.length > 0
    ? enactedPolicies.map(p => p.name).join(', ')
    : 'No major legislative policy decrees enacted this quarter.';
  
  const eventText = triggeredEvent
    ? `Active World Event: "${triggeredEvent.title}" (${triggeredEvent.description})`
    : 'No major unexpected crisis occurred this quarter.';

  const prompt = `You are the core AI simulation narrator for a geopolitical grand strategy game called GeoPolis.
Country: ${countryName}
Leader Role: ${leaderRole}
Year: ${currentYear}, Quarter Q${currentTurn}

Current State:
- GDP: $${Math.round(stats.economy.gdp)} Billion (Inflation: ${stats.economy.inflation.toFixed(1)}%, Debt: ${Math.round(stats.economy.debt)}% GDP)
- National Approval: ${Math.round(stats.politics.approvalRating)}% (Stability: ${Math.round(stats.politics.stability)})
- Military Readiness: ${Math.round(stats.military.readiness)}% (Tech Tier: ${Math.round(stats.military.technology)})
- Energy Security: ${Math.round(stats.environment.energySecurity)}% (Climate Risk: ${Math.round(stats.environment.climateRisk)})

Recent Policy Decisions Enacted: ${policiesText}
${eventText}

Generate realistic, professional, newspaper-style geopolitical consequences in valid JSON format ONLY with the following exact keys:
{
  "headline": "A bold, captivating newspaper headline summarizing the biggest development of the quarter.",
  "summary": "A 2-3 sentence executive summary of economic and political shifts.",
  "internationalReaction": "How global superpowers, allies, and rivals are reacting to ${countryName}'s recent actions.",
  "publicOpinion": "A concise summary of domestic public sentiment across factions."
}`;

  try {
    if (!process.env.key || process.env.key === 'dummy_key') {
      throw new Error('No Groq API key configured');
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return {
      headline: parsed.headline || `${countryName} Enacts New Quarterly Strategic Agenda`,
      summary: parsed.summary || `The administration of ${countryName} navigated complex quarterly economic and social dynamics.`,
      internationalReaction: parsed.internationalReaction || `International observers monitor ${countryName}'s policy trajectory with cautious interest.`,
      publicOpinion: parsed.publicOpinion || `Domestic factions display mixed sentiment as economic indicators adjust to recent policies.`
    };
  } catch (err) {
    console.warn('Groq API narrative generation fallback:', err);
    // Return realistic fallback narrative if API fails or rate limits
    return {
      headline: enactedPolicies.length > 0 ? `${countryName} Moves Forward With ${enactedPolicies[0].name}` : `${countryName} Maintains Steady State in Q${currentTurn}`,
      summary: `In Year ${currentYear} Q${currentTurn}, ${countryName} maintained national stability at ${Math.round(stats.politics.stability)}% while GDP reached $${Math.round(stats.economy.gdp)}B. ${enactedPolicies.length > 0 ? 'Recently enacted policies are creating ripple effects across markets.' : 'Markets remain stable in the absence of major legislative shifts.'}`,
      internationalReaction: `Foreign diplomats note ${countryName}'s military readiness at ${Math.round(stats.military.readiness)}% and continue normal diplomatic channels.`,
      publicOpinion: `Approval rating stands at ${Math.round(stats.politics.approvalRating)}%, with working class and business factions voicing cautious optimism.`
    };
  }
}

export async function generateAdvisorReports(
  countryName: string,
  stats: InitialNationStats
): Promise<AdvisorReportsResponse> {
  const prompt = `You are simulating 4 top government advisors for ${countryName} in a geopolitical strategy game. They must analyze current national statistics and provide actionable, sometimes CONFLICTING recommendations.
Stats:
- Economy: GDP $${Math.round(stats.economy.gdp)}B, Inflation ${stats.economy.inflation.toFixed(1)}%, Debt ${Math.round(stats.economy.debt)}%
- Society: Happiness ${Math.round(stats.society.happiness)}%, Inequality ${Math.round(stats.society.inequality)}, Healthcare ${Math.round(stats.society.healthcare)}%
- Military: Readiness ${Math.round(stats.military.readiness)}%, Tech Tier ${Math.round(stats.military.technology)}
- Environment: Pollution ${Math.round(stats.environment.pollution)}%, Energy Security ${Math.round(stats.environment.energySecurity)}%

Return valid JSON with exact structure:
{
  "finance": {
    "name": "Dr. Aris Thorne",
    "role": "Minister of Finance",
    "status": "Optimal/Stable/Caution/Critical",
    "summary": "1-2 sentences on inflation, debt, or GDP.",
    "recommendation": "Specific economic policy recommendation."
  },
  "defense": {
    "name": "General Marcus Vance",
    "role": "Chief of Defense",
    "status": "Optimal/Stable/Caution/Critical",
    "summary": "1-2 sentences on military readiness or geopolitical posture.",
    "recommendation": "Specific defense or military budget recommendation."
  },
  "foreign": {
    "name": "Ambassador Elena Rostova",
    "role": "Secretary of Foreign Affairs",
    "status": "Optimal/Stable/Caution/Critical",
    "summary": "1-2 sentences on international relations or trade.",
    "recommendation": "Specific diplomatic or trade agreement recommendation."
  },
  "environment": {
    "name": "Dr. Kaelen Voss",
    "role": "Director of Environmental Security",
    "status": "Optimal/Stable/Caution/Critical",
    "summary": "1-2 sentences on pollution, climate risk, or clean energy.",
    "recommendation": "Specific environmental or green grid recommendation."
  }
}`;

  try {
    if (!process.env.key || process.env.key === 'dummy_key') {
      throw new Error('No Groq API key configured');
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 700,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    return {
      finance: parsed.finance || getFallbackAdvisor('finance', stats),
      defense: parsed.defense || getFallbackAdvisor('defense', stats),
      foreign: parsed.foreign || getFallbackAdvisor('foreign', stats),
      environment: parsed.environment || getFallbackAdvisor('environment', stats)
    };
  } catch (err) {
    console.warn('Groq API advisor fallback:', err);
    return {
      finance: getFallbackAdvisor('finance', stats),
      defense: getFallbackAdvisor('defense', stats),
      foreign: getFallbackAdvisor('foreign', stats),
      environment: getFallbackAdvisor('environment', stats)
    };
  }
}

function getFallbackAdvisor(type: 'finance' | 'defense' | 'foreign' | 'environment', stats: InitialNationStats): AdvisorReport {
  switch (type) {
    case 'finance':
      return {
        name: 'Dr. Aris Thorne',
        role: 'Minister of Finance',
        status: stats.economy.inflation > 5 || stats.economy.debt > 110 ? 'Caution' : 'Stable',
        summary: `Inflation is tracking at ${stats.economy.inflation.toFixed(1)}% with national debt standing at ${Math.round(stats.economy.debt)}% of GDP.`,
        recommendation: stats.economy.debt > 100 ? 'We must enact corporate tax reform to curb deficit expansion.' : 'Consider deregulation stimulus to accelerate GDP growth.'
      };
    case 'defense':
      return {
        name: 'General Marcus Vance',
        role: 'Chief of Defense',
        status: stats.military.readiness < 70 ? 'Caution' : 'Optimal',
        summary: `Armed forces readiness sits at ${Math.round(stats.military.readiness)}% with technological modernization index at ${Math.round(stats.military.technology)}%.`,
        recommendation: 'We should invest in autonomous drone swarms and strategic overseas defense installations to project regional deterrence.'
      };
    case 'foreign':
      return {
        name: 'Ambassador Elena Rostova',
        role: 'Secretary of Foreign Affairs',
        status: 'Stable',
        summary: 'Global diplomatic channels remain active. Foreign direct investment provides critical foreign exchange buffer.',
        recommendation: 'Prioritize negotiating comprehensive free trade pacts with regional allies to lock in supply chain resilience.'
      };
    case 'environment':
      return {
        name: 'Dr. Kaelen Voss',
        role: 'Director of Environmental Security',
        status: stats.environment.pollution > 70 ? 'Critical' : 'Stable',
        summary: `National carbon pollution index is at ${Math.round(stats.environment.pollution)}% while clean energy security stands at ${Math.round(stats.environment.energySecurity)}%.`,
        recommendation: 'We must accelerate clean energy grid subsidies and carbon cap policies to prevent long-term climate vulnerability.'
      };
  }
}

export interface CustomDecisionResponse {
  policyTitle: string;
  headline: string;
  summary: string;
  internationalReaction: string;
  publicOpinion: string;
  treasuryCost: number;
  statDeltas: {
    gdpDelta: number;
    inflationDelta: number;
    debtDelta: number;
    approvalDelta: number;
    stabilityDelta: number;
    readinessDelta: number;
    technologyDelta: number;
    pollutionDelta: number;
    energySecurityDelta: number;
    happinessDelta: number;
    inequalityDelta: number;
  };
  factionDeltas: {
    name: string;
    supportDelta: number;
    influenceDelta: number;
  }[];
  immediateConsequences: string[];
  longTermRisks: string[];
}

export async function evaluateCustomDecision(
  countryName: string,
  leaderRole: string,
  currentYear: number,
  currentTurn: number,
  stats: InitialNationStats,
  customPrompt: string
): Promise<CustomDecisionResponse> {
  const prompt = `You are the AI Grand Strategy Simulation Engine for GeoPolis.
The leader (${leaderRole}) of ${countryName} in Year ${currentYear} Q${currentTurn} has issued a custom free-form executive order / decision:
"${customPrompt}"

Current National Telemetry:
- GDP: $${Math.round(stats.economy.gdp)} Billion (Inflation: ${stats.economy.inflation.toFixed(1)}%, Debt: ${Math.round(stats.economy.debt)}% of GDP)
- Society: Happiness ${Math.round(stats.society.happiness)}%, Inequality ${Math.round(stats.society.inequality)}, Healthcare ${Math.round(stats.society.healthcare)}%
- Politics: Approval Rating ${Math.round(stats.politics.approvalRating)}%, Stability ${Math.round(stats.politics.stability)}%
- Military: Readiness ${Math.round(stats.military.readiness)}%, Technology Tier ${Math.round(stats.military.technology)}%
- Environment: Pollution ${Math.round(stats.environment.pollution)}%, Energy Security ${Math.round(stats.environment.energySecurity)}%

Internal Factions:
${stats.factions.map(f => `- ${f.name}: Support ${Math.round(f.support)}%, Influence ${Math.round(f.influence)}%`).join('\n')}

Evaluate the realistic geopolitical, economic, and social consequences of this custom decision. Determine specific numerical deltas (positive or negative integers/decimals) for stats and factions.
Return valid JSON ONLY with exact keys:
{
  "policyTitle": "Short official title for this decree (3-6 words)",
  "headline": "Newspaper headline summarizing the biggest development",
  "summary": "2-3 sentence detailed analysis of what transpired due to this order",
  "internationalReaction": "How global superpowers and neighbors respond",
  "publicOpinion": "How domestic citizens react",
  "treasuryCost": 15,
  "statDeltas": {
    "gdpDelta": 10,
    "inflationDelta": 0.3,
    "debtDelta": 2,
    "approvalDelta": 5,
    "stabilityDelta": 3,
    "readinessDelta": -2,
    "technologyDelta": 5,
    "pollutionDelta": -5,
    "energySecurityDelta": 10,
    "happinessDelta": 4,
    "inequalityDelta": -1
  },
  "factionDeltas": [
    { "name": "${stats.factions[0]?.name || 'Working Class'}", "supportDelta": 5, "influenceDelta": 2 },
    { "name": "${stats.factions[1]?.name || 'Business Elite'}", "supportDelta": -4, "influenceDelta": -1 }
  ],
  "immediateConsequences": [
    "Immediate impact point 1",
    "Immediate impact point 2"
  ],
  "longTermRisks": [
    "Long-term trade-off point 1",
    "Long-term trade-off point 2"
  ]
}`;

  try {
    if (!process.env.key || process.env.key === 'dummy_key') {
      throw new Error('No Groq API key configured');
    }

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);

    return {
      policyTitle: parsed.policyTitle || 'Executive Strategic Decree',
      headline: parsed.headline || `${countryName} Enacts Bold Executive Order`,
      summary: parsed.summary || `The administration implemented a custom strategic decree: "${customPrompt}". Markets and institutions are adjusting to the new directives.`,
      internationalReaction: parsed.internationalReaction || `Foreign ministries analyze ${countryName}'s latest executive maneuver with intense scrutiny.`,
      publicOpinion: parsed.publicOpinion || `Domestic sentiment shifts as factions debate the long-term implications of the decree.`,
      treasuryCost: Number(parsed.treasuryCost) || 10,
      statDeltas: {
        gdpDelta: Number(parsed.statDeltas?.gdpDelta) || 5,
        inflationDelta: Number(parsed.statDeltas?.inflationDelta) || 0.2,
        debtDelta: Number(parsed.statDeltas?.debtDelta) || 1,
        approvalDelta: Number(parsed.statDeltas?.approvalDelta) || 3,
        stabilityDelta: Number(parsed.statDeltas?.stabilityDelta) || 2,
        readinessDelta: Number(parsed.statDeltas?.readinessDelta) || 0,
        technologyDelta: Number(parsed.statDeltas?.technologyDelta) || 2,
        pollutionDelta: Number(parsed.statDeltas?.pollutionDelta) || 0,
        energySecurityDelta: Number(parsed.statDeltas?.energySecurityDelta) || 3,
        happinessDelta: Number(parsed.statDeltas?.happinessDelta) || 2,
        inequalityDelta: Number(parsed.statDeltas?.inequalityDelta) || 0,
      },
      factionDeltas: Array.isArray(parsed.factionDeltas) ? parsed.factionDeltas.map((fd: any) => ({
        name: fd.name || 'Faction',
        supportDelta: Number(fd.supportDelta) || 0,
        influenceDelta: Number(fd.influenceDelta) || 0,
      })) : [],
      immediateConsequences: Array.isArray(parsed.immediateConsequences) ? parsed.immediateConsequences : [`State institutions execute: "${customPrompt}".`, `Initial budget reallocations completed.`],
      longTermRisks: Array.isArray(parsed.longTermRisks) ? parsed.longTermRisks : [`Potential administrative friction in regional sectors.`, `Unforeseen market volatility.`],
    };
  } catch (err) {
    console.warn('Groq API evaluateCustomDecision fallback:', err);
    return {
      policyTitle: 'Executive Order',
      headline: `${countryName} Issues Direct Executive Mandate`,
      summary: `The leadership executed: "${customPrompt}". National bureaucracy has begun processing the operational directives across all sectors.`,
      internationalReaction: `Global observers take note of ${countryName}'s proactive governance and monitor regional indicators.`,
      publicOpinion: `Citizens show cautious optimism as the executive branch demonstrates decisive leadership.`,
      treasuryCost: 15,
      statDeltas: {
        gdpDelta: 8,
        inflationDelta: 0.1,
        debtDelta: 2,
        approvalDelta: 4,
        stabilityDelta: 3,
        readinessDelta: 2,
        technologyDelta: 3,
        pollutionDelta: -1,
        energySecurityDelta: 4,
        happinessDelta: 3,
        inequalityDelta: -1,
      },
      factionDeltas: stats.factions.map(f => ({
        name: f.name,
        supportDelta: Math.floor(Math.random() * 9) - 3,
        influenceDelta: Math.floor(Math.random() * 5) - 2,
      })),
      immediateConsequences: [`Decree "${customPrompt.slice(0, 40)}..." enacted nationwide.`, `Fiscal reserves mobilized for implementation.`],
      longTermRisks: [`Requires sustained executive oversight to prevent bureaucratic drift.`, `May require follow-up legislative fine-tuning next quarter.`],
    };
  }
}

