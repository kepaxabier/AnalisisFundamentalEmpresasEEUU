export interface FinancialMetric {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface CompanyAnalysis {
  ticker: string;
  companyName: string;
  period: string; // "Annual 2023" or "Q3 2024"
  summary: string;
  internalFactors: {
    income: {
      revenue: FinancialMetric;
      expenses: FinancialMetric;
      grossProfit: FinancialMetric;
      netIncome: FinancialMetric;
    };
    liquidity: {
      freeCashFlow: FinancialMetric;
      currentRatio?: FinancialMetric;
    };
    solvency: {
      debtToEquity: FinancialMetric;
      debtRatio: FinancialMetric;
    };
    profitability: {
      profitMargin: FinancialMetric;
      roe: FinancialMetric;
      roa: FinancialMetric;
      ebitdaMargin: FinancialMetric;
    };
    growth: {
      revenueGrowth: FinancialMetric;
    };
    valuation: {
      per: FinancialMetric; // Price to Earnings
      psr: FinancialMetric; // Price to Sales
      evEbitda: FinancialMetric;
    };
  };
  sources: string[];
}

export interface ScreenerItem {
  rank: number;
  ticker: string;
  companyName: string;
  metricValue: number; // The value of Revenue Growth or EPS Growth
  metricLabel: string; // "Revenue Growth %" or "EPS Growth %"
  quarter: string;
}

export interface ScreenerResult {
  title: string;
  criterion: 'revenue' | 'eps';
  items: ScreenerItem[];
  analysis: string;
}

export enum AnalysisType {
  SINGLE_COMPANY = 'SINGLE_COMPANY',
  SCREENER = 'SCREENER'
}

export enum ReportPeriod {
  ANNUAL = 'Annual',
  QUARTERLY = 'Quarterly'
}

export enum ScreenerCriterion {
  REVENUE_GROWTH = 'Revenue Growth',
  EPS_GROWTH = 'EPS Growth'
}
