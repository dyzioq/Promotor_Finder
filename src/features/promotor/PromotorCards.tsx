import { useState } from "react";
import {
    AVAILABLE_REVIEWERS,
    CURRENT_PROMOTER,
    INITIAL_APPLICATION_CARDS,
} from "./mockData";
import type { ApplicationCardStatus, PromotorApplicationCard } from "./mockData";

export default function PromotorCards() {
    const [cards, setCards] = useState<PromotorApplicationCard[]>(INITIAL_APPLICATION_CARDS);
    const [statusFilter, setStatusFilter] = useState<"all" | ApplicationCardStatus>("all");
    const [expandedCardId, setExpandedCardId] = useState<string | null>(
        INITIAL_APPLICATION_CARDS[0]?.id ?? null
    );

    // Robocze wybory recenzentów i uwag do poprawy dla poszczególnych kart
    const [reviewerDrafts, setReviewerDrafts] = useState<Record<string, string>>({});
    const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});

    const pendingCount = cards.filter((c) => c.status === "pending_approval").length;
    const revisionCount = cards.filter((c) => c.status === "needs_revision").length;
    const approvedCount = cards.filter((c) => c.status === "approved").length;

    const filteredCards = cards.filter(
        (card) => statusFilter === "all" || card.status === statusFilter
    );

    const handleApprove = (cardId: string) => {
        const selectedReviewer = reviewerDrafts[cardId] || AVAILABLE_REVIEWERS[0];

        setCards((prev) =>
            prev.map((card) =>
                card.id === cardId
                    ? {
                        ...card,
                        status: "approved",
                        reviewer: selectedReviewer,
                        revisionComment: undefined,
                    }
                    : card
            )
        );
    };

    const handleReturnForRevision = (cardId: string) => {
        const comment = commentDrafts[cardId]?.trim();
        if (!comment) {
            alert("Wpisz uwagi dla studenta przed zwróceniem karty do poprawy.");
            return;
        }

        setCards((prev) =>
            prev.map((card) =>
                card.id === cardId
                    ? {
                        ...card,
                        status: "needs_revision",
                        revisionComment: comment,
                    }
                    : card
            )
        );
    };

    const handleReopenCard = (cardId: string) => {
        setCards((prev) =>
            prev.map((card) =>
                card.id === cardId ? { ...card, status: "pending_approval" } : card
            )
        );
    };

    return (
        <div className="space-y-6">
            {/* Nagłówek */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Karty Zgłoszeń Prac</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Weryfikuj treść kart zgłoszeń, wskazuj recenzentów i zatwierdzaj dokumenty do wydruku.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 self-start sm:self-center px-3.5 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-sm font-medium">
                    <span>📄 Do weryfikacji:</span>
                    <strong className="text-base">{pendingCount}</strong>
                </div>
            </div>

            {/* Filtry statusu */}
            <div className="inline-flex flex-wrap bg-slate-200/70 p-1 rounded-lg text-xs font-medium">
                {(
                    [
                        { key: "all", label: `Wszystkie (${cards.length})` },
                        { key: "pending_approval", label: `Do weryfikacji (${pendingCount})` },
                        { key: "needs_revision", label: `Do poprawy (${revisionCount})` },
                        { key: "approved", label: `Zatwierdzone (${approvedCount})` },
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

            {/* Lista kart zgłoszeń */}
            <div className="space-y-4">
                {filteredCards.map((card) => {
                    const isExpanded = expandedCardId === card.id;
                    const isPending = card.status === "pending_approval";

                    return (
                        <div
                            key={card.id}
                            className={`bg-white rounded-xl border shadow-xs overflow-hidden transition-all ${
                                isPending
                                    ? "border-slate-200 border-l-4 border-l-blue-500"
                                    : card.status === "approved"
                                        ? "border-slate-200 border-l-4 border-l-emerald-500"
                                        : "border-slate-200 border-l-4 border-l-amber-400"
                            }`}
                        >
                            {/* Nagłówek karty (klikalny do rozwijania) */}
                            <div
                                onClick={() => setExpandedCardId(isExpanded ? null : card.id)}
                                className="p-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                                <div className="space-y-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-mono text-slate-400">{card.id}</span>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                card.degreeType === "inż"
                                                    ? "bg-blue-50 text-blue-700"
                                                    : "bg-purple-50 text-purple-700"
                                            }`}
                                        >
                      {card.degreeType === "inż" ? "Inżynierska" : "Magisterska"}
                    </span>
                                        <span className="text-xs text-slate-500">
                      {card.studyField} ({card.studyMode})
                    </span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">{card.titlePl}</h3>
                                    <p className="text-xs text-slate-500">
                                        {card.groupName ? `${card.groupName}: ` : "Dyplomant: "}
                                        <strong className="text-slate-700">
                                            {card.authors.map((a) => a.name).join(", ")}
                                        </strong>{" "}
                                        • Przesłano: {card.submittedAt}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                    {card.status === "pending_approval" && (
                                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                      ⏳ Do weryfikacji
                    </span>
                                    )}
                                    {card.status === "needs_revision" && (
                                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
                      ✏️ Zwrócono do poprawy
                    </span>
                                    )}
                                    {card.status === "approved" && (
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      ✅ Zatwierdzona
                    </span>
                                    )}
                                    <span className="text-slate-400 text-sm">{isExpanded ? "▲" : "▼"}</span>
                                </div>
                            </div>

                            {/* Rozwinięte szczegóły karty */}
                            {isExpanded && (
                                <div className="px-6 pb-6 pt-4 border-t border-slate-100 space-y-5 bg-slate-50/40">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="bg-white p-4 rounded-lg border border-slate-200/80 space-y-1">
                                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Tytuł (PL / EN)
                                            </div>
                                            <p className="font-semibold text-slate-900">{card.titlePl}</p>
                                            <p className="text-slate-600 italic">{card.titleEn}</p>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg border border-slate-200/80 space-y-1">
                                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Autorzy i Promotor
                                            </div>
                                            <ul className="space-y-0.5 text-slate-800">
                                                {card.authors.map((author) => (
                                                    <li key={author.email}>
                                                        <strong>{author.name}</strong>{" "}
                                                        <span className="text-xs text-slate-500">({author.email})</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p className="text-xs text-slate-500 pt-1">
                                                Promotor: {CURRENT_PROMOTER.degree} {CURRENT_PROMOTER.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg border border-slate-200/80 space-y-2 text-sm">
                                        <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                        Cel i zakres pracy
                      </span>
                                            <p className="text-slate-700 leading-relaxed">{card.scope}</p>
                                        </div>
                                        <div className="pt-2 border-t border-slate-100">
                                            <span className="text-xs font-semibold text-slate-500">Słowa kluczowe: </span>
                                            <span className="text-xs text-slate-700">{card.keywords}</span>
                                        </div>
                                    </div>

                                    {/* Panel decyzji promotora */}
                                    {isPending && (
                                        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                    Proponowany recenzent (wymagany przy zatwierdzeniu)
                                                </label>
                                                <select
                                                    value={reviewerDrafts[card.id] ?? AVAILABLE_REVIEWERS[0]}
                                                    onChange={(e) =>
                                                        setReviewerDrafts((prev) => ({
                                                            ...prev,
                                                            [card.id]: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                >
                                                    {AVAILABLE_REVIEWERS.map((rev) => (
                                                        <option key={rev} value={rev}>
                                                            {rev}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                    Uwagi do poprawy (wymagane tylko przy zwrocie karty)
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    placeholder="np. Doprecyzuj tłumaczenie tytułu angielskiego oraz dodaj harmonogram prac..."
                                                    value={commentDrafts[card.id] ?? ""}
                                                    onChange={(e) =>
                                                        setCommentDrafts((prev) => ({
                                                            ...prev,
                                                            [card.id]: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                />
                                            </div>

                                            <div className="flex flex-wrap gap-2.5 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={() => handleApprove(card.id)}
                                                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors cursor-pointer"
                                                >
                                                    ✅ Zatwierdź kartę i przypisz recenzenta
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleReturnForRevision(card.id)}
                                                    className="px-4 py-2 rounded-lg border border-amber-400 text-amber-800 hover:bg-amber-50 text-sm font-medium transition-colors cursor-pointer"
                                                >
                                                    ↩️ Zwróć do poprawy
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Podsumowanie dla karty zwróconej do poprawy */}
                                    {card.status === "needs_revision" && (
                                        <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-sm">
                                            <div className="text-amber-900">
                                                <strong>Uwagi wysłane do studenta: </strong>
                                                {card.revisionComment}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleReopenCard(card.id)}
                                                className="text-xs font-medium text-amber-900 underline cursor-pointer"
                                            >
                                                Przywróć do weryfikacji
                                            </button>
                                        </div>
                                    )}

                                    {/* Podsumowanie dla karty zatwierdzonej */}
                                    {card.status === "approved" && (
                                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-3 text-sm">
                                            <div className="text-emerald-900">
                                                <strong>Przypisany recenzent: </strong>
                                                {card.reviewer}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => window.print()}
                                                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                                                >
                                                    🖨️ Drukuj / PDF
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleReopenCard(card.id)}
                                                    className="text-xs text-slate-600 hover:text-slate-900 underline cursor-pointer"
                                                >
                                                    Cofnij zatwierdzenie
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredCards.length === 0 && (
                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
                        Brak kart zgłoszeń w wybranej kategorii.
                    </div>
                )}
            </div>
        </div>
    );
}