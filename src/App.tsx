import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import StudentLayout from "./features/student/StudentLayout";
import StudentPanel from "./features/student/StudentPanel";
import PromoterTopics from "./features/student/PromoterTopics";
import StudentGroup from "./features/student/StudentGroup";
import StudentApplicationCard from "./features/student/StudentApplicationCard";
import PromotorLayout from "./features/promotor/PromotorLayout";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to="/student" replace />} />

                    {/* Ścieżki i układ Studenta */}
                    <Route path="student" element={<StudentLayout />}>
                        <Route index element={<StudentPanel />} />
                        <Route path="promotor/:promoterId" element={<PromoterTopics />} />
                        <Route path="group" element={<StudentGroup />} />
                        <Route path="application" element={<StudentApplicationCard />} />
                    </Route>

                    {/* Ścieżki i układ Promotora */}
                    <Route path="promotor" element={<PromotorLayout />}>
                        <Route index element={<div style={{ padding: "20px" }}>Panel Promotora – Zarządzanie tematami (w budowie)</div>} />
                        <Route path="requests" element={<div style={{ padding: "20px" }}>Prośby od studentów (w budowie)</div>} />
                        <Route path="cards" element={<div style={{ padding: "20px" }}>Karty zgłoszeń do zatwierdzenia (w budowie)</div>} />
                    </Route>

                    {/* Ścieżka Admina */}
                    <Route path="admin" element={<div style={{ padding: "20px" }}>Panel Administratora (w budowie)</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}