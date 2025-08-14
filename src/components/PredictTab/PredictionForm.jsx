// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { Zap, Shield, Send, Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';
// import FormSectionNav from './FormSectionNav';
// import InputField from './InputField';
// import { Button } from '../common/Button';
// import { usePrediction } from '../../context/PredictionContext';
// import { useNotifications } from '../../context/NotificationContext';
// import { useAuth } from '../../context/AuthContext';

// /**
//  * Professional prediction form for financial distress analysis
//  * Provides intuitive interface for business users to input company data
//  */
// const PredictionForm = () => {
//     // Form state management
//     const [formData, setFormData] = useState({});
//     const [activeSection, setActiveSection] = useState('company');
//     const [validationErrors, setValidationErrors] = useState({});
//     const [isFormValid, setIsFormValid] = useState(false);
//     const [submitAttempted, setSubmitAttempted] = useState(false);

//     // Context hooks
//     const { generatePrediction, isLoading: loading } = usePrediction();
//     const { addNotification } = useNotifications();
//     const { isAuthenticated } = useAuth();

//     /**
//      * Form sections configuration aligned with backend expectations
//      */
//     const FORM_SECTIONS = useMemo(() => ({
//         company: {
//             title: 'Company Profile',
//             description: 'Basic information about your company',
//             icon: 'building',
//             fields: ['stra_sector', 'wk14', 'car1', 'country2']
//         },
//         financial: {
//             title: 'Financial Structure',
//             description: 'Funding sources and financial arrangements',
//             icon: 'dollar',
//             fields: ['Fin_bank', 'Fin_supplier', 'Fin_equity', 'Fin_other', 'Credit']
//         },
//         leadership: {
//             title: 'Leadership & Governance',
//             description: 'Management structure and organizational leadership',
//             icon: 'users',
//             fields: ['Fem_wf', 'Fem_CEO', 'Pvt_Own', 'Con_Own']
//         },
//         operations: {
//             title: 'Business Operations',
//             description: 'Operational capabilities and market activities',
//             icon: 'briefcase',
//             fields: ['Edu', 'Exports', 'Innov', 'Transp']
//         },
//         environment: {
//             title: 'Business Environment',
//             description: 'External factors and market conditions',
//             icon: 'globe',
//             fields: ['GDP', 'Pol_Inst', 'Infor_Comp', 'WSI', 'WUI', 'PRIME']
//         }
//     }), []);

//     /**
//      * Field configurations with business-friendly labels and validation
//      */
//     const FIELD_CONFIGS = useMemo(() => ({
//         // Company Profile
//         stra_sector: {
//             label: 'Industry Sector',
//             type: 'select',
//             placeholder: 'Select your industry sector',
//             description: 'The primary industry your company operates in',
//             required: true,
//             options: {
//                 'Construction': 'Construction',
//                 'Retail': 'Retail',
//                 'Manufacturing': 'Manufacturing',
//                 'Other Services': 'Other Services',
//                 'Food': 'Food & Beverage',
//                 'IT & IT Services': 'Information Technology',
//                 'Hotels & Restaurants': 'Hospitality',
//                 'Transport': 'Transportation',
//                 'Healthcare': 'Healthcare',
//                 'Education': 'Education'
//             }
//         },
//         wk14: {
//             label: 'Years in Operation',
//             type: 'number',
//             placeholder: 'e.g., 5',
//             description: 'How many years has your company been operating?',
//             required: true,
//             min: 0,
//             max: 100,
//             step: 1
//         },
//         car1: {
//             label: 'Company Age (Years)',
//             type: 'number',
//             placeholder: 'e.g., 7',
//             description: 'Years since company establishment',
//             required: true,
//             min: 0,
//             max: 100,
//             step: 1
//         },
//         country2: {
//             label: 'Country',
//             type: 'select',
//             placeholder: 'Select your country',
//             description: 'Country where your company is primarily based',
//             options: {
//                 'Kenya': 'Kenya',
//                 'Nigeria': 'Nigeria',
//                 'South Africa': 'South Africa',
//                 'Ghana': 'Ghana',
//                 'Egypt': 'Egypt',
//                 'Other': 'Other'
//             }
//         },
//         // Financial Structure
//         Fin_bank: {
//             label: 'Bank Financing (%)',
//             type: 'number',
//             placeholder: 'e.g., 25',
//             description: 'Percentage of financing from traditional banks',
//             min: 0,
//             max: 100,
//             step: 0.1
//         },
//         Fin_supplier: {
//             label: 'Supplier Credit (%)',
//             type: 'number',
//             placeholder: 'e.g., 15',
//             description: 'Percentage of financing from supplier credit',
//             min: 0,
//             max: 100,
//             step: 0.1
//         },
//         Fin_equity: {
//             label: 'Equity Financing (%)',
//             type: 'number',
//             placeholder: 'e.g., 40',
//             description: 'Percentage of financing from equity/investors',
//             min: 0,
//             max: 100,
//             step: 0.1
//         },
//         Fin_other: {
//             label: 'Other Financing (%)',
//             type: 'number',
//             placeholder: 'e.g., 20',
//             description: 'Percentage from alternative funding sources',
//             min: 0,
//             max: 100,
//             step: 0.1
//         },
//         Credit: {
//             label: 'Credit Access Score',
//             type: 'number',
//             placeholder: 'e.g., 0.7',
//             description: 'Your assessment of credit market accessibility (0-1 scale)',
//             min: 0,
//             max: 1,
//             step: 0.01
//         },
//         // Leadership & Governance
//         Fem_wf: {
//             label: 'Female Workforce (%)',
//             type: 'number',
//             placeholder: 'e.g., 45',
//             description: 'Percentage of female employees in your workforce',
//             min: 0,
//             max: 100,
//             step: 0.1
//         },
//         Fem_CEO: {
//             label: 'Female Leadership (%)',
//             type: 'number',
//             placeholder: 'e.g., 30',
//             description: 'Percentage of female representation in leadership',
//             min: 0,
//             max: 100,
//             step: 0.1
//         },
//         Pvt_Own: {
//             label: 'Private Ownership (%)',
//             type: 'number',
//             placeholder: 'e.g., 80',
//             description: 'Percentage of private ownership in your company',
//             min: 0,
//             max: 100,
//             step: 0.1
//         },
//         Con_Own: {
//             label: 'Concentrated Ownership (%)',
//             type: 'number',
//             placeholder: 'e.g., 60',
//             description: 'Percentage of ownership held by largest shareholders',
//             min: 0,
//             max: 100,
//             step: 0.1
//         },
//         // Business Operations
//         Edu: {
//             label: 'Workforce Education Level',
//             type: 'number',
//             placeholder: 'e.g., 0.8',
//             description: 'Assessment of overall workforce education (0-1 scale)',
//             min: 0,
//             max: 1,
//             step: 0.01
//         },
//         Exports: {
//             label: 'Export Revenue (%)',
//             type: 'number',
//             placeholder: 'e.g., 25',
//             description: 'Percentage of revenue from international sales',
//             min: 0,
//             max: 100,
//             step: 0.1
//         },
//         Innov: {
//             label: 'Innovation Investment (%)',
//             type: 'number',
//             placeholder: 'e.g., 5',
//             description: 'Percentage of revenue invested in R&D/innovation',
//             min: 0,
//             max: 100,
//             step: 0.1
//         },
//         Transp: {
//             label: 'Transportation Access Score',
//             type: 'number',
//             placeholder: 'e.g., 0.75',
//             description: 'Assessment of transportation/logistics access (0-1 scale)',
//             min: 0,
//             max: 1,
//             step: 0.01
//         },
//         // Business Environment
//         GDP: {
//             label: 'Regional GDP Growth (%)',
//             type: 'number',
//             placeholder: 'e.g., 3.5',
//             description: 'Regional economic growth rate assessment',
//             min: -10,
//             max: 20,
//             step: 0.1
//         },
//         Pol_Inst: {
//             label: 'Political Stability Score',
//             type: 'number',
//             placeholder: 'e.g., 0.7',
//             description: 'Assessment of political and institutional stability (0-1 scale)',
//             min: 0,
//             max: 1,
//             step: 0.01
//         },
//         Infor_Comp: {
//             label: 'Information Access Score',
//             type: 'number',
//             placeholder: 'e.g., 0.8',
//             description: 'Assessment of information and competitive environment (0-1 scale)',
//             min: 0,
//             max: 1,
//             step: 0.01
//         },
//         WSI: {
//             label: 'Economic Strength Index',
//             type: 'number',
//             placeholder: 'e.g., 0.65',
//             description: 'World economic strength indicators (0-1 scale)',
//             min: 0,
//             max: 1,
//             step: 0.01
//         },
//         WUI: {
//             label: 'Economic Uncertainty Index',
//             type: 'number',
//             placeholder: 'e.g., 0.3',
//             description: 'World economic uncertainty measures (0-1 scale)',
//             min: 0,
//             max: 1,
//             step: 0.01
//         },
//         PRIME: {
//             label: 'Interest Rate Environment (%)',
//             type: 'number',
//             placeholder: 'e.g., 5.5',
//             description: 'Current interest rate environment assessment',
//             min: 0,
//             max: 50,
//             step: 0.1
//         }
//     }), []);

//     /**
//      * Initialize form with default values
//      */
//     useEffect(() => {
//         const defaultFormData = {};
//         Object.keys(FIELD_CONFIGS).forEach(field => {
//             defaultFormData[field] = '';
//         });
//         setFormData(defaultFormData);
//     }, [FIELD_CONFIGS]);

//     /**
//      * Comprehensive form validation
//      */
//     const validateForm = useCallback(() => {
//         const errors = {};
//         let isValid = true;

//         // Required fields validation
//         const requiredFields = Object.keys(FIELD_CONFIGS).filter(
//             field => FIELD_CONFIGS[field].required
//         );

//         requiredFields.forEach(field => {
//             if (!formData[field] || formData[field] === '') {
//                 errors[field] = 'This field is required';
//                 isValid = false;
//             }
//         });

//         // Field-specific validation
//         Object.keys(FIELD_CONFIGS).forEach(field => {
//             const config = FIELD_CONFIGS[field];
//             const value = formData[field];

//             if (value && value !== '' && config.type === 'number') {
//                 const numValue = parseFloat(value);
//                 if (isNaN(numValue)) {
//                     errors[field] = 'Must be a valid number';
//                     isValid = false;
//                 } else {
//                     if (config.min !== undefined && numValue < config.min) {
//                         errors[field] = `Must be at least ${config.min}`;
//                         isValid = false;
//                     }
//                     if (config.max !== undefined && numValue > config.max) {
//                         errors[field] = `Must be at most ${config.max}`;
//                         isValid = false;
//                     }
//                     if (config.step === 1 && !Number.isInteger(numValue)) {
//                         errors[field] = 'Must be a whole number';
//                         isValid = false;
//                     }
//                 }
//             }
//         });

//         // Business logic validation
//         const financingTotal = ['Fin_bank', 'Fin_supplier', 'Fin_equity', 'Fin_other']
//             .reduce((sum, field) => sum + (parseFloat(formData[field]) || 0), 0);

//         if (financingTotal > 100) {
//             ['Fin_bank', 'Fin_supplier', 'Fin_equity', 'Fin_other'].forEach(field => {
//                 if (formData[field]) {
//                     errors[field] = 'Total financing cannot exceed 100%';
//                 }
//             });
//             isValid = false;
//         }

//         setValidationErrors(errors);
//         setIsFormValid(isValid && Object.keys(errors).length === 0);
//         return isValid;
//     }, [formData, FIELD_CONFIGS]);

//     /**
//      * Run validation when form data changes
//      */
//     useEffect(() => {
//         validateForm();
//     }, [formData, validateForm]);

//     /**
//      * Handle input changes with validation
//      */
//     const handleInputChange = useCallback((name, value) => {
//         setFormData(prev => ({ ...prev, [name]: value }));
//         if (validationErrors[name]) {
//             setValidationErrors(prev => {
//                 const updated = { ...prev };
//                 delete updated[name];
//                 return updated;
//             });
//         }
//     }, [validationErrors]);

//     /**
//      * Handle form submission
//      */
//     const handleSubmit = useCallback(async (e) => {
//         e.preventDefault();
//         setSubmitAttempted(true);

//         if (!isAuthenticated) {
//             addNotification('Please sign in to generate predictions', 'warning');
//             return;
//         }

//         if (!validateForm()) {
//             addNotification('Please correct the errors in the form before submitting', 'error');
//             return;
//         }

//         // Prepare submission data
//         const submissionData = {};
//         Object.keys(formData).forEach(key => {
//             const value = formData[key];
//             if (value !== '' && value !== null && value !== undefined) {
//                 submissionData[key] = FIELD_CONFIGS[key]?.type === 'number' ? parseFloat(value) : value;
//             }
//         });

//         try {
//             await generatePrediction(submissionData, formData.country2 || 'AFR');
//             addNotification('Financial analysis completed successfully!', 'success');
//         } catch (error) {
//             console.error('Prediction generation failed:', error);
//             addNotification(error.message || 'Failed to generate prediction', 'error');
//         }
//     }, [isAuthenticated, formData, validateForm, generatePrediction, addNotification, FIELD_CONFIGS]);

//     /**
//      * Reset form to initial state
//      */
//     const resetForm = useCallback(() => {
//         const defaultFormData = {};
//         Object.keys(FIELD_CONFIGS).forEach(field => {
//             defaultFormData[field] = '';
//         });
//         setFormData(defaultFormData);
//         setValidationErrors({});
//         setActiveSection('company');
//         setSubmitAttempted(false);
//     }, [FIELD_CONFIGS]);

//     /**
//      * Get current section configuration
//      */
//     const currentSection = FORM_SECTIONS[activeSection];

//     /**
//      * Calculate form completion progress
//      */
//     const formProgress = useMemo(() => {
//         const totalFields = Object.keys(FIELD_CONFIGS).length;
//         const completedFields = Object.values(formData).filter(value => value !== '' && value !== null).length;
//         return Math.round((completedFields / totalFields) * 100);
//     }, [formData, FIELD_CONFIGS]);

//     return (
//         <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
//                 <div className="flex items-center justify-between">
//                     <div>
//                         <h3 className="text-2xl font-bold text-white flex items-center">
//                             <Zap className="h-6 w-6 mr-3" />
//                             Financial Risk Assessment
//                         </h3>
//                         <p className="text-indigo-100 mt-2">
//                             Complete the form below for comprehensive financial health analysis
//                         </p>
//                     </div>
//                     <div className="text-right">
//                         <div className="text-white text-sm font-medium mb-1">
//                             {formProgress}% Complete
//                         </div>
//                         <div className="w-24 bg-white/20 rounded-full h-2">
//                             <div
//                                 className="bg-white h-2 rounded-full transition-all duration-300"
//                                 style={{ width: `${formProgress}%` }}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="p-8">
//                 {/* Authentication Notice */}
//                 {!isAuthenticated && (
//                     <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
//                         <div className="flex items-center">
//                             <Shield className="h-5 w-5 text-blue-600 mr-3" />
//                             <div>
//                                 <p className="text-sm font-medium text-blue-800">
//                                     Sign in to save your predictions
//                                 </p>
//                                 <p className="text-xs text-blue-600 mt-1">
//                                     Create an account to access prediction history and advanced insights
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Section Navigation */}
//                 <FormSectionNav
//                     activeSection={activeSection}
//                     setActiveSection={setActiveSection}
//                     sections={FORM_SECTIONS}
//                 />

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-8">
//                     <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
//                         <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
//                             <Info className="h-4 w-4 mr-2 text-blue-600" />
//                             {currentSection.title}
//                         </h4>
//                         <p className="text-sm text-gray-600">{currentSection.description}</p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {currentSection.fields.map(fieldName => {
//                             const config = FIELD_CONFIGS[fieldName];
//                             if (!config) return null;

//                             return (
//                                 <InputField
//                                     key={fieldName}
//                                     name={fieldName}
//                                     value={formData[fieldName] || ''}
//                                     onChange={handleInputChange}
//                                     config={config}
//                                     error={validationErrors[fieldName]}
//                                     required={config.required}
//                                 />
//                             );
//                         })}
//                     </div>

//                     <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
//                         <Button
//                             type="submit"
//                             variant="primary"
//                             disabled={loading || (!isAuthenticated && submitAttempted)}
//                             isLoading={loading}
//                             icon={loading ? Loader2 : Send}
//                             className="flex-1 sm:flex-none"
//                         >
//                             {loading ? 'Analyzing Financial Health...' : 'Generate Risk Assessment'}
//                         </Button>
//                         <Button
//                             type="button"
//                             variant="secondary"
//                             onClick={resetForm}
//                             disabled={loading}
//                         >
//                             Reset Form
//                         </Button>
//                     </div>

//                     <div className="text-center">
//                         <div className="flex items-center justify-center space-x-4 text-sm">
//                             <span className="flex items-center text-gray-600">
//                                 Section {Object.keys(FORM_SECTIONS).indexOf(activeSection) + 1} of {Object.keys(FORM_SECTIONS).length}
//                             </span>
//                             <span className="text-gray-400">•</span>
//                             <span className={`flex items-center ${isFormValid ? 'text-green-600' : 'text-orange-600'}`}>
//                                 {isFormValid ? (
//                                     <>
//                                         <CheckCircle className="h-4 w-4 mr-1" />
//                                         Ready for analysis
//                                     </>
//                                 ) : (
//                                     <>
//                                         <AlertCircle className="h-4 w-4 mr-1" />
//                                         Complete required fields
//                                     </>
//                                 )}
//                             </span>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default PredictionForm;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Zap, Shield, Send, Loader2, AlertCircle, CheckCircle, Info, ChevronRight } from 'lucide-react';
import FormSectionNav from './FormSectionNav';
import InputField from './InputField';
import { Button } from '../common/Button';
import { usePrediction } from '../../context/PredictionContext';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

/**
 * Professional prediction form for financial distress analysis
 * Provides intuitive interface for business users to input company data
 */
const PredictionForm = () => {
    // Form state management
    const [formData, setFormData] = useState({});
    const [activeSection, setActiveSection] = useState('company');
    const [validationErrors, setValidationErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    // Context hooks
    const { generatePrediction, isLoading: loading } = usePrediction();
    const { addNotification } = useNotifications();
    const { isAuthenticated } = useAuth();

    /**
     * Form sections configuration aligned with backend expectations
     */
    const FORM_SECTIONS = useMemo(() => ({
        company: {
            title: 'Company Profile',
            description: 'Basic information about your company',
            icon: 'building',
            fields: ['stra_sector', 'wk14', 'car1', 'country2']
        },
        financial: {
            title: 'Financial Structure',
            description: 'Funding sources and financial arrangements',
            icon: 'dollar',
            fields: ['Fin_bank', 'Fin_supplier', 'Fin_equity', 'Fin_other', 'Credit']
        },
        leadership: {
            title: 'Leadership & Governance',
            description: 'Management structure and organizational leadership',
            icon: 'users',
            fields: ['Fem_wf', 'Fem_CEO', 'Pvt_Own', 'Con_Own']
        },
        operations: {
            title: 'Business Operations',
            description: 'Operational capabilities and market activities',
            icon: 'briefcase',
            fields: ['Edu', 'Exports', 'Innov', 'Transp']
        },
        environment: {
            title: 'Business Environment',
            description: 'External factors and market conditions',
            icon: 'globe',
            fields: ['GDP', 'Pol_Inst', 'Infor_Comp', 'WSI', 'WUI', 'PRIME']
        }
    }), []);

    /**
     * Field configurations with business-friendly labels and validation
     */
    const FIELD_CONFIGS = useMemo(() => ({
        // Company Profile
        stra_sector: {
            label: 'Industry Sector',
            type: 'select',
            placeholder: 'Select your industry sector',
            description: 'The primary industry your company operates in',
            required: true,
            options: {
                'Construction': 'Construction',
                'Retail': 'Retail',
                'Manufacturing': 'Manufacturing',
                'Other Services': 'Other Services',
                'Food': 'Food & Beverage',
                'IT & IT Services': 'Information Technology',
                'Hotels & Restaurants': 'Hospitality',
                'Transport': 'Transportation',
                'Healthcare': 'Healthcare',
                'Education': 'Education'
            }
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
            options: {
                'Kenya': 'Kenya',
                'Nigeria': 'Nigeria',
                'South Africa': 'South Africa',
                'Ghana': 'Ghana',
                'Egypt': 'Egypt',
                'Other': 'Other'
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
        Credit: {
            label: 'Credit Access Score',
            type: 'number',
            placeholder: 'e.g., 0.7',
            description: 'Your assessment of credit market accessibility (0-1 scale)',
            min: 0,
            max: 1,
            step: 0.01
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
            label: 'Female Leadership (%)',
            type: 'number',
            placeholder: 'e.g., 30',
            description: 'Percentage of female representation in leadership',
            min: 0,
            max: 100,
            step: 0.1
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
            label: 'Workforce Education Level',
            type: 'number',
            placeholder: 'e.g., 0.8',
            description: 'Assessment of overall workforce education (0-1 scale)',
            min: 0,
            max: 1,
            step: 0.01
        },
        Exports: {
            label: 'Export Revenue (%)',
            type: 'number',
            placeholder: 'e.g., 25',
            description: 'Percentage of revenue from international sales',
            min: 0,
            max: 100,
            step: 0.1
        },
        Innov: {
            label: 'Innovation Investment (%)',
            type: 'number',
            placeholder: 'e.g., 5',
            description: 'Percentage of revenue invested in R&D/innovation',
            min: 0,
            max: 100,
            step: 0.1
        },
        Transp: {
            label: 'Transportation Access Score',
            type: 'number',
            placeholder: 'e.g., 0.75',
            description: 'Assessment of transportation/logistics access (0-1 scale)',
            min: 0,
            max: 1,
            step: 0.01
        },
        // Business Environment
        GDP: {
            label: 'Regional GDP Growth (%)',
            type: 'number',
            placeholder: 'e.g., 3.5',
            description: 'Regional economic growth rate assessment',
            min: -10,
            max: 20,
            step: 0.1
        },
        Pol_Inst: {
            label: 'Political Stability Score',
            type: 'number',
            placeholder: 'e.g., 0.7',
            description: 'Assessment of political and institutional stability (0-1 scale)',
            min: 0,
            max: 1,
            step: 0.01
        },
        Infor_Comp: {
            label: 'Information Access Score',
            type: 'number',
            placeholder: 'e.g., 0.8',
            description: 'Assessment of information and competitive environment (0-1 scale)',
            min: 0,
            max: 1,
            step: 0.01
        },
        WSI: {
            label: 'Economic Strength Index',
            type: 'number',
            placeholder: 'e.g., 0.65',
            description: 'World economic strength indicators (0-1 scale)',
            min: 0,
            max: 1,
            step: 0.01
        },
        WUI: {
            label: 'Economic Uncertainty Index',
            type: 'number',
            placeholder: 'e.g., 0.3',
            description: 'World economic uncertainty measures (0-1 scale)',
            min: 0,
            max: 1,
            step: 0.01
        },
        PRIME: {
            label: 'Interest Rate Environment (%)',
            type: 'number',
            placeholder: 'e.g., 5.5',
            description: 'Current interest rate environment assessment',
            min: 0,
            max: 50,
            step: 0.1
        }
    }), []);

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
        const currentFields = FORM_SECTIONS[activeSection].fields;
        const errors = {};
        let isValid = true;

        currentFields.forEach(field => {
            const config = FIELD_CONFIGS[field];
            const value = formData[field];

            // Required field validation
            if (config.required && (!value || value === '')) {
                errors[field] = 'This field is required';
                isValid = false;
            }

            // Type validation
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
                }
            }
        });

        // Update validation errors for current section
        setValidationErrors(prev => ({
            ...prev,
            ...errors
        }));

        return isValid;
    }, [activeSection, FORM_SECTIONS, FIELD_CONFIGS, formData]);

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

            // Prepare submission data
            const submissionData = {};
            Object.keys(formData).forEach(key => {
                const value = formData[key];
                if (value !== '' && value !== null && value !== undefined) {
                    submissionData[key] = FIELD_CONFIGS[key]?.type === 'number' ? parseFloat(value) : value;
                }
            });

            try {
                await generatePrediction(submissionData, formData.country2 || 'AFR');
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
    }, [isLastSection, isAuthenticated, validateForm, validateCurrentSection, goToNextSection, formData, generatePrediction, addNotification, FIELD_CONFIGS]);

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

                {/* Form */}
                <form onSubmit={handleNextOrSubmit} className="space-y-8">
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <Info className="h-4 w-4 mr-2 text-blue-600" />
                            {currentSection.title}
                        </h4>
                        <p className="text-sm text-gray-600">{currentSection.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentSection.fields.map(fieldName => {
                            const config = FIELD_CONFIGS[fieldName];
                            if (!config) return null;

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
                        })}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || (!isAuthenticated && isLastSection && submitAttempted)}
                            isLoading={loading}
                            icon={loading ? Loader2 : (isLastSection ? Send : ChevronRight)}
                            className="flex-1 sm:flex-none"
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
                </form>
            </div>
        </div>
    );
};

export default PredictionForm;