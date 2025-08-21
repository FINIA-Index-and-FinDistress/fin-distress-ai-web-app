// import React from 'react';
// import { DollarSign, Users, Building2, Globe, Briefcase } from 'lucide-react';

// const FormSectionNav = ({ activeSection, setActiveSection, sections }) => {
//     const sectionIcons = {
//         financial: DollarSign,
//         ownership: Users,
//         operations: Building2,
//         macro: Globe,
//         company: Briefcase,
//     };

//     return (
//         <div className="mb-8">
//             <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-2xl">
//                 {Object.entries(sections).map(([sectionKey, sectionData]) => {
//                     const Icon = sectionIcons[sectionKey] || Briefcase; // Fallback icon
//                     const isActive = activeSection === sectionKey;

//                     return (
//                         <button
//                             key={sectionKey}
//                             onClick={() => setActiveSection(sectionKey)}
//                             className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
//                                     ? 'bg-white text-indigo-600 shadow-md transform scale-105'
//                                     : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50'
//                                 }`}
//                         >
//                             <Icon className="h-4 w-4" />
//                             <span className="hidden sm:inline">{sectionData.title}</span>
//                             <span className="sm:hidden">{sectionData.title.split(' ')[0]}</span>
//                         </button>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

// export default FormSectionNav;

// src/components/PredictTab/FormSectionNav.js
import React from 'react';
import { DollarSign, Users, Building2, Globe, Briefcase, Target, TrendingUp, AlertTriangle } from 'lucide-react';

const FormSectionNav = ({ activeSection, setActiveSection, sections }) => {
    const sectionIcons = {
        company: Briefcase,
        performance: AlertTriangle,
        financial: DollarSign,
        leadership: Users,
        operations: Building2,
        macro: Globe,
        environment: Target,
        // Legacy mappings for backward compatibility
        ownership: Users,
        business: Building2
    };

    return (
        <div className="mb-8">
            <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-2xl">
                {Object.entries(sections).map(([sectionKey, sectionData]) => {
                    const Icon = sectionIcons[sectionKey] || Briefcase; // Fallback icon
                    const isActive = activeSection === sectionKey;

                    return (
                        <button
                            key={sectionKey}
                            onClick={() => setActiveSection(sectionKey)}
                            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                                    ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-white/50'
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{sectionData.title}</span>
                            <span className="sm:hidden">{sectionData.title.split(' ')[0]}</span>

                            {/* Special indicator for macro section */}
                            {sectionKey === 'macro' && (
                                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium ml-1">
                                    <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                                    Auto-fill
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FormSectionNav;