import { useState } from "react";
import { INITIAL_STUDENT_REQUESTS } from "./mockData";
import type { RequestStatus, RequestType, StudentRequestItem } from "./mockData";

const REQUEST_TYPE_META: Record<RequestType, { label: string; badgeClass: string }> = {
    new_topic_slot: {
        label: "💡 Propozycja tematu / nowy slot",
        badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    },
    increase_group_limit: {
        label: "👥 Zwiększenie limitu grupy",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    },
    solo_permission: {
        label: "👤 Zgoda na realizację solo",
        badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    },
};

export default function PromotorRequests() {
    const [requests, setRequests] = useState<StudentRequestItem[]>(INITIAL_STUDENT_REQUESTS);
    const [statusFilter, setStatusFilter] = useState<"all" | RequestStatus>("all");
    const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

    const pendingCount = requests.filter((r) => r.status === "pending").length;
    const approvedCount = requests.filter((r) => r.status === "approved").length;
    const rejectedCount = requests.filter((r) => r.status === "rejected").length;

    const filteredRequests = requests.filter(
        (req) => statusFilter === "all" || req.status === statusFilter
    );

    const handleDecision = (id: string, decision: "approved" | "rejected") => {
        const reply = replyDrafts[id]?.trim();

        if (decision === "rejected" && !reply) {
            alert("Wpisz krótkie uzasadnienie przed odrzuceniem prośby studenta.");
            return;
        }

        setRequests((prev) =>
            prev.map((req) =>
                req.id === id
                    ? {
                        ...req,
                        status: decision,
                        promoterReply:
                            reply ||
                            (decision === "approved"
                                ? "Prośba została zaakceptowana."
                                : "Prośba została odrzucona."),
                    }
                    : req
            )
        );
    };

    const handleResetDecision = (id: string) => {
        setRequests((prev) =>
            prev.map((req) =>
                req.id === id ? { ...req, status: "pending", promoterReply: undefined } : req
            )
        );
    };

    return (
        <div className="space-y-6">
            {/* Nagłówek */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Prośby Studentów</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Rozpatruj wnioski o własne tematy, powiększenie limitów grup oraz indywidualną realizację.
                    </p>
                </div>

                {/* Statystyka oczekujących */}
                <div className="inline-flex items-center gap-2 self-start sm:self-center px-3.5 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium">
                    <span>⏳ Oczekujące na decyzję:</span>
                    <strong className="text-base">{pendingCount}</strong>
                </div>
            </div>

            {/* Filtry statusu */}
            <div className="inline-flex flex-wrap bg-slate-200/70 p-1 rounded-lg text-xs font-medium">
                {(
                    [
                        { key: "all", label: `Wszystkie (${requests.length})` },
                        { key: "pending", label: `Oczekujące (${pendingCount})` },
                        { key: "approved", label: `Zaakceptowane (${approvedCount})` },
                        { key: "rejected", label: `Odrzucone (${rejectedCount})` },
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setStatusFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                            statusFilter === tab.key
                                ? "bg-white text-emerald-700 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Lista próśb */}
            <div className="space-y-4">
                {filteredRequests.map((req) => {
                    const typeMeta = REQUEST_TYPE_META[req.type];
                    const isPending = req.status === "pending";

                    return (
                        <div
                            key={req.id}
                            className={`bg-white rounded-xl border p-6 shadow-xs space-y-4 ${
                                isPending ? "border-slate-200 border-l-4 border-l-amber-400" : "border-slate-200"
                            }`}
                        >
                            {/* Górny pasek z typem, statusem i datą */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                  <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeMeta.badgeClass}`}
                  >
                    {typeMeta.label}
                  </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {req.degreeType === "inż" ? "Inżynierskie" : "Magisterskie"}
                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs">
                                    <span className="text-slate-400">{req.createdAt}</span>
                                    {req.status === "pending" && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">
                      ⏳ Oczekuje
                    </span>
                                    )}
                                    {req.status === "approved" && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                      ✅ Zaakceptowano
                    </span>
                                    )}
                                    {req.status === "rejected" && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold">
                      ❌ Odrzucono
                    </span>
                                    )}
                                </div>
                            </div>

                            {/* Dane studenta / grupy */}
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                                <div>
                                    <span className="text-slate-500">Nadawca: </span>
                                    <strong className="text-slate-900">{req.studentName}</strong>{" "}
                                    <span className="text-xs text-slate-500">({req.studentEmail})</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Średnia: </span>
                                    <strong className="text-slate-900">{req.studentGpa.toFixed(2)}</strong>
                                </div>
                                {req.groupName && (
                                    <div>
                                        <span className="text-slate-500">Grupa: </span>
                                        <strong className="text-slate-900">
                                            {req.groupName} ({req.groupSize} os.)
                                        </strong>
                                    </div>
                                )}
                            </div>

                            {/* Powiązany temat (jeśli dotyczy) */}
                            {req.topicTitle && (
                                <div className="text-xs bg-slate-50 border border-slate-200/80 rounded-lg px-3.5 py-2 text-slate-700">
                                    <span className="font-semibold text-slate-500">Dotyczy tematu: </span>
                                    {req.topicTitle}
                                </div>
                            )}

                            {/* Treść wiadomości */}
                            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/60 p-4 rounded-lg border border-slate-100">
                                „{req.message}”
                            </p>

                            {/* Sekcja decyzji lub podsumowanie odpowiedzi */}
                            {isPending ? (
                                <div className="pt-2 space-y-3">
                  <textarea
                      rows={2}
                      placeholder="Opcjonalna odpowiedź / uzasadnienie dla studenta (wymagane przy odrzuceniu)..."
                      value={replyDrafts[req.id] ?? ""}
                      onChange={(e) =>
                          setReplyDrafts((prev) => ({ ...prev, [req.id]: e.target.value }))
                      }
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDecision(req.id, "approved")}
                                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors cursor-pointer"
                                        >
                                            ✅ Akceptuj prośbę
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDecision(req.id, "rejected")}
                                            className="px-4 py-2 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-sm font-medium transition-colors cursor-pointer"
                                        >
                                            ✕ Odrzuć
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                                    <div className="text-slate-600">
                                        <span className="font-semibold text-slate-800">Twoja odpowiedź: </span>
                                        {req.promoterReply}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleResetDecision(req.id)}
                                        className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                                    >
                                        Cofnij decyzję
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredRequests.length === 0 && (
                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
                        Brak próśb studentów w wybranej kategorii.
                    </div>
                )}
            </div>
        </div>
    );
}