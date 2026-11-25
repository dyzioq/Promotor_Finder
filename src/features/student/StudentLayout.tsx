import { Outlet, NavLink } from "react-router-dom";
import { StudentProvider, useStudent } from "./StudentContext";
import { MOCK_TOPICS } from "./mockData";

function StudentLayoutContent() {
    const { selectedTopicId } = useStudent();
    const selectedTopic = MOCK_TOPICS.find((t) => t.id === selectedTopicId);

    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
        }`;

    return (
        <div>
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
                    <nav className="flex items-center gap-6 overflow-x-auto">
                        <NavLink to="/student" end className={linkClass}>
                            📚 Wybór Promotora
                        </NavLink>
                        <NavLink to="/student/group" className={linkClass}>
                            👥 Moja Grupa Projektowa
                        </NavLink>
                        <NavLink to="/student/application" className={linkClass}>
                            📄 Karta Zgłoszenia
                        </NavLink>
                    </nav>

                    {selectedTopic && (
                        <div className="my-2 inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="truncate max-w-[240px]">Wybrany temat: {selectedTopic.title}</span>
                        </div>
                    )}
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default function StudentLayout() {
    return (
        <StudentProvider>
            <StudentLayoutContent />
        </StudentProvider>
    );
}