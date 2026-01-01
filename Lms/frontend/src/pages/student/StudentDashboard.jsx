import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import Card from '../../components/ui/Card.jsx'
import { TrendingUp, Award, Target, BookOpen, Clock, Star, Activity, Calendar, Tag, PlayCircle, AlertCircle, GraduationCap, Sparkles, Brain, Users, ArrowRight, Trophy, BarChart3, TrendingDown } from 'lucide-react'

export default function StudentDashboard() {
  const [data, setData] = useState([])
  const [classes, setClasses] = useState([])
  const [userClass, setUserClass] = useState(null)
  const [classQuizzes, setClassQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get('/analytics/student/overview'),
      api.get('/classes'),
      api.get('/auth/me')
    ]).then(([analyticsRes, classesRes, userRes]) => {
      setData(analyticsRes.data.attempts || [])
      setClasses(classesRes.data || [])

      const user = userRes.data
      if (user.class_id) {
        const userClassInfo = classesRes.data.find(c => c.id === user.class_id)
        setUserClass(userClassInfo)
        return api.get(`/quizzes?class_id=${user.class_id}`)
      } else {
        return api.get('/quizzes')
      }
      return Promise.resolve({ data: { data: [] } })
    }).then(quizzesRes => {
      setClassQuizzes(quizzesRes.data.data || [])
      setLoading(false)
    }).catch((e) => {
      console.error('Student Dashboard Error:', e)
      setLoading(false)
    })
  }, [])

  const completed = data.length
  const avg = completed ? (data.reduce((s, a) => s + Number(a.percentage || 0), 0) / completed).toFixed(1) : 0
  const last = completed ? Number(data[data.length - 1]?.percentage || 0) : 0
  const best = completed ? Math.max(...data.map(d => Number(d.percentage || 0))) : 0
  const improvement = completed > 1 ? ((last - data[0]?.percentage) || 0).toFixed(1) : 0

  const recentActivity = data.slice(-5).reverse()

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Amber Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-amber-600 to-orange-600 text-white shadow-lg"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Student Dashboard</h1>
              <p className="text-lg opacity-90">Track your progress and keep improving</p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/20">
                <TrendingUp className="w-10 h-10" />
              </div>
            </div>
          </div>
          
          {userClass && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-medium">Class: {userClass.title}</span>
            </div>
          )}
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
      </motion.div>

      {/* Stats Grid with Amber Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Completed Quizzes',
            value: completed,
            icon: <BookOpen className="w-5 h-5" />,
            color: 'from-amber-500 to-orange-500',
            change: '+12% this month',
            trend: 'up'
          },
          {
            title: 'Average Score',
            value: `${avg}%`,
            icon: <Target className="w-5 h-5" />,
            color: 'from-emerald-500 to-green-500',
            change: `${improvement > 0 ? '+' : ''}${improvement}% improvement`,
            trend: improvement > 0 ? 'up' : 'down'
          },
          {
            title: 'Best Score',
            value: `${best}%`,
            icon: <Award className="w-5 h-5" />,
            color: 'from-amber-600 to-orange-600',
            change: 'Personal best',
            trend: 'up'
          },
          {
            title: 'Last Attempt',
            value: `${last}%`,
            icon: <Activity className="w-5 h-5" />,
            color: 'from-amber-700 to-orange-700',
            change: 'Recent activity',
            trend: 'stable'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="h-full"
          >
            <Card className="h-full border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${stat.trend === 'up' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  stat.trend === 'down' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                  {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                    stat.trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                      <BarChart3 className="w-3 h-3" />
                  }
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold mb-1 text-amber-900 dark:text-amber-50">{stat.value}</div>
              <div className="text-sm text-amber-600/70 dark:text-amber-400/70">{stat.title}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart with Amber Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card 
            title="Progress Over Time" 
            subtitle="Your performance trend"
            className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
          >
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              </div>
            ) : data.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fde68a" opacity={0.3} />
                    <XAxis 
                      dataKey="attempted_at" 
                      stroke="#92400e" 
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      stroke="#92400e" 
                      fontSize={12}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #92400e',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)'
                      }}
                      labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                      itemStyle={{ color: '#fde68a' }}
                      formatter={(value) => [`${value}%`, 'Score']}
                      labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="percentage"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      fill="url(#colorScore)"
                      dot={{ stroke: '#92400e', strokeWidth: 2, r: 4 }}
                      activeDot={{ stroke: '#92400e', strokeWidth: 2, r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">No data yet</h3>
                <p className="text-amber-600/70 dark:text-amber-400/70 text-center max-w-sm">
                  Complete your first quiz to see your progress chart
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Activity with Amber Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card 
            title="Recent Activity" 
            subtitle="Your latest quiz attempts"
            className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
          >
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm ${Number(activity.percentage) >= 80 ? 'bg-gradient-to-br from-emerald-500 to-green-500' :
                        Number(activity.percentage) >= 60 ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 'bg-gradient-to-br from-red-500 to-pink-500'
                        }`}>
                        {Math.round(Number(activity.percentage))}%
                      </div>
                      <div>
                        <div className="text-sm font-medium text-amber-900 dark:text-amber-50">Quiz Attempt #{data.length - index}</div>
                        <div className="text-xs text-amber-600/70 dark:text-amber-400/70">
                          {new Date(activity.attempted_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className={`p-1 rounded-lg ${Number(activity.percentage) >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                      Number(activity.percentage) >= 60 ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                        'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      }`}>
                      <Star className={`w-3 h-3 ${Number(activity.percentage) >= 80 ? 'fill-emerald-600 dark:fill-emerald-400' :
                        Number(activity.percentage) >= 60 ? 'fill-amber-600 dark:fill-amber-400' : 'fill-red-600 dark:fill-red-400'
                        }`} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-amber-600/70 dark:text-amber-400/70 py-6">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Class Quizzes Section with Amber Theme */}
      {(userClass || classQuizzes.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card 
            title={`${userClass ? userClass.title + ' ' : ''}Quizzes`} 
            subtitle={userClass ? `Available quizzes for your class` : `Available quizzes`}
            className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
          >
            {classQuizzes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz._id || quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 hover:shadow-xl transition-all duration-300 group hover:border-amber-300 dark:hover:border-amber-700">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${quiz.status === 'published' ? 'from-emerald-500 to-green-500' : 'from-gray-500 to-gray-600'} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${quiz.status === 'published'
                          ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900/30 dark:to-gray-800/30 text-gray-700 dark:text-gray-400'
                          }`}>
                          {quiz.status === 'published' ? <Sparkles className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {quiz.status === 'published' ? 'Available' : 'Draft'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold mb-2 text-amber-900 dark:text-amber-50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                        {quiz.title}
                      </h3>

                      {quiz.description && (
                        <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mb-3 line-clamp-2">
                          {quiz.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-4">
                        {/* Class Info */}
                        {quiz.class && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded flex items-center justify-center">
                              <GraduationCap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="font-medium text-amber-900 dark:text-amber-50">{quiz.class.title}</span>
                          </div>
                        )}

                        {/* Subject Info */}
                        {quiz.subject && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded flex items-center justify-center">
                              <Tag className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-amber-600/70 dark:text-amber-400/70">{quiz.subject.name}</span>
                          </div>
                        )}

                        {/* Deadline */}
                        {quiz.deadline && (
                          <div className="flex items-center gap-2 text-sm">
                            <div className={`w-6 h-6 rounded flex items-center justify-center ${new Date(quiz.deadline) < new Date()
                              ? 'bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30'
                              : 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30'
                              }`}>
                              <Calendar className={`w-3 h-3 ${new Date(quiz.deadline) < new Date()
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-amber-600 dark:text-amber-400'
                                }`} />
                            </div>
                            <span className={`font-medium ${new Date(quiz.deadline) < new Date()
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-amber-600 dark:text-amber-400'
                              }`}>
                              Due: {new Date(quiz.deadline).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-amber-600/70 dark:text-amber-400/70 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{quiz.duration_minutes || 0} min</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-amber-600/70 dark:text-amber-400/70">
                          Created: {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'Unknown'}
                        </div>

                        {quiz.status === 'published' ? (
                          <a
                            href={`/student/quiz/${quiz._id || quiz.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group/btn"
                          >
                            <PlayCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                            Start Quiz
                          </a>
                        ) : (
                          <button
                            disabled
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-300 to-gray-400 text-gray-500 text-sm font-medium cursor-not-allowed"
                          >
                            <AlertCircle className="w-4 h-4" />
                            Not Available
                          </button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-amber-600/70 dark:text-amber-400/70 py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">No quizzes available</h3>
                <p className="text-amber-600/70 dark:text-amber-400/70">
                  {userClass ? 'No quizzes have been assigned to your class yet' : 'No quizzes are currently available'}
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Quick Actions with Amber Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card 
          title="Quick Actions" 
          subtitle="Jump to your most used features"
          className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                title: 'Take Quiz', 
                icon: <BookOpen className="w-5 h-5" />, 
                href: '/student/quizzes', 
                color: 'from-amber-600 to-orange-600',
                description: 'Test your knowledge'
              },
              { 
                title: 'View Notes', 
                icon: <BookOpen className="w-5 h-5" />, 
                href: '/student/notes', 
                color: 'from-emerald-500 to-green-500',
                description: 'Study materials'
              },
              { 
                title: 'Watch Lectures', 
                icon: <PlayCircle className="w-5 h-5" />, 
                href: '/student/lectures', 
                color: 'from-blue-500 to-cyan-500',
                description: 'Video learning'
              },
              { 
                title: 'See Results', 
                icon: <Award className="w-5 h-5" />, 
                href: '/student/results', 
                color: 'from-purple-500 to-pink-500',
                description: 'Performance insights'
              }
            ].map((action, index) => (
              <a
                key={index}
                href={action.href}
                className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform backdrop-blur-sm">
                    {action.icon}
                  </div>
                  <div className="text-sm font-medium mb-1">{action.title}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                  <div className="mt-2 flex items-center justify-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </a>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Performance Summary */}
      {data.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card 
            title="Performance Summary" 
            subtitle="Your learning insights"
            className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-900 dark:text-amber-50">{avg}%</div>
                    <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Average Score</div>
                  </div>
                </div>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                  {avg >= 80 ? 'Excellent performance!' : 
                   avg >= 60 ? 'Good progress, keep going!' : 
                   'Keep practicing to improve!'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-900 dark:text-amber-50">{best}%</div>
                    <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Best Score</div>
                  </div>
                </div>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                  Your highest achievement so far
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-900 dark:text-amber-50">{completed}</div>
                    <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Quizzes Completed</div>
                  </div>
                </div>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                  {completed} quiz{completed !== 1 ? 'es' : ''} attempted
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}