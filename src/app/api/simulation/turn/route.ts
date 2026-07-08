import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { evaluateTurn } from '@/lib/simulation/engine';
import { generateTurnNarrative, generateAdvisorReports, evaluateCustomDecision, CustomDecisionResponse } from '@/lib/ai/groq';
import { InitialNationStats } from '@/lib/data/countries';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameSaveId, selectedPolicyIds = [], customDecisionPrompt } = body;

    if (!gameSaveId) {
      return NextResponse.json({ error: 'Missing gameSaveId' }, { status: 400 });
    }

    const gameSave = await prisma.gameSave.findUnique({
      where: { id: gameSaveId },
      include: {
        nationState: true,
        factions: true,
        diplomacy: true,
      },
    });

    if (!gameSave || !gameSave.nationState) {
      return NextResponse.json({ error: 'Save game or nation state not found' }, { status: 404 });
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
      factions: gameSave.factions.map((f) => ({
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
    for (const policy of turnOutcome.enactedPolicies) {
      if (policy.impact.diplomaticRelationsChange) {
        const change = policy.impact.diplomaticRelationsChange;
        for (const rel of gameSave.diplomacy) {
          const newScore = Math.max(-100, Math.min(100, rel.relationScore + change));
          await prisma.diplomacyRelation.update({
            where: { id: rel.id },
            data: { relationScore: newScore },
          });
        }
      }
    }

    // Update NationState & Factions in database
    await prisma.nationState.update({
      where: { id: ns.id },
      data: {
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
      },
    });

    for (const f of updated.factions) {
      const dbFaction = gameSave.factions.find((df) => df.name === f.name);
      if (dbFaction) {
        await prisma.faction.update({
          where: { id: dbFaction.id },
          data: { support: f.support, influence: f.influence },
        });
      }
    }

    // Create News Items
    const newsToCreate = [
      {
        year: nextYear,
        turn: nextTurn,
        headline: narrative.headline,
        category: customOutcome ? 'Executive Order' : 'Domestic',
        summary: narrative.summary,
      },
      {
        year: nextYear,
        turn: nextTurn,
        headline: `Global Reaction: ${gameSave.countryName} Q${nextTurn} Posture`,
        category: 'International',
        summary: narrative.internationalReaction,
      },
    ];

    if (turnOutcome.triggeredEvent) {
      newsToCreate.push({
        year: nextYear,
        turn: nextTurn,
        headline: `CRISIS ALERT: ${turnOutcome.triggeredEvent.title}`,
        category: turnOutcome.triggeredEvent.category,
        summary: `${turnOutcome.triggeredEvent.description} Impact: ${turnOutcome.triggeredEvent.impactSummary}`,
      });
    }

    await prisma.newsItem.createMany({
      data: newsToCreate.map((item) => ({ ...item, gameSaveId: gameSave.id })),
    });

    // Create Timeline Event if custom decision, major policies passed, or event occurred
    if (customOutcome || turnOutcome.enactedPolicies.length > 0 || turnOutcome.triggeredEvent) {
      const title = customOutcome
        ? `Year ${nextYear} Q${nextTurn}: ${customOutcome.policyTitle}`
        : turnOutcome.triggeredEvent
        ? `Year ${nextYear} Q${nextTurn}: ${turnOutcome.triggeredEvent.title}`
        : `Year ${nextYear} Q${nextTurn}: Legislative & Policy Reforms`;
      
      const desc = customOutcome
        ? `Executive Decree: "${customDecisionPrompt}". ${customOutcome.summary}`
        : turnOutcome.enactedPolicies.map((p) => p.name).join('; ') || turnOutcome.triggeredEvent?.description || 'Routine state governance.';
      
      const impactText = customOutcome
        ? `Immediate: ${customOutcome.immediateConsequences.join(' ')} | Long-Term: ${customOutcome.longTermRisks.join(' ')}`
        : turnOutcome.turnSummaryText;

      await prisma.timelineEvent.create({
        data: {
          gameSaveId: gameSave.id,
          year: nextYear,
          turn: nextTurn,
          title,
          description: desc,
          impact: impactText,
        },
      });
    }

    // Update GameSave currentTurn & currentYear
    const updatedSave = await prisma.gameSave.update({
      where: { id: gameSaveId },
      data: { currentYear: nextYear, currentTurn: nextTurn },
      include: {
        nationState: true,
        factions: true,
        newsItems: { orderBy: { createdAt: 'desc' } },
        timeline: { orderBy: { createdAt: 'desc' } },
        diplomacy: true,
      },
    });

    return NextResponse.json({ success: true, gameSave: updatedSave, turnOutcome, narrative, customOutcome });
  } catch (err: any) {
    console.error('Error processing turn:', err);
    return NextResponse.json({ error: err.message || 'Failed to process turn' }, { status: 500 });
  }
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
