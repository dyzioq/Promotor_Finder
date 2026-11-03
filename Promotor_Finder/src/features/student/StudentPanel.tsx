import { useState } from "react";

// Mockowe dane na start (docelowo z backendu w Javie)
const MOCK_TOPICS = [
    {
        id: 1,
        title: "System obsługi wyboru prac dyplomowych",
        promoter: "dr hab. inż. Jan Kowalski",
        department: "Katedra Informatyki",
        isGroup: true,
        groupLimit: "2-4 osoby",
        description: "Stworzenie aplikacji webowej do zarządzania procesem dyplomowania.",
        isReserved: false,
    },
    {
        id: 2,
        title: "Algorytmy optymalizacji w logistyce",
        promoter: "dr inż. Anna Nowak",
        department: "Katedra Matematyki",
        isGroup: false,
        groupLimit: "1 osoba",
        description: "Analiza i implementacja wybranych algorytmów heurystycznych.",
        isReserved: true,
    },
];

export default function StudentPanel() {
    const [activeTab, setActiveTab] = useState<"topics" | "group" | "application">("topics");
    const [searchPromoter, setSearchPromoter] = useState("");

    const filteredTopics = MOCK_TOPICS.filter((topic) =>
        topic.promoter.toLowerCase().includes(searchPromoter.toLowerCase())
    );

    return (
        <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
            <h1>Panel Studenta</h1>

            {/* Nawigacja po zakładkach panelu studenta */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button
                    onClick={() => setActiveTab("topics")}
                    style={{ fontWeight: activeTab === "topics" ? "bold" : "normal" }}
                >
                    📚 Przeglądaj i wybierz temat
                </button>
                <button
                    onClick={() => setActiveTab("group")}
                    style={{ fontWeight: activeTab === "group" ? "bold" : "normal" }}
                >
                    👥 Moja grupa projektowa
                </button>
                <button
                    onClick={() => setActiveTab("application")}
                    style={{ fontWeight: activeTab === "application" ? "bold" : "normal" }}
                >
                    📄 Karta zgłoszenia
                </button>
            </div>

            <hr />

            {/* ZAKŁADKA 1: Przeglądanie i wybór tematów */}
            {activeTab === "topics" && (
                <section>
                    <h2>Dostępne tematy prac</h2>
                    <div style={{ marginBottom: "15px" }}>
                        <label>Filtruj wg promotora: </label>
                        <input
                            type="text"
                            placeholder="Wpisz nazwisko promotora..."
                            value={searchPromoter}
                            onChange={(e) => setSearchPromoter(e.target.value)}
                        />
                    </div>

                    <div style={{ display: "grid", gap: "15px" }}>
                        {filteredTopics.map((topic) => (
                            <div
                                key={topic.id}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "15px",
                                    borderRadius: "8px",
                                    backgroundColor: topic.isReserved ? "#f9f9f9" : "#fff",
                                }}
                            >
                                <h3>{topic.title}</h3>
                                <p><strong>Promotor:</strong> {topic.promoter} ({topic.department})</p>
                                <p><strong>Typ:</strong> {topic.isGroup ? `Grupowy (${topic.groupLimit})` : "Indywidualny"}</p>
                                <p>{topic.description}</p>
                                {topic.isReserved && <span style={{ color: "orange" }}>⚠️ Temat zarezerwowany</span>}

                                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                    <button disabled={topic.isReserved}>Wybierz temat</button>
                                    <button>Wyślij prośbę o zwiększenie limitu</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ZAKŁADKA 2: Zarządzanie grupą projektową */}
            {activeTab === "group" && (
                <section>
                    <h2>Zarządzanie grupą projektową (inż. INF / IDiSI)</h2>
                    <p>Twórz grupę jako lider lub dołącz do istniejącej grupy.</p>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button>Utwórz nową grupę (Zostań Liderem)</button>
                        <button>Wpisz kod i dołącz do grupy</button>
                    </div>
                </section>
            )}

            {/* ZAKŁADKA 3: Generowanie karty zgłoszenia */}
            {activeTab === "application" && (
                <section>
                    <h2>Karta zgłoszenia pracy dyplomowej</h2>
                    <p>Status karty: <em>Brak wybranego tematu</em></p>
                    <button disabled>Generuj kartę w PDF</button>
                </section>
            )}
        </div>
    );
}