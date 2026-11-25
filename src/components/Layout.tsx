import { Outlet, Link, useLocation } from "react-router-dom";

export default function Layout() {
    const location = useLocation();

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#fcfcfc" }}>
            {/* Górny pasek systemowy / Przełącznik ról (DEV) */}
            <header style={{ padding: "10px 20px", background: "#1e293b", color: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1100px", margin: "0 auto" }}>
                    <span style={{ fontWeight: "bold", fontSize: "18px" }}>🎓 Promotor Finder (PolSl)</span>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px" }}>
                        <span style={{ color: "#94a3b8" }}>Widok (Rola):</span>
                        <Link
                            to="/student"
                            style={{
                                padding: "4px 10px",
                                borderRadius: "4px",
                                background: location.pathname.startsWith("/student") ? "#3b82f6" : "#334155",
                                color: "#fff",
                                textDecoration: "none",
                            }}
                        >
                            Student
                        </Link>
                        <Link
                            to="/promotor"
                            style={{
                                padding: "4px 10px",
                                borderRadius: "4px",
                                background: location.pathname.startsWith("/promotor") ? "#10b981" : "#334155",
                                color: "#fff",
                                textDecoration: "none",
                            }}
                        >
                            Promotor
                        </Link>
                        <Link
                            to="/admin"
                            style={{
                                padding: "4px 10px",
                                borderRadius: "4px",
                                background: location.pathname.startsWith("/admin") ? "#ef4444" : "#334155",
                                color: "#fff",
                                textDecoration: "none",
                            }}
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </header>

            {/* Miejsce na załadowanie StudentLayout, PromotorLayout lub AdminLayout */}
            <Outlet />
        </div>
    );
}