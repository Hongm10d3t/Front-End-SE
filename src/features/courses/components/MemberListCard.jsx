import "./MemberListCard.css";

export default function MemberListCard({ title, members, type, onRemove, onAdd }) {
    return (
        <div className="member-card">
            <div className="member-card-header">
                <div>
                    <h3>{title}</h3>
                    <p>Tổng số: {members.length}</p>
                </div>

                <button className="member-add-btn" onClick={onAdd}>
                    + Thêm
                </button>
            </div>

            <div className="member-list">
                {members.length ? (
                    members.map((member) => (
                        <div className="member-item" key={member._id}>
                            <div className="member-avatar">
                                {(member.fullName || member.code || "U").charAt(0).toUpperCase()}
                            </div>

                            <div className="member-info">
                                <strong>{member.fullName || member.code}</strong>
                                <p>{member.code} · {member.email || "--"}</p>
                            </div>

                            <button
                                className="member-remove-btn"
                                onClick={() => onRemove(member)}
                            >
                                Gỡ
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="member-empty">
                        Chưa có {type === "teacher" ? "giảng viên" : "sinh viên"} nào trong học phần này.
                    </div>
                )}
            </div>
        </div>
    );
}