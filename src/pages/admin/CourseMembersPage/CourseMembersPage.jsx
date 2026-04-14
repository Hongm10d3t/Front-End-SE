import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUsersApi } from "../../../features/users/users.api";
import {
    addStudentToCourseApi,
    addTeacherToCourseApi,
    getCourseMembersApi,
    removeStudentFromCourseApi,
    removeTeacherFromCourseApi,
} from "../../../features/courses/courses.api";
import AssignMemberModal from "../../../features/courses/components/AssignMemberModal";
import MemberListCard from "../../../features/courses/components/MemberListCard";
import "./CourseMembersPage.css";

export default function CourseMembersPage() {
    const { courseId } = useParams();

    const [membersData, setMembersData] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [openTeacherModal, setOpenTeacherModal] = useState(false);
    const [openStudentModal, setOpenStudentModal] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [membersRes, usersRes] = await Promise.all([
                getCourseMembersApi(courseId),
                getUsersApi(),
            ]);

            setMembersData(membersRes || {});
            setAllUsers(Array.isArray(usersRes) ? usersRes : []);
        } catch (error) {
            console.error(error);
            alert("Không tải được dữ liệu thành viên học phần.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId]);

    const teachers = membersData?.teacherIds || [];
    const students = membersData?.studentIds || [];
    const courseName = membersData?.name || "Học phần";

    const handleAddTeacher = async (teacherId) => {
        try {
            setSubmitting(true);
            await addTeacherToCourseApi(courseId, teacherId);
            setOpenTeacherModal(false);
            await fetchData();
        } catch (error) {
            console.error(error);
            alert("Thêm giảng viên thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddStudent = async (studentId) => {
        try {
            setSubmitting(true);
            await addStudentToCourseApi(courseId, studentId);
            setOpenStudentModal(false);
            await fetchData();
        } catch (error) {
            console.error(error);
            alert("Thêm sinh viên thất bại.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoveTeacher = async (teacher) => {
        const confirmed = window.confirm(`Gỡ giảng viên ${teacher.fullName || teacher.code} khỏi học phần?`);
        if (!confirmed) return;

        try {
            await removeTeacherFromCourseApi(courseId, teacher._id);
            await fetchData();
        } catch (error) {
            console.error(error);
            alert("Gỡ giảng viên thất bại.");
        }
    };

    const handleRemoveStudent = async (student) => {
        const confirmed = window.confirm(`Gỡ sinh viên ${student.fullName || student.code} khỏi học phần?`);
        if (!confirmed) return;

        try {
            await removeStudentFromCourseApi(courseId, student._id);
            await fetchData();
        } catch (error) {
            console.error(error);
            alert("Gỡ sinh viên thất bại.");
        }
    };

    if (loading) {
        return <div className="course-members-loading">Đang tải dữ liệu thành viên học phần...</div>;
    }

    return (
        <div className="course-members-page">
            <div className="course-members-header">
                <div>
                    <span className="page-chip">Admin / Thành viên học phần</span>
                    <h2>{courseName}</h2>
                    <p>Quản lý giảng viên và sinh viên thuộc học phần này.</p>
                </div>

                <Link className="back-link-btn" to="/admin/terms">
                    ← Quay lại danh sách kỳ học
                </Link>
            </div>

            <div className="course-members-grid">
                <MemberListCard
                    title="Danh sách giảng viên"
                    members={teachers}
                    type="teacher"
                    onAdd={() => setOpenTeacherModal(true)}
                    onRemove={handleRemoveTeacher}
                />

                <MemberListCard
                    title="Danh sách sinh viên"
                    members={students}
                    type="student"
                    onAdd={() => setOpenStudentModal(true)}
                    onRemove={handleRemoveStudent}
                />
            </div>

            <AssignMemberModal
                open={openTeacherModal}
                title="Thêm giảng viên vào học phần"
                users={allUsers.filter((u) => !teachers.some((t) => t._id === u._id))}
                type="teacher"
                onClose={() => setOpenTeacherModal(false)}
                onSubmit={handleAddTeacher}
                isSubmitting={submitting}
            />

            <AssignMemberModal
                open={openStudentModal}
                title="Thêm sinh viên vào học phần"
                users={allUsers.filter((u) => !students.some((s) => s._id === u._id))}
                type="student"
                onClose={() => setOpenStudentModal(false)}
                onSubmit={handleAddStudent}
                isSubmitting={submitting}
            />
        </div>
    );
}