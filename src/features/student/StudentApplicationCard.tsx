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

    const [status, setStatus] = useState<CardStatus>("draft");
    const [titlePl, setTitlePl] = useState(selectedTopic?.title ?? "");
    const [titleEn, setTitleEn] = useState("");
    const [studyField, setStudyField] = useState("Informatyka");
    const [studyMode, setStudyMode] = useState<"stacjonarne" | "niestacjonarne">("stacjonarne");
    const [scope, setScope] = useState(selectedTopic?.description ?? "");
    const [keywords, setKeywords] = useState("");

    if (!selectedTopic || !promoter) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4 shadow-xs">
                <div className="text-4xl">📄</div>
                <h1 className="text-xl font-bold text-slate-900">Brak przypisanego tematu</h1>
                <p className="text-sm text-slate-500">
                    Aby wypełnić kartę zgłoszenia pracy dyplomowej, wybierz najpierw temat u jednego z
                    promotorów.
                </p>
                <button
                    onClick={() => navigate("/student")}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer"
                >
                    Przejdź do wyboru promotora →
                </button>
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

    const inputClass =
        "w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-700 disabled:border-slate-200";

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <style>{`
        @media print {
          header, nav { display: none !important; }
        }
      `}</style>

            {/* Pasek statusu (ukryty na wydruku PDF) */}
            <div
                className={`print:hidden rounded-xl p-4 border flex flex-wrap items-center justify-between gap-3 ${
                    status === "approved"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : status === "pending_approval"
                            ? "bg-blue-50 border-blue-200 text-blue-900"
                            : "bg-white border-slate-200 text-slate-800"
                }`}
            >
                <div className="text-sm">
                    <span className="font-semibold">Status karty: </span>
                    {status === "draft" && "✏️ Wersja robocza (uzupełnij w porozumieniu z promotorem)"}
                    {status === "pending_approval" && "⏳ Oczekuje na zatwierdzenie przez promotora"}
                    {status === "approved" && "✅ Zatwierdzona przez promotora – gotowa do zapisu PDF"}
                </div>

                <div className="flex flex-wrap gap-2">
                    {status === "pending_approval" && (
                        <>
                            <button
                                type="button"
                                onClick={() => setStatus("approved")}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium cursor-pointer"
                            >
                                [Demo] Zatwierdź jako promotor
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus("draft")}
                                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-900 text-xs font-medium cursor-pointer"
                            >
                                [Demo] Zwróć do poprawy
                            </button>
                        </>
                    )}
                    {status === "approved" && (
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer"
                        >
                            🖨️ Generuj / Zapisz PDF
                        </button>
                    )}
                </div>
            </div>

            {/* Dokument Karty Zgłoszenia */}
            <form
                onSubmit={handleSubmitForApproval}
                className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs print:shadow-none print:border-none print:p-0 space-y-6"
            >
                <div className="text-center pb-5 border-b-2 border-slate-900">
                    <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900">
                        Karta Zgłoszenia Pracy Dyplomowej
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                        Politechnika Śląska – Stopień:{" "}
                        <strong className="text-slate-900">
                            {selectedTopic.degreeType === "inż" ? "I (Inżynierska)" : "II (Magisterska)"}
                        </strong>
                    </p>
                </div>

                {/* Promotor i dyplomanci */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Promotor
                        </h4>
                        <p className="font-bold text-slate-900">
                            {promoter.degree} {promoter.name}
                        </p>
                        <p className="text-sm text-slate-600 mt-0.5">{promoter.department}</p>
                        <p className="text-xs text-slate-500 mt-1">{promoter.email}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            {authors.length > 1 ? `Dyplomanci (${group?.name})` : "Dyplomant"}
                        </h4>
                        <ul className="space-y-1 text-sm text-slate-800">
                            {authors.map((student) => (
                                <li key={student.id}>
                                    <span className="font-semibold">{student.name}</span>{" "}
                                    <span className="text-xs text-slate-500">({student.email})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Kierunek i forma */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Kierunek studiów
                        </label>
                        <select
                            disabled={!isEditable}
                            value={studyField}
                            onChange={(e) => setStudyField(e.target.value)}
                            className={inputClass}
                        >
                            <option value="Informatyka">Informatyka</option>
                            <option value="IDiSI">Inżynieria Danych i Systemów Informacyjnych (IDiSI)</option>
                            <option value="Matematyka">Matematyka</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Forma studiów
                        </label>
                        <select
                            disabled={!isEditable}
                            value={studyMode}
                            onChange={(e) => setStudyMode(e.target.value as "stacjonarne" | "niestacjonarne")}
                            className={inputClass}
                        >
                            <option value="stacjonarne">Stacjonarne</option>
                            <option value="niestacjonarne">Niestacjonarne</option>
                        </select>
                    </div>
                </div>

                {/* Tytuły i zakres */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Temat pracy (w języku polskim)
                        </label>
                        <input
                            type="text"
                            disabled={!isEditable}
                            value={titlePl}
                            onChange={(e) => setTitlePl(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Temat pracy (w języku angielskim)
                        </label>
                        <input
                            type="text"
                            disabled={!isEditable}
                            placeholder="np. Thesis Topic Selection Management System"
                            value={titleEn}
                            onChange={(e) => setTitleEn(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Cel i zakres pracy (założenia wejściowe)
                        </label>
                        <textarea
                            rows={5}
                            disabled={!isEditable}
                            value={scope}
                            onChange={(e) => setScope(e.target.value)}
                            className={`${inputClass} leading-relaxed`}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            Słowa kluczowe
                        </label>
                        <input
                            type="text"
                            disabled={!isEditable}
                            placeholder="np. aplikacja webowa, React, Spring Boot, baza danych"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Podpis elektroniczny po zatwierdzeniu */}
                {status === "approved" && (
                    <div className="pt-6 mt-6 border-t border-dashed border-slate-300 flex justify-between text-xs text-slate-600">
                        <div>
                            <p>Zatwierdzono elektronicznie w systemie:</p>
                            <p className="font-bold text-slate-900 mt-0.5">
                                {promoter.degree} {promoter.name}
                            </p>
                        </div>
                        <div className="text-right">
                            <p>Data wygenerowania:</p>
                            <p className="font-bold text-slate-900 mt-0.5">
                                {new Date().toLocaleDateString("pl-PL")}
                            </p>
                        </div>
                    </div>
                )}

                {isEditable && (
                    <div className="print:hidden flex justify-end pt-2">
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer"
                        >
                            📤 Prześlij kartę do zatwierdzenia przez promotora
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}