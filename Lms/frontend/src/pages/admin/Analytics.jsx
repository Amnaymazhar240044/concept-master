import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Trophy, TrendingUp, Users, Activity, Sparkles, Award, Target, Zap } from 'lucide-react'

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/admin/analytics/dashboard')
        setData(data)
      } catch (error) {
        console.error("Failed to fetch analytics", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) return (
    <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-8 text-center border border-amber-200 dark:border-amber-800">
      <div className="w-12 h-12 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
        <Activity className="w-6 h-6 text-amber-600 dark:text-amber-400" />
      </div>
      <p className="text-amber-700 dark:text-amber-300">Loading analytics...</p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-amber-600/70 dark:text-amber-400/70 text-sm">Comprehensive platform insights and performance metrics</p>
          </div>
        </div>
      </div>

      {/* Top Students Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold text-amber-900 dark:text-amber-50">Top Students</h2>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Leaderboard by average score</p>
            </div>
          </div>
          <div className="space-y-3">
            {data?.topStudents?.map((student, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 border border-amber-200 dark:border-amber-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-sm">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white' :
                  index === 1 ? 'bg-gradient-to-r from-amber-300 to-orange-300 text-amber-900' :
                  index === 2 ? 'bg-gradient-to-r from-orange-300 to-amber-300 text-orange-900' :
                  'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-amber-900 dark:text-amber-100 truncate">{student.name}</div>
                  <div className="text-xs text-amber-600/70 dark:text-amber-400/70">{student.attempts} attempts</div>
                </div>
                <div className="font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {student.avgScore}%
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-amber-200 dark:border-amber-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-600/70 dark:text-amber-400/70">Based on last 30 days performance</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-500"></div>
                  <span className="text-emerald-600 dark:text-emerald-400">High Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Daily Activity Chart */}
          <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-amber-900 dark:text-amber-50">Daily Activity</h2>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Platform usage over last 7 days</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.dailyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FBBF24" opacity={0.1} />
                  <XAxis 
                    dataKey="_id" 
                    stroke="#92400E" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#92400E" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #92400E',
                      borderRadius: '8px', 
                      color: '#fff'
                    }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#FBBF24' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#F59E0B" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#F59E0B' }} 
                    activeDot={{ r: 6, fill: '#D97706' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Chart Summary */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-amber-600/70 dark:text-amber-400/70">
                Total activity: {data?.dailyActivity?.reduce((sum, day) => sum + day.count, 0)} sessions
              </span>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-medium">Active Trend</span>
              </div>
            </div>
          </div>

          {/* Quiz Performance Chart */}
          <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="font-bold text-amber-900 dark:text-amber-50">Quiz Performance</h2>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">Average scores across quizzes</p>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.quizPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FBBF24" opacity={0.1} />
                  <XAxis 
                    dataKey="title" 
                    stroke="#92400E" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#92400E" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #92400E',
                      borderRadius: '8px', 
                      color: '#fff'
                    }}
                    formatter={(value) => [`${value}%`, 'Avg Score']}
                  />
                  <Bar 
                    dataKey="avgScore" 
                    fill="url(#quizGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="quizGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Performance Summary */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-amber-600/70 dark:text-amber-400/70">
                Overall average: {data?.quizPerformance?.reduce((sum, quiz) => sum + quiz.avgScore, 0) / data?.quizPerformance?.length || 0}%
              </span>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-500" />
                <span className="text-amber-600 dark:text-amber-400 font-medium">Performance Metrics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}