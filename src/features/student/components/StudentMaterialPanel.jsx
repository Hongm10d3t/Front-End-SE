import { useState } from "react";
import {
    buildMaterialDisplayLink,
    buildEmbeddedVideoLink,
    formatDateTime,
    isDirectVideoFile,
} from "../student.helpers";
import "./StudentMaterialPanel.css";

export default function StudentMaterialPanel({ title, type, materials }) {
    const [openedVideoId, setOpenedVideoId] = useState(null);

    return (
        <div className="student-material-panel">
            <div className="student-material-panel-header">
                <h3>{title}</h3>
                <p>Tổng số: {materials.length}</p>
            </div>

            <div className="student-material-list">
                {materials.length ? (
                    materials.map((material) => {
                        const link = buildMaterialDisplayLink(material);
                        const embeddedLink = buildEmbeddedVideoLink(link);
                        const isOpened = openedVideoId === material._id;

                        return (
                            <div className="student-material-item-wrap" key={material._id || link}>
                                <div className="student-material-item">
                                    <div className="student-material-info">
                                        <strong>{material.title || "Không có tiêu đề"}</strong>
                                        <p>{material.description || "Không có mô tả"}</p>
                                        <span>
                                            Loại: {type === "video" ? "Video" : "Document"} · Cập nhật:{" "}
                                            {formatDateTime(material.updatedAt || material.createdAt)}
                                        </span>
                                    </div>

                                    {type === "video" ? (
                                        <button
                                            type="button"
                                            className="student-inline-link student-inline-btn"
                                            onClick={() =>
                                                setOpenedVideoId(isOpened ? null : material._id)
                                            }
                                        >
                                            {isOpened ? "Ẩn video" : "Xem video"}
                                        </button>
                                    ) : link ? (
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="student-inline-link"
                                        >
                                            Mở tài liệu
                                        </a>
                                    ) : (
                                        <span className="student-material-no-link">Chưa có link</span>
                                    )}
                                </div>

                                {type === "video" && isOpened ? (
                                    <div className="student-video-embed">
                                        {isDirectVideoFile(link) ? (
                                            <video controls width="100%">
                                                <source src={link} />
                                                Trình duyệt của bạn không hỗ trợ video.
                                            </video>
                                        ) : (
                                            <iframe
                                                src={embeddedLink}
                                                title={material.title || "Video học tập"}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })
                ) : (
                    <div className="student-material-empty">
                        Chưa có {type === "video" ? "video" : "document"} nào.
                    </div>
                )}
            </div>
        </div>
    );
}