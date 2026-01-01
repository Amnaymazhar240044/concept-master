import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, Unlock, AlertCircle, CheckCircle, Save, 
  Settings, Zap, Sparkles, Crown, Key, Users, Globe,
  ShieldCheck, Star, Award, Target, Brain, Rocket
} from 'lucide-react';
import api from '../../lib/api';

export default function FeatureControl() {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await api.get('/feature-control');
            setFeatures(res.data.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch feature settings:', err);
            setError('Failed to load settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (featureName, currentStatus) => {
        try {
            setSaving(true);
            const newStatus = !currentStatus;

            // Optimistic update
            setFeatures(prev => prev.map(f =>
                f.featureName === featureName ? { ...f, isPremium: newStatus } : f
            ));

            await api.patch('/feature-control/update', {
                featureName,
                isPremium: newStatus
            });

            setMessage({ type: 'success', text: `Feature updated successfully` });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            console.error('Failed to update feature:', err);
            // Revert optimistic update
            setFeatures(prev => prev.map(f =>
                f.featureName === featureName ? { ...f, isPremium: currentStatus } : f
            ));
            setMessage({ type: 'error', text: 'Failed to update feature' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
                >
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
                                <Settings className="w-8 h-8 text-amber-400 animate-spin" />
                            </div>
                            <span className="text-amber-600/70 dark:text-amber-400/70">Loading feature settings...</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                        <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                            Feature Control
                        </h1>
                        <p className="text-amber-600/70 dark:text-amber-400/70">
                            Manage which features are free and which require a premium subscription
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Messages */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 rounded-xl border flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 shadow-sm"
                >
                    <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </div>
                    <span>{error}</span>
                </motion.div>
            )}

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${message.type === 'success'
                        ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-800/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                        : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                        } shadow-sm`}
                >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'success'
                        ? 'bg-emerald-100 dark:bg-emerald-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                        )}
                    </div>
                    <span>{message.text}</span>
                </motion.div>
            )}

            {/* Stats Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
                <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">
                                {features.length}
                            </div>
                            <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Total Features</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                            <Unlock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">
                                {features.filter(f => !f.isPremium).length}
                            </div>
                            <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Free Features</div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                            <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">
                                {features.filter(f => f.isPremium).length}
                            </div>
                            <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Premium Features</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="space-y-4"
            >
                {features.map((feature) => (
                    <motion.div
                        key={feature._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-2xl p-6 border-2 border-amber-200 dark:border-amber-800 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            {/* Feature Info */}
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${feature.isPremium
                                        ? 'bg-gradient-to-br from-amber-600 to-orange-600'
                                        : 'bg-gradient-to-br from-emerald-500 to-green-600'
                                    }`}>
                                    {feature.isPremium ? (
                                        <Crown className="w-6 h-6 text-white" />
                                    ) : (
                                        <Unlock className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50 mb-1">
                                        {feature.label}
                                    </h3>
                                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                                        Currently: 
                                        <span className={`font-medium ml-1 ${feature.isPremium
                                                ? 'text-amber-600 dark:text-amber-400'
                                                : 'text-emerald-600 dark:text-emerald-400'
                                            }`}>
                                            {feature.isPremium ? 'Premium Only' : 'Free for Everyone'}
                                        </span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className={`text-xs px-2 py-1 rounded-full ${feature.isPremium
                                                ? 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300'
                                                : 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300'
                                            }`}>
                                            {feature.featureName}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Toggle Section */}
                            <div className="flex flex-col lg:items-end gap-3">
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm font-medium ${feature.isPremium
                                            ? 'text-amber-600 dark:text-amber-400'
                                            : 'text-emerald-600 dark:text-emerald-400'
                                        }`}>
                                        {feature.isPremium ? (
                                            <span className="flex items-center gap-1">
                                                <Crown className="w-4 h-4" />
                                                Premium
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <Users className="w-4 h-4" />
                                                Free
                                            </span>
                                        )}
                                    </span>
                                    <button
                                        onClick={() => handleToggle(feature.featureName, feature.isPremium)}
                                        disabled={saving}
                                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${feature.isPremium
                                                ? 'bg-gradient-to-r from-amber-600 to-orange-600'
                                                : 'bg-gradient-to-r from-emerald-600 to-green-600'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <span
                                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-all duration-300 shadow-lg ${feature.isPremium ? 'translate-x-7' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                                {saving && (
                                    <div className="flex items-center gap-2 text-xs text-amber-600/70 dark:text-amber-400/70">
                                        <div className="w-3 h-3 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                                        Saving...
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Summary Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-4 border-t border-amber-200 dark:border-amber-800"
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
                    <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        <span>Feature control helps balance accessibility and premium value</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span>Free: {features.filter(f => !f.isPremium).length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span>Premium: {features.filter(f => f.isPremium).length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span>Total: {features.length} features</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}