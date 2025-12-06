import { GoogleGenAI } from "@google/genai";
import { CompanyAnalysis, ScreenerResult, ScreenerCriterion, ReportPeriod } from "../types";

// Initialize Gemini
// Note: In a real production app, ensure API_KEY is set in environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to clean JSON from Markdown code blocks
const cleanJson = (text: string): string => {
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const analyzeCompany = async (ticker: string, period: ReportPeriod): Promise<CompanyAnalysis> => {
  const isQuarterly = period === ReportPeriod.QUARTERLY;
  
  const prompt = `
    Act as a professional financial analyst. Perform a deep Fundamental Analysis for the company with ticker "${ticker}".
    Target Period: ${isQuarterly ? 'Most recent available Quarterly Report (10-Q) / Earnings Report' : 'Most recent Annual Report (10-K)'}.
    
    Use Google Search to find the latest real financial data from reliable sources (Yahoo Finance, Investing.com, company IR).
    
    You must extract and analyze the following Internal Factors:
    1. Income: Total Revenue, Total Expenses (Cost of Revenue + Operating), Net Income.
    2. Liquidity: Free Cash Flow.
    3. Solvency: Debt-to-Equity Ratio.
    4. Profitability: Net Profit Margin, ROE, ROA, EBITDA Margin.
    5. Growth: Revenue Growth (YoY).
    6. Valuation: PER (P/E Ratio), PSR (P/S Ratio), EV/EBITDA.

    Return the output strictly as a JSON object with this specific structure (no other text):
    {
      "ticker": "${ticker}",
      "companyName": "Full Company Name",
      "period": "e.g., Q3 2024 or FY 2023",
      "summary": "A concise paragraph (in Spanish) summarizing the financial health based on the data.",
      "internalFactors": {
        "income": {
          "revenue": { "value": number, "label": "Ingresos Totales", "unit": "USD" },
          "expenses": { "value": number, "label": "Gastos Totales", "unit": "USD" },
          "grossProfit": { "value": number, "label": "Beneficio Bruto", "unit": "USD" },
          "netIncome": { "value": number, "label": "Beneficio Neto", "unit": "USD" }
        },
        "liquidity": {
          "freeCashFlow": { "value": number, "label": "Flujo de Caja Libre", "unit": "USD" }
        },
        "solvency": {
          "debtToEquity": { "value": number, "label": "Ratio Deuda/Capital", "unit": "Ratio" }
        },
        "profitability": {
          "profitMargin": { "value": number, "label": "Margen Neto", "unit": "%" },
          "roe": { "value": number, "label": "ROE", "unit": "%" },
          "roa": { "value": number, "label": "ROA", "unit": "%" },
          "ebitdaMargin": { "value": number, "label": "Margen EBITDA", "unit": "%" }
        },
        "growth": {
          "revenueGrowth": { "value": number, "label": "Crecimiento Ingresos (YoY)", "unit": "%" }
        },
        "valuation": {
          "per": { "value": number, "label": "PER", "unit": "x" },
          "psr": { "value": number, "label": "PSR", "unit": "x" },
          "evEbitda": { "value": number, "label": "EV/EBITDA", "unit": "x" }
        }
      }
    }
    If a specific value is not found, use 0 or null. Ensure all numeric values are raw numbers (not strings like "10B").
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: Cannot use responseMimeType: 'application/json' with googleSearch
      }
    });

    const text = response.text || "{}";
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    const parsedData = JSON.parse(cleanJson(text));
    
    // Extract sources
    const sources = grounding 
      ? grounding.map((c: any) => c.web?.uri).filter((u: any) => u) 
      : [];

    return {
      ...parsedData,
      sources
    };

  } catch (error) {
    console.error("Error analyzing company:", error);
    throw new Error("Failed to analyze company. Please check the ticker or try again.");
  }
};

export const screenCompanies = async (
  tickers: string[], 
  criterion: ScreenerCriterion,
  context: string // e.g., "Technology Sector" or "S&P 500 Top 5"
): Promise<ScreenerResult> => {
  
  const metricName = criterion === ScreenerCriterion.REVENUE_GROWTH ? "Revenue Growth (YoY)" : "EPS Growth (YoY)";
  
  const prompt = `
    Act as a financial data screener. 
    Context: ${context}.
    List of Companies to Analyze: ${tickers.join(", ")}.
    
    Task: Find the most recent quarterly financial results for these companies.
    Compare them based strictly on **${metricName}** compared to the same quarter last year.
    
    Rank them from Best (Highest Growth) to Worst (Lowest Growth).
    
    Return the output strictly as a JSON object with this structure (no other text):
    {
      "title": "Ranking Report: ${context}",
      "criterion": "${criterion === ScreenerCriterion.REVENUE_GROWTH ? 'revenue' : 'eps'}",
      "items": [
        {
          "rank": 1,
          "ticker": "TICKER",
          "companyName": "Name",
          "metricValue": number,
          "metricLabel": "${metricName}",
          "quarter": "e.g., Q3 2024"
        },
        ...
      ],
      "analysis": "A brief summary in Spanish explaining the winner and the loser of this comparison."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const text = response.text || "{}";
    return JSON.parse(cleanJson(text));

  } catch (error) {
    console.error("Error screening companies:", error);
    throw new Error("Failed to screen companies.");
  }
};
