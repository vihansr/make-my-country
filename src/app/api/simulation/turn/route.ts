import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { evaluateTurn } from '@/lib/simulation/engine';
import { generateTurnNarrative, generateAdvisorReports, evaluateCustomDecision, CustomDecisionResponse } from '@/lib/ai/groq';
import { InitialNationStats } from '@/lib/data/countries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameSave, selectedPolicyIds = [], customDecisionPrompt } = body;

    if (!gameSave) {
      return NextResponse.json({ error: 'Missing gameSave' }, { status: 400 });
    }

    if (!gameSave.nationState) {
      return NextResponse.json({ error: 'Nation state not found in gameSave' }, { status: 400 });
    }

    const ns = gameSave.nationState;
    const currentStats: InitialNationStats = {
      economy: {
        gdp: ns.gdp,
        inflation: ns.inflation,
        unemployment: ns.unemployment,
        debt: ns.debt,
        currencyStrength: ns.currencyStrength,
        foreignInvestment: ns.foreignInvestment,
      },
      society: {
        happiness: ns.happiness,
        literacy: ns.literacy,
        healthcare: ns.healthcare,
        crimeRate: ns.crimeRate,
        inequality: ns.inequality,
      },
      politics: {
        approvalRating: ns.approvalRating,
        corruption: ns.corruption,
        stability: ns.stability,
        polarization: ns.polarization,
      },
      military: {
        readiness: ns.readiness,
        manpower: ns.manpower,
        technology: ns.technology,
        nuclearCapability: ns.nuclearCapability,
      },
      environment: {
        pollution: ns.pollution,
        energySecurity: ns.energySecurity,
        climateRisk: ns.climateRisk,
      },
      factions: gameSave.factions.map((f: any) => ({
        name: f.name,
        support: f.support,
        influence: f.influence,
      })),
    };

    // Advance quarter / year
    let nextTurn = gameSave.currentTurn + 1;
    let nextYear = gameSave.currentYear;
    if (nextTurn > 4) {
      nextTurn = 1;
      nextYear += 1;
    }

    // Evaluate mathematical simulation and policy impacts
    const turnOutcome = evaluateTurn(currentStats, selectedPolicyIds);
    let updated = turnOutcome.updatedStats;
    let customOutcome: CustomDecisionResponse | null = null;

    // If user provided a custom free-form executive prompt, evaluate it with Groq AI!
    if (customDecisionPrompt && typeof customDecisionPrompt === 'string' && customDecisionPrompt.trim().length > 0) {
      customOutcome = await evaluateCustomDecision(
        gameSave.countryName,
        gameSave.leaderRole,
        nextYear,
        nextTurn,
        updated,
        customDecisionPrompt.trim()
      );

      // Apply AI-calculated deltas to stats
      const d = customOutcome.statDeltas;
      updated.economy.gdp = Math.max(1, updated.economy.gdp + d.gdpDelta);
      updated.economy.inflation = Math.max(0, updated.economy.inflation + d.inflationDelta);
      updated.economy.debt = Math.max(0, updated.economy.debt + d.debtDelta);
      
      updated.politics.approvalRating = clamp(updated.politics.approvalRating + d.approvalDelta, 0, 100);
      updated.politics.stability = clamp(updated.politics.stability + d.stabilityDelta, 0, 100);
      
      updated.military.readiness = clamp(updated.military.readiness + d.readinessDelta, 0, 100);
      updated.military.technology = clamp(updated.military.technology + d.technologyDelta, 0, 100);
      
      updated.environment.pollution = clamp(updated.environment.pollution + d.pollutionDelta, 0, 100);
      updated.environment.energySecurity = clamp(updated.environment.energySecurity + d.energySecurityDelta, 0, 100);
      
      updated.society.happiness = clamp(updated.society.happiness + d.happinessDelta, 0, 100);
      updated.society.inequality = clamp(updated.society.inequality + d.inequalityDelta, 0, 100);

      // Apply faction deltas
      for (const fd of customOutcome.factionDeltas) {
        const fac = updated.factions.find(f => f.name.toLowerCase().includes(fd.name.toLowerCase()) || fd.name.toLowerCase().includes(f.name.toLowerCase()));
        if (fac) {
          fac.support = clamp(fac.support + fd.supportDelta, 0, 100);
          fac.influence = clamp(fac.influence + fd.influenceDelta, 0, 100);
        }
      }
    }

    // AI Narrative Generation (use custom outcome narrative if available)
    let narrative;
    if (customOutcome) {
      narrative = {
        headline: customOutcome.headline,
        summary: customOutcome.summary,
        internationalReaction: customOutcome.internationalReaction,
        publicOpinion: customOutcome.publicOpinion,
      };
    } else {
      narrative = await generateTurnNarrative(
        gameSave.countryName,
        gameSave.leaderRole,
        nextYear,
        nextTurn,
        updated,
        turnOutcome.enactedPolicies,
        turnOutcome.triggeredEvent
      );
    }

    // AI Advisor Reports Generation
    const advisorReports = await generateAdvisorReports(gameSave.countryName, updated);

    // Update Diplomacy Relations if any policy modified diplomacy
    // Update Diplomacy Relations
    const updatedDiplomacy = gameSave.diplomacy.map((rel: any) => {
      let score = rel.relationScore;
      for (const policy of turnOutcome.enactedPolicies) {
        if (policy.impact.diplomaticRelationsChange) {
          score = Math.max(-100, Math.min(100, score + policy.impact.diplomaticRelationsChange));
        }
      }
      return { ...rel, relationScore: score };
    });

    // Update NationState in-memory
    const updatedNationState = {
      ...ns,
      gdp: updated.economy.gdp,
      inflation: updated.economy.inflation,
      unemployment: updated.economy.unemployment,
      debt: updated.economy.debt,
      currencyStrength: updated.economy.currencyStrength,
      foreignInvestment: updated.economy.foreignInvestment,

      happiness: updated.society.happiness,
      literacy: updated.society.literacy,
      healthcare: updated.society.healthcare,
      crimeRate: updated.society.crimeRate,
      inequality: updated.society.inequality,

      approvalRating: updated.politics.approvalRating,
      corruption: updated.politics.corruption,
      stability: updated.politics.stability,
      polarization: updated.politics.polarization,

      readiness: updated.military.readiness,
      manpower: updated.military.manpower,
      technology: updated.military.technology,
      nuclearCapability: updated.military.nuclearCapability,

      pollution: updated.environment.pollution,
      energySecurity: updated.environment.energySecurity,
      climateRisk: updated.environment.climateRisk,

      advisorReportsJson: JSON.stringify(advisorReports),
    };

    // Update Factions in-memory
    const updatedFactions = gameSave.factions.map((df: any) => {
      const f = updated.factions.find((uf: any) => uf.name === df.name);
      if (f) {
        return { ...df, support: f.support, influence: f.influence };
      }
      return df;
    });

    // Create News Items
    const newsToCreate = [
      {
        id: randomUUID(),
        gameSaveId: gameSave.id,
        year: nextYear,
        turn: nextTurn,
        headline: narrative.headline,
        category: customOutcome ? 'Executive Order' : 'Domestic',
        summary: narrative.summary,
        createdAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        gameSaveId: gameSave.id,
        year: nextYear,
        turn: nextTurn,
        headline: `Global Reaction: ${gameSave.countryName} Q${nextTurn} Posture`,
        category: 'International',
        summary: narrative.internationalReaction,
        createdAt: new Date().toISOString(),
      },
    ];

    if (turnOutcome.triggeredEvent) {
      newsToCreate.push({
        id: randomUUID(),
        gameSaveId: gameSave.id,
        year: nextYear,
        turn: nextTurn,
        headline: `CRISIS ALERT: ${turnOutcome.triggeredEvent.title}`,
        category: turnOutcome.triggeredEvent.category,
        summary: `${turnOutcome.triggeredEvent.description} Impact: ${turnOutcome.triggeredEvent.impactSummary}`,
        createdAt: new Date().toISOString(),
      });
    }

    const updatedNewsItems = [...newsToCreate, ...(gameSave.newsItems || [])];

    // Create Timeline Event if custom decision, major policies passed, or event occurred
    let updatedTimeline = gameSave.timeline || [];
    if (customOutcome || turnOutcome.enactedPolicies.length > 0 || turnOutcome.triggeredEvent) {
      const title = customOutcome
        ? `Year ${nextYear} Q${nextTurn}: ${customOutcome.policyTitle}`
        : turnOutcome.triggeredEvent
        ? `Year ${nextYear} Q${nextTurn}: ${turnOutcome.triggeredEvent.title}`
        : `Year ${nextYear} Q${nextTurn}: Legislative & Policy Reforms`;
      
      const desc = customOutcome
        ? `Executive Decree: "${customDecisionPrompt}". ${customOutcome.summary}`
        : turnOutcome.enactedPolicies.map((p: any) => p.name).join('; ') || turnOutcome.triggeredEvent?.description || 'Routine state governance.';
      
      const impactText = customOutcome
        ? `Immediate: ${customOutcome.immediateConsequences.join(' ')} | Long-Term: ${customOutcome.longTermRisks.join(' ')}`
        : turnOutcome.turnSummaryText;

      updatedTimeline = [
        {
          id: randomUUID(),
          gameSaveId: gameSave.id,
          year: nextYear,
          turn: nextTurn,
          title,
          description: desc,
          impact: impactText,
          createdAt: new Date().toISOString(),
        },
        ...updatedTimeline,
      ];
    }

    // Assemble full updated save game state
    const updatedSave = {
      ...gameSave,
      currentYear: nextYear,
      currentTurn: nextTurn,
      updatedAt: new Date().toISOString(),
      nationState: updatedNationState,
      factions: updatedFactions,
      newsItems: updatedNewsItems,
      timeline: updatedTimeline,
      diplomacy: updatedDiplomacy,
    };

    return NextResponse.json({ success: true, gameSave: updatedSave, turnOutcome, narrative, customOutcome });
  } catch (err: any) {
    console.error('Error processing turn:', err);
    return NextResponse.json({ error: err.message || 'Failed to process turn' }, { status: 500 });
  }
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
