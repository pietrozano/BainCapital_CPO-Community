// All assessment questions organized by step and dimension
const QUESTIONS = {
  's-01': {
    title: 'Strategy & Governance',
    tag: 'Step 01 · S2C',
    desc: 'Assesses how procurement is positioned strategically, governed, and aligned to corporate priorities.',
    D1: [
      {
        id: 'q-01-d1-01',
        text: 'Does procurement have appropriate visibility and a meaningful voice at board or ExCo level — including regular CPO reporting to CFO/CEO, procurement input into major strategic decisions, and board-level accountability for procurement performance?',
        short: 'Board & ExCo visibility',
        scores: [
          'Procurement has no representation or visibility at ExCo or board level. The CPO does not report to C-suite.',
          'Procurement presents to senior leadership occasionally or on request. No formal cadence or standing agenda item exists.',
          'The CPO presents quarterly to ExCo. Procurement performance (savings, risk, ESG) is a regular ExCo agenda item.',
          'The CPO has a direct reporting line to CFO or CEO and is embedded in key strategic forums (M&A, annual planning, major investment decisions).',
          'Procurement co-owns strategic business outcomes at board level. Procurement insights actively shape board-level decisions. Board holds management accountable for procurement performance.'
        ]
      },
      {
        id: 'q-01-d1-02',
        text: 'Is the procurement strategy explicitly derived from, and aligned to, the corporate and business strategy — with clear line-of-sight from corporate priorities to procurement goals, category plans, and value targets?',
        short: 'Corporate strategy alignment',
        scores: [
          'Procurement strategy is not connected to corporate strategy. No derivation or alignment process exists.',
          'Procurement strategy is developed independently and presented to leadership occasionally but is not formally derived from corporate priorities.',
          'Procurement strategy is reviewed alongside corporate strategy annually. Key procurement goals are explicitly mapped to corporate priorities.',
          'Procurement strategy is formally derived from and co-created with corporate strategy. Goals, KPIs, and category plans have explicit links to business priorities and are updated when strategy changes.',
          'Procurement strategy is dynamically aligned to corporate strategy — AI monitors strategic plan updates and flags required category or supplier strategy adjustments in real time.'
        ]
      },
      {
        id: 'q-01-d1-03',
        text: 'Is the procurement mandate (ambition, scope, and authority) clearly defined, formally endorsed by C-suite, and consistently communicated across the business?',
        short: 'Procurement mandate',
        scores: [
          'No mandate exists. Procurement operates reactively without a defined ambition or strategic direction.',
          'A high-level mandate exists but is informal, inconsistently communicated, and not tied to business strategy.',
          'A documented mandate exists, is aligned to business priorities, and is understood by the procurement leadership team.',
          'The mandate is co-created with C-suite, formally endorsed, communicated across the business, and refreshed annually.',
          'Procurement mandate is embedded in corporate strategy, defines measurable ambition levels (savings, risk, sustainability, AI maturity), and is used to shape investment, talent, and transformation decisions.'
        ]
      },
      {
        id: 'q-01-d1-04',
        text: 'Is the procurement operating model (centralised, hybrid, or local) clearly defined and designed to deliver both scale benefits and responsiveness to business needs?',
        short: 'Operating model',
        scores: [
          'No defined operating model; fully local and fragmented.',
          'Weak coordination with a loosely defined structure.',
          'Operating model defined but only partially effective.',
          'Well-structured model effectively balancing central and local elements.',
          'Fully optimized, dynamic operating model capturing maximum scale benefits.'
        ]
      },
      {
        id: 'q-01-d1-05',
        text: 'Does procurement systematically gather and apply external market intelligence — covering supplier market dynamics, price trends, technology shifts, regulatory changes, and geopolitical risks — to inform strategy and category plans?',
        short: 'Market intelligence',
        scores: [
          'Market intelligence is gathered ad hoc. Procurement relies primarily on supplier inputs with no independent monitoring.',
          'Some market data is used (e.g. commodity prices) but not systematically across categories or integrated into strategy.',
          'A market intelligence process exists for strategic categories. Key signals are reviewed periodically and fed into category strategy updates.',
          'Market intelligence is continuous, structured, and covers price trends, supply market dynamics, regulatory changes, and geopolitical risk. Insights are integrated into category plans and risk management.',
          'AI continuously monitors and synthesises external signals — supplier news, commodity markets, trade policy, ESG events, new entrants — surfacing actionable intelligence in real time.'
        ]
      },
      {
        id: 'q-01-d1-06',
        text: "Is procurement's contribution to corporate strategy outcomes quantified (with formal procurement KPIs) and included in executive and board reporting regularly?",
        short: 'Value contribution reporting',
        scores: [
          "Procurement's contribution to corporate outcomes is not quantified or reported at board level.",
          'Some procurement outcomes are reported to leadership but are not linked to corporate strategy metrics.',
          'Key procurement outcomes (savings, risk avoided, ESG progress) are included in regular ExCo reporting.',
          "Procurement's full value contribution — financial, risk, innovation, sustainability — is quantified, Finance-validated, and featured in board reporting.",
          "Procurement's strategic contribution is dynamically modelled and updated in real time — with AI-generated board narratives linking supply chain performance to corporate strategy outcomes."
        ]
      },
      {
        id: 'q-01-d1-07',
        text: 'Is the procurement governance model — including roles, decision forums, councils, escalation paths, RACI, delegation of authority (DOA), audit requirements, and compliance obligations — clearly defined, enforced, and embedded across the organisation?',
        short: 'Governance model',
        scores: [
          'No governance model defined; roles and responsibilities are unclear.',
          'Informal, ad-hoc governance with local-only application.',
          'Governance model partially defined with inconsistent application.',
          'Well-structured governance with clear roles, forums, and escalation paths.',
          'Fully embedded governance model consistently enforced across the entire organization.'
        ]
      },
      {
        id: 'q-01-d1-08',
        text: 'Are strategic (Front Office) and Operational (Back Office) procurement roles clearly separated, defined, and structured?',
        short: 'Role separation (S2C / P2P)',
        scores: [
          'No defined roles; strategic and operational work is fully mixed.',
          'Limited role definition with some informal separation.',
          'Roles defined at a high level with basic structural separation.',
          'Well-structured role framework with a clear strategic/tactical/operational split.',
          'Fully optimized role framework with distinct layers and clear accountability at each level.'
        ]
      },
      {
        id: 'q-01-d1-09',
        text: 'Does procurement have the capability to manage change effectively — including stakeholder engagement, communication, training, and adoption tracking for new processes or tools?',
        short: 'Change management capability',
        scores: [
          'No change management capability.',
          'Reactive and unstructured responses to change.',
          'Defined change management approach in place.',
          'Structured programs with clear methodology and leadership sponsorship.',
          'Institutionalized, best-in-class change engine driving consistent adoption.'
        ]
      },
      {
        id: 'q-01-d1-10',
        text: 'Is Total Procurement Value clearly defined across savings, cost avoidance, TCO, working capital, and other value levers — and aligned with Finance?',
        short: 'Total value definition',
        scores: [
          'No common value definition.',
          'Informal definitions by function.',
          'Defined value taxonomy for core value types.',
          'Finance/business aligned taxonomy used in targets.',
          'Standard taxonomy embedded in governance and evidence requirements.'
        ]
      }
    ],
    D2: [
      {
        id: 'q-01-d2-01',
        text: 'To what extent is procurement master data — suppliers, materials, categories — standardised, deduplicated, and governed across regions and business units?',
        short: 'Master data governance',
        scores: [
          'Multiple sources of truth; significant duplication.',
          'Some governance in selected domains; gaps remain.',
          'Defined ownership; partial harmonisation across major domains.',
          'Single source of truth with active governance and named data stewards.',
          'AI-augmented MDM with continuous data-quality monitoring, automated reconciliation, and measurable downstream value.'
        ]
      },
      {
        id: 'q-01-d2-02',
        text: 'How comprehensive and granular is procurement spend visibility — covering categories, suppliers, sites, and cost drivers — and how current and reliable is the underlying data?',
        short: 'Spend visibility',
        scores: [
          'Spend visible only at high level; no granular baseline.',
          'Granular baseline for direct spend; gaps in indirect.',
          'Granular baseline across direct and most indirect spend.',
          'Comprehensive granular baseline with active analytics across category, supplier, site, and cost drivers.',
          'AI-augmented spend analytics with auto-classification, anomaly detection, and prescriptive cost-driver recommendations.'
        ]
      },
      {
        id: 'q-01-d2-03',
        text: 'To what extent is a standardised, centralised procurement platform / toolbox deployed and fully utilised across entities, categories, and processes?',
        short: 'S2P platform deployment',
        scores: [
          'No modern S2P platform; fragmented tooling.',
          'Partial deployment of S2P platform in selected entities.',
          'S2P platform deployed for major modules in core regions.',
          'Full deployment across modules and regions with measured utilisation.',
          'Modern S2P platform fully integrated with ERP, AI, and agentic layer — utilised at >85% of addressable spend.'
        ]
      },
      {
        id: 'q-01-d2-04',
        text: 'How effectively are procurement tools integrated with ERP — enabling real-time data exchange for purchase orders, invoices, supplier records, and financial postings?',
        short: 'ERP integration',
        scores: [
          'No integration; manual data re-entry between systems.',
          'Point-to-point integrations for some transactions; data lag.',
          'Core procurement-ERP data flows automated for major processes.',
          'Real-time bidirectional data exchange across procurement modules.',
          'Fully integrated, event-driven architecture enabling agentic procurement workflows.'
        ]
      },
      {
        id: 'q-01-d2-05',
        text: 'How effective is the current procurement tool stack — measured by user experience, productivity improvement, and regular feedback from buyers, category managers, and accounts payable teams?',
        short: 'Tool stack effectiveness',
        scores: [
          'Tools poorly adopted; frequent workarounds; user satisfaction low.',
          'Some tools used but limited adoption; productivity benefit unclear.',
          'Key tools adopted; satisfaction acceptable; measured benefit in select areas.',
          'Strong adoption; positive user feedback; measurable productivity gains.',
          'Best-in-class user experience; productivity gains validated; continuous improvement embedded.'
        ]
      },
      {
        id: 'q-01-d2-06',
        text: 'How robust are identity and access controls across procurement systems — including role-based access, regular reviews, and AI access governance for agents and copilots?',
        short: 'Identity & access controls',
        scores: [
          'No role-based access; shared credentials or open access.',
          'Basic access controls; no formal review cycle.',
          'Role-based access defined; annual review in place.',
          'RBAC enforced; quarterly access reviews; AI agent access governed.',
          'Zero-trust access model with continuous identity verification and automated provisioning/deprovisioning.'
        ]
      },
      {
        id: 'q-01-d2-07',
        text: 'Does procurement systematically assess, monitor, and manage cybersecurity and data privacy risks introduced by suppliers and third-party technology providers?',
        short: 'Cyber & data privacy risk',
        scores: [
          'No supplier cyber/privacy risk assessment process.',
          'Ad-hoc checks for high-profile suppliers only.',
          'Structured third-party risk assessment for critical suppliers.',
          'Continuous monitoring with defined thresholds and remediation plans.',
          'AI-driven third-party risk platform with real-time cyber scoring and automated escalation.'
        ]
      }
    ]
  },

  's-02': {
    title: 'Category Management',
    tag: 'Step 02 · S2C',
    desc: 'Evaluates the maturity of category strategy, market intelligence application, and procurement standardisation.',
    D1: [
      {
        id: 'q-02-d1-01',
        text: 'Is the category segmentation model formally defined (e.g. spend-based, strategic importance, risk level)?',
        short: 'Category segmentation model',
        scores: [
          'No category segmentation model in place.',
          'Basic segmentation exists but rarely used to guide decisions.',
          'Partial segmentation applied to key categories with inconsistent use.',
          'Structured segmentation model applied consistently to guide governance and effort.',
          'Fully implemented and embedded model driving differentiated category management.'
        ]
      },
      {
        id: 'q-02-d1-02',
        text: 'Are formal category strategies documented, reviewed and refreshed on a defined governance cadence — with documented sign-off, stakeholder alignment, and a clear process for incorporating changes in market or business priorities?',
        short: 'Formal category strategies',
        scores: [
          'No formal category strategy in place.',
          'Ad-hoc strategies exist but are fragmented and misaligned. Updated only when triggered by major events.',
          'Formal category strategies defined for key areas and updated on a periodic but infrequent basis.',
          'Formal category strategies regularly reviewed and updated on a structured cadence (e.g. yearly).',
          'Formal category strategies continuously reviewed and dynamically updated in line with business changes. Fully unified, business-aligned strategies.'
        ]
      },
      {
        id: 'q-02-d1-03',
        text: 'Are procurement processes standardized and consistently applied across the organization, regions, and categories?',
        short: 'Process standardisation',
        scores: [
          'No standardization; processes vary widely across the organization.',
          'Weak standardization with significant variation across regions.',
          'Mostly standardized with minor regional or category-level variations.',
          'Fully standardized processes consistently applied organization-wide.',
          'Globally optimized standard processes with continuous improvement embedded.'
        ]
      },
      {
        id: 'q-02-d1-04',
        text: 'Does procurement have a well-defined KPI framework with digital dashboards, actionable insights, and transparent reporting trusted across stakeholders?',
        short: 'KPI framework & dashboards',
        scores: [
          'No KPIs or reporting system in place.',
          'Basic KPIs defined but limited digital tracking or reporting.',
          'Partial KPI framework with emerging digital dashboards.',
          'Structured digital KPI system with transparent reporting across stakeholders.',
          'Fully integrated digital dashboard providing actionable insights, widely trusted and used.'
        ]
      },
      {
        id: 'q-02-d1-05',
        text: 'Are procurement incentives and performance targets linked to the full set of procurement KPIs — including savings, cost avoidance, risk reduction, sustainability, quality, speed, and stakeholder satisfaction?',
        short: 'Incentives linked to KPIs',
        scores: [
          'No link between incentives and procurement outcomes.',
          'Weak and informal link to procurement performance.',
          'Partial linkage to key procurement metrics.',
          'Strong alignment between incentives and value delivery targets.',
          'Fully aligned incentive structure reinforcing a value-driven procurement culture.'
        ]
      },
      {
        id: 'q-02-d1-06',
        text: 'Are structured AI training, upskilling, and capability-building programs in place for procurement staff?',
        short: 'AI training & upskilling',
        scores: [
          'No AI training or development programs in place.',
          'Ad-hoc and informal training with no structured curriculum.',
          'Basic programs defined but limited in scope and organizational reach.',
          'Structured programs in place (academy, masterclasses, targeted upskilling).',
          'Comprehensive, continuously evolving capability-building ecosystem.'
        ]
      },
      {
        id: 'q-02-d1-07',
        text: 'Are AI and analytics skills formally embedded in procurement career paths — with role-based capability assessments, development targets, and a skills framework that evolves as AI capabilities advance?',
        short: 'AI skills framework',
        scores: [
          'No AI or analytics skills framework exists in procurement.',
          'Some AI training available but skills not formally assessed or linked to career progression.',
          'AI literacy expectations defined for key roles. Training programmes exist and completion is tracked.',
          'AI and analytics skills embedded in all procurement job profiles with role-specific assessments and development plans.',
          'Procurement has a living AI skills framework that automatically updates as new capabilities emerge.'
        ]
      }
    ],
    D2: [
      {
        id: 'q-02-d2-01',
        text: 'How are digital sourcing tools deployed and used — covering electronic RFPs, reverse auctions, and scenario analysis — and what share of sourcing events are conducted through these tools?',
        short: 'Digital sourcing (eSourcing)',
        scores: [
          'No eSourcing tools; manual / email-based sourcing.',
          'eSourcing pilots in selected categories.',
          'eSourcing deployed for core categories.',
          'eSourcing used for most sourcing events with measured cycle-time benefit.',
          'eSourcing fully embedded with AI-assisted bid analysis, dynamic eAuctions, and automated supplier shortlisting.'
        ]
      },
      {
        id: 'q-02-d2-02',
        text: 'How comprehensive and granular is procurement spend visibility and analytics for category management?',
        short: 'Category spend analytics',
        scores: [
          'No spend analytics; data pulled manually from ERP.',
          'Basic spend cube available; limited categorisation.',
          'Spend analytics available for major categories with reasonable accuracy.',
          'Comprehensive spend analytics with drill-down by supplier, category, site, and cost driver.',
          'AI-powered spend analytics with auto-classification, anomaly detection, and prescriptive recommendations.'
        ]
      }
    ]
  },

  's-03': {
    title: 'Supplier Management',
    tag: 'Step 03 · S2C',
    desc: 'Covers supplier segmentation, performance management, risk monitoring, financial health, and development.',
    D1: [
      {
        id: 'q-03-d1-01',
        text: 'Is a supplier segmentation model in place — classifying suppliers by strategic importance, spend, and risk — and used to differentiate the level of governance, management attention, and resources applied?',
        short: 'Supplier segmentation',
        scores: [
          'No supplier segmentation model in place.',
          'Basic segmentation exists but rarely used to guide decisions.',
          'Partial segmentation applied to key suppliers with inconsistent use.',
          'Structured segmentation model applied consistently to guide governance and effort.',
          'Fully implemented and embedded model driving differentiated supplier management.'
        ]
      },
      {
        id: 'q-03-d1-02',
        text: 'Is supplier quality and service performance regularly measured using reliable KPIs for critical suppliers?',
        short: 'Supplier performance KPIs',
        scores: [
          'Not measured.',
          'Ad-hoc / manual tracking.',
          'KPIs tracked for selected suppliers.',
          'Structured scorecards with targets.',
          'Regular KPI reporting across all critical suppliers with closed-loop corrective actions.'
        ]
      },
      {
        id: 'q-03-d1-03',
        text: 'Beyond performance management, does procurement actively invest in developing strategic suppliers\' capabilities — quality, financial health, sustainability, technology, capacity — to reduce long-term risk and drive competitive advantage?',
        short: 'Supplier development',
        scores: [
          'No supplier development activity. Procurement interacts with suppliers only around transactions and issues.',
          'Some informal coaching or support happens with key suppliers, but no structured development programmes exist.',
          'A supplier development programme exists for critical suppliers — covering capability assessments, improvement plans, and dedicated support.',
          'Supplier development is a strategic investment — with tiered programmes, shared KPIs, co-funded capability building, and measurable impact tracked.',
          'AI identifies supplier capability gaps, prioritises development investments by strategic value, and monitors improvement progress in real time.'
        ]
      },
      {
        id: 'q-03-d1-04',
        text: 'Does procurement actively monitor the financial viability and credit health of critical suppliers — using credit scores, financial statements, payment behaviour indicators, or third-party ratings?',
        short: 'Supplier financial health monitoring',
        scores: [
          'Supplier financial health is not monitored. Financial distress risk is only identified after a supplier failure occurs.',
          'Financial health checks are performed at onboarding for new suppliers but ongoing monitoring of existing critical suppliers does not exist.',
          'Critical supplier financial health is monitored annually or at contract renewal — using credit ratings or financial statements.',
          'Supplier financial viability is continuously monitored for all critical suppliers — with automated alerts triggered when credit scores deteriorate.',
          'AI continuously scans financial databases, news, and payment signals for all critical suppliers — providing real-time financial health scores and predicting distress 3–6 months in advance.'
        ]
      },
      {
        id: 'q-03-d1-05',
        text: 'Is supplier risk monitored across key risk types (financial, operational, geopolitical, ESG, cyber) and linked to defined mitigation actions by supplier or category risk profile?',
        short: 'Supplier risk monitoring',
        scores: [
          'Reactive — risk only identified after incidents.',
          'Periodic monitoring for selected high-value suppliers.',
          'Structured monitoring across key risk types for critical suppliers.',
          'Actions linked to risk profile; escalation thresholds defined.',
          'Proactive risk governance with AI-driven continuous monitoring and agentic mitigation workflows.'
        ]
      },
      {
        id: 'q-03-d1-06',
        text: 'Does procurement actively manage geopolitical risk and trade policy exposure — mapping country/trade-bloc concentration in the supply base, monitoring tariff and sanction developments, and maintaining contingency sourcing options?',
        short: 'Geopolitical & trade risk',
        scores: [
          'No geopolitical risk assessment in procurement. Country concentration and tariff exposure are not mapped.',
          'Geopolitical risk awareness exists at leadership level but no structured framework or monitoring process.',
          'Country and trade-bloc concentration is mapped for critical categories. Key tariff and sanction developments are monitored.',
          'A formal geopolitical risk management programme exists — with supply base country mapping, tariff scenario modelling, and pre-built disruption playbooks.',
          'AI continuously monitors geopolitical and trade policy signals — tracking tariff changes, sanctions, and political risk scores — dynamically updating exposure maps.'
        ]
      },
      {
        id: 'q-03-d1-07',
        text: 'Are single-source dependencies systematically mapped, risk-rated, and governed — with funded mitigation programmes (dual-source qualification, safety stock, demand shaping) in place for critical exposures?',
        short: 'Single-source dependency management',
        scores: [
          'Single-source dependencies are not systematically mapped.',
          'Single-source situations are known for some categories but risk mitigation is ad hoc.',
          'A single-source dependency register exists for critical categories with documented mitigation approaches.',
          'Single-source risk is governed through a formal programme with funded dual-source qualification milestones.',
          'AI continuously scans the supply base for emerging single-source concentrations and proactively triggers qualification workstreams.'
        ]
      },
      {
        id: 'q-03-d1-08',
        text: 'Is the supplier onboarding process standardised, digitally enabled, and performance-managed — covering registration, qualification, compliance checks, data setup, and system activation?',
        short: 'Supplier onboarding',
        scores: [
          'Supplier onboarding is manual, fragmented across teams, and has no defined process or cycle time standards.',
          'An onboarding process exists but is largely manual, inconsistently applied, and cycle times vary widely.',
          'A standardised supplier onboarding process is documented. Key steps are defined with ownership, and cycle time is measured for priority suppliers.',
          'Supplier onboarding is digitally enabled — using a supplier portal for self-registration, automated compliance screening, and system-integrated data setup.',
          'Onboarding is AI-orchestrated and largely automated — suppliers self-register via portal, AI verifies compliance in real time, ERP data is auto-populated.'
        ]
      }
    ],
    D2: [
      {
        id: 'q-03-d2-01',
        text: 'Is there a dedicated Supplier Relationship Management (SRM) platform or module supporting supplier performance tracking, communication, and collaboration?',
        short: 'SRM platform',
        scores: [
          'No SRM platform; all managed via email and spreadsheets.',
          'Basic supplier database; no performance management capability.',
          'SRM module deployed for strategic suppliers.',
          'SRM platform used across critical and key supplier segments.',
          'Fully integrated SRM with AI-powered performance insights and proactive relationship recommendations.'
        ]
      },
      {
        id: 'q-03-d2-02',
        text: 'Is there a supplier risk monitoring platform providing external risk signals (financial, ESG, cyber, geopolitical) for critical suppliers?',
        short: 'Supplier risk platform',
        scores: [
          'No external risk monitoring; internal-only assessment.',
          'Manual use of public data for some risk checks.',
          'Third-party risk data used periodically for selected suppliers.',
          'Automated risk monitoring platform covering critical supplier base.',
          'AI-powered continuous monitoring with predictive risk scoring and integrated mitigation triggers.'
        ]
      }
    ]
  },

  's-04': {
    title: 'Strategic Sourcing (RFx)',
    tag: 'Step 04 · S2C',
    desc: 'Evaluates the maturity of sourcing processes, negotiation capability, and digital sourcing tool adoption.',
    D1: [
      {
        id: 'q-04-d1-01',
        text: 'Is the sourcing event process — covering RFPs and competitive bidding — structured, consistently applied, digitally enabled, and governed with clear templates, evaluation criteria, and approval workflows?',
        short: 'RFP / sourcing event process',
        scores: [
          'RFPs sent via manual email with no structure or standard template.',
          'Partially structured process with inconsistent digital usage.',
          'Structured RFP process with consistent methodology and digital tooling.',
          'Fully digital, end-to-end RFP process with automated workflows and analytics.',
          'AI-assisted sourcing with automated bid analysis, dynamic eAuctions, and supplier shortlisting.'
        ]
      },
      {
        id: 'q-04-d1-02',
        text: 'Does procurement apply a structured negotiation approach — including preparation (BATNA, reserve price, concession planning), tactic selection, and post-negotiation review — as a distinct, teachable capability?',
        short: 'Negotiation methodology',
        scores: [
          'Negotiation is unstructured and individual. No defined methodology, preparation framework, or post-negotiation review exists.',
          'Some training on negotiation exists and experienced practitioners use structured approaches informally.',
          'A procurement negotiation methodology is defined — including preparation frameworks, tactic libraries, and post-negotiation review templates.',
          'Negotiation capability is systematically developed — with a common methodology, coaching model, simulation practice, and performance tracking.',
          'AI supports negotiation preparation in real time — generating market intelligence packages, should-cost models, supplier-specific BATNA assessments, and recommended concession sequences.'
        ]
      },
      {
        id: 'q-04-d1-03',
        text: 'Are key Source-to-Pay (S2P) cycle times actively measured, targeted, and optimised — with improvement actions tracked?',
        short: 'S2P cycle time management',
        scores: [
          'Cycle time not measured or tracked.',
          'Partially measured in isolated steps or select categories.',
          'Cycle time measured and actively managed with targets in place.',
          'Optimized with clear targets, regular reviews, and improvement actions.',
          'Fully automated with real-time cycle time monitoring and continuous optimization.'
        ]
      },
      {
        id: 'q-04-d1-04',
        text: 'Is savings tracking centralized with a finance-approved approach for realized vs. committed savings?',
        short: 'Savings tracking & validation',
        scores: [
          'No centralized savings tracking.',
          'Informal savings tracking by category without Finance validation.',
          'Centralized savings tracking with defined methodology.',
          'Finance-approved approach with realized vs. committed tracking.',
          'Fully integrated savings tracking with P&L linkage and audit trail.'
        ]
      }
    ],
    D2: [
      {
        id: 'q-04-d2-01',
        text: 'How are digital sourcing tools deployed — covering electronic RFPs, reverse auctions, and scenario analysis?',
        short: 'eSourcing tool adoption',
        scores: [
          'No eSourcing tools; manual / email-based sourcing.',
          'eSourcing pilots in selected categories.',
          'eSourcing deployed for core categories.',
          'eSourcing used for most sourcing events with measured cycle-time benefit.',
          'eSourcing fully embedded with AI-assisted bid analysis, dynamic eAuctions, and automated shortlisting.'
        ]
      }
    ]
  },

  's-05': {
    title: 'Contract Management',
    tag: 'Step 05 · S2C',
    desc: 'Assesses the maturity of contract lifecycle management, template governance, and digital CLM adoption.',
    D1: [
      {
        id: 'q-05-d1-01',
        text: 'Is the full contract lifecycle — from template and authoring through execution, obligation tracking, renewal management, and performance monitoring — managed systematically with digital tooling?',
        short: 'Contract lifecycle management (CLM)',
        scores: [
          'Contracts are stored in shared drives or email. No structured CLM process or system exists. Renewals are missed.',
          'A basic contract repository exists. Key dates are tracked for major contracts, but lifecycle management is manual and inconsistent.',
          'A CLM tool is deployed. Contracts are stored centrally, key milestones and renewals are tracked, and standard templates are used.',
          'End-to-end CLM is operational — covering automated authoring with templates, obligation tracking, renewal alerts, performance KPIs, and regular contract health reviews.',
          'AI-powered CLM manages the full lifecycle — GenAI drafting, automated clause extraction and risk flagging, obligation tracking, proactive renewal optimisation, and real-time contract performance analytics.'
        ]
      },
      {
        id: 'q-05-d1-02',
        text: 'Is the majority of spend covered by active, digitized contracts accessible in a central repository?',
        short: 'Contract coverage & repository',
        scores: [
          'No central repository; contracts stored in silos or email.',
          'Repository exists for some contracts (<50% coverage).',
          'Central repository with majority of contracts (50–75%).',
          'Comprehensive repository with >80% of spend under active contracts.',
          'Full coverage with AI-searchable repository and real-time contract intelligence.'
        ]
      },
      {
        id: 'q-05-d1-03',
        text: 'Is there a standard contract template library governed by procurement and/or legal?',
        short: 'Template library & governance',
        scores: [
          'No standard templates; each contract created from scratch.',
          'Some templates exist but are not governed or consistently used.',
          'A template library exists for key contract types with basic governance.',
          'Governed template library with regular review cycle and legal sign-off.',
          'AI-enhanced template library with clause recommendations, risk scoring, and dynamic updates based on legal/regulatory changes.'
        ]
      },
      {
        id: 'q-05-d1-04',
        text: 'Are realised procurement benefits mapped to P&L, EBITDA, and cash flow impact — and formally validated by Finance?',
        short: 'P&L benefit mapping',
        scores: [
          'No linkage to budget/P&L.',
          'Informal impact estimates.',
          'Benefits mapped to budgets/cost centers.',
          'Finance-validated P&L/cash impact.',
          'Audited realized EBITDA/cash impact with continuous follow-up.'
        ]
      }
    ],
    D2: [
      {
        id: 'q-05-d2-01',
        text: 'Is a dedicated CLM (Contract Lifecycle Management) platform deployed?',
        short: 'CLM platform deployment',
        scores: [
          'No CLM platform; contracts in shared drives or email.',
          'Basic repository only; no lifecycle management.',
          'CLM platform deployed for core contract types.',
          'CLM platform used across majority of contract categories with workflow automation.',
          'Fully integrated CLM with AI drafting, clause extraction, obligation tracking, and analytics.'
        ]
      }
    ]
  },

  's-06': {
    title: 'PR & Requisition',
    tag: 'Step 06 · P2P',
    desc: 'Evaluates the purchase requisition process, guided buying adoption, and workflow automation.',
    D1: [
      {
        id: 'q-06-d1-01',
        text: 'Is the purchase requisition to purchase order (PR-to-PO) process in place, with digital process automated and touchless for standard, compliant purchases?',
        short: 'PR-to-PO automation',
        scores: [
          'Entirely manual with no automation.',
          'Limited automation in isolated process steps.',
          'Partially automated with significant manual touchpoints remaining.',
          'Mostly automated with minimal manual intervention.',
          'Fully automated and touchless end-to-end for standard purchases.'
        ]
      },
      {
        id: 'q-06-d1-02',
        text: 'Is maverick buying monitored and actively managed to drive compliance to preferred suppliers?',
        short: 'Maverick buying control',
        scores: [
          'Maverick buying not tracked. No visibility on off-contract spend.',
          'Some maverick spend identified but no active management.',
          'Maverick buying tracked and reported; basic compliance enforcement.',
          'Compliance actively managed with supplier rationalisation and guided buying tools.',
          'Near-zero maverick buying with AI-enforced preferred supplier compliance and real-time alerts.'
        ]
      },
      {
        id: 'q-06-d1-03',
        text: 'To what extent are procurement workflows automated — including approvals, notifications, reporting, and exception handling — to reduce manual effort?',
        short: 'Workflow automation',
        scores: [
          'Predominantly manual with minimal automation.',
          'Some automation in isolated workflows.',
          'Mixed environment with manual and automated workflows in equal measure.',
          'Mostly automated with targeted human oversight for exceptions.',
          'Fully automated workflows with AI-driven optimization and exception-handling.'
        ]
      },
      {
        id: 'q-06-d1-04',
        text: 'Is compliance (policy, preferred supplier, contract) measured and reported systematically?',
        short: 'Compliance monitoring',
        scores: [
          'Compliance not measured or tracked.',
          'Ad-hoc compliance checks on request.',
          'Compliance reported for key spend categories.',
          'Systematic compliance reporting with action plans for gaps.',
          'Real-time compliance monitoring with AI-driven corrective action triggers.'
        ]
      }
    ],
    D2: [
      {
        id: 'q-06-d2-01',
        text: 'How are digital purchasing tools deployed and used — including product catalogues, guided buying, and requisition tools — and what is the level of adoption across the business?',
        short: 'eProcurement / guided buying',
        scores: [
          'No eProcurement tools; all requisitions manual.',
          'Pilots in selected categories.',
          'eProcurement deployed for core categories with partial adoption.',
          'eProcurement used across most categories with measured touchless rates.',
          'Fully embedded with AI-guided buying, self-service catalogues, and real-time compliance enforcement.'
        ]
      }
    ]
  },

  's-07': {
    title: 'PO Management',
    tag: 'Step 07 · P2P',
    desc: 'Covers purchase order creation, goods receipt, change order management, and P2P cycle times.',
    D1: [
      {
        id: 'q-07-d1-01',
        text: 'Are key Source-to-Pay cycle times — including PO creation to delivery — actively measured, targeted, and optimised?',
        short: 'PO cycle time management',
        scores: [
          'Cycle times not measured.',
          'Partially measured in isolated steps.',
          'Cycle time measured with targets in place.',
          'Optimized with clear targets and improvement actions.',
          'Fully automated with real-time cycle time monitoring.'
        ]
      },
      {
        id: 'q-07-d1-02',
        text: 'Is the PO process digitised — with automated PO creation, electronic delivery to suppliers, and digital confirmation/acknowledgement?',
        short: 'PO digitisation & automation',
        scores: [
          'Manual PO creation and paper/email delivery to suppliers.',
          'PO creation partially automated; delivery still manual.',
          'Digital PO creation and delivery for core spend categories.',
          'Automated PO creation and electronic transmission with supplier acknowledgement.',
          'Fully touchless PO management with AI-driven exception handling.'
        ]
      },
      {
        id: 'q-07-d1-03',
        text: 'Is compliance (policy, preferred supplier, contract) measured and reported systematically at PO level?',
        short: 'PO compliance monitoring',
        scores: [
          'PO compliance not measured.',
          'Ad-hoc compliance checks.',
          'Compliance measured for key categories.',
          'Systematic PO compliance reporting with escalation.',
          'Real-time PO compliance monitoring with AI-driven alerts.'
        ]
      }
    ],
    D2: [
      {
        id: 'q-07-d2-01',
        text: 'To what extent is PO management integrated with supplier portals and ERP for real-time status tracking?',
        short: 'PO-supplier portal integration',
        scores: [
          'No supplier portal; PO status tracked manually.',
          'Email-based PO confirmation; limited visibility.',
          'Supplier portal available for key suppliers.',
          'Integrated portal used by majority of spend base.',
          'Real-time, AI-enhanced PO status and exception management across all suppliers.'
        ]
      }
    ]
  },

  's-08': {
    title: 'Invoice & Accounts Payable',
    tag: 'Step 08 · P2P',
    desc: 'Assesses invoice processing automation, 3-way match rates, exception management, and AP cycle times.',
    D1: [
      {
        id: 'q-08-d1-01',
        text: 'Does procurement actively track invoice accuracy — including the first-pass (3-way) match rate, the exception rate, and root causes of errors — as a standard quality measure for the purchasing process?',
        short: 'Invoice accuracy & 3-way match',
        scores: [
          'Invoice accuracy is not tracked. Errors are resolved reactively with no visibility into volume, cost, or root cause.',
          'Invoice exception volumes are tracked informally. Some rework is quantified but first-pass match rate and root causes are not measured systematically.',
          'First-pass match rate and invoice exception rate are tracked for key suppliers and categories. Common root causes are identified.',
          'Invoice accuracy KPIs are embedded in supplier scorecards and S2P governance. First-pass match rate targets are set and root-cause corrective actions are tracked to closure.',
          'AI-powered invoice processing achieves near-100% straight-through matching — automatically resolving exceptions and preventing recurrence through self-learning.'
        ]
      },
      {
        id: 'q-08-d1-02',
        text: 'To what extent is invoice processing automated — from receipt through matching, approval, and payment posting?',
        short: 'Invoice processing automation',
        scores: [
          'Entirely manual invoice processing.',
          'Limited automation in isolated steps (e.g. PDF capture only).',
          'Partially automated with significant manual touchpoints.',
          'Mostly automated with AI-driven OCR and 3-way match.',
          'Fully touchless AP with AI exception handling and straight-through processing.'
        ]
      },
      {
        id: 'q-08-d1-03',
        text: 'Is AP cycle time (invoice receipt to payment) measured and actively managed to optimise cash flow and capture early payment discounts?',
        short: 'AP cycle time & cash management',
        scores: [
          'AP cycle time not measured.',
          'Measured informally for some invoices.',
          'AP cycle time tracked with targets for key suppliers.',
          'Active cash flow optimisation with dynamic discounting programs.',
          'AI-driven payment timing optimisation integrated with treasury for maximum working capital benefit.'
        ]
      }
    ],
    D2: [
      {
        id: 'q-08-d2-01',
        text: 'Is an AP automation platform (e-invoicing, OCR, AI matching) deployed?',
        short: 'AP automation platform',
        scores: [
          'No AP automation; manual invoice processing.',
          'Basic OCR/scanning for paper invoices.',
          'AP automation for key suppliers and spend categories.',
          'Broad AP automation coverage with high straight-through rates.',
          'AI-powered AP platform with near-100% automation and self-learning exception handling.'
        ]
      }
    ]
  },

  's-09': {
    title: 'Reporting & Analytics',
    tag: 'Step 09 · P2P',
    desc: 'Covers procurement analytics maturity, self-service capability, and data-driven decision-making.',
    D1: [
      {
        id: 'q-09-d1-01',
        text: 'Does procurement have a well-defined KPI framework with digital dashboards, actionable insights, and transparent reporting trusted across stakeholders?',
        short: 'Procurement KPI framework',
        scores: [
          'No KPIs or reporting system in place.',
          'Basic KPIs defined but limited digital tracking or reporting.',
          'Partial KPI framework with emerging digital dashboards.',
          'Structured digital KPI system with transparent reporting across stakeholders.',
          'Fully integrated digital dashboard providing actionable insights, widely trusted and used.'
        ]
      },
      {
        id: 'q-09-d1-02',
        text: 'Can procurement professionals self-serve insights and run their own analysis — without depending on IT or specialist data teams — using AI analytics tools that are intuitive and connected to live procurement data?',
        short: 'Self-service analytics',
        scores: [
          'Procurement relies on IT or Finance for data. No self-service analytics capability exists. Reporting is manual and delayed.',
          'Standard dashboards exist but are largely static. Non-standard analysis requires IT support and has long lead times.',
          'A self-service analytics environment is available. Category managers can run standard reports without IT involvement.',
          'Procurement has a mature self-service analytics platform — enabling ad hoc spend analysis, supplier benchmarking, and KPI tracking without specialist support.',
          'AI-augmented analytics allows procurement professionals to query data in natural language and receive AI-generated hypotheses and recommendations.'
        ]
      },
      {
        id: 'q-09-d1-03',
        text: 'Are realised procurement benefits mapped to P&L, EBITDA, and cash flow impact — and formally validated by Finance?',
        short: 'Finance-validated P&L mapping',
        scores: [
          'No linkage to budget/P&L.',
          'Informal impact estimates.',
          'Benefits mapped to budgets/cost centers.',
          'Finance-validated P&L/cash impact.',
          'Audited realized EBITDA/cash impact with continuous follow-up.'
        ]
      },
      {
        id: 'q-09-d1-04',
        text: 'Does procurement have a clearly defined role in driving supplier-led innovation and bringing new solutions to the business?',
        short: 'Innovation role',
        scores: [
          'No defined innovation role.',
          'Ad-hoc involvement.',
          'Defined role in selected areas.',
          'Clear role in innovation governance.',
          'Embedded strategic innovation partner.'
        ]
      }
    ],
    D2: [
      {
        id: 'q-09-d2-01',
        text: 'Is there a procurement analytics platform or BI layer providing real-time, integrated reporting across the S2P process?',
        short: 'Analytics platform / BI',
        scores: [
          'No analytics platform; Excel-based reporting.',
          'Basic BI dashboards with limited data integration.',
          'BI platform deployed with key procurement data sources connected.',
          'Comprehensive analytics platform with real-time data and self-service capability.',
          'AI-powered analytics with natural language querying, automated insights, and prescriptive recommendations.'
        ]
      }
    ]
  },

  's-ai': {
    title: 'AI & Technology Deep Dive',
    tag: 'AI Maturity · Cross-cutting',
    desc: 'Advanced AI maturity questions covering the full AI portfolio across all process steps.',
    D3: [
      {
        id: 'q-ai-d3-01',
        text: 'To what extent are digital and AI use cases identified, prioritised, and tracked through a structured pipeline — from ideation to retirement?',
        short: 'AI use case pipeline management',
        scores: [
          'No pipeline; use cases pursued ad hoc by individual teams.',
          'Use cases captured in a list but no prioritisation or value tracking.',
          'Defined intake and prioritisation process, but limited follow-through to production.',
          'End-to-end pipeline with production deployment and ROI tracking on key use cases.',
          'Industrialised use-case factory with measured value capture, active portfolio rebalancing, and retirement of underperformers.'
        ]
      },
      {
        id: 'q-ai-d3-02',
        text: 'To what extent is procurement automation deployed across processes — including RPA, workflow automation, and emerging agentic AI — with measurable productivity impact?',
        short: 'Automation & agentic AI',
        scores: [
          'No scaled automation; processes largely manual.',
          'RPA or workflow automation in isolated processes; no consolidated view.',
          'Scaled automation across major procurement processes with tracked productivity.',
          'Mix of RPA, workflow automation, and agentic AI with portfolio-level productivity reporting.',
          'Agentic-first: scaled across processes, with adaptive autonomy boundaries, continuous learning, and clear ROI per agent.'
        ]
      },
      {
        id: 'q-ai-d3-03',
        text: "To what extent do procurement teams use AI assistants that are connected to the company's own data — contracts, supplier records, policies, and purchase history — rather than general-purpose AI tools?",
        short: 'Grounded AI copilots',
        scores: [
          'No AI copilots used in procurement.',
          'Generic LLMs (ChatGPT, Copilot) used informally with no grounding.',
          'Copilots grounded in selected procurement data (e.g. policies only).',
          'Copilots grounded in core procurement data across major workflows.',
          'Fully grounded copilots with measured productivity uplift, integrated into all major workflows and updated continuously.'
        ]
      },
      {
        id: 'q-ai-d3-04',
        text: 'To what extent does AI forecast key material prices and analyse spend patterns to identify cost-reduction opportunities across categories and suppliers?',
        short: 'AI in sourcing & category management',
        scores: [
          'No AI use in price forecasting or spend analysis.',
          'Manual price tracking with occasional AI-assisted analysis.',
          'AI-assisted forecasting and spend analysis for selected high-value categories.',
          'AI-driven forecasting and spend analysis across major categories with measured savings impact.',
          'Continuous AI-driven price intelligence and spend optimisation integrated into sourcing decisions, with auto-generated category strategy recommendations.'
        ]
      },
      {
        id: 'q-ai-d3-05',
        text: 'To what extent are predictive analytics used in procurement decisions — including demand forecasting, price prediction, and risk signal detection?',
        short: 'Predictive analytics',
        scores: [
          'No predictive analytics in use.',
          'Predictive analytics in pilots only.',
          'Predictive analytics used in selected high-value categories.',
          'Predictive analytics across major categories with tracked accuracy and decision integration.',
          'Predictive procurement with closed-loop action, continuous model retraining, and measured business outcomes.'
        ]
      },
      {
        id: 'q-ai-d3-06',
        text: 'How does AI continuously monitor and predict supplier and supply-chain risk — with alerts triggered automatically and defined response workflows activated when risk thresholds are breached?',
        short: 'AI supplier risk & intelligence',
        scores: [
          'No AI-based risk monitoring.',
          'Reactive AI alerts on selected risks; mitigation entirely manual.',
          'AI risk monitoring across major categories with human-driven mitigation.',
          'Predictive AI risk monitoring with human-triggered mitigation workflows.',
          'Predictive monitoring with agentic mitigation workflows, full audit trail, and integration with business continuity planning.'
        ]
      }
    ],
    D4: [
      {
        id: 'q-ai-d4-01',
        text: 'How is the business value of AI and agentic deployments — savings, productivity uplift, cycle-time reduction — measured, tracked, and reported alongside maturity scores?',
        short: 'AI value tracking',
        scores: [
          'AI value not measured.',
          'Anecdotal value claims; no systematic tracking.',
          'Value tracked per use case but not aggregated.',
          'Portfolio-level value tracking with named owners and quarterly reporting.',
          'Continuous value tracking with attribution models, leadership dashboard, and direct linkage to AI investment decisions.'
        ]
      },
      {
        id: 'q-ai-d4-02',
        text: 'How rigorously is the AI/digital portfolio managed for value — with periodic review, measured outcomes, and active retirement of underperforming use cases?',
        short: 'AI portfolio governance',
        scores: [
          'No portfolio-level view of AI/digital investments.',
          'Use cases tracked individually but not aggregated to portfolio.',
          'Portfolio view exists; reviewed annually with limited value data.',
          'Portfolio actively managed with quarterly reviews and tracked value capture.',
          'Dynamic portfolio with continuous value tracking, automated drift signals, and capital reallocation between use cases.'
        ]
      },
      {
        id: 'q-ai-d4-03',
        text: 'How extensively are AI systems used to execute defined procurement workflows — such as sourcing preparation, requisition handling, exception routing, and invoice matching — with human oversight at key decision points?',
        short: 'Agentic workflow execution',
        scores: [
          'No agentic AI in production use.',
          'Agentic pilots in advisory mode only; humans take all decisions.',
          'Production agents with high-frequency human review on every decision.',
          'Production agents with bounded autonomy across selected workflows; humans review exceptions.',
          'Multi-agent orchestration across S2P with adaptive autonomy, full audit trails, and measured productivity uplift.'
        ]
      },
      {
        id: 'q-ai-d4-04',
        text: 'How systematically is AI fluency measured and developed across procurement personas — with role-based capability programmes for buyers, category managers, AP, and leadership?',
        short: 'AI fluency & capability building',
        scores: [
          'AI fluency not measured; training is informal or absent.',
          'Generic AI awareness training offered company-wide.',
          'Role-specific AI training available for selected procurement personas.',
          'Measured AI fluency across personas with structured capability programmes.',
          'Continuous AI capability building with measured fluency uplift, persona-tailored learning paths, and direct linkage to use-case adoption.'
        ]
      },
      {
        id: 'q-ai-d4-05',
        text: 'How robust is the AI governance framework in procurement — covering who can authorise AI decisions, audit trails, performance monitoring, and controls appropriate to the level of AI autonomy deployed?',
        short: 'AI governance framework',
        scores: [
          'No AI governance framework.',
          'Ad-hoc oversight on selected use cases.',
          'Defined governance for production AI; audit on demand only.',
          'Governance with regular audit and review across the AI portfolio; AI Act high-risk system classifications documented.',
          'Continuous AI assurance with automated bias/drift monitoring, dynamic autonomy adjustment, board-level AI risk reporting, full AI Act compliance.'
        ]
      },
      {
        id: 'q-ai-d4-06',
        text: 'Beyond GenAI drafting, does procurement use AI to extract structured intelligence from the contract portfolio — obligations, commercial terms, benchmarking clauses, renewal windows — to drive active contract and value management?',
        short: 'GenAI in contracts & negotiations',
        scores: [
          'No GenAI use in contracting.',
          'GenAI used for drafting only.',
          'GenAI for prep and drafting in core categories.',
          'GenAI across drafting, negotiation prep, and obligation tracking.',
          'Closed-loop GenAI with measured savings and risk uplift across the full contract lifecycle, including auto-flagged renegotiation opportunities.'
        ]
      },
      {
        id: 'q-ai-d4-07',
        text: 'How autonomously do AI agents discover, evaluate, and shortlist new or alternative suppliers across categories — with measurable conversion to qualified pipeline?',
        short: 'AI-driven supplier discovery',
        scores: [
          'No AI in supplier discovery; manual research only.',
          'AI-assisted supplier search in selected categories.',
          'Regular AI-assisted supplier discovery across core categories with human curation.',
          'AI agents propose qualified shortlists with human review and measured pipeline conversion.',
          'Autonomous multi-source agentic supplier discovery integrated into sourcing workflows, with ESG and risk screening at point of discovery.'
        ]
      },
      {
        id: 'q-ai-d4-08',
        text: 'How is real-time data used in procurement — to generate alerts on material price moves, supplier risk signals, or demand spikes — and how quickly can the team act on these signals?',
        short: 'Real-time analytics & alerting',
        scores: [
          'No real-time analytics; reporting is batch-based.',
          'Real-time dashboards exist but rarely consulted.',
          'Real-time analytics actively used in core categories.',
          'Event-driven alerts triggering human review across procurement.',
          'Event-driven agentic responses with measurable cycle-time impact and continuous improvement of alert thresholds.'
        ]
      }
    ]
  }
};

// Score band definitions
const BANDS = [
  { min: 1.0, max: 1.8, label: 'Initial',     color: '#ef4444', bg: '#fee2e2', desc: 'Ad hoc processes. No formal procurement function. No dedicated tools. No AI awareness.' },
  { min: 1.9, max: 2.6, label: 'Developing',  color: '#f97316', bg: '#fed7aa', desc: 'Basic processes documented but inconsistently applied. ERP in place with limited procurement modules. Isolated AI experiments.' },
  { min: 2.7, max: 3.4, label: 'Defined',     color: '#eab308', bg: '#fef9c3', desc: 'Standardized processes across categories. Dedicated S2C/P2P platform. Structured AI pilot(s) underway with measurable outcomes.' },
  { min: 3.5, max: 4.2, label: 'Advanced',    color: '#22c55e', bg: '#dcfce7', desc: 'Data-driven decisions with KPIs tracked. Integrated tech stack with strong automation. Multiple AI use cases in production.' },
  { min: 4.3, max: 5.0, label: 'Pioneer',     color: '#0ea5e9', bg: '#dbeafe', desc: 'Predictive, proactive procurement with AI embedded in core decisions. AI is a core operational capability.' }
];

function getBand(score) {
  if (!score || score < 1) return null;
  return BANDS.find(b => score >= b.min && score <= b.max) || BANDS[BANDS.length - 1];
}

const STEP_IDS = ['s-01','s-02','s-03','s-04','s-05','s-06','s-07','s-08','s-09','s-ai'];
const DIM_WEIGHTS = { D1: 0.35, D2: 0.30, D3: 0.20, D4: 0.15 };
const STEP_LABELS = {
  's-01': '01 · Strategy & Governance',
  's-02': '02 · Category Management',
  's-03': '03 · Supplier Management',
  's-04': '04 · Strategic Sourcing (RFx)',
  's-05': '05 · Contract Management',
  's-06': '06 · PR & Requisition',
  's-07': '07 · PO Management',
  's-08': '08 · Invoice & AP',
  's-09': '09 · Reporting & Analytics',
  's-ai': 'AI & Tech Deep Dive'
};
