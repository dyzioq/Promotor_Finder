import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();

    const roleBtnClass = (isActive: boolean, activeColor: string) =>
        `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isActive ? `${activeColor} text-white shadow-sm` : "bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white"
        }`;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="bg-slate-900 text-white shadow-md">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center text-base">
              🎓
            </span>
                        <span>
              Promotor<span className="text-blue-400">Finder</span>
            </span>
                        <span className="hidden sm:inline-block text-xs font-normal text-slate-400 border border-slate-700 rounded px-1.5 py-0.5 ml-1">
              PolSl
            </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="hidden md:inline text-xs text-slate-400 mr-1">Widok (DEV):</span>
                        <Link to="/student" className={roleBtnClass(location.pathname.startsWith("/student"), "bg-blue-600")}>
                            Student
                        </Link>
                        <Link to="/promotor" className={roleBtnClass(location.pathname.startsWith("/promotor"), "bg-emerald-600")}>
                            Promotor
                        </Link>
                        <Link to="/admin" className={roleBtnClass(location.pathname.startsWith("/admin"), "bg-rose-600")}>
                            Admin
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
}