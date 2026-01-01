import { useEffect, useState } from 'react'
import api from '../../lib/api'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Textarea from '../../components/ui/Textarea.jsx'
import Select from '../../components/ui/Select.jsx'
import Button from '../../components/ui/Button.jsx'
import { motion } from 'framer-motion'
import { Video, Link2, Upload, AlertCircle, CheckCircle, FileVideo, Sparkles, Shield, Clock } from 'lucide-react'

export default function UploadLectures() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('link')
  const [video, setVideo] = useState(null)
  const [link, setLink] = useState('')
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
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [c, s] = await Promise.all([
          api.get('/classes'),
          api.get('/subjects')
        ])
        setClasses(c.data || [])
        setSubjects(s.data || [])
      } catch (e) {
        console.error('UploadLectures - Load error:', e)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const loadChapters = async () => {
      if (!classId || !subjectId) {
        setChapters([])
        return
      }
      try {
        const res = await api.get(`/chapters?class_id=${classId}&subject_id=${subjectId}`)
        setChapters(res.data || [])
      } catch (e) {
        console.error('Failed to load chapters', e)
      }
    }
    loadChapters()
  }, [classId, subjectId])

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('video/')) {
        setVideo(file)
      } else {
        setErr('Please upload a valid video file')
      }
    }
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      setErr('Title is required')
      return
    }

    if (type === 'link' && !link.trim()) {
      setErr('Link is required')
      return
    }

    if (type === 'file' && !video) {
      setErr('Video file is required')
      return
    }

    setMsg(''); setErr('')
    setLoading(true)

    try {
      const fd = new FormData()
      fd.append('title', title)
      fd.append('description', description)
      fd.append('type', type)

      if (subjectId) fd.append('subject_id', subjectId)
      if (classId) fd.append('class_id', classId)
      if (chapterId) fd.append('chapter_id', chapterId)
      if (isPremium !== undefined) fd.append('isPremium', isPremium)

      if (type === 'file' && video) fd.append('video', video)
      if (type === 'link') fd.append('link', link)

      await api.post('/lectures', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg('Lecture submitted successfully! Awaiting approval.')
      setTitle(''); setDescription(''); setVideo(null); setLink(''); setClassId(''); setSubjectId(''); setChapterId(''); setIsPremium(false)
    } catch (e) {
      setErr(e.response?.data?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-md">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-50">Upload Lectures</h1>
            <p className="text-amber-700 dark:text-amber-300">Share video content with your students</p>
          </div>
        </div>
      </motion.div>

      {/* Messages */}
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl border flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-800/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
        >
          <CheckCircle className="w-5 h-5" />
          <span>{msg}</span>
        </motion.div>
      )}

      {err && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl border flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
        >
          <AlertCircle className="w-5 h-5" />
          <span>{err}</span>
        </motion.div>
      )}

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="border border-amber-200 dark:border-amber-800 bg-gradient-to-br from-white to-amber-50/50 dark:from-gray-800 dark:to-amber-950/20">
          <div className="space-y-8">
            {/* Form Header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-50">Create New Lecture</h2>
            </div>

            <form onSubmit={submit} className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Input
                      label="Lecture Title *"
                      placeholder="Enter lecture title..."
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                      className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <Select
                      label="Lecture Type *"
                      value={type}
                      onChange={e => setType(e.target.value)}
                      required
                      className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                    >
                      <option value="link">Video Link</option>
                      <option value="file">Video File</option>
                    </Select>
                  </div>
                </div>

                <div>
                  <Textarea
                    label="Description"
                    placeholder="Provide a brief description of the lecture content..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                  />
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                    Describe what students will learn from this lecture
                  </p>
                </div>
              </div>

              {/* Class, Subject and Chapter */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-50">Target Audience</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Select
                      label="Class"
                      value={classId}
                      onChange={e => setClassId(e.target.value)}
                      disabled={!classes.length}
                      className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                    >
                      <option value="">Select class (optional)</option>
                      {classes.map(c => (
                        <option key={c._id || c.id} value={c._id || c.id}>{c.title}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Select
                      label="Subject"
                      value={subjectId}
                      onChange={e => setSubjectId(e.target.value)}
                      disabled={!subjects.length}
                      className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                    >
                      <option value="">Select subject (optional)</option>
                      {subjects.map(s => (
                        <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Select
                      label="Chapter"
                      value={chapterId}
                      onChange={e => setChapterId(e.target.value)}
                      disabled={!classId || !subjectId || !chapters.length}
                      className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                    >
                      <option value="">Select chapter (optional)</option>
                      {chapters.map(ch => (
                        <option key={ch._id || ch.id} value={ch._id || ch.id}>{ch.title}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                {!classes.length && (
                  <div className="flex items-start gap-3 px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        No classes found. Please add classes from Admin → Manage Classes first.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Access Control */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-50">Access Control</h3>
                <div>
                  <Select
                    label="Lecture Access"
                    value={isPremium ? 'premium' : 'free'}
                    onChange={e => setIsPremium(e.target.value === 'premium')}
                    className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                  >
                    <option value="free">Free - Available to all users</option>
                    <option value="premium">Premium - Requires premium subscription</option>
                  </Select>
                  <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-2">
                    {isPremium
                      ? '🔒 Only premium users will be able to view this lecture'
                      : '🌍 This lecture will be available to everyone, including non-logged-in users'
                    }
                  </p>
                </div>
              </div>

              {/* Content Upload */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-amber-900 dark:text-amber-50">Content</h3>

                {type === 'link' ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
                        <Link2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Video Link</span>
                    </div>
                    <Input
                      label="Video URL *"
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                      value={link}
                      onChange={e => setLink(e.target.value)}
                      required
                      className="border-amber-300 dark:border-amber-700 focus:border-amber-500 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-2 text-xs text-amber-600/70 dark:text-amber-400/70">
                      <Sparkles className="w-3 h-3" />
                      <span>Supports YouTube, Vimeo, and other video platforms</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg flex items-center justify-center">
                        <FileVideo className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Video File</span>
                    </div>

                    <div
                      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                        ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20'
                        : 'border-amber-300 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-600'
                        }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        onChange={e => setVideo(e.target.files?.[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="video/*"
                      />

                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto">
                          <Upload className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                        </div>

                        <div>
                          <p className="text-lg font-medium text-amber-900 dark:text-amber-100">
                            {video ? video.name : 'Drop video file here or click to browse'}
                          </p>
                          <p className="text-sm text-amber-600/70 dark:text-amber-400/70">
                            Maximum file size: 500MB. Supported formats: MP4, AVI, MOV
                          </p>
                        </div>
                      </div>
                    </div>

                    {video && (
                      <div className="flex items-center justify-between p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
                        <div className="flex items-center gap-3">
                          <FileVideo className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          <div>
                            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">{video.name}</p>
                            <p className="text-xs text-amber-600/70 dark:text-amber-400/70">{(video.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setVideo(null)}
                          className="p-1 rounded hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-amber-600 dark:text-amber-400"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-amber-600/70 dark:text-amber-400/70">
                      <Clock className="w-3 h-3" />
                      <span>Large files may take longer to upload</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t border-amber-200 dark:border-amber-800">
                <Button
                  type="submit"
                  loading={loading}
                  disabled={!title.trim() || (type === 'link' ? !link.trim() : !video)}
                  className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Uploading Lecture...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Lecture
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}