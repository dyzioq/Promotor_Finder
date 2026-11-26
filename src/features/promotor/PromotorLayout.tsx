import { Outlet, NavLink } from "react-router-dom";
import { CURRENT_PROMOTER } from "./mockData";

export default function PromotorLayout() {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            isActive
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
        }`;

    return (
        <div>
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
                    <nav className="flex items-center gap-6 overflow-x-auto">
                        <NavLink to="/promotor" end className={linkClass}>
                            📋 Moje Tematy i Limity
                        </NavLink>
                        <NavLink to="/promotor/requests" className={linkClass}>
                            📩 Prośby Studentów
                        </NavLink>
                        <NavLink to="/promotor/cards" className={linkClass}>
                            📄 Karty Zgłoszeń
                        </NavLink>
                    </nav>

                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>
              {CURRENT_PROMOTER.degree} <strong className="text-slate-700">{CURRENT_PROMOTER.name}</strong>
            </span>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}