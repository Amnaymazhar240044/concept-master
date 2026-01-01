import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Shield, Crown, ArrowRight, Sparkles, Award, Rocket } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Pricing() {
    const [billingCycle, setBillingCycle] = useState('monthly')

    const plans = [
        {
            name: 'Basic',
            price: 'Free',
            description: 'Perfect for getting started',
            features: [
                'Access to all Notes',
                'Limited Quiz Access (MCQs only)',
                'Basic Community Support',
                'View Class Resources',
                'Download PDF Notes',
                'View Sample Lectures'
            ],
            cta: 'Get Started Free',
            popular: false,
            icon: <Star className="w-5 h-5" />
        },
        {
            name: 'Pro',
            price: billingCycle === 'monthly' ? '$19' : '$190',
            period: billingCycle === 'monthly' ? '/month' : '/year',
            description: 'Most popular choice for serious learners',
            features: [
                '✓ Everything in Basic Plan',
                '✨ Full access to all Lectures',
                '✨ Unlimited Concept Master AI',
                '✨ All quiz types unlocked',
                '✨ Detailed Performance Analytics',
                '✨ Priority 24/7 Support',
                '✨ Ad-free experience',
                '✨ Completion Certificates',
                '✨ Early access to new features'
            ],
            cta: 'Get Started Today',
            popular: true,
            icon: <Crown className="w-5 h-5" />
        },
        {
            name: 'Premium',
            price: billingCycle === 'monthly' ? '$49' : '$490',
            period: billingCycle === 'monthly' ? '/month' : '/year',
            description: 'For institutions & organizations',
            features: [
                'Everything in Pro',
                '🔧 Custom Curriculum Setup',
                '👨‍🏫 Advanced Teacher Dashboard',
                '👥 Bulk Student Management',
                '⚡ API Access & Integrations',
                '👤 Dedicated Account Manager',
                '📊 Advanced Analytics Suite',
                '🎓 Custom Branding & White-label'
            ],
            cta: 'Contact for Demo',
            popular: false,
            icon: <Shield className="w-5 h-5" />
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50/50 to-stone-50/50 dark:from-gray-900 dark:via-stone-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                    
                        <h1 className="text-4xl md:text-5xl font-black text-amber-900 dark:text-amber-50 tracking-tight leading-tight">
                            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Success Plan</span>
                        </h1>
                        <p className="text-xl text-amber-700 dark:text-amber-300 max-w-2xl mx-auto">
                            Join thousands of students who transformed their learning with Concept Master
                        </p>

                        {/* Billing Toggle */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-4 p-2 bg-white dark:bg-gray-800 rounded-full border border-amber-200 dark:border-amber-800 shadow-sm"
                        >
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${billingCycle === 'monthly'
                                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                                    : 'text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100'
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${billingCycle === 'yearly'
                                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md'
                                    : 'text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>Yearly</span>
                                    <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                                        SAVE 20%
                                    </span>
                                </div>
                            </button>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
                    {/* Glowing effect behind popular card */}
                    {plans.map((plan, index) => (
                        plan.popular && (
                            <motion.div
                                key="glow"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 -z-10 hidden md:block"
                            >
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-[95%] h-[110%] bg-gradient-to-r from-amber-400/20 via-orange-400/10 to-amber-400/20 blur-3xl rounded-3xl"></div>
                            </motion.div>
                        )
                    ))}

                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`relative ${plan.popular
                                ? 'md:-translate-y-4'
                                : ''
                                }`}
                        >
                            {/* Popular Badge - Enhanced */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                                    <div className="flex flex-col items-center">
                                        <div className="px-6 py-1.5 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white text-sm font-bold rounded-full shadow-xl flex items-center gap-2 border border-amber-300">
                                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                            <span>MOST POPULAR</span>
                                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                        </div>
                                        <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-amber-600"></div>
                                    </div>
                                </div>
                            )}

                            <div className={`h-full rounded-2xl shadow-lg overflow-hidden border-2 ${plan.popular
                                ? 'border-amber-500 dark:border-amber-400 shadow-xl shadow-amber-500/20'
                                : 'border-amber-200 dark:border-amber-800'
                                } bg-white dark:bg-gray-800`}>
                                {/* Card Header with Ribbon */}
                                <div className={`p-6 lg:p-8 ${plan.popular
                                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
                                    : 'bg-white dark:bg-gray-800'
                                    }`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-10 h-10 rounded-lg ${plan.popular
                                                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg'
                                                    : 'bg-gradient-to-br from-amber-400 to-orange-400'
                                                    } flex items-center justify-center text-white`}>
                                                    {plan.icon}
                                                </div>
                                                <h3 className={`text-xl font-bold ${plan.popular
                                                    ? 'text-amber-900 dark:text-amber-50'
                                                    : 'text-amber-900 dark:text-amber-100'
                                                    }`}>{plan.name}</h3>
                                            </div>
                                            <p className="text-sm text-amber-700 dark:text-amber-300">{plan.description}</p>
                                        </div>
                                        {plan.popular && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center animate-bounce">
                                                <Rocket className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Price Section */}
                                    <div className="my-6">
                                        <div className="flex items-baseline gap-2">
                                            <span className={`text-4xl lg:text-5xl font-black ${plan.popular
                                                ? 'text-amber-900 dark:text-amber-50'
                                                : 'text-amber-900 dark:text-amber-100'
                                                }`}>{plan.price}</span>
                                            {plan.period && (
                                                <span className={`text-lg ${plan.popular
                                                    ? 'text-amber-700 dark:text-amber-300'
                                                    : 'text-amber-700 dark:text-amber-400'
                                                    }`}>{plan.period}</span>
                                            )}
                                        </div>
                                        {plan.period && (
                                            <div className="flex items-center gap-2 mt-2">
                                                {billingCycle === 'yearly' && (
                                                    <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800">
                                                        Best Value
                                                    </span>
                                                )}
                                                <p className="text-sm text-amber-600 dark:text-amber-500">
                                                    {billingCycle === 'yearly' ? 'Billed annually' : 'Billed monthly'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats for Popular Plan */}
                                    {plan.popular && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800"
                                        >
                                            <div className="grid grid-cols-2 gap-3 text-center">
                                                <div>
                                                    <div className="text-lg font-bold text-amber-900 dark:text-amber-100">2,500+</div>
                                                    <div className="text-xs text-amber-700 dark:text-amber-300">Active Users</div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-amber-900 dark:text-amber-100">4.9★</div>
                                                    <div className="text-xs text-amber-700 dark:text-amber-300">Average Rating</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Features List */}
                                <div className="p-6 lg:p-8 pt-0">
                                    <div className="space-y-3 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 + i * 0.05 }}
                                                className="flex items-start gap-3 group"
                                            >
                                                <div className={`flex-shrink-0 mt-1 ${plan.popular
                                                    ? 'w-5 h-5 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 flex items-center justify-center'
                                                    : ''
                                                    }`}>
                                                    {feature.includes('✓') || feature.includes('✨') ? (
                                                        <div className={`w-4 h-4 rounded-full ${plan.popular
                                                            ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                                                            : 'bg-gradient-to-br from-amber-400 to-orange-400'
                                                            } flex items-center justify-center`}>
                                                            <Check className="w-2.5 h-2.5 text-white" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2"></div>
                                                    )}
                                                </div>
                                                <span className={`text-sm ${plan.popular
                                                    ? 'text-amber-800 dark:text-amber-200 font-medium'
                                                    : 'text-amber-700 dark:text-amber-300'
                                                    } leading-relaxed`}>{feature.replace('✓', '').replace('✨', '')}</span>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <Link
                                        to={
                                            plan.name === 'Basic'
                                                ? '/register'
                                                : plan.name === 'Pro'
                                                    ? `/checkout?plan=pro&cycle=${billingCycle}`
                                                    : '/contact'
                                        }
                                        className={`block w-full py-4 px-4 rounded-xl font-bold text-center transition-all duration-300 ${plan.popular
                                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                                            : 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-800/40 dark:hover:to-orange-800/40 text-amber-800 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-200 border border-amber-300 dark:border-amber-700'
                                            } flex items-center justify-center gap-3 group`}
                                    >
                                        <span className="font-bold">{plan.cta}</span>
                                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${plan.popular
                                            ? 'group-hover:translate-x-2'
                                            : 'group-hover:translate-x-1'
                                            }`} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Features / Trust Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-16"
                >
                    <div className="space-y-3">
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Shield className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100">Secure & Private</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300">Bank-level encryption for all transactions</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100">Instant Access</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300">Start learning immediately after payment</p>
                    </div>
                    <div className="space-y-3">
                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Award className="w-7 h-7" />
                        </div>
                        <h3 className="font-bold text-lg text-amber-900 dark:text-amber-100">7-Day Guarantee</h3>
                        <p className="text-sm text-amber-700 dark:text-amber-300">Full refund if not satisfied within 7 days</p>
                    </div>
                </motion.div>

                {/* FAQ / Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center pt-8 border-t border-amber-200 dark:border-amber-800"
                >
                    <p className="text-amber-700 dark:text-amber-300 mb-4">
                        Still have questions? <Link to="/contact" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium underline">Contact our team</Link>
                    </p>
                    <div className="text-xs text-amber-600 dark:text-amber-500">
                        All prices in USD. Taxes may apply. Cancel anytime.
                    </div>
                </motion.div>

            </div>
        </div>
    )
}