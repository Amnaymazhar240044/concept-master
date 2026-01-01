import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ArrowLeft, GraduationCap, Sparkles, CheckCircle, Brain, Target, Award, BookOpen } from 'lucide-react'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await register({ name, email, password, role: 'student' })
      
      setSuccess('Account created successfully! Redirecting to dashboard...')
      
      // Wait a moment to show success message before redirecting
      setTimeout(() => {
        navigate('/')
      }, 1500)
      
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950">
      {/* Premium Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-amber-200/50 dark:border-amber-900/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                  Concept Master
                </span>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 opacity-75">Student Registration</div>
              </div>
            </Link>

            {/* Back to Home */}
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-all duration-200 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="hidden lg:flex flex-col space-y-10"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100/80 to-orange-100/80 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full text-amber-700 dark:text-amber-300 text-sm font-semibold mb-6 border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4" />
                Start Learning Today!
              </motion.div>

              <h1 className="text-5xl lg:text-6xl font-black mb-4 text-amber-900 dark:text-amber-50 leading-tight">
                Join Us
                
              </h1>

              <p className="text-xl text-amber-700/90 dark:text-amber-300/90 leading-relaxed max-w-lg">
                Begin your journey with AI-powered personalized learning designed to help you master concepts faster.
              </p>
            </div>

            {/* Student Benefits */}
            <div className="space-y-4">
              {[
                { 
                  icon: Brain, 
                  text: 'AI-Powered Learning', 
                  desc: 'Personalized study plans that adapt to your pace'
                },
                { 
                  icon: BookOpen, 
                  text: 'Interactive Content', 
                  desc: 'Engage with quizzes, videos, and interactive lessons'
                },
                { 
                  icon: Target, 
                  text: 'Track Progress', 
                  desc: 'Monitor your improvement with detailed analytics'
                },
                { 
                  icon: Award, 
                  text: 'Earn Certificates', 
                  desc: 'Get recognized for your achievements'
                }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-white/50 dark:bg-gray-800/30 rounded-xl border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">{feature.text}</h3>
                    <p className="text-sm text-amber-700/80 dark:text-amber-300/80">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Simple Stats */}
            <div className="pt-6 border-t border-amber-200/50 dark:border-amber-800/50">
              <p className="text-amber-700 dark:text-amber-300">
                <span className="font-bold text-amber-600 dark:text-amber-400">15,000+ students</span> are already learning with us
              </p>
            </div>
          </motion.div>

          {/* Right Side - Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-amber-200 dark:border-amber-800 p-8 lg:p-10">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-50">Create Student Account</h2>
                    <p className="text-amber-700 dark:text-amber-300">
                      Sign up and start your learning journey
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  {success}
                </div>
              )}

              <form onSubmit={submit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-amber-900 dark:text-amber-100 placeholder-amber-500/60"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-amber-900 dark:text-amber-100 placeholder-amber-500/60"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-amber-700 dark:text-amber-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      minLength="8"
                      className="w-full pl-12 pr-12 py-3.5 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-amber-900 dark:text-amber-100 placeholder-amber-500/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-amber-400 disabled:to-orange-400 text-white font-bold rounded-xl transition-all hover:shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Student Account
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6 pt-6 border-t border-amber-200 dark:border-amber-800">
                <p className="text-amber-700 dark:text-amber-300">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}