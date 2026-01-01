# Concept Master API

Base URL: /api
Auth: Bearer JWT in Authorization header

## Auth
- POST /auth/register { name, email, password, role }
- POST /auth/login { email, password }
- GET /auth/me

## Notes
- GET /notes?subject_id=&class_id=&page=&limit=
- GET /notes/:id
- POST /notes (teacher/admin) form-data: note(file), title, description, subject_id, class_id
- PATCH /notes/:id/approve (admin) { approved }
- DELETE /notes/:id (owner/admin)

## Lectures
- GET /lectures?subject_id=&class_id=&page=&limit=
- GET /lectures/:id
- POST /lectures (teacher/admin) type=file|link, title, description, subject_id, class_id, video(file if type=file), link(if type=link)
- PATCH /lectures/:id/approve (admin) { approved }
- DELETE /lectures/:id (owner/admin)

## Quizzes
- GET /quizzes
- GET /quizzes/:id
- POST /quizzes (teacher/admin)
- PATCH /quizzes/:id (teacher/admin)
- DELETE /quizzes/:id (teacher/admin)
- GET /quizzes/:quizId/questions
- POST /quizzes/:quizId/questions (teacher/admin)
- POST /quizzes/:quizId/attempts (student) { answers:[{question_id,selected_option_index}] }
- GET /quizzes/:quizId/attempts (teacher/admin)
- GET /quizzes/me/attempts/list (student)

## Results
- GET /results/attempts/:id
- GET /results/attempts/:id/details
- GET /results/students/me/attempts (student)
- GET /results/students/:studentId/attempts (teacher/admin/parent)

## Notifications
- GET /notifications/me
- POST /notifications (teacher/admin)
- PATCH /notifications/:id/read

## Subjects
- GET /subjects
- POST /subjects (admin)
- PATCH /subjects/:id (admin)
- DELETE /subjects/:id (admin)

## Classes
- GET /classes
- POST /classes (admin)
- PATCH /classes/:id (admin)
- DELETE /classes/:id (admin)

## Admin
- GET /admin/users
- POST /admin/users
- PATCH /admin/users/:id/role { role }
- DELETE /admin/users/:id
- POST /admin/parents/link { child_id, parent_id }
- GET /admin/roles
- GET /admin/subjects
- GET /admin/classes

## Analytics
- GET /analytics/student/overview (student)
- GET /analytics/student/slo-accuracy (student)
- GET /analytics/student/topic-accuracy (student)
- GET /analytics/system/overview (admin)
