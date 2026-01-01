import { useState, useEffect } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Select from '../../components/ui/Select.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit3, Clock, Target, BookOpen, AlertCircle, CheckCircle, Info, Sparkles, Brain, Zap, Shield, Award } from 'lucide-react'

export default function CreateQuiz() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(10)
  const [deadline, setDeadline] = useState('')
  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [status, setStatus] = useState('draft')
  const [type, setType] = useState('MCQ')
  const [questions, setQuestions] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch classes and subjects
    api.get('/classes').then(r => {
      console.log('Classes response:', r.data)
      setClasses(r.data || [])
    }).catch(e => {
      console.error('Classes error:', e)
    })
    api.get('/subjects').then(r => {
      console.log('Subjects response:', r.data)
      setSubjects(r.data || [])
    }).catch(e => {
      console.error('Subjects error:', e)
    })
  }, [])

  const addQuestion = () => setQuestions([...questions, { text: '', options: ['', ''], correct: 0, slo_tag: '', topic: '' }])

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index)
    setQuestions(newQuestions)
  }

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const addOption = (questionIndex) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options.push('')
    setQuestions(newQuestions)
  }

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions]
    const options = newQuestions[questionIndex].options
    if (options.length > 2) {
      options.splice(optionIndex, 1)
      // Adjust correct index if needed
      if (newQuestions[questionIndex].correct >= options.length) {
        newQuestions[questionIndex].correct = options.length - 1
      }
      setQuestions(newQuestions)
    }
  }

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions]
    newQuestions[questionIndex].options[optionIndex] = value
    setQuestions(newQuestions)
  }

  const create = async () => {
    setMsg('')
    setLoading(true)

    try {
      const { data: quiz } = await api.post('/quizzes', {
        title,
        description,
        duration_minutes: Number(duration),
        deadline: deadline || null,
        class_id: classId || null,
        subject_id: subjectId || null,
        status,
        type
      })

      for (const q of questions) {
        await api.post(`/quizzes/${quiz._id || quiz.id}/questions`, {
          text: q.text,
          options: q.options.filter(opt => opt.trim()),
          correct_option_index: q.correct,
          slo_tag: q.slo_tag,
          topic: q.topic,
        })
      }

      setMsg('Quiz created successfully! Students can now access this assessment.')
      setTitle(''); setDescription(''); setDuration(10); setDeadline(''); setClassId(''); setSubjectId(''); setStatus('draft'); setType('MCQ'); setQuestions([])
    } catch (error) {
      setMsg(error.response?.data?.message || 'Failed to create quiz. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = title.trim() && questions.length > 0 && questions.every(q =>
    q.text.trim() && (type === 'SHORT_ANSWER' || q.options.filter(opt => opt.trim()).length >= 2)
  )

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
            <Edit3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              Create Quiz
            </h1>
            <p className="text-amber-600/70 dark:text-amber-400/70">Design interactive assessments for your students</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl border flex items-center gap-3 ${msg.includes('success')
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-800/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
            } shadow-sm`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${msg.includes('success')
            ? 'bg-emerald-100 dark:bg-emerald-900/30'
            : 'bg-red-100 dark:bg-red-900/30'
            }`}>
            {msg.includes('success') ? (
              <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
            )}
          </div>
          <span>{msg}</span>
        </motion.div>
      )}

      {/* Quiz Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Quiz Details</h2>
                <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Define the basic parameters of your quiz</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Enter quiz title"
                  label="Quiz Title *"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-amber-700 dark:text-amber-300">Description</label>
                <textarea
                  placeholder="Enter quiz description (optional)"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:outline-none transition-colors text-amber-900 dark:text-amber-100 placeholder-amber-500/60 dark:placeholder-amber-400/40"
                />
              </div>
              <div>
                <Select
                  label="Class *"
                  value={classId}
                  onChange={e => setClassId(e.target.value)}
                  required
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                >
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Select
                  label="Subject (Optional)"
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Duration in minutes"
                  label="Duration (minutes) *"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  min="1"
                  max="180"
                  required
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <Input
                  type="datetime-local"
                  label="Deadline (Optional)"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <Select
                  label="Status *"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </Select>
              </div>
              <div>
                <Select
                  label="Quiz Type *"
                  value={type}
                  onChange={e => {
                    setType(e.target.value);
                    setQuestions([]); // Reset questions when type changes
                  }}
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="SHORT_ANSWER">Short Answer (AI Graded)</option>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-amber-600/70 dark:text-amber-400/70">
              <Sparkles className="w-4 h-4" />
              <span>Proper configuration helps students understand quiz expectations</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Questions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                  <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Questions</h2>
                  <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                    {questions.length} question{questions.length !== 1 ? 's' : ''} added
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={addQuestion}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </Button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-xl bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-100 mb-2">No Questions Yet</h3>
                <p className="text-amber-600/70 dark:text-amber-400/70 mb-4">Start building your quiz by adding questions</p>
                <Button 
                  onClick={addQuestion} 
                  className="flex items-center gap-2 mx-auto bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                  Add First Question
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, questionIndex) => (
                  <Card key={questionIndex} className="border-l-4 border-l-amber-500 bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-800 dark:to-amber-950/10 border border-amber-200 dark:border-amber-800 shadow-sm">
                    <div className="space-y-4">
                      {/* Question Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-300">{questionIndex + 1}</span>
                          </div>
                          <h3 className="text-lg font-medium text-amber-900 dark:text-amber-50">Question {questionIndex + 1}</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Question Text */}
                      <div>
                        <Input
                          placeholder="Enter your question here..."
                          label={`Question ${questionIndex + 1} *`}
                          value={q.text}
                          onChange={e => updateQuestion(questionIndex, 'text', e.target.value)}
                          required
                          className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>

                      {/* Options - Only for MCQ */}
                      {type === 'MCQ' && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium text-amber-700 dark:text-amber-300">Answer Options *</label>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => addOption(questionIndex)}
                              className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20"
                            >
                              <Plus className="w-3 h-3" />
                              Add Option
                            </Button>
                          </div>

                          <div className="space-y-2">
                            {q.options.map((opt, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${q.correct === optionIndex
                                    ? 'border-amber-500 bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm'
                                    : 'border-amber-300 dark:border-amber-700'
                                    }`}>
                                    {String.fromCharCode(65 + optionIndex)}
                                  </div>
                                  <Input
                                    placeholder={`Option ${optionIndex + 1}`}
                                    value={opt}
                                    onChange={e => updateOption(questionIndex, optionIndex, e.target.value)}
                                    className="flex-1 border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                                    required
                                  />
                                </div>

                                {q.options.length > 2 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOption(questionIndex, optionIndex)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Correct Answer Selector */}
                          <div className="mt-3">
                            <Select
                              value={q.correct}
                              onChange={e => updateQuestion(questionIndex, 'correct', Number(e.target.value))}
                              label="Correct Answer *"
                              className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                            >
                              {q.options.map((_, idx) => (
                                <option key={idx} value={idx}>
                                  {String.fromCharCode(65 + idx)} - {q.options[idx] || 'Option ' + (idx + 1)}
                                </option>
                              ))}
                            </Select>
                          </div>
                        </div>
                      )}

                      {/* Additional Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Student Learning Outcome tag"
                          value={q.slo_tag}
                          onChange={e => updateQuestion(questionIndex, 'slo_tag', e.target.value)}
                          label="SLO Tag"
                          className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                        />
                        <Input
                          placeholder="Topic or category"
                          value={q.topic}
                          onChange={e => updateQuestion(questionIndex, 'topic', e.target.value)}
                          label="Topic"
                          className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-amber-600/70 dark:text-amber-400/70">
                        <Brain className="w-3 h-3" />
                        <span>Clear questions help students demonstrate their understanding</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Submit Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Ready to Publish?</h3>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-amber-600/70 dark:text-amber-400/70">
                  <BookOpen className="w-3 h-3" />
                  <span>{questions.length} question{questions.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-600/70 dark:text-amber-400/70">
                  <Clock className="w-3 h-3" />
                  <span>{duration} minutes</span>
                </div>
                {classId && (
                  <div className="flex items-center gap-1 text-amber-600/70 dark:text-amber-400/70">
                    <Zap className="w-3 h-3" />
                    <span>Class assigned</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setTitle(''); setDuration(10); setStatus('draft'); setType('MCQ'); setQuestions([])
                }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20"
              >
                Clear All
              </Button>

              <Button
                onClick={create}
                disabled={!isFormValid || loading}
                loading={loading}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Quiz...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Create Quiz
                  </span>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}