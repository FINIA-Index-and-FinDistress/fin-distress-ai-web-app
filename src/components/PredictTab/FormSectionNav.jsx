import React from 'react';
import { DollarSign, Users, Building2, Globe, Briefcase } from 'lucide-react';

const FormSectionNav = ({ activeSection, setActiveSection, sections }) => {
    const sectionIcons = {
        financial: DollarSign,
        ownership: Users,
        operations: Building2,
        macro: Globe,
        company: Briefcase,
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
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FormSectionNav;