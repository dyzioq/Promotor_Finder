import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { CURRENT_STUDENT } from "./mockData";
import type { ProjectGroup } from "./mockData";

export interface PromoterRequest {
    id: string;
    promoterId: number;
    topicId?: number;
    type: "increase_group_limit" | "new_topic_slot" | "solo_permission";
    message: string;
    createdAt: string;
}

interface StudentContextType {
    group: ProjectGroup | null;
    setGroup: (group: ProjectGroup | null) => void;
    selectedTopicId: number | null;
    selectTopic: (topicId: number) => void;
    cancelTopicSelection: () => void;
    requests: PromoterRequest[];
    sendRequest: (req: Omit<PromoterRequest, "id" | "createdAt">) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function StudentProvider({ children }: { children: ReactNode }) {
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

    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [requests, setRequests] = useState<PromoterRequest[]>([]);

    const selectTopic = (topicId: number) => {
        setSelectedTopicId(topicId);
    };

    const cancelTopicSelection = () => {
        setSelectedTopicId(null);
    };

    const sendRequest = (req: Omit<PromoterRequest, "id" | "createdAt">) => {
        const newReq: PromoterRequest = {
            ...req,
            id: `REQ-${Date.now()}`,
            createdAt: new Date().toLocaleTimeString(),
        };
        setRequests((prev) => [newReq, ...prev]);
    };

    return (
        <StudentContext.Provider
            value={{
                group,
                setGroup,
                selectedTopicId,
                selectTopic,
                cancelTopicSelection,
                requests,
                sendRequest,
            }}
        >
            {children}
        </StudentContext.Provider>
    );
}

export function useStudent() {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error("useStudent musi być użyty wewnątrz StudentProvider");
    }
    return context;
}