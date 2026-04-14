import { buildMaterialDisplayLink, formatDate } from "../teacher.helpers";
import "./TeacherMaterialPanel.css";

export default function TeacherMaterialPanel({ title, type, materials }) {
    return (
        <div className="teacher-material-panel">
            <div className="teacher-material-panel-header">
                <h3>{title}</h3>
                <p>Tổng số: {materials.length}</p>
            </div>

            <div className="teacher-material-list">
                {materials.length ? (
                    materials.map((material) => {
                        const link = buildMaterialDisplayLink(material);

                        return (
                            <div className="teacher-material-item" key={material._id}>
                                <div className="teacher-material-info">
                                    <strong>{material.title || "Không có tiêu đề"}</strong>
                                    <p>{material.description || "Không có mô tả"}</p>
                                    <span>
                                        Loại: {type === "video" ? "Video URL" : "Document"} · Cập nhật:{" "}
                                        {formatDate(material.updatedAt || material.createdAt)}
                                    </span>
                                </div>

                                <div className="teacher-material-actions">
                                    {link ? (
                                        <a
                                            href={link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="teacher-inline-link"
                                        >
                                            {type === "video" ? "Mở video" : "Mở tài liệu"}
                                        </a>
                                    ) : (
                                        <span className="teacher-material-no-link">Chưa có link hiển thị</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="teacher-material-empty">
                        Chưa có {type === "video" ? "video" : "document"} nào.
                    </div>
                )}
            </div>
        </div>
    );
}