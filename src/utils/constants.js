/**
 * FinDistress AI - Pipeline-Aligned Configuration Constants
 * Field names and mappings EXACTLY matching the ML pipeline training data
 * Ensures perfect compatibility between frontend input and ML model expectations
 */

// ENVIRONMENT CONFIGURATION

export const APP_CONFIG = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    API_TIMEOUT: 30000,
    APP_NAME: 'FinDistress AI',
    APP_TAGLINE: 'Professional Financial Health Assessment',
    VERSION: '2.0.0',
    MAX_PREDICTIONS_PER_SESSION: 100,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 500,
    TOAST_DURATION: 5000,
};

// FORM SECTIONS - Organized for Business Users (Pipeline Field Names)

export const FORM_SECTIONS = {
    company_profile: {
        title: 'Company Profile',
        description: 'Basic information about your company and operational history',
        businessContext: 'Help us understand your company\'s background and market position',
        // Using EXACT pipeline field names
        fields: ['stra_sector', 'country2', 'year', 'car1', 'wk14'],
        priority: 1,
        required: true,
        icon: 'building-office'
    },

    financial_structure: {
        title: 'Financial Structure',
        description: 'How your company finances its operations and growth',
        businessContext: 'Understanding your financing mix helps assess financial stability',
        // Using EXACT pipeline field names (fin1, fin2, etc.)
        fields: ['fin1', 'fin2', 'fin3', 'fin4', 'fin5'],
        priority: 2,
        required: true,
        icon: 'banknotes'
    },

    ownership_governance: {
        title: 'Ownership & Leadership',
        description: 'Company ownership structure and leadership composition',
        businessContext: 'Ownership patterns and leadership diversity affect governance',
        // Using EXACT pipeline field names (gend2, gend4, car2, etc.)
        fields: ['car2', 'car6', 'car3', 'gend4', 'gend2', 'gend6'],
        priority: 3,
        required: false,
        icon: 'users'
    },

    market_operations: {
        title: 'Market & Operations',
        description: 'Your company\'s market presence and operational capabilities',
        businessContext: 'Market diversification and operational efficiency are key factors',
        // Using EXACT pipeline field names
        fields: ['tr15', 'size2', 'MarketCap', 't10', 'obst9'],
        priority: 4,
        required: false,
        icon: 'globe-americas'
    },

    business_environment: {
        title: 'Business Environment',
        description: 'External factors affecting your business operations',
        businessContext: 'Economic and institutional conditions impact business performance',
        // Using EXACT pipeline field names
        fields: ['GDP', 'Credit', 'PRIME', 'obst11', 'GPR'],
        priority: 5,
        required: false,
        icon: 'chart-bar'
    },

    operational_factors: {
        title: 'Operational Factors',
        description: 'Internal operational metrics and challenge indicators',
        businessContext: 'These factors help assess operational efficiency and constraints',
        // Using EXACT pipeline field names
        fields: ['t2', 'corr4', 'infor1', 'WSI', 'WUI', 'perf1', 'obst1', 'fin16', 'fin33'],
        priority: 6,
        required: false,
        icon: 'cog-6-tooth'
    }
};


// FIELD CONFIGURATIONS 

export const FIELD_CONFIGS = {
    // Company Profile Fields (exact pipeline names)
    stra_sector: {
        label: 'Primary Business Sector',
        type: 'select',
        businessDescription: 'Select the industry that best describes your company\'s main business activity',
        helpText: 'Choose the sector that generates the majority of your revenue',
        options: Object.entries(SECTOR_MAPPINGS).map(([label, value]) => ({ label, value })),
        placeholder: 'Select your business sector...',
        required: true,
        validation: { required: 'Business sector is required for analysis' }
    },

    country2: {
        label: 'Primary Operating Country',
        type: 'text',
        businessDescription: 'Country where your company primarily operates',
        helpText: 'Enter the main country where your business is headquartered',
        placeholder: 'e.g., Nigeria, Kenya, South Africa',
        maxLength: 100,
        required: true,
        example: 'Nigeria',
        validation: { required: 'Operating country is required' }
    },

    year: {
        label: 'Data Reference Year',
        type: 'number',
        businessDescription: 'Year for which you\'re providing financial data',
        helpText: 'Most recent complete year of financial data',
        min: 2020,
        max: new Date().getFullYear(),
        step: 1,
        default: new Date().getFullYear() - 1,
        example: 2023,
        validation: { min: 'Year must be 2020 or later' }
    },

    car1: {
        label: 'Company Age (Years)',
        type: 'number',
        businessDescription: 'How many years since your company was established',
        helpText: 'Years since company incorporation or business registration',
        min: 0,
        max: 100,
        step: 1,
        placeholder: '5',
        required: true,
        suffix: 'years',
        example: 5,
        validation: {
            required: 'Company age is required',
            min: 'Company age must be 0 or greater'
        }
    },

    wk14: {
        label: 'Years in Active Operation',
        type: 'number',
        businessDescription: 'How many years your company has been actively operating',
        helpText: 'Years of actual business operations (may be less than company age)',
        min: 0,
        max: 100,
        step: 1,
        placeholder: '5',
        required: true,
        suffix: 'years',
        example: 5,
        validation: {
            required: 'Years in operation is required',
            min: 'Years in operation must be 0 or greater'
        }
    },

    // Financial Structure Fields (exact pipeline field names: fin1, fin2, etc.)
    fin1: {
        label: 'Internal Financing',
        type: 'percentage',
        businessDescription: 'Percentage of financing from internal sources (retained earnings, cash flow)',
        helpText: 'Self-funding from business operations and accumulated cash reserves',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '25.0',
        suffix: '%',
        example: 25.0,
        businessImpact: 'Higher internal financing indicates strong cash generation'
    },

    fin2: {
        label: 'Bank Financing',
        type: 'percentage',
        businessDescription: 'Percentage of financing from traditional banks and financial institutions',
        helpText: 'Include loans, credit lines, and other traditional banking products',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '30.0',
        suffix: '%',
        example: 30.0,
        businessImpact: 'Bank financing provides structured capital but creates debt obligations'
    },

    fin3: {
        label: 'Supplier Credit',
        type: 'percentage',
        businessDescription: 'Percentage of financing through supplier credit and trade arrangements',
        helpText: 'Payment terms, trade credit, and supplier financing arrangements',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '20.0',
        suffix: '%',
        example: 20.0,
        businessImpact: 'Supplier credit indicates strong vendor relationships'
    },

    fin4: {
        label: 'Equity Investment',
        type: 'percentage',
        businessDescription: 'Percentage of financing from equity investors and shareholders',
        helpText: 'Include angel investors, venture capital, private equity investments',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '40.0',
        suffix: '%',
        example: 40.0,
        businessImpact: 'Equity financing generally indicates lower financial risk'
    },

    fin5: {
        label: 'Other Financing',
        type: 'percentage',
        businessDescription: 'Other financing sources (grants, crowdfunding, alternative lenders)',
        helpText: 'Government grants, crowdfunding, alternative lenders, family funding',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '10.0',
        suffix: '%',
        example: 10.0,
        businessImpact: 'Diverse financing sources improve financial resilience'
    },

    // Ownership & Leadership Fields (exact pipeline names: gend2, gend4, car2, etc.)
    car2: {
        label: 'Private Ownership',
        type: 'percentage',
        businessDescription: 'Percentage of company owned by private individuals/entities',
        helpText: 'Non-public ownership including founders, employees, private investors',
        min: 0,
        max: 100,
        step: 0.01,
        default: 80.0,
        suffix: '%',
        example: 80.0
    },

    car6: {
        label: 'Concentrated Ownership',
        type: 'percentage',
        businessDescription: 'Ownership concentration (major shareholders control)',
        helpText: 'Percentage indicating how concentrated ownership is among few shareholders',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '60.0',
        suffix: '%',
        example: 60.0
    },

    car3: {
        label: 'Foreign Ownership',
        type: 'percentage',
        businessDescription: 'Percentage of company owned by foreign entities',
        helpText: 'Ownership by individuals or companies from outside your operating country',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '5.0',
        suffix: '%',
        example: 5.0
    },

    gend4: {
        label: 'Female CEO',
        type: 'boolean_percentage',
        businessDescription: 'Female representation in CEO/top executive positions',
        helpText: 'Enter 100 if CEO is female, 0 if male',
        min: 0,
        max: 100,
        step: 1,
        placeholder: '0 or 100',
        suffix: '%',
        example: 0.0,
        businessImpact: 'Leadership diversity enhances decision-making'
    },

    gend2: {
        label: 'Female Workforce',
        type: 'percentage',
        businessDescription: 'Percentage of total workforce that is female',
        helpText: 'Include all female employees across all departments and levels',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '45.0',
        suffix: '%',
        example: 25.0,
        businessImpact: 'Workforce diversity often correlates with better outcomes'
    },

    gend6: {
        label: 'Female Ownership',
        type: 'percentage',
        businessDescription: 'Percentage of company ownership held by women',
        helpText: 'Female shareholders and business owners',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '20.0',
        suffix: '%',
        example: 10.0
    },

    // Market & Operations Fields (exact pipeline names: tr15, t10, obst9, etc.)
    tr15: {
        label: 'Export Revenue Share',
        type: 'percentage',
        businessDescription: 'Percentage of revenue from international sales',
        helpText: 'Revenue from customers outside your primary operating country',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '15.0',
        suffix: '%',
        example: 20.0,
        businessImpact: 'Export diversification reduces market concentration risk'
    },

    size2: {
        label: 'Company Size',
        type: 'number',
        businessDescription: 'Company size metric (employees or revenue scale)',
        helpText: 'Relative size indicator for your company in the market',
        min: 0,
        max: 1000,
        step: 1,
        placeholder: '50',
        example: 50,
        businessImpact: 'Larger companies often have more operational stability'
    },

    MarketCap: {
        label: 'Market Capitalization',
        type: 'percentage',
        businessDescription: 'Market valuation as percentage of sector average',
        helpText: 'Your company\'s market value relative to industry benchmarks',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '10.0',
        suffix: '%',
        example: 10.0,
        businessImpact: 'Higher market valuation indicates investor confidence'
    },

    t10: {
        label: 'Innovation Investment',
        type: 'percentage',
        businessDescription: 'Investment in research, development, and innovation',
        helpText: 'R&D spending, technology investments, new product development',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '10.0',
        suffix: '% of revenue',
        example: 10.0,
        businessImpact: 'Innovation investment drives long-term competitiveness'
    },

    obst9: {
        label: 'Education & Skills',
        type: 'percentage',
        businessDescription: 'Education level obstacle (0 = no obstacle, 100 = major obstacle)',
        helpText: 'How much does workforce education/skills limit your business growth',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '15.0',
        suffix: '% obstacle',
        example: 60.0,
        businessImpact: 'Lower education obstacles indicate better workforce capabilities'
    },

    // Business Environment Fields (exact pipeline names)
    GDP: {
        label: 'GDP Growth Rate',
        type: 'percentage',
        businessDescription: 'GDP growth rate in your primary operating market',
        helpText: 'Economic growth rate where your business primarily operates',
        min: -20,
        max: 20,
        step: 0.01,
        placeholder: '3.5',
        suffix: '%',
        example: 3.5,
        businessImpact: 'Positive GDP growth creates favorable business conditions'
    },

    Credit: {
        label: 'Credit Availability',
        type: 'percentage',
        businessDescription: 'Credit market accessibility in your operating region',
        helpText: 'How easily businesses can access credit and loans in your market',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '70.0',
        suffix: '%',
        example: 70.0,
        businessImpact: 'Better credit access provides financial flexibility'
    },

    PRIME: {
        label: 'Prime Interest Rate',
        type: 'percentage',
        businessDescription: 'Prime lending rate in your operating market',
        helpText: 'The base interest rate for business loans in your country',
        min: 0,
        max: 50,
        step: 0.01,
        placeholder: '5.0',
        suffix: '%',
        example: 5.0,
        businessImpact: 'Lower interest rates reduce financing costs'
    },

    obst11: {
        label: 'Political Instability',
        type: 'percentage',
        businessDescription: 'Political instability obstacle level',
        helpText: 'How much does political instability affect your business (0 = none, 100 = severe)',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '10.0',
        suffix: '% obstacle',
        example: 5.0,
        businessImpact: 'Lower political instability indicates more stable operating environment'
    },

    GPR: {
        label: 'Geopolitical Risk',
        type: 'percentage',
        businessDescription: 'Geopolitical risk exposure level',
        helpText: 'How much geopolitical events and tensions affect your business',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '15.0',
        suffix: '%',
        example: 0.1,
        businessImpact: 'Lower geopolitical risk indicates more predictable operating conditions'
    },

    // Operational Factors (exact pipeline names: t2, corr4, infor1, etc.)
    t2: {
        label: 'Transportation Obstacles',
        type: 'percentage',
        businessDescription: 'Transportation and logistics obstacle level',
        helpText: 'How much do transport/logistics issues limit your business (0 = none, 100 = severe)',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '20.0',
        suffix: '% obstacle',
        example: 15.0,
        businessImpact: 'Lower transport obstacles indicate better operational efficiency'
    },

    corr4: {
        label: 'Informal Payments',
        type: 'percentage',
        businessDescription: 'Informal payments/corruption level in business environment',
        helpText: 'Extent of informal payments required for business operations',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '5.0',
        suffix: '%',
        example: 0.0,
        businessImpact: 'Lower corruption levels indicate better governance environment'
    },

    infor1: {
        label: 'Informal Competition',
        type: 'percentage',
        businessDescription: 'Informal sector competition level',
        helpText: 'How much does competition from informal businesses affect you',
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: '30.0',
        suffix: '%',
        example: 90.0,
        businessImpact: 'Higher formal competition indicates more structured market'
    },

    WSI: {
        label: 'World Strength Index',
        type: 'number',
        businessDescription: 'Global economic strength indicator',
        helpText: 'World economic stability and strength measure',
        min: 0,
        max: 1,
        step: 0.01,
        placeholder: '0.8',
        example: 0.8,
        businessImpact: 'Higher values indicate stronger global economic conditions'
    },

    WUI: {
        label: 'World Uncertainty Index',
        type: 'number',
        businessDescription: 'Global uncertainty measure',
        helpText: 'World economic uncertainty and volatility indicator',
        min: 0,
        max: 1,
        step: 0.01,
        placeholder: '0.2',
        example: 0.2,
        businessImpact: 'Lower values indicate less global economic uncertainty'
    },

    // Additional Pipeline Fields
    perf1: {
        label: 'Performance Indicator',
        type: 'number',
        businessDescription: 'Overall business performance metric',
        helpText: 'General performance indicator for your business',
        min: -100,
        max: 100,
        step: 0.01,
        placeholder: '10.0',
        example: 5.0
    },

    obst1: {
        label: 'Main Business Obstacle',
        type: 'number',
        businessDescription: 'Severity of main business obstacle',
        helpText: 'Rate the severity of your main business challenge (0-100)',
        min: 0,
        max: 100,
        step: 1,
        placeholder: '20',
        example: 10
    },

    fin16: {
        label: 'Credit Access Issue',
        type: 'select',
        businessDescription: 'Do you have credit access issues?',
        helpText: 'Whether your company faces difficulties accessing credit',
        options: [
            { label: 'No credit access issues', value: 0 },
            { label: 'Has credit access issues', value: 1 }
        ],
        example: 0
    },

    fin33: {
        label: 'Financial Distress Flag',
        type: 'select',
        businessDescription: 'Current financial distress indicator',
        helpText: 'Whether your company is currently experiencing financial difficulties',
        options: [
            { label: 'No current financial distress', value: 0 },
            { label: 'Currently in financial distress', value: 1 }
        ],
        example: 0
    }
};


// SECTOR MAPPINGS - EXACT from Pipeline


export const SECTOR_MAPPINGS = {
    'Construction': '1', 'Retail': '2', 'Manufacturing': '3', 'Other Services': '4',
    'Other Manufacturing': '5', 'Food': '6', 'Garments': '7', 'Hotels': '8',
    'Services': '9', 'Rest of Universe': '10', 'IT & IT Services': '11', 'Textiles': '12',
    'Machinery & Equipment': '13', 'Textiles & Garments': '14',
    'Basic Metals/Fabricated Metals/Machinery & Equip.': '15',
    'Chemicals, Plastics & Rubber': '16', 'Chemicals & Chemical Products': '17',
    'Machinery & Equipment & Electronics': '18', 'Leather Products': '19',
    'Furniture': '20', 'Motor Vehicles & Transport Equip.': '21',
    'Fabricated Metal Products': '22', 'Hospitality & Tourism': '23',
    'Motor Vehicles': '24', 'Electronics': '25', 'Services of Motor Vehicles/Wholesale/Retail': '26',
    'Food/Leather/Wood/Tobacco/Rubber Products': '27', 'Professional Activities': '28',
    'Non-Metallic Mineral Products': '29', 'Hotels & Restaurants': '30',
    'Electronics & Communications Equip.': '31', 'Transport, Storage, & Communications': '32',
    'Services of Motor Vehicles': '33', 'Rubber & Plastics Products': '34',
    'Basic Metals & Metal Products': '35', 'Wholesale': '36', 'Basic Metals': '37',
    'Electrical & Computer Products': '38', 'Minerals, Metals, Machinery & Equipment': '39',
    'Wood Products': '40', 'Printing & Publishing': '41', 'Petroleum products, Plastics & Rubber': '42',
    'Wood products, Furniture, Paper & Publishing': '43',
    'Machinery & Equipment, Electronics & Vehicles': '44', 'Transport': '45',
    'Textiles, Garments & Leather': '46', 'Restaurants': '47',
    'Wholesale, Including of Motor Vehicles': '48', 'Publishing, Telecommunications & IT': '49',
    'Wholesale & Retail': '50', 'Mining Related Manufacturing': '51',
    'Pharmaceuticals & Medical Products': '52', 'Wood Products & Furniture': '53',
    'Computer, Electronic & Optical Products': '54', 'Retail & IT': '55',
    'Metals, Machinery, Computers & Electronics': '56', 'Manufacturing Panel': '57',
    'Retail Panel': '58', 'Other Services Panel': '59',
    'Chemicals, Non-Metallic Mineral, Plastics & Rubber': '60',
    'Textiles, Garments, Leather & Paper': '61', 'Pharmaceutical, Chemicals & Chemical Products': '62',
    'Wholesale of Agri Inputs & Equipment': '63'
};


// REGIONS - EXACT from Pipeline


export const REGIONS = [
    { value: 'AFR', label: 'African Markets' },
    { value: 'ROW', label: 'Rest of World' },
];


// DEFAULT VALUES - Using Pipeline Field Names


export const DEFAULT_FORM_DATA = {
    // Company Profile
    region: 'ROW',
    stra_sector: '3', // Manufacturing
    country2: 'Nigeria',
    year: 2023,
    car1: 5,
    wk14: 5,

    // Financial Structure (pipeline field names: fin1, fin2, etc.)
    fin1: 25.0,    // Internal financing
    fin2: 30.0,    // Bank financing  
    fin3: 20.0,    // Supplier financing
    fin4: 40.0,    // Equity financing
    fin5: 10.0,    // Other financing

    // Ownership (pipeline field names: car2, car6, etc.)
    car2: 80.0,    // Private ownership
    car6: 0.0,     // Concentrated ownership
    car3: 5.0,     // Foreign ownership
    gend4: 0.0,    // Female CEO
    gend2: 25.0,   // Female workforce
    gend6: 10.0,   // Female ownership

    // Market & Operations (pipeline field names: tr15, t10, etc.)
    tr15: 20.0,    // Exports
    size2: 50,     // Company size
    MarketCap: 10.0,
    t10: 10.0,     // Innovation
    obst9: 60.0,   // Education

    // Business Environment
    GDP: 3.5,
    Credit: 70.0,
    PRIME: 5.0,
    obst11: 5.0,   // Political instability
    GPR: 0.1,

    // Operational Factors (pipeline field names: t2, corr4, etc.)
    t2: 15.0,      // Transportation
    corr4: 0.0,    // Informal payments
    infor1: 90.0,  // Informal competition
    WSI: 0.8,
    WUI: 0.2,

    // Additional Pipeline Fields
    perf1: 5.0,
    obst1: 10,
    fin16: 0,
    fin33: 0
};


// REQUIRED FIELDS - Minimum needed for prediction


export const REQUIRED_FIELDS = ['stra_sector', 'wk14', 'car1'];


// VALIDATION RULES

export const VALIDATION_RULES = {
    PERCENTAGE_FIELDS: [
        'fin1', 'fin2', 'fin3', 'fin4', 'fin5',  // Financial structure
        'car2', 'car6', 'car3', 'gend2', 'gend4', 'gend6',  // Ownership
        'tr15', 'MarketCap', 't10', 'obst9',  // Operations
        'GDP', 'Credit', 'PRIME', 'obst11', 'GPR',  // Environment
        't2', 'corr4', 'infor1'  // Operational factors
    ],

    BUSINESS_LOGIC_RULES: {
        company_age_check: {
            rule: 'car1 >= wk14',
            error: 'Company age should be greater than or equal to years in operation'
        },

        financing_sum_check: {
            fields: ['fin1', 'fin2', 'fin3', 'fin4', 'fin5'],
            rule: 'sum_should_be_reasonable',
            threshold: 120,
            warning: 'Total financing sources exceed 100% - please verify'
        }
    }
};

// UI CONFIGURATION

export const UI_CONFIG = {
    RISK_COLORS: {
        'Low': '#10B981',
        'Medium': '#F59E0B',
        'High': '#EF4444',
        'Very High': '#DC2626'
    },

    CHART_COLORS: {
        primary: ['#4F46E5', '#7C3AED', '#EC4899', '#EF4444', '#F59E0B', '#10B981']
    }
};

// API ENDPOINTS

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
        REFRESH: '/token/refresh',
        PROFILE: '/users/me'
    },

    PREDICTIONS: {
        PREDICT: '/predict',
        HISTORY: '/predictions/history',
        DELETE: (id) => `/predictions/${id}`,
        CLEAR: '/predictions/clear'
    },

    ANALYTICS: {
        DASHBOARD: '/dashboard'
    }
};

export default {
    APP_CONFIG,
    FORM_SECTIONS,
    FIELD_CONFIGS,
    SECTOR_MAPPINGS,
    REGIONS,
    DEFAULT_FORM_DATA,
    REQUIRED_FIELDS,
    VALIDATION_RULES,
    UI_CONFIG,
    API_ENDPOINTS
};