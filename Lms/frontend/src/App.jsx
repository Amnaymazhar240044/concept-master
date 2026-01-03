import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import Notes from './pages/student/Notes.jsx'
import NoteView from './pages/student/NoteView.jsx'
import Lectures from './pages/student/Lectures.jsx'
import QuizList from './pages/student/QuizList.jsx'
import QuizDetail from './pages/student/QuizDetail.jsx'
import AttemptQuiz from './pages/student/AttemptQuiz.jsx'
import Results from './pages/student/Results.jsx'
import Performance from './pages/student/Performance.jsx'
import ConceptMasterAI from './pages/student/ConceptMasterAI.jsx'
import UploadNotes from './pages/admin/UploadNotes.jsx'
import UploadLectures from './pages/admin/UploadLectures.jsx'
import CreateQuiz from './pages/admin/CreateQuiz.jsx'
import ManageQuizzes from './pages/admin/ManageQuizzes.jsx'
import StudentAttempts from './pages/admin/StudentAttempts.jsx'
import Analytics from './pages/admin/Analytics.jsx'
import ManageUsers from './pages/admin/ManageUsers.jsx'
import SystemOverview from './pages/admin/SystemOverview.jsx'
import ManageSubjects from './pages/admin/ManageSubjects.jsx'
import ManageChapters from './pages/admin/ManageChapters.jsx'
import ManageNotes from './pages/admin/ManageNotes.jsx'
import ManageClasses from './pages/admin/ManageClasses.jsx'
import ManageBooks from './pages/admin/ManageBooks.jsx'
import FeatureControl from './pages/admin/FeatureControl.jsx'
import Layout from './components/Layout.jsx'
import Home from './pages/public/Home.jsx'
import Books from './pages/public/Books.jsx'
import BookDetail from './pages/public/BookDetail.jsx'
import PublicClasses from './pages/public/Classes.jsx'
import PublicNotes from './pages/public/PublicNotes.jsx'
import Pricing from './pages/public/Pricing.jsx'
import Checkout from './pages/public/Checkout.jsx'
import Reviews from './pages/Reviews.jsx'
import Settings from './pages/Settings.jsx'
import ClassLayout from './pages/public/class-details/ClassLayout.jsx'
import ClassOverview from './pages/public/class-details/ClassOverview.jsx'
import ClassNotes from './pages/public/class-details/ClassNotes.jsx'
import ClassLectures from './pages/public/class-details/ClassLectures.jsx'
import ClassQuizzes from './pages/public/class-details/ClassQuizzes.jsx'
import ClassBooks from './pages/public/class-details/ClassBooks.jsx'

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeOrDashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="books/detail/:bookId" element={<BookDetail />} />
          <Route path="books/:grade" element={<Books />} />
          <Route path="classes" element={<PublicClasses />} />
          <Route path="notes" element={<PublicNotes />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="reviews" element={<Reviews />} />

          {/* Public Class Details Routes */}
          <Route path="class/:classId" element={<ClassLayout />}>
            <Route index element={<ClassOverview />} />
            <Route path="notes" element={<ClassNotes />} />
            <Route path="lectures" element={<ClassLectures />} />
            <Route path="quizzes" element={<ClassQuizzes />} />
            <Route path="books" element={<ClassBooks />} />
          </Route>

          <Route path="dashboard" element={
            <ProtectedRoute roles={["student", "admin"]}>
              <DashRouter />
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="student/books" element={<ProtectedRoute roles={["student"]}><Books /></ProtectedRoute>} />
          <Route path="student/books/:grade" element={<ProtectedRoute roles={["student"]}><Books /></ProtectedRoute>} />
          
          {/* Student Class Details */}
          <Route path="student/class/:classId" element={
            <ProtectedRoute roles={["student"]}>
              <ClassLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ClassOverview />} />
            <Route path="notes" element={<ClassNotes />} />
            <Route path="lectures" element={<ClassLectures />} />
            <Route path="quizzes" element={<ClassQuizzes />} />
            <Route path="books" element={<ClassBooks />} />
          </Route>
          
          <Route path="student/notes/:classId/view/:id" element={
            <ProtectedRoute roles={["student"]}>
              <NoteView />
            </ProtectedRoute>
          } />
          
          <Route path="student/notes" element={<ProtectedRoute roles={["student"]}><Notes /></ProtectedRoute>} />
          <Route path="student/notes/:classId" element={<ProtectedRoute roles={["student"]}><Notes /></ProtectedRoute>} />
          <Route path="student/lectures" element={<ProtectedRoute roles={["student"]}><Lectures /></ProtectedRoute>} />
          <Route path="student/lectures/:classId" element={<ProtectedRoute roles={["student"]}><Lectures /></ProtectedRoute>} />
          <Route path="student/quizzes" element={<ProtectedRoute roles={["student"]}><QuizList /></ProtectedRoute>} />
          <Route path="student/quizzes/:classId" element={<ProtectedRoute roles={["student"]}><QuizList /></ProtectedRoute>} />
          <Route path="student/quiz/:id" element={<ProtectedRoute roles={["student"]}><QuizDetail /></ProtectedRoute>} />
          <Route path="student/quiz/:id/attempt" element={<ProtectedRoute roles={["student"]}><AttemptQuiz /></ProtectedRoute>} />
          <Route path="student/results" element={<ProtectedRoute roles={["student"]}><Results /></ProtectedRoute>} />
          <Route path="student/performance" element={<ProtectedRoute roles={["student"]}><Performance /></ProtectedRoute>} />
          <Route path="student/ai-tutor" element={<ProtectedRoute roles={["student"]}><ConceptMasterAI /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="admin/manage-users" element={<ProtectedRoute roles={["admin"]}><ManageUsers /></ProtectedRoute>} />
          <Route path="admin/manage-subjects" element={<ProtectedRoute roles={["admin"]}><ManageSubjects /></ProtectedRoute>} />
          <Route path="admin/manage-chapters" element={<ProtectedRoute roles={["admin"]}><ManageChapters /></ProtectedRoute>} />
          <Route path="admin/manage-notes" element={<ProtectedRoute roles={["admin"]}><ManageNotes /></ProtectedRoute>} />
          <Route path="admin/manage-classes" element={<ProtectedRoute roles={["admin"]}><ManageClasses /></ProtectedRoute>} />
          <Route path="admin/manage-books" element={<ProtectedRoute roles={["admin"]}><ManageBooks /></ProtectedRoute>} />
          <Route path="admin/feature-control" element={<ProtectedRoute roles={["admin"]}><FeatureControl /></ProtectedRoute>} />
          <Route path="admin/system-overview" element={<ProtectedRoute roles={["admin"]}><SystemOverview /></ProtectedRoute>} />

          {/* Migrated Teacher Features to Admin */}
          <Route path="admin/upload-notes" element={<ProtectedRoute roles={["admin"]}><UploadNotes /></ProtectedRoute>} />
          <Route path="admin/upload-lectures" element={<ProtectedRoute roles={["admin"]}><UploadLectures /></ProtectedRoute>} />
          <Route path="admin/create-quiz" element={<ProtectedRoute roles={["admin"]}><CreateQuiz /></ProtectedRoute>} />
          <Route path="admin/manage-quizzes" element={<ProtectedRoute roles={["admin"]}><ManageQuizzes /></ProtectedRoute>} />
          <Route path="admin/student-attempts" element={<ProtectedRoute roles={["admin"]}><StudentAttempts /></ProtectedRoute>} />
          <Route path="admin/analytics" element={<ProtectedRoute roles={["admin"]}><Analytics /></ProtectedRoute>} />

          {/* Settings */}
          <Route path="settings" element={<ProtectedRoute roles={["student", "admin"]}><Settings /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

function DashRouter() {
  const { user } = useAuth()
  if (!user) return null
  if (user.role === 'student') return <StudentDashboard />
  if (user.role === 'admin') return <AdminDashboard />
  return null
}

function HomeOrDashboard() {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />
  return <Home />
}