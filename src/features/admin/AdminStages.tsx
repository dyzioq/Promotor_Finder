import { useState } from "react";
import {
    INITIAL_PROMOTER_LIMITS,
    INITIAL_STAGES,
    INITIAL_STUDENTS,
} from "./mockData";
import type { RecruitmentStage } from "./mockData";

export default function AdminStages() {
    const [stages, setStages] = useState<RecruitmentStage[]>(INITIAL_STAGES);
    const [academicYear, setAcademicYear] = useState("2026/2027");
    const [savedNotice, setSavedNotice] = useState(false);

    const activeStage = stages.find((s) => s.status === "active");

    const totalSlots = INITIAL_PROMOTER_LIMITS.reduce(
        (sum, p) => sum + p.limitInz + p.limitMgr,
        0
    );
    const usedTopics = INITIAL_PROMOTER_LIMITS.reduce(
        (sum, p) => sum + p.usedInz + p.usedMgr,
        0
    );
    const assignedStudents = INITIAL_STUDENTS.filter((s) => s.hasTopic).length;

    // Ręczne ustawienie wybranego etapu jako aktywny
    const handleSetActiveStage = (stageId: number) => {
        setStages((prev) =>
            prev.map((stage) => {
                if (stage.id < stageId) return { ...stage, status: "completed" };
                if (stage.id === stageId) return { ...stage, status: "active" };
                return { ...stage, status: "upcoming" };
            })
        );
    };

    // Edycja dat rozpoczęcia / zakończenia
    const handleDateChange = (
        stageId: number,
        field: "startDate" | "endDate",
        value: string
    ) => {
        setStages((prev) =>
            prev.map((stage) =>
                stage.id === stageId ? { ...stage, [field]: value } : stage
            )
        );
        setSavedNotice(false);
    };

    const handleSaveSchedule = () => {
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Nagłówek i wybór roku akademickiego */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Harmonogram i Etapy Dyplomowania</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Zarządzaj aktualną fazą systemu oraz terminami naboru dla studentów i promotorów.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                    <label className="text-xs font-semibold text-slate-600">Rok akademicki:</label>
                    <select
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-800"
                    >
                        <option value="2025/2026">2025/2026</option>
                        <option value="2026/2027">2026/2027</option>
                        <option value="2027/2028">2027/2028</option>
                    </select>
                </div>
            </div>

            {/* Kafelki podsumowania */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <div className="text-xs font-medium text-slate-500">Aktywny etap</div>
                    <div className="text-lg font-bold text-rose-600 mt-1">
                        Etap {activeStage?.id ?? "-"} / {stages.length}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 truncate">{activeStage?.name}</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <div className="text-xs font-medium text-slate-500">Zgłoszone tematy</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                        {usedTopics} <span className="text-sm font-normal text-slate-400">/ {totalSlots}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Wykorzystanie limitów promotorów</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <div className="text-xs font-medium text-slate-500">Studenci z tematem</div>
                    <div className="text-2xl font-bold text-emerald-600 mt-1">
                        {assignedStudents}{" "}
                        <span className="text-sm font-normal text-slate-400">/ {INITIAL_STUDENTS.length}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Zapisani na wybrane tematy</div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                    <div className="text-xs font-medium text-slate-500">Promotorzy w systemie</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">
                        {INITIAL_PROMOTER_LIMITS.length}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">Aktywni prowadzący</div>
                </div>
            </div>

            {/* Lista etapów z możliwością edycji dat i przełączania */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-base font-bold text-slate-900">Konfiguracja etapów ({academicYear})</h2>
                    <div className="flex items-center gap-3">
                        {savedNotice && (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                ✅ Zapisano terminy
              </span>
                        )}
                        <button
                            type="button"
                            onClick={handleSaveSchedule}
                            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                        >
                            Zapisz harmonogram
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {stages.map((stage) => {
                        const isActive = stage.status === "active";
                        const isCompleted = stage.status === "completed";

                        return (
                            <div
                                key={stage.id}
                                className={`p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                                    isActive ? "bg-rose-50/40" : ""
                                }`}
                            >
                                <div className="space-y-1.5 max-w-2xl">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h3 className="text-base font-bold text-slate-900">{stage.name}</h3>
                                        {isActive && (
                                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
                        ● Aktywny teraz
                      </span>
                                        )}
                                        {isCompleted && (
                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        ✓ Zakończony
                      </span>
                                        )}
                                        {stage.status === "upcoming" && (
                                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                        Oczekuje
                      </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">{stage.description}</p>
                                </div>

                                {/* Kontrolki dat i przycisk aktywacji */}
                                <div className="flex flex-wrap items-end gap-3 shrink-0">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                            Od
                                        </label>
                                        <input
                                            type="date"
                                            value={stage.startDate}
                                            onChange={(e) => handleDateChange(stage.id, "startDate", e.target.value)}
                                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                                            Do
                                        </label>
                                        <input
                                            type="date"
                                            value={stage.endDate}
                                            onChange={(e) => handleDateChange(stage.id, "endDate", e.target.value)}
                                            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800"
                                        />
                                    </div>

                                    {!isActive && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetActiveStage(stage.id)}
                                            className="px-3.5 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                                        >
                                            Aktywuj etap
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}