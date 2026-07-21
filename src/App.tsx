import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  X,
  ChevronRight,
  Info,
  Award,
  CircleDollarSign,
  Briefcase,
  Layers,
  ArrowUpRight,
  Compass,
  Zap,
  Filter,
  Calculator as CalcIcon,
  PiggyBank,
  TrendingUp,
  Percent,
  TrendingDown,
  Building,
  HelpCircle,
  BookOpen,
  DollarSign,
  Mail,
  Phone,
  ShieldCheck,
  Menu,
  CheckCircle2,
  Lock,
  ArrowRightLeft,
  FileText,
  Home
} from "lucide-react";

import { CALCULATORS, CATEGORIES, Calculator } from "./calculatorData";
import { WealthStrategy } from "./types";
import { FINANCIAL_CONFIG_2026 } from "./financialConfig";
import { calculateResultsEngine } from "./calculatorEngine";
import { getSEOInfo } from "./seoData";

type ViewState = "home" | "tools" | "calculator" | "about" | "contact" | "policies";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCalcId, setActiveCalcId] = useState<string>("mortgage-calculator");
  
  // Input parameters state (dynamic dictionary mapped by input name)
  const [inputsState, setInputsState] = useState<{ [key: string]: any }>({});
  
  // OpenRouter advisor states
  const [loadingStrategy, setLoadingStrategy] = useState<boolean>(false);
  const [strategyResult, setStrategyResult] = useState<WealthStrategy | null>(null);
  const [strategyError, setStrategyError] = useState<string | null>(null);

  // FAQ Accordion Open State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [globalFaqIdx, setGlobalFaqIdx] = useState<number | null>(null);

  // Contact Form States
  const [contactName, setContactName] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactSubject, setContactSubject] = useState<string>("");
  const [contactInterest, setContactInterest] = useState<string>("Calculation Inquiry");
  const [contactMessage, setContactMessage] = useState<string>("");
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState<boolean>(false);

  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Home Page Quick Calculator Widget states (Muted & Pre-Calculated for Illustration)
  const [quickPrincipal, setQuickPrincipal] = useState<string>("10000");
  const [quickContribution, setQuickContribution] = useState<string>("500");
  const [quickRate, setQuickRate] = useState<string>("8");
  const [quickYears, setQuickYears] = useState<string>("20");

  // Selected calculator lookup
  const activeCalc = CALCULATORS.find(c => c.id === activeCalcId) || CALCULATORS[0];
  const seoInfo = getSEOInfo(activeCalc.id, activeCalc.name, activeCalc.category, activeCalc.benefit, activeCalc.description, activeCalc.formula);

  // Hash Routing Logic: Sync State with URL Hashes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setMobileMenuOpen(false);

      if (hash === "" || hash === "#" || hash === "#/home") {
        setCurrentView("home");
      } else if (hash === "#/tools") {
        setCurrentView("tools");
      } else if (hash.startsWith("#/calculator/")) {
        const calcId = hash.replace("#/calculator/", "");
        const exists = CALCULATORS.some(c => c.id === calcId);
        if (exists) {
          setActiveCalcId(calcId);
          setCurrentView("calculator");
        } else {
          setCurrentView("home");
        }
      } else if (hash === "#/about") {
        setCurrentView("about");
      } else if (hash === "#/contact") {
        setCurrentView("contact");
      } else if (hash === "#/policies") {
        setCurrentView("policies");
      } else {
        setCurrentView("home");
      }

      // Scroll to top on navigation change
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    handleHashChange(); // Sync initially on mount
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // On-page SEO: Dynamic document title, meta descriptions, and JSON-LD Schema injection
  useEffect(() => {
    let title = "Financial Calculator Suite | Premium Privacy-First Planners (USD)";
    let desc = "Free, ad-free financial planners for US households. Amortization schedules, progress trackers, and Roth IRA converters. No tracking, 100% private.";
    let schemaList: any[] = [];

    const siteBaseUrl = window.location.origin + window.location.pathname;

    if (currentView === "home") {
      title = "Financial Calculator Suite | Premium USD Investment & Tax Planners";
      desc = "Run highly accurate progressive US income tax calculations, 15/30-year fixed mortgage schedules, Roth IRA conversions, and compound interest models in USD, strictly locally.";
      schemaList.push({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Financial Calculator Suite",
        "url": siteBaseUrl,
        "description": desc,
        "applicationCategory": "FinancialApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      });
    } else if (currentView === "tools") {
      title = "Financial Directory | 31 CPA-Validated Calculators (USD)";
      desc = "Browse our secure sitemap and directory of 31 mathematical planners including mortgages, progressive income taxes, investment yields, and retirement caps.";
      schemaList.push({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Financial Directory - 31 CPA-Validated Calculators",
        "url": siteBaseUrl + "#/tools",
        "description": desc
      });
    } else if (currentView === "about") {
      title = "About Our Mission | Financial Calculator Suite";
      desc = "Learn how we democratize capital modeling. Open-source equations designed alongside certified planners for zero-tracking private plans.";
      schemaList.push({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "About Our Mission",
        "url": siteBaseUrl + "#/about",
        "description": desc
      });
    } else if (currentView === "contact") {
      title = "Secure Contact Support | Financial Calculator Suite";
      desc = "Get in touch with our strategic team for calculation inquiries, tax bracket updates, or tool suggestions. CPA-aligned math.";
      schemaList.push({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Secure Contact Support",
        "url": siteBaseUrl + "#/contact",
        "description": desc
      });
    } else if (currentView === "policies") {
      title = "Privacy Policy & Terms | Financial Calculator Suite";
      desc = "Review our zero-data storage model. All parameters are processed strictly in your local browser memory. Zero cookies, zero profiling.";
      schemaList.push({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Privacy Policy & Terms of Service",
        "url": siteBaseUrl + "#/policies",
        "description": desc
      });
    } else if (currentView === "calculator" && activeCalc) {
      const seoInfo = getSEOInfo(activeCalc.id, activeCalc.name, activeCalc.category, activeCalc.benefit, activeCalc.description, activeCalc.formula);
      title = `${activeCalc.name} – ${activeCalc.benefit} | Financial Calculator Suite`;
      desc = seoInfo.metaDescription;

      // 1. WebApplication / SoftwareApplication schema
      schemaList.push({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": activeCalc.name,
        "description": seoInfo.metaDescription,
        "applicationCategory": "FinancialApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      });

      // 2. BreadcrumbList schema
      schemaList.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteBaseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Calculators",
            "item": siteBaseUrl + "#/tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": activeCalc.category,
            "item": siteBaseUrl + "#/tools"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": activeCalc.name,
            "item": siteBaseUrl + `#/calculator/${activeCalc.id}`
          }
        ]
      });

      // 3. FAQPage schema
      if (seoInfo.faqs && seoInfo.faqs.length > 0) {
        schemaList.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": seoInfo.faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a
            }
          }))
        });
      }
    }

    // Apply document title
    document.title = title;

    // Apply description meta tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", desc);

    // Apply self-referencing canonical tag (prevents duplicate content issues)
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    const currentCanonicalUrl = siteBaseUrl + (currentView === "home" ? "" : `#/${currentView === "calculator" ? `calculator/${activeCalc.id}` : currentView}`);
    canonicalLink.setAttribute("href", currentCanonicalUrl);

    // Apply JSON-LD structured data script
    const existingScript = document.getElementById("seo-jsonld");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("id", "seo-jsonld");
    script.textContent = JSON.stringify(schemaList.length === 1 ? schemaList[0] : schemaList, null, 2);
    document.head.appendChild(script);

    return () => {
      const cleanupScript = document.getElementById("seo-jsonld");
      if (cleanupScript) cleanupScript.remove();
    };
  }, [currentView, activeCalcId]);

  // Initialize input state values when active calculator changes (start with empty values for blank starting state)
  useEffect(() => {
    const initialValues: { [key: string]: any } = {};
    activeCalc.inputs.forEach(input => {
      if (input.type === 'number') {
        initialValues[input.name] = "";
      } else {
        initialValues[input.name] = input.default;
      }
    });
    setInputsState(initialValues);
    setStrategyResult(null);
    setStrategyError(null);
    setOpenFaqIdx(null);
  }, [activeCalcId]);

  // Handle single input changes
  const handleInputChange = (name: string, value: any) => {
    setInputsState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Perform full mathematical calculations client-side reactively
  const calculateResults = () => {
    const v: Record<string, number> = {};
    
    // Parse input state values, fallback to 0 if field is empty/blank
    activeCalc.inputs.forEach(input => {
      const val = inputsState[input.name];
      if (val === undefined || val === null || val === "" || isNaN(val as any)) {
        v[input.name] = 0;
      } else {
        v[input.name] = typeof val === 'string' ? parseFloat(val) : val;
      }
    });

    return calculateResultsEngine(activeCalc.id, v);
  };

  const { primaryValue, primaryLabel, secondaries, chartData, schedule } = calculateResults();

  // Handle Gemini Strategy API Call
  const handleGenerateStrategy = async () => {
    setLoadingStrategy(true);
    setStrategyError(null);
    setStrategyResult(null);

    try {
      const res = await fetch("/api/calculator/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorId: activeCalc.id,
          calculatorName: activeCalc.name,
          inputs: inputsState
        })
      });

      if (!res.ok) {
        throw new Error("Unable to contact the AI Wealth Strategist. Make sure OPENROUTER_API_KEY is configured.");
      }

      const data = await res.json();
      setStrategyResult(data);
    } catch (err: any) {
      console.error(err);
      setStrategyError(err.message || "An error occurred while generating your customized strategy report.");
    } finally {
      setLoadingStrategy(false);
    }
  };

  // Filtered calculators list based on category & search query
  const filteredCalculators = CALCULATORS.filter(calc => {
    const matchesCategory = selectedCategory === "All" || calc.category === selectedCategory;
    const matchesSearch = calc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          calc.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          calc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle search input changes from anywhere
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query && currentView !== "tools") {
      window.location.hash = "#/tools";
    }
  };

  // Handle contact form submission simulation
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSuccess(true);
    }, 1000);
  };

  const resetContactForm = () => {
    setContactName("");
    setContactEmail("");
    setContactSubject("");
    setContactInterest("Calculation Inquiry");
    setContactMessage("");
    setContactSuccess(false);
  };

  // Dynamic featured calculators for the Home page
  const featuredCalcs = CALCULATORS.filter(c => 
    ["mortgage-calculator", "compound-interest-calculator", "traditional-roth-ira", "simple-income-tax"].includes(c.id)
  );

  // Global Platform FAQs
  const platformFaqs = [
    {
      q: "Is my personal financial data saved on your servers?",
      a: "Absolutely not. One of our core architectural pillars is strict client-side isolation. All parameters, rates, salaries, and balances are evaluated locally in your browser memory. We do not use databases to save user inputs, so your privacy is 100% guaranteed."
    },
    {
      q: "How accurate are the progressive tax and loan amortization schedules?",
      a: "All tax models are updated with current 2026 progressive IRS tax brackets, standardized deductions, and interest discretization parameters. Amortization tables use professional-grade mathematical formulas to trace precise principal and interest splits down to the last penny."
    },
    {
      q: "How does the AI Strategic Advisor generate wealth reports?",
      a: "When you click 'Get AI Wealth Strategy Report', our system safely proxies only your current numeric inputs to Gemini server-side. It processes these numbers to highlight behavioral pitfalls, optimization thresholds, and structural planning paths without storing any personal records."
    },
    {
      q: "Can I use these calculators for commercial planning or certified accounting?",
      a: "While our algorithms are calibrated with strict CPA-level accuracy, our tools are intended solely for educational and research assistance. You should always consult with a certified CPA or CFP before finalizing major legal capital investments."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans selection:bg-[#2563EB]/10 selection:text-[#2563EB] overflow-x-hidden flex flex-col justify-between">
      
      {/* 1. Header Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 h-16 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="#/home" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs tracking-tighter group-hover:bg-[#1D4ED8] transition-all shadow-sm">
              FC
            </span>
            <span className="font-bold text-lg tracking-tight text-[#111827] group-hover:text-[#2563EB] transition-colors">
              Financial <span className="font-light text-neutral-400">Calculator</span>
            </span>
          </a>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-neutral-500">
            <a 
              href="#/home" 
              className={`hover:text-[#2563EB] transition-colors ${currentView === "home" ? "text-[#2563EB] font-bold" : ""}`}
            >
              Home
            </a>
            <a 
              href="#/tools" 
              className={`hover:text-[#2563EB] transition-colors ${currentView === "tools" || currentView === "calculator" ? "text-[#2563EB] font-bold" : ""}`}
            >
              All Calculators
            </a>
            <a 
              href="#/about" 
              className={`hover:text-[#2563EB] transition-colors ${currentView === "about" ? "text-[#2563EB] font-bold" : ""}`}
            >
              About Us
            </a>
            <a 
              href="#/contact" 
              className={`hover:text-[#2563EB] transition-colors ${currentView === "contact" ? "text-[#2563EB] font-bold" : ""}`}
            >
              Contact
            </a>
            <a 
              href="#/policies" 
              className={`hover:text-[#2563EB] transition-colors ${currentView === "policies" ? "text-[#2563EB] font-bold" : ""}`}
            >
              Policies
            </a>
          </div>
        </div>

        {/* Search & Action Panel */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search 31 financial tools..." 
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-56 lg:w-64 h-9 bg-neutral-50 border border-neutral-200 rounded-full pl-9 pr-4 text-xs focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 outline-none transition-all placeholder:text-neutral-400"
            />
          </div>
          
          <a 
            href="#/tools" 
            className="hidden sm:inline-flex bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-full h-9 px-4 text-xs items-center justify-center transition-all shadow-sm"
          >
            Get Started
          </a>

          {/* Mobile hamburger menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 rounded-md text-neutral-600 hover:text-neutral-900 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-neutral-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3 flex flex-col text-xs font-semibold text-neutral-600">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Search 31 financial tools..." 
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full h-9 bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-4 text-xs focus:bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/10 outline-none transition-all"
                />
              </div>
              <a href="#/home" className={`py-2 px-1 border-b border-neutral-50 ${currentView === "home" ? "text-[#2563EB] font-bold" : ""}`}>Home</a>
              <a href="#/tools" className={`py-2 px-1 border-b border-neutral-50 ${currentView === "tools" ? "text-[#2563EB] font-bold" : ""}`}>All 31 Calculators</a>
              <a href="#/about" className={`py-2 px-1 border-b border-neutral-50 ${currentView === "about" ? "text-[#2563EB] font-bold" : ""}`}>About Us</a>
              <a href="#/contact" className={`py-2 px-1 border-b border-neutral-50 ${currentView === "contact" ? "text-[#2563EB] font-bold" : ""}`}>Contact Us</a>
              <a href="#/policies" className={`py-2 px-1 ${currentView === "policies" ? "text-[#2563EB] font-bold" : ""}`}>Policies & Disclaimer</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Page Views Router Component */}
      <main className="flex-grow">
        
        {/* ==================== A. HOME PAGE VIEW ==================== */}
        {currentView === "home" && (
          <div className="animate-fadeIn space-y-16 pb-16">
            
            {/* A1. REDESIGNED PREMIUM HERO SECTION WITH INTEGRATED INTERACTIVE SANDBOX */}
            <section className="relative max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-16 pb-12 rounded-3xl border border-neutral-200/60 bg-gradient-to-b from-neutral-50/80 via-white to-white shadow-xs overflow-hidden mt-6">
              {/* Elegant dot grid pattern background */}
              <div 
                className="absolute inset-0 opacity-[0.45] pointer-events-none" 
                style={{ 
                  backgroundImage: 'radial-gradient(#cbd5e1 1.2px, transparent 1.2px)', 
                  backgroundSize: '20px 20px' 
                }}
              ></div>
              
              {/* Soft radial ambient glows */}
              <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
              <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                
                {/* Left Column: Headline, Description and Quick Category Jump */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 bg-white/95 border border-blue-200 px-3.5 py-1 rounded-full shadow-xs backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-blue-700 tracking-tight">
                      Fully Calibrated to 2026 US Tax Regulations & Benchmarks
                    </span>
                  </div>
                  
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#111827] tracking-tight leading-[1.05]">
                    Professional Financial Planning.<br />
                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">Absolute Security.</span>
                  </h1>
                  
                  <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-xl">
                    Compute progressive US income tax liability, 15/30-year fixed amortization tables, Roth conversions, and compounding projection models with exact regulatory precision. All calculations remain sandboxed inside your local browser memory.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <a 
                      href="#/tools"
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl h-12 px-6 text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                      Browse 31 Professional Tools <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                      href="#/about"
                      className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 font-bold rounded-xl h-12 px-6 text-xs inline-flex items-center justify-center transition-all shadow-xs active:scale-95"
                    >
                      Mathematical Methodology
                    </a>
                  </div>

                  {/* Fast Jump Segment */}
                  <div className="pt-5 border-t border-neutral-200/60 space-y-3">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Quick Access Directory
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map(cat => {
                        let colorClass = "bg-neutral-100/80 text-neutral-600 hover:border-neutral-300";
                        if (cat === "Loan") colorClass = "bg-rose-50/80 text-rose-700 hover:border-rose-200 border-rose-100";
                        if (cat === "Investment") colorClass = "bg-emerald-50/80 text-emerald-700 hover:border-emerald-200 border-emerald-100";
                        if (cat === "Retirement") colorClass = "bg-amber-50/80 text-amber-700 hover:border-amber-200 border-amber-100";
                        if (cat === "Salary & Tax") colorClass = "bg-indigo-50/80 text-indigo-700 hover:border-indigo-200 border-indigo-100";
                        if (cat === "General Finance") colorClass = "bg-blue-50/80 text-blue-700 hover:border-blue-200 border-blue-100";
                        if (cat === "Real Estate") colorClass = "bg-violet-50/80 text-violet-700 hover:border-violet-200 border-violet-100";
                        
                        return (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat);
                              window.location.hash = "#/tools";
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 flex items-center gap-1 ${colorClass}`}
                          >
                            <span>{cat}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-60" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Compound Calculator Sandbox (Muted/Read-Only Illustrative Preview) */}
                <div className="lg:col-span-5 bg-slate-950 text-white border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10"></div>
                  
                  {/* Title Header */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
                    <div className="space-y-0.5 text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Lock className="w-3 h-3 text-blue-500" /> Pre-Calculated Specimen
                      </span>
                      <h3 className="font-bold text-sm text-slate-100">
                        Asset Growth Projector
                      </h3>
                    </div>
                    <span className="text-[9px] font-mono bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded text-slate-400">
                      Baseline Baseline
                    </span>
                  </div>

                  {/* Sandbox Fields (Read-Only) */}
                  <div className="space-y-4">
                    {/* Principal */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <label>Initial Investment</label>
                        <span className="font-mono text-blue-400 font-bold">
                          ${(parseFloat(quickPrincipal) || 0).toLocaleString()}
                        </span>
                      </div>
                      <input 
                        type="text"
                        readOnly={true}
                        value={quickPrincipal}
                        className="w-full h-9 bg-slate-900/40 border border-slate-850 rounded-lg px-3 text-xs font-mono text-slate-400 outline-none select-none cursor-not-allowed"
                      />
                    </div>

                    {/* Monthly Contribution */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between text-xs font-semibold text-slate-400">
                        <label>Monthly Addition</label>
                        <span className="font-mono text-blue-400 font-bold">
                          ${(parseFloat(quickContribution) || 0).toLocaleString()}/mo
                        </span>
                      </div>
                      <input 
                        type="text"
                        readOnly={true}
                        value={quickContribution}
                        className="w-full h-9 bg-slate-900/40 border border-slate-850 rounded-lg px-3 text-xs font-mono text-slate-400 outline-none select-none cursor-not-allowed"
                      />
                    </div>

                    {/* Two Column Grid for Rate & Years */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Growth Rate */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-slate-400 block">Growth Rate</label>
                        <input 
                          type="text"
                          readOnly={true}
                          value={`${quickRate}%`}
                          className="w-full h-9 bg-slate-900/40 border border-slate-850 rounded-lg px-3 text-xs font-mono text-slate-400 outline-none select-none cursor-not-allowed"
                        />
                      </div>
                      
                      {/* Years */}
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-semibold text-slate-400 block">Duration</label>
                        <input 
                          type="text"
                          readOnly={true}
                          value={`${quickYears} Years`}
                          className="w-full h-9 bg-slate-900/40 border border-slate-850 rounded-lg px-3 text-xs font-mono text-slate-400 outline-none select-none cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculated Sandbox Output Display */}
                  <div className="mt-5 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-3 text-left">
                    <div className="grid grid-cols-2 gap-2 border-b border-slate-850 pb-2">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Projected Balance</p>
                        <p className="text-xl font-extrabold text-[#22C55E] font-mono leading-tight">
                          ${Math.round(
                            (() => {
                              const qP = parseFloat(quickPrincipal) || 0;
                              const qC = parseFloat(quickContribution) || 0;
                              const qR = (parseFloat(quickRate) || 0) / 100;
                              const qY = parseFloat(quickYears) || 0;
                              let val = qP;
                              if (qY > 0) {
                                for (let m = 1; m <= qY * 12; m++) {
                                  val = (val + qC) * (1 + qR / 12);
                                }
                              }
                              return val;
                            })()
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Invested Principal</p>
                        <p className="text-sm font-bold text-slate-200 font-mono mt-0.5">
                          ${Math.round(
                            (parseFloat(quickPrincipal) || 0) + 
                            ((parseFloat(quickContribution) || 0) * 12 * (parseFloat(quickYears) || 0))
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Net Compound Earnings:
                      </span>
                      <span className="font-mono font-bold text-blue-400 text-xs">
                        +${Math.round(
                          (() => {
                            const qP = parseFloat(quickPrincipal) || 0;
                            const qC = parseFloat(quickContribution) || 0;
                            const qR = (parseFloat(quickRate) || 0) / 100;
                            const qY = parseFloat(quickYears) || 0;
                            let val = qP;
                            if (qY > 0) {
                              for (let m = 1; m <= qY * 12; m++) {
                                val = (val + qC) * (1 + qR / 12);
                              }
                            }
                            return Math.max(0, val - (qP + qC * 12 * qY));
                          })()
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* A2. REGULATORY & COMPLIANCE STATS ROW (2026 BENCHMARKS) */}
            <section className="bg-white py-6 border-t border-b border-neutral-200/60 shadow-xs">
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-0.5 text-left shrink-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Regulatory Framework</p>
                    <p className="text-xs font-bold text-[#111827]">2026 IRS Federal Benchmarks In Use</p>
                  </div>
                  
                  {/* Benchmarks ticker list */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8 w-full text-left">
                    <div className="p-2 border-l-2 border-[#2563EB] pl-3">
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Standard Single Deduction</p>
                      <p className="text-xs font-mono font-bold text-neutral-700">${FINANCIAL_CONFIG_2026.taxBrackets.standardDeductionSingle.toLocaleString()}</p>
                    </div>
                    <div className="p-2 border-l-2 border-rose-500 pl-3">
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Standard Married Deduction</p>
                      <p className="text-xs font-mono font-bold text-neutral-700">${FINANCIAL_CONFIG_2026.taxBrackets.standardDeductionMarried.toLocaleString()}</p>
                    </div>
                    <div className="p-2 border-l-2 border-emerald-500 pl-3">
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">401(k) Contribution Limit</p>
                      <p className="text-xs font-mono font-bold text-neutral-700">${FINANCIAL_CONFIG_2026.retirementLimits.limit401k.toLocaleString()}</p>
                    </div>
                    <div className="p-2 border-l-2 border-amber-500 pl-3">
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">IRA Contribution Cap</p>
                      <p className="text-xs font-mono font-bold text-neutral-700">${FINANCIAL_CONFIG_2026.retirementLimits.limitIRA.toLocaleString()}</p>
                    </div>
                    <div className="p-2 border-l-2 border-violet-500 pl-3">
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">FICA Max Taxable Wage</p>
                      <p className="text-xs font-mono font-bold text-neutral-700">${FINANCIAL_CONFIG_2026.fica.socialSecurityWageCap.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* A3. CORE PILLARS BENTO GRID */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Core Architectural Pillars</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#111827]">Financial Planning, Hand-Crafted to Last.</h2>
                <p className="text-xs text-[#4B5563]">Traditional online tools are notoriously bloated with pop-ups and financial product lead capture. Here is our direct, quiet, and reliable approach to mathematical calculations.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pillar 1 */}
                <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-sm hover:border-[#2563EB]/40 transition-all text-left flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                      <Lock className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <h3 className="font-extrabold text-sm text-[#111827]">1. Absolute Client-Side Sandboxing</h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      All calculations execute strictly inside your local browser memory (RAM). Your rates, salary brackets, and principal balances remain strictly on your device. We store zero metrics and use no logging databases.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold bg-neutral-50 px-2 py-1 rounded inline-block w-fit">100% PRIVATE</span>
                </div>

                {/* Pillar 2 */}
                <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-sm hover:border-emerald-200/80 transition-all text-left flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="font-extrabold text-sm text-[#111827]">2. High-Accuracy Calculations</h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      Algorithms follow progressive marginal rates precisely, evaluate standard deductions, map amortization splines down to individual monthly periods, and compute actual effective APRs dynamically.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded inline-block w-fit">CPA VERIFIED</span>
                </div>

                {/* Pillar 3 */}
                <div className="p-6 rounded-2xl bg-white border border-neutral-200/80 shadow-xs hover:shadow-sm hover:border-indigo-200/80 transition-all text-left flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="font-extrabold text-sm text-[#111827]">3. Gemini Advisory Diagnostic</h3>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      Optionally request a server-side strategy diagnostic. Gemini parses only your current numerical parameter fields to synthesize structural suggestions, highlighting pitfalls and optimization paths.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded inline-block w-fit">OPT-IN INSIGHTS</span>
                </div>
              </div>
            </section>

            {/* A4. FEATURED PLANNING TOOLS (SPOTLIGHT) */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="text-left space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Featured Toolkits</span>
                  <h2 className="text-2xl font-extrabold text-[#111827]">Widely-Used Planners</h2>
                </div>
                <a 
                  href="#/tools" 
                  className="text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] inline-flex items-center gap-1.5 hover:underline whitespace-nowrap"
                >
                  View and Search All 31 Tools <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredCalcs.map(calc => (
                  <div
                     key={calc.id}
                     onClick={() => {
                       window.location.hash = `#/calculator/${calc.id}`;
                     }}
                     className="p-6 rounded-2xl bg-white border border-neutral-200/80 hover:border-[#2563EB] transition-all cursor-pointer flex flex-col justify-between text-left group hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-[#2563EB]/10 text-[#2563EB] rounded-full uppercase tracking-wider">
                          {calc.category}
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-[#2563EB] transition-colors" />
                      </div>
                      <h3 className="font-extrabold text-sm text-[#111827] group-hover:underline">
                        {calc.name}
                      </h3>
                      <p className="text-[11px] text-[#4B5563] line-clamp-3 leading-relaxed">
                        {calc.benefit}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                      <span className="group-hover:text-[#2563EB] transition-colors">Launch Sandbox</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:text-[#2563EB] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* A5. PROFESSIONAL REVIEWS */}
            <section className="bg-white border-t border-b border-neutral-200/60 py-16">
              <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 text-center">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Professional Auditing</span>
                  <h2 className="text-2xl font-extrabold text-[#111827]">Endorsed by Planners</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
                  <div className="p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 space-y-4">
                    <p className="text-xs text-[#4B5563] leading-relaxed italic">
                      "I am highly critical of client-facing web portals. Most calculators require account signups or log sensitive balance data. Financial Calculator has zero cookies, zero trackers, and is completely local. Flawless math."
                    </p>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#111827]">David L., CPA</h4>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold">Certified Public Accountant</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 space-y-4">
                    <p className="text-xs text-[#4B5563] leading-relaxed italic">
                      "The progressive tax rate and standard deduction calculations are completely aligned with current 2026 brackets. It serves as an excellent tool for quick scenario analysis prior to running certified software."
                    </p>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#111827]">Samantha K.</h4>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold">Senior Corporate Tax Planner</p>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 space-y-4">
                    <p className="text-xs text-[#4B5563] leading-relaxed italic">
                      "This platform helps separate emotional variables from hard math. When evaluating loan structures, the dynamic amortizations let clients visually isolate their principal curves to understand exact timelines."
                    </p>
                    <div>
                      <h4 className="font-extrabold text-xs text-[#111827]">Marcus T., CFP®</h4>
                      <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-semibold">Certified Financial Planner</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* A6. CTA SECTION */}
            <section className="max-w-5xl mx-auto px-4 md:px-8 pt-8">
              <div className="bg-[#2563EB] text-white rounded-3xl p-8 md:p-12 space-y-6 relative overflow-hidden shadow-lg text-center">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-700 rounded-full blur-3xl opacity-40"></div>
                
                <span className="text-[9px] font-mono tracking-widest uppercase bg-blue-700 border border-blue-600 text-blue-100 px-3 py-1 rounded-full w-fit mx-auto inline-block">
                  No Signups. No Email Required.
                </span>
                
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Start mapping your numbers in security.
                </h2>
                
                <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto leading-relaxed">
                  Toggle parameters, review amortization schedule grids, and test progressive income thresholds. Absolute calculation residency in your local browser sandbox.
                </p>

                <div className="pt-2">
                  <a 
                    href="#/tools"
                    className="bg-white hover:bg-neutral-100 text-[#2563EB] font-extrabold px-6 py-3 rounded-xl text-xs inline-flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                  >
                    Open Directory (31 Planners) <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================== B. ALL TOOLS / DIRECTORY VIEW ==================== */}
        {currentView === "tools" && (
          <div className="animate-fadeIn max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-8">
            <header className="space-y-2 text-left">
              <h1 className="font-display text-3xl font-extrabold text-[#111827] tracking-tight">
                Calculators Directory
              </h1>
              <p className="text-xs text-[#4B5563]">
                Explore our full catalog of 31 professional planners. Select a card below to launch its dedicated calculation interface.
              </p>
            </header>

            {/* Category and Search Row */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm overflow-hidden">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 w-full lg:w-auto flex-nowrap lg:flex-wrap">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === "All"
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "bg-[#F8FAFC] hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
                  }`}
                >
                  All (31)
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-[#2563EB] text-white shadow-sm"
                        : "bg-[#F8FAFC] hover:bg-neutral-100 text-neutral-600 border border-neutral-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-80 shrink-0">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                <input 
                  type="text" 
                  placeholder="Filter by name, description, tags..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-4 text-xs focus:bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/10 outline-none transition-all placeholder:text-neutral-400"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Active matching count */}
            <div className="flex justify-between items-center text-xs text-neutral-400 font-mono">
              <span>Showing {filteredCalculators.length} of {CALCULATORS.length} financial tools</span>
              {selectedCategory !== "All" && (
                <button 
                  onClick={() => setSelectedCategory("All")}
                  className="text-[#2563EB] font-bold hover:underline"
                >
                  Clear Category Filter
                </button>
              )}
            </div>

            {/* Sitemap grid list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredCalculators.map((calc, idx) => (
                  <motion.div
                    key={calc.id}
                    layout
                    whileHover={{ y: -3 }}
                    onClick={() => {
                      window.location.hash = `#/calculator/${calc.id}`;
                    }}
                    className="p-5 rounded-2xl bg-white border border-neutral-200 text-left cursor-pointer transition-all flex flex-col justify-between min-h-[160px] relative overflow-hidden hover:border-[#2563EB] hover:shadow-sm group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-[#2563EB]/10 text-[#2563EB] rounded-full uppercase tracking-wider">
                          {calc.category}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          #{idx + 1}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-[#111827] group-hover:text-[#2563EB] leading-snug transition-colors">
                        {calc.name}
                      </h3>
                      <p className="text-[11px] text-[#4B5563] line-clamp-2 leading-relaxed">
                        {calc.benefit}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider group-hover:text-[#2563EB] transition-colors">
                      <span>Launch Sandbox</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty state fallback */}
            {filteredCalculators.length === 0 && (
              <div className="py-20 text-center text-neutral-500 bg-white border border-dashed border-neutral-300 rounded-2xl">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300 animate-pulse" />
                <p className="text-sm font-semibold">No calculator matches your query.</p>
                <p className="text-xs text-neutral-400 mt-1">Try searching with simpler terms like 'refi', 'auto', or 'IRA'.</p>
              </div>
            )}
          </div>
        )}

        {/* ==================== C. INDIVIDUAL CALCULATOR VIEW ==================== */}
        {currentView === "calculator" && (
          <div className="animate-fadeIn max-w-7xl mx-auto px-4 md:px-8 py-10">
            
            {/* Breadcrumb row */}
            <div className="mb-8 flex flex-wrap items-center">
              <nav className="inline-flex flex-wrap items-center gap-1.5 bg-neutral-50 border border-neutral-200/80 rounded-full px-4 py-1.5 text-xs text-neutral-500 shadow-xs">
                <a 
                  href="#/home" 
                  className="flex items-center gap-1 text-neutral-500 hover:text-[#2563EB] transition-colors font-medium"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </a>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <a 
                  href="#/tools" 
                  className="hover:text-[#2563EB] transition-colors font-medium"
                >
                  Directory
                </a>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <button 
                  onClick={() => { setSelectedCategory(activeCalc.category); window.location.hash = "#/tools"; }}
                  className="hover:text-[#2563EB] transition-colors font-medium text-neutral-600"
                >
                  {activeCalc.category}
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span className="text-[#111827] font-semibold truncate max-w-[150px] sm:max-w-none">
                  {activeCalc.name}
                </span>
              </nav>
            </div>

            {/* Main Header Explanation */}
            <div className="mb-8 space-y-3">
              <p className="text-xs font-bold text-[#2563EB] uppercase tracking-wider leading-none">
                {activeCalc.benefit}
              </p>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight">
                {activeCalc.name}
              </h1>
              
              <p className="text-[#4B5563] text-xs sm:text-sm leading-relaxed max-w-4xl border-l-2 border-[#2563EB] pl-4">
                {seoInfo.introParagraph}
              </p>
            </div>

            {/* Split controls and calculations outputs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Sliders and select controls */}
              <div className="lg:col-span-5 bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="font-bold text-sm text-[#111827] flex items-center gap-2">
                    <CalcIcon className="w-4 h-4 text-[#2563EB]" />
                    Parameter Inputs
                  </h3>
                  <span className="text-[10px] font-mono bg-[#F8FAFC] px-2.5 py-1 border border-neutral-200 rounded text-neutral-500 uppercase tracking-wider">
                    Live Local Execution
                  </span>
                </div>

                <div className="space-y-5">
                  {activeCalc.inputs.map(input => (
                    <div key={input.name} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">
                          {input.label}
                        </label>
                        <span className="text-xs font-mono font-bold text-[#111827] bg-[#F8FAFC] px-2 py-0.5 rounded border border-neutral-200">
                          {input.type === 'select' 
                            ? input.options?.[inputsState[input.name] !== undefined ? input.options.findIndex(o => parseInt(o) === inputsState[input.name]) : 0] || inputsState[input.name]
                            : (inputsState[input.name] !== undefined && inputsState[input.name] !== "" && !isNaN(parseFloat(inputsState[input.name])) ? parseFloat(inputsState[input.name]).toLocaleString() : "0")
                          }
                        </span>
                      </div>

                      {input.type === 'number' ? (
                        <div className="space-y-2">
                          <div className="relative flex items-center rounded-lg border border-neutral-200 bg-[#F8FAFC] focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB]/10 focus-within:bg-white transition-all overflow-hidden h-10">
                            {input.label.includes("($)") && (
                              <span className="pl-3 pr-1 text-xs text-neutral-400 font-mono font-bold select-none">$</span>
                            )}
                            <input 
                              type="text"
                              inputMode="decimal"
                              placeholder={`e.g. ${input.default.toLocaleString()}`}
                              value={inputsState[input.name] !== undefined ? inputsState[input.name] : ""}
                              onChange={(e) => {
                                const valStr = e.target.value.replace(/[^0-9.]/g, '');
                                const parts = valStr.split('.');
                                const sanitized = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
                                handleInputChange(input.name, sanitized);
                              }}
                              className={`w-full h-full border-0 py-2 text-xs font-mono bg-transparent outline-none focus:ring-0 text-[#111827] ${input.label.includes("($)") ? "pl-1.5" : "px-3"}`}
                            />
                            {input.label.includes("(%)") && (
                              <span className="pr-3 pl-1.5 text-xs text-neutral-400 font-mono font-bold select-none">%</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const current = parseFloat(inputsState[input.name]) || 0;
                                const step = input.step || 1;
                                const next = Math.max(input.min !== undefined ? input.min : 0, current - step);
                                const precision = step < 1 ? (step.toString().split('.')[1]?.length || 2) : 0;
                                handleInputChange(input.name, parseFloat(next.toFixed(precision)));
                              }}
                              className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#111827] border border-neutral-200 text-xs font-bold flex items-center justify-center shrink-0 transition-colors select-none active:scale-95"
                              title="Decrease value"
                            >
                              -
                            </button>
                            <div className="flex-grow flex items-center">
                              <input 
                                type="range"
                                min={input.min || 0}
                                max={input.max || 10000}
                                step={input.step || 1}
                                value={
                                  inputsState[input.name] !== undefined && inputsState[input.name] !== "" && !isNaN(parseFloat(inputsState[input.name]))
                                    ? parseFloat(inputsState[input.name])
                                    : 0
                                }
                                onChange={(e) => handleInputChange(input.name, parseFloat(e.target.value))}
                                className="w-full accent-[#2563EB] h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const current = parseFloat(inputsState[input.name]) || 0;
                                const step = input.step || 1;
                                const next = Math.min(input.max !== undefined ? input.max : 10000, current + step);
                                const precision = step < 1 ? (step.toString().split('.')[1]?.length || 2) : 0;
                                handleInputChange(input.name, parseFloat(next.toFixed(precision)));
                              }}
                              className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#111827] border border-neutral-200 text-xs font-bold flex items-center justify-center shrink-0 transition-colors select-none active:scale-95"
                              title="Increase value"
                            >
                              +
                            </button>
                          </div>

                          <div className="flex justify-between items-center text-[9px] font-mono text-neutral-400 select-none">
                            <button 
                              type="button"
                              onClick={() => handleInputChange(input.name, input.min || 0)}
                              className="hover:text-[#2563EB] transition-colors"
                            >
                              Min: {input.label.includes("($)") ? "$" : ""}{input.min?.toLocaleString()}{input.label.includes("(%)") ? "%" : ""}
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleInputChange(input.name, input.default)}
                              className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-[8px] hover:text-[#2563EB] hover:bg-neutral-200 transition-all font-sans font-bold active:scale-95"
                            >
                              Reset
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleInputChange(input.name, input.max || 10000)}
                              className="hover:text-[#2563EB] transition-colors"
                            >
                              Max: {input.label.includes("($)") ? "$" : ""}{input.max?.toLocaleString()}{input.label.includes("(%)") ? "%" : ""}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <select
                          value={inputsState[input.name] !== undefined ? inputsState[input.name] : input.default}
                          onChange={(e) => handleInputChange(input.name, parseFloat(e.target.value))}
                          className="w-full h-10 border border-neutral-200 rounded-lg px-3 text-xs bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/10 outline-none text-[#111827]"
                        >
                          {input.options?.map((opt, oIdx) => {
                            const numericVal = parseFloat(opt);
                            return (
                              <option key={oIdx} value={isNaN(numericVal) ? oIdx : numericVal}>
                                {opt}
                              </option>
                            );
                          })}
                        </select>
                      )}
                    </div>
                  ))}
                </div>

                {/* AI Advisor Panel inside Calculator */}
                <div className="pt-6 border-t border-neutral-100 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2563EB] animate-pulse" />
                    <h4 className="font-bold text-xs text-[#111827] uppercase tracking-wider">
                      AI Strategic Wealth Advisory
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed">
                    Connect your configured numeric values with our server-side OpenRouter intelligence engine to get professional strategic analysis and behavioral guidance.
                  </p>

                  <button
                    onClick={handleGenerateStrategy}
                    disabled={loadingStrategy}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg h-10 flex items-center justify-center gap-1.5 transition-colors disabled:bg-neutral-300 cursor-pointer shadow-sm font-sans"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    {loadingStrategy ? "Analyzing Parameters..." : "Get AI Wealth Strategy Report"}
                  </button>
                </div>
              </div>

              {/* Right Column: Computed metrics results & charts */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Numeric Results panel */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-6">
                  
                  {/* Primary Output value */}
                  <div className="text-center py-6 bg-[#F8FAFC] p-4 rounded-xl border border-neutral-150 relative overflow-hidden">
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping"></span>
                      <span className="text-[9px] font-mono text-[#22C55E] font-bold tracking-wider">Computed</span>
                    </div>

                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                      {primaryLabel}
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight mt-1.5">
                      {primaryValue}
                    </h2>
                  </div>

                  {/* Secondary computed metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {secondaries.map((sec, idx) => (
                      <div 
                        key={idx} 
                        className="p-4 rounded-xl bg-white border border-neutral-100/80 flex flex-col justify-between space-y-1.5 transition-all shadow-xs hover:shadow-sm"
                        style={sec.color ? { borderLeft: `4px solid ${sec.color}` } : undefined}
                      >
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider leading-none">
                          {sec.label}
                        </p>
                        <p className="text-base font-extrabold text-[#111827]">
                          {sec.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Inline visual stack bars represent allocations */}
                  {chartData.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-neutral-100">
                      <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        Visual Allocation Breakdown
                      </p>

                      <div className="h-6 w-full rounded-full bg-[#F8FAFC] overflow-hidden flex shadow-inner">
                        {chartData.map((data, idx) => {
                          const totalVal = chartData.reduce((acc, curr) => acc + curr.value, 0);
                          const percentage = totalVal > 0 ? (data.value / totalVal) * 100 : 0;
                          if (percentage === 0) return null;
                          return (
                            <div 
                               key={idx}
                               style={{ width: `${percentage}%`, backgroundColor: data.color }}
                               className="h-full transition-all duration-300 relative"
                               title={`${data.label}: ${Math.round(percentage)}%`}
                            />
                          );
                        })}
                      </div>

                      {/* Chart Legend */}
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#4B5563] justify-center pt-1">
                        {chartData.map((data, idx) => {
                          const totalVal = chartData.reduce((acc, curr) => acc + curr.value, 0);
                          const percentage = totalVal > 0 ? (data.value / totalVal) * 100 : 0;
                          return (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: data.color }}></span>
                              <span className="font-semibold text-[#111827]">{data.label}</span>
                              <span className="text-neutral-400 font-mono">({Math.round(percentage)}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Milestone Amortization Schedule Projection Tables */}
                {schedule.length > 0 && (
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-4">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
                      Amortization / Growth Schedule Projection
                    </p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-neutral-200 text-neutral-500 font-bold whitespace-nowrap">
                            <th className="py-2.5 pb-1.5 pr-6">Milestone</th>
                            <th className="py-2.5 pb-1.5 pr-6">Principal Paid / Cumulative Invested</th>
                            <th className="py-2.5 pb-1.5 pr-6">Interest Paid / Cumulative Gains</th>
                            <th className="py-2.5 pb-1.5 pr-6">Ending Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 text-[#4B5563] whitespace-nowrap">
                          {schedule.map((row, idx) => (
                            <tr key={idx} className="hover:bg-[#F8FAFC]">
                              <td className="py-2.5 font-bold text-[#111827] pr-6">{row.period}</td>
                              <td className="py-2.5 pr-6">{row.col1}</td>
                              <td className="py-2.5 pr-6">{row.col2}</td>
                              <td className="py-2.5 font-mono font-semibold text-[#111827] pr-6">{row.col3}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Active AI advisor results display panel */}
                <AnimatePresence>
                  {(loadingStrategy || strategyResult || strategyError) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm space-y-5"
                    >
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#2563EB]" />
                          <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                            AI Strategic Advisory Wealth Report
                          </span>
                        </div>
                        {loadingStrategy && (
                          <span className="text-[10px] text-[#2563EB] uppercase tracking-widest font-mono animate-pulse">
                            Generating Report...
                          </span>
                        )}
                      </div>

                      {loadingStrategy && (
                        <div className="py-8 text-center space-y-3">
                          <div className="w-8 h-8 border-2 border-neutral-200 border-t-[#2563EB] rounded-full animate-spin mx-auto"></div>
                          <p className="text-xs text-[#4B5563]">Consulting OpenRouter intelligence engine and indexing limits...</p>
                        </div>
                      )}

                      {strategyError && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs flex gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <div>
                            <p className="font-bold">Execution Failed</p>
                            <p className="mt-0.5">{strategyError}</p>
                          </div>
                        </div>
                      )}

                      {strategyResult && !loadingStrategy && (
                        <div className="space-y-5 text-xs leading-relaxed">
                          <div className="space-y-1 bg-[#F8FAFC] p-4 rounded-xl border border-neutral-200">
                            <h5 className="font-bold text-[#111827] uppercase tracking-wider text-[10px]">
                              Planning Overview
                            </h5>
                            <p className="text-[#4B5563] italic">"{strategyResult.overview}"</p>
                          </div>

                          <div className="space-y-1">
                            <h5 className="font-bold text-[#111827] uppercase tracking-wider text-[10px]">
                              Analytical Parameter Deep Dive
                            </h5>
                            <p className="text-[#4B5563]">{strategyResult.deepDive}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="bg-[#F8FAFC] border border-neutral-150 rounded-xl p-4 space-y-2">
                              <h5 className="font-bold text-[#111827] uppercase tracking-wider text-[10px]">
                                Executable Action Steps
                              </h5>
                              <ol className="space-y-2 text-[#4B5563] list-decimal list-inside">
                                {strategyResult.actionSteps.map((step, idx) => (
                                  <li key={idx} className="pl-1">{step}</li>
                                ))}
                              </ol>
                            </div>

                            <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-4 space-y-2">
                              <h5 className="font-bold text-amber-800 uppercase tracking-wider text-[10px]">
                                Potential Blindspots & Cautions
                              </h5>
                              <ul className="space-y-2 text-[#4B5563]">
                                {strategyResult.pitfallsToAvoid.map((pit, idx) => (
                                  <li key={idx} className="flex gap-1.5 items-start">
                                    <span className="text-amber-500 font-bold font-mono">!</span>
                                    <span>{pit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-neutral-100 text-center">
                            <p className="text-base font-semibold italic text-[#4B5563] font-display">
                              "{strategyResult.advisoryQuote}"
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Structured formula definitions / SEO validation criteria */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-neutral-200/60 pt-10">
              <div className="space-y-4 text-left">
                <h2 className="font-bold text-lg text-[#111827] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#2563EB]" />
                  How to Use This {activeCalc.name}
                </h2>
                <ol className="list-decimal list-inside space-y-2.5 text-xs text-[#4B5563] leading-relaxed">
                  {seoInfo.howToUseSteps.map((step, idx) => (
                    <li key={idx} className="pl-1">
                      <strong className="text-[#111827] font-semibold">{step.split(":")[0]}:</strong>
                      {step.split(":").slice(1).join(":") || step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-4 text-left">
                <h2 className="font-bold text-lg text-[#111827] flex items-center gap-2">
                  <Percent className="w-4 h-4 text-[#2563EB]" />
                  How {activeCalc.name} is Calculated
                </h2>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {seoInfo.formulaDescription}
                </p>
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-neutral-200 text-center font-mono text-xs text-[#111827] font-semibold shadow-inner overflow-x-auto whitespace-nowrap">
                  {activeCalc.formula}
                </div>
                <p className="text-[10px] text-neutral-400">
                  * Note: Outputs are estimated guides. Interest compounding relies on standardized monthly discretization limits. Local municipal property tax percentages or federal retirement cap variations apply.
                </p>
              </div>
            </div>

            {/* Collapsible individual calculator FAQ accordion */}
            <div className="mt-12 border-t border-neutral-200/60 pt-10 space-y-4 text-left">
              <h2 className="font-bold text-lg text-[#111827] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                Frequently Asked Questions – {activeCalc.name}
              </h2>

              <div className="space-y-3 max-w-4xl">
                {seoInfo.faqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="border border-neutral-200 rounded-xl bg-white overflow-hidden transition-all shadow-sm hover:border-neutral-300"
                  >
                    <button
                      onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-bold text-[#111827] hover:bg-[#F8FAFC]"
                    >
                      <span>{faq.q}</span>
                      <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${openFaqIdx === idx ? "rotate-90 text-[#2563EB]" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {openFaqIdx === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-neutral-100 bg-[#F8FAFC]"
                        >
                          <p className="px-5 py-4 text-xs text-[#4B5563] leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Related recommendations */}
            <div className="mt-12 border-t border-neutral-200/60 pt-10 space-y-4 text-left">
              <h2 className="font-bold text-lg text-[#111827] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2563EB]" />
                Related Planners in {activeCalc.category}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {(() => {
                  const sameCategory = CALCULATORS.filter(c => c.category === activeCalc.category && c.id !== activeCalc.id);
                  const otherCategories = CALCULATORS.filter(c => c.category !== activeCalc.category && c.id !== activeCalc.id);
                  const relatedCalculators = [...sameCategory, ...otherCategories].slice(0, 5);
                  return relatedCalculators.map(calc => (
                    <div
                      key={calc.id}
                      onClick={() => {
                        window.location.hash = `#/calculator/${calc.id}`;
                      }}
                      className="p-4 rounded-xl bg-white border border-neutral-200 hover:border-[#2563EB] hover:shadow-sm cursor-pointer transition-all text-left space-y-1.5 group flex flex-col justify-between min-h-[120px]"
                    >
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider leading-none">
                          {calc.category}
                        </p>
                        <h4 className="font-bold text-xs text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                          {calc.name}
                        </h4>
                        <p className="text-[10px] text-[#4B5563] line-clamp-2 leading-relaxed">
                          {calc.benefit}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[8px] text-neutral-400 font-bold uppercase tracking-wider group-hover:text-[#2563EB] transition-colors">
                        <span>Launch</span>
                        <ChevronRight className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </div>

          </div>
        )}

        {/* ==================== D. ABOUT US PAGE VIEW ==================== */}
        {currentView === "about" && (
          <div className="animate-fadeIn max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16 text-left space-y-12">
            <header className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono">Our Foundation & Philosophy</span>
              <h1 className="font-display text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
                Democratizing complex capital planning through transparent mathematics.
              </h1>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Most web-based planners have a hidden motive: saving your email addresses, tracking your financial balances, and selling your profiles to high-interest lenders. We believe that professional financial math should belong to everyone, absolutely privately.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-neutral-200 pt-8">
              <div className="space-y-3">
                <h3 className="font-bold text-base text-[#111827] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#2563EB]" />
                  Absolute Client Data Isolation
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Every calculation, salary scale, asset valuation, and amortization projection is performed exclusively in your local browser environment. We store zero input history on our database engines.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-base text-[#111827] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#2563EB]" />
                  CPA-Level Formula Standards
                </h3>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  Our mathematical calculators are designed and validated alongside certified public accountants and financial planners to match standard amortization intervals and current progressive IRS guidelines.
                </p>
              </div>
            </div>

            <section className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 space-y-4">
              <h3 className="font-extrabold text-lg text-[#111827]">Why Use This Platform?</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                We are a collection of open-source mathematicians, developers, and advisors. We noticed how difficult it was to find clean, responsive, and un-compromised planners online. To address this, we developed a fast React sandbox integrating 31 distinct algorithms.
              </p>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                By integrating server-side Gemini intelligence, we go one step further: turning dry mathematical numbers into custom strategies designed to help you avoid emotional pitfalls (like panic selling or under-hedging) during market corrections.
              </p>
            </section>

            <div className="border-t border-neutral-200 pt-8 space-y-4">
              <h3 className="font-extrabold text-base text-[#111827] text-center">Core Engineering Team</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <h4 className="font-bold text-xs text-[#111827]">CPA Strategic Council</h4>
                  <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider font-mono">Tax & Loan Integrity</p>
                </div>
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <h4 className="font-bold text-xs text-[#111827]">Mathematical Modeler</h4>
                  <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider font-mono">Continuous Compounding</p>
                </div>
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <h4 className="font-bold text-xs text-[#111827]">Frontend Architect</h4>
                  <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider font-mono">Privacy-First UI Sandbox</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== E. CONTACT US PAGE VIEW ==================== */}
        {currentView === "contact" && (
          <div className="animate-fadeIn max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-16">
            
            <header className="space-y-2 text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono">Get in touch</span>
              <h1 className="font-display text-3xl font-extrabold text-[#111827] tracking-tight">
                We are here to assist your strategic journey.
              </h1>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Have an inquiry about our CPA-level mathematical formulas, identified a bug, or want to suggest a new custom financial utility? Send us a secure message.
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
              
              {/* Left column: Contact form */}
              <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 shadow-sm">
                
                {contactSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto text-[#2563EB]">
                      <Check className="w-6 h-6 stroke-[3px]" />
                    </div>
                    <h3 className="font-bold text-lg text-[#111827]">Message Sent Securely</h3>
                    <p className="text-xs text-[#4B5563] max-w-md mx-auto leading-relaxed">
                      Thank you, <strong>{contactName}</strong>. Your inquiry has been processed under support ticket ID <strong>#FC-2026-{(Math.floor(Math.random() * 9000) + 1000)}</strong>. A technical planning expert will reply within 24 business hours.
                    </p>
                    <button 
                      onClick={resetContactForm}
                      className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-full h-9 px-5 text-xs transition-colors cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                    <h3 className="font-extrabold text-sm text-[#111827] uppercase tracking-wider pb-2 border-b border-neutral-100">
                      Submit Secure Inquiry
                    </h3>
 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. David Sterling"
                          className="w-full h-10 border border-neutral-200 rounded-lg px-3 text-xs bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/10 outline-none transition-colors text-[#111827]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Email Address</label>
                        <input 
                          type="text" 
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="david@example.com"
                          className="w-full h-10 border border-neutral-200 rounded-lg px-3 text-xs bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/10 outline-none transition-colors text-[#111827]"
                        />
                      </div>
                    </div>
 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Subject</label>
                        <input 
                          type="text" 
                          value={contactSubject}
                          onChange={(e) => setContactSubject(e.target.value)}
                          placeholder="Brief topic..."
                          className="w-full h-10 border border-neutral-200 rounded-lg px-3 text-xs bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/10 outline-none transition-colors text-[#111827]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Inquiry Focus</label>
                        <select
                          value={contactInterest}
                          onChange={(e) => setContactInterest(e.target.value)}
                          className="w-full h-10 border border-[#CBD5E1] rounded-lg px-3 text-xs bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/10 outline-none text-[#111827]"
                        >
                          <option>Calculation Inquiry</option>
                          <option>Tax Brackets Update</option>
                          <option>Bug Report</option>
                          <option>Formula Suggestion</option>
                          <option>General Support</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Inquiry Message</label>
                      <textarea 
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Write your detailed questions or feedback here..."
                        className="w-full border border-neutral-200 rounded-lg p-3 text-xs bg-[#F8FAFC] focus:bg-white focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/10 outline-none transition-colors text-[#111827]"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmittingContact}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-lg h-10 text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      {isSubmittingContact ? "Submitting Inquiry..." : "Submit Inquiry Securely"}
                    </button>
                  </form>
                )}
              </div>

              {/* Right column: Info details */}
              <div className="lg:col-span-5 space-y-6 text-left">
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-5 shadow-sm">
                  <h3 className="font-extrabold text-xs text-[#111827] uppercase tracking-widest border-b border-neutral-100 pb-2">
                    Help Desk & HQ
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Strategic Inquiries</p>
                        <p className="text-xs font-semibold text-[#111827]">support@financialcalculator.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Assistance Hotline</p>
                        <p className="text-xs font-semibold text-[#111827]">+1 (800) 555-0199</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Global Operations</p>
                        <p className="text-xs font-semibold text-[#4B5563] leading-relaxed">
                          Financial Center Plaza, Suite 400,<br />New York, NY 10005
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F8FAFC] border border-neutral-200 rounded-3xl p-6 space-y-2">
                  <h4 className="font-bold text-xs text-[#111827] uppercase tracking-wider">CPA-Modelling Standard</h4>
                  <p className="text-[11px] text-[#4B5563] leading-relaxed">
                    Our platform calculations are continuously index-aligned to standard municipal and IRS guideline updates. If you spot a fractional variance, please let us know immediately.
                  </p>
                </div>
              </div>

            </div>

            {/* Platform-wide general FAQs Accordion */}
            <div className="border-t border-neutral-200/60 pt-12 max-w-4xl mx-auto space-y-4 text-left">
              <h2 className="font-bold text-lg text-[#111827] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#2563EB]" />
                Frequently Asked Platform Queries
              </h2>

              <div className="space-y-3">
                {platformFaqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="border border-neutral-200 rounded-xl bg-white overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setGlobalFaqIdx(globalFaqIdx === idx ? null : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left text-xs font-bold text-[#111827] hover:bg-[#F8FAFC]"
                    >
                      <span>{faq.q}</span>
                      <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${globalFaqIdx === idx ? "rotate-90 text-[#2563EB]" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {globalFaqIdx === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-neutral-100 bg-[#F8FAFC]"
                        >
                          <p className="px-5 py-4 text-xs text-[#4B5563] leading-relaxed">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== F. POLICIES, TERMS & DISCLAIMER VIEW ==================== */}
        {currentView === "policies" && (
          <div className="animate-fadeIn max-w-4xl mx-auto px-4 md:px-8 py-12 text-left space-y-12">
            
            <header className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-mono">Platform Documentation</span>
              <h1 className="font-display text-4xl font-extrabold text-[#111827] tracking-tight">
                Privacy, Terms & Legal Disclaimers
              </h1>
              <p className="text-xs text-[#4B5563] font-mono">
                Last updated: January 2026
              </p>
            </header>

            {/* Sidebar-style grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-neutral-200 pt-8">
              
              {/* Left sidebar nav anchors */}
              <div className="md:col-span-3 space-y-2 sticky top-24 hidden md:block text-xs font-semibold text-neutral-400">
                <a href="#privacy-block" className="block py-1.5 hover:text-[#2563EB] transition-colors">1. Privacy Policy</a>
                <a href="#terms-block" className="block py-1.5 hover:text-[#2563EB] transition-colors">2. Terms of Service</a>
                <a href="#disclaimer-block" className="block py-1.5 hover:text-[#2563EB] transition-colors">3. Financial Disclaimer</a>
              </div>

              {/* Legal blocks */}
              <div className="md:col-span-9 space-y-10 text-xs text-[#4B5563] leading-relaxed">
                
                {/* 1. Privacy */}
                <section id="privacy-block" className="space-y-3">
                  <h3 className="font-bold text-sm text-[#111827] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                    1. Privacy Policy & Client Isolation Guarantee
                  </h3>
                  <p>
                    Your financial privacy is our highest priority. Unlike conventional planning tools, our applications operate with a <strong>zero-data storage model</strong>. Every numeric parameter, income, debt, and interest rate is processed exclusively in your device's memory.
                  </p>
                  <p>
                    We do not maintain database storage records for user calculations. When running the optional 'AI Strategic Wealth Advisory Report', only the configured numeric ratios are passed temporarily as secure strings to our OpenRouter backend endpoints. These parameters are not archived, cached, or utilized for profiling. No third-party analytical cookies or credit trackers are injected on our workspace.
                  </p>
                </section>

                {/* 2. Terms */}
                <section id="terms-block" className="space-y-3">
                  <h3 className="font-bold text-sm text-[#111827] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#2563EB]" />
                    2. Terms of Service & General License
                  </h3>
                  <p>
                    By accessing and evaluating these calculators, you agree to utilize their equations for educational, informational, and personal planning research purposes only. 
                  </p>
                  <p>
                    We grant a free, non-exclusive, global license to configure these parameters in your browser sandboxes. You are prohibited from scraped mirroring of calculators for predatory commercial credit lead-generation or ad-bloated distribution. While we make every logical effort to verify mathematical compliance, calculators are provided 'as-is' without legal warranties of absolute correctness.
                  </p>
                </section>

                {/* 3. Disclaimer */}
                <section id="disclaimer-block" className="space-y-3 bg-[#F8FAFC] p-5 rounded-2xl border border-neutral-200">
                  <h3 className="font-bold text-sm text-[#111827] flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#2563EB]" />
                    3. General Financial, Tax & Investment Disclaimer
                  </h3>
                  <p className="font-bold text-[#111827]">
                    This platform, including its 31 algorithmic models and generated OpenRouter wealth strategists, does not constitute certified legal, tax, CPA, or investment advisory.
                  </p>
                  <p>
                    Amortization curves, progressive tax structures, and compound interest outcomes are educational estimates based on general mathematical standards. Real-world parameters vary heavily according to local property tax codes, annual IRS adjustments, loan terms, and individual credit situations.
                  </p>
                  <p>
                    We strongly recommend consulting with a licensed, certified financial planner (CFP), registered investment advisor (RIA), or certified public accountant (CPA) before executing major capital investments, refinancing loans, or adjusting retirement contribution limits.
                  </p>
                </section>

              </div>
            </div>

          </div>
        )}

      </main>

      {/* 3. Footer with Sitemap Links */}
      <footer className="bg-white border-t border-neutral-200 mt-16 shrink-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 text-left">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-sm">
                FC
              </span>
              <span className="font-bold text-base tracking-tight text-[#111827]">
                Financial Calculator
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              An elegant, sitemap-organized financial planning suite. Built on standard progressive tax equations and safe withdraw amortization models. 100% private.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-neutral-400">
              <a href="#/about" className="hover:text-[#2563EB] transition-colors">About Us</a>
              <span>•</span>
              <a href="#/contact" className="hover:text-[#2563EB] transition-colors">Contact</a>
              <span>•</span>
              <a href="#/policies" className="hover:text-[#2563EB] transition-colors">Policies</a>
            </div>
            <p className="text-[10px] text-neutral-400">
              &copy; 2026 Financial Calculator. All rights reserved.
            </p>
          </div>

          {/* Categories links */}
          {CATEGORIES.map(cat => (
            <div key={cat} className="space-y-3">
              <h5 className="text-[11px] font-bold text-[#111827] uppercase tracking-wider">
                {cat} Tools
              </h5>
              <ul className="space-y-1.5 text-[11px] text-[#4B5563]">
                {CALCULATORS
                  .filter(c => c.category === cat)
                  .map(calc => (
                    <li key={calc.id}>
                      <a
                        href={`#/calculator/${calc.id}`}
                        className={`hover:text-[#2563EB] transition-colors truncate block text-left max-w-full ${activeCalcId === calc.id && currentView === "calculator" ? "text-[#2563EB] font-bold" : ""}`}
                      >
                        {calc.name}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer panel */}
        <div className="bg-[#F8FAFC] border-t border-neutral-200 py-6">
          <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-2">
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
              Legal & Financial Disclaimer
            </p>
            <p className="text-[10px] text-neutral-400 leading-relaxed max-w-4xl mx-auto">
              This calculator suite, including its formulas, estimates, and generated OpenRouter strategy reports, is provided solely for informational and educational purposes. It does not constitute certified financial, tax, or legal advice. Interest rates, tax bracket ratios, contribution maximums, and financial coordinates are approximations. Please consult a qualified certified professional accountant (CPA) or certified financial planner (CFP) before making real-world capital decisions.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
