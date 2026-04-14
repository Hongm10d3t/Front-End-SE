import { Navigate, Routes, Route } from "react-router-dom";

import PublicRoute from "../auth/PublicRoute";
import ProtectedRoute from "../auth/ProtectedRoute";

import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import TeacherLayout from "../layouts/TeacherLayout/TeacherLayout";
import StudentLayout from "../layouts/StudentLayout/StudentLayout";

// import LoginPage from "../pages/auth/LoginPage/LoginPage";
import LoginPage from "../pages/auth/loginPage/LoginPage";
import AdminDashboardPage from "../pages/admin/DashboardPage/DashboardPage";
import TeacherDashboardPage from "../pages/teacher/DashboardPage/DashboardPage";
import StudentDashboardPage from "../pages/student/DashboardPage/DashboardPage";
// import UsersPage from "../pages/admin/UsersPage/UsersPage";
import UsersPage from "../pages/admin/UserPage/UserPage";

// import TermsPage from "../pages/admin/TermsPage/TermsPage";
// import CoursesPage from "../pages/admin/CoursesPage/CoursesPage";
// import CourseMembersPage from "../pages/admin/CourseMembersPage/CourseMembersPage";
import TermsPage from "../pages/admin/TermsPage/TermsPage";
import CoursesPage from "../pages/admin/CoursesPage/CoursesPage";
import CourseMembersPage from "../pages/admin/CourseMembersPage/CourseMembersPage";
import TeacherTermsPage from "../pages/teacher/TermsPage/TermsPage";
import TeacherCoursesPage from "../pages/teacher/CoursesPage/CoursesPage";
import TeacherStudentsPage from "../pages/teacher/StudentsPage/StudentsPage";
import TeacherQuestionBanksPage from "../pages/teacher/QuestionBanksPage/QuestionBanksPage";
import TeacherQuestionListPage from "../pages/teacher/QuestionListPage/QuestionListPage";
import TeacherExamsPage from "../pages/teacher/ExamsPage/ExamsPage";
import TeacherMaterialsPage from "../pages/teacher/MaterialsPage/MaterialsPage";
import TeacherExamDetailPage from "../pages/teacher/ExamDetailPage/ExamDetailPage";

import StudentTermsPage from "../pages/student/TermsPage/TermsPage";
import StudentCoursesPage from "../pages/student/CoursesPage/CoursesPage";
// import StudentCourseDetailPage from "../pages/student/CourseDetailPage/CourseDetailPage";
import StudentCourseDetailPage from "../pages/student/CourseDetailPage/CourseDetailPage";
import StudentMaterialsPage from "../pages/student/MaterialsPage/MaterialsPage";
import StudentExamsPage from "../pages/student/ExamsPage/ExamsPage";
import StudentDoingExamPage from "../pages/student/DoingExamPage/DoingExamPage";
import StudentExamResultPage from "../pages/student/ExamResultPage/ExamResultPage";
import StudentExamHistoryPage from "../pages/student/ExamHistoryPage/ExamHistoryPage";
import StudentVideoLearningPage from "../pages/student/VideoLearningPage/VideoLearningPage";
import StudentDocumentsPage from "../pages/student/DocumentsPage/DocumentsPage";
// function PlaceholderPage({ title }) {
//     return (
//         <div className="page-placeholder">
//             <h2>{title}</h2>
//             <p>Trang này mình sẽ xây tiếp ở bước sau.</p>
//         </div>
//     );
// }

export default function AppRouter() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <AuthLayout>
                            <LoginPage />
                        </AuthLayout>
                    </PublicRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminDashboardPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="terms/:termId/courses" element={<CoursesPage />} />
                <Route path="courses/:courseId/members" element={<CourseMembersPage />} />
            </Route>
            <Route
                path="/teacher"
                element={
                    <ProtectedRoute allowedRoles={["TEACHER"]}>
                        <TeacherLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<TeacherDashboardPage />} />
                <Route path="terms" element={<TeacherTermsPage />} />
                <Route path="terms/:termId/courses" element={<TeacherCoursesPage />} />
                <Route path="courses/:courseId/students" element={<TeacherStudentsPage />} />
                <Route path="courses/:courseId/question-banks" element={<TeacherQuestionBanksPage />} />
                <Route
                    path="question-banks/:questionBankId/questions"
                    element={<TeacherQuestionListPage />}
                />
                <Route path="courses/:courseId/exams" element={<TeacherExamsPage />} />
                <Route path="courses/:courseId/materials" element={<TeacherMaterialsPage />} />
                <Route path="exams/:examId/detail" element={<TeacherExamDetailPage />} />
            </Route>

            <Route
                path="/student"
                element={
                    <ProtectedRoute allowedRoles={["STUDENT"]}>
                        <StudentLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<StudentDashboardPage />} />
                <Route path="terms" element={<StudentTermsPage />} />
                <Route path="terms/:termId/courses" element={<StudentCoursesPage />} />
                <Route path="courses/:courseId" element={<StudentCourseDetailPage />} />
                <Route path="courses/:courseId/materials" element={<StudentMaterialsPage />} />
                <Route path="courses/:courseId/exams" element={<StudentExamsPage />} />
                <Route path="exam-attempts/:examAttemptId" element={<StudentDoingExamPage />} />
                <Route
                    path="exam-attempts/:examAttemptId/result"
                    element={<StudentExamResultPage />}
                />
                <Route path="exams/:examId/history" element={<StudentExamHistoryPage />} />
                <Route path="courses/:courseId/videos" element={<StudentVideoLearningPage />} />
                <Route path="courses/:courseId/videos/:videoId" element={<StudentVideoLearningPage />} />
                <Route path="courses/:courseId/documents" element={<StudentDocumentsPage />} />
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}