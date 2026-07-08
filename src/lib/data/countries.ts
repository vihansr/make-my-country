export interface FactionData {
  name: string;
  support: number; // 0 - 100
  influence: number; // 0 - 100
}

export interface InitialNationStats {
  economy: {
    gdp: number; // in Billions USD
    inflation: number; // percentage e.g. 3.2%
    unemployment: number; // percentage e.g. 4.5%
    debt: number; // percentage of GDP e.g. 85%
    currencyStrength: number; // 0 - 100 scale (50 is baseline neutral)
    foreignInvestment: number; // in Billions USD
  };
  society: {
    happiness: number; // 0 - 100
    literacy: number; // 0 - 100 percentage
    healthcare: number; // 0 - 100 quality score
    crimeRate: number; // 0 - 100 scale (lower is better)
    inequality: number; // 0 - 100 scale (Gini index equivalent)
  };
  politics: {
    approvalRating: number; // 0 - 100 percentage
    corruption: number; // 0 - 100 scale (lower is better)
    stability: number; // 0 - 100 scale
    polarization: number; // 0 - 100 scale (lower is better)
  };
  military: {
    readiness: number; // 0 - 100
    manpower: number; // in thousands of active personnel
    technology: number; // 0 - 100 tech tier
    nuclearCapability: number; // 0 = none, 100 = superpower arsenal
  };
  environment: {
    pollution: number; // 0 - 100 scale
    energySecurity: number; // 0 - 100 scale
    climateRisk: number; // 0 - 100 vulnerability
  };
  factions: FactionData[];
}

export interface CountryInfo {
  id: string;
  name: string;
  flag: string;
  region: string;
  population: number; // in Millions
  gdp: number; // in Billions USD
  governmentType: 'Presidential Republic' | 'Parliamentary Democracy' | 'Constitutional Monarchy' | 'Authoritarian State' | 'Federal Republic' | 'Military Junta';
  description: string;
  initialStats: InitialNationStats;
}

export const WORLD_COUNTRIES: CountryInfo[] = [
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    region: 'North America',
    population: 340.0,
    gdp: 28780,
    governmentType: 'Presidential Republic',
    description: 'The world\'s leading economic and military superpower, facing domestic political polarization and geopolitical rivalry.',
    initialStats: {
      economy: { gdp: 28780, inflation: 3.1, unemployment: 3.9, debt: 122, currencyStrength: 85, foreignInvestment: 5200 },
      society: { happiness: 72, literacy: 99, healthcare: 75, crimeRate: 48, inequality: 65 },
      politics: { approvalRating: 46, corruption: 28, stability: 74, polarization: 88 },
      military: { readiness: 95, manpower: 1330, technology: 98, nuclearCapability: 100 },
      environment: { pollution: 55, energySecurity: 88, climateRisk: 45 },
      factions: [
        { name: 'Business Elite', support: 75, influence: 90 },
        { name: 'Military Industrial', support: 85, influence: 85 },
        { name: 'Working Class', support: 45, influence: 60 },
        { name: 'Youth & Progressives', support: 40, influence: 55 },
        { name: 'Religious Conservatives', support: 60, influence: 70 },
      ]
    }
  },
  {
    id: 'chn',
    name: 'China',
    flag: '🇨🇳',
    region: 'Asia',
    population: 1409.0,
    gdp: 18530,
    governmentType: 'Authoritarian State',
    description: 'An industrial colossus and high-tech powerhouse expanding global diplomatic and military influence through strategic initiatives.',
    initialStats: {
      economy: { gdp: 18530, inflation: 0.3, unemployment: 5.2, debt: 83, currencyStrength: 72, foreignInvestment: 3800 },
      society: { happiness: 68, literacy: 97, healthcare: 80, crimeRate: 22, inequality: 55 },
      politics: { approvalRating: 82, corruption: 45, stability: 90, polarization: 25 },
      military: { readiness: 90, manpower: 2035, technology: 92, nuclearCapability: 75 },
      environment: { pollution: 78, energySecurity: 70, climateRisk: 60 },
      factions: [
        { name: 'State Technocrats', support: 88, influence: 95 },
        { name: 'Military PLA', support: 90, influence: 85 },
        { name: 'Urban Middle Class', support: 70, influence: 65 },
        { name: 'Industrial Workers', support: 75, influence: 50 },
      ]
    }
  },
  {
    id: 'gbr',
    name: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    population: 68.3,
    gdp: 3500,
    governmentType: 'Constitutional Monarchy',
    description: 'A historic financial hub and NATO pillar navigating post-Brexit economic restructuring and public service pressures.',
    initialStats: {
      economy: { gdp: 3500, inflation: 2.8, unemployment: 4.3, debt: 101, currencyStrength: 78, foreignInvestment: 2100 },
      society: { happiness: 70, literacy: 99, healthcare: 72, crimeRate: 42, inequality: 52 },
      politics: { approvalRating: 42, corruption: 22, stability: 82, polarization: 65 },
      military: { readiness: 82, manpower: 148, technology: 88, nuclearCapability: 65 },
      environment: { pollution: 35, energySecurity: 68, climateRisk: 40 },
      factions: [
        { name: 'Financial Sector', support: 65, influence: 88 },
        { name: 'NHS & Public Sector', support: 40, influence: 75 },
        { name: 'Traditionalists', support: 55, influence: 65 },
        { name: 'Youth & Environmentalists', support: 48, influence: 60 },
      ]
    }
  },
  {
    id: 'ind',
    name: 'India',
    flag: '🇮🇳',
    region: 'Asia',
    population: 1438.0,
    gdp: 3940,
    governmentType: 'Federal Republic',
    description: 'The world\'s most populous democracy and fastest-growing major economy, balancing rapid modernization with infrastructure demands.',
    initialStats: {
      economy: { gdp: 3940, inflation: 4.8, unemployment: 7.1, debt: 82, currencyStrength: 58, foreignInvestment: 1200 },
      society: { happiness: 65, literacy: 78, healthcare: 62, crimeRate: 50, inequality: 70 },
      politics: { approvalRating: 68, corruption: 52, stability: 78, polarization: 72 },
      military: { readiness: 84, manpower: 1460, technology: 78, nuclearCapability: 60 },
      environment: { pollution: 85, energySecurity: 64, climateRisk: 75 },
      factions: [
        { name: 'Tech & Business Conglomerates', support: 80, influence: 88 },
        { name: 'Agricultural Farmers', support: 55, influence: 82 },
        { name: 'Nationalist Movement', support: 78, influence: 85 },
        { name: 'Youth & Students', support: 60, influence: 65 },
      ]
    }
  },
  {
    id: 'deu',
    name: 'Germany',
    flag: '🇩🇪',
    region: 'Europe',
    population: 84.4,
    gdp: 4590,
    governmentType: 'Federal Republic',
    description: 'The industrial heart and economic engine of Europe, transitioning toward renewable energy while addressing manufacturing competitiveness.',
    initialStats: {
      economy: { gdp: 4590, inflation: 2.4, unemployment: 5.6, debt: 64, currencyStrength: 82, foreignInvestment: 2400 },
      society: { happiness: 76, literacy: 99, healthcare: 90, crimeRate: 30, inequality: 42 },
      politics: { approvalRating: 38, corruption: 18, stability: 85, polarization: 60 },
      military: { readiness: 72, manpower: 182, technology: 86, nuclearCapability: 0 },
      environment: { pollution: 38, energySecurity: 72, climateRisk: 35 },
      factions: [
        { name: 'Industrial Manufacturers', support: 50, influence: 90 },
        { name: 'Green Coalition', support: 62, influence: 80 },
        { name: 'Labor Unions', support: 58, influence: 85 },
        { name: 'Fiscal Conservatives', support: 45, influence: 70 },
      ]
    }
  },
  {
    id: 'jpn',
    name: 'Japan',
    flag: '🇯🇵',
    region: 'Asia',
    population: 124.5,
    gdp: 4110,
    governmentType: 'Parliamentary Democracy',
    description: 'An advanced technological society with unmatched civic stability, tackling demographic aging and regional defense posture.',
    initialStats: {
      economy: { gdp: 4110, inflation: 2.6, unemployment: 2.6, debt: 260, currencyStrength: 65, foreignInvestment: 1800 },
      society: { happiness: 74, literacy: 99, healthcare: 94, crimeRate: 15, inequality: 45 },
      politics: { approvalRating: 35, corruption: 24, stability: 92, polarization: 35 },
      military: { readiness: 80, manpower: 247, technology: 92, nuclearCapability: 0 },
      environment: { pollution: 32, energySecurity: 45, climateRisk: 55 },
      factions: [
        { name: 'Corporate Keiretsu', support: 65, influence: 90 },
        { name: 'Senior Population', support: 70, influence: 85 },
        { name: 'Defense Reformers', support: 55, influence: 70 },
        { name: 'Urban Tech Workforce', support: 48, influence: 60 },
      ]
    }
  },
  {
    id: 'fra',
    name: 'France',
    flag: '🇫🇷',
    region: 'Europe',
    population: 68.1,
    gdp: 3130,
    governmentType: 'Presidential Republic',
    description: 'A sovereign European power with independent nuclear deterrence and a vocal public tradition of social activism and protest.',
    initialStats: {
      economy: { gdp: 3130, inflation: 2.5, unemployment: 7.4, debt: 111, currencyStrength: 82, foreignInvestment: 1900 },
      society: { happiness: 71, literacy: 99, healthcare: 88, crimeRate: 46, inequality: 48 },
      politics: { approvalRating: 32, corruption: 26, stability: 72, polarization: 78 },
      military: { readiness: 86, manpower: 205, technology: 89, nuclearCapability: 70 },
      environment: { pollution: 36, energySecurity: 85, climateRisk: 38 },
      factions: [
        { name: 'Trade Unions & Workers', support: 35, influence: 88 },
        { name: 'Corporate & Tech Elite', support: 68, influence: 82 },
        { name: 'Agricultural Sector', support: 42, influence: 75 },
        { name: 'Nationalists', support: 50, influence: 70 },
      ]
    }
  },
  {
    id: 'bra',
    name: 'Brazil',
    flag: '🇧🇷',
    region: 'South America',
    population: 216.4,
    gdp: 2170,
    governmentType: 'Federal Republic',
    description: 'The agricultural and ecological giant of Latin America, holding the key to global biodiversity and renewable energy expansion.',
    initialStats: {
      economy: { gdp: 2170, inflation: 3.9, unemployment: 7.8, debt: 75, currencyStrength: 52, foreignInvestment: 850 },
      society: { happiness: 69, literacy: 94, healthcare: 65, crimeRate: 68, inequality: 78 },
      politics: { approvalRating: 54, corruption: 62, stability: 68, polarization: 82 },
      military: { readiness: 70, manpower: 360, technology: 68, nuclearCapability: 0 },
      environment: { pollution: 52, energySecurity: 82, climateRisk: 65 },
      factions: [
        { name: 'Agribusiness Coalition', support: 75, influence: 90 },
        { name: 'Environmental Protectors', support: 60, influence: 75 },
        { name: 'Urban Working Poor', support: 68, influence: 70 },
        { name: 'Military & Security', support: 65, influence: 75 },
      ]
    }
  },
  {
    id: 'rus',
    name: 'Russia',
    flag: '🇷🇺',
    region: 'Europe/Asia',
    population: 144.2,
    gdp: 2020,
    governmentType: 'Authoritarian State',
    description: 'A vast Eurasian power with massive natural resource wealth and the world\'s largest nuclear arsenal, facing Western economic sanctions.',
    initialStats: {
      economy: { gdp: 2020, inflation: 7.4, unemployment: 3.2, debt: 21, currencyStrength: 42, foreignInvestment: 350 },
      society: { happiness: 58, literacy: 99, healthcare: 64, crimeRate: 54, inequality: 75 },
      politics: { approvalRating: 78, corruption: 72, stability: 82, polarization: 30 },
      military: { readiness: 88, manpower: 1320, technology: 82, nuclearCapability: 100 },
      environment: { pollution: 72, energySecurity: 98, climateRisk: 50 },
      factions: [
        { name: 'Energy Oligarchs', support: 85, influence: 92 },
        { name: 'Security & Military Elite', support: 92, influence: 95 },
        { name: 'Nationalist Patriots', support: 80, influence: 80 },
        { name: 'Urban Intelligentsia', support: 30, influence: 40 },
      ]
    }
  },
  {
    id: 'sau',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    region: 'Middle East',
    population: 36.9,
    gdp: 1110,
    governmentType: 'Authoritarian State',
    description: 'An energy superpower executing Vision 2030 to diversify into AI, tourism, and megaprojects while exercising global financial clout.',
    initialStats: {
      economy: { gdp: 1110, inflation: 1.8, unemployment: 4.9, debt: 26, currencyStrength: 80, foreignInvestment: 1600 },
      society: { happiness: 75, literacy: 96, healthcare: 82, crimeRate: 18, inequality: 62 },
      politics: { approvalRating: 88, corruption: 35, stability: 92, polarization: 20 },
      military: { readiness: 82, manpower: 257, technology: 86, nuclearCapability: 0 },
      environment: { pollution: 68, energySecurity: 100, climateRisk: 80 },
      factions: [
        { name: 'Royal Court & Sovereign Wealth', support: 95, influence: 98 },
        { name: 'Religious Establishment', support: 70, influence: 75 },
        { name: 'Modernizing Youth', support: 88, influence: 80 },
        { name: 'Business Tycoons', support: 85, influence: 85 },
      ]
    }
  },
  {
    id: 'kor',
    name: 'South Korea',
    flag: '🇰🇷',
    region: 'Asia',
    population: 51.7,
    gdp: 1710,
    governmentType: 'Presidential Republic',
    description: 'A global high-tech and cultural powerhouse managing geopolitical border vigilance and demographic shifts.',
    initialStats: {
      economy: { gdp: 1710, inflation: 2.7, unemployment: 3.0, debt: 55, currencyStrength: 72, foreignInvestment: 1400 },
      society: { happiness: 66, literacy: 99, healthcare: 92, crimeRate: 20, inequality: 56 },
      politics: { approvalRating: 40, corruption: 32, stability: 84, polarization: 75 },
      military: { readiness: 92, manpower: 500, technology: 94, nuclearCapability: 0 },
      environment: { pollution: 58, energySecurity: 55, climateRisk: 48 },
      factions: [
        { name: 'Chaebol Conglomerates', support: 72, influence: 94 },
        { name: 'Tech & Innovation Workers', support: 60, influence: 78 },
        { name: 'National Defense Command', support: 88, influence: 85 },
        { name: 'Young Professionals', support: 42, influence: 65 },
      ]
    }
  },
  {
    id: 'aus',
    name: 'Australia',
    flag: '🇦🇺',
    region: 'Oceania',
    population: 26.6,
    gdp: 1780,
    governmentType: 'Parliamentary Democracy',
    description: 'A resource-rich continent and Indo-Pacific security anchor balancing clean energy goals with mineral exports.',
    initialStats: {
      economy: { gdp: 1780, inflation: 3.4, unemployment: 3.8, debt: 48, currencyStrength: 75, foreignInvestment: 1300 },
      society: { happiness: 80, literacy: 99, healthcare: 90, crimeRate: 28, inequality: 46 },
      politics: { approvalRating: 52, corruption: 16, stability: 90, polarization: 55 },
      military: { readiness: 78, manpower: 60, technology: 88, nuclearCapability: 0 },
      environment: { pollution: 42, energySecurity: 78, climateRisk: 68 },
      factions: [
        { name: 'Mining & Resource Giants', support: 70, influence: 90 },
        { name: 'Climate & Green Voters', support: 65, influence: 80 },
        { name: 'Suburban Homeowners', support: 58, influence: 85 },
        { name: 'Defense & AUKUS Alliance', support: 80, influence: 75 },
      ]
    }
  }
];

export const ROLE_OPTIONS = [
  {
    id: 'President',
    name: 'President',
    icon: 'Landmark',
    description: 'Executive head of state and government. Excellent for swift economic decrees and decisive domestic reforms.',
    perk: '+10% Approval Rating boost on social policy changes & greater executive stability.'
  },
  {
    id: 'Prime Minister',
    name: 'Prime Minister',
    icon: 'Users',
    description: 'Parliamentary leader skilled in coalition building, legislative maneuvering, and economic consensus.',
    perk: '-15% Policy budget cost & reduced political polarization penalty.'
  },
  {
    id: 'Monarch',
    name: 'Monarch',
    icon: 'Crown',
    description: 'Sovereign ruler with historical legitimacy, prestige, and unmatched diplomatic influence.',
    perk: '+20 Diplomatic Relations baseline with world nations & immunity to routine scandals.'
  },
  {
    id: 'Military Leader',
    name: 'Military Leader',
    icon: 'ShieldAlert',
    description: 'Supreme commander of armed forces. Prioritizes national security, defense readiness, and geopolitical dominance.',
    perk: '+25 Military Readiness & immediate access to advanced tactical defense protocols.'
  }
];
