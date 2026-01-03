import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  CheckCircle,
  Award,
  Book,
  FileText as FileTextIcon,
  ArrowRight as ArrowRightIcon,
  TrendingUp,
  Star,
  PlayCircle,
  Shield,
  Target,
  Globe,
  Bot,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import ReviewCard from '../../components/ReviewCard';

export default function Home() {
  const [classes, setClasses] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes');
        const classData = Array.isArray(res.data?.data ? res.data.data : res.data)
          ? (res.data.data || res.data).slice(0, 4)
          : [];
        setClasses(classData);
      } catch (err) {
        console.error('Failed to fetch classes:', err);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await api.get('/reviews/latest');
        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };

    fetchClasses();
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen relative">

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-900 dark:via-stone-800 dark:to-gray-900 overflow-hidden pt-20 md:pt-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgb(245 158 11 / 0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        ></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2
              className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 dark:text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            >
              Master Every <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-500 dark:to-orange-500">
                Concept
              </span>
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            >
              Transform your education with AI-powered insights, interactive content, and a personalized learning journey designed for success.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
            >
              <Link
                to="/register"
                className="group px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 shadow-md"
              >
                Start Learning Free
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-10 py-4 bg-transparent border-2 border-amber-200 dark:border-amber-800/30 hover:border-amber-600 dark:hover:border-amber-500 text-gray-900 dark:text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-amber-50 dark:hover:bg-stone-800"
              >
                Log In
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Why Choose Us?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Experience the future of education with cutting-edge features
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: <Bot className="w-10 h-10 md:w-12 h-12 text-amber-600 dark:text-amber-400" />,
                title: 'Concept Master AI',
                description: 'Get 24/7 instant doubts resolution and personalized guidance from our advanced AI.',
                stats: 'Always Available',
                features: ['Instant answers', 'Concept explanation', 'Homework help'],
                borderColor: 'border-amber-200 dark:border-amber-900'
              },
              {
                icon: <FileTextIcon className="w-10 h-10 md:w-12 h-12 text-amber-600 dark:text-amber-400" />,
                title: 'Smart Notes',
                description: 'Comprehensive, easy-to-understand notes for every chapter and subject.',
                stats: 'All Subjects',
                features: ['Concise summaries', 'Key formulas', 'Downloadable PDF'],
                borderColor: 'border-amber-200 dark:border-amber-900'
              },
              {
                icon: <CheckCircle className="w-10 h-10 md:w-12 h-12 text-emerald-600 dark:text-emerald-400" />,
                title: 'AI-Graded Quizzes',
                description: 'Take quizzes and get instant AI grading with detailed performance analysis.',
                stats: 'Instant Feedback',
                features: ['Auto-grading', 'Weakness detection', 'Performance tracking'],
                borderColor: 'border-amber-200 dark:border-amber-900'
              },
              {
                icon: <PlayCircle className="w-10 h-10 md:w-12 h-12 text-amber-600 dark:text-amber-400" />,
                title: 'Premium Lectures',
                description: 'High-quality video lectures from expert educators to master every topic.',
                stats: 'HD Quality',
                features: ['Expert teachers', 'Visual learning', 'Topic-wise breakdown'],
                borderColor: 'border-amber-200 dark:border-amber-900'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className={`h-full p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl border ${feature.borderColor} hover:border-amber-300 dark:hover:border-amber-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col`}>
                  <div className="w-16 h-16 md:w-20 h-20 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed text-sm md:text-base flex-1">{feature.description}</p>

                  <div className="space-y-3 mb-6">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-3 h-3 md:w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-auto">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 dark:from-amber-900/50 dark:to-orange-900/50 dark:text-amber-300 uppercase tracking-wide">
                      {feature.stats}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Classes Section */}
      <section className="py-24 md:py-32 bg-gradient-to-br from-amber-50 to-stone-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Start Learning Now
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Select your class to access premium content
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {classes.map((cls, index) => (
              <motion.div
                key={cls._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Route path="/student/class/:id" element={<ClassDetails />} />
                  <div className="h-full p-6 md:p-8 rounded-2xl bg-white dark:bg-gray-800 border border-amber-200 dark:border-gray-700 hover:border-amber-500 dark:hover:border-amber-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 md:w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Active</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{cls.title || cls.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-sm flex-1">
                      {cls.description || 'Access comprehensive notes, lectures, and quizzes.'}
                    </p>

                    <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm group-hover:gap-3 transition-all">
                      <span>Explore Class</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/classes" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-gray-800 border border-amber-200 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold transition-all shadow-sm hover:shadow-md">
              View All Classes
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-900 border-t border-amber-100 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Student Success Stories
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Hear from our community of learners
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ReviewCard review={review} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/reviews" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold transition-all hover:scale-105 shadow-lg">
              View All Reviews
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-gradient-to-br from-white to-amber-50 dark:from-gray-900 dark:to-amber-950/30 relative overflow-hidden border-t border-amber-200 dark:border-amber-900/30">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5C16.2 5 5 16.2 5 30s11.2 25 25 25 25-11.2 25-25S43.8 5 30 5zm0 45C18.4 50 9 40.6 9 29S18.4 8 30 8s21 9.4 21 21-9.4 21-21 21z' fill='%23d97706' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px'
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-amber-900 dark:text-amber-100 mb-6 leading-tight">
              Ready to transform your journey?
            </h2>

            <div className="mt-8">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 text-lg md:text-xl font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Start Learning Free Today</span>
                <ArrowRightIcon className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="mt-10 flex justify-center items-center gap-4 text-amber-700 dark:text-amber-300 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>No credit card • Cancel anytime • Free forever plan</span>
            </div>
          </motion.div>
<div className="mt-12 pt-8 flex flex-wrap justify-center gap-4">
  {/* Active Learners */}
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center w-32">
    <Users className="w-6 h-6 text-amber-400 mb-1" />
    <div className="text-lg font-bold text-gray-900 dark:text-white">10K+</div>
    <div className="text-xs text-gray-700 dark:text-gray-300">Active Learners</div>
  </div>

  {/* Rating */}
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center w-32">
    <Star className="w-6 h-6 text-amber-400 mb-1" />
    <div className="text-lg font-bold text-gray-900 dark:text-white">4.9★</div>
    <div className="text-xs text-gray-700 dark:text-gray-300">Rating</div>
  </div>

  {/* Success Rate */}
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center w-32">
    <TrendingUp className="w-6 h-6 text-amber-400 mb-1" />
    <div className="text-lg font-bold text-gray-900 dark:text-white">98%</div>
    <div className="text-xs text-gray-700 dark:text-gray-300">Success Rate</div>
  </div>

  {/* Support */}
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col items-center w-32">
    <Shield className="w-6 h-6 text-amber-400 mb-1" />
    <div className="text-lg font-bold text-gray-900 dark:text-white">24/7</div>
    <div className="text-xs text-gray-700 dark:text-gray-300">Support</div>
  </div>
</div>

        </div>
      </section>
    </div>
  );
}
