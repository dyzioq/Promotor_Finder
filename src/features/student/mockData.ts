export interface Promoter {
    id: number;
    name: string;
    degree: string; // np. dr inż., dr hab. inż., prof. dr hab. inż.
    department: string; // Katedra
    email: string;
    avatarUrl?: string;
}

export interface Topic {
    id: number;
    promoterId: number;
    title: string;
    isGroup: boolean;
    groupLimit: string;
    description: string;
    isReserved: boolean;
    degreeType: "inż" | "mgr"; // Stopień studiów
}

export const MOCK_PROMOTERS: Promoter[] = [
    {
        id: 1,
        name: "Jan Kowalski",
        degree: "dr hab. inż.",
        department: "Katedra Informatyki (RAu1)",
        email: "jan.kowalski@polsl.pl",
    },
    {
        id: 2,
        name: "Anna Nowak",
        degree: "dr inż.",
        department: "Katedra Matematyki (RAu2)",
        email: "anna.nowak@polsl.pl",
    },
    {
        id: 3,
        name: "Piotr Wiśniewski",
        degree: "prof. dr hab. inż.",
        department: "Katedra Informatyki (RAu1)",
        email: "piotr.wisniewski@polsl.pl",
    },
];

export const MOCK_TOPICS: Topic[] = [
    {
        id: 101,
        promoterId: 1,
        title: "System obsługi wyboru prac dyplomowych",
        isGroup: true,
        groupLimit: "2-4 osoby",
        description: "Stworzenie aplikacji webowej do zarządzania procesem dyplomowania.",
        isReserved: false,
        degreeType: "inż",
    },
    {
        id: 102,
        promoterId: 1,
        title: "Analiza wydajności mikrousług w środowisku Kubernetes",
        isGroup: false,
        groupLimit: "1 osoba",
        description: "Badanie czasów odpowiedzi i zużycia zasobów przy wysoki obciążeniu.",
        isReserved: false,
        degreeType: "mgr",
    },
    {
        id: 201,
        promoterId: 2,
        title: "Algorytmy optymalizacji w logistyce miejskiej",
        isGroup: false,
        groupLimit: "1 osoba",
        description: "Implementacja i porównanie wybranych algorytmów heurystycznych.",
        isReserved: true,
        degreeType: "inż",
    },
];
export interface GroupMember {
    id: number;
    name: string;
    email: string;
    gpa: number; // Średnia ocen do konkursu (punkt 4h, 4m)
    isLeader: boolean;
    status: "confirmed" | "pending"; // Zabezpieczenie przed żartownisiami (punkt 4j)
}

export interface ProjectGroup {
    id: string;
    name: string;
    inviteCode: string;
    isLocked: boolean; // Zakończone tworzenie grupy (punkt 4j)
    members: GroupMember[];
}

// Symulacja aktualnie zalogowanego studenta
export const CURRENT_STUDENT: GroupMember = {
    id: 1001,
    name: "Paweł Nowak",
    email: "pawel.nowak@polsl.pl",
    gpa: 4.5,
    isLeader: true,
    status: "confirmed",
};

// Symulacja bazy innych studentów, których można zaprosić do grupy
export const AVAILABLE_STUDENTS: Omit<GroupMember, "isLeader" | "status">[] = [
    { id: 1002, name: "Marek Zając", email: "marek.zajac@polsl.pl", gpa: 4.2 },
    { id: 1003, name: "Katarzyna Wójcik", email: "k.wojcik@polsl.pl", gpa: 4.8 },
    { id: 1004, name: "Tomasz Lewandowski", email: "t.lewandowski@polsl.pl", gpa: 3.9 },
];