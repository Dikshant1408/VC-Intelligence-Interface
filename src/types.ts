export interface Company {
  id: string;
  name: string;
  website: string;
  logo: string;
  description: string;
  sector: string;
  stage: 'Seed' | 'Series A' | 'Series B' | 'Series C' | 'Growth';
  location: string;
  foundedYear: number;
  totalFunding: string;
  lastFundingDate: string;
  tags: string[];
  signals: Signal[];
}

export interface Signal {
  id: string;
  type: 'funding' | 'hiring' | 'product' | 'news';
  title: string;
  description: string;
  date: string;
}

export interface EnrichmentData {
  summary: string;
  whatTheyDo: string[];
  keywords: string[];
  derivedSignals: string[];
  sources: { url: string; timestamp: string }[];
}

export interface CompanyList {
  id: string;
  name: string;
  companyIds: string[];
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: any;
  createdAt: string;
}

export const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'Linear',
    website: 'https://linear.app',
    logo: 'https://picsum.photos/seed/linear/100/100',
    description: 'The issue tracking tool you\'ll actually enjoy using.',
    sector: 'Enterprise Software',
    stage: 'Series B',
    location: 'San Francisco, CA',
    foundedYear: 2019,
    totalFunding: '$52M',
    lastFundingDate: '2023-09-12',
    tags: ['SaaS', 'DevTools', 'Productivity'],
    signals: [
      { id: 's1', type: 'product', title: 'Launched Linear Asks', description: 'New customer support integration.', date: '2024-01-15' },
      { id: 's2', type: 'funding', title: 'Series B Extension', description: 'Raised $15M from existing investors.', date: '2023-09-12' }
    ]
  },
  {
    id: '2',
    name: 'Vercel',
    website: 'https://vercel.com',
    logo: 'https://picsum.photos/seed/vercel/100/100',
    description: 'Develop. Preview. Ship. For the best frontend teams.',
    sector: 'Cloud Infrastructure',
    stage: 'Growth',
    location: 'New York, NY',
    foundedYear: 2015,
    totalFunding: '$313M',
    lastFundingDate: '2021-11-23',
    tags: ['Frontend', 'Next.js', 'Edge Computing'],
    signals: [
      { id: 's3', type: 'news', title: 'Acquired Turborepo', description: 'Expanding into build systems.', date: '2021-12-09' }
    ]
  },
  {
    id: '3',
    name: 'Supabase',
    website: 'https://supabase.com',
    logo: 'https://picsum.photos/seed/supabase/100/100',
    description: 'The Open Source Firebase Alternative.',
    sector: 'Database',
    stage: 'Series B',
    location: 'Remote',
    foundedYear: 2020,
    totalFunding: '$116M',
    lastFundingDate: '2022-05-10',
    tags: ['Open Source', 'PostgreSQL', 'Backend'],
    signals: [
      { id: 's4', type: 'hiring', title: 'Aggressive Engineering Hiring', description: 'Opening 20+ roles in core database team.', date: '2024-02-01' }
    ]
  },
  {
    id: '4',
    name: 'Ramp',
    website: 'https://ramp.com',
    logo: 'https://picsum.photos/seed/ramp/100/100',
    description: 'The ultimate corporate card and spend management platform.',
    sector: 'Fintech',
    stage: 'Growth',
    location: 'New York, NY',
    foundedYear: 2019,
    totalFunding: '$1.7B',
    lastFundingDate: '2024-04-17',
    tags: ['Finance', 'Corporate Cards', 'AI'],
    signals: [
      { id: 's5', type: 'funding', title: 'Series D-2', description: 'Raised $150M at $7.65B valuation.', date: '2024-04-17' }
    ]
  },
  {
    id: '5',
    name: 'Anthropic',
    website: 'https://anthropic.com',
    logo: 'https://picsum.photos/seed/anthropic/100/100',
    description: 'AI safety and research company.',
    sector: 'Artificial Intelligence',
    stage: 'Growth',
    location: 'San Francisco, CA',
    foundedYear: 2021,
    totalFunding: '$7.6B',
    lastFundingDate: '2024-03-27',
    tags: ['AI', 'Safety', 'LLM'],
    signals: [
      { id: 's6', type: 'product', title: 'Claude 3 Opus Launch', description: 'New state-of-the-art LLM model.', date: '2024-03-04' }
    ]
  },
  {
    id: '6',
    name: 'Retool',
    website: 'https://retool.com',
    logo: 'https://picsum.photos/seed/retool/100/100',
    description: 'Build internal tools remarkably fast.',
    sector: 'Enterprise Software',
    stage: 'Growth',
    location: 'San Francisco, CA',
    foundedYear: 2017,
    totalFunding: '$127M',
    lastFundingDate: '2022-07-28',
    tags: ['Low-code', 'SaaS', 'Internal Tools'],
    signals: [
      { id: 's7', type: 'product', title: 'Retool Mobile', description: 'Build mobile apps for internal teams.', date: '2023-05-10' }
    ]
  },
  {
    id: '7',
    name: 'Deel',
    website: 'https://deel.com',
    logo: 'https://picsum.photos/seed/deel/100/100',
    description: 'Global payroll and compliance for remote teams.',
    sector: 'HR Tech',
    stage: 'Growth',
    location: 'San Francisco, CA',
    foundedYear: 2019,
    totalFunding: '$629M',
    lastFundingDate: '2022-05-10',
    tags: ['Remote Work', 'Payroll', 'SaaS'],
    signals: [
      { id: 's8', type: 'news', title: 'Acquired Hofy', description: 'Expanding into hardware management.', date: '2024-07-15' }
    ]
  },
  {
    id: '8',
    name: 'Scale AI',
    website: 'https://scale.com',
    logo: 'https://picsum.photos/seed/scale/100/100',
    description: 'Data infrastructure for AI.',
    sector: 'Artificial Intelligence',
    stage: 'Growth',
    location: 'San Francisco, CA',
    foundedYear: 2016,
    totalFunding: '$1.6B',
    lastFundingDate: '2024-05-21',
    tags: ['AI', 'Data', 'ML'],
    signals: [
      { id: 's9', type: 'funding', title: 'Series F', description: 'Raised $1B at $13.8B valuation.', date: '2024-05-21' }
    ]
  }
];
