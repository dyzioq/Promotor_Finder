import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            isActive
                ? "border-rose-600 text-rose-700"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
        }`;

    return (
        <div>
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
                    <nav className="flex items-center gap-6 overflow-x-auto">
                        <NavLink to="/admin" end className={linkClass}>
                            ⚙️ Harmonogram i Etapy
                        </NavLink>
                        <NavLink to="/admin/users" className={linkClass}>
                            👥 Użytkownicy i Limity
                        </NavLink>
                        <NavLink to="/admin/allocation" className={linkClass}>
                            🏆 Konkurs Średnich
                        </NavLink>
                    </nav>

                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span>
              Panel Dziekanatu / <strong className="text-slate-700">Administrator</strong>
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