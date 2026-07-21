# FORMULAS.md — Calculation Logic for All 31 Calculators

Companion file to `AGENTS.md`. This documents the exact public/standard financial formula for every tool so the dev/agent building the calculator engine doesn't have to re-derive math or guess. All formulas here are standard, publicly known financial formulas (no proprietary or copyrighted methodology) — implement directly as pure functions: `input schema → formula → formatted output`, per the shared calculation-engine pattern in AGENTS.md Section 12.

**Variable notation used throughout:**
- `P` = Principal / loan amount / present value
- `r` = annual interest rate (as decimal, e.g. 6% → 0.06)
- `i` = periodic interest rate = `r / n`
- `n` = number of compounding/payment periods per year
- `t` = time in years
- `N` = total number of periods = `n × t`
- `PMT` = periodic payment amount
- `FV` = future value
- `PV` = present value

---

## LOAN CALCULATORS

### 1. Mortgage Calculator
Standard amortizing loan payment formula:

```
M = P × [ i(1+i)^N ] / [ (1+i)^N − 1 ]
```
where `i` = monthly interest rate (`annual rate / 12`), `N` = total number of monthly payments (`years × 12`).

Total monthly payment shown to user (PITI) = `M + monthly_property_tax + monthly_home_insurance + monthly_PMI + monthly_HOA`

- `monthly_property_tax = (home_value × annual_property_tax_rate) / 12`
- `monthly_PMI` applies only if down payment < 20%; typically `0.5%–1.5%` of loan amount annually, divided by 12
- Total interest paid over loan life = `(M × N) − P`

### 2. Mortgage Refinance Calculator
Uses the same amortization formula as #1, run twice (existing loan vs. new loan), plus:

```
Monthly Savings = Current Monthly Payment − New Monthly Payment
Break-even Point (months) = Total Refinance Closing Costs / Monthly Savings
```
Total interest comparison = sum remaining interest on old loan (from current point forward) vs. total interest on new loan.

### 3. Auto Loan Calculator
Same amortizing formula as mortgage:
```
M = P × [ i(1+i)^N ] / [ (1+i)^N − 1 ]
```
where `P` = vehicle price − down payment − trade-in value (+ sales tax and fees if financed), `i` = monthly rate, `N` = loan term in months (typically 36–72).

### 4. Personal Loan Calculator
Identical amortization formula as #1/#3:
```
M = P × [ i(1+i)^N ] / [ (1+i)^N − 1 ]
```
`P` = loan amount, `i` = monthly rate, `N` = term in months. If an origination fee is charged, show both the "amount financed" and effective APR:
```
Effective APR ≈ solve for rate such that PV of (M × N) payments = (P − origination_fee)
```

### 5. Student Loan Calculator
Same core amortization formula. Additionally support:
- **Standard 10-year plan:** `N = 120` months, formula as above.
- **Income-Driven Repayment (simplified):** `PMT = (Discretionary Income × payment_percentage) / 12`, where `Discretionary Income = AGI − (poverty_line_multiplier × federal_poverty_line)`. (Flag this as a simplified estimate; exact IDR formulas vary by plan (SAVE, PAYE, IBR) and should link to studentaid.gov for authoritative numbers.)
- **Capitalized interest note:** if payments are deferred, unpaid interest may be added to principal — `New Principal = P + (accrued unpaid interest)`.

### 6. Amortization Calculator
Generates a full schedule from the standard payment formula (#1), then for each period `k = 1...N`:
```
Interest_k = Remaining_Balance_(k−1) × i
Principal_k = M − Interest_k
Remaining_Balance_k = Remaining_Balance_(k−1) − Principal_k
```
Output: table of period, payment, principal portion, interest portion, remaining balance.

### 7. Loan Payoff Calculator (extra payments)
Iterative month-by-month simulation using the amortization logic above, but each period:
```
Remaining_Balance_k = Remaining_Balance_(k−1) − Principal_k − Extra_Payment
```
Stop when `Remaining_Balance ≤ 0`. Output: new payoff date (in months) vs. original term, and total interest saved:
```
Interest Saved = Original_Total_Interest − New_Total_Interest
```

### 8. Debt-to-Income Ratio Calculator
```
DTI (%) = (Total Monthly Debt Payments / Gross Monthly Income) × 100
```
Show two variants (standard mortgage-lending convention):
- **Front-end DTI** = (Housing payment only / Gross monthly income) × 100
- **Back-end DTI** = (All monthly debt payments including housing / Gross monthly income) × 100

Typical lender thresholds to display for context: front-end ≤ 28%, back-end ≤ 36–43% (varies by loan type).

---

## INVESTMENT & SAVINGS CALCULATORS

### 9. Compound Interest Calculator
```
FV = P × (1 + r/n)^(n×t)
```
If regular contributions are added (future value of an annuity, added to lump sum growth):
```
FV = P × (1 + r/n)^(n×t)  +  PMT × [ ((1 + r/n)^(n×t) − 1) / (r/n) ]
```
`n` = compounding frequency (1 = annually, 12 = monthly, 365 = daily).

### 10. Simple Interest Calculator
```
Interest = P × r × t
Total = P + Interest
```

### 11. CD Calculator
Same compound interest formula as #9 (CDs compound, typically daily or monthly, with no additional contributions after initial deposit and an early-withdrawal penalty if cashed out before maturity):
```
FV = P × (1 + r/n)^(n×t)
```
Early withdrawal penalty (if modeled): typically `X months of interest`, subtract from `FV`.

### 12. Investment Growth Calculator
Same as #9 (lump sum + optional recurring contribution):
```
FV = P × (1 + r/n)^(n×t)  +  PMT × [ ((1 + r/n)^(n×t) − 1) / (r/n) ]
```
Optionally allow an "inflation-adjusted" toggle:
```
Real FV = FV / (1 + inflation_rate)^t
```

### 13. Dollar-Cost Averaging Calculator
Simulates period-by-period investment where each contribution grows for the remaining time:
```
FV = Σ (for each contribution k, made at month k, growing for (N−k) remaining months)
   = Σ [ PMT × (1 + r/n)^(N−k) ]   for k = 1 to N
```
This is mathematically the future value of an ordinary annuity (same closed form as #9's annuity term) — can use the closed-form formula directly:
```
FV = PMT × [ ((1 + r/n)^N − 1) / (r/n) ]
```

### 14. Savings Goal Calculator
Solve the annuity formula for `PMT` given a target `FV`:
```
PMT = FV × (r/n) / [ (1 + r/n)^(n×t) − 1 ]
```
This tells the user how much to save per period to reach their goal.

---

## RETIREMENT CALCULATORS

### 15. 401(k) Calculator
Future value of contributions (employee + employer match) growing at an assumed return, using the annuity + lump sum formula from #9:
```
FV = Current_Balance × (1 + r/n)^(n×t)  +  Total_Contribution_Per_Period × [ ((1 + r/n)^(n×t) − 1) / (r/n) ]
```
- `Total_Contribution_Per_Period = Employee_Contribution + Employer_Match`
- `Employer_Match` = typically `min(match_rate × employee_contribution, match_cap × salary)` — model per employer match formula input (e.g., "100% up to 3%, 50% up to next 2%")
- Apply annual IRS contribution limit cap (input as a configurable variable since it changes yearly — do not hardcode).

### 16. Roth IRA Calculator
Same future value formula as #9/#15:
```
FV = P × (1 + r/n)^(n×t)  +  PMT × [ ((1 + r/n)^(n×t) − 1) / (r/n) ]
```
Key difference from Traditional (display-only, not a math difference): contributions are after-tax, qualified withdrawals are tax-free. Apply annual contribution limit and MAGI phase-out range as configurable inputs (both change yearly).

### 17. Traditional IRA Calculator
Same future value formula as #16. Display difference: contributions may be tax-deductible now; withdrawals in retirement are taxed as ordinary income. Optionally show:
```
After-tax withdrawal value = FV × (1 − expected_retirement_tax_rate)
```
for comparison against Roth's tax-free FV.

### 18. Retirement Savings Calculator
Two-part formula:
1. **Accumulation phase** (same as #9): `FV_at_retirement = Current_Savings × (1+r/n)^(n×t) + PMT × [((1+r/n)^(n×t) −1)/(r/n)]`
2. **Withdrawal/sustainability check** using the common "4% rule" (or configurable safe withdrawal rate):
```
Sustainable Annual Income = FV_at_retirement × safe_withdrawal_rate   (default 4%)
```
Also show "years savings will last" using the annuity-depletion formula:
```
Years = −ln(1 − (Balance × r) / Annual_Withdrawal) / ln(1 + r)      [if withdrawal rate < return rate → indefinite]
```

### 19. Social Security Benefits Estimator
This is a simplified/educational estimator only (exact SSA calculation uses 35-year AIME/PIA bend-point formulas that require full earnings history — clearly disclaim this and link to ssa.gov for official estimates). Provide directional adjustment factors:
```
Benefit_at_claim_age = Full_Retirement_Age_Benefit × adjustment_factor
```
- Claiming before Full Retirement Age (FRA): reduces benefit ~5/9 of 1% per month for the first 36 months early, ~5/12 of 1% per month beyond that.
- Claiming after FRA (up to age 70): increases benefit ~2/3 of 1% per month (8%/year) of delayed retirement credit.

---

## SALARY & TAX CALCULATORS

### 20. Paycheck / Take-Home Pay Calculator
```
Gross Pay (per period) = Annual Salary / pay_periods_per_year
Federal Income Tax Withheld = apply progressive federal bracket formula (see #23) pro-rated per period
FICA — Social Security = Gross Pay × 6.2%   (up to annual wage base cap, configurable/updated yearly)
FICA — Medicare = Gross Pay × 1.45%   (+ 0.9% Additional Medicare Tax on wages above threshold, configurable)
State Income Tax = Gross Pay × state_rate (varies by state; several states = 0%)
Net Pay = Gross Pay − Federal Tax − FICA (SS + Medicare) − State Tax − Other Deductions (401k, health insurance, etc.)
```

### 21. Salary Calculator
Simple period conversions:
```
Annual = Hourly × Hours_per_week × Weeks_per_year   (typically 52, or 50 if 2 weeks unpaid vacation)
Monthly = Annual / 12
Biweekly = Annual / 26
Weekly = Annual / 52
Daily = Annual / (Weeks_per_year × Days_per_week)
```

### 22. Hourly to Salary Calculator
Inverse of #21:
```
Hourly Rate = Annual Salary / (Hours_per_week × Weeks_per_year)
```
With overtime toggle (if hours > 40/week):
```
Overtime Rate = Hourly Rate × 1.5
Weekly Pay = (40 × Hourly Rate) + (Overtime Hours × Overtime Rate)
```

### 23. Federal Income Tax Calculator
Progressive marginal bracket formula — sum of tax owed in each bracket the income passes through:
```
Tax Owed = Σ [ (min(Income, bracket_upper) − bracket_lower) × bracket_rate ]   for each bracket the income falls into
```
Then subtract the standard deduction (or itemized, whichever user selects) from gross income before applying brackets:
```
Taxable Income = Gross Income − Standard_Deduction (or Itemized_Deductions)
Effective Tax Rate = Total Tax Owed / Gross Income
Marginal Tax Rate = rate of the bracket the last dollar of income falls into
```
**Critical:** tax brackets, standard deduction amounts, and filing-status thresholds change every year (and are inflation-adjusted) — store these as a versioned config object (`taxBrackets2026.json` etc.), never hardcode inline, and display "Tax year: [XXXX]" on the page per AGENTS.md Section 10/12.

---

## GENERAL FINANCE CALCULATORS

### 24. Net Worth Calculator
```
Net Worth = Total Assets − Total Liabilities
```
- Assets: cash, investments, retirement accounts, real estate value, vehicle value, other property.
- Liabilities: mortgage balance, auto loans, student loans, credit card balances, personal loans, other debt.

### 25. Inflation Calculator
Using CPI (Consumer Price Index) ratio:
```
Future Value = Present Value × (CPI_end / CPI_start)
```
Or if using an assumed constant inflation rate instead of historical CPI data:
```
Future Value = Present Value × (1 + inflation_rate)^t
Equivalent Past Value = Present Value / (1 + inflation_rate)^t
```

### 26. ROI Calculator
```
ROI (%) = [ (Final Value − Initial Investment) / Initial Investment ] × 100
```
Annualized ROI (CAGR — Compound Annual Growth Rate), for investments held over multiple years:
```
Annualized ROI (%) = [ (Final Value / Initial Investment)^(1/t) − 1 ] × 100
```

### 27. Break-Even Point Calculator
```
Break-even Point (units) = Fixed Costs / (Price per Unit − Variable Cost per Unit)
Break-even Point (revenue $) = Break-even Units × Price per Unit
```
Contribution Margin (used in the denominator above):
```
Contribution Margin per Unit = Price per Unit − Variable Cost per Unit
Contribution Margin Ratio = Contribution Margin per Unit / Price per Unit
```

### 28. Credit Card Payoff Calculator
Iterative month-by-month simulation (credit cards typically compound daily but are billed monthly — use monthly periodic rate for simplicity, note this as an approximation):
```
i = APR / 12
Interest_month = Remaining_Balance × i
Principal_paid_month = Payment − Interest_month
Remaining_Balance_new = Remaining_Balance − Principal_paid_month
```
Repeat until `Remaining_Balance ≤ 0`. If user selects "minimum payment only," recompute minimum payment each month as typically:
```
Minimum Payment = max( Remaining_Balance × min_payment_percentage (e.g. 1–3%), flat_minimum_dollar_amount (e.g. $25) )
```
Output: months to payoff, total interest paid — and a comparison scenario at a higher fixed payment.

### 29. Debt Payoff Calculator (Snowball / Avalanche)
Given a list of debts `[{balance, APR, minimum_payment}, ...]` and an extra monthly amount `E`:

**Avalanche method:** sort debts by `APR` descending. Apply minimum payments to all debts; apply all extra `E` to the highest-APR debt until paid off, then roll that debt's full payment (minimum + freed-up extra) onto the next-highest-APR debt, and so on.

**Snowball method:** identical mechanics, but sort by `balance` ascending (smallest balance first) instead of APR.

For each method, run the same iterative payoff simulation as #28 across all debts simultaneously, tracking:
```
Total Months to Debt-Free
Total Interest Paid (sum across all debts)
```
Display both methods side by side so the user can compare total interest paid (avalanche is always ≤ snowball mathematically) vs. psychological payoff speed (snowball clears individual debts faster).

---

## REAL ESTATE CALCULATORS

### 30. Home Affordability Calculator
Based on the standard mortgage-lending "28/36 rule":
```
Max Housing Payment (front-end) = Gross Monthly Income × 0.28
Max Total Debt Payment (back-end) = Gross Monthly Income × 0.36
Max Housing Payment = min(front-end limit, back-end limit − other monthly debts)
```
Then solve the amortization formula (#1) in reverse for `P` (max loan amount) given `M` = Max Housing Payment (minus estimated taxes/insurance/PMI):
```
P = M × [ (1+i)^N − 1 ] / [ i(1+i)^N ]
Max Home Price = P + Down Payment
```

### 31. Rent vs. Buy Calculator
Compares total cost of renting vs. buying over a holding period `t`:

**Cost of Renting:**
```
Total Rent Cost = Σ (Monthly Rent × (1 + annual_rent_increase)^year)  for each year, summed over t years
Opportunity Cost of Down Payment = Down Payment × (1 + investment_return_rate)^t − Down Payment
  (what the down payment would have earned if invested instead of used to buy)
```

**Cost of Buying:**
```
Total Buying Cost = Down Payment + Total Mortgage Payments (principal + interest, via amortization formula #1)
                   + Property Taxes (over t years) + Home Insurance (over t years)
                   + Maintenance (typically 1%/year of home value) + Closing Costs
                   − Home Equity Built (principal paid down)
                   − Home Appreciation (Home_Value × (1+appreciation_rate)^t − Home_Value)
                   − Net Proceeds if Sold (Sale Price − Remaining Mortgage Balance − Selling Costs, typically 6–8% of sale price)
```
Output: net cost of each path over `t` years, and the "break-even" year where buying becomes cheaper than renting.

---

## Implementation Notes for the Dev/Agent

1. **All rate inputs** should be collected from the user as a percentage (e.g., "6.5") and converted to decimal (`/100`) once, at the top of each calculation function — keep this conversion consistent to avoid off-by-100 bugs.
2. **Rounding:** round only at final display, not between intermediate calculation steps, to avoid compounding rounding errors in amortization schedules.
3. **Edge cases to handle in every loan/amortization formula:** `i = 0` (0% interest — the standard formula divides by zero; fall back to `M = P / N`), negative amortization inputs, `N ≤ 0`.
4. **Configurable, versioned constants** (must NOT be hardcoded inline in formula logic — store in a dated config file and reference by tax-year/plan-year): federal tax brackets, standard deduction, 401(k)/IRA contribution limits, Social Security wage base, FICA rates, IRS mileage rates if ever added. Review and update this config file every January for the new tax year, and display the "Tax year: [XXXX]" or "Contribution limits: [XXXX]" label on the relevant pages so users know which year's numbers they're seeing.
5. **Cross-reference with AGENTS.md Section 6** — every formula section above must ship with the "How is this calculated" on-page explanation using this same formula, in plain language, per the on-page SEO/E-E-A-T requirements.
