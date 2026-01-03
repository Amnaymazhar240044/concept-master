import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Download, FileText, Calendar, User,
  BookOpen, Folder, Award, Info, Eye, Book,
  GraduationCap, Clock, File, Printer, Share2,
  Maximize2, ExternalLink, ChevronLeft, ChevronRight,
  FileArchive, FileType
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function NoteView() {
  const { classId, id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [relatedNotes, setRelatedNotes] = useState([])
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    fetchNote()
  }, [id])

  const fetchNote = async () => {
    try {
      setLoading(true)
      const { data } = await api.get(`/notes/${id}`)
      setNote(data)

      // Fetch related notes from same subject
      if (data.subject_id) {
        const res = await api.get('/notes', {
          params: {
            subject_id: data.subject_id._id || data.subject_id,
            class_id: data.class_id?._id || data.class_id,
            limit: 3
          }
        })
        setRelatedNotes(res.data.data?.filter(n => n._id !== data._id) || [])
      }
    } catch (error) {
      console.error('Error fetching note:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!note.file_path || note.is_descriptive_only) return

    setDownloading(true)
    try {
      const response = await api.get(`/notes/${id}/download`, {
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', note.file_name || `note-${note.title}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download file. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getFileIcon = () => {
    if (!note) return <File className="w-8 h-8" />

    if (note.is_descriptive_only) {
      return <Book className="w-8 h-8 text-blue-500" />
    }

    switch (note.file_type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileType className="w-8 h-8 text-blue-500" />
      case 'ppt':
      case 'pptx':
        return <FileArchive className="w-8 h-8 text-orange-500" />
      case 'txt':
        return <FileText className="w-8 h-8 text-gray-500" />
      default:
        return <FileText className="w-8 h-8 text-gray-500" />
    }
  }

  const handlePrint = () => {
    if (note.file_type === 'pdf' && note.file_path) {
      window.open(`${window.location.origin}${note.file_path}`, '_blank')
    } else {
      window.print()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-700 dark:text-amber-300">Loading note...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950 flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-amber-200 dark:border-amber-800 p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Info className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Note Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                The note you're looking for doesn't exist or has been removed.
              </p>
            </div>
            <button
              onClick={() => navigate(`/student/notes/${classId}`)}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Back to Notes
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isDescriptive = note.is_descriptive_only || !note.file_path
  const hasFile = !isDescriptive && note.file_path
  const isPDF = note.file_type === 'pdf' && hasFile

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-amber-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/student/notes/${classId}`)}
            className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Notes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Note Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-xl ${isDescriptive ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                      {getFileIcon()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {note.title}
                        </h1>
                        {isDescriptive && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            <Info className="w-3 h-3 inline mr-1" />
                            Descriptive Note
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {note.subject_id && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {note.subject_id.name}
                          </span>
                        )}
                        {note.class_id && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {note.class_id.title}
                          </span>
                        )}
                        {note.chapter_id && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                            <Folder className="w-3 h-3 mr-1" />
                            {note.chapter_id.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Info Card (only for notes with files) */}
                {hasFile && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                          {getFileIcon()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {note.file_name || 'File Attachment'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {note.file_type?.toUpperCase()} • 
                            {note.file_size ? ` ${Math.round(note.file_size / 1024)}KB` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isPDF && (
                          <button
                            onClick={() => window.open(`${window.location.origin}${note.file_path}`, '_blank')}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                        <button
                          onClick={handlePrint}
                          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                          title="Print"
                        >
                          <Printer className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-amber-500" />
                    Description
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                    {note.description ? (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {note.description}
                      </p>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No description provided for this note.
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Download Button (only for notes with files) */}
                  {hasFile && (
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      {downloading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Download File
                        </>
                      )}
                    </button>
                  )}

                  {/* Share Button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href)
                      alert('Link copied to clipboard!')
                    }}
                    className="px-6 py-3 border-2 border-amber-300 dark:border-amber-700 text-amber-600 dark:text-amber-400 font-semibold rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all flex items-center gap-2"
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>

            {/* PDF Viewer (only for PDF files) */}
            {isPDF && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 overflow-hidden ${fullscreen ? 'fixed inset-4 z-50' : ''}`}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-500" />
                    PDF Preview
                  </h3>
                  <button
                    onClick={() => setFullscreen(!fullscreen)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {fullscreen ? (
                      <Maximize2 className="w-4 h-4 text-gray-500" />
                    ) : (
                      <Maximize2 className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
                <div className={`${fullscreen ? 'h-[calc(100vh-8rem)]' : 'h-96'}`}>
                  <iframe
                    src={`${window.location.origin}${note.file_path}`}
                    className="w-full h-full border-0"
                    title="PDF Preview"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">
            {/* Note Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 p-5"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" />
                Note Details
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded By</p>
                  <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {note.uploaded_by?.name || 'Teacher'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Upload Date</p>
                  <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(note.createdAt)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {note.approved ? 'Approved' : 'Pending Approval'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {getFileIcon()}
                    {isDescriptive ? 'Descriptive Note' : `${note.file_type?.toUpperCase()} File`}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Related Notes */}
            {relatedNotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-200 dark:border-amber-800 p-5"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  Related Notes
                </h3>
                
                <div className="space-y-3">
                  {relatedNotes.map((relatedNote) => (
                    <div
                      key={relatedNote._id || relatedNote.id}
                      onClick={() => navigate(`/student/notes/${classId}/view/${relatedNote._id || relatedNote.id}`)}
                      className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors border border-gray-100 dark:border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${relatedNote.is_descriptive_only ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                          {relatedNote.is_descriptive_only ? (
                            <Book className="w-4 h-4 text-blue-500" />
                          ) : (
                            <FileText className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                            {relatedNote.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {relatedNote.is_descriptive_only ? 'Descriptive' : relatedNote.file_type?.toUpperCase() || 'File'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}