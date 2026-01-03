import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, ArrowRight, Star, TrendingUp, Loader2, CheckCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';

export default function PublicClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes');
        setClasses(res.data.data || res.data || []);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
        setError('Failed to load classes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-900 dark:via-stone-800 dark:to-gray-900 flex items-center justify-center relative">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgb(245 158 11 / 0.1) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>
        <div className="text-center relative z-10">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-900 dark:via-stone-800 dark:to-gray-900 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(245 158 11 / 0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl md:text-5xl font-black mb-6">
                  Choose Your <span className="text-amber-200">Class</span>
                </h1>
                <p className="text-xl opacity-90 mb-8">
                  Join thousands of students mastering their subjects with our comprehensive curriculum
                </p>
                <div className="flex justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-200" />
                    <span className="text-amber-100">10,000+ Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-200" />
                    <span className="text-amber-100">4.9★ Rating</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          {error ? (
            <div className="text-center py-12">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-amber-200 dark:border-amber-800 max-w-md mx-auto">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Unable to Load Classes</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium rounded-xl transition-all shadow-md"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-amber-200 dark:border-amber-800 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Classes Available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  New academic sessions will be available soon.
                </p>
                <Link 
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-amber-200 dark:border-amber-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-amber-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls, index) => (
                <motion.div
                  key={cls._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group"
                >
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-amber-200 dark:border-amber-800 overflow-hidden h-full flex flex-col">
                    {/* Card Header */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {cls.title || cls.name || `Class ${index + 1}`}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 rounded-full font-medium">
                              Active
                            </span>
                            <span className="text-xs text-amber-600 dark:text-amber-400">Comprehensive</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
                        {cls.description || 'Comprehensive curriculum covering all core subjects with expert-led sessions.'}
                      </p>
                    </div>

                    {/* Card Body */}
                    <div className="px-6 pb-6 flex-1">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Students</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {cls.studentCount || '120+'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Subjects</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {cls.subjects?.length || 5}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-6 pb-6">
                      <Link
                        to={`/class/${cls._id}`}
                        className="block w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-center rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg group-hover:scale-[1.02]"
                      >
                        <span>Explore Class</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 mb-6 border border-amber-200 dark:border-amber-800">
              <span className="text-sm font-semibold">Why Choose Us</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Excellence in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Education</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We provide a world-class learning environment designed to help you succeed academically.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: CheckCircle, 
                title: 'Expert Faculty', 
                desc: 'Learn from certified teachers with years of teaching experience.',
              },
              { 
                icon: BookOpen, 
                title: 'Interactive Learning', 
                desc: 'Engage with content through quizzes, live sessions, and activities.',
              },
              { 
                icon: TrendingUp, 
                title: 'Progress Tracking', 
                desc: 'Monitor your growth with detailed analytics and feedback.',
              },
              { 
                icon: Shield, 
                title: 'Safe Environment', 
                desc: 'Learn in a secure platform with 24/7 support.',
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mb-4 shadow-sm">
                    <item.icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}