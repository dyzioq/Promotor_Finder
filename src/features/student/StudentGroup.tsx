import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENT_STUDENT, AVAILABLE_STUDENTS } from "./mockData";
import type { GroupMember } from "./mockData";
import { useStudent } from "./StudentContext";

export default function StudentGroup() {
    const navigate = useNavigate();
    const { group, setGroup } = useStudent();

    const [newGroupName, setNewGroupName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState<number>(AVAILABLE_STUDENTS[1].id);

    const handleCreateGroup = () => {
        if (!newGroupName.trim()) return;
        setGroup({
            id: `GRP-${Math.floor(Math.random() * 1000)}`,
            name: newGroupName,
            inviteCode: `POLSL-${Math.floor(100 + Math.random() * 900)}`,
            isLocked: false,
            members: [{ ...CURRENT_STUDENT, isLeader: true, status: "confirmed" }],
        });
        setNewGroupName("");
    };

    const handleAddMember = () => {
        if (!group || group.isLocked) return;
        const studentToAdd = AVAILABLE_STUDENTS.find((s) => s.id === Number(selectedStudentId));
        if (!studentToAdd) return;

        if (group.members.some((m) => m.id === studentToAdd.id)) {
            alert("Ten student jest już w grupie.");
            return;
        }

        const newMember: GroupMember = {
            ...studentToAdd,
            isLeader: false,
            status: "pending",
        };

        setGroup({ ...group, members: [...group.members, newMember] });
    };

    const handleRemoveMember = (id: number) => {
        if (!group || group.isLocked) return;
        setGroup({
            ...group,
            members: group.members.filter((m) => m.id !== id),
        });
    };

    const toggleMemberConfirmation = (id: number) => {
        if (!group || group.isLocked) return;
        setGroup({
            ...group,
            members: group.members.map((m) =>
                m.id === id ? { ...m, status: m.status === "confirmed" ? "pending" : "confirmed" } : m
            ),
        });
    };

    const handleToggleLockGroup = () => {
        if (!group) return;
        const allConfirmed = group.members.every((m) => m.status === "confirmed");
        if (!group.isLocked && !allConfirmed) {
            alert("Nie można zamknąć grupy! Wszyscy członkowie muszą zatwierdzić swój udział.");
            return;
        }
        setGroup({ ...group, isLocked: !group.isLocked });
    };

    // Najwyższa średnia w grupie
    const groupGpa =
        group && group.members.length > 0
            ? Math.max(...group.members.map((m) => m.gpa)).toFixed(2)
            : "0.00";

    const allConfirmed = group?.members.every((m) => m.status === "confirmed") ?? false;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Moja Grupa Projektowa</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Zarządzanie składem zespołu dla projektów grupowych (inż. INF / IDiSI).
                    </p>
                </div>
                <button
                    onClick={() => navigate("/student")}
                    className="self-start text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                >
                    ← Powrót do wyboru promotora
                </button>
            </div>

            {!group ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Utwórz nową grupę</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Zostaniesz liderem zespołu i będziesz mógł zapisać całą grupę na temat pracy.
                            </p>
                        </div>
                        <input
                            type="text"
                            placeholder="Nazwa grupy (np. Zespół Alpha)..."
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleCreateGroup}
                            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer"
                        >
                            Stwórz grupę jako Lider
                        </button>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Dołącz do istniejącej grupy</h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Wpisz kod zaproszenia otrzymany od lidera zespołu.
                            </p>
                        </div>
                        <input
                            type="text"
                            placeholder="Kod zaproszenia (np. POLSL-849)"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                            onClick={() => alert("Wersja demonstracyjna: Dołączono do grupy!")}
                            className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium cursor-pointer"
                        >
                            Dołącz do grupy
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Baner statusu grupy */}
                    <div
                        className={`rounded-xl p-6 border flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                            group.isLocked
                                ? "bg-emerald-50 border-emerald-200"
                                : "bg-amber-50 border-amber-200"
                        }`}
                    >
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h2 className="text-xl font-bold text-slate-900">{group.name}</h2>
                                <span className="px-2.5 py-0.5 rounded-md bg-white/80 border border-slate-200 font-mono text-xs font-semibold text-slate-700">
                  Kod: {group.inviteCode}
                </span>
                            </div>
                            <p className="text-sm text-slate-700">
                                {group.isLocked
                                    ? "🔒 Grupa zamknięta i gotowa do wyboru tematu."
                                    : "🔓 W trakcie kompletowania – wszyscy członkowie muszą zatwierdzić udział."}
                            </p>
                        </div>

                        <div className="bg-white/80 rounded-lg px-4 py-3 border border-slate-200/80 md:text-right shrink-0">
                            <div className="text-xs font-medium text-slate-500">Średnia grupy (max)</div>
                            <div className="text-2xl font-bold text-blue-700">{groupGpa}</div>
                            <div className="text-xs text-slate-500">
                                Osób: {group.members.length} (zalecane 2–5)
                            </div>
                        </div>
                    </div>

                    {/* Tabela członków */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200">
                            <h3 className="text-base font-bold text-slate-900">Członkowie zespołu</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                                    <th className="px-6 py-3 font-semibold">Student</th>
                                    <th className="px-6 py-3 font-semibold">Rola</th>
                                    <th className="px-6 py-3 font-semibold">Średnia ocen</th>
                                    <th className="px-6 py-3 font-semibold">Status</th>
                                    <th className="px-6 py-3 font-semibold text-right">Akcje (Demo)</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                {group.members.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50/70">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{member.name}</div>
                                            <div className="text-xs text-slate-500">{member.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {member.isLeader ? (
                                                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                            👑 Lider
                          </span>
                                            ) : (
                                                <span className="text-slate-600 text-xs">Członek</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {member.gpa.toFixed(2)}
                                            {member.gpa.toFixed(2) === groupGpa && (
                                                <span className="ml-2 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold">
                            Najwyższa
                          </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {member.status === "confirmed" ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                            ✅ Potwierdzony
                          </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                            ⏳ Oczekuje
                          </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!member.isLeader && !group.isLocked && (
                                                <div className="inline-flex gap-2">
                                                    <button
                                                        onClick={() => toggleMemberConfirmation(member.id)}
                                                        className="px-2.5 py-1 rounded border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                                                    >
                                                        {member.status === "pending"
                                                            ? "Symuluj akceptację"
                                                            : "Cofnij akceptację"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        className="px-2.5 py-1 rounded border border-rose-200 text-xs font-medium text-rose-600 hover:bg-rose-50 cursor-pointer"
                                                    >
                                                        Usuń
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Zapraszanie studentów */}
                    {!group.isLocked && (
                        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-sm font-semibold text-slate-700 shrink-0">
                Zaproś studenta:
              </span>
                            <select
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                                className="flex-1 px-3.5 py-2 rounded-lg border border-slate-300 text-sm bg-white"
                            >
                                {AVAILABLE_STUDENTS.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.email}) – Średnia: {s.gpa}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddMember}
                                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium cursor-pointer shrink-0"
                            >
                                + Dodaj do grupy
                            </button>
                        </div>
                    )}

                    {/* Akcje końcowe */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <button
                            onClick={handleToggleLockGroup}
                            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                                group.isLocked
                                    ? "bg-amber-400 hover:bg-amber-500 text-slate-900"
                                    : allConfirmed
                                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                        : "bg-slate-200 text-slate-500"
                            }`}
                        >
                            {group.isLocked
                                ? "🔓 Odblokuj grupę do modyfikacji"
                                : "✅ Zakończ tworzenie grupy (Zatwierdź skład)"}
                        </button>

                        <button
                            onClick={() => {
                                if (confirm("Czy na pewno chcesz rozwiązać grupę?")) setGroup(null);
                            }}
                            className="px-4 py-2.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 text-sm font-medium cursor-pointer"
                        >
                            🗑️ Rozwiąż grupę
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}