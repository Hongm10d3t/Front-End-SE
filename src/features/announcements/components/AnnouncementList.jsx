export default function AnnouncementList({ title, announcements, emptyText }) {
    return (
        <div className="teacher-empty-card" style={{ marginTop: 24 }}>
            <h3>{title}</h3>

            {announcements.length ? (
                <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
                    {announcements.map((item) => (
                        <div
                            key={item._id}
                            style={{
                                border: "1px solid #e2e8f0",
                                borderRadius: 16,
                                padding: 16,
                                background: "#f8fbff",
                            }}
                        >
                            <strong style={{ display: "block", marginBottom: 8 }}>
                                {item.title}
                            </strong>

                            <p style={{ margin: 0, color: "#475569", marginBottom: 8 }}>
                                {item.content}
                            </p>

                            <span style={{ color: "#64748b", fontSize: 14 }}>
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleString("vi-VN")
                                    : "--"}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ marginTop: 12 }}>{emptyText}</p>
            )}
        </div>
    );
}