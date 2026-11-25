import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { MOCK_PROMOTERS, MOCK_TOPICS, CURRENT_STUDENT } from "./mockData";
import type { Topic } from "./mockData";
import { useStudent } from "./StudentContext";
import type { PromoterRequest } from "./StudentContext";

export default function PromoterTopics() {
    const { promoterId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { group, selectedTopicId, selectTopic, cancelTopicSelection, sendRequest, requests } =
        useStudent();

    const [requestFormTopicId, setRequestFormTopicId] = useState<number | "new" | null>(null);
    const [requestType, setRequestType] =
        useState<PromoterRequest["type"]>("increase_group_limit");
    const [requestMessage, setRequestMessage] = useState("");

    const studentDegree = (searchParams.get("degree") as "inż" | "mgr") || "inż";
    const id = Number(promoterId);
    const promoter = MOCK_PROMOTERS.find((p) => p.id === id);
    const topics = MOCK_TOPICS.filter((t) => t.promoterId === id && t.degreeType === studentDegree);

    if (!promoter) {
        return (
            <div style={{ padding: "20px" }}>
                <h2>Nie znaleziono takiego promotora.</h2>
                <button onClick={() => navigate("/student")}>← Powrót do listy</button>
            </div>
        );
    }

    // Walidacja możliwości zapisu na dany temat
    const getEnrollmentStatus = (topic: Topic): { canEnroll: boolean; reason?: string } => {
        const isReservedForMe = topic.isReserved && topic.reservedForEmail === CURRENT_STUDENT.email;

        if (topic.isReserved && !isReservedForMe) {
            return { canEnroll: false, reason: "Temat jest zarezerwowany dla innego studenta/grupy." };
        }

        if (topic.isGroup) {
            if (!group) {
                return { canEnroll: false, reason: "Ten temat wymaga utworzenia grupy projektowej." };
            }
            const currentMember = group.members.find((m) => m.id === CURRENT_STUDENT.id);
            if (!currentMember?.isLeader) {
                return { canEnroll: false, reason: "Tylko lider może zapisać grupę na temat." };
            }
            if (!group.isLocked) {
                return {
                    canEnroll: false,
                    reason: "Najpierw zamknij i zatwierdź skład grupy w zakładce 'Moja Grupa Projektowa'.",
                };
            }
            if (group.members.length < topic.minMembers || group.members.length > topic.maxMembers) {
                return {
                    canEnroll: false,
                    reason: `Liczba osób w grupie (${group.members.length}) nie mieści się w limicie (${topic.minMembers}-${topic.maxMembers}).`,
                };
            }
        }

        return { canEnroll: true };
    };

    const handleEnroll = (topic: Topic) => {
        if (selectedTopicId && selectedTopicId !== topic.id) {
            const confirmed = confirm(
                "Masz już wybrany inny temat. Czy chcesz z niego zrezygnować i zapisać się na ten?"
            );
            if (!confirmed) return;
        }
        selectTopic(topic.id);
    };

    const handleSendRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!requestMessage.trim()) return;

        sendRequest({
            promoterId: promoter.id,
            topicId: typeof requestFormTopicId === "number" ? requestFormTopicId : undefined,
            type: requestFormTopicId === "new" ? "new_topic_slot" : requestType,
            message: requestMessage,
        });

        alert("Wiadomość została wysłana do promotora.");
        setRequestMessage("");
        setRequestFormTopicId(null);
    };

    const promoterRequests = requests.filter((r) => r.promoterId === promoter.id);

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

            {/* Nagłówek promotora */}
            <header
                style={{
                    padding: "20px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    marginBottom: "25px",
                    borderLeft: "5px solid #0056b3",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px",
                }}
            >
                <div>
                    <h1 style={{ margin: "0 0 5px 0" }}>
                        {promoter.degree} {promoter.name}
                    </h1>
                    <p style={{ margin: "0", color: "#555" }}>{promoter.department}</p>
                    <p style={{ margin: "5px 0 0 0", color: "#0056b3", fontWeight: "bold" }}>
                        Widok tematów: {studentDegree === "inż" ? "Inżynierskie (I st.)" : "Magisterskie (II st.)"}
                    </p>
                </div>

                <button
                    onClick={() => {
                        setRequestFormTopicId("new");
                        setRequestType("new_topic_slot");
                    }}
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#fff",
                        border: "1px solid #0056b3",
                        color: "#0056b3",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    ✉️ Zaproponuj własny temat / poproś o slot
                </button>
            </header>

            {/* Formularz prośby o własny temat */}
            {requestFormTopicId === "new" && (
                <form
                    onSubmit={handleSendRequest}
                    style={{
                        padding: "20px",
                        backgroundColor: "#eef6ff",
                        border: "1px solid #b8daff",
                        borderRadius: "8px",
                        marginBottom: "25px",
                    }}
                >
                    <h3 style={{ marginTop: 0 }}>Prośba o zwiększenie limitu prac i propozycja tematu</h3>
                    <textarea
                        rows={4}
                        placeholder="Opisz proponowany temat pracy oraz skład zespołu..."
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        style={{ width: "100%", padding: "10px", boxSizing: "border-box", marginBottom: "10px" }}
                        required
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            type="submit"
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#0056b3",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Wyślij wiadomość
                        </button>
                        <button
                            type="button"
                            onClick={() => setRequestFormTopicId(null)}
                            style={{ padding: "8px 16px", cursor: "pointer" }}
                        >
                            Anuluj
                        </button>
                    </div>
                </form>
            )}

            <h2>Dostępne tematy ({topics.length})</h2>

            <div style={{ display: "grid", gap: "20px", marginTop: "15px" }}>
                {topics.map((topic) => {
                    const isSelectedByMe = selectedTopicId === topic.id;
                    const isReservedForMe =
                        topic.isReserved && topic.reservedForEmail === CURRENT_STUDENT.email;
                    const { canEnroll, reason } = getEnrollmentStatus(topic);
                    const totalApplicants = topic.applicantsCount + (isSelectedByMe ? 1 : 0);

                    return (
                        <div
                            key={topic.id}
                            style={{
                                border: isSelectedByMe ? "2px solid #28a745" : "1px solid #ddd",
                                padding: "20px",
                                borderRadius: "8px",
                                backgroundColor: isSelectedByMe ? "#f3fbf5" : "#fff",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                                <h3 style={{ margin: "0 0 8px 0" }}>{topic.title}</h3>
                                {isSelectedByMe && (
                                    <span style={{ color: "#28a745", fontWeight: "bold", whiteSpace: "nowrap" }}>
                    ✅ Twój wybór
                  </span>
                                )}
                                {isReservedForMe && !isSelectedByMe && (
                                    <span style={{ color: "#0056b3", fontWeight: "bold", whiteSpace: "nowrap" }}>
                    ⭐ Zarezerwowany dla Ciebie
                  </span>
                                )}
                            </div>

                            <p style={{ color: "#444" }}>{topic.description}</p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "20px",
                                    fontSize: "14px",
                                    color: "#666",
                                    marginBottom: "12px",
                                    flexWrap: "wrap",
                                }}
                            >
                <span>
                  👥 Formuła:{" "}
                    <strong>{topic.isGroup ? `Grupowa (${topic.groupLimit})` : "Indywidualna"}</strong>
                </span>
                                <span>
                  📊 Liczba chętnych: <strong>{totalApplicants}</strong>
                                    {totalApplicants > 1 && " (konkurs średnich)"}
                </span>
                            </div>

                            {!canEnroll && reason && (
                                <p style={{ color: "#b71c1c", fontSize: "13px", margin: "8px 0" }}>
                                    ⚠️ {reason}{" "}
                                    {topic.isGroup && (
                                        <button
                                            onClick={() => navigate("/student/group")}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "#0056b3",
                                                textDecoration: "underline",
                                                cursor: "pointer",
                                                padding: 0,
                                            }}
                                        >
                                            Przejdź do grupy
                                        </button>
                                    )}
                                </p>
                            )}

                            {/* Przyciski akcji */}
                            <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                                {isSelectedByMe ? (
                                    <button
                                        onClick={cancelTopicSelection}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "#dc3545",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Zrezygnuj z tematu
                                    </button>
                                ) : (
                                    <button
                                        disabled={!canEnroll}
                                        onClick={() => handleEnroll(topic)}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: canEnroll ? "#0056b3" : "#ccc",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: canEnroll ? "pointer" : "not-allowed",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {topic.isGroup ? "Zapisz grupę na ten temat" : "Wybierz ten temat"}
                                    </button>
                                )}

                                {topic.isGroup && (
                                    <button
                                        onClick={() => {
                                            setRequestFormTopicId(topic.id);
                                            setRequestType("increase_group_limit");
                                        }}
                                        style={{
                                            padding: "8px 14px",
                                            backgroundColor: "#f0f0f0",
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        ✉️ Zapytaj o zmianę limitu / pisanie solo
                                    </button>
                                )}
                            </div>

                            {/* Formularz prośby dotyczącej konkretnego tematu */}
                            {requestFormTopicId === topic.id && (
                                <form
                                    onSubmit={handleSendRequest}
                                    style={{
                                        marginTop: "15px",
                                        padding: "15px",
                                        backgroundColor: "#f8f9fa",
                                        border: "1px solid #ddd",
                                        borderRadius: "6px",
                                    }}
                                >
                                    <div style={{ marginBottom: "10px" }}>
                                        <label style={{ fontSize: "14px", fontWeight: "bold", display: "block" }}>
                                            Rodzaj prośby:
                                        </label>
                                        <select
                                            value={requestType}
                                            onChange={(e) => setRequestType(e.target.value as PromoterRequest["type"])}
                                            style={{ padding: "6px", marginTop: "4px", width: "100%" }}
                                        >
                                            <option value="increase_group_limit">Prośba o zwiększenie limitu osób w grupie</option>
                                            <option value="solo_permission">Prośba o zgodę na realizację projektu solo</option>
                                        </select>
                                    </div>
                                    <textarea
                                        rows={3}
                                        placeholder="Wpisz uzasadnienie dla promotora..."
                                        value={requestMessage}
                                        onChange={(e) => setRequestMessage(e.target.value)}
                                        style={{ width: "100%", padding: "8px", boxSizing: "border-box", marginBottom: "8px" }}
                                        required
                                    />
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            type="submit"
                                            style={{
                                                padding: "6px 14px",
                                                backgroundColor: "#0056b3",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Wyślij
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRequestFormTopicId(null)}
                                            style={{ padding: "6px 14px", cursor: "pointer" }}
                                        >
                                            Anuluj
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    );
                })}

                {topics.length === 0 && (
                    <p style={{ color: "#777" }}>
                        Ten promotor nie zgłosił żadnych tematów dla studiów{" "}
                        {studentDegree === "inż" ? "inżynierskich" : "magisterskich"}.
                    </p>
                )}
            </div>

            {/* Historia wysłanych próśb do tego promotora */}
            {promoterRequests.length > 0 && (
                <section style={{ marginTop: "30px" }}>
                    <h3>Wysłane prośby do tego promotora</h3>
                    <ul style={{ paddingLeft: "20px" }}>
                        {promoterRequests.map((req) => (
                            <li key={req.id} style={{ marginBottom: "8px", fontSize: "14px" }}>
                                <strong>[{req.createdAt}]</strong> {req.message}
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}