import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
// Poniższe komponenty możesz utworzyć np. w folderze src/features/
// import AdminPanel from "./features/admin/AdminPanel";
import StudentPanel from "./features/student/StudentPanel";
// import PromotorPanel from "./features/promotor/PromotorPanel";
import PromoterTopics from "./features/student/PromoterTopics";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Odkomentuj poniższe linie, gdy utworzysz już te pliki */}
            {/* <Route path="admin" element={<AdminPanel />} /> */}
             <Route path="student" element={<StudentPanel />} />
            {/* <Route path="promotor" element={<PromotorPanel />} /> */}
             <Route path="student/promotor/:promoterId" element={<PromoterTopics />} />
          </Route>
        </Routes>
      </BrowserRouter>

  );
}