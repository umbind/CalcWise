import type { Archetype, RiskTier } from './types';

export type CategoryId = 'finance' | 'health' | 'math' | 'construction' | 'converters' | 'everyday';

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface CategoryMetadata {
  id: CategoryId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: string;
  route: string;
  riskTierSummary: string;
  standardsBody: string;
  standardsSummary: string;
  faqs: CategoryFaq[];
}

export interface CalculatorMetadata {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  categoryLabel: string;
  route: string;
  archetype: Archetype;
  riskTier: RiskTier;
  description: string;
  icon: string;
  keywords: string[];
}

export const CALCULATOR_REGISTRY: CalculatorMetadata[] = [
  // Pilot 1-5
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'math',
    categoryLabel: 'Math & Arithmetic',
    route: '/math/percentage-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Calculate percentages of values, relative percentage change, and percentage increases/decreases.',
    icon: '➗',
    keywords: ['percentage', 'percent', 'percent change', 'discount percentage', 'increase', 'decrease'],
  },
  {
    id: 'emi-calculator',
    name: 'EMI / Loan Calculator',
    slug: 'emi-calculator',
    category: 'finance',
    categoryLabel: 'Finance & Borrowing',
    route: '/finance/emi-calculator',
    archetype: 'decision',
    riskTier: 'T2',
    description: 'Calculate monthly loan payments, total interest, and full amortization schedule for mortgages and loans.',
    icon: '💰',
    keywords: ['emi', 'loan payment', 'mortgage payment', 'amortization', 'interest rate'],
  },
  {
    id: 'bmi-calculator',
    name: 'Adult BMI Calculator',
    slug: 'bmi-calculator',
    category: 'health',
    categoryLabel: 'Health & Wellness',
    route: '/health/bmi-calculator',
    archetype: 'professional',
    riskTier: 'T2',
    description: 'Evaluate Body Mass Index using WHO standards with healthy weight ranges for adult men and women.',
    icon: '❤️',
    keywords: ['bmi', 'body mass index', 'weight status', 'healthy weight', 'obesity', 'underweight'],
  },
  {
    id: 'concrete-calculator',
    name: 'Concrete Volume Calculator',
    slug: 'concrete-calculator',
    category: 'construction',
    categoryLabel: 'Construction & Materials',
    route: '/construction/concrete-calculator',
    archetype: 'direct',
    riskTier: 'T1',
    description: 'Estimate cubic yards, cubic meters, and pre-mix bags (60lb/80lb) required for slabs, patios, and columns.',
    icon: '🏗️',
    keywords: ['concrete', 'cement', 'cubic yards', 'concrete bags', 'patio slab', 'footing'],
  },
  {
    id: 'unit-converter',
    name: 'Universal Unit Converter',
    slug: 'unit-converter',
    category: 'converters',
    categoryLabel: 'Conversions & Units',
    route: '/converters/unit-converter',
    archetype: 'converter',
    riskTier: 'T0',
    description: 'Convert between metric and imperial units across length, mass, temperature, area, volume, and data.',
    icon: '⇄',
    keywords: ['unit converter', 'metric to imperial', 'length', 'kg to lbs', 'celsius to fahrenheit', 'volume'],
  },

  // Calculators 6-9: Finance
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    category: 'finance',
    categoryLabel: 'Finance & Investing',
    route: '/finance/compound-interest-calculator',
    archetype: 'schedule',
    riskTier: 'T2',
    description: 'Forecast future investment growth with custom compounding frequencies and periodic monthly contributions.',
    icon: '📈',
    keywords: ['compound interest', 'investment growth', 'interest compounding', 'apy', 'savings goal'],
  },
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    slug: 'simple-interest-calculator',
    category: 'finance',
    categoryLabel: 'Finance & Investing',
    route: '/finance/simple-interest-calculator',
    archetype: 'direct',
    riskTier: 'T1',
    description: 'Calculate linear simple interest (P × R × T) with clear interest and principal repayment breakdowns.',
    icon: '💵',
    keywords: ['simple interest', 'interest formula', 'loan interest', 'short term interest'],
  },
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Payment Calculator',
    slug: 'mortgage-calculator',
    category: 'finance',
    categoryLabel: 'Finance & Real Estate',
    route: '/finance/mortgage-calculator',
    archetype: 'decision',
    riskTier: 'T2',
    description: 'Calculate complete monthly mortgage payments including principal, interest, property tax, home insurance, and PMI.',
    icon: '🏠',
    keywords: ['mortgage', 'home loan', 'property tax', 'homeowners insurance', 'pmi', 'down payment'],
  },
  {
    id: 'salary-calculator',
    name: 'Salary & Wage Converter',
    slug: 'salary-calculator',
    category: 'finance',
    categoryLabel: 'Finance & Career',
    route: '/finance/salary-calculator',
    archetype: 'converter',
    riskTier: 'T1',
    description: 'Convert salary between hourly, weekly, bi-weekly, monthly, and annual earnings with overtime adjustments.',
    icon: '💼',
    keywords: ['salary converter', 'hourly to annual', 'wage calculator', 'paycheck estimate', 'bi-weekly salary'],
  },

  // Calculators 10-12: Health & Fitness
  {
    id: 'bmr-calculator',
    name: 'BMR Calculator (Basal Metabolic Rate)',
    slug: 'bmr-calculator',
    category: 'health',
    categoryLabel: 'Health & Fitness',
    route: '/health/bmr-calculator',
    archetype: 'direct',
    riskTier: 'T2',
    description: 'Calculate baseline daily calories burned at rest using the scientifically validated Mifflin-St Jeor equation.',
    icon: '🔥',
    keywords: ['bmr', 'basal metabolic rate', 'resting metabolism', 'calories burned', 'mifflin st jeor'],
  },
  {
    id: 'calorie-calculator',
    name: 'Calorie & TDEE Calculator',
    slug: 'calorie-calculator',
    category: 'health',
    categoryLabel: 'Health & Fitness',
    route: '/health/calorie-calculator',
    archetype: 'decision',
    riskTier: 'T2',
    description: 'Estimate Total Daily Energy Expenditure (TDEE) and caloric targets for weight loss, maintenance, or muscle gain.',
    icon: '🥗',
    keywords: ['tdee', 'daily calories', 'calorie deficit', 'weight loss calories', 'macro targets'],
  },
  {
    id: 'water-intake-calculator',
    name: 'Daily Water Intake Calculator',
    slug: 'water-intake-calculator',
    category: 'health',
    categoryLabel: 'Health & Wellness',
    route: '/health/water-intake-calculator',
    archetype: 'direct',
    riskTier: 'T1',
    description: 'Determine optimal daily hydration based on body weight, daily exercise, and ambient environmental climate.',
    icon: '💧',
    keywords: ['water intake', 'hydration', 'cups of water', 'daily water needs', 'liters of water'],
  },

  // Calculators 13-15: Math
  {
    id: 'average-calculator',
    name: 'Average (Mean, Median, Mode) Calculator',
    slug: 'average-calculator',
    category: 'math',
    categoryLabel: 'Math & Statistics',
    route: '/math/average-calculator',
    archetype: 'statistics',
    riskTier: 'T0',
    description: 'Calculate mean, median, mode, range, sum, count, and standard deviation for any dataset.',
    icon: '📊',
    keywords: ['average', 'mean', 'median', 'mode', 'standard deviation', 'range', 'dataset average'],
  },
  {
    id: 'fraction-calculator',
    name: 'Fraction Calculator',
    slug: 'fraction-calculator',
    category: 'math',
    categoryLabel: 'Math & Arithmetic',
    route: '/math/fraction-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Add, subtract, multiply, and divide fractions with automated common denominators and step-by-step reduction.',
    icon: '½',
    keywords: ['fraction', 'add fractions', 'simplify fractions', 'mixed numbers', 'denominator', 'numerator'],
  },
  {
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    slug: 'scientific-calculator',
    category: 'math',
    categoryLabel: 'Math & Science',
    route: '/math/scientific-calculator',
    archetype: 'interactive',
    riskTier: 'T0',
    description: 'Perform advanced mathematical operations including powers, roots, logarithms, trigonometric functions, and factorials.',
    icon: '🔬',
    keywords: ['scientific calculator', 'square root', 'trigonometry', 'sin cos tan', 'logarithm', 'powers'],
  },

  // Calculators 16-18: Construction & Everyday
  {
    id: 'square-footage-calculator',
    name: 'Square Footage Calculator',
    slug: 'square-footage-calculator',
    category: 'construction',
    categoryLabel: 'Construction & Real Estate',
    route: '/construction/square-footage-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Measure area in square feet, square meters, or square yards for flooring, tiling, and landscaping projects.',
    icon: '📏',
    keywords: ['square footage', 'sq ft', 'area calculator', 'flooring square feet', 'square meters'],
  },
  {
    id: 'paint-calculator',
    name: 'Paint Quantity Calculator',
    slug: 'paint-calculator',
    category: 'construction',
    categoryLabel: 'Construction & Painting',
    route: '/construction/paint-calculator',
    archetype: 'direct',
    riskTier: 'T1',
    description: 'Calculate how many gallons or liters of paint are needed to cover rooms with door and window deductions.',
    icon: '🎨',
    keywords: ['paint calculator', 'gallons of paint', 'wall area', 'paint coats', 'room painting'],
  },
  {
    id: 'tip-calculator',
    name: 'Tip & Bill Splitter Calculator',
    slug: 'tip-calculator',
    category: 'everyday',
    categoryLabel: 'Everyday Life',
    route: '/everyday/tip-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Quickly calculate dining gratuity, total check amounts, and split the bill evenly across any number of people.',
    icon: '🍽️',
    keywords: ['tip calculator', 'gratuity', 'split bill', 'restaurant tip', 'tip percentage'],
  },

  // Calculators 19-20: Everyday / Date & Time
  {
    id: 'age-calculator',
    name: 'Exact Age Calculator',
    slug: 'age-calculator',
    category: 'everyday',
    categoryLabel: 'Everyday & Calendar',
    route: '/everyday/age-calculator',
    archetype: 'date-time',
    riskTier: 'T0',
    description: 'Find your exact age in years, months, and days, total elapsed hours and minutes, and countdown to next birthday.',
    icon: '🎂',
    keywords: ['age calculator', 'chronological age', 'birthday countdown', 'days old', 'exact age'],
  },
  {
    id: 'date-difference-calculator',
    name: 'Date Difference & Duration Calculator',
    slug: 'date-difference-calculator',
    category: 'everyday',
    categoryLabel: 'Everyday & Calendar',
    route: '/everyday/date-difference-calculator',
    archetype: 'date-time',
    riskTier: 'T0',
    description: 'Calculate the exact number of days, weeks, and months between two dates with optional business day filtering.',
    icon: '📅',
    keywords: ['date difference', 'days between dates', 'date duration', 'business days', 'calendar difference'],
  },

  // Batch 1: Finance (Calculators 21-27)
  {
    id: 'auto-loan-calculator',
    name: 'Auto Loan Calculator',
    slug: 'auto-loan-calculator',
    category: 'finance',
    categoryLabel: 'Auto & Vehicle Finance',
    route: '/finance/auto-loan-calculator',
    archetype: 'decision',
    riskTier: 'T2',
    description: 'Estimate monthly auto loan payments, sales tax, down payment impact, and loan amortization.',
    icon: '🚗',
    keywords: ['auto loan', 'car payment', 'vehicle financing', 'car loan calculator', 'down payment'],
  },
  {
    id: 'refinance-calculator',
    name: 'Loan Refinance Calculator',
    slug: 'refinance-calculator',
    category: 'finance',
    categoryLabel: 'Mortgage & Loan Refinancing',
    route: '/finance/refinance-calculator',
    archetype: 'decision',
    riskTier: 'T2',
    description: 'Analyze monthly savings, break-even timeline, and net interest benefit from refinancing your mortgage or loan.',
    icon: '🔄',
    keywords: ['refinance', 'break even', 'mortgage refinance', 'monthly savings', 'closing costs'],
  },
  {
    id: '401k-calculator',
    name: '401(k) Retirement Savings Calculator',
    slug: '401k-calculator',
    category: 'finance',
    categoryLabel: 'Retirement & Investment',
    route: '/finance/401k-calculator',
    archetype: 'decision',
    riskTier: 'T2',
    description: 'Forecast retirement wealth accumulation with employer match contributions and annual compound growth.',
    icon: '📈',
    keywords: ['401k', 'retirement', 'employer match', 'wealth building', 'compound growth'],
  },
  {
    id: 'roi-calculator',
    name: 'ROI (Return on Investment) Calculator',
    slug: 'roi-calculator',
    category: 'finance',
    categoryLabel: 'Business & Investment',
    route: '/finance/roi-calculator',
    archetype: 'decision',
    riskTier: 'T2',
    description: 'Measure total return on investment percentage, annualized ROI (CAGR), and net financial profit.',
    icon: '💹',
    keywords: ['roi', 'return on investment', 'cagr', 'annualized return', 'profitability'],
  },
  {
    id: 'credit-card-payoff-calculator',
    name: 'Credit Card Payoff Calculator',
    slug: 'credit-card-payoff-calculator',
    category: 'finance',
    categoryLabel: 'Debt & Credit Management',
    route: '/finance/credit-card-payoff-calculator',
    archetype: 'decision',
    riskTier: 'T2',
    description: 'Calculate months to eliminate credit card debt and total interest paid under custom monthly installments.',
    icon: '💳',
    keywords: ['credit card payoff', 'debt free', 'credit card interest', 'payoff timeline', 'minimum payment'],
  },
  {
    id: 'cd-calculator',
    name: 'Certificate of Deposit (CD) Calculator',
    slug: 'cd-calculator',
    category: 'finance',
    categoryLabel: 'Banking & Fixed Income',
    route: '/finance/cd-calculator',
    archetype: 'decision',
    riskTier: 'T2',
    description: 'Compute compound interest earnings, APY yield, and final maturity balance for fixed-term certificates of deposit.',
    icon: '🏦',
    keywords: ['cd calculator', 'certificate of deposit', 'apy', 'cd maturity', 'fixed deposit'],
  },
  {
    id: 'inflation-calculator',
    name: 'Inflation & Purchasing Power Calculator',
    slug: 'inflation-calculator',
    category: 'finance',
    categoryLabel: 'Economics & Inflation',
    route: '/finance/inflation-calculator',
    archetype: 'decision',
    riskTier: 'T2',
    description: 'Measure cumulative historical or projected inflation, future purchasing power, and real asset value depreciation.',
    icon: '📉',
    keywords: ['inflation calculator', 'purchasing power', 'cpi', 'future dollar value', 'price increase'],
  },

  // Batch 2: Health (Calculators 28-33)
  {
    id: 'body-fat-calculator',
    name: 'US Navy Body Fat Calculator',
    slug: 'body-fat-calculator',
    category: 'health',
    categoryLabel: 'Body Composition & Anthropometry',
    route: '/health/body-fat-calculator',
    archetype: 'professional',
    riskTier: 'T2',
    description: 'Estimate body fat percentage and lean tissue mass using official US Department of Defense tape circumference formulas.',
    icon: '📏',
    keywords: ['body fat', 'navy body fat', 'body composition', 'fat percentage', 'lean mass'],
  },
  {
    id: 'macro-calculator',
    name: 'Macronutrient Split Calculator',
    slug: 'macro-calculator',
    category: 'health',
    categoryLabel: 'Nutrition & Dietetics',
    route: '/health/macro-calculator',
    archetype: 'professional',
    riskTier: 'T2',
    description: 'Calculate target daily grams and calorie distributions of protein, carbohydrates, and dietary fats.',
    icon: '🥗',
    keywords: ['macro calculator', 'macronutrients', 'protein intake', 'carb split', 'diet calories'],
  },
  {
    id: 'pace-calculator',
    name: 'Running Pace & Finish Time Calculator',
    slug: 'pace-calculator',
    category: 'health',
    categoryLabel: 'Athletics & Endurance',
    route: '/health/pace-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Calculate running pace per mile or kilometer, split intervals, and projected race finish times across 5K, 10K, half, and full marathon.',
    icon: '🏃',
    keywords: ['pace calculator', 'running pace', 'marathon finish time', 'split times', '5k pace'],
  },
  {
    id: 'ideal-weight-calculator',
    name: 'Ideal Body Weight (IBW) Calculator',
    slug: 'ideal-weight-calculator',
    category: 'health',
    categoryLabel: 'Clinical Anthropometry',
    route: '/health/ideal-weight-calculator',
    archetype: 'professional',
    riskTier: 'T2',
    description: 'Determine target healthy body weight ranges across Devine, Robinson, Miller, and Hamwi clinical formulas.',
    icon: '⚖️',
    keywords: ['ideal weight', 'ibw', 'devine formula', 'target weight', 'healthy weight range'],
  },
  {
    id: 'target-heart-rate-calculator',
    name: 'Target Heart Rate Training Zone Calculator',
    slug: 'target-heart-rate-calculator',
    category: 'health',
    categoryLabel: 'Cardiovascular Fitness',
    route: '/health/target-heart-rate-calculator',
    archetype: 'professional',
    riskTier: 'T2',
    description: 'Calculate target aerobic training heart rate zones using Tanaka maximum heart rate and Karvonen heart rate reserve equations.',
    icon: '💓',
    keywords: ['target heart rate', 'heart rate zones', 'karvonen formula', 'aerobic zone', 'max heart rate'],
  },
  {
    id: 'pregnancy-due-date-calculator',
    name: 'Pregnancy Due Date & Gestational Age Calculator',
    slug: 'pregnancy-due-date-calculator',
    category: 'health',
    categoryLabel: 'Obstetrics & Gestation',
    route: '/health/pregnancy-due-date-calculator',
    archetype: 'professional',
    riskTier: 'T2',
    description: 'Calculate estimated date of delivery (EDD), current gestational week, and developmental trimester milestones using Naegele’s Rule.',
    icon: '👶',
    keywords: ['pregnancy due date', 'gestational age', 'naegele rule', 'edd', 'trimester schedule'],
  },

  // Batch 3: Math (Calculators 34-39)
  {
    id: 'quadratic-calculator',
    name: 'Quadratic Equation Solver',
    slug: 'quadratic-calculator',
    category: 'math',
    categoryLabel: 'Algebra & Polynomials',
    route: '/math/quadratic-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Solve quadratic equations ax² + bx + c = 0 with exact real or complex discriminant analysis and parabola vertex coordinates.',
    icon: '📐',
    keywords: ['quadratic formula', 'quadratic solver', 'discriminant', 'parabola vertex', 'roots'],
  },
  {
    id: 'ratio-calculator',
    name: 'Ratio & Proportion Solver',
    slug: 'ratio-calculator',
    category: 'math',
    categoryLabel: 'Algebra & Arithmetic',
    route: '/math/ratio-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Simplify mathematical ratios to lowest integer terms, scale proportions (A:B = C:D), and divide quantities proportionally.',
    icon: '⚖️',
    keywords: ['ratio calculator', 'proportion solver', 'simplify ratio', 'cross multiplication', 'aspect ratio'],
  },
  {
    id: 'permutation-combination-calculator',
    name: 'Permutations & Combinations (nPr / nCr) Calculator',
    slug: 'permutation-combination-calculator',
    category: 'math',
    categoryLabel: 'Combinatorics & Discrete Math',
    route: '/math/permutation-combination-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Compute exact permutations nPr and combinations nCr with arbitrary-precision integer factorials without floating-point overflow.',
    icon: '🎲',
    keywords: ['permutations', 'combinations', 'npr', 'ncr', 'factorials', 'combinatorics'],
  },
  {
    id: 'standard-deviation-calculator',
    name: 'Standard Deviation & Variance Calculator',
    slug: 'standard-deviation-calculator',
    category: 'math',
    categoryLabel: 'Statistics & Probability',
    route: '/math/standard-deviation-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Calculate sample and population standard deviation, variance, mean, and sum of squared deviations with step-by-step traces.',
    icon: '📊',
    keywords: ['standard deviation', 'variance', 'sample standard deviation', 'bessel correction', 'mean'],
  },
  {
    id: 'exponent-calculator',
    name: 'Exponent & Power Calculator',
    slug: 'exponent-calculator',
    category: 'math',
    categoryLabel: 'Arithmetic & Algebra',
    route: '/math/exponent-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Evaluate base raised to integer or decimal powers, scientific notation notation, and roots.',
    icon: '⚡',
    keywords: ['exponent calculator', 'power calculator', 'scientific notation', 'squared', 'cubed'],
  },
  {
    id: 'logarithm-calculator',
    name: 'Logarithm (Log & Ln) Calculator',
    slug: 'logarithm-calculator',
    category: 'math',
    categoryLabel: 'Algebra & Analysis',
    route: '/math/logarithm-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Compute common logarithms (base 10), natural logarithms (ln), binary logs (base 2), and arbitrary custom base logarithms.',
    icon: '🪵',
    keywords: ['logarithm calculator', 'natural log', 'log base 10', 'ln', 'change of base'],
  },

  // Batch 4: Construction (Calculators 40-44)
  {
    id: 'flooring-calculator',
    name: 'Flooring & Tile Quantity Calculator',
    slug: 'flooring-calculator',
    category: 'construction',
    categoryLabel: 'Interior Construction',
    route: '/construction/flooring-calculator',
    archetype: 'direct',
    riskTier: 'T1',
    description: 'Calculate total flooring square footage, required tile or plank boxes, and cost with waste allowance.',
    icon: '🪵',
    keywords: ['flooring calculator', 'tile calculator', 'hardwood boxes', 'flooring square footage', 'waste factor'],
  },
  {
    id: 'mulch-calculator',
    name: 'Mulch & Topsoil Volume Calculator',
    slug: 'mulch-calculator',
    category: 'construction',
    categoryLabel: 'Landscaping & Earthwork',
    route: '/construction/mulch-calculator',
    archetype: 'direct',
    riskTier: 'T1',
    description: 'Calculate cubic yards, cubic feet, and retail bagged units needed for garden beds at specified depth.',
    icon: '🌱',
    keywords: ['mulch calculator', 'topsoil calculator', 'cubic yards of mulch', 'garden bed coverage', 'bagged mulch'],
  },
  {
    id: 'roofing-calculator',
    name: 'Roofing Shingle & Pitch Calculator',
    slug: 'roofing-calculator',
    category: 'construction',
    categoryLabel: 'Exterior & Roofing',
    route: '/construction/roofing-calculator',
    archetype: 'direct',
    riskTier: 'T1',
    description: 'Estimate true roof slope surface area, roofing squares, and asphalt shingle bundles from ground footprint and pitch.',
    icon: '🏠',
    keywords: ['roofing calculator', 'roof squares', 'shingle bundles', 'roof pitch factor', 'slope multiplier'],
  },
  {
    id: 'drywall-calculator',
    name: 'Drywall Sheet & Mud Calculator',
    slug: 'drywall-calculator',
    category: 'construction',
    categoryLabel: 'Drywall & Framing',
    route: '/construction/drywall-calculator',
    archetype: 'direct',
    riskTier: 'T1',
    description: 'Estimate drywall sheets (4x8 and 4x12), joint tape rolls, screws, and joint compound gallons for room walls and ceilings.',
    icon: '🧱',
    keywords: ['drywall calculator', 'sheetrock', 'drywall sheets', 'joint tape', 'joint compound mud'],
  },
  {
    id: 'gravel-calculator',
    name: 'Gravel & Crushed Stone Tonnage Calculator',
    slug: 'gravel-calculator',
    category: 'construction',
    categoryLabel: 'Driveways & Masonry',
    route: '/construction/gravel-calculator',
    archetype: 'direct',
    riskTier: 'T1',
    description: 'Calculate required volume and tons of gravel, crushed stone, or aggregate for driveways and paths based on material bulk density.',
    icon: '🪨',
    keywords: ['gravel calculator', 'tons of gravel', 'crushed stone', 'driveway gravel', 'aggregate weight'],
  },

  // Batch 5: Everyday & Converters (Calculators 45-50)
  {
    id: 'discount-calculator',
    name: 'Discount & Sales Tax Calculator',
    slug: 'discount-calculator',
    category: 'everyday',
    categoryLabel: 'Shopping & Retail',
    route: '/everyday/discount-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Compute sale prices, chained stackable coupons, sales tax additions, and total dollar savings.',
    icon: '🏷️',
    keywords: ['discount calculator', 'sale price', 'coupon discount', 'sales tax', 'percentage off'],
  },
  {
    id: 'fuel-cost-calculator',
    name: 'Fuel Cost & Road Trip Calculator',
    slug: 'fuel-cost-calculator',
    category: 'everyday',
    categoryLabel: 'Travel & Transportation',
    route: '/everyday/fuel-cost-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Estimate road trip fuel consumption, total gas expenses, cost per passenger, and fuel efficiency in MPG or L/100km.',
    icon: '⛽',
    keywords: ['fuel cost calculator', 'gas calculator', 'road trip cost', 'mpg cost', 'fuel consumption'],
  },
  {
    id: 'time-duration-calculator',
    name: 'Time Duration & Work Hours Calculator',
    slug: 'time-duration-calculator',
    category: 'everyday',
    categoryLabel: 'Time & Productivity',
    route: '/everyday/time-duration-calculator',
    archetype: 'date-time',
    riskTier: 'T0',
    description: 'Calculate elapsed hours, minutes, and seconds between two clock timestamps with optional unpaid lunch break deduction.',
    icon: '⏱️',
    keywords: ['time duration', 'hours between times', 'work hours calculator', 'timesheet calculator', 'elapsed time'],
  },
  {
    id: 'electricity-calculator',
    name: 'Electricity Usage & Appliance Cost Calculator',
    slug: 'electricity-calculator',
    category: 'everyday',
    categoryLabel: 'Utilities & Home Energy',
    route: '/everyday/electricity-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Compute daily, monthly, and annual kilowatt-hour (kWh) electricity consumption and operating costs for household appliances.',
    icon: '⚡',
    keywords: ['electricity cost calculator', 'kwh calculator', 'appliance energy cost', 'electric bill', 'power consumption'],
  },
  {
    id: 'recipe-scaler-calculator',
    name: 'Recipe Multiplier & Portion Scaler',
    slug: 'recipe-scaler-calculator',
    category: 'everyday',
    categoryLabel: 'Culinary & Baking',
    route: '/everyday/recipe-scaler-calculator',
    archetype: 'direct',
    riskTier: 'T0',
    description: 'Scale ingredient quantities up or down precisely based on target servings or multiplier factors with mixed fraction formatting.',
    icon: '🍳',
    keywords: ['recipe scaler', 'recipe multiplier', 'scale ingredients', 'baking portions', 'serving scaler'],
  },
  {
    id: 'currency-converter',
    name: 'Global Currency Converter',
    slug: 'currency-converter',
    category: 'converters',
    categoryLabel: 'Foreign Exchange & Units',
    route: '/converters/currency-converter',
    archetype: 'converter',
    riskTier: 'T1',
    description: 'Convert world currencies instantly with real-time benchmark rates, swap controls, and transparent bank spread fee analysis.',
    icon: '💱',
    keywords: ['currency converter', 'foreign exchange', 'fx rates', 'usd to eur', 'exchange rate fee'],
  },
];

export const CATEGORY_LIST: CategoryMetadata[] = [
  {
    id: 'finance',
    name: 'Personal Finance, Loans & Mortgages',
    shortName: 'Finance',
    tagline: 'Deterministic financial models for loans, compound interest, mortgages, and wage conversions.',
    description:
      'Financial decisions carry significant monetary impact. CalcWise provides precision financial engines adhering to regulatory disclosure standards, using arbitrary-precision decimal mathematics to eliminate floating-point penny drift across multi-decade schedules.',
    icon: '💰',
    route: '/finance',
    riskTierSummary: 'Tier T2 (Financial Decision & Planning) — Verified with standard reducing-balance and continuous compounding formulas.',
    standardsBody: 'Consumer Financial Protection Bureau (CFPB), Federal Reserve Regulation Z (Truth in Lending Act), SEC',
    standardsSummary:
      'All interest and amortization calculations compute exact periodic installments with 28-digit internal precision and Banker’s rounding on fractional cents.',
    faqs: [
      {
        question: 'How does CalcWise prevent rounding errors in loan and interest calculations?',
        answer:
          'CalcWise executes all financial arithmetic using decimal.js, a 28-digit arbitrary-precision mathematics engine. This eliminates the floating-point errors inherent in standard JavaScript numbers (e.g. 0.1 + 0.2 = 0.30000000000000004), guaranteeing cent-level reconciliation throughout multi-decade amortization schedules.',
      },
      {
        question: 'What is the difference between simple and compound interest?',
        answer:
          'Simple interest is calculated solely on the original principal amount for the duration of the loan or deposit (I = P × r × t). Compound interest calculates interest on both the initial principal and the accumulated interest from prior compounding periods, accelerating capital growth over time.',
      },
      {
        question: 'How is the monthly payment (EMI) calculated?',
        answer:
          'We use the standard reducing-balance formula: EMI = [P × r × (1 + r)^n] ÷ [(1 + r)^n - 1], where P is principal, r is the periodic monthly interest rate, and n is total months. Principal and interest are separated for each month in an inspectable amortization schedule.',
      },
    ],
  },
  {
    id: 'health',
    name: 'Health, Fitness & Metabolic Screening',
    shortName: 'Health',
    tagline: 'Evidence-based metabolic screening, anthropometric indices, and clinical nutritional estimates.',
    description:
      'Health calculators provide essential personal baseline metrics for fitness planning, nutrition balancing, and wellness monitoring. All models strictly follow peer-reviewed clinical guidelines and the World Health Organization anthropometric standards.',
    icon: '❤️',
    route: '/health',
    riskTierSummary: 'Tier T2 (Health Screening & Wellness) — Non-diagnostic physiological estimates based on clinical literature.',
    standardsBody: 'World Health Organization (WHO), US Centers for Disease Control and Prevention (CDC), American College of Sports Medicine (ACSM)',
    standardsSummary:
      'Calculations implement the WHO BMI Classification system and the Mifflin-St Jeor equation (considered the most accurate predictive resting metabolic rate standard by the Academy of Nutrition and Dietetics).',
    faqs: [
      {
        question: 'Are these calculators a substitute for medical advice?',
        answer:
          'No. All health calculators on CalcWise are informational screening tools intended for healthy adults. They do not constitute clinical diagnosis, personalized medical prescription, or treatment advice. Consult a healthcare provider before beginning significant dietary or athletic changes.',
      },
      {
        question: 'Why is Mifflin-St Jeor preferred over the Harris-Benedict equation for BMR?',
        answer:
          'Multiple systematic reviews and the Academy of Nutrition and Dietetics have demonstrated that the Mifflin-St Jeor equation predicts resting metabolic rate within 10% of measured indirect calorimetry more consistently (in approximately 82% of individuals) than the older 1919/1984 Harris-Benedict formulas.',
      },
      {
        question: 'Does BMI account for muscle mass or body composition?',
        answer:
          'BMI (kg/m²) is an epidemiological population screening metric that correlates well with body fat across large groups, but it does not differentiate between lean muscle mass, bone density, and adipose tissue in athletic or bodybuilder populations.',
      },
    ],
  },
  {
    id: 'math',
    name: 'Math, Algebra & Statistical Computation',
    shortName: 'Math',
    tagline: 'Pure mathematical engines, exact fraction reduction, statistical distributions, and algebraic evaluations.',
    description:
      'From classroom arithmetic to statistical analysis and algebraic function evaluations, CalcWise provides clear step-by-step traces explaining the exact operations, formulas, and laws applied.',
    icon: '➗',
    route: '/math',
    riskTierSummary: 'Tier T0 (Deterministic Pure Math) — Standard axiomatic mathematical formulas and exact fractional arithmetic.',
    standardsBody: 'NIST Information Technology Laboratory, International Mathematical Union (IMU), IEEE 754-2019',
    standardsSummary:
      'Exact integer fraction simplification using the Euclidean Greatest Common Divisor (GCD) algorithm, NIST sample descriptive statistics, and sandboxed algebraic parsing.',
    faqs: [
      {
        question: 'How does the Scientific Calculator evaluate expressions without eval()?',
        answer:
          'To guarantee safety and security, CalcWise uses a custom deterministic tokenization and recursive-descent Abstract Syntax Tree (AST) evaluator adhering strictly to standard PEMDAS operator precedence, rather than executing insecure JavaScript eval().',
      },
      {
        question: 'What is the difference between sample variance and population variance?',
        answer:
          'Population variance (σ²) divides the sum of squared deviations by N (the total population size). Sample variance (s²) uses Bessel’s correction, dividing by n - 1 to provide an unbiased estimator of the population variance from a subset sample.',
      },
      {
        question: 'How does the Fraction Calculator preserve exact precision?',
        answer:
          'Unlike floating-point decimal converters which introduce truncation or rounding artifacts (like 1/3 becoming 0.33333333333), CalcWise fraction engines maintain whole numerator and denominator integers using Euclidean GCD normalization.',
      },
    ],
  },
  {
    id: 'construction',
    name: 'Construction, DIY & Materials Estimation',
    shortName: 'Construction',
    tagline: 'Dimensional material volume estimators, multi-room square footage, and trade-accurate coverage ratios.',
    description:
      'Underestimating materials leads to costly project delays; overestimating results in wasted money and excess disposal. CalcWise provides trade-tested volumetric and surface formulas with customizable waste margins.',
    icon: '🏗️',
    route: '/construction',
    riskTierSummary: 'Tier T1 (Physical Material Estimation) — Dimensional formulas incorporating standard trade safety margins.',
    standardsBody: 'American Concrete Institute (ACI), National Association of Home Builders (NAHB), ASTM International',
    standardsSummary:
      'Volumetric computations convert dimensional units (feet, inches, yards, meters) into trade standard unit yields (cubic yards, cubic meters, 50/60/80lb concrete bags, paint gallons at 350 sq ft/gal).',
    faqs: [
      {
        question: 'Why is a waste factor recommended for construction calculations?',
        answer:
          'Physical materials incur cut-offs, irregular subgrade depths, spillage, and form deflection during actual pours and installations. A 5% to 15% allowance ensures your project does not run short mid-pour or mid-installation.',
      },
      {
        question: 'How many bags of concrete make one cubic yard?',
        answer:
          'One cubic yard equals 27 cubic feet. A standard 80-pound bag yields approximately 0.60 cubic feet of mixed concrete (45 bags/yd³); a 60-pound bag yields approximately 0.45 cubic feet (60 bags/yd³); and a 50-pound bag yields approximately 0.375 cubic feet (72 bags/yd³).',
      },
      {
        question: 'How much area does one gallon of paint cover?',
        answer:
          'The architectural industry standard for interior paint coverage is approximately 350 to 400 square feet per gallon on pre-primed, smooth surfaces. Rough or unprimed drywall may require more.',
      },
    ],
  },
  {
    id: 'everyday',
    name: 'Everyday Utilities & Calendar Math',
    shortName: 'Everyday',
    tagline: 'Practical everyday utilities for dining gratuities, chronological age breakdown, and calendar durations.',
    description:
      'Everyday calculations should be quick, accurate, and frictionless. CalcWise simplifies daily calculations from splitting restaurant bills to computing exact elapsed calendar durations.',
    icon: '📅',
    route: '/everyday',
    riskTierSummary: 'Tier T0 (Everyday Utility & Calendar) — Standard conventions and ISO-8601 calendar arithmetic.',
    standardsBody: 'ISO 8601 Date and Time Format, Dining Industry Gratuity Standards',
    standardsSummary:
      'Calendar arithmetic accounts for leap year Gregorian calendar rules, varying month day counts (28, 29, 30, 31), and Monday–Friday business day filters.',
    faqs: [
      {
        question: 'How are leap years handled in the Age and Date Difference calculators?',
        answer:
          'Calculations evaluate exact Gregorian calendar boundaries. When calculating chronological age from a leap day (February 29), common years treat the anniversary as March 1st, preserving exact calendar day increments.',
      },
      {
        question: 'Can the Date Difference tool exclude weekends?',
        answer:
          'Yes. The date difference engine includes a business day calculation mode that counts only Mondays through Fridays between the start and end dates.',
      },
      {
        question: 'Can the Tip Calculator split bills and round to the nearest whole dollar?',
        answer:
          'Yes. CalcWise calculates exact percentage tips, divides the total by any party size, and includes an optional toggle to round the final bill up to the nearest whole dollar for convenience.',
      },
    ],
  },
  {
    id: 'converters',
    name: 'Measurement & Unit Converters',
    shortName: 'Converters',
    tagline: 'High-precision unit conversions across Length, Weight, Temperature, Volume, Speed, and Digital Storage.',
    description:
      'Converting between imperial, US customary, and metric systems requires exact conversion factors. CalcWise implements official SI definitions to prevent precision loss across round-trip transformations.',
    icon: '⇄',
    route: '/converters',
    riskTierSummary: 'Tier T0 (Unit Conversion Graph) — Canonical conversion graph based on exact International System of Units (SI) definitions.',
    standardsBody: 'Bureau International des Poids et Mesures (BIPM), NIST SP 811 (Guide for the Use of the International System of Units)',
    standardsSummary:
      'Exact conversion factors (e.g. 1 inch = 0.0254 m exactly, 1 lb = 0.45359237 kg exactly). Affine conversions for temperature (°C, °F, K) maintain round-trip algebraic symmetry.',
    faqs: [
      {
        question: 'Why do some online converters give slightly different results?',
        answer:
          'Many converters use approximated constants (e.g. 2.2 lbs per kg instead of 2.2046226218...). CalcWise relies on exact legal definitions published by NIST and BIPM, using arbitrary-precision math to avoid accumulated floating-point rounding errors.',
      },
      {
        question: 'How does affine temperature conversion work?',
        answer:
          'Unlike linear units that scale through multiplication, temperature scales have differing zero points. CalcWise applies exact affine transformations: °C = (°F - 32) × 5/9 and K = °C + 273.15.',
      },
    ],
  },
];

export function getCategoryMetadata(id: string): CategoryMetadata | undefined {
  return CATEGORY_LIST.find((cat) => cat.id === id);
}

export function getCalculatorsByCategory(category: string): CalculatorMetadata[] {
  return CALCULATOR_REGISTRY.filter((calc) => calc.category === category);
}

export function getRelatedCalculators(currentSlug: string, count: number = 4): CalculatorMetadata[] {
  const current = CALCULATOR_REGISTRY.find((c) => c.slug === currentSlug);
  if (!current) return CALCULATOR_REGISTRY.slice(0, count);

  const sameCat = CALCULATOR_REGISTRY.filter((c) => c.category === current.category && c.slug !== currentSlug);
  if (sameCat.length >= count) return sameCat.slice(0, count);

  const others = CALCULATOR_REGISTRY.filter((c) => c.category !== current.category);
  return [...sameCat, ...others].slice(0, count);
}

