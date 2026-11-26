import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import StudentLayout from "./features/student/StudentLayout";
import StudentPanel from "./features/student/StudentPanel";
import PromoterTopics from "./features/student/PromoterTopics";
import StudentGroup from "./features/student/StudentGroup";
import StudentApplicationCard from "./features/student/StudentApplicationCard";

import PromotorLayout from "./features/promotor/PromotorLayout";
import PromotorTopics from "./features/promotor/PromotorTopics";
import PromotorRequests from "./features/promotor/PromotorRequests";
import PromotorCards from "./features/promotor/PromotorCards";

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
                        <Route index element={<PromotorTopics />} />
                        <Route path="requests" element={<PromotorRequests />} />
                        <Route path="cards" element={<PromotorCards />} />
                    </Route>

                    {/* Ścieżka Admina */}
                    <Route path="admin" element={<div className="max-w-6xl mx-auto p-6 text-slate-500">Panel Administratora (w budowie)</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}