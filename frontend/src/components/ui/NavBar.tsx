import {NavLink} from "react-router-dom";

export function Navbar() {
    return (
        <nav className="flex gap-6 p-4 shadow bg-white border-b">
            <NavLink
                to="/dashboard"
                className={({isActive}) =>
                    isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }
            >
                Dashboard
            </NavLink>

            <NavLink
                to="/pipeline"
                className={({isActive}) =>
                    isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }
            >
                Pipeline
            </NavLink>

            <NavLink
                to="/settings"
                className={({isActive}) =>
                    isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }
            >
                Settings
            </NavLink>
        </nav>
    );
}
