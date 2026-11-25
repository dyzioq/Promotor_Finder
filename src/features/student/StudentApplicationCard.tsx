import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudent } from "./StudentContext";
import { MOCK_PROMOTERS, MOCK_TOPICS, CURRENT_STUDENT } from "./mockData";

type CardStatus = "draft" | "pending_approval" | "approved";

export default function StudentApplicationCard() {
    const navigate = useNavigate();
    const { selectedTopicId, group } = useStudent();

    const selectedTopic = MOCK_TOPICS.find((t) => t.id === selectedTopicId);
    const promoter = MOCK_PROMOTERS.find((p) => p.id === selectedTopic?.promoterId);

    // Stany formularza karty zgłoszenia
    const [status, setStatus] = useState<CardStatus>("draft");
    const [titlePl, setTitlePl] = useState(selectedTopic?.title ?? "");
    const [titleEn, setTitleEn] = useState("");
    const [studyField, setStudyField] = useState("Informatyka");
    const [studyMode, setStudyMode] = useState<"stacjonarne" | "niestacjonarne">("stacjonarne");
    const [scope, setScope] = useState(selectedTopic?.description ?? "");
    const [keywords, setKeywords] = useState("");

    // Jeśli student nie wybrał jeszcze tematu
    if (!selectedTopic || !promoter) {
        return (
            <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
                <h1>📄 Karta Zgłoszenia Pracy Dyplomowej</h1>
                <div
                    style={{
                        padding: "25px",
                        backgroundColor: "#fff3cd",
                        border: "1px solid #ffeeba",
                        borderRadius: "8px",
                        marginTop: "20px",
                    }}
                >
                    <h3 style={{ marginTop: 0 }}>Brak przypisanego tematu</h3>
                    <p>
                        Aby wypełnić kartę zgłoszenia, musisz najpierw wybrać temat pracy dyplomowej u jednego z
                        promotorów.
                    </p>
                    <button
                        onClick={() => navigate("/student")}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#0056b3",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        Przejdź do wyboru promotora ➔
                    </button>
                </div>
            </div>
        );
    }

    const isEditable = status === "draft";
    const authors = selectedTopic.isGroup && group ? group.members : [CURRENT_STUDENT];

    const handleSubmitForApproval = (e: React.FormEvent) => {
        e.preventDefault();
        if (!titlePl.trim() || !titleEn.trim() || !scope.trim()) {
            alert("Uzupełnij tytuł polski, tytuł angielski oraz cel i zakres pracy.");
            return;
        }
        setStatus("pending_approval");
    };

    const handlePrintPdf = () => {
        window.print();
    };

    return (
        <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
            {/* Style ukrywające przyciski podczas drukowania / zapisu do PDF */}
            <style>{`
        @media print {
          .no-print { display: none !important; }
          header, nav { display: none !important; }
        }
      `}</style>

            {/* Pasek statusu (ukrywany przy druku PDF) */}
            <div
                className="no-print"
                style={{
                    padding: "15px 20px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                    backgroundColor:
                        status === "approved"
                            ? "#e8f5e9"
                            : status === "pending_approval"
                                ? "#e3f2fd"
                                : "#f8f9fa",
                    border:
                        status === "approved"
                            ? "1px solid #c3e6cb"
                            : status === "pending_approval"
                                ? "1px solid #b8daff"
                                : "1px solid #ddd",
                }}
            >
                <div>
                    <strong>Status karty: </strong>
                    {status === "draft" && "✏️ Wersja robocza (uzupełnij w porozumieniu z promotorem)"}
                    {status === "pending_approval" && "⏳ Oczekuje na zatwierdzenie przez promotora"}
                    {status === "approved" && "✅ Zatwierdzona przez promotora – gotowa do wygenerowania PDF"}
                </div>

                {/* Przyciski deweloperskie do symulacji decyzji promotora */}
                <div style={{ display: "flex", gap: "8px" }}>
                    {status === "pending_approval" && (
                        <>
                            <button
                                type="button"
                                onClick={() => setStatus("approved")}
                                style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                }}
                            >
                                [Demo] Zatwierdź jako promotor
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus("draft")}
                                style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#ffc107",
                                    color: "#000",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "13px",
                                }}
                            >
                                [Demo] Zwróć do poprawy
                            </button>
                        </>
                    )}
                    {status === "approved" && (
                        <button
                            type="button"
                            onClick={handlePrintPdf}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#0056b3",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            🖨️ Generuj / Zapisz kartę jako PDF
                        </button>
                    )}
                </div>
            </div>

            {/* Właściwa Karta Zgłoszenia */}
            <form
                onSubmit={handleSubmitForApproval}
                style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    padding: "30px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "25px", borderBottom: "2px solid #333", paddingBottom: "15px" }}>
                    <h2 style={{ margin: "0 0 5px 0", textTransform: "uppercase" }}>
                        Karta Zgłoszenia Pracy Dyplomowej
                    </h2>
                    <p style={{ margin: 0, color: "#555" }}>
                        Politechnika Śląska – Stopień:{" "}
                        <strong>
                            {selectedTopic.degreeType === "inż" ? "I (Inżynierska)" : "II (Magisterska)"}
                        </strong>
                    </p>
                </div>

                {/* Sekcja 1: Dane automatyczne (Promotor i Dyplomanci) */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "25px" }}>
                    <div style={{ padding: "12px", backgroundColor: "#f9f9f9", borderRadius: "6px" }}>
                        <h4 style={{ margin: "0 0 8px 0" }}>Promotor</h4>
                        <p style={{ margin: "0 0 4px 0" }}>
                            <strong>
                                {promoter.degree} {promoter.name}
                            </strong>
                        </p>
                        <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#555" }}>
                            {promoter.department}
                        </p>
                        <p style={{ margin: 0, fontSize: "13px", color: "#777" }}>{promoter.email}</p>
                    </div>

                    <div style={{ padding: "12px", backgroundColor: "#f9f9f9", borderRadius: "6px" }}>
                        <h4 style={{ margin: "0 0 8px 0" }}>
                            {authors.length > 1 ? `Dyplomanci (${group?.name})` : "Dyplomant"}
                        </h4>
                        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "14px" }}>
                            {authors.map((student) => (
                                <li key={student.id} style={{ marginBottom: "4px" }}>
                                    <strong>{student.name}</strong> ({student.email})
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sekcja 2: Kierunek i forma studiów */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                    <div>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                            Kierunek studiów:
                        </label>
                        <select
                            disabled={!isEditable}
                            value={studyField}
                            onChange={(e) => setStudyField(e.target.value)}
                            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        >
                            <option value="Informatyka">Informatyka</option>
                            <option value="IDiSI">Inżynieria Danych i Systemów Informacyjnych (IDiSI)</option>
                            <option value="Matematyka">Matematyka</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                            Forma studiów:
                        </label>
                        <select
                            disabled={!isEditable}
                            value={studyMode}
                            onChange={(e) => setStudyMode(e.target.value as "stacjonarne" | "niestacjonarne")}
                            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                        >
                            <option value="stacjonarne">Stacjonarne</option>
                            <option value="niestacjonarne">Niestacjonarne</option>
                        </select>
                    </div>
                </div>

                {/* Sekcja 3: Tytuły i zakres pracy */}
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                        Temat pracy (w języku polskim):
                    </label>
                    <input
                        type="text"
                        disabled={!isEditable}
                        value={titlePl}
                        onChange={(e) => setTitlePl(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
                        required
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                        Temat pracy (w języku angielskim):
                    </label>
                    <input
                        type="text"
                        disabled={!isEditable}
                        placeholder="np. Thesis Topic Selection Management System"
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
                        required
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                        Cel i zakres pracy (założenia wejściowe):
                    </label>
                    <textarea
                        rows={5}
                        disabled={!isEditable}
                        value={scope}
                        onChange={(e) => setScope(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box", lineHeight: "1.5" }}
                        required
                    />
                </div>

                <div style={{ marginBottom: "25px" }}>
                    <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
                        Słowa kluczowe:
                    </label>
                    <input
                        type="text"
                        disabled={!isEditable}
                        placeholder="np. aplikacja webowa, React, Spring Boot, baza danych"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
                    />
                </div>

                {/* Sekcja podpisów widoczna po zatwierdzeniu */}
                {status === "approved" && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: "40px",
                            paddingTop: "20px",
                            borderTop: "1px dashed #aaa",
                            fontSize: "13px",
                            color: "#555",
                        }}
                    >
                        <div>
                            <p style={{ margin: 0 }}>Zatwierdzono elektronicznie w systemie:</p>
                            <strong>
                                {promoter.degree} {promoter.name}
                            </strong>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0 }}>Data wygenerowania:</p>
                            <strong>{new Date().toLocaleDateString("pl-PL")}</strong>
                        </div>
                    </div>
                )}

                {/* Przyciski akcji dla wersji roboczej */}
                {isEditable && (
                    <div className="no-print" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                        <button
                            type="submit"
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#0056b3",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontWeight: "bold",
                            }}
                        >
                            📤 Prześlij kartę do zatwierdzenia przez promotora
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}