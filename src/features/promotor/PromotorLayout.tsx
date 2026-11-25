import { Outlet, NavLink } from "react-router-dom";

export default function PromotorLayout() {
    return (
        <div>
            <div style={{ background: "#fff", borderBottom: "1px solid #ddd", padding: "12px 20px" }}>
                <nav style={{ display: "flex", gap: "25px", maxWidth: "1100px", margin: "0 auto" }}>
                    <NavLink to="/promotor" end style={{ textDecoration: "none", color: "#28a745", fontWeight: "bold" }}>
                        📋 Moje Tematy i Limity
                    </NavLink>
                    <NavLink to="/promotor/requests" style={{ textDecoration: "none", color: "#555" }}>
                        📩 Prośby Studentów
                    </NavLink>
                    <NavLink to="/promotor/cards" style={{ textDecoration: "none", color: "#555" }}>
                        📄 Karty Zgłoszeń
                    </NavLink>
                </nav>
            </div>
            <main>
                <Outlet />
            </main>
        </div>
    );
}