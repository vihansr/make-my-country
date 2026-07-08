import { POLICIES_CATALOG, PolicyOption } from '../data/policies';
import { FactionData, InitialNationStats } from '../data/countries';

export interface SimulationEvent {
  id: string;
  title: string;
  category: 'Domestic' | 'International' | 'Environmental' | 'Technology';
  description: string;
  impactSummary: string;
}

export interface TurnOutcome {
  updatedStats: InitialNationStats;
  enactedPolicies: PolicyOption[];
  triggeredEvent?: SimulationEvent;
  turnSummaryText: string;
  gdpGrowthRate: number;
}

// Clamp helper
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function evaluateTurn(
  currentStats: InitialNationStats,
  selectedPolicyIds: string[]
): TurnOutcome {
  // Deep copy stats
  const nextStats: InitialNationStats = JSON.parse(JSON.stringify(currentStats));
  const enactedPolicies: PolicyOption[] = [];
  let totalCost = 0;
  let gdpChangeSum = 0;

  // Apply each enacted policy
  for (const policyId of selectedPolicyIds) {
    const policy = POLICIES_CATALOG.find((p) => p.id === policyId);
    if (!policy) continue;
    enactedPolicies.push(policy);
    totalCost += policy.cost;

    const imp = policy.impact;

    // Economy
    if (imp.economy) {
      if (imp.economy.gdp) {
        nextStats.economy.gdp += imp.economy.gdp;
        gdpChangeSum += imp.economy.gdp;
      }
      if (imp.economy.inflation !== undefined) nextStats.economy.inflation = Math.max(0, nextStats.economy.inflation + imp.economy.inflation);
      if (imp.economy.unemployment !== undefined) nextStats.economy.unemployment = clamp(nextStats.economy.unemployment + imp.economy.unemployment, 1, 35);
      if (imp.economy.debt !== undefined) nextStats.economy.debt = Math.max(0, nextStats.economy.debt + imp.economy.debt);
      if (imp.economy.currencyStrength !== undefined) nextStats.economy.currencyStrength = clamp(nextStats.economy.currencyStrength + imp.economy.currencyStrength, 10, 100);
      if (imp.economy.foreignInvestment !== undefined) nextStats.economy.foreignInvestment = Math.max(0, nextStats.economy.foreignInvestment + imp.economy.foreignInvestment);
    }

    // Society
    if (imp.society) {
      if (imp.society.happiness !== undefined) nextStats.society.happiness = clamp(nextStats.society.happiness + imp.society.happiness, 0, 100);
      if (imp.society.literacy !== undefined) nextStats.society.literacy = clamp(nextStats.society.literacy + imp.society.literacy, 10, 100);
      if (imp.society.healthcare !== undefined) nextStats.society.healthcare = clamp(nextStats.society.healthcare + imp.society.healthcare, 10, 100);
      if (imp.society.crimeRate !== undefined) nextStats.society.crimeRate = clamp(nextStats.society.crimeRate + imp.society.crimeRate, 0, 100);
      if (imp.society.inequality !== undefined) nextStats.society.inequality = clamp(nextStats.society.inequality + imp.society.inequality, 5, 95);
    }

    // Politics
    if (imp.politics) {
      if (imp.politics.approvalRating !== undefined) nextStats.politics.approvalRating = clamp(nextStats.politics.approvalRating + imp.politics.approvalRating, 0, 100);
      if (imp.politics.corruption !== undefined) nextStats.politics.corruption = clamp(nextStats.politics.corruption + imp.politics.corruption, 0, 100);
      if (imp.politics.stability !== undefined) nextStats.politics.stability = clamp(nextStats.politics.stability + imp.politics.stability, 0, 100);
      if (imp.politics.polarization !== undefined) nextStats.politics.polarization = clamp(nextStats.politics.polarization + imp.politics.polarization, 0, 100);
    }

    // Military
    if (imp.military) {
      if (imp.military.readiness !== undefined) nextStats.military.readiness = clamp(nextStats.military.readiness + imp.military.readiness, 0, 100);
      if (imp.military.manpower !== undefined) nextStats.military.manpower = Math.max(10, nextStats.military.manpower + imp.military.manpower);
      if (imp.military.technology !== undefined) nextStats.military.technology = clamp(nextStats.military.technology + imp.military.technology, 10, 100);
      if (imp.military.nuclearCapability !== undefined) nextStats.military.nuclearCapability = clamp(nextStats.military.nuclearCapability + imp.military.nuclearCapability, 0, 100);
    }

    // Environment
    if (imp.environment) {
      if (imp.environment.pollution !== undefined) nextStats.environment.pollution = clamp(nextStats.environment.pollution + imp.environment.pollution, 0, 100);
      if (imp.environment.energySecurity !== undefined) nextStats.environment.energySecurity = clamp(nextStats.environment.energySecurity + imp.environment.energySecurity, 0, 100);
      if (imp.environment.climateRisk !== undefined) nextStats.environment.climateRisk = clamp(nextStats.environment.climateRisk + imp.environment.climateRisk, 0, 100);
    }

    // Faction Modifiers
    if (imp.factionModifiers) {
      for (const mod of imp.factionModifiers) {
        nextStats.factions.forEach((f) => {
          if (f.name.toLowerCase().includes(mod.factionNameSubstring.toLowerCase())) {
            f.support = clamp(f.support + mod.supportChange, 0, 100);
            if (mod.influenceChange !== undefined) {
              f.influence = clamp(f.influence + mod.influenceChange, 5, 100);
            }
          }
        });
      }
    }
  }

  // Baseline Turn Dynamics & Organic Drift
  // 1. Calculate quarterly GDP growth rate based on tech tier, literacy, foreign investment, and stability
  const baseGrowthRate = 0.5 + (nextStats.military.technology / 100) * 0.8 + (nextStats.society.literacy / 100) * 0.5;
  const stabilityPenalty = (100 - nextStats.politics.stability) * 0.01;
  const netQuarterlyGrowthPercent = clamp(baseGrowthRate - stabilityPenalty, -3.0, 5.0);
  
  const naturalGdpGain = nextStats.economy.gdp * (netQuarterlyGrowthPercent / 100);
  nextStats.economy.gdp += naturalGdpGain;

  // 2. Adjust debt based on total policy cost (if cost > 0, debt goes up slightly; if cost < 0, debt decreases)
  if (totalCost !== 0) {
    const debtImpact = (totalCost / nextStats.economy.gdp) * 100;
    nextStats.economy.debt = Math.max(0, nextStats.economy.debt + debtImpact);
  }

  // 3. Approval rating drift toward weighted average of faction support
  if (nextStats.factions.length > 0) {
    const weightedSupportSum = nextStats.factions.reduce((acc, f) => acc + f.support * f.influence, 0);
    const totalInfluence = nextStats.factions.reduce((acc, f) => acc + f.influence, 0);
    const targetApproval = totalInfluence > 0 ? weightedSupportSum / totalInfluence : 50;
    nextStats.politics.approvalRating = clamp(nextStats.politics.approvalRating * 0.8 + targetApproval * 0.2, 0, 100);
  }

  // 4. Random Dynamic Events (35% chance per turn)
  let triggeredEvent: SimulationEvent | undefined = undefined;
  if (Math.random() < 0.45) {
    triggeredEvent = generateDynamicEvent(nextStats);
    applyEventImpact(nextStats, triggeredEvent);
  }

  const turnSummaryText = `Quarterly economic growth reached ${(netQuarterlyGrowthPercent * 4).toFixed(1)}% annualized (${gdpChangeSum >= 0 ? '+' : ''}${Math.round(gdpChangeSum + naturalGdpGain)}B USD). National approval is at ${Math.round(nextStats.politics.approvalRating)}% with stability index at ${Math.round(nextStats.politics.stability)}.`;

  return {
    updatedStats: nextStats,
    enactedPolicies,
    triggeredEvent,
    turnSummaryText,
    gdpGrowthRate: netQuarterlyGrowthPercent * 4
  };
}

function generateDynamicEvent(stats: InitialNationStats): SimulationEvent {
  const eventsList: SimulationEvent[] = [
    {
      id: 'tech-breakthrough',
      title: 'Quantum & Autonomous AI Breakthrough',
      category: 'Technology',
      description: 'National research laboratories make a stunning leap in quantum computing and AI algorithms.',
      impactSummary: '+6% Technology Tier, +180B Foreign Direct Investment, +4% GDP Growth.'
    },
    {
      id: 'labor-strike',
      title: 'National Transport & Labor Union Strike',
      category: 'Domestic',
      description: 'Widespread demonstrations over wage stagnation and inflation disrupt national logistics and ports.',
      impactSummary: '-3% GDP this quarter, -5% Stability, -8% Worker Support.'
    },
    {
      id: 'cyber-attack',
      title: 'State-Sponsored Cyber Warfare Incursion',
      category: 'International',
      description: 'Hostile foreign actors target critical national power grids and defense communication satellites.',
      impactSummary: '-5% Military Readiness, -4% Energy Security, +6% Nationalist Support for retaliation.'
    },
    {
      id: 'extreme-heat',
      title: 'Record Climate Heatwave & Agricultural Drought',
      category: 'Environmental',
      description: 'Unprecedented seasonal temperatures strain national water reservoirs and electrical grid capacity.',
      impactSummary: '+1.2% Inflation from food prices, -6% Energy Security, +8% Climate Risk awareness.'
    },
    {
      id: 'trade-boom',
      title: 'Global Export & Commodity Price Surge',
      category: 'International',
      description: 'Surging international demand for domestic exports and technology products floods treasury with capital.',
      impactSummary: '+350B Foreign Investment, +2% Currency Strength, +5% National Approval.'
    },
    {
      id: 'corruption-scandal',
      title: 'High-Level Ministry Corruption Exposure',
      category: 'Domestic',
      description: 'Investigative journalists uncover a massive embezzlement scandal involving defense procurement contracts.',
      impactSummary: '+12% Corruption Index, -8% Approval Rating, -6% Stability.'
    }
  ];

  const idx = Math.floor(Math.random() * eventsList.length);
  return eventsList[idx];
}

function applyEventImpact(stats: InitialNationStats, event: SimulationEvent) {
  switch (event.id) {
    case 'tech-breakthrough':
      stats.military.technology = clamp(stats.military.technology + 6, 10, 100);
      stats.economy.foreignInvestment += 180;
      stats.economy.gdp += stats.economy.gdp * 0.015;
      break;
    case 'labor-strike':
      stats.economy.gdp -= stats.economy.gdp * 0.01;
      stats.politics.stability = clamp(stats.politics.stability - 5, 0, 100);
      stats.factions.forEach(f => { if (f.name.toLowerCase().includes('work') || f.name.toLowerCase().includes('union')) f.support = clamp(f.support - 8, 0, 100); });
      break;
    case 'cyber-attack':
      stats.military.readiness = clamp(stats.military.readiness - 5, 0, 100);
      stats.environment.energySecurity = clamp(stats.environment.energySecurity - 4, 0, 100);
      stats.factions.forEach(f => { if (f.name.toLowerCase().includes('natio')) f.support = clamp(f.support + 6, 0, 100); });
      break;
    case 'extreme-heat':
      stats.economy.inflation += 1.2;
      stats.environment.energySecurity = clamp(stats.environment.energySecurity - 6, 0, 100);
      stats.environment.climateRisk = clamp(stats.environment.climateRisk + 8, 0, 100);
      break;
    case 'trade-boom':
      stats.economy.foreignInvestment += 350;
      stats.economy.currencyStrength = clamp(stats.economy.currencyStrength + 2, 10, 100);
      stats.politics.approvalRating = clamp(stats.politics.approvalRating + 5, 0, 100);
      break;
    case 'corruption-scandal':
      stats.politics.corruption = clamp(stats.politics.corruption + 12, 0, 100);
      stats.politics.approvalRating = clamp(stats.politics.approvalRating - 8, 0, 100);
      stats.politics.stability = clamp(stats.politics.stability - 6, 0, 100);
      break;
  }
}
