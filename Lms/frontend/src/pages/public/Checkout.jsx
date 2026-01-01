import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ShoppingCart, User, Mail, Lock, CreditCard, Calendar, Shield,
    Check, AlertCircle, Eye, EyeOff, ArrowLeft, GraduationCap, Sparkles,
    Target, Award, Zap, Crown, Brain, Users
} from 'lucide-react'
import api from '../../lib/api'

export default function Checkout() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const planParam = searchParams.get('plan') || 'basic'
    const cycleParam = searchParams.get('cycle') || 'monthly'

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    // Payment details (UI only - not saved)
    const [cardNumber, setCardNumber] = useState('')
    const [cardExpiry, setCardExpiry] = useState('')
    const [cardCVV, setCardCVV] = useState('')
    const [billingAddress, setBillingAddress] = useState('')

    const [termsAccepted, setTermsAccepted] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const planDetails = {
        basic: {
            name: 'Basic',
            price: 0,
            priceLabel: 'Free',
            period: '',
            features: ['Access to all Notes', 'Access to all Lectures', 'Basic Community Support', 'Limited Quiz Access'],
            color: 'from-blue-500 to-cyan-500'
        },
        pro: {
            name: 'Pro',
            price: cycleParam === 'monthly' ? 19 : 190,
            priceLabel: cycleParam === 'monthly' ? '$19' : '$190',
            period: cycleParam === 'monthly' ? '/mo' : '/yr',
            features: ['Everything in Basic', 'Unlimited Concept Master AI Access', 'Unlimited Quiz Attempts', 'Detailed Performance Analytics', 'Priority Support', 'Ad-free Experience'],
            color: 'from-amber-600 to-orange-600'
        },
        enterprise: {
            name: 'Enterprise',
            price: cycleParam === 'monthly' ? 19 : 190,
            priceLabel: cycleParam === 'monthly' ? '$19' : '$190',
            period: cycleParam === 'monthly' ? '/mo' : '/yr',
            features: ['Everything in Pro', 'Premium Access', 'Teacher Dashboard', 'Bulk Student Management', 'API Access', 'Dedicated Account Manager'],
            color: 'from-purple-600 to-pink-600'
        }
    }

    const selectedPlan = planDetails[planParam] || planDetails.basic
    const isPremium = planParam === 'pro' || planParam === 'enterprise'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await api.post('/auth/checkout', {
                name,
                email,
                password,
                plan: planParam,
                billingCycle: cycleParam
            })

            // Auto login after successful registration
            if (response.data.token) {
                localStorage.setItem('token', response.data.token)
                navigate('/dashboard')
            } else {
                navigate('/login')
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Checkout failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = (matches && matches[0]) || ''
        const parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        if (parts.length) {
            return parts.join(' ')
        } else {
            return value
        }
    }

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`
        }
        return v
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-orange-50/20 dark:from-gray-900 dark:to-amber-950/10">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-amber-200 dark:border-amber-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">Concept Master</span>
                        </Link>
                        <Link
                            to="/pricing"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600/70 hover:text-amber-700 dark:text-amber-400/70 dark:hover:text-amber-300 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Pricing
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Side - Invoice/Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent mb-2">Complete Your Order</h1>
                            <p className="text-amber-600/70 dark:text-amber-400/70">Join thousands of students learning smarter with Concept Master</p>
                        </div>

                        {/* Order Summary Card */}
                        <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-2xl shadow-xl border-2 border-amber-200 dark:border-amber-800 overflow-hidden">
                            <div className={`p-6 bg-gradient-to-r ${selectedPlan.color}`}>
                                <div className="flex items-center gap-3 text-white mb-4">
                                    <ShoppingCart className="w-6 h-6" />
                                    <h2 className="text-xl font-bold">Order Summary</h2>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold text-white">{selectedPlan.priceLabel}</span>
                                    <span className="text-white/80">{selectedPlan.period}</span>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${selectedPlan.color} flex items-center justify-center text-white shadow-md`}>
                                        {isPremium ? <Crown className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-amber-900 dark:text-amber-50">{selectedPlan.name} Plan</h3>
                                        <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Everything you need to excel in your studies</p>
                                    </div>
                                </div>

                                <div className="border-t border-amber-200 dark:border-amber-800 pt-4">
                                    <h4 className="font-semibold text-amber-900 dark:text-amber-50 mb-3 flex items-center gap-2">
                                        <Award className="w-4 h-4" />
                                        Included Features:
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedPlan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm">
                                                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-amber-700 dark:text-amber-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {selectedPlan.price > 0 && (
                                    <div className="border-t border-amber-200 dark:border-amber-800 pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-amber-600/70 dark:text-amber-400/70">Subtotal</span>
                                            <span className="font-medium text-amber-900 dark:text-amber-50">${selectedPlan.price}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-amber-600/70 dark:text-amber-400/70">Tax</span>
                                            <span className="font-medium text-amber-900 dark:text-amber-50">$0.00</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-amber-200 dark:border-amber-700">
                                            <span className="text-amber-900 dark:text-amber-50">Total</span>
                                            <span className={`${selectedPlan.color === 'from-amber-600 to-orange-600' ? 'text-amber-600 dark:text-amber-400' : 'text-purple-600 dark:text-purple-400'}`}>
                                                ${selectedPlan.price}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800">
                                    <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                                        {isPremium ? 'Instant premium access after signup!' : 'Start learning for free!'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Benefits Summary */}
                        <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-2xl p-6 border-2 border-amber-200 dark:border-amber-800">
                            <h3 className="font-bold text-lg text-amber-900 dark:text-amber-50 mb-4 flex items-center gap-2">
                                <Brain className="w-5 h-5" />
                                Why Choose Concept Master?
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-sm text-amber-700 dark:text-amber-300">10,000+ Students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-sm text-amber-700 dark:text-amber-300">94% Success Rate</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span className="text-sm text-amber-700 dark:text-amber-300">Instant Access</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <span className="text-sm text-amber-700 dark:text-amber-300">Secure & Safe</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side - Registration & Payment Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-2xl shadow-xl border-2 border-amber-200 dark:border-amber-800 p-8">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2"
                                >
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Account Information */}
                                <div>
                                    <h3 className="text-lg font-bold text-amber-900 dark:text-amber-50 mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        Account Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Full Name *</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                                required
                                                className="w-full px-4 py-3 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-amber-900 dark:text-amber-50 focus:bg-white dark:focus:bg-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Email Address *</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                required
                                                className="w-full px-4 py-3 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-amber-900 dark:text-amber-50 focus:bg-white dark:focus:bg-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Password *</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Create a strong password"
                                                    required
                                                    className="w-full px-4 py-3 pr-12 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-amber-900 dark:text-amber-50 focus:bg-white dark:focus:bg-gray-800"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600 dark:hover:text-amber-300"
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Information (UI Only) */}
                                {selectedPlan.price > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold text-amber-900 dark:text-amber-50 mb-4 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            Payment Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Card Number</label>
                                                <input
                                                    type="text"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                    placeholder="4242 4242 4242 4242"
                                                    maxLength="19"
                                                    className="w-full px-4 py-3 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-amber-900 dark:text-amber-50 focus:bg-white dark:focus:bg-gray-800"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        value={cardExpiry}
                                                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                                        placeholder="MM/YY"
                                                        maxLength="5"
                                                        className="w-full px-4 py-3 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-amber-900 dark:text-amber-50 focus:bg-white dark:focus:bg-gray-800"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">CVV</label>
                                                    <input
                                                        type="text"
                                                        value={cardCVV}
                                                        onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, '').substring(0, 3))}
                                                        placeholder="123"
                                                        maxLength="3"
                                                        className="w-full px-4 py-3 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-amber-900 dark:text-amber-50 focus:bg-white dark:focus:bg-gray-800"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">Billing Address</label>
                                                <input
                                                    type="text"
                                                    value={billingAddress}
                                                    onChange={(e) => setBillingAddress(e.target.value)}
                                                    placeholder="123 Main St, City, State ZIP"
                                                    className="w-full px-4 py-3 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all outline-none text-amber-900 dark:text-amber-50 focus:bg-white dark:focus:bg-gray-800"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800">
                                                <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                                <p className="text-xs text-amber-700 dark:text-amber-300">
                                                    Demo mode: Payment details are for UI only and will not be saved
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Terms & Conditions */}
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={termsAccepted}
                                        onChange={(e) => setTermsAccepted(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                                    />
                                    <label htmlFor="terms" className="text-sm text-amber-700 dark:text-amber-300">
                                        I agree to the <Link to="/terms" className="text-amber-600 hover:underline font-medium">Terms & Conditions</Link> and <Link to="/privacy" className="text-amber-600 hover:underline font-medium">Privacy Policy</Link>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!termsAccepted || loading}
                                    className={`w-full py-4 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${selectedPlan.price > 0 
                                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500' 
                                        : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500'
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-5 h-5" />
                                            Complete Checkout
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-sm text-amber-600/70 dark:text-amber-400/70">
                                    Already have an account? <Link to="/login" className="text-amber-600 hover:underline font-semibold">Sign in</Link>
                                </p>
                            </form>
                        </div>

                        {/* Security & Trust Badges */}
                        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border-2 border-amber-200 dark:border-amber-800">
                            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-50 mb-4 flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Secure & Trusted
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center">
                                        <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70">SSL Secure</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 flex items-center justify-center">
                                        <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Encrypted</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-8 h-8 mx-auto mb-1 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Safe Payment</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}