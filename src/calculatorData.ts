export interface CalculatorInput {
  name: string;
  label: string;
  type: 'number' | 'select';
  default: number;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export interface CalculatorFAQ {
  q: string;
  a: string;
}

export interface Calculator {
  id: string;
  name: string;
  category: string;
  benefit: string;
  description: string;
  formula: string;
  howToUse: string[];
  faqs: CalculatorFAQ[];
  inputs: CalculatorInput[];
}

export const CATEGORIES = [
  "Loan",
  "Investment",
  "Retirement",
  "Salary & Tax",
  "General Finance",
  "Real Estate"
];

export const CALCULATORS: Calculator[] = [
  {
    id: "mortgage-calculator",
    name: "Mortgage Calculator",
    category: "Loan",
    benefit: "Estimate Your Monthly Mortgage Payment",
    description: "Calculate your monthly mortgage payment including principal, interest, taxes, insurance, and HOA dues. Learn how your down payment affects your monthly obligation.",
    formula: "M = P [ i(1 + i)^n ] / [ (1 + i)^n - 1 ]",
    howToUse: [
      "Enter the home purchase price and your intended down payment.",
      "Input the interest rate and selected loan term (usually 15 or 30 years).",
      "Optionally add estimated annual property taxes, homeowners insurance, and monthly HOA fees.",
      "View the live breakdown of your monthly P&I, tax, and insurance costs."
    ],
    faqs: [
      {
        q: "What is included in a standard monthly mortgage payment (PITI)?",
        a: "A standard mortgage payment consists of Principal (paying off the loan balance), Interest (the lender's fee), Taxes (local property taxes), and Insurance (homeowners insurance). This is commonly abbreviated as PITI."
      },
      {
        q: "How does the down payment affect my monthly payment?",
        a: "A larger down payment reduces the total loan amount (Principal), lowering your monthly interest and principal payments. Additionally, putting down less than 20% typically requires you to pay Private Mortgage Insurance (PMI)."
      },
      {
        q: "What is the difference between a 15-year and 30-year term?",
        a: "A 30-year term offers lower monthly payments but results in significantly higher total interest paid over the life of the loan. A 15-year term has higher monthly payments but allows you to build equity faster and save tens of thousands in interest."
      }
    ],
    inputs: [
      { name: "homePrice", label: "Home Price ($)", type: "number", default: 400000, min: 50000, max: 5000000, step: 5000 },
      { name: "downPayment", label: "Down Payment ($)", type: "number", default: 80000, min: 0, max: 2000000, step: 2000 },
      { name: "interestRate", label: "Interest Rate (%)", type: "number", default: 6.5, min: 1, max: 15, step: 0.1 },
      { name: "loanTerm", label: "Loan Term (Years)", type: "select", default: 30, options: ["10", "15", "20", "30"] },
      { name: "propertyTax", label: "Annual Property Tax (%)", type: "number", default: 1.2, min: 0, max: 5, step: 0.1 },
      { name: "insurance", label: "Annual Homeowners Insurance ($)", type: "number", default: 1200, min: 0, max: 10000, step: 100 },
      { name: "hoa", label: "Monthly HOA Fee ($)", type: "number", default: 0, min: 0, max: 2000, step: 10 }
    ]
  },
  {
    id: "mortgage-refinance-calculator",
    name: "Mortgage Refinance Calculator",
    category: "Loan",
    benefit: "Determine Refinance Savings & Break-Even Point",
    description: "Compare your current mortgage details against refinance terms to find out if refinancing will reduce your monthly payments, save total interest, and calculate your exact break-even timeline.",
    formula: "Savings = Current Monthly Payment - Refinanced Monthly Payment",
    howToUse: [
      "Input your current remaining loan balance, current interest rate, and current monthly payment.",
      "Enter the new interest rate, new loan term, and the closing costs of the refinance.",
      "Review your net monthly savings and how many months it will take to recover the refinance closing costs."
    ],
    faqs: [
      {
        q: "When does it make financial sense to refinance?",
        a: "Refinancing makes sense if you can lower your interest rate enough to recoup the closing costs within your expected time living in the home. This transition period is known as the 'break-even' point."
      },
      {
        q: "What are refinance closing costs?",
        a: "Refinance closing costs typically range from 2% to 5% of the loan amount and include origination fees, appraisal fees, title search fees, and credit checks."
      }
    ],
    inputs: [
      { name: "loanBalance", label: "Remaining Loan Balance ($)", type: "number", default: 300000, min: 10000, max: 2000000, step: 5000 },
      { name: "currentRate", label: "Current Interest Rate (%)", type: "number", default: 7.2, min: 1, max: 15, step: 0.1 },
      { name: "newRate", label: "New Interest Rate (%)", type: "number", default: 5.8, min: 1, max: 15, step: 0.1 },
      { name: "newTerm", label: "New Term (Years)", type: "select", default: 30, options: ["15", "30"] },
      { name: "closingCosts", label: "Closing Costs ($)", type: "number", default: 4500, min: 500, max: 30000, step: 100 }
    ]
  },
  {
    id: "auto-loan-calculator",
    name: "Auto Loan Calculator",
    category: "Loan",
    benefit: "Calculate Monthly Car Loan Payments",
    description: "Estimate your monthly vehicle financing costs. Adjust your vehicle price, down payment, trade-in value, local taxes, and term length to match your dealership terms.",
    formula: "Monthly Payment = P * [ r(1+r)^n ] / [ (1+r)^n - 1 ] (where P is adjusted for trade-in and tax)",
    howToUse: [
      "Enter the vehicle purchase price and any dealer fees.",
      "Add your down payment amount and any trade-in value credit you expect to receive.",
      "Select your interest rate and loan term (expressed in months, typically 36 to 84 months).",
      "Input the state sales tax percentage to calculate the total financed value."
    ],
    faqs: [
      {
        q: "What is a safe auto loan term length?",
        a: "While 72 and 84-month auto loans offer lower monthly payments, they increase the total interest significantly and risk putting you 'underwater' (owing more than the car is worth). Aim for 36 to 60 months."
      },
      {
        q: "Does my credit score affect my auto loan rate?",
        a: "Yes, car dealerships and banks offer the lowest interest rates to individuals with credit scores above 740. Lower credit scores will see higher APRs."
      }
    ],
    inputs: [
      { name: "carPrice", label: "Vehicle Price ($)", type: "number", default: 35000, min: 2000, max: 250000, step: 500 },
      { name: "downPayment", label: "Down Payment ($)", type: "number", default: 5000, min: 0, max: 100000, step: 250 },
      { name: "tradeInValue", label: "Trade-in Value ($)", type: "number", default: 2000, min: 0, max: 100000, step: 250 },
      { name: "salesTax", label: "Sales Tax (%)", type: "number", default: 6.0, min: 0, max: 15, step: 0.1 },
      { name: "interestRate", label: "Interest Rate (%)", type: "number", default: 5.5, min: 1, max: 20, step: 0.1 },
      { name: "loanTerm", label: "Loan Term (Months)", type: "select", default: 60, options: ["36", "48", "60", "72", "84"] }
    ]
  },
  {
    id: "personal-loan-calculator",
    name: "Personal Loan Calculator",
    category: "Loan",
    benefit: "Plan Unsecured Personal Loan Payments",
    description: "Determine the monthly payment and total lifetime interest of an unsecured personal loan. Ideal for debt consolidation, home improvement projects, or emergency expenses.",
    formula: "P&I = P * r / (1 - (1+r)^-n)",
    howToUse: [
      "Input the total amount you wish to borrow.",
      "Enter the lender's quoted APR (Annual Percentage Rate) and loan duration.",
      "Analyze the total interest paid compared to the principal borrowed."
    ],
    faqs: [
      {
        q: "What is the difference between interest rate and APR?",
        a: "The interest rate is the base cost of borrowing the money, while the APR (Annual Percentage Rate) includes both the interest rate and any upfront lender fees (like origination fees)."
      }
    ],
    inputs: [
      { name: "loanAmount", label: "Loan Amount ($)", type: "number", default: 15000, min: 1000, max: 100000, step: 500 },
      { name: "interestRate", label: "Interest Rate / APR (%)", type: "number", default: 10.5, min: 3, max: 36, step: 0.1 },
      { name: "loanTerm", label: "Loan Term (Months)", type: "select", default: 36, options: ["12", "24", "36", "48", "60"] },
      { name: "originationFee", label: "Origination Fee (%)", type: "number", default: 3.0, min: 0, max: 10, step: 0.1 }
    ]
  },
  {
    id: "student-loan-calculator",
    name: "Student Loan Calculator",
    category: "Loan",
    benefit: "Track and Project Student Loan Refinancing & Payments",
    description: "Calculate monthly payments, total interest, and standard payoff timelines for federal or private student loans. Understand how extra principal payments accelerate your debt-free date.",
    formula: "Standard Monthly Payment = P * r / (1 - (1+r)^-n)",
    howToUse: [
      "Enter your cumulative student loan balance and average weighted interest rate.",
      "Specify your payoff term (default is typically 10 years or 120 months).",
      "Add a monthly extra payment amount to see how much sooner you will hit $0 balance."
    ],
    faqs: [
      {
        q: "How does federal student loan interest work?",
        a: "Federal student loans accrue daily simple interest. Interest does not compound while you are in school, but it may capitalize (be added to your principal balance) at the start of repayment."
      }
    ],
    inputs: [
      { name: "studentLoanBalance", label: "Student Loan Balance ($)", type: "number", default: 45000, min: 2000, max: 300000, step: 1000 },
      { name: "interestRate", label: "Interest Rate (%)", type: "number", default: 5.8, min: 1, max: 15, step: 0.1 },
      { name: "payoffTerm", label: "Repayment Term (Years)", type: "select", default: 10, options: ["5", "10", "15", "20", "25"] },
      { name: "extraPayment", label: "Monthly Extra Payment ($)", type: "number", default: 100, min: 0, max: 5000, step: 10 },
      { name: "annualIncome", label: "Your Adjusted Gross Income (AGI) ($)", type: "number", default: 55000, min: 10000, max: 500000, step: 1000 }
    ]
  },
  {
    id: "amortization-calculator",
    name: "Amortization Calculator",
    category: "Loan",
    benefit: "Generate Complete Loan Amortization Schedule",
    description: "Create a complete, line-by-line monthly table of principal and interest allocations. See exactly how extra payments on top of your normal schedule save interest over time.",
    formula: "Interest Allocation = Remaining Balance * Monthly Interest Rate",
    howToUse: [
      "Input the initial principal, annual interest rate, and terms of the loan.",
      "Add any monthly extra payment to inspect the amortization schedule impact.",
      "Observe the accelerated timeline and the cumulative interest reduction."
    ],
    faqs: [
      {
        q: "What is amortization?",
        a: "Amortization is the process of spreading out a loan into a series of equal periodic payments. Over time, the portion of your payment going toward interest decreases, while the portion going toward principal increases."
      }
    ],
    inputs: [
      { name: "loanAmount", label: "Original Loan Amount ($)", type: "number", default: 250000, min: 5000, max: 2000000, step: 5000 },
      { name: "interestRate", label: "Interest Rate (%)", type: "number", default: 6.2, min: 1, max: 15, step: 0.1 },
      { name: "loanTerm", label: "Term (Years)", type: "select", default: 30, options: ["10", "15", "20", "30"] },
      { name: "extraPayment", label: "Monthly Extra Payment ($)", type: "number", default: 150, min: 0, max: 5000, step: 10 }
    ]
  },
  {
    id: "loan-payoff-calculator",
    name: "Loan Payoff Calculator",
    category: "Loan",
    benefit: "Determine Acceleration of Extra Loan Prepayments",
    description: "Calculate how many years and months you can shave off your debt timeline by adding regular or one-time extra payments toward your loan principal.",
    formula: "n = -log(1 - (r * PV) / P) / log(1 + r)",
    howToUse: [
      "Enter your current remaining balance and current interest rate.",
      "Enter your required standard monthly payment.",
      "Add an extra recurring monthly payment to see the compressed payoff date."
    ],
    faqs: [
      {
        q: "Are there penalties for paying off a loan early?",
        a: "Most residential mortgages and auto loans do not have prepayment penalties. However, some personal loans and commercial loans do. Always check with your lender before making extra payments."
      }
    ],
    inputs: [
      { name: "currentBalance", label: "Remaining Balance ($)", type: "number", default: 120000, min: 1000, max: 1000000, step: 1000 },
      { name: "interestRate", label: "Interest Rate (%)", type: "number", default: 5.5, min: 1, max: 20, step: 0.1 },
      { name: "monthlyPayment", label: "Standard Monthly Payment ($)", type: "number", default: 1100, min: 50, max: 10000, step: 10 },
      { name: "extraPayment", label: "Monthly Extra Payment ($)", type: "number", default: 200, min: 0, max: 5000, step: 10 }
    ]
  },
  {
    id: "debt-to-income-calculator",
    name: "Debt-to-Income Ratio Calculator",
    category: "Loan",
    benefit: "Calculate DTI for Mortgage Approval and Lending Limits",
    description: "Lenders look closely at your Debt-to-Income (DTI) ratio. Compute both your Front-End DTI (housing costs only) and Back-End DTI (all minimum debt payments) relative to gross income.",
    formula: "DTI (%) = Total Monthly Debt Payments / Gross Monthly Income",
    howToUse: [
      "Input your total gross (pre-tax) annual salary.",
      "Enter your expected monthly mortgage payment or rent.",
      "Add monthly minimum payments for auto loans, credit cards, student loans, and child support.",
      "Check if your DTI falls below the standard 36% or 43% lending thresholds."
    ],
    faqs: [
      {
        q: "What is a good Debt-to-Income (DTI) ratio for a mortgage?",
        a: "Most mortgage lenders prefer a back-end DTI of 36% or lower. However, many conventional loans allow up to 43%, and some programs (like FHA) may go up to 50% with mitigating factors."
      }
    ],
    inputs: [
      { name: "grossAnnualIncome", label: "Gross Annual Income ($)", type: "number", default: 85000, min: 10000, max: 1000000, step: 1000 },
      { name: "monthlyHousing", label: "Monthly Housing (Rent/Mortgage) ($)", type: "number", default: 1800, min: 0, max: 10000, step: 50 },
      { name: "monthlyAuto", label: "Monthly Auto Loan Payments ($)", type: "number", default: 350, min: 0, max: 2000, step: 10 },
      { name: "monthlyStudent", label: "Monthly Student Loan Payments ($)", type: "number", default: 200, min: 0, max: 2000, step: 10 },
      { name: "monthlyCreditCard", label: "Minimum Monthly Credit Card Debt ($)", type: "number", default: 100, min: 0, max: 2000, step: 10 },
      { name: "otherDebt", label: "Other Monthly Debt Payments ($)", type: "number", default: 0, min: 0, max: 5000, step: 10 }
    ]
  },
  {
    id: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    category: "Investment",
    benefit: "Track Growth via Compounding Frequency",
    description: "Determine the long-term wealth growth of an initial principal investment with ongoing monthly contributions. Adjust the compound frequency (daily, monthly, quarterly, or annually).",
    formula: "A = P(1 + r/n)^(nt) + PMT * [ ((1 + r/n)^(nt) - 1) / (r/n) ]",
    howToUse: [
      "Enter your starting initial investment capital.",
      "Add your scheduled recurring monthly contribution amount.",
      "Input your estimated annual rate of return and target investment duration.",
      "Choose your desired compounding frequency to view final values."
    ],
    faqs: [
      {
        q: "What is compound interest?",
        a: "Compound interest is the interest calculated on the initial principal, which also includes all the accumulated interest from previous periods. It is essentially earning 'interest on interest'."
      }
    ],
    inputs: [
      { name: "initialCapital", label: "Initial Investment ($)", type: "number", default: 10000, min: 100, max: 5000000, step: 500 },
      { name: "monthlyContribution", label: "Monthly Contribution ($)", type: "number", default: 500, min: 0, max: 50000, step: 50 },
      { name: "interestRate", label: "Annual Rate of Return (%)", type: "number", default: 8.0, min: 1, max: 25, step: 0.1 },
      { name: "yearsToGrow", label: "Duration (Years)", type: "number", default: 20, min: 1, max: 50, step: 1 },
      { name: "compounding", label: "Compounding Frequency", type: "select", default: 12, options: ["1 - Annually", "4 - Quarterly", "12 - Monthly", "365 - Daily"] }
    ]
  },
  {
    id: "simple-interest-calculator",
    name: "Simple Interest Calculator",
    category: "Investment",
    benefit: "Calculate Linear Non-Compounding Returns",
    description: "Determine the interest earned or owed on a standard financial contract where interest is strictly linear and does not compound over time.",
    formula: "Interest = Principal * Rate * Time (I = P * r * t)",
    howToUse: [
      "Input the starting principal balance.",
      "Specify the annual interest rate and borrowing time in years.",
      "Compare the linear growth to compounding methods."
    ],
    faqs: [
      {
        q: "Where is simple interest typically used?",
        a: "Simple interest is often used in short-term personal loans, certain car loans, and traditional retail certificates of deposit that payout interest directly without reinvestment."
      }
    ],
    inputs: [
      { name: "principal", label: "Principal Balance ($)", type: "number", default: 5000, min: 100, max: 1000000, step: 100 },
      { name: "rate", label: "Annual Interest Rate (%)", type: "number", default: 5.0, min: 0.5, max: 20, step: 0.1 },
      { name: "years", label: "Time Period (Years)", type: "number", default: 5, min: 1, max: 30, step: 1 }
    ]
  },
  {
    id: "cd-calculator",
    name: "CD Calculator",
    category: "Investment",
    benefit: "Estimate Certificate of Deposit Maturity Interest",
    description: "Calculate how much interest you will earn on a Certificate of Deposit (CD) based on current banking APY, compounding frequency, and selected maturity term.",
    formula: "Maturity Value = Principal * (1 + APY/n)^(nt)",
    howToUse: [
      "Input your initial CD investment amount.",
      "Enter the bank's quoted APY (Annual Percentage Yield).",
      "Select your maturity duration (months) and standard compound frequency."
    ],
    faqs: [
      {
        q: "What is an early withdrawal penalty on a CD?",
        a: "If you pull funds out of a CD before the maturity date, banks penalize you. The penalty is typically structured as a certain number of days or months of earned interest."
      }
    ],
    inputs: [
      { name: "principal", label: "CD Deposit Amount ($)", type: "number", default: 10000, min: 500, max: 1000000, step: 500 },
      { name: "apy", label: "Annual APY (%)", type: "number", default: 4.5, min: 0.1, max: 10, step: 0.05 },
      { name: "termMonths", label: "CD Term (Months)", type: "select", default: 12, options: ["6", "12", "18", "24", "36", "60"] }
    ]
  },
  {
    id: "investment-growth-calculator",
    name: "Investment Growth Calculator",
    category: "Investment",
    benefit: "Forecast Future Portfolio Value and Returns",
    description: "Determine how much a one-time lump-sum investment will be worth in the future when left to compound in global index funds or other target portfolios.",
    formula: "FV = PV * (1 + r)^t",
    howToUse: [
      "Enter your starting lump sum investment.",
      "Add the expected average annualized market rate of return.",
      "Select your holding time to see potential future values."
    ],
    faqs: [
      {
        q: "What average return should I assume for the US stock market?",
        a: "Historically, the S&P 500 has returned an average of roughly 10% per year before adjusting for inflation. For conservative planning, 7% to 8% is commonly modeled."
      }
    ],
    inputs: [
      { name: "lumpSum", label: "Lump Sum Amount ($)", type: "number", default: 25000, min: 500, max: 10000000, step: 1000 },
      { name: "expectedReturn", label: "Expected Return (%)", type: "number", default: 7.5, min: 1, max: 20, step: 0.1 },
      { name: "holdingYears", label: "Holding Period (Years)", type: "number", default: 25, min: 1, max: 50, step: 1 },
      { name: "adjustInflation", label: "Adjust for Inflation? (0=No, 1=Yes)", type: "select", default: 0, options: ["0 - No", "1 - Yes"] },
      { name: "inflationRate", label: "Annual Inflation Rate (%)", type: "number", default: 2.5, min: 0.1, max: 15, step: 0.1 }
    ]
  },
  {
    id: "dollar-cost-averaging-calculator",
    name: "Dollar-Cost Averaging Calculator",
    category: "Investment",
    benefit: "Evaluate Benefits of Recurring Investment (DCA)",
    description: "DCA involves investing fixed amounts at regular intervals. Simulate how steady monthly or weekly contributions minimize the risk of bad market timing.",
    formula: "DCA Total = Sum(Contributions) + Compounded Gains",
    howToUse: [
      "Enter your scheduled ongoing deposit budget.",
      "Select the investment frequency (weekly, bi-weekly, or monthly).",
      "Input estimated return and see how price volatility smooths your cost basis."
    ],
    faqs: [
      {
        q: "Is Dollar-Cost Averaging better than Lump-Sum investing?",
        a: "Lump-sum investing often wins mathematically if the market goes straight up, but Dollar-Cost Averaging reduces psychological risk, prevents bad timing mistakes, and builds great savings habits."
      }
    ],
    inputs: [
      { name: "recurringAmount", label: "Recurring Contribution ($)", type: "number", default: 250, min: 10, max: 10000, step: 10 },
      { name: "frequency", label: "Investment Frequency", type: "select", default: 12, options: ["52 - Weekly", "26 - Bi-Weekly", "12 - Monthly"] },
      { name: "growthRate", label: "Annualized Growth Rate (%)", type: "number", default: 8.0, min: 1, max: 20, step: 0.1 },
      { name: "durationYears", label: "Duration (Years)", type: "number", default: 15, min: 1, max: 40, step: 1 }
    ]
  },
  {
    id: "savings-goal-calculator",
    name: "Savings Goal Calculator",
    category: "Investment",
    benefit: "Plan Monthly Savings to Reach a Target Amount",
    description: "Determine exactly how much money you must put aside every month to hit a target nest egg or emergency reserve within a specific timeframe.",
    formula: "Required Monthly Contribution = Target / [ ((1+r)^n - 1) / r ]",
    howToUse: [
      "Input your total target financial goal.",
      "Specify your current starting savings or cash reserves.",
      "Set your timeline in years and estimated APY of your High-Yield Savings Account (HYSA)."
    ],
    faqs: [
      {
        q: "What is an Emergency Fund recommendation?",
        a: "Most financial planners advise setting aside 3 to 6 months of absolute living expenses in a highly liquid High-Yield Savings Account (HYSA)."
      }
    ],
    inputs: [
      { name: "targetAmount", label: "Savings Goal Target ($)", type: "number", default: 50000, min: 1000, max: 2000000, step: 1000 },
      { name: "startingSavings", label: "Starting Savings ($)", type: "number", default: 5000, min: 0, max: 1000000, step: 500 },
      { name: "yearsToSave", label: "Timeline (Years)", type: "number", default: 5, min: 1, max: 30, step: 1 },
      { name: "annualApy", label: "Savings Account APY (%)", type: "number", default: 4.2, min: 0, max: 10, step: 0.1 }
    ]
  },
  {
    id: "401k-calculator",
    name: "401(k) Calculator",
    category: "Retirement",
    benefit: "Project 401(k) Growth and Employer Matching Credits",
    description: "Estimate your future 401(k) balance at retirement. Calculate your tax savings, adjust annual salary increases, and factor in your employer's matching contributions.",
    formula: "401k Balance = Grow(Contributions + Matching Credits)",
    howToUse: [
      "Enter your current age, target retirement age, and current annual pre-tax salary.",
      "Input your personal contribution rate (percentage of salary).",
      "Specify your employer's match rate (e.g., 50% match up to 6% of salary).",
      "View estimated compound totals at retirement."
    ],
    faqs: [
      {
        q: "What is the 401(k) contribution limit?",
        a: "For 2026, the IRS 401(k) individual contribution limit is $23,500 (or $31,000 for those age 50 or older with catch-up contributions). This adjusts periodically for inflation."
      },
      {
        q: "What is a standard employer match?",
        a: "A common employer match is '50% up to 6%'—meaning if you contribute 6% of your salary, your employer contributes an additional 3%. This is essentially free money and should always be maximized."
      }
    ],
    inputs: [
      { name: "currentAge", label: "Current Age", type: "number", default: 28, min: 18, max: 70, step: 1 },
      { name: "retireAge", label: "Retirement Age", type: "number", default: 65, min: 50, max: 80, step: 1 },
      { name: "salary", label: "Annual Salary ($)", type: "number", default: 75000, min: 15000, max: 1000000, step: 1000 },
      { name: "contributionRate", label: "Your Contribution (%)", type: "number", default: 8, min: 1, max: 30, step: 1 },
      { name: "employerMatchRate", label: "Employer Match Max (%)", type: "number", default: 6, min: 0, max: 20, step: 1 },
      { name: "employerMatchPct", label: "Employer Match Dollar ratio (%)", type: "number", default: 50, min: 0, max: 100, step: 10 },
      { name: "currentBalance", label: "Current 401(k) Balance ($)", type: "number", default: 15000, min: 0, max: 1000000, step: 1000 },
      { name: "expectedReturn", label: "Expected Annual Return (%)", type: "number", default: 7.0, min: 1, max: 15, step: 0.1 }
    ]
  },
  {
    id: "roth-ira-calculator",
    name: "Roth IRA Calculator",
    category: "Retirement",
    benefit: "Simulate Tax-Free Roth IRA Growth and Income Limits",
    description: "Compare Roth IRA projections. Roth contributions are made with after-tax dollars, meaning all compounding growth and retirement withdrawals are 100% tax-free.",
    formula: "Roth Balance = FV(Monthly Contribution at rate r)",
    howToUse: [
      "Input your current age and planned retirement timeline.",
      "Enter your starting balance and monthly contribution amount.",
      "Factor in expected annual rate of return to see tax-free balance totals."
    ],
    faqs: [
      {
        q: "What is the primary benefit of a Roth IRA?",
        a: "Since you pay taxes on contributions up front, your investments grow completely tax-free, and qualified withdrawals after age 59½ are entirely exempt from federal and state income taxes."
      }
    ],
    inputs: [
      { name: "currentAge", label: "Current Age", type: "number", default: 30, min: 18, max: 70, step: 1 },
      { name: "retirementAge", label: "Retirement Age", type: "number", default: 65, min: 50, max: 80, step: 1 },
      { name: "currentBalance", label: "Current Roth Balance ($)", type: "number", default: 5000, min: 0, max: 500000, step: 500 },
      { name: "monthlyContribution", label: "Monthly Contribution ($)", type: "number", default: 580, min: 0, max: 580, step: 10 },
      { name: "expectedReturn", label: "Annual Rate of Return (%)", type: "number", default: 8.0, min: 1, max: 15, step: 0.1 }
    ]
  },
  {
    id: "traditional-ira-calculator",
    name: "Traditional IRA Calculator",
    category: "Retirement",
    benefit: "Project Tax-Deferred Traditional IRA Growth",
    description: "Traditional IRAs allow you to contribute pre-tax dollars, lowering your current taxable income. Compounding growth is tax-deferred until withdrawals begin in retirement.",
    formula: "Deferred Value = Net Compound Growth with Tax deductions",
    howToUse: [
      "Specify your starting traditional balance and recurring deposits.",
      "Input your current marginal federal tax bracket.",
      "Review the tax savings achieved today versus future tax obligations."
    ],
    faqs: [
      {
        q: "Are Traditional IRA contributions tax-deductible?",
        a: "Contributions are deductible if you (and your spouse) do not have an active employer-sponsored retirement plan, or if your income falls below specific IRS thresholds."
      }
    ],
    inputs: [
      { name: "currentAge", label: "Current Age", type: "number", default: 30, min: 18, max: 70, step: 1 },
      { name: "retirementAge", label: "Retirement Age", type: "number", default: 65, min: 50, max: 80, step: 1 },
      { name: "currentBalance", label: "Current IRA Balance ($)", type: "number", default: 2000, min: 0, max: 500000, step: 500 },
      { name: "monthlyContribution", label: "Monthly Contribution ($)", type: "number", default: 500, min: 0, max: 580, step: 10 },
      { name: "taxBracket", label: "Current Tax Bracket (%)", type: "number", default: 22, min: 10, max: 37, step: 1 },
      { name: "expectedReturn", label: "Annual Return (%)", type: "number", default: 7.5, min: 1, max: 15, step: 0.1 }
    ]
  },
  {
    id: "retirement-calculator",
    name: "Retirement Savings Calculator",
    category: "Retirement",
    benefit: "Estimate Your Comfort Nest Egg & Safe Withdrawal Rate",
    description: "Determine if you are on track to retire comfortably. Calculate how much annual income your current savings rate will produce using the industry-standard 4% safe withdrawal rule.",
    formula: "Target Nest Egg = Desired Annual Retirement Income / 0.04",
    howToUse: [
      "Input your current age, desired retirement age, and current savings.",
      "Enter your target monthly retirement living expense budget.",
      "See if your current monthly savings will meet the necessary capital milestone."
    ],
    faqs: [
      {
        q: "What is the 4% safe withdrawal rule?",
        a: "The 4% rule states that you can safely withdraw 4% of your total retirement nest egg in the first year, and adjust that amount for inflation each subsequent year, with a very high probability of not running out of money for 30 years."
      }
    ],
    inputs: [
      { name: "currentAge", label: "Current Age", type: "number", default: 35, min: 18, max: 70, step: 1 },
      { name: "retirementAge", label: "Planned Retirement Age", type: "number", default: 65, min: 50, max: 80, step: 1 },
      { name: "currentSavings", label: "Current Total Savings ($)", type: "number", default: 50000, min: 0, max: 5000000, step: 1000 },
      { name: "monthlySavings", label: "Ongoing Monthly Savings ($)", type: "number", default: 1000, min: 0, max: 50000, step: 50 },
      { name: "annualIncomeNeeded", label: "Target Annual Retirement Income ($)", type: "number", default: 60000, min: 10000, max: 500000, step: 1000 },
      { name: "expectedReturn", label: "Expected Pre-Retirement Return (%)", type: "number", default: 7.0, min: 1, max: 15, step: 0.1 }
    ]
  },
  {
    id: "social-security-calculator",
    name: "Social Security Benefits Estimator",
    category: "Retirement",
    benefit: "Estimate Social Security Benefits Based on Claiming Age",
    description: "Estimate your monthly Social Security benefit checks. See how claiming early (age 62) versus delaying to age 70 permanently affects your payouts.",
    formula: "Benefit Payout = Base PIA * (Adjustment ratio depending on Claim Age)",
    howToUse: [
      "Enter your current gross annual wages.",
      "Select your birth year category to identify your Full Retirement Age (FRA).",
      "Slide the claiming age from 62 to 70 to compare monthly checks."
    ],
    faqs: [
      {
        q: "How does my claiming age affect Social Security benefits?",
        a: "Claiming at age 62 results in a permanent benefit reduction of up to 30% compared to your Full Retirement Age. Conversely, delaying to age 70 earns you delayed retirement credits of 8% per year."
      }
    ],
    inputs: [
      { name: "annualWages", label: "Current Annual Wages ($)", type: "number", default: 65000, min: 10000, max: 176100, step: 1000 },
      { name: "claimingAge", label: "Planned Claiming Age", type: "select", default: 67, options: ["62", "63", "64", "65", "66", "67", "68", "69", "70"] }
    ]
  },
  {
    id: "paycheck-calculator",
    name: "Paycheck / Take-Home Pay Calculator",
    category: "Salary & Tax",
    benefit: "Estimate Your Take-Home Net Pay",
    description: "Calculate your net take-home paycheck value after FICA (Social Security & Medicare), federal income tax withholdings, and typical healthcare or retirement deductions.",
    formula: "Net Pay = Gross Pay - Federal Tax - FICA - Deductions",
    howToUse: [
      "Input your gross hourly wage or annual salary.",
      "Select your paycheck pay frequency (e.g., bi-weekly, semi-monthly, monthly).",
      "Enter pre-tax deductions like 401(k) contributions and health insurance."
    ],
    faqs: [
      {
        q: "What is FICA tax?",
        a: "FICA stands for Federal Insurance Contributions Act. It is a mandatory federal payroll tax consisting of 6.2% for Social Security and 1.45% for Medicare, totaling 7.65% for employees."
      }
    ],
    inputs: [
      { name: "grossPay", label: "Annual Gross Salary ($)", type: "number", default: 70000, min: 10000, max: 1000000, step: 1000 },
      { name: "frequency", label: "Pay Frequency", type: "select", default: 26, options: ["12 - Monthly", "24 - Semi-Monthly", "26 - Bi-Weekly", "52 - Weekly"] },
      { name: "deductions", label: "Pre-Tax Deductions per Pay Period ($)", type: "number", default: 150, min: 0, max: 5000, step: 10 }
    ]
  },
  {
    id: "salary-calculator",
    name: "Salary Calculator",
    category: "Salary & Tax",
    benefit: "Convert Salary Into Hourly, Daily, and Weekly Rates",
    description: "Convert your annual base salary into hourly, daily, weekly, bi-weekly, and monthly rates. Perfect for comparing standard salary listings to consulting rates.",
    formula: "Hourly = Annual Salary / 2080 (assuming standard 40-hour weeks)",
    howToUse: [
      "Enter the base annual salary amount.",
      "Select the number of working hours per week (standard is 40).",
      "Identify the exact breakdown for work hours, days, and payroll cycles."
    ],
    faqs: [
      {
        q: "How many working hours are standard in a year?",
        a: "A standard full-time schedule of 40 hours per week for 52 weeks is equal to exactly 2,080 working hours."
      }
    ],
    inputs: [
      { name: "annualSalary", label: "Annual Salary ($)", type: "number", default: 85000, min: 5000, max: 2000000, step: 1000 },
      { name: "hoursPerWeek", label: "Working Hours Per Week", type: "number", default: 40, min: 10, max: 80, step: 1 },
      { name: "paidWeeks", label: "Paid Weeks Per Year", type: "number", default: 52, min: 10, max: 52, step: 1 }
    ]
  },
  {
    id: "hourly-to-salary-calculator",
    name: "Hourly to Salary Calculator",
    category: "Salary & Tax",
    benefit: "Project Annual Base Salary From Hourly Wage",
    description: "Translate an hourly consulting rate or wage into a full-year equivalent salary. Adjust for paid vacation weeks and expected weekly billable hours.",
    formula: "Annual Salary = Hourly Rate * Weekly Hours * Weeks Worked",
    howToUse: [
      "Input your gross hourly compensation rate.",
      "Select your average working hours per week.",
      "Adjust the weeks worked per year to account for unpaid vacation."
    ],
    faqs: [
      {
        q: "Should contractors bill higher than salaried employees?",
        a: "Yes, independent contractors (W9/1099) must account for self-employment tax, healthcare, and lack of paid leave. Contractors typically charge 30% to 50% more than the equivalent salaried rate."
      }
    ],
    inputs: [
      { name: "hourlyRate", label: "Hourly Pay Rate ($)", type: "number", default: 45, min: 5, max: 500, step: 0.5 },
      { name: "weeklyHours", label: "Hours Worked Per Week", type: "number", default: 40, min: 5, max: 100, step: 1 },
      { name: "weeksWorked", label: "Weeks Worked Per Year", type: "number", default: 50, min: 1, max: 52, step: 1 }
    ]
  },
  {
    id: "income-tax-calculator",
    name: "Federal Income Tax Calculator",
    category: "Salary & Tax",
    benefit: "Estimate Your Marginal and Effective Federal Tax Bracket",
    description: "Estimate your marginal federal income tax bracket and effective tax rate using IRS single standard deduction guidelines.",
    formula: "Tax Owed = Progressive Brackets(Gross Income - Standard Deduction)",
    howToUse: [
      "Input your total expected annual taxable earnings.",
      "Select your tax filing status (Single, Married, or Head of Household).",
      "Apply the standard IRS single deduction ($15,000 baseline) to check tax liability."
    ],
    faqs: [
      {
        q: "What is the difference between marginal and effective tax rates?",
        a: "Your marginal tax rate is the tax rate applied to your last dollar of income (highest tax bracket), while your effective tax rate is the actual percentage of your total income paid in taxes (total tax divided by gross income)."
      }
    ],
    inputs: [
      { name: "grossIncome", label: "Gross Annual Income ($)", type: "number", default: 95000, min: 10000, max: 2000000, step: 1000 },
      { name: "filingStatus", label: "Filing Status", type: "select", default: 1, options: ["1 - Single", "2 - Married Filing Jointly"] }
    ]
  },
  {
    id: "net-worth-calculator",
    name: "Net Worth Calculator",
    category: "General Finance",
    benefit: "Determine Total Financial Position (Assets vs Liabilities)",
    description: "Your net worth measures your global financial health. Balance your tangible assets (house, bank accounts, stocks) against your outstanding liabilities (mortgage, debt).",
    formula: "Net Worth = Total Assets - Total Liabilities",
    howToUse: [
      "Enter values for all liquid and real estate assets.",
      "Add balances for mortgages, student loans, auto loans, and outstanding credit cards.",
      "Identify your final net worth standing."
    ],
    faqs: [
      {
        q: "What is considered a good net worth by age?",
        a: "Net worth varies wildly. Generally, financial targets suggest having a net worth equal to half your annual salary by age 30, and equal to 3x your salary by age 40."
      }
    ],
    inputs: [
      { name: "cashAndLiquid", label: "Cash & Checking Accounts ($)", type: "number", default: 12000, min: 0, max: 1000000, step: 250 },
      { name: "retirementAccounts", label: "Retirement Portfolios (401k/IRA) ($)", type: "number", default: 45000, min: 0, max: 5000000, step: 500 },
      { name: "homeValue", label: "Real Estate Property Value ($)", type: "number", default: 350000, min: 0, max: 10000000, step: 5000 },
      { name: "otherAssets", label: "Vehicles & Other Assets ($)", type: "number", default: 15000, min: 0, max: 1000000, step: 250 },
      { name: "mortgageBalance", label: "Mortgage Balance Owed ($)", type: "number", default: 220000, min: 0, max: 8000000, step: 5000 },
      { name: "otherDebtBalance", label: "Auto, Student, & Credit Card Debts ($)", type: "number", default: 25000, min: 0, max: 1000000, step: 500 }
    ]
  },
  {
    id: "inflation-calculator",
    name: "Inflation Calculator",
    category: "General Finance",
    benefit: "Evaluate Dollar Value Erosion Over Time",
    description: "Determine how consumer inflation reduces purchasing power over time. Predict how much a basket of goods will cost in the future based on steady inflation.",
    formula: "Future Cost = Present Cost * (1 + inflation_rate)^years",
    howToUse: [
      "Input a starting dollar amount representing current cash.",
      "Enter a planned timeframe in years.",
      "Select an average annual inflation rate (historical average is 3%)."
    ],
    faqs: [
      {
        q: "What is CPI and how does it relate to inflation?",
        a: "The Consumer Price Index (CPI) measures the average change over time in prices paid by urban consumers for a market basket of goods and services, serving as the primary gauge of inflation."
      }
    ],
    inputs: [
      { name: "presentCost", label: "Current Cost / Amount ($)", type: "number", default: 100, min: 1, max: 1000000, step: 1 },
      { name: "years", label: "Time Span (Years)", type: "number", default: 10, min: 1, max: 50, step: 1 },
      { name: "inflationRate", label: "Average Inflation Rate (%)", type: "number", default: 3.2, min: 0.1, max: 15, step: 0.1 }
    ]
  },
  {
    id: "roi-calculator",
    name: "ROI Calculator",
    category: "General Finance",
    benefit: "Determine Net Return on Investment (ROI)",
    description: "Calculate the simple Return on Investment (ROI) and annualized rate of return for any financial capital trade or venture.",
    formula: "ROI = (Current Value - Original Cost) / Original Cost * 100",
    howToUse: [
      "Enter your starting capital cost.",
      "Input the final sold value or ending portfolio balance.",
      "Optionally add years held to calculate the annualized ROI."
    ],
    faqs: [
      {
        q: "What is the difference between simple ROI and annualized ROI?",
        a: "Simple ROI measures total gains regardless of duration, whereas annualized ROI shows the geometric average return per year, allowing you to compare investments of different lengths."
      }
    ],
    inputs: [
      { name: "initialCost", label: "Original Cost ($)", type: "number", default: 10000, min: 100, max: 5000000, step: 100 },
      { name: "endingValue", label: "Final/Current Value ($)", type: "number", default: 14500, min: 100, max: 10000000, step: 100 },
      { name: "yearsHeld", label: "Time Held (Years)", type: "number", default: 3, min: 1, max: 30, step: 1 }
    ]
  },
  {
    id: "break-even-calculator",
    name: "Break-Even Point Calculator",
    category: "General Finance",
    benefit: "Calculate Sales Units and Revenues to Clear Costs",
    description: "Determine when a business project or product launch will hit $0 net income. Find how many units you must sell to cover variable and fixed manufacturing fees.",
    formula: "Break-Even Units = Fixed Costs / (Price - Variable Cost)",
    howToUse: [
      "Input your total fixed operating overhead expenses.",
      "Enter the retail customer sale price per unit.",
      "Specify your variable unit manufacturing and material costs."
    ],
    faqs: [
      {
        q: "What is the contribution margin?",
        a: "Contribution margin is the selling price per unit minus the variable cost per unit. This is the portion of revenue that goes toward covering fixed overhead costs."
      }
    ],
    inputs: [
      { name: "fixedCosts", label: "Total Fixed Costs ($)", type: "number", default: 20000, min: 100, max: 5000000, step: 500 },
      { name: "unitPrice", label: "Sale Price Per Unit ($)", type: "number", default: 50, min: 0.5, max: 10000, step: 1 },
      { name: "variableCost", label: "Variable Cost Per Unit ($)", type: "number", default: 20, min: 0, max: 9000, step: 1 }
    ]
  },
  {
    id: "credit-card-payoff-calculator",
    name: "Credit Card Payoff Calculator",
    category: "General Finance",
    benefit: "Model Timeline to Eliminate Credit Card Balances",
    description: "See how long it will take to pay off credit card debt by paying more than the minimum balance. Calculate the exact lifetime interest saved by increasing payments.",
    formula: "Interest = Outstanding balance * (APR / 365) * days",
    howToUse: [
      "Enter your current outstanding credit card balance and annual APR.",
      "Input the credit card's required monthly minimum payment percentage.",
      "Add your planned fixed monthly payoff payment to compare schedules."
    ],
    faqs: [
      {
        q: "Why is credit card debt so expensive?",
        a: "Credit cards feature extremely high interest rates (often 20% to 30% APR) and calculate interest daily, causing debt balances to expand very rapidly when only paying the minimum."
      }
    ],
    inputs: [
      { name: "cardBalance", label: "Credit Card Balance ($)", type: "number", default: 7500, min: 100, max: 100000, step: 100 },
      { name: "apr", label: "Annual APR (%)", type: "number", default: 24.5, min: 5, max: 36, step: 0.1 },
      { name: "monthlyPayment", label: "Planned Monthly Payment ($)", type: "number", default: 350, min: 50, max: 10000, step: 10 }
    ]
  },
  {
    id: "debt-payoff-calculator",
    name: "Debt Payoff Calculator (Snowball/Avalanche)",
    category: "General Finance",
    benefit: "Compare Snowball vs Avalanche Strategies",
    description: "Compare the two most popular debt payoff frameworks. The Debt Avalanche prioritizes high-interest rate balances, while the Debt Snowball targets smaller balances for fast wins.",
    formula: "Strategy Allocation comparison of payoff timetables",
    howToUse: [
      "Enter your total outstanding debt balance.",
      "Input your average weighted interest rate.",
      "Add a monthly extra payoff contribution to see your compressed timeline."
    ],
    faqs: [
      {
        q: "Should I choose the Snowball or Avalanche method?",
        a: "The Debt Avalanche saves the most interest mathematically. The Debt Snowball builds early psychological momentum by clearing small balances quickly, which helps many stick to their debt-free plans."
      }
    ],
    inputs: [
      { name: "totalDebt", label: "Total Outstanding Debt ($)", type: "number", default: 35000, min: 500, max: 500000, step: 500 },
      { name: "averageRate", label: "Weighted Average Rate (%)", type: "number", default: 12.0, min: 1, max: 30, step: 0.1 },
      { name: "monthlyBasePayment", label: "Required Minimum Payments ($)", type: "number", default: 600, min: 50, max: 5000, step: 10 },
      { name: "extraMonthlyBudget", label: "Extra Monthly Payoff Budget ($)", type: "number", default: 250, min: 0, max: 5000, step: 10 }
    ]
  },
  {
    id: "home-affordability-calculator",
    name: "Home Affordability Calculator",
    category: "Real Estate",
    benefit: "Determine Maximum Safe Home Purchase Price",
    description: "Calculate your maximum safe home price using the standard financial '28/36 rule' to evaluate your front-end and back-end debt parameters.",
    formula: "Max Monthly Housing Payment = Gross Monthly Income * 0.28",
    howToUse: [
      "Enter your annual household pre-tax income.",
      "Enter your total cash down payment reserves.",
      "Input other outstanding recurring monthly consumer debt obligations.",
      "View your affordable price, moderate stretch price, and aggressive ceiling price."
    ],
    faqs: [
      {
        q: "What is the 28/36 rule of home buying?",
        a: "The 28/36 rule states that your monthly housing costs (PITI) should not exceed 28% of your gross monthly income, and your total debt obligations (housing + other loans) should stay below 36%."
      }
    ],
    inputs: [
      { name: "annualIncome", label: "Annual Pre-Tax Income ($)", type: "number", default: 95000, min: 10000, max: 1000000, step: 1000 },
      { name: "cashDown", label: "Total Down Payment Cash ($)", type: "number", default: 45000, min: 0, max: 2000000, step: 1000 },
      { name: "monthlyDebts", label: "Other Monthly Debt Payments ($)", type: "number", default: 300, min: 0, max: 5000, step: 10 },
      { name: "interestRate", label: "Assumed Interest Rate (%)", type: "number", default: 6.5, min: 1, max: 15, step: 0.1 }
    ]
  },
  {
    id: "rent-vs-buy-calculator",
    name: "Rent vs. Buy Calculator",
    category: "Real Estate",
    benefit: "Evaluate Long-term Financial Outcome of Renting vs Buying",
    description: "Compare the lifetime cost of renting versus buying a home. Factor in asset appreciation, maintenance fees, and the opportunity cost of investing a home down payment into index funds.",
    formula: "Net Benefit = (Rent Cost + Opportunity gains) - (Buy Cost + Built Equity)",
    howToUse: [
      "Input monthly rent costs and rental insurance values.",
      "Input purchase price, down payment, tax rates, and annual repair budgets.",
      "Set your planned timeline to see which option builds higher long-term net worth."
    ],
    faqs: [
      {
        q: "Is renting money down the drain?",
        a: "No, renting is not throwing money away. Renting provides housing flexibility, eliminates repair/maintenance liabilities, and keeps your down payment capital free to earn compounding stock market returns."
      }
    ],
    inputs: [
      { name: "monthlyRent", label: "Estimated Monthly Rent ($)", type: "number", default: 2200, min: 300, max: 15000, step: 50 },
      { name: "purchasePrice", label: "Home Purchase Price ($)", type: "number", default: 380000, min: 50000, max: 5000000, step: 5000 },
      { name: "downPayment", label: "Down Payment ($)", type: "number", default: 76000, min: 0, max: 2000000, step: 1000 },
      { name: "plannedYears", label: "Planned Stay Duration (Years)", type: "number", default: 7, min: 1, max: 30, step: 1 },
      { name: "appreciationRate", label: "Annual Home Appreciation (%)", type: "number", default: 3.5, min: 0, max: 10, step: 0.1 }
    ]
  }
];
