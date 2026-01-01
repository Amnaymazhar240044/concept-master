import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { useParams } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { 
  AlertCircle, Clock, CheckCircle, Calendar, Sparkles,
  Brain, Target, BrainCircuit, Hourglass, Zap, 
  Award, TrendingUp, BookOpen, ArrowLeft, ArrowRight,
  Shield, Star, Timer, Users, GraduationCap
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AttemptQuiz() {
  const { id } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitted, setSubmitted] = useState(null)
  const [current, setCurrent] = useState(0)
  const [hasAttempted, setHasAttempted] = useState(false)
  const [existingAttempt, setExistingAttempt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Helper to get question ID (handles both _id and id)
  const getQuestionId = (question) => question._id || question.id

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quiz details
        const quizResponse = await api.get(`/quizzes/${id}`)
        console.log('AttemptQuiz - Quiz data:', quizResponse.data)
        console.log('AttemptQuiz - Questions:', quizResponse.data.questions)
        setQuiz(quizResponse.data)
        setTimeLeft((quizResponse.data.duration_minutes || 1) * 60)

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
        console.error('AttemptQuiz - Error:', err)
        setError('Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    if (!timeLeft || submitted) return
    const t = setInterval(() => setTimeLeft((s) => s > 0 ? s - 1 : 0), 1000)
    return () => clearInterval(t)
  }, [timeLeft, submitted])

  useEffect(() => {
    if (timeLeft === 0 && !submitted && quiz) {
      submit()
    }
  }, [timeLeft])

  const submit = async () => {
    const total = quiz?.questions?.length || 0
    const answeredCount = Object.keys(answers).length
    if (answeredCount < total) {
      const confirmProceed = window.confirm(`You answered ${answeredCount}/${total} questions. Submit anyway?`)
      if (!confirmProceed) return
    }
    try {
      setSubmitting(true)
      const payload = {
        answers: Object.entries(answers).map(([qid, val]) => ({
          question_id: qid,
          [quiz.type === 'SHORT_ANSWER' ? 'answer_text' : 'selected_option_index']: val
        }))
      }
      const { data } = await api.post(`/quizzes/${id}/attempts`, payload)
      setSubmitted(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center mb-6">
            <BrainCircuit className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
          <span className="text-amber-600/70 dark:text-amber-400/70">Loading quiz...</span>
        </div>
      </motion.div>
    </div>
  )

  if (error) return (
    <div className="max-w-6xl mx-auto space-y-6">
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
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-50">Quiz Attempted</h1>
              <p className="text-amber-600/70 dark:text-amber-400/70">You have already completed this quiz</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">{existingAttempt.score}/{existingAttempt.quiz?.questions?.length || 0}</div>
                  <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Score</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-50">{existingAttempt.percentage}%</div>
                  <div className="text-sm text-amber-600/70 dark:text-amber-400/70">Percentage</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-amber-50 dark:from-gray-800/50 dark:to-amber-950/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-amber-900 dark:text-amber-50">
                    {new Date(existingAttempt.completed_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-amber-600/70 dark:text-amber-400/70">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )

  // Show deadline passed message - removed since deadline doesn't exist
  if (false) return null

  if (submitted) return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              Quiz Results
            </h1>
            <p className="text-amber-600/70 dark:text-amber-400/70">
              Score: {submitted.score}/{submitted.total} ({submitted.percentage}%)
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
          <p className="text-amber-600/70 dark:text-amber-400/70">
            {quiz.type === 'SHORT_ANSWER'
              ? "AI has graded your answers. Review the feedback below."
              : "Great job! Review questions to learn from mistakes."}
          </p>
        </div>
      </motion.div>

      {/* Detailed Results for Short Answer */}
      {quiz.type === 'SHORT_ANSWER' && submitted.attempt_id && (
        <ShortAnswerResults attemptId={submitted.attempt_id} quiz={quiz} />
      )}
    </div>
  )

  // Show loading overlay when submitting
  if (submitting) return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-4"
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20">
          <div className="text-center space-y-6 py-8">
            {/* Animated Spinner */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-200 border-t-amber-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-600 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-50">
                {quiz.type === 'SHORT_ANSWER' ? 'AI is Verifying Your Answers' : 'Submitting Your Quiz'}
              </h3>
              <p className="text-amber-600/70 dark:text-amber-400/70 animate-pulse">
                Please wait...
              </p>
            </div>

            {/* Additional context for AI grading */}
            {quiz.type === 'SHORT_ANSWER' && (
              <div className="text-sm text-amber-500/70 dark:text-amber-400/70 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <p>Our AI is carefully evaluating each answer to provide detailed feedback.</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  )

  const getDeadlineWarning = () => {
    // Removed since deadline doesn't exist in database
    return null
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Timer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 py-4 bg-gradient-to-br from-white to-amber-50/80 dark:from-gray-800/80 dark:to-amber-950/20 backdrop-blur border-b border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
              <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-amber-900 dark:text-amber-50 truncate">{quiz.title}</h2>
              <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                {quiz.type === 'SHORT_ANSWER' ? 'Short Answer Quiz' : 'Multiple Choice'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-xl shadow-md">
              <Timer className="w-4 h-4" />
              <span className="font-mono font-bold text-lg">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
            <Button 
              onClick={submit}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Submit Quiz
            </Button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-2 rounded-full bg-amber-100 dark:bg-amber-900/30 overflow-hidden">
          {(() => {
            const total = (quiz?.duration_minutes || 1) * 60; const pct = total ? ((total - timeLeft) / total * 100) : 0; return (
              <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-[width] duration-300" style={{ width: pct + '%' }} />
            )
          })()}
        </div>
      </motion.div>

      {/* Questions Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Questions</h3>
              <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                {Object.keys(answers).length} of {quiz.questions?.length || 0} answered
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {quiz.questions?.map((q, i) => {
              const qId = getQuestionId(q)
              const isAnswered = answers[qId] !== undefined
              const isActive = i === current
              return (
                <motion.button 
                  key={qId} 
                  onClick={() => setCurrent(i)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-9 h-9 rounded-md text-sm font-medium border-2 transition-all duration-200 ${isActive 
                    ? 'bg-gradient-to-br from-amber-600 to-orange-600 text-white border-amber-600 shadow-md' 
                    : isAnswered 
                      ? 'bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 shadow-sm' 
                      : 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md'}`}
                >
                  {i + 1}
                </motion.button>
              )
            })}
          </div>
        </Card>
      </motion.div>

      {/* Current Question */}
      {quiz.questions && quiz.questions[current] && (() => {
        const currentQ = quiz.questions[current]
        const currentQId = getQuestionId(currentQ)
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                    <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Question {current + 1}</h3>
                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70">{currentQ.text}</p>
                  </div>
                </div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">
                  {current + 1} of {quiz.questions?.length}
                </div>
              </div>

              <div className="space-y-4">
                {quiz.type === 'SHORT_ANSWER' ? (
                  <div className="relative">
                    <label className="block text-sm font-medium text-amber-600/70 dark:text-amber-400/70 mb-2">
                      Your Answer
                    </label>
                    <textarea
                      className="w-full p-4 rounded-xl border-2 border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors text-amber-900 dark:text-amber-100 placeholder-amber-500/60 dark:placeholder-amber-400/40"
                      rows={5}
                      placeholder="Type your detailed answer here..."
                      value={answers[currentQId] || ''}
                      onChange={e => setAnswers({ ...answers, [currentQId]: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-amber-600/70 dark:text-amber-400/70 mb-2">
                      Select an option
                    </label>
                    {currentQ.options.map((opt, idx) => (
                      <motion.label 
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${answers[currentQId] === idx 
                          ? 'border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 ring-2 ring-amber-500/30' 
                          : 'border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600 hover:bg-amber-50/50 dark:hover:bg-amber-900/10'}`}
                      >
                        <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[currentQId] === idx 
                          ? 'border-amber-600 bg-amber-600' 
                          : 'border-amber-400 dark:border-amber-600'}`}
                        >
                          {answers[currentQId] === idx && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <input 
                          className="hidden" 
                          type="radio" 
                          name={`q-${currentQId}`} 
                          onChange={() => setAnswers({ ...answers, [currentQId]: idx })} 
                        />
                        <span className="text-amber-900 dark:text-amber-100">{opt}</span>
                      </motion.label>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t border-amber-200 dark:border-amber-800">
                <Button 
                  variant="secondary" 
                  onClick={() => setCurrent(c => Math.max(0, c - 1))}
                  className="flex items-center gap-2 px-6 py-2.5 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setCurrent(c => Math.min((quiz.questions?.length || 1) - 1, c + 1))}
                  className="flex items-center gap-2 px-6 py-2.5 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )
      })()}
    </div>
  )
}

function ShortAnswerResults({ attemptId, quiz }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/results/attempts/${attemptId}/details`)
      .then(r => {
        console.log('Results response:', r.data)
        setResults(r.data.quiz_results || r.data || [])
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [attemptId, quiz])

  if (loading) return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center py-12"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
        <BrainCircuit className="w-6 h-6 text-amber-400 animate-spin" />
      </div>
    </motion.div>
  )

  const correctCount = results.filter(r => r.correct).length
  const totalCount = results.length
  const percentage = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6">
      {/* Score Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 border-2 border-amber-200 dark:border-amber-800 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50 mb-1">Quiz Results</h3>
              <p className="text-sm text-amber-600/70 dark:text-amber-400/70">AI has graded your answers</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
                {correctCount}/{totalCount}
              </div>
              <div className="text-sm text-amber-600/70 dark:text-amber-400/70">{percentage}% Correct</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-3 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
            ></motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Results List */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-50">Detailed Feedback</h3>
        </div>

        {results.map((res, idx) => {
          const question = quiz.questions?.find(q => q._id === res.question_id?._id || q._id === res.question_id || q.id === res.question_id?._id || q.id === res.question_id)
          const isCorrect = res.correct

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`border-l-4 transition-all duration-300 hover:shadow-lg ${isCorrect
                ? 'border-l-emerald-500 bg-gradient-to-br from-emerald-50/30 to-green-50/30 dark:from-emerald-900/10 dark:to-green-900/10'
                : 'border-l-amber-500 bg-gradient-to-br from-amber-50/30 to-orange-50/30 dark:from-amber-900/10 dark:to-orange-900/10'
                }`}>
                <div className="space-y-4">
                  {/* Header with Question Number and Status */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      )}
                      <h3 className="font-semibold text-lg text-amber-900 dark:text-amber-50">
                        Question {idx + 1}
                      </h3>
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${isCorrect
                        ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300'
                        : 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300'
                        }`}
                    >
                      {isCorrect ? '✓ Correct' : '✗ Needs Review'}
                    </span>
                  </div>

                  {/* Question Text */}
                  <div className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                    <p className="font-medium text-sm text-amber-600/70 dark:text-amber-400/70 mb-2">Question:</p>
                    <p className="text-amber-900 dark:text-amber-100 leading-relaxed">
                      {question?.text || res.question_id?.text || 'Question not found'}
                    </p>
                  </div>

                  {/* Student Answer */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                    <p className="font-medium text-sm text-amber-600/70 dark:text-amber-400/70 mb-2">Your Answer:</p>
                    <p className="text-amber-900 dark:text-amber-100 leading-relaxed">
                      {res.student_answer_text || 'No answer provided'}
                    </p>
                  </div>

                  {/* AI Feedback */}
                  {res.ai_feedback && (
                    <div
                      className={`p-4 rounded-xl border ${isCorrect
                        ? 'bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-900/10 dark:to-green-900/10 border-emerald-200 dark:border-emerald-800'
                        : 'bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className={`w-4 h-4 ${isCorrect
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                          }`} />
                        <p className={`font-medium text-sm ${isCorrect
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-amber-700 dark:text-amber-300'
                          }`}>
                          AI Feedback
                        </p>
                      </div>
                      <p className="text-amber-900 dark:text-amber-100 leading-relaxed">
                        {res.ai_feedback.feedback || res.ai_feedback}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}