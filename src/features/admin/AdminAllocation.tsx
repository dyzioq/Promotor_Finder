import { useState } from "react";
import { INITIAL_ALLOCATION_TOPICS } from "./mockData";
import type { AllocationStatus, AllocationTopic, TopicApplicant } from "./mockData";

// Zwraca średnie członków posortowane malejąco
function getSortedGpas(applicant: TopicApplicant): number[] {
    return [...applicant.memberGpas].sort((a, b) => b - a);
}

// Sortowanie kandydatów w tabeli wg kolejnych par średnich
function compareApplicants(a: TopicApplicant, b: TopicApplicant): number {
    const gpasA = getSortedGpas(a);
    const gpasB = getSortedGpas(b);
    const comparablePairs = Math.min(gpasA.length, gpasB.length);

    for (let i = 0; i < comparablePairs; i++) {
        if (gpasB[i] !== gpasA[i]) {
            return gpasB[i] - gpasA[i];
        }
    }
    return 0;
}

// Algorytm rozstrzygania konkursu z dogrywką po kolejnych parach średnich
function resolveTopicAllocation(applicants: TopicApplicant[]): {
    status: AllocationStatus;
    winnerId: string | null;
    tiedIds: string[];
    resolutionNote: string;
} {
    if (applicants.length === 0) {
        return { status: "pending", winnerId: null, tiedIds: [], resolutionNote: "" };
    }

    if (applicants.length === 1) {
        return {
            status: "resolved",
            winnerId: applicants[0].id,
            tiedIds: [],
            resolutionNote: "Jedyny kandydat na ten temat.",
        };
    }

    let contenders = [...applicants];
    let pairIndex = 0;

    while (contenders.length > 1) {
        // Zabezpieczenie: sprawdzamy maksymalnie tyle par, ile osób liczy najmniejsza z remisujących grup
        const maxComparablePairs = Math.min(...contenders.map((c) => c.memberGpas.length));

        if (pairIndex >= maxComparablePairs) {
            return {
                status: "tie",
                winnerId: null,
                tiedIds: contenders.map((c) => c.id),
                resolutionNote: `Remis po porównaniu ${maxComparablePairs} ${
                    maxComparablePairs === 1 ? "pary" : "par"
                } średnich — wymagana ręczna decyzja promotora.`,
            };
        }

        const bestGpaInPair = Math.max(
            ...contenders.map((c) => getSortedGpas(c)[pairIndex])
        );

        contenders = contenders.filter(
            (c) => getSortedGpas(c)[pairIndex] === bestGpaInPair
        );

        if (contenders.length === 1) {
            const note =
                pairIndex === 0
                    ? `Wyłoniono na podstawie 1. najwyższej średniej (${bestGpaInPair.toFixed(2)}).`
                    : `Rozstrzygnięto automatycznie w ${pairIndex + 1}. parze średnich (${bestGpaInPair.toFixed(2)}).`;

            return {
                status: "resolved",
                winnerId: contenders[0].id,
                tiedIds: [],
                resolutionNote: note,
            };
        }

        pairIndex++;
    }

    return { status: "pending", winnerId: null, tiedIds: [], resolutionNote: "" };
}

export default function AdminAllocation() {
    const [topics, setTopics] = useState<AllocationTopic[]>(INITIAL_ALLOCATION_TOPICS);
    const [filter, setFilter] = useState<"all" | "contested" | AllocationStatus>("all");

    const handleRunAllocation = () => {
        setTopics((prev) =>
            prev.map((topic) => {
                const result = resolveTopicAllocation(topic.applicants);
                return {
                    ...topic,
                    status: result.status,
                    winnerId: result.winnerId,
                    tiedIds: result.tiedIds,
                    resolutionNote: result.resolutionNote,
                };
            })
        );
    };

    const handleManualPick = (topicId: number, applicantId: string) => {
        setTopics((prev) =>
            prev.map((topic) =>
                topic.id === topicId
                    ? {
                        ...topic,
                        winnerId: applicantId,
                        tiedIds: [],
                        status: "resolved",
                        resolutionNote: "Zwycięzca wskazany ręcznie przez promotora.",
                    }
                    : topic
            )
        );
    };

    const handleReset = () => {
        setTopics((prev) =>
            prev.map((topic) => ({
                ...topic,
                winnerId: null,
                tiedIds: [],
                resolutionNote: undefined,
                status: "pending",
            }))
        );
    };

    const resolvedCount = topics.filter((t) => t.status === "resolved").length;
    const tieCount = topics.filter((t) => t.status === "tie").length;
    const pendingCount = topics.filter((t) => t.status === "pending").length;

    const rejectedApplicants = topics
        .filter((t) => t.status === "resolved" && t.winnerId)
        .flatMap((t) =>
            t.applicants
                .filter((a) => a.id !== t.winnerId)
                .map((a) => ({
                    ...a,
                    lostTopicTitle: t.title,
                    degreeType: t.degreeType,
                }))
        );

    const filteredTopics = topics.filter((t) => {
        if (filter === "all") return true;
        if (filter === "contested") return t.applicants.length > 1;
        return t.status === filter;
    });

    return (
        <div className="space-y-6">
            {/* Nagłówek i główne akcje */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Konkurs Średnich i Przydział Tematów</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Przy remisie system automatycznie porównuje kolejne pary średnich (do liczebności mniejszej grupy), a nierozstrzygnięte remisy przekazuje promotorowi.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
                    <button
                        type="button"
                        onClick={handleRunAllocation}
                        className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                        🏆 Uruchom automatyczny przydział
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
                    >
                        ↺ Resetuj
                    </button>
                </div>
            </div>

            {/* Kafelki podsumowania */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <div className="text-xs font-medium text-slate-500">Oczekujące na przydział</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">{pendingCount}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Spośród {topics.length} tematów</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <div className="text-xs font-medium text-slate-500">Rozstrzygnięte</div>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">{resolvedCount}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Przydzielony zwycięzca</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <div className="text-xs font-medium text-slate-500">Remisy dla promotora</div>
                    <div className={`text-2xl font-bold mt-1 ${tieCount > 0 ? "text-amber-600" : "text-slate-900"}`}>
                        {tieCount}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Brak kolejnych par do porównania</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <div className="text-xs font-medium text-slate-500">Tura dodatkowa</div>
                    <div className="text-2xl font-bold text-rose-600 mt-1">{rejectedApplicants.length}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Kandydaci bez przydziału</div>
                </div>
            </div>

            {/* Filtry */}
            <div className="inline-flex flex-wrap bg-slate-200/70 p-1 rounded-lg text-xs font-medium">
                {(
                    [
                        { key: "all", label: `Wszystkie (${topics.length})` },
                        {
                            key: "contested",
                            label: `Sporne (${topics.filter((t) => t.applicants.length > 1).length})`,
                        },
                        { key: "tie", label: `Remisy (${tieCount})` },
                        { key: "resolved", label: `Rozstrzygnięte (${resolvedCount})` },
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                            filter === tab.key
                                ? "bg-white text-rose-700 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Lista tematów z kandydatami */}
            <div className="space-y-4">
                {filteredTopics.map((topic) => {
                    const sortedApplicants = [...topic.applicants].sort(compareApplicants);

                    return (
                        <div
                            key={topic.id}
                            className={`bg-white rounded-xl border shadow-xs overflow-hidden ${
                                topic.status === "tie"
                                    ? "border-amber-300 border-l-4 border-l-amber-500"
                                    : topic.status === "resolved"
                                        ? "border-slate-200 border-l-4 border-l-emerald-500"
                                        : "border-slate-200"
                            }`}
                        >
                            {/* Nagłówek tematu */}
                            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            topic.degreeType === "inż"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-purple-50 text-purple-700"
                        }`}
                    >
                      {topic.degreeType === "inż" ? "Inżynierska" : "Magisterska"}
                    </span>
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      {topic.isGroup ? "👥 Grupowa" : "👤 Indywidualna"}
                    </span>
                                        <span className="text-xs text-slate-500">
                      Chętnych: <strong>{topic.applicants.length}</strong>
                    </span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">{topic.title}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Promotor: {topic.promoterName}</p>
                                </div>

                                <div>
                                    {topic.status === "pending" && (
                                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                      ⏳ Oczekuje na przydział
                    </span>
                                    )}
                                    {topic.status === "resolved" && (
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      ✅ Rozstrzygnięty
                    </span>
                                    )}
                                    {topic.status === "tie" && (
                                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
                      ⚠️ Remis – decyzja promotora
                    </span>
                                    )}
                                </div>
                            </div>

                            {/* Informacja o sposobie rozstrzygnięcia / dogrywki */}
                            {topic.resolutionNote && (
                                <div
                                    className={`px-6 py-2.5 text-xs font-medium border-b ${
                                        topic.status === "tie"
                                            ? "bg-amber-50 text-amber-900 border-amber-100"
                                            : "bg-emerald-50/70 text-emerald-800 border-emerald-100"
                                    }`}
                                >
                                    {topic.status === "tie" ? "⚖️ " : "ℹ️ "}
                                    {topic.resolutionNote}
                                </div>
                            )}

                            {/* Tabela kandydatów */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                                        <th className="px-6 py-2.5 font-semibold">Kandydat / Skład</th>
                                        <th className="px-6 py-2.5 font-semibold">
                                            {topic.isGroup ? "Kolejne średnie (malejąco)" : "Średnia ocen"}
                                        </th>
                                        <th className="px-6 py-2.5 font-semibold">Data zgłoszenia</th>
                                        <th className="px-6 py-2.5 font-semibold text-right">Decyzja</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                    {sortedApplicants.map((app) => {
                                        const isWinner = topic.winnerId === app.id;
                                        const isLost = topic.status === "resolved" && !isWinner;
                                        const isTied = topic.status === "tie" && topic.tiedIds?.includes(app.id);
                                        const sortedGpas = getSortedGpas(app);

                                        return (
                                            <tr
                                                key={app.id}
                                                className={
                                                    isWinner
                                                        ? "bg-emerald-50/60"
                                                        : isTied
                                                            ? "bg-amber-50/50"
                                                            : isLost
                                                                ? "opacity-60"
                                                                : ""
                                                }
                                            >
                                                <td className="px-6 py-3.5">
                                                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                                                        <span>{app.name}</span>
                                                        {isWinner && (
                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                                  🏆 Przyznano temat
                                </span>
                                                        )}
                                                        {isLost && (
                                                            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[11px] font-medium">
                                  Tura dodatkowa
                                </span>
                                                        )}
                                                    </div>
                                                    {app.type === "group" && (
                                                        <div className="text-xs text-slate-500 mt-0.5">
                                                            {app.members.join(" • ")}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {sortedGpas.map((gpa, idx) => (
                                                            <span
                                                                key={idx}
                                                                className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                                    idx === 0
                                                                        ? "bg-slate-900 text-white"
                                                                        : "bg-slate-100 text-slate-700"
                                                                }`}
                                                            >
                                  {gpa.toFixed(2)}
                                </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5 text-xs text-slate-500">{app.submittedAt}</td>
                                                <td className="px-6 py-3.5 text-right">
                                                    {!isWinner ? (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleManualPick(topic.id, app.id)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                                                isTied
                                                                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                                                                    : "border border-slate-300 text-slate-700 hover:bg-slate-100"
                                                            }`}
                                                        >
                                                            {isTied ? "Wskaż jako promotor" : "Przyznaj ręcznie"}
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs font-semibold text-emerald-700">Wybrany</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}

                {filteredTopics.length === 0 && (
                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
                        Brak tematów spełniających wybrane kryterium.
                    </div>
                )}
            </div>

            {/* Podsumowanie kandydatów do tury dodatkowej */}
            {rejectedApplicants.length > 0 && (
                <section className="bg-white rounded-xl border border-rose-200 p-6 shadow-xs space-y-3">
                    <h2 className="text-base font-bold text-slate-900">
                        Kandydaci bez przydziału – do tury dodatkowej ({rejectedApplicants.length})
                    </h2>
                    <ul className="divide-y divide-slate-100 text-sm">
                        {rejectedApplicants.map((app) => (
                            <li key={app.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <strong className="text-slate-900">{app.name}</strong>{" "}
                                    <span className="text-xs text-slate-500">
                    (Średnia max: {app.effectiveGpa.toFixed(2)}, {app.degreeType})
                  </span>
                                </div>
                                <span className="text-xs text-slate-500">
                  Nieprzyznany temat: <em>{app.lostTopicTitle}</em>
                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}