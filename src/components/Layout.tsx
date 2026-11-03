import { Outlet, Link } from "react-router-dom";

export default function Layout() {
    return (
        <div>
            <nav>
                <Link to="/admin">Panel Admina</Link>
                <Link to="/student">Panel Studenta</Link>
                <Link to="promotor">Panel Promotora</Link>
            </nav>

            <main>
                {/* W tym miejscu pojawią się odpowiednie podstrony */}
                <Outlet />
            </main>
        </div>
    );
}