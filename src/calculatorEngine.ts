import { FINANCIAL_CONFIG_2026 } from "./financialConfig";

export interface CalculatorResult {
  primaryValue: string;
  primaryLabel: string;
  secondaries: Array<{ label: string; value: string; color?: string }>;
  chartData: Array<{ label: string; value: number; color: string }>;
  schedule: Array<{ period: string; col1: string; col2: string; col3: string }>;
}

// Bisection solver to find effective APR with an upfront fee
export const solveEffectiveAPR = (pmt: number, netAmount: number, months: number): number => {
  if (pmt <= 0 || netAmount <= 0 || months <= 0) return 0;
  let low = 0;
  let high = 2.0; // up to 200% per month
  for (let iter = 0; iter < 30; iter++) {
    const mid = (low + high) / 2;
    const pmtMid = mid > 0 
      ? netAmount * (mid * Math.pow(1 + mid, months)) / (Math.pow(1 + mid, months) - 1)
      : netAmount / months;
    if (pmtMid > pmt) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return low * 12 * 100;
};

// Progressive federal income tax calculator
export const calculateFederalTax = (taxableIncome: number, isMarried: boolean): number => {
  const brackets = isMarried 
    ? FINANCIAL_CONFIG_2026.taxBrackets.married 
    : FINANCIAL_CONFIG_2026.taxBrackets.single;
  let tax = 0;
  for (const bracket of brackets) {
    if (taxableIncome > bracket.lower) {
      const taxableInBracket = Math.min(taxableIncome, bracket.upper) - bracket.lower;
      tax += taxableInBracket * bracket.rate;
    }
  }
  return tax;
};

export const calculateResultsEngine = (calcId: string, v: Record<string, number>): CalculatorResult => {
  let primaryValue = "";
  let primaryLabel = "";
  const secondaries: Array<{ label: string; value: string; color?: string }> = [];
  const chartData: Array<{ label: string; value: number; color: string }> = [];
  const schedule: Array<{ period: string; col1: string; col2: string; col3: string }> = [];

  switch (calcId) {
    case "mortgage-calculator": {
      const homePrice = v.homePrice;
      const downPayment = v.downPayment;
      const interestRate = v.interestRate;
      const loanTerm = v.loanTerm;
      const propertyTax = v.propertyTax;
      const insurance = v.insurance;
      const hoa = v.hoa;

      const principal = Math.max(0, homePrice - downPayment);
      const monthlyRate = (interestRate / 100) / 12;
      const totalMonths = loanTerm * 12;

      let monthlyPI = 0;
      if (monthlyRate > 0) {
        monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
      } else {
        monthlyPI = principal / totalMonths;
      }

      const monthlyTax = (homePrice * (propertyTax / 100)) / 12;
      const monthlyInsurance = insurance / 12;
      
      // PMI applies if downpayment < 20%
      const hasPMI = downPayment < (homePrice * 0.20);
      const monthlyPMI = hasPMI ? (principal * 0.0075) / 12 : 0; // standard 0.75% annual PMI

      const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + hoa;
      const totalInterestPaid = (monthlyPI * totalMonths) - principal;

      primaryValue = `$${Math.round(totalMonthly).toLocaleString()}/mo`;
      primaryLabel = "Total Monthly Payment (PITI + HOA)";

      secondaries.push(
        { label: "Principal & Interest (P&I)", value: `$${Math.round(monthlyPI).toLocaleString()}`, color: "#ea4c89" },
        { label: "Property Tax Portion", value: `$${Math.round(monthlyTax).toLocaleString()}`, color: "#fb923c" },
        { label: "Homeowners Insurance", value: `$${Math.round(monthlyInsurance).toLocaleString()}`, color: "#3b82f6" },
        { label: "Private Mortgage Ins. (PMI)", value: `$${Math.round(monthlyPMI).toLocaleString()}`, color: "#f59e0b" },
        { label: "Monthly HOA Fees", value: `$${Math.round(hoa).toLocaleString()}`, color: "#10b981" },
        { label: "Total Interest Over Term", value: `$${Math.round(totalInterestPaid).toLocaleString()}` }
      );

      chartData.push(
        { label: "P&I", value: monthlyPI, color: "#ea4c89" },
        { label: "Tax", value: monthlyTax, color: "#fb923c" },
        { label: "Insurance", value: monthlyInsurance, color: "#3b82f6" },
        { label: "PMI", value: monthlyPMI, color: "#f59e0b" },
        { label: "HOA", value: hoa, color: "#10b981" }
      );

      // Amortization Milestones (Yearly)
      for (let year = 1; year <= loanTerm; year += Math.ceil(loanTerm / 5)) {
        const paidMonths = year * 12;
        let remainingBalance = 0;
        if (monthlyRate > 0) {
          remainingBalance = principal * (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, paidMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        } else {
          remainingBalance = Math.max(0, principal - (monthlyPI * paidMonths));
        }
        schedule.push({
          period: `Year ${year}`,
          col1: `$${Math.round(monthlyPI * paidMonths).toLocaleString()}`,
          col2: `$${Math.round(principal - Math.max(0, remainingBalance)).toLocaleString()}`,
          col3: `$${Math.round(Math.max(0, remainingBalance)).toLocaleString()}`
        });
      }
      break;
    }

    case "mortgage-refinance-calculator": {
      const balance = v.loanBalance;
      const currentRate = v.currentRate;
      const newRate = v.newRate;
      const newTerm = v.newTerm;
      const closingCosts = v.closingCosts;

      const currentMonthlyPI = currentRate > 0 
        ? balance * (((currentRate / 100) / 12) * Math.pow(1 + (currentRate / 100) / 12, 360)) / (Math.pow(1 + (currentRate / 100) / 12, 360) - 1)
        : balance / 360;
      const newMonthlyPI = newRate > 0
        ? balance * (((newRate / 100) / 12) * Math.pow(1 + (newRate / 100) / 12, newTerm * 12)) / (Math.pow(1 + (newRate / 100) / 12, newTerm * 12) - 1)
        : balance / (newTerm * 12);

      const savings = currentMonthlyPI - newMonthlyPI;
      const breakEven = savings > 0 ? closingCosts / savings : 0;
      const totalInterestSavings = (currentMonthlyPI * 12 * newTerm) - (newMonthlyPI * 12 * newTerm) - closingCosts;

      primaryValue = savings > 0 ? `$${Math.round(savings).toLocaleString()}/mo` : "$0/mo";
      primaryLabel = "Estimated Net Monthly P&I Savings";

      secondaries.push(
        { label: "New Monthly P&I", value: `$${Math.round(newMonthlyPI).toLocaleString()}`, color: "#ea4c89" },
        { label: "Current Monthly P&I", value: `$${Math.round(currentMonthlyPI).toLocaleString()}`, color: "#9ca3af" },
        { label: "Break-Even Point", value: breakEven > 0 ? `${Math.ceil(breakEven)} months` : "Never", color: "#3b82f6" },
        { label: "Net Lifetime Savings", value: `$${Math.round(Math.max(0, totalInterestSavings)).toLocaleString()}`, color: "#10b981" }
      );

      chartData.push(
        { label: "Refinanced P&I", value: newMonthlyPI, color: "#10b981" },
        { label: "Previous P&I", value: currentMonthlyPI, color: "#ea4c89" }
      );

      schedule.push(
        { period: "Month 1", col1: `$${Math.round(savings).toLocaleString()}`, col2: `-$${Math.round(closingCosts - savings).toLocaleString()}`, col3: "Investment Mode" },
        { period: "Year 1", col1: `$${Math.round(savings * 12).toLocaleString()}`, col2: breakEven <= 12 ? "Recovered!" : "In Progress", col3: "Refinanced" },
        { period: "Year 5", col1: `$${Math.round(savings * 60).toLocaleString()}`, col2: "Profit Achieved", col3: "Refinanced" }
      );
      break;
    }

    case "auto-loan-calculator": {
      const price = v.carPrice;
      const down = v.downPayment;
      const trade = v.tradeInValue;
      const tax = v.salesTax;
      const rate = v.interestRate;
      const term = v.loanTerm;

      const subtotal = Math.max(0, price - down - trade);
      const taxAmount = price * (tax / 100);
      const financed = subtotal + taxAmount;
      const mRate = (rate / 100) / 12;

      let monthly = 0;
      if (mRate > 0) {
        monthly = financed * (mRate * Math.pow(1 + mRate, term)) / (Math.pow(1 + mRate, term) - 1);
      } else {
        monthly = financed / term;
      }

      const totalCost = (monthly * term) + down + trade;
      const totalInterest = (monthly * term) - financed;

      primaryValue = `$${Math.round(monthly).toLocaleString()}/mo`;
      primaryLabel = "Estimated Monthly Car Payment";

      secondaries.push(
        { label: "Total Amount Financed", value: `$${Math.round(financed).toLocaleString()}`, color: "#3b82f6" },
        { label: "Sales Tax Amount", value: `$${Math.round(taxAmount).toLocaleString()}` },
        { label: "Total Interest Paid", value: `$${Math.round(totalInterest).toLocaleString()}`, color: "#ea4c89" },
        { label: "Overall Lifetime Cost", value: `$${Math.round(totalCost).toLocaleString()}`, color: "#10b981" }
      );

      chartData.push(
        { label: "Down + Trade", value: down + trade, color: "#10b981" },
        { label: "Financed Amount", value: financed, color: "#3b82f6" },
        { label: "Total Interest", value: totalInterest, color: "#ea4c89" }
      );
      break;
    }

    case "personal-loan-calculator": {
      const principal = v.loanAmount;
      const rate = v.interestRate;
      const term = v.loanTerm;
      const originationFeePercent = v.originationFee !== undefined ? v.originationFee : 3.0;

      const mRate = (rate / 100) / 12;
      let monthly = 0;
      if (mRate > 0) {
        monthly = principal * (mRate * Math.pow(1 + mRate, term)) / (Math.pow(1 + mRate, term) - 1);
      } else {
        monthly = principal / term;
      }

      const totalPaid = monthly * term;
      const totalInterest = totalPaid - principal;
      
      const originationFee = principal * (originationFeePercent / 100);
      const amountReceived = principal - originationFee;
      
      // Calculate effective APR accounting for upfront origination fee
      const effectiveAPR = solveEffectiveAPR(monthly, amountReceived, term);

      primaryValue = `$${Math.round(monthly).toLocaleString()}/mo`;
      primaryLabel = "Monthly Personal Loan Payment";

      secondaries.push(
        { label: "Principal Financed", value: `$${Math.round(principal).toLocaleString()}` },
        { label: "Net Received Amount", value: `$${Math.round(amountReceived).toLocaleString()}`, color: "#3b82f6" },
        { label: "Origination Fee Paid", value: `$${Math.round(originationFee).toLocaleString()}`, color: "#f59e0b" },
        { label: "Effective APR (with Fee)", value: `${effectiveAPR.toFixed(2)}%`, color: "#ea4c89" },
        { label: "Total Interest Paid", value: `$${Math.round(totalInterest).toLocaleString()}` }
      );

      chartData.push(
        { label: "Net Received", value: amountReceived, color: "#3b82f6" },
        { label: "Origination Fee", value: originationFee, color: "#f59e0b" },
        { label: "Interest", value: totalInterest, color: "#ea4c89" }
      );
      break;
    }

    case "student-loan-calculator": {
      const balance = v.studentLoanBalance;
      const rate = v.interestRate;
      const term = v.payoffTerm;
      const extra = v.extraPayment;
      const agi = v.annualIncome !== undefined ? v.annualIncome : 55000;

      const totalMonths = term * 12;
      const mRate = (rate / 100) / 12;
      
      let standardPI = 0;
      if (mRate > 0) {
        standardPI = balance * (mRate * Math.pow(1 + mRate, totalMonths)) / (Math.pow(1 + mRate, totalMonths) - 1);
      } else {
        standardPI = balance / totalMonths;
      }
      
      const totalPayment = standardPI + extra;

      // Simulate accelerated payoff
      let remaining = balance;
      let monthsWithExtra = 0;
      let interestWithExtra = 0;
      while (remaining > 0 && monthsWithExtra < 600) {
        const mInterest = remaining * mRate;
        interestWithExtra += mInterest;
        const mPrincipal = Math.min(remaining, totalPayment - mInterest);
        remaining -= mPrincipal;
        monthsWithExtra++;
      }

      const standardTotalInterest = (standardPI * totalMonths) - balance;
      const savings = standardTotalInterest - interestWithExtra;

      // Simplified Income Driven Repayment (SAVE Plan 2026 guidelines)
      // Discretionary Income = AGI - (225% of Poverty Line $15,060)
      const povertyLine = 15060;
      const discretionaryIncome = Math.max(0, agi - (2.25 * povertyLine));
      const idrMonthly = (discretionaryIncome * 0.10) / 12; // 10% rate standard

      primaryValue = `$${Math.round(standardPI).toLocaleString()}/mo`;
      primaryLabel = "Standard Monthly Base Payment";

      secondaries.push(
        { label: "Accelerated Monthly Payment", value: `$${Math.round(totalPayment).toLocaleString()}`, color: "#10b981" },
        { label: "Simplified SAVE IDR Quote", value: `$${Math.round(idrMonthly).toLocaleString()}/mo`, color: "#3b82f6" },
        { label: "Accelerated Term Length", value: `${Math.round((monthsWithExtra / 12) * 10) / 10} Years` },
        { label: "Years Saved via Extra Pay", value: `${Math.round(((totalMonths - monthsWithExtra) / 12) * 10) / 10} Years`, color: "#fb923c" },
        { label: "Total Lifetime Interest Saved", value: `$${Math.round(Math.max(0, savings)).toLocaleString()}`, color: "#ea4c89" }
      );

      chartData.push(
        { label: "Standard Base", value: standardPI, color: "#3b82f6" },
        { label: "Your Extra Principal", value: extra, color: "#10b981" }
      );
      break;
    }

    case "amortization-calculator": {
      const principal = v.loanAmount;
      const rate = v.interestRate;
      const term = v.loanTerm;
      const extra = v.extraPayment;

      const totalMonths = term * 12;
      const mRate = (rate / 100) / 12;
      
      let monthlyPI = 0;
      if (mRate > 0) {
        monthlyPI = principal * (mRate * Math.pow(1 + mRate, totalMonths)) / (Math.pow(1 + mRate, totalMonths) - 1);
      } else {
        monthlyPI = principal / totalMonths;
      }
      
      const totalInterestPaid = (monthlyPI * totalMonths) - principal;

      primaryValue = `$${Math.round(monthlyPI).toLocaleString()}/mo`;
      primaryLabel = "Standard Monthly Base (P&I)";

      secondaries.push(
        { label: "Total Original Loan", value: `$${Math.round(principal).toLocaleString()}` },
        { label: "Standard Lifetime Interest", value: `$${Math.round(totalInterestPaid).toLocaleString()}`, color: "#ea4c89" },
        { label: "Recurring Extra Principal", value: `+$${Math.round(extra).toLocaleString()}/mo`, color: "#10b981" }
      );

      chartData.push(
        { label: "Principal", value: principal, color: "#3b82f6" },
        { label: "Interest", value: totalInterestPaid, color: "#ea4c89" }
      );

      // Generate Amortization Schedule (accelerated vs standard)
      for (let year = 1; year <= term; year += Math.ceil(term / 5)) {
        const paidMonths = year * 12;
        let remainingBalance = 0;
        if (mRate > 0) {
          remainingBalance = principal * (Math.pow(1 + mRate, totalMonths) - Math.pow(1 + mRate, paidMonths)) / (Math.pow(1 + mRate, totalMonths) - 1);
        } else {
          remainingBalance = Math.max(0, principal - (monthlyPI * paidMonths));
        }
        schedule.push({
          period: `Year ${year}`,
          col1: `$${Math.round(monthlyPI * paidMonths).toLocaleString()}`,
          col2: `$${Math.round(principal - Math.max(0, remainingBalance)).toLocaleString()}`,
          col3: `$${Math.round(Math.max(0, remainingBalance)).toLocaleString()}`
        });
      }
      break;
    }

    case "loan-payoff-calculator": {
      const balance = v.currentBalance;
      const rate = v.interestRate;
      const standardPayment = v.monthlyPayment;
      const extra = v.extraPayment;

      const mRate = (rate / 100) / 12;
      const totalPayment = standardPayment + extra;

      // Simulate standard payoff
      let remStandard = balance;
      let monthsStandard = 0;
      let intStandard = 0;
      while (remStandard > 0 && monthsStandard < 600) {
        const mInt = remStandard * mRate;
        intStandard += mInt;
        const mPrincipal = Math.min(remStandard, standardPayment - mInt);
        if (mPrincipal <= 0) { monthsStandard = 999; break; }
        remStandard -= mPrincipal;
        monthsStandard++;
      }

      // Simulate accelerated payoff
      let remAccel = balance;
      let monthsAccel = 0;
      let intAccel = 0;
      while (remAccel > 0 && monthsAccel < 600) {
        const mInt = remAccel * mRate;
        intAccel += mInt;
        const mPrincipal = Math.min(remAccel, totalPayment - mInt);
        if (mPrincipal <= 0) { monthsAccel = 999; break; }
        remAccel -= mPrincipal;
        monthsAccel++;
      }

      const yearsSaved = monthsStandard < 999 && monthsAccel < 999 ? (monthsStandard - monthsAccel) / 12 : 0;
      const interestSaved = Math.max(0, intStandard - intAccel);

      primaryValue = `$${Math.round(totalPayment).toLocaleString()}/mo`;
      primaryLabel = "Total Combined Payoff Payment";

      secondaries.push(
        { label: "Accelerated Payoff Timeline", value: monthsAccel < 999 ? `${Math.round((monthsAccel / 12) * 10) / 10} Years` : "Infinite", color: "#10b981" },
        { label: "Standard Payoff Timeline", value: monthsStandard < 999 ? `${Math.round((monthsStandard / 12) * 10) / 10} Years` : "Infinite" },
        { label: "Time Shaved Off", value: `${Math.round(yearsSaved * 10) / 10} Years`, color: "#fb923c" },
        { label: "Total Interest Saved", value: `$${Math.round(interestSaved).toLocaleString()}`, color: "#ea4c89" }
      );

      chartData.push(
        { label: "Accelerated Interest", value: intAccel, color: "#10b981" },
        { label: "Savings", value: interestSaved, color: "#ea4c89" }
      );
      break;
    }

    case "debt-to-income-calculator": {
      const income = v.grossAnnualIncome;
      const housing = v.monthlyHousing;
      const auto = v.monthlyAuto;
      const student = v.monthlyStudent;
      const card = v.monthlyCreditCard;
      const other = v.otherDebt;

      const grossMonthly = income / 12;
      const totalDebts = housing + auto + student + card + other;
      
      const frontEndDTI = grossMonthly > 0 ? (housing / grossMonthly) * 100 : 0;
      const backEndDTI = grossMonthly > 0 ? (totalDebts / grossMonthly) * 100 : 0;

      primaryValue = `${backEndDTI.toFixed(1)}%`;
      primaryLabel = "Your Total Back-End DTI Ratio";

      secondaries.push(
        { label: "Front-End DTI (Housing)", value: `${frontEndDTI.toFixed(1)}%`, color: "#3b82f6" },
        { label: "Total Monthly Debts", value: `$${Math.round(totalDebts).toLocaleString()}`, color: "#ea4c89" },
        { label: "Gross Monthly Income", value: `$${Math.round(grossMonthly).toLocaleString()}` },
        { label: "Lending Evaluation", value: backEndDTI <= 36 ? "Excellent (Low Risk)" : backEndDTI <= 43 ? "Moderate (Standard Limit)" : "High Risk", color: backEndDTI <= 43 ? "#10b981" : "#ef4444" }
      );

      chartData.push(
        { label: "Housing Costs", value: housing, color: "#3b82f6" },
        { label: "Consumer Debts", value: totalDebts - housing, color: "#ea4c89" },
        { label: "Net Cashflow", value: Math.max(0, grossMonthly - totalDebts), color: "#10b981" }
      );
      break;
    }

    case "compound-interest-calculator": {
      const principal = v.initialCapital;
      const contribution = v.monthlyContribution;
      const rate = v.interestRate / 100;
      const years = v.yearsToGrow;
      const freq = v.compounding; // 1 = annually, 4 = quarterly, 12 = monthly, 365 = daily

      let total = principal;
      const totalContributions = principal + (contribution * 12 * years);
      
      const months = years * 12;
      const compStep = 12 / freq;

      for (let m = 1; m <= months; m++) {
        total += contribution;
        if (m % compStep === 0 && rate > 0) {
          total = total * Math.pow(1 + rate/freq, freq/12 * compStep);
        }
      }

      const totalEarnings = Math.max(0, total - totalContributions);

      primaryValue = `$${Math.round(total).toLocaleString()}`;
      primaryLabel = "Future Compounded Wealth Projection";

      secondaries.push(
        { label: "Total Principal Deposited", value: `$${Math.round(totalContributions).toLocaleString()}`, color: "#3b82f6" },
        { label: "Compounded Interest Gains", value: `$${Math.round(totalEarnings).toLocaleString()}`, color: "#10b981" }
      );

      chartData.push(
        { label: "Contributions", value: totalContributions, color: "#3b82f6" },
        { label: "Compound Growth", value: totalEarnings, color: "#10b981" }
      );

      // Yearly Schedule Milestones
      for (let year = 1; year <= years; year += Math.ceil(years / 5)) {
        let checkTotal = principal;
        const totalPaid = principal + (contribution * 12 * year);
        for (let m = 1; m <= year * 12; m++) {
          checkTotal += contribution;
          if (m % compStep === 0 && rate > 0) {
            checkTotal = checkTotal * Math.pow(1 + rate/freq, freq/12 * compStep);
          }
        }
        schedule.push({
          period: `Year ${year}`,
          col1: `$${Math.round(totalPaid).toLocaleString()}`,
          col2: `$${Math.round(Math.max(0, checkTotal - totalPaid)).toLocaleString()}`,
          col3: `$${Math.round(checkTotal).toLocaleString()}`
        });
      }
      break;
    }

    case "simple-interest-calculator": {
      const principal = v.principal;
      const rate = v.rate;
      const years = v.years;

      const interest = principal * (rate / 100) * years;
      const total = principal + interest;

      primaryValue = `$${Math.round(total).toLocaleString()}`;
      primaryLabel = "Ending Balance (Simple Growth)";

      secondaries.push(
        { label: "Initial Capital Principal", value: `$${Math.round(principal).toLocaleString()}` },
        { label: "Linear Interest Earned", value: `$${Math.round(interest).toLocaleString()}`, color: "#10b981" }
      );

      chartData.push(
        { label: "Capital Principal", value: principal, color: "#3b82f6" },
        { label: "Linear Yield", value: interest, color: "#10b981" }
      );
      break;
    }

    case "cd-calculator": {
      const principal = v.principal;
      const apy = v.apy;
      const term = v.termMonths;

      const ratePerMonth = (apy / 100) / 12;
      const total = principal * Math.pow(1 + ratePerMonth, term);
      const interest = total - principal;
      
      // Standard 3-month interest penalty for early withdrawal
      const earlyWithdrawalPenalty = principal * ratePerMonth * 3;
      const afterPenalty = Math.max(principal, total - earlyWithdrawalPenalty);

      primaryValue = `$${Math.round(total).toLocaleString()}`;
      primaryLabel = "Certificate of Deposit Value at Maturity";

      secondaries.push(
        { label: "Original CD Deposit", value: `$${Math.round(principal).toLocaleString()}` },
        { label: "Interest Earned at Maturity", value: `$${Math.round(interest).toLocaleString()}`, color: "#10b981" },
        { label: "Early Withdrawal Penalty", value: `$${Math.round(earlyWithdrawalPenalty).toLocaleString()}`, color: "#ef4444" },
        { label: "CD Liquid Value (with Penalty)", value: `$${Math.round(afterPenalty).toLocaleString()}`, color: "#fb923c" }
      );

      chartData.push(
        { label: "Deposit Core", value: principal, color: "#3b82f6" },
        { label: "Maturity Yield", value: interest, color: "#10b981" }
      );
      break;
    }

    case "investment-growth-calculator": {
      const lumpSum = v.lumpSum;
      const rate = v.expectedReturn / 100;
      const years = v.holdingYears;
      const adjustInflation = v.adjustInflation === 1; // 1 = Yes, 0 = No
      const inflationRate = v.inflationRate !== undefined ? v.inflationRate / 100 : 0.025;

      const nominalTotal = lumpSum * Math.pow(1 + rate, years);
      const realTotal = adjustInflation ? nominalTotal / Math.pow(1 + inflationRate, years) : nominalTotal;
      const gains = realTotal - lumpSum;

      primaryValue = `$${Math.round(realTotal).toLocaleString()}`;
      primaryLabel = adjustInflation ? "Inflation-Adjusted Growth Value" : "Nominal Growth Value";

      secondaries.push(
        { label: "Initial Capital Invested", value: `$${Math.round(lumpSum).toLocaleString()}` },
        { label: "Inflation-Adjusted Value", value: `$${Math.round(nominalTotal / Math.pow(1 + inflationRate, years)).toLocaleString()}`, color: "#3b82f6" },
        { label: "Nominal Value (No Inflation)", value: `$${Math.round(nominalTotal).toLocaleString()}` },
        { label: "Portfolio Growth Returns", value: `$${Math.round(Math.max(0, gains)).toLocaleString()}`, color: "#10b981" }
      );

      chartData.push(
        { label: "Capital Lump Sum", value: lumpSum, color: "#3b82f6" },
        { label: "Net Earnings", value: Math.max(0, gains), color: "#10b981" }
      );
      break;
    }

    case "dollar-cost-averaging-calculator": {
      const amount = v.recurringAmount;
      const freq = v.frequency;
      const rate = v.growthRate / 100;
      const years = v.durationYears;

      const totalDeposits = amount * freq * years;
      const ratePerPeriod = rate / freq;
      const totalPeriods = freq * years;
      
      let finalValue = 0;
      if (ratePerPeriod > 0) {
        finalValue = amount * ((Math.pow(1 + ratePerPeriod, totalPeriods) - 1) / ratePerPeriod) * (1 + ratePerPeriod);
      } else {
        finalValue = totalDeposits;
      }
      const returns = finalValue - totalDeposits;

      primaryValue = `$${Math.round(finalValue).toLocaleString()}`;
      primaryLabel = "Total Value via Steady DCA Strategy";

      secondaries.push(
        { label: "Total Invested Capital", value: `$${Math.round(totalDeposits).toLocaleString()}`, color: "#3b82f6" },
        { label: "Compounded Portfolio Return", value: `$${Math.round(returns).toLocaleString()}`, color: "#10b981" }
      );

      chartData.push(
        { label: "Contributions", value: totalDeposits, color: "#3b82f6" },
        { label: "Gains", value: returns, color: "#10b981" }
      );
      break;
    }

    case "savings-goal-calculator": {
      const target = v.targetAmount;
      const starting = v.startingSavings;
      const years = v.yearsToSave;
      const apy = v.annualApy / 100;

      const totalMonths = years * 12;
      const monthlyRate = apy / 12;

      const compoundedStarting = starting * Math.pow(1 + monthlyRate, totalMonths);
      const remainingGoal = Math.max(0, target - compoundedStarting);

      let requiredMonthly = 0;
      if (monthlyRate > 0) {
        requiredMonthly = remainingGoal / (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
      } else {
        requiredMonthly = remainingGoal / totalMonths;
      }

      primaryValue = `$${Math.round(requiredMonthly).toLocaleString()}/mo`;
      primaryLabel = "Required Monthly Deposit to Meet Goal";

      secondaries.push(
        { label: "Goal Target", value: `$${Math.round(target).toLocaleString()}` },
        { label: "Future Value of Starting Cash", value: `$${Math.round(compoundedStarting).toLocaleString()}`, color: "#3b82f6" },
        { label: "Remaining Goal to Accumulate", value: `$${Math.round(remainingGoal).toLocaleString()}`, color: "#ea4c89" }
      );

      chartData.push(
        { label: "Future Starting Value", value: compoundedStarting, color: "#3b82f6" },
        { label: "Required Progress", value: remainingGoal, color: "#ea4c89" }
      );
      break;
    }

    case "401k-calculator": {
      const age = v.currentAge;
      const retire = v.retireAge;
      const salary = v.salary;
      const rate = v.contributionRate;
      const matchMaxRate = v.employerMatchRate;
      const matchPct = v.employerMatchPct / 100;
      const balance = v.currentBalance;
      const returns = v.expectedReturn / 100;

      const years = Math.max(1, retire - age);
      let total = balance;
      let cumulativePersonal = balance;
      let cumulativeMatch = 0;
      
      // IRS limit for 2026
      const limit401k = age >= 50 
        ? FINANCIAL_CONFIG_2026.retirementLimits.limit401k + FINANCIAL_CONFIG_2026.retirementLimits.catchUp401kAge50
        : FINANCIAL_CONFIG_2026.retirementLimits.limit401k;

      for (let y = 1; y <= years; y++) {
        const annualPersonalRaw = salary * (rate / 100);
        const annualPersonal = Math.min(annualPersonalRaw, limit401k);
        const annualMatchLimit = salary * (matchMaxRate / 100);
        const annualMatch = Math.min(annualPersonal * matchPct, annualMatchLimit);

        cumulativePersonal += annualPersonal;
        cumulativeMatch += annualMatch;

        total = (total + annualPersonal + annualMatch) * (1 + returns);
      }

      const totalEarned = Math.max(0, total - cumulativePersonal - cumulativeMatch);

      primaryValue = `$${Math.round(total).toLocaleString()}`;
      primaryLabel = `Projected 401(k) Nest Egg (Limits: ${FINANCIAL_CONFIG_2026.taxYear})`;

      secondaries.push(
        { label: "Your Cumulative Deposits", value: `$${Math.round(cumulativePersonal).toLocaleString()}`, color: "#3b82f6" },
        { label: "Employer Match Total", value: `$${Math.round(cumulativeMatch).toLocaleString()}`, color: "#10b981" },
        { label: "Compounded Growth Returns", value: `$${Math.round(totalEarned).toLocaleString()}`, color: "#ea4c89" }
      );

      chartData.push(
        { label: "Your Deposits", value: cumulativePersonal, color: "#3b82f6" },
        { label: "Employer Match", value: cumulativeMatch, color: "#10b981" },
        { label: "Investment Earnings", value: totalEarned, color: "#ea4c89" }
      );
      break;
    }

    case "roth-ira-calculator": {
      const age = v.currentAge;
      const retire = v.retirementAge;
      const startBalance = v.currentBalance;
      const contribution = v.monthlyContribution;
      const expectedReturn = v.expectedReturn / 100;

      const limitIRA = age >= 50
        ? FINANCIAL_CONFIG_2026.retirementLimits.limitIRA + FINANCIAL_CONFIG_2026.retirementLimits.catchUpIRAAge50
        : FINANCIAL_CONFIG_2026.retirementLimits.limitIRA;

      const years = Math.max(1, retire - age);
      const months = years * 12;
      const rPerMonth = expectedReturn / 12;

      let total = startBalance;
      let cumulativeDeposits = startBalance;

      for (let m = 1; m <= months; m++) {
        // Capping contribution annually
        const annualCont = contribution * 12;
        const cappedMonthly = annualCont > limitIRA ? limitIRA / 12 : contribution;
        total = (total + cappedMonthly) * (1 + rPerMonth);
        cumulativeDeposits += cappedMonthly;
      }

      const totalEarnings = Math.max(0, total - cumulativeDeposits);

      primaryValue = `$${Math.round(total).toLocaleString()}`;
      primaryLabel = "Projected Roth IRA Nest Egg (100% Tax-Free)";

      secondaries.push(
        { label: "Total Lifetime Deposits", value: `$${Math.round(cumulativeDeposits).toLocaleString()}`, color: "#3b82f6" },
        { label: "IRA Year Limit (2026)", value: `$${limitIRA.toLocaleString()}` },
        { label: "Tax-Free Compounded Gains", value: `$${Math.round(totalEarnings).toLocaleString()}`, color: "#10b981" }
      );

      chartData.push(
        { label: "Contributions", value: cumulativeDeposits, color: "#3b82f6" },
        { label: "Compound Gains", value: totalEarnings, color: "#10b981" }
      );
      break;
    }

    case "traditional-ira-calculator": {
      const age = v.currentAge;
      const retire = v.retirementAge;
      const startBalance = v.currentBalance;
      const contribution = v.monthlyContribution;
      const bracket = v.taxBracket;
      const expectedReturn = v.expectedReturn / 100;

      const limitIRA = age >= 50
        ? FINANCIAL_CONFIG_2026.retirementLimits.limitIRA + FINANCIAL_CONFIG_2026.retirementLimits.catchUpIRAAge50
        : FINANCIAL_CONFIG_2026.retirementLimits.limitIRA;

      const years = Math.max(1, retire - age);
      const months = years * 12;
      const rPerMonth = expectedReturn / 12;

      let total = startBalance;
      let cumulativeDeposits = startBalance;

      for (let m = 1; m <= months; m++) {
        const annualCont = contribution * 12;
        const cappedMonthly = annualCont > limitIRA ? limitIRA / 12 : contribution;
        total = (total + cappedMonthly) * (1 + rPerMonth);
        cumulativeDeposits += cappedMonthly;
      }

      const totalEarnings = Math.max(0, total - cumulativeDeposits);
      const immediateTaxSavings = (cumulativeDeposits - startBalance) * (bracket / 100);
      const afterTaxWithdrawal = total * 0.85; // assume average 15% retirement tax bracket on traditional

      primaryValue = `$${Math.round(total).toLocaleString()}`;
      primaryLabel = "Estimated Traditional IRA Nest Egg";

      secondaries.push(
        { label: "Total Principal Deposits", value: `$${Math.round(cumulativeDeposits).toLocaleString()}` },
        { label: "Immediate Tax Savings Today", value: `$${Math.round(immediateTaxSavings).toLocaleString()}`, color: "#10b981" },
        { label: "Deferred Growth Earnings", value: `$${Math.round(totalEarnings).toLocaleString()}`, color: "#ea4c89" },
        { label: "Estimated Net After-Tax Value", value: `$${Math.round(afterTaxWithdrawal).toLocaleString()}`, color: "#3b82f6" }
      );

      chartData.push(
        { label: "Contributions", value: cumulativeDeposits, color: "#3b82f6" },
        { label: "Tax Savings Saved", value: immediateTaxSavings, color: "#10b981" },
        { label: "Deferred Gains", value: totalEarnings, color: "#ea4c89" }
      );
      break;
    }

    case "retirement-calculator": {
      const age = v.currentAge;
      const retire = v.retirementAge;
      const savings = v.currentSavings;
      const monthly = v.monthlySavings;
      const targetAnnual = v.annualIncomeNeeded;
      const rate = v.expectedReturn / 100;

      const years = Math.max(1, retire - age);
      const targetNestEgg = targetAnnual / 0.04; // Standard 4% safe withdrawal rule

      let total = savings;
      const totalDeposits = savings + (monthly * 12 * years);

      for (let m = 1; m <= years * 12; m++) {
        total = (total + monthly) * (1 + rate / 12);
      }

      const progressPercent = Math.min(100, (total / targetNestEgg) * 100);
      const safeAnnualPayout = total * 0.04;

      // Depletion/Annuity sustainability formula
      // Years = -ln(1 - (Balance * r) / Annual_Withdrawal) / ln(1 + r)
      let yearsLast = 0;
      const annualReturnRate = 0.05; // conservative retirement asset return
      if (safeAnnualPayout >= targetAnnual) {
        yearsLast = 999; // lasts forever
      } else {
        const valToInvert = 1 - (total * annualReturnRate) / targetAnnual;
        if (valToInvert <= 0) {
          yearsLast = 999; // sustainable indefinitely
        } else {
          yearsLast = -Math.log(valToInvert) / Math.log(1 + annualReturnRate);
        }
      }

      primaryValue = `$${Math.round(total).toLocaleString()}`;
      primaryLabel = "Estimated Nest Egg at Retirement";

      secondaries.push(
        { label: "Target Nest Egg Needed", value: `$${Math.round(targetNestEgg).toLocaleString()}`, color: "#ea4c89" },
        { label: "Goal Progress Achieved", value: `${progressPercent.toFixed(1)}%`, color: progressPercent >= 100 ? "#10b981" : "#fb923c" },
        { label: "Sustainable Annual Payout", value: `$${Math.round(safeAnnualPayout).toLocaleString()}/yr`, color: "#10b981" },
        { label: "Years Savings Will Last", value: yearsLast >= 999 ? "Indefinitely" : `${Math.ceil(yearsLast)} Years`, color: "#3b82f6" }
      );

      chartData.push(
        { label: "Projected Nest Egg", value: total, color: "#3b82f6" },
        { label: "Goal Deficit Gap", value: Math.max(0, targetNestEgg - total), color: "#ea4c89" }
      );
      break;
    }

    case "social-security-calculator": {
      const wages = v.annualWages;
      const claimAge = v.claimingAge;

      // SSA PIA bend point guidelines
      const averageMonthlyWages = wages / 12;
      let pia = 0;
      if (averageMonthlyWages <= 1200) {
        pia = averageMonthlyWages * 0.9;
      } else if (averageMonthlyWages <= 7200) {
        pia = (1200 * 0.9) + ((averageMonthlyWages - 1200) * 0.32);
      } else {
        pia = (1200 * 0.9) + (6000 * 0.32) + ((averageMonthlyWages - 7200) * 0.15);
      }
      pia = Math.min(3850, pia); // Maximum SSA cap projection

      // Standard SSA claiming adjustments relative to Full Retirement Age (67)
      let adjustment = 1.0;
      if (claimAge < 67) {
        // Reductions: 5/9% (0.555%) per month for first 36 months, then 5/12% (0.417%)
        const monthsEarly = (67 - claimAge) * 12;
        let reduction = 0;
        if (monthsEarly <= 36) {
          reduction = monthsEarly * (5 / 900);
        } else {
          reduction = (36 * (5 / 900)) + ((monthsEarly - 36) * (5 / 1200));
        }
        adjustment = Math.max(0.3, 1 - reduction);
      } else if (claimAge > 67) {
        // Increases: 2/3% (0.667%) per month up to age 70 (36 months maximum)
        const monthsLate = Math.min(36, (claimAge - 67) * 12);
        adjustment = 1 + (monthsLate * (2 / 300));
      }

      const monthlyBenefit = pia * adjustment;

      primaryValue = `$${Math.round(monthlyBenefit).toLocaleString()}/mo`;
      primaryLabel = `Estimated Monthly SSA Benefit (Age ${claimAge})`;

      secondaries.push(
        { label: "Base Benefit at FRA (67)", value: `$${Math.round(pia).toLocaleString()}/mo` },
        { label: "Delayed Claiming Credit Ratio", value: `${Math.round(adjustment * 100)}%` },
        { label: "Estimated Annualized Payout", value: `$${Math.round(monthlyBenefit * 12).toLocaleString()}`, color: "#10b981" }
      );

      chartData.push(
        { label: "Your Estimated Benefit", value: monthlyBenefit, color: "#10b981" },
        { label: "SSA Max Cap Limit", value: 3850, color: "#ea4c89" }
      );
      break;
    }

    case "paycheck-calculator": {
      const annualSalary = v.grossPay;
      const freq = v.frequency; // pay periods per year (e.g. 12, 26, 52)
      const deductions = v.deductions;

      const grossPerCheck = annualSalary / freq;
      
      // Calculate federal tax, FICA taxes using progressive tax tables
      const annualDeductions = deductions * freq;
      const taxableIncome = Math.max(0, annualSalary - annualDeductions - FINANCIAL_CONFIG_2026.taxBrackets.standardDeductionSingle);
      const annualFedTax = calculateFederalTax(taxableIncome, false);
      const fedTaxPerCheck = annualFedTax / freq;

      const socialSecurityPerCheck = (Math.min(annualSalary, FINANCIAL_CONFIG_2026.fica.socialSecurityWageCap) * FINANCIAL_CONFIG_2026.fica.socialSecurityRate) / freq;
      const medicarePerCheck = (annualSalary * FINANCIAL_CONFIG_2026.fica.medicareRate) / freq;
      const stateTaxPerCheck = (annualSalary * 0.045) / freq; // Assumed flat 4.5% state income tax

      const totalTaxes = fedTaxPerCheck + socialSecurityPerCheck + medicarePerCheck + stateTaxPerCheck;
      const netTakeHome = Math.max(0, grossPerCheck - totalTaxes - deductions);

      primaryValue = `$${Math.round(netTakeHome).toLocaleString()}`;
      primaryLabel = "Estimated Net Take-Home Paycheck";

      secondaries.push(
        { label: "Gross Salary Per Pay Period", value: `$${Math.round(grossPerCheck).toLocaleString()}` },
        { label: "Federal Income Tax Portion", value: `$${Math.round(fedTaxPerCheck).toLocaleString()}`, color: "#ea4c89" },
        { label: "FICA (SS + Medicare)", value: `$${Math.round(socialSecurityPerCheck + medicarePerCheck).toLocaleString()}`, color: "#fb923c" },
        { label: "Estimated State Tax Portion", value: `$${Math.round(stateTaxPerCheck).toLocaleString()}`, color: "#3b82f6" },
        { label: "Personal Pre-Tax Deductions", value: `$${Math.round(deductions).toLocaleString()}`, color: "#10b981" }
      );

      chartData.push(
        { label: "Take-Home Net", value: netTakeHome, color: "#10b981" },
        { label: "Taxes Withheld", value: totalTaxes, color: "#ea4c89" },
        { label: "Deductions", value: deductions, color: "#3b82f6" }
      );
      break;
    }

    case "salary-calculator": {
      const salary = v.annualSalary;
      const hours = v.hoursPerWeek;
      const weeks = v.paidWeeks;

      const totalHours = hours * weeks;
      const hourlyRate = totalHours > 0 ? salary / totalHours : 0;
      const monthly = salary / 12;
      const biweekly = salary / 26;
      const weekly = salary / weeks;

      primaryValue = `$${Math.round(salary).toLocaleString()}/yr`;
      primaryLabel = "Equivalent Annualized Base Salary";

      secondaries.push(
        { label: "Hourly Equivalent Wage", value: `$${hourlyRate.toFixed(2)}/hr`, color: "#10b981" },
        { label: "Monthly Equivalency", value: `$${Math.round(monthly).toLocaleString()}/mo`, color: "#3b82f6" },
        { label: "Biweekly Equivalency", value: `$${Math.round(biweekly).toLocaleString()}/period` },
        { label: "Weekly Equivalency", value: `$${Math.round(weekly).toLocaleString()}/wk` }
      );

      chartData.push(
        { label: "Monthly Equivalent", value: monthly, color: "#3b82f6" },
        { label: "Weekly Equivalent", value: weekly, color: "#10b981" }
      );
      break;
    }

    case "hourly-to-salary-calculator": {
      const hourlyRate = v.hourlyRate;
      const weeklyHours = v.weeklyHours;
      const weeksWorked = v.weeksWorked;

      // Overtime logic: hours > 40 is paid at 1.5x standard
      let weeklyPay = 0;
      if (weeklyHours > 40) {
        weeklyPay = (40 * hourlyRate) + ((weeklyHours - 40) * hourlyRate * 1.5);
      } else {
        weeklyPay = weeklyHours * hourlyRate;
      }

      const annual = weeklyPay * weeksWorked;
      const monthly = annual / 12;

      primaryValue = `$${Math.round(annual).toLocaleString()}/yr`;
      primaryLabel = "Equivalent Annualized Salary (with Overtime)";

      secondaries.push(
        { label: "Base Hourly Rate", value: `$${hourlyRate.toFixed(2)}/hr` },
        { label: "Estimated Weekly Pay", value: `$${Math.round(weeklyPay).toLocaleString()}/wk`, color: "#10b981" },
        { label: "Monthly Income Equivalent", value: `$${Math.round(monthly).toLocaleString()}/mo`, color: "#3b82f6" },
        { label: "Working Hours Per Year", value: `${weeklyHours * weeksWorked} Hours` }
      );

      chartData.push(
        { label: "Annual Equivalency", value: annual, color: "#10b981" }
      );
      break;
    }

    case "income-tax-calculator": {
      const income = v.grossIncome;
      const status = v.filingStatus; // 1 = Single, 2 = Married

      const isMarried = status === 2;
      const deduction = isMarried 
        ? FINANCIAL_CONFIG_2026.taxBrackets.standardDeductionMarried 
        : FINANCIAL_CONFIG_2026.taxBrackets.standardDeductionSingle;

      const taxable = Math.max(0, income - deduction);
      const tax = calculateFederalTax(taxable, isMarried);
      const effectiveRate = income > 0 ? (tax / income) * 100 : 0;

      primaryValue = `$${Math.round(tax).toLocaleString()}`;
      primaryLabel = `Estimated Federal Income Tax Owed (Tax Year: ${FINANCIAL_CONFIG_2026.taxYear})`;

      secondaries.push(
        { label: "Effective Tax Rate", value: `${effectiveRate.toFixed(1)}%`, color: "#ea4c89" },
        { label: "Applied Standard Deduction", value: `$${Math.round(deduction).toLocaleString()}`, color: "#3b82f6" },
        { label: "Net Taxable Income", value: `$${Math.round(taxable).toLocaleString()}`, color: "#10b981" }
      );

      chartData.push(
        { label: "Take-Home Net", value: Math.max(0, income - tax), color: "#10b981" },
        { label: "Federal Income Tax", value: tax, color: "#ea4c89" },
        { label: "Standard Deduction", value: deduction, color: "#3b82f6" }
      );
      break;
    }

    case "net-worth-calculator": {
      const cash = v.cashAndLiquid;
      const retirement = v.retirementAccounts;
      const home = v.homeValue;
      const other = v.otherAssets;
      const mortgage = v.mortgageBalance;
      const otherDebt = v.otherDebtBalance;

      const assets = cash + retirement + home + other;
      const liabilities = mortgage + otherDebt;
      const netWorth = assets - liabilities;

      primaryValue = `$${Math.round(netWorth).toLocaleString()}`;
      primaryLabel = "Your Computed Net Worth Standing";

      secondaries.push(
        { label: "Total Wealth Assets", value: `$${Math.round(assets).toLocaleString()}`, color: "#10b981" },
        { label: "Total Outstanding Debt", value: `$${Math.round(liabilities).toLocaleString()}`, color: "#ea4c89" }
      );

      chartData.push(
        { label: "Net Asset Worth", value: Math.max(0, netWorth), color: "#10b981" },
        { label: "Debt Obligations", value: liabilities, color: "#ea4c89" }
      );
      break;
    }

    case "inflation-calculator": {
      const present = v.presentCost;
      const years = v.years;
      const inflation = v.inflationRate / 100;

      const futureCost = present * Math.pow(1 + inflation, years);
      const erodedPower = present / Math.pow(1 + inflation, years);

      primaryValue = `$${Math.round(futureCost).toLocaleString()}`;
      primaryLabel = `Cost of Goods in ${years} Years`;

      secondaries.push(
        { label: "Initial Good Cost Today", value: `$${Math.round(present).toLocaleString()}` },
        { label: "Equivalent Value Value Later", value: `$${erodedPower.toFixed(2)}`, color: "#ea4c89" },
        { label: "Cumulative Purchasing Power Drop", value: `${Math.round((1 - (erodedPower / present)) * 100)}%`, color: "#ea4c89" }
      );

      chartData.push(
        { label: "Starting Cost", value: present, color: "#3b82f6" },
        { label: "Future Inflation Gap", value: futureCost - present, color: "#ea4c89" }
      );
      break;
    }

    case "roi-calculator": {
      const cost = v.initialCost;
      const ending = v.endingValue;
      const years = v.yearsHeld;

      const roi = cost > 0 ? ((ending - cost) / cost) * 100 : 0;
      const annualized = (cost > 0 && ending > 0 && years > 0) ? (Math.pow(ending / cost, 1 / years) - 1) * 100 : 0;

      primaryValue = `${roi.toFixed(1)}%`;
      primaryLabel = "Total Percentage Return (ROI)";

      secondaries.push(
        { label: "Annualized Rate of Return (CAGR)", value: `${annualized.toFixed(1)}%`, color: "#10b981" },
        { label: "Net Financial Asset Gain", value: `$${Math.round(ending - cost).toLocaleString()}`, color: "#10b981" },
        { label: "Initial Capital Outlay", value: `$${Math.round(cost).toLocaleString()}` }
      );

      chartData.push(
        { label: "Principal Outlay", value: cost, color: "#3b82f6" },
        { label: "Net Returns", value: ending - cost, color: "#10b981" }
      );
      break;
    }

    case "break-even-calculator": {
      const fixed = v.fixedCosts;
      const price = v.unitPrice;
      const variable = v.variableCost;

      const contributionMargin = Math.max(0, price - variable);
      const units = contributionMargin > 0 ? Math.ceil(fixed / contributionMargin) : 0;
      const revenue = units * price;

      primaryValue = `${units.toLocaleString()} Units`;
      primaryLabel = "Required Sales Break-Even Target";

      secondaries.push(
        { label: "Required Sales Revenue", value: `$${Math.round(revenue).toLocaleString()}`, color: "#10b981" },
        { label: "Contribution Margin Per Unit", value: `$${contributionMargin.toFixed(2)}`, color: "#3b82f6" },
        { label: "Fixed Operating Expenses", value: `$${Math.round(fixed).toLocaleString()}`, color: "#ea4c89" }
      );

      chartData.push(
        { label: "Break-Even Sales Required", value: units, color: "#10b981" }
      );
      break;
    }

    case "credit-card-payoff-calculator": {
      const balance = v.cardBalance;
      const apr = v.apr / 100;
      const fixedPayment = v.monthlyPayment;

      // Scenario 1: Fixed monthly payment simulation
      let remFixed = balance;
      let fixedMonths = 0;
      let fixedInterest = 0;
      while (remFixed > 0 && fixedMonths < 360) {
        const mInterest = remFixed * (apr / 12);
        fixedInterest += mInterest;
        const mPrincipal = fixedPayment - mInterest;
        if (mPrincipal <= 0) {
          fixedMonths = 999;
          break;
        }
        remFixed -= mPrincipal;
        fixedMonths++;
      }

      // Scenario 2: Minimum monthly payment simulation (2% of balance or $25)
      let remMin = balance;
      let minMonths = 0;
      let minInterest = 0;
      while (remMin > 0 && minMonths < 600) {
        const calculatedMin = Math.max(remMin * 0.02, 25);
        const mInterest = remMin * (apr / 12);
        minInterest += mInterest;
        const mPrincipal = calculatedMin - mInterest;
        if (mPrincipal <= 0) {
          minMonths = 999;
          break;
        }
        remMin -= Math.min(remMin, mPrincipal);
        minMonths++;
      }

      primaryValue = fixedMonths < 999 ? `${fixedMonths} Months` : "Never (Increase Payment)";
      primaryLabel = "Estimated Fixed-Payment Payoff Time";

      secondaries.push(
        { label: "Total Interest Paid (Fixed)", value: fixedMonths < 999 ? `$${Math.round(fixedInterest).toLocaleString()}` : "Infinite", color: "#ea4c89" },
        { label: "Interest Paid (Minimums only)", value: minMonths < 999 ? `$${Math.round(minInterest).toLocaleString()}` : "Infinite", color: "#ef4444" },
        { label: "Minimum-Payment Payoff Time", value: minMonths < 999 ? `${minMonths} Months` : "Never", color: "#fb923c" },
        { label: "Total Cost of Interest Saved", value: (fixedMonths < 999 && minMonths < 999) ? `$${Math.round(Math.max(0, minInterest - fixedInterest)).toLocaleString()}` : "Infinite", color: "#10b981" }
      );

      chartData.push(
        { label: "Outstanding debt", value: balance, color: "#3b82f6" },
        { label: "Interest Outflow", value: fixedInterest, color: "#ea4c89" }
      );
      break;
    }

    case "debt-payoff-calculator": {
      const debt = v.totalDebt;
      const rate = v.averageRate / 100;
      const payment = v.monthlyBasePayment;
      const extra = v.extraMonthlyBudget;

      const totalPay = payment + extra;

      // Simulate genuine Avalanche vs Snowball algorithms by partitioning debt into 3 standard consumer sub-debts
      // Credit Card (20%, 22% rate), Auto (30%, 7.5% rate), Student (50%, 5.5% rate)
      interface DebtItem {
        id: string;
        name: string;
        balance: number;
        rate: number;
        minPayment: number;
      }

      const makeDebts = (): DebtItem[] => [
        { id: "cc", name: "Credit Card", balance: debt * 0.20, rate: 0.22, minPayment: Math.max(25, (debt * 0.20) * 0.02) },
        { id: "auto", name: "Auto Loan", balance: debt * 0.30, rate: 0.075, minPayment: (debt * 0.30) / 60 },
        { id: "student", name: "Student Loan", balance: debt * 0.50, rate: 0.055, minPayment: (debt * 0.50) / 120 }
      ];

      // Standard payoff (no extra)
      const simulateStandard = () => {
        const debts = makeDebts();
        let months = 0;
        let interest = 0;
        let active = true;
        while (active && months < 360) {
          let hasBalance = false;
          let monthInt = 0;
          for (const d of debts) {
            if (d.balance > 0) {
              hasBalance = true;
              const mInterest = d.balance * (d.rate / 12);
              monthInt += mInterest;
              const principalPaid = Math.min(d.balance, d.minPayment - mInterest);
              d.balance -= Math.max(0, principalPaid);
            }
          }
          interest += monthInt;
          if (!hasBalance) { active = false; break; }
          months++;
        }
        return { months, interest };
      };

      // Avalanche Payoff (Sort descending rate)
      const simulateAvalanche = () => {
        const debts = makeDebts().sort((a,b) => b.rate - a.rate);
        let months = 0;
        let interest = 0;
        let active = true;
        while (active && months < 360) {
          let hasBalance = false;
          let extraRemaining = extra;
          let monthInt = 0;

          // 1. Pay all minimum interest/minPayments first
          for (const d of debts) {
            if (d.balance > 0) {
              hasBalance = true;
              const mInterest = d.balance * (d.rate / 12);
              monthInt += mInterest;
              const standardPrin = Math.min(d.balance, d.minPayment - mInterest);
              d.balance -= Math.max(0, standardPrin);
            }
          }

          // 2. Roll excess extra budget onto highest rate debt
          for (const d of debts) {
            if (d.balance > 0 && extraRemaining > 0) {
              const extraApplied = Math.min(d.balance, extraRemaining);
              d.balance -= extraApplied;
              extraRemaining -= extraApplied;
            }
          }

          interest += monthInt;
          if (!hasBalance) { active = false; break; }
          months++;
        }
        return { months, interest };
      };

      // Snowball Payoff (Sort ascending balance)
      const simulateSnowball = () => {
        const debts = makeDebts().sort((a,b) => a.balance - b.balance);
        let months = 0;
        let interest = 0;
        let active = true;
        while (active && months < 360) {
          let hasBalance = false;
          let extraRemaining = extra;
          let monthInt = 0;

          // 1. Pay minimums
          for (const d of debts) {
            if (d.balance > 0) {
              hasBalance = true;
              const mInterest = d.balance * (d.rate / 12);
              monthInt += mInterest;
              const standardPrin = Math.min(d.balance, d.minPayment - mInterest);
              d.balance -= Math.max(0, standardPrin);
            }
          }

          // 2. Roll excess extra budget onto smallest balance debt
          for (const d of debts) {
            if (d.balance > 0 && extraRemaining > 0) {
              const extraApplied = Math.min(d.balance, extraRemaining);
              d.balance -= extraApplied;
              extraRemaining -= extraApplied;
            }
          }

          interest += monthInt;
          if (!hasBalance) { active = false; break; }
          months++;
        }
        return { months, interest };
      };

      const stdRes = simulateStandard();
      const avaRes = simulateAvalanche();
      const snoRes = simulateSnowball();

      const totalInterestSaved = Math.max(0, stdRes.interest - avaRes.interest);
      const snowballSavedInterest = Math.max(0, stdRes.interest - snoRes.interest);

      primaryValue = `${avaRes.months} Months`;
      primaryLabel = "Debt Free Date (Avalanche Strategy)";

      secondaries.push(
        { label: "Standard Payoff Timeline", value: `${stdRes.months} Months` },
        { label: "Snowball Strategy Payoff", value: `${snoRes.months} Months`, color: "#fb923c" },
        { label: "Avalanche Interest Saved", value: `$${Math.round(totalInterestSaved).toLocaleString()}`, color: "#10b981" },
        { label: "Snowball Interest Saved", value: `$${Math.round(snowballSavedInterest).toLocaleString()}`, color: "#3b82f6" }
      );

      chartData.push(
        { label: "Avalanche Interest Paid", value: avaRes.interest, color: "#10b981" },
        { label: "Snowball Interest Paid", value: snoRes.interest, color: "#fb923c" },
        { label: "Standard Interest Paid", value: stdRes.interest, color: "#ea4c89" }
      );
      break;
    }

    case "home-affordability-calculator": {
      const income = v.annualIncome;
      const down = v.cashDown;
      const debt = v.monthlyDebts;
      const rate = v.interestRate;

      const monthlyGross = income / 12;
      // 28/36 qualifying rule limits
      const frontEndLimit = monthlyGross * 0.28;
      const backEndLimit = Math.max(0, (monthlyGross * 0.36) - debt);
      const maxHousingPayment = Math.min(frontEndLimit, backEndLimit);

      // Max housing P&I is estimated around 85% after property tax and insurance
      const maxPI = maxHousingPayment * 0.85;
      const mRate = (rate / 100) / 12;
      const months = 360; // 30-yr standard term

      let maxLoan = 0;
      if (mRate > 0) {
        maxLoan = maxPI / ((mRate * Math.pow(1 + mRate, months)) / (Math.pow(1 + mRate, months) - 1));
      } else {
        maxLoan = maxPI * months;
      }

      const affordablePrice = maxLoan + down;

      primaryValue = `$${Math.round(affordablePrice).toLocaleString()}`;
      primaryLabel = "Maximum Safe Home Purchase Price";

      secondaries.push(
        { label: "Max Safe Monthly PITI", value: `$${Math.round(maxHousingPayment).toLocaleString()}`, color: "#ea4c89" },
        { label: "Maximum Mortgage Loan", value: `$${Math.round(maxLoan).toLocaleString()}`, color: "#3b82f6" },
        { label: "Your Cash Down Payment", value: `$${Math.round(down).toLocaleString()}`, color: "#10b981" }
      );

      chartData.push(
        { label: "Down Payment", value: down, color: "#10b981" },
        { label: "Mortgage Loan Principal", value: maxLoan, color: "#3b82f6" }
      );
      break;
    }

    case "rent-vs-buy-calculator": {
      const rent = v.monthlyRent;
      const purchasePrice = v.purchasePrice;
      const down = v.downPayment;
      const plannedYears = v.plannedYears;
      const appreciation = v.appreciationRate / 100;

      // 1. Calculate Renting cost
      const annualRentEscalation = 0.035; // standard 3.5% rental inflation
      let totalRentPaid = 0;
      let activeRent = rent;
      for (let y = 1; y <= plannedYears; y++) {
        totalRentPaid += activeRent * 12;
        activeRent *= (1 + annualRentEscalation);
      }
      // Opportunity cost of investing down payment elsewhere
      const opportunityCost = down * (Math.pow(1 + 0.07, plannedYears) - 1); // 7% standard market return

      const grossRentCost = totalRentPaid + opportunityCost;

      // 2. Calculate Buying cost
      const loanAmount = purchasePrice - down;
      const rate = 0.065; // standard standard mortgage rate
      const mRate = rate / 12;
      const termMonths = 360;
      
      let monthlyPI = 0;
      if (mRate > 0) {
        monthlyPI = loanAmount * (mRate * Math.pow(1 + mRate, termMonths)) / (Math.pow(1 + mRate, termMonths) - 1);
      } else {
        monthlyPI = loanAmount / termMonths;
      }
      
      const totalPIPaid = monthlyPI * 12 * plannedYears;
      const propertyTaxes = purchasePrice * 0.0125 * plannedYears; // 1.25% property taxes
      const maintenance = purchasePrice * 0.01 * plannedYears; // 1% annual maintenance
      const closingCosts = purchasePrice * 0.05; // 5% buying/selling transaction fees
      
      const homeAppreciatedValue = purchasePrice * Math.pow(1 + appreciation, plannedYears);
      const equityBuilt = homeAppreciatedValue - purchasePrice; // equity gain
      
      const netBuyCost = Math.max(0, (totalPIPaid + propertyTaxes + maintenance + closingCosts + down) - equityBuilt);

      const buyingSaves = grossRentCost - netBuyCost;

      primaryValue = buyingSaves > 0 ? "BUYING is cheaper" : "RENTING is cheaper";
      primaryLabel = `Preferred Cost Path (Over ${plannedYears} Years)`;

      secondaries.push(
        { label: "Renting Cumulative Cost", value: `$${Math.round(grossRentCost).toLocaleString()}`, color: "#ea4c89" },
        { label: "Buying Net Cost", value: `$${Math.round(netBuyCost).toLocaleString()}`, color: "#3b82f6" },
        { label: "Appreciated Equity Gained", value: `$${Math.round(equityBuilt).toLocaleString()}`, color: "#10b981" },
        { label: "Net Cost Difference Savings", value: `$${Math.round(Math.abs(buyingSaves)).toLocaleString()}` }
      );

      chartData.push(
        { label: "Renting Outflow", value: grossRentCost, color: "#ea4c89" },
        { label: "Buying Net Outflow", value: netBuyCost, color: "#3b82f6" }
      );
      break;
    }

    default:
      primaryValue = "$0";
      primaryLabel = "Result";
  }

  return { primaryValue, primaryLabel, secondaries, chartData, schedule };
};
