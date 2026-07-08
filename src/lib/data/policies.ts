export type PolicyCategory = 'Economic' | 'Military' | 'Social' | 'Diplomatic' | 'Environmental';

export interface PolicyImpact {
  economy?: { gdp?: number; inflation?: number; unemployment?: number; debt?: number; currencyStrength?: number; foreignInvestment?: number };
  society?: { happiness?: number; literacy?: number; healthcare?: number; crimeRate?: number; inequality?: number };
  politics?: { approvalRating?: number; corruption?: number; stability?: number; polarization?: number };
  military?: { readiness?: number; manpower?: number; technology?: number; nuclearCapability?: number };
  environment?: { pollution?: number; energySecurity?: number; climateRisk?: number };
  factionModifiers?: { factionNameSubstring: string; supportChange: number; influenceChange?: number }[];
  diplomaticRelationsChange?: number;
}

export interface PolicyOption {
  id: string;
  name: string;
  category: PolicyCategory;
  description: string;
  cost: number; // in Billions USD per quarter
  immediateConsequences: string[];
  longTermRisks: string[];
  impact: PolicyImpact;
}

export const POLICIES_CATALOG: PolicyOption[] = [
  // Economic Policies
  {
    id: 'raise-taxes',
    name: 'Raise National Corporate & Income Taxes',
    category: 'Economic',
    description: 'Enact comprehensive tax reform to increase state revenues and reduce national deficit.',
    cost: -150, // negative cost means revenue generated
    immediateConsequences: ['+150B State Treasury Revenue', '-4% National Approval', '-6 Business Elite Support'],
    longTermRisks: ['Potential capital flight and slight reduction in foreign direct investment.'],
    impact: {
      economy: { debt: -5, foreignInvestment: -200, inflation: -0.4 },
      society: { happiness: -3, inequality: -4 },
      politics: { approvalRating: -4, stability: -2 },
      factionModifiers: [
        { factionNameSubstring: 'Business', supportChange: -10 },
        { factionNameSubstring: 'Corporate', supportChange: -10 },
        { factionNameSubstring: 'Work', supportChange: 4 },
        { factionNameSubstring: 'Public', supportChange: 5 }
      ]
    }
  },
  {
    id: 'lower-taxes',
    name: 'Tax Cut & Deregulation Stimulus',
    category: 'Economic',
    description: 'Slash tax rates across corporate and personal brackets to spur economic dynamism and consumer spending.',
    cost: 180, // costs treasury in lost revenue
    immediateConsequences: ['+8% Business & Corporate Support', '+3% GDP Growth rate boost', '+4% Approval'],
    longTermRisks: ['Increases national debt and may constrain future social welfare spending.'],
    impact: {
      economy: { gdp: 120, debt: 6, unemployment: -0.6, foreignInvestment: 350 },
      society: { happiness: 4, inequality: 5 },
      politics: { approvalRating: 4 },
      factionModifiers: [
        { factionNameSubstring: 'Business', supportChange: 12 },
        { factionNameSubstring: 'Corporate', supportChange: 12 },
        { factionNameSubstring: 'Work', supportChange: -4 }
      ]
    }
  },
  {
    id: 'invest-infrastructure',
    name: 'National Megaproject Infrastructure Act',
    category: 'Economic',
    description: 'Launch a multi-year investment in high-speed rail, ports, 5G networks, and smart grids.',
    cost: 120,
    immediateConsequences: ['-1.2% Unemployment', '+8% Industrial & Worker Support', '+5% Long-term GDP capacity'],
    longTermRisks: ['Short-term budget strain and inflation pressure from construction materials.'],
    impact: {
      economy: { gdp: 180, unemployment: -1.2, foreignInvestment: 300, inflation: 0.3 },
      society: { happiness: 5, crimeRate: -2 },
      politics: { approvalRating: 6, stability: 4 },
      factionModifiers: [
        { factionNameSubstring: 'Work', supportChange: 10 },
        { factionNameSubstring: 'Industrial', supportChange: 10 },
        { factionNameSubstring: 'Tech', supportChange: 8 }
      ]
    }
  },
  {
    id: 'subsidize-tech',
    name: 'Semiconductor & AI Industrial Subsidies',
    category: 'Economic',
    description: 'Provide massive state grants and tax incentives to domestic high-tech and AI manufacturing firms.',
    cost: 90,
    immediateConsequences: ['+6% Technology Tier', '+400B Foreign & Tech Investment'],
    longTermRisks: ['Trade tension with rival tech superpowers.'],
    impact: {
      economy: { gdp: 150, foreignInvestment: 400, currencyStrength: 3 },
      military: { technology: 5 },
      politics: { approvalRating: 3 },
      factionModifiers: [
        { factionNameSubstring: 'Tech', supportChange: 14 },
        { factionNameSubstring: 'Business', supportChange: 8 }
      ]
    }
  },

  // Military Policies
  {
    id: 'increase-defense',
    name: 'Modernize & Expand Defense Budget',
    category: 'Military',
    description: 'Increase defense allocations for next-gen avionics, autonomous drone swarms, and naval readiness.',
    cost: 140,
    immediateConsequences: ['+12% Military Readiness', '+4% Tech Tier', '+10% Military Faction Support'],
    longTermRisks: ['Triggers regional arms race concerns and reduces social spending leeway.'],
    impact: {
      military: { readiness: 12, technology: 4, manpower: 30 },
      economy: { debt: 4, inflation: 0.2 },
      politics: { approvalRating: 2, stability: 3 },
      factionModifiers: [
        { factionNameSubstring: 'Military', supportChange: 15 },
        { factionNameSubstring: 'Defense', supportChange: 15 },
        { factionNameSubstring: 'Youth', supportChange: -5 }
      ]
    }
  },
  {
    id: 'build-bases',
    name: 'Strategic Overseas Defense Installations',
    category: 'Military',
    description: 'Establish new naval and air force logistics bases in key international transit corridors.',
    cost: 110,
    immediateConsequences: ['+15 Global Geopolitical Influence', '+8% Readiness'],
    longTermRisks: ['Diplomatic friction with rival superpowers (-10 Global Relations baseline).'],
    impact: {
      military: { readiness: 8, manpower: 15 },
      politics: { approvalRating: 3 },
      diplomaticRelationsChange: -5,
      factionModifiers: [
        { factionNameSubstring: 'Military', supportChange: 10 },
        { factionNameSubstring: 'Nationalist', supportChange: 8 }
      ]
    }
  },
  {
    id: 'nuclear-program',
    name: 'Advanced Nuclear Deterrence & Hypersonic Program',
    category: 'Military',
    description: 'Initiate or accelerate strategic nuclear warhead modernization and hypersonic delivery systems.',
    cost: 250,
    immediateConsequences: ['+25 Nuclear Capability Score', 'Severe international diplomatic pushback'],
    longTermRisks: ['High risk of economic sanctions and global condemnation.'],
    impact: {
      military: { nuclearCapability: 25, readiness: 15, technology: 8 },
      economy: { foreignInvestment: -500, currencyStrength: -5 },
      politics: { stability: 5, polarization: 8 },
      diplomaticRelationsChange: -20,
      factionModifiers: [
        { factionNameSubstring: 'Military', supportChange: 20 },
        { factionNameSubstring: 'Nationalist', supportChange: 15 },
        { factionNameSubstring: 'Green', supportChange: -25 },
        { factionNameSubstring: 'Youth', supportChange: -15 }
      ]
    }
  },

  // Social Policies
  {
    id: 'expand-healthcare',
    name: 'Universal Healthcare Expansion & AI Diagnostics',
    category: 'Social',
    description: 'Deploy nationwide medical infrastructure, subsidized pharmaceuticals, and advanced AI preventive care.',
    cost: 160,
    immediateConsequences: ['+8% Healthcare Quality', '+6% National Happiness', '+10% Worker & Public Support'],
    longTermRisks: ['Substantial ongoing treasury commitment.'],
    impact: {
      society: { healthcare: 8, happiness: 6, inequality: -6 },
      economy: { unemployment: -0.4 },
      politics: { approvalRating: 7, stability: 5 },
      factionModifiers: [
        { factionNameSubstring: 'Work', supportChange: 12 },
        { factionNameSubstring: 'Public', supportChange: 12 },
        { factionNameSubstring: 'NHS', supportChange: 15 },
        { factionNameSubstring: 'Senior', supportChange: 15 }
      ]
    }
  },
  {
    id: 'education-reform',
    name: 'STEM & STEM-AI Higher Education Revolution',
    category: 'Social',
    description: 'Overhaul university curricula, provide tuition-free technical degrees, and fund research labs.',
    cost: 100,
    immediateConsequences: ['+5% Literacy & Skill Tier', '+4% Tech Tier over 2 years'],
    longTermRisks: ['Results take several quarters to fully manifest in GDP.'],
    impact: {
      society: { literacy: 5, happiness: 4, inequality: -3 },
      economy: { gdp: 80 },
      military: { technology: 4 },
      politics: { approvalRating: 5 },
      factionModifiers: [
        { factionNameSubstring: 'Youth', supportChange: 14 },
        { factionNameSubstring: 'Tech', supportChange: 10 },
        { factionNameSubstring: 'Student', supportChange: 15 }
      ]
    }
  },
  {
    id: 'welfare-expansion',
    name: 'Guaranteed Basic Income & Housing Safety Net',
    category: 'Social',
    description: 'Implement targeted income supplements and affordable housing construction for low-income citizens.',
    cost: 190,
    immediateConsequences: ['-10% Inequality', '+8% Happiness', '-15% Crime Rate'],
    longTermRisks: ['High fiscal burden; may require tax increases if growth slows.'],
    impact: {
      society: { inequality: -10, happiness: 8, crimeRate: -15 },
      economy: { debt: 7, inflation: 0.5 },
      politics: { approvalRating: 8, polarization: -6 },
      factionModifiers: [
        { factionNameSubstring: 'Work', supportChange: 15 },
        { factionNameSubstring: 'Poor', supportChange: 18 },
        { factionNameSubstring: 'Business', supportChange: -12 }
      ]
    }
  },

  // Diplomatic Policies
  {
    id: 'form-alliance',
    name: 'Global Security & Economic Defense Treaty',
    category: 'Diplomatic',
    description: 'Spearhead a landmark multilateral mutual defense and intelligence-sharing pact.',
    cost: 50,
    immediateConsequences: ['+20 Diplomatic Relations with allied nations', '+10 Military Readiness coordination'],
    longTermRisks: ['Entangles nation in regional border disputes of allies.'],
    impact: {
      military: { readiness: 6 },
      economy: { foreignInvestment: 250 },
      politics: { approvalRating: 4, stability: 5 },
      diplomaticRelationsChange: 15,
      factionModifiers: [
        { factionNameSubstring: 'Defense', supportChange: 10 },
        { factionNameSubstring: 'Business', supportChange: 8 }
      ]
    }
  },
  {
    id: 'trade-agreement',
    name: 'Comprehensive Free Trade & Tariff Elimination Pact',
    category: 'Diplomatic',
    description: 'Open reciprocal markets, eliminate tariff barriers, and harmonize customs for seamless trade.',
    cost: 30,
    immediateConsequences: ['+350B Foreign Investment', '+10 Diplomatic Relations', '+2% GDP'],
    longTermRisks: ['Domestic agricultural or traditional manufacturing sectors may face stiff import competition.'],
    impact: {
      economy: { gdp: 140, foreignInvestment: 350, currencyStrength: 4 },
      society: { happiness: 3 },
      diplomaticRelationsChange: 12,
      factionModifiers: [
        { factionNameSubstring: 'Business', supportChange: 12 },
        { factionNameSubstring: 'Corporate', supportChange: 12 },
        { factionNameSubstring: 'Farmer', supportChange: -8 },
        { factionNameSubstring: 'Union', supportChange: -6 }
      ]
    }
  },
  {
    id: 'apply-sanctions',
    name: 'Targeted Financial Sanctions & Embargoes',
    category: 'Diplomatic',
    description: 'Freeze central bank assets and ban high-tech exports against geopolitical adversaries.',
    cost: 40,
    immediateConsequences: ['-25 Relations with targeted blocs', '+8% Domestic Nationalist Support'],
    longTermRisks: ['Retaliatory tariffs and supply chain disruption.'],
    impact: {
      economy: { inflation: 0.6, foreignInvestment: -150 },
      politics: { approvalRating: 3, polarization: 4 },
      diplomaticRelationsChange: -20,
      factionModifiers: [
        { factionNameSubstring: 'Nationalist', supportChange: 12 },
        { factionNameSubstring: 'Business', supportChange: -6 }
      ]
    }
  },
  {
    id: 'mediate-conflicts',
    name: 'International Peace Summit & Diplomatic Mediation',
    category: 'Diplomatic',
    description: 'Host global peace talks and offer reconstruction funding to resolve active regional armed conflicts.',
    cost: 60,
    immediateConsequences: ['+25 Diplomatic Influence & World Prestige', '+6% Approval'],
    longTermRisks: ['Reputational damage if brokered ceasefire collapses.'],
    impact: {
      politics: { approvalRating: 6, stability: 4 },
      diplomaticRelationsChange: 18,
      factionModifiers: [
        { factionNameSubstring: 'Youth', supportChange: 10 },
        { factionNameSubstring: 'Green', supportChange: 8 }
      ]
    }
  },

  // Environmental Policies
  {
    id: 'renewable-energy',
    name: 'National Clean Energy & Green Grid Transition',
    category: 'Environmental',
    description: 'Subsidize solar, wind, modular nuclear reactors, and battery storage to achieve energy independence.',
    cost: 130,
    immediateConsequences: ['+15% Energy Security', '-12% Pollution', '+12% Environmental Faction Support'],
    longTermRisks: ['Initial capital outlay and pushback from fossil fuel lobbies.'],
    impact: {
      environment: { energySecurity: 15, pollution: -12, climateRisk: -10 },
      economy: { gdp: 90, foreignInvestment: 220 },
      society: { healthcare: 4, happiness: 5 },
      politics: { approvalRating: 5 },
      factionModifiers: [
        { factionNameSubstring: 'Green', supportChange: 18 },
        { factionNameSubstring: 'Climate', supportChange: 18 },
        { factionNameSubstring: 'Energy Oligarch', supportChange: -15 },
        { factionNameSubstring: 'Mining', supportChange: -10 }
      ]
    }
  },
  {
    id: 'carbon-tax',
    name: 'Industrial Carbon Emissions Cap & Tax',
    category: 'Environmental',
    description: 'Levy a strict fee per ton of industrial CO2 emissions, rebating dividends directly to citizens.',
    cost: -80, // generates tax revenue
    immediateConsequences: ['+80B Treasury Revenue', '-15% Climate Risk', '-10% Corporate Heavy Industry Support'],
    longTermRisks: ['Energy cost inflation for energy-intensive manufacturing.'],
    impact: {
      environment: { pollution: -15, climateRisk: -12 },
      economy: { inflation: 0.4 },
      society: { happiness: 2 },
      politics: { approvalRating: 2 },
      factionModifiers: [
        { factionNameSubstring: 'Green', supportChange: 15 },
        { factionNameSubstring: 'Industrial', supportChange: -12 },
        { factionNameSubstring: 'Business', supportChange: -8 }
      ]
    }
  },
  {
    id: 'conservation-programs',
    name: 'National Biodiversity & Forest Reforestation Act',
    category: 'Environmental',
    description: 'Protect 30% of national land and territorial waters, restoring ecosystems and national parks.',
    cost: 70,
    immediateConsequences: ['-8% Pollution', '+6% Happiness & Eco-tourism'],
    longTermRisks: ['Limits land availability for agricultural expansion or mining.'],
    impact: {
      environment: { pollution: -8, climateRisk: -6 },
      society: { happiness: 6, healthcare: 2 },
      politics: { approvalRating: 4 },
      factionModifiers: [
        { factionNameSubstring: 'Green', supportChange: 14 },
        { factionNameSubstring: 'Farmer', supportChange: -6 },
        { factionNameSubstring: 'Agribus', supportChange: -8 }
      ]
    }
  }
];
