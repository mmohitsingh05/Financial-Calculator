export interface TaxBracket {
  rate: number;
  lower: number;
  upper: number;
}

export interface TaxConfig {
  single: TaxBracket[];
  married: TaxBracket[];
  standardDeductionSingle: number;
  standardDeductionMarried: number;
}

export const FINANCIAL_CONFIG_2026 = {
  taxYear: "2026",
  
  // Federal Income Tax Brackets for 2026 (Projections/standards)
  taxBrackets: {
    single: [
      { rate: 0.10, lower: 0, upper: 11600 },
      { rate: 0.12, lower: 11600, upper: 47150 },
      { rate: 0.22, lower: 47150, upper: 100525 },
      { rate: 0.24, lower: 100525, upper: 191950 },
      { rate: 0.32, lower: 191950, upper: 243725 },
      { rate: 0.35, lower: 243725, upper: 609350 },
      { rate: 0.37, lower: 609350, upper: Infinity }
    ],
    married: [
      { rate: 0.10, lower: 0, upper: 23200 },
      { rate: 0.12, lower: 23200, upper: 94300 },
      { rate: 0.22, lower: 94300, upper: 201050 },
      { rate: 0.24, lower: 201050, upper: 383900 },
      { rate: 0.32, lower: 383900, upper: 487450 },
      { rate: 0.35, lower: 487450, upper: 731200 },
      { rate: 0.37, lower: 731200, upper: Infinity }
    ],
    standardDeductionSingle: 15000,
    standardDeductionMarried: 30000
  },

  // FICA payroll rates
  fica: {
    socialSecurityRate: 0.062,
    socialSecurityWageCap: 176100, // wage base cap
    medicareRate: 0.0145,
    additionalMedicareRate: 0.009,
    additionalMedicareThresholdSingle: 200000,
    additionalMedicareThresholdMarried: 250000
  },

  // Retirement account annual individual limits for 2026
  retirementLimits: {
    limit401k: 23500,
    limitIRA: 7000,
    catchUp401kAge50: 7500,
    catchUpIRAAge50: 1000
  }
};
