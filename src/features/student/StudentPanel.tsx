import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_PROMOTERS, MOCK_TOPICS } from "./mockData";

export default function StudentPanel() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");

    // Symulacja profilu zalogowanego studenta (Stopień I vs II)
    const [studentDegree, setStudentDegree] = useState<"inż" | "mgr">("inż");

    // Filtrowanie promotorów
    const filteredPromoters = MOCK_PROMOTERS.filter((promoter) => {
        const matchesSearch =
            promoter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promoter.degree.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDept =
            selectedDepartment === "all" || promoter.department === selectedDepartment;
        return matchesSearch && matchesDept;
    });

    const departments = Array.from(new Set(MOCK_PROMOTERS.map((p) => p.department)));

    return (
        <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
            <h1>Panel Studenta – Wybór Promotora</h1>

            {/* PASEK PROFILU STUDENTA (Symulacja zalogowanego użytkownika) */}
            <div
                style={{
                    padding: "15px",
                    backgroundColor: "#e8f4f8",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                }}
            >
                <strong>🎓 Mój stopień studiów:</strong>
                <label style={{ cursor: "pointer" }}>
                    <input
                        type="radio"
                        name="degree"
                        value="inż"
                        checked={studentDegree === "inż"}
                        onChange={() => setStudentDegree("inż")}
                    />{" "}
                    Inżynierskie (I stopień)
                </label>
                <label style={{ cursor: "pointer" }}>
                    <input
                        type="radio"
                        name="degree"
                        value="mgr"
                        checked={studentDegree === "mgr"}
                        onChange={() => setStudentDegree("mgr")}
                    />{" "}
                    Magisterskie (II stopień)
                </label>
            </div>

            {/* Pasek filtrowania */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap" }}>
                <input
                    type="text"
                    placeholder="Szukaj promotora po nazwisku..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "10px", flex: "1", minWidth: "250px", fontSize: "16px" }}
                />

                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    style={{ padding: "10px", fontSize: "16px" }}
                >
                    <option value="all">Wszystkie katedry</option>
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>

            {/* Lista promotorów */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                }}
            >
                {filteredPromoters.map((promoter) => {
                    // Filtrujemy tematy TYLKO dla wybranego stopnia studiów studenta
                    const promoterDegreeTopics = MOCK_TOPICS.filter(
                        (t) => t.promoterId === promoter.id && t.degreeType === studentDegree
                    );
                    const availableTopicsCount = promoterDegreeTopics.filter((t) => !t.isReserved).length;

                    return (
                        <div
                            key={promoter.id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "10px",
                                padding: "20px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            <div>
                                <h3 style={{ margin: "0 0 5px 0" }}>
                                    {promoter.degree} {promoter.name}
                                </h3>
                                <p style={{ color: "#666", fontSize: "14px", margin: "0 0 10px 0" }}>
                                    {promoter.department}
                                </p>

                                <p style={{ fontSize: "14px", marginTop: "15px" }}>
                                    Tematy ({studentDegree === "inż" ? "Inżynierskie" : "Magisterskie"}):{" "}
                                    <strong>{availableTopicsCount} wolnych</strong> / {promoterDegreeTopics.length}
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    navigate(`/student/promotor/${promoter.id}?degree=${studentDegree}`)
                                }
                                style={{
                                    padding: "10px 15px",
                                    cursor: "pointer",
                                    backgroundColor: "#0056b3",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontWeight: "bold",
                                    marginTop: "15px",
                                }}
                            >
                                Zobacz tematy ➔
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}