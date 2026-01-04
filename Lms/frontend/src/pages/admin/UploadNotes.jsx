import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Textarea from '../../components/ui/Textarea.jsx'
import Button from '../../components/ui/Button.jsx'
import Select from '../../components/ui/Select.jsx'
import { motion } from 'framer-motion'
import { Upload, FileText, AlertCircle, CheckCircle, FolderOpen, Info, Layers, BookOpen, Sparkles, Target, Award, Brain, Zap, X } from 'lucide-react'

export default function UploadNotes() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [chapters, setChapters] = useState([])

  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [chapterId, setChapterId] = useState('')

  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const loadDependencies = async () => {
      setLoading(true)
      try {
        const [c, s] = await Promise.all([
          api.get('/classes'),
          api.get('/subjects')
        ])
        setClasses(c.data || [])
        setSubjects(s.data || [])
      } catch (e) {
        console.error('UploadNotes - Dependencies error:', e)
      }
      setLoading(false)
    }
    loadDependencies()
  }, [])

  useEffect(() => {
    const loadChapters = async () => {
      if (!classId || !subjectId) {
        setChapters([])
        setChapterId('')
        return
      }
      try {
        const { data } = await api.get('/chapters', {
          params: { class_id: classId, subject_id: subjectId }
        })
        setChapters(data || [])
      } catch (e) {
        console.error('Failed to load chapters', e)
      }
    }
    loadChapters()
  }, [classId, subjectId])

  const formatDescription = (text) => {
    if (!text) return '';
    
    // Remove excessive newlines (more than 2)
    text = text.replace(/\n{3,}/g, '\n\n');
    
    // Trim whitespace from each line
    text = text.split('\n').map(line => line.trim()).join('\n');
    
    // Ensure proper paragraph spacing - replace single newlines with space, keep double newlines
    text = text.replace(/([^\n])\n([^\n])/g, '$1 $2');
    
    return text;
  };

  const submit = async (e) => {
    e.preventDefault()
    setMsg('')
    setErr('')
    setUploading(true)

    try {
      const fd = new FormData()
      fd.append('title', title.trim())
      
      // Format description before sending
      const formattedDescription = formatDescription(description);
      fd.append('description', formattedDescription)
      
      if (classId) fd.append('class_id', classId)
      if (subjectId) fd.append('subject_id', subjectId)
      if (chapterId) fd.append('chapter_id', chapterId)
      // File is now optional - only append if exists
      if (file) {
        fd.append('note', file)
      }

      const response = await api.post('/notes', fd, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      })

      // Custom success message based on whether file was uploaded
      const successMessage = file 
        ? 'Notes with file uploaded successfully! Your students can now access this material.'
        : 'Descriptive note created successfully! Your students can now access this material.'

      setMsg(successMessage)
      
      // Reset form
      setTitle('')
      setDescription('')
      setFile(null)
      setClassId('')
      setSubjectId('')
      setChapterId('')
      
    } catch (e) {
      console.error('Upload error:', e)
      setErr(e.response?.data?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                         'text/plain', 'application/vnd.ms-powerpoint',
                         'application/vnd.openxmlformats-officedocument.presentationml.presentation']
      
      if (validTypes.includes(droppedFile.type) || 
          droppedFile.name.match(/\.(pdf|doc|docx|txt|ppt|pptx)$/i)) {
        setFile(droppedFile)
      } else {
        setErr('Invalid file type. Please upload PDF, DOC, DOCX, TXT, PPT, or PPTX files.')
      }
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErr('File size exceeds 10MB limit. Please choose a smaller file.')
        return
      }
      setFile(selectedFile)
      setErr('')
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  }

  // Validation: Title, Class, and Subject are required, File is optional
  const isFormValid = title.trim() && classId && subjectId

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-md">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-orange-700 dark:from-amber-200 dark:to-orange-200 bg-clip-text text-transparent">
              Upload Study Notes
            </h1>
            <p className="text-amber-600/70 dark:text-amber-400/70">Share educational materials with your students</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-800/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 shadow-sm"
        >
          <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span>{msg}</span>
        </motion.div>
      )}

      {err && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-3 shadow-sm"
        >
          <div className="w-5 h-5 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
          </div>
          <span>{err}</span>
        </motion.div>
      )}

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="overflow-hidden bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20 border border-amber-200 dark:border-amber-800 shadow-lg">
          <form onSubmit={submit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Basic Information</h2>
                  <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Provide essential details about your notes</p>
                </div>
              </div>

              <div>
                <Input
                  label="Title *"
                  placeholder="Enter note title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>

              <div>
                <Textarea
                  label="Description"
                  placeholder={`Write your description here. Use paragraphs for better readability.

For example:
This note covers the fundamentals of algebra including variables, equations, and expressions.

Key topics include:
- Linear equations
- Quadratic functions
- Polynomial expressions

Make sure to practice all examples for better understanding.`}
                  value={description}
                  onChange={handleDescriptionChange}
                  rows={8}
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500 whitespace-pre-wrap"
                />
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg border border-blue-200 dark:border-blue-800 mt-2">
                  <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Writing Tips:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Write in complete paragraphs for better readability</li>
                      <li>Use double line breaks for paragraph spacing</li>
                      <li>Bullet points are preserved with dashes or asterisks</li>
                      <li>Formatting will be cleaned for consistent display</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                  <FolderOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Classification</h2>
                  <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Organize notes for easy discovery</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Select
                    label="Class *"
                    value={classId}
                    onChange={e => setClassId(e.target.value)}
                    disabled={!classes.length}
                    className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
                    ))}
                  </Select>
                  {!classes.length && (
                    <div className="absolute -bottom-6 left-0 text-xs text-amber-600/70 dark:text-amber-400/70">
                      No classes available
                    </div>
                  )}
                </div>

                <Select
                  label="Subject *"
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  disabled={!subjects.length}
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => (
                    <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                  ))}
                </Select>

                <Select
                  label="Chapter (Optional)"
                  value={chapterId}
                  onChange={e => setChapterId(e.target.value)}
                  disabled={!chapters.length}
                  className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                >
                  <option value="">Select Chapter</option>
                  {chapters.map(ch => (
                    <option key={ch._id || ch.id} value={ch._id || ch.id}>{ch.title}</option>
                  ))}
                </Select>
              </div>

              {!classes.length && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-medium mb-1">No classes available</p>
                    <p>Please contact your administrator to add classes first.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-amber-600/70 dark:text-amber-400/70">
                <Target className="w-4 h-4" />
                <span>Proper classification helps students find materials faster</span>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-sm">
                  <Upload className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">File Upload</h2>
                  <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Select your study notes file (Optional)</p>
                </div>
              </div>

              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive
                  ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-inner'
                  : 'border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800/50 dark:to-amber-950/10'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                />

                <div className="space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-sm ${file
                    ? 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30'
                    : 'bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20'
                    }`}>
                    {file ? (
                      <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Upload className="w-8 h-8 text-amber-500 dark:text-amber-400" />
                    )}
                  </div>

                  <div>
                    <p className="text-lg font-medium text-amber-900 dark:text-amber-100">
                      {file ? (
                        <span className="flex items-center justify-center gap-2">
                          <FileText className="w-5 h-5 text-amber-500" />
                          {file.name}
                        </span>
                      ) : (
                        'Drop your file here or click to browse (Optional)'
                      )}
                    </p>
                    <p className="text-sm text-amber-600/70 dark:text-amber-400/70 mt-1">
                      Upload PDF, DOC, DOCX, TXT, PPT, or PPTX files (Max 10MB). 
                      <span className="font-semibold ml-1">File is optional - descriptive notes are also accepted.</span>
                    </p>
                  </div>
                </div>
              </div>

              {file && (
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{file.name}</p>
                      <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to upload
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}

              {!file && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm">
                  <div className="w-5 h-5 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Descriptive Notes Only</p>
                    <p>You can create notes without uploading a file. Just provide a title, description, and classification. The system will create a text-based note for students.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-amber-600/70 dark:text-amber-400/70">
                <Sparkles className="w-4 h-4" />
                <span>Upload high-quality materials for better student engagement. Descriptive notes help when you don't have a file.</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-amber-200 dark:border-amber-800">
              <Button
                type="submit"
                disabled={!isFormValid || uploading}
                loading={uploading}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {file ? 'Uploading Notes...' : 'Creating Note...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    {file ? 'Upload Notes with File' : 'Create Descriptive Note'}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}