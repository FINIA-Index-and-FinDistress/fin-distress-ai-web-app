
import React from 'react';
import { Brain, TrendingUp, Shield, Zap, Users, Award, ExternalLink, Mail, Phone, MapPin, Sparkles, BookOpen, Database, Globe, Star, GraduationCap, Building2 } from 'lucide-react';

/**
 * Welcome Screen Component for FinDistress AI
 * Displayed to unauthenticated users to showcase features and encourage sign-up
 */
const WelcomeScreen = ({ onGetStarted }) => {
    const features = [
        {
            icon: Brain,
            title: 'AI-Powered Analysis',
            description: 'Advanced machine learning algorithms analyze 21+ financial indicators to predict business distress with 95%+ accuracy.',
            color: 'bg-blue-500'
        },
        {
            icon: TrendingUp,
            title: 'Real-Time Insights',
            description: 'Get instant risk assessments and actionable recommendations to improve your business financial health.',
            color: 'bg-green-500'
        },
        {
            icon: Shield,
            title: 'SHAP Explanations',
            description: 'Transparent AI with detailed explanations of how each factor contributes to your risk assessment.',
            color: 'bg-purple-500'
        },
        {
            icon: Zap,
            title: 'Instant Results',
            description: 'Receive comprehensive financial health reports in seconds, not days or weeks.',
            color: 'bg-yellow-500'
        },
        {
            icon: Users,
            title: 'Multi-Region Support',
            description: 'Specialized models for African (AFR) and Rest of World (ROW) markets with region-specific insights.',
            color: 'bg-indigo-500'
        },
        {
            icon: Award,
            title: 'Professional Grade',
            description: 'Trusted by investors, analysts, and business professionals for critical financial decisions.',
            color: 'bg-red-500'
        }
    ];

    const stats = [
        { value: '12,847+', label: 'Predictions Made' },
        { value: '91.0%', label: 'Accuracy Rate' },
        { value: '260,000+', label: 'Companies Analyzed' },
        { value: '21', label: 'Risk Factors' }
    ];

    const researchPartners = [
        {
            name: 'Carnegie Mellon University',
            shortName: 'CMU',
            location: 'Pittsburgh, PA, USA',
            description: 'Global leader in Computer Science & AI research with cutting-edge machine learning programs.',
            icon: GraduationCap,
            highlight: 'AI Research Excellence',
            contribution: 'Advanced ML algorithms and model architecture',
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600'
        },
        {
            name: 'Carnegie Mellon Africa',
            shortName: 'CMU Africa',
            location: 'Kigali, Rwanda',
            description: 'Technology innovation hub bridging world-class education with African market insights.',
            icon: Globe,
            highlight: 'African Tech Hub',
            contribution: 'Regional market expertise and data collection',
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600'
        },
        {
            name: 'University of the Witwatersrand',
            shortName: 'Wits University',
            location: 'Johannesburg, South Africa',
            description: 'Leading African research institution with deep expertise in financial systems and economics.',
            icon: Building2,
            highlight: 'Financial Research Leader',
            contribution: 'Financial modeling and African market validation',
            color: 'from-purple-500 to-violet-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            iconBg: 'bg-gradient-to-br from-purple-500 to-violet-600'
        }
    ];

    const platformFeatures = [
        'Financial Distress Prediction',
        'SHAP Explainability Analysis',
        'Multi-Section Input Forms',
        'Historical Analytics Dashboard',
        'Real-time Risk Assessments'
    ];

    const researchFeatures = [
        'LightGBM Model Architecture',
        'Multi-Regional Training Data',
        'Academic Research Publications',
        'Open Source Model Access',
        'Financial Analytics Documentation'
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header with Logo */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Brain className="w-7 h-7 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                            <Sparkles className="w-2.5 h-2.5 text-yellow-900" />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            FinDistress AI
                        </h1>
                        <p className="text-sm text-gray-500 font-medium">Financial Risk Prediction Platform</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Research Active
                </div>
            </div>

            {/* Hero Section */}
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm">
                    <Brain className="w-4 h-4" />
                    AI-Powered Financial Analysis
                    <div className="ml-2 px-2 py-0.5 bg-indigo-200 text-indigo-900 rounded text-xs font-bold">
                        BETA
                    </div>
                </div>

                <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                    Predict Financial
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                        {' '}Distress
                    </span>
                    <br />
                    <span className="text-4xl md:text-5xl text-gray-700">Before It Happens</span>
                </h2>

                <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
                    Leverage advanced machine learning from leading universities to assess business financial health,
                    identify risk factors, and get actionable insights to safeguard your investments and operations.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                    <button
                        onClick={onGetStarted}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                        Start Free Analysis
                    </button>

                    <button
                        onClick={() => {
                            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-indigo-600 font-semibold text-xl hover:text-indigo-700 transition-colors flex items-center gap-3 group"
                    >
                        Explore Features
                        <div className="p-2 rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                            <svg className="w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>
                </div>

                {/* Enhanced Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-gradient-to-r from-white/80 to-gray-50/80 backdrop-blur-sm rounded-3xl p-10 border border-gray-200/50 shadow-lg">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="mb-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Powerful Features for Financial Analysis
                    </h2>
                    <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                        Our comprehensive platform provides everything you need to assess and monitor business financial health with cutting-edge AI technology.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer"
                        >
                            <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                <feature.icon className="w-8 h-8 text-white" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed text-lg">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Refined Research Partnership Section */}
            <div className="mb-20">
                <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl p-10 md:p-16 relative overflow-hidden border border-slate-200/50 shadow-xl">
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]">
                        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-slate-400 rounded-full"></div>
                        <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-slate-400 rounded-full"></div>
                        <div className="absolute top-1/2 right-20 w-16 h-16 border-2 border-slate-400 rounded-full"></div>
                        <div className="absolute bottom-20 left-1/3 w-20 h-20 border-2 border-slate-400 rounded-full"></div>
                    </div>

                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm text-slate-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-sm border border-slate-200/50">
                                <Users className="w-5 h-5 text-indigo-600" />
                                Multi-University Research Initiative
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8">
                                Powered by Academic Excellence
                            </h2>
                            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                                A collaborative effort between world-renowned institutions, combining cutting-edge AI research
                                with deep African market expertise to deliver unprecedented financial risk insights.
                            </p>
                        </div>

                        {/* Research Partners Grid */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {researchPartners.map((partner, index) => (
                                <div key={index} className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 border ${partner.borderColor}/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group cursor-pointer relative overflow-hidden`}>
                                    <div className="text-center mb-6">
                                        <div className={`w-16 h-16 ${partner.iconBg} rounded-2xl flex items-center justify-center mb-4 mx-auto transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            <partner.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div className={`inline-flex items-center gap-2 ${partner.bgColor} text-slate-700 px-3 py-1 rounded-full text-xs font-bold mb-4 border ${partner.borderColor}/50`}>
                                            <Award className="w-3 h-3" />
                                            {partner.highlight}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">{partner.shortName}</h3>
                                        <div className="flex items-center justify-center gap-1 text-slate-500 text-sm font-medium mb-4">
                                            <MapPin className="w-3 h-3" />
                                            {partner.location}
                                        </div>
                                    </div>

                                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                        {partner.description}
                                    </p>

                                    <div className="pt-4 border-t border-slate-200">
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-2">
                                            Research Contribution
                                        </p>
                                        <p className="text-sm text-slate-700 font-medium">
                                            {partner.contribution}
                                        </p>
                                    </div>

                                    {/* Subtle Gradient Border Effect */}
                                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${partner.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                                </div>
                            ))}
                        </div>

                        {/* Funding Section */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg shadow-lg mb-8 border border-amber-300">
                                <Award className="w-6 h-6" />
                                Proudly Funded by AFRETEC NETWORK
                            </div>

                            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-10 max-w-5xl mx-auto border border-slate-200/50 shadow-sm">
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <Globe className="w-8 h-8 text-indigo-600" />
                                    <h3 className="text-3xl font-bold text-slate-900">Our Mission</h3>
                                </div>
                                <p className="text-slate-600 leading-relaxed text-lg">
                                    To democratize financial risk assessment through advanced AI, providing businesses, investors,
                                    and researchers across Africa and globally with transparent, accurate, and actionable insights
                                    into financial health and distress prediction.
                                </p>
                            </div>
                        </div>

                        {/* Platform & Research Features */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-blue-200/50 shadow-sm">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900">Platform Features</h4>
                                </div>
                                <div className="space-y-3">
                                    {platformFeatures.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3 text-slate-700 bg-blue-50/50 rounded-lg px-4 py-3 border border-blue-100">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                            <span className="font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-purple-200/50 shadow-sm">
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-slate-900">Research Resources</h4>
                                </div>
                                <div className="space-y-3">
                                    {researchFeatures.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3 text-slate-700 bg-purple-50/50 rounded-lg px-4 py-3 border border-purple-100">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                                            <span className="font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="mb-20">
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-3xl p-10 shadow-xl border border-gray-200/50">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h3>
                        <p className="text-gray-600 text-lg">Connect with our research team for collaborations and inquiries</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                <Mail className="w-8 h-8" />
                            </div>
                            <p className="font-bold text-gray-900 text-lg mb-1">fintech.research@wits.ac.za</p>
                            <p className="text-gray-600 font-medium">Research Inquiries & Collaboration</p>
                        </div>

                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                <Phone className="w-8 h-8" />
                            </div>
                            <p className="font-bold text-gray-900 text-lg mb-1">+27 11 717 1000</p>
                            <p className="text-gray-600 font-medium">University of the Witwatersrand</p>
                        </div>

                        <div className="text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <p className="font-bold text-gray-900 text-lg mb-1">1 Jan Smuts Avenue</p>
                            <p className="text-gray-600 font-medium mb-3">Braamfontein, Johannesburg</p>
                            <a
                                href="https://www.wits.ac.za/about-wits/our-faculties-and-schools/maps-and-directions/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 mx-auto group-hover:gap-3 transition-all"
                            >
                                View Campus Map
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-10 md:p-16 text-center text-white mb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Transform Your Financial Analysis?
                    </h2>

                    <p className="text-xl md:text-2xl opacity-95 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Join the future of financial risk assessment with university-grade AI technology at your fingertips.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                        <button
                            onClick={onGetStarted}
                            className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                        >
                            Start Free Analysis
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-sm opacity-90">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            No credit card required
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Results in seconds
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            University-grade accuracy
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Footer */}
            <div className="text-center text-gray-600 border-t border-gray-200 pt-10">
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">FinDistress AI</span>
                    </div>
                </div>

                <p className="mb-6 text-lg">
                    © 2024 Multi-University Research Partnership • Funded by AFRETEC NETWORK
                </p>

                <div className="flex flex-wrap justify-center gap-6 text-sm">
                    <a href="#" className="hover:text-indigo-600 transition-colors font-medium">Privacy Policy</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors font-medium">Terms of Service</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors font-medium">Research Ethics</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors font-medium">API Access</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors font-medium">Contact</a>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;