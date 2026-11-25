import { Outlet, NavLink } from "react-router-dom";
import { StudentProvider, useStudent } from "./StudentContext";
import { MOCK_TOPICS } from "./mockData";

function StudentLayoutContent() {
    const { selectedTopicId } = useStudent();
    const selectedTopic = MOCK_TOPICS.find((t) => t.id === selectedTopicId);

    const linkStyle = ({ isActive }: { isActive: boolean }) => ({
        textDecoration: "none",
        color: isActive ? "#0056b3" : "#555",
        fontWeight: isActive ? "bold" : "normal",
        borderBottom: isActive ? "2px solid #0056b3" : "none",
        paddingBottom: "5px",
    });

    return (
        <div>
            <div style={{ background: "#fff", borderBottom: "1px solid #ddd", padding: "12px 20px" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        maxWidth: "1100px",
                        margin: "0 auto",
                        flexWrap: "wrap",
                        gap: "15px",
                    }}
                >
                    <nav style={{ display: "flex", gap: "25px" }}>
                        <NavLink to="/student" end style={linkStyle}>
                            📚 Wybór Promotora
                        </NavLink>
                        <NavLink to="/student/group" style={linkStyle}>
                            👥 Moja Grupa Projektowa
                        </NavLink>
                        <NavLink to="/student/application" style={linkStyle}>
                            📄 Karta Zgłoszenia
                        </NavLink>
                    </nav>

                    {selectedTopic && (
                        <span
                            style={{
                                fontSize: "13px",
                                backgroundColor: "#e8f5e9",
                                color: "#2e7d32",
                                padding: "5px 10px",
                                borderRadius: "12px",
                                fontWeight: "bold",
                            }}
                        >
              ✅ Wybrany temat: {selectedTopic.title.slice(0, 35)}...
            </span>
                    )}
                </div>
            </div>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default function StudentLayout() {
    return (
        <StudentProvider>
            <StudentLayoutContent />
        </StudentProvider>
    );
}