import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, Cell
} from 'recharts'
import Card from '../../components/ui/Card.jsx'
import { motion } from 'framer-motion'
import { 
  TrendingUp, Target, Brain, Award, Sparkles, 
  BarChart3, TrendingDown, Zap, BrainCircuit, 
  GraduationCap, ChartBar, TargetIcon, Trophy
} from 'lucide-react'

export default function Performance() {
  const [slo, setSlo] = useState([])
  const [topic, setTopic] = useState([])
  const [loading, setLoading] = useState(true)
  const [overallAccuracy, setOverallAccuracy] = useState(0)
  const [weakestTopic, setWeakestTopic] = useState('')
  const [strongestTopic, setStrongestTopic] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [sloResponse, topicResponse] = await Promise.all([
          api.get('/analytics/student/slo-accuracy'),
          api.get('/analytics/student/topic-accuracy')
        ])
        
        const sloData = sloResponse.data || []
        const topicData = topicResponse.data || []
        
        setSlo(sloData)
        setTopic(topicData)

        // Calculate overall accuracy
        if (topicData.length > 0) {
          const totalAccuracy = topicData.reduce((sum, item) => sum + (item.accuracy || 0), 0)
          const avgAccuracy = totalAccuracy / topicData.length
          setOverallAccuracy(Math.round(avgAccuracy))

          // Find weakest and strongest topics
          const sortedTopics = [...topicData].sort((a, b) => a.accuracy - b.accuracy)
          if (sortedTopics.length > 0) {
            setWeakestTopic(sortedTopics[0]?.topic || '')
            setStrongestTopic(sortedTopics[sortedTopics.length - 1]?.topic || '')
          }
        }
      } catch (error) {
        console.error('Failed to load performance data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
        >
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-6">
              <ChartBar className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <span className="text-amber-600/70 dark:text-amber-400/70">Loading performance analytics...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              Performance Analytics
            </h1>
            <p className="text-amber-600/70 dark:text-amber-400/70">Track your learning progress and identify areas for improvement</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">
                  {overallAccuracy}%
                </div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Overall Accuracy</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-amber-900 dark:text-amber-50">
                  {strongestTopic || 'N/A'}
                </div>
                <div className="text-xs text-amber-600/70 dark:text-amber-400/70">Strongest Topic</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-amber-900 dark:text-amber-50">
                  {weakestTopic || 'N/A'}
                </div>
                <div className="text-xs text-amber-600/70 dark:text-amber-400/70">Needs Improvement</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* SLO Accuracy Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg h-full">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                  <TargetIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">SLO Accuracy</h3>
                  <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Student Learning Outcomes performance</p>
                </div>
              </div>
              
              <div className="h-[300px]">
                <Chart data={slo} xKey="slo" title="SLO" />
              </div>

              {/* Chart Summary */}
              {slo.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
                    <div className="text-xs text-amber-600/70 dark:text-amber-400/70">Highest SLO</div>
                    <div className="text-sm font-semibold text-amber-900 dark:text-amber-50">
                      {slo.reduce((max, item) => item.accuracy > max.accuracy ? item : max, slo[0])?.slo || 'N/A'}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
                    <div className="text-xs text-amber-600/70 dark:text-amber-400/70">Average</div>
                    <div className="text-sm font-semibold text-amber-900 dark:text-amber-50">
                      {Math.round(slo.reduce((sum, item) => sum + (item.accuracy || 0), 0) / slo.length)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Topic Accuracy Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg h-full">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                  <BrainCircuit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Topic Accuracy</h3>
                  <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Performance across different topics</p>
                </div>
              </div>
              
              <div className="h-[300px]">
                <Chart data={topic} xKey="topic" title="Topic" />
              </div>

              {/* Chart Summary */}
              {topic.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
                    <div className="text-xs text-amber-600/70 dark:text-amber-400/70">Best Topic</div>
                    <div className="text-sm font-semibold text-amber-900 dark:text-amber-50">
                      {topic.reduce((max, item) => item.accuracy > max.accuracy ? item : max, topic[0])?.topic || 'N/A'}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
                    <div className="text-xs text-amber-600/70 dark:text-amber-400/70">Topics Covered</div>
                    <div className="text-sm font-semibold text-amber-900 dark:text-amber-50">
                      {topic.length}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Performance Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Performance Insights</h3>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Tips to improve your learning journey</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800/30 dark:to-amber-950/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-50">Focus on Weak Areas</span>
            </div>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
              Review topics with lower accuracy and practice more questions in those areas.
            </p>
          </div>
          
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800/30 dark:to-amber-950/10">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-50">Consistent Practice</span>
            </div>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
              Regular practice improves retention and helps maintain high accuracy scores.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Footer */}
      {(slo.length > 0 || topic.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t border-amber-200 dark:border-amber-800"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>Regularly track your performance to identify patterns and improve learning strategies</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>SLOs: {slo.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Topics: {topic.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Updated: Daily</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function Chart({ data, xKey, title }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-4">
          <ChartBar className="w-8 h-8 text-amber-400" />
        </div>
        <span className="text-amber-600/70 dark:text-amber-400/70">No {title?.toLowerCase()} data available</span>
      </div>
    )
  }

  const getColorForValue = (value) => {
    if (value >= 80) return '#10b981' // Green for excellent
    if (value >= 60) return '#f59e0b' // Amber for good
    return '#ef4444' // Red for needs improvement
  }

  const formatXAxis = (value) => {
    // Truncate long labels and add ellipsis
    return value.length > 15 ? value.substring(0, 12) + '...' : value
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-amber-200 dark:border-amber-800">
          <p className="font-medium text-amber-900 dark:text-amber-100">{label}</p>
          <p className="text-sm" style={{ color: getColorForValue(payload[0].value) }}>
            Accuracy: <span className="font-bold">{payload[0].value}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#fbbf24" opacity={0.3} />
        <XAxis
          dataKey={xKey}
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fill: '#92400e', fontSize: 12 }}
          tickFormatter={formatXAxis}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: '#92400e', fontSize: 12 }}
          label={{ 
            value: 'Accuracy %', 
            angle: -90, 
            position: 'insideLeft',
            offset: 10,
            fill: '#92400e'
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="accuracy"
          radius={[4, 4, 0, 0]}
          name="Accuracy"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColorForValue(entry.accuracy)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}