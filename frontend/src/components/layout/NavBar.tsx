import {NavLink, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";

export function Navbar() {
    const navigate = useNavigate();
    const auth = useAuth();

    function handleLogout() {
        auth.logout();
        navigate("/login");
    }

    return (
        <nav
            className="flex justify-between px-8 h-14 items-center border-b
                       bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        >
            {/* Left side navigation */}
            <div className="flex gap-8">
                <NavLink
                    to="/dashboard"
                    className={({isActive}) =>
                        `pb-1 transition-colors ${
                            isActive
                                ? "font-semibold border-b-2 border-white text-white"
                                : "text-white/80 hover:text-white"
                        }`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/pipeline"
                    className={({isActive}) =>
                        `pb-1 transition-colors ${
                            isActive
                                ? "font-semibold border-b-2 border-white text-white"
                                : "text-white/80 hover:text-white"
                        }`
                    }
                >
                    Pipeline
                </NavLink>
            </div>

            {/* Right side logout */}
            <button
                onClick={handleLogout}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
                Logout
            </button>
        </nav>
    );
}
