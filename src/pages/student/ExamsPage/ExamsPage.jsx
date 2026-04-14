import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    getStudentExamsApi,
    startStudentExamApi,
} from "../../../features/student/student.api";
import StudentExamTable from "../../../features/student/components/StudentExamTable";
import "./ExamsPage.css";

export default function StudentExamsPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startingExamId, setStartingExamId] = useState("");

    useEffect(() => {
        const fetchExams = async () => {
            try {
                setLoading(true);
                const data = await getStudentExamsApi(courseId);
                setExams(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(error);
                alert("Không tải được danh sách bài thi.");
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [courseId]);

    const handleStartExam = async (exam) => {
        try {
            setStartingExamId(exam._id);
            const result = await startStudentExamApi(exam._id);

            const attemptId =
                result?._id ||
                result?.examAttemptId ||
                result?.id;

            if (!attemptId) {
                alert("Không lấy được mã bài làm. Hãy kiểm tra response API start exam.");
                return;
            }

            navigate(`/student/exam-attempts/${attemptId}`);
        } catch (error) {
            console.error(error);
            alert("Không thể bắt đầu bài thi.");
        } finally {
            setStartingExamId("");
        }
    };

    return (
        <div className="student-page">
            <div className="student-page-header">
                <div>
                    <span className="page-chip">Sinh viên / Bài thi</span>
                    <h2>Bài thi của học phần</h2>
                    <p>Chọn bài thi và bắt đầu làm bài khi sẵn sàng.</p>
                </div>

                <Link className="student-back-link" to={`/student/courses/${courseId}`}>
                    ← Quay lại lớp học
                </Link>
            </div>

            {loading ? (
                <div className="student-loading-card">Đang tải danh sách bài thi...</div>
            ) : (
                <StudentExamTable
                    exams={exams}
                    onStartExam={handleStartExam}
                    startingExamId={startingExamId}
                />
            )}
        </div>
    );
}