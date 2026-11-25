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
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
                <h2 className="text-xl font-bold text-slate-900">Nie znaleziono takiego promotora</h2>
                <button
                    onClick={() => navigate("/student")}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 cursor-pointer"
                >
                    ← Powrót do listy promotorów
                </button>
            </div>
        );
    }

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
        <div className="space-y-6">
            <button
                onClick={() => navigate("/student")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
                ← Powrót do listy promotorów
            </button>

            {/* Nagłówek promotora */}
            <header className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-blue-600 p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                        {promoter.degree}
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{promoter.name}</h1>
                    <p className="text-sm text-slate-600 mt-1">{promoter.department}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                        <span className="text-slate-500">📧 {promoter.email}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
              Studia: {studentDegree === "inż" ? "Inżynierskie (I st.)" : "Magisterskie (II st.)"}
            </span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        setRequestFormTopicId("new");
                        setRequestType("new_topic_slot");
                    }}
                    className="self-start md:self-center px-4 py-2.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-medium transition-colors cursor-pointer"
                >
                    ✉️ Zaproponuj własny temat / poproś o slot
                </button>
            </header>

            {/* Formularz prośby o własny temat */}
            {requestFormTopicId === "new" && (
                <form
                    onSubmit={handleSendRequest}
                    className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 space-y-3"
                >
                    <h3 className="text-base font-bold text-slate-900">
                        Prośba o zwiększenie limitu prac i propozycja tematu
                    </h3>
                    <textarea
                        rows={4}
                        placeholder="Opisz proponowany temat pracy oraz skład zespołu..."
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        className="w-full p-3 rounded-lg border border-blue-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer"
                        >
                            Wyślij wiadomość
                        </button>
                        <button
                            type="button"
                            onClick={() => setRequestFormTopicId(null)}
                            className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium cursor-pointer"
                        >
                            Anuluj
                        </button>
                    </div>
                </form>
            )}

            {/* Lista tematów */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Dostępne tematy ({topics.length})</h2>

                {topics.map((topic) => {
                    const isSelectedByMe = selectedTopicId === topic.id;
                    const isReservedForMe =
                        topic.isReserved && topic.reservedForEmail === CURRENT_STUDENT.email;
                    const { canEnroll, reason } = getEnrollmentStatus(topic);
                    const totalApplicants = topic.applicantsCount + (isSelectedByMe ? 1 : 0);

                    return (
                        <div
                            key={topic.id}
                            className={`rounded-xl p-6 transition-all shadow-xs ${
                                isSelectedByMe
                                    ? "bg-emerald-50/40 border-2 border-emerald-500"
                                    : "bg-white border border-slate-200"
                            }`}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <h3 className="text-lg font-bold text-slate-900">{topic.title}</h3>
                                <div className="flex items-center gap-2">
                                    {isSelectedByMe && (
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                      ✅ Twój wybór
                    </span>
                                    )}
                                    {isReservedForMe && !isSelectedByMe && (
                                        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
                      ⭐ Zarezerwowany dla Ciebie
                    </span>
                                    )}
                                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                    {topic.isGroup ? `👥 Grupowa (${topic.groupLimit})` : "👤 Indywidualna"}
                  </span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">{topic.description}</p>

                            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span>
                  📊 Liczba chętnych: <strong className="text-slate-800">{totalApplicants}</strong>
                    {totalApplicants > 1 && (
                        <span className="ml-1.5 text-amber-700 font-medium">(konkurs średnich)</span>
                    )}
                </span>
                            </div>

                            {!canEnroll && reason && (
                                <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-wrap items-center gap-2">
                                    <span>⚠️ {reason}</span>
                                    {topic.isGroup && (
                                        <button
                                            onClick={() => navigate("/student/group")}
                                            className="font-semibold text-blue-700 underline hover:text-blue-900 cursor-pointer"
                                        >
                                            Przejdź do grupy →
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
                                {isSelectedByMe ? (
                                    <button
                                        onClick={cancelTopicSelection}
                                        className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        Zrezygnuj z tematu
                                    </button>
                                ) : (
                                    <button
                                        disabled={!canEnroll}
                                        onClick={() => handleEnroll(topic)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            canEnroll
                                                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        }`}
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
                                        className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        ✉️ Zapytaj o zmianę limitu / pisanie solo
                                    </button>
                                )}
                            </div>

                            {/* Formularz prośby dotyczącej konkretnego tematu */}
                            {requestFormTopicId === topic.id && (
                                <form
                                    onSubmit={handleSendRequest}
                                    className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3"
                                >
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Rodzaj prośby
                                        </label>
                                        <select
                                            value={requestType}
                                            onChange={(e) => setRequestType(e.target.value as PromoterRequest["type"])}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                                        >
                                            <option value="increase_group_limit">
                                                Prośba o zwiększenie limitu osób w grupie
                                            </option>
                                            <option value="solo_permission">
                                                Prośba o zgodę na realizację projektu solo
                                            </option>
                                        </select>
                                    </div>
                                    <textarea
                                        rows={3}
                                        placeholder="Wpisz uzasadnienie dla promotora..."
                                        value={requestMessage}
                                        onChange={(e) => setRequestMessage(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer"
                                        >
                                            Wyślij
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRequestFormTopicId(null)}
                                            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm cursor-pointer"
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
                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
                        Ten promotor nie zgłosił żadnych tematów dla studiów{" "}
                        {studentDegree === "inż" ? "inżynierskich" : "magisterskich"}.
                    </div>
                )}
            </div>

            {/* Historia wysłanych próśb */}
            {promoterRequests.length > 0 && (
                <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">Wysłane prośby do tego promotora</h3>
                    <ul className="divide-y divide-slate-100 text-sm">
                        {promoterRequests.map((req) => (
                            <li key={req.id} className="py-2.5 flex gap-3">
                                <span className="text-xs font-mono text-slate-400 shrink-0">{req.createdAt}</span>
                                <span className="text-slate-700">{req.message}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}