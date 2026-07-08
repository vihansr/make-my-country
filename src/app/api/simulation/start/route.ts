import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { WORLD_COUNTRIES } from '@/lib/data/countries';
import { generateAdvisorReports } from '@/lib/ai/groq';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { countryId, roleName, saveName } = body;

    if (!countryId || !roleName) {
      return NextResponse.json({ error: 'Missing countryId or roleName' }, { status: 400 });
    }

    const country = WORLD_COUNTRIES.find((c) => c.id === countryId);
    if (!country) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    const startYear = 2026;
    const startTurn = 1;

    // Apply role bonus if applicable
    const stats = JSON.parse(JSON.stringify(country.initialStats));
    if (roleName === 'Military Leader') {
      stats.military.readiness = Math.min(100, stats.military.readiness + 15);
    } else if (roleName === 'President') {
      stats.politics.stability = Math.min(100, stats.politics.stability + 10);
    }

    // Generate initial AI Advisor reports
    const advisorReports = await generateAdvisorReports(country.name, stats);

    // Baseline relations
    const baselineRelation = roleName === 'Monarch' ? 20 : 0;
    const diplomacyRelations = WORLD_COUNTRIES
      .filter((c) => c.id !== countryId)
      .map((c) => ({
        targetCountry: c.name,
        relationScore: baselineRelation + (Math.floor(Math.random() * 21) - 10), // random slight variance around baseline
      }));

    // Create save in Prisma inside transaction
    const gameSave = await prisma.gameSave.create({
      data: {
        saveName: saveName || `${country.name} (${roleName})`,
        countryName: country.name,
        leaderRole: roleName,
        currentYear: startYear,
        currentTurn: startTurn,
        nationState: {
          create: {
            gdp: stats.economy.gdp,
            inflation: stats.economy.inflation,
            unemployment: stats.economy.unemployment,
            debt: stats.economy.debt,
            currencyStrength: stats.economy.currencyStrength,
            foreignInvestment: stats.economy.foreignInvestment,

            happiness: stats.society.happiness,
            literacy: stats.society.literacy,
            healthcare: stats.society.healthcare,
            crimeRate: stats.society.crimeRate,
            inequality: stats.society.inequality,

            approvalRating: stats.politics.approvalRating,
            corruption: stats.politics.corruption,
            stability: stats.politics.stability,
            polarization: stats.politics.polarization,

            readiness: stats.military.readiness,
            manpower: stats.military.manpower,
            technology: stats.military.technology,
            nuclearCapability: stats.military.nuclearCapability,

            pollution: stats.environment.pollution,
            energySecurity: stats.environment.energySecurity,
            climateRisk: stats.environment.climateRisk,

            advisorReportsJson: JSON.stringify(advisorReports),
          },
        },
        factions: {
          create: stats.factions.map((f: { name: string; support: number; influence: number }) => ({
            name: f.name,
            support: f.support,
            influence: f.influence,
          })),
        },
        newsItems: {
          create: [
            {
              year: startYear,
              turn: startTurn,
              headline: `${roleName} Assumes Supreme Leadership of ${country.name}`,
              category: 'Domestic',
              summary: `A historic transition of power takes place in ${country.name} as the new administration outlines its ambitious geopolitical agenda for 2026 and beyond.`,
            },
            {
              year: startYear,
              turn: startTurn,
              headline: `Global Financial Markets Respond to ${country.name}'s New Leadership`,
              category: 'International',
              summary: `International investors trade cautiously while foreign ministries assess the diplomatic posture of the incoming ${roleName}.`,
            },
          ],
        },
        timeline: {
          create: [
            {
              year: startYear,
              turn: startTurn,
              title: 'Inauguration & Transition of Power',
              description: `The ${roleName} officially takes office, assuming command of state bureaucracy, armed forces, and economic policy.`,
              impact: 'Baseline National Stability & Executive Authority Established.',
            },
          ],
        },
        diplomacy: {
          create: diplomacyRelations,
        },
      },
      include: {
        nationState: true,
        factions: true,
        newsItems: { orderBy: { createdAt: 'desc' } },
        timeline: { orderBy: { createdAt: 'desc' } },
        diplomacy: true,
      },
    });

    return NextResponse.json({ success: true, gameSave });
  } catch (err: any) {
    console.error('Error starting simulation:', err);
    return NextResponse.json({ error: err.message || 'Failed to start simulation' }, { status: 500 });
  }
}
