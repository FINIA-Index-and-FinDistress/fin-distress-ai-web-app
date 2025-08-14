// import React from 'react';
// import { HelpCircle, AlertCircle, ChevronDown } from 'lucide-react';

// // Sector mappings from the training pipeline
// const SECTOR_OPTIONS = [
//     { label: 'Construction', value: '1' },
//     { label: 'Retail', value: '2' },
//     { label: 'Manufacturing', value: '3' },
//     { label: 'Other Services', value: '4' },
//     { label: 'Other Manufacturing', value: '5' },
//     { label: 'Food', value: '6' },
//     { label: 'Garments', value: '7' },
//     { label: 'Hotels', value: '8' },
//     { label: 'Services', value: '9' },
//     { label: 'Rest of Universe', value: '10' },
//     { label: 'IT & IT Services', value: '11' },
//     { label: 'Textiles', value: '12' },
//     { label: 'Machinery & Equipment', value: '13' },
//     { label: 'Textiles & Garments', value: '14' },
//     { label: 'Basic Metals/Fabricated Metals/Machinery & Equip.', value: '15' },
//     { label: 'Chemicals, Plastics & Rubber', value: '16' },
//     { label: 'Chemicals & Chemical Products', value: '17' },
//     { label: 'Machinery & Equipment & Electronics', value: '18' },
//     { label: 'Leather Products', value: '19' },
//     { label: 'Furniture', value: '20' },
//     { label: 'Motor Vehicles & Transport Equip.', value: '21' },
//     { label: 'Fabricated Metal Products', value: '22' },
//     { label: 'Hospitality & Tourism', value: '23' },
//     { label: 'Motor Vehicles', value: '24' },
//     { label: 'Electronics', value: '25' },
//     { label: 'Services of Motor Vehicles/Wholesale/Retail', value: '26' },
//     { label: 'Food/Leather/Wood/Tobacco/Rubber Products', value: '27' },
//     { label: 'Professional Activities', value: '28' },
//     { label: 'Non-Metallic Mineral Products', value: '29' },
//     { label: 'Hotels & Restaurants', value: '30' },
//     { label: 'Electronics & Communications Equip.', value: '31' },
//     { label: 'Transport, Storage, & Communications', value: '32' },
//     { label: 'Services of Motor Vehicles', value: '33' },
//     { label: 'Rubber & Plastics Products', value: '34' },
//     { label: 'Basic Metals & Metal Products', value: '35' },
//     { label: 'Wholesale', value: '36' },
//     { label: 'Basic Metals', value: '37' },
//     { label: 'Electrical & Computer Products', value: '38' },
//     { label: 'Minerals, Metals, Machinery & Equipment', value: '39' },
//     { label: 'Wood Products', value: '40' },
//     { label: 'Printing & Publishing', value: '41' },
//     { label: 'Petroleum products, Plastics & Rubber', value: '42' },
//     { label: 'Wood products, Furniture, Paper & Publishing', value: '43' },
//     { label: 'Machinery & Equipment, Electronics & Vehicles', value: '44' },
//     { label: 'Transport', value: '45' },
//     { label: 'Textiles, Garments & Leather', value: '46' },
//     { label: 'Restaurants', value: '47' },
//     { label: 'Wholesale, Including of Motor Vehicles', value: '48' },
//     { label: 'Publishing, Telecommunications & IT', value: '49' },
//     { label: 'Wholesale & Retail', value: '50' },
//     { label: 'Mining Related Manufacturing', value: '51' },
//     { label: 'Pharmaceuticals & Medical Products', value: '52' },
//     { label: 'Wood Products & Furniture', value: '53' },
//     { label: 'Computer, Electronic & Optical Products', value: '54' },
//     { label: 'Retail & IT', value: '55' },
//     { label: 'Metals, Machinery, Computers & Electronics', value: '56' },
//     { label: 'Manufacturing Panel', value: '57' },
//     { label: 'Retail Panel', value: '58' },
//     { label: 'Other Services Panel', value: '59' },
//     { label: 'Chemicals, Non-Metallic Mineral, Plastics & Rubber', value: '60' },
//     { label: 'Textiles, Garments, Leather & Paper', value: '61' },
//     { label: 'Pharmaceutical, Chemicals & Chemical Products', value: '62' },
//     { label: 'Wholesale of Agri Inputs & Equipment', value: '63' }
// ];

// // Countries from the training pipeline - African countries (AFR region)
// const AFRICAN_COUNTRIES = [
//     'Angola', 'Bangladesh', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon',
//     'Central African Republic', 'Chad', 'Congo', "Cote d'Ivoire", 'DRC', 'Djibouti', 'Egypt',
//     'Equatorial Guinea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea',
//     'Lebanon', 'Lesotho', 'Liberia', 'Guineabissau', 'Kenya', 'Madagascar', 'Malawi',
//     'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
//     'Nigeria', 'Rwanda', 'Senegal', 'Seychelles', 'Sierra Leone', 'South Sudan',
//     'Southafrica', 'Sudan', 'Tanzania', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
// ];

// // Rest of World countries (ROW region)
// const ROW_COUNTRIES = [
//     'Afghanistan', 'Albania', 'Antiguaandbarbuda', 'Argentina', 'Armenia', 'Austria', 'Azerbaijan',
//     'Bahamas', 'Bahrain', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Bhutan', 'Bolivia',
//     'Bosnia and Herzegovina', 'Brazil', 'Bulgaria', 'Cabo Verde', 'Cambodia', 'Canada', 'Chile',
//     'China', 'Colombia', 'Costa Rica', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Dominica',
//     'Dominican Republic', 'Ecuador', 'El Salvador', 'Eritrea', 'Estonia', 'Fiji', 'Finland',
//     'France', 'Georgia', 'Germany', 'Greece', 'Grenada', 'Guatemala', 'Guyana', 'Honduras',
//     'Hong Kong SAR China', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland',
//     'Israel', 'Italy', 'Jamaica', 'Jordan', 'Kazakhstan', 'Korea Republic', 'Kosovo',
//     'Kyrgyz Republic', 'Lao PDR', 'Latvia', 'Lithuania', 'Luxembourg', 'Malaysia', 'Malta',
//     'Mexico', 'Micronesia, Fed. Sts.', 'Moldova', 'Mongolia', 'Montenegro', 'Myanmar', 'Nepal',
//     'Netherlands', 'New Zealand', 'Nicaragua', 'North Macedonia', 'Pakistan', 'Panama',
//     'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania',
//     'Russia', 'Samoa', 'Saudi Arabia', 'Serbia', 'Singapore', 'Slovak Republic', 'Slovenia',
//     'Solomon Islands', 'Spain', 'SriLanka', 'Stkittsandnevis', 'Stlucia', 'Stvincentandthegrenadines',
//     'Suriname', 'Sweden', 'Taiwan China', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga',
//     'Trinidad and Tobago', 'Turkiye', 'Turkmenistan', 'Ukraine', 'United Kingdom', 'United States',
//     'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Viet Nam', 'West Bank And Gaza', 'Yemen'
// ];

// // Combined and sorted country options
// const COUNTRY_OPTIONS = [
//     // African countries first (most common for this application)
//     ...AFRICAN_COUNTRIES.map(country => ({ label: country, value: country, region: 'AFR' })),
//     // Then Rest of World countries
//     ...ROW_COUNTRIES.map(country => ({ label: country, value: country, region: 'ROW' }))
// ].sort((a, b) => a.label.localeCompare(b.label));

// const InputField = ({ name, value, onChange, config, error, required = true }) => {
//     const {
//         label,
//         placeholder,
//         description,
//         type = 'number',
//         min,
//         max,
//         step = 'any',
//         options
//     } = config;

//     // Determine if this is a select field
//     const isSelectField = type === 'select' || name === 'stra_sector' || name === 'country2';

//     // Get options based on field name
//     const getFieldOptions = () => {
//         if (name === 'stra_sector') {
//             return SECTOR_OPTIONS;
//         } else if (name === 'country2') {
//             return COUNTRY_OPTIONS;
//         } else if (options) {
//             // Handle options from config (either array or object)
//             if (Array.isArray(options)) {
//                 return options;
//             } else if (typeof options === 'object') {
//                 return Object.entries(options).map(([label, value]) => ({ label, value }));
//             }
//         }
//         return [];
//     };

//     const fieldOptions = getFieldOptions();

//     // Check if field is empty for validation styling
//     const isEmpty = !value || value === '' || value === null || value === undefined;
//     const showRequiredError = required && isEmpty && error;

//     const renderInput = () => {
//         if (isSelectField && fieldOptions.length > 0) {
//             return (
//                 <div className="relative">
//                     <select
//                         id={name}
//                         name={name}
//                         value={value || ''}
//                         onChange={(e) => onChange(name, e.target.value)}
//                         className={`
//                             w-full px-4 py-3 text-sm bg-white border-2 rounded-xl 
//                             focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
//                             focus:border-indigo-500 transition-all duration-200
//                             appearance-none cursor-pointer
//                             group-hover:shadow-md group-hover:border-indigo-300
//                             ${error || showRequiredError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300'}
//                             ${isEmpty ? 'text-gray-500' : 'text-gray-900'}
//                             ${required ? 'ring-1 ring-red-100' : ''}
//                         `}
//                         required={required}
//                         aria-required={required}
//                         aria-invalid={error ? 'true' : 'false'}
//                     >
//                         <option value="" disabled className="text-gray-500">
//                             {placeholder || `Select ${label.toLowerCase()}...`}
//                         </option>
//                         {name === 'country2' && (
//                             <>
//                                 <optgroup label="African Countries (AFR Region)">
//                                     {fieldOptions
//                                         .filter(opt => opt.region === 'AFR')
//                                         .map((option) => (
//                                             <option key={option.value} value={option.value} className="text-gray-900">
//                                                 {option.label}
//                                             </option>
//                                         ))
//                                     }
//                                 </optgroup>
//                                 <optgroup label="Rest of World (ROW Region)">
//                                     {fieldOptions
//                                         .filter(opt => opt.region === 'ROW')
//                                         .map((option) => (
//                                             <option key={option.value} value={option.value} className="text-gray-900">
//                                                 {option.label}
//                                             </option>
//                                         ))
//                                     }
//                                 </optgroup>
//                             </>
//                         )}
//                         {name === 'stra_sector' &&
//                             fieldOptions.map((option) => (
//                                 <option key={option.value} value={option.value} className="text-gray-900">
//                                     {option.label}
//                                 </option>
//                             ))
//                         }
//                         {name !== 'country2' && name !== 'stra_sector' &&
//                             fieldOptions.map((option) => (
//                                 <option key={option.value} value={option.value} className="text-gray-900">
//                                     {option.label}
//                                 </option>
//                             ))
//                         }
//                     </select>
//                     <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
//                 </div>
//             );
//         } else {
//             return (
//                 <input
//                     type={type}
//                     id={name}
//                     name={name}
//                     value={value || ''}
//                     onChange={(e) => onChange(name, e.target.value)}
//                     placeholder={placeholder}
//                     min={min}
//                     max={max}
//                     step={step}
//                     className={`
//                         w-full px-4 py-3 text-sm bg-white border-2 rounded-xl 
//                         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
//                         focus:border-indigo-500 transition-all duration-200
//                         group-hover:shadow-md group-hover:border-indigo-300
//                         ${error || showRequiredError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300'}
//                         ${required ? 'ring-1 ring-red-100' : ''}
//                     `}
//                     required={required}
//                     aria-required={required}
//                     aria-invalid={error ? 'true' : 'false'}
//                 />
//             );
//         }
//     };

//     return (
//         <div className="group">
//             <label
//                 htmlFor={name}
//                 className="block text-sm font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors"
//             >
//                 {label}
//                 {required && (
//                     <span className="text-red-500 ml-1 font-bold" title="Required field">
//                         *
//                     </span>
//                 )}
//                 {description && (
//                     <div className="inline-block ml-1">
//                         <HelpCircle
//                             className="inline h-4 w-4 text-gray-400 cursor-help"
//                             title={description}
//                         />
//                     </div>
//                 )}
//             </label>

//             <div className="relative">
//                 {renderInput()}

//                 {(error || showRequiredError) && (
//                     <p className="text-red-500 text-xs mt-1 flex items-center">
//                         <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
//                         {error || 'This field is required'}
//                     </p>
//                 )}
//             </div>

//             {description && !error && !showRequiredError && (
//                 <p className="text-xs text-gray-500 mt-1 hidden group-hover:block transition-all duration-200">
//                     {description}
//                 </p>
//             )}

//             {required && !error && !showRequiredError && (
//                 <p className="text-xs text-red-400 mt-1 opacity-60">
//                     Required field
//                 </p>
//             )}
//         </div>
//     );
// };

// export default InputField;

import React, { useState } from 'react';
import { HelpCircle, AlertCircle, ChevronDown, Info } from 'lucide-react';

// Sector mappings from the training pipeline
const SECTOR_OPTIONS = [
    { label: 'Construction', value: '1' },
    { label: 'Retail', value: '2' },
    { label: 'Manufacturing', value: '3' },
    { label: 'Other Services', value: '4' },
    { label: 'Other Manufacturing', value: '5' },
    { label: 'Food', value: '6' },
    { label: 'Garments', value: '7' },
    { label: 'Hotels', value: '8' },
    { label: 'Services', value: '9' },
    { label: 'Rest of Universe', value: '10' },
    { label: 'IT & IT Services', value: '11' },
    { label: 'Textiles', value: '12' },
    { label: 'Machinery & Equipment', value: '13' },
    { label: 'Textiles & Garments', value: '14' },
    { label: 'Basic Metals/Fabricated Metals/Machinery & Equip.', value: '15' },
    { label: 'Chemicals, Plastics & Rubber', value: '16' },
    { label: 'Chemicals & Chemical Products', value: '17' },
    { label: 'Machinery & Equipment & Electronics', value: '18' },
    { label: 'Leather Products', value: '19' },
    { label: 'Furniture', value: '20' },
    { label: 'Motor Vehicles & Transport Equip.', value: '21' },
    { label: 'Fabricated Metal Products', value: '22' },
    { label: 'Hospitality & Tourism', value: '23' },
    { label: 'Motor Vehicles', value: '24' },
    { label: 'Electronics', value: '25' },
    { label: 'Services of Motor Vehicles/Wholesale/Retail', value: '26' },
    { label: 'Food/Leather/Wood/Tobacco/Rubber Products', value: '27' },
    { label: 'Professional Activities', value: '28' },
    { label: 'Non-Metallic Mineral Products', value: '29' },
    { label: 'Hotels & Restaurants', value: '30' },
    { label: 'Electronics & Communications Equip.', value: '31' },
    { label: 'Transport, Storage, & Communications', value: '32' },
    { label: 'Services of Motor Vehicles', value: '33' },
    { label: 'Rubber & Plastics Products', value: '34' },
    { label: 'Basic Metals & Metal Products', value: '35' },
    { label: 'Wholesale', value: '36' },
    { label: 'Basic Metals', value: '37' },
    { label: 'Electrical & Computer Products', value: '38' },
    { label: 'Minerals, Metals, Machinery & Equipment', value: '39' },
    { label: 'Wood Products', value: '40' },
    { label: 'Printing & Publishing', value: '41' },
    { label: 'Petroleum products, Plastics & Rubber', value: '42' },
    { label: 'Wood products, Furniture, Paper & Publishing', value: '43' },
    { label: 'Machinery & Equipment, Electronics & Vehicles', value: '44' },
    { label: 'Transport', value: '45' },
    { label: 'Textiles, Garments & Leather', value: '46' },
    { label: 'Restaurants', value: '47' },
    { label: 'Wholesale, Including of Motor Vehicles', value: '48' },
    { label: 'Publishing, Telecommunications & IT', value: '49' },
    { label: 'Wholesale & Retail', value: '50' },
    { label: 'Mining Related Manufacturing', value: '51' },
    { label: 'Pharmaceuticals & Medical Products', value: '52' },
    { label: 'Wood Products & Furniture', value: '53' },
    { label: 'Computer, Electronic & Optical Products', value: '54' },
    { label: 'Retail & IT', value: '55' },
    { label: 'Metals, Machinery, Computers & Electronics', value: '56' },
    { label: 'Manufacturing Panel', value: '57' },
    { label: 'Retail Panel', value: '58' },
    { label: 'Other Services Panel', value: '59' },
    { label: 'Chemicals, Non-Metallic Mineral, Plastics & Rubber', value: '60' },
    { label: 'Textiles, Garments, Leather & Paper', value: '61' },
    { label: 'Pharmaceutical, Chemicals & Chemical Products', value: '62' },
    { label: 'Wholesale of Agri Inputs & Equipment', value: '63' }
];

// Countries from the training pipeline - African countries (AFR region)
const AFRICAN_COUNTRIES = [
    'Angola', 'Bangladesh', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon',
    'Central African Republic', 'Chad', 'Congo', "Cote d'Ivoire", 'DRC', 'Djibouti', 'Egypt',
    'Equatorial Guinea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea',
    'Lebanon', 'Lesotho', 'Liberia', 'Guineabissau', 'Kenya', 'Madagascar', 'Malawi',
    'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
    'Nigeria', 'Rwanda', 'Senegal', 'Seychelles', 'Sierra Leone', 'South Sudan',
    'Southafrica', 'Sudan', 'Tanzania', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
];

// Rest of World countries (ROW region)
const ROW_COUNTRIES = [
    'Afghanistan', 'Albania', 'Antiguaandbarbuda', 'Argentina', 'Armenia', 'Austria', 'Azerbaijan',
    'Bahamas', 'Bahrain', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Bhutan', 'Bolivia',
    'Bosnia and Herzegovina', 'Brazil', 'Bulgaria', 'Cabo Verde', 'Cambodia', 'Canada', 'Chile',
    'China', 'Colombia', 'Costa Rica', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Dominica',
    'Dominican Republic', 'Ecuador', 'El Salvador', 'Eritrea', 'Estonia', 'Fiji', 'Finland',
    'France', 'Georgia', 'Germany', 'Greece', 'Grenada', 'Guatemala', 'Guyana', 'Honduras',
    'Hong Kong SAR China', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Jamaica', 'Jordan', 'Kazakhstan', 'Korea Republic', 'Kosovo',
    'Kyrgyz Republic', 'Lao PDR', 'Latvia', 'Lithuania', 'Luxembourg', 'Malaysia', 'Malta',
    'Mexico', 'Micronesia, Fed. Sts.', 'Moldova', 'Mongolia', 'Montenegro', 'Myanmar', 'Nepal',
    'Netherlands', 'New Zealand', 'Nicaragua', 'North Macedonia', 'Pakistan', 'Panama',
    'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania',
    'Russia', 'Samoa', 'Saudi Arabia', 'Serbia', 'Singapore', 'Slovak Republic', 'Slovenia',
    'Solomon Islands', 'Spain', 'SriLanka', 'Stkittsandnevis', 'Stlucia', 'Stvincentandthegrenadines',
    'Suriname', 'Sweden', 'Taiwan China', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga',
    'Trinidad and Tobago', 'Turkiye', 'Turkmenistan', 'Ukraine', 'United Kingdom', 'United States',
    'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Viet Nam', 'West Bank And Gaza', 'Yemen'
];

// Combined and sorted country options
const COUNTRY_OPTIONS = [
    // African countries first (most common for this application)
    ...AFRICAN_COUNTRIES.map(country => ({ label: country, value: country, region: 'AFR' })),
    // Then Rest of World countries
    ...ROW_COUNTRIES.map(country => ({ label: country, value: country, region: 'ROW' }))
].sort((a, b) => a.label.localeCompare(b.label));

const InputField = ({ name, value, onChange, config, error, required = true }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const {
        label,
        placeholder,
        description,
        type = 'number',
        min,
        max,
        step = 'any',
        options
    } = config;

    // Determine if this is a select field
    const isSelectField = type === 'select' || name === 'stra_sector' || name === 'country2';

    // Get options based on field name
    const getFieldOptions = () => {
        if (name === 'stra_sector') {
            return SECTOR_OPTIONS;
        } else if (name === 'country2') {
            return COUNTRY_OPTIONS;
        } else if (options) {
            // Handle options from config (either array or object)
            if (Array.isArray(options)) {
                return options;
            } else if (typeof options === 'object') {
                return Object.entries(options).map(([label, value]) => ({ label, value }));
            }
        }
        return [];
    };

    const fieldOptions = getFieldOptions();

    // Check if field is empty for validation styling
    const isEmpty = !value || value === '' || value === null || value === undefined;
    const showRequiredError = required && isEmpty && error;

    // FIXED: Show "Required field" only when field is filled incorrectly (has error but not empty, or is required and has error)
    const showRequiredText = required && !error && !showRequiredError && isEmpty;

    const renderInput = () => {
        if (isSelectField && fieldOptions.length > 0) {
            return (
                <div className="relative">
                    <select
                        id={name}
                        name={name}
                        value={value || ''}
                        onChange={(e) => onChange(name, e.target.value)}
                        className={`
                            w-full px-4 py-3 text-sm bg-white border-2 rounded-xl 
                            focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
                            focus:border-indigo-500 transition-all duration-200
                            appearance-none cursor-pointer
                            group-hover:shadow-md group-hover:border-indigo-300
                            ${error || showRequiredError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300'}
                            ${isEmpty ? 'text-gray-500' : 'text-gray-900'}
                        `}
                        required={required}
                        aria-required={required}
                        aria-invalid={error ? 'true' : 'false'}
                    >
                        <option value="" disabled className="text-gray-500">
                            {placeholder || `Select ${label.toLowerCase()}...`}
                        </option>
                        {name === 'country2' && (
                            <>
                                <optgroup label="African Countries (AFR Region)">
                                    {fieldOptions
                                        .filter(opt => opt.region === 'AFR')
                                        .map((option) => (
                                            <option key={option.value} value={option.value} className="text-gray-900">
                                                {option.label}
                                            </option>
                                        ))
                                    }
                                </optgroup>
                                <optgroup label="Rest of World (ROW Region)">
                                    {fieldOptions
                                        .filter(opt => opt.region === 'ROW')
                                        .map((option) => (
                                            <option key={option.value} value={option.value} className="text-gray-900">
                                                {option.label}
                                            </option>
                                        ))
                                    }
                                </optgroup>
                            </>
                        )}
                        {name === 'stra_sector' &&
                            fieldOptions.map((option) => (
                                <option key={option.value} value={option.value} className="text-gray-900">
                                    {option.label}
                                </option>
                            ))
                        }
                        {name !== 'country2' && name !== 'stra_sector' &&
                            fieldOptions.map((option) => (
                                <option key={option.value} value={option.value} className="text-gray-900">
                                    {option.label}
                                </option>
                            ))
                        }
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            );
        } else {
            return (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={value || ''}
                    onChange={(e) => onChange(name, e.target.value)}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    step={step}
                    className={`
                        w-full px-4 py-3 text-sm bg-white border-2 rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-indigo-500/20 
                        focus:border-indigo-500 transition-all duration-200
                        group-hover:shadow-md group-hover:border-indigo-300
                        ${error || showRequiredError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-300'}
                    `}
                    required={required}
                    aria-required={required}
                    aria-invalid={error ? 'true' : 'false'}
                />
            );
        }
    };

    return (
        <div className="group relative">
            <label
                htmlFor={name}
                className="block text-sm font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors"
            >
                <div className="flex items-center">
                    <span>
                        {label}
                        {required && (
                            <span className="text-red-500 ml-1 font-bold" title="Required field">
                                *
                            </span>
                        )}
                    </span>

                    {/* FIXED: Info icon with hover tooltip */}
                    {description && (
                        <div
                            className="relative inline-block ml-2"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <Info className="h-4 w-4 text-gray-400 hover:text-indigo-600 cursor-help transition-colors" />

                            {/* Tooltip */}
                            {showTooltip && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                                    <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 max-w-xs whitespace-normal shadow-lg">
                                        <div className="relative">
                                            {description}
                                            {/* Tooltip arrow */}
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </label>

            <div className="relative">
                {renderInput()}

                {(error || showRequiredError) && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                        {error || 'This field is required'}
                    </p>
                )}
            </div>

            {/* FIXED: Only show "Required field" text when field is empty and not in error state */}
            {showRequiredText && (
                <p className="text-xs text-red-400 mt-1 opacity-60">
                    Required field
                </p>
            )}
        </div>
    );
};

export default InputField;