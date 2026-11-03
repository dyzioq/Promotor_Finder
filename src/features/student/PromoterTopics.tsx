import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { MOCK_PROMOTERS, MOCK_TOPICS } from "./mockData";

export default function PromoterTopics() {
    const { promoterId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Pobranie stopnia z URL (domyślnie "inż")
    const studentDegree = (searchParams.get("degree") as "inż" | "mgr") || "inż";

    const id = Number(promoterId);
    const promoter = MOCK_PROMOTERS.find((p) => p.id === id);

    // Filtrowanie tematów: ten promotor + właściwy stopień studiów
    const topics = MOCK_TOPICS.filter(
        (t) => t.promoterId === id && t.degreeType === studentDegree
    );

    if (!promoter) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>Nie znaleziono takiego promotora.</h2>
                <button onClick={() => navigate("/student")}>← Powrót do listy</button>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
            <button
                onClick={() => navigate("/student")}
                style={{
                    marginBottom: "20px",
                    padding: "8px 14px",
                    cursor: "pointer",
                    background: "none",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                }}
            >
                ← Powrót do listy promotorów
            </button>

            <header
                style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    marginBottom: "25px",
                    borderLeft: "5px solid #0056b3",
                }}
            >
                <h1 style={{ margin: "0 0 5px 0" }}>
                    {promoter.degree} {promoter.name}
                </h1>
                <p style={{ margin: "0", color: "#555" }}>{promoter.department}</p>
                <p style={{ margin: "5px 0 0 0", color: "#0056b3", fontWeight: "bold" }}>
                    Widok tematów dla studiów: {studentDegree === "inż" ? "Inżynierskich (I st.)" : "Magisterskich (II st.)"}
                </p>
            </header>

            <h2>Dostępne tematy ({topics.length})</h2>

            <div style={{ display: "grid", gap: "20px", marginTop: "15px" }}>
                {topics.map((topic) => (
                    <div
                        key={topic.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "20px",
                            borderRadius: "8px",
                            backgroundColor: topic.isReserved ? "#fafafa" : "#fff",
                        }}
                    >
                        <h3>{topic.title}</h3>
                        <p>{topic.description}</p>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                            👥 Formuła: <strong>{topic.isGroup ? `Grupowa (${topic.groupLimit})` : "Indywidualna"}</strong>
                        </p>

                        {!topic.isReserved && (
                            <button style={{ padding: "8px 16px", cursor: "pointer", marginTop: "10px" }}>
                                Wybierz ten temat
                            </button>
                        )}
                    </div>
                ))}

                {topics.length === 0 && (
                    <p style={{ color: "#777" }}>
                        Ten promotor nie zgłosił żadnych tematów dla studiów {studentDegree === "inż" ? "inżynierskich" : "magisterskich"}.
                    </p>
                )}
            </div>
        </div>
    );
}