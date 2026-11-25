import { Outlet, NavLink } from "react-router-dom";

export default function StudentLayout() {
    const linkStyle = ({ isActive }: { isActive: boolean }) => ({
        textDecoration: "none",
        color: isActive ? "#0056b3" : "#555",
        fontWeight: isActive ? "bold" : "normal",
        borderBottom: isActive ? "2px solid #0056b3" : "none",
        paddingBottom: "5px",
    });

    return (
        <div>
            {/* Podmenu tylko dla Studenta */}
            <div style={{ background: "#fff", borderBottom: "1px solid #ddd", padding: "12px 20px" }}>
                <nav style={{ display: "flex", gap: "25px", maxWidth: "1100px", margin: "0 auto" }}>
                    <NavLink to="/student" end style={linkStyle}>
                        📚 Wybór Promotora
                    </NavLink>
                    <NavLink to="/student/group" style={linkStyle}>
                        👥 Moja Grupa Projektowa
                    </NavLink>
                    <NavLink to="/student/application" style={linkStyle}>
                        📄 Karta Zgłoszenia
                    </NavLink>
                </nav>
            </div>

            {/* Tutaj renderują się podstrony studenta */}
            <main>
                <Outlet />
            </main>
        </div>
    );
}