
// src/components/PredictTab/PredictionForm.js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Zap, Shield, Send, Loader2, AlertCircle, CheckCircle, Info, ChevronRight } from 'lucide-react';
import FormSectionNav from './FormSectionNav';
import InputField from './InputField';
import MacroAutoFill from '../MacroAutoFill';
import { Button } from '../common/Button';
import { usePrediction } from '../../context/PredictionContext';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

/**
 * Professional prediction form for financial distress analysis
 * Includes World Bank API integration and backend alignment
 */
const PredictionForm = () => {
    // Form state management
    const [formData, setFormData] = useState({});
    const [activeSection, setActiveSection] = useState('company');
    const [validationErrors, setValidationErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState('');

    // Context hooks
    const { generatePrediction, isLoading: loading } = usePrediction();
    const { addNotification } = useNotifications();
    const { isAuthenticated } = useAuth();

    // African countries list for region determination
    const AFRICAN_COUNTRIES = [
        'Angola', 'Bangladesh', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon',
        'Central African Republic', 'Chad', 'Congo', "Cote d'Ivoire", 'DRC', 'Djibouti', 'Egypt',
        'Equatorial Guinea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea',
        'Lebanon', 'Lesotho', 'Liberia', 'Guineabissau', 'Kenya', 'Madagascar', 'Malawi',
        'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
        'Nigeria', 'Rwanda', 'Senegal', 'Seychelles', 'Sierra Leone', 'South Sudan',
        'Southafrica', 'Sudan', 'Tanzania', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
    ];

    /**
     * Form sections configuration
     */
    const FORM_SECTIONS = useMemo(() => ({
        company: {
            title: 'Company Profile',
            description: 'Basic information about your company',
            fields: ['stra_sector', 'wk14', 'car1', 'country2']
        },
        performance: {
            title: 'Performance & Obstacles',
            description: 'Company performance and key business obstacles',
            fields: ['perf1', 'obst1']
        },
        financial: {
            title: 'Financial Structure',
            description: 'Funding sources and financial arrangements',
            fields: ['fin16', 'fin33', 'Fin_bank', 'Fin_supplier', 'Fin_equity', 'Fin_other']
        },
        leadership: {
            title: 'Leadership & Governance',
            description: 'Management structure and organizational leadership',
            fields: ['Fem_wf', 'Fem_CEO', 'Pvt_Own', 'Con_Own']
        },
        operations: {
            title: 'Business Operations',
            description: 'Operational capabilities and market activities',
            fields: ['Edu', 'Exports', 'Innov', 'Transp']
        },
        macro: {
            title: 'Macroeconomic Data',
            description: 'Economic indicators and market conditions (auto-fill available)',
            fields: ['GDP', 'Credit', 'WSI', 'WUI', 'PRIME']
        },
        environment: {
            title: 'Business Environment',
            description: 'External factors and competitive landscape',
            fields: ['Pol_Inst', 'Infor_Comp']
        }
    }), []);

    /**
     * Field configurations 
     */
    const FIELD_CONFIGS = useMemo(() => ({
        // Company Profile
        stra_sector: {
            label: 'Industry Sector',
            type: 'select',
            placeholder: 'Select your industry sector',
            description: 'The primary industry your company operates in',
            required: true
        },
        wk14: {
            label: 'Years in Operation',
            type: 'number',
            placeholder: 'e.g., 5',
            description: 'How many years has your company been operating?',
            required: true,
            min: 0,
            max: 100,
            step: 1
        },
        car1: {
            label: 'Company Age (Years)',
            type: 'number',
            placeholder: 'e.g., 7',
            description: 'Years since company establishment',
            required: true,
            min: 0,
            max: 100,
            step: 1
        },
        country2: {
            label: 'Country',
            type: 'select',
            placeholder: 'Select your country',
            description: 'Country where your company is primarily based',
            required: true
        },

        // Performance & Obstacles 
        perf1: {
            label: 'Sales Performance (%)',
            type: 'number',
            placeholder: 'e.g., 15',
            description: 'Sales growth compared to last year (can be negative)',
            required: true,
            min: -100,
            max: 1000,
            step: 0.1
        },
        obst1: {
            label: 'Access to Finance Obstacle (%)',
            type: 'number',
            placeholder: 'e.g., 30',
            description: 'How much does access to finance constrain your business (0-100%)',
            required: true,
            min: 0,
            max: 100,
            step: 1
        },

        // Financial Indicators 
        fin16: {
            label: 'Working Capital Financing',
            type: 'select',
            placeholder: 'Select option',
            description: 'Do you need external financing for working capital?',
            required: true,
            options: {
                'No': '0',
                'Yes': '1'
            }
        },
        fin33: {
            label: 'Credit Line Usage',
            type: 'select',
            placeholder: 'Select option',
            description: 'Does your company have and use a credit line?',
            required: true,
            options: {
                'No': '0',
                'Yes': '1'
            }
        },

        // Financial Structure
        Fin_bank: {
            label: 'Bank Financing (%)',
            type: 'number',
            placeholder: 'e.g., 25',
            description: 'Percentage of financing from traditional banks',
            min: 0,
            max: 100,
            step: 0.1
        },
        Fin_supplier: {
            label: 'Supplier Credit (%)',
            type: 'number',
            placeholder: 'e.g., 15',
            description: 'Percentage of financing from supplier credit',
            min: 0,
            max: 100,
            step: 0.1
        },
        Fin_equity: {
            label: 'Equity Financing (%)',
            type: 'number',
            placeholder: 'e.g., 40',
            description: 'Percentage of financing from equity/investors',
            min: 0,
            max: 100,
            step: 0.1
        },
        Fin_other: {
            label: 'Other Financing (%)',
            type: 'number',
            placeholder: 'e.g., 20',
            description: 'Percentage from alternative funding sources',
            min: 0,
            max: 100,
            step: 0.1
        },

        // Leadership & Governance 
        Fem_wf: {
            label: 'Female Workforce (%)',
            type: 'number',
            placeholder: 'e.g., 45',
            description: 'Percentage of female employees in your workforce',
            min: 0,
            max: 100,
            step: 0.1
        },
        Fem_CEO: {
            label: 'Female Top Manager',
            type: 'select',
            placeholder: 'Select option',
            description: 'Is the top manager female?',
            options: {
                'No': '0',
                'Yes': '1'
            }
        },
        Pvt_Own: {
            label: 'Private Ownership (%)',
            type: 'number',
            placeholder: 'e.g., 80',
            description: 'Percentage of private ownership in your company',
            min: 0,
            max: 100,
            step: 0.1
        },
        Con_Own: {
            label: 'Concentrated Ownership (%)',
            type: 'number',
            placeholder: 'e.g., 60',
            description: 'Percentage of ownership held by largest shareholders',
            min: 0,
            max: 100,
            step: 0.1
        },

        // Business Operations 
        Edu: {
            label: 'Workforce Education Obstacle (%)',
            type: 'number',
            placeholder: 'e.g., 20',
            description: 'How much does inadequate workforce education constrain business (0-100%)',
            min: 0,
            max: 100,
            step: 1
        },
        Exports: {
            label: 'Export Sales (%)',
            type: 'number',
            placeholder: 'e.g., 25',
            description: 'Percentage of sales that are exported directly',
            min: 0,
            max: 100,
            step: 0.1
        },
        Innov: {
            label: 'Product Innovation',
            type: 'select',
            placeholder: 'Select option',
            description: 'Has your company introduced new products/services?',
            options: {
                'No': '0',
                'Yes': '1'
            }
        },
        Transp: {
            label: 'Transportation Obstacle (%)',
            type: 'number',
            placeholder: 'e.g., 15',
            description: 'How much does transportation constrain your business (0-100%)',
            min: 0,
            max: 100,
            step: 1
        },

        // Macroeconomic Data (World Bank Auto-fill Available)
        GDP: {
            label: 'GDP Growth Rate (%)',
            type: 'number',
            placeholder: 'e.g., 3.5',
            description: 'Annual GDP growth rate percentage',
            min: -10,
            max: 20,
            step: 0.1,
            canAutoFill: true,
            required: true
        },
        Credit: {
            label: 'Domestic Credit to Private Sector (% of GDP)',
            type: 'number',
            placeholder: 'e.g., 45.0',
            description: 'Credit provided to private sector as percentage of GDP',
            min: 0,
            max: 200,
            step: 0.1,
            canAutoFill: true,
            required: true
        },
        WSI: {
            label: 'World Supply Index (%)',
            type: 'number',
            placeholder: 'e.g., 60.0',
            description: 'Trade volume as percentage of GDP',
            min: 0,
            max: 400,
            step: 0.1,
            canAutoFill: true,
            required: true
        },
        WUI: {
            label: 'World Uncertainty Index (%)',
            type: 'number',
            placeholder: 'e.g., 8.5',
            description: 'Unemployment rate as proxy for economic uncertainty',
            min: 0,
            max: 50,
            step: 0.1,
            canAutoFill: true,
            required: true
        },
        PRIME: {
            label: 'Prime Interest Rate (%)',
            type: 'number',
            placeholder: 'e.g., 5.0',
            description: 'Real interest rate',
            min: -5,
            max: 50,
            step: 0.1,
            canAutoFill: true,
            required: true
        },

        // ROW Region Only Fields 
        MarketCap: {
            label: 'Market Capitalization (% of GDP)',
            type: 'number',
            placeholder: 'e.g., 50.0',
            description: 'Stock market capitalization as percentage of GDP',
            min: 0,
            max: 300,
            step: 0.1,
            canAutoFill: true,
            showForRegion: 'ROW'
        },
        GPR: {
            label: 'Geopolitical Risk (%)',
            type: 'number',
            placeholder: 'e.g., 1.5',
            description: 'Military expenditure as percentage of GDP',
            min: 0,
            max: 15,
            step: 0.1,
            canAutoFill: true,
            showForRegion: 'ROW'
        },
        Size: {
            label: 'Company Size',
            type: 'select',
            placeholder: 'Select company size',
            description: 'Number of full-time employees',
            showForRegion: 'ROW',
            options: {
                'Small (< 20 employees)': '1',
                'Medium (20-99 employees)': '2',
                'Large (100+ employees)': '3'
            }
        },

        // Business Environment
        Pol_Inst: {
            label: 'Political Instability Obstacle (%)',
            type: 'number',
            placeholder: 'e.g., 25',
            description: 'How much does political instability constrain business (0-100%)',
            min: 0,
            max: 100,
            step: 1
        },
        Infor_Comp: {
            label: 'Informal Competition Obstacle (%)',
            type: 'number',
            placeholder: 'e.g., 30',
            description: 'How much do informal competitors constrain business (0-100%)',
            min: 0,
            max: 100,
            step: 1
        }
    }), []);

    /**
     * Get fields for current section based on region
     */
    const getFieldsForRegion = useCallback((sectionKey, country) => {
        const baseFields = FORM_SECTIONS[sectionKey]?.fields || [];

        if (sectionKey === 'macro') {
            // Determine region from country
            const isROW = !AFRICAN_COUNTRIES.includes(country);

            if (isROW) {
                // ROW countries get additional fields
                return [...baseFields, 'MarketCap', 'GPR'];
            }
            return baseFields; // AFR countries get base fields only
        }

        if (sectionKey === 'company' && country) {
            const isROW = !AFRICAN_COUNTRIES.includes(country);
            if (isROW) {
                return [...baseFields, 'Size']; // Add Size field for ROW
            }
        }

        return baseFields;
    }, [FORM_SECTIONS, AFRICAN_COUNTRIES]);

    /**
     * Initialize form with default values
     */
    useEffect(() => {
        const defaultFormData = {};
        Object.keys(FIELD_CONFIGS).forEach(field => {
            defaultFormData[field] = '';
        });
        setFormData(defaultFormData);
    }, [FIELD_CONFIGS]);

    /**
     * Watch for country changes to trigger macro data fetching
     */
    useEffect(() => {
        const country = formData.country2;
        if (country && country !== selectedCountry) {
            setSelectedCountry(country);
        }
    }, [formData.country2, selectedCountry]);

    /**
     * Handle auto-fill from World Bank API
     */
    const handleMacroAutoFill = useCallback((autoFilledData, metadata) => {
        console.log('Auto-filling macro data:', autoFilledData);

        // Update form data with auto-filled values
        setFormData(prevData => ({
            ...prevData,
            ...autoFilledData
        }));

        // Clear any existing errors for auto-filled fields
        const autoFilledFields = Object.keys(autoFilledData);
        setValidationErrors(prev => {
            const updated = { ...prev };
            autoFilledFields.forEach(field => {
                delete updated[field];
            });
            return updated;
        });

        // Show success notification
        if (metadata?.source === 'World Bank API') {
            addNotification(
                `Auto-filled ${Object.keys(autoFilledData).length} macro indicators for ${metadata.country}`,
                'success',
                { title: 'Macro Data Loaded' }
            );
        }
    }, [addNotification]);

    /**
     * Get section order for navigation
     */
    const sectionOrder = Object.keys(FORM_SECTIONS);
    const currentSectionIndex = sectionOrder.indexOf(activeSection);
    const isLastSection = currentSectionIndex === sectionOrder.length - 1;

    /**
     * Navigate to next section
     */
    const goToNextSection = useCallback(() => {
        if (!isLastSection) {
            const nextSection = sectionOrder[currentSectionIndex + 1];
            setActiveSection(nextSection);
        }
    }, [currentSectionIndex, isLastSection, sectionOrder]);

    /**
     * Comprehensive form validation
     */
    const validateForm = useCallback(() => {
        const errors = {};
        let isValid = true;

        // Required fields validation
        const requiredFields = Object.keys(FIELD_CONFIGS).filter(
            field => FIELD_CONFIGS[field].required
        );

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field] === '') {
                errors[field] = 'This field is required';
                isValid = false;
            }
        });

        // Field-specific validation
        Object.keys(FIELD_CONFIGS).forEach(field => {
            const config = FIELD_CONFIGS[field];
            const value = formData[field];

            if (value && value !== '' && config.type === 'number') {
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                    errors[field] = 'Must be a valid number';
                    isValid = false;
                } else {
                    if (config.min !== undefined && numValue < config.min) {
                        errors[field] = `Must be at least ${config.min}`;
                        isValid = false;
                    }
                    if (config.max !== undefined && numValue > config.max) {
                        errors[field] = `Must be at most ${config.max}`;
                        isValid = false;
                    }
                    if (config.step === 1 && !Number.isInteger(numValue)) {
                        errors[field] = 'Must be a whole number';
                        isValid = false;
                    }
                }
            }
        });

        // Business logic validation
        const financingTotal = ['Fin_bank', 'Fin_supplier', 'Fin_equity', 'Fin_other']
            .reduce((sum, field) => sum + (parseFloat(formData[field]) || 0), 0);

        if (financingTotal > 100) {
            ['Fin_bank', 'Fin_supplier', 'Fin_equity', 'Fin_other'].forEach(field => {
                if (formData[field]) {
                    errors[field] = 'Total financing cannot exceed 100%';
                }
            });
            isValid = false;
        }

        setValidationErrors(errors);
        setIsFormValid(isValid && Object.keys(errors).length === 0);
        return isValid;
    }, [formData, FIELD_CONFIGS]);

    /**
     * Validate current section only
     */
    const validateCurrentSection = useCallback(() => {
        const country = formData.country2;
        const currentFields = getFieldsForRegion(activeSection, country);
        const errors = {};
        let isValid = true;

        currentFields.forEach(field => {
            const config = FIELD_CONFIGS[field];
            const value = formData[field];

            // Skip validation for fields not applicable to current region
            if (config?.showForRegion) {
                const isROW = !AFRICAN_COUNTRIES.includes(country);
                const shouldShow = (config.showForRegion === 'ROW' && isROW) ||
                    (config.showForRegion === 'AFR' && !isROW);
                if (!shouldShow) {
                    return; // Skip this field
                }
            }

            // Required field validation
            if (config?.required && (!value || value === '')) {
                errors[field] = 'This field is required';
                isValid = false;
            }

            // Type validation
            if (value && value !== '' && config?.type === 'number') {
                const numValue = parseFloat(value);
                if (isNaN(numValue)) {
                    errors[field] = 'Must be a valid number';
                    isValid = false;
                } else {
                    if (config.min !== undefined && numValue < config.min) {
                        errors[field] = `Must be at least ${config.min}`;
                        isValid = false;
                    }
                    if (config.max !== undefined && numValue > config.max) {
                        errors[field] = `Must be at most ${config.max}`;
                        isValid = false;
                    }
                }
            }
        });

        // Update validation errors for current section
        setValidationErrors(prev => ({
            ...prev,
            ...errors
        }));

        return isValid;
    }, [activeSection, FIELD_CONFIGS, formData, getFieldsForRegion, AFRICAN_COUNTRIES]);

    /**
     * Run validation when form data changes
     */
    useEffect(() => {
        validateForm();
    }, [formData, validateForm]);

    /**
     * Handle input changes with validation
     */
    const handleInputChange = useCallback((name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    }, [validationErrors]);

    /**
     * Handle next/submit button click
     */
    const handleNextOrSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSubmitAttempted(true);

        if (isLastSection) {
            // This is the final section - submit the form
            if (!isAuthenticated) {
                addNotification('Please sign in to generate predictions', 'warning');
                return;
            }

            if (!validateForm()) {
                addNotification('Please correct the errors in the form before submitting', 'error');
                return;
            }

            // Prepare submission data to match backend expectations
            const submissionData = {};

            Object.keys(formData).forEach(key => {
                const value = formData[key];
                if (value !== '' && value !== null && value !== undefined) {
                    let processedValue = value;

                    // Convert to appropriate type
                    if (FIELD_CONFIGS[key]?.type === 'number') {
                        processedValue = parseFloat(value);
                    } else if (FIELD_CONFIGS[key]?.type === 'select') {
                        processedValue = value;
                    }

                    // Handle percentage fields - convert to decimal (0-1) for backend
                    const percentageFields = [
                        'Fin_bank', 'Fin_supplier', 'Fin_equity', 'Fin_other',
                        'Fem_wf', 'Pvt_Own', 'Con_Own', 'Exports'
                    ];

                    if (percentageFields.includes(key) && processedValue > 1) {
                        processedValue = processedValue / 100;
                    }

                    submissionData[key] = processedValue;
                }
            });

            // Determine region for backend processing
            const country = formData.country2;
            const region = AFRICAN_COUNTRIES.includes(country) ? 'AFR' : 'ROW';

            console.log('Submitting data to backend:', {
                data: submissionData,
                region: region,
                country: country
            });

            try {
                await generatePrediction(submissionData, region);
                addNotification('Financial analysis completed successfully!', 'success');
            } catch (error) {
                console.error('Prediction generation failed:', error);
                addNotification(error.message || 'Failed to generate prediction', 'error');
            }
        } else {
            // Validate current section before moving to next
            if (validateCurrentSection()) {
                goToNextSection();
                setSubmitAttempted(false); // Reset for next section
            } else {
                addNotification('Please complete all required fields in this section', 'warning');
            }
        }
    }, [isLastSection, isAuthenticated, validateForm, validateCurrentSection, goToNextSection, formData, generatePrediction, addNotification, FIELD_CONFIGS, AFRICAN_COUNTRIES]);

    /**
     * Reset form to initial state
     */
    const resetForm = useCallback(() => {
        const defaultFormData = {};
        Object.keys(FIELD_CONFIGS).forEach(field => {
            defaultFormData[field] = '';
        });
        setFormData(defaultFormData);
        setValidationErrors({});
        setActiveSection('company');
        setSubmitAttempted(false);
        setSelectedCountry('');
    }, [FIELD_CONFIGS]);

    /**
     * Get current section configuration
     */
    const currentSection = FORM_SECTIONS[activeSection];

    /**
     * Calculate form completion progress
     */
    const formProgress = useMemo(() => {
        const totalFields = Object.keys(FIELD_CONFIGS).length;
        const completedFields = Object.values(formData).filter(value => value !== '' && value !== null).length;
        return Math.round((completedFields / totalFields) * 100);
    }, [formData, FIELD_CONFIGS]);

    /**
     * Render current section fields
     */
    const renderCurrentSectionFields = () => {
        const country = formData.country2;
        const currentFields = getFieldsForRegion(activeSection, country);

        return currentFields.map(fieldName => {
            const config = FIELD_CONFIGS[fieldName];
            if (!config) return null;

            // Check if field should be shown for current region
            if (config.showForRegion && country) {
                const isROW = !AFRICAN_COUNTRIES.includes(country);
                const shouldShow = (config.showForRegion === 'ROW' && isROW) ||
                    (config.showForRegion === 'AFR' && !isROW);
                if (!shouldShow) {
                    return null; // Don't render this field
                }
            }

            return (
                <InputField
                    key={fieldName}
                    name={fieldName}
                    value={formData[fieldName] || ''}
                    onChange={handleInputChange}
                    config={config}
                    error={validationErrors[fieldName]}
                    required={config.required}
                    submitAttempted={submitAttempted}
                />
            );
        }).filter(Boolean); // Remove null entries
    };

    return (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center">
                            <Zap className="h-6 w-6 mr-3" />
                            Financial Risk Assessment
                        </h3>
                        <p className="text-indigo-100 mt-2">
                            Complete the form below for comprehensive financial health analysis
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-white text-sm font-medium mb-1">
                            {formProgress}% Complete
                        </div>
                        <div className="w-24 bg-white/20 rounded-full h-2">
                            <div
                                className="bg-white h-2 rounded-full transition-all duration-300"
                                style={{ width: `${formProgress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Authentication Notice */}
                {!isAuthenticated && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-center">
                            <Shield className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-blue-800">
                                    Sign in to save your predictions
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Create an account to access prediction history and advanced insights
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Navigation */}
                <FormSectionNav
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    sections={FORM_SECTIONS}
                />

                {/* Form Content */}
                <div className="space-y-8">
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Info className="h-4 w-4 mr-2 text-blue-600" />
                            {currentSection.title}
                        </h4>
                        <p className="text-sm text-gray-600">{currentSection.description}</p>
                    </div>

                    {/* Special handling for macro section with auto-fill */}
                    {activeSection === 'macro' && (
                        <MacroAutoFill
                            selectedCountry={selectedCountry}
                            currentFormData={formData}
                            onAutoFill={handleMacroAutoFill}
                            formErrors={validationErrors}
                            className="mb-6"
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {renderCurrentSectionFields()}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="primary"
                            disabled={loading || (!isAuthenticated && isLastSection && submitAttempted)}
                            isLoading={loading}
                            icon={loading ? Loader2 : (isLastSection ? Send : ChevronRight)}
                            className="flex-1 sm:flex-none"
                            onClick={handleNextOrSubmit}
                        >
                            {loading
                                ? 'Analyzing Financial Health...'
                                : isLastSection
                                    ? 'Generate Risk Assessment'
                                    : 'Next Section'
                            }
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={resetForm}
                            disabled={loading}
                        >
                            Reset Form
                        </Button>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-4 text-sm">
                            <span className="flex items-center text-gray-600">
                                Section {currentSectionIndex + 1} of {sectionOrder.length}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className={`flex items-center ${isFormValid ? 'text-green-600' : 'text-orange-600'}`}>
                                {isFormValid ? (
                                    <>
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Ready for analysis
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        Complete required fields
                                    </>
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictionForm;