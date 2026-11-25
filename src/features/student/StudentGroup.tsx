import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENT_STUDENT, AVAILABLE_STUDENTS, type ProjectGroup, type GroupMember } from "./mockData";

export default function StudentGroup() {
    const navigate = useNavigate();

    // Stan grupy (null = student nie ma jeszcze grupy)
    const [group, setGroup] = useState<ProjectGroup | null>({
        id: "GRP-1",
        name: "Zespół Inżynierski Alpha",
        inviteCode: "POLSL-849",
        isLocked: false,
        members: [
            CURRENT_STUDENT,
            {
                id: 1002,
                name: "Marek Zając",
                email: "marek.zajac@polsl.pl",
                gpa: 4.2,
                isLeader: false,
                status: "pending",
            },
        ],
    });

    const [newGroupName, setNewGroupName] = useState("");
    const [joinCode, setJoinCode] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState<number>(AVAILABLE_STUDENTS[1].id);

    // Tworzenie nowej grupy jako Lider
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

    // Dodawanie członka do grupy (wymaga jego potwierdzenia)
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

    // Usuwanie członka z grupy
    const handleRemoveMember = (id: number) => {
        if (!group || group.isLocked) return;
        setGroup({
            ...group,
            members: group.members.filter((m) => m.id !== id),
        });
    };

    // Symulacja potwierdzenia udziału przez zaproszonego studenta
    const toggleMemberConfirmation = (id: number) => {
        if (!group || group.isLocked) return;
        setGroup({
            ...group,
            members: group.members.map((m) =>
                m.id === id ? { ...m, status: m.status === "confirmed" ? "pending" : "confirmed" } : m
            ),
        });
    };

    // Zakończenie tworzenia / odblokowanie grupy do edycji
    const handleToggleLockGroup = () => {
        if (!group) return;
        const allConfirmed = group.members.every((m) => m.status === "confirmed");
        if (!group.isLocked && !allConfirmed) {
            alert("Nie można zamknąć grupy! Wszyscy członkowie muszą zatwierdzić swój udział.");
            return;
        }
        setGroup({ ...group, isLocked: !group.isLocked });
    };

    // Wyznaczanie średniej grupy jako najwyższej średniej spośród członków
    const groupGpa =
        group && group.members.length > 0
            ? Math.max(...group.members.map((m) => m.gpa)).toFixed(2)
            : "0.00";

    const allConfirmed = group?.members.every((m) => m.status === "confirmed") ?? false;

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
                ← Powrót do wyboru promotora
            </button>

            <h1>👥 Moja Grupa Projektowa (inż. INF / IDiSI)</h1>

            {!group ? (
                /* WIDOK 1: Student nie należy do żadnej grupy */
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
                    <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                        <h3>Utwórz nową grupę (Zostań Liderem)</h3>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                            Jako lider będziesz mógł zapisywać całą grupę na wybrany temat pracy dyplomowej.
                        </p>
                        <input
                            type="text"
                            placeholder="Nazwa grupy..."
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
                        />
                        <button
                            onClick={handleCreateGroup}
                            style={{
                                padding: "10px 15px",
                                backgroundColor: "#0056b3",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Stwórz grupę
                        </button>
                    </div>

                    <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px" }}>
                        <h3>Dołącz do istniejącej grupy</h3>
                        <p style={{ fontSize: "14px", color: "#666" }}>
                            Podaj kod zaproszenia otrzymany od lidera zespołu.
                        </p>
                        <input
                            type="text"
                            placeholder="Kod np. POLSL-849"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            style={{ width: "100%", padding: "8px", marginBottom: "10px", boxSizing: "border-box" }}
                        />
                        <button
                            onClick={() => alert("Wersja demonstracyjna: Dołączono do grupy!")}
                            style={{
                                padding: "10px 15px",
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            Dołącz do grupy
                        </button>
                    </div>
                </div>
            ) : (
                /* WIDOK 2: Zarządzanie istniejącą grupą */
                <div>
                    <div
                        style={{
                            padding: "20px",
                            backgroundColor: group.isLocked ? "#e8f5e9" : "#fff3cd",
                            border: `1px solid ${group.isLocked ? "#c3e6cb" : "#ffeeba"}`,
                            borderRadius: "8px",
                            marginBottom: "20px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <h2 style={{ margin: "0 0 5px 0" }}>{group.name}</h2>
                            <p style={{ margin: 0, fontSize: "14px" }}>
                                Kod zaproszenia: <strong>{group.inviteCode}</strong> | Status:{" "}
                                <strong>
                                    {group.isLocked
                                        ? "🔒 Grupa zamknięta i gotowa do wyboru tematu"
                                        : "🔓 W trakcie kompletowania (wymaga akceptacji wszystkich)"}
                                </strong>
                            </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                                Średnia grupy: {groupGpa}
                            </div>
                            <span style={{ fontSize: "12px", color: "#555" }}>
                Liczba osób: {group.members.length} (zalecane 2-5)
              </span>
                        </div>
                    </div>

                    {/* Lista członków grupy */}
                    <h3>Członkowie zespołu</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
                        <thead>
                        <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Imię i nazwisko</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Rola</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Średnia ocen</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status akceptacji</th>
                            <th style={{ padding: "10px", border: "1px solid #ddd" }}>Akcje (Demo)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {group.members.map((member) => (
                            <tr key={member.id}>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                    {member.name} <span style={{ color: "#888", fontSize: "12px" }}>({member.email})</span>
                                </td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                    {member.isLeader ? "👑 Lider" : "Członek"}
                                </td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>{member.gpa.toFixed(2)}</td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                    {member.status === "confirmed" ? (
                                        <span style={{ color: "green", fontWeight: "bold" }}>✅ Potwierdzony</span>
                                    ) : (
                                        <span style={{ color: "#d9534f", fontWeight: "bold" }}>⏳ Oczekuje na akceptację</span>
                                    )}
                                </td>
                                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                    {!member.isLeader && !group.isLocked && (
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => toggleMemberConfirmation(member.id)}
                                                style={{ fontSize: "12px", cursor: "pointer" }}
                                            >
                                                {member.status === "pending" ? "Symuluj akceptację" : "Cofnij akceptację"}
                                            </button>
                                            <button
                                                onClick={() => handleRemoveMember(member.id)}
                                                style={{ fontSize: "12px", color: "red", cursor: "pointer" }}
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

                    {/* Dodawanie nowego członka (tylko gdy grupa nie jest zablokowana) */}
                    {!group.isLocked && (
                        <div
                            style={{
                                padding: "15px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "8px",
                                marginBottom: "20px",
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                            }}
                        >
                            <strong>Zaproś studenta do grupy:</strong>
                            <select
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(Number(e.target.value))}
                                style={{ padding: "8px", flex: 1 }}
                            >
                                {AVAILABLE_STUDENTS.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.email}) – Średnia: {s.gpa}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddMember}
                                style={{ padding: "8px 15px", cursor: "pointer" }}
                            >
                                + Dodaj do grupy
                            </button>
                        </div>
                    )}

                    {/* Przyciski zarządzania grupą (Zatwierdzanie / Rozwiązywanie) */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
                        <button
                            onClick={handleToggleLockGroup}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: group.isLocked ? "#ffc107" : allConfirmed ? "#28a745" : "#ccc",
                                color: group.isLocked ? "#000" : "#fff",
                                border: "none",
                                borderRadius: "5px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            {group.isLocked
                                ? "🔓 Odblokuj grupę do modyfikacji (Etap 3)"
                                : "✅ Zakończ tworzenie grupy (Zatwierdź skład)"}
                        </button>

                        <button
                            onClick={() => {
                                if (confirm("Czy na pewno chcesz rozwiązać grupę?")) setGroup(null);
                            }}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#dc3545",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                        >
                            🗑️ Rozwiąż grupę
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}