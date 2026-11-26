import { useState } from "react";
import { CURRENT_PROMOTER, INITIAL_PROMOTOR_TOPICS } from "./mockData";
import type { PromotorTopic } from "./mockData";

export default function PromotorTopics() {
    const [topics, setTopics] = useState<PromotorTopic[]>(INITIAL_PROMOTOR_TOPICS);
    const [degreeFilter, setDegreeFilter] = useState<"all" | "inż" | "mgr">("all");
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Stany formularza nowego tematu
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [degreeType, setDegreeType] = useState<"inż" | "mgr">("inż");
    const [isGroup, setIsGroup] = useState(true);
    const [minMembers, setMinMembers] = useState(2);
    const [maxMembers, setMaxMembers] = useState(4);
    const [isReserved, setIsReserved] = useState(false);
    const [reservedForEmail, setReservedForEmail] = useState("");

    const inzCount = topics.filter((t) => t.degreeType === "inż").length;
    const mgrCount = topics.filter((t) => t.degreeType === "mgr").length;

    const filteredTopics = topics.filter(
        (t) => degreeFilter === "all" || t.degreeType === degreeFilter
    );

    const handleAddTopic = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;

        const currentLimit =
            degreeType === "inż" ? CURRENT_PROMOTER.limits.inz : CURRENT_PROMOTER.limits.mgr;
        const currentUsed = degreeType === "inż" ? inzCount : mgrCount;

        if (currentUsed >= currentLimit) {
            alert(
                `Osiągnięto limit tematów dla studiów ${
                    degreeType === "inż" ? "inżynierskich" : "magisterskich"
                } (${currentLimit}).`
            );
            return;
        }

        if (isGroup && minMembers > maxMembers) {
            alert("Minimalna liczba członków nie może być większa niż maksymalna.");
            return;
        }

        const newTopic: PromotorTopic = {
            id: Date.now(),
            title: title.trim(),
            description: description.trim(),
            degreeType,
            isGroup,
            minMembers: isGroup ? minMembers : 1,
            maxMembers: isGroup ? maxMembers : 1,
            isReserved,
            reservedForEmail: isReserved ? reservedForEmail.trim() : undefined,
            applicantsCount: 0,
        };

        setTopics((prev) => [newTopic, ...prev]);

        // Reset formularza
        setTitle("");
        setDescription("");
        setIsReserved(false);
        setReservedForEmail("");
        setIsFormOpen(false);
    };

    const handleDeleteTopic = (id: number) => {
        if (!confirm("Czy na pewno chcesz usunąć ten temat?")) return;
        setTopics((prev) => prev.filter((t) => t.id !== id));
    };

    const handleReleaseReservation = (id: number) => {
        setTopics((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, isReserved: false, reservedForEmail: undefined } : t
            )
        );
    };

    const renderProgress = (used: number, limit: number) => {
        const percent = Math.min(100, Math.round((used / limit) * 100));
        const isFull = used >= limit;
        return (
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                <div
                    className={`h-full rounded-full transition-all ${
                        isFull ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${percent}%` }}
                />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Nagłówek i przycisk dodawania */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Moje Tematy i Limity</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Dodawaj tematy prac dyplomowych, zarządzaj rezerwacjami oraz kontroluj przydzielone limity.
                    </p>
                </div>

                <button
                    onClick={() => setIsFormOpen((prev) => !prev)}
                    className="self-start sm:self-center px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs"
                >
                    {isFormOpen ? "✕ Zamknij formularz" : "+ Dodaj nowy temat"}
                </button>
            </div>

            {/* Karty limitów */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Prace Inżynierskie (I stopień)
            </span>
                        <span className="text-sm font-bold text-slate-900">
              {inzCount} / {CURRENT_PROMOTER.limits.inz}
            </span>
                    </div>
                    {renderProgress(inzCount, CURRENT_PROMOTER.limits.inz)}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Prace Magisterskie (II stopień)
            </span>
                        <span className="text-sm font-bold text-slate-900">
              {mgrCount} / {CURRENT_PROMOTER.limits.mgr}
            </span>
                    </div>
                    {renderProgress(mgrCount, CURRENT_PROMOTER.limits.mgr)}
                </div>
            </div>

            {/* Formularz dodawania nowego tematu */}
            {isFormOpen && (
                <form
                    onSubmit={handleAddTopic}
                    className="bg-white rounded-xl border-2 border-emerald-200 p-6 shadow-xs space-y-4"
                >
                    <h2 className="text-lg font-bold text-slate-900">Nowy temat pracy dyplomowej</h2>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Tytuł tematu
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="np. Zastosowanie modeli językowych w analizie dokumentów..."
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Opis i wstępne wymagania
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Krótki opis zakresu pracy, sugerowane technologie..."
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Stopień studiów
                            </label>
                            <select
                                value={degreeType}
                                onChange={(e) => setDegreeType(e.target.value as "inż" | "mgr")}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                            >
                                <option value="inż">Inżynierskie (I st.)</option>
                                <option value="mgr">Magisterskie (II st.)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Formuła realizacji
                            </label>
                            <select
                                value={isGroup ? "group" : "solo"}
                                onChange={(e) => setIsGroup(e.target.value === "group")}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                            >
                                <option value="group">Projekt grupowy</option>
                                <option value="solo">Praca indywidualna</option>
                            </select>
                        </div>

                        {isGroup && (
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Min. osób
                                    </label>
                                    <input
                                        type="number"
                                        min={2}
                                        max={6}
                                        value={minMembers}
                                        onChange={(e) => setMinMembers(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Max. osób
                                    </label>
                                    <input
                                        type="number"
                                        min={2}
                                        max={6}
                                        value={maxMembers}
                                        onChange={(e) => setMaxMembers(Number(e.target.value))}
                                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Opcjonalna rezerwacja */}
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isReserved}
                                onChange={(e) => setIsReserved(e.target.checked)}
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            Zarezerwuj temat dla konkretnego studenta / lidera grupy
                        </label>

                        {isReserved && (
                            <input
                                type="email"
                                value={reservedForEmail}
                                onChange={(e) => setReservedForEmail(e.target.value)}
                                placeholder="Adres e-mail studenta (np. jan.nowak@polsl.pl)"
                                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                                required
                            />
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsFormOpen(false)}
                            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium cursor-pointer"
                        >
                            Anuluj
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold cursor-pointer"
                        >
                            Zapisz temat
                        </button>
                    </div>
                </form>
            )}

            {/* Filtry listy */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-lg font-bold text-slate-900">
                    Zgłoszone tematy ({filteredTopics.length})
                </h2>

                <div className="inline-flex bg-slate-200/70 p-1 rounded-lg text-xs font-medium">
                    {(["all", "inż", "mgr"] as const).map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => setDegreeFilter(filter)}
                            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                                degreeFilter === filter
                                    ? "bg-white text-emerald-700 shadow-xs"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            {filter === "all" ? "Wszystkie" : filter === "inż" ? "Inżynierskie" : "Magisterskie"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista tematów */}
            <div className="space-y-4">
                {filteredTopics.map((topic) => (
                    <div
                        key={topic.id}
                        className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <h3 className="text-base font-bold text-slate-900">{topic.title}</h3>
                            <div className="flex flex-wrap items-center gap-2">
                <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        topic.degreeType === "inż"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-purple-50 text-purple-700"
                    }`}
                >
                  {topic.degreeType === "inż" ? "Inżynierska" : "Magisterska"}
                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                  {topic.isGroup
                      ? `👥 ${topic.minMembers}–${topic.maxMembers} osoby`
                      : "👤 Indywidualna"}
                </span>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed">{topic.description}</p>

                        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex flex-wrap items-center gap-4">
                <span className="text-slate-500">
                  📊 Chętnych: <strong className="text-slate-800">{topic.applicantsCount}</strong>
                </span>
                                {topic.isReserved ? (
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                    🔒 Zarezerwowany dla: {topic.reservedForEmail}
                  </span>
                                ) : (
                                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    🔓 Otwarty dla studentów
                  </span>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {topic.isReserved && (
                                    <button
                                        onClick={() => handleReleaseReservation(topic.id)}
                                        className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 font-medium cursor-pointer"
                                    >
                                        Zwolnij rezerwację
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteTopic(topic.id)}
                                    className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-medium cursor-pointer"
                                >
                                    Usuń
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredTopics.length === 0 && (
                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
                        Brak tematów w wybranej kategorii. Kliknij „+ Dodaj nowy temat”, aby utworzyć pierwszy.
                    </div>
                )}
            </div>
        </div>
    );
}