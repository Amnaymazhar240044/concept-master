import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Clock, BookOpen, PlayCircle, Calendar, Tag, 
  AlertCircle, CheckCircle, GraduationCap, User, Sparkles,
  Brain, Target, Award, Zap, BrainCircuit, Timer, 
  FileQuestion, Users, Crown, Star, Rocket
} from 'lucide-react'

export default function QuizDetail() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasAttempted, setHasAttempted] = useState(false)
  const [existingAttempt, setExistingAttempt] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quiz details
        const quizResponse = await api.get(`/quizzes/${id}`)
        console.log('QuizDetail - Quiz data:', quizResponse.data)
        setQuiz(quizResponse.data)

        // Check if student has already attempted
        try {
          const attemptResponse = await api.get(`/quizzes/${id}/my-attempt`)
          setHasAttempted(true)
          setExistingAttempt(attemptResponse.data)
        } catch (err) {
          // No attempt found, which is fine
          setHasAttempted(false)
        }
      } catch (err) {
        console.error('QuizDetail - Error:', err)
        setError('Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

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
              <BrainCircuit className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>
            <span className="text-amber-600/70 dark:text-amber-400/70">Loading quiz details...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
            <AlertCircle className="w-6 h-6" />
            <span>{error}</span>
          </div>
        </Card>
      </motion.div>
    </div>
  )

  if (!quiz) return null

  // Check if deadline has passed - removed since deadline doesn't exist in database
  const isDeadlinePassed = false

  // Show existing attempt result
  if (hasAttempted && existingAttempt) return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center gap-4 mb-2">
          <Link
            to="/student/quizzes"
            className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                Quiz Result
              </h1>
              <p className="text-amber-600/70 dark:text-amber-400/70">Your attempt summary</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-50">{quiz.title}</h2>
                <p className="text-amber-600/70 dark:text-amber-400/70">
                  Score: {existingAttempt.score}/{existingAttempt.quiz?.questions?.length || 0} ({existingAttempt.percentage}%)
                </p>
              </div>
              <div className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-semibold">
                Completed
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{existingAttempt.score}</div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Correct Answers</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{existingAttempt.percentage}%</div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Percentage</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {existingAttempt.quiz?.questions?.length || 0}
                </div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Total Questions</div>
              </div>
            </div>

            <div className="text-center text-sm text-amber-600/70 dark:text-amber-400/70 pt-4 border-t border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Completed: {new Date(existingAttempt.completed_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

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
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Performance Summary</h3>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Review your quiz attempt</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800/30 dark:to-amber-950/10">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-50">Accuracy Rate</span>
            </div>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
              You answered {existingAttempt.percentage}% of questions correctly
            </p>
          </div>
          
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800/30 dark:to-amber-950/10">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-50">Next Steps</span>
            </div>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
              Review incorrect answers to improve your understanding
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )

  // Show deadline passed message - removed since deadline doesn't exist
  if (false) return null

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center gap-4 mb-2">
          <Link
            to={`/student/quizzes${quiz.class_id ? `/${quiz.class_id}` : ''}`}
            className="p-2 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 text-amber-600 dark:text-amber-400 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                Quiz Details
              </h1>
              <p className="text-amber-600/70 dark:text-amber-400/70">Review quiz information before attempting</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quiz Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${quiz.status === 'published'
                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
                : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                }`}>
                {quiz.status === 'published' ? 'Available Now' : 'Coming Soon'}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-3 text-amber-900 dark:text-amber-50">
                {quiz.title}
              </h2>

              {quiz.description && (
                <p className="text-amber-600/70 dark:text-amber-400/70 mb-6 text-lg">
                  {quiz.description}
                </p>
              )}
            </div>

            <div className="space-y-4">
              {/* Class Info */}
              {quiz.class && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-medium text-amber-900 dark:text-amber-50">Class</div>
                    <div className="text-amber-600/70 dark:text-amber-400/70">{quiz.class.title}</div>
                  </div>
                </div>
              )}

              {/* Subject Info */}
              {quiz.subject && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-medium text-amber-900 dark:text-amber-50">Subject</div>
                    <div className="text-amber-600/70 dark:text-amber-400/70">{quiz.subject.name}</div>
                  </div>
                </div>
              )}

              {/* Duration */}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="font-medium text-amber-900 dark:text-amber-50">Duration</div>
                  <div className="text-amber-600/70 dark:text-amber-400/70">{quiz.duration_minutes || 0} minutes</div>
                </div>
              </div>

              {/* Questions Count */}
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <FileQuestion className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="font-medium text-amber-900 dark:text-amber-50">Questions</div>
                  <div className="text-amber-600/70 dark:text-amber-400/70">{quiz.questions?.length || 0} total questions</div>
                </div>
              </div>

              {/* Created By */}
              {quiz.creator && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <div className="font-medium text-amber-900 dark:text-amber-50">Created By</div>
                    <div className="text-amber-600/70 dark:text-amber-400/70">{quiz.creator.name}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 text-xs text-amber-600/70 dark:text-amber-400/70">
                <Calendar className="w-3 h-3" />
                <span>Created: {quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : 'Unknown date'}</span>
              </div>

              {quiz.status === 'published' ? (
                <Link
                  to={`/student/quiz/${quiz._id || quiz.id}/attempt`}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold hover:shadow-xl transition-all duration-300 hover:scale-[1.02] shadow-md"
                >
                  <PlayCircle className="w-5 h-5" />
                  Start Quiz
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-600 dark:text-amber-400 font-bold cursor-not-allowed"
                >
                  <AlertCircle className="w-5 h-5" />
                  Quiz Not Available
                </button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Quiz Instructions</h3>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Please read before starting</p>
              </div>
            </div>

            <div className="space-y-3 text-amber-600/70 dark:text-amber-400/70">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>You have {quiz.duration_minutes || 0} minutes to complete this quiz</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Once started, the quiz cannot be paused or restarted</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Make sure you have a stable internet connection throughout</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>Each question has only one correct answer unless otherwise specified</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                <span>You can navigate between questions using previous/next buttons</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Preparation Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Preparation Tips</h3>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Maximize your quiz performance</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800/30 dark:to-amber-950/10">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-50">Review Materials</span>
            </div>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
              Review your notes and study materials before starting
            </p>
          </div>
          
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800/30 dark:to-amber-950/10">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-900 dark:text-amber-50">Time Management</span>
            </div>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
              Allocate time wisely across all questions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-4 border-t border-amber-200 dark:border-amber-800"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-amber-600/70 dark:text-amber-400/70">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Take your time and read each question carefully before answering</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Ready to Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>{quiz.questions?.length || 0} Questions</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}