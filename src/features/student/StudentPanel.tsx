import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_PROMOTERS, MOCK_TOPICS } from "./mockData";

export default function StudentPanel() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [studentDegree, setStudentDegree] = useState<"inż" | "mgr">("inż");

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
        <div className="space-y-6">
            {/* Nagłówek i przełącznik stopnia studiów */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Wybór Promotora</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Wybierz prowadzącego, aby przejrzeć dostępne tematy prac dyplomowych.
                    </p>
                </div>

                {/* Segmentowy przełącznik stopnia */}
                <div className="inline-flex items-center bg-slate-200/70 p-1 rounded-lg self-start">
                    <button
                        type="button"
                        onClick={() => setStudentDegree("inż")}
                        className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                            studentDegree === "inż"
                                ? "bg-white text-blue-700 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Inżynierskie (I st.)
                    </button>
                    <button
                        type="button"
                        onClick={() => setStudentDegree("mgr")}
                        className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                            studentDegree === "mgr"
                                ? "bg-white text-blue-700 shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Magisterskie (II st.)
                    </button>
                </div>
            </div>

            {/* Pasek wyszukiwania i filtrów */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    placeholder="Szukaj promotora po nazwisku lub tytule..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="sm:w-72 px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">Wszystkie katedry</option>
                    {departments.map((dept) => (
                        <option key={dept} value={dept}>
                            {dept}
                        </option>
                    ))}
                </select>
            </div>

            {/* Siatka kart promotorów */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPromoters.map((promoter) => {
                    const promoterDegreeTopics = MOCK_TOPICS.filter(
                        (t) => t.promoterId === promoter.id && t.degreeType === studentDegree
                    );
                    const availableTopicsCount = promoterDegreeTopics.filter((t) => !t.isReserved).length;

                    // Inicjały do avatara
                    const initials = promoter.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2);

                    return (
                        <div
                            key={promoter.id}
                            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start gap-3.5">
                                    <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center shrink-0 border border-blue-100">
                                        {initials}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-blue-600">{promoter.degree}</p>
                                        <h3 className="text-base font-bold text-slate-900 truncate">{promoter.name}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">{promoter.department}</p>
                                    </div>
                                </div>

                                <p className="text-xs text-slate-400 mt-3 truncate">📧 {promoter.email}</p>

                                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    Tematy ({studentDegree === "inż" ? "inż." : "mgr"}):
                  </span>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                            availableTopicsCount > 0
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                    {availableTopicsCount} wolnych / {promoterDegreeTopics.length}
                  </span>
                                </div>
                            </div>

                            <button
                                onClick={() =>
                                    navigate(`/student/promotor/${promoter.id}?degree=${studentDegree}`)
                                }
                                className="mt-5 w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors cursor-pointer"
                            >
                                Zobacz tematy →
                            </button>
                        </div>
                    );
                })}
            </div>

            {filteredPromoters.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 text-sm">Nie znaleziono promotorów spełniających kryteria.</p>
                </div>
            )}
        </div>
    );
}