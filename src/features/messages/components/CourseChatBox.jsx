import { useEffect, useRef, useState } from "react";
import "./CourseChatBox.css";

export default function CourseChatBox({
    title,
    messages,
    loading,
    onSendText,
    onSendImage,
    sending,
    emptyText,
}) {
    const [content, setContent] = useState("");
    const [pastedImage, setPastedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!pastedImage) {
            setPreviewUrl("");
            return;
        }

        const url = URL.createObjectURL(pastedImage);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [pastedImage]);

    const handleSendText = async (e) => {
        e.preventDefault();

        if (!content.trim()) return;

        await onSendText(content.trim());
        setContent("");
    };

    const handlePaste = (e) => {
        const items = e.clipboardData?.items || [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.kind === "file" && item.type.startsWith("image/")) {
                const imageFile = item.getAsFile();
                if (imageFile) {
                    setPastedImage(imageFile);
                    e.preventDefault();
                    return;
                }
            }
        }
    };

    const handleSendImage = async () => {
        if (!pastedImage) return;

        await onSendImage(pastedImage);
        setPastedImage(null);
        setPreviewUrl("");
    };

    const buildImageUrl = (imageUrl) => {
        if (!imageUrl) return "";

        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl;
        }

        const normalized = imageUrl.replace(/\\/g, "/");
        return `http://localhost:8888${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
    };

    return (
        <div className="course-chat-card">
            <div className="course-chat-header">
                <div>
                    <h3>{title}</h3>
                    <p>Không gian trao đổi chung của lớp học.</p>
                </div>
            </div>

            <div className="course-chat-messages">
                {loading ? (
                    <div className="course-chat-empty">Đang tải tin nhắn...</div>
                ) : messages.length ? (
                    messages.map((item) => (
                        <div key={item._id} className="course-chat-message">
                            <div className="course-chat-meta">
                                <strong>{item.senderId?.fullName || item.senderId?.code || "Người dùng"}</strong>
                                <span>
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleString("vi-VN")
                                        : "--"}
                                </span>
                            </div>

                            {item.type === "text" ? (
                                <div className="course-chat-bubble">{item.content}</div>
                            ) : (
                                <div className="course-chat-bubble">
                                    <img
                                        src={buildImageUrl(item.imageUrl)}
                                        alt="Ảnh chat"
                                        className="course-chat-image"
                                    />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="course-chat-empty">{emptyText}</div>
                )}

                <div ref={bottomRef} />
            </div>

            <form className="course-chat-composer" onSubmit={handleSendText}>
                <textarea
                    rows={3}
                    placeholder="Nhập tin nhắn hoặc dán ảnh vào đây..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onPaste={handlePaste}
                />

                {previewUrl ? (
                    <div className="course-chat-image-preview">
                        <img src={previewUrl} alt="Ảnh đã dán" />
                        <div className="course-chat-preview-actions">
                            <button
                                type="button"
                                className="course-chat-secondary-btn"
                                onClick={() => {
                                    setPastedImage(null);
                                    setPreviewUrl("");
                                }}
                            >
                                Xóa ảnh
                            </button>

                            <button
                                type="button"
                                className="course-chat-primary-btn"
                                onClick={handleSendImage}
                                disabled={sending}
                            >
                                {sending ? "Đang gửi..." : "Gửi ảnh"}
                            </button>
                        </div>
                    </div>
                ) : null}

                <div className="course-chat-actions">
                    <span className="course-chat-hint">
                        Có thể dán ảnh trực tiếp bằng Ctrl + V
                    </span>

                    <button
                        type="submit"
                        className="course-chat-primary-btn"
                        disabled={sending || !content.trim()}
                    >
                        {sending ? "Đang gửi..." : "Gửi tin nhắn"}
                    </button>
                </div>
            </form>
        </div>
    );
}