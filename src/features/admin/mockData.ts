export type StageStatus = "completed" | "active" | "upcoming";

export interface RecruitmentStage {
    id: number;
    code: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: StageStatus;
}

export interface AdminPromoterLimit {
    id: number;
    degree: string;
    name: string;
    department: string;
    email: string;
    limitInz: number;
    limitMgr: number;
    usedInz: number;
    usedMgr: number;
}

export interface AdminStudentRecord {
    id: number;
    indexNumber: string;
    name: string;
    email: string;
    degreeType: "inż" | "mgr";
    studyField: string;
    gpa: number;
    hasTopic: boolean;
}

export const INITIAL_STAGES: RecruitmentStage[] = [
    {
        id: 1,
        code: "STAGE_1_TOPICS",
        name: "Etap 1: Zgłaszanie tematów przez promotorów",
        description:
            "Promotorzy dodają tematy prac inżynierskich i magisterskich w ramach przydzielonych limitów oraz wprowadzają ewentualne rezerwacje.",
        startDate: "2026-10-01",
        endDate: "2026-10-20",
        status: "completed",
    },
    {
        id: 2,
        code: "STAGE_2_GROUPS_AND_SELECTION",
        name: "Etap 2: Tworzenie grup i wybór tematów",
        description:
            "Studenci zakładają i zatwierdzają grupy projektowe, wybierają tematy u promotorów oraz wysyłają prośby o zmiany limitów.",
        startDate: "2026-10-21",
        endDate: "2026-11-30",
        status: "active",
    },
    {
        id: 3,
        code: "STAGE_3_ALLOCATION",
        name: "Etap 3: Rozstrzygnięcie konkursu średnich i tura dodatkowa",
        description:
            "Automatyczne przydzielenie spornych tematów na podstawie najwyższej średniej ocen (indywidualnej lub max w grupie) oraz uwolnienie miejsc dla pozostałych.",
        startDate: "2026-12-01",
        endDate: "2026-12-10",
        status: "upcoming",
    },
    {
        id: 4,
        code: "STAGE_4_CARDS",
        name: "Etap 4: Wypełnianie i zatwierdzanie kart zgłoszeń",
        description:
            "Studenci uzupełniają karty zgłoszeń prac dyplomowych, promotorzy przypisują recenzentów i zatwierdzają dokumenty do eksportu PDF.",
        startDate: "2026-12-11",
        endDate: "2026-12-22",
        status: "upcoming",
    },
];

export const INITIAL_PROMOTER_LIMITS: AdminPromoterLimit[] = [
    {
        id: 1,
        degree: "dr hab. inż.",
        name: "Jan Kowalski",
        department: "Katedra Informatyki (RAu1)",
        email: "jan.kowalski@polsl.pl",
        limitInz: 4,
        limitMgr: 3,
        usedInz: 2,
        usedMgr: 1,
    },
    {
        id: 2,
        degree: "dr inż.",
        name: "Anna Nowak",
        department: "Katedra Matematyki (RAu2)",
        email: "anna.nowak@polsl.pl",
        limitInz: 3,
        limitMgr: 2,
        usedInz: 1,
        usedMgr: 0,
    },
    {
        id: 3,
        degree: "prof. dr hab. inż.",
        name: "Piotr Wiśniewski",
        department: "Katedra Informatyki (RAu1)",
        email: "piotr.wisniewski@polsl.pl",
        limitInz: 2,
        limitMgr: 4,
        usedInz: 0,
        usedMgr: 2,
    },
];

export const INITIAL_STUDENTS: AdminStudentRecord[] = [
    {
        id: 1001,
        indexNumber: "304512",
        name: "Paweł Nowak",
        email: "pawel.nowak@polsl.pl",
        degreeType: "inż",
        studyField: "Informatyka",
        gpa: 4.5,
        hasTopic: true,
    },
    {
        id: 1002,
        indexNumber: "304589",
        name: "Marek Zając",
        email: "marek.zajac@polsl.pl",
        degreeType: "inż",
        studyField: "Informatyka",
        gpa: 4.2,
        hasTopic: true,
    },
    {
        id: 1003,
        indexNumber: "298114",
        name: "Katarzyna Wójcik",
        email: "k.wojcik@polsl.pl",
        degreeType: "mgr",
        studyField: "Informatyka",
        gpa: 4.8,
        hasTopic: false,
    },
    {
        id: 1004,
        indexNumber: "305021",
        name: "Tomasz Lewandowski",
        email: "t.lewandowski@polsl.pl",
        degreeType: "inż",
        studyField: "IDiSI",
        gpa: 3.9,
        hasTopic: false,
    },
];
export type AllocationStatus = "pending" | "resolved" | "tie";

export interface TopicApplicant {
    id: string;
    type: "group" | "student";
    name: string;
    members: string[];
    memberGpas: number[]; // Średnie wszystkich członków (do porównywania kolejnych par)
    effectiveGpa: number; // Najwyższa średnia (Math.max)
    submittedAt: string;
}

export interface AllocationTopic {
    id: number;
    title: string;
    promoterName: string;
    degreeType: "inż" | "mgr";
    isGroup: boolean;
    applicants: TopicApplicant[];
    winnerId: string | null;
    tiedIds?: string[];       // ID kandydatów biorących udział w nierozstrzygniętym remisie
    resolutionNote?: string;  // Informacja, w której parze rozstrzygnięto konkurs
    status: AllocationStatus;
}

export const INITIAL_ALLOCATION_TOPICS: AllocationTopic[] = [
    {
        id: 101,
        title: "System obsługi wyboru prac dyplomowych",
        promoterName: "dr hab. inż. Jan Kowalski",
        degreeType: "inż",
        isGroup: true,
        winnerId: null,
        status: "pending",
        applicants: [
            {
                id: "APP-1",
                type: "group",
                name: "Zespół Inżynierski Alpha",
                members: ["Paweł Nowak (4.72)", "Marek Zając (4.50)", "Adam Król (4.10)"],
                memberGpas: [4.72, 4.5, 4.1],
                effectiveGpa: 4.72,
                submittedAt: "2026-11-12 10:15",
            },
            {
                id: "APP-2",
                type: "group",
                name: "CodeCrafters PolSl",
                members: [
                    "Michał Krawczyk (4.72)",
                    "Julia Zielińska (4.35)",
                    "Piotr Mazur (4.20)",
                    "Ewa Lis (4.00)",
                ],
                memberGpas: [4.72, 4.35, 4.2, 4.0],
                effectiveGpa: 4.72,
                submittedAt: "2026-11-14 18:40",
            },
            {
                id: "APP-3",
                type: "group",
                name: "Grupa RAu1",
                members: ["Tomasz Lewandowski (4.05)", "Kamil Dąbrowski (3.90)"],
                memberGpas: [4.05, 3.9],
                effectiveGpa: 4.05,
                submittedAt: "2026-11-15 09:05",
            },
        ],
    },
    {
        id: 102,
        title: "Platforma monitorowania zużycia energii w sieciach IoT",
        promoterName: "prof. dr hab. inż. Piotr Wiśniewski",
        degreeType: "inż",
        isGroup: true,
        winnerId: null,
        status: "pending",
        applicants: [
            {
                id: "APP-4",
                type: "group",
                name: "IoT Trio (3 os.)",
                members: ["Janina Maj (4.60)", "Filip Bąk (4.40)", "Oskar Wilk (4.10)"],
                memberGpas: [4.6, 4.4, 4.1],
                effectiveGpa: 4.6,
                submittedAt: "2026-11-11 11:00",
            },
            {
                id: "APP-5",
                type: "group",
                name: "SmartGrid Team (4 os.)",
                members: [
                    "Zofia Kaczmarek (4.60)",
                    "Dawid Górski (4.40)",
                    "Kacper Dudek (4.10)",
                    "Maja Piotrowska (3.85)",
                ],
                memberGpas: [4.6, 4.4, 4.1, 3.85],
                effectiveGpa: 4.6,
                submittedAt: "2026-11-11 16:30",
            },
        ],
    },
    {
        id: 103,
        title: "Analiza wydajności mikrousług w środowisku Kubernetes",
        promoterName: "dr hab. inż. Jan Kowalski",
        degreeType: "mgr",
        isGroup: false,
        winnerId: null,
        status: "pending",
        applicants: [
            {
                id: "APP-6",
                type: "student",
                name: "Katarzyna Wójcik",
                members: ["Katarzyna Wójcik (4.80)"],
                memberGpas: [4.8],
                effectiveGpa: 4.8,
                submittedAt: "2026-11-10 14:22",
            },
            {
                id: "APP-7",
                type: "student",
                name: "Jakub Szymański",
                members: ["Jakub Szymański (4.80)"],
                memberGpas: [4.8],
                effectiveGpa: 4.8,
                submittedAt: "2026-11-11 08:50",
            },
        ],
    },
    {
        id: 201,
        title: "Algorytmy optymalizacji w logistyce miejskiej",
        promoterName: "dr inż. Anna Nowak",
        degreeType: "inż",
        isGroup: false,
        winnerId: null,
        status: "pending",
        applicants: [
            {
                id: "APP-8",
                type: "student",
                name: "Natalia Grabowska",
                members: ["Natalia Grabowska (4.35)"],
                memberGpas: [4.35],
                effectiveGpa: 4.35,
                submittedAt: "2026-11-13 12:00",
            },
        ],
    },
];