import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    getTeacherCourseMessagesApi,
    sendTeacherCourseMessageApi,
} from "../../../features/messages/messages.api";
import CourseChatBox from "../../../features/messages/components/CourseChatBox";

export default function TeacherCourseChatPage() {
    const { courseId } = useParams();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const fetchMessages = async () => {
        try {
            const data = await getTeacherCourseMessagesApi(courseId);
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();

        const timer = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => clearInterval(timer);
    }, [courseId]);

    const handleSendText = async (content) => {
        try {
            setSending(true);
            const result = await sendTeacherCourseMessageApi(courseId, {
                content,
            });

            if (result?.EC && result.EC !== 0) {
                alert(result?.EM || "Gửi tin nhắn thất bại.");
                return;
            }

            await fetchMessages();
        } catch (error) {
            console.error(error);
            alert(
                error?.response?.data?.EM ||
                error?.response?.data?.message ||
                "Gửi tin nhắn thất bại."
            );
        } finally {
            setSending(false);
        }
    };

    const handleSendImage = async (image) => {
        try {
            if (!image) return;

            setSending(true);

            const formData = new FormData();
            formData.append("image", image);
            formData.append("content", "");

            const result = await sendTeacherCourseMessageApi(courseId, formData);

            if (result?.EC && result.EC !== 0) {
                alert(result?.EM || "Gửi ảnh thất bại.");
                return;
            }

            await fetchMessages();
        } catch (error) {
            console.error(error);
            alert(
                error?.response?.data?.EM ||
                error?.response?.data?.message ||
                error?.message ||
                "Gửi ảnh thất bại."
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="teacher-page">
            <div className="teacher-page-header">
                <div>
                    <span className="page-chip">Giảng viên / Chat lớp học</span>
                    <h2>Nhóm chat lớp học</h2>
                    <p>Trao đổi với sinh viên và giảng viên khác trong lớp học này.</p>
                </div>

                <Link className="teacher-back-link" to="/teacher/terms">
                    ← Quay lại kỳ học
                </Link>
            </div>

            <CourseChatBox
                title="Chat lớp học"
                messages={messages}
                loading={loading}
                sending={sending}
                onSendText={handleSendText}
                onSendImage={handleSendImage}
                emptyText="Chưa có tin nhắn nào trong lớp học này."
            />
        </div>
    );
}