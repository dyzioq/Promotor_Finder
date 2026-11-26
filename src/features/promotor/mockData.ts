export interface PromoterProfile {
    id: number;
    degree: string;
    name: string;
    department: string;
    email: string;
    limits: {
        inz: number;
        mgr: number;
    };
}

export interface PromotorTopic {
    id: number;
    title: string;
    description: string;
    degreeType: "inż" | "mgr";
    isGroup: boolean;
    minMembers: number;
    maxMembers: number;
    isReserved: boolean;
    reservedForEmail?: string;
    applicantsCount: number;
}

export const CURRENT_PROMOTER: PromoterProfile = {
    id: 1,
    degree: "dr hab. inż.",
    name: "Jan Kowalski",
    department: "Katedra Informatyki (RAu1)",
    email: "jan.kowalski@polsl.pl",
    limits: {
        inz: 4,
        mgr: 3,
    },
};

export const INITIAL_PROMOTOR_TOPICS: PromotorTopic[] = [
    {
        id: 101,
        title: "System obsługi wyboru prac dyplomowych",
        description: "Stworzenie aplikacji webowej do zarządzania procesem dyplomowania.",
        degreeType: "inż",
        isGroup: true,
        minMembers: 2,
        maxMembers: 4,
        isReserved: false,
        applicantsCount: 2,
    },
    {
        id: 102,
        title: "Analiza wydajności mikrousług w środowisku Kubernetes",
        description: "Badanie czasów odpowiedzi i zużycia zasobów przy wysokim obciążeniu.",
        degreeType: "mgr",
        isGroup: false,
        minMembers: 1,
        maxMembers: 1,
        isReserved: false,
        applicantsCount: 1,
    },
    {
        id: 103,
        title: "Aplikacja mobilna wspomagająca naukę algorytmów grafowych",
        description: "Wizualizacja działania algorytmów Dijkstry, A* oraz BFS/DFS.",
        degreeType: "inż",
        isGroup: true,
        minMembers: 2,
        maxMembers: 3,
        isReserved: true,
        reservedForEmail: "k.wojcik@polsl.pl",
        applicantsCount: 1,
    },
];

export type RequestType = "new_topic_slot" | "increase_group_limit" | "solo_permission";
export type RequestStatus = "pending" | "approved" | "rejected";

export interface StudentRequestItem {
    id: string;
    type: RequestType;
    status: RequestStatus;
    studentName: string;
    studentEmail: string;
    studentGpa: number;
    degreeType: "inż" | "mgr";
    groupName?: string;
    groupSize?: number;
    topicTitle?: string;
    message: string;
    createdAt: string;
    promoterReply?: string;
}

export const INITIAL_STUDENT_REQUESTS: StudentRequestItem[] = [
    {
        id: "REQ-101",
        type: "increase_group_limit",
        status: "pending",
        studentName: "Paweł Nowak",
        studentEmail: "pawel.nowak@polsl.pl",
        studentGpa: 4.5,
        degreeType: "inż",
        groupName: "Zespół Inżynierski Alpha",
        groupSize: 5,
        topicTitle: "System obsługi wyboru prac dyplomowych",
        message:
            "Dzień dobry, nasz zespół liczy 5 osób (limit tematu to 4). Czy byłaby możliwość powiększenia grupy o 1 osobę? Planujemy rozszerzyć projekt o moduł powiadomień oraz aplikację mobilną.",
        createdAt: "Dzisiaj, 11:20",
    },
    {
        id: "REQ-102",
        type: "new_topic_slot",
        status: "pending",
        studentName: "Katarzyna Wójcik",
        studentEmail: "k.wojcik@polsl.pl",
        studentGpa: 4.8,
        degreeType: "mgr",
        message:
            "Dzień dobry, chciałabym zaproponować własny temat pracy magisterskiej: 'Wykrywanie anomalii w ruchu sieciowym z wykorzystaniem sieci neuronowych GNN'. Czy znalazłoby się u Pana jeszcze jedno miejsce?",
        createdAt: "Wczoraj, 16:45",
    },
    {
        id: "REQ-103",
        type: "solo_permission",
        status: "approved",
        studentName: "Tomasz Lewandowski",
        studentEmail: "t.lewandowski@polsl.pl",
        studentGpa: 4.1,
        degreeType: "inż",
        topicTitle: "Aplikacja mobilna wspomagająca naukę algorytmów grafowych",
        message:
            "Ze względu na pracę zawodową i indywidualny tryb studiów proszę o zgodę na realizację tematu w pojedynkę z odpowiednio zawężonym zakresem.",
        createdAt: "2 dni temu",
        promoterReply: "Wyrażam zgodę. Proszę o kontakt mailowy w celu doprecyzowania zakresu.",
    },
];

export type ApplicationCardStatus = "pending_approval" | "needs_revision" | "approved";

export interface PromotorApplicationCard {
    id: string;
    status: ApplicationCardStatus;
    degreeType: "inż" | "mgr";
    studyField: string;
    studyMode: "stacjonarne" | "niestacjonarne";
    authors: { name: string; email: string }[];
    groupName?: string;
    titlePl: string;
    titleEn: string;
    scope: string;
    keywords: string;
    submittedAt: string;
    reviewer?: string;
    revisionComment?: string;
}

export const AVAILABLE_REVIEWERS: string[] = [
    "dr inż. Anna Nowak (Katedra Matematyki)",
    "prof. dr hab. inż. Piotr Wiśniewski (Katedra Informatyki)",
    "dr hab. inż. Marek Zieliński (Katedra Informatyki)",
    "dr inż. Agnieszka Kamińska (Katedra Inżynierii Systemów)",
];

export const INITIAL_APPLICATION_CARDS: PromotorApplicationCard[] = [
    {
        id: "CARD-201",
        status: "pending_approval",
        degreeType: "inż",
        studyField: "Informatyka",
        studyMode: "stacjonarne",
        groupName: "Zespół Inżynierski Alpha",
        authors: [
            { name: "Paweł Nowak", email: "pawel.nowak@polsl.pl" },
            { name: "Marek Zając", email: "marek.zajac@polsl.pl" },
        ],
        titlePl: "System obsługi wyboru prac dyplomowych",
        titleEn: "Thesis Topic Selection Management System",
        scope:
            "Zaprojektowanie i implementacja aplikacji webowej wspomagającej proces wyboru tematów prac dyplomowych, tworzenia grup projektowych oraz generowania kart zgłoszeń na Politechnice Śląskiej.",
        keywords: "React, TypeScript, Spring Boot, PostgreSQL, system dyplomowania",
        submittedAt: "Dzisiaj, 13:10",
    },
    {
        id: "CARD-202",
        status: "pending_approval",
        degreeType: "mgr",
        studyField: "Informatyka",
        studyMode: "stacjonarne",
        authors: [{ name: "Katarzyna Wójcik", email: "k.wojcik@polsl.pl" }],
        titlePl: "Analiza wydajności mikrousług w środowisku Kubernetes",
        titleEn: "Performance Analysis of Microservices in Kubernetes Environment",
        scope:
            "Przeprowadzenie testów obciążeniowych architektury mikroserwisowej w klastrze Kubernetes, analiza opóźnień komunikacji oraz optymalizacja zużycia zasobów.",
        keywords: "Kubernetes, mikrousługi, testy wydajnościowe, chmura obliczeniowa",
        submittedAt: "Wczoraj, 19:05",
    },
    {
        id: "CARD-203",
        status: "approved",
        degreeType: "inż",
        studyField: "IDiSI",
        studyMode: "niestacjonarne",
        authors: [{ name: "Tomasz Lewandowski", email: "t.lewandowski@polsl.pl" }],
        titlePl: "Aplikacja mobilna wspomagająca naukę algorytmów grafowych",
        titleEn: "Mobile Application Supporting Learning of Graph Algorithms",
        scope:
            "Stworzenie wieloplatformowej aplikacji mobilnej umożliwiającej interaktywną wizualizację algorytmów przeszukiwania i znajdowania najkrótszych ścieżek w grafach.",
        keywords: "algorytmy grafowe, aplikacja mobilna, wizualizacja, edukacja",
        submittedAt: "3 dni temu",
        reviewer: "dr inż. Anna Nowak (Katedra Matematyki)",
    },
];