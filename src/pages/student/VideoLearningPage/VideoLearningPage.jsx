import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentVideoMaterialApi } from "../../../features/student/student.api";
import {
    buildEmbeddedVideoLink,
    buildMaterialDisplayLink,
    isDirectVideoFile,
} from "../../../features/student/student.helpers";
import "./VideoLearningPage.css";

export default function StudentVideoLearningPage() {
    const { courseId, videoId } = useParams();
    const navigate = useNavigate();

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const data = await getStudentVideoMaterialApi(courseId);
                const list = Array.isArray(data) ? data : [];
                setVideos(list);

                if (!videoId && list.length) {
                    navigate(`/student/courses/${courseId}/videos/${list[0]._id}`, {
                        replace: true,
                    });
                }
            } catch (error) {
                console.error(error);
                alert("Không tải được video khóa học.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [courseId, videoId, navigate]);

    const activeVideo = useMemo(() => {
        return videos.find((item) => String(item._id) === String(videoId)) || videos[0] || null;
    }, [videos, videoId]);

    const activeVideoLink = buildMaterialDisplayLink(activeVideo);
    const embeddedLink = buildEmbeddedVideoLink(activeVideoLink);

    if (loading) {
        return <div className="student-loading-card">Đang tải video khóa học...</div>;
    }

    if (!videos.length) {
        return (
            <div className="student-page">
                <div className="student-empty-card">
                    <h3>Chưa có video nào</h3>
                    <p>Khóa học này hiện chưa có video bài giảng.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="student-video-layout">
            <aside className="student-video-sidebar">
                <button
                    className="student-video-back-btn"
                    onClick={() => navigate(`/student/courses/${courseId}`)}
                >
                    ← Trở lại khóa học
                </button>

                <div className="student-video-list-box">
                    <div className="student-video-list-head">
                        <h3>Nội dung khóa học</h3>
                        <span>{videos.length} video</span>
                    </div>

                    <div className="student-video-items">
                        {videos.map((video, index) => {
                            const isActive = String(video._id) === String(activeVideo?._id);

                            return (
                                <button
                                    key={video._id}
                                    className={isActive ? "student-video-item active" : "student-video-item"}
                                    onClick={() =>
                                        navigate(`/student/courses/${courseId}/videos/${video._id}`)
                                    }
                                >
                                    <div className="student-video-item-left">
                                        <div className="student-video-index">{index + 1}</div>

                                        <div className="student-video-item-info">
                                            <strong>{video.title || "Video bài giảng"}</strong>
                                            <p>{video.description || "Không có mô tả"}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            <main className="student-video-main">
                <div className="student-video-player-box">
                    {isDirectVideoFile(activeVideoLink) ? (
                        <video controls width="100%">
                            <source src={activeVideoLink} />
                            Trình duyệt không hỗ trợ video.
                        </video>
                    ) : (
                        <iframe
                            src={embeddedLink}
                            title={activeVideo?.title || "Video khóa học"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </div>

                <div className="student-video-tabs">
                    <button className="student-video-tab active">Tổng quan</button>
                    <button className="student-video-tab">Thông tin</button>
                </div>

                <section className="student-video-detail">
                    <h1>{activeVideo?.title || "Video bài giảng"}</h1>

                    <div className="student-video-meta">
                        <span>
                            Cập nhật:{" "}
                            {activeVideo?.updatedAt
                                ? new Date(activeVideo.updatedAt).toLocaleDateString("vi-VN")
                                : "--"}
                        </span>
                        <span>•</span>
                        <span>Tiếng Việt</span>
                    </div>

                    <p className="student-video-desc">
                        {activeVideo?.description || "Không có mô tả cho video này."}
                    </p>
                </section>
            </main>
        </div>
    );
}