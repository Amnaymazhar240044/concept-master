import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../lib/api'
import { ArrowLeft, Calendar, User, Download, FileText, Eye } from 'lucide-react'

export default function NoteView() {
  const { classId, noteId } = useParams()
  const navigate = useNavigate()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/notes/${noteId}`)
        setNote(response.data)
      } catch (err) {
        console.error('Failed to fetch note:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [noteId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-amber-600">Loading note...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Note Not Found</h2>
          <p className="text-gray-600 mb-6">The note you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(`/student/notes/${classId}`)}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
          >
            Back to Notes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to={`/student/notes/${classId}`}
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Notes
        </Link>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{note.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(note.created_at || note.createdAt).toLocaleDateString()}
            </div>
            {note.uploaded_by?.name && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{note.uploaded_by.name}</span>
              </div>
            )}
          </div>
          
          {note.description && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-gray-700">{note.description}</p>
            </div>
          )}

          {note.content && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Content</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                {note.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {note.file_path && (
            <div className="mt-8">
              <a
                href={note.file_path}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          )}

          {!note.content && !note.file_path && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No content available for this note</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}