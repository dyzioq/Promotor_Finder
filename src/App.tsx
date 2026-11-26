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

import AdminLayout from "./features/admin/AdminLayout";
import AdminStages from "./features/admin/AdminStages";
import AdminAllocation from "./features/admin/AdminAllocation";

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

                    {/* Ścieżki i układ Admina */}
                    <Route path="admin" element={<AdminLayout />}>
                        <Route index element={<AdminStages />} />
                        <Route path="users" element={<div className="text-slate-500">Użytkownicy i limity (w budowie)</div>} />
                        <Route path="allocation" element={<AdminAllocation />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}